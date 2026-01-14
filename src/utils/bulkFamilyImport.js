/**
 * BulkFamilyImport.js - Bulk Family Import Utility
 * 
 * PURPOSE:
 * Process a family import template with temporary IDs and convert them
 * to real database IDs while maintaining all relationships.
 * 
 * WHAT THIS DOES:
 * 1. Validates the template structure
 * 2. Creates houses first (since people reference them)
 * 3. Creates people with real house IDs
 * 4. Creates relationships with real person IDs
 * 5. Optionally creates Codex entries, heraldry, and dignities
 * 6. Returns a detailed report of what was created
 * 
 * USAGE:
 * import { processFamilyImport } from './utils/bulkFamilyImport';
 * 
 * const result = await processFamilyImport(templateData);
 * if (result.success) {
 *   console.log('Created:', result.summary);
 * } else {
 *   console.error('Errors:', result.errors);
 * }
 */

import { getDatabase, addHouse, addPerson, addRelationship } from '../services/database';
import { createEntry } from '../services/codexService';

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Validate the template structure before processing
 * @param {Object} template - The import template
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
export function validateTemplate(template) {
  const errors = [];
  
  // Check for required sections
  if (!template.houses || !Array.isArray(template.houses)) {
    errors.push('Missing or invalid "houses" array');
  }
  if (!template.people || !Array.isArray(template.people)) {
    errors.push('Missing or invalid "people" array');
  }
  if (!template.relationships || !Array.isArray(template.relationships)) {
    errors.push('Missing or invalid "relationships" array');
  }
  
  // Early return if structure is fundamentally broken
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  
  // Collect all temp IDs for reference checking
  const houseTempIds = new Set(template.houses.map(h => h._tempId));
  const peopleTempIds = new Set(template.people.map(p => p._tempId));
  
  // Validate houses
  template.houses.forEach((house, index) => {
    if (!house._tempId) {
      errors.push(`House at index ${index}: Missing _tempId`);
    }
    if (!house.houseName) {
      errors.push(`House "${house._tempId || index}": Missing houseName`);
    }
    // Check parentHouseId references
    if (house.parentHouseId && !houseTempIds.has(house.parentHouseId)) {
      errors.push(`House "${house._tempId}": parentHouseId "${house.parentHouseId}" not found`);
    }
    // Check foundedBy references
    if (house.foundedBy && !peopleTempIds.has(house.foundedBy)) {
      errors.push(`House "${house._tempId}": foundedBy "${house.foundedBy}" not found in people`);
    }
  });
  
  // Validate people
  template.people.forEach((person, index) => {
    if (!person._tempId) {
      errors.push(`Person at index ${index}: Missing _tempId`);
    }
    if (!person.firstName) {
      errors.push(`Person "${person._tempId || index}": Missing firstName`);
    }
    if (!person.lastName) {
      errors.push(`Person "${person._tempId || index}": Missing lastName`);
    }
    if (!person.gender) {
      errors.push(`Person "${person._tempId || index}": Missing gender`);
    }
    if (!person.houseId) {
      errors.push(`Person "${person._tempId || index}": Missing houseId`);
    } else if (!houseTempIds.has(person.houseId)) {
      errors.push(`Person "${person._tempId}": houseId "${person.houseId}" not found in houses`);
    }
    
    // Validate gender
    if (person.gender && !['male', 'female', 'other'].includes(person.gender)) {
      errors.push(`Person "${person._tempId}": Invalid gender "${person.gender}"`);
    }
    
    // Validate legitimacyStatus
    if (person.legitimacyStatus && 
        !['legitimate', 'bastard', 'adopted', 'unknown'].includes(person.legitimacyStatus)) {
      errors.push(`Person "${person._tempId}": Invalid legitimacyStatus "${person.legitimacyStatus}"`);
    }
  });
  
  // Validate relationships
  template.relationships.forEach((rel, index) => {
    if (!rel.person1Id) {
      errors.push(`Relationship at index ${index}: Missing person1Id`);
    } else if (!peopleTempIds.has(rel.person1Id)) {
      errors.push(`Relationship ${index}: person1Id "${rel.person1Id}" not found in people`);
    }
    
    if (!rel.person2Id) {
      errors.push(`Relationship at index ${index}: Missing person2Id`);
    } else if (!peopleTempIds.has(rel.person2Id)) {
      errors.push(`Relationship ${index}: person2Id "${rel.person2Id}" not found in people`);
    }
    
    if (!rel.relationshipType) {
      errors.push(`Relationship at index ${index}: Missing relationshipType`);
    } else if (!['parent', 'spouse', 'adopted-parent', 'foster-parent', 'mentor', 'named-after']
        .includes(rel.relationshipType)) {
      errors.push(`Relationship ${index}: Invalid relationshipType "${rel.relationshipType}"`);
    }
  });
  
  // Validate codex entries if present
  if (template.codexEntries && Array.isArray(template.codexEntries)) {
    template.codexEntries.forEach((entry, index) => {
      if (!entry._tempId) {
        errors.push(`Codex entry at index ${index}: Missing _tempId`);
      }
      if (!entry.type) {
        errors.push(`Codex entry "${entry._tempId || index}": Missing type`);
      }
      if (!entry.title) {
        errors.push(`Codex entry "${entry._tempId || index}": Missing title`);
      }
      
      // Check auto-link references
      if (entry._autoLink) {
        if (entry._autoLink.entityType === 'house' && 
            entry._autoLink.entityId && 
            !houseTempIds.has(entry._autoLink.entityId)) {
          errors.push(`Codex entry "${entry._tempId}": _autoLink.entityId "${entry._autoLink.entityId}" not found`);
        }
        if (entry._autoLink.entityType === 'person' && 
            entry._autoLink.personId && 
            !peopleTempIds.has(entry._autoLink.personId)) {
          errors.push(`Codex entry "${entry._tempId}": _autoLink.personId "${entry._autoLink.personId}" not found`);
        }
      }
    });
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// IMPORT PROCESSING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Process a family import template and create all entities
 * @param {Object} template - The import template
 * @param {Object} options - Import options
 * @param {boolean} options.skipCodex - Skip creating Codex entries
 * @param {boolean} options.skipHeraldry - Skip creating heraldry
 * @param {boolean} options.skipDignities - Skip creating dignities
 * @param {Function} options.onProgress - Progress callback (step, message)
 * @param {string} options.datasetId - Dataset ID for multi-dataset support
 * @returns {Object} - Import result with summary and ID mappings
 */
export async function processFamilyImport(template, options = {}) {
  const {
    skipCodex = false,
    skipHeraldry = true,  // Default to skip since heraldry needs visual design
    skipDignities = true, // Default to skip for simpler imports
    onProgress = () => {},
    datasetId = 'default' // CRITICAL: Must pass dataset ID for correct database
  } = options;
  
  // Get the correct database instance for this dataset
  const db = getDatabase(datasetId);
  
  // Validate first
  const validation = validateTemplate(template);
  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors,
      summary: null,
      idMappings: null
    };
  }
  
  // ID mapping objects: tempId -> realId
  const houseIdMap = new Map();
  const personIdMap = new Map();
  const codexIdMap = new Map();
  const heraldryIdMap = new Map();
  const dignityIdMap = new Map();
  
  // Results tracking
  const created = {
    houses: [],
    people: [],
    relationships: [],
    codexEntries: [],
    heraldry: [],
    dignities: []
  };
  
  const errors = [];
  
  try {
    // ─────────────────────────────────────────────────────────────────────
    // STEP 1: Create Houses
    // ─────────────────────────────────────────────────────────────────────
    onProgress('houses', `Creating ${template.houses.length} houses...`);
    
    // Sort houses so parent houses are created before cadet branches
    const sortedHouses = sortHousesByDependency(template.houses);
    
    for (const house of sortedHouses) {
      try {
        // Clean the house data (remove template-specific fields)
        const houseData = {
          houseName: house.houseName,
          houseType: house.houseType || 'main',
          colorCode: house.colorCode || '#4169E1',
          motto: house.motto || null,
          sigil: house.sigil || null,
          foundedDate: house.foundedDate || null,
          foundedBy: null, // Will update after people are created
          swornTo: null,   // Will update after all houses are created
          notes: house.notes || ''
        };
        
        // Resolve parentHouseId if present
        if (house.parentHouseId) {
          const realParentId = houseIdMap.get(house.parentHouseId);
          if (realParentId) {
            houseData.parentHouseId = realParentId;
          } else {
            errors.push(`House "${house._tempId}": Could not resolve parentHouseId`);
          }
        }
        
        // Create the house (skipCodexCreation to prevent auto-creation)
        const realId = await addHouse(houseData, { skipCodexCreation: true, datasetId });
        houseIdMap.set(house._tempId, realId);
        
        created.houses.push({
          tempId: house._tempId,
          realId,
          name: house.houseName
        });
        
      } catch (err) {
        errors.push(`Failed to create house "${house._tempId}": ${err.message}`);
      }
    }
    
    // Update swornTo references now that all houses exist
    for (const house of template.houses) {
      if (house.swornTo) {
        const realId = houseIdMap.get(house._tempId);
        const realSwornToId = houseIdMap.get(house.swornTo);
        if (realId && realSwornToId) {
          await db.houses.update(realId, { swornTo: realSwornToId });
        }
      }
    }
    
    // ─────────────────────────────────────────────────────────────────────
    // STEP 2: Create People
    // ─────────────────────────────────────────────────────────────────────
    onProgress('people', `Creating ${template.people.length} people...`);
    
    for (const person of template.people) {
      try {
        // Resolve houseId
        const realHouseId = houseIdMap.get(person.houseId);
        if (!realHouseId) {
          errors.push(`Person "${person._tempId}": Could not resolve houseId "${person.houseId}"`);
          continue;
        }
        
        // Clean the person data
        const personData = {
          firstName: person.firstName,
          lastName: person.lastName,
          maidenName: person.maidenName || null,
          dateOfBirth: person.dateOfBirth || null,
          dateOfDeath: person.dateOfDeath || null,
          gender: person.gender,
          houseId: realHouseId,
          legitimacyStatus: person.legitimacyStatus || 'legitimate',
          bastardStatus: person.bastardStatus || null,
          notes: person.notes || '',
          epithets: person.epithets || [],
          codexEntryId: null // Will be set if Codex entries are created
        };
        
        // Create the person
        const realId = await addPerson(personData, datasetId);
        personIdMap.set(person._tempId, realId);
        
        created.people.push({
          tempId: person._tempId,
          realId,
          name: `${person.firstName} ${person.lastName}`
        });
        
      } catch (err) {
        errors.push(`Failed to create person "${person._tempId}": ${err.message}`);
      }
    }
    
    // Update foundedBy references now that people exist
    for (const house of template.houses) {
      if (house.foundedBy) {
        const realHouseId = houseIdMap.get(house._tempId);
        const realFounderId = personIdMap.get(house.foundedBy);
        if (realHouseId && realFounderId) {
          await db.houses.update(realHouseId, { foundedBy: realFounderId });
        }
      }
    }
    
    // ─────────────────────────────────────────────────────────────────────
    // STEP 3: Create Relationships
    // ─────────────────────────────────────────────────────────────────────
    onProgress('relationships', `Creating ${template.relationships.length} relationships...`);
    
    for (const rel of template.relationships) {
      try {
        // Resolve person IDs
        const realPerson1Id = personIdMap.get(rel.person1Id);
        const realPerson2Id = personIdMap.get(rel.person2Id);
        
        if (!realPerson1Id) {
          errors.push(`Relationship: Could not resolve person1Id "${rel.person1Id}"`);
          continue;
        }
        if (!realPerson2Id) {
          errors.push(`Relationship: Could not resolve person2Id "${rel.person2Id}"`);
          continue;
        }
        
        // Clean the relationship data
        const relData = {
          person1Id: realPerson1Id,
          person2Id: realPerson2Id,
          relationshipType: rel.relationshipType,
          biologicalParent: rel.biologicalParent ?? null,
          marriageDate: rel.marriageDate || null,
          divorceDate: rel.divorceDate || null,
          marriageStatus: rel.marriageStatus || null
        };
        
        // Create the relationship
        const realId = await addRelationship(relData, datasetId);
        
        created.relationships.push({
          realId,
          type: rel.relationshipType,
          person1: rel.person1Id,
          person2: rel.person2Id
        });
        
      } catch (err) {
        errors.push(`Failed to create relationship: ${err.message}`);
      }
    }
    
    // ─────────────────────────────────────────────────────────────────────
    // STEP 4: Create Codex Entries (Optional)
    // ─────────────────────────────────────────────────────────────────────
    if (!skipCodex && template.codexEntries && template.codexEntries.length > 0) {
      onProgress('codex', `Creating ${template.codexEntries.length} Codex entries...`);
      
      for (const entry of template.codexEntries) {
        try {
          // Build entry data
          const entryData = {
            type: entry.type,
            title: entry.title,
            subtitle: entry.subtitle || '',
            content: entry.content || '',
            category: entry.category || null,
            tags: entry.tags || [],
            era: entry.era || null
          };
          
          // Handle auto-linking
          if (entry._autoLink) {
            if (entry._autoLink.entityType === 'house' && entry._autoLink.entityId) {
              const realHouseId = houseIdMap.get(entry._autoLink.entityId);
              if (realHouseId) {
                entryData.houseId = realHouseId;
              }
            }
            if (entry._autoLink.entityType === 'person' && entry._autoLink.personId) {
              const realPersonId = personIdMap.get(entry._autoLink.personId);
              if (realPersonId) {
                entryData.personId = realPersonId;
              }
            }
          }
          
          // Create the entry
          const realId = await createEntry(entryData);
          codexIdMap.set(entry._tempId, realId);
          
          // Update the linked entity with codexEntryId
          if (entryData.houseId) {
            await db.houses.update(entryData.houseId, { codexEntryId: realId });
          }
          if (entryData.personId) {
            await db.people.update(entryData.personId, { codexEntryId: realId });
          }
          
          created.codexEntries.push({
            tempId: entry._tempId,
            realId,
            title: entry.title
          });
          
        } catch (err) {
          errors.push(`Failed to create Codex entry "${entry._tempId}": ${err.message}`);
        }
      }
    }
    
    // ─────────────────────────────────────────────────────────────────────
    // STEP 5: Summary
    // ─────────────────────────────────────────────────────────────────────
    onProgress('complete', 'Import complete!');
    
    return {
      success: errors.length === 0,
      errors: errors.length > 0 ? errors : null,
      summary: {
        housesCreated: created.houses.length,
        peopleCreated: created.people.length,
        relationshipsCreated: created.relationships.length,
        codexEntriesCreated: created.codexEntries.length,
        heraldryCreated: created.heraldry.length,
        dignitiesCreated: created.dignities.length
      },
      created,
      idMappings: {
        houses: Object.fromEntries(houseIdMap),
        people: Object.fromEntries(personIdMap),
        codex: Object.fromEntries(codexIdMap),
        heraldry: Object.fromEntries(heraldryIdMap),
        dignities: Object.fromEntries(dignityIdMap)
      }
    };
    
  } catch (err) {
    return {
      success: false,
      errors: [`Critical error during import: ${err.message}`],
      summary: null,
      idMappings: null
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Sort houses so parent houses are created before their cadet branches
 * This ensures parentHouseId can be resolved during creation
 */
function sortHousesByDependency(houses) {
  const result = [];
  const processed = new Set();
  const tempIdToHouse = new Map(houses.map(h => [h._tempId, h]));
  
  function addHouse(house) {
    if (processed.has(house._tempId)) return;
    
    // If this house has a parent, add the parent first
    if (house.parentHouseId) {
      const parent = tempIdToHouse.get(house.parentHouseId);
      if (parent && !processed.has(parent._tempId)) {
        addHouse(parent);
      }
    }
    
    result.push(house);
    processed.add(house._tempId);
  }
  
  houses.forEach(addHouse);
  return result;
}

/**
 * Generate a summary report of the import
 */
export function generateImportReport(result) {
  if (!result.success) {
    return {
      title: 'Import Failed',
      message: `Import encountered ${result.errors.length} error(s)`,
      errors: result.errors
    };
  }
  
  const lines = [
    '✅ Import Successful!',
    '',
    '📊 Summary:',
    `   • ${result.summary.housesCreated} house(s) created`,
    `   • ${result.summary.peopleCreated} people created`,
    `   • ${result.summary.relationshipsCreated} relationship(s) created`
  ];
  
  if (result.summary.codexEntriesCreated > 0) {
    lines.push(`   • ${result.summary.codexEntriesCreated} Codex entries created`);
  }
  
  if (result.created.houses.length > 0) {
    lines.push('', '🏰 Houses:');
    result.created.houses.forEach(h => {
      lines.push(`   • ${h.name} (ID: ${h.realId})`);
    });
  }
  
  return {
    title: 'Import Successful',
    message: lines.join('\n'),
    errors: null
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  validateTemplate,
  processFamilyImport,
  generateImportReport
};
