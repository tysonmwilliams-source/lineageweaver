import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  getAllPeople, getAllHouses, getAllRelationships, getRelationshipsForPerson,
  addPerson, addRelationship, updatePerson, deleteRelationship, deletePerson, foundCadetHouse, manualBackup
} from '../services/database';
import FamilyTreeVisualization from '../components/FamilyTreeVisualization';
import QuickEditSidebar from '../components/QuickEditSidebar';
import PersonForm from '../components/PersonForm';
import CadetHouseCeremonyModal from '../components/CadetHouseCeremonyModal';
import Modal from '../components/Modal';

/**
 * Family Tree Page Component
 * 
 * Displays the visual family tree with D3.js
 */
function FamilyTree() {
  const [people, setPeople] = useState([]);
  const [houses, setHouses] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedPersonRelationships, setSelectedPersonRelationships] = useState([]);
  const [selectedHouseFilter, setSelectedHouseFilter] = useState(null); // Will be set to Wilfrey ID after load
  const [includeCadetHouses, setIncludeCadetHouses] = useState(true); // Toggle for cadet houses
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [centerAligned, setCenterAligned] = useState(false);
  const [isCeremonyModalOpen, setIsCeremonyModalOpen] = useState(false);
  const [ceremonyFounder, setCeremonyFounder] = useState(null);

  /**
   * Load data when component mounts
   */
  useEffect(() => {
    loadData();
  }, []);

  /**
   * Load relationships when a person is selected
   */
  useEffect(() => {
    if (selectedPerson) {
      loadPersonRelationships(selectedPerson.id);
    }
  }, [selectedPerson]);

  /**
   * Load all data from database
   */
  const loadData = async () => {
    try {
      setLoading(true);
      const [peopleData, housesData, relationshipsData] = await Promise.all([
        getAllPeople(),
        getAllHouses(),
        getAllRelationships()
      ]);
      setPeople(peopleData);
      setHouses(housesData);
      setRelationships(relationshipsData);
      
      // Set default to House Wilfrey if not already set
      if (!selectedHouseFilter) {
        const wilfreyHouse = housesData.find(h => h.houseName.toLowerCase().includes('wilfrey'));
        if (wilfreyHouse) {
          setSelectedHouseFilter(wilfreyHouse.id);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load family tree data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load relationships for a specific person
   */
  const loadPersonRelationships = async (personId) => {
    try {
      const rels = await getRelationshipsForPerson(personId);
      setSelectedPersonRelationships(rels);
    } catch (error) {
      console.error('Error loading person relationships:', error);
    }
  };

  /**
   * Handle person click in the tree
   */
  const handlePersonClick = (person) => {
    setSelectedPerson(person);
  };

  /**
   * Handle add child from quick-edit
   */
  const handleAddChild = async (childData) => {
    try {
      console.log('📝 handleAddChild called with:', childData);
      
      // Create the child person
      const newChildId = await addPerson({
        firstName: childData.firstName,
        lastName: childData.lastName,
        dateOfBirth: childData.dateOfBirth || null,
        dateOfDeath: null,
        gender: childData.gender,
        houseId: childData.houseId,
        legitimacyStatus: childData.legitimacyStatus,
        maidenName: null,
        species: null,
        magicalBloodline: null,
        titles: [],
        notes: null,
        portraitUrl: null
      });

      console.log('🎼 Created child with ID:', newChildId);
      
      // Add parent relationship from selected person to child
      console.log('🔗 Adding parent relationship - parent:', childData.parent1Id, 'child:', newChildId);
      await addRelationship({
        person1Id: childData.parent1Id,
        person2Id: newChildId,
        relationshipType: childData.legitimacyStatus === 'adopted' ? 'adopted-parent' : 'parent',
        biologicalParent: childData.legitimacyStatus !== 'adopted',
        marriageDate: null,
        divorceDate: null,
        marriageStatus: null
      });

      console.log('✅ Parent relationship created');
      
      // If both parents, add relationship from spouse to child
      if (childData.parent2Id) {
        console.log('🔗 Adding second parent relationship - parent:', childData.parent2Id, 'child:', newChildId);
        await addRelationship({
          person1Id: childData.parent2Id,
          person2Id: newChildId,
          relationshipType: childData.legitimacyStatus === 'adopted' ? 'adopted-parent' : 'parent',
          biologicalParent: childData.legitimacyStatus !== 'adopted',
          marriageDate: null,
          divorceDate: null,
          marriageStatus: null
        });
      }

      console.log('🔄 Reloading data...');
      // Reload data
      await loadData();
      await loadPersonRelationships(selectedPerson.id);
      console.log('✨ Child addition complete!');
    } catch (error) {
      console.error('Error adding child:', error);
      alert('Failed to add child. Please try again.');
    }
  };

  /**
   * Handle add spouse from quick-edit
   */
  const handleAddSpouse = async (spouseData) => {
    try {
      // Create the spouse person
      const newSpouse = await addPerson({
        firstName: spouseData.firstName,
        lastName: spouseData.lastName || selectedPerson.lastName,
        dateOfBirth: spouseData.dateOfBirth || null,
        dateOfDeath: null,
        gender: spouseData.gender,
        houseId: spouseData.houseId,
        legitimacyStatus: 'legitimate',
        maidenName: spouseData.maidenName || null,
        species: null,
        magicalBloodline: null,
        titles: [],
        notes: null,
        portraitUrl: null
      });

      // Add marriage relationship
      await addRelationship({
        person1Id: spouseData.spouseOfId,
        person2Id: newSpouse.id,
        relationshipType: 'spouse',
        biologicalParent: null,
        marriageDate: spouseData.marriageDate || null,
        divorceDate: null,
        marriageStatus: 'married'
      });

      // Reload data
      await loadData();
      await loadPersonRelationships(selectedPerson.id);
    } catch (error) {
      console.error('Error adding spouse:', error);
      alert('Failed to add spouse. Please try again.');
    }
  };

  /**
   * Handle add relationship from quick-edit
   */
  const handleAddRelationship = async (relationshipData) => {
    try {
      const relData = {
        person1Id: relationshipData.person1Id,
        person2Id: relationshipData.person2Id,
        relationshipType: relationshipData.relationshipType,
        biologicalParent: null,
        marriageDate: null,
        divorceDate: null,
        marriageStatus: null
      };

      // Add specific fields based on relationship type
      if (relationshipData.relationshipType === 'spouse') {
        relData.marriageStatus = 'married';
      } else if (relationshipData.relationshipType === 'parent' || 
                 relationshipData.relationshipType === 'adopted-parent' || 
                 relationshipData.relationshipType === 'foster-parent') {
        relData.biologicalParent = relationshipData.relationshipType === 'parent';
      }

      await addRelationship(relData);

      // Reload data
      await loadData();
      await loadPersonRelationships(selectedPerson.id);
    } catch (error) {
      console.error('Error adding relationship:', error);
      alert('Failed to add relationship. Please try again.');
    }
  };

  /**
   * Handle delete relationship from quick-edit
   */
  const handleDeleteRelationship = async (relationshipId) => {
    if (!confirm('Are you sure you want to delete this relationship?')) {
      return;
    }

    try {
      await deleteRelationship(relationshipId);

      // Reload data
      await loadData();
      await loadPersonRelationships(selectedPerson.id);
    } catch (error) {
      console.error('Error deleting relationship:', error);
      alert('Failed to delete relationship. Please try again.');
    }
  };

  /**
   * Handle delete person
   */
  const handleDeletePerson = async (personId) => {
    try {
      // First delete all relationships involving this person
      const personRels = await getRelationshipsForPerson(personId);
      for (const rel of personRels) {
        await deleteRelationship(rel.id);
      }

      // Then delete the person
      await deletePerson(personId);

      // Clear selection if deleted person was selected
      if (selectedPerson && selectedPerson.id === personId) {
        setSelectedPerson(null);
        setSelectedPersonRelationships([]);
      }

      // Reload data
      await loadData();
    } catch (error) {
      console.error('Error deleting person:', error);
      alert('Failed to delete person. Please try again.');
    }
  };

  /**
   * Handle edit person
   */
  const handleEditPerson = () => {
    setEditingPerson(selectedPerson);
    setIsEditModalOpen(true);
  };

  /**
   * Handle save person from edit modal
   */
  const handleSavePerson = async (personData) => {
    try {
      await updatePerson(editingPerson.id, personData);
      await loadData();
      setIsEditModalOpen(false);
      setEditingPerson(null);
      // Update selected person
      const updatedPerson = await getAllPeople();
      setSelectedPerson(updatedPerson.find(p => p.id === editingPerson.id));
    } catch (error) {
      console.error('Error updating person:', error);
      alert('Failed to update person. Please try again.');
    }
  };

  /**
   * Handle found cadet house ceremony
   */
  const handleFoundCadetHouse = async (person) => {
    // Find parent house - bastard might not have houseId set yet
    // Look for their biological parent to determine parent house
    let parentHouseId = person.houseId;
    
    if (!parentHouseId) {
      // Find parent relationship
      const personRels = await getRelationshipsForPerson(person.id);
      const parentRel = personRels.find(rel => 
        rel.relationshipType === 'parent' && rel.person2Id === person.id
      );
      
      if (parentRel) {
        const parent = people.find(p => p.id === parentRel.person1Id);
        if (parent) {
          parentHouseId = parent.houseId;
        }
      }
    }
    
    if (!parentHouseId) {
      alert('Cannot determine parent house. Please ensure the bastard has a parent relationship to a noble house.');
      return;
    }
    
    setCeremonyFounder({ ...person, parentHouseId });
    setIsCeremonyModalOpen(true);
  };

  /**
   * Handle ceremony completion
   */
  const handleCeremonyComplete = async (ceremonyData) => {
    try {
      await foundCadetHouse(ceremonyData);
      await loadData();
      setIsCeremonyModalOpen(false);
      setCeremonyFounder(null);
      // Update selected person to show new house
      const updatedPeople = await getAllPeople();
      setSelectedPerson(updatedPeople.find(p => p.id === ceremonyData.founderId));
      alert(`House ${ceremonyData.houseName} has been founded! ${ceremonyFounder.firstName} has sworn fealty to their parent house.`);
    } catch (error) {
      console.error('Error founding cadet house:', error);
      alert('Failed to found cadet house. Please try again.');
    }
  };

  /**
   * Handle manual backup
   */
  const handleManualBackup = async () => {
    try {
      const success = await manualBackup();
      if (success) {
        alert('✅ Backup saved successfully!\n\nFile saved to Downloads folder:\nlineageweaver-backup-' + new Date().toISOString().split('T')[0] + '.json');
      } else {
        alert('❌ Failed to save backup. Please try again.');
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      alert('❌ Failed to save backup. Please try again.');
    }
  };

  /**
   * Smart filter: Include house members + spouses + bastard parents
   * Exclude: spouse's extended families (in-laws)
   */
  const getSmartFilteredPeople = () => {
    if (!selectedHouseFilter) return people;
    
    const includedPeople = new Set();
    const houseId = parseInt(selectedHouseFilter);
    
    // Get all relevant house IDs (selected house + cadet houses if toggle is on)
    const relevantHouseIds = new Set([houseId]);
    
    if (includeCadetHouses) {
      // Add all cadet houses of the selected house
      houses.forEach(house => {
        if (house.parentHouseId === houseId) {
          relevantHouseIds.add(house.id);
        }
      });
    }
    
    // Step 1: Add all members of the selected house (and cadet houses if enabled)
    people.forEach(person => {
      if (relevantHouseIds.has(person.houseId)) {
        includedPeople.add(person.id);
      }
    });
    
    // Step 2: Add spouses of house members
    relationships.forEach(rel => {
      if (rel.relationshipType === 'spouse') {
        if (includedPeople.has(rel.person1Id)) {
          includedPeople.add(rel.person2Id);
        } else if (includedPeople.has(rel.person2Id)) {
          includedPeople.add(rel.person1Id);
        }
      }
    });
    
    // Step 3: Add parents of bastards in this house
    relationships.forEach(rel => {
      if (rel.relationshipType === 'parent' || 
          rel.relationshipType === 'adopted-parent' || 
          rel.relationshipType === 'foster-parent') {
        const child = people.find(p => p.id === rel.person2Id);
        // If child is a bastard in this house, include their parent
        if (child && relevantHouseIds.has(child.houseId) && child.legitimacyStatus === 'bastard') {
          includedPeople.add(rel.person1Id);
        }
      }
    });
    
    // Return only the included people
    return people.filter(p => includedPeople.has(p.id));
  };
  
  const filteredPeople = getSmartFilteredPeople();

  /**
   * Filter relationships to only include filtered people
   */
  const filteredRelationships = relationships.filter(rel => {
    const person1InFilter = filteredPeople.some(p => p.id === rel.person1Id);
    const person2InFilter = filteredPeople.some(p => p.id === rel.person2Id);
    return person1InFilter && person2InFilter;
  });

  /**
   * Get house for selected person
   */
  const selectedPersonHouse = selectedPerson 
    ? houses.find(h => h.id === selectedPerson.houseId)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Lineageweaver
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link to="/tree" className="text-blue-600 font-semibold">
                Family Tree
              </Link>
              <Link to="/manage" className="text-gray-600 hover:text-gray-900">
                Manage
              </Link>
              <button
                onClick={handleManualBackup}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm"
              >
                💾 Save Backup
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header with filters */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Family Tree Visualization
              </h1>
              <p className="text-gray-600 mt-1">
                Click on any person to see their details
              </p>
            </div>
            
            {/* Controls */}
            <div className="flex items-center space-x-6">
              {/* Alignment Toggle */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">
                  Alignment:
                </label>
                <button
                  onClick={() => setCenterAligned(!centerAligned)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    centerAligned 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {centerAligned ? 'Centered' : 'Left-aligned'}
                </button>
              </div>
              
              {/* House Filter */}
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700">
                  Viewing House:
                </label>
                <select
                  value={selectedHouseFilter || ''}
                  onChange={(e) => setSelectedHouseFilter(e.target.value ? parseInt(e.target.value) : null)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {houses.map(house => (
                    <option key={house.id} value={house.id}>
                      {house.houseName}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Cadet Houses Toggle */}
              <div className="flex items-center space-x-2">
                <label className="flex items-center space-x-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeCadetHouses}
                    onChange={(e) => setIncludeCadetHouses(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">Include Cadet Houses</span>
                </label>
              </div>
            </div>
          </div>

          {/* Legend - More comprehensive */}
          <div className="bg-white rounded shadow-sm p-3">
            <div className="flex flex-wrap gap-4 text-xs items-center">
              <span className="font-semibold text-gray-700">Legend:</span>
              
              {/* Card Borders (Legitimacy Status) */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 font-medium">Card Borders:</span>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 border-2 rounded" style={{ borderColor: '#16a34a' }}></div>
                  <span className="text-gray-600">Legitimate</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 border-2 rounded" style={{ borderColor: '#f59e0b' }}></div>
                  <span className="text-gray-600">Bastard</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 border-2 rounded" style={{ borderColor: '#3b82f6' }}></div>
                  <span className="text-gray-600">Adopted</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 border-2 rounded" style={{ borderColor: '#16a34a', borderStyle: 'dashed' }}></div>
                  <span className="text-gray-600">Cadet House</span>
                </div>
              </div>
              
              {/* Divider */}
              <div className="h-4 w-px bg-gray-300"></div>
              
              {/* Relationship Lines */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 font-medium">Lines:</span>
                <div className="flex items-center space-x-1">
                  <div className="w-8 h-0.5" style={{ backgroundColor: '#16a34a' }}></div>
                  <span className="text-gray-600">Legitimate</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-8 h-0.5" style={{ backgroundColor: '#f59e0b' }}></div>
                  <span className="text-gray-600">Bastard</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-8 h-0.5" style={{ backgroundColor: '#3b82f6' }}></div>
                  <span className="text-gray-600">Adopted</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-8 h-0.5 bg-pink-500"></div>
                  <span className="text-gray-600">Marriage</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-2">⏳</div>
            <p className="text-gray-600">Loading family tree...</p>
          </div>
        ) : people.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-2">🌳</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              No People Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Add people to your world to see the family tree visualization.
            </p>
            <Link 
              to="/manage"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Go to Manage Data
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {/* Tree Visualization - Takes up 3 columns */}
            <div className="col-span-3">
              <FamilyTreeVisualization
                people={filteredPeople}
                houses={houses}
                relationships={filteredRelationships}
                onPersonClick={handlePersonClick}
                centerAligned={centerAligned}
              />
              <div className="mt-4 text-sm text-gray-500 text-center">
                💡 Tip: Use mouse wheel to zoom, click and drag to pan
              </div>
            </div>

            {/* Person Details/Quick Edit - Takes up 1 column */}
            <div>
              <QuickEditSidebar
                person={selectedPerson}
                house={selectedPersonHouse}
                relationships={selectedPersonRelationships}
                allPeople={people}
                houses={houses}
                onAddChild={handleAddChild}
                onAddSpouse={handleAddSpouse}
                onAddRelationship={handleAddRelationship}
                onDeleteRelationship={handleDeleteRelationship}
                onEditPerson={handleEditPerson}
                onDeletePerson={handleDeletePerson}
                onFoundCadetHouse={handleFoundCadetHouse}
              />
            </div>
          </div>
        )}
      </div>

      {/* Edit Person Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Person"
      >
        <PersonForm
          person={editingPerson}
          houses={houses}
          onSave={handleSavePerson}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>

      {/* Cadet House Ceremony Modal */}
      <Modal
        isOpen={isCeremonyModalOpen}
        onClose={() => setIsCeremonyModalOpen(false)}
        title="Naming Ceremony"
      >
        {ceremonyFounder && (
          <CadetHouseCeremonyModal
            founder={ceremonyFounder}
            parentHouse={houses.find(h => h.id === ceremonyFounder.parentHouseId)}
            onFound={handleCeremonyComplete}
            onCancel={() => setIsCeremonyModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
}

export default FamilyTree;
