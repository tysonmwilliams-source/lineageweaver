/**
 * BugTracker.jsx - Bug Management Page
 *
 * PURPOSE:
 * A dedicated page for viewing, managing, and exporting bug reports.
 * Includes filtering, bulk actions, and Claude Code export functionality.
 *
 * FEATURES:
 * - View all bugs with filters (status, priority, system)
 * - Update bug status and priority
 * - Delete individual or resolved bugs
 * - Export to markdown for Claude Code
 * - Statistics dashboard
 * - Framer Motion animations
 * - Lucide icons via Icon component
 */

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBugTracker } from '../contexts/BugContext';
import Navigation from '../components/Navigation';
import Icon from '../components/icons';
import ActionButton from '../components/shared/ActionButton';
import LoadingState from '../components/shared/LoadingState';
import EmptyState from '../components/shared/EmptyState';
import './BugTracker.css';

// ==================== ANIMATION VARIANTS ====================
const PAGE_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, staggerChildren: 0.05 }
  }
};

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', damping: 20, stiffness: 300 }
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2 }
  }
};

const EXPAND_VARIANTS = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.2 }
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.15 }
  }
};

const STAT_VARIANTS = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', damping: 15, stiffness: 200 }
  }
};

// ==================== CONSTANTS ====================
const STATUS_CONFIG = {
  all: { label: 'All Statuses', icon: 'list', color: 'gray' },
  open: { label: 'Open', icon: 'circle', color: 'blue' },
  'in-progress': { label: 'In Progress', icon: 'clock', color: 'amber' },
  resolved: { label: 'Resolved', icon: 'check-circle', color: 'green' }
};

const PRIORITY_CONFIG = {
  all: { label: 'All Priorities', icon: 'sliders', color: 'gray' },
  critical: { label: 'Critical', icon: 'alert', color: 'red' },
  high: { label: 'High', icon: 'arrow-up', color: 'orange' },
  medium: { label: 'Medium', icon: 'minus', color: 'blue' },
  low: { label: 'Low', icon: 'arrow-down', color: 'green' }
};

const SYSTEM_CONFIG = {
  all: { label: 'All Systems', icon: 'globe', color: 'gray' },
  general: { label: 'General', icon: 'settings', color: 'gray' },
  tree: { label: 'Family Tree', icon: 'tree', color: 'green' },
  codex: { label: 'The Codex', icon: 'book-open', color: 'blue' },
  armory: { label: 'The Armory', icon: 'shield', color: 'amber' },
  dignities: { label: 'Dignities', icon: 'crown', color: 'purple' }
};

// ==================== HELPER COMPONENTS ====================

/**
 * BugCard - Displays a single bug with actions
 */
function BugCard({ bug, onUpdate, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const statusConfig = STATUS_CONFIG[bug.status] || STATUS_CONFIG.open;
  const priorityConfig = PRIORITY_CONFIG[bug.priority] || PRIORITY_CONFIG.medium;
  const systemConfig = SYSTEM_CONFIG[bug.system || 'general'];

  const handleStatusChange = async (newStatus) => {
    await onUpdate(bug.id, { status: newStatus });
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this bug report?')) {
      setIsDeleting(true);
      await onDelete(bug.id);
    }
  };

  return (
    <motion.div
      className={`bug-card bug-card--${bug.status} bug-card--priority-${bug.priority}`}
      variants={CARD_VARIANTS}
      layout
      whileHover={{ y: -2 }}
    >
      <div
        className="bug-card__header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="bug-card__title-row">
          <span className="bug-card__id">#{bug.id}</span>
          <h3 className="bug-card__title">{bug.title}</h3>
          <motion.span
            className="bug-card__expand"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Icon name="chevron-down" size={18} />
          </motion.span>
        </div>

        <div className="bug-card__meta">
          <span className={`bug-card__badge bug-card__badge--priority-${bug.priority}`}>
            <Icon name={priorityConfig.icon} size={12} />
            <span>{bug.priority}</span>
          </span>
          <span className="bug-card__badge bug-card__badge--status">
            <Icon name={statusConfig.icon} size={12} />
            <span>{bug.status}</span>
          </span>
          <span className="bug-card__badge bug-card__badge--system">
            <Icon name={systemConfig.icon} size={12} />
            <span>{bug.system || 'general'}</span>
          </span>
          <span className="bug-card__date">
            <Icon name="calendar" size={12} />
            <span>{new Date(bug.created).toLocaleDateString()}</span>
          </span>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="bug-card__body"
            variants={EXPAND_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {bug.description && (
              <div className="bug-card__section">
                <h4 className="bug-card__section-title">
                  <Icon name="file-text" size={14} />
                  <span>Description</span>
                </h4>
                <p className="bug-card__section-text">{bug.description}</p>
              </div>
            )}

            {bug.stepsToReproduce && (
              <div className="bug-card__section">
                <h4 className="bug-card__section-title">
                  <Icon name="list" size={14} />
                  <span>Steps to Reproduce</span>
                </h4>
                <pre className="bug-card__code">{bug.stepsToReproduce}</pre>
              </div>
            )}

            <div className="bug-card__context">
              {bug.page && (
                <span className="bug-card__context-item">
                  <Icon name="map-pin" size={14} />
                  <span>{bug.page}</span>
                </span>
              )}
              {bug.browser && (
                <span className="bug-card__context-item">
                  <Icon name="globe" size={14} />
                  <span>{bug.browser}</span>
                </span>
              )}
              {bug.viewport && (
                <span className="bug-card__context-item">
                  <Icon name="maximize" size={14} />
                  <span>{bug.viewport}</span>
                </span>
              )}
              {bug.theme && (
                <span className="bug-card__context-item">
                  <Icon name="palette" size={14} />
                  <span>{bug.theme}</span>
                </span>
              )}
            </div>

            {bug.screenshot && (
              <div className="bug-card__section">
                <h4 className="bug-card__section-title">
                  <Icon name="image" size={14} />
                  <span>Screenshot</span>
                </h4>
                <img
                  src={bug.screenshot}
                  alt="Bug screenshot"
                  className="bug-card__screenshot"
                />
              </div>
            )}

            {bug.notes && (
              <div className="bug-card__section">
                <h4 className="bug-card__section-title">
                  <Icon name="pen" size={14} />
                  <span>Developer Notes</span>
                </h4>
                <p className="bug-card__notes">{bug.notes}</p>
              </div>
            )}

            <div className="bug-card__actions">
              <div className="bug-card__status-actions">
                <span className="bug-card__action-label">Status:</span>
                {['open', 'in-progress', 'resolved'].map(status => (
                  <button
                    key={status}
                    className={`bug-card__status-btn ${bug.status === status ? 'bug-card__status-btn--active' : ''}`}
                    onClick={() => handleStatusChange(status)}
                  >
                    <Icon name={STATUS_CONFIG[status].icon} size={14} />
                    <span>{status}</span>
                  </button>
                ))}
              </div>

              <ActionButton
                variant="danger"
                size="sm"
                icon="trash"
                onClick={handleDelete}
                disabled={isDeleting}
                loading={isDeleting}
              >
                Delete
              </ActionButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ==================== MAIN COMPONENT ====================

function BugTracker() {
  const {
    bugs,
    loading,
    statistics,
    updateBug,
    deleteBug,
    downloadExport
  } = useBugTracker();

  // ==================== FILTER STATE ====================
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [systemFilter, setSystemFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // ==================== FILTERED BUGS ====================
  const filteredBugs = useMemo(() => {
    return bugs.filter(bug => {
      if (statusFilter !== 'all' && bug.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && bug.priority !== priorityFilter) return false;
      if (systemFilter !== 'all' && (bug.system || 'general') !== systemFilter) return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = bug.title?.toLowerCase().includes(query);
        const matchesDesc = bug.description?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      return true;
    })
    .sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.created) - new Date(a.created);
    });
  }, [bugs, statusFilter, priorityFilter, systemFilter, searchQuery]);

  // ==================== HANDLERS ====================

  const handleExport = useCallback(async () => {
    try {
      await downloadExport();
    } catch (err) {
      alert('Failed to export bugs: ' + err.message);
    }
  }, [downloadExport]);

  const handleClearResolved = useCallback(async () => {
    const resolvedCount = bugs.filter(b => b.status === 'resolved').length;
    if (resolvedCount === 0) {
      alert('No resolved bugs to clear.');
      return;
    }

    if (window.confirm(`Delete all ${resolvedCount} resolved bugs?`)) {
      const resolved = bugs.filter(b => b.status === 'resolved');
      for (const bug of resolved) {
        await deleteBug(bug.id);
      }
    }
  }, [bugs, deleteBug]);

  // ==================== RENDER ====================

  if (loading) {
    return (
      <div className="bug-tracker">
        <Navigation />
        <div className="bug-tracker__loading">
          <LoadingState message="Loading bug reports..." icon="alert" />
        </div>
      </div>
    );
  }

  return (
    <div className="bug-tracker">
      <Navigation />

      <motion.main
        className="bug-tracker__main"
        variants={PAGE_VARIANTS}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <header className="bug-tracker__header">
          <div className="bug-tracker__title-row">
            <h1 className="bug-tracker__title">
              <Icon name="alert" size={28} />
              <span>Bug Tracker</span>
            </h1>
            <div className="bug-tracker__header-actions">
              <ActionButton
                variant="primary"
                icon="download"
                onClick={handleExport}
              >
                Export for Claude Code
              </ActionButton>
              <ActionButton
                variant="ghost"
                icon="trash"
                onClick={handleClearResolved}
              >
                Clear Resolved
              </ActionButton>
            </div>
          </div>

          {/* Statistics */}
          <motion.div
            className="bug-tracker__stats"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          >
            <motion.div className="bug-tracker__stat bug-tracker__stat--total" variants={STAT_VARIANTS}>
              <span className="bug-tracker__stat-value">{statistics.total}</span>
              <span className="bug-tracker__stat-label">Total</span>
            </motion.div>
            <motion.div className="bug-tracker__stat bug-tracker__stat--open" variants={STAT_VARIANTS}>
              <Icon name="circle" size={16} />
              <span className="bug-tracker__stat-value">{statistics.open}</span>
              <span className="bug-tracker__stat-label">Open</span>
            </motion.div>
            <motion.div className="bug-tracker__stat bug-tracker__stat--progress" variants={STAT_VARIANTS}>
              <Icon name="clock" size={16} />
              <span className="bug-tracker__stat-value">{statistics.inProgress}</span>
              <span className="bug-tracker__stat-label">In Progress</span>
            </motion.div>
            <motion.div className="bug-tracker__stat bug-tracker__stat--resolved" variants={STAT_VARIANTS}>
              <Icon name="check-circle" size={16} />
              <span className="bug-tracker__stat-value">{statistics.resolved}</span>
              <span className="bug-tracker__stat-label">Resolved</span>
            </motion.div>
            {statistics.critical > 0 && (
              <motion.div className="bug-tracker__stat bug-tracker__stat--critical" variants={STAT_VARIANTS}>
                <Icon name="alert" size={16} />
                <span className="bug-tracker__stat-value">{statistics.critical}</span>
                <span className="bug-tracker__stat-label">Critical!</span>
              </motion.div>
            )}
          </motion.div>
        </header>

        {/* Filters */}
        <div className="bug-tracker__filters">
          <div className="bug-tracker__search-wrapper">
            <Icon name="search" size={18} className="bug-tracker__search-icon" />
            <input
              type="text"
              className="bug-tracker__search"
              placeholder="Search bugs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="bug-tracker__search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <Icon name="x" size={16} />
              </button>
            )}
          </div>

          <div className="bug-tracker__filter-group">
            <div className="bug-tracker__filter-wrapper">
              <Icon name="list" size={16} className="bug-tracker__filter-icon" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bug-tracker__filter"
              >
                {Object.entries(STATUS_CONFIG).map(([value, config]) => (
                  <option key={value} value={value}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="bug-tracker__filter-wrapper">
              <Icon name="sliders" size={16} className="bug-tracker__filter-icon" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bug-tracker__filter"
              >
                {Object.entries(PRIORITY_CONFIG).map(([value, config]) => (
                  <option key={value} value={value}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="bug-tracker__filter-wrapper">
              <Icon name="globe" size={16} className="bug-tracker__filter-icon" />
              <select
                value={systemFilter}
                onChange={(e) => setSystemFilter(e.target.value)}
                className="bug-tracker__filter"
              >
                {Object.entries(SYSTEM_CONFIG).map(([value, config]) => (
                  <option key={value} value={value}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bug List */}
        <div className="bug-tracker__list">
          <AnimatePresence mode="popLayout">
            {filteredBugs.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <EmptyState
                  icon="check-circle"
                  title="No bugs found"
                  description={
                    bugs.length === 0
                      ? "You haven't reported any bugs yet. Use the floating bug button to report issues!"
                      : "No bugs match your current filters. Try adjusting them."
                  }
                />
              </motion.div>
            ) : (
              filteredBugs.map(bug => (
                <BugCard
                  key={bug.id}
                  bug={bug}
                  onUpdate={updateBug}
                  onDelete={deleteBug}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Results count */}
        {filteredBugs.length > 0 && (
          <motion.div
            className="bug-tracker__footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Icon name="info" size={14} />
            <span>Showing {filteredBugs.length} of {bugs.length} bugs</span>
          </motion.div>
        )}
      </motion.main>
    </div>
  );
}

export default BugTracker;
