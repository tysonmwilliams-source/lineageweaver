import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  getDignity,
  deleteDignity,
  getTenuresForDignity,
  getSubordinateDignities,
  getFeudalChain,
  createDignityTenure,
  updateDignityTenure,
  deleteDignityTenure,
  updateDignity,
  calculateSuccessionLine,
  addDispute,
  updateDispute,
  resolveDispute,
  removeDispute,
  setInterregnum,
  endInterregnum,
  DIGNITY_CLASSES,
  DIGNITY_RANKS,
  TENURE_TYPES,
  FEALTY_TYPES,
  ACQUISITION_TYPES,
  END_TYPES,
  SUCCESSION_TYPES,
  SUCCESSION_STATUS,
  CLAIM_TYPES,
  CLAIM_STRENGTHS,
  DISPUTE_RESOLUTIONS,
  INTERREGNUM_REASONS,
  getDignityIcon
} from '../services/dignityService';
import { getAllHouses, getAllPeople, getAllRelationships } from '../services/database';
import Navigation from '../components/Navigation';
import './DignityView.css';

/**
 * DignityView - View Single Dignity
 * 
 * Displays comprehensive information about a dignity including:
 * - Classification and rank
 * - Current holder and house
 * - Feudal hierarchy (sworn to / subordinates)
 * - Tenure history (all who have held this dignity)
 */
function DignityView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth(); // Get current user for cloud sync
  
  // State
  const [dignity, setDignity] = useState(null);
  const [tenures, setTenures] = useState([]);
  const [subordinates, setSubordinates] = useState([]);
  const [feudalChain, setFeudalChain] = useState([]);
  const [houses, setHouses] = useState([]);
  const [people, setPeople] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Succession state
  const [successionLine, setSuccessionLine] = useState([]);
  const [loadingSuccession, setLoadingSuccession] = useState(false);
  const [showSuccessionRulesModal, setShowSuccessionRulesModal] = useState(false);
  const [successionRulesForm, setSuccessionRulesForm] = useState({
    successionType: 'male-primogeniture',
    excludeBastards: true,
    legitimizedBastardsEligible: true,
    excludeWomen: false,
    requiresConfirmation: false,
    customNotes: '',
    designatedHeirId: ''
  });
  const [savingRules, setSavingRules] = useState(false);
  
  // Dispute state
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeMode, setDisputeMode] = useState('add'); // 'add' | 'edit' | 'resolve'
  const [editingDispute, setEditingDispute] = useState(null);
  const [disputeForm, setDisputeForm] = useState({
    claimantId: '',
    claimType: 'hereditary',
    claimStrength: 'moderate',
    claimBasis: '',
    supportingFactions: '',
    startDate: '',
    notes: '',
    resolution: '',
    resolvedDate: ''
  });
  const [savingDispute, setSavingDispute] = useState(false);
  
  // Interregnum state
  const [showInterregnumModal, setShowInterregnumModal] = useState(false);
  const [interregnumForm, setInterregnumForm] = useState({
    startDate: '',
    regentId: '',
    regentTitle: 'Regent',
    reason: 'vacancy',
    notes: ''
  });
  const [savingInterregnum, setSavingInterregnum] = useState(false);
  
  // Tenure form state
  const [showTenureModal, setShowTenureModal] = useState(false);
  const [tenureMode, setTenureMode] = useState('add'); // 'add' | 'end' | 'edit'
  const [editingTenure, setEditingTenure] = useState(null);
  const [tenureForm, setTenureForm] = useState({
    personId: '',
    dateStarted: '',
    dateEnded: '',
    acquisitionType: 'inheritance',
    endType: '',
    notes: ''
  });
  const [savingTenure, setSavingTenure] = useState(false);
  
  // Load data
  useEffect(() => {
    loadData();
  }, [id]);
  
  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      
      const dignityId = parseInt(id);
      
      const [
        dignityData,
        tenuresData,
        subordinatesData,
        chainData,
        housesData,
        peopleData,
        relationshipsData
      ] = await Promise.all([
        getDignity(dignityId),
        getTenuresForDignity(dignityId),
        getSubordinateDignities(dignityId),
        getFeudalChain(dignityId),
        getAllHouses(),
        getAllPeople(),
        getAllRelationships()
      ]);
      
      if (!dignityData) {
        setError('Dignity not found');
        setLoading(false);
        return;
      }
      
      setDignity(dignityData);
      setTenures(tenuresData);
      setSubordinates(subordinatesData);
      setFeudalChain(chainData);
      setHouses(housesData);
      setPeople(peopleData);
      setRelationships(relationshipsData);
      setLoading(false);
      
      // Calculate succession line after main data loads
      if (dignityData.currentHolderId) {
        calculateSuccession(dignityData, peopleData, relationshipsData);
      }
    } catch (err) {
      console.error('Error loading dignity:', err);
      setError('Failed to load dignity');
      setLoading(false);
    }
  }
  
  // Calculate succession line
  async function calculateSuccession(dignityData, peopleData, relationshipsData) {
    try {
      setLoadingSuccession(true);
      
      // Build relationship maps for succession calculation
      const parentMap = new Map(); // childId -> [parentIds]
      const childrenMap = new Map(); // parentId -> [childIds]
      const spouseMap = new Map(); // personId -> spouseId
      
      for (const rel of relationshipsData) {
        if (rel.relationshipType === 'parent') {
          // person1 is parent of person2
          const existingParents = parentMap.get(rel.person2Id) || [];
          parentMap.set(rel.person2Id, [...existingParents, rel.person1Id]);
          
          const existingChildren = childrenMap.get(rel.person1Id) || [];
          childrenMap.set(rel.person1Id, [...existingChildren, rel.person2Id]);
        } else if (rel.relationshipType === 'spouse') {
          spouseMap.set(rel.person1Id, rel.person2Id);
          spouseMap.set(rel.person2Id, rel.person1Id);
        }
      }
      
      const line = await calculateSuccessionLine(
        dignityData.id,
        peopleData,
        parentMap,
        childrenMap,
        spouseMap,
        10
      );
      
      setSuccessionLine(line);
    } catch (err) {
      console.error('Error calculating succession:', err);
      setSuccessionLine([]);
    } finally {
      setLoadingSuccession(false);
    }
  }
  
  // Helper functions
  function getHouseName(houseId) {
    if (!houseId) return null;
    const house = houses.find(h => h.id === houseId);
    return house?.houseName || null;
  }
  
  function getHouseColor(houseId) {
    if (!houseId) return '#666';
    const house = houses.find(h => h.id === houseId);
    return house?.colorCode || '#666';
  }
  
  function getPersonName(personId) {
    if (!personId) return null;
    const person = people.find(p => p.id === personId);
    if (!person) return null;
    return `${person.firstName} ${person.lastName}`;
  }
  
  function getClassInfo(dignityClass) {
    return DIGNITY_CLASSES[dignityClass] || DIGNITY_CLASSES.other;
  }
  
  function getRankInfo(dignityClass, dignityRank) {
    const classRanks = DIGNITY_RANKS[dignityClass];
    if (!classRanks) return null;
    return classRanks[dignityRank] || null;
  }
  
  function getTenureTypeInfo(tenureType) {
    return TENURE_TYPES[tenureType] || TENURE_TYPES.of;
  }
  
  function getFealtyTypeInfo(fealtyType) {
    return FEALTY_TYPES[fealtyType] || FEALTY_TYPES['sworn-to'];
  }
  
  function getAcquisitionInfo(type) {
    return ACQUISITION_TYPES[type] || { name: type || 'Unknown' };
  }
  
  function getEndInfo(type) {
    return END_TYPES[type] || { name: type || 'Unknown' };
  }
  
  function formatDate(dateStr) {
    if (!dateStr) return 'Unknown';
    // Handle various date formats
    if (dateStr.length === 4) return dateStr; // Year only
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  function formatTimestamp(isoString) {
    if (!isoString) return 'Unknown';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  // Handlers
  function handleEdit() {
    navigate(`/dignities/edit/${id}`);
  }
  
  async function handleDelete() {
    if (!window.confirm(`Delete "${dignity.name}"?\n\nThis will remove the dignity and all associated tenure records. This action cannot be undone.`)) {
      return;
    }
    
    try {
      await deleteDignity(parseInt(id), user?.uid);
      navigate('/dignities');
    } catch (err) {
      console.error('Error deleting dignity:', err);
      alert('Failed to delete dignity');
    }
  }
  
  function handleNavigateToDignity(dignityId) {
    navigate(`/dignities/view/${dignityId}`);
  }
  
  function handleNavigateToPerson(personId) {
    // 🪝 Future: navigate to person detail or open in tree
    console.log('Navigate to person:', personId);
  }
  
  function handleNavigateToHouse(houseId) {
    // 🪝 Future: navigate to house detail
    console.log('Navigate to house:', houseId);
  }
  
  // ==================== TENURE MANAGEMENT ====================
  
  function handleOpenAddTenure() {
    setTenureMode('add');
    setEditingTenure(null);
    setTenureForm({
      personId: dignity?.currentHolderId || '',
      dateStarted: '',
      dateEnded: '',
      acquisitionType: 'inheritance',
      endType: '',
      notes: ''
    });
    setShowTenureModal(true);
  }
  
  function handleOpenEndTenure(tenure) {
    setTenureMode('end');
    setEditingTenure(tenure);
    setTenureForm({
      personId: tenure.personId,
      dateStarted: tenure.dateStarted || '',
      dateEnded: '',
      acquisitionType: tenure.acquisitionType || 'inheritance',
      endType: 'death',
      notes: tenure.notes || ''
    });
    setShowTenureModal(true);
  }
  
  function handleCloseTenureModal() {
    setShowTenureModal(false);
    setEditingTenure(null);
    setTenureForm({
      personId: '',
      dateStarted: '',
      dateEnded: '',
      acquisitionType: 'inheritance',
      endType: '',
      notes: ''
    });
  }
  
  async function handleSaveTenure() {
    if (tenureMode === 'add' && !tenureForm.personId) {
      alert('Please select who held this dignity');
      return;
    }
    
    try {
      setSavingTenure(true);
      
      if (tenureMode === 'end' && editingTenure) {
        // End an existing tenure
        await updateDignityTenure(editingTenure.id, {
          dateEnded: tenureForm.dateEnded || null,
          endType: tenureForm.endType || null,
          notes: tenureForm.notes || null
        }, user?.uid);
        
        // If ending current tenure, mark dignity as vacant or update holder
        if (!editingTenure.dateEnded) {
          await updateDignity(parseInt(id), {
            currentHolderId: null,
            isVacant: true
          }, user?.uid);
        }
      } else {
        // Add new tenure
        await createDignityTenure({
          dignityId: parseInt(id),
          personId: parseInt(tenureForm.personId),
          dateStarted: tenureForm.dateStarted || null,
          dateEnded: tenureForm.dateEnded || null,
          acquisitionType: tenureForm.acquisitionType,
          endType: tenureForm.dateEnded ? tenureForm.endType : null,
          notes: tenureForm.notes || null
        }, user?.uid);
        
        // If this is a current tenure (no end date), update dignity's current holder
        if (!tenureForm.dateEnded) {
          const selectedPerson = people.find(p => p.id === parseInt(tenureForm.personId));
          await updateDignity(parseInt(id), {
            currentHolderId: parseInt(tenureForm.personId),
            currentHouseId: selectedPerson?.houseId || dignity.currentHouseId,
            isVacant: false
          }, user?.uid);
        }
      }
      
      // Refresh data
      await loadData();
      handleCloseTenureModal();
    } catch (err) {
      console.error('Error saving tenure:', err);
      alert('Failed to save tenure record');
    } finally {
      setSavingTenure(false);
    }
  }
  
  async function handleDeleteTenure(tenureId) {
    if (!window.confirm('Delete this tenure record? This cannot be undone.')) {
      return;
    }
    
    try {
      await deleteDignityTenure(tenureId, user?.uid);
      await loadData();
    } catch (err) {
      console.error('Error deleting tenure:', err);
      alert('Failed to delete tenure record');
    }
  }
  
  // ==================== SUCCESSION MANAGEMENT ====================
  
  function handleOpenSuccessionRules() {
    const rules = dignity?.successionRules || {};
    setSuccessionRulesForm({
      successionType: dignity?.successionType || 'male-primogeniture',
      excludeBastards: rules.excludeBastards !== false,
      legitimizedBastardsEligible: rules.legitimizedBastardsEligible !== false,
      excludeWomen: rules.excludeWomen || false,
      requiresConfirmation: rules.requiresConfirmation || false,
      customNotes: rules.customNotes || '',
      designatedHeirId: dignity?.designatedHeirId || ''
    });
    setShowSuccessionRulesModal(true);
  }
  
  function handleCloseSuccessionRulesModal() {
    setShowSuccessionRulesModal(false);
  }
  
  async function handleSaveSuccessionRules() {
    try {
      setSavingRules(true);
      
      await updateDignity(parseInt(id), {
        successionType: successionRulesForm.successionType,
        successionRules: {
          excludeBastards: successionRulesForm.excludeBastards,
          legitimizedBastardsEligible: successionRulesForm.legitimizedBastardsEligible,
          excludeWomen: successionRulesForm.excludeWomen,
          requiresConfirmation: successionRulesForm.requiresConfirmation,
          customNotes: successionRulesForm.customNotes || null
        },
        designatedHeirId: successionRulesForm.designatedHeirId 
          ? parseInt(successionRulesForm.designatedHeirId) 
          : null
      }, user?.uid);
      
      await loadData();
      handleCloseSuccessionRulesModal();
    } catch (err) {
      console.error('Error saving succession rules:', err);
      alert('Failed to save succession rules');
    } finally {
      setSavingRules(false);
    }
  }
  
  // ==================== DISPUTE MANAGEMENT ====================
  
  function handleOpenAddDispute() {
    setDisputeMode('add');
    setEditingDispute(null);
    setDisputeForm({
      claimantId: '',
      claimType: 'hereditary',
      claimStrength: 'moderate',
      claimBasis: '',
      supportingFactions: '',
      startDate: '',
      notes: '',
      resolution: '',
      resolvedDate: ''
    });
    setShowDisputeModal(true);
  }
  
  function handleOpenResolveDispute(dispute) {
    setDisputeMode('resolve');
    setEditingDispute(dispute);
    setDisputeForm({
      ...disputeForm,
      claimantId: dispute.claimantId,
      resolution: '',
      resolvedDate: ''
    });
    setShowDisputeModal(true);
  }
  
  function handleCloseDisputeModal() {
    setShowDisputeModal(false);
    setEditingDispute(null);
  }
  
  async function handleSaveDispute() {
    if (disputeMode === 'add' && !disputeForm.claimantId) {
      alert('Please select a claimant');
      return;
    }
    
    try {
      setSavingDispute(true);
      
      if (disputeMode === 'resolve' && editingDispute) {
        await resolveDispute(
          parseInt(id),
          editingDispute.id,
          disputeForm.resolution,
          disputeForm.resolvedDate || null,
          user?.uid
        );
      } else {
        await addDispute(parseInt(id), {
          claimantId: parseInt(disputeForm.claimantId),
          claimType: disputeForm.claimType,
          claimStrength: disputeForm.claimStrength,
          claimBasis: disputeForm.claimBasis,
          supportingFactions: disputeForm.supportingFactions
            ? disputeForm.supportingFactions.split(',').map(s => s.trim())
            : [],
          startDate: disputeForm.startDate || null,
          notes: disputeForm.notes || null
        }, user?.uid);
      }
      
      await loadData();
      handleCloseDisputeModal();
    } catch (err) {
      console.error('Error saving dispute:', err);
      alert('Failed to save dispute');
    } finally {
      setSavingDispute(false);
    }
  }
  
  async function handleRemoveDispute(disputeId) {
    if (!window.confirm('Remove this disputed claim? This cannot be undone.')) {
      return;
    }
    
    try {
      await removeDispute(parseInt(id), disputeId, user?.uid);
      await loadData();
    } catch (err) {
      console.error('Error removing dispute:', err);
      alert('Failed to remove dispute');
    }
  }
  
  // ==================== INTERREGNUM MANAGEMENT ====================
  
  function handleOpenInterregnum() {
    const existing = dignity?.interregnum || {};
    setInterregnumForm({
      startDate: existing.startDate || '',
      regentId: existing.regentId || '',
      regentTitle: existing.regentTitle || 'Regent',
      reason: existing.reason || 'vacancy',
      notes: existing.notes || ''
    });
    setShowInterregnumModal(true);
  }
  
  function handleCloseInterregnumModal() {
    setShowInterregnumModal(false);
  }
  
  async function handleSaveInterregnum() {
    try {
      setSavingInterregnum(true);
      
      await setInterregnum(parseInt(id), {
        startDate: interregnumForm.startDate || null,
        regentId: interregnumForm.regentId 
          ? parseInt(interregnumForm.regentId) 
          : null,
        regentTitle: interregnumForm.regentTitle || 'Regent',
        reason: interregnumForm.reason,
        notes: interregnumForm.notes || null
      }, user?.uid);
      
      await loadData();
      handleCloseInterregnumModal();
    } catch (err) {
      console.error('Error setting interregnum:', err);
      alert('Failed to set interregnum');
    } finally {
      setSavingInterregnum(false);
    }
  }
  
  async function handleEndInterregnum() {
    // Get first eligible heir
    const heir = successionLine.find(c => !c.excluded);
    if (!heir) {
      alert('No eligible heir found. Please add a tenure record manually.');
      return;
    }
    
    if (!window.confirm(`End interregnum and install ${getPersonName(heir.personId)} as the new holder?`)) {
      return;
    }
    
    try {
      await endInterregnum(parseInt(id), heir.personId, user?.uid);
      await loadData();
    } catch (err) {
      console.error('Error ending interregnum:', err);
      alert('Failed to end interregnum');
    }
  }
  
  // Loading state
  if (loading) {
    return (
      <>
        <Navigation />
        <div className="dignity-view-page loading">
          <div className="loading-spinner">
            <div className="loading-icon">📜</div>
            <p>Loading dignity...</p>
          </div>
        </div>
      </>
    );
  }
  
  // Error state
  if (error) {
    return (
      <>
        <Navigation />
        <div className="dignity-view-page error">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h2>Error</h2>
            <p>{error}</p>
            <button 
              className="back-btn"
              onClick={() => navigate('/dignities')}
            >
              Back to Rolls
            </button>
          </div>
        </div>
      </>
    );
  }
  
  const classInfo = getClassInfo(dignity.dignityClass);
  const rankInfo = getRankInfo(dignity.dignityClass, dignity.dignityRank);
  const tenureTypeInfo = getTenureTypeInfo(dignity.tenureType);
  const icon = getDignityIcon(dignity);
  const holderName = getPersonName(dignity.currentHolderId);
  const houseName = getHouseName(dignity.currentHouseId);
  const houseColor = getHouseColor(dignity.currentHouseId);
  
  // Get sworn-to dignity info
  const swornToDignity = feudalChain.length > 1 ? feudalChain[1] : null;
  
  return (
    <>
      <Navigation />
      <div className="dignity-view-page">
        
        {/* Header */}
        <header className="view-header">
          <button 
            className="back-button"
            onClick={() => navigate('/dignities')}
          >
            ← Back to Rolls
          </button>
          
          <div className="header-content">
            <div className={`class-badge ${dignity.dignityClass}`}>
              <span className="badge-icon">{classInfo.icon}</span>
              <span className="badge-text">{classInfo.name}</span>
            </div>
            
            <div className="title-row">
              <span className="title-icon">{icon}</span>
              <h1 className="title-name">{dignity.name}</h1>
            </div>
            
            {rankInfo && (
              <p className="title-rank">{rankInfo.name} — {rankInfo.description}</p>
            )}
            
            {dignity.isVacant && (
              <span className="vacant-badge">⚠️ Currently Vacant</span>
            )}
          </div>
          
          <div className="header-actions">
            <button 
              className="edit-button"
              onClick={handleEdit}
            >
              ✏️ Edit
            </button>
            <button 
              className="delete-button"
              onClick={handleDelete}
            >
              🗑️ Delete
            </button>
          </div>
        </header>
        
        {/* Main Content */}
        <div className="view-content">
          
          {/* Left Column */}
          <div className="main-column">
            
            {/* Current Holder Section */}
            <section className="view-section">
              <h2 className="section-title">
                <span className="section-icon">👤</span>
                Current Holder
              </h2>
              
              {holderName ? (
                <div className="holder-card">
                  <div 
                    className="holder-indicator"
                    style={{ backgroundColor: houseColor }}
                  />
                  <div className="holder-info">
                    <span 
                      className="holder-name"
                      onClick={() => handleNavigateToPerson(dignity.currentHolderId)}
                    >
                      {holderName}
                    </span>
                    {houseName && (
                      <span 
                        className="holder-house"
                        onClick={() => handleNavigateToHouse(dignity.currentHouseId)}
                      >
                        of {houseName}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="no-holder">
                  <span className="vacant-icon">⚪</span>
                  <span className="vacant-text">
                    {dignity.isVacant ? 'This dignity is currently vacant' : 'No holder assigned'}
                  </span>
                </div>
              )}
              
              {houseName && dignity.isHereditary && (
                <div className="hereditary-note">
                  <span className="note-icon">🏠</span>
                  <span>Held hereditarily by <strong>{houseName}</strong></span>
                </div>
              )}
            </section>
            
            {/* Feudal Hierarchy Section */}
            <section className="view-section">
              <h2 className="section-title">
                <span className="section-icon">⚔️</span>
                Feudal Hierarchy
              </h2>
              
              {/* Sworn To */}
              {swornToDignity ? (
                <div className="hierarchy-item sworn-to">
                  <span className="hierarchy-label">Sworn To:</span>
                  <div 
                    className="hierarchy-link"
                    onClick={() => handleNavigateToDignity(swornToDignity.id)}
                  >
                    <span className="link-icon">{getDignityIcon(swornToDignity)}</span>
                    <span className="link-name">{swornToDignity.name}</span>
                  </div>
                  {dignity.fealtyType && (
                    <span className="fealty-type">
                      ({getFealtyTypeInfo(dignity.fealtyType).name})
                    </span>
                  )}
                </div>
              ) : (
                <div className="hierarchy-item apex">
                  <span className="hierarchy-label">Sworn To:</span>
                  <span className="apex-text">
                    ♛ The Crown of Estargenn (Apex)
                  </span>
                </div>
              )}
              
              {/* Full Chain */}
              {feudalChain.length > 2 && (
                <div className="feudal-chain">
                  <h4 className="chain-title">Chain of Fealty:</h4>
                  <div className="chain-list">
                    {feudalChain.map((d, index) => (
                      <div key={d.id} className="chain-item">
                        {index > 0 && <span className="chain-arrow">↑</span>}
                        <span 
                          className={`chain-name ${d.id === parseInt(id) ? 'current' : ''}`}
                          onClick={() => d.id !== parseInt(id) && handleNavigateToDignity(d.id)}
                        >
                          {getDignityIcon(d)} {d.name}
                        </span>
                      </div>
                    ))}
                    <div className="chain-item">
                      <span className="chain-arrow">↑</span>
                      <span className="chain-name crown">♛ Crown of Estargenn</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Subordinates */}
              {subordinates.length > 0 && (
                <div className="subordinates">
                  <h4 className="sub-title">Sworn Subordinates ({subordinates.length}):</h4>
                  <div className="sub-list">
                    {subordinates.map(sub => (
                      <div 
                        key={sub.id}
                        className="sub-item"
                        onClick={() => handleNavigateToDignity(sub.id)}
                      >
                        <span className="sub-icon">{getDignityIcon(sub)}</span>
                        <span className="sub-name">{sub.name}</span>
                        {sub.currentHolderId && (
                          <span className="sub-holder">
                            ({getPersonName(sub.currentHolderId)})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
            
            {/* ==================== SUCCESSION SECTION ==================== */}
            <section className="view-section succession-section">
              <h2 className="section-title">
                <span className="section-icon">👑</span>
                Succession
                {dignity.successionStatus && dignity.successionStatus !== 'stable' && (
                  <span className={`succession-status-badge ${dignity.successionStatus}`}>
                    {SUCCESSION_STATUS[dignity.successionStatus]?.icon} {SUCCESSION_STATUS[dignity.successionStatus]?.name}
                  </span>
                )}
              </h2>
              
              {/* Succession Rules Summary */}
              <div className="succession-rules-summary">
                <div className="rules-header">
                  <h4>Succession Rules</h4>
                  <button 
                    className="edit-rules-btn"
                    onClick={handleOpenSuccessionRules}
                  >
                    ⚙️ Configure
                  </button>
                </div>
                <div className="rules-details">
                  <div className="rule-item">
                    <span className="rule-label">Type:</span>
                    <span className="rule-value">
                      {SUCCESSION_TYPES[dignity.successionType || 'male-primogeniture']?.icon}{' '}
                      {SUCCESSION_TYPES[dignity.successionType || 'male-primogeniture']?.name}
                    </span>
                  </div>
                  {dignity.designatedHeirId && (
                    <div className="rule-item designated">
                      <span className="rule-label">Designated Heir:</span>
                      <span className="rule-value">
                        {getPersonName(dignity.designatedHeirId)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Interregnum Alert */}
              {dignity.interregnum && (
                <div className="interregnum-alert">
                  <div className="interregnum-header">
                    <span className="interregnum-icon">⏳</span>
                    <span className="interregnum-title">Currently in Interregnum</span>
                  </div>
                  <div className="interregnum-details">
                    {dignity.interregnum.regentId && (
                      <p>
                        <strong>{dignity.interregnum.regentTitle}:</strong>{' '}
                        {getPersonName(dignity.interregnum.regentId)}
                      </p>
                    )}
                    {dignity.interregnum.reason && (
                      <p>
                        <strong>Reason:</strong>{' '}
                        {INTERREGNUM_REASONS[dignity.interregnum.reason]?.name || dignity.interregnum.reason}
                      </p>
                    )}
                    {dignity.interregnum.startDate && (
                      <p><strong>Since:</strong> {formatDate(dignity.interregnum.startDate)}</p>
                    )}
                  </div>
                  <div className="interregnum-actions">
                    <button 
                      className="end-interregnum-btn"
                      onClick={handleEndInterregnum}
                      disabled={successionLine.length === 0}
                    >
                      ✅ End Interregnum
                    </button>
                    <button 
                      className="edit-interregnum-btn"
                      onClick={handleOpenInterregnum}
                    >
                      ✏️ Edit
                    </button>
                  </div>
                </div>
              )}
              
              {/* Line of Succession */}
              <div className="succession-line">
                <div className="line-header">
                  <h4>Line of Succession</h4>
                  {!dignity.interregnum && !dignity.isVacant && (
                    <button 
                      className="set-interregnum-btn"
                      onClick={handleOpenInterregnum}
                    >
                      ⏳ Set Interregnum
                    </button>
                  )}
                </div>
                
                {loadingSuccession ? (
                  <div className="loading-succession">
                    <span>Calculating succession...</span>
                  </div>
                ) : successionLine.length === 0 ? (
                  <div className="no-succession">
                    <p>
                      {!dignity.currentHolderId 
                        ? 'No current holder - cannot calculate succession.'
                        : SUCCESSION_TYPES[dignity.successionType]?.autoCalculate === false
                          ? `${SUCCESSION_TYPES[dignity.successionType]?.name} does not auto-calculate succession.`
                          : 'No eligible heirs found in the family tree.'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="succession-list">
                    {successionLine.slice(0, 10).map((candidate, index) => (
                      <div 
                        key={candidate.personId}
                        className={`succession-item ${candidate.excluded ? 'excluded' : ''} ${index === 0 && !candidate.excluded ? 'heir' : ''}`}
                      >
                        <div className="succession-position">
                          {candidate.excluded ? '✕' : candidate.position}
                        </div>
                        <div className="succession-person">
                          <span 
                            className="succession-name"
                            onClick={() => handleNavigateToPerson(candidate.personId)}
                          >
                            {getPersonName(candidate.personId)}
                          </span>
                          <span className="succession-relationship">
                            {candidate.relationship}
                            {candidate.branch === 'collateral' && ' (collateral)'}
                          </span>
                        </div>
                        {candidate.excluded && (
                          <span className="exclusion-reason">
                            {candidate.exclusionReason}
                          </span>
                        )}
                        {index === 0 && !candidate.excluded && (
                          <span className="heir-badge">Heir</span>
                        )}
                      </div>
                    ))}
                    {successionLine.length > 10 && (
                      <div className="succession-more">
                        +{successionLine.length - 10} more in line
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Disputed Claims */}
              <div className="disputes-section">
                <div className="disputes-header">
                  <h4>
                    Disputed Claims
                    {dignity.disputes && dignity.disputes.filter(d => d.resolution === 'ongoing').length > 0 && (
                      <span className="disputes-count">
                        ({dignity.disputes.filter(d => d.resolution === 'ongoing').length} active)
                      </span>
                    )}
                  </h4>
                  <button 
                    className="add-dispute-btn"
                    onClick={handleOpenAddDispute}
                  >
                    + Add Claim
                  </button>
                </div>
                
                {(!dignity.disputes || dignity.disputes.length === 0) ? (
                  <div className="no-disputes">
                    <p>No disputed claims on this dignity.</p>
                  </div>
                ) : (
                  <div className="disputes-list">
                    {dignity.disputes.map(dispute => (
                      <div 
                        key={dispute.id}
                        className={`dispute-item ${dispute.resolution}`}
                      >
                        <div className="dispute-header">
                          <span className="dispute-claimant">
                            {CLAIM_TYPES[dispute.claimType]?.icon} {getPersonName(dispute.claimantId)}
                          </span>
                          <span className={`claim-strength ${dispute.claimStrength}`}>
                            {CLAIM_STRENGTHS[dispute.claimStrength]?.name}
                          </span>
                        </div>
                        <div className="dispute-details">
                          <span className="claim-type">
                            {CLAIM_TYPES[dispute.claimType]?.name} claim
                          </span>
                          {dispute.startDate && (
                            <span className="dispute-date">
                              Since {formatDate(dispute.startDate)}
                            </span>
                          )}
                        </div>
                        {dispute.claimBasis && (
                          <p className="claim-basis">"{dispute.claimBasis}"</p>
                        )}
                        {dispute.resolution !== 'ongoing' && (
                          <div className="dispute-resolution">
                            <span className="resolution-badge">
                              {DISPUTE_RESOLUTIONS[dispute.resolution]?.name}
                            </span>
                            {dispute.resolvedDate && (
                              <span className="resolved-date">
                                {formatDate(dispute.resolvedDate)}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="dispute-actions">
                          {dispute.resolution === 'ongoing' && (
                            <button
                              className="resolve-dispute-btn"
                              onClick={() => handleOpenResolveDispute(dispute)}
                            >
                              ✓ Resolve
                            </button>
                          )}
                          <button
                            className="remove-dispute-btn"
                            onClick={() => handleRemoveDispute(dispute.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
            
            {/* Tenure History Section */}
            <section className="view-section">
              <h2 className="section-title">
                <span className="section-icon">📜</span>
                Tenure History
              </h2>
              
              {/* Add Tenure Button - Always visible */}
              <div className="tenure-actions">
                <button 
                  className="add-tenure-btn"
                  onClick={handleOpenAddTenure}
                >
                  + Add Tenure Record
                </button>
              </div>
              
              {tenures.length === 0 ? (
                <div className="no-tenures">
                  <p>No tenure records have been added yet.</p>
                </div>
              ) : (
                <div className="tenure-list">
                  {tenures.map((tenure, index) => {
                    const isCurrentTenure = !tenure.dateEnded;
                    const personName = getPersonName(tenure.personId);
                    
                    return (
                      <div 
                        key={tenure.id}
                        className={`tenure-item ${isCurrentTenure ? 'current' : ''}`}
                      >
                        <div className="tenure-number">
                          {tenures.length - index}
                        </div>
                        <div className="tenure-content">
                          <div className="tenure-header">
                            <span 
                              className="tenure-holder"
                              onClick={() => handleNavigateToPerson(tenure.personId)}
                            >
                              {personName || 'Unknown Person'}
                            </span>
                            {isCurrentTenure && (
                              <span className="current-badge">Current</span>
                            )}
                          </div>
                          <div className="tenure-dates">
                            {formatDate(tenure.dateStarted)} — {tenure.dateEnded ? formatDate(tenure.dateEnded) : 'Present'}
                          </div>
                          <div className="tenure-details">
                            {tenure.acquisitionType && (
                              <span className="acquisition">
                                Acquired by: {getAcquisitionInfo(tenure.acquisitionType).name}
                              </span>
                            )}
                            {tenure.endType && (
                              <span className="end-type">
                                Ended by: {getEndInfo(tenure.endType).name}
                              </span>
                            )}
                          </div>
                          {tenure.notes && (
                            <div className="tenure-notes">{tenure.notes}</div>
                          )}
                          
                          {/* Tenure Actions */}
                          <div className="tenure-item-actions">
                            {isCurrentTenure && (
                              <button
                                className="tenure-action-btn end"
                                onClick={() => handleOpenEndTenure(tenure)}
                                title="End this tenure"
                              >
                                ⏹️ End Tenure
                              </button>
                            )}
                            <button
                              className="tenure-action-btn delete"
                              onClick={() => handleDeleteTenure(tenure.id)}
                              title="Delete record"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
            
          </div>
          
          {/* Right Column - Details Sidebar */}
          <aside className="details-sidebar">
            
            {/* Quick Facts */}
            <div className="sidebar-section">
              <h3 className="sidebar-title">Quick Facts</h3>
              <dl className="facts-list">
                <div className="fact-item">
                  <dt>Class</dt>
                  <dd>{classInfo.icon} {classInfo.name}</dd>
                </div>
                <div className="fact-item">
                  <dt>Rank</dt>
                  <dd>{rankInfo?.name || 'Unknown'}</dd>
                </div>
                <div className="fact-item">
                  <dt>Type</dt>
                  <dd>{dignity.isHereditary ? 'Hereditary' : 'Personal/Appointed'}</dd>
                </div>
                <div className="fact-item">
                  <dt>Status</dt>
                  <dd>{dignity.isVacant ? '⚠️ Vacant' : '✓ Held'}</dd>
                </div>
              </dl>
            </div>
            
            {/* Location */}
            {(dignity.placeName || dignity.seatName) && (
              <div className="sidebar-section">
                <h3 className="sidebar-title">Location</h3>
                <dl className="facts-list">
                  {dignity.placeName && (
                    <div className="fact-item">
                      <dt>Place</dt>
                      <dd>📍 {dignity.placeName}</dd>
                    </div>
                  )}
                  {dignity.seatName && (
                    <div className="fact-item">
                      <dt>Seat</dt>
                      <dd>🏰 {dignity.seatName}</dd>
                    </div>
                  )}
                  {dignity.tenureType && (
                    <div className="fact-item">
                      <dt>Tenure Style</dt>
                      <dd>{tenureTypeInfo.name}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
            
            {/* Notes */}
            {dignity.notes && (
              <div className="sidebar-section">
                <h3 className="sidebar-title">Notes</h3>
                <p className="notes-text">{dignity.notes}</p>
              </div>
            )}
            
            {/* Metadata */}
            <div className="sidebar-section metadata">
              <h3 className="sidebar-title">Record Info</h3>
              <dl className="facts-list">
                <div className="fact-item">
                  <dt>Created</dt>
                  <dd>{formatTimestamp(dignity.created)}</dd>
                </div>
                <div className="fact-item">
                  <dt>Updated</dt>
                  <dd>{formatTimestamp(dignity.updated)}</dd>
                </div>
                <div className="fact-item">
                  <dt>Record ID</dt>
                  <dd>#{dignity.id}</dd>
                </div>
              </dl>
            </div>
            
          </aside>
          
        </div>
        
      </div>
      
      {/* ==================== TENURE MODAL ==================== */}
      {showTenureModal && (
        <div className="tenure-modal-overlay" onClick={handleCloseTenureModal}>
          <div className="tenure-modal" onClick={e => e.stopPropagation()}>
            <div className="tenure-modal-header">
              <h3>
                {tenureMode === 'end' ? '⏹️ End Tenure' : '📜 Add Tenure Record'}
              </h3>
              <button 
                className="modal-close-btn"
                onClick={handleCloseTenureModal}
              >
                ✕
              </button>
            </div>
            
            <div className="tenure-modal-body">
              {tenureMode === 'end' ? (
                /* End Tenure Mode */
                <>
                  <p className="modal-description">
                    Recording the end of <strong>{getPersonName(editingTenure?.personId)}</strong>'s 
                    tenure as <strong>{dignity?.name}</strong>.
                  </p>
                  
                  <div className="form-group">
                    <label>Date Ended</label>
                    <input
                      type="text"
                      value={tenureForm.dateEnded}
                      onChange={(e) => setTenureForm({...tenureForm, dateEnded: e.target.value})}
                      placeholder="e.g., 1287 or 1287-03-15"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>How Did It End?</label>
                    <select
                      value={tenureForm.endType}
                      onChange={(e) => setTenureForm({...tenureForm, endType: e.target.value})}
                    >
                      <option value="">— Select —</option>
                      {Object.entries(END_TYPES).map(([key, info]) => (
                        <option key={key} value={key}>{info.name}</option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                /* Add Tenure Mode */
                <>
                  <div className="form-group">
                    <label>Who Held This Dignity? *</label>
                    <select
                      value={tenureForm.personId}
                      onChange={(e) => setTenureForm({...tenureForm, personId: e.target.value})}
                      required
                    >
                      <option value="">— Select Person —</option>
                      {people
                        .sort((a, b) => `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`))
                        .map(p => (
                          <option key={p.id} value={p.id}>
                            {p.firstName} {p.lastName}
                            {houses.find(h => h.id === p.houseId)?.houseName && 
                              ` (${houses.find(h => h.id === p.houseId).houseName})`
                            }
                          </option>
                        ))
                      }
                    </select>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Date Started</label>
                      <input
                        type="text"
                        value={tenureForm.dateStarted}
                        onChange={(e) => setTenureForm({...tenureForm, dateStarted: e.target.value})}
                        placeholder="e.g., 1245"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Date Ended</label>
                      <input
                        type="text"
                        value={tenureForm.dateEnded}
                        onChange={(e) => setTenureForm({...tenureForm, dateEnded: e.target.value})}
                        placeholder="Leave blank if current"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>How Acquired?</label>
                      <select
                        value={tenureForm.acquisitionType}
                        onChange={(e) => setTenureForm({...tenureForm, acquisitionType: e.target.value})}
                      >
                        {Object.entries(ACQUISITION_TYPES).map(([key, info]) => (
                          <option key={key} value={key}>{info.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    {tenureForm.dateEnded && (
                      <div className="form-group">
                        <label>How Ended?</label>
                        <select
                          value={tenureForm.endType}
                          onChange={(e) => setTenureForm({...tenureForm, endType: e.target.value})}
                        >
                          <option value="">— Select —</option>
                          {Object.entries(END_TYPES).map(([key, info]) => (
                            <option key={key} value={key}>{info.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </>
              )}
              
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={tenureForm.notes}
                  onChange={(e) => setTenureForm({...tenureForm, notes: e.target.value})}
                  placeholder="Any additional details..."
                  rows={3}
                />
              </div>
            </div>
            
            <div className="tenure-modal-footer">
              <button 
                className="modal-cancel-btn"
                onClick={handleCloseTenureModal}
              >
                Cancel
              </button>
              <button 
                className="modal-save-btn"
                onClick={handleSaveTenure}
                disabled={savingTenure || (tenureMode === 'add' && !tenureForm.personId)}
              >
                {savingTenure ? 'Saving...' : (tenureMode === 'end' ? 'End Tenure' : 'Add Record')}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* ==================== SUCCESSION RULES MODAL ==================== */}
      {showSuccessionRulesModal && (
        <div className="modal-overlay" onClick={handleCloseSuccessionRulesModal}>
          <div className="modal succession-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>👑 Succession Rules</h3>
              <button 
                className="modal-close-btn"
                onClick={handleCloseSuccessionRulesModal}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Succession Type *</label>
                <select
                  value={successionRulesForm.successionType}
                  onChange={(e) => setSuccessionRulesForm({...successionRulesForm, successionType: e.target.value})}
                >
                  {Object.entries(SUCCESSION_TYPES).map(([key, info]) => (
                    <option key={key} value={key}>
                      {info.icon} {info.name}
                    </option>
                  ))}
                </select>
                <p className="form-hint">
                  {SUCCESSION_TYPES[successionRulesForm.successionType]?.description}
                </p>
              </div>
              
              {SUCCESSION_TYPES[successionRulesForm.successionType]?.autoCalculate && (
                <>
                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={successionRulesForm.excludeBastards}
                        onChange={(e) => setSuccessionRulesForm({...successionRulesForm, excludeBastards: e.target.checked})}
                      />
                      Exclude bastards from succession
                    </label>
                  </div>
                  
                  {successionRulesForm.excludeBastards && (
                    <div className="form-group checkbox-group indent">
                      <label>
                        <input
                          type="checkbox"
                          checked={successionRulesForm.legitimizedBastardsEligible}
                          onChange={(e) => setSuccessionRulesForm({...successionRulesForm, legitimizedBastardsEligible: e.target.checked})}
                        />
                        Legitimized bastards are eligible
                      </label>
                    </div>
                  )}
                </>
              )}
              
              <div className="form-group">
                <label>Designated Heir (Override)</label>
                <select
                  value={successionRulesForm.designatedHeirId}
                  onChange={(e) => setSuccessionRulesForm({...successionRulesForm, designatedHeirId: e.target.value})}
                >
                  <option value="">— Use calculated succession —</option>
                  {people
                    .filter(p => !p.dateOfDeath)
                    .sort((a, b) => `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`))
                    .map(p => (
                      <option key={p.id} value={p.id}>
                        {p.firstName} {p.lastName}
                        {houses.find(h => h.id === p.houseId)?.houseName && 
                          ` (${houses.find(h => h.id === p.houseId).houseName})`
                        }
                      </option>
                    ))
                  }
                </select>
                <p className="form-hint">
                  Override automatic succession with a specific heir.
                </p>
              </div>
              
              <div className="form-group">
                <label>Custom Notes</label>
                <textarea
                  value={successionRulesForm.customNotes}
                  onChange={(e) => setSuccessionRulesForm({...successionRulesForm, customNotes: e.target.value})}
                  placeholder="Any special succession rules or notes..."
                  rows={3}
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="modal-cancel-btn"
                onClick={handleCloseSuccessionRulesModal}
              >
                Cancel
              </button>
              <button 
                className="modal-save-btn"
                onClick={handleSaveSuccessionRules}
                disabled={savingRules}
              >
                {savingRules ? 'Saving...' : 'Save Rules'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* ==================== DISPUTE MODAL ==================== */}
      {showDisputeModal && (
        <div className="modal-overlay" onClick={handleCloseDisputeModal}>
          <div className="modal dispute-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {disputeMode === 'resolve' ? '✓ Resolve Dispute' : '⚔️ Add Disputed Claim'}
              </h3>
              <button 
                className="modal-close-btn"
                onClick={handleCloseDisputeModal}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              {disputeMode === 'resolve' ? (
                /* Resolve Mode */
                <>
                  <p className="modal-description">
                    Resolving <strong>{getPersonName(editingDispute?.claimantId)}</strong>'s 
                    claim to <strong>{dignity?.name}</strong>.
                  </p>
                  
                  <div className="form-group">
                    <label>Resolution *</label>
                    <select
                      value={disputeForm.resolution}
                      onChange={(e) => setDisputeForm({...disputeForm, resolution: e.target.value})}
                    >
                      <option value="">— Select Resolution —</option>
                      {Object.entries(DISPUTE_RESOLUTIONS)
                        .filter(([key]) => key !== 'ongoing')
                        .map(([key, info]) => (
                          <option key={key} value={key}>{info.name}</option>
                        ))
                      }
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Date Resolved</label>
                    <input
                      type="text"
                      value={disputeForm.resolvedDate}
                      onChange={(e) => setDisputeForm({...disputeForm, resolvedDate: e.target.value})}
                      placeholder="e.g., 1287"
                    />
                  </div>
                </>
              ) : (
                /* Add Mode */
                <>
                  <div className="form-group">
                    <label>Claimant *</label>
                    <select
                      value={disputeForm.claimantId}
                      onChange={(e) => setDisputeForm({...disputeForm, claimantId: e.target.value})}
                    >
                      <option value="">— Select Claimant —</option>
                      {people
                        .filter(p => !p.dateOfDeath)
                        .sort((a, b) => `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`))
                        .map(p => (
                          <option key={p.id} value={p.id}>
                            {p.firstName} {p.lastName}
                            {houses.find(h => h.id === p.houseId)?.houseName && 
                              ` (${houses.find(h => h.id === p.houseId).houseName})`
                            }
                          </option>
                        ))
                      }
                    </select>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Claim Type</label>
                      <select
                        value={disputeForm.claimType}
                        onChange={(e) => setDisputeForm({...disputeForm, claimType: e.target.value})}
                      >
                        {Object.entries(CLAIM_TYPES).map(([key, info]) => (
                          <option key={key} value={key}>
                            {info.icon} {info.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Claim Strength</label>
                      <select
                        value={disputeForm.claimStrength}
                        onChange={(e) => setDisputeForm({...disputeForm, claimStrength: e.target.value})}
                      >
                        {Object.entries(CLAIM_STRENGTHS).map(([key, info]) => (
                          <option key={key} value={key}>{info.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Claim Basis</label>
                    <input
                      type="text"
                      value={disputeForm.claimBasis}
                      onChange={(e) => setDisputeForm({...disputeForm, claimBasis: e.target.value})}
                      placeholder="e.g., Grandson of King Aldric through female line"
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Date Claim Made</label>
                      <input
                        type="text"
                        value={disputeForm.startDate}
                        onChange={(e) => setDisputeForm({...disputeForm, startDate: e.target.value})}
                        placeholder="e.g., 1285"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Supporting Factions</label>
                      <input
                        type="text"
                        value={disputeForm.supportingFactions}
                        onChange={(e) => setDisputeForm({...disputeForm, supportingFactions: e.target.value})}
                        placeholder="Comma-separated list"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Notes</label>
                    <textarea
                      value={disputeForm.notes}
                      onChange={(e) => setDisputeForm({...disputeForm, notes: e.target.value})}
                      placeholder="Additional details about the claim..."
                      rows={3}
                    />
                  </div>
                </>
              )}
            </div>
            
            <div className="modal-footer">
              <button 
                className="modal-cancel-btn"
                onClick={handleCloseDisputeModal}
              >
                Cancel
              </button>
              <button 
                className="modal-save-btn"
                onClick={handleSaveDispute}
                disabled={savingDispute || (disputeMode === 'add' && !disputeForm.claimantId) || (disputeMode === 'resolve' && !disputeForm.resolution)}
              >
                {savingDispute ? 'Saving...' : (disputeMode === 'resolve' ? 'Resolve Claim' : 'Add Claim')}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* ==================== INTERREGNUM MODAL ==================== */}
      {showInterregnumModal && (
        <div className="modal-overlay" onClick={handleCloseInterregnumModal}>
          <div className="modal interregnum-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>⏳ Set Interregnum</h3>
              <button 
                className="modal-close-btn"
                onClick={handleCloseInterregnumModal}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <p className="modal-description">
                An interregnum is a period between rulers when the dignity is vacant or 
                the holder cannot exercise power (e.g., minority, incapacity).
              </p>
              
              <div className="form-group">
                <label>Reason</label>
                <select
                  value={interregnumForm.reason}
                  onChange={(e) => setInterregnumForm({...interregnumForm, reason: e.target.value})}
                >
                  {Object.entries(INTERREGNUM_REASONS).map(([key, info]) => (
                    <option key={key} value={key}>{info.name}</option>
                  ))}
                </select>
                <p className="form-hint">
                  {INTERREGNUM_REASONS[interregnumForm.reason]?.description}
                </p>
              </div>
              
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="text"
                  value={interregnumForm.startDate}
                  onChange={(e) => setInterregnumForm({...interregnumForm, startDate: e.target.value})}
                  placeholder="e.g., 1287"
                />
              </div>
              
              <div className="form-group">
                <label>Regent (if applicable)</label>
                <select
                  value={interregnumForm.regentId}
                  onChange={(e) => setInterregnumForm({...interregnumForm, regentId: e.target.value})}
                >
                  <option value="">— No Regent —</option>
                  {people
                    .filter(p => !p.dateOfDeath)
                    .sort((a, b) => `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`))
                    .map(p => (
                      <option key={p.id} value={p.id}>
                        {p.firstName} {p.lastName}
                        {houses.find(h => h.id === p.houseId)?.houseName && 
                          ` (${houses.find(h => h.id === p.houseId).houseName})`
                        }
                      </option>
                    ))
                  }
                </select>
              </div>
              
              {interregnumForm.regentId && (
                <div className="form-group">
                  <label>Regent's Title</label>
                  <input
                    type="text"
                    value={interregnumForm.regentTitle}
                    onChange={(e) => setInterregnumForm({...interregnumForm, regentTitle: e.target.value})}
                    placeholder="e.g., Lord Protector, Queen Regent"
                  />
                </div>
              )}
              
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={interregnumForm.notes}
                  onChange={(e) => setInterregnumForm({...interregnumForm, notes: e.target.value})}
                  placeholder="Additional details about the interregnum..."
                  rows={3}
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="modal-cancel-btn"
                onClick={handleCloseInterregnumModal}
              >
                Cancel
              </button>
              <button 
                className="modal-save-btn"
                onClick={handleSaveInterregnum}
                disabled={savingInterregnum}
              >
                {savingInterregnum ? 'Saving...' : 'Set Interregnum'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DignityView;
