import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllEntries,
  getCodexStatistics
} from '../services/codexService';
import { importSeedData, getImportPreview } from '../utils/import-seed-data';
import Navigation from '../components/Navigation';
import './CodexLanding.css';

/**
 * Codex Landing Page
 * 
 * The main entry point to The Codex - a wiki-style encyclopedia system
 * for worldbuilding.
 */
function CodexLanding() {
  const navigate = useNavigate();
  
  const [statistics, setStatistics] = useState(null);
  const [recentEntries, setRecentEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState(null);
  
  useEffect(() => {
    loadCodexData();
  }, []);
  
  async function loadCodexData() {
    try {
      setLoading(true);
      
      const stats = await getCodexStatistics();
      setStatistics(stats);
      
      const allEntries = await getAllEntries();
      const sorted = allEntries.sort(
        (a, b) => new Date(b.updated) - new Date(a.updated)
      );
      setRecentEntries(sorted.slice(0, 5));
      
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
    setImportResults(null);
    
    try {
      const results = await importSeedData();
      setImportResults(results);
      
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
    // TODO: Implement browse page in future phase
    // For now, just go to create page for that type
    navigate(`/codex/create?type=${type}`);
  }
  
  function handleCreateEntryOfType(type, event) {
    event.stopPropagation(); // Prevent the browse action from firing
    navigate(`/codex/create?type=${type}`);
  }
  
  function handleCreateEntry() {
    navigate('/codex/create');
  }
  
  function handleViewEntry(entryId) {
    navigate(`/codex/entry/${entryId}`);
  }
  
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
  
  return (
    <>
      <Navigation />
      <div className="codex-landing">
      <header className="codex-header">
        <h1 className="codex-title">THE CODEX MAGNIFICA</h1>
        <p className="codex-subtitle">
          A Complete Encyclopedia of Your World
        </p>
      </header>
      
      <div className="codex-search-section">
        <input
          type="text"
          className="codex-search-input"
          placeholder="🔍 Search all entries..."
          onFocus={() => navigate('/codex/search')}
        />
      </div>
      
      <section className="codex-section">
        <h2 className="section-header">Browse the Archives</h2>
        
        <div className="entry-type-grid">
          <div className="entry-type-card-wrapper">
            <button 
              className="entry-type-card"
              onClick={() => handleBrowseByType('personage')}
            >
              <div className="card-icon">👥</div>
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
              <div className="card-icon">🗺️</div>
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
              <div className="card-icon">📖</div>
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
              <div className="card-icon">🔮</div>
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
              <div className="card-icon">⚖️</div>
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
      
      {statistics && (
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
      
      {statistics && statistics.total === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📜</div>
          <h3 className="empty-state-title">The Codex Awaits</h3>
          <p className="empty-state-text">
            Begin documenting your world's history, characters, and lore.
            Create your first entry to get started.
          </p>
          <p className="empty-state-text" style={{ marginTop: '1rem', fontSize: '0.95rem', color: '#8b4513' }}>
            <strong>Quick Start:</strong> Import 23 canonical House Wilfrey entries to see The Codex in action!
          </p>
          <button 
            className="empty-state-button"
            onClick={handleImportSeedData}
            disabled={importing}
            style={{
              background: '#8b4513',
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
