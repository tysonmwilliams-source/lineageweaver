/**
 * PersonList Component
 * 
 * Displays all people in a list with their key information.
 * Shows house affiliation and provides edit/delete options.
 * 
 * Props:
 * - people: Array of person objects
 * - houses: Array of house objects (to show house names)
 * - onEdit: Function to call when user wants to edit a person
 * - onDelete: Function to call when user wants to delete a person
 */
function PersonList({ people, houses, onEdit, onDelete }) {
  
  /**
   * Get house name by house ID
   */
  const getHouseName = (houseId) => {
    const house = houses.find(h => h.id === houseId);
    return house ? house.houseName : 'Unknown House';
  };

  /**
   * Get house color by house ID
   */
  const getHouseColor = (houseId) => {
    const house = houses.find(h => h.id === houseId);
    return house ? house.colorCode : '#6b7280';
  };

  /**
   * Get border color based on legitimacy status
   */
  const getLegitimacyColor = (status) => {
    const colors = {
      legitimate: '#22c55e',   // green
      bastard: '#f59e0b',      // amber/orange
      adopted: '#3b82f6',      // blue
      unknown: '#6b7280'       // gray
    };
    return colors[status] || colors.unknown;
  };

  /**
   * Format date for display
   */
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    // If it's just a year, return as is
    if (dateStr.length === 4) return dateStr;
    // Otherwise format it nicely
    return dateStr;
  };

  if (people.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <div className="text-4xl mb-2">👤</div>
        <p className="text-gray-600">No people yet. Create your first person!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {people.map(person => (
        <div 
          key={person.id} 
          className="bg-white rounded-lg overflow-hidden hover:shadow-md transition"
          style={{ 
            borderLeft: `4px solid ${getLegitimacyColor(person.legitimacyStatus)}`,
          }}
        >
          <div className="p-4">
            <div className="flex items-start justify-between">
              {/* Person Info */}
              <div className="flex-1">
                {/* Name and House */}
                <div className="flex items-center space-x-3 mb-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getHouseColor(person.houseId) }}
                    title={getHouseName(person.houseId)}
                  />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {person.firstName} {person.lastName}
                    {person.maidenName && (
                      <span className="text-sm font-normal text-gray-500 italic ml-2">
                        (née {person.maidenName})
                      </span>
                    )}
                  </h3>
                </div>

                {/* House affiliation */}
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">{getHouseName(person.houseId)}</span>
                </p>

                {/* Dates */}
                {(person.dateOfBirth || person.dateOfDeath) && (
                  <p className="text-sm text-gray-600 mb-1">
                    {person.dateOfBirth && (
                      <span>b. {formatDate(person.dateOfBirth)}</span>
                    )}
                    {person.dateOfBirth && person.dateOfDeath && ' - '}
                    {person.dateOfDeath && (
                      <span>d. {formatDate(person.dateOfDeath)}</span>
                    )}
                  </p>
                )}

                {/* Titles */}
                {person.titles && person.titles.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {person.titles.map((title, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                      >
                        {title}
                      </span>
                    ))}
                  </div>
                )}

                {/* Legitimacy badge */}
                {person.legitimacyStatus !== 'legitimate' && (
                  <span className="inline-block mt-2 px-2 py-1 text-xs rounded" style={{
                    backgroundColor: getLegitimacyColor(person.legitimacyStatus) + '20',
                    color: getLegitimacyColor(person.legitimacyStatus)
                  }}>
                    {person.legitimacyStatus.charAt(0).toUpperCase() + person.legitimacyStatus.slice(1)}
                  </span>
                )}

                {/* Fantasy elements */}
                {(person.species || person.magicalBloodline) && (
                  <div className="mt-2 text-sm text-gray-600">
                    {person.species && <span className="mr-3">🧬 {person.species}</span>}
                    {person.magicalBloodline && <span>✨ {person.magicalBloodline}</span>}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => onEdit(person)}
                  className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition"
                  title="Edit person"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(person)}
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition"
                  title="Delete person"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PersonList;
