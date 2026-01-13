import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getEntriesByType } from '../services/codexService';
import Navigation from '../components/Navigation';
import Icon from '../components/icons/Icon';
import LoadingState from '../components/shared/LoadingState';
import EmptyState from '../components/shared/EmptyState';
import ActionButton from '../components/shared/ActionButton';
import './CodexBrowse.css';

/**
 * CodexBrowse - Browse Codex Entries by Type
 *
 * Features:
 * - Filterable, sortable, paginated list of entries
 * - Advanced filtering (search, tags, era)
 * - Sorting (title, date, word count)
 * - Statistics panel
 * - Animated list items
 */

// Animation variants
const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const LIST_ITEM_VARIANTS = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

// Type configuration
const TYPE_CONFIG = {
  personage: { icon: 'user', label: 'Personages', singular: 'Personage' },
  house: { icon: 'castle', label: 'Houses', singular: 'House' },
  location: { icon: 'map-pin', label: 'Locations', singular: 'Location' },
  event: { icon: 'swords', label: 'Events', singular: 'Event' },
  mysteria: { icon: 'sparkles', label: 'Mysteria', singular: 'Mysteria' },
  heraldry: { icon: 'shield', label: 'Heraldry', singular: 'Heraldry' },
  custom: { icon: 'scroll-text', label: 'Entries', singular: 'Entry' }
};

function CodexBrowse() {
  const { type } = useParams();
  const navigate = useNavigate();

  const [allEntries, setAllEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [displayedEntries, setDisplayedEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updated');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedEra, setSelectedEra] = useState('');
  const [availableTags, setAvailableTags] = useState([]);
  const [availableEras, setAvailableEras] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 20;

  // Statistics
  const [statistics, setStatistics] = useState({
    total: 0,
    totalWords: 0
  });

  // Get type configuration
  const typeConfig = useMemo(() => {
    return TYPE_CONFIG[type] || TYPE_CONFIG.custom;
  }, [type]);

  // Calculate statistics
  const calculateStatistics = useCallback((entries) => {
    setStatistics({
      total: entries.length,
      totalWords: entries.reduce((sum, e) => sum + (e.wordCount || 0), 0)
    });
  }, []);

  // Load entries
  const loadEntries = useCallback(async () => {
    try {
      setLoading(true);

      const entries = await getEntriesByType(type);
      setAllEntries(entries);

      // Extract unique tags and eras
      const tags = new Set();
      const eras = new Set();

      entries.forEach(entry => {
        if (entry.tags) {
          entry.tags.forEach(tag => tags.add(tag));
        }
        if (entry.era) {
          eras.add(entry.era);
        }
      });

      setAvailableTags(Array.from(tags).sort());
      setAvailableEras(Array.from(eras).sort());
      calculateStatistics(entries);
      setLoading(false);
    } catch (error) {
      console.error('Error loading entries:', error);
      setLoading(false);
    }
  }, [type, calculateStatistics]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  // Apply filters and sorting
  const applyFiltersAndSort = useCallback(() => {
    let filtered = [...allEntries];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(entry =>
        entry.title.toLowerCase().includes(searchLower) ||
        entry.subtitle?.toLowerCase().includes(searchLower) ||
        entry.content?.toLowerCase().includes(searchLower)
      );
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(entry =>
        entry.tags && selectedTags.some(tag => entry.tags.includes(tag))
      );
    }

    // Apply era filter
    if (selectedEra) {
      filtered = filtered.filter(entry => entry.era === selectedEra);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'updated':
          return new Date(b.updated) - new Date(a.updated);
        case 'wordCount':
          return (b.wordCount || 0) - (a.wordCount || 0);
        default:
          return 0;
      }
    });

    setFilteredEntries(filtered);
    setCurrentPage(1);
  }, [allEntries, searchTerm, sortBy, selectedTags, selectedEra]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  // Paginate entries
  useEffect(() => {
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    setDisplayedEntries(filteredEntries.slice(startIndex, endIndex));
  }, [filteredEntries, currentPage]);

  // Handlers
  const handleViewEntry = useCallback((entryId) => {
    navigate(`/codex/entry/${entryId}`);
  }, [navigate]);

  const handleCreateEntry = useCallback(() => {
    navigate(`/codex/create?type=${type}`);
  }, [navigate, type]);

  const handleBackToCodex = useCallback(() => {
    navigate('/codex');
  }, [navigate]);

  const toggleTag = useCallback((tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedTags([]);
    setSelectedEra('');
    setSortBy('updated');
  }, []);

  // Format date for display
  const formatDate = useCallback((isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  }, []);

  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);
  const hasFilters = searchTerm || selectedTags.length > 0 || selectedEra;

  // Loading state
  if (loading) {
    return (
      <>
        <Navigation />
        <div className="browse-page">
          <div className="browse-container">
            <LoadingState message={`Loading ${typeConfig.label}...`} icon={typeConfig.icon} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />

      <div className="browse-page">
        <motion.div
          className="browse-container"
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          animate="visible"
        >
          {/* Breadcrumb */}
          <motion.nav className="browse-breadcrumb" variants={ITEM_VARIANTS}>
            <button onClick={handleBackToCodex} className="browse-breadcrumb__link">
              <Icon name="book-open" size={14} />
              <span>The Codex</span>
            </button>
            <Icon name="chevron-right" size={14} className="browse-breadcrumb__separator" />
            <span className="browse-breadcrumb__current">{typeConfig.label}</span>
          </motion.nav>

          {/* Header */}
          <motion.header className="browse-header" variants={ITEM_VARIANTS}>
            <div className="browse-header__main">
              <div className="browse-header__icon">
                <Icon name={typeConfig.icon} size={32} />
              </div>
              <div className="browse-header__text">
                <h1 className="browse-header__title">
                  <span className="browse-header__initial">{typeConfig.label.charAt(0)}</span>
                  {typeConfig.label.slice(1)}
                </h1>
                <p className="browse-header__subtitle">
                  {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
                  {hasFilters && ` (filtered from ${allEntries.length})`}
                </p>
              </div>
            </div>

            <ActionButton
              icon="plus"
              onClick={handleCreateEntry}
              variant="primary"
            >
              Create New
            </ActionButton>
          </motion.header>

          {/* Statistics */}
          <motion.section className="browse-stats" variants={ITEM_VARIANTS}>
            <div className="browse-stats__card">
              <Icon name="scroll-text" size={20} />
              <div className="browse-stats__value">{statistics.total}</div>
              <div className="browse-stats__label">Total Entries</div>
            </div>
            <div className="browse-stats__card">
              <Icon name="file-text" size={20} />
              <div className="browse-stats__value">{statistics.totalWords.toLocaleString()}</div>
              <div className="browse-stats__label">Total Words</div>
            </div>
          </motion.section>

          {/* Filters */}
          <motion.section className="browse-filters" variants={ITEM_VARIANTS}>
            {/* Search */}
            <div className="browse-filters__search">
              <Icon name="search" size={18} className="browse-filters__search-icon" />
              <input
                type="text"
                className="browse-filters__search-input"
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="browse-filters__search-clear"
                  onClick={() => setSearchTerm('')}
                >
                  <Icon name="x" size={16} />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="browse-filters__group">
              <label className="browse-filters__label">
                <Icon name="arrow-up-down" size={14} />
                <span>Sort:</span>
              </label>
              <select
                className="browse-filters__select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="updated">Recently Updated</option>
                <option value="title">Title (A-Z)</option>
                <option value="wordCount">Word Count</option>
              </select>
            </div>

            {/* Era Filter */}
            {availableEras.length > 0 && (
              <div className="browse-filters__group">
                <label className="browse-filters__label">
                  <Icon name="clock" size={14} />
                  <span>Era:</span>
                </label>
                <select
                  className="browse-filters__select"
                  value={selectedEra}
                  onChange={(e) => setSelectedEra(e.target.value)}
                >
                  <option value="">All Eras</option>
                  {availableEras.map(era => (
                    <option key={era} value={era}>{era}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Clear Filters */}
            {hasFilters && (
              <button className="browse-filters__clear" onClick={clearFilters}>
                <Icon name="x-circle" size={14} />
                <span>Clear Filters</span>
              </button>
            )}
          </motion.section>

          {/* Tag Filters */}
          {availableTags.length > 0 && (
            <motion.section className="browse-tags" variants={ITEM_VARIANTS}>
              <label className="browse-tags__label">
                <Icon name="tags" size={14} />
                <span>Filter by tags:</span>
              </label>
              <div className="browse-tags__list">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    className={`browse-tags__item ${selectedTags.includes(tag) ? 'browse-tags__item--active' : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    <Icon name="tag" size={12} />
                    <span>{tag}</span>
                  </button>
                ))}
              </div>
            </motion.section>
          )}

          {/* Entries List */}
          <AnimatePresence mode="wait">
            {displayedEntries.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <EmptyState
                  icon={typeConfig.icon}
                  title={hasFilters ? 'No Matching Entries' : `No ${typeConfig.label} Yet`}
                  description={
                    hasFilters
                      ? 'Try adjusting your filters or search terms.'
                      : `Create your first ${typeConfig.singular.toLowerCase()} entry to get started.`
                  }
                  action={!hasFilters ? {
                    label: 'Create First Entry',
                    onClick: handleCreateEntry,
                    icon: 'plus'
                  } : undefined}
                />
              </motion.div>
            ) : (
              <motion.section
                key="list"
                className="browse-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {displayedEntries.map((entry, index) => (
                  <motion.article
                    key={entry.id}
                    className="browse-list__item"
                    variants={LIST_ITEM_VARIANTS}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.03 }}
                    onClick={() => handleViewEntry(entry.id)}
                    whileHover={{ x: 4 }}
                  >
                    <div className="browse-list__item-main">
                      <div className="browse-list__item-icon">
                        <Icon name={typeConfig.icon} size={20} />
                      </div>
                      <div className="browse-list__item-content">
                        <h3 className="browse-list__item-title">{entry.title}</h3>
                        {entry.subtitle && (
                          <p className="browse-list__item-subtitle">{entry.subtitle}</p>
                        )}
                        {entry.tags && entry.tags.length > 0 && (
                          <div className="browse-list__item-tags">
                            {entry.tags.slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="browse-list__item-tag">
                                {tag}
                              </span>
                            ))}
                            {entry.tags.length > 3 && (
                              <span className="browse-list__item-tag-more">
                                +{entry.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="browse-list__item-meta">
                      <span className="browse-list__item-meta-item">
                        <Icon name="file-text" size={12} />
                        <span>{entry.wordCount || 0} words</span>
                      </span>
                      <span className="browse-list__item-meta-separator">
                        <Icon name="circle" size={4} />
                      </span>
                      <span className="browse-list__item-meta-item">
                        <Icon name="clock" size={12} />
                        <span>{formatDate(entry.updated)}</span>
                      </span>
                      {entry.era && (
                        <>
                          <span className="browse-list__item-meta-separator">
                            <Icon name="circle" size={4} />
                          </span>
                          <span className="browse-list__item-meta-item browse-list__item-meta-era">
                            {entry.era}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="browse-list__item-arrow">
                      <Icon name="arrow-right" size={18} />
                    </div>
                  </motion.article>
                ))}
              </motion.section>
            )}
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.section className="browse-pagination" variants={ITEM_VARIANTS}>
              <button
                className="browse-pagination__button"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <Icon name="chevron-left" size={16} />
                <span>Previous</span>
              </button>

              <div className="browse-pagination__info">
                <span>Page {currentPage} of {totalPages}</span>
              </div>

              <button
                className="browse-pagination__button"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <span>Next</span>
                <Icon name="chevron-right" size={16} />
              </button>
            </motion.section>
          )}
        </motion.div>
      </div>
    </>
  );
}

export default CodexBrowse;
