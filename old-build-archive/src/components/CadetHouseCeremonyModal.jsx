import { useState } from 'react';

/**
 * CadetHouseCeremonyModal Component
 * 
 * Admin tool for founding a cadet house from a bastard (age 18+).
 * Allows flexible naming based on any part of the parent house name.
 * 
 * Props:
 * - founder: The bastard person founding the house
 * - parentHouse: The parent house they're creating a branch of
 * - onFound: Function to call when founding is completed
 * - onCancel: Function to call when user cancels
 */
function CadetHouseCeremonyModal({ founder, parentHouse, onFound, onCancel }) {
  const [formData, setFormData] = useState({
    prefix: '',
    houseName: '',
    motto: '',
    foundingYear: new Date().getFullYear().toString()
  });

  const [errors, setErrors] = useState({});

  /**
   * Generate name suggestions based on parent house name
   */
  const generateSuggestions = () => {
    // Strip "House" prefix if present to get the actual house name
    let name = parentHouse.houseName.toLowerCase();
    if (name.startsWith('house ')) {
      name = name.substring(6); // Remove "house " (6 characters)
    }
    
    const suggestions = [];
    const suffixes = ['home', 'stone', 'crest', 'forge', 'vale', 'guard', 'brook', 'mere', 'hart', 'wood'];
    
    // Generate suggestions from different parts of the parent name
    // First 3-4 letters
    if (name.length >= 3) {
      const prefix1 = name.substring(0, 3);
      suffixes.slice(0, 3).forEach(suffix => {
        suggestions.push(prefix1.charAt(0).toUpperCase() + prefix1.slice(1) + suffix);
      });
    }
    
    // First 4 letters if long enough
    if (name.length >= 5) {
      const prefix2 = name.substring(0, 4);
      suffixes.slice(3, 5).forEach(suffix => {
        suggestions.push(prefix2.charAt(0).toUpperCase() + prefix2.slice(1) + suffix);
      });
    }
    
    // Last 3-4 letters
    if (name.length >= 6) {
      const prefix3 = name.substring(name.length - 4);
      suffixes.slice(5, 7).forEach(suffix => {
        suggestions.push(prefix3.charAt(0).toUpperCase() + prefix3.slice(1) + suffix);
      });
    }
    
    return suggestions;
  };

  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Auto-update house name when prefix changes
    if (name === 'prefix' && value) {
      setFormData(prev => ({
        ...prev,
        houseName: value
      }));
    }
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Use a suggestion
   */
  const useSuggestion = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      houseName: suggestion,
      prefix: ''
    }));
  };

  /**
   * Validate the form
   */
  const validate = () => {
    const newErrors = {};

    // House name is required
    if (!formData.houseName.trim()) {
      newErrors.houseName = 'House name is required';
    } 
    // Must be at least 4 characters
    else if (formData.houseName.length < 4) {
      newErrors.houseName = 'House name must be at least 4 characters';
    }

    // Founding year is required
    if (!formData.foundingYear) {
      newErrors.foundingYear = 'Founding year is required';
    } else if (!/^\d{4}$/.test(formData.foundingYear)) {
      newErrors.foundingYear = 'Must be a 4-digit year';
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
      onFound({
        founderId: founder.id,
        houseName: formData.houseName,
        parentHouseId: parentHouse.id,
        ceremonyDate: `${formData.foundingYear}-01-01`, // Use year as full date
        motto: formData.motto || null,
        // Use a lighter shade of parent house color
        colorCode: adjustColorBrightness(parentHouse.colorCode, 40)
      });
    }
  };

  /**
   * Adjust color brightness for cadet house
   */
  const adjustColorBrightness = (hex, percent) => {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    const newR = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
    const newG = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
    const newB = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));
    
    return '#' + 
      newR.toString(16).padStart(2, '0') + 
      newG.toString(16).padStart(2, '0') + 
      newB.toString(16).padStart(2, '0');
  };

  const suggestions = generateSuggestions();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Found Cadet House</h3>
        <p className="text-sm text-gray-600">
          Create a cadet branch of <strong>{parentHouse.houseName}</strong> for {founder.firstName} {founder.lastName}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Founder Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Founder</p>
            <p className="text-gray-900">{founder.firstName} {founder.lastName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Parent House</p>
            <p className="text-gray-900">{parentHouse.houseName}</p>
          </div>
        </div>

        {/* Naming Help */}
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <p className="text-xs font-semibold text-blue-900 mb-1">Naming Convention</p>
          <p className="text-sm text-blue-800">
            Use any part of "{parentHouse.houseName.replace(/^House /i, '')}" as the basis for the new house name (e.g., "Bran" or "Ford" from "Branford")
          </p>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div>
            <p className="text-xs text-gray-600 mb-2">Suggested Names:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => useSuggestion(suggestion)}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* House Name */}
        <div>
          <label htmlFor="houseName" className="block text-sm font-medium text-gray-700 mb-1">
            Cadet House Name *
          </label>
          <input
            type="text"
            id="houseName"
            name="houseName"
            value={formData.houseName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.houseName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter house name"
          />
          {errors.houseName && (
            <p className="mt-1 text-sm text-red-600">{errors.houseName}</p>
          )}
        </div>

        {/* Founding Year */}
        <div>
          <label htmlFor="foundingYear" className="block text-sm font-medium text-gray-700 mb-1">
            Founding Year *
          </label>
          <input
            type="text"
            id="foundingYear"
            name="foundingYear"
            value={formData.foundingYear}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.foundingYear ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., 1245"
          />
          {errors.foundingYear && (
            <p className="mt-1 text-sm text-red-600">{errors.foundingYear}</p>
          )}
        </div>

        {/* House Motto (Optional) */}
        <div>
          <label htmlFor="motto" className="block text-sm font-medium text-gray-700 mb-1">
            House Motto (Optional)
          </label>
          <input
            type="text"
            id="motto"
            name="motto"
            value={formData.motto}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Honor Above All"
          />
        </div>

        {/* Preview */}
        {formData.houseName && (
          <div className="bg-gray-50 border border-gray-200 rounded p-3">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Preview</p>
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded"
                style={{ backgroundColor: adjustColorBrightness(parentHouse.colorCode, 40) }}
              />
              <div>
                <p className="text-sm font-bold text-gray-900">House {formData.houseName}</p>
                <p className="text-xs text-gray-600">Cadet branch of {parentHouse.houseName}</p>
                {formData.foundingYear && (
                  <p className="text-xs text-gray-500">Founded {formData.foundingYear}</p>
                )}
              </div>
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
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Found Cadet House
          </button>
        </div>
      </form>
    </div>
  );
}

export default CadetHouseCeremonyModal;
