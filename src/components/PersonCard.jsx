/**
 * PersonCard.jsx - Person Detail Card Component
 *
 * PURPOSE:
 * Displays detailed information about a person.
 * Used in the sidebar when a person is selected in the tree view.
 * Uses Framer Motion for animations, Lucide icons, and BEM CSS.
 *
 * Props:
 * - person: Person object to display
 * - house: House object this person belongs to
 * - relationships: Array of relationships involving this person
 * - allPeople: Array of all people (to show relationship names)
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { isFeatureEnabled } from '../config/featureFlags';
import { getEntry } from '../services/codexService';
import { getBiographyStatus } from '../utils/biographyStatus';
import Icon from './icons';
import './PersonCard.css';

// ==================== ANIMATION VARIANTS ====================
const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
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
    y: -10,
    transition: { duration: 0.15 }
  }
};

const SECTION_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delay: 0.1 }
  }
};

// ==================== LEGITIMACY COLORS ====================
const LEGITIMACY_COLORS = {
  legitimate: 'var(--color-success)',
  bastard: 'var(--color-warning)',
  adopted: 'var(--color-info)',
  unknown: 'var(--text-tertiary)'
};

function PersonCard({ person, house, relationships = [], allPeople = [] }) {
  // ==================== CODEX INTEGRATION ====================
  const [codexEntry, setCodexEntry] = useState(null);
  const [loadingEntry, setLoadingEntry] = useState(false);

  useEffect(() => {
    if (person?.codexEntryId) {
      loadCodexEntry(person.codexEntryId);
    } else {
      setCodexEntry(null);
    }
  }, [person?.codexEntryId]);

  const loadCodexEntry = async (entryId) => {
    try {
      setLoadingEntry(true);
      const entry = await getEntry(entryId);
      setCodexEntry(entry);
    } catch (error) {
      console.warn('Could not load Codex entry:', error);
      setCodexEntry(null);
    } finally {
      setLoadingEntry(false);
    }
  };

  // ==================== HELPERS ====================
  const getPersonName = (personId) => {
    const p = allPeople.find(person => person.id === personId);
    return p ? `${p.firstName} ${p.lastName}` : 'Unknown';
  };

  const legitimacyColor = person
    ? LEGITIMACY_COLORS[person.legitimacyStatus] || LEGITIMACY_COLORS.unknown
    : LEGITIMACY_COLORS.unknown;

  // ==================== COMPUTED RELATIONSHIPS ====================
  const { parents, children, spouses } = useMemo(() => {
    if (!person || !relationships.length) {
      return { parents: [], children: [], spouses: [] };
    }

    const parentTypes = ['parent', 'adopted-parent', 'foster-parent'];

    return {
      parents: relationships.filter(rel =>
        parentTypes.includes(rel.relationshipType) && rel.person2Id === person.id
      ),
      children: relationships.filter(rel =>
        parentTypes.includes(rel.relationshipType) && rel.person1Id === person.id
      ),
      spouses: relationships.filter(rel =>
        rel.relationshipType === 'spouse' &&
        (rel.person1Id === person.id || rel.person2Id === person.id)
      )
    };
  }, [person, relationships]);

  // ==================== EMPTY STATE ====================
  if (!person) {
    return (
      <div className="person-card person-card--empty">
        <Icon name="user" size={32} className="person-card__empty-icon" />
        <p className="person-card__empty-text">
          Click on a person in the tree to see their details
        </p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={person.id}
        className="person-card"
        style={{ '--legitimacy-color': legitimacyColor }}
        variants={CARD_VARIANTS}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Header */}
        <div
          className="person-card__header"
          style={{
            '--house-color': house?.colorCode || 'var(--text-tertiary)',
            backgroundColor: house?.colorCode ? `${house.colorCode}15` : 'var(--bg-tertiary)'
          }}
        >
          <h2 className="person-card__name">
            {person.firstName} {person.lastName}
          </h2>
          {person.maidenName && (
            <p className="person-card__maiden-name">
              (née {person.maidenName})
            </p>
          )}
        </div>

        {/* Details */}
        <motion.div
          className="person-card__body"
          variants={SECTION_VARIANTS}
          initial="hidden"
          animate="visible"
        >
          {/* House */}
          <div className="person-card__section">
            <h3 className="person-card__section-title">
              <Icon name="castle" size={14} />
              <span>House</span>
            </h3>
            <div className="person-card__house">
              {house && (
                <div
                  className="person-card__house-color"
                  style={{ backgroundColor: house.colorCode }}
                />
              )}
              <span className="person-card__house-name">{house?.houseName || 'Unknown'}</span>
            </div>
          </div>

          {/* Dates */}
          {(person.dateOfBirth || person.dateOfDeath) && (
            <div className="person-card__section">
              <h3 className="person-card__section-title">
                <Icon name="calendar" size={14} />
                <span>Lifespan</span>
              </h3>
              <p className="person-card__text">
                {person.dateOfBirth && `Born: ${person.dateOfBirth}`}
                {person.dateOfBirth && person.dateOfDeath && ' • '}
                {person.dateOfDeath && `Died: ${person.dateOfDeath}`}
              </p>
            </div>
          )}

          {/* Gender */}
          <div className="person-card__section">
            <h3 className="person-card__section-title">
              <Icon name="user" size={14} />
              <span>Gender</span>
            </h3>
            <p className="person-card__text person-card__text--capitalize">
              {person.gender}
            </p>
          </div>

          {/* Legitimacy Status */}
          {person.legitimacyStatus !== 'legitimate' && (
            <div className="person-card__section">
              <h3 className="person-card__section-title">
                <Icon name="info" size={14} />
                <span>Status</span>
              </h3>
              <span className={`person-card__badge person-card__badge--${person.legitimacyStatus}`}>
                {person.legitimacyStatus.charAt(0).toUpperCase() + person.legitimacyStatus.slice(1)}
              </span>
            </div>
          )}

          {/* Biography Link */}
          {person.codexEntryId && (
            <div className="person-card__section">
              <h3 className="person-card__section-title">
                <Icon name="book-open" size={14} />
                <span>Biography</span>
              </h3>
              {loadingEntry ? (
                <span className="person-card__loading">Loading...</span>
              ) : (() => {
                const status = getBiographyStatus(codexEntry, false);
                return (
                  <div className="person-card__biography">
                    <span
                      className="person-card__biography-status"
                      style={{
                        backgroundColor: status.style.backgroundColor,
                        color: status.style.color,
                        borderColor: status.style.borderColor
                      }}
                      title={status.description}
                    >
                      <span>{status.icon}</span>
                      <span>{status.label}</span>
                    </span>

                    <Link
                      to={`/codex/entry/${person.codexEntryId}`}
                      className="person-card__biography-link"
                    >
                      <span>View</span>
                      <Icon name="arrow-right" size={12} />
                    </Link>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Titles */}
          {isFeatureEnabled('MODULE_1E.TITLES_SYSTEM') && person.titles?.length > 0 && (
            <div className="person-card__section">
              <h3 className="person-card__section-title">
                <Icon name="crown" size={14} />
                <span>Titles</span>
              </h3>
              <div className="person-card__titles">
                {person.titles.map((title, idx) => (
                  <span key={idx} className="person-card__title-badge">
                    {title}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Species */}
          {isFeatureEnabled('MODULE_1E.SPECIES_FIELD') && person.species && (
            <div className="person-card__section">
              <h3 className="person-card__section-title">
                <Icon name="sparkles" size={14} />
                <span>Species</span>
              </h3>
              <p className="person-card__text">{person.species}</p>
            </div>
          )}

          {/* Magical Bloodline */}
          {isFeatureEnabled('MODULE_1E.MAGICAL_BLOODLINES') && person.magicalBloodline && (
            <div className="person-card__section">
              <h3 className="person-card__section-title">
                <Icon name="zap" size={14} />
                <span>Magical Bloodline</span>
              </h3>
              <p className="person-card__text">{person.magicalBloodline}</p>
            </div>
          )}

          {/* Relationships */}
          <div className="person-card__section person-card__section--relationships">
            <h3 className="person-card__section-title">
              <Icon name="users" size={14} />
              <span>Relationships</span>
            </h3>

            {/* Parents */}
            {parents.length > 0 && (
              <div className="person-card__relationship-group">
                <p className="person-card__relationship-label">Parents:</p>
                {parents.map((rel, idx) => (
                  <p key={idx} className="person-card__relationship-item">
                    <Icon name="user" size={12} />
                    <span>{getPersonName(rel.person1Id)}</span>
                    {rel.relationshipType === 'adopted-parent' && (
                      <span className="person-card__relationship-note">(adopted)</span>
                    )}
                    {rel.relationshipType === 'foster-parent' && (
                      <span className="person-card__relationship-note">(foster)</span>
                    )}
                  </p>
                ))}
              </div>
            )}

            {/* Spouses */}
            {spouses.length > 0 && (
              <div className="person-card__relationship-group">
                <p className="person-card__relationship-label">Spouse(s):</p>
                {spouses.map((rel, idx) => {
                  const spouseId = rel.person1Id === person.id ? rel.person2Id : rel.person1Id;
                  return (
                    <p key={idx} className="person-card__relationship-item">
                      <Icon name="heart" size={12} />
                      <span>{getPersonName(spouseId)}</span>
                      <span className="person-card__relationship-note">({rel.marriageStatus})</span>
                    </p>
                  );
                })}
              </div>
            )}

            {/* Children */}
            {children.length > 0 && (
              <div className="person-card__relationship-group">
                <p className="person-card__relationship-label">Children:</p>
                {children.map((rel, idx) => (
                  <p key={idx} className="person-card__relationship-item">
                    <Icon name="user" size={12} />
                    <span>{getPersonName(rel.person2Id)}</span>
                    {rel.relationshipType === 'adopted-parent' && (
                      <span className="person-card__relationship-note">(adopted)</span>
                    )}
                    {rel.relationshipType === 'foster-parent' && (
                      <span className="person-card__relationship-note">(foster)</span>
                    )}
                  </p>
                ))}
              </div>
            )}

            {parents.length === 0 && spouses.length === 0 && children.length === 0 && (
              <p className="person-card__empty-relationships">No relationships recorded</p>
            )}
          </div>

          {/* Notes */}
          {person.notes && (
            <div className="person-card__section person-card__section--notes">
              <h3 className="person-card__section-title">
                <Icon name="file-text" size={14} />
                <span>Notes</span>
              </h3>
              <p className="person-card__notes">{person.notes}</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default PersonCard;
