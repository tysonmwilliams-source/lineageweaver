import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CHARGE_CATEGORIES,
  CHARGES,
  getChargesByCategory,
  getChargeCounts,
  CHARGES_TOTAL
} from '../data/unifiedChargesLibrary';
import { getTincturesByType, getTinctureColor } from '../data/tinctures';
import ExternalChargeRenderer from '../components/heraldry/ExternalChargeRenderer';
import Navigation from '../components/Navigation';
import Icon from '../components/icons/Icon';
import ActionButton from '../components/shared/ActionButton';
import './ChargesLibrary.css';

/**
 * ChargesLibrary Page
 *
 * Browseable library of all heraldic charges (symbols).
 * Users can explore charges by category, search, and preview with different tinctures.
 *
 * PERFORMANCE: Uses intersection observer for lazy loading charge previews.
 * Only charges visible in the viewport are rendered.
 */

// Animation variants
const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const CARD_VARIANTS = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

// Category icons mapping
const CATEGORY_ICONS = {
  beasts: 'dog',
  birds: 'bird',
  mythical: 'sparkles',
  fish: 'fish',
  insects: 'bug',
  plants: 'flower-2',
  weapons: 'swords',
  objects: 'package',
  celestial: 'sun',
  geometric: 'shapes',
  crosses: 'cross',
  human: 'user'
};

// Lazy loading charge card
function LazyChargeCard({ charge, isSelected, onClick, categoryIcon }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <motion.button
      ref={cardRef}
      className={`charges-card ${isSelected ? 'charges-card--selected' : ''}`}
      onClick={() => onClick(charge)}
      variants={CARD_VARIANTS}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="charges-card__icon">
        {isVisible ? (
          <ExternalChargeRenderer
            chargeId={charge.id}
            tincture="#4a4a4a"
            size={64}
            showOutline={true}
          />
        ) : (
          <div className="charges-card__placeholder" />
        )}
      </div>
      <span className="charges-card__name">{charge.name}</span>
      <span className="charges-card__badge">
        <Icon name={categoryIcon} size={12} />
      </span>
    </motion.button>
  );
}

function ChargesLibrary() {
  const navigate = useNavigate();

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCharge, setSelectedCharge] = useState(null);
  const [previewTincture, setPreviewTincture] = useState('sable');

  // Get charge counts
  const chargeCounts = useMemo(() => getChargeCounts(), []);

  // Filter charges
  const filteredCharges = useMemo(() => {
    let charges;

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

  // Tinctures for preview
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

      <div className="charges-page">
        <motion.div
          className="charges-container"
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.header className="charges-hero" variants={ITEM_VARIANTS}>
            <h1 className="charges-hero__title">
              <span className="charges-hero__initial">C</span>harges Library
            </h1>
            <p className="charges-hero__subtitle">
              {CHARGES_TOTAL} Symbols and Emblems of Heraldry
            </p>
            <div className="charges-hero__divider">
              <Icon name="shield" size={20} className="charges-hero__divider-icon" />
            </div>
          </motion.header>

          {/* Search & Filters */}
          <motion.div className="charges-controls" variants={ITEM_VARIANTS}>
            <div className="charges-controls__search">
              <Icon name="search" size={18} className="charges-controls__search-icon" />
              <input
                type="text"
                className="charges-controls__input"
                placeholder="Search charges by name, description, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="charges-controls__clear"
                  onClick={() => setSearchTerm('')}
                >
                  <Icon name="x" size={16} />
                </button>
              )}
            </div>

            <div className="charges-filters">
              <button
                className={`charges-filters__btn ${selectedCategory === 'all' ? 'charges-filters__btn--active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                <Icon name="grid-3x3" size={14} />
                <span>All</span>
                <span className="charges-filters__count">{CHARGES_TOTAL}</span>
              </button>

              {Object.entries(CHARGE_CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  className={`charges-filters__btn ${selectedCategory === key ? 'charges-filters__btn--active' : ''}`}
                  onClick={() => setSelectedCategory(key)}
                  title={cat.description}
                >
                  <Icon name={CATEGORY_ICONS[key] || 'circle'} size={14} />
                  <span>{cat.name}</span>
                  <span className="charges-filters__count">{chargeCounts[key] || 0}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="charges-content">
            {/* Grid Container */}
            <motion.div className="charges-grid-container" variants={ITEM_VARIANTS}>
              <p className="charges-grid__results">
                <Icon name="info" size={14} />
                <span>
                  {filteredCharges.length} charge{filteredCharges.length !== 1 ? 's' : ''} found
                  {searchTerm && ` for "${searchTerm}"`}
                  {selectedCategory !== 'all' && ` in ${CHARGE_CATEGORIES[selectedCategory]?.name}`}
                </span>
              </p>

              <motion.div
                className="charges-grid"
                variants={CONTAINER_VARIANTS}
              >
                {filteredCharges.map(charge => (
                  <LazyChargeCard
                    key={charge.id}
                    charge={charge}
                    isSelected={selectedCharge?.id === charge.id}
                    onClick={handleChargeClick}
                    categoryIcon={CATEGORY_ICONS[charge.category] || 'circle'}
                  />
                ))}
              </motion.div>

              {filteredCharges.length === 0 && (
                <div className="charges-empty">
                  <Icon name="search-x" size={48} className="charges-empty__icon" />
                  <p className="charges-empty__text">No charges found matching your search.</p>
                  <button
                    className="charges-empty__clear"
                    onClick={handleClearFilters}
                  >
                    <Icon name="x" size={14} />
                    <span>Clear filters</span>
                  </button>
                </div>
              )}
            </motion.div>

            {/* Detail Panel */}
            <motion.aside className="charges-detail" variants={ITEM_VARIANTS}>
              <AnimatePresence mode="wait">
                {selectedCharge ? (
                  <motion.div
                    key={selectedCharge.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="charges-detail__content"
                  >
                    <div className="charges-detail__preview">
                      <div className="charges-detail__svg">
                        <ExternalChargeRenderer
                          chargeId={selectedCharge.id}
                          tincture={getTinctureColor(previewTincture)}
                          size={120}
                          showOutline={true}
                        />
                      </div>
                    </div>

                    <h2 className="charges-detail__name">{selectedCharge.name}</h2>

                    <div className="charges-detail__meta">
                      <span className="charges-detail__category">
                        <Icon name={CATEGORY_ICONS[selectedCharge.category] || 'circle'} size={14} />
                        <span>{CHARGE_CATEGORIES[selectedCharge.category]?.name}</span>
                      </span>
                    </div>

                    <p className="charges-detail__description">{selectedCharge.description}</p>

                    <div className="charges-detail__blazon">
                      <span className="charges-detail__blazon-label">Blazon:</span>
                      <span className="charges-detail__blazon-term">{selectedCharge.blazonTerm}</span>
                    </div>

                    {/* Keywords */}
                    {selectedCharge.keywords && selectedCharge.keywords.length > 0 && (
                      <div className="charges-detail__keywords">
                        {selectedCharge.keywords.map(kw => (
                          <span key={kw} className="charges-detail__tag">{kw}</span>
                        ))}
                      </div>
                    )}

                    {/* Tincture Preview */}
                    <div className="charges-detail__tinctures">
                      <h3 className="charges-detail__tinctures-title">
                        <Icon name="palette" size={14} />
                        <span>Preview with Tincture</span>
                      </h3>
                      <div className="charges-detail__tincture-grid">
                        {allTinctures.slice(0, 12).map(tint => (
                          <button
                            key={tint.id}
                            className={`charges-detail__tincture-btn ${previewTincture === tint.id ? 'charges-detail__tincture-btn--active' : ''}`}
                            style={{ backgroundColor: getTinctureColor(tint.id) }}
                            onClick={() => setPreviewTincture(tint.id)}
                            title={tint.displayName}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="charges-detail__actions">
                      <ActionButton
                        icon="sparkles"
                        onClick={handleUseInCreator}
                        variant="primary"
                        fullWidth
                      >
                        Use in Creator
                      </ActionButton>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="charges-detail__empty"
                  >
                    <Icon name="mouse-pointer-click" size={48} className="charges-detail__empty-icon" />
                    <p>Select a charge to view details</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.aside>
          </div>

          {/* Info Section */}
          <motion.section className="charges-info" variants={ITEM_VARIANTS}>
            <h2 className="charges-info__title">
              <Icon name="book-open" size={20} />
              <span>About Heraldic Charges</span>
            </h2>

            <div className="charges-info__grid">
              <div className="charges-info__card">
                <div className="charges-info__card-icon">
                  <Icon name="dog" size={24} />
                </div>
                <h3>Beasts</h3>
                <p>Animals representing strength, courage, and noble qualities. Lions are most common, representing bravery and royalty.</p>
              </div>

              <div className="charges-info__card">
                <div className="charges-info__card-icon">
                  <Icon name="bird" size={24} />
                </div>
                <h3>Birds</h3>
                <p>Eagles symbolize power and authority. Falcons represent pursuit, while owls represent wisdom.</p>
              </div>

              <div className="charges-info__card">
                <div className="charges-info__card-icon">
                  <Icon name="sparkles" size={24} />
                </div>
                <h3>Mythical</h3>
                <p>Dragons, griffins, and unicorns add fantasy elements. Perfect for worldbuilding beyond historical accuracy.</p>
              </div>

              <div className="charges-info__card">
                <div className="charges-info__card-icon">
                  <Icon name="swords" size={24} />
                </div>
                <h3>Weapons</h3>
                <p>Swords, axes, and spears represent military prowess and martial heritage of noble houses.</p>
              </div>
            </div>

            <p className="charges-info__attribution">
              Charge artwork from{' '}
              <a href="https://heraldicart.org" target="_blank" rel="noopener noreferrer">
                Traceable Heraldic Art
              </a>{' '}
              (Public Domain)
            </p>
          </motion.section>

          {/* Footer */}
          <motion.footer className="charges-footer" variants={ITEM_VARIANTS}>
            <ActionButton
              icon="sparkles"
              onClick={() => navigate('/heraldry/create')}
              variant="primary"
              size="lg"
            >
              Create New Heraldry
            </ActionButton>

            <ActionButton
              icon="arrow-left"
              onClick={() => navigate('/heraldry')}
              variant="secondary"
              size="lg"
            >
              Back to Armory
            </ActionButton>
          </motion.footer>
        </motion.div>
      </div>
    </>
  );
}

export default ChargesLibrary;
