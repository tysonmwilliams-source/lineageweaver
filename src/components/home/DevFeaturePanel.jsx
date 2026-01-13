/**
 * DevFeaturePanel.jsx - Development Feature Toggle Panel
 * 
 * PURPOSE:
 * A floating panel that allows toggling various home page features on/off
 * during development and testing. Only visible in development mode by default,
 * but can be enabled in production via localStorage flag.
 * 
 * HOW IT WORKS:
 * - Stores feature flags in localStorage so they persist across refreshes
 * - Provides a context-like pattern via props to parent component
 * - Can be collapsed/expanded to stay out of the way
 * 
 * FEATURES CONTROLLABLE:
 * - Hero animations (title effects, flourishes)
 * - Statistics dashboard
 * - Particle background effects
 * - Recent activity feed
 * - Quick actions bar
 * - Card hover animations
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './DevFeaturePanel.css';

// Default feature states
const DEFAULT_FEATURES = {
  heroAnimations: true,
  statsGlance: true,
  particleBackground: false,  // Off by default - heavier
  recentActivity: true,
  quickActions: true,
  cardAnimations: true,
  countUpAnimation: true,
  staggeredEntrance: true,
  decorativeFlourishes: true,
};

// Storage key for localStorage
const STORAGE_KEY = 'lineageweaver_dev_features';

/**
 * Load features from localStorage or return defaults
 */
function loadFeatures() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_FEATURES, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.warn('Failed to load dev features from localStorage:', e);
  }
  return DEFAULT_FEATURES;
}

/**
 * Save features to localStorage
 */
function saveFeatures(features) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(features));
  } catch (e) {
    console.warn('Failed to save dev features to localStorage:', e);
  }
}

/**
 * DevFeaturePanel Component
 * 
 * @param {Object} props
 * @param {Object} props.features - Current feature states
 * @param {Function} props.setFeatures - Function to update features
 * @param {boolean} props.forceShow - Force panel to show even in production
 */
export default function DevFeaturePanel({ features, setFeatures, forceShow = false }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Determine if panel should be visible
  // Show in dev mode, or if forceShow is true, or if localStorage flag is set
  useEffect(() => {
    const isDev = import.meta.env.DEV;
    const forceEnabled = localStorage.getItem('lineageweaver_show_dev_panel') === 'true';
    setIsVisible(isDev || forceShow || forceEnabled);
  }, [forceShow]);
  
  // Don't render if not visible
  if (!isVisible) return null;
  
  /**
   * Toggle a single feature
   */
  const toggleFeature = (featureName) => {
    const newFeatures = {
      ...features,
      [featureName]: !features[featureName]
    };
    setFeatures(newFeatures);
    saveFeatures(newFeatures);
  };
  
  /**
   * Reset all features to defaults
   */
  const resetToDefaults = () => {
    setFeatures(DEFAULT_FEATURES);
    saveFeatures(DEFAULT_FEATURES);
  };
  
  /**
   * Enable all features
   */
  const enableAll = () => {
    const allEnabled = Object.keys(features).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setFeatures(allEnabled);
    saveFeatures(allEnabled);
  };
  
  /**
   * Disable all features
   */
  const disableAll = () => {
    const allDisabled = Object.keys(features).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});
    setFeatures(allDisabled);
    saveFeatures(allDisabled);
  };
  
  // Feature display configuration
  const featureConfig = [
    { key: 'heroAnimations', label: 'Hero Animations', icon: '✨' },
    { key: 'decorativeFlourishes', label: 'Decorative Flourishes', icon: '🎨' },
    { key: 'statsGlance', label: 'Stats Dashboard', icon: '📊' },
    { key: 'countUpAnimation', label: 'Count-Up Numbers', icon: '🔢' },
    { key: 'quickActions', label: 'Quick Actions', icon: '⚡' },
    { key: 'recentActivity', label: 'Recent Activity', icon: '🕐' },
    { key: 'cardAnimations', label: 'Card Animations', icon: '🎴' },
    { key: 'staggeredEntrance', label: 'Staggered Entrance', icon: '📥' },
    { key: 'particleBackground', label: 'Particle Background', icon: '🌟' },
  ];
  
  return (
    <motion.div 
      className="dev-feature-panel"
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      {/* Toggle Button */}
      <button 
        className="dev-panel-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        title={isExpanded ? 'Collapse panel' : 'Expand feature toggles'}
      >
        <span className="toggle-icon">{isExpanded ? '▶' : '◀'}</span>
        <span className="toggle-label">🔧 Dev</span>
      </button>
      
      {/* Expanded Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            className="dev-panel-content"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="dev-panel-header">
              <h3>Feature Toggles</h3>
              <div className="dev-panel-actions">
                <button onClick={enableAll} title="Enable all">✅</button>
                <button onClick={disableAll} title="Disable all">❌</button>
                <button onClick={resetToDefaults} title="Reset to defaults">↺</button>
              </div>
            </div>
            
            <div className="dev-panel-features">
              {featureConfig.map(({ key, label, icon }) => (
                <label key={key} className="feature-toggle">
                  <input
                    type="checkbox"
                    checked={features[key]}
                    onChange={() => toggleFeature(key)}
                  />
                  <span className="feature-icon">{icon}</span>
                  <span className="feature-label">{label}</span>
                </label>
              ))}
            </div>
            
            <div className="dev-panel-footer">
              <small>Changes persist in localStorage</small>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Export utilities for parent component
export { DEFAULT_FEATURES, loadFeatures, saveFeatures };
