/**
 * ManageData.jsx - Data Management Page with Theme Support
 * 
 * Updated to use the medieval manuscript theme system with CSS custom properties.
 * Replaces all hardcoded Tailwind colors with theme variables.
 * 
 * UPDATED: Now uses GenealogyContext for shared state management.
 * Changes made here are immediately reflected in FamilyTree and vice versa.
 */

import { useState } from 'react';
import { useGenealogy } from '../contexts/GenealogyContext';
import Navigation from '../components/Navigation';
import Modal from '../components/Modal';
import PersonForm from '../components/PersonForm';
import PersonList from '../components/PersonList';
import HouseForm from '../components/HouseForm';
import HouseList from '../components/HouseList';
import RelationshipForm from '../components/RelationshipForm';
import RelationshipList from '../components/RelationshipList';
import CadetHouseCeremonyModal from '../components/CadetHouseCeremonyModal';
import ImportExportManager from '../components/ImportExportManager';
import DataHealthDashboard from '../components/DataHealthDashboard';
import './ManageData.css'; // Companion CSS file

function ManageData() {
  // ==================== SHARED STATE FROM CONTEXT ====================
  // This is the key change: instead of local state + loadData(), we use
  // the shared context. Any changes here update FamilyTree automatically!
  const {
    people,
    houses,
    relationships,
    loading,
    addPerson,
    updatePerson,
    deletePerson,
    addHouse,
    updateHouse,
    deleteHouse,
    addRelationship,
    updateRelationship,
    deleteRelationship,
    foundCadetHouse,
    deleteAllData
  } = useGenealogy();

  // ==================== LOCAL UI STATE ====================
  // These remain local because they're UI-specific, not shared data
  const [activeTab, setActiveTab] = useState('people');

  // Modal states
  const [showPersonModal, setShowPersonModal] = useState(false);
  const [showHouseModal, setShowHouseModal] = useState(false);
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);
  const [showCadetModal, setShowCadetModal] = useState(false);

  // Editing states
  const [editingPerson, setEditingPerson] = useState(null);
  const [editingHouse, setEditingHouse] = useState(null);
  const [editingRelationship, setEditingRelationship] = useState(null);
  const [cadetFounder, setCadetFounder] = useState(null);
  const [cadetParentHouse, setCadetParentHouse] = useState(null);

  // ==================== PERSON HANDLERS ====================
  
  const handleAddPerson = () => {
    setEditingPerson(null);
    setShowPersonModal(true);
  };

  const handleEditPerson = (person) => {
    setEditingPerson(person);
    setShowPersonModal(true);
  };

  const handleSavePerson = async (personData) => {
    try {
      if (editingPerson) {
        await updatePerson(editingPerson.id, personData);
        alert('Person updated successfully!');
      } else {
        await addPerson(personData);
        alert('Person added successfully!');
      }
      setShowPersonModal(false);
      setEditingPerson(null);
      // No loadData() needed - context updates automatically!
    } catch (error) {
      alert('Error saving person: ' + error.message);
    }
  };

  const handleDeletePerson = async (person) => {
    if (!confirm(`Delete ${person.firstName} ${person.lastName}? This will also delete their relationships.`)) {
      return;
    }
    try {
      await deletePerson(person.id);
      alert('Person deleted');
      // No loadData() needed - context updates automatically!
    } catch (error) {
      alert('Error deleting person: ' + error.message);
    }
  };

  // ==================== HOUSE HANDLERS ====================

  const handleAddHouse = () => {
    setEditingHouse(null);
    setShowHouseModal(true);
  };

  const handleEditHouse = (house) => {
    setEditingHouse(house);
    setShowHouseModal(true);
  };

  const handleSaveHouse = async (houseData) => {
    try {
      if (editingHouse) {
        await updateHouse(editingHouse.id, houseData);
        alert('House updated successfully!');
      } else {
        await addHouse(houseData);
        alert('House added successfully!');
      }
      setShowHouseModal(false);
      setEditingHouse(null);
      // No loadData() needed - context updates automatically!
    } catch (error) {
      alert('Error saving house: ' + error.message);
    }
  };

  const handleDeleteHouse = async (house) => {
    if (!confirm(`Delete ${house.houseName}?`)) return;
    try {
      await deleteHouse(house.id);
      alert('House deleted');
      // No loadData() needed - context updates automatically!
    } catch (error) {
      alert('Error deleting house: ' + error.message);
    }
  };

  // ==================== RELATIONSHIP HANDLERS ====================

  const handleAddRelationship = () => {
    setEditingRelationship(null);
    setShowRelationshipModal(true);
  };

  const handleEditRelationship = (relationship) => {
    setEditingRelationship(relationship);
    setShowRelationshipModal(true);
  };

  const handleSaveRelationship = async (relationshipData) => {
    try {
      if (editingRelationship) {
        await updateRelationship(editingRelationship.id, relationshipData);
        alert('Relationship updated successfully!');
      } else {
        await addRelationship(relationshipData);
        alert('Relationship added successfully!');
      }
      setShowRelationshipModal(false);
      setEditingRelationship(null);
      // No loadData() needed - context updates automatically!
    } catch (error) {
      alert('Error saving relationship: ' + error.message);
    }
  };

  const handleDeleteRelationship = async (relationship) => {
    if (!confirm('Delete this relationship?')) return;
    try {
      await deleteRelationship(relationship.id);
      alert('Relationship deleted');
      // No loadData() needed - context updates automatically!
    } catch (error) {
      alert('Error deleting relationship: ' + error.message);
    }
  };

  // ==================== CADET HOUSE HANDLERS ====================

  const handleFoundCadetHouse = async (ceremonyData) => {
    try {
      const result = await foundCadetHouse(ceremonyData);
      alert(`Cadet house ${result.house.houseName} founded successfully!`);
      setShowCadetModal(false);
      setCadetFounder(null);
      setCadetParentHouse(null);
      // No loadData() needed - context updates automatically!
    } catch (error) {
      alert('Error founding cadet house: ' + error.message);
    }
  };

  // ==================== RESET ALL DATA HANDLER ====================

  const handleResetAllData = async () => {
    const confirmMessage1 = `⚠️ RESET ALL DATA ⚠️\n\nThis will DELETE:\n• All ${people.length} people\n• All ${houses.length} houses\n• All ${relationships.length} relationships\n\nThis action CANNOT be undone!\n\nAre you absolutely sure?`;
    
    if (!confirm(confirmMessage1)) {
      return;
    }

    const confirmText = prompt(
      '⚠️ FINAL CONFIRMATION ⚠️\n\n' +
      'To confirm, please type: DELETE ALL\n\n' +
      '(Type exactly as shown, in uppercase)'
    );

    if (confirmText !== 'DELETE ALL') {
      alert('Reset cancelled. Data is safe.');
      return;
    }

    try {
      await deleteAllData();
      alert('✅ All data has been deleted.\n\nYou can now start fresh!');
      // No loadData() needed - context updates automatically!
    } catch (error) {
      alert('❌ Error resetting data: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="manage-loading">
        <div className="loading-content">
          <div className="loading-icon">⏳</div>
          <h2 className="loading-title">Loading...</h2>
          <p className="loading-text">Fetching your genealogy data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-page">
      {/* Navigation Bar */}
      <Navigation />

      <div className="manage-container">
        <div className="manage-content">
          {/* Header with Reset Button */}
          <div className="manage-header">
            <h1 className="manage-title">Data Management</h1>
            
            <button
              onClick={handleResetAllData}
              className="reset-button"
              title="Delete all people, houses, and relationships"
            >
              🗑️ Reset All Data
            </button>
          </div>

          {/* Tabs */}
          <div className="manage-tabs-card">
            <div className="tabs-header">
              <nav className="tabs-nav">
                <button
                  onClick={() => setActiveTab('people')}
                  className={`tab-button ${activeTab === 'people' ? 'tab-button-active' : ''}`}
                >
                  👤 People ({people.length})
                </button>
                <button
                  onClick={() => setActiveTab('houses')}
                  className={`tab-button ${activeTab === 'houses' ? 'tab-button-active' : ''}`}
                >
                  🏰 Houses ({houses.length})
                </button>
                <button
                  onClick={() => setActiveTab('relationships')}
                  className={`tab-button ${activeTab === 'relationships' ? 'tab-button-active' : ''}`}
                >
                  🔗 Relationships ({relationships.length})
                </button>
                <button
                  onClick={() => setActiveTab('import-export')}
                  className={`tab-button ${activeTab === 'import-export' ? 'tab-button-active' : ''}`}
                >
                  💾 Import/Export
                </button>
                <button
                  onClick={() => setActiveTab('health')}
                  className={`tab-button ${activeTab === 'health' ? 'tab-button-active' : ''}`}
                >
                  🏥 Data Health
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="tabs-content">
              {/* PEOPLE TAB */}
              {activeTab === 'people' && (
                <div className="tab-panel">
                  <div className="tab-panel-header">
                    <h2 className="tab-panel-title">People</h2>
                    <button
                      onClick={handleAddPerson}
                      className="add-button"
                    >
                      + Add Person
                    </button>
                  </div>
                  <PersonList
                    people={people}
                    houses={houses}
                    onEdit={handleEditPerson}
                    onDelete={handleDeletePerson}
                  />
                </div>
              )}

              {/* HOUSES TAB */}
              {activeTab === 'houses' && (
                <div className="tab-panel">
                  <div className="tab-panel-header">
                    <h2 className="tab-panel-title">Houses</h2>
                    <button
                      onClick={handleAddHouse}
                      className="add-button"
                    >
                      + Add House
                    </button>
                  </div>
                  <HouseList
                    houses={houses}
                    onEdit={handleEditHouse}
                    onDelete={handleDeleteHouse}
                  />
                </div>
              )}

              {/* RELATIONSHIPS TAB */}
              {activeTab === 'relationships' && (
                <div className="tab-panel">
                  <div className="tab-panel-header">
                    <h2 className="tab-panel-title">Relationships</h2>
                    <button
                      onClick={handleAddRelationship}
                      className="add-button"
                    >
                      + Add Relationship
                    </button>
                  </div>
                  <RelationshipList
                    relationships={relationships}
                    people={people}
                    onEdit={handleEditRelationship}
                    onDelete={handleDeleteRelationship}
                  />
                </div>
              )}

              {/* IMPORT/EXPORT TAB */}
              {activeTab === 'import-export' && (
                <div className="tab-panel">
                  <ImportExportManager />
                </div>
              )}

              {/* DATA HEALTH TAB */}
              {activeTab === 'health' && (
                <div className="tab-panel">
                  <DataHealthDashboard
                    isDarkTheme={true}
                    onNavigateToPerson={(personId) => {
                      const person = people.find(p => p.id === personId);
                      if (person) {
                        handleEditPerson(person);
                      }
                    }}
                    onNavigateToRelationship={(relId) => {
                      const rel = relationships.find(r => r.id === relId);
                      if (rel) {
                        handleEditRelationship(rel);
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Danger Zone Info Box */}
          <div className="danger-zone">
            <div className="danger-zone-content">
              <div className="danger-zone-icon">⚠️</div>
              <div className="danger-zone-text">
                <h3 className="danger-zone-title">Danger Zone</h3>
                <p className="danger-zone-description">
                  The "Reset All Data" button will permanently delete all people, houses, and relationships. 
                  This action cannot be undone. Use with extreme caution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}

      {/* Person Modal */}
      <Modal
        isOpen={showPersonModal}
        onClose={() => {
          setShowPersonModal(false);
          setEditingPerson(null);
        }}
        title={editingPerson ? 'Edit Person' : 'Add Person'}
      >
        <PersonForm
          person={editingPerson}
          houses={houses}
          onSave={handleSavePerson}
          onCancel={() => {
            setShowPersonModal(false);
            setEditingPerson(null);
          }}
        />
      </Modal>

      {/* House Modal */}
      <Modal
        isOpen={showHouseModal}
        onClose={() => {
          setShowHouseModal(false);
          setEditingHouse(null);
        }}
        title={editingHouse ? 'Edit House' : 'Add House'}
      >
        <HouseForm
          house={editingHouse}
          onSave={handleSaveHouse}
          onCancel={() => {
            setShowHouseModal(false);
            setEditingHouse(null);
          }}
        />
      </Modal>

      {/* Relationship Modal */}
      <Modal
        isOpen={showRelationshipModal}
        onClose={() => {
          setShowRelationshipModal(false);
          setEditingRelationship(null);
        }}
        title={editingRelationship ? 'Edit Relationship' : 'Add Relationship'}
      >
        <RelationshipForm
          relationship={editingRelationship}
          people={people}
          allRelationships={relationships}
          onSave={handleSaveRelationship}
          onCancel={() => {
            setShowRelationshipModal(false);
            setEditingRelationship(null);
          }}
          onSuggestionAccept={async (suggestion) => {
            // Handle cascade suggestions from smart validation
            if (suggestion.action.type === 'addRelationship') {
              try {
                await addRelationship(suggestion.action.data);
                // No alert needed - it's a background helper action
              } catch (error) {
                console.error('Error applying suggestion:', error);
              }
            }
          }}
        />
      </Modal>

      {/* Cadet House Ceremony Modal */}
      {showCadetModal && cadetFounder && cadetParentHouse && (
        <Modal
          isOpen={showCadetModal}
          onClose={() => {
            setShowCadetModal(false);
            setCadetFounder(null);
            setCadetParentHouse(null);
          }}
          title="Found Cadet House"
        >
          <CadetHouseCeremonyModal
            founder={cadetFounder}
            parentHouse={cadetParentHouse}
            onFound={handleFoundCadetHouse}
            onCancel={() => {
              setShowCadetModal(false);
              setCadetFounder(null);
              setCadetParentHouse(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
}

export default ManageData;