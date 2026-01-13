import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './icons/Icon';
import './Modal.css';

/**
 * Modal Component
 *
 * A reusable modal dialog with medieval manuscript styling.
 * Features Framer Motion animations and keyboard accessibility.
 *
 * Props:
 * - isOpen: Boolean - whether the modal is visible
 * - onClose: Function - called when modal should close
 * - title: String - modal title
 * - icon: String - optional Lucide icon name for title
 * - size: 'sm' | 'md' | 'lg' | 'xl' | 'full' - modal width
 * - children: React components - the content to display
 * - showCloseButton: Boolean - whether to show X button (default: true)
 * - closeOnBackdrop: Boolean - close when clicking backdrop (default: true)
 * - closeOnEscape: Boolean - close on Escape key (default: true)
 */

const BACKDROP_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const MODAL_VARIANTS = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2
    }
  }
};

function Modal({
  isOpen,
  onClose,
  title,
  icon,
  size = 'md',
  children,
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true
}) {
  // Handle Escape key
  const handleKeyDown = useCallback((e) => {
    if (closeOnEscape && e.key === 'Escape') {
      onClose();
    }
  }, [closeOnEscape, onClose]);

  // Add/remove event listener
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          variants={BACKDROP_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={handleBackdropClick}
        >
          <motion.div
            className={`modal modal--${size}`}
            variants={MODAL_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="modal__header">
                {title && (
                  <h2 id="modal-title" className="modal__title">
                    {icon && <Icon name={icon} size={20} className="modal__title-icon" />}
                    <span>{title}</span>
                  </h2>
                )}
                {showCloseButton && (
                  <button
                    className="modal__close"
                    onClick={onClose}
                    aria-label="Close modal"
                  >
                    <Icon name="x" size={20} />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="modal__body">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Modal;
