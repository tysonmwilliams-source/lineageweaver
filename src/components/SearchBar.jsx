import { useState } from 'react';

/**
 * Enhanced SearchBar Component - FIXED POSITIONING
 * 
 * Dropdown now truly floats above content without affecting layout.
 */
function SearchBar({ people, onSearchResults, onPersonSelect, isDarkTheme = true }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      onSearchResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const searchResults = people.filter(person => {
      const firstName = (person.firstName || '').toLowerCase();
      const lastName = (person.lastName || '').toLowerCase();
      const maidenName = (person.maidenName || '').toLowerCase();
      
      return firstName.includes(lowerQuery) || 
             lastName.includes(lowerQuery) || 
             maidenName.includes(lowerQuery);
    });

    setResults(searchResults);
    setShowDropdown(searchResults.length > 0);
    onSearchResults(searchResults);
  };

  const handleSelectPerson = (person) => {
    setSearchQuery(`${person.firstName} ${person.lastName}`);
    setShowDropdown(false);
    onSearchResults([person]);
    if (onPersonSelect) {
      onPersonSelect(person);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setResults([]);
    setShowDropdown(false);
    onSearchResults([]);
  };

  const theme = isDarkTheme ? {
    bg: '#2d2418',
    text: '#e9dcc9',
    border: '#4a3d2a',
    placeholder: '#8f8370',
    dropdown: '#3a2f20',
    hover: '#4a3d2a'
  } : {
    bg: '#ffffff',
    text: '#2d2418',
    border: '#d4c4a4',
    placeholder: '#6a5d4a',
    dropdown: '#f5f0e8',
    hover: '#ede7dc'
  };

  return (
    <div className="relative" style={{ width: '256px', height: '42px' }}>
      {/* Input wrapper - fixed height to prevent expansion */}
      <div className="relative" style={{ height: '42px' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          onBlur={() => {
            // Delay hiding to allow click events on dropdown items
            setTimeout(() => setShowDropdown(false), 200);
          }}
          placeholder="Search people..."
          className="w-full pl-10 pr-10 py-2 rounded-lg transition"
          style={{
            backgroundColor: theme.bg,
            color: theme.text,
            borderWidth: '1px',
            borderColor: theme.border,
            height: '42px'
          }}
        />
        
        {/* Search Icon */}
        <div 
          className="absolute left-3 top-1/2 transform -translate-y-1/2"
          style={{ color: theme.placeholder, pointerEvents: 'none' }}
        >
          🔍
        </div>

        {/* Clear Button */}
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:opacity-70 transition"
            style={{ color: theme.text }}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown Results - FIXED: Absolutely positioned, floats above everything */}
      {showDropdown && results.length > 0 && (
        <div 
          className="rounded-lg shadow-xl overflow-hidden"
          style={{
            position: 'absolute',
            top: '50px', // Just below the input
            left: '0',
            backgroundColor: theme.dropdown,
            borderWidth: '1px',
            borderColor: theme.border,
            maxHeight: '300px',
            overflowY: 'auto',
            width: '256px',
            zIndex: 9999 // Very high z-index to float above everything
          }}
        >
          <div className="py-1">
            {results.slice(0, 10).map(person => (
              <button
                key={person.id}
                onMouseDown={(e) => {
                  // Use onMouseDown instead of onClick to fire before onBlur
                  e.preventDefault();
                  handleSelectPerson(person);
                }}
                className="w-full px-4 py-2 text-left transition-colors"
                style={{
                  color: theme.text,
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div className="font-semibold truncate">{person.firstName} {person.lastName}</div>
                {person.maidenName && (
                  <div className="text-xs truncate" style={{ color: theme.placeholder }}>
                    née {person.maidenName}
                  </div>
                )}
                <div className="text-xs truncate" style={{ color: theme.placeholder }}>
                  {person.dateOfBirth}{person.dateOfDeath ? ` - ${person.dateOfDeath}` : ''}
                </div>
              </button>
            ))}
            {results.length > 10 && (
              <div className="px-4 py-2 text-xs text-center" style={{ color: theme.placeholder }}>
                +{results.length - 10} more results
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
