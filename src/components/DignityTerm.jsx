/**
 * DignityTerm.jsx - Smart Dignity Term Display
 *
 * PURPOSE:
 * Displays dignity terms with learning mode support and tooltips.
 * Adapts display based on user's selected learning mode:
 * - Scholar: Original term only
 * - Learning: Original (Modern)
 * - Modern: Modern term only
 *
 * USAGE:
 * <DignityTerm rank="drihten" />
 * <DignityTerm rank="drihten" class="driht" showTooltip />
 * <DignityTerm original="Drihten" modern="High Lord" />
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearningMode } from '../contexts/LearningModeContext';
import { DIGNITY_EDUCATION, getRankEducation } from '../data/dignityEducation';
import { DIGNITY_RANKS } from '../services/dignityService';
import Icon from './icons';
import './DignityTerm.css';

/**
 * Get term data from rank ID
 */
function getTermData(rankId, classId = null) {
  // Try to find in education data first
  if (classId) {
    const education = getRankEducation(classId, rankId);
    if (education) {
      return {
        original: education.name,
        modern: education.modernEquivalent,
        pronunciation: education.pronunciation,
        description: education.description,
        pips: education.pips
      };
    }
  }

  // Search all classes for the rank
  for (const [cls, classData] of Object.entries(DIGNITY_EDUCATION)) {
    if (classData.ranks[rankId]) {
      const rank = classData.ranks[rankId];
      return {
        original: rank.name,
        modern: rank.modernEquivalent,
        pronunciation: rank.pronunciation,
        description: rank.description,
        pips: rank.pips,
        classId: cls
      };
    }
  }

  // Fallback to dignity service data
  for (const [cls, ranks] of Object.entries(DIGNITY_RANKS)) {
    if (ranks[rankId]) {
      return {
        original: ranks[rankId].name,
        modern: null,
        description: ranks[rankId].description
      };
    }
  }

  return null;
}

/**
 * Tooltip component
 */
function TermTooltip({ data, position }) {
  if (!data) return null;

  return (
    <motion.div
      className="dignity-term__tooltip"
      initial={{ opacity: 0, y: 4, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      style={{
        left: position.x,
        top: position.y
      }}
    >
      <div className="dignity-term__tooltip-header">
        <span className="dignity-term__tooltip-original">{data.original}</span>
        {data.modern && (
          <span className="dignity-term__tooltip-modern">{data.modern}</span>
        )}
      </div>

      {data.pronunciation && (
        <div className="dignity-term__tooltip-pronunciation">
          /{data.pronunciation}/
        </div>
      )}

      {data.pips && (
        <div className="dignity-term__tooltip-pips">
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className={`dignity-term__tooltip-pip ${i < data.pips ? 'dignity-term__tooltip-pip--filled' : ''}`}
            />
          ))}
        </div>
      )}

      {data.description && (
        <p className="dignity-term__tooltip-description">{data.description}</p>
      )}
    </motion.div>
  );
}

/**
 * DignityTerm Component
 */
function DignityTerm({
  rank,           // Rank ID (e.g., 'drihten')
  dignityClass,   // Class ID (e.g., 'driht') - optional, helps lookup
  original,       // Direct original term (overrides rank lookup)
  modern,         // Direct modern term (overrides rank lookup)
  showTooltip = true,
  className = '',
  as: Component = 'span'
}) {
  const { mode, showOriginal, showModern } = useLearningMode();
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const termRef = useRef(null);

  // Get term data
  let termData = null;
  if (rank) {
    termData = getTermData(rank, dignityClass);
  }

  // Use direct props if provided, otherwise use looked-up data
  const displayOriginal = original || termData?.original || rank;
  const displayModern = modern || termData?.modern;

  // Calculate display text based on mode
  let displayText;
  switch (mode) {
    case 'scholar':
      displayText = displayOriginal;
      break;
    case 'modern':
      displayText = displayModern || displayOriginal;
      break;
    case 'learning':
    default:
      displayText = displayModern
        ? `${displayOriginal} (${displayModern})`
        : displayOriginal;
      break;
  }

  // Handle hover for tooltip
  const handleMouseEnter = (e) => {
    if (!showTooltip || !termData) return;

    setIsHovered(true);

    // Position tooltip
    if (termRef.current) {
      const rect = termRef.current.getBoundingClientRect();
      setTooltipPos({
        x: rect.left + rect.width / 2,
        y: rect.bottom + 8
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Build tooltip data
  const tooltipData = termData ? {
    original: displayOriginal,
    modern: displayModern,
    pronunciation: termData.pronunciation,
    description: termData.description,
    pips: termData.pips
  } : null;

  return (
    <>
      <Component
        ref={termRef}
        className={`dignity-term ${showTooltip && termData ? 'dignity-term--interactive' : ''} ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {displayText}
      </Component>

      {showTooltip && (
        <AnimatePresence>
          {isHovered && tooltipData && (
            <TermTooltip data={tooltipData} position={tooltipPos} />
          )}
        </AnimatePresence>
      )}
    </>
  );
}

/**
 * Learning Mode Toggle Component
 * Can be placed in headers/toolbars to let users switch modes
 */
export function LearningModeToggle({ compact = false }) {
  const { mode, cycleMode, modeInfo } = useLearningMode();

  return (
    <button
      className={`learning-mode-toggle ${compact ? 'learning-mode-toggle--compact' : ''}`}
      onClick={cycleMode}
      title={`${modeInfo.name} Mode: ${modeInfo.description}. Click to change.`}
    >
      <Icon name={modeInfo.icon} size={compact ? 16 : 18} />
      {!compact && (
        <span className="learning-mode-toggle__label">{modeInfo.name}</span>
      )}
    </button>
  );
}

export default DignityTerm;
