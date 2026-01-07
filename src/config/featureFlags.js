/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FEATURE FLAGS - EXTENSION CONTROL SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This file controls which features are active in Lineageweaver.
 * Feature flags allow gradual rollout of new functionality and easy toggling
 * of experimental features without code changes.
 * 
 * USAGE:
 * import { isFeatureEnabled, FEATURE_FLAGS } from './config/featureFlags';
 * 
 * if (isFeatureEnabled('MODULE_1E.SPECIES_FIELD')) {
 *   return <SpeciesBadge species={person.species} />;
 * }
 * 
 * GUIDELINES:
 * - Set flag to `true` only when feature is fully implemented and tested
 * - Use EXPERIMENTAL section for features in development
 * - Document the feature's status and completion date
 * - Never remove flags; mark as deprecated instead
 * 
 * VERSION: 2.0.0 (Current)
 * NEXT VERSION: 3.0.0 (Module 1E Features)
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// FEATURE FLAGS CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

export const FEATURE_FLAGS = {
  
  // ═══════════════════════════════════════════════════════════════════════
  // CORE FEATURES - Always Active (v1.0.0+)
  // ═══════════════════════════════════════════════════════════════════════
  // These features are fundamental to Lineageweaver and cannot be disabled.
  // ═══════════════════════════════════════════════════════════════════════
  FAMILY_TREE: true,          // D3.js family tree visualization
  DATA_MANAGEMENT: true,      // Person/House/Relationship CRUD operations
  THEME_SYSTEM: true,         // Royal Parchment / Light Manuscript themes
  ZOOM_CONTROLS: true,        // Pan, zoom, reset controls (up to 300x)
  MINIMAP: true,              // Viewport indicator minimap

  // ═══════════════════════════════════════════════════════════════════════
  // CODEX FEATURES - Active (v2.0.0+)
  // ═══════════════════════════════════════════════════════════════════════
  // The wiki-style encyclopedia system for worldbuilding content.
  // ═══════════════════════════════════════════════════════════════════════
  CODEX_SYSTEM: true,              // Base Codex functionality
  CODEX_WIKI_LINKS: true,          // [[wiki-style]] link parsing
  CODEX_BACKLINKS: true,           // Automatic backlink tracking
  CODEX_BROWSE_PAGES: true,        // Advanced browse with filtering
  CODEX_ENTRY_CREATION: true,      // Form-based entry creation
  CODEX_CATEGORIES: true,          // Personages, Houses, Locations, Events, Lore

  // ═══════════════════════════════════════════════════════════════════════
  // 🪝 HOOK: MODULE_1E_FEATURES
  // ═══════════════════════════════════════════════════════════════════════
  // Toggle these to `true` as Module 1E features are completed.
  // Each feature should have:
  // - Implementation status (Planning / In Progress / Testing / Complete)
  // - Completion date (when set to true)
  // - Dependencies (other features required)
  // ═══════════════════════════════════════════════════════════════════════
  MODULE_1E: {
    
    // ┌───────────────────────────────────────────────────────────────────
    // │ ✅ Import from JSON
    // │ Status: COMPLETE
    // │ Priority: HIGH (Tier 1)
    // │ Complexity: Medium
    // │ Location: Manage Data → Import/Export tab
    // │ Dependencies: None
    // └───────────────────────────────────────────────────────────────────
    IMPORT_JSON: true,
    // COMPLETION_DATE: 2026-01-07

    // ┌───────────────────────────────────────────────────────────────────
    // │ 🚀 Species Field
    // │ Status: Planning
    // │ Priority: MEDIUM-HIGH (Tier 2)
    // │ Complexity: Low
    // │ Estimated: 0.5 sessions
    // │ Dependencies: None
    // └───────────────────────────────────────────────────────────────────
    SPECIES_FIELD: true,
    // COMPLETION_DATE: 2026-01-06 (Re-enabled existing implementation)

    // ┌───────────────────────────────────────────────────────────────────
    // │ 🚀 Titles System
    // │ Status: Planning
    // │ Priority: MEDIUM-HIGH (Tier 2)
    // │ Complexity: Medium
    // │ Estimated: 1-1.5 sessions
    // │ Dependencies: None
    // └───────────────────────────────────────────────────────────────────
    TITLES_SYSTEM: true,
    // COMPLETION_DATE: 2026-01-06 (Re-enabled existing implementation)

    // ┌───────────────────────────────────────────────────────────────────
    // │ 🚀 Magical Bloodlines
    // │ Status: Planning
    // │ Priority: MEDIUM (Tier 2)
    // │ Complexity: Medium-High
    // │ Estimated: 1.5 sessions
    // │ Dependencies: SPECIES_FIELD (recommended)
    // └───────────────────────────────────────────────────────────────────
    MAGICAL_BLOODLINES: true,
    // COMPLETION_DATE: 2026-01-06 (Re-enabled existing implementation)

    // ┌───────────────────────────────────────────────────────────────────
    // │ 🅿️ Timeline View
    // │ Status: PARKED (indefinitely)
    // │ Priority: LOW (Tier 3)
    // │ Complexity: High
    // │ Reason: Not essential for core worldbuilding workflow
    // │ May revisit in future if demand arises
    // └───────────────────────────────────────────────────────────────────
    TIMELINE_VIEW: false,
    // PARKED_DATE: 2026-01-07

    // ┌───────────────────────────────────────────────────────────────────
    // │ ✅ Horizontal Layout
    // │ Status: COMPLETE
    // │ Priority: LOW-MEDIUM (Tier 3)
    // │ Complexity: Medium
    // │ Features: Toggle buttons, keyboard shortcut (H), localStorage persistence
    // │ Location: Family Tree page, bottom-left controls
    // │ Dependencies: None
    // └───────────────────────────────────────────────────────────────────
    HORIZONTAL_LAYOUT: true,
    // COMPLETION_DATE: 2026-01-07

  },

  // ═══════════════════════════════════════════════════════════════════════
  // 🪝 HOOK: TREE_CODEX_INTEGRATION
  // ═══════════════════════════════════════════════════════════════════════
  // Features related to the ongoing Tree-Codex integration project.
  // These flags control the phased rollout of unified profiles.
  // ═══════════════════════════════════════════════════════════════════════
  TREE_CODEX_INTEGRATION: {
    
    // Phase 1: Foundational Connections
    AUTO_CODEX_ENTRIES: false,          // Auto-create skeleton Codex entries for people
    BIDIRECTIONAL_NAV: false,           // Navigate between Tree and Codex views
    CODEX_LINK_IN_TREE: false,          // "View in Codex" button on person cards

    // Phase 2: Data Unification
    UNIFIED_PROFILES: false,            // Single source of truth for person data
    CODEX_EDIT_REFLECTS_TREE: false,    // Edits in Codex update tree data
    TREE_EDIT_REFLECTS_CODEX: false,    // Edits in tree update Codex entries

    // Phase 3: Advanced Features
    BIOGRAPHY_PREVIEW_HOVER: false,     // Hover over person card shows bio preview
    AUTO_WIKI_LINK_DETECTION: false,    // Detect mentions of people in Codex content
    KNOWLEDGE_GRAPH_VIEW: false,        // Visual graph of Codex entry connections
    TIMELINE_CODEX_INTEGRATION: false,  // Click timeline events to see Codex entries

  },

  // ═══════════════════════════════════════════════════════════════════════
  // 🪝 HOOK: EXPERIMENTAL_FEATURES
  // ═══════════════════════════════════════════════════════════════════════
  // Features under active development or exploration.
  // These are NOT production-ready and may be incomplete or unstable.
  // Enable only for testing and development purposes.
  // ═══════════════════════════════════════════════════════════════════════
  EXPERIMENTAL: {
    
    // UI/UX Enhancements
    CODEX_PREVIEW_HOVER: false,         // 🧪 Rich hover cards for Codex entries
    RELATIONSHIP_GRAPH: false,          // 🧪 Network visualization of all connections
    ADVANCED_SEARCH: false,             // 🧪 Multi-field search with filters
    BULK_OPERATIONS: false,             // 🧪 Batch edit multiple people/relationships

    // Data Features
    AI_BIOGRAPHY_ASSISTANT: false,      // 🧪 AI suggestions for Codex biographies
    AUTO_RELATIONSHIP_DETECTION: false, // 🧪 Suggest relationships based on names
    DUPLICATE_DETECTION: false,         // 🧪 Warn about potential duplicate people

    // Visualization Enhancements
    RELATIONSHIP_STRENGTH: false,       // 🧪 Visual indicator of relationship closeness
    HOUSE_ALLIANCES_VIEW: false,        // 🧪 Map of inter-house connections
    ANIMATED_TRANSITIONS: false,        // 🧪 Smooth animations for tree changes

    // Export/Import
    GEDCOM_EXPORT: false,               // 🧪 Export to standard genealogy format
    MARKDOWN_EXPORT: false,             // 🧪 Export Codex entries as markdown
    COLLABORATIVE_SYNC: false,          // 🧪 Multi-user editing capabilities

  },

  // ═══════════════════════════════════════════════════════════════════════
  // DEPRECATED FEATURES
  // ═══════════════════════════════════════════════════════════════════════
  // Features that are being phased out or replaced.
  // Do not enable these; they exist only for backward compatibility.
  // ═══════════════════════════════════════════════════════════════════════
  DEPRECATED: {
    // LEGACY_DATA_MANAGEMENT: false,  // Replaced by new grouped UI in v2.1
    // OLD_THEME_SYSTEM: false,         // Replaced by CSS custom properties v1.5
  },

};

// ═══════════════════════════════════════════════════════════════════════════
// FEATURE FLAG UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if a feature is enabled
 * 
 * @param {string} featurePath - Dot-notation path to feature (e.g., 'MODULE_1E.SPECIES_FIELD')
 * @returns {boolean} - True if enabled, false otherwise
 * 
 * @example
 * if (isFeatureEnabled('MODULE_1E.SPECIES_FIELD')) {
 *   return <SpeciesBadge species={person.species} />;
 * }
 */
export const isFeatureEnabled = (featurePath) => {
  const keys = featurePath.split('.');
  let value = FEATURE_FLAGS;
  
  for (const key of keys) {
    value = value[key];
    if (value === undefined) {
      console.warn(`[FeatureFlags] Unknown feature path: ${featurePath}`);
      return false;
    }
  }
  
  return value === true;
};

/**
 * Get all enabled features in a category
 * 
 * @param {string} category - Category name (e.g., 'MODULE_1E')
 * @returns {string[]} - Array of enabled feature names
 * 
 * @example
 * const enabledModule1E = getEnabledFeatures('MODULE_1E');
 * // Returns: ['SPECIES_FIELD', 'TITLES_SYSTEM']
 */
export const getEnabledFeatures = (category) => {
  const categoryObj = FEATURE_FLAGS[category];
  if (!categoryObj || typeof categoryObj !== 'object') {
    return [];
  }
  
  return Object.entries(categoryObj)
    .filter(([_, value]) => value === true)
    .map(([key, _]) => key);
};

/**
 * Check if ALL features in a list are enabled
 * 
 * @param {string[]} features - Array of feature paths
 * @returns {boolean} - True if all are enabled
 * 
 * @example
 * if (requireFeatures(['MODULE_1E.SPECIES_FIELD', 'MODULE_1E.TITLES_SYSTEM'])) {
 *   return <SpeciesWithTitleDisplay person={person} />;
 * }
 */
export const requireFeatures = (features) => {
  return features.every(feature => isFeatureEnabled(feature));
};

/**
 * Check if ANY feature in a list is enabled
 * 
 * @param {string[]} features - Array of feature paths
 * @returns {boolean} - True if at least one is enabled
 * 
 * @example
 * if (hasAnyFeature(['MODULE_1E.SPECIES_FIELD', 'MODULE_1E.MAGICAL_BLOODLINES'])) {
 *   return <FantasyInfoSection person={person} />;
 * }
 */
export const hasAnyFeature = (features) => {
  return features.some(feature => isFeatureEnabled(feature));
};

/**
 * Get feature status for debugging/admin panel
 * 
 * @returns {object} - Complete feature flag state with metadata
 */
export const getFeatureStatus = () => {
  const status = {
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    categories: {},
  };

  Object.entries(FEATURE_FLAGS).forEach(([category, features]) => {
    if (typeof features === 'object' && !Array.isArray(features)) {
      const enabled = Object.entries(features).filter(([_, v]) => v === true).length;
      const total = Object.keys(features).length;
      status.categories[category] = {
        enabled,
        total,
        percentage: total > 0 ? Math.round((enabled / total) * 100) : 0,
        features,
      };
    } else {
      status.categories[category] = features;
    }
  });

  return status;
};

/**
 * Toggle a feature flag (for development/testing only)
 * WARNING: This modifies the FEATURE_FLAGS object in memory only.
 * Changes will not persist across page reloads.
 * 
 * @param {string} featurePath - Path to feature
 * @param {boolean} enabled - New state
 */
export const toggleFeature = (featurePath, enabled) => {
  const keys = featurePath.split('.');
  let obj = FEATURE_FLAGS;
  
  for (let i = 0; i < keys.length - 1; i++) {
    obj = obj[keys[i]];
    if (!obj) {
      console.error(`[FeatureFlags] Cannot toggle: Invalid path ${featurePath}`);
      return;
    }
  }
  
  const finalKey = keys[keys.length - 1];
  obj[finalKey] = enabled;
  
  console.log(`[FeatureFlags] ${featurePath} = ${enabled}`);
};

// ═══════════════════════════════════════════════════════════════════════════
// DEVELOPMENT HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Log all feature flags to console (development only)
 */
export const debugFeatureFlags = () => {
  console.group('🚩 Feature Flags Status');
  console.table(getFeatureStatus());
  console.groupEnd();
};

// Make debugging function available globally in development
if (process.env.NODE_ENV === 'development') {
  window.debugFeatureFlags = debugFeatureFlags;
  console.log('💡 Tip: Run debugFeatureFlags() in console to see all feature flags');
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT DEFAULT
// ═══════════════════════════════════════════════════════════════════════════

export default FEATURE_FLAGS;
