import { useState } from 'react';
import { calculateAge, isEligibleForCeremony } from '../services/database';

/**
 * QuickEditSidebar Component
 * 
 * Enhanced sidebar that shows person details AND allows quick editing/adding relationships
 * 
 * Props:
 * - person: Selected person object
 * - house: House object this person belongs to
 * - relationships: Array of relationships involving this person
 * - allPeople: Array of all people
 * - houses: Array of all houses
 * - onUpdate: Function to call when person is updated
 * - onAddChild: Function to add a child
 * - onAddSpouse: Function to add a spouse
 * - onAddRelationship: Function to add any relationship
 * - onEditRelationship: Function to edit a relationship
 * - onDeleteRelationship: Function to delete a relationship
 * - onEditPerson: Function to open full edit modal
 */
function QuickEditSidebar({ 
  person, 
  house, 
  relationships = [], 
  allPeople = [], 
  houses = [],
  onUpdate,
  onAddChild,
  onAddSpouse,
  onAddRelationship,
  onEditRelationship,
  onDeleteRelationship,
  onEditPerson,
  onDeletePerson, // NEW: Callback for deleting person
  onFoundCadetHouse // NEW: Callback for founding cadet house
}) {
  
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [isAddingSpouse, setIsAddingSpouse] = useState(false);
  const [isAddingRelationship, setIsAddingRelationship] = useState(false);
  const [childForm, setChildForm] = useState({
    firstName: '',
    lastName: person?.lastName || '',
    dateOfBirth: '',
    gender: 'male',
    legitimacyStatus: 'legitimate',
    bothParents: true,
    houseId: person?.houseId || null
  });
  const [spouseForm, setSpouseForm] = useState({
    firstName: '',
    lastName: '',
    maidenName: '',
    dateOfBirth: '',
    gender: person?.gender === 'male' ? 'female' : 'male',
    marriageDate: '',
    houseId: person?.houseId || null
  });
  const [relationshipForm, setRelationshipForm] = useState({
    relatedPersonId: '',
    relationshipType: 'parent'
  });
  
  if (!person) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        <p className="text-sm">Click on a person in the tree to see details and quick-edit options</p>
      </div>
    );
  }

  /**
   * Get legitimacy color
   */
  const getLegitimacyColor = (status) => {
    const colors = {
      legitimate: '#22c55e',
      bastard: '#f59e0b',
      adopted: '#3b82f6',
      unknown: '#6b7280'
    };
    return colors[status] || colors.unknown;
  };

  /**
   * Get person name by ID
   */
  const getPersonName = (personId) => {
    const p = allPeople.find(person => person.id === personId);
    return p ? `${p.firstName} ${p.lastName}` : 'Unknown';
  };

  /**
   * Get relationships by type
   */
  const parents = relationships.filter(rel => 
    (rel.relationshipType === 'parent' || 
     rel.relationshipType === 'adopted-parent' || 
     rel.relationshipType === 'foster-parent') && 
    rel.person2Id === person.id
  );

  const children = relationships.filter(rel => 
    (rel.relationshipType === 'parent' || 
     rel.relationshipType === 'adopted-parent' || 
     rel.relationshipType === 'foster-parent') && 
    rel.person1Id === person.id
  );

  const spouses = relationships.filter(rel => 
    rel.relationshipType === 'spouse' && 
    (rel.person1Id === person.id || rel.person2Id === person.id)
  );

  /**
   * Get spouse object
   */
  const getSpouse = () => {
    if (spouses.length === 0) return null;
    const spouseRel = spouses[0];
    const spouseId = spouseRel.person1Id === person.id ? spouseRel.person2Id : spouseRel.person1Id;
    return allPeople.find(p => p.id === spouseId);
  };

  const spouse = getSpouse();

  /**
   * Handle add child
   */
  const handleAddChild = async () => {
    if (!childForm.firstName.trim()) {
      alert('Please enter a first name');
      return;
    }

    // For legitimate children, we need both parents (unless it's a bastard or adopted)
    if (childForm.legitimacyStatus === 'legitimate' && childForm.bothParents && !spouse) {
      alert('Cannot add legitimate child with both parents: No spouse found. Please add a spouse first, or mark the child as a bastard.');
      return;
    }
    
    // Determine parent2Id - only if spouse exists AND bothParents is checked
    const parent2Id = (childForm.bothParents && spouse) ? spouse.id : null;

    await onAddChild({
      ...childForm,
      parent1Id: person.id,
      parent2Id: parent2Id
    });

    setChildForm({
      firstName: '',
      lastName: person.lastName,
      dateOfBirth: '',
      gender: 'male',
      legitimacyStatus: 'legitimate',
      bothParents: true,
      houseId: person.houseId
    });
    setIsAddingChild(false);
  };

  /**
   * Handle add spouse
   */
  const handleAddSpouse = async () => {
    if (!spouseForm.firstName.trim()) {
      alert('Please enter a first name');
      return;
    }

    await onAddSpouse({
      ...spouseForm,
      spouseOfId: person.id
    });

    setSpouseForm({
      firstName: '',
      lastName: '',
      maidenName: '',
      dateOfBirth: '',
      gender: person.gender === 'male' ? 'female' : 'male',
      marriageDate: '',
      houseId: person.houseId
    });
    setIsAddingSpouse(false);
  };

  /**
   * Handle add relationship
   */
  const handleAddRelationship = async () => {
    if (!relationshipForm.relatedPersonId) {
      alert('Please select a person');
      return;
    }

    await onAddRelationship({
      person1Id: person.id,
      person2Id: relationshipForm.relatedPersonId,
      relationshipType: relationshipForm.relationshipType
    });

    setRelationshipForm({
      relatedPersonId: '',
      relationshipType: 'parent'
    });
    setIsAddingRelationship(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div 
        className="p-3"
        style={{ 
          backgroundColor: house ? house.colorCode + '20' : '#f3f4f6',
          borderLeft: `4px solid ${getLegitimacyColor(person.legitimacyStatus)}`
        }}
      >
        <h2 className="text-xl font-bold text-gray-900">
          {person.firstName} {person.lastName}
        </h2>
        {person.maidenName && (
          <p className="text-xs text-gray-600 italic">
            (née {person.maidenName})
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-3 bg-gray-50 border-b space-y-2">
        <button
          onClick={onEditPerson}
          className="w-full px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          ✏️ Full Edit
        </button>
        
        <button
          onClick={() => {
            if (window.confirm(`Are you sure you want to delete ${person.firstName} ${person.lastName}? This will also delete all their relationships.`)) {
              onDeletePerson(person.id);
            }
          }}
          className="w-full px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          🗑️ Delete Person
        </button>
        
        {/* Cadet House Ceremony Button - Only show for eligible bastards */}
        {isEligibleForCeremony(person) && onFoundCadetHouse && (
          <button
            onClick={() => onFoundCadetHouse(person)}
            className="w-full px-3 py-1.5 text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded hover:from-purple-700 hover:to-blue-700 transition font-semibold flex items-center justify-center space-x-2"
          >
            <span>⚔️</span>
            <span>Found Cadet House</span>
          </button>
        )}
        
        {/* Show age info for bastards approaching eligibility */}
        {person.legitimacyStatus === 'bastard' && person.bastardStatus === 'active' && person.dateOfBirth && (
          <div className="text-xs text-gray-600 text-center">
            Age: {calculateAge(person.dateOfBirth)}
            {calculateAge(person.dateOfBirth) < 18 && (
              <span className="block text-purple-600 font-semibold">
                Eligible for ceremony at 18
              </span>
            )}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-3 space-y-2 text-sm overflow-y-auto" style={{ maxHeight: '70vh' }}>
        {/* Basic Info */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase">House</p>
          <div className="flex items-center space-x-1">
            {house && (
              <div 
                className="w-3 h-3 rounded"
                style={{ backgroundColor: house.colorCode }}
              />
            )}
            <p className="text-sm text-gray-900">{house ? house.houseName : 'Commoner (No House)'}</p>
          </div>
        </div>

        {(person.dateOfBirth || person.dateOfDeath) && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Dates</p>
            <p className="text-sm text-gray-900">
              {person.dateOfBirth && `b. ${person.dateOfBirth}`}
              {person.dateOfBirth && person.dateOfDeath && ' • '}
              {person.dateOfDeath && `d. ${person.dateOfDeath}`}
            </p>
          </div>
        )}

        {/* Relationships */}
        <div className="pt-2 border-t">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Relationships</p>
          
          {/* Parents */}
          {parents.length > 0 && (
            <div className="mb-2">
              <p className="text-xs text-gray-600 font-medium">Parents:</p>
              {parents.map((rel, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs text-gray-900 ml-2 mb-1">
                  <span>• {getPersonName(rel.person1Id)}</span>
                  <button
                    onClick={() => onDeleteRelationship(rel.id)}
                    className="text-red-600 hover:text-red-800 text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Spouse */}
          {spouses.length > 0 && (
            <div className="mb-2">
              <p className="text-xs text-gray-600 font-medium">Spouse:</p>
              {spouses.map((rel, idx) => {
                const spouseId = rel.person1Id === person.id ? rel.person2Id : rel.person1Id;
                return (
                  <div key={idx} className="flex items-center justify-between text-xs text-gray-900 ml-2 mb-1">
                    <span>• {getPersonName(spouseId)}</span>
                    <button
                      onClick={() => onDeleteRelationship(rel.id)}
                      className="text-red-600 hover:text-red-800 text-xs px-1"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Children */}
          {children.length > 0 && (
            <div className="mb-2">
              <p className="text-xs text-gray-600 font-medium">Children:</p>
              {children.map((rel, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs text-gray-900 ml-2 mb-1">
                  <span>• {getPersonName(rel.person2Id)}</span>
                  <button
                    onClick={() => onDeleteRelationship(rel.id)}
                    className="text-red-600 hover:text-red-800 text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Add Buttons */}
        <div className="pt-2 border-t space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase">Quick Add</p>
          
          {!isAddingSpouse && spouses.length === 0 && (
            <button
              onClick={() => setIsAddingSpouse(true)}
              className="w-full px-3 py-1.5 text-xs bg-pink-100 text-pink-700 rounded hover:bg-pink-200 transition"
            >
              + Add Spouse
            </button>
          )}

          {!isAddingChild && (
            <button
              onClick={() => setIsAddingChild(true)}
              className="w-full px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
            >
              + Add Child
            </button>
          )}

          {!isAddingRelationship && (
            <button
              onClick={() => setIsAddingRelationship(true)}
              className="w-full px-3 py-1.5 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition"
            >
              + Add Relationship
            </button>
          )}
        </div>

        {/* Add Spouse Form */}
        {isAddingSpouse && (
          <div className="pt-2 border-t space-y-2">
            <p className="text-xs font-semibold text-gray-700">Add Spouse</p>
            <input
              type="text"
              placeholder="First Name *"
              value={spouseForm.firstName}
              onChange={(e) => setSpouseForm({...spouseForm, firstName: e.target.value})}
              className="w-full px-2 py-1 text-xs border rounded"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={spouseForm.lastName}
              onChange={(e) => setSpouseForm({...spouseForm, lastName: e.target.value})}
              className="w-full px-2 py-1 text-xs border rounded"
            />
            <input
              type="text"
              placeholder="Maiden Name"
              value={spouseForm.maidenName}
              onChange={(e) => setSpouseForm({...spouseForm, maidenName: e.target.value})}
              className="w-full px-2 py-1 text-xs border rounded"
            />
            <input
              type="text"
              placeholder="Birth Date (YYYY-MM-DD)"
              value={spouseForm.dateOfBirth}
              onChange={(e) => setSpouseForm({...spouseForm, dateOfBirth: e.target.value})}
              className="w-full px-2 py-1 text-xs border rounded"
            />
            <select
              value={spouseForm.houseId || ''}
              onChange={(e) => setSpouseForm({...spouseForm, houseId: e.target.value ? parseInt(e.target.value) : null})}
              className="w-full px-2 py-1 text-xs border rounded"
            >
              <option value="">No House (Commoner)</option>
              {houses.map(h => (
                <option key={h.id} value={h.id}>{h.houseName}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Marriage Date (YYYY-MM-DD)"
              value={spouseForm.marriageDate}
              onChange={(e) => setSpouseForm({...spouseForm, marriageDate: e.target.value})}
              className="w-full px-2 py-1 text-xs border rounded"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleAddSpouse}
                className="flex-1 px-2 py-1 text-xs bg-pink-600 text-white rounded hover:bg-pink-700"
              >
                Add
              </button>
              <button
                onClick={() => setIsAddingSpouse(false)}
                className="flex-1 px-2 py-1 text-xs bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Add Child Form */}
        {isAddingChild && (
          <div className="pt-2 border-t space-y-2">
            <p className="text-xs font-semibold text-gray-700">Add Child</p>
            <input
              type="text"
              placeholder="First Name *"
              value={childForm.firstName}
              onChange={(e) => setChildForm({...childForm, firstName: e.target.value})}
              className="w-full px-2 py-1 text-xs border rounded"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={childForm.lastName}
              onChange={(e) => setChildForm({...childForm, lastName: e.target.value})}
              className="w-full px-2 py-1 text-xs border rounded"
            />
            <input
              type="text"
              placeholder="Birth Date (YYYY-MM-DD)"
              value={childForm.dateOfBirth}
              onChange={(e) => setChildForm({...childForm, dateOfBirth: e.target.value})}
              className="w-full px-2 py-1 text-xs border rounded"
            />
            <select
              value={childForm.gender}
              onChange={(e) => setChildForm({...childForm, gender: e.target.value})}
              className="w-full px-2 py-1 text-xs border rounded"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <select
              value={childForm.houseId || ''}
              onChange={(e) => setChildForm({...childForm, houseId: e.target.value ? parseInt(e.target.value) : null})}
              className="w-full px-2 py-1 text-xs border rounded"
            >
              <option value="">No House (Commoner)</option>
              {houses.map(h => (
                <option key={h.id} value={h.id}>{h.houseName}</option>
              ))}
            </select>
            <select
              value={childForm.legitimacyStatus}
              onChange={(e) => setChildForm({...childForm, legitimacyStatus: e.target.value})}
              className="w-full px-2 py-1 text-xs border rounded"
            >
              <option value="legitimate">Legitimate</option>
              <option value="bastard">Bastard</option>
              <option value="adopted">Adopted</option>
            </select>
            {spouse && (
              <label className="flex items-center space-x-2 text-xs">
                <input
                  type="checkbox"
                  checked={childForm.bothParents}
                  onChange={(e) => setChildForm({...childForm, bothParents: e.target.checked})}
                  className="rounded"
                />
                <span>Also child of {spouse.firstName} {spouse.lastName}</span>
              </label>
            )}
            <div className="flex space-x-2">
              <button
                onClick={handleAddChild}
                className="flex-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add
              </button>
              <button
                onClick={() => setIsAddingChild(false)}
                className="flex-1 px-2 py-1 text-xs bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Add Relationship Form */}
        {isAddingRelationship && (
          <div className="pt-2 border-t space-y-2">
            <p className="text-xs font-semibold text-gray-700">Add Relationship</p>
            <select
              value={relationshipForm.relatedPersonId}
              onChange={(e) => setRelationshipForm({...relationshipForm, relatedPersonId: parseInt(e.target.value)})}
              className="w-full px-2 py-1 text-xs border rounded"
            >
              <option value="">Select Person *</option>
              {allPeople
                .filter(p => p.id !== person.id)
                .sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`))
                .map(p => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName}
                  </option>
                ))}
            </select>
            <select
              value={relationshipForm.relationshipType}
              onChange={(e) => setRelationshipForm({...relationshipForm, relationshipType: e.target.value})}
              className="w-full px-2 py-1 text-xs border rounded"
            >
              <option value="parent">Parent (selected person is parent)</option>
              <option value="spouse">Spouse</option>
              <option value="adopted-parent">Adopted Parent</option>
              <option value="foster-parent">Foster Parent</option>
              <option value="twin">Twin</option>
            </select>
            <p className="text-xs text-gray-500">
              {relationshipForm.relationshipType === 'parent' && `${person.firstName} is parent of selected person`}
              {relationshipForm.relationshipType === 'spouse' && `${person.firstName} married to selected person`}
              {relationshipForm.relationshipType === 'adopted-parent' && `${person.firstName} adopted selected person`}
              {relationshipForm.relationshipType === 'foster-parent' && `${person.firstName} is foster parent of selected person`}
              {relationshipForm.relationshipType === 'twin' && `${person.firstName} is twin of selected person`}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleAddRelationship}
                className="flex-1 px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Add
              </button>
              <button
                onClick={() => setIsAddingRelationship(false)}
                className="flex-1 px-2 py-1 text-xs bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuickEditSidebar;
