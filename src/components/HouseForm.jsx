import { useState } from 'react';

/**
 * HouseForm Component
 * 
 * A form for adding or editing a house/family.
 * Used in a modal or on the ManageData page.
 * 
 * Props:
 * - house: Existing house data (for editing) or null (for new house)
 * - onSave: Function to call when form is submitted
 * - onCancel: Function to call when user cancels
 */
function HouseForm({ house = null, onSave, onCancel }) {
  // Form state - initialize with existing house data or empty values
  const [formData, setFormData] = useState({
    houseName: house?.houseName || '',
    sigil: house?.sigil || '',
    sigilImage: house?.sigilImage || null,
    motto: house?.motto || '',
    foundedDate: house?.foundedDate || '',
    colorCode: house?.colorCode || '#3b82f6', // Default blue
    notes: house?.notes || ''
  });

  // Track validation errors
  const [errors, setErrors] = useState({});

  /**
   * Handle input changes
   * Updates the form state when user types in any field
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Handle sigil image upload
   * Converts image to base64 for storage
   */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Check file size (max 1MB)
    if (file.size > 1024 * 1024) {
      alert('Image must be smaller than 1MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({
        ...prev,
        sigilImage: event.target.result
      }));
    };
    reader.readAsDataURL(file);
  };

  /**
   * Clear the sigil image
   */
  const handleClearImage = () => {
    setFormData(prev => ({
      ...prev,
      sigilImage: null
    }));
  };

  /**
   * Validate the form
   * Returns true if valid, false if there are errors
   */
  const validate = () => {
    const newErrors = {};

    // House name is required
    if (!formData.houseName.trim()) {
      newErrors.houseName = 'House name is required';
    }

    // If foundedDate is provided, validate it's a 4-digit year
    if (formData.foundedDate && !/^\d{4}$/.test(formData.foundedDate)) {
      newErrors.foundedDate = 'Founded date must be a 4-digit year (e.g., 1120)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    
    if (validate()) {
      // If editing, include the ID; if new, ID will be auto-generated
      const houseData = house?.id 
        ? { ...formData, id: house.id }
        : formData;
      
      onSave(houseData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* House Name - Required */}
      <div>
        <label htmlFor="houseName" className="block text-sm font-medium text-gray-700 mb-1">
          House Name *
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
          placeholder="e.g., House Stark"
        />
        {errors.houseName && (
          <p className="mt-1 text-sm text-red-600">{errors.houseName}</p>
        )}
      </div>

      {/* Sigil/Emblem */}
      <div>
        <label htmlFor="sigil" className="block text-sm font-medium text-gray-700 mb-1">
          Sigil/Emblem Description
        </label>
        <input
          type="text"
          id="sigil"
          name="sigil"
          value={formData.sigil}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., A grey direwolf on white field"
        />
      </div>

      {/* Sigil Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sigil Image
        </label>
        {formData.sigilImage ? (
          <div className="space-y-2">
            <div className="relative inline-block">
              <img 
                src={formData.sigilImage} 
                alt="House Sigil" 
                className="w-32 h-32 object-contain border-2 border-gray-300 rounded-lg bg-white p-2"
              />
            </div>
            <div>
              <button
                type="button"
                onClick={handleClearImage}
                className="px-3 py-1 text-sm text-red-600 bg-red-50 rounded hover:bg-red-100 transition"
              >
                Remove Image
              </button>
            </div>
          </div>
        ) : (
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="mt-1 text-xs text-gray-500">Upload an image (max 1MB). Will display in shield shape on family tree.</p>
          </div>
        )}
      </div>

      {/* Motto */}
      <div>
        <label htmlFor="motto" className="block text-sm font-medium text-gray-700 mb-1">
          House Motto
        </label>
        <input
          type="text"
          id="motto"
          name="motto"
          value={formData.motto}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., Winter is Coming"
        />
      </div>

      {/* Founded Date */}
      <div>
        <label htmlFor="foundedDate" className="block text-sm font-medium text-gray-700 mb-1">
          Founded Year
        </label>
        <input
          type="text"
          id="foundedDate"
          name="foundedDate"
          value={formData.foundedDate}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.foundedDate ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., 1120"
          maxLength="4"
        />
        {errors.foundedDate && (
          <p className="mt-1 text-sm text-red-600">{errors.foundedDate}</p>
        )}
      </div>

      {/* Color Code */}
      <div>
        <label htmlFor="colorCode" className="block text-sm font-medium text-gray-700 mb-1">
          House Color
        </label>
        <div className="flex items-center space-x-3">
          <input
            type="color"
            id="colorCode"
            name="colorCode"
            value={formData.colorCode}
            onChange={handleChange}
            className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
          />
          <span className="text-sm text-gray-600">
            Used to color-code this house in the family tree
          </span>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Additional information about this house..."
        />
      </div>

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
          {house ? 'Update House' : 'Create House'}
        </button>
      </div>
    </form>
  );
}

export default HouseForm;
