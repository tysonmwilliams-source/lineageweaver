/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DATABASE MIGRATION HOOKS
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This file manages database schema versioning, migrations, and data transformations.
 * When adding new fields to Person/House schemas, register them here to ensure:
 * - Import/export compatibility
 * - Data backups work correctly
 * - Database upgrades don't lose data
 * - Rollback capabilities exist
 * 
 * CRITICAL CONCEPTS:
 * 
 * SCHEMA VERSION: A snapshot of the database structure at a point in time.
 * Each version includes all fields available and migration logic to/from other versions.
 * 
 * MIGRATION UP: Transform data from older version to newer (add new fields).
 * MIGRATION DOWN: Transform data from newer version to older (remove new fields).
 * 
 * WHEN TO CREATE NEW VERSION:
 * - Adding/removing database fields
 * - Changing field types or constraints
 * - Restructuring data relationships
 * - Major feature additions (Module 1E)
 * 
 * VERSION: 2.0.0 (Current with Codex Integration)
 * NEXT VERSION: 3.0.0 (Module 1E Fantasy Features)
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// 🪝 HOOK: SCHEMA_VERSIONS
// ═══════════════════════════════════════════════════════════════════════════
// Register all schema versions here with their fields and migration logic.
// 
// STRUCTURE:
// - version: Semantic version string (e.g., '1.0.0')
// - date: Release date of this version
// - fields: Array of field names present in this version
// - migrations.up: Function to upgrade from previous version
// - migrations.down: Function to downgrade to previous version
// 
// TO ADD A NEW VERSION:
// 1. Copy the latest version object
// 2. Increment version number (follow semantic versioning)
// 3. Add new fields to fields array
// 4. Write migration.up function (add defaults for new fields)
// 5. Write migration.down function (remove new fields)
// 6. Update CURRENT_VERSION constant
// 7. Test migration both directions!
// ═══════════════════════════════════════════════════════════════════════════

export const SCHEMA_VERSIONS = {
  
  // ───────────────────────────────────────────────────────────────────────
  // v1.0.0 - Initial Release (December 2024)
  // ───────────────────────────────────────────────────────────────────────
  // Basic genealogical functionality with core person/house/relationship data.
  // ───────────────────────────────────────────────────────────────────────
  'v1.0.0': {
    version: '1.0.0',
    date: '2024-12-01',
    description: 'Initial release with core genealogy features',
    
    person: {
      fields: [
        'id',
        'firstName',
        'lastName',
        'dateOfBirth',
        'dateOfDeath',
        'gender',
        'houseId',
      ],
      
      migrations: {
        up: null,    // No previous version to migrate from
        down: null,  // Cannot downgrade from v1
      },
    },

    house: {
      fields: [
        'id',
        'houseName',
        'sigil',
        'motto',
        'foundedDate',
        'colorCode',
        'notes',
      ],
    },

    relationship: {
      fields: [
        'id',
        'person1Id',
        'person2Id',
        'relationshipType',
        'biologicalParent',
        'marriageDate',
        'divorceDate',
        'marriageStatus',
      ],
    },
  },

  // ───────────────────────────────────────────────────────────────────────
  // v2.0.0 - Codex Integration (January 2025)
  // ───────────────────────────────────────────────────────────────────────
  // Added maiden names, legitimacy tracking, Codex entry links, and
  // support for cadet branches and heraldry.
  // ───────────────────────────────────────────────────────────────────────
  'v2.0.0': {
    version: '2.0.0',
    date: '2025-01-01',
    description: 'Codex integration and extended person metadata',
    
    person: {
      fields: [
        // v1 fields
        'id', 'firstName', 'lastName', 'dateOfBirth', 'dateOfDeath', 'gender', 'houseId',
        // v2 additions
        'maidenName',
        'legitimacyStatus',
        'notes',
        'codexEntryId',
      ],
      
      migrations: {
        // Upgrade from v1 to v2
        up: (person) => ({
          ...person,
          maidenName: null,
          legitimacyStatus: 'legitimate',
          notes: '',
          codexEntryId: null,
        }),
        
        // Downgrade from v2 to v1
        down: (person) => {
          const { maidenName, legitimacyStatus, notes, codexEntryId, ...v1Person } = person;
          return v1Person;
        },
      },
    },

    house: {
      fields: [
        // v1 fields
        'id', 'houseName', 'sigil', 'motto', 'foundedDate', 'colorCode', 'notes',
        // v2 additions
        'shieldShape',
        'cadetBranchOf',
        'codexEntryId',
      ],
      
      migrations: {
        up: (house) => ({
          ...house,
          shieldShape: 'heater',
          cadetBranchOf: null,
          codexEntryId: null,
        }),
        
        down: (house) => {
          const { shieldShape, cadetBranchOf, codexEntryId, ...v1House } = house;
          return v1House;
        },
      },
    },

    relationship: {
      fields: [
        // v1 fields (no changes in v2)
        'id', 'person1Id', 'person2Id', 'relationshipType', 'biologicalParent',
        'marriageDate', 'divorceDate', 'marriageStatus',
      ],
    },
  },

  // ───────────────────────────────────────────────────────────────────────
  // 🚀 FUTURE: v3.0.0 - Module 1E Fantasy Features
  // ───────────────────────────────────────────────────────────────────────
  // Uncomment and implement when Module 1E features are ready.
  // Includes: species, titles, magical bloodlines, portraits.
  // ───────────────────────────────────────────────────────────────────────
  // 'v3.0.0': {
  //   version: '3.0.0',
  //   date: '2025-02-01',  // Update with actual completion date
  //   description: 'Module 1E fantasy worldbuilding features',
  //   
  //   person: {
  //     fields: [
  //       // v2 fields
  //       'id', 'firstName', 'lastName', 'dateOfBirth', 'dateOfDeath', 'gender', 'houseId',
  //       'maidenName', 'legitimacyStatus', 'notes', 'codexEntryId',
  //       // v3 additions
  //       'species',
  //       'magicalBloodlines',
  //       'titles',
  //       'portraitUrl',
  //     ],
  //     
  //     migrations: {
  //       // Upgrade from v2 to v3
  //       up: (person) => ({
  //         ...person,
  //         species: 'Human',
  //         magicalBloodlines: [],
  //         titles: [],
  //         portraitUrl: null,
  //       }),
  //       
  //       // Downgrade from v3 to v2
  //       down: (person) => {
  //         const { species, magicalBloodlines, titles, portraitUrl, ...v2Person } = person;
  //         return v2Person;
  //       },
  //     },
  //   },
  //
  //   house: {
  //     fields: [
  //       // v2 fields (no changes in v3)
  //       'id', 'houseName', 'sigil', 'motto', 'foundedDate', 'colorCode', 'notes',
  //       'shieldShape', 'cadetBranchOf', 'codexEntryId',
  //     ],
  //   },
  //
  //   relationship: {
  //     fields: [
  //       // v2 fields (no changes in v3)
  //       'id', 'person1Id', 'person2Id', 'relationshipType', 'biologicalParent',
  //       'marriageDate', 'divorceDate', 'marriageStatus',
  //     ],
  //   },
  // },

};

// ═══════════════════════════════════════════════════════════════════════════
// CURRENT VERSION
// ═══════════════════════════════════════════════════════════════════════════

export const CURRENT_VERSION = 'v2.0.0';

// ═══════════════════════════════════════════════════════════════════════════
// 🪝 HOOK: EXPORT_FORMATTERS
// ═══════════════════════════════════════════════════════════════════════════
// Define how data is exported to different formats.
// Add new fields to the appropriate exporters as features are implemented.
// 
// SUPPORTED FORMATS:
// - json: Complete data export (default)
// - gedcom: Standard genealogy format (future)
// - csv: Spreadsheet-compatible (future)
// ═══════════════════════════════════════════════════════════════════════════

export const EXPORT_FORMATTERS = {
  
  // ───────────────────────────────────────────────────────────────────────
  // JSON Export (Current)
  // ───────────────────────────────────────────────────────────────────────
  json: {
    
    /**
     * Export minimal person data (v1 compatible)
     */
    corePerson: (person) => ({
      id: person.id,
      firstName: person.firstName,
      lastName: person.lastName,
      dateOfBirth: person.dateOfBirth,
      dateOfDeath: person.dateOfDeath,
      gender: person.gender,
      houseId: person.houseId,
    }),

    /**
     * Export full person data (current version)
     */
    fullPerson: (person) => ({
      ...EXPORT_FORMATTERS.json.corePerson(person),
      maidenName: person.maidenName,
      legitimacyStatus: person.legitimacyStatus,
      notes: person.notes,
      codexEntryId: person.codexEntryId,
      
      // 🚀 FUTURE: Add Module 1E fields when implemented
      // species: person.species,
      // magicalBloodlines: person.magicalBloodlines,
      // titles: person.titles,
      // portraitUrl: person.portraitUrl,
    }),

    /**
     * Export house data
     */
    house: (house) => ({
      id: house.id,
      houseName: house.houseName,
      sigil: house.sigil,
      motto: house.motto,
      foundedDate: house.foundedDate,
      colorCode: house.colorCode,
      notes: house.notes,
      shieldShape: house.shieldShape,
      cadetBranchOf: house.cadetBranchOf,
      codexEntryId: house.codexEntryId,
    }),

    /**
     * Export relationship data
     */
    relationship: (rel) => ({
      id: rel.id,
      person1Id: rel.person1Id,
      person2Id: rel.person2Id,
      relationshipType: rel.relationshipType,
      biologicalParent: rel.biologicalParent,
      marriageDate: rel.marriageDate,
      divorceDate: rel.divorceDate,
      marriageStatus: rel.marriageStatus,
    }),

    /**
     * Export complete database
     */
    full: (data) => ({
      version: CURRENT_VERSION,
      exportDate: new Date().toISOString(),
      metadata: {
        personCount: data.people.length,
        houseCount: data.houses.length,
        relationshipCount: data.relationships.length,
      },
      people: data.people.map(EXPORT_FORMATTERS.json.fullPerson),
      houses: data.houses.map(EXPORT_FORMATTERS.json.house),
      relationships: data.relationships.map(EXPORT_FORMATTERS.json.relationship),
      codexEntries: data.codexEntries || [],
    }),
  },

  // ───────────────────────────────────────────────────────────────────────
  // 🚀 FUTURE: GEDCOM Export (Module 1E Feature)
  // ───────────────────────────────────────────────────────────────────────
  // GEDCOM is the standard format for genealogy software.
  // Uncomment when implementing timeline view and GEDCOM export feature.
  // ───────────────────────────────────────────────────────────────────────
  // gedcom: {
  //   person: (person) => {
  //     // GEDCOM format for individuals
  //     return `0 @I${person.id}@ INDI
  // 1 NAME ${person.firstName} /${person.lastName}/
  // 1 SEX ${person.gender === 'male' ? 'M' : person.gender === 'female' ? 'F' : 'U'}
  // ${person.dateOfBirth ? `1 BIRT\n2 DATE ${person.dateOfBirth}` : ''}
  // ${person.dateOfDeath ? `1 DEAT\n2 DATE ${person.dateOfDeath}` : ''}`;
  //   },
  //   
  //   full: (data) => {
  //     // Complete GEDCOM file
  //     let gedcom = '0 HEAD\n1 GEDC\n2 VERS 5.5.1\n2 FORM LINEAGEWEAVER\n';
  //     data.people.forEach(person => {
  //       gedcom += EXPORT_FORMATTERS.gedcom.person(person) + '\n';
  //     });
  //     gedcom += '0 TRLR';
  //     return gedcom;
  //   },
  // },

};

// ═══════════════════════════════════════════════════════════════════════════
// 🪝 HOOK: IMPORT_VALIDATORS
// ═══════════════════════════════════════════════════════════════════════════
// Validation rules for imported data.
// Ensures imported JSON/GEDCOM meets schema requirements.
// ═══════════════════════════════════════════════════════════════════════════

export const IMPORT_VALIDATORS = {
  
  /**
   * Validate imported JSON structure
   */
  validateJSON: (data) => {
    const errors = [];
    
    // Check required top-level properties
    if (!data.version) errors.push('Missing version field');
    if (!data.people) errors.push('Missing people array');
    if (!data.houses) errors.push('Missing houses array');
    if (!data.relationships) errors.push('Missing relationships array');
    
    // Check version compatibility
    if (data.version && !SCHEMA_VERSIONS[data.version]) {
      errors.push(`Unknown schema version: ${data.version}`);
    }
    
    // Validate each person
    if (data.people && Array.isArray(data.people)) {
      data.people.forEach((person, index) => {
        if (!person.id) errors.push(`Person at index ${index} missing ID`);
        if (!person.firstName) errors.push(`Person at index ${index} missing firstName`);
        if (!person.lastName) errors.push(`Person at index ${index} missing lastName`);
        if (!person.houseId) errors.push(`Person at index ${index} missing houseId`);
      });
    }
    
    // Validate each house
    if (data.houses && Array.isArray(data.houses)) {
      data.houses.forEach((house, index) => {
        if (!house.id) errors.push(`House at index ${index} missing ID`);
        if (!house.houseName) errors.push(`House at index ${index} missing houseName`);
      });
    }
    
    return errors.length > 0 ? errors : null;
  },

  /**
   * Check for data conflicts with existing database
   */
  validateConflicts: (importData, existingData) => {
    const conflicts = [];
    
    // Check for duplicate person IDs
    importData.people.forEach(person => {
      const existing = existingData.people.find(p => p.id === person.id);
      if (existing) {
        conflicts.push({
          type: 'person',
          id: person.id,
          message: `Person with ID ${person.id} already exists`,
          existingName: `${existing.firstName} ${existing.lastName}`,
          importName: `${person.firstName} ${person.lastName}`,
        });
      }
    });
    
    // Check for duplicate house IDs
    importData.houses.forEach(house => {
      const existing = existingData.houses.find(h => h.id === house.id);
      if (existing) {
        conflicts.push({
          type: 'house',
          id: house.id,
          message: `House with ID ${house.id} already exists`,
          existingName: existing.houseName,
          importName: house.houseName,
        });
      }
    });
    
    return conflicts;
  },

};

// ═══════════════════════════════════════════════════════════════════════════
// MIGRATION UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Migrate data from one schema version to another
 * @param {Object} data - Data to migrate
 * @param {string} fromVersion - Current version
 * @param {string} toVersion - Target version
 * @returns {Object} - Migrated data
 */
export const migrateData = (data, fromVersion, toVersion) => {
  if (fromVersion === toVersion) return data;
  
  const from = SCHEMA_VERSIONS[fromVersion];
  const to = SCHEMA_VERSIONS[toVersion];
  
  if (!from || !to) {
    throw new Error(`Invalid version: ${fromVersion} -> ${toVersion}`);
  }
  
  // Determine migration direction
  const upgrading = parseVersion(toVersion) > parseVersion(fromVersion);
  
  // Clone data to avoid mutations
  const migratedData = JSON.parse(JSON.stringify(data));
  
  // Migrate people
  if (upgrading && to.person.migrations.up) {
    migratedData.people = data.people.map(to.person.migrations.up);
  } else if (!upgrading && from.person.migrations.down) {
    migratedData.people = data.people.map(from.person.migrations.down);
  }
  
  // Migrate houses
  if (upgrading && to.house.migrations.up) {
    migratedData.houses = data.houses.map(to.house.migrations.up);
  } else if (!upgrading && from.house.migrations.down) {
    migratedData.houses = data.houses.map(from.house.migrations.down);
  }
  
  // Update version
  migratedData.version = toVersion;
  
  return migratedData;
};

/**
 * Parse version string to comparable number
 */
const parseVersion = (versionString) => {
  const [major, minor, patch] = versionString.replace('v', '').split('.').map(Number);
  return major * 10000 + minor * 100 + patch;
};

/**
 * Get migration path from one version to another
 * @param {string} fromVersion
 * @param {string} toVersion
 * @returns {string[]} - Array of versions to migrate through
 */
export const getMigrationPath = (fromVersion, toVersion) => {
  const versions = Object.keys(SCHEMA_VERSIONS).sort((a, b) => {
    return parseVersion(a) - parseVersion(b);
  });
  
  const fromIndex = versions.indexOf(fromVersion);
  const toIndex = versions.indexOf(toVersion);
  
  if (fromIndex === -1 || toIndex === -1) {
    throw new Error('Invalid version in migration path');
  }
  
  if (fromIndex < toIndex) {
    return versions.slice(fromIndex, toIndex + 1);
  } else {
    return versions.slice(toIndex, fromIndex + 1).reverse();
  }
};

/**
 * Export data in specified format
 * @param {Object} data - Data to export
 * @param {string} format - Export format (json, gedcom, etc.)
 * @returns {string|Object} - Formatted export
 */
export const exportData = (data, format = 'json') => {
  const formatter = EXPORT_FORMATTERS[format];
  if (!formatter) {
    throw new Error(`Unknown export format: ${format}`);
  }
  
  return formatter.full(data);
};

/**
 * Import and validate data
 * @param {string} jsonString - JSON string to import
 * @param {Object} existingData - Current database state
 * @returns {Object} - { data, errors, conflicts }
 */
export const importData = (jsonString, existingData) => {
  try {
    let data = JSON.parse(jsonString);
    
    // Validate structure
    const errors = IMPORT_VALIDATORS.validateJSON(data);
    if (errors) {
      return { data: null, errors, conflicts: null };
    }
    
    // Check conflicts
    const conflicts = IMPORT_VALIDATORS.validateConflicts(data, existingData);
    
    // Migrate to current version if needed
    if (data.version !== CURRENT_VERSION) {
      data = migrateData(data, data.version, CURRENT_VERSION);
    }
    
    return { data, errors: null, conflicts };
    
  } catch (error) {
    return { 
      data: null, 
      errors: [`JSON parsing error: ${error.message}`], 
      conflicts: null 
    };
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT ALL
// ═══════════════════════════════════════════════════════════════════════════

export default {
  SCHEMA_VERSIONS,
  CURRENT_VERSION,
  EXPORT_FORMATTERS,
  IMPORT_VALIDATORS,
  migrateData,
  getMigrationPath,
  exportData,
  importData,
};
