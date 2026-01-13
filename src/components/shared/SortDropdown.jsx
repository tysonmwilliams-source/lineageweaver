/**
 * SortDropdown.jsx - Sort Selector Component
 *
 * PURPOSE:
 * Dropdown for selecting sort order in lists.
 * Uses BEM CSS and theme variables.
 *
 * Props:
 * - value: Current sort key
 * - onChange: Callback when sort changes
 * - options: Array of { value, label, icon? }
 * - label: Optional label text (e.g., "Sort:")
 */

import Icon from '../icons';
import './SortDropdown.css';

function SortDropdown({
  value,
  onChange,
  options,
  label = 'Sort:'
}) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="sort-dropdown">
      {label && (
        <label className="sort-dropdown__label">
          <Icon name="arrow-up-down" size={14} />
          <span>{label}</span>
        </label>
      )}

      <select
        className="sort-dropdown__select"
        value={value}
        onChange={handleChange}
        aria-label={label || 'Sort by'}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SortDropdown;
