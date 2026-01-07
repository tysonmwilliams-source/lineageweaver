/**
 * Modal Component
 * 
 * A reusable modal dialog that can display any content.
 * Useful for forms, confirmations, etc.
 * 
 * Props:
 * - isOpen: Boolean - whether the modal is visible
 * - onClose: Function - called when modal should close
 * - title: String - modal title
 * - children: React components - the content to display in the modal
 */
function Modal({ isOpen, onClose, title, children }) {
  
  // Don't render anything if modal is closed
  if (!isOpen) return null;

  /**
   * Handle clicking on the backdrop (dark overlay)
   * This closes the modal
   */
  const handleBackdropClick = (e) => {
    // Only close if clicking the backdrop itself, not the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    // Backdrop - dark overlay covering the screen
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      {/* Modal content */}
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="Close"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Modal body */}
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
