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
import CodexCleanupTool from '../components/CodexCleanupTool';
import './CodexLanding.css';

/**
 * Codex Landing Page - ENHANCED v2
 * 
 * Wikipedia-style landing with:
 * - Quick Navigation (dynamic, not random)
 * - Search functionality
 * - Browse by category (including Concepts)
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
  const [quickNavData, setQuickNavData] = useState({
    majorHouses: [],
    lawAndGovernance: [],
    recentlyEdited: []
  });
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCleanupTool, setShowCleanupTool] = useState(false);
  
  useEffect(() => {
    loadCodexData();
  }, []);
  
  async function loadCodexData() {
    try {
      setLoading(true);
      
      const stats = await getCodexStatistics();
      setStatistics(stats);
      
      const allEntries = await getAllEntries();
      
      // Get recent entries (for Recently Updated section)
      const sorted = allEntries.sort(
        (a, b) => new Date(b.updated) - new Date(a.updated)
      );
      setRecentEntries(sorted.slice(0, 5));
      
      // Build Quick Navigation data
      const majorHouses = allEntries.filter(entry => 
        entry.category === 'Major Houses' ||
        (entry.tags && entry.tags.some(tag => 
          ['major-house', 'drihten', 'great-house'].includes(tag.toLowerCase())
        ))
      ).slice(0, 6);
      
      const lawAndGovernance = allEntries.filter(entry =>
        entry.category === 'Law & Governance' ||
        (entry.tags && entry.tags.some(tag =>
          ['charter', 'law', 'governance', 'driht', 'ward', 'fealty'].includes(tag.toLowerCase())
        ))
      ).slice(0, 6);
      
      // Recently edited (most recent 4, different from "Recently Updated" which shows all recent)
      const recentlyEdited = sorted.slice(0, 4);
      
      setQuickNavData({
        majorHouses,
        lawAndGovernance,
        recentlyEdited
      });
      
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
      // Navigate to browse page with search term
      navigate(`/codex/browse/all?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  }
  
  function getTypeIcon(type) {
    const icons = {
      personage: '👤',
      house: '🏰',
      location: '📍',
      event: '⚔️',
      mysteria: '✨',
      concept: '⚖️',
      heraldry: '🛡️',
      custom: '📜'
    };
    return icons[type] || '📜';
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
  
  // Check if we have content for Quick Navigation
  const hasQuickNavContent = 
    quickNavData.majorHouses.length > 0 || 
    quickNavData.lawAndGovernance.length > 0;
  
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
        
        {/* ═══════════════════════════════════════════════════════════════════
            QUICK NAVIGATION - Dynamic content hubs
            ═══════════════════════════════════════════════════════════════════ */}
        {hasQuickNavContent && (
          <section className="codex-section quick-nav-section">
            <h2 className="section-header">Quick Navigation</h2>
            
            <div className="quick-nav-grid">
              {/* Major Houses */}
              {quickNavData.majorHouses.length > 0 && (
                <div className="quick-nav-column">
                  <h3 className="quick-nav-heading">
                    <span className="heading-icon">🏰</span>
                    The Great Houses
                  </h3>
                  <ul className="quick-nav-list">
                    {quickNavData.majorHouses.map(entry => (
                      <li key={entry.id}>
                        <button 
                          className="quick-nav-link"
                          onClick={() => handleViewEntry(entry.id)}
                        >
                          {entry.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                  {quickNavData.majorHouses.length >= 6 && (
                    <button 
                      className="quick-nav-more"
                      onClick={() => handleBrowseByType('house')}
                    >
                      View all houses →
                    </button>
                  )}
                </div>
              )}
              
              {/* Law & Governance */}
              {quickNavData.lawAndGovernance.length > 0 && (
                <div className="quick-nav-column">
                  <h3 className="quick-nav-heading">
                    <span className="heading-icon">⚖️</span>
                    Law & Governance
                  </h3>
                  <ul className="quick-nav-list">
                    {quickNavData.lawAndGovernance.map(entry => (
                      <li key={entry.id}>
                        <button 
                          className="quick-nav-link"
                          onClick={() => handleViewEntry(entry.id)}
                        >
                          {entry.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                  {quickNavData.lawAndGovernance.length >= 6 && (
                    <button 
                      className="quick-nav-more"
                      onClick={() => handleBrowseByType('concept')}
                    >
                      View all concepts →
                    </button>
                  )}
                </div>
              )}
              
              {/* Recently Edited */}
              {quickNavData.recentlyEdited.length > 0 && (
                <div className="quick-nav-column">
                  <h3 className="quick-nav-heading">
                    <span className="heading-icon">✏️</span>
                    Recently Edited
                  </h3>
                  <ul className="quick-nav-list">
                    {quickNavData.recentlyEdited.map(entry => (
                      <li key={entry.id}>
                        <button 
                          className="quick-nav-link"
                          onClick={() => handleViewEntry(entry.id)}
                        >
                          <span className="entry-type-indicator">{getTypeIcon(entry.type)}</span>
                          {entry.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}
        
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
            
            {/* NEW: Concepts Category */}
            <div className="entry-type-card-wrapper">
              <button 
                className="entry-type-card"
                onClick={() => handleBrowseByType('concept')}
              >
                <div className="card-icon">⚖️</div>
                <div className="card-label">Concepts</div>
                <div className="card-count">
                  ({statistics?.byType.concept || 0})
                </div>
              </button>
              <button
                className="card-create-button"
                onClick={(e) => handleCreateEntryOfType('concept', e)}
                title="Create new concept entry"
              >
                +
              </button>
            </div>
            
            <div className="entry-type-card-wrapper">
              <button 
                className="entry-type-card"
                onClick={() => handleBrowseByType('heraldry')}
              >
                <div className="card-icon">🛡️</div>
                <div className="card-label">Heraldry</div>
                <div className="card-count">
                  ({statistics?.byType.heraldry || 0})
                </div>
              </button>
              <button
                className="card-create-button"
                onClick={(e) => handleCreateEntryOfType('heraldry', e)}
                title="Create new heraldry entry"
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
          
          {/* Cleanup Tool Toggle */}
          <button 
            className="action-button secondary"
            onClick={() => setShowCleanupTool(!showCleanupTool)}
            style={{
              borderColor: showCleanupTool ? 'var(--accent-primary)' : undefined
            }}
          >
            <span className="button-icon">🧹</span>
            {showCleanupTool ? 'Hide Cleanup Tool' : 'Cleanup Duplicates'}
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
        
        {/* Cleanup Tool (collapsible) */}
        {showCleanupTool && (
          <section className="codex-section">
            <CodexCleanupTool 
              onCleanupComplete={async () => {
                await loadCodexData();
              }}
            />
          </section>
        )}
        
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
              <strong>Quick Start:</strong> Import canonical worldbuilding entries to see The Codex in action!
            </p>
            <button 
              className="empty-state-button"
              onClick={() => navigate('/codex/import')}
              style={{
                background: 'var(--accent-primary)',
                marginBottom: '1rem'
              }}
            >
              📥 Import Worldbuilding Data
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
