/**
 * PersonCard Component
 * 
 * Displays detailed information about a person.
 * Used in the sidebar when a person is selected in the tree view.
 * 
 * Props:
 * - person: Person object to display
 * - house: House object this person belongs to
 * - relationships: Array of relationships involving this person
 * - allPeople: Array of all people (to show relationship names)
 */
function PersonCard({ person, house, relationships = [], allPeople = [] }) {
  
  if (!person) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        Click on a person in the tree to see their details
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
  const getRelationshipsByType = (type) => {
    return relationships.filter(rel => rel.relationshipType === type);
  };

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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header with house color */}
      <div 
        className="p-4"
        style={{ 
          backgroundColor: house ? house.colorCode + '20' : '#f3f4f6',
          borderLeft: `4px solid ${getLegitimacyColor(person.legitimacyStatus)}`
        }}
      >
        <h2 className="text-2xl font-bold text-gray-900">
          {person.firstName} {person.lastName}
        </h2>
        {person.maidenName && (
          <p className="text-sm text-gray-600 italic">
            (née {person.maidenName})
          </p>
        )}
      </div>

      {/* Details */}
      <div className="p-4 space-y-3">
        {/* House */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">House</p>
          <div className="flex items-center space-x-2">
            {house && (
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: house.colorCode }}
              />
            )}
            <p className="text-sm text-gray-900">{house?.houseName || 'Unknown'}</p>
          </div>
        </div>

        {/* Dates */}
        {(person.dateOfBirth || person.dateOfDeath) && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Lifespan</p>
            <p className="text-sm text-gray-900">
              {person.dateOfBirth && `Born: ${person.dateOfBirth}`}
              {person.dateOfBirth && person.dateOfDeath && ' • '}
              {person.dateOfDeath && `Died: ${person.dateOfDeath}`}
            </p>
          </div>
        )}

        {/* Gender */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Gender</p>
          <p className="text-sm text-gray-900 capitalize">{person.gender}</p>
        </div>

        {/* Legitimacy Status */}
        {person.legitimacyStatus !== 'legitimate' && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Status</p>
            <span 
              className="inline-block px-2 py-1 text-xs rounded"
              style={{
                backgroundColor: getLegitimacyColor(person.legitimacyStatus) + '20',
                color: getLegitimacyColor(person.legitimacyStatus)
              }}
            >
              {person.legitimacyStatus.charAt(0).toUpperCase() + person.legitimacyStatus.slice(1)}
            </span>
          </div>
        )}

        {/* Titles */}
        {person.titles && person.titles.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Titles</p>
            <div className="flex flex-wrap gap-1">
              {person.titles.map((title, idx) => (
                <span 
                  key={idx}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                >
                  {title}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Species */}
        {person.species && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Species</p>
            <p className="text-sm text-gray-900">{person.species}</p>
          </div>
        )}

        {/* Magical Bloodline */}
        {person.magicalBloodline && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Magical Bloodline</p>
            <p className="text-sm text-gray-900">{person.magicalBloodline}</p>
          </div>
        )}

        {/* Relationships */}
        <div className="pt-3 border-t">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Relationships</p>
          
          {/* Parents */}
          {parents.length > 0 && (
            <div className="mb-2">
              <p className="text-xs text-gray-600 font-medium mb-1">Parents:</p>
              {parents.map((rel, idx) => (
                <p key={idx} className="text-sm text-gray-900 ml-2">
                  • {getPersonName(rel.person1Id)}
                  {rel.relationshipType === 'adopted-parent' && ' (adopted)'}
                  {rel.relationshipType === 'foster-parent' && ' (foster)'}
                </p>
              ))}
            </div>
          )}

          {/* Spouses */}
          {spouses.length > 0 && (
            <div className="mb-2">
              <p className="text-xs text-gray-600 font-medium mb-1">Spouse(s):</p>
              {spouses.map((rel, idx) => {
                const spouseId = rel.person1Id === person.id ? rel.person2Id : rel.person1Id;
                return (
                  <p key={idx} className="text-sm text-gray-900 ml-2">
                    • {getPersonName(spouseId)} ({rel.marriageStatus})
                  </p>
                );
              })}
            </div>
          )}

          {/* Children */}
          {children.length > 0 && (
            <div>
              <p className="text-xs text-gray-600 font-medium mb-1">Children:</p>
              {children.map((rel, idx) => (
                <p key={idx} className="text-sm text-gray-900 ml-2">
                  • {getPersonName(rel.person2Id)}
                  {rel.relationshipType === 'adopted-parent' && ' (adopted)'}
                  {rel.relationshipType === 'foster-parent' && ' (foster)'}
                </p>
              ))}
            </div>
          )}

          {parents.length === 0 && spouses.length === 0 && children.length === 0 && (
            <p className="text-sm text-gray-500 italic">No relationships recorded</p>
          )}
        </div>

        {/* Notes */}
        {person.notes && (
          <div className="pt-3 border-t">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Notes</p>
            <p className="text-sm text-gray-700">{person.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PersonCard;
