import { useState } from 'react';

/**
 * RelationshipForm Component
 * 
 * A form for creating or editing a relationship between two people.
 * 
 * Props:
 * - relationship: Existing relationship data (for editing) or null (for new)
 * - people: Array of all people (for the dropdowns)
 * - onSave: Function to call when form is submitted
 * - onCancel: Function to call when user cancels
 */
function RelationshipForm({ relationship = null, people = [], onSave, onCancel }) {
  // Form state
  const [formData, setFormData] = useState({
    person1Id: relationship?.person1Id || '',
    person2Id: relationship?.person2Id || '',
    relationshipType: relationship?.relationshipType || 'parent',
    biologicalParent: relationship?.biologicalParent ?? true,
    marriageDate: relationship?.marriageDate || '',
    divorceDate: relationship?.divorceDate || '',
    marriageStatus: relationship?.marriageStatus || 'married'
  });

  // Track validation errors
  const [errors, setErrors] = useState({});

  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Get person name by ID
   */
  const getPersonName = (personId) => {
    const person = people.find(p => p.id === parseInt(personId));
    return person ? `${person.firstName} ${person.lastName}` : 'Unknown';
  };

  /**
   * Validate the form
   */
  const validate = () => {
    const newErrors = {};

    // Both people must be selected
    if (!formData.person1Id) {
      newErrors.person1Id = 'Please select the first person';
    }
    if (!formData.person2Id) {
      newErrors.person2Id = 'Please select the second person';
    }

    // Can't create relationship with self
    if (formData.person1Id && formData.person2Id && 
        formData.person1Id === formData.person2Id) {
      newErrors.person2Id = 'Cannot create relationship with the same person';
    }

    // Validate dates for spouse relationships
    if (formData.relationshipType === 'spouse') {
      const dateRegex = /^\d{4}(-\d{2}(-\d{2})?)?$/;
      
      if (formData.marriageDate && !dateRegex.test(formData.marriageDate)) {
        newErrors.marriageDate = 'Date must be YYYY, YYYY-MM, or YYYY-MM-DD';
      }
      if (formData.divorceDate && !dateRegex.test(formData.divorceDate)) {
        newErrors.divorceDate = 'Date must be YYYY, YYYY-MM, or YYYY-MM-DD';
      }

      // Divorce date should be after marriage date
      if (formData.marriageDate && formData.divorceDate && 
          formData.divorceDate < formData.marriageDate) {
        newErrors.divorceDate = 'Divorce date cannot be before marriage date';
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
      // Prepare relationship data
      const relationshipData = {
        person1Id: parseInt(formData.person1Id),
        person2Id: parseInt(formData.person2Id),
        relationshipType: formData.relationshipType,
        biologicalParent: formData.relationshipType === 'parent' ? formData.biologicalParent : null,
        marriageDate: formData.relationshipType === 'spouse' && formData.marriageDate 
          ? formData.marriageDate : null,
        divorceDate: formData.relationshipType === 'spouse' && formData.divorceDate 
          ? formData.divorceDate : null,
        marriageStatus: formData.relationshipType === 'spouse' 
          ? formData.marriageStatus : null
      };

      // If editing, include the ID
      if (relationship?.id) {
        relationshipData.id = relationship.id;
      }
      
      onSave(relationshipData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Relationship Type */}
      <div>
        <label htmlFor="relationshipType" className="block text-sm font-medium text-gray-700 mb-1">
          Relationship Type
        </label>
        <select
          id="relationshipType"
          name="relationshipType"
          value={formData.relationshipType}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="parent">Parent/Child</option>
          <option value="spouse">Spouse/Marriage</option>
          <option value="adopted-parent">Adopted Parent/Child</option>
          <option value="foster-parent">Foster Parent/Child</option>
          <option value="mentor">Mentor/Apprentice</option>
          <option value="twin">Twins</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">
          {formData.relationshipType === 'parent' && 'Person 1 is the parent of Person 2'}
          {formData.relationshipType === 'spouse' && 'Person 1 and Person 2 are married'}
          {formData.relationshipType === 'adopted-parent' && 'Person 1 adopted Person 2'}
          {formData.relationshipType === 'foster-parent' && 'Person 1 is foster parent of Person 2'}
          {formData.relationshipType === 'mentor' && 'Person 1 is mentor to Person 2'}
          {formData.relationshipType === 'twin' && 'Person 1 and Person 2 are twins'}
        </p>
      </div>

      {/* Person Selection */}
      <div className="grid grid-cols-2 gap-4">
        {/* Person 1 */}
        <div>
          <label htmlFor="person1Id" className="block text-sm font-medium text-gray-700 mb-1">
            {formData.relationshipType === 'spouse' ? 'First Person *' : 
             formData.relationshipType === 'parent' ? 'Parent *' :
             formData.relationshipType === 'adopted-parent' ? 'Adoptive Parent *' :
             formData.relationshipType === 'foster-parent' ? 'Foster Parent *' :
             'Mentor *'}
          </label>
          <select
            id="person1Id"
            name="person1Id"
            value={formData.person1Id}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.person1Id ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select person</option>
            {people.map(person => (
              <option key={person.id} value={person.id}>
                {person.firstName} {person.lastName}
              </option>
            ))}
          </select>
          {errors.person1Id && (
            <p className="mt-1 text-sm text-red-600">{errors.person1Id}</p>
          )}
        </div>

        {/* Person 2 */}
        <div>
          <label htmlFor="person2Id" className="block text-sm font-medium text-gray-700 mb-1">
            {formData.relationshipType === 'spouse' ? 'Second Person *' : 
             formData.relationshipType === 'parent' ? 'Child *' :
             formData.relationshipType === 'adopted-parent' ? 'Adopted Child *' :
             formData.relationshipType === 'foster-parent' ? 'Foster Child *' :
             'Apprentice *'}
          </label>
          <select
            id="person2Id"
            name="person2Id"
            value={formData.person2Id}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.person2Id ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select person</option>
            {people.map(person => (
              <option key={person.id} value={person.id}>
                {person.firstName} {person.lastName}
              </option>
            ))}
          </select>
          {errors.person2Id && (
            <p className="mt-1 text-sm text-red-600">{errors.person2Id}</p>
          )}
        </div>
      </div>

      {/* Parent-specific fields */}
      {formData.relationshipType === 'parent' && (
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="biologicalParent"
              checked={formData.biologicalParent}
              onChange={handleChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Biological parent</span>
          </label>
          <p className="mt-1 text-xs text-gray-500">
            Uncheck if this is a non-biological parental relationship
          </p>
        </div>
      )}

      {/* Spouse-specific fields */}
      {formData.relationshipType === 'spouse' && (
        <>
          <div className="grid grid-cols-2 gap-4">
            {/* Marriage Date */}
            <div>
              <label htmlFor="marriageDate" className="block text-sm font-medium text-gray-700 mb-1">
                Marriage Date
              </label>
              <input
                type="text"
                id="marriageDate"
                name="marriageDate"
                value={formData.marriageDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.marriageDate ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="YYYY-MM-DD or YYYY"
              />
              {errors.marriageDate && (
                <p className="mt-1 text-sm text-red-600">{errors.marriageDate}</p>
              )}
            </div>

            {/* Divorce Date */}
            <div>
              <label htmlFor="divorceDate" className="block text-sm font-medium text-gray-700 mb-1">
                Divorce Date
              </label>
              <input
                type="text"
                id="divorceDate"
                name="divorceDate"
                value={formData.divorceDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.divorceDate ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Leave blank if still married"
              />
              {errors.divorceDate && (
                <p className="mt-1 text-sm text-red-600">{errors.divorceDate}</p>
              )}
            </div>
          </div>

          {/* Marriage Status */}
          <div>
            <label htmlFor="marriageStatus" className="block text-sm font-medium text-gray-700 mb-1">
              Marriage Status
            </label>
            <select
              id="marriageStatus"
              name="marriageStatus"
              value={formData.marriageStatus}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>
        </>
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
          {relationship ? 'Update Relationship' : 'Create Relationship'}
        </button>
      </div>
    </form>
  );
}

export default RelationshipForm;
