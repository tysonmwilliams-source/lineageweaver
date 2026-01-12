import { useState, useEffect } from 'react';
import { validateRelationship, generateCascadeSuggestions } from '../utils/SmartDataValidator';

/**
 * RelationshipForm Component
 * 
 * A form for creating or editing a relationship between two people.
 * Now includes SMART VALIDATION that catches biological impossibilities
 * and suggests helpful cascading updates.
 * 
 * Props:
 * - relationship: Existing relationship data (for editing) or null (for new)
 * - people: Array of all people (for the dropdowns)
 * - allRelationships: Array of all existing relationships (for validation)
 * - onSave: Function to call when form is submitted
 * - onCancel: Function to call when user cancels
 * - onSuggestionAccept: Function to call when user accepts a cascade suggestion
 */
function RelationshipForm({ 
  relationship = null, 
  people = [], 
  allRelationships = [],
  onSave, 
  onCancel,
  onSuggestionAccept = null
}) {
  // Form state
  const [formData, setFormData] = useState({
    person1Id: relationship?.person1Id || '',
    person2Id: relationship?.person2Id || '',
    relationshipType: relationship?.relationshipType || 'parent',
    biologicalParent: relationship?.biologicalParent ?? true,
    marriageDate: relationship?.marriageDate || '',
    divorceDate: relationship?.divorceDate || '',
    marriageStatus: relationship?.marriageStatus || 'married',
    // Lineage-gap specific fields
    estimatedGenerations: relationship?.estimatedGenerations || '',
    lineageNotes: relationship?.lineageNotes || ''
  });

  // Track validation errors (blocking)
  const [errors, setErrors] = useState({});
  
  // Track validation warnings (non-blocking, can be overridden)
  const [warnings, setWarnings] = useState([]);
  
  // Track whether user has acknowledged warnings
  const [warningsAcknowledged, setWarningsAcknowledged] = useState(false);
  
  // Cascade suggestions
  const [suggestions, setSuggestions] = useState([]);

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
    // Reset warning acknowledgment when data changes
    setWarningsAcknowledged(false);
  };

  /**
   * Get person name by ID
   */
  const getPersonName = (personId) => {
    const person = people.find(p => p.id === parseInt(personId));
    return person ? `${person.firstName} ${person.lastName}` : 'Unknown';
  };

  /**
   * Run smart validation whenever form data changes
   * This provides real-time feedback as the user fills out the form
   */
  useEffect(() => {
    // Only validate if both people are selected
    if (!formData.person1Id || !formData.person2Id) {
      setWarnings([]);
      setSuggestions([]);
      return;
    }
    
    // Build the relationship object for validation
    const relationshipToValidate = {
      ...formData,
      person1Id: parseInt(formData.person1Id),
      person2Id: parseInt(formData.person2Id),
      id: relationship?.id // Include ID if editing
    };
    
    // Run smart validation
    const validationResult = validateRelationship(
      relationshipToValidate,
      people,
      allRelationships
    );
    
    // Update warnings (errors are handled at submit time)
    setWarnings(validationResult.warnings || []);
    
    // Generate cascade suggestions for new relationships
    if (!relationship) {
      const newSuggestions = generateCascadeSuggestions(
        'relationship_add',
        relationshipToValidate,
        { people, relationships: allRelationships }
      );
      setSuggestions(newSuggestions);
    }
  }, [formData, people, allRelationships, relationship]);

  /**
   * Validate the form (original validation + smart validation)
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

    // ═══════════════════════════════════════════════════════════════════════
    // SMART VALIDATION - Check for biological/logical impossibilities
    // ═══════════════════════════════════════════════════════════════════════
    if (formData.person1Id && formData.person2Id) {
      const relationshipToValidate = {
        ...formData,
        person1Id: parseInt(formData.person1Id),
        person2Id: parseInt(formData.person2Id),
        id: relationship?.id
      };
      
      const smartResult = validateRelationship(
        relationshipToValidate,
        people,
        allRelationships
      );
      
      // Add blocking errors from smart validation
      smartResult.errors.forEach(err => {
        // Map error codes to form fields where appropriate
        switch (err.code) {
          case 'CIRCULAR_ANCESTRY':
          case 'PARENT_BORN_AFTER_CHILD':
          case 'PARENT_DEAD_AT_BIRTH':
            newErrors.person1Id = err.message;
            break;
          case 'DUPLICATE_RELATIONSHIP':
            newErrors.relationshipType = err.message;
            break;
          case 'MARRIED_AFTER_DEATH':
            newErrors.marriageDate = err.message;
            break;
          case 'DIVORCE_BEFORE_MARRIAGE':
            newErrors.divorceDate = err.message;
            break;
          default:
            newErrors.general = err.message;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check for unacknowledged warnings
    if (warnings.length > 0 && !warningsAcknowledged) {
      // Don't submit yet - user needs to acknowledge warnings
      return;
    }
    
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
          ? formData.marriageStatus : null,
        // Lineage-gap specific fields
        estimatedGenerations: formData.relationshipType === 'lineage-gap' && formData.estimatedGenerations
          ? parseInt(formData.estimatedGenerations) : null,
        lineageNotes: formData.relationshipType === 'lineage-gap' && formData.lineageNotes
          ? formData.lineageNotes : null
      };

      // If editing, include the ID
      if (relationship?.id) {
        relationshipData.id = relationship.id;
      }
      
      onSave(relationshipData);
    }
  };

  /**
   * Handle cascade suggestion acceptance
   */
  const handleAcceptSuggestion = (suggestion) => {
    if (onSuggestionAccept) {
      onSuggestionAccept(suggestion);
    }
    // Remove the accepted suggestion from the list
    setSuggestions(prev => prev.filter(s => s !== suggestion));
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
          <option value="named-after">Named After (Namesake)</option>
          <option value="lineage-gap">Lineage Gap (Distant Ancestor)</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">
          {formData.relationshipType === 'parent' && 'Person 1 is the parent of Person 2'}
          {formData.relationshipType === 'spouse' && 'Person 1 and Person 2 are married'}
          {formData.relationshipType === 'adopted-parent' && 'Person 1 adopted Person 2'}
          {formData.relationshipType === 'foster-parent' && 'Person 1 is foster parent of Person 2'}
          {formData.relationshipType === 'mentor' && 'Person 1 is mentor to Person 2'}
          {formData.relationshipType === 'twin' && 'Person 1 and Person 2 are twins'}
          {formData.relationshipType === 'named-after' && 'Person 1 was named after Person 2 (honors/namesake)'}
          {formData.relationshipType === 'lineage-gap' && 'Person 2 is a distant ancestor of Person 1 (exact lineage unknown)'}
        </p>
        {errors.relationshipType && (
          <p className="mt-1 text-sm text-red-600">{errors.relationshipType}</p>
        )}
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
             formData.relationshipType === 'twin' ? 'First Twin *' :
             formData.relationshipType === 'named-after' ? 'Person Named *' :
             formData.relationshipType === 'lineage-gap' ? 'Descendant *' :
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
                {person.dateOfBirth ? ` (b. ${person.dateOfBirth.split('-')[0]})` : ''}
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
             formData.relationshipType === 'twin' ? 'Second Twin *' :
             formData.relationshipType === 'named-after' ? 'Named After (Honored) *' :
             formData.relationshipType === 'lineage-gap' ? 'Distant Ancestor *' :
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
                {person.dateOfBirth ? ` (b. ${person.dateOfBirth.split('-')[0]})` : ''}
              </option>
            ))}
          </select>
          {errors.person2Id && (
            <p className="mt-1 text-sm text-red-600">{errors.person2Id}</p>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SMART VALIDATION WARNINGS
          Non-blocking issues that the user can override
          ═══════════════════════════════════════════════════════════════════ */}
      {warnings.length > 0 && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <span className="text-amber-600 text-xl">⚠️</span>
            <div className="flex-1">
              <h4 className="font-semibold text-amber-800 mb-2">
                Potential Issues Detected
              </h4>
              <ul className="space-y-1">
                {warnings.map((warning, index) => (
                  <li key={index} className="text-sm text-amber-700">
                    • {warning.message}
                  </li>
                ))}
              </ul>
              
              {!warningsAcknowledged && (
                <div className="mt-3 pt-3 border-t border-amber-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={warningsAcknowledged}
                      onChange={(e) => setWarningsAcknowledged(e.target.checked)}
                      className="rounded border-amber-400 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-sm text-amber-800">
                      I understand these warnings and want to proceed anyway
                    </span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          CASCADE SUGGESTIONS
          Helpful prompts for related updates
          ═══════════════════════════════════════════════════════════════════ */}
      {suggestions.length > 0 && onSuggestionAccept && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <span className="text-blue-600 text-xl">💡</span>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-800 mb-2">
                Suggestions
              </h4>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-center justify-between bg-white rounded-lg p-2 border border-blue-100">
                    <span className="text-sm text-blue-700">{suggestion.message}</span>
                    <button
                      type="button"
                      onClick={() => handleAcceptSuggestion(suggestion)}
                      className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200 transition"
                    >
                      Yes
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* General Errors */}
      {errors.general && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4">
          <p className="text-sm text-red-700">{errors.general}</p>
        </div>
      )}

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

      {/* Lineage-gap specific fields */}
      {formData.relationshipType === 'lineage-gap' && (
        <>
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
            <div className="flex items-start gap-3">
              <span className="text-purple-600 text-xl">🔗</span>
              <div className="flex-1">
                <h4 className="font-semibold text-purple-800 mb-2">
                  Lineage Gap Connection
                </h4>
                <p className="text-sm text-purple-700 mb-3">
                  Use this to connect family members who are related but separated by 
                  unknown or unrecorded generations. This creates a "loose" connection 
                  that links tree fragments without implying direct parent-child relationships.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="estimatedGenerations" className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Generations Apart
            </label>
            <input
              type="number"
              id="estimatedGenerations"
              name="estimatedGenerations"
              value={formData.estimatedGenerations}
              onChange={handleChange}
              min="1"
              max="50"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 5 for great-great-great grandparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              Approximate number of generations between these people (optional)
            </p>
          </div>
          
          <div>
            <label htmlFor="lineageNotes" className="block text-sm font-medium text-gray-700 mb-1">
              Connection Notes
            </label>
            <textarea
              id="lineageNotes"
              name="lineageNotes"
              value={formData.lineageNotes}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 'Aldric is believed to be Cair's ancestor through the main Salomon line, exact connection unknown'"
            />
            <p className="mt-1 text-xs text-gray-500">
              Notes about how these people are connected or why the exact lineage is unknown
            </p>
          </div>
        </>
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
          disabled={warnings.length > 0 && !warningsAcknowledged}
          className={`px-4 py-2 text-white rounded-lg transition ${
            warnings.length > 0 && !warningsAcknowledged
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {relationship ? 'Update Relationship' : 'Create Relationship'}
        </button>
      </div>
    </form>
  );
}

export default RelationshipForm;
