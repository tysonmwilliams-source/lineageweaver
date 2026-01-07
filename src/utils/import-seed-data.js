/**
 * CODEX SEED DATA IMPORT SCRIPT
 * 
 * This script imports the canonical House Wilfrey data into The Codex database.
 * It handles the import process, creates all entries, and establishes links.
 * 
 * USAGE:
 * 1. Import this function in your app
 * 2. Call importSeedData() from a button or console
 * 3. Data will be imported into the database
 * 
 * IMPORTANT: This is a ONE-TIME import. Running it multiple times will create
 * duplicate entries. Use clearCodex() first if you need to re-import.
 */

import CODEX_SEED_DATA from '../data/codex-seed-data.js';
import { createEntry, getAllEntries } from '../services/codexService.js';

/**
 * Import all seed data into The Codex
 * @returns {Promise<Object>} - Import results with counts and created IDs
 */
export async function importSeedData() {
  console.log('🌱 Starting Codex seed data import...');
  
  const results = {
    houses: [],
    locations: [],
    events: [],
    personages: [],
    mysteria: [],
    errors: [],
    timing: {
      start: new Date(),
      end: null,
      duration: null
    }
  };
  
  try {
    // Import Houses
    console.log('📜 Importing Houses...');
    for (const houseData of CODEX_SEED_DATA.houses) {
      try {
        const id = await createEntry(houseData);
        results.houses.push({ title: houseData.title, id });
        console.log(`  ✓ Created: ${houseData.title} (ID: ${id})`);
      } catch (error) {
        results.errors.push({
          type: 'house',
          title: houseData.title,
          error: error.message
        });
        console.error(`  ✗ Failed: ${houseData.title}`, error);
      }
    }
    
    // Import Locations
    console.log('🏰 Importing Locations...');
    for (const locationData of CODEX_SEED_DATA.locations) {
      try {
        const id = await createEntry(locationData);
        results.locations.push({ title: locationData.title, id });
        console.log(`  ✓ Created: ${locationData.title} (ID: ${id})`);
      } catch (error) {
        results.errors.push({
          type: 'location',
          title: locationData.title,
          error: error.message
        });
        console.error(`  ✗ Failed: ${locationData.title}`, error);
      }
    }
    
    // Import Events
    console.log('⚔️ Importing Events...');
    for (const eventData of CODEX_SEED_DATA.events) {
      try {
        const id = await createEntry(eventData);
        results.events.push({ title: eventData.title, id });
        console.log(`  ✓ Created: ${eventData.title} (ID: ${id})`);
      } catch (error) {
        results.errors.push({
          type: 'event',
          title: eventData.title,
          error: error.message
        });
        console.error(`  ✗ Failed: ${eventData.title}`, error);
      }
    }
    
    // Import Personages
    console.log('👤 Importing Personages...');
    for (const personageData of CODEX_SEED_DATA.personages) {
      try {
        const id = await createEntry(personageData);
        results.personages.push({ title: personageData.title, id });
        console.log(`  ✓ Created: ${personageData.title} (ID: ${id})`);
      } catch (error) {
        results.errors.push({
          type: 'personage',
          title: personageData.title,
          error: error.message
        });
        console.error(`  ✗ Failed: ${personageData.title}`, error);
      }
    }
    
    // Import Mysteria
    console.log('✨ Importing Mysteria...');
    for (const mysteriaData of CODEX_SEED_DATA.mysteria) {
      try {
        const id = await createEntry(mysteriaData);
        results.mysteria.push({ title: mysteriaData.title, id });
        console.log(`  ✓ Created: ${mysteriaData.title} (ID: ${id})`);
      } catch (error) {
        results.errors.push({
          type: 'mysteria',
          title: mysteriaData.title,
          error: error.message
        });
        console.error(`  ✗ Failed: ${mysteriaData.title}`, error);
      }
    }
    
    // Calculate timing
    results.timing.end = new Date();
    results.timing.duration = results.timing.end - results.timing.start;
    
    // Print summary
    console.log('\n📊 IMPORT SUMMARY');
    console.log('═'.repeat(50));
    console.log(`Houses imported:     ${results.houses.length}`);
    console.log(`Locations imported:  ${results.locations.length}`);
    console.log(`Events imported:     ${results.events.length}`);
    console.log(`Personages imported: ${results.personages.length}`);
    console.log(`Mysteria imported:   ${results.mysteria.length}`);
    console.log(`─`.repeat(50));
    console.log(`Total entries:       ${
      results.houses.length + 
      results.locations.length + 
      results.events.length + 
      results.personages.length + 
      results.mysteria.length
    }`);
    console.log(`Errors:              ${results.errors.length}`);
    console.log(`Duration:            ${results.timing.duration}ms`);
    console.log('═'.repeat(50));
    
    if (results.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      results.errors.forEach(err => {
        console.log(`  ${err.type}: ${err.title} - ${err.error}`);
      });
    } else {
      console.log('\n✅ All entries imported successfully!');
    }
    
    return results;
    
  } catch (error) {
    console.error('❌ Critical error during import:', error);
    throw error;
  }
}

/**
 * Clear all Codex entries (use with caution!)
 * This is useful if you need to re-import the seed data.
 */
export async function clearCodex() {
  const confirm = window.confirm(
    '⚠️ WARNING: This will delete ALL Codex entries.\n\n' +
    'This action cannot be undone.\n\n' +
    'Are you sure you want to continue?'
  );
  
  if (!confirm) {
    console.log('Codex clear cancelled by user');
    return false;
  }
  
  try {
    const allEntries = await getAllEntries();
    console.log(`🗑️ Clearing ${allEntries.length} Codex entries...`);
    
    // Note: This would need to be implemented in codexService.js
    // For now, direct database access:
    const { db } = await import('../services/database.js');
    await db.codexEntries.clear();
    await db.codexLinks.clear();
    
    console.log('✅ Codex cleared successfully');
    return true;
  } catch (error) {
    console.error('❌ Error clearing Codex:', error);
    throw error;
  }
}

/**
 * Get import statistics without actually importing
 */
export function getImportPreview() {
  return {
    houses: CODEX_SEED_DATA.houses.length,
    locations: CODEX_SEED_DATA.locations.length,
    events: CODEX_SEED_DATA.events.length,
    personages: CODEX_SEED_DATA.personages.length,
    mysteria: CODEX_SEED_DATA.mysteria.length,
    total: 
      CODEX_SEED_DATA.houses.length +
      CODEX_SEED_DATA.locations.length +
      CODEX_SEED_DATA.events.length +
      CODEX_SEED_DATA.personages.length +
      CODEX_SEED_DATA.mysteria.length
  };
}

/**
 * Example usage in the browser console:
 * 
 * import { importSeedData, clearCodex, getImportPreview } from './utils/import-seed-data.js';
 * 
 * // Preview what will be imported
 * getImportPreview();
 * 
 * // Import the data (first time)
 * await importSeedData();
 * 
 * // Clear and re-import (if needed)
 * await clearCodex();
 * await importSeedData();
 */

export default {
  importSeedData,
  clearCodex,
  getImportPreview
};
