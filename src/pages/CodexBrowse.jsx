import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getEntriesByType, getAllEntries } from '../services/codexService';
import Navigation from '../components/Navigation';
import './CodexBrowse.css';

/**
 * Codex Browse Page
 * 
 * Displays filterable, sortable, paginated list of entries by type
 * 
 * Features:
 * - Hybrid list layout (elegant, information-rich)
 * - Advanced filtering (search, tags, era)
 * - Sorting (title, date, word count, references)
 * - Pagination (20 entries per page)
 * - Statistics panel
 */
function CodexBrowse() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [allEntries, setAllEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [displayedEntries, setDisplayedEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updated'); // title, updated, wordCount, references
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
    totalWords: 0,
    mostReferenced: null,
    recentlyUpdated: []
  });
  
  useEffect(() => {
    loadEntries();
  }, [type]);
  
  useEffect(() => {
    applyFiltersAndSort();
  }, [allEntries, searchTerm, sortBy, selectedTags, selectedEra]);
  
  useEffect(() => {
    paginateEntries();
  }, [filteredEntries, currentPage]);
  
  async function loadEntries() {
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
      
      // Calculate statistics
      calculateStatistics(entries);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading entries:', error);
      setLoading(false);
    }
  }
  
  function calculateStatistics(entries) {
    const stats = {
      total: entries.length,
      totalWords: entries.reduce((sum, e) => sum + (e.wordCount || 0), 0),
      mostReferenced: null,
      recentlyUpdated: entries
        .sort((a, b) => new Date(b.updated) - new Date(a.updated))
        .slice(0, 3)
    };
    
    setStatistics(stats);
  }
  
  function applyFiltersAndSort() {
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
        case 'references':
          // TODO: Implement when we have reference counts
          return 0;
        default:
          return 0;
      }
    });
    
    setFilteredEntries(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }
  
  function paginateEntries() {
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    setDisplayedEntries(filteredEntries.slice(startIndex, endIndex));
  }
  
  function handleViewEntry(entryId) {
    navigate(`/codex/entry/${entryId}`);
  }
  
  function handleCreateEntry() {
    navigate(`/codex/create?type=${type}`);
  }
  
  function toggleTag(tag) {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  }
  
  function clearFilters() {
    setSearchTerm('');
    setSelectedTags([]);
    setSelectedEra('');
    setSortBy('updated');
  }
  
  function formatDate(isoString) {
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
  }
  
  function getTypeIcon(entryType) {
    const icons = {
      personage: '👤',
      house: '🏰',
      location: '📍',
      event: '⚔️',
      mysteria: '✨',
      custom: '📜'
    };
    return icons[entryType] || '📜';
  }
  
  function getTypeLabel(entryType) {
    const labels = {
      personage: 'Personages',
      house: 'Houses',
      location: 'Locations',
      event: 'Events',
      mysteria: 'Mysteria',
      custom: 'Custom Entries'
    };
    return labels[entryType] || 'Entries';
  }
  
  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);
  const hasFilters = searchTerm || selectedTags.length > 0 || selectedEra;
  
  // Loading state
  if (loading) {
    return (
      <>
        <Navigation />
        <div className="browse-container loading">
          <div className="loading-spinner">
            <div className="text-4xl">📜</div>
            <p>Loading {getTypeLabel(type)}...</p>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Navigation />
      
      <div className="browse-container">
        <div className="browse-content">
          
          {/* Header */}
          <header className="browse-header">
            <div className="header-main">
              <div className="header-icon">{getTypeIcon(type)}</div>
              <div className="header-text">
                <h1 className="browse-title">{getTypeLabel(type)}</h1>
                <p className="browse-subtitle">
                  {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
                  {hasFilters && ` (filtered from ${allEntries.length})`}
                </p>
              </div>
            </div>
            
            <button className="create-button" onClick={handleCreateEntry}>
              <span className="button-icon">+</span>
              Create New
            </button>
          </header>
          
          {/* Filters & Search */}
          <section className="browse-filters">
            {/* Search */}
            <div className="filter-group search-group">
              <input
                type="text"
                className="search-input"
                placeholder="🔍 Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Sort */}
            <div className="filter-group sort-group">
              <label className="filter-label">Sort by:</label>
              <select 
                className="filter-select"
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
              <div className="filter-group era-group">
                <label className="filter-label">Era:</label>
                <select 
                  className="filter-select"
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
              <button className="clear-filters-button" onClick={clearFilters}>
                Clear Filters
              </button>
            )}
          </section>
          
          {/* Tag Filters */}
          {availableTags.length > 0 && (
            <section className="tag-filters">
              <label className="filter-label">Filter by tags:</label>
              <div className="tag-filter-list">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    className={`tag-filter ${selectedTags.includes(tag) ? 'active' : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </section>
          )}
          
          {/* Statistics Panel */}
          <section className="browse-stats">
            <div className="stat-card">
              <div className="stat-value">{statistics.total}</div>
              <div className="stat-label">Total Entries</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{statistics.totalWords.toLocaleString()}</div>
              <div className="stat-label">Total Words</div>
            </div>
          </section>
          
          {/* Entries List */}
          {displayedEntries.length === 0 ? (
            <div className="browse-empty">
              <div className="empty-icon">{getTypeIcon(type)}</div>
              <h3 className="empty-title">
                {hasFilters ? 'No Matching Entries' : `No ${getTypeLabel(type)} Yet`}
              </h3>
              <p className="empty-text">
                {hasFilters 
                  ? 'Try adjusting your filters or search terms.'
                  : `Create your first ${type} entry to get started.`
                }
              </p>
              {!hasFilters && (
                <button className="empty-create-button" onClick={handleCreateEntry}>
                  Create First Entry
                </button>
              )}
            </div>
          ) : (
            <>
              <section className="entries-list">
                {displayedEntries.map(entry => (
                  <article 
                    key={entry.id} 
                    className="entry-item"
                    onClick={() => handleViewEntry(entry.id)}
                  >
                    <div className="entry-main">
                      <div className="entry-icon">{getTypeIcon(type)}</div>
                      <div className="entry-content">
                        <h3 className="entry-title">{entry.title}</h3>
                        {entry.subtitle && (
                          <p className="entry-subtitle">{entry.subtitle}</p>
                        )}
                        {entry.tags && entry.tags.length > 0 && (
                          <div className="entry-tags">
                            {entry.tags.slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="entry-tag">{tag}</span>
                            ))}
                            {entry.tags.length > 3 && (
                              <span className="entry-tag-more">+{entry.tags.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="entry-meta">
                      <span className="meta-item">
                        {entry.wordCount || 0} words
                      </span>
                      <span className="meta-separator">•</span>
                      <span className="meta-item">
                        {formatDate(entry.updated)}
                      </span>
                      {entry.era && (
                        <>
                          <span className="meta-separator">•</span>
                          <span className="meta-item meta-era">{entry.era}</span>
                        </>
                      )}
                    </div>
                    
                    <div className="entry-arrow">→</div>
                  </article>
                ))}
              </section>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <section className="pagination">
                  <button 
                    className="pagination-button"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    ← Previous
                  </button>
                  
                  <div className="pagination-info">
                    Page {currentPage} of {totalPages}
                  </div>
                  
                  <button 
                    className="pagination-button"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next →
                  </button>
                </section>
              )}
            </>
          )}
          
        </div>
      </div>
    </>
  );
}

export default CodexBrowse;
