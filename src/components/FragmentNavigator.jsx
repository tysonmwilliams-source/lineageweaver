/**
 * FragmentNavigator Component
 *
 * A hover-expandable pill that shows available family tree fragments (disconnected branches).
 * Allows quick navigation between different branches in the tree view.
 */

import { useState } from 'react';
import Icon from './icons';

function FragmentNavigator({ fragments, onNavigateToFragment }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!fragments || fragments.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed top-20 left-6 z-10"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Collapsed pill */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderWidth: '1px',
          borderColor: 'var(--border-primary)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <Icon name="git-branch" size={16} style={{ color: 'var(--accent-primary)' }} />
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {fragments.length} Branches
        </span>
      </div>

      {/* Expanded dropdown */}
      {isExpanded && (
        <div
          className="absolute top-full left-0 mt-1 min-w-48 rounded-lg overflow-hidden"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderWidth: '1px',
            borderColor: 'var(--border-primary)',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          {fragments.map((fragment, index) => (
            <button
              key={index}
              className="w-full px-3 py-2 text-left transition-colors hover:bg-opacity-80 flex items-center gap-2"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--text-primary)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              onClick={() => onNavigateToFragment(index)}
            >
              <Icon name="user" size={14} style={{ color: 'var(--text-secondary)' }} />
              <span className="text-sm">
                {fragment.rootPerson.firstName} {fragment.rootPerson.lastName}
              </span>
              <span className="text-xs ml-auto" style={{ color: 'var(--text-tertiary)' }}>
                {fragment.memberCount}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default FragmentNavigator;
