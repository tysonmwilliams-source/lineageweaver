import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  getAllHouses, addHouse, updateHouse, deleteHouse,
  getAllPeople, addPerson, updatePerson, deletePerson,
  getAllRelationships, addRelationship, updateRelationship, deleteRelationship
} from '../services/database';
import HouseForm from '../components/HouseForm';
import HouseList from '../components/HouseList';
import PersonForm from '../components/PersonForm';
import PersonList from '../components/PersonList';
import RelationshipForm from '../components/RelationshipForm';
import RelationshipList from '../components/RelationshipList';
import Modal from '../components/Modal';

/**
 * Manage Data Page Component
 * 
 * This page allows users to manage houses, people, and relationships.
 * Includes add, edit, and delete functionality for all three.
 */
function ManageData() {
  // State for houses
  const [houses, setHouses] = useState([]);
  const [loadingHouses, setLoadingHouses] = useState(true);

  // State for people
  const [people, setPeople] = useState([]);
  const [loadingPeople, setLoadingPeople] = useState(true);

  // State for relationships
  const [relationships, setRelationships] = useState([]);
  const [loadingRelationships, setLoadingRelationships] = useState(true);

  // State for house modal
  const [isHouseModalOpen, setIsHouseModalOpen] = useState(false);
  const [editingHouse, setEditingHouse] = useState(null);
  const [deleteHouseConfirm, setDeleteHouseConfirm] = useState(null);

  // State for person modal
  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [deletePersonConfirm, setDeletePersonConfirm] = useState(null);

  // State for relationship modal
  const [isRelationshipModalOpen, setIsRelationshipModalOpen] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState(null);
  const [deleteRelationshipConfirm, setDeleteRelationshipConfirm] = useState(null);

  // Active tab
  const [activeTab, setActiveTab] = useState('houses');

  /**
   * Load data when component mounts
   */
  useEffect(() => {
    loadHouses();
    loadPeople();
    loadRelationships();
  }, []);

  /**
   * Load all houses from the database
   */
  const loadHouses = async () => {
    try {
      setLoadingHouses(true);
      const allHouses = await getAllHouses();
      setHouses(allHouses);
    } catch (error) {
      console.error('Error loading houses:', error);
      alert('Failed to load houses. Please refresh the page.');
    } finally {
      setLoadingHouses(false);
    }
  };

  /**
   * Load all people from the database
   */
  const loadPeople = async () => {
    try {
      setLoadingPeople(true);
      const allPeople = await getAllPeople();
      setPeople(allPeople);
    } catch (error) {
      console.error('Error loading people:', error);
      alert('Failed to load people. Please refresh the page.');
    } finally {
      setLoadingPeople(false);
    }
  };

  /**
   * Load all relationships from the database
   */
  const loadRelationships = async () => {
    try {
      setLoadingRelationships(true);
      const allRelationships = await getAllRelationships();
      setRelationships(allRelationships);
    } catch (error) {
      console.error('Error loading relationships:', error);
      alert('Failed to load relationships. Please refresh the page.');
    } finally {
      setLoadingRelationships(false);
    }
  };

  // ==================== HOUSE HANDLERS ====================

  const handleAddHouse = () => {
    setEditingHouse(null);
    setIsHouseModalOpen(true);
  };

  const handleEditHouse = (house) => {
    setEditingHouse(house);
    setIsHouseModalOpen(true);
  };

  const handleSaveHouse = async (houseData) => {
    try {
      if (editingHouse) {
        await updateHouse(editingHouse.id, houseData);
      } else {
        await addHouse(houseData);
      }
      await loadHouses();
      setIsHouseModalOpen(false);
      setEditingHouse(null);
    } catch (error) {
      console.error('Error saving house:', error);
      alert('Failed to save house. Please try again.');
    }
  };

  const handleCancelHouse = () => {
    setIsHouseModalOpen(false);
    setEditingHouse(null);
  };

  const handleDeleteHouseClick = (house) => {
    setDeleteHouseConfirm(house);
  };

  const handleDeleteHouseConfirm = async () => {
    if (!deleteHouseConfirm) return;

    try {
      await deleteHouse(deleteHouseConfirm.id);
      await loadHouses();
      setDeleteHouseConfirm(null);
    } catch (error) {
      console.error('Error deleting house:', error);
      alert('Failed to delete house. Please try again.');
    }
  };

  const handleDeleteHouseCancel = () => {
    setDeleteHouseConfirm(null);
  };

  // ==================== PERSON HANDLERS ====================

  const handleAddPerson = () => {
    if (houses.length === 0) {
      alert('Please create at least one house before adding people.');
      return;
    }
    setEditingPerson(null);
    setIsPersonModalOpen(true);
  };

  const handleEditPerson = (person) => {
    setEditingPerson(person);
    setIsPersonModalOpen(true);
  };

  const handleSavePerson = async (personData) => {
    try {
      if (editingPerson) {
        await updatePerson(editingPerson.id, personData);
      } else {
        await addPerson(personData);
      }
      await loadPeople();
      setIsPersonModalOpen(false);
      setEditingPerson(null);
    } catch (error) {
      console.error('Error saving person:', error);
      alert('Failed to save person. Please try again.');
    }
  };

  const handleCancelPerson = () => {
    setIsPersonModalOpen(false);
    setEditingPerson(null);
  };

  const handleDeletePersonClick = (person) => {
    setDeletePersonConfirm(person);
  };

  const handleDeletePersonConfirm = async () => {
    if (!deletePersonConfirm) return;

    try {
      await deletePerson(deletePersonConfirm.id);
      await loadPeople();
      setDeletePersonConfirm(null);
    } catch (error) {
      console.error('Error deleting person:', error);
      alert('Failed to delete person. Please try again.');
    }
  };

  const handleDeletePersonCancel = () => {
    setDeletePersonConfirm(null);
  };

  // ==================== RELATIONSHIP HANDLERS ====================

  const handleAddRelationship = () => {
    if (people.length < 2) {
      alert('Please create at least two people before adding relationships.');
      return;
    }
    setEditingRelationship(null);
    setIsRelationshipModalOpen(true);
  };

  const handleEditRelationship = (relationship) => {
    setEditingRelationship(relationship);
    setIsRelationshipModalOpen(true);
  };

  const handleSaveRelationship = async (relationshipData) => {
    try {
      if (editingRelationship) {
        await updateRelationship(editingRelationship.id, relationshipData);
      } else {
        await addRelationship(relationshipData);
      }
      await loadRelationships();
      setIsRelationshipModalOpen(false);
      setEditingRelationship(null);
    } catch (error) {
      console.error('Error saving relationship:', error);
      alert('Failed to save relationship. Please try again.');
    }
  };

  const handleCancelRelationship = () => {
    setIsRelationshipModalOpen(false);
    setEditingRelationship(null);
  };

  const handleDeleteRelationshipClick = (relationship) => {
    setDeleteRelationshipConfirm(relationship);
  };

  const handleDeleteRelationshipConfirm = async () => {
    if (!deleteRelationshipConfirm) return;

    try {
      await deleteRelationship(deleteRelationshipConfirm.id);
      await loadRelationships();
      setDeleteRelationshipConfirm(null);
    } catch (error) {
      console.error('Error deleting relationship:', error);
      alert('Failed to delete relationship. Please try again.');
    }
  };

  const handleDeleteRelationshipCancel = () => {
    setDeleteRelationshipConfirm(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Lineageweaver
            </Link>
            <div className="space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link to="/tree" className="text-gray-600 hover:text-gray-900">
                Family Tree
              </Link>
              <Link to="/manage" className="text-blue-600 font-semibold">
                Manage
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Manage Your World
            </h1>
            <p className="text-gray-600 mt-1">
              Create and manage houses, people, and relationships
            </p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6 border-b">
            <button
              onClick={() => setActiveTab('houses')}
              className={`pb-2 px-4 font-medium transition ${
                activeTab === 'houses'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Houses ({houses.length})
            </button>
            <button
              onClick={() => setActiveTab('people')}
              className={`pb-2 px-4 font-medium transition ${
                activeTab === 'people'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              People ({people.length})
            </button>
            <button
              onClick={() => setActiveTab('relationships')}
              className={`pb-2 px-4 font-medium transition ${
                activeTab === 'relationships'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Relationships ({relationships.length})
            </button>
          </div>

          {/* Houses Tab */}
          {activeTab === 'houses' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Houses</h2>
                <button
                  onClick={handleAddHouse}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
                >
                  <span className="text-xl">+</span>
                  <span>Add House</span>
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                {loadingHouses ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-2">⏳</div>
                    <p className="text-gray-600">Loading houses...</p>
                  </div>
                ) : (
                  <HouseList 
                    houses={houses}
                    onEdit={handleEditHouse}
                    onDelete={handleDeleteHouseClick}
                  />
                )}
              </div>
            </div>
          )}

          {/* People Tab */}
          {activeTab === 'people' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">People</h2>
                <button
                  onClick={handleAddPerson}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
                >
                  <span className="text-xl">+</span>
                  <span>Add Person</span>
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                {loadingPeople ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-2">⏳</div>
                    <p className="text-gray-600">Loading people...</p>
                  </div>
                ) : (
                  <PersonList 
                    people={people}
                    houses={houses}
                    onEdit={handleEditPerson}
                    onDelete={handleDeletePersonClick}
                  />
                )}
              </div>
            </div>
          )}

          {/* Relationships Tab */}
          {activeTab === 'relationships' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Relationships</h2>
                <button
                  onClick={handleAddRelationship}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center space-x-2"
                >
                  <span className="text-xl">+</span>
                  <span>Add Relationship</span>
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                {loadingRelationships ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-2">⏳</div>
                    <p className="text-gray-600">Loading relationships...</p>
                  </div>
                ) : (
                  <RelationshipList 
                    relationships={relationships}
                    people={people}
                    onEdit={handleEditRelationship}
                    onDelete={handleDeleteRelationshipClick}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* House Modals */}
      <Modal
        isOpen={isHouseModalOpen}
        onClose={handleCancelHouse}
        title={editingHouse ? 'Edit House' : 'Add New House'}
      >
        <HouseForm
          house={editingHouse}
          onSave={handleSaveHouse}
          onCancel={handleCancelHouse}
        />
      </Modal>

      <Modal
        isOpen={deleteHouseConfirm !== null}
        onClose={handleDeleteHouseCancel}
        title="Delete House"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete <strong>{deleteHouseConfirm?.houseName}</strong>?
          </p>
          <p className="text-sm text-gray-600">
            This action cannot be undone. Any people belonging to this house will need to be reassigned.
          </p>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={handleDeleteHouseCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteHouseConfirm}
              className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
            >
              Delete House
            </button>
          </div>
        </div>
      </Modal>

      {/* Person Modals */}
      <Modal
        isOpen={isPersonModalOpen}
        onClose={handleCancelPerson}
        title={editingPerson ? 'Edit Person' : 'Add New Person'}
      >
        <PersonForm
          person={editingPerson}
          houses={houses}
          onSave={handleSavePerson}
          onCancel={handleCancelPerson}
        />
      </Modal>

      <Modal
        isOpen={deletePersonConfirm !== null}
        onClose={handleDeletePersonCancel}
        title="Delete Person"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete <strong>{deletePersonConfirm?.firstName} {deletePersonConfirm?.lastName}</strong>?
          </p>
          <p className="text-sm text-gray-600">
            This action cannot be undone. All relationships involving this person will also be deleted.
          </p>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={handleDeletePersonCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDeletePersonConfirm}
              className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
            >
              Delete Person
            </button>
          </div>
        </div>
      </Modal>

      {/* Relationship Modals */}
      <Modal
        isOpen={isRelationshipModalOpen}
        onClose={handleCancelRelationship}
        title={editingRelationship ? 'Edit Relationship' : 'Add New Relationship'}
      >
        <RelationshipForm
          relationship={editingRelationship}
          people={people}
          onSave={handleSaveRelationship}
          onCancel={handleCancelRelationship}
        />
      </Modal>

      <Modal
        isOpen={deleteRelationshipConfirm !== null}
        onClose={handleDeleteRelationshipCancel}
        title="Delete Relationship"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this relationship?
          </p>
          <p className="text-sm text-gray-600">
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={handleDeleteRelationshipCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteRelationshipConfirm}
              className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
            >
              Delete Relationship
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ManageData;
