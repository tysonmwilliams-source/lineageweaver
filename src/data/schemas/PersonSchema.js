/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PERSON SCHEMA - EXTENSION POINTS SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This file defines the complete data model for Person entities in Lineageweaver.
 * It uses explicit extension points (marked with 🪝) to make future feature
 * additions clear and self-documenting.
 * 
 * MODIFICATION GUIDELINES:
 * - CORE_FIELDS: Do NOT modify without database migration
 * - EXTENDED_FIELDS: Stable features, modify with caution
 * - FANTASY_FIELDS: 🪝 Primary extension point for Module 1E features
 * - COMPUTED_FIELDS: 🪝 Add derived properties here
 * - VALIDATION_RULES: 🪝 Add field validation here
 * 
 * VERSION: 2.0.0 (Codex Integration)
 * NEXT VERSION: 3.0.0 (Module 1E Fantasy Features)
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate age from birth to end date
 */
const calculateAge = (birthDate, endDate) => {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const end = endDate ? new Date(endDate) : new Date();
  let age = end.getFullYear() - birth.getFullYear();
  const monthDiff = end.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

/**
 * Format display name with optional title
 */
const formatDisplayName = (person) => {
  // 🚀 FUTURE: Include titles when MODULE_1E.TITLES_SYSTEM is implemented
  // const currentTitle = person.titles?.find(t => !t.dateRelinquished)?.name;
  // if (currentTitle) return `${currentTitle} ${person.firstName} ${person.lastName}`;
  
  return `${person.firstName} ${person.lastName}`;
};

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITION
// ═══════════════════════════════════════════════════════════════════════════

export const PERSON_SCHEMA = {
  
  // ═══════════════════════════════════════════════════════════════════════
  // CORE FIELDS - DO NOT MODIFY
  // ═══════════════════════════════════════════════════════════════════════
  // These are essential for genealogical functionality.
  // Changes to these fields require a database migration and version bump.
  // ═══════════════════════════════════════════════════════════════════════
  CORE_FIELDS: {
    id: { 
      type: 'string', 
      required: true,
      description: 'Unique identifier for this person',
      generated: true,
    },
    firstName: { 
      type: 'string', 
      required: true,
      description: 'Given name(s)',
      example: 'Aldric',
    },
    lastName: { 
      type: 'string', 
      required: true,
      description: 'Family surname',
      example: 'Wilfrey',
    },
    dateOfBirth: { 
      type: 'date', 
      required: false,
      description: 'Birth date in YYYY-MM-DD format (can be partial: YYYY or YYYY-MM)',
      example: '1245-03-15',
    },
    dateOfDeath: { 
      type: 'date', 
      required: false,
      description: 'Death date in YYYY-MM-DD format (null if still living)',
      example: '1289-11-22',
    },
    gender: { 
      type: 'enum', 
      values: ['male', 'female', 'other'], 
      required: true,
      description: 'Gender identity',
    },
    houseId: { 
      type: 'reference', 
      required: true,
      description: 'Reference to the House/Family this person belongs to',
      references: 'House.id',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  // EXTENDED FIELDS - CURRENT STABLE FEATURES
  // ═══════════════════════════════════════════════════════════════════════
  // These fields are implemented, tested, and stable.
  // Modifications should be made cautiously with backward compatibility.
  // ═══════════════════════════════════════════════════════════════════════
  EXTENDED_FIELDS: {
    maidenName: { 
      type: 'string', 
      required: false,
      description: 'Birth surname if changed through marriage',
      example: 'Blackwell',
    },
    legitimacyStatus: { 
      type: 'enum', 
      values: ['legitimate', 'bastard', 'adopted', 'unknown'],
      required: false,
      defaultValue: 'legitimate',
      description: 'Legitimacy status for succession tracking',
      visualIndicator: 'border-color',
    },
    notes: { 
      type: 'text', 
      required: false,
      description: 'Free-form notes for additional context',
      maxLength: 5000,
    },
    codexEntryId: { 
      type: 'reference', 
      required: false,
      description: 'Link to corresponding Codex entry (auto-generated)',
      references: 'CodexEntry.id',
      autoGenerated: true,
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  // 🪝 HOOK: FANTASY_FIELDS
  // ═══════════════════════════════════════════════════════════════════════
  // This is the PRIMARY EXTENSION POINT for Module 1E features.
  // 
  // INSTRUCTIONS FOR ADDING NEW FEATURES:
  // 1. Uncomment the relevant field definition below
  // 2. Update the schema version in MigrationHooks.js
  // 3. Add corresponding UI components in PersonForm.jsx
  // 4. Update Codex integration in CodexHooks.js
  // 5. Enable the feature flag in featureFlags.js
  // 6. Test thoroughly before committing
  // 
  // PLANNED FEATURES (Module 1E):
  // - species: Non-human character types
  // - magicalBloodlines: Inherited magical abilities
  // - titles: Noble titles and honors with date ranges
  // - portraitUrl: Character portrait image
  // ═══════════════════════════════════════════════════════════════════════
  FANTASY_FIELDS: {
    
    // ┌─────────────────────────────────────────────────────────────────────
    // │ 🚀 FUTURE: Species Field (Module 1E Feature #1)
    // │ Complexity: LOW | Priority: MEDIUM-HIGH | Estimated: 0.5 sessions
    // └─────────────────────────────────────────────────────────────────────
    // species: {
    //   type: 'string',
    //   required: false,
    //   defaultValue: 'Human',
    //   description: 'Species/race of character (Human, Elf, Dwarf, Dragon, etc.)',
    //   example: 'Human',
    //   validValues: ['Human', 'Elf', 'Dwarf', 'Dragon', 'Fae', 'Other'],
    //   allowCustom: true,
    //   codexIntegration: true,
    //   displayAs: 'badge',
    // },

    // ┌─────────────────────────────────────────────────────────────────────
    // │ 🚀 FUTURE: Magical Bloodlines (Module 1E Feature #2)
    // │ Complexity: MEDIUM-HIGH | Priority: MEDIUM | Estimated: 1.5 sessions
    // └─────────────────────────────────────────────────────────────────────
    // magicalBloodlines: {
    //   type: 'array',
    //   itemType: 'object',
    //   required: false,
    //   defaultValue: [],
    //   description: 'Magical bloodlines inherited or acquired',
    //   itemSchema: {
    //     name: { type: 'string', required: true, example: 'Dragonblood' },
    //     strength: { 
    //       type: 'enum', 
    //       values: ['weak', 'moderate', 'strong', 'legendary'],
    //       required: true,
    //     },
    //     source: { 
    //       type: 'enum', 
    //       values: ['inherited', 'acquired'],
    //       required: true,
    //     },
    //     notes: { type: 'string', required: false },
    //   },
    //   inheritanceRules: 'auto-calculate-from-parents',
    //   visualIndicator: 'glow-effect',
    //   codexIntegration: true,
    // },

    // ┌─────────────────────────────────────────────────────────────────────
    // │ 🚀 FUTURE: Titles System (Module 1E Feature #3)
    // │ Complexity: MEDIUM | Priority: MEDIUM-HIGH | Estimated: 1-1.5 sessions
    // └─────────────────────────────────────────────────────────────────────
    // titles: {
    //   type: 'array',
    //   itemType: 'object',
    //   required: false,
    //   defaultValue: [],
    //   description: 'Noble titles and honors with date ranges',
    //   itemSchema: {
    //     title: { type: 'string', required: true, example: 'Lord' },
    //     rank: { 
    //       type: 'enum',
    //       values: ['King', 'Queen', 'Prince', 'Princess', 'Duke', 'Duchess', 
    //                'Earl', 'Countess', 'Lord', 'Lady', 'Ser', 'Dame'],
    //       required: true,
    //     },
    //     dateAwarded: { type: 'date', required: true },
    //     dateRelinquished: { type: 'date', required: false },
    //     territory: { type: 'string', required: false, example: 'Blackmere' },
    //     notes: { type: 'string', required: false },
    //   },
    //   displayCurrent: true,
    //   sortBy: 'rank',
    //   codexIntegration: true,
    // },

    // ┌─────────────────────────────────────────────────────────────────────
    // │ 🚀 FUTURE: Portrait URL (Module 1E Feature #4)
    // │ Complexity: LOW | Priority: LOW-MEDIUM | Estimated: 0.5 sessions
    // └─────────────────────────────────────────────────────────────────────
    // portraitUrl: {
    //   type: 'string',
    //   required: false,
    //   description: 'URL or path to character portrait image',
    //   example: '/portraits/aldric-wilfrey.jpg',
    //   validation: 'valid-image-url',
    //   displayIn: ['person-card', 'codex-infobox'],
    //   maxSize: '5MB',
    //   acceptedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    // },

  },

  // ═══════════════════════════════════════════════════════════════════════
  // 🪝 HOOK: COMPUTED_FIELDS
  // ═══════════════════════════════════════════════════════════════════════
  // Add fields that are calculated on-the-fly from other data.
  // These are NOT stored in the database but computed when needed.
  // 
  // USAGE:
  // const age = PERSON_SCHEMA.COMPUTED_FIELDS.age(person);
  // 
  // WHEN TO ADD COMPUTED FIELDS:
  // - Derived from existing data (age from dateOfBirth)
  // - Expensive to store but cheap to calculate
  // - Needs to stay up-to-date automatically
  // ═══════════════════════════════════════════════════════════════════════
  COMPUTED_FIELDS: {
    
    age: {
      compute: (person) => calculateAge(person.dateOfBirth, person.dateOfDeath),
      description: 'Age at time of death (or current age if alive)',
      type: 'number',
      nullable: true,
    },

    displayName: {
      compute: (person) => formatDisplayName(person),
      description: 'Formatted name with optional title',
      type: 'string',
      nullable: false,
    },

    isAlive: {
      compute: (person) => !person.dateOfDeath,
      description: 'Whether this person is currently alive',
      type: 'boolean',
      nullable: false,
    },

    // 🚀 FUTURE: Add when titles are implemented
    // currentTitle: {
    //   compute: (person) => {
    //     if (!person.titles || person.titles.length === 0) return null;
    //     const current = person.titles.find(t => !t.dateRelinquished);
    //     return current?.title || null;
    //   },
    //   description: 'Currently held title (if any)',
    //   type: 'string',
    //   nullable: true,
    // },

    // 🚀 FUTURE: Add when species lifespans are defined
    // ageCategory: {
    //   compute: (person) => {
    //     const age = calculateAge(person.dateOfBirth, person.dateOfDeath);
    //     if (!age) return 'unknown';
    //     // Different categories based on species
    //     switch(person.species) {
    //       case 'Elf': return age < 100 ? 'young' : age < 500 ? 'adult' : 'elder';
    //       case 'Dwarf': return age < 50 ? 'young' : age < 200 ? 'adult' : 'elder';
    //       default: return age < 18 ? 'young' : age < 60 ? 'adult' : 'elder';
    //     }
    //   },
    //   description: 'Life stage category adjusted for species',
    //   type: 'string',
    //   nullable: false,
    // },

  },

  // ═══════════════════════════════════════════════════════════════════════
  // 🪝 HOOK: VALIDATION_RULES
  // ═══════════════════════════════════════════════════════════════════════
  // Custom validation logic for fields.
  // Each rule should return true if valid, or an error message if invalid.
  // 
  // USAGE:
  // const error = PERSON_SCHEMA.VALIDATION_RULES.dateOfBirth(person.dateOfBirth);
  // if (error) console.error(error);
  // ═══════════════════════════════════════════════════════════════════════
  VALIDATION_RULES: {
    
    dateOfBirth: (value) => {
      if (!value) return true; // Optional field
      const date = new Date(value);
      if (isNaN(date.getTime())) return 'Invalid date format';
      if (date > new Date()) return 'Birth date cannot be in the future';
      return true;
    },

    dateOfDeath: (value, person) => {
      if (!value) return true; // Optional field
      const death = new Date(value);
      if (isNaN(death.getTime())) return 'Invalid date format';
      if (person.dateOfBirth && death < new Date(person.dateOfBirth)) {
        return 'Death date cannot be before birth date';
      }
      return true;
    },

    maidenName: (value, person) => {
      if (!value) return true;
      if (value === person.lastName) {
        return 'Maiden name should differ from current last name';
      }
      return true;
    },

    // 🚀 FUTURE: Add when species is implemented
    // species: (value) => {
    //   if (!value) return true;
    //   const validSpecies = ['Human', 'Elf', 'Dwarf', 'Dragon', 'Fae', 'Other'];
    //   // Allow custom species
    //   return true;
    // },

    // 🚀 FUTURE: Add when titles are implemented
    // titles: (value) => {
    //   if (!value || !Array.isArray(value)) return true;
    //   // Check for overlapping title date ranges
    //   for (let i = 0; i < value.length; i++) {
    //     for (let j = i + 1; j < value.length; j++) {
    //       const title1 = value[i];
    //       const title2 = value[j];
    //       // Check if date ranges overlap
    //       // ... validation logic ...
    //     }
    //   }
    //   return true;
    // },

  },

};

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS FOR ACCESSING SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get all field definitions across all sections
 */
export const getAllFields = () => {
  return {
    ...PERSON_SCHEMA.CORE_FIELDS,
    ...PERSON_SCHEMA.EXTENDED_FIELDS,
    ...PERSON_SCHEMA.FANTASY_FIELDS,
  };
};

/**
 * Get only fields that are currently enabled/uncommented
 */
export const getActiveFields = () => {
  const allFields = getAllFields();
  // Filter out commented fields
  return Object.keys(allFields).reduce((active, key) => {
    if (allFields[key] !== undefined) {
      active[key] = allFields[key];
    }
    return active;
  }, {});
};

/**
 * Validate a person object against the schema
 */
export const validatePerson = (person) => {
  const errors = {};
  
  // Check required fields
  const allFields = getAllFields();
  Object.entries(allFields).forEach(([key, schema]) => {
    if (schema.required && !person[key]) {
      errors[key] = `${key} is required`;
    }
  });

  // Run custom validation rules
  Object.entries(PERSON_SCHEMA.VALIDATION_RULES).forEach(([key, validator]) => {
    if (person[key] !== undefined) {
      const result = validator(person[key], person);
      if (result !== true) {
        errors[key] = result;
      }
    }
  });

  return Object.keys(errors).length > 0 ? errors : null;
};

/**
 * Compute all computed fields for a person
 */
export const computeFields = (person) => {
  const computed = {};
  Object.entries(PERSON_SCHEMA.COMPUTED_FIELDS).forEach(([key, field]) => {
    computed[key] = field.compute(person);
  });
  return computed;
};

/**
 * Get a person with computed fields included
 */
export const enrichPerson = (person) => {
  return {
    ...person,
    computed: computeFields(person),
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT DEFAULT
// ═══════════════════════════════════════════════════════════════════════════

export default PERSON_SCHEMA;
