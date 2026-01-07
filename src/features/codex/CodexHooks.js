/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CODEX INTEGRATION HOOKS
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This file manages the connection points between the Family Tree system and
 * the Codex encyclopedia system. It defines how person data automatically
 * populates Codex infoboxes, which fields generate wiki-links, and what
 * template structures are used for auto-generated entries.
 * 
 * EXTENSION POINTS (marked with 🪝):
 * - AUTO_INFOBOX_FIELDS: Add new person fields to Codex infoboxes
 * - AUTO_WIKI_LINK_FIELDS: Define which fields create clickable wiki-links
 * - CODEX_ENTRY_TEMPLATE: Customize auto-generated entry sections
 * - FIELD_FORMATTERS: Add custom display logic for complex fields
 * 
 * WHEN TO UPDATE THIS FILE:
 * - Adding new person fields (species, titles, bloodlines)
 * - Creating new Codex categories
 * - Changing how data displays in Codex entries
 * - Implementing Tree-Codex integration phases
 * 
 * VERSION: 2.0.0 (Phase 1 Integration)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { isFeatureEnabled } from './featureFlags';

// ═══════════════════════════════════════════════════════════════════════════
// 🪝 HOOK: AUTO_INFOBOX_FIELDS
// ═══════════════════════════════════════════════════════════════════════════
// Fields that automatically populate Codex infoboxes.
// 
// STRUCTURE:
// - field: Database field name
// - label: Display label in infobox
// - format: How to display the value (see FIELD_FORMATTERS)
// - condition: Optional function to determine if field should show
// 
// TO ADD A NEW FIELD:
// 1. Add entry to SHOW_IF_PRESENT array
// 2. Define formatter in FIELD_FORMATTERS if needed
// 3. Update infobox rendering logic to use new field
// ═══════════════════════════════════════════════════════════════════════════

export const AUTO_INFOBOX_FIELDS = {
  
  // ───────────────────────────────────────────────────────────────────────
  // Core Fields - Always Display
  // ───────────────────────────────────────────────────────────────────────
  ALWAYS_SHOW: [
    { 
      field: 'firstName', 
      label: 'First Name', 
      format: 'text',
      order: 1,
    },
    { 
      field: 'lastName', 
      label: 'Last Name', 
      format: 'text',
      order: 2,
    },
    { 
      field: 'dateOfBirth', 
      label: 'Born', 
      format: 'date',
      order: 3,
    },
    { 
      field: 'dateOfDeath', 
      label: 'Died', 
      format: 'date',
      order: 4,
      condition: (person) => person.dateOfDeath !== null,
    },
    { 
      field: 'houseId', 
      label: 'House', 
      format: 'houseLink',
      order: 5,
    },
  ],

  // ───────────────────────────────────────────────────────────────────────
  // Extended Fields - Show When Present
  // ───────────────────────────────────────────────────────────────────────
  SHOW_IF_PRESENT: [
    { 
      field: 'maidenName', 
      label: 'Maiden Name', 
      format: 'text',
      order: 6,
      condition: (person) => person.maidenName !== null,
    },
    { 
      field: 'legitimacyStatus', 
      label: 'Legitimacy', 
      format: 'badge',
      order: 7,
      condition: (person) => person.legitimacyStatus && person.legitimacyStatus !== 'legitimate',
    },
    { 
      field: 'age', 
      label: 'Age at Death', 
      format: 'computed',
      order: 8,
      condition: (person) => person.dateOfDeath !== null,
    },

    // ┌─────────────────────────────────────────────────────────────────────
    // │ 🚀 FUTURE: Species Field (Module 1E)
    // │ Uncomment when FEATURE_FLAGS.MODULE_1E.SPECIES_FIELD is true
    // └─────────────────────────────────────────────────────────────────────
    // { 
    //   field: 'species', 
    //   label: 'Species', 
    //   format: 'text',
    //   order: 9,
    //   condition: (person) => {
    //     return isFeatureEnabled('MODULE_1E.SPECIES_FIELD') && 
    //            person.species && 
    //            person.species !== 'Human';
    //   },
    // },

    // ┌─────────────────────────────────────────────────────────────────────
    // │ 🚀 FUTURE: Current Title (Module 1E)
    // │ Uncomment when FEATURE_FLAGS.MODULE_1E.TITLES_SYSTEM is true
    // └─────────────────────────────────────────────────────────────────────
    // { 
    //   field: 'titles', 
    //   label: 'Current Title', 
    //   format: 'currentTitle',
    //   order: 10,
    //   condition: (person) => {
    //     return isFeatureEnabled('MODULE_1E.TITLES_SYSTEM') && 
    //            person.titles && 
    //            person.titles.length > 0;
    //   },
    // },

    // ┌─────────────────────────────────────────────────────────────────────
    // │ 🚀 FUTURE: Magical Bloodlines (Module 1E)
    // │ Uncomment when FEATURE_FLAGS.MODULE_1E.MAGICAL_BLOODLINES is true
    // └─────────────────────────────────────────────────────────────────────
    // { 
    //   field: 'magicalBloodlines', 
    //   label: 'Bloodlines', 
    //   format: 'bloodlineList',
    //   order: 11,
    //   condition: (person) => {
    //     return isFeatureEnabled('MODULE_1E.MAGICAL_BLOODLINES') && 
    //            person.magicalBloodlines && 
    //            person.magicalBloodlines.length > 0;
    //   },
    // },

  ],

};

// ═══════════════════════════════════════════════════════════════════════════
// 🪝 HOOK: AUTO_WIKI_LINK_FIELDS
// ═══════════════════════════════════════════════════════════════════════════
// Fields that should automatically generate wiki-style [[links]].
// 
// EXAMPLES:
// - houseId → [[House Wilfrey]]
// - spouseIds → [[Edmund Wilfrey]]
// - titles → [[King of Blackmere]]
// 
// TO ADD A NEW LINKABLE FIELD:
// 1. Add field name to appropriate array
// 2. Define link generation logic in generateWikiLink()
// 3. Ensure target entries exist in Codex
// ═══════════════════════════════════════════════════════════════════════════

export const AUTO_WIKI_LINK_FIELDS = {
  
  // Fields that link to other people
  PERSON_LINKS: [
    'spouseIds',      // Links to spouse entries
    'parentIds',      // Links to parent entries
    'childIds',       // Links to child entries
    // 🚀 FUTURE: 'mentorId', 'apprenticeIds', etc.
  ],

  // Fields that link to houses
  HOUSE_LINKS: [
    'houseId',        // Links to house entry
    'cadetBranchOf',  // Links to parent house
    // 🚀 FUTURE: 'vassalOf', 'alliedWith', etc.
  ],

  // ┌───────────────────────────────────────────────────────────────────────
  // │ 🚀 FUTURE: Title Links (Module 1E)
  // │ Uncomment when titles can have their own Codex entries
  // └───────────────────────────────────────────────────────────────────────
  // TITLE_LINKS: [
  //   'titles',  // Each title can link to its own entry explaining the role
  // ],

  // ┌───────────────────────────────────────────────────────────────────────
  // │ 🚀 FUTURE: Bloodline Links (Module 1E)
  // │ Uncomment when bloodlines have their own Codex entries
  // └───────────────────────────────────────────────────────────────────────
  // BLOODLINE_LINKS: [
  //   'magicalBloodlines',  // Link to bloodline lore entries
  // ],

};

// ═══════════════════════════════════════════════════════════════════════════
// 🪝 HOOK: CODEX_ENTRY_TEMPLATE
// ═══════════════════════════════════════════════════════════════════════════
// Template structures for auto-generated Codex entries.
// 
// WHEN ADDING NEW CATEGORIES:
// 1. Define section structure
// 2. Mark which sections are auto-generated
// 3. Provide placeholder text for manual sections
// 4. Specify default visibility/collapsed state
// ═══════════════════════════════════════════════════════════════════════════

export const CODEX_ENTRY_TEMPLATE = {
  
  // ───────────────────────────────────────────────────────────────────────
  // PERSONAGE Template
  // ───────────────────────────────────────────────────────────────────────
  PERSONAGE: {
    sections: [
      { 
        id: 'infobox', 
        title: 'Infobox', 
        auto: true,
        collapsible: false,
        description: 'Auto-generated biographical data',
      },
      { 
        id: 'overview', 
        title: 'Overview', 
        auto: false,
        placeholder: 'Write a brief introduction to this character...',
        minLength: 100,
        suggestions: [
          'Key personality traits',
          'Major life accomplishments',
          'Historical significance',
        ],
      },
      { 
        id: 'early-life', 
        title: 'Early Life', 
        auto: false,
        placeholder: 'Describe their childhood and upbringing...',
        collapsible: true,
        defaultCollapsed: false,
      },
      { 
        id: 'family', 
        title: 'Family', 
        auto: true,
        description: 'Auto-generated from relationship data',
        includes: [
          'Parents',
          'Spouses',
          'Children',
          'Siblings (if detectable)',
        ],
      },
      { 
        id: 'legacy', 
        title: 'Legacy', 
        auto: false,
        placeholder: 'Describe their impact on descendants and history...',
        collapsible: true,
        defaultCollapsed: false,
      },

      // ┌─────────────────────────────────────────────────────────────────
      // │ 🚀 FUTURE: Magical Abilities Section (Module 1E)
      // └─────────────────────────────────────────────────────────────────
      // { 
      //   id: 'magic', 
      //   title: 'Magical Abilities', 
      //   auto: false,
      //   placeholder: 'Describe inherited or acquired magical powers...',
      //   condition: (person) => isFeatureEnabled('MODULE_1E.MAGICAL_BLOODLINES'),
      //   collapsible: true,
      //   defaultCollapsed: false,
      // },

      // ┌─────────────────────────────────────────────────────────────────
      // │ 🚀 FUTURE: Titles & Honours Section (Module 1E)
      // └─────────────────────────────────────────────────────────────────
      // { 
      //   id: 'titles', 
      //   title: 'Titles and Honours', 
      //   auto: true,
      //   description: 'Auto-generated timeline of titles held',
      //   condition: (person) => isFeatureEnabled('MODULE_1E.TITLES_SYSTEM'),
      //   format: 'timeline',
      // },

    ],
  },
  
  // ───────────────────────────────────────────────────────────────────────
  // HOUSE Template
  // ───────────────────────────────────────────────────────────────────────
  HOUSE: {
    sections: [
      { 
        id: 'infobox', 
        title: 'Infobox', 
        auto: true,
        includes: [
          'House name',
          'Founder',
          'Founded date',
          'Sigil/Heraldry',
          'Motto',
          'Seat/Territory',
        ],
      },
      { 
        id: 'history', 
        title: 'History', 
        auto: false,
        placeholder: 'Describe the house origins and major events...',
      },
      { 
        id: 'members', 
        title: 'Members', 
        auto: true,
        description: 'Auto-generated list of all house members',
        grouping: 'by-generation',
      },
      { 
        id: 'heraldry', 
        title: 'Heraldry', 
        auto: true,
        description: 'SVG shield display with sigil description',
      },

      // ┌─────────────────────────────────────────────────────────────────
      // │ 🚀 FUTURE: House Bloodlines Section (Module 1E)
      // └─────────────────────────────────────────────────────────────────
      // { 
      //   id: 'bloodlines', 
      //   title: 'Bloodlines', 
      //   auto: true,
      //   description: 'Magical bloodlines present in this house',
      //   condition: () => isFeatureEnabled('MODULE_1E.MAGICAL_BLOODLINES'),
      //   includes: [
      //     'Primary bloodlines',
      //     'Inheritance patterns',
      //     'Notable carriers',
      //   ],
      // },

    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // LOCATION Template
  // ───────────────────────────────────────────────────────────────────────
  LOCATION: {
    sections: [
      { id: 'infobox', title: 'Infobox', auto: true },
      { id: 'description', title: 'Description', auto: false, placeholder: 'Describe this location...' },
      { id: 'history', title: 'History', auto: false, placeholder: 'Historical events at this location...' },
      { id: 'inhabitants', title: 'Inhabitants', auto: true, description: 'People associated with this location' },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // EVENT Template
  // ───────────────────────────────────────────────────────────────────────
  EVENT: {
    sections: [
      { id: 'infobox', title: 'Infobox', auto: true },
      { id: 'summary', title: 'Summary', auto: false, placeholder: 'Brief overview of the event...' },
      { id: 'participants', title: 'Participants', auto: true, description: 'People involved in this event' },
      { id: 'consequences', title: 'Consequences', auto: false, placeholder: 'Long-term effects...' },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // LORE Template
  // ───────────────────────────────────────────────────────────────────────
  LORE: {
    sections: [
      { id: 'content', title: 'Content', auto: false, placeholder: 'Write your lore entry...' },
      { id: 'related', title: 'Related Entries', auto: true, description: 'Connected lore through wiki-links' },
    ],
  },

};

// ═══════════════════════════════════════════════════════════════════════════
// 🪝 HOOK: FIELD_FORMATTERS
// ═══════════════════════════════════════════════════════════════════════════
// Custom display logic for complex fields in Codex infoboxes.
// 
// TO ADD A NEW FORMATTER:
// 1. Add function to this object
// 2. Reference it in AUTO_INFOBOX_FIELDS format property
// 3. Return formatted HTML or React component
// ═══════════════════════════════════════════════════════════════════════════

export const FIELD_FORMATTERS = {
  
  text: (value) => {
    return value || 'Unknown';
  },

  date: (value) => {
    if (!value) return 'Unknown';
    // Format: "15 March 1245"
    const date = new Date(value);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  },

  houseLink: (houseId, houses) => {
    const house = houses?.find(h => h.id === houseId);
    if (!house) return 'Unknown House';
    return `[[${house.houseName}]]`;
  },

  badge: (value) => {
    // Returns a styled badge component reference
    return {
      type: 'badge',
      value: value,
      className: `legitimacy-${value}`,
    };
  },

  computed: (person, fieldName) => {
    // For computed fields like age
    if (fieldName === 'age') {
      if (!person.dateOfBirth) return 'Unknown';
      const birth = new Date(person.dateOfBirth);
      const death = person.dateOfDeath ? new Date(person.dateOfDeath) : new Date();
      const age = death.getFullYear() - birth.getFullYear();
      return `${age} years`;
    }
    return 'N/A';
  },

  // ┌───────────────────────────────────────────────────────────────────────
  // │ 🚀 FUTURE: Current Title Formatter (Module 1E)
  // └───────────────────────────────────────────────────────────────────────
  // currentTitle: (titles) => {
  //   if (!titles || titles.length === 0) return 'None';
  //   const current = titles.find(t => !t.dateRelinquished);
  //   if (!current) return 'None';
  //   return `[[${current.title}]]`; // Link to title entry
  // },

  // ┌───────────────────────────────────────────────────────────────────────
  // │ 🚀 FUTURE: Bloodline List Formatter (Module 1E)
  // └───────────────────────────────────────────────────────────────────────
  // bloodlineList: (bloodlines) => {
  //   if (!bloodlines || bloodlines.length === 0) return 'None';
  //   return bloodlines.map(bl => ({
  //     type: 'bloodline',
  //     name: `[[${bl.name}]]`,
  //     strength: bl.strength,
  //     source: bl.source,
  //   }));
  // },

};

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get all infobox fields for a person
 * @param {Object} person - Person object
 * @returns {Array} - Array of field configs that should display
 */
export const getInfoboxFields = (person) => {
  const fields = [
    ...AUTO_INFOBOX_FIELDS.ALWAYS_SHOW,
    ...AUTO_INFOBOX_FIELDS.SHOW_IF_PRESENT.filter(field => {
      return !field.condition || field.condition(person);
    }),
  ];

  return fields.sort((a, b) => a.order - b.order);
};

/**
 * Generate wiki-links for a person
 * @param {Object} person - Person object
 * @param {Object} allData - All people, houses, etc.
 * @returns {Object} - Map of field -> wiki-link string
 */
export const generateWikiLinks = (person, allData) => {
  const links = {};

  // House link
  if (person.houseId && allData.houses) {
    const house = allData.houses.find(h => h.id === person.houseId);
    if (house) {
      links.house = `[[${house.houseName}]]`;
    }
  }

  // Relationship links
  if (person.spouseIds && allData.people) {
    links.spouses = person.spouseIds.map(id => {
      const spouse = allData.people.find(p => p.id === id);
      return spouse ? `[[${spouse.firstName} ${spouse.lastName}]]` : null;
    }).filter(Boolean);
  }

  // 🚀 FUTURE: Add title links, bloodline links, etc.

  return links;
};

/**
 * Get Codex entry template for a category
 * @param {string} category - Category name (PERSONAGE, HOUSE, etc.)
 * @returns {Object} - Template structure
 */
export const getEntryTemplate = (category) => {
  return CODEX_ENTRY_TEMPLATE[category.toUpperCase()] || CODEX_ENTRY_TEMPLATE.LORE;
};

/**
 * Format a field value for display in Codex
 * @param {string} formatType - Formatter name
 * @param {*} value - Raw value
 * @param {Object} context - Additional context (person, houses, etc.)
 * @returns {*} - Formatted value
 */
export const formatField = (formatType, value, context = {}) => {
  const formatter = FIELD_FORMATTERS[formatType];
  if (!formatter) {
    console.warn(`[CodexHooks] Unknown formatter: ${formatType}`);
    return value;
  }
  
  return formatter(value, context);
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT ALL
// ═══════════════════════════════════════════════════════════════════════════

export default {
  AUTO_INFOBOX_FIELDS,
  AUTO_WIKI_LINK_FIELDS,
  CODEX_ENTRY_TEMPLATE,
  FIELD_FORMATTERS,
  getInfoboxFields,
  generateWikiLinks,
  getEntryTemplate,
  formatField,
};
