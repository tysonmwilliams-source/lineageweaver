import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CHARGE_CATEGORIES, 
  CHARGES,
  getChargesByCategory,
  searchCharges,
  getChargeCounts,
  CHARGES_TOTAL 
} from '../data/unifiedChargesLibrary';
import { getTincturesByType, getTinctureColor } from '../data/tinctures';
import ExternalChargeRenderer from '../components/heraldry/ExternalChargeRenderer';
import Navigation from '../components/Navigation';
import './ChargesLibrary.css';

/**
 * ChargesLibrary Page
 * 
 * Browseable library of all heraldic charges (symbols).
 * Users can explore charges by category, search, and preview with different tinctures.
 * 
 * This page uses the unified charges library which references SVG files
 * in /public/heraldic-charges/. The ExternalChargeRenderer component handles
 * fetching and rendering these SVGs with proper tincture coloring.
 * 
 * PERFORMANCE: Uses intersection observer for lazy loading charge previews.
 * Only charges visible in the viewport are rendered, preventing hundreds
 * of simultaneous SVG fetches.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// LAZY LOADING CHARGE CARD
// Only renders the SVG when visible in viewport
// ═══════════════════════════════════════════════════════════════════════════════

function LazyChargeCard({ charge, isSelected, onClick, categoryIcon }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  
  // Intersection observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Once visible, stay visible (don't unload)
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px', // Start loading slightly before visible
        threshold: 0.1
      }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <button
      ref={cardRef}
      className={`charge-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(charge)}
    >
      <div className="charge-icon">
        {isVisible ? (
          <ExternalChargeRenderer
            chargeId={charge.id}
            tincture="#4a4a4a"
            size={64}
            showOutline={true}
          />
        ) : (
          <div className="charge-placeholder" />
        )}
      </div>
      <span className="charge-name">{charge.name}</span>
      <span className="charge-category-badge">{categoryIcon}</span>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function ChargesLibrary() {
  const navigate = useNavigate();
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCharge, setSelectedCharge] = useState(null);
  const [previewTincture, setPreviewTincture] = useState('sable');
  
  // Get charge counts for category badges
  const chargeCounts = useMemo(() => getChargeCounts(), []);
  
  // Filter charges - include id from the object key
  const filteredCharges = useMemo(() => {
    let charges;
    
    // Get charges based on category filter
    if (selectedCategory === 'all') {
      charges = Object.entries(CHARGES).map(([id, charge]) => ({
        id,
        ...charge
      }));
    } else {
      const categoryCharges = getChargesByCategory(selectedCategory);
      charges = Object.entries(categoryCharges).map(([id, charge]) => ({
        id,
        ...charge
      }));
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      charges = charges.filter(c =>
        c.name.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term) ||
        c.blazonTerm.toLowerCase().includes(term) ||
        c.keywords.some(kw => kw.toLowerCase().includes(term))
      );
    }
    
    return charges;
  }, [selectedCategory, searchTerm]);
  
  // Tinctures for preview selector
  const allTinctures = useMemo(() => {
    const byType = getTincturesByType(true);
    return Object.values(byType).flat();
  }, []);
  
  // Handlers
  const handleChargeClick = useCallback((charge) => {
    setSelectedCharge(charge);
  }, []);
  
  const handleUseInCreator = useCallback(() => {
    navigate('/heraldry/create');
  }, [navigate]);
  
  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('all');
  }, []);
  
  return (
    <>
      <Navigation />
      <div className="charges-library">
        
        {/* Header */}
        <header className="library-header">
          <h1 className="library-title">CHARGES LIBRARY</h1>
          <p className="library-subtitle">
            {CHARGES_TOTAL} Symbols and Emblems of Heraldry
          </p>
        </header>
        
        {/* Controls */}
        <div className="library-controls">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search charges by name, description, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div className="category-filters">
            <button
              className={`category-filter ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All ({CHARGES_TOTAL})
            </button>
            {Object.entries(CHARGE_CATEGORIES).map(([key, cat]) => (
              <button
                key={key}
                className={`category-filter ${selectedCategory === key ? 'active' : ''}`}
                onClick={() => setSelectedCategory(key)}
                title={cat.description}
              >
                {cat.icon} {cat.name} ({chargeCounts[key] || 0})
              </button>
            ))}
          </div>
        </div>
        
        {/* Main Content */}
        <div className="library-content">
          
          {/* Charges Grid */}
          <div className="charges-grid-container">
            <p className="results-count">
              {filteredCharges.length} charge{filteredCharges.length !== 1 ? 's' : ''} found
              {searchTerm && ` for "${searchTerm}"`}
              {selectedCategory !== 'all' && ` in ${CHARGE_CATEGORIES[selectedCategory]?.name}`}
            </p>
            
            <div className="charges-grid">
              {filteredCharges.map(charge => (
                <LazyChargeCard
                  key={charge.id}
                  charge={charge}
                  isSelected={selectedCharge?.id === charge.id}
                  onClick={handleChargeClick}
                  categoryIcon={CHARGE_CATEGORIES[charge.category]?.icon}
                />
              ))}
            </div>
            
            {filteredCharges.length === 0 && (
              <div className="no-results">
                <span className="no-results-icon">🔍</span>
                <p>No charges found matching your search.</p>
                <button 
                  className="clear-search"
                  onClick={handleClearFilters}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
          
          {/* Detail Panel */}
          <div className="charge-detail-panel">
            {selectedCharge ? (
              <>
                <div className="detail-preview">
                  <div className="detail-charge-svg">
                    <ExternalChargeRenderer
                      chargeId={selectedCharge.id}
                      tincture={getTinctureColor(previewTincture)}
                      size={120}
                      showOutline={true}
                    />
                  </div>
                </div>
                
                <h2 className="detail-name">{selectedCharge.name}</h2>
                
                <div className="detail-meta">
                  <span className="meta-category">
                    {CHARGE_CATEGORIES[selectedCharge.category]?.icon} {CHARGE_CATEGORIES[selectedCharge.category]?.name}
                  </span>
                </div>
                
                <p className="detail-description">{selectedCharge.description}</p>
                
                <div className="detail-blazon">
                  <span className="blazon-label">Blazon:</span>
                  <span className="blazon-term">{selectedCharge.blazonTerm}</span>
                </div>
                
                {/* Keywords */}
                {selectedCharge.keywords && selectedCharge.keywords.length > 0 && (
                  <div className="detail-keywords">
                    {selectedCharge.keywords.map(kw => (
                      <span key={kw} className="keyword-tag">{kw}</span>
                    ))}
                  </div>
                )}
                
                {/* Tincture Preview */}
                <div className="tincture-preview">
                  <h3>Preview with Tincture</h3>
                  <div className="tincture-options">
                    {allTinctures.slice(0, 12).map(tint => (
                      <button
                        key={tint.id}
                        className={`tincture-btn ${previewTincture === tint.id ? 'active' : ''}`}
                        style={{ backgroundColor: getTinctureColor(tint.id) }}
                        onClick={() => setPreviewTincture(tint.id)}
                        title={tint.displayName}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="detail-actions">
                  <button 
                    className="use-button"
                    onClick={handleUseInCreator}
                  >
                    ✨ Use in Creator
                  </button>
                </div>
              </>
            ) : (
              <div className="no-selection">
                <span className="no-selection-icon">👆</span>
                <p>Select a charge to view details</p>
              </div>
            )}
          </div>
          
        </div>
        
        {/* Info Section */}
        <section className="library-info">
          <h2>About Heraldic Charges</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>🦁 Beasts</h3>
              <p>Animals representing strength, courage, and noble qualities. Lions are most common, representing bravery and royalty.</p>
            </div>
            <div className="info-card">
              <h3>🦅 Birds</h3>
              <p>Eagles symbolize power and authority. Falcons represent pursuit, while owls represent wisdom.</p>
            </div>
            <div className="info-card">
              <h3>🐉 Mythical</h3>
              <p>Dragons, griffins, and unicorns add fantasy elements. Perfect for worldbuilding beyond historical accuracy.</p>
            </div>
            <div className="info-card">
              <h3>⚔️ Weapons</h3>
              <p>Swords, axes, and spears represent military prowess and martial heritage of noble houses.</p>
            </div>
          </div>
          <p className="info-attribution">
            Charge artwork from <a href="https://heraldicart.org" target="_blank" rel="noopener noreferrer">Traceable Heraldic Art</a> (Public Domain)
          </p>
        </section>
        
        {/* Action Footer */}
        <footer className="library-footer">
          <button 
            className="footer-button primary"
            onClick={() => navigate('/heraldry/create')}
          >
            ✨ Create New Heraldry
          </button>
          <button 
            className="footer-button secondary"
            onClick={() => navigate('/heraldry')}
          >
            ← Back to Armory
          </button>
        </footer>
        
      </div>
    </>
  );
}

export default ChargesLibrary;
