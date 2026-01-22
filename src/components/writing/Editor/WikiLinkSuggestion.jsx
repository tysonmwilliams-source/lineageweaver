/**
 * WikiLinkSuggestion.jsx - Autocomplete Suggestion Component
 *
 * Renders the autocomplete dropdown for wiki-links.
 */

import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../../icons';
import { ENTITY_TYPE_LABELS } from '../../../services/entitySearchService';
import './WikiLinkSuggestion.css';

/**
 * SuggestionItem Component
 */
function SuggestionItem({ item, isSelected, onClick }) {
  return (
    <button
      className={`wiki-suggestion__item ${isSelected ? 'wiki-suggestion__item--selected' : ''}`}
      onClick={onClick}
      type="button"
    >
      <div className="wiki-suggestion__item-icon">
        <Icon name={item.icon} size={16} strokeWidth={2} />
      </div>
      <div className="wiki-suggestion__item-content">
        <span className="wiki-suggestion__item-name">{item.name}</span>
        {item.subtitle && (
          <span className="wiki-suggestion__item-subtitle">{item.subtitle}</span>
        )}
      </div>
      <span className="wiki-suggestion__item-type">
        {ENTITY_TYPE_LABELS[item.type]}
      </span>
    </button>
  );
}

/**
 * WikiLinkSuggestionList Component
 *
 * The dropdown list of entity suggestions.
 */
export const WikiLinkSuggestionList = forwardRef(function WikiLinkSuggestionList(
  { items, command },
  ref
) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Reset selection when items change
  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  // Handle selection
  const selectItem = useCallback((index) => {
    const item = items[index];
    if (item) {
      command({
        id: item.id,
        type: item.type,
        label: item.name
      });
    }
  }, [items, command]);

  // Expose keyboard navigation methods
  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((prev) =>
          prev <= 0 ? items.length - 1 : prev - 1
        );
        return true;
      }

      if (event.key === 'ArrowDown') {
        setSelectedIndex((prev) =>
          prev >= items.length - 1 ? 0 : prev + 1
        );
        return true;
      }

      if (event.key === 'Enter') {
        selectItem(selectedIndex);
        return true;
      }

      // Close on ]] (manual close)
      if (event.key === ']') {
        return false;
      }

      return false;
    }
  }), [items.length, selectedIndex, selectItem]);

  if (items.length === 0) {
    return (
      <div className="wiki-suggestion wiki-suggestion--empty">
        <div className="wiki-suggestion__empty">
          <Icon name="search" size={20} strokeWidth={1.5} />
          <span>No entities found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="wiki-suggestion">
      <div className="wiki-suggestion__list">
        {items.map((item, index) => (
          <SuggestionItem
            key={`${item.type}-${item.id}`}
            item={item}
            isSelected={index === selectedIndex}
            onClick={() => selectItem(index)}
          />
        ))}
      </div>
      <div className="wiki-suggestion__footer">
        <span>
          <kbd>↑</kbd><kbd>↓</kbd> Navigate
        </span>
        <span>
          <kbd>↵</kbd> Select
        </span>
        <span>
          <kbd>Esc</kbd> Close
        </span>
      </div>
    </div>
  );
});

/**
 * Create the suggestion render function for TipTap
 */
export function createSuggestionRenderer() {
  let component = null;
  let popup = null;

  return {
    onStart: (props) => {
      // Create popup container
      popup = document.createElement('div');
      popup.className = 'wiki-suggestion-popup';
      document.body.appendChild(popup);

      // Position the popup
      const { clientRect } = props;
      if (clientRect) {
        const rect = clientRect();
        if (rect) {
          popup.style.position = 'fixed';
          popup.style.left = `${rect.left}px`;
          popup.style.top = `${rect.bottom + 8}px`;
          popup.style.zIndex = '9999';
        }
      }

      // Store component reference for updates
      component = {
        updateProps: (newProps) => {
          if (popup) {
            import('react-dom/client').then(({ createRoot }) => {
              const root = createRoot(popup);
              root.render(
                <WikiLinkSuggestionList
                  ref={(ref) => { component.ref = ref; }}
                  items={newProps.items}
                  command={newProps.command}
                />
              );
            });
          }
        },
        ref: null
      };

      // Initial render
      component.updateProps(props);
    },

    onUpdate: (props) => {
      // Update position
      const { clientRect } = props;
      if (clientRect && popup) {
        const rect = clientRect();
        if (rect) {
          popup.style.left = `${rect.left}px`;
          popup.style.top = `${rect.bottom + 8}px`;
        }
      }

      // Update content
      if (component) {
        component.updateProps(props);
      }
    },

    onKeyDown: (props) => {
      if (props.event.key === 'Escape') {
        if (popup) {
          popup.remove();
          popup = null;
        }
        return true;
      }

      if (component?.ref?.onKeyDown) {
        return component.ref.onKeyDown(props);
      }

      return false;
    },

    onExit: () => {
      if (popup) {
        popup.remove();
        popup = null;
      }
      component = null;
    }
  };
}

export default WikiLinkSuggestionList;
