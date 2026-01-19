/**
 * DignityVisuals.jsx - Visual Components for Dignity Display
 *
 * PURPOSE:
 * Reusable visual components for displaying dignity hierarchy:
 * - RankPips: Visual authority level indicator
 * - ChainOfCommand: Mini-visualization of feudal hierarchy
 * - ClassBadge: Styled badge showing dignity class
 *
 * DESIGN:
 * Follows medieval manuscript aesthetic with gold accents.
 */

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import Icon from './icons';
import { DIGNITY_EDUCATION, getRankEducation } from '../data/dignityEducation';
import { DIGNITY_CLASSES, DIGNITY_RANKS, DIGNITY_NATURES } from '../services/dignityService';
import './DignityVisuals.css';

// ==================== RANK PIPS ====================

/**
 * RankPips - Visual authority level indicator
 *
 * Shows filled/empty pips to indicate rank within class.
 * Higher = more authority.
 *
 * @param {string} rank - Rank ID (e.g., 'drihten')
 * @param {string} dignityClass - Class ID (e.g., 'driht')
 * @param {number} max - Maximum pips to show (default 5)
 * @param {string} size - 'sm' | 'md' | 'lg'
 */
export function RankPips({ rank, dignityClass, count: directCount, max = 5, size = 'md' }) {
  // Get pip count from education data if not provided directly
  const pipCount = useMemo(() => {
    if (typeof directCount === 'number') return directCount;

    const education = getRankEducation(dignityClass, rank);
    if (education?.pips) return education.pips;

    // Fallback: calculate from rank order
    const classRanks = DIGNITY_RANKS[dignityClass];
    if (classRanks && classRanks[rank]) {
      const order = classRanks[rank].order;
      // Invert order (1 = highest = most pips)
      const totalRanks = Object.keys(classRanks).length;
      return Math.max(1, totalRanks - order + 1);
    }

    return 1;
  }, [rank, dignityClass, directCount]);

  return (
    <div className={`rank-pips rank-pips--${size}`} title={`Authority Level: ${pipCount}/${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`rank-pips__pip ${i < pipCount ? 'rank-pips__pip--filled' : ''}`}
        />
      ))}
    </div>
  );
}

// ==================== CHAIN OF COMMAND ====================

/**
 * ChainOfCommand - Mini-visualization of feudal hierarchy
 *
 * Shows where a rank sits in the chain of command:
 * - Who they answer to (superior)
 * - The rank itself (highlighted)
 * - Who reports to them (subordinates)
 *
 * @param {string} rank - Rank ID
 * @param {string} dignityClass - Class ID
 * @param {boolean} compact - Use compact layout
 */
export function ChainOfCommand({ rank, dignityClass, compact = false }) {
  const chainData = useMemo(() => {
    const education = getRankEducation(dignityClass, rank);
    if (!education) return null;

    return {
      answersTo: education.answersTo,
      commands: education.commands,
      name: education.name,
      modernEquivalent: education.modernEquivalent,
      pips: education.pips
    };
  }, [rank, dignityClass]);

  if (!chainData) return null;

  if (compact) {
    return (
      <div className="chain-of-command chain-of-command--compact">
        {chainData.answersTo && chainData.answersTo !== 'Varies' && (
          <div className="chain-of-command__item chain-of-command__item--superior">
            <Icon name="chevron-up" size={12} />
            <span className="chain-of-command__label">{chainData.answersTo}</span>
          </div>
        )}
        <div className="chain-of-command__item chain-of-command__item--current">
          <RankPips rank={rank} dignityClass={dignityClass} size="sm" />
          <span className="chain-of-command__name">{chainData.name}</span>
        </div>
        {chainData.commands && chainData.commands !== 'Varies' && chainData.commands !== 'Personal retainers only' && (
          <div className="chain-of-command__item chain-of-command__item--subordinate">
            <Icon name="chevron-down" size={12} />
            <span className="chain-of-command__label">{chainData.commands}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="chain-of-command">
      {/* Superior */}
      {chainData.answersTo && chainData.answersTo !== 'Varies' && (
        <div className="chain-of-command__level chain-of-command__level--superior">
          <div className="chain-of-command__connector chain-of-command__connector--up" />
          <div className="chain-of-command__box chain-of-command__box--muted">
            <Icon name="chevrons-up" size={14} />
            <span>Answers to</span>
            <strong>{chainData.answersTo}</strong>
          </div>
        </div>
      )}

      {/* Current Rank */}
      <div className="chain-of-command__level chain-of-command__level--current">
        <div className="chain-of-command__box chain-of-command__box--highlighted">
          <RankPips rank={rank} dignityClass={dignityClass} size="md" />
          <span className="chain-of-command__title">{chainData.name}</span>
          {chainData.modernEquivalent && (
            <span className="chain-of-command__subtitle">{chainData.modernEquivalent}</span>
          )}
        </div>
      </div>

      {/* Subordinates */}
      {chainData.commands && chainData.commands !== 'Varies' && (
        <div className="chain-of-command__level chain-of-command__level--subordinate">
          <div className="chain-of-command__connector chain-of-command__connector--down" />
          <div className="chain-of-command__box chain-of-command__box--muted">
            <Icon name="chevrons-down" size={14} />
            <span>Commands</span>
            <strong>{chainData.commands}</strong>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== CLASS BADGE ====================

/**
 * ClassBadge - Styled badge showing dignity class
 *
 * @param {string} dignityClass - Class ID
 * @param {boolean} showIcon - Include icon
 * @param {string} size - 'sm' | 'md' | 'lg'
 */
export function ClassBadge({ dignityClass, showIcon = true, size = 'md' }) {
  const classInfo = DIGNITY_CLASSES[dignityClass] || DIGNITY_CLASSES.other;
  const classEducation = DIGNITY_EDUCATION[dignityClass];

  const iconName = classEducation?.icon || 'scroll-text';

  return (
    <span className={`class-badge class-badge--${dignityClass} class-badge--${size}`}>
      {showIcon && <Icon name={iconName} size={size === 'sm' ? 12 : size === 'lg' ? 18 : 14} />}
      <span className="class-badge__name">{classInfo.name}</span>
    </span>
  );
}

// ==================== NATURE BADGE ====================

/**
 * NatureBadge - Styled badge showing dignity nature
 *
 * @param {string} nature - Nature ID ('territorial', 'office', 'personal-honour', 'courtesy')
 * @param {boolean} showIcon - Include icon
 * @param {boolean} showDescription - Show short description on hover
 * @param {string} size - 'sm' | 'md' | 'lg'
 */
export function NatureBadge({ nature, showIcon = true, showDescription = true, size = 'md' }) {
  const natureInfo = DIGNITY_NATURES[nature] || DIGNITY_NATURES.territorial;

  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 18 : 14;

  return (
    <span
      className={`nature-badge nature-badge--${nature || 'territorial'} nature-badge--${size}`}
      title={showDescription ? natureInfo.description : undefined}
    >
      {showIcon && <Icon name={natureInfo.icon} size={iconSize} />}
      <span className="nature-badge__name">{natureInfo.name}</span>
    </span>
  );
}

// ==================== RANK INDICATOR ====================

/**
 * RankIndicator - Combined rank display with pips and class
 *
 * Shows rank name, class badge, and authority pips in one component.
 *
 * @param {string} rank - Rank ID
 * @param {string} dignityClass - Class ID
 * @param {boolean} showClass - Show class badge
 * @param {boolean} showPips - Show rank pips
 */
export function RankIndicator({ rank, dignityClass, showClass = true, showPips = true, size = 'md' }) {
  const rankInfo = DIGNITY_RANKS[dignityClass]?.[rank];
  const education = getRankEducation(dignityClass, rank);

  const displayName = education?.name || rankInfo?.name || rank;

  return (
    <div className={`rank-indicator rank-indicator--${size}`}>
      {showClass && <ClassBadge dignityClass={dignityClass} size={size} />}
      <span className="rank-indicator__name">{displayName}</span>
      {showPips && <RankPips rank={rank} dignityClass={dignityClass} size={size} />}
    </div>
  );
}

// ==================== HIERARCHY POSITION ====================

/**
 * HierarchyPosition - Shows rank's position in the overall hierarchy
 *
 * Visual representation showing where this rank sits among all ranks.
 *
 * @param {string} rank - Rank ID
 * @param {string} dignityClass - Class ID
 */
export function HierarchyPosition({ rank, dignityClass }) {
  const position = useMemo(() => {
    const classRanks = DIGNITY_RANKS[dignityClass];
    if (!classRanks) return null;

    const ranks = Object.entries(classRanks).sort((a, b) => a[1].order - b[1].order);
    const currentIndex = ranks.findIndex(([id]) => id === rank);

    return {
      ranks,
      currentIndex,
      total: ranks.length
    };
  }, [rank, dignityClass]);

  if (!position) return null;

  return (
    <div className="hierarchy-position">
      <div className="hierarchy-position__track">
        {position.ranks.map(([rankId, rankInfo], index) => (
          <div
            key={rankId}
            className={`hierarchy-position__marker ${index === position.currentIndex ? 'hierarchy-position__marker--current' : ''}`}
            title={rankInfo.name}
          >
            <span className="hierarchy-position__dot" />
            {index === position.currentIndex && (
              <span className="hierarchy-position__label">{rankInfo.name}</span>
            )}
          </div>
        ))}
      </div>
      <div className="hierarchy-position__labels">
        <span>Highest</span>
        <span>Lowest</span>
      </div>
    </div>
  );
}

export default {
  RankPips,
  ChainOfCommand,
  ClassBadge,
  NatureBadge,
  RankIndicator,
  HierarchyPosition
};
