import Dexie from 'dexie';

/**
 * Database Service for Lineageweaver
 *
 * This file sets up IndexedDB (the browser's built-in database) using Dexie,
 * which is a wrapper that makes IndexedDB easier to work with.
 *
 * MULTI-DATASET SUPPORT:
 * Each dataset gets its own IndexedDB database named 'LineageweaverDB_{datasetId}'.
 * This ensures complete data isolation between datasets.
 *
 * Database instances are cached in a Map for performance.
 */

// Default dataset ID
export const DEFAULT_DATASET_ID = 'default';

// Cache for database instances (one per dataset)
const dbInstances = new Map();

/**
 * Create and configure a new Dexie database instance
 * @param {string} datasetId - The dataset ID
 * @returns {Dexie} Configured database instance
 */
function createDatabaseInstance(datasetId) {
  const dbName = datasetId === DEFAULT_DATASET_ID
    ? 'LineageweaverDB'  // Backward compatible name for default dataset
    : `LineageweaverDB_${datasetId}`;

  const db = new Dexie(dbName);

  // Apply all schema versions to this database instance
  applySchema(db);

  return db;
}

/**
 * Get a database instance for a specific dataset
 * Creates a new instance if one doesn't exist, otherwise returns cached instance.
 *
 * @param {string} [datasetId='default'] - The dataset ID
 * @returns {Dexie} Database instance for the dataset
 */
export function getDatabase(datasetId = DEFAULT_DATASET_ID) {
  const id = datasetId || DEFAULT_DATASET_ID;

  if (!dbInstances.has(id)) {
    const instance = createDatabaseInstance(id);
    dbInstances.set(id, instance);
    console.log('📦 Created database instance for dataset:', id);
  }

  return dbInstances.get(id);
}

/**
 * Close and remove a database instance from the cache
 * @param {string} datasetId - The dataset ID
 */
export async function closeDatabaseInstance(datasetId) {
  const id = datasetId || DEFAULT_DATASET_ID;
  const instance = dbInstances.get(id);

  if (instance) {
    await instance.close();
    dbInstances.delete(id);
    console.log('📦 Closed database instance for dataset:', id);
  }
}

/**
 * Delete an entire database for a dataset
 * WARNING: This permanently deletes all data!
 * @param {string} datasetId - The dataset ID
 */
export async function deleteDatabaseForDataset(datasetId) {
  const id = datasetId || DEFAULT_DATASET_ID;
  const dbName = id === DEFAULT_DATASET_ID
    ? 'LineageweaverDB'
    : `LineageweaverDB_${id}`;

  // Close instance first if it exists
  await closeDatabaseInstance(id);

  // Delete the database
  await Dexie.delete(dbName);
  console.log('📦 Deleted database for dataset:', id);
}

// Legacy export for backward compatibility
// This returns the default dataset's database
export const db = getDatabase(DEFAULT_DATASET_ID);

/**
 * Apply schema versions to a database instance
 * @param {Dexie} db - The database instance
 */
function applySchema(db) {

  // Version 1: Original schema
  db.version(1).stores({
    people: '++id, firstName, lastName, houseId, dateOfBirth, dateOfDeath',
    houses: '++id, houseName',
    relationships: '++id, person1Id, person2Id, relationshipType'
  });

  // Version 2: Add cadet house system fields
  db.version(2).stores({
    // Add indexes for new cadet house fields
    people: '++id, firstName, lastName, houseId, dateOfBirth, dateOfDeath, bastardStatus',
    houses: '++id, houseName, parentHouseId, houseType',
    relationships: '++id, person1Id, person2Id, relationshipType'
  }).upgrade(tx => {
    // Upgrade existing houses to have new fields with default values
    return tx.table('houses').toCollection().modify(house => {
      house.parentHouseId = house.parentHouseId || null;
      house.houseType = house.houseType || 'main';
      house.foundedBy = house.foundedBy || null;
      house.foundedDate = house.foundedDate || null;
      house.swornTo = house.swornTo || null;
      house.namePrefix = house.namePrefix || null;
    });
  }).upgrade(tx => {
    // Upgrade existing people to have new bastardStatus field
    return tx.table('people').toCollection().modify(person => {
      // If they're a bastard but don't have bastardStatus, set to 'active'
      if (person.legitimacyStatus === 'bastard' && !person.bastardStatus) {
        person.bastardStatus = 'active';
      } else {
        person.bastardStatus = person.bastardStatus || null;
      }
    });
  });

// Version 4: Add SVG support for infinite zoom quality
db.version(4).stores({
  // No changes to indexes, just adding new SVG fields through upgrade function
  people: '++id, firstName, lastName, houseId, dateOfBirth, dateOfBirth, bastardStatus',
  houses: '++id, houseName, parentHouseId, houseType',
  relationships: '++id, person1Id, person2Id, relationshipType'
}).upgrade(tx => {
  // Add SVG heraldry fields for zoom support
  return tx.table('houses').toCollection().modify(house => {
    // Full SVG markup (when available) - PRIMARY for infinite zoom
    house.heraldrySVG = house.heraldrySVG || null;
    
    // Track format type: 'svg', 'png', 'composite'
    house.heraldryType = house.heraldryType || null;
    
    // Original SVG before shield masking (for re-processing)
    house.heraldrySourceSVG = house.heraldrySourceSVG || null;
  });
});

// Version 5: Add The Codex - Encyclopedia System
db.version(5).stores({
  people: '++id, firstName, lastName, houseId, dateOfBirth, dateOfDeath, bastardStatus, codexEntryId',
  houses: '++id, houseName, parentHouseId, houseType, codexEntryId',
  relationships: '++id, person1Id, person2Id, relationshipType',
  // New tables for The Codex
  codexEntries: '++id, type, title, category, *tags, era, created, updated',
  codexLinks: '++id, sourceId, targetId, type'
}).upgrade(tx => {
  // Add codexEntryId to existing people and houses
  return tx.table('people').toCollection().modify(person => {
    person.codexEntryId = person.codexEntryId || null;
  }).then(() => {
    return tx.table('houses').toCollection().modify(house => {
      house.codexEntryId = house.codexEntryId || null;
    });
  });
});

// Version 6: Add acknowledged duplicates for namesake handling
db.version(6).stores({
  people: '++id, firstName, lastName, houseId, dateOfBirth, dateOfDeath, bastardStatus, codexEntryId',
  houses: '++id, houseName, parentHouseId, houseType, codexEntryId',
  relationships: '++id, person1Id, person2Id, relationshipType',
  codexEntries: '++id, type, title, category, *tags, era, created, updated',
  codexLinks: '++id, sourceId, targetId, type',
  // New table for tracking acknowledged non-duplicates (namesakes)
  acknowledgedDuplicates: '++id, person1Id, person2Id, acknowledgedAt'
});

// Version 7: Add The Armory - Heraldry System
// This creates a standalone heraldry table, separating heraldry from houses
// so heraldry can be its own major system like The Codex
db.version(7).stores({
  people: '++id, firstName, lastName, houseId, dateOfBirth, dateOfDeath, bastardStatus, codexEntryId',
  houses: '++id, houseName, parentHouseId, houseType, codexEntryId, heraldryId',
  relationships: '++id, person1Id, person2Id, relationshipType',
  codexEntries: '++id, type, title, category, *tags, era, created, updated',
  codexLinks: '++id, sourceId, targetId, type',
  acknowledgedDuplicates: '++id, person1Id, person2Id, acknowledgedAt',
  // NEW: The Armory - Standalone heraldry system
  heraldry: '++id, name, category, *tags, created, updated',
  // Links heraldry to entities (houses, people, locations, events)
  heraldryLinks: '++id, heraldryId, entityType, entityId, linkType'
}).upgrade(tx => {
  // Add heraldryId to existing houses
  return tx.table('houses').toCollection().modify(house => {
    house.heraldryId = house.heraldryId || null;
  });
});

// Version 8: Add The Dignities System - Titles & Feudal Hierarchy
// Based on "The Codified Charter of Driht, Ward, and Service"
// This creates the fifth major system for tracking titles, dignities, and feudal bonds
db.version(8).stores({
  people: '++id, firstName, lastName, houseId, dateOfBirth, dateOfDeath, bastardStatus, codexEntryId',
  houses: '++id, houseName, parentHouseId, houseType, codexEntryId, heraldryId',
  relationships: '++id, person1Id, person2Id, relationshipType',
  codexEntries: '++id, type, title, category, *tags, era, created, updated',
  codexLinks: '++id, sourceId, targetId, type',
  acknowledgedDuplicates: '++id, person1Id, person2Id, acknowledgedAt',
  heraldry: '++id, name, category, *tags, created, updated',
  heraldryLinks: '++id, heraldryId, entityType, entityId, linkType',
  dignities: '++id, name, shortName, dignityClass, dignityRank, swornToId, currentHolderId, currentHouseId, codexEntryId, created, updated',
  dignityTenures: '++id, dignityId, personId, dateStarted, dateEnded, acquisitionType, endType, created',
  dignityLinks: '++id, dignityId, entityType, entityId, linkType, created'
});

// Version 9: Add Epithets System - Descriptive Bynames
// Epithets are descriptive names like "the Bold", "Dragonslayer", "the Wise"
// Stored as an array on people for flexibility and cross-system integration
db.version(9).stores({
  people: '++id, firstName, lastName, houseId, dateOfBirth, dateOfDeath, bastardStatus, codexEntryId',
  houses: '++id, houseName, parentHouseId, houseType, codexEntryId, heraldryId',
  relationships: '++id, person1Id, person2Id, relationshipType',
  codexEntries: '++id, type, title, category, *tags, era, created, updated',
  codexLinks: '++id, sourceId, targetId, type',
  acknowledgedDuplicates: '++id, person1Id, person2Id, acknowledgedAt',
  heraldry: '++id, name, category, *tags, created, updated',
  heraldryLinks: '++id, heraldryId, entityType, entityId, linkType',
  // Dignities tables (from v8)
  dignities: '++id, name, shortName, dignityClass, dignityRank, swornToId, currentHolderId, currentHouseId, codexEntryId, created, updated',
  dignityTenures: '++id, dignityId, personId, dateStarted, dateEnded, acquisitionType, endType, created',
  dignityLinks: '++id, dignityId, entityType, entityId, linkType, created'
}).upgrade(tx => {
  // Add epithets array to existing people
  return tx.table('people').toCollection().modify(person => {
    // epithets: Array of epithet objects
    // Each epithet: { id, text, isPrimary, source, grantedById, earnedFrom, linkedEntityType, linkedEntityId, dateEarned, notes }
    person.epithets = person.epithets || [];
  });
});

// Version 10: Add Personal Arms - Heraldry Phase 4
// This allows individuals (not just houses) to have their own heraldic devices.
// Personal arms can be derived from house arms with cadency marks (triangles)
// to distinguish birth order among legitimate sons.
db.version(10).stores({
  // Add heraldryId to people for personal arms (quick access like houses have)
  people: '++id, firstName, lastName, houseId, dateOfBirth, dateOfDeath, bastardStatus, codexEntryId, heraldryId',
  houses: '++id, houseName, parentHouseId, houseType, codexEntryId, heraldryId',
  relationships: '++id, person1Id, person2Id, relationshipType',
  codexEntries: '++id, type, title, category, *tags, era, created, updated',
  codexLinks: '++id, sourceId, targetId, type',
  acknowledgedDuplicates: '++id, person1Id, person2Id, acknowledgedAt',
  heraldry: '++id, name, category, *tags, created, updated',
  heraldryLinks: '++id, heraldryId, entityType, entityId, linkType',
  dignities: '++id, name, shortName, dignityClass, dignityRank, swornToId, currentHolderId, currentHouseId, codexEntryId, created, updated',
  dignityTenures: '++id, dignityId, personId, dateStarted, dateEnded, acquisitionType, endType, created',
  dignityLinks: '++id, dignityId, entityType, entityId, linkType, created'
}).upgrade(tx => {
  // Add heraldryId to existing people
  // This field links directly to a heraldry record for quick access
  // (The heraldryLinks table still provides the full relationship details)
  return tx.table('people').toCollection().modify(person => {
    person.heraldryId = person.heraldryId || null;
  });
});

// Version 11: Add Bug Tracking System
// A global bug tracker accessible from anywhere in the app.
// Includes Claude Code export functionality for AI-assisted debugging.
// 
// WHAT THIS ADDS:
// - bugs: Table for storing bug reports with context
// - Indexes on status, priority for fast filtering
// - created index for chronological sorting
db.version(11).stores({
  people: '++id, firstName, lastName, houseId, dateOfBirth, dateOfDeath, bastardStatus, codexEntryId, heraldryId',
  houses: '++id, houseName, parentHouseId, houseType, codexEntryId, heraldryId',
  relationships: '++id, person1Id, person2Id, relationshipType',
  codexEntries: '++id, type, title, category, *tags, era, created, updated',
  codexLinks: '++id, sourceId, targetId, type',
  acknowledgedDuplicates: '++id, person1Id, person2Id, acknowledgedAt',
  heraldry: '++id, name, category, *tags, created, updated',
  heraldryLinks: '++id, heraldryId, entityType, entityId, linkType',
  dignities: '++id, name, shortName, dignityClass, dignityRank, swornToId, currentHolderId, currentHouseId, codexEntryId, created, updated',
  dignityTenures: '++id, dignityId, personId, dateStarted, dateEnded, acquisitionType, endType, created',
  dignityLinks: '++id, dignityId, entityType, entityId, linkType, created',
  // NEW: Bug Tracking System
  bugs: '++id, title, status, priority, system, page, created, resolved'
});

// Version 12: Add Household Roles System
// Tracks non-hereditary household positions like Master-at-Arms, Steward, etc.
// These are service roles tied to a house, not hereditary titles.
db.version(12).stores({
  people: '++id, firstName, lastName, houseId, dateOfBirth, dateOfDeath, bastardStatus, codexEntryId, heraldryId',
  houses: '++id, houseName, parentHouseId, houseType, codexEntryId, heraldryId',
  relationships: '++id, person1Id, person2Id, relationshipType',
  codexEntries: '++id, type, title, category, *tags, era, created, updated',
  codexLinks: '++id, sourceId, targetId, type',
  acknowledgedDuplicates: '++id, person1Id, person2Id, acknowledgedAt',
  heraldry: '++id, name, category, *tags, created, updated',
  heraldryLinks: '++id, heraldryId, entityType, entityId, linkType',
  dignities: '++id, name, shortName, dignityClass, dignityRank, swornToId, currentHolderId, currentHouseId, codexEntryId, created, updated',
  dignityTenures: '++id, dignityId, personId, dateStarted, dateEnded, acquisitionType, endType, created',
  dignityLinks: '++id, dignityId, entityType, entityId, linkType, created',
  bugs: '++id, title, status, priority, system, page, created, resolved',
  // NEW: Household Roles System
  householdRoles: '++id, houseId, roleType, currentHolderId, startDate, created, updated'
});

// Version 3: Add heraldry system fields
db.version(3).stores({
  // No changes to indexes, just adding new fields through upgrade function
  people: '++id, firstName, lastName, houseId, dateOfBirth, dateOfBirth, bastardStatus',
  houses: '++id, houseName, parentHouseId, houseType',
  relationships: '++id, person1Id, person2Id, relationshipType'
}).upgrade(tx => {
  // Add heraldry fields to existing houses with default values
  return tx.table('houses').toCollection().modify(house => {
    // Heraldry image data (base64 encoded PNG, 200x200px, <100KB)
    house.heraldryImageData = house.heraldryImageData || null;
    
    // Source of heraldry: 'armoria', 'whisk', 'upload', 'composite'
    house.heraldrySource = house.heraldrySource || null;
    
    // Shield shape type: 'heater', 'french', 'spanish', 'english', 'swiss'
    house.heraldryShieldType = house.heraldryShieldType || 'heater';
    
    // Armoria seed for reproducibility (if generated via Armoria)
    house.heraldrySeed = house.heraldrySeed || null;
    
    // AI prompt (if generated via Whisk or other AI)
    house.heraldryPrompt = house.heraldryPrompt || null;
    
    // Metadata object for additional data (composition sources, version history, etc.)
    house.heraldryMetadata = house.heraldryMetadata || null;
    
    // Thumbnail version (40x40px base64) - auto-generated from main image
    house.heraldryThumbnail = house.heraldryThumbnail || null;
    
    // High-res version (400x400px base64) - original before compression
    house.heraldryHighRes = house.heraldryHighRes || null;
  });
});
} // End of applySchema function

/**
 * Database Helper Functions
 * These are the CRUD operations (Create, Read, Update, Delete) for each entity
 *
 * All functions accept an optional datasetId parameter. If not provided,
 * they default to the 'default' dataset for backward compatibility.
 */

// ==================== PEOPLE OPERATIONS ====================

export async function addPerson(personData, datasetId) {
  try {
    const database = getDatabase(datasetId);
    const id = await database.people.add(personData);
    console.log('Person added with ID:', id);
    return id;
  } catch (error) {
    console.error('Error adding person:', error);
    throw error;
  }
}

export async function getPerson(id, datasetId) {
  try {
    const database = getDatabase(datasetId);
    const person = await database.people.get(id);
    return person;
  } catch (error) {
    console.error('Error getting person:', error);
    throw error;
  }
}

export async function getAllPeople(datasetId) {
  try {
    const database = getDatabase(datasetId);
    const people = await database.people.toArray();
    return people;
  } catch (error) {
    console.error('Error getting all people:', error);
    throw error;
  }
}

export async function getPeopleByHouse(houseId, datasetId) {
  try {
    const database = getDatabase(datasetId);
    const people = await database.people.where('houseId').equals(houseId).toArray();
    return people;
  } catch (error) {
    console.error('Error getting people by house:', error);
    throw error;
  }
}

export async function updatePerson(id, updates, datasetId) {
  try {
    const database = getDatabase(datasetId);
    const result = await database.people.update(id, updates);
    console.log('Person updated:', result);
    return result;
  } catch (error) {
    console.error('Error updating person:', error);
    throw error;
  }
}

export async function deletePerson(id, datasetId) {
  try {
    const database = getDatabase(datasetId);
    await database.people.delete(id);
    console.log('Person deleted:', id);
  } catch (error) {
    console.error('Error deleting person:', error);
    throw error;
  }
}

// ==================== HOUSE OPERATIONS ====================

/**
 * Add a new house with optional auto-creation of Codex entry
 *
 * @param {Object} houseData - House data to add
 * @param {Object} [options] - Options for house creation
 * @param {boolean} [options.skipCodexCreation=false] - Skip auto-creation of Codex entry
 * @param {string} [options.datasetId] - Dataset ID (optional, defaults to 'default')
 * @returns {Promise<number>} The new house ID
 */
export async function addHouse(houseData, options = {}) {
  try {
    const database = getDatabase(options.datasetId);
    const id = await database.houses.add(houseData);
    console.log('House added with ID:', id);

    // Auto-create Codex entry for the house (unless explicitly skipped)
    // This is skipped during cloud sync restore to prevent duplicates
    if (!options.skipCodexCreation) {
      try {
        // Use dynamic import to avoid circular dependency
        const { createEntry, updateEntry } = await import('./codexService.js');

        // Create a Codex entry for this house
        const codexEntryId = await createEntry({
          type: 'house',
          title: `House ${houseData.houseName}`,
          subtitle: houseData.houseType === 'cadet' ? 'Cadet Branch' : 'Noble House',
          content: houseData.notes || '',
          category: houseData.houseType || 'main',
          tags: ['house', houseData.houseType || 'main'].filter(Boolean),
          houseId: id
        }, options.datasetId);

        // Update the house with the codexEntryId
        await database.houses.update(id, { codexEntryId });
        console.log('📚 Auto-created Codex entry for house:', codexEntryId);
      } catch (codexError) {
        // Log but don't fail the house creation if Codex creation fails
        console.warn('⚠️ Could not auto-create Codex entry for house:', codexError);
      }
    }

    return id;
  } catch (error) {
    console.error('Error adding house:', error);
    throw error;
  }
}

export async function getHouse(id, datasetId) {
  try {
    const database = getDatabase(datasetId);
    const house = await database.houses.get(id);
    return house;
  } catch (error) {
    console.error('Error getting house:', error);
    throw error;
  }
}

export async function getAllHouses(datasetId) {
  try {
    const database = getDatabase(datasetId);
    const houses = await database.houses.toArray();
    return houses;
  } catch (error) {
    console.error('Error getting all houses:', error);
    throw error;
  }
}

export async function getCadetHouses(parentHouseId, datasetId) {
  try {
    const database = getDatabase(datasetId);
    const cadetHouses = await database.houses
      .where('parentHouseId')
      .equals(parentHouseId)
      .toArray();
    return cadetHouses;
  } catch (error) {
    console.error('Error getting cadet houses:', error);
    throw error;
  }
}

export async function updateHouse(id, updates, datasetId) {
  try {
    const database = getDatabase(datasetId);
    const result = await database.houses.update(id, updates);
    console.log('House updated:', result);
    return result;
  } catch (error) {
    console.error('Error updating house:', error);
    throw error;
  }
}

/**
 * Delete a house with cascade delete of associated Codex entry
 *
 * @param {number} id - House ID to delete
 * @param {Object} [options] - Options for deletion
 * @param {boolean} [options.skipCodexDeletion=false] - Skip cascade deletion of Codex entry
 * @param {string} [options.datasetId] - Dataset ID (optional, defaults to 'default')
 * @returns {Promise<void>}
 */
export async function deleteHouse(id, options = {}) {
  try {
    const database = getDatabase(options.datasetId);

    // Cascade delete Codex entry if it exists (unless explicitly skipped)
    if (!options.skipCodexDeletion) {
      try {
        // Use dynamic import to avoid circular dependency
        const { getEntryByHouseId, deleteEntry } = await import('./codexService.js');

        // Find and delete the associated Codex entry
        const codexEntry = await getEntryByHouseId(id, options.datasetId);
        if (codexEntry) {
          await deleteEntry(codexEntry.id, options.datasetId);
          console.log('📚 Cascade deleted Codex entry for house:', codexEntry.id);
        }
      } catch (codexError) {
        // Log but don't fail the house deletion if Codex deletion fails
        console.warn('⚠️ Could not cascade delete Codex entry for house:', codexError);
      }
    }

    await database.houses.delete(id);
    console.log('House deleted:', id);
  } catch (error) {
    console.error('Error deleting house:', error);
    throw error;
  }
}

// ==================== RELATIONSHIP OPERATIONS ====================

export async function addRelationship(relationshipData, datasetId) {
  try {
    const database = getDatabase(datasetId);
    const id = await database.relationships.add(relationshipData);
    console.log('Relationship added with ID:', id);
    return id;
  } catch (error) {
    console.error('Error adding relationship:', error);
    throw error;
  }
}

export async function getRelationshipsForPerson(personId, datasetId) {
  try {
    const database = getDatabase(datasetId);
    const relationships = await database.relationships
      .where('person1Id').equals(personId)
      .or('person2Id').equals(personId)
      .toArray();
    return relationships;
  } catch (error) {
    console.error('Error getting relationships:', error);
    throw error;
  }
}

export async function getAllRelationships(datasetId) {
  try {
    const database = getDatabase(datasetId);
    const relationships = await database.relationships.toArray();
    return relationships;
  } catch (error) {
    console.error('Error getting all relationships:', error);
    throw error;
  }
}

export async function updateRelationship(id, updates, datasetId) {
  try {
    const database = getDatabase(datasetId);
    const result = await database.relationships.update(id, updates);
    console.log('Relationship updated:', result);
    return result;
  } catch (error) {
    console.error('Error updating relationship:', error);
    throw error;
  }
}

export async function deleteRelationship(id, datasetId) {
  try {
    const database = getDatabase(datasetId);
    await database.relationships.delete(id);
    console.log('Relationship deleted:', id);
  } catch (error) {
    console.error('Error deleting relationship:', error);
    throw error;
  }
}

// ==================== CADET HOUSE OPERATIONS ====================

export function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return null;
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/**
 * Check if a person is eligible to found a cadet house
 * 
 * TIER 1 (Noble Cadet) eligibility:
 * - Must be legitimate
 * - Must be at least 18
 * - Must not have already founded a house
 * - Typically second/third sons (not enforced here)
 * 
 * TIER 2 (Bastard Elevation) eligibility:
 * - Must be a bastard
 * - Must be at least 18
 * - Must not have already founded a house (bastardStatus !== 'founded')
 * - Must not have been legitimized (bastardStatus !== 'legitimized')
 * 
 * @param {Object} person - Person object
 * @param {string} person.dateOfBirth - Date of birth
 * @param {string} person.legitimacyStatus - Legitimacy status
 * @param {string} [person.bastardStatus] - Bastard status if applicable
 * @returns {{eligible: boolean, tier: number|null, reason: string|null}}
 */
export function isEligibleForCeremony(person) {
  // Must have a birth date
  if (!person.dateOfBirth) {
    return { eligible: false, tier: null, reason: 'No birth date recorded' };
  }
  
  // Must be at least 18
  const age = calculateAge(person.dateOfBirth);
  if (age < 18) {
    return { eligible: false, tier: null, reason: `Must be at least 18 (currently ${age})` };
  }
  
  // Check for bastards (Tier 2)
  if (person.legitimacyStatus === 'bastard') {
    // Already founded a house
    if (person.bastardStatus === 'founded') {
      return { eligible: false, tier: null, reason: 'Already founded a cadet house' };
    }
    // Already legitimized (no longer a bastard)
    if (person.bastardStatus === 'legitimized') {
      return { eligible: false, tier: null, reason: 'Has been legitimized' };
    }
    // Eligible for Tier 2
    return { eligible: true, tier: 2, reason: null };
  }
  
  // Check for legitimate nobles (Tier 1)
  if (person.legitimacyStatus === 'legitimate') {
    // Must belong to a house
    if (!person.houseId) {
      return { eligible: false, tier: null, reason: 'Must belong to a noble house' };
    }
    // Eligible for Tier 1
    return { eligible: true, tier: 1, reason: null };
  }
  
  // Other statuses (adopted, commoner, unknown) are not eligible
  return { eligible: false, tier: null, reason: `Cannot found house with status: ${person.legitimacyStatus}` };
}

/**
 * Legacy function for backward compatibility
 * Returns boolean instead of object
 * @deprecated Use isEligibleForCeremony(person).eligible instead
 */
export function canFoundCadetHouse(person) {
  return isEligibleForCeremony(person).eligible;
}

/**
 * Found a cadet house - supports two-tier system
 * 
 * TIER 1 - Noble Cadet Branch:
 * - Founder: Legitimate second/third son
 * - Naming: First 4 letters of parent house + suffix (e.g., Wilfford)
 * - Status: Full noble standing
 * 
 * TIER 2 - Bastard Elevation Branch:
 * - Founder: Acknowledged bastard who has proven themselves
 * - Naming: "Dun" + first 4 letters + suffix (e.g., Dunwilfhollow)
 * - Status: Recognized but lesser standing, bastard origins visible
 * 
 * @param {Object} ceremonyData - Ceremony details
 * @param {number} ceremonyData.founderId - ID of the person founding the house
 * @param {string} ceremonyData.houseName - Name of the new house
 * @param {number} ceremonyData.parentHouseId - ID of the parent house
 * @param {number} [ceremonyData.cadetTier] - 1 for noble cadet, 2 for bastard elevation
 * @param {string} [ceremonyData.foundingType] - 'noble' or 'bastard-elevation'
 * @param {string} [ceremonyData.ceremonyDate] - Date of founding (ISO format)
 * @param {string} [ceremonyData.motto] - House motto
 * @param {string} [ceremonyData.colorCode] - House color (hex)
 * @param {string} [datasetId] - Dataset ID
 * @returns {Promise<{house: Object, founder: Object}>}
 */
export async function foundCadetHouse(ceremonyData, datasetId) {
  const {
    founderId,
    houseName,
    parentHouseId,
    cadetTier = 1,
    foundingType = 'noble',
    ceremonyDate,
    motto = null,
    colorCode = null
  } = ceremonyData;

  try {
    const founder = await getPerson(founderId, datasetId);
    if (!founder) {
      throw new Error('Founder not found');
    }

    const parentHouse = await getHouse(parentHouseId, datasetId);
    if (!parentHouse) {
      throw new Error('Parent house not found');
    }

    // Determine if this is a bastard-founded house
    const isBastardFounded = cadetTier === 2 || foundingType === 'bastard-elevation' || founder.legitimacyStatus === 'bastard';
    const actualTier = isBastardFounded ? 2 : 1;
    const actualFoundingType = isBastardFounded ? 'bastard-elevation' : 'noble';

    // Build notes based on tier
    const tierDescription = actualTier === 2 
      ? `Bastard-elevated branch of ${parentHouse.houseName}` 
      : `Cadet branch of ${parentHouse.houseName}`;

    const newHouseId = await addHouse({
      houseName: houseName,
      parentHouseId: parentHouseId,
      houseType: 'cadet',
      cadetTier: actualTier,
      foundingType: actualFoundingType,
      foundedBy: founderId,
      foundedDate: ceremonyDate,
      swornTo: parentHouseId,
      namePrefix: parentHouse.namePrefix || parentHouse.houseName.substring(0, 4),
      sigil: null,
      motto: motto,
      colorCode: colorCode || parentHouse.colorCode,
      notes: `${tierDescription}, founded by ${founder.firstName} ${founder.lastName}`
    }, { datasetId });

    // Update founder - for bastard elevation, they become legitimate within their new house
    // but the Dun- prefix in the house name marks their origins
    await updatePerson(founderId, {
      houseId: newHouseId,
      lastName: houseName,
      bastardStatus: isBastardFounded ? 'founded' : null,
      legitimacyStatus: 'legitimate' // Now legitimate as head of their own house
    }, datasetId);

    const newHouse = await getHouse(newHouseId, datasetId);
    const updatedFounder = await getPerson(founderId, datasetId);

    console.log(`🏰 Founded ${actualTier === 2 ? 'Tier 2 (Bastard Elevation)' : 'Tier 1 (Noble Cadet)'} house: ${houseName}`);

    return {
      house: newHouse,
      founder: updatedFounder
    };
  } catch (error) {
    console.error('Error founding cadet house:', error);
    throw error;
  }
}

// ==================== DELETE ALL DATA ====================

/**
 * Delete all data from all tables
 *
 * IMPORTANT: This clears ALL tables including Codex data.
 * Used primarily during cloud sync when downloading fresh data.
 *
 * @param {string} [datasetId] - Dataset ID (optional, defaults to 'default')
 */
export async function deleteAllData(datasetId) {
  try {
    const database = getDatabase(datasetId);

    // Clear all core tables
    await database.people.clear();
    await database.houses.clear();
    await database.relationships.clear();

    // Clear Codex tables (CRITICAL - prevents duplicates during sync)
    await database.codexEntries.clear();
    await database.codexLinks.clear();

    // Clear other tables
    await database.acknowledgedDuplicates.clear();

    // Clear heraldry tables if they exist
    if (database.heraldry) await database.heraldry.clear();
    if (database.heraldryLinks) await database.heraldryLinks.clear();

    // Clear dignities tables if they exist
    if (database.dignities) await database.dignities.clear();
    if (database.dignityTenures) await database.dignityTenures.clear();
    if (database.dignityLinks) await database.dignityLinks.clear();

    // Clear bugs table if it exists
    if (database.bugs) await database.bugs.clear();

    // Clear household roles table if it exists
    if (database.householdRoles) await database.householdRoles.clear();

    console.log('✅ All data deleted successfully (including Codex, Dignities, Household Roles, and Bugs)');
    return true;
  } catch (error) {
    console.error('❌ Error deleting all data:', error);
    throw error;
  }
}

/**
 * Delete only genealogy data (people, houses, relationships)
 * Preserves Codex entries - useful for some operations
 *
 * @param {string} [datasetId] - Dataset ID (optional, defaults to 'default')
 */
export async function deleteGenealogyData(datasetId) {
  try {
    const database = getDatabase(datasetId);
    await database.people.clear();
    await database.houses.clear();
    await database.relationships.clear();
    await database.acknowledgedDuplicates.clear();

    console.log('✅ Genealogy data deleted (Codex preserved)');
    return true;
  } catch (error) {
    console.error('❌ Error deleting genealogy data:', error);
    throw error;
  }
}

// ==================== ACKNOWLEDGED DUPLICATES (NAMESAKES) ====================

/**
 * Check if two people have been acknowledged as not-duplicates
 * Returns true if they've been acknowledged (in either direction)
 *
 * @param {number} person1Id - First person ID
 * @param {number} person2Id - Second person ID
 * @param {string} [datasetId] - Dataset ID (optional, defaults to 'default')
 */
export async function isAcknowledgedDuplicate(person1Id, person2Id, datasetId) {
  try {
    const database = getDatabase(datasetId);
    const found = await database.acknowledgedDuplicates
      .where('person1Id').equals(person1Id)
      .and(item => item.person2Id === person2Id)
      .first();

    if (found) return true;

    // Check reverse direction
    const foundReverse = await database.acknowledgedDuplicates
      .where('person1Id').equals(person2Id)
      .and(item => item.person2Id === person1Id)
      .first();

    return !!foundReverse;
  } catch (error) {
    console.error('Error checking acknowledged duplicate:', error);
    return false;
  }
}

/**
 * Get all acknowledged duplicate pairs
 *
 * @param {string} [datasetId] - Dataset ID (optional, defaults to 'default')
 */
export async function getAllAcknowledgedDuplicates(datasetId) {
  try {
    const database = getDatabase(datasetId);
    return await database.acknowledgedDuplicates.toArray();
  } catch (error) {
    console.error('Error getting acknowledged duplicates:', error);
    return [];
  }
}

/**
 * Acknowledge that two people are NOT duplicates (they're namesakes)
 * This prevents future duplicate warnings for this pair
 *
 * @param {number} person1Id - First person ID
 * @param {number} person2Id - Second person ID
 * @param {string} [datasetId] - Dataset ID (optional, defaults to 'default')
 */
export async function acknowledgeDuplicate(person1Id, person2Id, datasetId) {
  try {
    const database = getDatabase(datasetId);

    // Check if already acknowledged
    const exists = await isAcknowledgedDuplicate(person1Id, person2Id, datasetId);
    if (exists) {
      console.log('Duplicate already acknowledged');
      return null;
    }

    const id = await database.acknowledgedDuplicates.add({
      person1Id: parseInt(person1Id),
      person2Id: parseInt(person2Id),
      acknowledgedAt: new Date().toISOString()
    });

    console.log('Duplicate acknowledged with ID:', id);
    return id;
  } catch (error) {
    console.error('Error acknowledging duplicate:', error);
    throw error;
  }
}

/**
 * Remove an acknowledged duplicate (if you want warnings again)
 *
 * @param {number} person1Id - First person ID
 * @param {number} person2Id - Second person ID
 * @param {string} [datasetId] - Dataset ID (optional, defaults to 'default')
 */
export async function removeAcknowledgedDuplicate(person1Id, person2Id, datasetId) {
  try {
    const database = getDatabase(datasetId);

    // Delete in both directions
    await database.acknowledgedDuplicates
      .where('person1Id').equals(person1Id)
      .and(item => item.person2Id === person2Id)
      .delete();

    await database.acknowledgedDuplicates
      .where('person1Id').equals(person2Id)
      .and(item => item.person2Id === person1Id)
      .delete();

    console.log('Acknowledged duplicate removed');
    return true;
  } catch (error) {
    console.error('Error removing acknowledged duplicate:', error);
    throw error;
  }
}

/**
 * Get all "named-after" relationships for a person
 * These are relationships where relationshipType === 'named-after'
 *
 * @param {number} personId - Person ID
 * @param {string} [datasetId] - Dataset ID (optional, defaults to 'default')
 */
export async function getNamedAfterRelationships(personId, datasetId) {
  try {
    const database = getDatabase(datasetId);
    const relationships = await database.relationships
      .where('person1Id').equals(personId)
      .and(item => item.relationshipType === 'named-after')
      .toArray();

    // Also check reverse (person is the one someone was named after)
    const reverseRelationships = await database.relationships
      .where('person2Id').equals(personId)
      .and(item => item.relationshipType === 'named-after')
      .toArray();

    return {
      namedAfter: relationships,      // People this person was named after
      namesakes: reverseRelationships  // People named after this person
    };
  } catch (error) {
    console.error('Error getting named-after relationships:', error);
    return { namedAfter: [], namesakes: [] };
  }
}

export default db;
