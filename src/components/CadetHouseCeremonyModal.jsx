import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './icons/Icon';
import ActionButton from './shared/ActionButton';
import {
  generateCadetHouseName,
  generateCadetNameSuggestions,
  extractCoreHouseName,
  CADET_SUFFIXES,
  BASTARD_PREFIX
} from '../utils/bastardNaming';
import './CadetHouseCeremonyModal.css';

/**
 * CadetHouseCeremonyModal Component
 * 
 * Two-tier cadet house founding system:
 * 
 * TIER 1 - Noble Cadet Branch:
 * - Founder: Legitimate second/third son
 * - Naming: First 4 letters of parent house + suffix
 * - Example: Wilfrey → Wilfford, Wilfmere, Wilfholt
 * - Status: Full noble standing
 * 
 * TIER 2 - Bastard Elevation Branch:
 * - Founder: Acknowledged bastard who has proven themselves
 * - Naming: "Dun" + first 4 letters of parent house + suffix
 * - Example: Dunwilfrey → House Dunwilfhollow
 * - Status: Recognized but lesser standing, bastard origins visible
 * 
 * Props:
 * - founder: The person founding the house
 * - parentHouse: The parent house they're creating a branch of
 * - onFound: Function to call when founding is completed
 * - onCancel: Function to call when user cancels
 */
function CadetHouseCeremonyModal({ founder, parentHouse, onFound, onCancel }) {
  // Determine if founder is a bastard
  const isBastardFounder = founder?.legitimacyStatus === 'bastard';
  const founderTier = isBastardFounder ? 2 : 1;
  
  // Form state
  const [formData, setFormData] = useState({
    houseName: '',
    customSuffix: '',
    motto: '',
    foundingYear: ''
  });

  const [errors, setErrors] = useState({});
  const [useCustomName, setUseCustomName] = useState(false);

  // Extract core house name (strip "House " prefix and " of Location" suffix)
  const coreHouseName = useMemo(() => {
    return extractCoreHouseName(parentHouse?.houseName || '');
  }, [parentHouse]);

  // Get the root for cadet names (first 4 letters, or whole name if shorter)
  const nameRoot = useMemo(() => {
    const root = coreHouseName.substring(0, 4).toLowerCase();
    return root.charAt(0).toUpperCase() + root.slice(1);
  }, [coreHouseName]);

  // Generate suggestions based on founder tier
  const suggestions = useMemo(() => {
    return generateCadetNameSuggestions(parentHouse?.houseName || '', isBastardFounder, 8);
  }, [parentHouse, isBastardFounder]);

  // Build the full house name based on custom suffix
  const builtHouseName = useMemo(() => {
    if (!formData.customSuffix.trim()) return '';
    return generateCadetHouseName(
      parentHouse?.houseName || '',
      formData.customSuffix,
      isBastardFounder
    );
  }, [parentHouse, formData.customSuffix, isBastardFounder]);

  // The final house name (either selected suggestion or custom built)
  const finalHouseName = useCustomName ? builtHouseName : formData.houseName;

  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Select a suggestion
   */
  const selectSuggestion = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      houseName: suggestion,
      customSuffix: ''
    }));
    setUseCustomName(false);
    if (errors.houseName) {
      setErrors(prev => ({ ...prev, houseName: '' }));
    }
  };

  /**
   * Toggle custom name mode
   */
  const toggleCustomMode = () => {
    setUseCustomName(!useCustomName);
    if (!useCustomName) {
      // Switching to custom mode - clear selected suggestion
      setFormData(prev => ({ ...prev, houseName: '' }));
    } else {
      // Switching to suggestion mode - clear custom suffix
      setFormData(prev => ({ ...prev, customSuffix: '' }));
    }
  };

  /**
   * Validate the form
   */
  const validate = () => {
    const newErrors = {};

    // House name validation
    if (!finalHouseName || !finalHouseName.trim()) {
      newErrors.houseName = 'Please select or create a house name';
    } else if (finalHouseName.length < 4) {
      newErrors.houseName = 'House name must be at least 4 characters';
    }

    // Founding year validation
    if (!formData.foundingYear) {
      newErrors.foundingYear = 'Founding year is required';
    } else if (!/^\d{4}$/.test(formData.foundingYear)) {
      newErrors.foundingYear = 'Must be a 4-digit year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onFound({
        founderId: founder.id,
        houseName: finalHouseName,
        parentHouseId: parentHouse.id,
        cadetTier: founderTier,
        foundingType: isBastardFounder ? 'bastard-elevation' : 'noble',
        ceremonyDate: `${formData.foundingYear}-01-01`,
        motto: formData.motto || null,
        colorCode: adjustColorBrightness(parentHouse.colorCode, isBastardFounder ? 30 : 40)
      });
    }
  };

  /**
   * Adjust color brightness for cadet house
   * Bastard houses get a slightly different shade
   */
  const adjustColorBrightness = (hex, percent) => {
    if (!hex) return '#666666';
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    const newR = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
    const newG = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
    const newB = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));
    
    return '#' + 
      newR.toString(16).padStart(2, '0') + 
      newG.toString(16).padStart(2, '0') + 
      newB.toString(16).padStart(2, '0');
  };

  return (
    <div className="cadet-ceremony">
      {/* Header with Tier Indicator */}
      <div className={`cadet-ceremony__header cadet-ceremony__header--tier-${founderTier}`}>
        <div className="cadet-ceremony__header-icon">
          <Icon name={isBastardFounder ? 'shield-alert' : 'shield'} size={24} />
        </div>
        <div className="cadet-ceremony__header-content">
          <h3 className="cadet-ceremony__title">
            {isBastardFounder ? 'Bastard Elevation' : 'Noble Cadet Branch'}
          </h3>
          <p className="cadet-ceremony__subtitle">
            {isBastardFounder 
              ? `Elevating ${founder.firstName} to found a recognized house`
              : `Establishing a cadet branch for ${founder.firstName}`
            }
          </p>
        </div>
        <div className="cadet-ceremony__tier-badge">
          Tier {founderTier}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="cadet-ceremony__form">
        {/* Founder & Parent Info */}
        <div className="cadet-ceremony__info-grid">
          <div className="cadet-ceremony__info-item">
            <span className="cadet-ceremony__info-label">Founder</span>
            <span className="cadet-ceremony__info-value">
              {founder.firstName} {founder.lastName}
              {isBastardFounder && (
                <span className="cadet-ceremony__bastard-tag">Bastard</span>
              )}
            </span>
          </div>
          <div className="cadet-ceremony__info-item">
            <span className="cadet-ceremony__info-label">Parent House</span>
            <span className="cadet-ceremony__info-value">{parentHouse.houseName}</span>
          </div>
        </div>

        {/* Naming Convention Explanation */}
        <div className={`cadet-ceremony__naming-info cadet-ceremony__naming-info--tier-${founderTier}`}>
          <div className="cadet-ceremony__naming-header">
            <Icon name="info" size={16} />
            <span>Naming Convention</span>
          </div>
          {isBastardFounder ? (
            <div className="cadet-ceremony__naming-content">
              <p>
                Bastard-founded houses retain the "<strong>{BASTARD_PREFIX}</strong>" prefix permanently, 
                marking their origins. Your house name will begin with:
              </p>
              <div className="cadet-ceremony__name-preview">
                <strong>{BASTARD_PREFIX}{nameRoot.toLowerCase()}</strong>-
              </div>
              <p className="cadet-ceremony__naming-note">
                This mark of origin will follow the house through generations, even as its 
                members become legitimate within the new house.
              </p>
            </div>
          ) : (
            <div className="cadet-ceremony__naming-content">
              <p>
                Noble cadet branches use the first four letters of the parent house 
                combined with a meaningful suffix. Your house name will begin with:
              </p>
              <div className="cadet-ceremony__name-preview">
                <strong>{nameRoot}</strong>-
              </div>
            </div>
          )}
        </div>

        {/* Name Selection */}
        <div className="cadet-ceremony__section">
          <div className="cadet-ceremony__section-header">
            <label className="cadet-ceremony__label">
              Choose House Name *
            </label>
            <button
              type="button"
              className="cadet-ceremony__toggle-custom"
              onClick={toggleCustomMode}
            >
              {useCustomName ? 'Use Suggestions' : 'Create Custom'}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {!useCustomName ? (
              <motion.div
                key="suggestions"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="cadet-ceremony__suggestions"
              >
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectSuggestion(suggestion)}
                    className={`cadet-ceremony__suggestion ${
                      formData.houseName === suggestion ? 'cadet-ceremony__suggestion--selected' : ''
                    }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="custom"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="cadet-ceremony__custom-input"
              >
                <div className="cadet-ceremony__custom-prefix">
                  {isBastardFounder ? `${BASTARD_PREFIX}${nameRoot.toLowerCase()}` : nameRoot}
                </div>
                <input
                  type="text"
                  name="customSuffix"
                  value={formData.customSuffix}
                  onChange={handleChange}
                  placeholder="Enter suffix..."
                  className="cadet-ceremony__input"
                />
                {builtHouseName && (
                  <div className="cadet-ceremony__custom-result">
                    = <strong>{builtHouseName}</strong>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Suffix Suggestions */}
          {useCustomName && (
            <div className="cadet-ceremony__suffix-hints">
              <span className="cadet-ceremony__suffix-label">Common suffixes:</span>
              {CADET_SUFFIXES.slice(0, 8).map((suffix, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="cadet-ceremony__suffix-btn"
                  onClick={() => setFormData(prev => ({ ...prev, customSuffix: suffix }))}
                >
                  -{suffix}
                </button>
              ))}
            </div>
          )}

          {errors.houseName && (
            <span className="cadet-ceremony__error">
              <Icon name="alert-circle" size={12} />
              {errors.houseName}
            </span>
          )}
        </div>

        {/* Founding Year */}
        <div className="cadet-ceremony__section">
          <label htmlFor="foundingYear" className="cadet-ceremony__label">
            Founding Year *
          </label>
          <input
            type="text"
            id="foundingYear"
            name="foundingYear"
            value={formData.foundingYear}
            onChange={handleChange}
            placeholder="e.g., 1245"
            className={`cadet-ceremony__input cadet-ceremony__input--full ${
              errors.foundingYear ? 'cadet-ceremony__input--error' : ''
            }`}
          />
          {errors.foundingYear && (
            <span className="cadet-ceremony__error">
              <Icon name="alert-circle" size={12} />
              {errors.foundingYear}
            </span>
          )}
        </div>

        {/* Motto */}
        <div className="cadet-ceremony__section">
          <label htmlFor="motto" className="cadet-ceremony__label">
            House Motto <span className="cadet-ceremony__optional">(optional)</span>
          </label>
          <input
            type="text"
            id="motto"
            name="motto"
            value={formData.motto}
            onChange={handleChange}
            placeholder="e.g., Through Adversity, Strength"
            className="cadet-ceremony__input cadet-ceremony__input--full"
          />
        </div>

        {/* Preview */}
        <AnimatePresence>
          {finalHouseName && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="cadet-ceremony__preview"
            >
              <div className="cadet-ceremony__preview-header">
                <Icon name="eye" size={14} />
                Preview
              </div>
              <div className="cadet-ceremony__preview-content">
                <div 
                  className="cadet-ceremony__preview-color"
                  style={{ 
                    backgroundColor: adjustColorBrightness(
                      parentHouse.colorCode, 
                      isBastardFounder ? 30 : 40
                    ) 
                  }}
                />
                <div className="cadet-ceremony__preview-details">
                  <div className="cadet-ceremony__preview-name">
                    House {finalHouseName}
                  </div>
                  <div className="cadet-ceremony__preview-meta">
                    <span>
                      {isBastardFounder ? 'Bastard elevation' : 'Cadet branch'} of {parentHouse.houseName}
                    </span>
                    {formData.foundingYear && (
                      <span> • Founded {formData.foundingYear}</span>
                    )}
                  </div>
                  {formData.motto && (
                    <div className="cadet-ceremony__preview-motto">
                      "{formData.motto}"
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="cadet-ceremony__actions">
          <ActionButton
            type="button"
            variant="ghost"
            onClick={onCancel}
          >
            Cancel
          </ActionButton>
          <ActionButton
            type="submit"
            variant="primary"
            icon="flag"
          >
            Found House
          </ActionButton>
        </div>
      </form>
    </div>
  );
}

export default CadetHouseCeremonyModal;
