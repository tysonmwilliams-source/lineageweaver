/**
 * Migration Service - Data Integration Migrations
 *
 * PURPOSE:
 * Handles data migrations for integrating existing records with new systems.
 * Run these migrations after upgrading to ensure full data connectivity.
 *
 * MIGRATIONS:
 * - migrateHousesToCodex: Creates Codex entries for houses without them
 * - migrateDignitiesToCodex: Creates Codex entries for dignities without them
 * - runAllMigrations: Runs all pending migrations
 */

import { db, getDatabase, DEFAULT_DATASET_ID } from './database';
import {
  createEntry,
  createLink,
  getEntryByPersonId,
  getEntryByHouseId,
  getEntryByDignityId,
  getOutgoingLinks,
  getAllEntries
} from './codexService';
import { getAllDignities, updateDignity, DIGNITY_CLASSES } from './dignityService';
import { syncAddCodexLink } from './dataSyncService';
import {
  createDataset,
  getDataset,
  setActiveDatasetId,
  DEFAULT_DATASET_ID as DATASET_DEFAULT_ID
} from './datasetService';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { db as firestoreDb } from '../config/firebase';

// ==================== HOUSE → CODEX MIGRATION ====================

/**
 * Migrate existing houses to have Codex entries
 *
 * Finds all houses that don't have a codexEntryId and creates
 * Codex entries for them.
 *
 * @returns {Promise<Object>} Migration results
 */
export async function migrateHousesToCodex() {
  console.log('📚 Starting House → Codex migration...');

  const results = {
    total: 0,
    migrated: 0,
    skipped: 0,
    errors: []
  };

  try {
    const houses = await db.houses.toArray();
    results.total = houses.length;

    for (const house of houses) {
      try {
        // Skip if already has codexEntryId
        if (house.codexEntryId) {
          results.skipped++;
          continue;
        }

        // Check if a Codex entry already exists for this house (by houseId)
        const existingEntry = await getEntryByHouseId(house.id);
        if (existingEntry) {
          // Link the existing entry to the house
          await db.houses.update(house.id, { codexEntryId: existingEntry.id });
          results.skipped++;
          console.log(`📚 House "${house.houseName}" already has Codex entry, linked.`);
          continue;
        }

        // Create a new Codex entry for this house
        const codexEntryId = await createEntry({
          type: 'house',
          title: `House ${house.houseName}`,
          subtitle: house.houseType === 'cadet' ? 'Cadet Branch' : 'Noble House',
          content: house.notes || '',
          category: house.houseType || 'main',
          tags: ['house', house.houseType || 'main'].filter(Boolean),
          houseId: house.id
        });

        // Update the house with the codexEntryId
        await db.houses.update(house.id, { codexEntryId });

        results.migrated++;
        console.log(`📚 Created Codex entry for House "${house.houseName}": ${codexEntryId}`);

      } catch (error) {
        results.errors.push({
          houseId: house.id,
          houseName: house.houseName,
          error: error.message
        });
        console.error(`❌ Error migrating house "${house.houseName}":`, error);
      }
    }

    console.log(`📚 House → Codex migration complete:`, results);
    return results;

  } catch (error) {
    console.error('❌ House → Codex migration failed:', error);
    throw error;
  }
}

// ==================== DIGNITY → CODEX MIGRATION ====================

/**
 * Migrate existing dignities to have Codex entries
 *
 * Finds all dignities that don't have a codexEntryId and creates
 * Codex entries for them.
 *
 * @returns {Promise<Object>} Migration results
 */
export async function migrateDignitiesToCodex() {
  console.log('📚 Starting Dignity → Codex migration...');

  const results = {
    total: 0,
    migrated: 0,
    skipped: 0,
    errors: []
  };

  try {
    const dignities = await getAllDignities();
    results.total = dignities.length;

    for (const dignity of dignities) {
      try {
        // Skip if already has codexEntryId
        if (dignity.codexEntryId) {
          results.skipped++;
          continue;
        }

        // Check if a Codex entry already exists for this dignity (by dignityId)
        const existingEntry = await getEntryByDignityId(dignity.id);
        if (existingEntry) {
          // Link the existing entry to the dignity
          await updateDignity(dignity.id, { codexEntryId: existingEntry.id });
          results.skipped++;
          console.log(`📚 Dignity "${dignity.name}" already has Codex entry, linked.`);
          continue;
        }

        // Create a new Codex entry for this dignity
        const codexEntryId = await createEntry({
          type: 'mysteria',
          title: dignity.name,
          subtitle: dignity.dignityRank
            ? `${DIGNITY_CLASSES[dignity.dignityClass]?.name || dignity.dignityClass} Dignity`
            : 'Dignity',
          content: dignity.notes || '',
          category: dignity.dignityClass || 'driht',
          tags: ['dignity', dignity.dignityClass, dignity.dignityRank].filter(Boolean),
          dignityId: dignity.id
        });

        // Update the dignity with the codexEntryId
        await updateDignity(dignity.id, { codexEntryId });

        results.migrated++;
        console.log(`📚 Created Codex entry for Dignity "${dignity.name}": ${codexEntryId}`);

      } catch (error) {
        results.errors.push({
          dignityId: dignity.id,
          dignityName: dignity.name,
          error: error.message
        });
        console.error(`❌ Error migrating dignity "${dignity.name}":`, error);
      }
    }

    console.log(`📚 Dignity → Codex migration complete:`, results);
    return results;

  } catch (error) {
    console.error('❌ Dignity → Codex migration failed:', error);
    throw error;
  }
}

// ==================== CROSS-LINKING MIGRATIONS ====================

/**
 * Check if a link already exists between two Codex entries
 *
 * @param {number} sourceId - Source entry ID
 * @param {number} targetId - Target entry ID
 * @returns {Promise<boolean>} True if link exists
 */
async function linkExists(sourceId, targetId) {
  const outgoing = await getOutgoingLinks(sourceId);
  return outgoing.some(link => link.targetId === targetId);
}

/**
 * Create bidirectional link between two Codex entries if it doesn't exist
 *
 * @param {number} entryId1 - First entry ID
 * @param {number} entryId2 - Second entry ID
 * @param {string} type - Link type
 * @param {string} label - Link label
 * @param {Object} syncContext - Optional sync context { userId, datasetId }
 * @returns {Promise<boolean>} True if link was created
 */
async function createBidirectionalLink(entryId1, entryId2, type, label, syncContext = null) {
  if (!entryId1 || !entryId2 || entryId1 === entryId2) return false;

  const exists = await linkExists(entryId1, entryId2);
  if (exists) return false;

  const linkData = {
    sourceId: entryId1,
    targetId: entryId2,
    type,
    label,
    bidirectional: true
  };

  const linkId = await createLink(linkData);

  // Sync to cloud if userId is provided
  if (syncContext?.userId && linkId) {
    syncAddCodexLink(syncContext.userId, syncContext.datasetId, linkId, linkData);
  }

  return true;
}

/**
 * Migrate Person ↔ House Codex cross-links
 *
 * Creates links between a person's Codex entry and their house's Codex entry.
 *
 * @param {Object} syncContext - Optional sync context { userId, datasetId }
 * @returns {Promise<Object>} Migration results
 */
export async function migratePersonHouseLinks(syncContext = null) {
  console.log('🔗 Starting Person ↔ House cross-linking...');

  const results = {
    total: 0,
    linked: 0,
    skipped: 0,
    errors: []
  };

  try {
    const people = await db.people.toArray();
    results.total = people.length;

    for (const person of people) {
      try {
        // Skip if person has no house
        if (!person.houseId) {
          results.skipped++;
          continue;
        }

        // Get person's Codex entry
        const personEntry = await getEntryByPersonId(person.id);
        if (!personEntry) {
          results.skipped++;
          continue;
        }

        // Get house's Codex entry
        const houseEntry = await getEntryByHouseId(person.houseId);
        if (!houseEntry) {
          results.skipped++;
          continue;
        }

        // Create bidirectional link
        const created = await createBidirectionalLink(
          personEntry.id,
          houseEntry.id,
          'member-of',
          'House Member',
          syncContext
        );

        if (created) {
          results.linked++;
          console.log(`🔗 Linked ${person.firstName} ${person.lastName} ↔ House Codex entry`);
        } else {
          results.skipped++;
        }

      } catch (error) {
        results.errors.push({
          personId: person.id,
          personName: `${person.firstName} ${person.lastName}`,
          error: error.message
        });
      }
    }

    console.log('🔗 Person ↔ House cross-linking complete:', results);
    return results;

  } catch (error) {
    console.error('❌ Person ↔ House cross-linking failed:', error);
    throw error;
  }
}

/**
 * Migrate Person ↔ Dignity Codex cross-links
 *
 * Creates links between a person's Codex entry and their dignity's Codex entry.
 * Links current holders of dignities.
 *
 * @param {Object} syncContext - Optional sync context { userId, datasetId }
 * @returns {Promise<Object>} Migration results
 */
export async function migratePersonDignityLinks(syncContext = null) {
  console.log('🔗 Starting Person ↔ Dignity cross-linking...');

  const results = {
    total: 0,
    linked: 0,
    skipped: 0,
    errors: []
  };

  try {
    const dignities = await getAllDignities();
    results.total = dignities.length;

    for (const dignity of dignities) {
      try {
        // Skip if dignity has no current holder
        if (!dignity.currentHolderId) {
          results.skipped++;
          continue;
        }

        // Get dignity's Codex entry
        const dignityEntry = await getEntryByDignityId(dignity.id);
        if (!dignityEntry) {
          results.skipped++;
          continue;
        }

        // Get person's Codex entry
        const personEntry = await getEntryByPersonId(dignity.currentHolderId);
        if (!personEntry) {
          results.skipped++;
          continue;
        }

        // Create bidirectional link
        const created = await createBidirectionalLink(
          personEntry.id,
          dignityEntry.id,
          'holds-title',
          'Current Holder',
          syncContext
        );

        if (created) {
          results.linked++;
          console.log(`🔗 Linked Person ↔ Dignity "${dignity.name}" Codex entries`);
        } else {
          results.skipped++;
        }

      } catch (error) {
        results.errors.push({
          dignityId: dignity.id,
          dignityName: dignity.name,
          error: error.message
        });
      }
    }

    console.log('🔗 Person ↔ Dignity cross-linking complete:', results);
    return results;

  } catch (error) {
    console.error('❌ Person ↔ Dignity cross-linking failed:', error);
    throw error;
  }
}

/**
 * Migrate House ↔ Dignity Codex cross-links
 *
 * Creates links between a house's Codex entry and dignities held by that house.
 *
 * @param {Object} syncContext - Optional sync context { userId, datasetId }
 * @returns {Promise<Object>} Migration results
 */
export async function migrateHouseDignityLinks(syncContext = null) {
  console.log('🔗 Starting House ↔ Dignity cross-linking...');

  const results = {
    total: 0,
    linked: 0,
    skipped: 0,
    errors: []
  };

  try {
    const dignities = await getAllDignities();
    results.total = dignities.length;

    for (const dignity of dignities) {
      try {
        // Skip if dignity has no current house
        if (!dignity.currentHouseId) {
          results.skipped++;
          continue;
        }

        // Get dignity's Codex entry
        const dignityEntry = await getEntryByDignityId(dignity.id);
        if (!dignityEntry) {
          results.skipped++;
          continue;
        }

        // Get house's Codex entry
        const houseEntry = await getEntryByHouseId(dignity.currentHouseId);
        if (!houseEntry) {
          results.skipped++;
          continue;
        }

        // Create bidirectional link
        const created = await createBidirectionalLink(
          houseEntry.id,
          dignityEntry.id,
          'house-holds',
          'House Title',
          syncContext
        );

        if (created) {
          results.linked++;
          console.log(`🔗 Linked House ↔ Dignity "${dignity.name}" Codex entries`);
        } else {
          results.skipped++;
        }

      } catch (error) {
        results.errors.push({
          dignityId: dignity.id,
          dignityName: dignity.name,
          error: error.message
        });
      }
    }

    console.log('🔗 House ↔ Dignity cross-linking complete:', results);
    return results;

  } catch (error) {
    console.error('❌ House ↔ Dignity cross-linking failed:', error);
    throw error;
  }
}

/**
 * Run all cross-linking migrations
 *
 * @param {Object} syncContext - Optional sync context { userId, datasetId }
 * @returns {Promise<Object>} Combined results
 */
export async function runCrossLinkingMigrations(syncContext = null) {
  console.log('🔗 Running all cross-linking migrations...');

  const results = {
    personHouse: null,
    personDignity: null,
    houseDignity: null,
    success: true,
    totalLinked: 0,
    errors: []
  };

  try {
    results.personHouse = await migratePersonHouseLinks(syncContext);
    results.totalLinked += results.personHouse.linked;
    if (results.personHouse.errors.length > 0) {
      results.errors.push(...results.personHouse.errors);
    }

    results.personDignity = await migratePersonDignityLinks(syncContext);
    results.totalLinked += results.personDignity.linked;
    if (results.personDignity.errors.length > 0) {
      results.errors.push(...results.personDignity.errors);
    }

    results.houseDignity = await migrateHouseDignityLinks(syncContext);
    results.totalLinked += results.houseDignity.linked;
    if (results.houseDignity.errors.length > 0) {
      results.errors.push(...results.houseDignity.errors);
    }

    results.success = results.errors.length === 0;

    console.log('🔗 All cross-linking migrations complete!', {
      personHouseLinked: results.personHouse?.linked || 0,
      personDignityLinked: results.personDignity?.linked || 0,
      houseDignityLinked: results.houseDignity?.linked || 0,
      totalLinked: results.totalLinked
    });

    return results;

  } catch (error) {
    console.error('❌ Cross-linking migrations failed:', error);
    results.success = false;
    results.errors.push({ type: 'fatal', error: error.message });
    return results;
  }
}

// ==================== RUN ALL MIGRATIONS ====================

/**
 * Run all pending data migrations
 *
 * This is the main entry point for running all migrations.
 * Safe to run multiple times - migrations are idempotent.
 *
 * @param {Object} syncContext - Optional sync context { userId, datasetId } for cloud sync
 * @returns {Promise<Object>} Combined migration results
 */
export async function runAllMigrations(syncContext = null) {
  console.log('🔄 Running all data migrations...');

  const results = {
    houses: null,
    dignities: null,
    crossLinks: null,
    success: true,
    errors: []
  };

  try {
    // Run House → Codex migration
    results.houses = await migrateHousesToCodex();
    if (results.houses.errors.length > 0) {
      results.errors.push(...results.houses.errors);
    }

    // Run Dignity → Codex migration
    results.dignities = await migrateDignitiesToCodex();
    if (results.dignities.errors.length > 0) {
      results.errors.push(...results.dignities.errors);
    }

    // Run cross-linking migrations (with sync context for cloud persistence)
    results.crossLinks = await runCrossLinkingMigrations(syncContext);
    if (results.crossLinks.errors.length > 0) {
      results.errors.push(...results.crossLinks.errors);
    }

    results.success = results.errors.length === 0;

    console.log('🔄 All migrations complete!', {
      housesMigrated: results.houses?.migrated || 0,
      dignitiesMigrated: results.dignities?.migrated || 0,
      crossLinksCreated: results.crossLinks?.totalLinked || 0,
      totalErrors: results.errors.length
    });

    return results;

  } catch (error) {
    console.error('❌ Migration process failed:', error);
    results.success = false;
    results.errors.push({ type: 'fatal', error: error.message });
    return results;
  }
}

// ==================== MIGRATION STATUS ====================

/**
 * Check migration status - how many records need migration
 *
 * @returns {Promise<Object>} Status of pending migrations
 */
export async function getMigrationStatus() {
  try {
    const houses = await db.houses.toArray();
    const dignities = await getAllDignities();
    const people = await db.people.toArray();
    const codexLinks = await db.codexLinks.toArray();

    const housesWithoutCodex = houses.filter(h => !h.codexEntryId).length;
    const dignitiesWithoutCodex = dignities.filter(d => !d.codexEntryId).length;

    // Count potential cross-links needed
    // Person ↔ House links (people with houses that have Codex entries)
    const peopleWithHouses = people.filter(p => p.houseId).length;

    // Person ↔ Dignity links (dignities with current holders)
    const dignitiesWithHolders = dignities.filter(d => d.currentHolderId).length;

    // House ↔ Dignity links (dignities with current houses)
    const dignitiesWithHouses = dignities.filter(d => d.currentHouseId).length;

    // Count existing cross-links by type
    const memberOfLinks = codexLinks.filter(l => l.type === 'member-of').length;
    const holdsTitleLinks = codexLinks.filter(l => l.type === 'holds-title').length;
    const houseHoldsLinks = codexLinks.filter(l => l.type === 'house-holds').length;

    const potentialCrossLinks = peopleWithHouses + dignitiesWithHolders + dignitiesWithHouses;
    const existingCrossLinks = memberOfLinks + holdsTitleLinks + houseHoldsLinks;

    return {
      houses: {
        total: houses.length,
        withCodex: houses.length - housesWithoutCodex,
        needsMigration: housesWithoutCodex
      },
      dignities: {
        total: dignities.length,
        withCodex: dignities.length - dignitiesWithoutCodex,
        needsMigration: dignitiesWithoutCodex
      },
      crossLinks: {
        personHouse: {
          potential: peopleWithHouses,
          existing: memberOfLinks
        },
        personDignity: {
          potential: dignitiesWithHolders,
          existing: holdsTitleLinks
        },
        houseDignity: {
          potential: dignitiesWithHouses,
          existing: houseHoldsLinks
        },
        total: {
          potential: potentialCrossLinks,
          existing: existingCrossLinks,
          needsMigration: potentialCrossLinks > existingCrossLinks
        }
      },
      needsMigration: housesWithoutCodex > 0 || dignitiesWithoutCodex > 0 || potentialCrossLinks > existingCrossLinks
    };
  } catch (error) {
    console.error('❌ Error checking migration status:', error);
    throw error;
  }
}

// ==================== DATASET STRUCTURE MIGRATION ====================

/**
 * Collections that need to be migrated to the new dataset structure
 */
const ENTITY_COLLECTIONS = [
  'people',
  'houses',
  'relationships',
  'codexEntries',
  'codexLinks',
  'acknowledgedDuplicates',
  'heraldry',
  'heraldryLinks',
  'dignities',
  'dignityTenures',
  'dignityLinks',
  'bugs',
  'householdRoles'
];

/**
 * Check if user needs dataset structure migration
 *
 * Returns true if:
 * - User has data in old structure (users/{userId}/{collection})
 * - AND does NOT have datasetsMetadata collection
 *
 * @param {string} userId - The user's Firebase UID
 * @returns {Promise<boolean>} True if migration is needed
 */
export async function needsDatasetMigration(userId) {
  if (!userId) return false;

  try {
    // Check if datasetsMetadata collection exists
    const metadataRef = collection(firestoreDb, 'users', userId, 'datasetsMetadata');
    const metadataSnapshot = await getDocs(metadataRef);

    // If user already has dataset metadata, no migration needed
    if (!metadataSnapshot.empty) {
      console.log('📂 User already has dataset structure');
      return false;
    }

    // Check if user has any data in old structure
    // Just check 'people' collection as a quick test
    const oldPeopleRef = collection(firestoreDb, 'users', userId, 'people');
    const oldPeopleSnapshot = await getDocs(oldPeopleRef);

    if (!oldPeopleSnapshot.empty) {
      console.log('📂 User has old structure data, migration needed');
      return true;
    }

    // No old data and no new structure = new user, will be set up fresh
    console.log('📂 New user, no migration needed');
    return false;

  } catch (error) {
    console.error('❌ Error checking dataset migration:', error);
    return false;
  }
}

/**
 * Migrate existing user data to the new dataset structure
 *
 * This migration:
 * 1. Creates "Default" dataset metadata in Firestore
 * 2. Moves all existing data from users/{userId}/{collection}
 *    to users/{userId}/datasets/default/{collection}
 * 3. Cleans up old data structure
 * 4. Sets activeDatasetId in localStorage to 'default'
 *
 * Safe to run multiple times - checks if migration is needed first.
 *
 * @param {string} userId - The user's Firebase UID
 * @returns {Promise<Object>} Migration results
 */
export async function migrateToDatasetStructure(userId) {
  console.log('📂 Starting dataset structure migration for user:', userId);

  const results = {
    success: false,
    collectionsProcessed: 0,
    documentsMovedTotal: 0,
    documentsByCollection: {},
    errors: []
  };

  if (!userId) {
    results.errors.push({ type: 'validation', error: 'No userId provided' });
    return results;
  }

  try {
    // Check if migration is actually needed
    const needsMigration = await needsDatasetMigration(userId);
    if (!needsMigration) {
      console.log('📂 No migration needed, skipping');
      results.success = true;
      return results;
    }

    // Step 1: Create Default dataset metadata
    console.log('📂 Step 1: Creating Default dataset metadata...');
    const existingDefault = await getDataset(userId, DATASET_DEFAULT_ID);
    if (!existingDefault) {
      await createDataset(userId, {
        id: DATASET_DEFAULT_ID,
        name: 'Default',
        isDefault: true
      });
      console.log('📂 Created Default dataset metadata');
    } else {
      console.log('📂 Default dataset metadata already exists');
    }

    // Step 2: Move data from old structure to new structure
    console.log('📂 Step 2: Moving data to new structure...');

    for (const collectionName of ENTITY_COLLECTIONS) {
      try {
        // Get all documents from old location
        const oldCollRef = collection(firestoreDb, 'users', userId, collectionName);
        const snapshot = await getDocs(oldCollRef);

        if (snapshot.empty) {
          console.log(`📂 Collection "${collectionName}" is empty, skipping`);
          results.documentsByCollection[collectionName] = 0;
          continue;
        }

        const docCount = snapshot.docs.length;
        console.log(`📂 Moving ${docCount} documents from "${collectionName}"...`);

        // Use batched writes for efficiency (max 500 operations per batch)
        const batchSize = 250; // Each doc needs 2 ops: set + delete
        let processed = 0;

        while (processed < snapshot.docs.length) {
          const batch = writeBatch(firestoreDb);
          const batchDocs = snapshot.docs.slice(processed, processed + batchSize);

          for (const docSnap of batchDocs) {
            const data = docSnap.data();

            // New location: users/{userId}/datasets/default/{collection}/{docId}
            const newDocRef = doc(
              firestoreDb,
              'users',
              userId,
              'datasets',
              DATASET_DEFAULT_ID,
              collectionName,
              docSnap.id
            );

            // Copy to new location
            batch.set(newDocRef, data);

            // Delete from old location
            batch.delete(docSnap.ref);
          }

          await batch.commit();
          processed += batchDocs.length;
          console.log(`📂 Batch processed: ${processed}/${docCount} in "${collectionName}"`);
        }

        results.collectionsProcessed++;
        results.documentsMovedTotal += docCount;
        results.documentsByCollection[collectionName] = docCount;
        console.log(`📂 Completed "${collectionName}": ${docCount} documents moved`);

      } catch (collError) {
        console.error(`❌ Error migrating collection "${collectionName}":`, collError);
        results.errors.push({
          type: 'collection',
          collection: collectionName,
          error: collError.message
        });
      }
    }

    // Step 3: Set active dataset in localStorage
    console.log('📂 Step 3: Setting active dataset...');
    setActiveDatasetId(DATASET_DEFAULT_ID);

    results.success = results.errors.length === 0;

    console.log('📂 Dataset structure migration complete:', {
      collectionsProcessed: results.collectionsProcessed,
      documentsMovedTotal: results.documentsMovedTotal,
      errors: results.errors.length
    });

    return results;

  } catch (error) {
    console.error('❌ Dataset structure migration failed:', error);
    results.errors.push({ type: 'fatal', error: error.message });
    return results;
  }
}

/**
 * Migrate local IndexedDB to new dataset-aware structure
 *
 * Note: This is handled automatically by the database.js changes.
 * The old "LineageweaverDB" will be replaced by "LineageweaverDB_default".
 * This function is provided for explicit migration if needed.
 *
 * @returns {Promise<Object>} Migration results
 */
export async function migrateLocalDatabase() {
  console.log('📂 Checking local database migration...');

  const results = {
    success: false,
    action: 'none',
    error: null
  };

  try {
    // Check if old database exists
    const databases = await indexedDB.databases();
    const oldDbExists = databases.some(db => db.name === 'LineageweaverDB');
    const newDbExists = databases.some(db => db.name === `LineageweaverDB_${DEFAULT_DATASET_ID}`);

    if (!oldDbExists) {
      console.log('📂 No old local database found');
      results.success = true;
      results.action = 'none';
      return results;
    }

    if (newDbExists) {
      console.log('📂 New database already exists, cleaning up old database');
      // Delete old database
      await new Promise((resolve, reject) => {
        const request = indexedDB.deleteDatabase('LineageweaverDB');
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
      results.action = 'cleaned_old';
      results.success = true;
      return results;
    }

    // Old database exists, new doesn't - we need to migrate
    // The simplest approach is to let the sync process repopulate from Firestore
    // since we've already migrated Firestore data
    console.log('📂 Old database found, will be repopulated from cloud on next sync');
    results.action = 'will_repopulate';
    results.success = true;

    return results;

  } catch (error) {
    console.error('❌ Local database migration check failed:', error);
    results.error = error.message;
    return results;
  }
}

/**
 * Run full dataset migration (Firestore + local)
 *
 * @param {string} userId - The user's Firebase UID
 * @returns {Promise<Object>} Combined results
 */
export async function runDatasetMigration(userId) {
  console.log('📂 Running full dataset migration...');

  const results = {
    firestore: null,
    local: null,
    success: false
  };

  try {
    // Migrate Firestore structure
    results.firestore = await migrateToDatasetStructure(userId);

    // Check local database
    results.local = await migrateLocalDatabase();

    results.success = results.firestore.success && results.local.success;

    console.log('📂 Full dataset migration complete:', {
      firestoreSuccess: results.firestore.success,
      localAction: results.local.action
    });

    return results;

  } catch (error) {
    console.error('❌ Full dataset migration failed:', error);
    results.success = false;
    return results;
  }
}

// ==================== EXPORTS ====================

export default {
  migrateHousesToCodex,
  migrateDignitiesToCodex,
  migratePersonHouseLinks,
  migratePersonDignityLinks,
  migrateHouseDignityLinks,
  runCrossLinkingMigrations,
  runAllMigrations,
  getMigrationStatus,
  // Dataset migration
  needsDatasetMigration,
  migrateToDatasetStructure,
  migrateLocalDatabase,
  runDatasetMigration
};
