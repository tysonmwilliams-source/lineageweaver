import Dexie from 'dexie';

/**
 * Auto-backup function - saves to downloads folder
 */
function autoBackupToFile(data) {
  try {
    const backup = {
      ...data,
      backupDate: new Date().toISOString(),
      version: '2.0'
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lineageweaver-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    console.log('✅ Backup saved to Downloads folder');
    return true;
  } catch (error) {
    console.error('❌ Auto-backup failed:', error);
    return false;
  }
}

/**
 * Auto-backup timer - prompts every 15 minutes
 */
let autoBackupInterval = null;

function startAutoBackupTimer() {
  // Clear existing interval if any
  if (autoBackupInterval) {
    clearInterval(autoBackupInterval);
  }

  // Set up 15-minute interval
  autoBackupInterval = setInterval(async () => {
    try {
      const userWantsBackup = confirm(
        '💾 Auto-Backup Reminder\n\n' +
        'Would you like to save a backup of your genealogy data?\n\n' +
        'This will download a JSON file to your Downloads folder.'
      );

      if (userWantsBackup) {
        const [people, houses, relationships] = await Promise.all([
          getAllPeople(),
          getAllHouses(),
          getAllRelationships()
        ]);

        const success = autoBackupToFile({ people, houses, relationships });
        
        if (success) {
          alert('✅ Backup saved successfully!\n\nFile: lineageweaver-backup-' + new Date().toISOString().split('T')[0] + '.json');
        }
      }
    } catch (error) {
      console.error('Auto-backup timer failed:', error);
    }
  }, 15 * 60 * 1000); // 15 minutes in milliseconds

  console.log('🕐 Auto-backup timer started (15 minute intervals)');
}

// Start the timer when database loads
startAutoBackupTimer();

/**
 * Database Service for Lineageweaver
 * 
 * This file sets up IndexedDB (the browser's built-in database) using Dexie,
 * which is a wrapper that makes IndexedDB easier to work with.
 * 
 * Think of this as creating the "blueprint" for our database - defining what
 * tables we'll have and what fields each table contains.
 */

// Create a new database instance called 'LineageweaverDB'
export const db = new Dexie('LineageweaverDB');

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

/**
 * Database Helper Functions
 * These are the CRUD operations (Create, Read, Update, Delete) for each entity
 */

// ==================== PEOPLE OPERATIONS ====================

/**
 * Add a new person to the database
 * @param {Object} personData - The person's information
 * @returns {Promise<number>} The ID of the newly created person
 */
export async function addPerson(personData) {
  try {
    const id = await db.people.add(personData);
    console.log('Person added with ID:', id);
    return id;
  } catch (error) {
    console.error('Error adding person:', error);
    throw error;
  }
}

/**
 * Get a single person by their ID
 * @param {number} id - The person's ID
 * @returns {Promise<Object>} The person's data
 */
export async function getPerson(id) {
  try {
    const person = await db.people.get(id);
    return person;
  } catch (error) {
    console.error('Error getting person:', error);
    throw error;
  }
}

/**
 * Get all people from the database
 * @returns {Promise<Array>} Array of all people
 */
export async function getAllPeople() {
  try {
    const people = await db.people.toArray();
    return people;
  } catch (error) {
    console.error('Error getting all people:', error);
    throw error;
  }
}

/**
 * Get all people from a specific house
 * @param {number} houseId - The house ID to filter by
 * @returns {Promise<Array>} Array of people in that house
 */
export async function getPeopleByHouse(houseId) {
  try {
    const people = await db.people.where('houseId').equals(houseId).toArray();
    return people;
  } catch (error) {
    console.error('Error getting people by house:', error);
    throw error;
  }
}

/**
 * Update an existing person's information
 * @param {number} id - The person's ID
 * @param {Object} updates - Object containing fields to update
 * @returns {Promise<number>} Number of records updated (should be 1)
 */
export async function updatePerson(id, updates) {
  try {
    const result = await db.people.update(id, updates);
    console.log('Person updated:', result);
    return result;
  } catch (error) {
    console.error('Error updating person:', error);
    throw error;
  }
}

/**
 * Delete a person from the database
 * @param {number} id - The person's ID to delete
 * @returns {Promise<void>}
 */
export async function deletePerson(id) {
  try {
    await db.people.delete(id);
    console.log('Person deleted:', id);
  } catch (error) {
    console.error('Error deleting person:', error);
    throw error;
  }
}

// ==================== HOUSE OPERATIONS ====================

/**
 * Add a new house to the database
 * @param {Object} houseData - The house's information
 * @returns {Promise<number>} The ID of the newly created house
 */
export async function addHouse(houseData) {
  try {
    const id = await db.houses.add(houseData);
    console.log('House added with ID:', id);
    return id;
  } catch (error) {
    console.error('Error adding house:', error);
    throw error;
  }
}

/**
 * Get a single house by its ID
 * @param {number} id - The house ID
 * @returns {Promise<Object>} The house's data
 */
export async function getHouse(id) {
  try {
    const house = await db.houses.get(id);
    return house;
  } catch (error) {
    console.error('Error getting house:', error);
    throw error;
  }
}

/**
 * Get all houses from the database
 * @returns {Promise<Array>} Array of all houses
 */
export async function getAllHouses() {
  try {
    const houses = await db.houses.toArray();
    return houses;
  } catch (error) {
    console.error('Error getting all houses:', error);
    throw error;
  }
}

/**
 * Get cadet houses of a parent house
 * @param {number} parentHouseId - The parent house ID
 * @returns {Promise<Array>} Array of cadet houses
 */
export async function getCadetHouses(parentHouseId) {
  try {
    const cadetHouses = await db.houses
      .where('parentHouseId')
      .equals(parentHouseId)
      .toArray();
    return cadetHouses;
  } catch (error) {
    console.error('Error getting cadet houses:', error);
    throw error;
  }
}

/**
 * Update an existing house's information
 * @param {number} id - The house ID
 * @param {Object} updates - Object containing fields to update
 * @returns {Promise<number>} Number of records updated (should be 1)
 */
export async function updateHouse(id, updates) {
  try {
    const result = await db.houses.update(id, updates);
    console.log('House updated:', result);
    return result;
  } catch (error) {
    console.error('Error updating house:', error);
    throw error;
  }
}

/**
 * Delete a house from the database
 * @param {number} id - The house ID to delete
 * @returns {Promise<void>}
 */
export async function deleteHouse(id) {
  try {
    await db.houses.delete(id);
    console.log('House deleted:', id);
  } catch (error) {
    console.error('Error deleting house:', error);
    throw error;
  }
}

// ==================== RELATIONSHIP OPERATIONS ====================

/**
 * Add a new relationship between two people
 * @param {Object} relationshipData - The relationship information
 * @returns {Promise<number>} The ID of the newly created relationship
 */
export async function addRelationship(relationshipData) {
  try {
    const id = await db.relationships.add(relationshipData);
    console.log('Relationship added with ID:', id);
    return id;
  } catch (error) {
    console.error('Error adding relationship:', error);
    throw error;
  }
}

/**
 * Get all relationships for a specific person
 * @param {number} personId - The person's ID
 * @returns {Promise<Array>} Array of relationships involving this person
 */
export async function getRelationshipsForPerson(personId) {
  try {
    // Get relationships where person is either person1 or person2
    const relationships = await db.relationships
      .where('person1Id').equals(personId)
      .or('person2Id').equals(personId)
      .toArray();
    return relationships;
  } catch (error) {
    console.error('Error getting relationships:', error);
    throw error;
  }
}

/**
 * Get all relationships from the database
 * @returns {Promise<Array>} Array of all relationships
 */
export async function getAllRelationships() {
  try {
    const relationships = await db.relationships.toArray();
    return relationships;
  } catch (error) {
    console.error('Error getting all relationships:', error);
    throw error;
  }
}

/**
 * Update an existing relationship
 * @param {number} id - The relationship ID
 * @param {Object} updates - Object containing fields to update
 * @returns {Promise<number>} Number of records updated (should be 1)
 */
export async function updateRelationship(id, updates) {
  try {
    const result = await db.relationships.update(id, updates);
    console.log('Relationship updated:', result);
    return result;
  } catch (error) {
    console.error('Error updating relationship:', error);
    throw error;
  }
}

/**
 * Delete a relationship from the database
 * @param {number} id - The relationship ID to delete
 * @returns {Promise<void>}
 */
export async function deleteRelationship(id) {
  try {
    await db.relationships.delete(id);
    console.log('Relationship deleted:', id);
  } catch (error) {
    console.error('Error deleting relationship:', error);
    throw error;
  }
}

// ==================== CADET HOUSE OPERATIONS ====================

/**
 * Calculate age from date of birth
 * @param {string} dateOfBirth - Date in YYYY-MM-DD format
 * @returns {number|null} Age in years, or null if no birth date
 */
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
 * Check if a bastard is eligible to found a cadet house (age 18+)
 * @param {Object} person - Person object
 * @returns {boolean} True if eligible
 */
export function isEligibleForCeremony(person) {
  if (!person.dateOfBirth) return false;
  if (person.legitimacyStatus !== 'bastard') return false;
  if (person.bastardStatus === 'founded') return false;
  if (person.bastardStatus === 'legitimized') return false;
  
  const age = calculateAge(person.dateOfBirth);
  return age >= 18;
}

/**
 * Found a cadet house (naming ceremony)
 * @param {Object} ceremonyData - Ceremony details
 * @returns {Promise<Object>} Created house and updated person
 */
export async function foundCadetHouse(ceremonyData) {
  const { 
    founderId, 
    houseName, 
    parentHouseId, 
    ceremonyDate,
    motto = null,
    colorCode = null 
  } = ceremonyData;
  
  try {
    // Get the founder
    const founder = await getPerson(founderId);
    if (!founder) {
      throw new Error('Founder not found');
    }
    
    // Get parent house
    const parentHouse = await getHouse(parentHouseId);
    if (!parentHouse) {
      throw new Error('Parent house not found');
    }
    
    // Create the new cadet house
    const newHouseId = await addHouse({
      houseName: houseName,
      parentHouseId: parentHouseId,
      houseType: 'cadet',
      foundedBy: founderId,
      foundedDate: ceremonyDate,
      swornTo: parentHouseId,
      namePrefix: parentHouse.namePrefix || parentHouse.houseName.substring(0, 3),
      sigil: null,
      motto: motto,
      colorCode: colorCode || parentHouse.colorCode,
      notes: `Cadet branch of ${parentHouse.houseName}, founded by ${founder.firstName} ${founder.lastName}`
    });
    
    // Update the founder - change from bastard to legitimate
    await updatePerson(founderId, {
      houseId: newHouseId,
      lastName: houseName,
      bastardStatus: 'founded',
      legitimacyStatus: 'legitimate' // Change from bastard to legitimate
    });
    
    const newHouse = await getHouse(newHouseId);
    const updatedFounder = await getPerson(founderId);
    
    return {
      house: newHouse,
      founder: updatedFounder
    };
  } catch (error) {
    console.error('Error founding cadet house:', error);
    throw error;
  }
}

/**
 * Manual backup function - can be called from UI
 */
export async function manualBackup() {
  try {
    const [people, houses, relationships] = await Promise.all([
      getAllPeople(),
      getAllHouses(),
      getAllRelationships()
    ]);

    const success = autoBackupToFile({ people, houses, relationships });
    
    return success;
  } catch (error) {
    console.error('Manual backup failed:', error);
    return false;
  }
}

// Export the database instance as default
export default db;
