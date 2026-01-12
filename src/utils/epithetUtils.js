/**
 * Epithet Utilities for Lineageweaver
 * 
 * Handles formatting, validation, and cross-system integration hooks
 * for the epithets feature (descriptive bynames like "the Bold", "Dragonslayer").
 * 
 * EPITHET OBJECT STRUCTURE:
 * {
 *   id: "unique-id",           // Auto-generated UUID
 *   text: "the Bold",          // The epithet itself
 *   isPrimary: true,           // Show by default in tree/displays
 *   source: "popular",         // "popular" | "granted" | "self-styled" | "inherited"
 *   grantedById: null,         // Person ID who bestowed it (for "granted")
 *   earnedFrom: "deed",        // "event" | "dignity" | "deed" | "birth" | "death" | "other"
 *   linkedEntityType: null,    // "event" | "dignity" | "codexEntry" | null
 *   linkedEntityId: null,      // Reference to linked entity
 *   dateEarned: "1267",        // When epithet was earned/given
 *   notes: "After the battle"  // Free-form notes
 * }
 */

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Epithet source types with display info
 */
export const EPITHET_SOURCES = {
  popular: {
    id: 'popular',
    label: 'Popular',
    description: 'Earned by reputation among the people',
    icon: '👥'
  },
  granted: {
    id: 'granted',
    label: 'Granted',
    description: 'Formally bestowed by a person of authority',
    icon: '👑'
  },
  'self-styled': {
    id: 'self-styled',
    label: 'Self-Styled',
    description: 'Adopted by the person themselves',
    icon: '🪞'
  },
  inherited: {
    id: 'inherited',
    label: 'Inherited',
    description: 'Passed down through lineage',
    icon: '🧬'
  }
};

/**
 * How the epithet was earned
 */
export const EPITHET_EARNED_FROM = {
  deed: {
    id: 'deed',
    label: 'Deed',
    description: 'A notable action or accomplishment',
    icon: '⚔️'
  },
  event: {
    id: 'event',
    label: 'Event',
    description: 'Participation in a significant event',
    icon: '📅'
  },
  dignity: {
    id: 'dignity',
    label: 'Title',
    description: 'Associated with holding a dignity/title',
    icon: '🏰'
  },
  birth: {
    id: 'birth',
    label: 'Birth',
    description: 'Given at or related to birth circumstances',
    icon: '👶'
  },
  death: {
    id: 'death',
    label: 'Posthumous',
    description: 'Bestowed after death',
    icon: '⚰️'
  },
  other: {
    id: 'other',
    label: 'Other',
    description: 'Other origin',
    icon: '📜'
  }
};

/**
 * Common epithet prefixes for formatting
 */
const EPITHET_PREFIXES = ['the', 'of', 'de', 'von', 'van'];

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Generate a unique ID for a new epithet
 */
export function generateEpithetId() {
  return `ept_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create a new epithet object with defaults
 * @param {string} text - The epithet text
 * @param {object} options - Additional options
 * @returns {object} New epithet object
 */
export function createEpithet(text, options = {}) {
  return {
    id: generateEpithetId(),
    text: text.trim(),
    isPrimary: options.isPrimary ?? false,
    source: options.source || 'popular',
    grantedById: options.grantedById || null,
    earnedFrom: options.earnedFrom || 'deed',
    linkedEntityType: options.linkedEntityType || null,
    linkedEntityId: options.linkedEntityId || null,
    dateEarned: options.dateEarned || null,
    notes: options.notes || null,
    created: new Date().toISOString()
  };
}

/**
 * Get the primary epithet from a list
 * @param {array} epithets - Array of epithet objects
 * @returns {object|null} The primary epithet or first one
 */
export function getPrimaryEpithet(epithets) {
  if (!epithets || epithets.length === 0) return null;
  
  // Find explicitly marked primary
  const primary = epithets.find(e => e.isPrimary);
  if (primary) return primary;
  
  // Fall back to first epithet
  return epithets[0];
}

/**
 * Format a person's full name with their primary epithet
 * @param {object} person - Person object with firstName, lastName, epithets
 * @param {object} options - Formatting options
 * @returns {string} Formatted name with epithet
 */
export function formatNameWithEpithet(person, options = {}) {
  if (!person) return '';
  
  const {
    includeEpithet = true,
    epithetStyle = 'suffix',  // 'suffix' | 'prefix' | 'parenthetical'
    useShortName = false
  } = options;
  
  const baseName = useShortName 
    ? person.firstName 
    : `${person.firstName} ${person.lastName}`;
  
  if (!includeEpithet || !person.epithets || person.epithets.length === 0) {
    return baseName;
  }
  
  const primary = getPrimaryEpithet(person.epithets);
  if (!primary) return baseName;
  
  const epithetText = primary.text;
  
  switch (epithetStyle) {
    case 'prefix':
      // "the Bold Aldric Wilfrey" (rare but used for some styles)
      if (epithetText.toLowerCase().startsWith('the ')) {
        return `${epithetText} ${baseName}`;
      }
      return `${epithetText} ${baseName}`;
      
    case 'parenthetical':
      // "Aldric Wilfrey (the Bold)"
      return `${baseName} (${epithetText})`;
      
    case 'suffix':
    default:
      // "Aldric Wilfrey the Bold" or "Aldric the Bold Wilfrey"
      // Standard medieval style: epithet after first name or full name
      return `${baseName} ${epithetText}`;
  }
}

/**
 * Format epithet text for display (ensures proper capitalization)
 * @param {string} text - Raw epithet text
 * @returns {string} Formatted epithet text
 */
export function formatEpithetText(text) {
  if (!text) return '';
  
  const trimmed = text.trim();
  
  // If it starts with a lowercase prefix, keep it lowercase
  const words = trimmed.split(' ');
  if (words.length > 0) {
    const firstWord = words[0].toLowerCase();
    if (EPITHET_PREFIXES.includes(firstWord)) {
      // "the bold" -> "the Bold"
      return words.map((word, i) => {
        if (i === 0) return word.toLowerCase();
        return word.charAt(0).toUpperCase() + word.slice(1);
      }).join(' ');
    }
  }
  
  // Otherwise capitalize first letter
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/**
 * Validate an epithet object
 * @param {object} epithet - Epithet to validate
 * @returns {object} { isValid, errors }
 */
export function validateEpithet(epithet) {
  const errors = [];
  
  if (!epithet.text || epithet.text.trim().length === 0) {
    errors.push('Epithet text is required');
  }
  
  if (epithet.text && epithet.text.length > 100) {
    errors.push('Epithet text must be under 100 characters');
  }
  
  if (epithet.source && !EPITHET_SOURCES[epithet.source]) {
    errors.push('Invalid epithet source');
  }
  
  if (epithet.earnedFrom && !EPITHET_EARNED_FROM[epithet.earnedFrom]) {
    errors.push('Invalid earned from type');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// ============================================================================
// EPITHET MANAGEMENT
// ============================================================================

/**
 * Add an epithet to a person's epithets array
 * @param {array} epithets - Existing epithets array
 * @param {object} newEpithet - New epithet to add
 * @param {boolean} setAsPrimary - Whether to set as primary
 * @returns {array} Updated epithets array
 */
export function addEpithet(epithets, newEpithet, setAsPrimary = false) {
  const updated = [...(epithets || [])];
  
  // If setting as primary, unset existing primary
  if (setAsPrimary) {
    updated.forEach(e => e.isPrimary = false);
    newEpithet.isPrimary = true;
  }
  
  // If no primary exists and this is first, make it primary
  if (updated.length === 0) {
    newEpithet.isPrimary = true;
  }
  
  updated.push(newEpithet);
  return updated;
}

/**
 * Remove an epithet by ID
 * @param {array} epithets - Existing epithets array
 * @param {string} epithetId - ID of epithet to remove
 * @returns {array} Updated epithets array
 */
export function removeEpithet(epithets, epithetId) {
  const updated = (epithets || []).filter(e => e.id !== epithetId);
  
  // If we removed the primary, promote the first one
  if (updated.length > 0 && !updated.some(e => e.isPrimary)) {
    updated[0].isPrimary = true;
  }
  
  return updated;
}

/**
 * Update an existing epithet
 * @param {array} epithets - Existing epithets array
 * @param {string} epithetId - ID of epithet to update
 * @param {object} updates - Fields to update
 * @returns {array} Updated epithets array
 */
export function updateEpithet(epithets, epithetId, updates) {
  return (epithets || []).map(e => {
    if (e.id === epithetId) {
      return { ...e, ...updates };
    }
    return e;
  });
}

/**
 * Set a specific epithet as the primary
 * @param {array} epithets - Existing epithets array
 * @param {string} epithetId - ID of epithet to make primary
 * @returns {array} Updated epithets array
 */
export function setPrimaryEpithet(epithets, epithetId) {
  return (epithets || []).map(e => ({
    ...e,
    isPrimary: e.id === epithetId
  }));
}

/**
 * Reorder epithets (for display priority beyond primary)
 * @param {array} epithets - Existing epithets array
 * @param {number} fromIndex - Index to move from
 * @param {number} toIndex - Index to move to
 * @returns {array} Reordered epithets array
 */
export function reorderEpithets(epithets, fromIndex, toIndex) {
  const updated = [...(epithets || [])];
  const [removed] = updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, removed);
  return updated;
}

// ============================================================================
// 🪝 CROSS-SYSTEM INTEGRATION HOOKS
// Future expansion points for auto-suggestions and entity linking
// ============================================================================

/**
 * 🪝 HOOK: Generate epithet suggestions based on a dignity
 * Called when a dignity is granted to suggest related epithets
 * 
 * @param {object} dignity - The dignity being granted
 * @param {object} person - The person receiving the dignity
 * @returns {array} Array of suggested epithet objects
 */
export function suggestEpithetsFromDignity(dignity, person) {
  const suggestions = [];
  
  // 🪝 FUTURE: Extract location from dignity for "of X" epithets
  // Example: "Lord of Thornhaven" -> suggest "of Thornhaven"
  if (dignity.name) {
    const ofMatch = dignity.name.match(/(?:of|de|von|van)\s+(.+)/i);
    if (ofMatch) {
      suggestions.push({
        text: `of ${ofMatch[1]}`,
        source: 'granted',
        earnedFrom: 'dignity',
        linkedEntityType: 'dignity',
        linkedEntityId: dignity.id,
        reason: `Associated with the dignity: ${dignity.name}`
      });
    }
  }
  
  // 🪝 FUTURE: Check dignity class for common epithets
  // Example: Crown dignities might suggest "the Great" for long reigns
  
  return suggestions;
}

/**
 * 🪝 HOOK: Generate epithet suggestions based on a Codex event
 * Called when linking a person to a significant event
 * 
 * @param {object} event - The Codex event entry
 * @param {object} person - The person involved
 * @param {string} role - Person's role in the event ("victor", "survivor", etc.)
 * @returns {array} Array of suggested epithet objects
 */
export function suggestEpithetsFromEvent(event, person, role) {
  const suggestions = [];
  
  // 🪝 FUTURE: Parse event title for battle names
  // Example: "Battle of Blackwater" + role "victor" -> "Victor of Blackwater"
  
  // 🪝 FUTURE: Check event type for common patterns
  // Example: "siege" events might suggest "Breaker of [location]"
  
  return suggestions;
}

/**
 * 🪝 HOOK: Generate epithet suggestions based on life events
 * Called to analyze a person's data for common epithet patterns
 * 
 * @param {object} person - The person to analyze
 * @param {object} context - Additional context (relationships, dignities, etc.)
 * @returns {array} Array of suggested epithet objects
 */
export function suggestEpithetsFromLifeEvents(person, context = {}) {
  const suggestions = [];
  
  // 🪝 FUTURE: Check for legitimization
  // If bastardStatus changed from 'active' to 'legitimized', 
  // could remove "the Bastard" epithet or suggest alternatives
  
  // 🪝 FUTURE: Check for long life spans
  // Very old characters might get "the Old" or "the Elder"
  
  // 🪝 FUTURE: Check for multiple dignities held
  // Accumulating many titles might suggest "the Great"
  
  // 🪝 FUTURE: Check birth order for dynastic epithets
  // First-born might get "the Heir", younger sons "the Younger"
  
  return suggestions;
}

/**
 * 🪝 HOOK: Handle epithet changes when linked entities change
 * Called to check if epithets should be updated
 * 
 * @param {object} person - The person whose links changed
 * @param {string} entityType - Type of entity that changed
 * @param {string} entityId - ID of entity that changed
 * @param {string} changeType - "linked" | "unlinked" | "updated"
 * @returns {object} { epithetsToRemove, epithetsToAdd, warnings }
 */
export function handleLinkedEntityChange(person, entityType, entityId, changeType) {
  // 🪝 FUTURE: Check if any epithets were linked to this entity
  // If entity is deleted, prompt to remove or keep epithet
  
  return {
    epithetsToRemove: [],
    epithetsToAdd: [],
    warnings: []
  };
}

// ============================================================================
// DISPLAY HELPERS
// ============================================================================

/**
 * Get display info for an epithet source
 * @param {string} source - Source type key
 * @returns {object} Source display info
 */
export function getSourceInfo(source) {
  return EPITHET_SOURCES[source] || EPITHET_SOURCES.popular;
}

/**
 * Get display info for earnedFrom type
 * @param {string} earnedFrom - Earned from type key
 * @returns {object} EarnedFrom display info
 */
export function getEarnedFromInfo(earnedFrom) {
  return EPITHET_EARNED_FROM[earnedFrom] || EPITHET_EARNED_FROM.other;
}

/**
 * Format epithets for list display
 * @param {array} epithets - Array of epithet objects
 * @returns {string} Comma-separated epithet list
 */
export function formatEpithetList(epithets) {
  if (!epithets || epithets.length === 0) return '';
  return epithets.map(e => e.text).join(', ');
}

/**
 * Get a short summary of epithets count
 * @param {array} epithets - Array of epithet objects
 * @returns {string} Summary text
 */
export function getEpithetsSummary(epithets) {
  if (!epithets || epithets.length === 0) return 'No epithets';
  if (epithets.length === 1) return '1 epithet';
  return `${epithets.length} epithets`;
}

export default {
  // Constants
  EPITHET_SOURCES,
  EPITHET_EARNED_FROM,
  
  // Core functions
  generateEpithetId,
  createEpithet,
  getPrimaryEpithet,
  formatNameWithEpithet,
  formatEpithetText,
  validateEpithet,
  
  // Management
  addEpithet,
  removeEpithet,
  updateEpithet,
  setPrimaryEpithet,
  reorderEpithets,
  
  // Hooks (for future expansion)
  suggestEpithetsFromDignity,
  suggestEpithetsFromEvent,
  suggestEpithetsFromLifeEvents,
  handleLinkedEntityChange,
  
  // Display helpers
  getSourceInfo,
  getEarnedFromInfo,
  formatEpithetList,
  getEpithetsSummary
};
