/**
 * HouseList Component
 * 
 * Displays all houses in a list with edit and delete options.
 * 
 * Props:
 * - houses: Array of house objects
 * - onEdit: Function to call when user wants to edit a house
 * - onDelete: Function to call when user wants to delete a house
 */
function HouseList({ houses, onEdit, onDelete }) {
  
  if (houses.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <div className="text-4xl mb-2">🏰</div>
        <p className="text-gray-600">No houses yet. Create your first house!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {houses.map(house => (
        <div 
          key={house.id} 
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
        >
          <div className="flex items-start justify-between">
            {/* House Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                {/* Color indicator */}
                <div 
                  className="w-6 h-6 rounded border border-gray-300"
                  style={{ backgroundColor: house.colorCode }}
                  title="House color"
                />
                <h3 className="text-lg font-semibold text-gray-900">
                  {house.houseName}
                </h3>
                {house.foundedDate && (
                  <span className="text-sm text-gray-500">
                    (Founded {house.foundedDate})
                  </span>
                )}
              </div>

              {house.sigil && (
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Sigil:</span> {house.sigil}
                </p>
              )}

              {house.motto && (
                <p className="text-sm text-gray-600 italic mb-1">
                  "{house.motto}"
                </p>
              )}

              {house.notes && (
                <p className="text-sm text-gray-500 mt-2">
                  {house.notes}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => onEdit(house)}
                className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition"
                title="Edit house"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(house)}
                className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition"
                title="Delete house"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HouseList;
