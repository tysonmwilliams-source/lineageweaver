/**
 * SceneCard.jsx
 *
 * A draggable card component for displaying scene plans.
 * Shows scene metadata, narrative elements, and status.
 *
 * Features:
 * - Compact and expanded views
 * - POV character display
 * - Tension level indicator
 * - Arc connections
 * - Status badge
 * - Click to edit
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../icons';
import { PACING_TYPES, PLAN_STATUS } from '../../../services/planningService';
import './SceneCard.css';

// Tension level colors
const getTensionColor = (level) => {
  if (level <= 3) return '#22c55e'; // Low - green
  if (level <= 6) return '#f59e0b'; // Medium - amber
  return '#ef4444'; // High - red
};

function SceneCard({
  scene,
  povCharacter,
  location,
  linkedArcs = [],
  isSelected = false,
  isCompact = false,
  onSelect,
  onEdit,
  dragHandleProps = {},
  isDragging = false
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const tensionColor = getTensionColor(scene.tensionLevel || 5);
  const pacingInfo = PACING_TYPES[scene.pacingType] || PACING_TYPES.action;
  const statusLabel = PLAN_STATUS[scene.status] || scene.status;

  // Handle click
  const handleClick = () => {
    if (onSelect) {
      onSelect(scene);
    }
  };

  // Handle edit
  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(scene);
    }
  };

  // Toggle expanded view
  const toggleExpanded = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  // Compact card view
  if (isCompact) {
    return (
      <motion.div
        className={`scene-card scene-card--compact ${isSelected ? 'scene-card--selected' : ''} ${isDragging ? 'scene-card--dragging' : ''}`}
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        layout
      >
        <div className="scene-card__drag-handle" {...dragHandleProps}>
          <Icon name="grip-vertical" size={14} />
        </div>
        <div className="scene-card__compact-content">
          <span className="scene-card__compact-title">{scene.title || 'Untitled Scene'}</span>
          {povCharacter && (
            <span className="scene-card__compact-pov">
              <Icon name="user" size={10} />
              {povCharacter.firstName}
            </span>
          )}
        </div>
        <div
          className="scene-card__tension-dot"
          style={{ backgroundColor: tensionColor }}
          title={`Tension: ${scene.tensionLevel || 5}/10`}
        />
      </motion.div>
    );
  }

  // Full card view
  return (
    <motion.div
      className={`scene-card ${isSelected ? 'scene-card--selected' : ''} ${isDragging ? 'scene-card--dragging' : ''} ${isExpanded ? 'scene-card--expanded' : ''}`}
      onClick={handleClick}
      layout
    >
      {/* Header */}
      <div className="scene-card__header">
        <div className="scene-card__drag-handle" {...dragHandleProps}>
          <Icon name="grip-vertical" size={16} />
        </div>

        <div className="scene-card__title-row">
          <h3 className="scene-card__title">
            {scene.title || 'Untitled Scene'}
          </h3>
          <div className="scene-card__header-actions">
            <button
              className="scene-card__expand-btn"
              onClick={toggleExpanded}
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={16} />
            </button>
            <button
              className="scene-card__edit-btn"
              onClick={handleEdit}
              title="Edit scene"
            >
              <Icon name="edit-2" size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Meta row */}
      <div className="scene-card__meta">
        {povCharacter && (
          <div className="scene-card__meta-item" title="POV Character">
            <Icon name="user" size={12} />
            <span>{povCharacter.firstName} {povCharacter.lastName}</span>
          </div>
        )}
        {location && (
          <div className="scene-card__meta-item" title="Location">
            <Icon name="map-pin" size={12} />
            <span>{location.title || location.name}</span>
          </div>
        )}
      </div>

      {/* Tension and pacing */}
      <div className="scene-card__dynamics">
        <div className="scene-card__tension" title={`Tension: ${scene.tensionLevel || 5}/10`}>
          <span className="scene-card__tension-label">Tension</span>
          <div className="scene-card__tension-bar">
            <div
              className="scene-card__tension-fill"
              style={{
                width: `${(scene.tensionLevel || 5) * 10}%`,
                backgroundColor: tensionColor
              }}
            />
          </div>
          <span className="scene-card__tension-value">{scene.tensionLevel || 5}</span>
        </div>

        <div className={`scene-card__pacing scene-card__pacing--${scene.pacingType}`}>
          <span>{pacingInfo.name}</span>
        </div>
      </div>

      {/* Summary (if not expanded) */}
      {!isExpanded && scene.summary && (
        <p className="scene-card__summary">
          {scene.summary.length > 100
            ? scene.summary.substring(0, 100) + '...'
            : scene.summary
          }
        </p>
      )}

      {/* Expanded content */}
      {isExpanded && (
        <motion.div
          className="scene-card__expanded-content"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          {/* Full summary */}
          {scene.summary && (
            <div className="scene-card__field">
              <span className="scene-card__field-label">Summary</span>
              <p className="scene-card__field-value">{scene.summary}</p>
            </div>
          )}

          {/* Scene-Sequel structure */}
          <div className="scene-card__narrative">
            {scene.goal && (
              <div className="scene-card__narrative-item">
                <span className="scene-card__narrative-label">Goal</span>
                <span className="scene-card__narrative-value">{scene.goal}</span>
              </div>
            )}
            {scene.conflict && (
              <div className="scene-card__narrative-item">
                <span className="scene-card__narrative-label">Conflict</span>
                <span className="scene-card__narrative-value">{scene.conflict}</span>
              </div>
            )}
            {scene.disaster && (
              <div className="scene-card__narrative-item">
                <span className="scene-card__narrative-label">Disaster</span>
                <span className="scene-card__narrative-value">{scene.disaster}</span>
              </div>
            )}
          </div>

          {/* Linked arcs */}
          {linkedArcs.length > 0 && (
            <div className="scene-card__arcs">
              <span className="scene-card__arcs-label">Arcs:</span>
              <div className="scene-card__arcs-list">
                {linkedArcs.map(arc => (
                  <span
                    key={arc.id}
                    className="scene-card__arc-tag"
                    style={{ backgroundColor: arc.color }}
                  >
                    {arc.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Emotional tone */}
          {scene.emotionalTone?.length > 0 && (
            <div className="scene-card__tones">
              {scene.emotionalTone.map((tone, idx) => (
                <span key={idx} className="scene-card__tone-tag">
                  {tone}
                </span>
              ))}
            </div>
          )}

          {/* Notes */}
          {scene.notes && (
            <div className="scene-card__notes">
              <Icon name="file-text" size={12} />
              <span>{scene.notes}</span>
            </div>
          )}
        </motion.div>
      )}

      {/* Footer */}
      <div className="scene-card__footer">
        <span className={`scene-card__status scene-card__status--${scene.status}`}>
          {statusLabel}
        </span>

        {scene.estimatedWordCount && (
          <span className="scene-card__word-count">
            ~{scene.estimatedWordCount.toLocaleString()} words
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default SceneCard;
