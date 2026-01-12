/**
 * HeraldryPickerModal.jsx
 * 
 * A reusable modal for selecting existing heraldry to link to an entity
 * (house, person, location, event). Used in HouseForm, PersonForm, etc.
 * 
 * PHASE 5: Deep Integration - Batch 1
 * 
 * Features:
 * - Search by name, blazon, tags
 * - Filter by category
 * - Preview on selection
 * - Shows which entities already use each heraldry
 * - Supports future person heraldry (Phase 4 hooks)
 * - Uses CSS custom properties for theming
 * 
 * Props:
 * - isOpen: Boolean to control visibility
 * - onClose: Function to close modal
 * - onSelect: Function called with selected heraldry when confirmed
 * - entityType: 'house' | 'person' | 'location' | 'event' (for context display)
 * - entityName: Name of entity being linked (for display)
 * - excludeHeraldryId: Optional ID to exclude from list (e.g., current heraldry)
 */

import React, { useState, useEffect, useMemo } from 'react';
import { getAllHeraldry, getHeraldryLinks } from '../../services/heraldryService';
import { db } from '../../services/database';
import './HeraldryPickerModal.css';

function HeraldryPickerModal({
  isOpen,
  onClose,
  onSelect,
  entityType = 'house',
  entityName = '',
  excludeHeraldryId = null
}) {
  // ==================== STATE ====================
  const [allHeraldry, setAllHeraldry] = useState([]);
  const [heraldryLinks, setHeraldryLinks] = useState([]);
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedHeraldry, setSelectedHeraldry] = useState(null);

  // ==================== DATA LOADING ====================
  useEffect(() => {
    if (isOpen) {
      loadData();
      // Reset selection when opening
      setSelectedHeraldry(null);
      setSearchTerm('');
      setCategoryFilter('all');
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load all heraldry
      const heraldryData = await getAllHeraldry();
      setAllHeraldry(heraldryData);
      
      // Load all links to show which entities use which heraldry
      const links = await db.heraldryLinks.toArray();
      setHeraldryLinks(links);
      
      // Load houses for displaying linked house names
      const housesData = await db.houses.toArray();
      setHouses(housesData);
      
    } catch (error) {
      console.error('Error loading heraldry data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ==================== FILTERING ====================
  const categories = useMemo(() => {
    const cats = new Set(allHeraldry.map(h => h.category || 'uncategorized'));
    return ['all', ...Array.from(cats).sort()];
  }, [allHeraldry]);

  const filteredHeraldry = useMemo(() => {
    let results = allHeraldry;
    
    // Exclude specified heraldry (e.g., already linked)
    if (excludeHeraldryId) {
      results = results.filter(h => h.id !== excludeHeraldryId);
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      results = results.filter(h => (h.category || 'uncategorized') === categoryFilter);
    }
    
    // Apply search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      results = results.filter(h => {
        if (h.name?.toLowerCase().includes(term)) return true;
        if (h.blazon?.toLowerCase().includes(term)) return true;
        if (h.description?.toLowerCase().includes(term)) return true;
        if (h.tags?.some(tag => tag.toLowerCase().includes(term))) return true;
        return false;
      });
    }
    
    // Sort by name
    results.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    
    return results;
  }, [allHeraldry, excludeHeraldryId, categoryFilter, searchTerm]);

  // ==================== HELPERS ====================
  
  // Get linked entities for a heraldry item
  const getLinkedEntities = (heraldryId) => {
    const links = heraldryLinks.filter(l => l.heraldryId === heraldryId);
    
    return links.map(link => {
      if (link.entityType === 'house') {
        const house = houses.find(h => h.id === link.entityId);
        return {
          type: 'house',
          name: house?.houseName || 'Unknown House',
          linkType: link.linkType
        };
      }
      // Future: handle person, location, event
      return {
        type: link.entityType,
        name: `${link.entityType} #${link.entityId}`,
        linkType: link.linkType
      };
    });
  };

  // Get display image for heraldry
  const getHeraldryImage = (heraldry) => {
    return heraldry.heraldryDisplay || 
           heraldry.heraldryThumbnail || 
           heraldry.heraldryImageData || 
           null;
  };

  // ==================== HANDLERS ====================
  const handleSelect = (heraldry) => {
    setSelectedHeraldry(heraldry);
  };

  const handleConfirm = () => {
    if (selectedHeraldry && onSelect) {
      onSelect(selectedHeraldry);
    }
    onClose();
  };

  // ==================== RENDER ====================
  if (!isOpen) return null;

  return (
    <div className="heraldry-picker-overlay" onClick={onClose}>
      <div className="heraldry-picker-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="picker-header">
          <div className="picker-header-row">
            <div>
              <h2 className="picker-title">🛡️ Select Heraldry</h2>
              {entityName && (
                <p className="picker-subtitle">Linking to: {entityName}</p>
              )}
            </div>
            <button className="picker-close-btn" onClick={onClose} title="Close">
              ✕
            </button>
          </div>

          {/* Search and Filter */}
          <div className="picker-controls">
            <input
              type="text"
              className="picker-search"
              placeholder="Search by name, blazon, tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="picker-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="picker-content">
          {/* Heraldry List */}
          <div className={`picker-list ${selectedHeraldry ? 'has-selection' : ''}`}>
            {loading ? (
              <div className="picker-loading">
                <div className="picker-loading-icon">⏳</div>
                Loading heraldry...
              </div>
            ) : filteredHeraldry.length === 0 ? (
              <div className="picker-empty">
                <div className="picker-empty-icon">🔍</div>
                {searchTerm || categoryFilter !== 'all' 
                  ? 'No heraldry matches your search'
                  : 'No heraldry available'}
              </div>
            ) : (
              <div className="picker-grid">
                {filteredHeraldry.map(heraldry => {
                  const isSelected = selectedHeraldry?.id === heraldry.id;
                  const linkedEntities = getLinkedEntities(heraldry.id);
                  const image = getHeraldryImage(heraldry);
                  
                  return (
                    <div
                      key={heraldry.id}
                      className={`picker-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelect(heraldry)}
                    >
                      {/* Thumbnail */}
                      <div className="picker-item-thumb">
                        {image ? (
                          <img src={image} alt={heraldry.name} />
                        ) : (
                          <span className="picker-item-thumb-placeholder">🛡️</span>
                        )}
                      </div>
                      
                      {/* Name */}
                      <div className="picker-item-name">
                        {heraldry.name || 'Untitled Arms'}
                      </div>
                      
                      {/* Linked indicator */}
                      {linkedEntities.length > 0 && (
                        <div className="picker-item-linked">
                          🔗 {linkedEntities.length} linked
                        </div>
                      )}
                      
                      {/* Selection indicator */}
                      {isSelected && (
                        <div className="picker-item-selected-badge">
                          ✓ Selected
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Preview Panel (shows when selected) */}
          {selectedHeraldry && (
            <div className="picker-preview">
              <h3 className="picker-preview-title">Preview</h3>
              
              {/* Large preview image */}
              <div className="picker-preview-image">
                {selectedHeraldry.heraldryHighRes || selectedHeraldry.heraldryDisplay ? (
                  <img 
                    src={selectedHeraldry.heraldryHighRes || selectedHeraldry.heraldryDisplay}
                    alt={selectedHeraldry.name}
                  />
                ) : selectedHeraldry.heraldrySVG ? (
                  <div 
                    className="svg-container"
                    dangerouslySetInnerHTML={{ __html: selectedHeraldry.heraldrySVG }}
                  />
                ) : (
                  <span className="picker-preview-placeholder">🛡️</span>
                )}
              </div>
              
              {/* Details */}
              <div className="picker-preview-name">
                {selectedHeraldry.name || 'Untitled Arms'}
              </div>
              {selectedHeraldry.category && (
                <div className="picker-preview-category">
                  {selectedHeraldry.category}
                </div>
              )}
              
              {/* Blazon */}
              {selectedHeraldry.blazon && (
                <div className="picker-preview-blazon">
                  <div className="picker-preview-blazon-label">BLAZON</div>
                  <div className="picker-preview-blazon-text">
                    {selectedHeraldry.blazon}
                  </div>
                </div>
              )}
              
              {/* Linked entities */}
              {(() => {
                const linked = getLinkedEntities(selectedHeraldry.id);
                if (linked.length === 0) return null;
                
                return (
                  <div className="picker-preview-linked">
                    <div className="picker-preview-linked-label">CURRENTLY LINKED TO</div>
                    {linked.map((entity, idx) => (
                      <div key={idx} className="picker-preview-linked-item">
                        <span>{entity.type === 'house' ? '🏰' : '📍'}</span>
                        <span>{entity.name}</span>
                        {entity.linkType !== 'primary' && (
                          <span className="picker-preview-linked-badge">
                            {entity.linkType}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}
              
              {/* Shield type */}
              {selectedHeraldry.shieldType && (
                <div className="picker-preview-shield">
                  Shield: {selectedHeraldry.shieldType.charAt(0).toUpperCase() + selectedHeraldry.shieldType.slice(1)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="picker-footer">
          <div className="picker-count">
            {filteredHeraldry.length} heraldic device{filteredHeraldry.length !== 1 ? 's' : ''} available
          </div>
          
          <div className="picker-actions">
            <button className="picker-btn picker-btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              className="picker-btn picker-btn-confirm"
              onClick={handleConfirm}
              disabled={!selectedHeraldry}
            >
              🔗 Link Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeraldryPickerModal;
