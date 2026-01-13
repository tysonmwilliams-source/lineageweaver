/**
 * PersonList.jsx - Person List Component
 *
 * PURPOSE:
 * Displays all people in an animated list with their key information.
 * Shows house affiliation and provides edit/delete options.
 * Uses Framer Motion for animations, Lucide icons, and BEM CSS.
 *
 * Props:
 * - people: Array of person objects
 * - houses: Array of house objects (to show house names)
 * - onEdit: Function to call when user wants to edit a person
 * - onDelete: Function to call when user wants to delete a person
 */

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './icons';
import ActionButton from './shared/ActionButton';
import EmptyState from './shared/EmptyState';
import './PersonList.css';

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
    x: -20,
    transition: { duration: 0.2 }
  }
};

// ==================== LEGITIMACY COLORS ====================
const LEGITIMACY_COLORS = {
  legitimate: 'var(--color-success)',
  bastard: 'var(--color-warning)',
  adopted: 'var(--color-info)',
  unknown: 'var(--text-tertiary)'
};

function PersonList({ people, houses, onEdit, onDelete }) {

  /**
   * Get house by ID
   */
  const getHouse = (houseId) => {
    return houses.find(h => h.id === houseId);
  };

  /**
   * Get house name by house ID
   */
  const getHouseName = (houseId) => {
    const house = getHouse(houseId);
    return house ? house.houseName : 'Unknown House';
  };

  /**
   * Get house color by house ID
   */
  const getHouseColor = (houseId) => {
    const house = getHouse(houseId);
    return house ? house.colorCode : 'var(--text-tertiary)';
  };

  /**
   * Format date for display
   */
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return dateStr;
  };

  // Memoize processed people with house data
  const processedPeople = useMemo(() => {
    return people.map(person => ({
      ...person,
      houseName: getHouseName(person.houseId),
      houseColor: getHouseColor(person.houseId),
      legitimacyColor: LEGITIMACY_COLORS[person.legitimacyStatus] || LEGITIMACY_COLORS.unknown
    }));
  }, [people, houses]);

  if (people.length === 0) {
    return (
      <EmptyState
        icon="user"
        title="No People Yet"
        description="Create your first person to start building your family tree."
      />
    );
  }

  return (
    <motion.div
      className="person-list"
      variants={LIST_VARIANTS}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence mode="popLayout">
        {processedPeople.map(person => (
          <motion.div
            key={person.id}
            className="person-list__item"
            style={{ '--legitimacy-color': person.legitimacyColor }}
            variants={ITEM_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
            whileHover={{ y: -2 }}
          >
            <div className="person-list__content">
              {/* Person Info */}
              <div className="person-list__info">
                {/* Name and House */}
                <div className="person-list__header">
                  <div
                    className="person-list__house-dot"
                    style={{ backgroundColor: person.houseColor }}
                    title={person.houseName}
                  />
                  <h3 className="person-list__name">
                    {person.firstName} {person.lastName}
                    {person.maidenName && (
                      <span className="person-list__maiden-name">
                        (née {person.maidenName})
                      </span>
                    )}
                  </h3>
                </div>

                {/* House affiliation */}
                <p className="person-list__house">
                  <Icon name="castle" size={14} />
                  <span>{person.houseName}</span>
                </p>

                {/* Dates */}
                {(person.dateOfBirth || person.dateOfDeath) && (
                  <p className="person-list__dates">
                    <Icon name="calendar" size={14} />
                    <span>
                      {person.dateOfBirth && `b. ${formatDate(person.dateOfBirth)}`}
                      {person.dateOfBirth && person.dateOfDeath && ' - '}
                      {person.dateOfDeath && `d. ${formatDate(person.dateOfDeath)}`}
                    </span>
                  </p>
                )}

                {/* Titles */}
                {person.titles && person.titles.length > 0 && (
                  <div className="person-list__titles">
                    {person.titles.map((title, idx) => (
                      <span key={idx} className="person-list__title-badge">
                        {title}
                      </span>
                    ))}
                  </div>
                )}

                {/* Badges row */}
                <div className="person-list__badges">
                  {/* Biography indicator */}
                  {person.codexEntryId && (
                    <span className="person-list__badge person-list__badge--biography">
                      <Icon name="book-open" size={12} />
                      <span>Biography</span>
                    </span>
                  )}

                  {/* Legitimacy badge */}
                  {person.legitimacyStatus !== 'legitimate' && (
                    <span
                      className={`person-list__badge person-list__badge--${person.legitimacyStatus}`}
                    >
                      {person.legitimacyStatus.charAt(0).toUpperCase() + person.legitimacyStatus.slice(1)}
                    </span>
                  )}
                </div>

                {/* Fantasy elements */}
                {(person.species || person.magicalBloodline) && (
                  <div className="person-list__fantasy">
                    {person.species && (
                      <span className="person-list__fantasy-item">
                        <Icon name="sparkles" size={14} />
                        <span>{person.species}</span>
                      </span>
                    )}
                    {person.magicalBloodline && (
                      <span className="person-list__fantasy-item">
                        <Icon name="zap" size={14} />
                        <span>{person.magicalBloodline}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="person-list__actions">
                <ActionButton
                  variant="ghost"
                  size="sm"
                  icon="edit"
                  onClick={() => onEdit(person)}
                  title="Edit person"
                >
                  Edit
                </ActionButton>
                <ActionButton
                  variant="danger"
                  size="sm"
                  icon="trash"
                  onClick={() => onDelete(person)}
                  title="Delete person"
                >
                  Delete
                </ActionButton>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

export default PersonList;
