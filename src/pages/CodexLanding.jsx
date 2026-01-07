import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllEntries,
  getCodexStatistics,
  getEntriesByType
} from '../services/codexService';
import { importSeedData, getImportPreview } from '../utils/import-seed-data';
import { useGenealogy } from '../contexts/GenealogyContext';
import Navigation from '../components/Navigation';
import './CodexLanding.css';

/**
 * Codex Landing Page - ENHANCED
 * 
 * Wikipedia-style landing with:
 * - "Article of Interest" (random entry)
 * - Search functionality
 * - Browse by category
 * - Recent updates
 * - Statistics
 */
function CodexLanding() {
  const navigate = useNavigate();
  
  // ═══════════════════════════════════════════════════════════════════════════
  // 🔗 TREE-CODEX INTEGRATION: Access people data for biography stats
  // ═══════════════════════════════════════════════════════════════════════════
  const { people } = useGenealogy();
  
  const [statistics, setStatistics] = useState(null);
  const [recentEntries, setRecentEntries] = useState([]);
  const [articleOfInterest, setArticleOfInterest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    loadCodexData();
  }, []);
  
  async function loadCodexData() {
    try {
      setLoading(true);
      
      const stats = await getCodexStatistics();
      setStatistics(stats);
      
      const allEntries = await getAllEntries();
      
      // Get recent entries
      const sorted = allEntries.sort(
        (a, b) => new Date(b.updated) - new Date(a.updated)
      );
      setRecentEntries(sorted.slice(0, 5));
      
      // Select random "Article of Interest"
      if (allEntries.length > 0) {
        const randomIndex = Math.floor(Math.random() * allEntries.length);
        setArticleOfInterest(allEntries[randomIndex]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading codex data:', error);
      setLoading(false);
    }
  }
  
  async function handleImportSeedData() {
    const preview = getImportPreview();
    
    if (!window.confirm(
      `📚 Import House Wilfrey Codex Data\n\n` +
      `This will import ${preview.total} canonical entries:\n` +
      `• ${preview.houses} Houses\n` +
      `• ${preview.locations} Locations\n` +
      `• ${preview.events} Events\n` +
      `• ${preview.personages} Personages\n` +
      `• ${preview.mysteria} Mysteria\n\n` +
      `Continue?`
    )) {
      return;
    }
    
    setImporting(true);
    
    try {
      const results = await importSeedData();
      
      // Reload codex data to show new entries
      await loadCodexData();
      
      alert(
        `✅ Import Successful!\n\n` +
        `Imported ${results.houses.length + results.locations.length + results.events.length + results.personages.length + results.mysteria.length} entries in ${results.timing.duration}ms`
      );
    } catch (error) {
      console.error('Import failed:', error);
      alert(`❌ Import failed: ${error.message}`);
    } finally {
      setImporting(false);
    }
  }
  
function handleBrowseByType(type) {
  // Navigate to browse page for this type
  navigate(`/codex/browse/${type}`);
}
  
  function handleCreateEntryOfType(type, event) {
    event.stopPropagation();
    navigate(`/codex/create?type=${type}`);
  }
  
  function handleCreateEntry() {
    navigate('/codex/create');
  }
  
  function handleViewEntry(entryId) {
    navigate(`/codex/entry/${entryId}`);
  }
  
  function handleSearchSubmit(e) {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Future: Navigate to search results page
      // For now, alert (search page is Phase 2 Week 3)
      alert(`Search functionality coming in Phase 2 Week 3!\n\nSearching for: "${searchTerm}"`);
    }
  }
  
  function refreshArticleOfInterest() {
    if (recentEntries.length > 0) {
      const allEntries = [...recentEntries]; // This is a simplified version
      const randomIndex = Math.floor(Math.random() * allEntries.length);
      setArticleOfInterest(allEntries[randomIndex]);
    }
  }
  
  function getTypeIcon(type) {
    const icons = {
      personage: '👤',
      house: '🏰',
      location: '📍',
      event: '⚔️',
      mysteria: '✨',
      custom: '📜'
    };
    return icons[type] || '📜';
  }
  
  // Truncate text for preview
  function truncateText(text, maxLength = 300) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  }
  
  // Loading state
  if (loading) {
    return (
      <>
        <Navigation />
        <div className="codex-landing loading">
          <div className="loading-spinner">
            <div className="text-4xl mb-4">📜</div>
            <p>Opening The Codex...</p>
          </div>
        </div>
      </>
    );
  }
  
  // Main render
  return (
    <>
      <Navigation />
      <div className="codex-landing">
        
        {/* Header */}
        <header className="codex-header">
          <h1 className="codex-title">THE CODEX</h1>
          <p className="codex-subtitle">
            A Chronicle of Houses and Histories
          </p>
        </header>
        
        {/* Article of Interest (Wikipedia-style) */}
        {articleOfInterest && statistics && statistics.total > 0 && (
          <section className="codex-section article-of-interest-section">
            <div className="section-header-with-action">
              <h2 className="section-header">Article of Interest</h2>
              <button 
                className="refresh-button"
                onClick={refreshArticleOfInterest}
                title="Show different article"
              >
                🔄
              </button>
            </div>
            
            <div className="article-of-interest-card">
              <div className="article-header">
                <div className="article-type-badge">
                  <span className="type-icon">{getTypeIcon(articleOfInterest.type)}</span>
                  <span className="type-label">{articleOfInterest.type}</span>
                </div>
                <h3 className="article-title">{articleOfInterest.title}</h3>
                {articleOfInterest.subtitle && (
                  <p className="article-subtitle">{articleOfInterest.subtitle}</p>
                )}
              </div>
              
              <div className="article-preview">
                <p>{truncateText(articleOfInterest.content)}</p>
              </div>
              
              <div className="article-footer">
                <button 
                  className="read-more-button"
                  onClick={() => handleViewEntry(articleOfInterest.id)}
                >
                  Read More →
                </button>
                {articleOfInterest.tags && articleOfInterest.tags.length > 0 && (
                  <div className="article-tags-preview">
                    {articleOfInterest.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="tag-small">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
        
        {/* Search Section */}
        <div className="codex-search-section">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="codex-search-input"
              placeholder="🔍 Search all entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>
        
        {/* Browse by Category */}
        <section className="codex-section">
          <h2 className="section-header">Browse by Category</h2>
          
          <div className="entry-type-grid">
            <div className="entry-type-card-wrapper">
              <button 
                className="entry-type-card"
                onClick={() => handleBrowseByType('personage')}
              >
                <div className="card-icon">👤</div>
                <div className="card-label">Personages</div>
                <div className="card-count">
                  ({statistics?.byType.personage || 0})
                </div>
              </button>
              <button
                className="card-create-button"
                onClick={(e) => handleCreateEntryOfType('personage', e)}
                title="Create new personage entry"
              >
                +
              </button>
            </div>
            
            <div className="entry-type-card-wrapper">
              <button 
                className="entry-type-card"
                onClick={() => handleBrowseByType('house')}
              >
                <div className="card-icon">🏰</div>
                <div className="card-label">Houses</div>
                <div className="card-count">
                  ({statistics?.byType.house || 0})
                </div>
              </button>
              <button
                className="card-create-button"
                onClick={(e) => handleCreateEntryOfType('house', e)}
                title="Create new house entry"
              >
                +
              </button>
            </div>
            
            <div className="entry-type-card-wrapper">
              <button 
                className="entry-type-card"
                onClick={() => handleBrowseByType('location')}
              >
                <div className="card-icon">📍</div>
                <div className="card-label">Locations</div>
                <div className="card-count">
                  ({statistics?.byType.location || 0})
                </div>
              </button>
              <button
                className="card-create-button"
                onClick={(e) => handleCreateEntryOfType('location', e)}
                title="Create new location entry"
              >
                +
              </button>
            </div>
            
            <div className="entry-type-card-wrapper">
              <button 
                className="entry-type-card"
                onClick={() => handleBrowseByType('event')}
              >
                <div className="card-icon">⚔️</div>
                <div className="card-label">Events</div>
                <div className="card-count">
                  ({statistics?.byType.event || 0})
                </div>
              </button>
              <button
                className="card-create-button"
                onClick={(e) => handleCreateEntryOfType('event', e)}
                title="Create new event entry"
              >
                +
              </button>
            </div>
            
            <div className="entry-type-card-wrapper">
              <button 
                className="entry-type-card"
                onClick={() => handleBrowseByType('mysteria')}
              >
                <div className="card-icon">✨</div>
                <div className="card-label">Mysteria</div>
                <div className="card-count">
                  ({statistics?.byType.mysteria || 0})
                </div>
              </button>
              <button
                className="card-create-button"
                onClick={(e) => handleCreateEntryOfType('mysteria', e)}
                title="Create new mysteria entry"
              >
                +
              </button>
            </div>
            
            <div className="entry-type-card-wrapper">
              <button 
                className="entry-type-card"
                onClick={() => handleBrowseByType('custom')}
              >
                <div className="card-icon">📜</div>
                <div className="card-label">Custom</div>
                <div className="card-count">
                  ({statistics?.byType.custom || 0})
                </div>
              </button>
              <button
                className="card-create-button"
                onClick={(e) => handleCreateEntryOfType('custom', e)}
                title="Create new custom entry"
              >
                +
              </button>
            </div>
          </div>
        </section>
        
        {/* Recently Updated */}
        {recentEntries.length > 0 && (
          <section className="codex-section">
            <h2 className="section-header">Recently Updated</h2>
            <div className="recent-entries-list">
              {recentEntries.map(entry => (
                <button
                  key={entry.id}
                  className="recent-entry-item"
                  onClick={() => handleViewEntry(entry.id)}
                >
                  <div className="entry-info">
                    <span className="entry-title">{entry.title}</span>
                    <span className="entry-meta">
                      {entry.type} • {formatDate(entry.updated)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
        
        {/* Statistics */}
        {statistics && statistics.total > 0 && (
          <section className="codex-section">
            <h2 className="section-header">Codex Statistics</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{statistics.total}</div>
                <div className="stat-label">Total Entries</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {statistics.totalWords.toLocaleString()}
                </div>
                <div className="stat-label">Total Words</div>
              </div>
            </div>
          </section>
        )}
        
        {/* ═══════════════════════════════════════════════════════════════════
            🔗 TREE-CODEX INTEGRATION: Biography Completion Stats
            ═══════════════════════════════════════════════════════════════════
            Shows how many people have Codex entries and completion status.
            ═══════════════════════════════════════════════════════════════════ */}
        {people && people.length > 0 && (() => {
          const peopleWithCodex = people.filter(p => p.codexEntryId);
          const peopleWithoutCodex = people.filter(p => !p.codexEntryId);
          const completionPercent = Math.round((peopleWithCodex.length / people.length) * 100);
          
          return (
            <section className="codex-section biography-stats-section">
              <h2 className="section-header">
                <span>📖</span> Biography Coverage
              </h2>
              
              <div className="biography-stats-card">
                {/* Progress Bar */}
                <div className="biography-progress">
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill"
                      style={{ width: `${completionPercent}%` }}
                    />
                  </div>
                  <div className="progress-label">
                    {completionPercent}% of people have Codex entries
                  </div>
                </div>
                
                {/* Stats Grid */}
                <div className="biography-stats-grid">
                  <div className="bio-stat-item">
                    <div className="bio-stat-value">{people.length}</div>
                    <div className="bio-stat-label">Total People</div>
                  </div>
                  <div className="bio-stat-item linked">
                    <div className="bio-stat-value">{peopleWithCodex.length}</div>
                    <div className="bio-stat-label">With Biographies</div>
                  </div>
                  <div className="bio-stat-item pending">
                    <div className="bio-stat-value">{peopleWithoutCodex.length}</div>
                    <div className="bio-stat-label">Awaiting Entry</div>
                  </div>
                </div>
                
                {/* Action hint if some people need entries */}
                {peopleWithoutCodex.length > 0 && (
                  <div className="biography-action-hint">
                    <span className="hint-icon">💡</span>
                    <span className="hint-text">
                      {peopleWithoutCodex.length} people need Codex entries. 
                      Use the <strong>Migration Tool</strong> in Data Management → Import/Export.
                    </span>
                  </div>
                )}
                
                {/* All complete message */}
                {peopleWithoutCodex.length === 0 && (
                  <div className="biography-complete-message">
                    <span className="complete-icon">✅</span>
                    <span className="complete-text">
                      All people have Codex entries!
                    </span>
                  </div>
                )}
              </div>
            </section>
          );
        })()}
        
        {/* Action Buttons */}
        <section className="codex-actions">
          <button 
            className="action-button primary"
            onClick={handleCreateEntry}
          >
            <span className="button-icon">+</span>
            Create New Entry
          </button>
          
          <button 
            className="action-button secondary"
            onClick={() => navigate('/tree')}
          >
            <span className="button-icon">🌳</span>
            View Family Trees
          </button>
          
          <button 
            className="action-button secondary"
            onClick={() => navigate('/codex/import')}
          >
            <span className="button-icon">📥</span>
            Import Worldbuilding
          </button>
          
          {statistics && statistics.total === 0 && (
            <button 
              className="action-button secondary"
              onClick={handleImportSeedData}
              disabled={importing}
              style={{
                background: 'linear-gradient(135deg, #8b4513 0%, #654321 100%)',
                color: '#f4e8d8',
                fontWeight: 'bold'
              }}
            >
              <span className="button-icon">📥</span>
              {importing ? 'Importing...' : 'Import House Wilfrey Data'}
            </button>
          )}
        </section>
        
        {/* Empty State (when no entries exist) */}
        {statistics && statistics.total === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📜</div>
            <h3 className="empty-state-title">The Codex Awaits</h3>
            <p className="empty-state-text">
              Begin documenting your world's history, characters, and lore.
              Create your first entry to get started.
            </p>
            <p className="empty-state-text" style={{ marginTop: '1rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              <strong>Quick Start:</strong> Import 23 canonical House Wilfrey entries to see The Codex in action!
            </p>
            <button 
              className="empty-state-button"
              onClick={handleImportSeedData}
              disabled={importing}
              style={{
                background: 'var(--accent-primary)',
                marginBottom: '1rem'
              }}
            >
              {importing ? '⏳ Importing...' : '📥 Import Sample Data'}
            </button>
            <button 
              className="empty-state-button"
              onClick={handleCreateEntry}
            >
              Create First Entry
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// Helper function to format dates
function formatDate(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    const hours = Math.floor(diffInHours);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else if (diffInHours < 168) {
    const days = Math.floor(diffInHours / 24);
    return `${days} days ago`;
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
}

export default CodexLanding;
