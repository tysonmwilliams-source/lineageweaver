import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllHeraldry,
  getHeraldryStatistics,
  deleteHeraldry
} from '../services/heraldryService';
import { getAllHouses, db } from '../services/database';
import { getAllEntries } from '../services/codexService'; // PHASE 5 Batch 3
import Navigation from '../components/Navigation';
import './HeraldryLanding.css';

/**
 * HeraldryLanding Page - The Armory
 * 
 * PHASE 5 ENHANCED: Now shows linked houses on each heraldry card
 * 
 * Gallery view for all heraldic devices in Lineageweaver.
 * This is the fourth major system alongside Family Tree, Codex, and Manage Data.
 * 
 * Features:
 * - Grid gallery of all heraldry
 * - Search and filter capabilities (including by linked house name)
 * - Statistics overview
 * - Quick actions (create, view, edit)
 * - Integration links to houses
 * - Shows linked house on each card
 */
function HeraldryLanding() {
  const navigate = useNavigate();
  
  // State
  const [heraldry, setHeraldry] = useState([]);
  const [houses, setHouses] = useState([]);
  const [heraldryLinks, setHeraldryLinks] = useState([]); // PHASE 5: Added
  const [codexEntries, setCodexEntries] = useState([]); // PHASE 5 Batch 3: Codex integration
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  // Shield type filter - disabled since only using default shield now
  // const [filterShield, setFilterShield] = useState('all');
  const [sortBy, setSortBy] = useState('updated');
  
  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);
  
  async function loadData() {
    try {
      setLoading(true);
      
      const [heraldryData, housesData, stats, linksData, codexData] = await Promise.all([
        getAllHeraldry(),
        getAllHouses(),
        getHeraldryStatistics(),
        db.heraldryLinks.toArray(), // PHASE 5: Load heraldry links
        getAllEntries() // PHASE 5 Batch 3: Load codex entries
      ]);
      
      setHeraldry(heraldryData);
      setHouses(housesData);
      setStatistics(stats);
      setHeraldryLinks(linksData); // PHASE 5: Store links
      setCodexEntries(codexData); // PHASE 5 Batch 3: Store codex entries
      setLoading(false);
    } catch (error) {
      console.error('Error loading heraldry data:', error);
      setLoading(false);
    }
  }
  
  // PHASE 5: Get linked house for a heraldry item
  function getLinkedHouse(heraldryId) {
    // First check heraldryLinks table
    const link = heraldryLinks.find(l => 
      l.heraldryId === heraldryId && 
      l.entityType === 'house' && 
      l.linkType === 'primary'
    );
    
    if (link) {
      return houses.find(h => h.id === link.entityId);
    }
    
    // Fallback: check if any house has this heraldryId directly
    return houses.find(h => h.heraldryId === heraldryId);
  }
  
  // PHASE 5 Batch 3: Get linked codex entry for a heraldry item
  function getLinkedCodexEntry(heraldryId) {
    return codexEntries.find(entry => entry.heraldryId === heraldryId);
  }
  
  // PHASE 5 Batch 3: Navigate to codex entry
  function handleViewInCodex(entryId, event) {
    event.stopPropagation();
    navigate(`/codex/entry/${entryId}`);
  }
  
  // PHASE 5 Batch 3: Create codex entry for heraldry
  function handleCreateCodexEntry(heraldryId, heraldryName, event) {
    event.stopPropagation();
    // Navigate to codex create with heraldry type pre-selected and heraldryId passed
    navigate(`/codex/create?type=heraldry&heraldryId=${heraldryId}&title=${encodeURIComponent(heraldryName)}`);
  }
  
  // Filter and sort heraldry
  function getFilteredHeraldry() {
    let filtered = [...heraldry];
    
    // Search filter - PHASE 5: Also search by linked house name
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(h => {
        if (h.name?.toLowerCase().includes(term)) return true;
        if (h.description?.toLowerCase().includes(term)) return true;
        if (h.blazon?.toLowerCase().includes(term)) return true;
        if (h.tags?.some(tag => tag.toLowerCase().includes(term))) return true;
        // PHASE 5: Search by linked house name
        const linkedHouse = getLinkedHouse(h.id);
        if (linkedHouse?.houseName?.toLowerCase().includes(term)) return true;
        return false;
      });
    }
    
    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(h => h.category === filterCategory);
    }
    
    // Shield type filter - disabled since only using default shield now
    // if (filterShield !== 'all') {
    //   filtered = filtered.filter(h => h.shieldType === filterShield);
    // }
    
    // Sort - PHASE 5: Added sort by house option
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'created':
          return new Date(b.created) - new Date(a.created);
        case 'house': {
          const houseA = getLinkedHouse(a.id)?.houseName || 'zzz';
          const houseB = getLinkedHouse(b.id)?.houseName || 'zzz';
          return houseA.localeCompare(houseB);
        }
        case 'updated':
        default:
          return new Date(b.updated) - new Date(a.updated);
      }
    });
    
    return filtered;
  }
  
  // Get houses that have heraldry from the old system but not linked to new system
  function getHousesWithOldHeraldry() {
    return houses.filter(house => 
      (house.heraldrySVG || house.heraldryImageData) && !house.heraldryId
    );
  }
  
  // Get houses without any heraldry
  function getHousesWithoutHeraldry() {
    return houses.filter(house => 
      !house.heraldrySVG && !house.heraldryImageData && !house.heraldryId
    );
  }
  
  // Handlers
  function handleCreateHeraldry() {
    navigate('/heraldry/create');
  }
  
  function handleViewHeraldry(id) {
    navigate(`/heraldry/edit/${id}`);
  }
  
  function handleEditHeraldry(id, event) {
    event.stopPropagation();
    navigate(`/heraldry/edit/${id}`);
  }
  
  async function handleDeleteHeraldry(id, name, event) {
    event.stopPropagation();
    
    if (!window.confirm(`Delete "${name}"?\n\nThis will remove the heraldry and unlink it from any houses or people.`)) {
      return;
    }
    
    try {
      await deleteHeraldry(id);
      await loadData(); // Refresh
      alert('Heraldry deleted');
    } catch (error) {
      console.error('Error deleting heraldry:', error);
      alert('Failed to delete heraldry');
    }
  }
  
  function handleSearchSubmit(e) {
    e.preventDefault();
    // Search is already handled reactively
  }
  
  // Shield type display names - disabled since only using default shield
  // function getShieldTypeName(type) {
  //   const names = {
  //     heater: 'Heater',
  //     french: 'French',
  //     spanish: 'Spanish',
  //     english: 'English',
  //     swiss: 'Swiss'
  //   };
  //   return names[type] || type;
  // }
  
  // Category display names
  function getCategoryName(category) {
    const names = {
      noble: 'Noble Houses',
      ecclesiastical: 'Ecclesiastical',
      civic: 'Civic',
      guild: 'Guilds',
      personal: 'Personal Arms',
      fantasy: 'Fantasy'
    };
    return names[category] || category;
  }
  
  // Category icons
  function getCategoryIcon(category) {
    const icons = {
      noble: '🏰',
      ecclesiastical: '⛪',
      civic: '🏛️',
      guild: '⚒️',
      personal: '👤',
      fantasy: '✨'
    };
    return icons[category] || '🛡️';
  }
  
  // Format date for display
  function formatDate(isoString) {
    if (!isoString) return 'Unknown';
    const date = new Date(isoString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
  
  // Loading state
  if (loading) {
    return (
      <>
        <Navigation />
        <div className="heraldry-landing loading">
          <div className="loading-spinner">
            <div className="loading-icon">🛡️</div>
            <p>Opening The Armory...</p>
          </div>
        </div>
      </>
    );
  }
  
  const filteredHeraldry = getFilteredHeraldry();
  const housesWithOldHeraldry = getHousesWithOldHeraldry();
  const housesWithoutHeraldry = getHousesWithoutHeraldry();
  
  return (
    <>
      <Navigation />
      <div className="heraldry-landing">
        
        {/* Header */}
        <header className="heraldry-header">
          <h1 className="heraldry-title">THE ARMORY</h1>
          <p className="heraldry-subtitle">
            A Gallery of Heraldic Devices
          </p>
        </header>
        
        {/* Statistics Bar */}
        {statistics && (
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-value">{statistics.total}</span>
              <span className="stat-label">Heraldic Devices</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{statistics.linkedHouses}</span>
              <span className="stat-label">Houses Emblazoned</span>
            </div>
            {/* Shield shape count - removed since only using default shield
            <div className="stat-item">
              <span className="stat-value">{Object.keys(statistics.byShieldType).length}</span>
              <span className="stat-label">Shield Shapes</span>
            </div>
            */}
            <div className="stat-item">
              <span className="stat-value">{statistics.withBlazon}</span>
              <span className="stat-label">With Blazon</span>
            </div>
          </div>
        )}
        
        {/* Search & Filters */}
        <div className="controls-section">
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search by name, blazon, house name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          
          <div className="filters">
            <select 
              className="filter-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="noble">Noble Houses</option>
              <option value="personal">Personal Arms</option>
              <option value="ecclesiastical">Ecclesiastical</option>
              <option value="civic">Civic</option>
              <option value="guild">Guilds</option>
              <option value="fantasy">Fantasy</option>
            </select>
            
            {/* Shield type filter - disabled since only using default shield now
            <select 
              className="filter-select"
              value={filterShield}
              onChange={(e) => setFilterShield(e.target.value)}
            >
              <option value="all">All Shields</option>
              <option value="heater">Heater</option>
              <option value="french">French</option>
              <option value="spanish">Spanish</option>
              <option value="english">English</option>
              <option value="swiss">Swiss</option>
            </select>
            */}
            
            <select 
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="updated">Recently Updated</option>
              <option value="created">Recently Created</option>
              <option value="name">Name (A-Z)</option>
              <option value="house">By House</option>
            </select>
          </div>
        </div>
        
        {/* Main Content */}
        {heraldry.length === 0 ? (
          /* Empty State */
          <div className="empty-state">
            <div className="empty-icon">🛡️</div>
            <h3 className="empty-title">The Armory Awaits</h3>
            <p className="empty-text">
              No heraldic devices have been created yet.
              Begin designing coats of arms for your houses and characters.
            </p>
            
            {housesWithoutHeraldry.length > 0 && (
              <p className="empty-hint">
                <span className="hint-icon">💡</span>
                You have {housesWithoutHeraldry.length} houses without heraldry.
                Create arms for them to bring your world to life!
              </p>
            )}
            
            <button 
              className="primary-button"
              onClick={handleCreateHeraldry}
            >
              <span>✨</span> Create First Heraldry
            </button>
          </div>
        ) : (
          /* Heraldry Grid */
          <div className="heraldry-grid-section">
            <div className="grid-header">
              <h2 className="section-title">
                {searchTerm || filterCategory !== 'all'
                  ? `${filteredHeraldry.length} Results` 
                  : 'All Heraldic Devices'}
              </h2>
              <button 
                className="create-button"
                onClick={handleCreateHeraldry}
              >
                <span>+</span> Create New
              </button>
            </div>
            
            {filteredHeraldry.length === 0 ? (
              <div className="no-results">
                <p>No heraldry matches your filters.</p>
                <button 
                  className="text-button"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterCategory('all');
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="heraldry-grid">
                {filteredHeraldry.map(h => {
                  // PHASE 5: Get linked house for this heraldry
                  const linkedHouse = getLinkedHouse(h.id);
                  
                  return (
                    <div 
                      key={h.id}
                      className="heraldry-card"
                      onClick={() => handleViewHeraldry(h.id)}
                    >
                      {/* Shield Display */}
                      <div className="card-shield">
                        {h.heraldrySVG ? (
                          <div 
                            className="shield-svg"
                            dangerouslySetInnerHTML={{ __html: h.heraldrySVG }}
                          />
                        ) : h.heraldryDisplay || h.heraldryThumbnail ? (
                          <img 
                            src={h.heraldryDisplay || h.heraldryThumbnail}
                            alt={h.name}
                            className="shield-img"
                          />
                        ) : (
                          <div className="shield-placeholder">
                            <span>🛡️</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Card Info */}
                      <div className="card-info">
                        <h3 className="card-name">{h.name}</h3>
                        
                        {/* PHASE 5: Linked House Display */}
                        {linkedHouse ? (
                          <div className="card-linked-house">
                            <span 
                              className="linked-house-indicator"
                              style={{ backgroundColor: linkedHouse.colorCode || '#666' }}
                            />
                            <span className="linked-house-name">
                              {linkedHouse.houseName}
                            </span>
                          </div>
                        ) : (
                          <div className="card-unlinked">
                            <span className="unlinked-text">Not linked</span>
                          </div>
                        )}
                        
                        {h.blazon && (
                          <p className="card-blazon">{h.blazon}</p>
                        )}
                        
                        <div className="card-meta">
                          <span className="meta-category">
                            {getCategoryIcon(h.category)} {getCategoryName(h.category)}
                          </span>
                          {/* Shield type display - removed since only using default shield */}
                        </div>
                        
                        <div className="card-footer">
                          <span className="card-date">
                            Updated {formatDate(h.updated)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Quick Actions */}
                      <div className="card-actions">
                        {/* PHASE 5 Batch 3: Codex integration */}
                        {(() => {
                          const codexEntry = getLinkedCodexEntry(h.id);
                          return codexEntry ? (
                            <button 
                              className="action-btn codex"
                              onClick={(e) => handleViewInCodex(codexEntry.id, e)}
                              title="View in Codex"
                            >
                              📜
                            </button>
                          ) : (
                            <button 
                              className="action-btn codex-create"
                              onClick={(e) => handleCreateCodexEntry(h.id, h.name, e)}
                              title="Create Codex Entry"
                            >
                              📝
                            </button>
                          );
                        })()}
                        <button 
                          className="action-btn edit"
                          onClick={(e) => handleEditHeraldry(h.id, e)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button 
                          className="action-btn delete"
                          onClick={(e) => handleDeleteHeraldry(h.id, h.name, e)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        
        {/* Houses Overview */}
        {houses.length > 0 && (
          <section className="houses-section">
            <h2 className="section-title">House Heraldry Coverage</h2>
            
            <div className="coverage-stats">
              <div className="coverage-bar">
                <div 
                  className="coverage-fill"
                  style={{ 
                    width: `${houses.length > 0 
                      ? ((houses.length - housesWithoutHeraldry.length) / houses.length) * 100 
                      : 0}%` 
                  }}
                />
              </div>
              <p className="coverage-text">
                {houses.length - housesWithoutHeraldry.length} of {houses.length} houses have heraldry
              </p>
            </div>
            
            {housesWithoutHeraldry.length > 0 && (
              <div className="houses-needing-heraldry">
                <h3>Houses Awaiting Arms</h3>
                <div className="house-chips">
                  {housesWithoutHeraldry.slice(0, 10).map(house => (
                    <span 
                      key={house.id}
                      className="house-chip"
                      style={{ borderColor: house.colorCode }}
                      onClick={() => navigate(`/heraldry/create?houseId=${house.id}&houseName=${encodeURIComponent(house.houseName)}`)}
                    >
                      {house.houseName}
                    </span>
                  ))}
                  {housesWithoutHeraldry.length > 10 && (
                    <span className="house-chip more">
                      +{housesWithoutHeraldry.length - 10} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </section>
        )}
        
        {/* Action Footer */}
        <footer className="heraldry-footer">
          <button 
            className="footer-button primary"
            onClick={handleCreateHeraldry}
          >
            <span>✨</span> Create New Heraldry
          </button>
          
          <button 
            className="footer-button secondary"
            onClick={() => navigate('/heraldry/charges')}
          >
            <span>🦁</span> Charges Library
          </button>
          
          <button 
            className="footer-button secondary"
            onClick={() => navigate('/manage')}
          >
            <span>🏰</span> Manage Houses
          </button>
          
          <button 
            className="footer-button secondary"
            onClick={() => navigate('/tree')}
          >
            <span>🌳</span> Family Tree
          </button>
        </footer>
        
      </div>
    </>
  );
}

export default HeraldryLanding;
