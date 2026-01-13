/**
 * UserMenu.jsx - User Account Menu Component
 *
 * PURPOSE:
 * Displays the current user's info and provides sign-out functionality.
 * Designed to sit in the navigation bar/header.
 *
 * Uses Framer Motion for animations, Lucide icons, and BEM CSS.
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../icons';
import './UserMenu.css';

// ==================== ANIMATION VARIANTS ====================
const DROPDOWN_VARIANTS = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 400
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.15 }
  }
};

/**
 * Get initials from a display name
 */
function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      setIsSigningOut(false);
      setIsOpen(false);
    }
  };

  if (!user) return null;

  return (
    <div className="user-menu" ref={menuRef}>
      {/* Trigger Button */}
      <button
        className="user-menu__trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'User'}
            className="user-menu__avatar"
          />
        ) : (
          <span className="user-menu__avatar user-menu__avatar--initials">
            {getInitials(user.displayName)}
          </span>
        )}
        <span className="user-menu__name">{user.displayName || user.email}</span>
        <Icon
          name="chevron-down"
          size={14}
          className={`user-menu__arrow ${isOpen ? 'user-menu__arrow--open' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="user-menu__dropdown"
            variants={DROPDOWN_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="user-menu__header">
              <p className="user-menu__email">{user.email}</p>
            </div>
            <div className="user-menu__divider" />
            <button
              className="user-menu__item user-menu__item--signout"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              <Icon name="log-out" size={16} />
              <span>{isSigningOut ? 'Signing out...' : 'Sign out'}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
