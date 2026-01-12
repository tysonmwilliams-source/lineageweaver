/**
 * QuickEditPanel.jsx - Comprehensive Person & Relationship Management
 * 
 * ENHANCED VERSION with full relationship management:
 * - View and edit person details
 * - Add spouses, parents, children, siblings directly
 * - LINK EXISTING PEOPLE (not just create new)
 * - Smart defaults based on relationship context
 * - Proper scrolling behavior
 * - Integrated with GenealogyContext for instant updates
 * 
 * Medieval manuscript theme maintained throughout.
 */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGenealogy } from '../contexts/GenealogyContext';
import HouseHeraldrySection from './HouseHeraldrySection';
import PersonalArmsSection from './PersonalArmsSection'; // Phase 4: Personal Arms
import { getEntryByPersonId } from '../services/codexService';
import { getBiographyStatus, getStatusSummary } from '../utils/biographyStatus';
import { validateRelationship, validatePerson } from '../utils/SmartDataValidator';
import { getDignitiesForPerson, getDignityIcon, DIGNITY_CLASSES } from '../services/dignityService';
import EpithetsSection from './EpithetsSection';
import { getPrimaryEpithet, formatNameWithEpithet } from '../utils/epithetUtils';

function QuickEditPanel({ 
  person, 
  onClose, 
  onPersonSelect,  // callback to select a different person
  isDarkTheme = true 
}) {
  // ==================== CONTEXT ====================
  const {
    people,
    houses,
    relationships,
    addPerson,
    updatePerson,
    addRelationship
  } = useGenealogy();

  // ==================== NAVIGATION ====================
  const navigate = useNavigate();

  // ==================== LOCAL STATE ====================
  const [editedPerson, setEditedPerson] = useState(person);
  
  // Add relationship form state
  const [addingRelationType, setAddingRelationType] = useState(null); // 'spouse' | 'parent' | 'child' | 'sibling' | null
  const [addMode, setAddMode] = useState('new'); // 'new' | 'existing'
  const [newPersonForm, setNewPersonForm] = useState(null);
  const [selectedExistingPerson, setSelectedExistingPerson] = useState(null);
  const [existingPersonSearch, setExistingPersonSearch] = useState('');
  const [saving, setSaving] = useState(false);
  
  // Smart validation state
  const [validationWarnings, setValidationWarnings] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [warningsAcknowledged, setWarningsAcknowledged] = useState(false);
  
  // ═══════════════════════════════════════════════════════════════════════
  // 🔗 TREE-CODEX INTEGRATION - Phase 2: Biography Status
  // ═══════════════════════════════════════════════════════════════════════
  const [codexEntry, setCodexEntry] = useState(null);
  const [loadingCodex, setLoadingCodex] = useState(false);
  
  // ═══════════════════════════════════════════════════════════════════════
  // 👑 TREE-DIGNITIES INTEGRATION - Phase 3: Titles Display
  // ═══════════════════════════════════════════════════════════════════════
  const [personDignities, setPersonDignities] = useState([]);
  const [loadingDignities, setLoadingDignities] = useState(false);

  // ==================== EFFECTS ====================
  useEffect(() => {
    setEditedPerson(person);
    setAddingRelationType(null);
    setAddMode('new');
    setNewPersonForm(null);
    setSelectedExistingPerson(null);
    setExistingPersonSearch('');
    
    // Fetch Codex entry for biography status
    if (person?.id) {
      loadCodexEntry(person.id);
      loadPersonDignities(person.id);
    } else {
      setCodexEntry(null);
      setPersonDignities([]);
    }
  }, [person]);
  
  // Fetch the Codex entry for the current person
  const loadCodexEntry = async (personId) => {
    try {
      setLoadingCodex(true);
      const entry = await getEntryByPersonId(personId);
      setCodexEntry(entry);
    } catch (error) {
      console.warn('Could not load Codex entry:', error);
      setCodexEntry(null);
    } finally {
      setLoadingCodex(false);
    }
  };
  
  // Fetch dignities/titles for the current person
  const loadPersonDignities = async (personId) => {
    try {
      setLoadingDignities(true);
      const dignities = await getDignitiesForPerson(personId);
      // Sort by displayPriority (higher first), then by name
      dignities.sort((a, b) => {
        if (b.displayPriority !== a.displayPriority) {
          return (b.displayPriority || 0) - (a.displayPriority || 0);
        }
        return (a.name || '').localeCompare(b.name || '');
      });
      setPersonDignities(dignities);
    } catch (error) {
      console.warn('Could not load dignities:', error);
      setPersonDignities([]);
    } finally {
      setLoadingDignities(false);
    }
  };

  // ==================== THEME ====================
  const theme = isDarkTheme ? {
    bg: '#2d2418',
    bgLight: '#3a2f20',
    bgLighter: '#4a3d2a',
    text: '#e9dcc9',
    textSecondary: '#b8a989',
    border: '#4a3d2a',
    accent: '#d4a574',
    accentHover: '#e0b585',
    success: '#6b8e5e',
    danger: '#a65d5d',
    link: '#6b8ea5'
  } : {
    bg: '#ede7dc',
    bgLight: '#e5dfd0',
    bgLighter: '#d8d0c0',
    text: '#2d2418',
    textSecondary: '#4a3d2a',
    border: '#d4c4a4',
    accent: '#b8874a',
    accentHover: '#a07840',
    success: '#5a7a4a',
    danger: '#8a4a4a',
    link: '#4a6a8a'
  };

  // ==================== COMPUTED RELATIONSHIPS ====================
  const house = useMemo(() => 
    houses.find(h => h.id === person?.houseId), 
    [houses, person?.houseId]
  );

  const personRelationships = useMemo(() => 
    relationships.filter(rel => 
      rel.person1Id === person?.id || rel.person2Id === person?.id
    ),
    [relationships, person?.id]
  );

  const spouses = useMemo(() => 
    personRelationships
      .filter(rel => rel.relationshipType === 'spouse')
      .map(rel => {
        const spouseId = rel.person1Id === person?.id ? rel.person2Id : rel.person1Id;
        return people.find(p => p.id === spouseId);
      })
      .filter(Boolean),
    [personRelationships, person?.id, people]
  );

  const parents = useMemo(() => 
    personRelationships
      .filter(rel => 
        (rel.relationshipType === 'parent' || rel.relationshipType === 'adopted-parent') && 
        rel.person2Id === person?.id
      )
      .map(rel => ({
        person: people.find(p => p.id === rel.person1Id),
        type: rel.relationshipType
      }))
      .filter(item => item.person),
    [personRelationships, person?.id, people]
  );

  const children = useMemo(() => 
    personRelationships
      .filter(rel => 
        (rel.relationshipType === 'parent' || rel.relationshipType === 'adopted-parent') && 
        rel.person1Id === person?.id
      )
      .map(rel => ({
        person: people.find(p => p.id === rel.person2Id),
        type: rel.relationshipType
      }))
      .filter(item => item.person)
      .sort((a, b) => {
        const aYear = parseInt(a.person.dateOfBirth) || 0;
        const bYear = parseInt(b.person.dateOfBirth) || 0;
        return aYear - bYear;
      }),
    [personRelationships, person?.id, people]
  );

  // Calculate siblings (people who share at least one parent)
  const siblings = useMemo(() => {
    if (parents.length === 0) return [];
    
    const parentIds = parents.map(p => p.person.id);
    const siblingIds = new Set();
    
    // Find all children of our parents
    relationships.forEach(rel => {
      if (rel.relationshipType === 'parent' || rel.relationshipType === 'adopted-parent') {
        if (parentIds.includes(rel.person1Id) && rel.person2Id !== person?.id) {
          siblingIds.add(rel.person2Id);
        }
      }
    });
    
    return Array.from(siblingIds)
      .map(id => people.find(p => p.id === id))
      .filter(Boolean)
      .sort((a, b) => {
        const aYear = parseInt(a.dateOfBirth) || 0;
        const bYear = parseInt(b.dateOfBirth) || 0;
        return aYear - bYear;
      });
  }, [parents, relationships, person?.id, people]);

  // ==================== EXISTING PERSON FILTERING ====================
  
  // Get list of people who can be linked based on relationship type
  const availableExistingPeople = useMemo(() => {
    if (!addingRelationType) return [];
    
    // Start with all people except the current person
    let candidates = people.filter(p => p.id !== person?.id);
    
    // Filter out people who already have this relationship with the current person
    const existingRelatedIds = new Set();
    
    personRelationships.forEach(rel => {
      if (addingRelationType === 'spouse' && rel.relationshipType === 'spouse') {
        existingRelatedIds.add(rel.person1Id === person?.id ? rel.person2Id : rel.person1Id);
      }
      if (addingRelationType === 'parent' && 
          (rel.relationshipType === 'parent' || rel.relationshipType === 'adopted-parent') && 
          rel.person2Id === person?.id) {
        existingRelatedIds.add(rel.person1Id);
      }
      if (addingRelationType === 'child' && 
          (rel.relationshipType === 'parent' || rel.relationshipType === 'adopted-parent') && 
          rel.person1Id === person?.id) {
        existingRelatedIds.add(rel.person2Id);
      }
    });
    
    // For siblings, exclude existing siblings
    if (addingRelationType === 'sibling') {
      siblings.forEach(s => existingRelatedIds.add(s.id));
    }
    
    candidates = candidates.filter(p => !existingRelatedIds.has(p.id));
    
    // Apply search filter
    if (existingPersonSearch.trim()) {
      const search = existingPersonSearch.toLowerCase().trim();
      candidates = candidates.filter(p => 
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(search) ||
        p.firstName?.toLowerCase().includes(search) ||
        p.lastName?.toLowerCase().includes(search)
      );
    }
    
    // Sort by name
    candidates.sort((a, b) => {
      const nameA = `${a.lastName} ${a.firstName}`.toLowerCase();
      const nameB = `${b.lastName} ${b.firstName}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
    
    return candidates;
  }, [addingRelationType, people, person?.id, personRelationships, siblings, existingPersonSearch]);

  // ==================== HANDLERS ====================
  
  const handleSave = async () => {
    try {
      setSaving(true);
      await updatePerson(editedPerson.id, editedPerson);
      // Don't close - stay on panel
    } catch (error) {
      alert('Error saving: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleStartAddRelation = (type) => {
    setAddingRelationType(type);
    setAddMode('new');
    setSelectedExistingPerson(null);
    setExistingPersonSearch('');
    
    // Smart defaults based on relationship type
    const defaults = getSmartDefaults(type);
    setNewPersonForm(defaults);
  };

  const handleCancelAdd = () => {
    setAddingRelationType(null);
    setAddMode('new');
    setNewPersonForm(null);
    setSelectedExistingPerson(null);
    setExistingPersonSearch('');
    setValidationWarnings([]);
    setValidationErrors([]);
    setWarningsAcknowledged(false);
  };

  // Run validation whenever form data changes (for new person mode)
  useEffect(() => {
    if (!newPersonForm || !addingRelationType || addMode !== 'new') {
      setValidationWarnings([]);
      setValidationErrors([]);
      return;
    }

    // Create a temporary person object for validation
    const tempPerson = {
      id: -1, // Temporary ID
      firstName: newPersonForm.firstName?.trim() || 'New',
      lastName: newPersonForm.lastName?.trim() || person.lastName,
      dateOfBirth: newPersonForm.dateOfBirth || null,
      dateOfDeath: newPersonForm.dateOfDeath || null,
      gender: newPersonForm.gender,
      houseId: newPersonForm.houseId || person.houseId
    };

    // Build a temporary relationship for validation
    let tempRelationship = null;
    
    if (addingRelationType === 'spouse') {
      tempRelationship = {
        person1Id: person.id,
        person2Id: -1,
        relationshipType: 'spouse',
        marriageStatus: 'married'
      };
    } else if (addingRelationType === 'parent') {
      tempRelationship = {
        person1Id: -1,
        person2Id: person.id,
        relationshipType: 'parent'
      };
    } else if (addingRelationType === 'child') {
      tempRelationship = {
        person1Id: person.id,
        person2Id: -1,
        relationshipType: newPersonForm.legitimacyStatus === 'adopted' ? 'adopted-parent' : 'parent'
      };
    }

    // Validate the relationship if we have one
    if (tempRelationship && newPersonForm.firstName?.trim()) {
      const allPeopleWithTemp = [...people, tempPerson];
      const result = validateRelationship(tempRelationship, allPeopleWithTemp, relationships);
      
      setValidationErrors(result.errors || []);
      setValidationWarnings(result.warnings || []);
      
      // Reset acknowledgment when warnings change
      if (result.warnings?.length !== validationWarnings.length) {
        setWarningsAcknowledged(false);
      }
    } else {
      setValidationErrors([]);
      setValidationWarnings([]);
    }
  }, [newPersonForm, addingRelationType, addMode, person, people, relationships]);

  // Run validation for existing person selection
  useEffect(() => {
    if (!selectedExistingPerson || !addingRelationType || addMode !== 'existing') {
      if (addMode === 'existing') {
        setValidationWarnings([]);
        setValidationErrors([]);
      }
      return;
    }

    // Build relationship for validation
    let tempRelationship = null;
    
    if (addingRelationType === 'spouse') {
      tempRelationship = {
        person1Id: person.id,
        person2Id: selectedExistingPerson.id,
        relationshipType: 'spouse',
        marriageStatus: 'married'
      };
    } else if (addingRelationType === 'parent') {
      tempRelationship = {
        person1Id: selectedExistingPerson.id,
        person2Id: person.id,
        relationshipType: 'parent'
      };
    } else if (addingRelationType === 'child') {
      tempRelationship = {
        person1Id: person.id,
        person2Id: selectedExistingPerson.id,
        relationshipType: 'parent'
      };
    } else if (addingRelationType === 'sibling') {
      // For siblings, we'll validate the parent relationship
      if (parents.length > 0) {
        tempRelationship = {
          person1Id: parents[0].person.id,
          person2Id: selectedExistingPerson.id,
          relationshipType: parents[0].type
        };
      }
    }

    if (tempRelationship) {
      const result = validateRelationship(tempRelationship, people, relationships);
      setValidationErrors(result.errors || []);
      setValidationWarnings(result.warnings || []);
      setWarningsAcknowledged(false);
    }
  }, [selectedExistingPerson, addingRelationType, addMode, person, people, relationships, parents]);

  const getSmartDefaults = (relationType) => {
    const currentYear = parseInt(person.dateOfBirth) || 1250;
    
    const base = {
      firstName: '',
      lastName: '',
      maidenName: '',
      gender: 'male',
      dateOfBirth: '',
      dateOfDeath: '',
      houseId: null,
      legitimacyStatus: 'legitimate',
      notes: ''
    };

    switch (relationType) {
      case 'spouse':
        return {
          ...base,
          gender: person.gender === 'male' ? 'female' : 'male',
          dateOfBirth: String(currentYear),
          houseId: null, // Different house typically
          lastName: '' // Will be filled in
        };
      
      case 'parent':
        return {
          ...base,
          dateOfBirth: String(currentYear - 25),
          houseId: person.houseId,
          lastName: person.lastName
        };
      
      case 'child':
        return {
          ...base,
          dateOfBirth: String(currentYear + 25),
          houseId: person.houseId,
          lastName: person.lastName
        };
      
      case 'sibling':
        return {
          ...base,
          dateOfBirth: String(currentYear),
          houseId: person.houseId,
          lastName: person.lastName
        };
      
      default:
        return base;
    }
  };

  const handleSaveNewPerson = async () => {
    if (!newPersonForm.firstName.trim()) {
      alert('First name is required');
      return;
    }

    // Check for blocking errors
    if (validationErrors.length > 0) {
      alert('Cannot save: ' + validationErrors[0].message);
      return;
    }

    // Check for unacknowledged warnings
    if (validationWarnings.length > 0 && !warningsAcknowledged) {
      alert('Please acknowledge the warnings before saving');
      return;
    }

    try {
      setSaving(true);

      // 1. Create the new person
      const newPersonId = await addPerson({
        firstName: newPersonForm.firstName.trim(),
        lastName: newPersonForm.lastName.trim() || person.lastName,
        maidenName: newPersonForm.maidenName.trim() || null,
        gender: newPersonForm.gender,
        dateOfBirth: newPersonForm.dateOfBirth || null,
        dateOfDeath: newPersonForm.dateOfDeath || null,
        houseId: newPersonForm.houseId || person.houseId,
        legitimacyStatus: newPersonForm.legitimacyStatus,
        notes: newPersonForm.notes || null
      });

      // 2. Create the appropriate relationship(s)
      await createRelationshipForPerson(newPersonId);

      // 3. Reset form
      handleCancelAdd();

    } catch (error) {
      alert('Error adding person: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLinkExistingPerson = async () => {
    if (!selectedExistingPerson) {
      alert('Please select a person');
      return;
    }

    // Check for blocking errors
    if (validationErrors.length > 0) {
      alert('Cannot link: ' + validationErrors[0].message);
      return;
    }

    // Check for unacknowledged warnings
    if (validationWarnings.length > 0 && !warningsAcknowledged) {
      alert('Please acknowledge the warnings before saving');
      return;
    }

    try {
      setSaving(true);

      // Create the appropriate relationship(s)
      await createRelationshipForPerson(selectedExistingPerson.id);

      // Reset form
      handleCancelAdd();

    } catch (error) {
      alert('Error linking person: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const createRelationshipForPerson = async (targetPersonId) => {
    switch (addingRelationType) {
      case 'spouse':
        await addRelationship({
          person1Id: person.id,
          person2Id: targetPersonId,
          relationshipType: 'spouse'
        });
        break;
      
      case 'parent':
        // Target person is parent of current person
        await addRelationship({
          person1Id: targetPersonId,
          person2Id: person.id,
          relationshipType: 'parent'
        });
        break;
      
      case 'child':
        // Current person is parent of target person
        await addRelationship({
          person1Id: person.id,
          person2Id: targetPersonId,
          relationshipType: newPersonForm?.legitimacyStatus === 'adopted' ? 'adopted-parent' : 'parent'
        });
        // If there's a selected co-parent (spouse), add them too
        if (newPersonForm?.coParentId) {
          await addRelationship({
            person1Id: newPersonForm.coParentId,
            person2Id: targetPersonId,
            relationshipType: newPersonForm.legitimacyStatus === 'adopted' ? 'adopted-parent' : 'parent'
          });
        }
        break;
      
      case 'sibling':
        // Link target person to same parents as current person
        for (const parentData of parents) {
          await addRelationship({
            person1Id: parentData.person.id,
            person2Id: targetPersonId,
            relationshipType: parentData.type
          });
        }
        break;
    }
  };

  const handlePersonClick = (clickedPerson) => {
    if (onPersonSelect) {
      onPersonSelect(clickedPerson);
    }
  };

  // ==================== RENDER HELPERS ====================

  const renderPersonChip = (relatedPerson, subtitle = null) => (
    <div 
      key={relatedPerson.id}
      onClick={() => handlePersonClick(relatedPerson)}
      className="p-2 rounded mb-1 cursor-pointer transition-all hover:scale-[1.02]"
      style={{ 
        backgroundColor: theme.bgLight, 
        color: theme.text,
        border: `1px solid ${theme.border}`
      }}
    >
      <div className="flex justify-between items-center">
        <span className="font-medium">{relatedPerson.firstName} {relatedPerson.lastName}</span>
        <span className="text-xs opacity-60">→</span>
      </div>
      {subtitle && (
        <div className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
          {subtitle}
        </div>
      )}
    </div>
  );

  const renderAddButton = (label, relationType, disabled = false, disabledReason = '') => (
    <button
      onClick={() => handleStartAddRelation(relationType)}
      disabled={disabled}
      className="w-full py-2 px-3 rounded border transition-all flex items-center justify-center gap-2"
      style={{
        backgroundColor: disabled ? theme.bgLight : 'transparent',
        color: disabled ? theme.textSecondary : theme.accent,
        borderColor: disabled ? theme.border : theme.accent,
        borderStyle: 'dashed',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1
      }}
      title={disabled ? disabledReason : `Add ${label}`}
    >
      <span>+</span>
      <span>Add {label}</span>
    </button>
  );

  // ==================== ADD PERSON FORM ====================
  const renderAddPersonForm = () => {
    if (!addingRelationType) return null;

    const relationLabels = {
      spouse: 'Spouse',
      parent: 'Parent',
      child: 'Child',
      sibling: 'Sibling'
    };

    return (
      <div 
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        onClick={handleCancelAdd}
      >
        <div 
          className="w-full max-w-md rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto"
          style={{ backgroundColor: theme.bg, border: `2px solid ${theme.accent}` }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Form Header */}
          <div 
            className="p-4 border-b sticky top-0"
            style={{ backgroundColor: theme.bg, borderColor: theme.border }}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold" style={{ color: theme.text }}>
                Add {relationLabels[addingRelationType]}
              </h3>
              <button
                onClick={handleCancelAdd}
                className="text-xl hover:opacity-70"
                style={{ color: theme.text }}
              >
                ✕
              </button>
            </div>
            <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
              {addingRelationType === 'spouse' && `Adding spouse for ${person.firstName}`}
              {addingRelationType === 'parent' && `Adding parent of ${person.firstName}`}
              {addingRelationType === 'child' && `Adding child of ${person.firstName}`}
              {addingRelationType === 'sibling' && `Adding sibling of ${person.firstName}`}
            </p>
            
            {/* Mode Toggle: New vs Existing */}
            <div 
              className="flex mt-3 rounded-lg overflow-hidden border"
              style={{ borderColor: theme.border }}
            >
              <button
                onClick={() => {
                  setAddMode('new');
                  setSelectedExistingPerson(null);
                  if (!newPersonForm) {
                    setNewPersonForm(getSmartDefaults(addingRelationType));
                  }
                }}
                className="flex-1 py-2 px-3 text-sm font-medium transition-all"
                style={{
                  backgroundColor: addMode === 'new' ? theme.accent : theme.bgLight,
                  color: addMode === 'new' ? (isDarkTheme ? '#1a1410' : '#ffffff') : theme.text
                }}
              >
                ✨ Create New
              </button>
              <button
                onClick={() => {
                  setAddMode('existing');
                  setExistingPersonSearch('');
                }}
                className="flex-1 py-2 px-3 text-sm font-medium transition-all"
                style={{
                  backgroundColor: addMode === 'existing' ? theme.accent : theme.bgLight,
                  color: addMode === 'existing' ? (isDarkTheme ? '#1a1410' : '#ffffff') : theme.text
                }}
              >
                🔗 Link Existing
              </button>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-4">
            {addMode === 'new' ? renderNewPersonForm() : renderExistingPersonSelector()}
          </div>

          {/* Form Footer */}
          <div 
            className="p-4 border-t flex gap-3"
            style={{ borderColor: theme.border }}
          >
            <button
              onClick={handleCancelAdd}
              className="flex-1 py-2 rounded border font-semibold transition hover:opacity-80"
              style={{
                backgroundColor: 'transparent',
                color: theme.text,
                borderColor: theme.border
              }}
            >
              Cancel
            </button>
            {addMode === 'new' ? (
              <button
                onClick={handleSaveNewPerson}
                disabled={
                  saving || 
                  !newPersonForm?.firstName?.trim() || 
                  validationErrors.length > 0 ||
                  (validationWarnings.length > 0 && !warningsAcknowledged)
                }
                className="flex-1 py-2 rounded font-semibold transition hover:opacity-90"
                style={{
                  backgroundColor: saving || validationErrors.length > 0 ? theme.bgLight : theme.accent,
                  color: isDarkTheme ? '#1a1410' : '#ffffff',
                  opacity: (
                    !newPersonForm?.firstName?.trim() || 
                    saving || 
                    validationErrors.length > 0 ||
                    (validationWarnings.length > 0 && !warningsAcknowledged)
                  ) ? 0.6 : 1
                }}
              >
                {saving ? '⏳ Saving...' : `✓ Create & Link`}
              </button>
            ) : (
              <button
                onClick={handleLinkExistingPerson}
                disabled={
                  saving || 
                  !selectedExistingPerson || 
                  validationErrors.length > 0 ||
                  (validationWarnings.length > 0 && !warningsAcknowledged)
                }
                className="flex-1 py-2 rounded font-semibold transition hover:opacity-90"
                style={{
                  backgroundColor: saving || !selectedExistingPerson || validationErrors.length > 0 ? theme.bgLight : theme.accent,
                  color: isDarkTheme ? '#1a1410' : '#ffffff',
                  opacity: (
                    !selectedExistingPerson || 
                    saving || 
                    validationErrors.length > 0 ||
                    (validationWarnings.length > 0 && !warningsAcknowledged)
                  ) ? 0.6 : 1
                }}
              >
                {saving ? '⏳ Linking...' : `🔗 Link ${relationLabels[addingRelationType]}`}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ==================== EXISTING PERSON SELECTOR ====================
  const renderExistingPersonSelector = () => {
    return (
      <div className="space-y-4">
        {/* Search Input */}
        <div>
          <label className="block text-sm mb-1" style={{ color: theme.textSecondary }}>
            Search by name
          </label>
          <input
            type="text"
            value={existingPersonSearch}
            onChange={(e) => setExistingPersonSearch(e.target.value)}
            placeholder="Type to search..."
            className="w-full p-2 rounded border"
            style={{
              backgroundColor: theme.bgLight,
              color: theme.text,
              borderColor: theme.border
            }}
            autoFocus
          />
        </div>

        {/* Selected Person Display */}
        {selectedExistingPerson && (
          <div 
            className="p-3 rounded border flex items-center justify-between"
            style={{ 
              backgroundColor: `${theme.success}20`,
              borderColor: theme.success
            }}
          >
            <div>
              <div className="font-semibold" style={{ color: theme.text }}>
                {selectedExistingPerson.firstName} {selectedExistingPerson.lastName}
              </div>
              <div className="text-xs" style={{ color: theme.textSecondary }}>
                {selectedExistingPerson.dateOfBirth && `b. ${selectedExistingPerson.dateOfBirth.split('-')[0]}`}
                {selectedExistingPerson.dateOfDeath && ` - d. ${selectedExistingPerson.dateOfDeath.split('-')[0]}`}
                {(() => {
                  const h = houses.find(ho => ho.id === selectedExistingPerson.houseId);
                  return h ? ` • ${h.houseName}` : '';
                })()}
              </div>
            </div>
            <button
              onClick={() => setSelectedExistingPerson(null)}
              className="text-sm px-2 py-1 rounded hover:opacity-80"
              style={{ backgroundColor: theme.bgLighter, color: theme.text }}
            >
              ✕ Clear
            </button>
          </div>
        )}

        {/* Person List */}
        <div>
          <label className="block text-sm mb-1" style={{ color: theme.textSecondary }}>
            {selectedExistingPerson ? 'Or select another person' : 'Select a person'} 
            <span className="opacity-50"> ({availableExistingPeople.length} available)</span>
          </label>
          <div 
            className="max-h-48 overflow-y-auto rounded border"
            style={{ borderColor: theme.border }}
          >
            {availableExistingPeople.length === 0 ? (
              <div 
                className="p-4 text-center text-sm"
                style={{ color: theme.textSecondary }}
              >
                {existingPersonSearch ? 'No matching people found' : 'No available people to link'}
              </div>
            ) : (
              availableExistingPeople.map(p => (
                <div
                  key={p.id}
                  onClick={() => setSelectedExistingPerson(p)}
                  className="p-2 cursor-pointer transition-all border-b last:border-b-0"
                  style={{
                    backgroundColor: selectedExistingPerson?.id === p.id ? `${theme.accent}30` : theme.bgLight,
                    borderColor: theme.border,
                    color: theme.text
                  }}
                >
                  <div className="font-medium">
                    {p.firstName} {p.lastName}
                  </div>
                  <div className="text-xs" style={{ color: theme.textSecondary }}>
                    {p.dateOfBirth && `b. ${p.dateOfBirth.split('-')[0]}`}
                    {p.dateOfDeath && ` - d. ${p.dateOfDeath.split('-')[0]}`}
                    {(() => {
                      const h = houses.find(ho => ho.id === p.houseId);
                      return h ? ` • ${h.houseName}` : '';
                    })()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Validation Feedback */}
        {renderValidationFeedback()}
      </div>
    );
  };

  // ==================== NEW PERSON FORM ====================
  const renderNewPersonForm = () => {
    if (!newPersonForm) return null;

    return (
      <div className="space-y-4">
        {/* Row: First Name + Last Name */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1" style={{ color: theme.textSecondary }}>
              First Name *
            </label>
            <input
              type="text"
              value={newPersonForm.firstName}
              onChange={(e) => setNewPersonForm({ ...newPersonForm, firstName: e.target.value })}
              className="w-full p-2 rounded border"
              style={{
                backgroundColor: theme.bgLight,
                color: theme.text,
                borderColor: theme.border
              }}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm mb-1" style={{ color: theme.textSecondary }}>
              Last Name
            </label>
            <input
              type="text"
              value={newPersonForm.lastName}
              onChange={(e) => setNewPersonForm({ ...newPersonForm, lastName: e.target.value })}
              placeholder={person.lastName}
              className="w-full p-2 rounded border"
              style={{
                backgroundColor: theme.bgLight,
                color: theme.text,
                borderColor: theme.border
              }}
            />
          </div>
        </div>

        {/* Maiden Name (for spouses) */}
        {addingRelationType === 'spouse' && newPersonForm.gender === 'female' && (
          <div>
            <label className="block text-sm mb-1" style={{ color: theme.textSecondary }}>
              Maiden Name
            </label>
            <input
              type="text"
              value={newPersonForm.maidenName}
              onChange={(e) => setNewPersonForm({ ...newPersonForm, maidenName: e.target.value })}
              placeholder="Birth surname if different"
              className="w-full p-2 rounded border"
              style={{
                backgroundColor: theme.bgLight,
                color: theme.text,
                borderColor: theme.border
              }}
            />
          </div>
        )}

        {/* Row: Gender + Birth Year */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1" style={{ color: theme.textSecondary }}>
              Gender
            </label>
            <select
              value={newPersonForm.gender}
              onChange={(e) => setNewPersonForm({ ...newPersonForm, gender: e.target.value })}
              className="w-full p-2 rounded border"
              style={{
                backgroundColor: theme.bgLight,
                color: theme.text,
                borderColor: theme.border
              }}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1" style={{ color: theme.textSecondary }}>
              Birth Year
            </label>
            <input
              type="text"
              value={newPersonForm.dateOfBirth}
              onChange={(e) => setNewPersonForm({ ...newPersonForm, dateOfBirth: e.target.value })}
              placeholder="e.g. 1250"
              className="w-full p-2 rounded border"
              style={{
                backgroundColor: theme.bgLight,
                color: theme.text,
                borderColor: theme.border
              }}
            />
          </div>
        </div>

        {/* Death Year (optional) */}
        <div>
          <label className="block text-sm mb-1" style={{ color: theme.textSecondary }}>
            Death Year <span className="opacity-50">(optional)</span>
          </label>
          <input
            type="text"
            value={newPersonForm.dateOfDeath}
            onChange={(e) => setNewPersonForm({ ...newPersonForm, dateOfDeath: e.target.value })}
            placeholder="Leave blank if living"
            className="w-full p-2 rounded border"
            style={{
              backgroundColor: theme.bgLight,
              color: theme.text,
              borderColor: theme.border
            }}
          />
        </div>

        {/* House Selection */}
        <div>
          <label className="block text-sm mb-1" style={{ color: theme.textSecondary }}>
            House
          </label>
          <select
            value={newPersonForm.houseId || ''}
            onChange={(e) => setNewPersonForm({ 
              ...newPersonForm, 
              houseId: e.target.value ? Number(e.target.value) : null 
            })}
            className="w-full p-2 rounded border"
            style={{
              backgroundColor: theme.bgLight,
              color: theme.text,
              borderColor: theme.border
            }}
          >
            <option value="">— Select House —</option>
            {houses.map(h => (
              <option key={h.id} value={h.id}>
                {h.houseName} {h.id === person.houseId ? '(same)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Legitimacy Status */}
        <div>
          <label className="block text-sm mb-1" style={{ color: theme.textSecondary }}>
            Status
          </label>
          <select
            value={newPersonForm.legitimacyStatus}
            onChange={(e) => setNewPersonForm({ ...newPersonForm, legitimacyStatus: e.target.value })}
            className="w-full p-2 rounded border"
            style={{
              backgroundColor: theme.bgLight,
              color: theme.text,
              borderColor: theme.border
            }}
          >
            <option value="legitimate">Legitimate</option>
            <option value="bastard">Bastard</option>
            <option value="adopted">Adopted</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        {/* Co-Parent Selection (for children) */}
        {addingRelationType === 'child' && spouses.length > 0 && (
          <div>
            <label className="block text-sm mb-1" style={{ color: theme.textSecondary }}>
              Other Parent
            </label>
            <select
              value={newPersonForm.coParentId || ''}
              onChange={(e) => setNewPersonForm({ 
                ...newPersonForm, 
                coParentId: e.target.value ? Number(e.target.value) : null 
              })}
              className="w-full p-2 rounded border"
              style={{
                backgroundColor: theme.bgLight,
                color: theme.text,
                borderColor: theme.border
              }}
            >
              <option value="">— No other parent / Unknown —</option>
              {spouses.map(spouse => (
                <option key={spouse.id} value={spouse.id}>
                  {spouse.firstName} {spouse.lastName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Validation Feedback */}
        {renderValidationFeedback()}
      </div>
    );
  };

  // ==================== VALIDATION FEEDBACK ====================
  const renderValidationFeedback = () => {
    return (
      <>
        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div 
            className="p-3 rounded border"
            style={{ 
              backgroundColor: `${theme.danger}20`,
              borderColor: theme.danger
            }}
          >
            <div className="flex items-start gap-2">
              <span>🚫</span>
              <div>
                <div className="font-semibold text-sm" style={{ color: theme.danger }}>
                  Cannot Create Relationship
                </div>
                <ul className="text-xs mt-1 space-y-0.5" style={{ color: theme.text }}>
                  {validationErrors.map((err, idx) => (
                    <li key={idx}>• {err.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Validation Warnings */}
        {validationWarnings.length > 0 && validationErrors.length === 0 && (
          <div 
            className="p-3 rounded border"
            style={{ 
              backgroundColor: '#c4a44e20',
              borderColor: '#c4a44e'
            }}
          >
            <div className="flex items-start gap-2">
              <span>⚠️</span>
              <div className="flex-1">
                <div className="font-semibold text-sm" style={{ color: '#c4a44e' }}>
                  Potential Issues
                </div>
                <ul className="text-xs mt-1 space-y-0.5" style={{ color: theme.text }}>
                  {validationWarnings.map((warn, idx) => (
                    <li key={idx}>• {warn.message}</li>
                  ))}
                </ul>
                
                {/* Acknowledgment checkbox */}
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={warningsAcknowledged}
                    onChange={(e) => setWarningsAcknowledged(e.target.checked)}
                    className="rounded"
                    style={{ accentColor: theme.accent }}
                  />
                  <span className="text-xs" style={{ color: theme.textSecondary }}>
                    I understand and want to proceed
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  // ==================== MAIN RENDER ====================
  if (!person) return null;

  return (
    <>
      {/* Main Panel */}
      <div 
        className="fixed right-0 top-0 h-full w-96 shadow-2xl flex flex-col transition-transform"
        style={{ 
          backgroundColor: theme.bg,
          zIndex: 100,
          boxShadow: '-4px 0 6px rgba(0, 0, 0, 0.3)'
        }}
      >
        {/* Fixed Header */}
        <div 
          className="p-4 border-b flex-shrink-0"
          style={{ 
            backgroundColor: theme.bg, 
            borderColor: theme.border
          }}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold truncate" style={{ color: theme.text }}>
                {person.firstName} {person.lastName}
                {/* Show primary epithet in header */}
                {getPrimaryEpithet(person.epithets) && (
                  <span className="font-normal italic ml-1" style={{ color: theme.accent }}>
                    {getPrimaryEpithet(person.epithets).text}
                  </span>
                )}
              </h2>
              {person.maidenName && (
                <p className="text-sm italic" style={{ color: theme.textSecondary }}>
                  née {person.maidenName}
                </p>
              )}
              <div className="flex items-center gap-2 mt-1">
                {house && (
                  <span 
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ 
                      backgroundColor: house.colorCode || theme.bgLight,
                      color: theme.text
                    }}
                  >
                    {house.houseName}
                  </span>
                )}
                <span 
                  className="text-xs px-2 py-0.5 rounded capitalize"
                  style={{ 
                    backgroundColor: theme.bgLight,
                    color: theme.textSecondary
                  }}
                >
                  {person.legitimacyStatus || 'Legitimate'}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-2xl hover:opacity-70 transition ml-2"
              style={{ color: theme.text }}
              title="Close panel"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          
          {/* ===== BASIC INFO SECTION ===== */}
          <section>
            <h3 
              className="font-semibold mb-3 text-xs uppercase tracking-wider flex items-center gap-2" 
              style={{ color: theme.textSecondary }}
            >
              <span>📋</span> Basic Information
            </h3>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs mb-1" style={{ color: theme.textSecondary }}>
                    Born
                  </label>
                  <input
                    type="text"
                    value={editedPerson.dateOfBirth || ''}
                    onChange={(e) => setEditedPerson({ ...editedPerson, dateOfBirth: e.target.value })}
                    className="w-full p-2 rounded border text-sm"
                    style={{
                      backgroundColor: theme.bgLight,
                      color: theme.text,
                      borderColor: theme.border
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: theme.textSecondary }}>
                    Died
                  </label>
                  <input
                    type="text"
                    value={editedPerson.dateOfDeath || ''}
                    onChange={(e) => setEditedPerson({ ...editedPerson, dateOfDeath: e.target.value })}
                    placeholder="Living"
                    className="w-full p-2 rounded border text-sm"
                    style={{
                      backgroundColor: theme.bgLight,
                      color: theme.text,
                      borderColor: theme.border
                    }}
                  />
                </div>
              </div>
              
              {/* House name display (simplified - heraldry in dedicated section) */}
              {house && (
                <div 
                  className="p-2 rounded border"
                  style={{ backgroundColor: theme.bgLight, borderColor: theme.border }}
                >
                  <span className="text-sm" style={{ color: theme.text }}>{house.houseName}</span>
                </div>
              )}
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════════════════
              🛡️ HOUSE HERALDRY SECTION - Phase 5 Batch 2
              ═══════════════════════════════════════════════════════════════════ */}
          {house && (
            <HouseHeraldrySection
              house={house}
              isDarkTheme={isDarkTheme}
            />
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              🛡️ PERSONAL ARMS SECTION - Phase 4
              ═══════════════════════════════════════════════════════════════════ */}
          <PersonalArmsSection
            person={person}
            house={house}
            allPeople={people}
            allRelationships={relationships}
            isDarkTheme={isDarkTheme}
          />

          {/* ═══════════════════════════════════════════════════════════════════
              🔗 TREE-CODEX INTEGRATION - Phase 2: Biography Status Section
              ═══════════════════════════════════════════════════════════════════ */}
          <section>
            <h3 
              className="font-semibold mb-2 text-xs uppercase tracking-wider flex items-center gap-2" 
              style={{ color: theme.textSecondary }}
            >
              <span>📖</span> Biography
            </h3>
            
            {loadingCodex ? (
              <div 
                className="p-3 rounded border text-center text-sm"
                style={{ backgroundColor: theme.bgLight, borderColor: theme.border, color: theme.textSecondary }}
              >
                Loading...
              </div>
            ) : (
              <div className="space-y-2">
                {/* Status Badge */}
                {(() => {
                  const status = getBiographyStatus(codexEntry, isDarkTheme);
                  return (
                    <div 
                      className="p-3 rounded border flex items-center justify-between"
                      style={{ 
                        backgroundColor: status.style.backgroundColor,
                        borderColor: status.style.borderColor
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{status.icon}</span>
                        <div>
                          <div className="text-sm font-medium" style={{ color: status.style.color }}>
                            {status.label}
                          </div>
                          <div className="text-xs opacity-80" style={{ color: status.style.color }}>
                            {getStatusSummary(codexEntry, isDarkTheme)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Attention indicator for empty/stub */}
                      {(status.key === 'empty' || status.key === 'stub') && (
                        <span 
                          className="text-xs px-2 py-0.5 rounded"
                          style={{ 
                            backgroundColor: theme.bgLighter,
                            color: theme.textSecondary
                          }}
                        >
                          Needs attention
                        </span>
                      )}
                    </div>
                  );
                })()}
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  {codexEntry ? (
                    <>
                      <button
                        onClick={() => navigate(`/codex/entry/${codexEntry.id}`)}
                        className="flex-1 py-2 px-3 rounded border text-sm font-medium transition-all hover:opacity-80 flex items-center justify-center gap-1.5"
                        style={{
                          backgroundColor: theme.bgLight,
                          color: theme.accent,
                          borderColor: theme.accent
                        }}
                      >
                        <span>📖</span>
                        <span>View Biography</span>
                      </button>
                      <button
                        onClick={() => navigate(`/codex/edit/${codexEntry.id}`)}
                        className="py-2 px-3 rounded border text-sm font-medium transition-all hover:opacity-80 flex items-center justify-center gap-1.5"
                        style={{
                          backgroundColor: 'transparent',
                          color: theme.textSecondary,
                          borderColor: theme.border
                        }}
                        title="Edit biography"
                      >
                        <span>✏️</span>
                      </button>
                    </>
                  ) : (
                    <div 
                      className="flex-1 py-2 px-3 rounded border text-sm text-center"
                      style={{
                        backgroundColor: theme.bgLight,
                        color: theme.textSecondary,
                        borderColor: theme.border,
                        borderStyle: 'dashed'
                      }}
                    >
                      No Codex entry linked
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* ═══════════════════════════════════════════════════════════════════
              👑 TREE-DIGNITIES INTEGRATION - Phase 3: Titles Section
              ═══════════════════════════════════════════════════════════════════ */}
          <section>
            <h3 
              className="font-semibold mb-2 text-xs uppercase tracking-wider flex items-center gap-2" 
              style={{ color: theme.textSecondary }}
            >
              <span>👑</span> Titles & Dignities
              <span className="opacity-50">({personDignities.length})</span>
            </h3>
            
            {loadingDignities ? (
              <div 
                className="p-3 rounded border text-center text-sm"
                style={{ backgroundColor: theme.bgLight, borderColor: theme.border, color: theme.textSecondary }}
              >
                Loading...
              </div>
            ) : personDignities.length > 0 ? (
              <div className="space-y-1 mb-2">
                {personDignities.map(dignity => (
                  <div
                    key={dignity.id}
                    onClick={() => navigate(`/dignities/view/${dignity.id}`)}
                    className="p-2 rounded cursor-pointer transition-all hover:scale-[1.02]"
                    style={{ 
                      backgroundColor: theme.bgLight, 
                      color: theme.text,
                      border: `1px solid ${theme.border}`
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-base">
                          {getDignityIcon(dignity) || DIGNITY_CLASSES[dignity.dignityClass]?.icon || '📜'}
                        </span>
                        <span className="font-medium text-sm">{dignity.shortName || dignity.name}</span>
                      </div>
                      <span className="text-xs opacity-60">→</span>
                    </div>
                    {dignity.name !== dignity.shortName && dignity.shortName && (
                      <div className="text-xs mt-0.5 ml-6" style={{ color: theme.textSecondary }}>
                        {dignity.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div 
                className="p-3 rounded border text-center text-sm"
                style={{ 
                  backgroundColor: theme.bgLight, 
                  borderColor: theme.border, 
                  color: theme.textSecondary,
                  borderStyle: 'dashed'
                }}
              >
                No titles recorded
              </div>
            )}
            
            {/* Add Title Button */}
            <button
              onClick={() => navigate(`/dignities/create?personId=${person.id}&houseId=${person.houseId || ''}`)}
              className="w-full py-2 px-3 rounded border transition-all flex items-center justify-center gap-2"
              style={{
                backgroundColor: 'transparent',
                color: theme.accent,
                borderColor: theme.accent,
                borderStyle: 'dashed',
                cursor: 'pointer'
              }}
            >
              <span>+</span>
              <span>Add Title</span>
            </button>
          </section>

          {/* ═══════════════════════════════════════════════════════════════════
              ✨ EPITHETS - Descriptive Bynames
              ═══════════════════════════════════════════════════════════════════ */}
          <section>
            <h3 
              className="font-semibold mb-2 text-xs uppercase tracking-wider flex items-center gap-2" 
              style={{ color: theme.textSecondary }}
            >
              <span>✨</span> Epithets
              <span className="opacity-50">({(editedPerson.epithets || []).length})</span>
            </h3>
            
            <EpithetsSection
              epithets={editedPerson.epithets || []}
              onChange={(newEpithets) => setEditedPerson({ ...editedPerson, epithets: newEpithets })}
              isDarkTheme={isDarkTheme}
              compact={true}
            />
          </section>

          {/* ===== SPOUSES SECTION ===== */}
          <section>
            <h3 
              className="font-semibold mb-2 text-xs uppercase tracking-wider flex items-center gap-2" 
              style={{ color: theme.textSecondary }}
            >
              <span>💍</span> Spouse{spouses.length !== 1 ? 's' : ''} 
              <span className="opacity-50">({spouses.length})</span>
            </h3>
            
            <div className="space-y-1 mb-2">
              {spouses.map(spouse => renderPersonChip(spouse))}
            </div>
            
            {renderAddButton('Spouse', 'spouse')}
          </section>

          {/* ===== PARENTS SECTION ===== */}
          <section>
            <h3 
              className="font-semibold mb-2 text-xs uppercase tracking-wider flex items-center gap-2" 
              style={{ color: theme.textSecondary }}
            >
              <span>👑</span> Parents 
              <span className="opacity-50">({parents.length})</span>
            </h3>
            
            <div className="space-y-1 mb-2">
              {parents.map(({ person: parent, type }) => 
                renderPersonChip(parent, type === 'adopted-parent' ? 'Adoptive' : null)
              )}
            </div>
            
            {parents.length < 2 ? (
              renderAddButton('Parent', 'parent')
            ) : (
              <div 
                className="text-xs text-center py-2 opacity-60"
                style={{ color: theme.textSecondary }}
              >
                Maximum 2 parents reached
              </div>
            )}
          </section>

          {/* ===== SIBLINGS SECTION ===== */}
          <section>
            <h3 
              className="font-semibold mb-2 text-xs uppercase tracking-wider flex items-center gap-2" 
              style={{ color: theme.textSecondary }}
            >
              <span>👥</span> Siblings 
              <span className="opacity-50">({siblings.length})</span>
            </h3>
            
            {siblings.length > 0 && (
              <div className="space-y-1 mb-2 max-h-32 overflow-y-auto">
                {siblings.map(sibling => renderPersonChip(sibling))}
              </div>
            )}
            
            {parents.length > 0 ? (
              renderAddButton('Sibling', 'sibling')
            ) : (
              renderAddButton(
                'Sibling', 
                'sibling', 
                true, 
                'Add at least one parent first to add siblings'
              )
            )}
          </section>

          {/* ===== CHILDREN SECTION ===== */}
          <section>
            <h3 
              className="font-semibold mb-2 text-xs uppercase tracking-wider flex items-center gap-2" 
              style={{ color: theme.textSecondary }}
            >
              <span>👶</span> Children 
              <span className="opacity-50">({children.length})</span>
            </h3>
            
            {children.length > 0 && (
              <div className="space-y-1 mb-2 max-h-40 overflow-y-auto">
                {children.map(({ person: child, type }) => 
                  renderPersonChip(child, type === 'adopted-parent' ? 'Adopted' : null)
                )}
              </div>
            )}
            
            {renderAddButton('Child', 'child')}
          </section>

        </div>

        {/* Fixed Footer Actions */}
        <div 
          className="p-4 border-t flex-shrink-0 space-y-2"
          style={{ backgroundColor: theme.bg, borderColor: theme.border }}
        >
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-2 rounded font-semibold transition hover:opacity-90"
            style={{
              backgroundColor: saving ? theme.bgLight : theme.accent,
              color: isDarkTheme ? '#1a1410' : '#ffffff'
            }}
          >
            {saving ? '⏳ Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </div>

      {/* Add Person Form Modal */}
      {renderAddPersonForm()}
    </>
  );
}

export default QuickEditPanel;
