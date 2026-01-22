/**
 * TreeSettingsPanel Component
 *
 * Collapsible settings panel for the Family Tree view.
 * Controls house selection, centering, relationship display, and branch view.
 */

function TreeSettingsPanel({
  // Panel state
  isExpanded,

  // House selection
  houses,
  selectedHouseId,
  onHouseChange,

  // Centre on person
  centreOnPersonId,
  onCentreOnChange,
  notablePeople,

  // Relationship display
  showRelationships,
  onShowRelationshipsChange,

  // Branch view (for fragments)
  showBranchView,
  onShowBranchViewChange,
  hasMultipleFragments
}) {
  return (
    <div className="fixed top-20 right-6 z-10">
      <div
        className="rounded-lg shadow-lg transition-all duration-300 ease-in-out overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderWidth: '1px',
          borderColor: 'var(--border-primary)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          maxHeight: isExpanded ? '600px' : '0',
          opacity: isExpanded ? '1' : '0',
          padding: isExpanded ? '1rem' : '0 1rem'
        }}
      >
        {/* House Selection */}
        <label className="block mb-2 font-medium" style={{ color: 'var(--text-primary)' }}>
          View House:
        </label>
        <select
          value={selectedHouseId || ''}
          onChange={(e) => onHouseChange(Number(e.target.value))}
          className="w-48 p-2 rounded transition"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            borderWidth: '1px',
            borderColor: 'var(--border-primary)',
            borderRadius: 'var(--radius-md)'
          }}
        >
          {houses.map(house => (
            <option key={house.id} value={house.id}>
              {house.houseName}
              {house.houseType === 'cadet' ? ' (Cadet)' : ''}
            </option>
          ))}
        </select>

        {/* Centre On Person */}
        <div className="mt-4 pt-4" style={{ borderTopWidth: '1px', borderColor: 'var(--border-primary)' }}>
          <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Centre On:
          </label>
          <select
            value={centreOnPersonId}
            onChange={(e) => onCentreOnChange(e.target.value === 'auto' ? 'auto' : Number(e.target.value))}
            className="w-48 p-2 rounded transition"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              borderWidth: '1px',
              borderColor: 'var(--border-primary)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <option value="auto">Oldest Member</option>
            {notablePeople.map(person => (
              <option key={person.id} value={person.id}>
                {person.firstName} {person.lastName} (b. {person.dateOfBirth})
              </option>
            ))}
          </select>
        </div>

        {/* Show Relationships Toggle */}
        <div className="mt-4 pt-4" style={{ borderTopWidth: '1px', borderColor: 'var(--border-primary)' }}>
          <label className="flex items-center cursor-pointer transition-opacity hover:opacity-80" style={{ color: 'var(--text-primary)' }}>
            <input
              type="checkbox"
              checked={showRelationships}
              onChange={(e) => onShowRelationshipsChange(e.target.checked)}
              className="mr-2 w-4 h-4"
            />
            <span className="text-sm">Show Relationships</span>
          </label>
        </div>

        {/* Branch View Toggle (only shown when multiple fragments exist) */}
        {hasMultipleFragments && (
          <div className="mt-4 pt-4" style={{ borderTopWidth: '1px', borderColor: 'var(--border-primary)' }}>
            <label className="flex items-center cursor-pointer transition-opacity hover:opacity-80" style={{ color: 'var(--text-primary)' }}>
              <input
                type="checkbox"
                checked={showBranchView}
                onChange={(e) => onShowBranchViewChange(e.target.checked)}
                className="mr-2 w-4 h-4"
              />
              <span className="text-sm">View Other Branches</span>
            </label>
            {showBranchView && (
              <p className="mt-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                Split-screen branch view coming soon
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TreeSettingsPanel;
