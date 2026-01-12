import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  createDignity,
  getDignity,
  updateDignity,
  getAllDignities,
  DIGNITY_CLASSES,
  DIGNITY_RANKS,
  TENURE_TYPES,
  FEALTY_TYPES,
  DISPLAY_ICONS
} from '../services/dignityService';
import { getAllHouses, getAllPeople } from '../services/database';
import Navigation from '../components/Navigation';
import './DignityForm.css';

/**
 * DignityForm - Create/Edit Dignity
 * 
 * A comprehensive form for recording dignities based on
 * "The Codified Charter of Driht, Ward, and Service"
 * 
 * Handles both create and edit modes based on URL.
 */
function DignityForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth(); // Get current user for cloud sync
  const isEditMode = Boolean(id);
  
  // Form state
  const [formData, setFormData] = useState({
    // Identity
    name: '',
    shortName: '',
    
    // Classification
    dignityClass: 'driht',
    dignityRank: 'drith',
    
    // Tenure (Article IV)
    tenureType: 'of',
    
    // Geographic
    placeName: '',
    seatName: '',
    
    // Feudal Hierarchy (Article V)
    swornToId: '',
    fealtyType: 'sworn-to',
    
    // Current State
    currentHolderId: '',
    currentHouseId: '',
    isVacant: false,
    isHereditary: true,
    
    // Display
    displayIcon: '',
    displayPriority: 0,
    
    // Notes
    notes: ''
  });
  
  // Reference data
  const [houses, setHouses] = useState([]);
  const [people, setPeople] = useState([]);
  const [dignities, setDignities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Load reference data and existing dignity if editing
  useEffect(() => {
    loadData();
  }, [id]);
  
  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      
      const [housesData, peopleData, dignitiesData] = await Promise.all([
        getAllHouses(),
        getAllPeople(),
        getAllDignities()
      ]);
      
      setHouses(housesData);
      setPeople(peopleData);
      setDignities(dignitiesData);
      
      // If editing, load existing dignity
      if (isEditMode) {
        const dignity = await getDignity(parseInt(id));
        if (dignity) {
          setFormData({
            name: dignity.name || '',
            shortName: dignity.shortName || '',
            dignityClass: dignity.dignityClass || 'driht',
            dignityRank: dignity.dignityRank || 'drith',
            tenureType: dignity.tenureType || 'of',
            placeName: dignity.placeName || '',
            seatName: dignity.seatName || '',
            swornToId: dignity.swornToId || '',
            fealtyType: dignity.fealtyType || 'sworn-to',
            currentHolderId: dignity.currentHolderId || '',
            currentHouseId: dignity.currentHouseId || '',
            isVacant: dignity.isVacant || false,
            isHereditary: dignity.isHereditary !== undefined ? dignity.isHereditary : true,
            displayIcon: dignity.displayIcon || '',
            displayPriority: dignity.displayPriority || 0,
            notes: dignity.notes || ''
          });
        } else {
          setError('Dignity not found');
        }
      } else {
        // Check for pre-fill from URL params
        const preHouseId = searchParams.get('houseId');
        const prePersonId = searchParams.get('personId');
        
        if (preHouseId) {
          setFormData(prev => ({ ...prev, currentHouseId: parseInt(preHouseId) }));
        }
        if (prePersonId) {
          setFormData(prev => ({ ...prev, currentHolderId: parseInt(prePersonId) }));
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data');
      setLoading(false);
    }
  }
  
  // Get available ranks for selected class
  function getAvailableRanks() {
    const classRanks = DIGNITY_RANKS[formData.dignityClass];
    if (!classRanks) return [];
    return Object.values(classRanks);
  }
  
  // Get dignities that can be sworn to (exclude self and subordinates)
  function getSwornToOptions() {
    let options = [...dignities];
    
    if (isEditMode) {
      const currentId = parseInt(id);
      
      // Exclude this dignity
      options = options.filter(d => d.id !== currentId);
      
      // Exclude any dignities that are sworn to this one (prevent circular refs)
      // We need to recursively find all subordinates
      function getSubordinateIds(dignityId, visited = new Set()) {
        if (visited.has(dignityId)) return visited;
        visited.add(dignityId);
        
        const subs = dignities.filter(d => d.swornToId === dignityId);
        subs.forEach(sub => getSubordinateIds(sub.id, visited));
        return visited;
      }
      
      const subordinateIds = getSubordinateIds(currentId);
      subordinateIds.delete(currentId); // Don't exclude self twice
      options = options.filter(d => !subordinateIds.has(d.id));
    }
    
    return options;
  }
  
  // ==================== SMART FILTERING ====================
  
  /**
   * Get filtered list of people who can hold this dignity
   * 
   * Filtering rules:
   * 1. If a house is selected, only show people from that house
   * 2. If the dignity is NOT hereditary (personal/appointed), show all people
   * 3. 🪝 Future: Could filter by alive status, age, etc.
   */
  function getFilteredPeople() {
    let filtered = [...people];
    
    // If a house is selected, only show people from that house
    if (formData.currentHouseId) {
      const selectedHouseId = parseInt(formData.currentHouseId);
      filtered = filtered.filter(p => p.houseId === selectedHouseId);
    }
    
    // Sort by house, then by name for easier browsing
    filtered.sort((a, b) => {
      // First sort by house
      const houseA = getHouseName(a.houseId) || 'zzz';
      const houseB = getHouseName(b.houseId) || 'zzz';
      const houseCompare = houseA.localeCompare(houseB);
      if (houseCompare !== 0) return houseCompare;
      
      // Then by name
      const nameA = `${a.firstName} ${a.lastName}`;
      const nameB = `${b.firstName} ${b.lastName}`;
      return nameA.localeCompare(nameB);
    });
    
    return filtered;
  }
  
  /**
   * Get filtered list of houses that can hold this dignity
   * 
   * Filtering rules:
   * 1. If a holder is selected, only show that person's house
   * 2. Otherwise show all houses
   * 3. 🪝 Future: Could filter based on rank (e.g., only main houses for Drihten)
   */
  function getFilteredHouses() {
    let filtered = [...houses];
    
    // If a holder is selected, prioritize their house
    if (formData.currentHolderId) {
      const selectedPersonId = parseInt(formData.currentHolderId);
      const person = people.find(p => p.id === selectedPersonId);
      
      if (person?.houseId) {
        // Only show this person's house when a holder is selected
        filtered = filtered.filter(h => h.id === person.houseId);
      }
    }
    
    // Sort alphabetically
    filtered.sort((a, b) => (a.houseName || '').localeCompare(b.houseName || ''));
    
    return filtered;
  }
  
  /**
   * Check if the current holder selection is still valid after house changes
   * If not, clear it
   */
  function validateHolderSelection(newHouseId) {
    if (!formData.currentHolderId) return;
    
    const selectedPersonId = parseInt(formData.currentHolderId);
    const person = people.find(p => p.id === selectedPersonId);
    
    // If the person doesn't belong to the newly selected house, clear the selection
    if (person && newHouseId && person.houseId !== parseInt(newHouseId)) {
      setFormData(prev => ({ ...prev, currentHolderId: '' }));
    }
  }
  
  /**
   * Check if the current house selection is still valid after holder changes
   * If not, update it to match the holder's house
   */
  function validateHouseSelection(newHolderId) {
    if (!newHolderId) return;
    
    const person = people.find(p => p.id === parseInt(newHolderId));
    
    // If the person has a house, auto-set it
    if (person?.houseId) {
      setFormData(prev => ({ ...prev, currentHouseId: person.houseId }));
    }
  }
  
  // Auto-generate name based on tenure type, rank, and place
  function generateName() {
    if (!formData.placeName) return;
    
    // Get the rank name from the current selection
    const classRanks = DIGNITY_RANKS[formData.dignityClass];
    const rankInfo = classRanks?.[formData.dignityRank];
    const rankName = rankInfo?.name || 'Lord';
    
    // For Sir, the styling is different
    if (formData.dignityClass === 'sir') {
      // Sir doesn't typically use "of Place" - just "Sir [Name]"
      // But we can offer a variant like "Sir, Drithman of [Place]"
      setFormData(prev => ({ ...prev, name: `Sir, Drithman of ${formData.placeName}` }));
      return;
    }
    
    // For Crown dignities, use appropriate styling
    if (formData.dignityClass === 'crown') {
      switch (formData.dignityRank) {
        case 'sovereign':
          setFormData(prev => ({ ...prev, name: `Crown of ${formData.placeName}` }));
          return;
        case 'heir':
          setFormData(prev => ({ ...prev, name: `Heir to ${formData.placeName}` }));
          return;
        case 'prince':
          setFormData(prev => ({ ...prev, name: `Prince of ${formData.placeName}` }));
          return;
      }
    }
    
    let generatedName = '';
    
    switch (formData.tenureType) {
      case 'of':
        generatedName = `${rankName} of ${formData.placeName}`;
        break;
      case 'in':
        generatedName = `${rankName} in ${formData.placeName}`;
        break;
      case 'at':
        generatedName = `${rankName} at ${formData.placeName}`;
        break;
      case 'of-house':
        generatedName = `${rankName} of the House of ${formData.placeName}`;
        break;
      case 'of-name':
        generatedName = `${rankName} of the Name of ${formData.placeName}`;
        break;
      case 'in-fee':
        generatedName = `${rankName} in Fee of ${formData.placeName}`;
        break;
      case 'in-wardship':
        generatedName = `${rankName} in Wardship under ${formData.placeName}`;
        break;
      default:
        generatedName = `${rankName} of ${formData.placeName}`;
    }
    
    setFormData(prev => ({ ...prev, name: generatedName }));
  }
  
  // Handle form field changes
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // When class changes, reset rank to first available
    if (name === 'dignityClass') {
      const classRanks = DIGNITY_RANKS[value];
      if (classRanks) {
        const firstRank = Object.keys(classRanks)[0];
        setFormData(prev => ({ ...prev, dignityRank: firstRank }));
      }
    }
    
    // When holder is selected, auto-set house if person belongs to one
    if (name === 'currentHolderId') {
      if (value) {
        validateHouseSelection(value);
      }
    }
    
    // When house is selected, validate current holder selection
    if (name === 'currentHouseId') {
      if (value) {
        validateHolderSelection(value);
      }
    }
  }
  
  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      const dignityData = {
        ...formData,
        name: formData.name.trim(),
        shortName: formData.shortName.trim() || null,
        placeName: formData.placeName.trim() || null,
        seatName: formData.seatName.trim() || null,
        swornToId: formData.swornToId ? parseInt(formData.swornToId) : null,
        currentHolderId: formData.currentHolderId ? parseInt(formData.currentHolderId) : null,
        currentHouseId: formData.currentHouseId ? parseInt(formData.currentHouseId) : null,
        displayPriority: parseInt(formData.displayPriority) || 0,
        notes: formData.notes.trim() || null
      };
      
      if (isEditMode) {
        await updateDignity(parseInt(id), dignityData, user?.uid);
        navigate(`/dignities/view/${id}`);
      } else {
        const newId = await createDignity(dignityData, user?.uid);
        navigate(`/dignities/view/${newId}`);
      }
    } catch (err) {
      console.error('Error saving dignity:', err);
      setError('Failed to save dignity');
      setSaving(false);
    }
  }
  
  // Get display name for house
  function getHouseName(houseId) {
    const house = houses.find(h => h.id === houseId);
    return house?.houseName || 'Unknown House';
  }
  
  // Get display name for person
  function getPersonName(personId) {
    const person = people.find(p => p.id === personId);
    if (!person) return 'Unknown Person';
    return `${person.firstName} ${person.lastName}`;
  }
  
  // Loading state
  if (loading) {
    return (
      <>
        <Navigation />
        <div className="dignity-form-page loading">
          <div className="loading-spinner">
            <div className="loading-icon">📜</div>
            <p>Loading...</p>
          </div>
        </div>
      </>
    );
  }
  
  const classInfo = DIGNITY_CLASSES[formData.dignityClass];
  const availableRanks = getAvailableRanks();
  const swornToOptions = getSwornToOptions();
  
  return (
    <>
      <Navigation />
      <div className="dignity-form-page">
        
        {/* Header */}
        <header className="form-header">
          <button 
            className="back-button"
            onClick={() => navigate('/dignities')}
          >
            ← Back to Rolls
          </button>
          <h1 className="form-title">
            {isEditMode ? 'Edit Dignity' : 'Record New Dignity'}
          </h1>
          <p className="form-subtitle">
            Per Article VII — All grants shall be recorded in the rolls of the realm
          </p>
        </header>
        
        {/* Error Display */}
        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
            <button 
              className="error-dismiss"
              onClick={() => setError(null)}
            >
              ×
            </button>
          </div>
        )}
        
        {/* Form */}
        <form className="dignity-form" onSubmit={handleSubmit}>
          
          {/* Section: Classification */}
          <section className="form-section">
            <h2 className="section-heading">
              <span className="section-icon">📋</span>
              Classification
            </h2>
            <p className="section-description">
              Define the type and rank of this dignity per the Charter
            </p>
            
            <div className="form-row">
              {/* Dignity Class */}
              <div className="form-group">
                <label htmlFor="dignityClass">Dignity Class *</label>
                <select
                  id="dignityClass"
                  name="dignityClass"
                  value={formData.dignityClass}
                  onChange={handleChange}
                  required
                >
                  {Object.entries(DIGNITY_CLASSES).map(([key, info]) => (
                    <option key={key} value={key}>
                      {info.icon} {info.name} — {info.description}
                    </option>
                  ))}
                </select>
                <span className="field-hint">
                  {classInfo?.description}
                </span>
              </div>
              
              {/* Dignity Rank */}
              <div className="form-group">
                <label htmlFor="dignityRank">Rank *</label>
                <select
                  id="dignityRank"
                  name="dignityRank"
                  value={formData.dignityRank}
                  onChange={handleChange}
                  required
                >
                  {availableRanks.map(rank => (
                    <option key={rank.id} value={rank.id}>
                      {rank.name} — {rank.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-row">
              {/* Hereditary Toggle */}
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isHereditary"
                    checked={formData.isHereditary}
                    onChange={handleChange}
                  />
                  <span className="checkbox-text">Hereditary Title</span>
                </label>
                <span className="field-hint">
                  Passes by right of blood within the house
                </span>
              </div>
              
              {/* Vacant Toggle */}
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isVacant"
                    checked={formData.isVacant}
                    onChange={handleChange}
                  />
                  <span className="checkbox-text">Currently Vacant</span>
                </label>
                <span className="field-hint">
                  No current holder of this dignity
                </span>
              </div>
            </div>
          </section>
          
          {/* Section: Identity */}
          <section className="form-section">
            <h2 className="section-heading">
              <span className="section-icon">🏷️</span>
              Identity
            </h2>
            <p className="section-description">
              The formal name and styling of this dignity
            </p>
            
            <div className="form-row">
              {/* Tenure Type */}
              <div className="form-group">
                <label htmlFor="tenureType">Tenure Style (Article IV)</label>
                <select
                  id="tenureType"
                  name="tenureType"
                  value={formData.tenureType}
                  onChange={handleChange}
                >
                  {Object.entries(TENURE_TYPES).map(([key, info]) => (
                    <option key={key} value={key}>
                      {info.name} — {info.description}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Place Name */}
              <div className="form-group">
                <label htmlFor="placeName">Place/House Name</label>
                <div className="input-with-action">
                  <input
                    type="text"
                    id="placeName"
                    name="placeName"
                    value={formData.placeName}
                    onChange={handleChange}
                    placeholder="e.g., Breakmount, Wilfrey"
                  />
                  <button
                    type="button"
                    className="generate-btn"
                    onClick={generateName}
                    disabled={!formData.placeName}
                    title="Generate name from place"
                  >
                    ✨ Generate
                  </button>
                </div>
              </div>
            </div>
            
            <div className="form-row">
              {/* Full Name */}
              <div className="form-group full-width">
                <label htmlFor="name">Full Title Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Lord of Breakmount"
                  required
                />
                <span className="field-hint">
                  The complete formal title as it would appear in records
                </span>
              </div>
            </div>
            
            <div className="form-row">
              {/* Short Name */}
              <div className="form-group">
                <label htmlFor="shortName">Short Name</label>
                <input
                  type="text"
                  id="shortName"
                  name="shortName"
                  value={formData.shortName}
                  onChange={handleChange}
                  placeholder="e.g., Breakmount"
                />
                <span className="field-hint">
                  Compact display name for lists and cards
                </span>
              </div>
              
              {/* Seat Name */}
              <div className="form-group">
                <label htmlFor="seatName">Seat/Residence</label>
                <input
                  type="text"
                  id="seatName"
                  name="seatName"
                  value={formData.seatName}
                  onChange={handleChange}
                  placeholder="e.g., Breakmount Castle"
                />
                <span className="field-hint">
                  Primary residence or seat of power
                </span>
              </div>
            </div>
          </section>
          
          {/* Section: Feudal Hierarchy */}
          <section className="form-section">
            <h2 className="section-heading">
              <span className="section-icon">⚔️</span>
              Feudal Hierarchy
            </h2>
            <p className="section-description">
              Article V — Fealty and sworn bonds
            </p>
            
            <div className="form-row">
              {/* Sworn To */}
              <div className="form-group">
                <label htmlFor="swornToId">Sworn To</label>
                <select
                  id="swornToId"
                  name="swornToId"
                  value={formData.swornToId}
                  onChange={handleChange}
                >
                  <option value="">— None (Apex/Crown) —</option>
                  {swornToOptions.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <span className="field-hint">
                  The superior dignity to which this one owes fealty
                </span>
              </div>
              
              {/* Fealty Type */}
              <div className="form-group">
                <label htmlFor="fealtyType">Fealty Type</label>
                <select
                  id="fealtyType"
                  name="fealtyType"
                  value={formData.fealtyType}
                  onChange={handleChange}
                  disabled={!formData.swornToId}
                >
                  {Object.entries(FEALTY_TYPES).map(([key, info]) => (
                    <option key={key} value={key}>
                      {info.name} — {info.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>
          
          {/* Section: Current Holder */}
          <section className="form-section">
            <h2 className="section-heading">
              <span className="section-icon">👤</span>
              Current Holder
            </h2>
            <p className="section-description">
              Who currently holds this dignity
              {formData.currentHouseId && (
                <span className="filter-note"> — Showing members of {getHouseName(parseInt(formData.currentHouseId))}</span>
              )}
            </p>
            
            <div className="form-row">
              {/* Associated House - Now FIRST to enable filtering */}
              <div className="form-group">
                <label htmlFor="currentHouseId">Associated House</label>
                <select
                  id="currentHouseId"
                  name="currentHouseId"
                  value={formData.currentHouseId}
                  onChange={handleChange}
                >
                  <option value="">— All Houses —</option>
                  {getFilteredHouses().map(h => (
                    <option key={h.id} value={h.id}>
                      {h.houseName}
                    </option>
                  ))}
                </select>
                <span className="field-hint">
                  Select a house to filter available holders
                </span>
              </div>
              
              {/* Current Holder - Filtered by house */}
              <div className="form-group">
                <label htmlFor="currentHolderId">
                  Current Holder
                  {formData.currentHouseId && (
                    <span className="filter-badge">
                      {getFilteredPeople().length} available
                    </span>
                  )}
                </label>
                <select
                  id="currentHolderId"
                  name="currentHolderId"
                  value={formData.currentHolderId}
                  onChange={handleChange}
                  disabled={formData.isVacant}
                >
                  <option value="">— Select Person —</option>
                  {getFilteredPeople().map(p => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName}
                      {!formData.currentHouseId && p.houseId && ` (${getHouseName(p.houseId)})`}
                    </option>
                  ))}
                </select>
                {formData.currentHouseId && getFilteredPeople().length === 0 && (
                  <span className="field-warning">
                    No members found in this house
                  </span>
                )}
              </div>
            </div>
            
            {/* Clear filters helper */}
            {(formData.currentHouseId || formData.currentHolderId) && (
              <div className="filter-actions">
                <button
                  type="button"
                  className="clear-filter-btn"
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    currentHouseId: '', 
                    currentHolderId: '' 
                  }))}
                >
                  ✕ Clear holder & house selection
                </button>
              </div>
            )}
          </section>
          
          {/* Section: Display Options */}
          <section className="form-section">
            <h2 className="section-heading">
              <span className="section-icon">🎨</span>
              Display Options
            </h2>
            <p className="section-description">
              How this dignity appears in the family tree
            </p>
            
            <div className="form-row">
              {/* Display Icon */}
              <div className="form-group">
                <label htmlFor="displayIcon">Tree Card Icon</label>
                <select
                  id="displayIcon"
                  name="displayIcon"
                  value={formData.displayIcon}
                  onChange={handleChange}
                >
                  <option value="">— Auto (based on rank) —</option>
                  {Object.entries(DISPLAY_ICONS).map(([key, info]) => (
                    <option key={key} value={key}>
                      {info.icon} {info.name}
                    </option>
                  ))}
                </select>
                <span className="field-hint">
                  Icon shown on person cards in the family tree
                </span>
              </div>
              
              {/* Display Priority */}
              <div className="form-group">
                <label htmlFor="displayPriority">Display Priority</label>
                <input
                  type="number"
                  id="displayPriority"
                  name="displayPriority"
                  value={formData.displayPriority}
                  onChange={handleChange}
                  min="0"
                  max="100"
                />
                <span className="field-hint">
                  Higher = shown first when person holds multiple dignities
                </span>
              </div>
            </div>
          </section>
          
          {/* Section: Notes */}
          <section className="form-section">
            <h2 className="section-heading">
              <span className="section-icon">📝</span>
              Notes
            </h2>
            
            <div className="form-group full-width">
              <label htmlFor="notes">Additional Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                placeholder="Any additional information about this dignity..."
              />
            </div>
          </section>
          
          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate('/dignities')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-button"
              disabled={saving}
            >
              {saving ? 'Saving...' : (isEditMode ? 'Update Dignity' : 'Record Dignity')}
            </button>
          </div>
          
        </form>
        
      </div>
    </>
  );
}

export default DignityForm;
