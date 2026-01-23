/**
 * FounderPickerModal.jsx
 *
 * A modal for selecting eligible founders for a cadet house.
 * Based on the HeraldryPickerModal pattern.
 *
 * Features:
 * - Search by name
 * - Filter by house membership
 * - Shows legitimacy status (affects cadet tier)
 * - Preview panel with person details
 * - Only shows eligible members of the parent house
 *
 * Props:
 * - isOpen: Boolean to control visibility
 * - onClose: Function to close modal
 * - onSelect: Function called with selected person when confirmed
 * - parentHouse: The house for which we're founding a cadet branch
 * - people: Array of all people
 * - houses: Array of all houses
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './icons';
import ActionButton from './shared/ActionButton';
import EmptyState from './shared/EmptyState';
import './FounderPickerModal.css';

// Animation variants
const OVERLAY_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 }
  }
};

const MODAL_VARIANTS = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
      delay: 0.05
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.15 }
  }
};

const LIST_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03
    }
  }
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2 }
  }
};

const PREVIEW_VARIANTS = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 200
    }
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.15 }
  }
};

function FounderPickerModal({
  isOpen,
  onClose,
  onSelect,
  parentHouse,
  people = [],
  houses = []
}) {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [legitimacyFilter, setLegitimacyFilter] = useState('all');
  const [selectedPerson, setSelectedPerson] = useState(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedPerson(null);
      setSearchTerm('');
      setLegitimacyFilter('all');
    }
  }, [isOpen]);

  // Get eligible people (members of the parent house)
  const eligiblePeople = useMemo(() => {
    if (!parentHouse) return [];

    // Find people who belong to the parent house
    let eligible = people.filter(p => p.houseId === parentHouse.id);

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      eligible = eligible.filter(p => {
        const fullName = `${p.firstName || ''} ${p.lastName || ''}`.toLowerCase();
        return fullName.includes(term) ||
               p.firstName?.toLowerCase().includes(term) ||
               p.lastName?.toLowerCase().includes(term);
      });
    }

    // Apply legitimacy filter
    if (legitimacyFilter !== 'all') {
      if (legitimacyFilter === 'legitimate') {
        eligible = eligible.filter(p => p.legitimacyStatus !== 'bastard');
      } else if (legitimacyFilter === 'bastard') {
        eligible = eligible.filter(p => p.legitimacyStatus === 'bastard');
      }
    }

    // Sort by name
    eligible.sort((a, b) => {
      const nameA = `${a.lastName || ''} ${a.firstName || ''}`.trim();
      const nameB = `${b.lastName || ''} ${b.firstName || ''}`.trim();
      return nameA.localeCompare(nameB);
    });

    return eligible;
  }, [people, parentHouse, searchTerm, legitimacyFilter]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Get house name for a person
  const getHouseName = (houseId) => {
    const house = houses.find(h => h.id === houseId);
    return house?.houseName || 'Unknown House';
  };

  // Determine cadet tier based on legitimacy
  const getCadetTier = (person) => {
    return person?.legitimacyStatus === 'bastard' ? 2 : 1;
  };

  // Handle selection
  const handleSelect = (person) => {
    setSelectedPerson(person);
  };

  const handleConfirm = () => {
    if (selectedPerson && onSelect) {
      onSelect(selectedPerson);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="founder-picker__overlay"
          onClick={onClose}
          variants={OVERLAY_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="founder-picker__modal"
            onClick={(e) => e.stopPropagation()}
            variants={MODAL_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
          >

            {/* Header */}
            <div className="founder-picker__header">
              <div className="founder-picker__header-row">
                <div className="founder-picker__header-info">
                  <h2 className="founder-picker__title">
                    <Icon name="git-branch" size={22} />
                    <span>Select Founder</span>
                  </h2>
                  {parentHouse && (
                    <p className="founder-picker__subtitle">
                      <Icon name="castle" size={14} />
                      <span>Founding cadet branch of {parentHouse.houseName}</span>
                    </p>
                  )}
                </div>
                <button
                  className="founder-picker__close-btn"
                  onClick={onClose}
                  title="Close (Esc)"
                  aria-label="Close modal"
                >
                  <Icon name="x" size={20} />
                </button>
              </div>

              {/* Search and Filter */}
              <div className="founder-picker__controls">
                <div className="founder-picker__search-wrapper">
                  <Icon name="search" size={18} className="founder-picker__search-icon" />
                  <input
                    type="text"
                    className="founder-picker__search"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      className="founder-picker__search-clear"
                      onClick={() => setSearchTerm('')}
                      aria-label="Clear search"
                    >
                      <Icon name="x" size={16} />
                    </button>
                  )}
                </div>
                <div className="founder-picker__filter-wrapper">
                  <Icon name="filter" size={18} className="founder-picker__filter-icon" />
                  <select
                    className="founder-picker__filter"
                    value={legitimacyFilter}
                    onChange={(e) => setLegitimacyFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="legitimate">Legitimate Only</option>
                    <option value="bastard">Bastards Only</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="founder-picker__content">
              {/* People List */}
              <div className={`founder-picker__list ${selectedPerson ? 'founder-picker__list--has-selection' : ''}`}>
                {eligiblePeople.length === 0 ? (
                  <EmptyState
                    icon="users"
                    title="No eligible founders"
                    description={
                      searchTerm || legitimacyFilter !== 'all'
                        ? 'No members match your search criteria'
                        : `No members found in ${parentHouse?.houseName || 'this house'}`
                    }
                  />
                ) : (
                  <motion.div
                    className="founder-picker__grid"
                    variants={LIST_VARIANTS}
                    initial="hidden"
                    animate="visible"
                  >
                    {eligiblePeople.map(person => {
                      const isSelected = selectedPerson?.id === person.id;
                      const isBastard = person.legitimacyStatus === 'bastard';
                      const tier = getCadetTier(person);

                      return (
                        <motion.div
                          key={person.id}
                          className={`founder-picker__item ${isSelected ? 'founder-picker__item--selected' : ''} ${isBastard ? 'founder-picker__item--bastard' : ''}`}
                          onClick={() => handleSelect(person)}
                          variants={ITEM_VARIANTS}
                          whileHover={{ y: -2, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Avatar */}
                          <div className="founder-picker__item-avatar">
                            <Icon name="user" size={24} />
                          </div>

                          {/* Name */}
                          <div className="founder-picker__item-name">
                            {person.firstName} {person.lastName}
                          </div>

                          {/* Legitimacy Status */}
                          <div className={`founder-picker__item-status founder-picker__item-status--tier-${tier}`}>
                            <Icon name={isBastard ? 'shield-alert' : 'shield'} size={12} />
                            <span>{isBastard ? 'Bastard (Tier 2)' : 'Legitimate (Tier 1)'}</span>
                          </div>

                          {/* Selection indicator */}
                          {isSelected && (
                            <div className="founder-picker__item-badge">
                              <Icon name="check" size={14} />
                              <span>Selected</span>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </div>

              {/* Preview Panel */}
              <AnimatePresence>
                {selectedPerson && (
                  <motion.div
                    className="founder-picker__preview"
                    variants={PREVIEW_VARIANTS}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <h3 className="founder-picker__preview-title">
                      <Icon name="eye" size={16} />
                      <span>Founder Details</span>
                    </h3>

                    {/* Avatar */}
                    <div className="founder-picker__preview-avatar">
                      <Icon name="user" size={48} />
                    </div>

                    {/* Name */}
                    <div className="founder-picker__preview-name">
                      {selectedPerson.firstName} {selectedPerson.lastName}
                    </div>

                    {/* House */}
                    <div className="founder-picker__preview-house">
                      <Icon name="castle" size={14} />
                      <span>{getHouseName(selectedPerson.houseId)}</span>
                    </div>

                    {/* Tier Info */}
                    <div className={`founder-picker__preview-tier founder-picker__preview-tier--${getCadetTier(selectedPerson)}`}>
                      <div className="founder-picker__preview-tier-header">
                        <Icon name={selectedPerson.legitimacyStatus === 'bastard' ? 'shield-alert' : 'shield'} size={16} />
                        <span>Cadet Tier {getCadetTier(selectedPerson)}</span>
                      </div>
                      <p className="founder-picker__preview-tier-desc">
                        {selectedPerson.legitimacyStatus === 'bastard'
                          ? 'As a bastard, this founder will create a Tier 2 house with the "Dun" prefix, marking bastard origins.'
                          : 'As a legitimate member, this founder will create a Tier 1 noble cadet branch.'
                        }
                      </p>
                    </div>

                    {/* Birth/Death dates if available */}
                    {(selectedPerson.birthDate || selectedPerson.deathDate) && (
                      <div className="founder-picker__preview-dates">
                        <Icon name="calendar" size={14} />
                        <span>
                          {selectedPerson.birthDate || '?'} - {selectedPerson.deathDate || 'Present'}
                        </span>
                      </div>
                    )}

                    {/* Notes if available */}
                    {selectedPerson.notes && (
                      <div className="founder-picker__preview-notes">
                        <div className="founder-picker__preview-notes-label">
                          <Icon name="file-text" size={12} />
                          <span>Notes</span>
                        </div>
                        <p className="founder-picker__preview-notes-text">
                          {selectedPerson.notes}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="founder-picker__footer">
              <div className="founder-picker__count">
                <Icon name="users" size={16} />
                <span>
                  {eligiblePeople.length} eligible founder{eligiblePeople.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="founder-picker__actions">
                <ActionButton
                  variant="ghost"
                  onClick={onClose}
                >
                  Cancel
                </ActionButton>
                <ActionButton
                  variant="primary"
                  icon="git-branch"
                  onClick={handleConfirm}
                  disabled={!selectedPerson}
                >
                  Continue to Ceremony
                </ActionButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default FounderPickerModal;
