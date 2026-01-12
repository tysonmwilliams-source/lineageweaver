/**
 * HouseForm.jsx - ENHANCED WITH HERALDRY INTEGRATION
 * 
 * PHASE 5: Deep Integration - Batch 1
 * 
 * A form for adding or editing a house/family, now with integrated
 * heraldry management section.
 * 
 * HERALDRY FEATURES:
 * - Display current linked heraldry with thumbnail
 * - "Create New" → opens HeraldryCreator with house pre-selected
 * - "Link Existing" → opens HeraldryPickerModal
 * - "View/Edit" → navigates to HeraldryCreator in edit mode
 * - "Remove" → unlinks heraldry (doesn't delete)
 * 
 * Uses CSS custom properties for theming consistency.
 * 
 * Props:
 * - house: Existing house data (for editing) or null (for new house)
 * - onSave: Function to call when form is submitted
 * - onCancel: Function to call when user cancels
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeraldryPickerModal from './heraldry/HeraldryPickerModal';
import { 
  getHeraldry, 
  linkHeraldryToEntity, 
  unlinkHeraldry,
  getHeraldryLinks 
} from '../services/heraldryService';
import './HouseForm.css';

function HouseForm({ 
  house = null, 
  onSave, 
  onCancel
}) {
  const navigate = useNavigate();
  
  // ==================== FORM STATE ====================
  const [formData, setFormData] = useState({
    houseName: house?.houseName || '',
    sigil: house?.sigil || '',
    sigilImage: house?.sigilImage || null,
    motto: house?.motto || '',
    foundedDate: house?.foundedDate || '',
    colorCode: house?.colorCode || '#3b82f6',
    notes: house?.notes || '',
    // Heraldry reference
    heraldryId: house?.heraldryId || null
  });
  
  // ==================== HERALDRY STATE ====================
  const [linkedHeraldry, setLinkedHeraldry] = useState(null);
  const [loadingHeraldry, setLoadingHeraldry] = useState(false);
  const [showHeraldryPicker, setShowHeraldryPicker] = useState(false);
  const [heraldryLinkId, setHeraldryLinkId] = useState(null);
  
  // ==================== VALIDATION STATE ====================
  const [errors, setErrors] = useState({});

  // ==================== LOAD HERALDRY ====================
  useEffect(() => {
    if (house?.heraldryId) {
      loadLinkedHeraldry(house.heraldryId);
    }
  }, [house?.heraldryId]);

  const loadLinkedHeraldry = async (heraldryId) => {
    try {
      setLoadingHeraldry(true);
      const heraldry = await getHeraldry(heraldryId);
      setLinkedHeraldry(heraldry);
      
      // Also get the link ID for potential unlinking
      if (house?.id) {
        const links = await getHeraldryLinks(heraldryId);
        const houseLink = links.find(l => 
          l.entityType === 'house' && 
          l.entityId === house.id
        );
        setHeraldryLinkId(houseLink?.id || null);
      }
    } catch (error) {
      console.error('Error loading heraldry:', error);
    } finally {
      setLoadingHeraldry(false);
    }
  };

  // ==================== HANDLERS ====================
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.houseName.trim()) {
      newErrors.houseName = 'House name is required';
    }

    if (formData.foundedDate && !/^\d{4}$/.test(formData.foundedDate)) {
      newErrors.foundedDate = 'Founded date must be a 4-digit year (e.g., 1120)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      const houseData = house?.id 
        ? { ...formData, id: house.id }
        : formData;
      
      onSave(houseData);
    }
  };

  // ==================== HERALDRY HANDLERS ====================

  const handleCreateHeraldry = () => {
    // Navigate to heraldry creator with house pre-selected
    if (house?.id) {
      navigate(`/heraldry/create?houseId=${house.id}&houseName=${encodeURIComponent(house.houseName)}`);
    } else {
      // For new houses, we need to save first
      alert('Please save the house first, then you can create heraldry for it.');
    }
  };

  const handleLinkHeraldry = (selectedHeraldry) => {
    if (!house?.id) {
      alert('Please save the house first, then you can link heraldry to it.');
      return;
    }
    
    // Link the selected heraldry to this house
    linkHeraldryToEntity({
      heraldryId: selectedHeraldry.id,
      entityType: 'house',
      entityId: house.id,
      linkType: 'primary'
    }).then(() => {
      setLinkedHeraldry(selectedHeraldry);
      setFormData(prev => ({ ...prev, heraldryId: selectedHeraldry.id }));
      setShowHeraldryPicker(false);
    }).catch(error => {
      console.error('Error linking heraldry:', error);
      alert('Failed to link heraldry. Please try again.');
    });
  };

  const handleViewHeraldry = () => {
    if (linkedHeraldry?.id) {
      navigate(`/heraldry/edit/${linkedHeraldry.id}`);
    }
  };

  const handleRemoveHeraldry = async () => {
    if (!linkedHeraldry) return;
    
    const confirm = window.confirm(
      `Remove heraldry link for "${linkedHeraldry.name}"?\n\nThis will unlink the heraldry from this house but will not delete the heraldry itself.`
    );
    
    if (!confirm) return;
    
    try {
      // If we have a link ID, use it
      if (heraldryLinkId) {
        await unlinkHeraldry(heraldryLinkId);
      }
      
      setLinkedHeraldry(null);
      setHeraldryLinkId(null);
      setFormData(prev => ({ ...prev, heraldryId: null }));
    } catch (error) {
      console.error('Error removing heraldry link:', error);
      alert('Failed to remove heraldry link. Please try again.');
    }
  };

  // ==================== RENDER ====================

  return (
    <>
      <form className="house-form" onSubmit={handleSubmit}>
        
        {/* House Name - Required */}
        <div className="form-group">
          <label className="form-label">
            House Name <span className="form-label-required">*</span>
          </label>
          <input
            type="text"
            name="houseName"
            value={formData.houseName}
            onChange={handleChange}
            placeholder="e.g., House Stark"
            className={`form-input ${errors.houseName ? 'has-error' : ''}`}
          />
          {errors.houseName && (
            <p className="form-error">{errors.houseName}</p>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            🛡️ HERALDRY SECTION - Phase 5 Integration
            ═══════════════════════════════════════════════════════════════ */}
        <div className="heraldry-section">
          <label className="heraldry-section-label">
            <span className="icon">🛡️</span>
            House Heraldry
          </label>

          {loadingHeraldry ? (
            <div className="heraldry-loading">Loading heraldry...</div>
          ) : linkedHeraldry ? (
            /* Linked Heraldry Display */
            <div className="heraldry-display">
              {/* Thumbnail */}
              <div 
                className="heraldry-thumbnail"
                style={{ border: `2px solid ${formData.colorCode || 'var(--border-primary)'}` }}
              >
                {linkedHeraldry.heraldryDisplay || linkedHeraldry.heraldryThumbnail ? (
                  <img 
                    src={linkedHeraldry.heraldryDisplay || linkedHeraldry.heraldryThumbnail}
                    alt={linkedHeraldry.name}
                  />
                ) : linkedHeraldry.heraldrySVG ? (
                  <div 
                    className="svg-container"
                    dangerouslySetInnerHTML={{ __html: linkedHeraldry.heraldrySVG }}
                  />
                ) : (
                  <span className="heraldry-thumbnail-placeholder">🛡️</span>
                )}
              </div>

              {/* Info & Actions */}
              <div className="heraldry-info">
                <div className="heraldry-name">
                  {linkedHeraldry.name || 'Untitled Arms'}
                </div>
                
                {linkedHeraldry.blazon && (
                  <div className="heraldry-blazon">
                    "{linkedHeraldry.blazon}"
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="heraldry-actions">
                  <button
                    type="button"
                    onClick={handleViewHeraldry}
                    className="heraldry-btn heraldry-btn-view"
                  >
                    ✏️ View/Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowHeraldryPicker(true)}
                    className="heraldry-btn heraldry-btn-change"
                  >
                    🔄 Change
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveHeraldry}
                    className="heraldry-btn heraldry-btn-remove"
                  >
                    ✕ Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* No Heraldry - Show Options */
            <div className="heraldry-empty">
              <p className="heraldry-empty-text">
                No heraldry linked to this house yet. Create new arms or link existing heraldry.
              </p>
              
              <div className="heraldry-empty-actions">
                <button
                  type="button"
                  onClick={handleCreateHeraldry}
                  disabled={!house?.id}
                  className="heraldry-btn-create"
                  title={!house?.id ? 'Save house first to create heraldry' : 'Create new heraldry'}
                >
                  ✨ Create New Heraldry
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowHeraldryPicker(true)}
                  disabled={!house?.id}
                  className="heraldry-btn-link"
                  title={!house?.id ? 'Save house first to link heraldry' : 'Link existing heraldry'}
                >
                  🔗 Link Existing
                </button>
              </div>
              
              {!house?.id && (
                <p className="heraldry-save-hint">
                  💡 Save the house first to enable heraldry options
                </p>
              )}
            </div>
          )}
        </div>
        {/* ═══════════════════════════════════════════════════════════════ */}

        {/* Sigil Description (text fallback) */}
        <div className="form-group">
          <label className="form-label">
            Sigil Description
            <span className="form-label-hint">
              (text description, separate from heraldry)
            </span>
          </label>
          <input
            type="text"
            name="sigil"
            value={formData.sigil}
            onChange={handleChange}
            placeholder="e.g., A grey direwolf on white field"
            className="form-input"
          />
        </div>

        {/* Motto */}
        <div className="form-group">
          <label className="form-label">House Motto</label>
          <input
            type="text"
            name="motto"
            value={formData.motto}
            onChange={handleChange}
            placeholder="e.g., Winter is Coming"
            className="form-input"
          />
        </div>

        {/* Founded Date */}
        <div className="form-group">
          <label className="form-label">Founded Year</label>
          <input
            type="text"
            name="foundedDate"
            value={formData.foundedDate}
            onChange={handleChange}
            placeholder="e.g., 1120"
            maxLength="4"
            className={`form-input ${errors.foundedDate ? 'has-error' : ''}`}
          />
          {errors.foundedDate && (
            <p className="form-error">{errors.foundedDate}</p>
          )}
        </div>

        {/* Color Code */}
        <div className="form-group">
          <label className="form-label">House Color</label>
          <div className="form-color-row">
            <input
              type="color"
              name="colorCode"
              value={formData.colorCode}
              onChange={handleChange}
              className="form-color-input"
            />
            <span className="form-color-hint">
              Used to color-code this house in the family tree
            </span>
          </div>
        </div>

        {/* Notes */}
        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Additional information about this house..."
            className="form-textarea"
          />
        </div>

        {/* Form Actions */}
        <div className="form-footer">
          <button
            type="button"
            onClick={onCancel}
            className="form-btn form-btn-cancel"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="form-btn form-btn-submit"
          >
            {house ? '💾 Update House' : '✨ Create House'}
          </button>
        </div>
      </form>

      {/* Heraldry Picker Modal */}
      <HeraldryPickerModal
        isOpen={showHeraldryPicker}
        onClose={() => setShowHeraldryPicker(false)}
        onSelect={handleLinkHeraldry}
        entityType="house"
        entityName={formData.houseName || 'New House'}
        excludeHeraldryId={linkedHeraldry?.id}
      />
    </>
  );
}

export default HouseForm;
