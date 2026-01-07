/**
 * RelationshipList Component
 * 
 * Displays all relationships in a list format.
 * 
 * Props:
 * - relationships: Array of relationship objects
 * - people: Array of people (to show names)
 * - onEdit: Function to call when user wants to edit a relationship
 * - onDelete: Function to call when user wants to delete a relationship
 */
function RelationshipList({ relationships, people, onEdit, onDelete }) {
  
  /**
   * Get person name by ID
   */
  const getPersonName = (personId) => {
    const person = people.find(p => p.id === personId);
    return person ? `${person.firstName} ${person.lastName}` : 'Unknown';
  };

  /**
   * Get relationship description
   */
  const getRelationshipDescription = (rel) => {
    const person1 = getPersonName(rel.person1Id);
    const person2 = getPersonName(rel.person2Id);

    switch (rel.relationshipType) {
      case 'parent':
        return {
          text: `${person1} is the ${rel.biologicalParent ? 'biological' : 'non-biological'} parent of ${person2}`,
          icon: '👨‍👦',
          color: 'blue'
        };
      case 'spouse':
        return {
          text: `${person1} and ${person2} are ${rel.marriageStatus}`,
          icon: '💑',
          color: 'pink'
        };
      case 'adopted-parent':
        return {
          text: `${person1} adopted ${person2}`,
          icon: '🤝',
          color: 'purple'
        };
      case 'foster-parent':
        return {
          text: `${person1} is foster parent of ${person2}`,
          icon: '🏠',
          color: 'green'
        };
      case 'mentor':
        return {
          text: `${person1} is mentor to ${person2}`,
          icon: '📚',
          color: 'yellow'
        };
      case 'twin':
        return {
          text: `${person1} and ${person2} are twins`,
          icon: '👯',
          color: 'indigo'
        };
      default:
        return {
          text: `${person1} and ${person2}`,
          icon: '🔗',
          color: 'gray'
        };
    }
  };

  /**
   * Get color class for relationship type
   */
  const getColorClass = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200',
      pink: 'bg-pink-50 border-pink-200',
      purple: 'bg-purple-50 border-purple-200',
      green: 'bg-green-50 border-green-200',
      yellow: 'bg-yellow-50 border-yellow-200',
      indigo: 'bg-indigo-50 border-indigo-200',
      gray: 'bg-gray-50 border-gray-200'
    };
    return colors[color] || colors.gray;
  };

  if (relationships.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <div className="text-4xl mb-2">🔗</div>
        <p className="text-gray-600">No relationships yet. Create your first relationship!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {relationships.map(rel => {
        const description = getRelationshipDescription(rel);
        return (
          <div 
            key={rel.id} 
            className={`border rounded-lg p-4 hover:shadow-md transition ${getColorClass(description.color)}`}
          >
            <div className="flex items-start justify-between">
              {/* Relationship Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">{description.icon}</span>
                  <p className="text-gray-900 font-medium">
                    {description.text}
                  </p>
                </div>

                {/* Additional details for spouse relationships */}
                {rel.relationshipType === 'spouse' && (
                  <div className="text-sm text-gray-600 ml-8">
                    {rel.marriageDate && (
                      <p>Married: {rel.marriageDate}</p>
                    )}
                    {rel.divorceDate && (
                      <p>Divorced: {rel.divorceDate}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => onEdit(rel)}
                  className="px-3 py-1 text-sm text-blue-600 hover:bg-white rounded transition"
                  title="Edit relationship"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(rel)}
                  className="px-3 py-1 text-sm text-red-600 hover:bg-white rounded transition"
                  title="Delete relationship"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RelationshipList;
