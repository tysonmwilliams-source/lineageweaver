/**
 * SyncStatusIndicator.jsx - Cloud Sync Status Display
 *
 * PURPOSE:
 * Shows the current sync status as a small indicator in the navigation bar.
 * Helps users understand if their data is being saved to the cloud.
 *
 * Uses Framer Motion for animations, Lucide icons, and BEM CSS.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useGenealogy } from '../../contexts/GenealogyContext';
import Icon from '../icons';
import './SyncStatusIndicator.css';

// ==================== STATUS CONFIG ====================
const STATUS_CONFIG = {
  syncing: {
    icon: 'cloud',
    text: 'Syncing...',
    className: 'sync-status--syncing'
  },
  synced: {
    icon: 'check-circle',
    text: 'Synced',
    className: 'sync-status--synced'
  },
  error: {
    icon: 'alert-triangle',
    text: 'Sync error',
    className: 'sync-status--error'
  }
};

// ==================== ANIMATION VARIANTS ====================
const INDICATOR_VARIANTS = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 300
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.15 }
  }
};

export default function SyncStatusIndicator() {
  const { syncStatus } = useGenealogy();

  // Don't show anything if idle (initial state before first sync)
  if (syncStatus === 'idle') {
    return null;
  }

  const config = STATUS_CONFIG[syncStatus] || STATUS_CONFIG.synced;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={syncStatus}
        className={`sync-status ${config.className}`}
        title={config.text}
        variants={INDICATOR_VARIANTS}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Icon name={config.icon} size={14} className="sync-status__icon" />
        <span className="sync-status__text">{config.text}</span>
      </motion.div>
    </AnimatePresence>
  );
}
