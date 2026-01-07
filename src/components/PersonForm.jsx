import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isFeatureEnabled } from '../config/featureFlags';

/**
 * PersonForm Component
 * 
 * A form for adding or editing a person.
 * 
 * Props:
 * - person: Existing person data (for editing) or null (for new person)
 * - houses: Array of all houses (for the dropdown)
 * - onSave: Function to call when form is submitted
 * - onCancel: Function to call when user cancels
 */
function PersonForm({ person = null, houses = [], onSave, onCancel }) {
  // ═══════════════════════════════════════════════════════════════════════════════
  // 🔗 TREE-CODEX INTEGRATION: Navigation to Codex entry
  // ═══════════════════════════════════════════════════════════════════════════════
  const navigate = useNavigate();
  
  // Form state - initialize with existing person data or empty values
  const [formData, setFormData] = useState({
    firstName: person?.firstName || '',
    lastName: person?.lastName || '',
    maidenName: person?.maidenName || '',
    dateOfBirth: person?.dateOfBirth || '',
    dateOfDeath: person?.dateOfDeath || '',
    gender: person?.gender || 'male',
    houseId: person?.houseId || null,
    legitimacyStatus: person?.legitimacyStatus || 'legitimate',
    species: person?.species || '',
    magicalBloodline: person?.magicalBloodline || '',
    titles: person?.titles ? person.titles.join(', ') : '',
    notes: person?.notes || '',
    portraitUrl: person?.portraitUrl || ''
  });

  // Track validation errors
  const [errors, setErrors] = useState({});

  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? null : value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Validate the form
   */
  const validate = () => {
    const newErrors = {};

    // First name is required
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Last name is required
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Validate date format if provided (YYYY-MM-DD or partial)
    const dateRegex = /^\d{4}(-\d{2}(-\d{2})?)?$/;
    if (formData.dateOfBirth && !dateRegex.test(formData.dateOfBirth)) {
      newErrors.dateOfBirth = 'Date must be YYYY, YYYY-MM, or YYYY-MM-DD';
    }
    if (formData.dateOfDeath && !dateRegex.test(formData.dateOfDeath)) {
      newErrors.dateOfDeath = 'Date must be YYYY, YYYY-MM, or YYYY-MM-DD';
    }

    // Check if death date is after birth date
    if (formData.dateOfBirth && formData.dateOfDeath) {
      if (formData.dateOfDeath < formData.dateOfBirth) {
        newErrors.dateOfDeath = 'Death date cannot be before birth date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Convert titles string back to array
      const titlesArray = formData.titles
        ? formData.titles.split(',').map(t => t.trim()).filter(t => t)
        : [];

      // Prepare person data
      const personData = {
        ...formData,
        titles: titlesArray,
        houseId: formData.houseId ? parseInt(formData.houseId) : null,
        maidenName: formData.maidenName || null,
        dateOfBirth: formData.dateOfBirth || null,
        dateOfDeath: formData.dateOfDeath || null,
        species: formData.species || null,
        magicalBloodline: formData.magicalBloodline || null,
        portraitUrl: formData.portraitUrl || null
      };

      // If editing, include the ID
      if (person?.id) {
        personData.id = person.id;
      }
      
      onSave(personData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Basic Information Section */}
      <div className="grid grid-cols-2 gap-4">
        {/* First Name - Required */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Jon"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name - Required */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Snow"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>
      </div>

      {/* Maiden Name */}
      <div>
        <label htmlFor="maidenName" className="block text-sm font-medium text-gray-700 mb-1">
          Maiden Name (if applicable)
        </label>
        <input
          type="text"
          id="maidenName"
          name="maidenName"
          value={formData.maidenName || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Birth surname if changed through marriage"
        />
      </div>

      {/* Gender and House */}
      <div className="grid grid-cols-2 gap-4">
        {/* Gender */}
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* House */}
        <div>
          <label htmlFor="houseId" className="block text-sm font-medium text-gray-700 mb-1">
            House
          </label>
          <select
            id="houseId"
            name="houseId"
            value={formData.houseId || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">No House (Commoner)</option>
            {houses.map(house => (
              <option key={house.id} value={house.id}>
                {house.houseName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        {/* Date of Birth */}
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="text"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="YYYY-MM-DD or YYYY"
          />
          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">Format: YYYY-MM-DD, YYYY-MM, or YYYY</p>
        </div>

        {/* Date of Death */}
        <div>
          <label htmlFor="dateOfDeath" className="block text-sm font-medium text-gray-700 mb-1">
            Date of Death
          </label>
          <input
            type="text"
            id="dateOfDeath"
            name="dateOfDeath"
            value={formData.dateOfDeath || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.dateOfDeath ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="YYYY-MM-DD or YYYY"
          />
          {errors.dateOfDeath && (
            <p className="mt-1 text-sm text-red-600">{errors.dateOfDeath}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">Leave blank if still living</p>
        </div>
      </div>

      {/* Legitimacy Status */}
      <div>
        <label htmlFor="legitimacyStatus" className="block text-sm font-medium text-gray-700 mb-1">
          Legitimacy Status
        </label>
        <select
          id="legitimacyStatus"
          name="legitimacyStatus"
          value={formData.legitimacyStatus}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="legitimate">Legitimate</option>
          <option value="bastard">Bastard</option>
          <option value="adopted">Adopted</option>
          <option value="unknown">Unknown</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">
          This affects the border color in the family tree visualization
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          🪝 HOOK: FANTASY_FIELDS_INPUT
          ═══════════════════════════════════════════════════════════════════════
          Fantasy-specific fields controlled by feature flags.
          Only renders if at least one fantasy feature is enabled.
          ═══════════════════════════════════════════════════════════════════════ */}
      {(isFeatureEnabled('MODULE_1E.SPECIES_FIELD') || 
        isFeatureEnabled('MODULE_1E.MAGICAL_BLOODLINES') || 
        isFeatureEnabled('MODULE_1E.TITLES_SYSTEM')) && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Fantasy Elements (Optional)</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Species - Shows when MODULE_1E.SPECIES_FIELD is enabled */}
            {isFeatureEnabled('MODULE_1E.SPECIES_FIELD') && (
              <div>
                <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-1">
                  Species/Race
                </label>
                <input
                  type="text"
                  id="species"
                  name="species"
                  value={formData.species || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Human, Elf, Dwarf"
                />
              </div>
            )}

            {/* Magical Bloodline - Shows when MODULE_1E.MAGICAL_BLOODLINES is enabled */}
            {isFeatureEnabled('MODULE_1E.MAGICAL_BLOODLINES') && (
              <div>
                <label htmlFor="magicalBloodline" className="block text-sm font-medium text-gray-700 mb-1">
                  Magical Bloodline
                </label>
                <input
                  type="text"
                  id="magicalBloodline"
                  name="magicalBloodline"
                  value={formData.magicalBloodline || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Dragon Rider, Seer"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          🪝 HOOK: FANTASY_FIELDS_INPUT - Titles
          ═══════════════════════════════════════════════════════════════════════ */}
      {/* Titles - Shows when MODULE_1E.TITLES_SYSTEM is enabled */}
      {isFeatureEnabled('MODULE_1E.TITLES_SYSTEM') && (
        <div>
          <label htmlFor="titles" className="block text-sm font-medium text-gray-700 mb-1">
            Titles
          </label>
          <input
            type="text"
            id="titles"
            name="titles"
            value={formData.titles || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Separate multiple titles with commas"
          />
          <p className="mt-1 text-xs text-gray-500">Example: Lord of Winterfell, Warden of the North</p>
        </div>
      )}

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Additional information about this person..."
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          🔗 TREE-CODEX INTEGRATION: View Biography Button
          ═══════════════════════════════════════════════════════════════════
          Shows when editing an existing person with a Codex entry.
          Allows navigation to The Codex for rich biography editing.
          ═══════════════════════════════════════════════════════════════════ */}
      {person?.codexEntryId && (
        <div className="py-4 border-t border-b bg-amber-50 rounded-lg px-4 my-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-amber-900">
                📖 Biography Available
              </h4>
              <p className="text-xs text-amber-700 mt-1">
                This person has a Codex entry for detailed biographical information.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/codex/entry/${person.codexEntryId}`)}
              className="px-4 py-2 text-amber-900 bg-amber-200 rounded-lg hover:bg-amber-300 transition flex items-center gap-2 font-medium"
            >
              <span>📖</span>
              View Biography
            </button>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          {person ? 'Update Person' : 'Create Person'}
        </button>
      </div>
    </form>
  );
}

export default PersonForm;
