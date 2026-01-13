/**
 * HouseList.jsx - House List Component
 *
 * PURPOSE:
 * Displays all houses in a list with heraldry thumbnails,
 * edit and delete options, and quick heraldry actions.
 *
 * Uses Framer Motion for animations, Lucide icons, and BEM CSS.
 *
 * Props:
 * - houses: Array of house objects
 * - onEdit: Function to call when user wants to edit a house
 * - onDelete: Function to call when user wants to delete a house
 * - onAddHeraldry: Function to handle adding heraldry to a house
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getHeraldry } from '../services/heraldryService';
import Icon from './icons';
import './HouseList.css';

// ==================== ANIMATION VARIANTS ====================
const LIST_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 300
    }
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2 }
  }
};

const EMPTY_VARIANTS = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 300
    }
  }
};

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
    const legacyImage = house.heraldryThumbnail || house.heraldryImageData;

    if (isLoading) {
      return (
        <div
          className="house-list__heraldry house-list__heraldry--loading"
          style={{ border: `2px solid ${house.colorCode || 'var(--border-primary)'}` }}
          title="Loading heraldry..."
        >
          <Icon name="loader" size={20} className="house-list__heraldry-loader" />
        </div>
      );
    }

    if (heraldry || legacyImage) {
      const image = heraldry?.heraldryThumbnail ||
                   heraldry?.heraldryDisplay ||
                   legacyImage;

      return (
        <motion.div
          className="house-list__heraldry"
          style={{ border: `2px solid ${house.colorCode || 'var(--border-primary)'}` }}
          onClick={() => handleHeraldryClick(house)}
          title={`View heraldry for ${house.houseName}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {image ? (
            <img src={image} alt={`${house.houseName} heraldry`} />
          ) : heraldry?.heraldrySVG ? (
            <div
              className="house-list__heraldry-svg"
              dangerouslySetInnerHTML={{ __html: heraldry.heraldrySVG }}
            />
          ) : (
            <Icon name="shield" size={24} />
          )}
        </motion.div>
      );
    }

    // No heraldry - show placeholder with add option
    return (
      <motion.div
        className="house-list__heraldry house-list__heraldry--placeholder"
        style={{
          borderColor: house.colorCode || 'var(--border-primary)',
          backgroundColor: house.colorCode ? `${house.colorCode}15` : undefined
        }}
        onClick={() => handleAddHeraldry(house)}
        title={`Add heraldry for ${house.houseName}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon name="plus" size={24} className="house-list__heraldry-add" />
      </motion.div>
    );
  };

  // ==================== EMPTY STATE ====================
  if (houses.length === 0) {
    return (
      <motion.div
        className="house-list__empty"
        variants={EMPTY_VARIANTS}
        initial="hidden"
        animate="visible"
      >
        <Icon name="castle" size={48} className="house-list__empty-icon" />
        <p className="house-list__empty-text">
          No houses yet. Create your first noble house!
        </p>
      </motion.div>
    );
  }

  // ==================== RENDER ====================
  return (
    <motion.div
      className="house-list"
      variants={LIST_VARIANTS}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence mode="popLayout">
        {houses.map(house => {
          const heraldry = house.heraldryId ? heraldryCache[house.heraldryId] : null;
          const hasHeraldry = heraldry || house.heraldryThumbnail || house.heraldryImageData;

          return (
            <motion.div
              key={house.id}
              className="house-list__card"
              variants={ITEM_VARIANTS}
              layout
              exit="exit"
            >
              <div className="house-list__card-content">
                {/* Heraldry Thumbnail */}
                {renderHeraldryThumbnail(house)}

                {/* House Info */}
                <div className="house-list__info">
                  <div className="house-list__header">
                    <div
                      className="house-list__color"
                      style={{ backgroundColor: house.colorCode || '#666' }}
                      title="House color"
                    />

                    <h3 className="house-list__name">{house.houseName}</h3>

                    {house.foundedDate && (
                      <span className="house-list__founded">
                        (Founded {house.foundedDate})
                      </span>
                    )}

                    {house.houseType && house.houseType !== 'great' && (
                      <span className="house-list__type">
                        {house.houseType}
                      </span>
                    )}
                  </div>

                  {/* Blazon or Sigil Description */}
                  {(heraldry?.blazon || house.sigil) && (
                    <p className="house-list__blazon">
                      {heraldry?.blazon ? `"${heraldry.blazon}"` : house.sigil}
                    </p>
                  )}

                  {/* Motto */}
                  {house.motto && (
                    <p className="house-list__motto">"{house.motto}"</p>
                  )}

                  {/* Notes preview */}
                  {house.notes && (
                    <p className="house-list__notes">{house.notes}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="house-list__actions">
                  {/* Add Heraldry button (only if no heraldry) */}
                  {!hasHeraldry && (
                    <motion.button
                      onClick={() => handleAddHeraldry(house)}
                      className="house-list__btn house-list__btn--heraldry"
                      title="Add heraldry"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon name="shield" size={14} />
                      <span>Add Arms</span>
                    </motion.button>
                  )}

                  <motion.button
                    onClick={() => onEdit(house)}
                    className="house-list__btn house-list__btn--edit"
                    title="Edit house"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon name="edit" size={14} />
                    <span>Edit</span>
                  </motion.button>

                  <motion.button
                    onClick={() => onDelete(house)}
                    className="house-list__btn house-list__btn--delete"
                    title="Delete house"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon name="trash-2" size={14} />
                    <span>Delete</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}

export default HouseList;
