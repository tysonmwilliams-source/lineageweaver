import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  getAllDignities,
  getDignityStatistics,
  deleteDignity,
  getSubordinateDignities,
  DIGNITY_CLASSES,
  DIGNITY_RANKS,
  getDignityIcon
} from '../services/dignityService';
import { getAllHouses, getAllPeople } from '../services/database';
import Navigation from '../components/Navigation';
import './DignitiesLanding.css';

/**
 * DignitiesLanding Page - Titles & Dignities
 * 
 * The fifth major system of Lineageweaver, tracking:
 * - Driht authority (lordship by right)
 * - Ward authority (custodial trust)
 * - Sir honour (knightly service)
 * - Feudal hierarchy and sworn bonds
 * 
 * Based on "The Codified Charter of Driht, Ward, and Service"
 */
function DignitiesLanding() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get current user for cloud sync
  
  // State
  const [dignities, setDignities] = useState([]);
  const [houses, setHouses] = useState([]);
  const [people, setPeople] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterRank, setFilterRank] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('hierarchy'); // 'grid' | 'hierarchy'
  
  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);
  
  async function loadData() {
    try {
      setLoading(true);
      
      const [dignitiesData, housesData, peopleData, stats] = await Promise.all([
        getAllDignities(),
        getAllHouses(),
        getAllPeople(),
        getDignityStatistics()
      ]);
      
      setDignities(dignitiesData);
      setHouses(housesData);
      setPeople(peopleData);
      setStatistics(stats);
      setLoading(false);
    } catch (error) {
      console.error('Error loading dignities data:', error);
      setLoading(false);
    }
  }
  
  // Get house name by ID
  function getHouseName(houseId) {
    if (!houseId) return null;
    const house = houses.find(h => h.id === houseId);
    return house?.houseName || null;
  }
  
  // Get person name by ID
  function getPersonName(personId) {
    if (!personId) return null;
    const person = people.find(p => p.id === personId);
    if (!person) return null;
    return `${person.firstName} ${person.lastName}`;
  }
  
  // Get house color by ID
  function getHouseColor(houseId) {
    if (!houseId) return '#666';
    const house = houses.find(h => h.id === houseId);
    return house?.colorCode || '#666';
  }
  
  // Get available ranks for current filter
  function getAvailableRanks() {
    if (filterClass === 'all') {
      // Return all ranks from all classes
      return Object.entries(DIGNITY_RANKS).flatMap(([cls, ranks]) =>
        Object.values(ranks).map(r => ({ ...r, class: cls }))
      );
    }
    
    const classRanks = DIGNITY_RANKS[filterClass];
    if (!classRanks) return [];
    return Object.values(classRanks).map(r => ({ ...r, class: filterClass }));
  }
  
  // Filter and sort dignities
  function getFilteredDignities() {
    let filtered = [...dignities];
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(d => {
        if (d.name?.toLowerCase().includes(term)) return true;
        if (d.shortName?.toLowerCase().includes(term)) return true;
        if (d.placeName?.toLowerCase().includes(term)) return true;
        if (d.seatName?.toLowerCase().includes(term)) return true;
        // Search by holder name
        const holderName = getPersonName(d.currentHolderId);
        if (holderName?.toLowerCase().includes(term)) return true;
        // Search by house name
        const houseName = getHouseName(d.currentHouseId);
        if (houseName?.toLowerCase().includes(term)) return true;
        return false;
      });
    }
    
    // Class filter
    if (filterClass !== 'all') {
      filtered = filtered.filter(d => d.dignityClass === filterClass);
    }
    
    // Rank filter
    if (filterRank !== 'all') {
      filtered = filtered.filter(d => d.dignityRank === filterRank);
    }
    
    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'rank': {
          // Sort by class first, then by rank order
          const classOrder = { crown: 0, driht: 1, ward: 2, sir: 3, other: 4 };
          const classCompare = (classOrder[a.dignityClass] || 5) - (classOrder[b.dignityClass] || 5);
          if (classCompare !== 0) return classCompare;
          
          // Then by rank order within class
          const aRankInfo = DIGNITY_RANKS[a.dignityClass]?.[a.dignityRank];
          const bRankInfo = DIGNITY_RANKS[b.dignityClass]?.[b.dignityRank];
          return (aRankInfo?.order || 99) - (bRankInfo?.order || 99);
        }
        case 'house': {
          const houseA = getHouseName(a.currentHouseId) || 'zzz';
          const houseB = getHouseName(b.currentHouseId) || 'zzz';
          return houseA.localeCompare(houseB);
        }
        case 'created':
          return new Date(b.created) - new Date(a.created);
        default:
          return (a.name || '').localeCompare(b.name || '');
      }
    });
    
    return filtered;
  }
  
  // Build hierarchy tree for hierarchy view
  function buildHierarchyTree() {
    // Find root dignities (those with no swornToId or swornTo the Crown)
    const rootDignities = dignities.filter(d => 
      !d.swornToId || d.dignityClass === 'crown'
    );
    
    // Recursive function to build tree
    function buildNode(dignity) {
      const subordinates = dignities.filter(d => d.swornToId === dignity.id);
      return {
        dignity,
        subordinates: subordinates.map(sub => buildNode(sub))
      };
    }
    
    return rootDignities.map(d => buildNode(d));
  }
  
  // Handlers
  function handleCreateDignity() {
    navigate('/dignities/create');
  }
  
  function handleViewDignity(id) {
    navigate(`/dignities/view/${id}`);
  }
  
  function handleEditDignity(id, event) {
    event?.stopPropagation();
    navigate(`/dignities/edit/${id}`);
  }
  
  async function handleDeleteDignity(id, name, event) {
    event?.stopPropagation();
    
    if (!window.confirm(`Delete "${name}"?\n\nThis will remove the dignity and all associated tenure records.`)) {
      return;
    }
    
    try {
      await deleteDignity(id, user?.uid);
      await loadData();
    } catch (error) {
      console.error('Error deleting dignity:', error);
      alert('Failed to delete dignity');
    }
  }
  
  // Get class display info
  function getClassInfo(dignityClass) {
    return DIGNITY_CLASSES[dignityClass] || DIGNITY_CLASSES.other;
  }
  
  // Get rank display name
  function getRankDisplayName(dignityClass, dignityRank) {
    const classRanks = DIGNITY_RANKS[dignityClass];
    if (!classRanks) return dignityRank || 'Unknown';
    const rankInfo = classRanks[dignityRank];
    return rankInfo?.name || dignityRank || 'Unknown';
  }
  
  // Format date
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
  
  // Render hierarchy node
  function renderHierarchyNode(node, depth = 0) {
    const { dignity, subordinates } = node;
    const icon = getDignityIcon(dignity);
    const holderName = getPersonName(dignity.currentHolderId);
    const houseName = getHouseName(dignity.currentHouseId);
    const houseColor = getHouseColor(dignity.currentHouseId);
    
    return (
      <div key={dignity.id} className="hierarchy-node" style={{ marginLeft: depth * 24 }}>
        <div 
          className="hierarchy-card"
          onClick={() => handleViewDignity(dignity.id)}
        >
          <div className="hierarchy-connector" style={{ width: depth > 0 ? 24 : 0 }} />
          
          <span className="hierarchy-icon">{icon}</span>
          
          <div className="hierarchy-info">
            <span className="hierarchy-name">{dignity.name}</span>
            {holderName && (
              <span className="hierarchy-holder">
                <span 
                  className="holder-indicator"
                  style={{ backgroundColor: houseColor }}
                />
                {holderName}
              </span>
            )}
          </div>
          
          <span className="hierarchy-rank">
            {getRankDisplayName(dignity.dignityClass, dignity.dignityRank)}
          </span>
        </div>
        
        {subordinates.length > 0 && (
          <div className="hierarchy-children">
            {subordinates.map(sub => renderHierarchyNode(sub, depth + 1))}
          </div>
        )}
      </div>
    );
  }
  
  // Loading state
  if (loading) {
    return (
      <>
        <Navigation />
        <div className="dignities-landing loading">
          <div className="loading-spinner">
            <div className="loading-icon">📜</div>
            <p>Opening the Rolls of the Realm...</p>
          </div>
        </div>
      </>
    );
  }
  
  const filteredDignities = getFilteredDignities();
  const hierarchyTree = viewMode === 'hierarchy' ? buildHierarchyTree() : [];
  
  return (
    <>
      <Navigation />
      <div className="dignities-landing">
        
        {/* Header */}
        <header className="dignities-header">
          <h1 className="dignities-title">TITLES & DIGNITIES</h1>
          <p className="dignities-subtitle">
            The Rolls of the Realm
          </p>
          <p className="dignities-charter-ref">
            Per the Codified Charter of Driht, Ward, and Service
          </p>
        </header>
        
        {/* Statistics Bar */}
        {statistics && (
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-value">{statistics.total}</span>
              <span className="stat-label">Dignities</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{statistics.byClass?.driht || 0}</span>
              <span className="stat-label">Driht Titles</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{statistics.byClass?.ward || 0}</span>
              <span className="stat-label">Ward Titles</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{statistics.byClass?.sir || 0}</span>
              <span className="stat-label">Knights</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{statistics.vacant}</span>
              <span className="stat-label">Vacant</span>
            </div>
          </div>
        )}
        
        {/* Controls Section */}
        <div className="controls-section">
          {/* Search */}
          <form className="search-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search by name, place, holder, house..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          
          {/* Filters */}
          <div className="filters">
            <select 
              className="filter-select"
              value={filterClass}
              onChange={(e) => {
                setFilterClass(e.target.value);
                setFilterRank('all'); // Reset rank filter when class changes
              }}
            >
              <option value="all">All Classes</option>
              {Object.entries(DIGNITY_CLASSES).map(([key, info]) => (
                <option key={key} value={key}>
                  {info.icon} {info.name}
                </option>
              ))}
            </select>
            
            <select 
              className="filter-select"
              value={filterRank}
              onChange={(e) => setFilterRank(e.target.value)}
            >
              <option value="all">All Ranks</option>
              {getAvailableRanks().map(rank => (
                <option key={`${rank.class}-${rank.id}`} value={rank.id}>
                  {rank.name}
                </option>
              ))}
            </select>
            
            <select 
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Name (A-Z)</option>
              <option value="rank">By Rank</option>
              <option value="house">By House</option>
              <option value="created">Recently Created</option>
            </select>
            
            {/* View Mode Toggle */}
            <div className="view-toggle">
              <button
                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                ▦
              </button>
              <button
                className={`toggle-btn ${viewMode === 'hierarchy' ? 'active' : ''}`}
                onClick={() => setViewMode('hierarchy')}
                title="Hierarchy View"
              >
                🔗
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        {dignities.length === 0 ? (
          /* Empty State */
          <div className="empty-state">
            <div className="empty-icon">📜</div>
            <h3 className="empty-title">No Dignities Recorded</h3>
            <p className="empty-text">
              The rolls stand empty. Begin recording the titles, offices,
              and honours of your realm.
            </p>
            <p className="empty-hint">
              <span className="hint-icon">💡</span>
              Start with your paramount lords, then add their sworn vassals.
            </p>
            <button 
              className="primary-button"
              onClick={handleCreateDignity}
            >
              <span>✨</span> Record First Dignity
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="dignities-grid-section">
            <div className="grid-header">
              <h2 className="section-title">
                {searchTerm || filterClass !== 'all' || filterRank !== 'all'
                  ? `${filteredDignities.length} Results`
                  : 'All Dignities'}
              </h2>
              <button 
                className="create-button"
                onClick={handleCreateDignity}
              >
                <span>+</span> Create New
              </button>
            </div>
            
            {filteredDignities.length === 0 ? (
              <div className="no-results">
                <p>No dignities match your filters.</p>
                <button 
                  className="text-button"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterClass('all');
                    setFilterRank('all');
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="dignities-grid">
                {filteredDignities.map(d => {
                  const classInfo = getClassInfo(d.dignityClass);
                  const icon = getDignityIcon(d);
                  const holderName = getPersonName(d.currentHolderId);
                  const houseName = getHouseName(d.currentHouseId);
                  const houseColor = getHouseColor(d.currentHouseId);
                  
                  return (
                    <div 
                      key={d.id}
                      className="dignity-card"
                      onClick={() => handleViewDignity(d.id)}
                    >
                      {/* Class Badge */}
                      <div className={`card-class-badge ${d.dignityClass}`}>
                        <span className="class-icon">{classInfo.icon}</span>
                        <span className="class-name">{classInfo.name}</span>
                      </div>
                      
                      {/* Main Icon */}
                      <div className="card-icon">
                        {icon || '📜'}
                      </div>
                      
                      {/* Info */}
                      <div className="card-info">
                        <h3 className="card-name">{d.name}</h3>
                        
                        <div className="card-rank">
                          {getRankDisplayName(d.dignityClass, d.dignityRank)}
                        </div>
                        
                        {/* Current Holder */}
                        {holderName ? (
                          <div className="card-holder">
                            <span 
                              className="holder-indicator"
                              style={{ backgroundColor: houseColor }}
                            />
                            <span className="holder-name">{holderName}</span>
                          </div>
                        ) : (
                          <div className="card-vacant">
                            <span className="vacant-text">Vacant</span>
                          </div>
                        )}
                        
                        {/* House Association */}
                        {houseName && (
                          <div className="card-house">
                            <span 
                              className="house-indicator"
                              style={{ backgroundColor: houseColor }}
                            />
                            <span className="house-name">{houseName}</span>
                          </div>
                        )}
                        
                        {/* Place */}
                        {d.placeName && (
                          <div className="card-place">
                            📍 {d.placeName}
                          </div>
                        )}
                        
                        {/* Footer */}
                        <div className="card-footer">
                          <span className="card-date">
                            Added {formatDate(d.created)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="card-actions">
                        <button 
                          className="action-btn edit"
                          onClick={(e) => handleEditDignity(d.id, e)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button 
                          className="action-btn delete"
                          onClick={(e) => handleDeleteDignity(d.id, d.name, e)}
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
        ) : (
          /* Hierarchy View */
          <div className="hierarchy-section">
            <div className="grid-header">
              <h2 className="section-title">Feudal Hierarchy</h2>
              <button 
                className="create-button"
                onClick={handleCreateDignity}
              >
                <span>+</span> Create New
              </button>
            </div>
            
            {hierarchyTree.length === 0 ? (
              <div className="no-results">
                <p>No hierarchy established. Create dignities and set their sworn relationships.</p>
              </div>
            ) : (
              <div className="hierarchy-tree">
                {hierarchyTree.map(node => renderHierarchyNode(node))}
              </div>
            )}
          </div>
        )}
        
        {/* Charter Reference */}
        <section className="charter-section">
          <h2 className="section-title">The Seven Articles</h2>
          <div className="charter-articles">
            <div className="article">
              <h4>Article I — Of Driht</h4>
              <p>Defines the hierarchy of lordship: Drihten, Drithen, Drith, Drithling, Drithman</p>
            </div>
            <div className="article">
              <h4>Article II — Of Ward</h4>
              <p>Defines custodial authority: Wardyn, Landward, Holdward, Marchward</p>
            </div>
            <div className="article">
              <h4>Article III — Of Sir</h4>
              <p>Defines knightly honour without inherent land</p>
            </div>
            <div className="article">
              <h4>Article IV — Of Tenure</h4>
              <p>Defines styling conventions: "of", "in", "at", and related forms</p>
            </div>
            <div className="article">
              <h4>Article V — Of Fealty</h4>
              <p>All authorities bound by oath; broken fealty forfeits honours</p>
            </div>
            <div className="article">
              <h4>Article VI — Of Cadency</h4>
              <p>Rules for cadet houses and derived authority</p>
            </div>
            <div className="article">
              <h4>Article VII — Of Record</h4>
              <p>All grants recorded in the rolls of the realm</p>
            </div>
          </div>
        </section>
        
        {/* Action Footer */}
        <footer className="dignities-footer">
          <button 
            className="footer-button primary"
            onClick={handleCreateDignity}
          >
            <span>✨</span> Record New Dignity
          </button>
          
          <button 
            className="footer-button secondary"
            onClick={() => navigate('/tree')}
          >
            <span>🌳</span> Family Tree
          </button>
          
          <button 
            className="footer-button secondary"
            onClick={() => navigate('/codex')}
          >
            <span>📚</span> The Codex
          </button>
          
          <button 
            className="footer-button secondary"
            onClick={() => navigate('/heraldry')}
          >
            <span>🛡️</span> Heraldry
          </button>
        </footer>
        
      </div>
    </>
  );
}

export default DignitiesLanding;
