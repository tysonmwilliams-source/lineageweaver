import { db } from '../services/database';

/**
 * Import data from a JSON backup file
 * This will CLEAR existing data and replace it with the backup
 */
export async function importFromJSON(jsonData) {
  try {
    console.log('Starting data import...');
    
    // Parse JSON if it's a string
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    
    // Validate data structure
    if (!data.people || !data.houses || !data.relationships) {
      throw new Error('Invalid backup file format. Missing people, houses, or relationships.');
    }
    
    console.log(`Importing: ${data.people.length} people, ${data.houses.length} houses, ${data.relationships.length} relationships`);
    
    // Clear existing data
    console.log('Clearing existing data...');
    await db.people.clear();
    await db.houses.clear();
    await db.relationships.clear();
    
    // Import houses first (people reference houses)
    console.log('Importing houses...');
    await db.houses.bulkAdd(data.houses);
    
    // Import people
    console.log('Importing people...');
    await db.people.bulkAdd(data.people);
    
    // Import relationships
    console.log('Importing relationships...');
    await db.relationships.bulkAdd(data.relationships);
    
    console.log('✅ Import complete!');
    
    return {
      success: true,
      counts: {
        people: data.people.length,
        houses: data.houses.length,
        relationships: data.relationships.length
      }
    };
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  }
}

/**
 * Load and import from a file uploaded by the user
 */
export async function importFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const jsonData = e.target.result;
        const result = await importFromJSON(jsonData);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}
