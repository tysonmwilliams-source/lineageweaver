/**
 * HouseList.jsx - ENHANCED WITH HERALDRY INTEGRATION
 * 
 * PHASE 5: Deep Integration - Batch 1
 * 
 * Displays all houses in a list with heraldry thumbnails,
 * edit and delete options, and quick heraldry actions.
 * 
 * HERALDRY FEATURES:
 * - Displays heraldry thumbnail for each house
 * - "Add Arms" action for houses without heraldry
 * - Click thumbnail to view/edit heraldry
 * - Uses CSS custom properties for theming
 * 
 * Props:
 * - houses: Array of house objects
 * - onEdit: Function to call when user wants to edit a house
 * - onDelete: Function to call when user wants to delete a house
 * - onAddHeraldry: Function to handle adding heraldry to a house
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHeraldry } from '../services/heraldryService';
import './HouseList.css';

function HouseList({ 
  houses, 
  onEdit, 
  onDelete,
  onAddHeraldry = null
}) {
  const navigate = useNavigate();
  
  // Cache heraldry data for houses
  const [heraldryCache, setHeraldryCache] = useState({});
  const [loadingHeraldry, setLoadingHeraldry] = useState({});

  // ==================== LOAD HERALDRY ====================
  useEffect(() => {
    // Load heraldry for houses that have heraldryId
    houses.forEach(house => {
      if (house.heraldryId && !heraldryCache[house.heraldryId] && !loadingHeraldry[house.heraldryId]) {
        loadHeraldryForHouse(house.heraldryId);
      }
    });
  }, [houses]);

  const loadHeraldryForHouse = async (heraldryId) => {
    setLoadingHeraldry(prev => ({ ...prev, [heraldryId]: true }));
    
    try {
      const heraldry = await getHeraldry(heraldryId);
      if (heraldry) {
        setHeraldryCache(prev => ({ ...prev, [heraldryId]: heraldry }));
      }
    } catch (error) {
      console.error('Error loading heraldry:', error);
    } finally {
      setLoadingHeraldry(prev => ({ ...prev, [heraldryId]: false }));
    }
  };

  // ==================== HANDLERS ====================
  const handleHeraldryClick = (house) => {
    if (house.heraldryId) {
      navigate(`/heraldry/edit/${house.heraldryId}`);
    } else {
      navigate(`/heraldry/create?houseId=${house.id}&houseName=${encodeURIComponent(house.houseName)}`);
    }
  };

  const handleAddHeraldry = (house) => {
    if (onAddHeraldry) {
      onAddHeraldry(house);
    } else {
      navigate(`/heraldry/create?houseId=${house.id}&houseName=${encodeURIComponent(house.houseName)}`);
    }
  };

  // ==================== RENDER HELPERS ====================
  const renderHeraldryThumbnail = (house) => {
    const heraldry = house.heraldryId ? heraldryCache[house.heraldryId] : null;
    const isLoading = house.heraldryId && loadingHeraldry[house.heraldryId];
    
    // Also check for legacy heraldry data stored directly on house
    const legacyImage = house.heraldryThumbnail || house.heraldryImageData;

    if (isLoading) {
      return (
        <div 
          className="house-card-heraldry"
          style={{ border: `2px solid ${house.colorCode || 'var(--border-primary)'}` }}
          title="Loading heraldry..."
        >
          <span className="house-card-heraldry-loading">⏳</span>
        </div>
      );
    }

    if (heraldry || legacyImage) {
      const image = heraldry?.heraldryThumbnail || 
                   heraldry?.heraldryDisplay || 
                   legacyImage;
      
      return (
        <div 
          className="house-card-heraldry"
          style={{ border: `2px solid ${house.colorCode || 'var(--border-primary)'}` }}
          onClick={() => handleHeraldryClick(house)}
          title={`View heraldry for ${house.houseName}`}
        >
          {image ? (
            <img src={image} alt={`${house.houseName} heraldry`} />
          ) : heraldry?.heraldrySVG ? (
            <div 
              className="svg-container"
              dangerouslySetInnerHTML={{ __html: heraldry.heraldrySVG }}
            />
          ) : (
            <span style={{ fontSize: '24px' }}>🛡️</span>
          )}
        </div>
      );
    }

    // No heraldry - show placeholder with add option
    return (
      <div 
        className="house-card-heraldry house-card-heraldry-placeholder"
        style={{ 
          borderColor: house.colorCode || 'var(--border-primary)',
          backgroundColor: house.colorCode ? `${house.colorCode}22` : 'var(--bg-elevated)'
        }}
        onClick={() => handleAddHeraldry(house)}
        title={`Add heraldry for ${house.houseName}`}
      >
        <span 
          className="house-card-heraldry-placeholder-icon"
          style={{ color: house.colorCode || 'var(--text-secondary)' }}
        >
          +
        </span>
      </div>
    );
  };

  // ==================== RENDER ====================
  if (houses.length === 0) {
    return (
      <div className="house-list-empty">
        <div className="house-list-empty-icon">🏰</div>
        <p className="house-list-empty-text">
          No houses yet. Create your first noble house!
        </p>
      </div>
    );
  }

  return (
    <div className="house-list">
      {houses.map(house => {
        const heraldry = house.heraldryId ? heraldryCache[house.heraldryId] : null;
        const hasHeraldry = heraldry || house.heraldryThumbnail || house.heraldryImageData;
        
        return (
          <div key={house.id} className="house-card">
            <div className="house-card-content">
              {/* Heraldry Thumbnail */}
              {renderHeraldryThumbnail(house)}

              {/* House Info */}
              <div className="house-card-info">
                <div className="house-card-header">
                  {/* Color indicator */}
                  <div 
                    className="house-card-color"
                    style={{ backgroundColor: house.colorCode || '#666' }}
                    title="House color"
                  />
                  
                  <h3 className="house-card-name">{house.houseName}</h3>
                  
                  {house.foundedDate && (
                    <span className="house-card-founded">
                      (Founded {house.foundedDate})
                    </span>
                  )}
                  
                  {/* House type badge if applicable */}
                  {house.houseType && house.houseType !== 'great' && (
                    <span className="house-card-type">
                      {house.houseType}
                    </span>
                  )}
                </div>

                {/* Blazon or Sigil Description */}
                {(heraldry?.blazon || house.sigil) && (
                  <p className="house-card-blazon">
                    {heraldry?.blazon ? `"${heraldry.blazon}"` : house.sigil}
                  </p>
                )}

                {/* Motto */}
                {house.motto && (
                  <p className="house-card-motto">"{house.motto}"</p>
                )}

                {/* Notes preview */}
                {house.notes && (
                  <p className="house-card-notes">{house.notes}</p>
                )}
              </div>

              {/* Actions */}
              <div className="house-card-actions">
                {/* Add Heraldry button (only if no heraldry) */}
                {!hasHeraldry && (
                  <button
                    onClick={() => handleAddHeraldry(house)}
                    className="house-card-btn house-card-btn-heraldry"
                    title="Add heraldry"
                  >
                    🛡️ Add Arms
                  </button>
                )}
                
                <button
                  onClick={() => onEdit(house)}
                  className="house-card-btn house-card-btn-edit"
                  title="Edit house"
                >
                  Edit
                </button>
                
                <button
                  onClick={() => onDelete(house)}
                  className="house-card-btn house-card-btn-delete"
                  title="Delete house"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default HouseList;
