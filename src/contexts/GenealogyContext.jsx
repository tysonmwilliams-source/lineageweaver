/**
 * GenealogyContext.jsx - Shared Data Provider for Lineageweaver
 * 
 * PURPOSE:
 * This context creates a "single source of truth" for all genealogy data.
 * Instead of ManageData and FamilyTree each maintaining their own separate
 * copies of people/houses/relationships, they both tap into this shared well.
 * 
 * HOW IT WORKS:
 * 1. On app load, the context fetches all data from IndexedDB once
 * 2. Any component can read data via useGenealogy() hook
 * 3. Any component can mutate data via provided functions (addPerson, updateHouse, etc.)
 * 4. When data changes, ALL subscribed components re-render with fresh data
 * 
 * WHAT THIS SOLVES:
 * - Edit a person in ManageData → Tree updates immediately (no navigation needed)
 * - Quick-edit in Tree → ManageData reflects it instantly
 * - No more "stale data" when switching between pages
 * 
 * TECHNICAL NOTES:
 * - Uses React Context API (built into React, no extra dependencies)
 * - Database operations happen in the mutation functions
 * - State updates trigger re-renders in consuming components
 * - Error handling is centralized here
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getAllPeople,
  getAllHouses,
  getAllRelationships,
  addPerson as dbAddPerson,
  updatePerson as dbUpdatePerson,
  deletePerson as dbDeletePerson,
  addHouse as dbAddHouse,
  updateHouse as dbUpdateHouse,
  deleteHouse as dbDeleteHouse,
  addRelationship as dbAddRelationship,
  updateRelationship as dbUpdateRelationship,
  deleteRelationship as dbDeleteRelationship,
  foundCadetHouse as dbFoundCadetHouse,
  deleteAllData as dbDeleteAllData
} from '../services/database';

// ═══════════════════════════════════════════════════════════════════════════════
// 🔗 TREE-CODEX INTEGRATION (Phase 1: Light Integration)
// ═══════════════════════════════════════════════════════════════════════════════
// Import Codex service for automatic biography entry creation/deletion.
// When a person is created, a skeleton Codex entry is auto-created.
// When a person is deleted, their Codex entry is also deleted (cascade).
// ═══════════════════════════════════════════════════════════════════════════════
import { 
  createEntry as createCodexEntry, 
  deleteEntry as deleteCodexEntry,
  getEntry as getCodexEntry
} from '../services/codexService';

// Create the context object
// Think of this as creating an empty "container" that will hold our shared data
const GenealogyContext = createContext(null);

/**
 * GenealogyProvider Component
 * 
 * This wraps your app (or part of it) and provides the shared data to all children.
 * Any component inside this provider can access the data via useGenealogy().
 * 
 * Usage in App.jsx:
 *   <GenealogyProvider>
 *     <Router>...</Router>
 *   </GenealogyProvider>
 */
export function GenealogyProvider({ children }) {
  // ==================== STATE ====================
  // These are the canonical copies of all genealogy data
  // Every component that uses useGenealogy() sees these same values
  
  const [people, setPeople] = useState([]);
  const [houses, setHouses] = useState([]);
  const [relationships, setRelationships] = useState([]);
  
  // Loading state - true while initial data fetch is happening
  const [loading, setLoading] = useState(true);
  
  // Error state - holds error message if something goes wrong
  const [error, setError] = useState(null);
  
  // Version counter - increments on every data change
  // Components can use this to detect "something changed" without
  // doing deep comparisons of the actual data arrays
  const [dataVersion, setDataVersion] = useState(0);

  // ==================== INITIAL DATA LOAD ====================
  // Runs once when the provider mounts (app starts)
  
  useEffect(() => {
    loadAllData();
  }, []);

  /**
   * Load all data from IndexedDB
   * Called on initial mount and can be called manually to refresh
   */
  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all three data types in parallel (faster than sequential)
      const [allPeople, allHouses, allRelationships] = await Promise.all([
        getAllPeople(),
        getAllHouses(),
        getAllRelationships()
      ]);
      
      setPeople(allPeople);
      setHouses(allHouses);
      setRelationships(allRelationships);
      setDataVersion(v => v + 1);
      
      console.log('📚 GenealogyContext: Data loaded', {
        people: allPeople.length,
        houses: allHouses.length,
        relationships: allRelationships.length
      });
    } catch (err) {
      console.error('❌ GenealogyContext: Failed to load data', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== PERSON OPERATIONS ====================
  // These functions update BOTH the database AND the local state
  // This is what makes the "instant update" magic happen

  /**
   * Add a new person
   * @param {Object} personData - The person data to add
   * @returns {number} The new person's ID
   * 
   * TREE-CODEX INTEGRATION: Automatically creates a skeleton Codex entry
   * for the new person, linking them to The Codex encyclopedia system.
   */
  const addPerson = useCallback(async (personData) => {
    try {
      // 1. Add to database (returns the new ID)
      const newId = await dbAddPerson(personData);
      
      // ═══════════════════════════════════════════════════════════════════
      // 🔗 TREE-CODEX INTEGRATION: Auto-create skeleton Codex entry
      // ═══════════════════════════════════════════════════════════════════
      // Every person automatically gets a Codex entry for their biography.
      // This creates a "skeleton" entry with genealogical data pre-filled.
      // The user can add rich biographical content later via the Codex interface.
      // ═══════════════════════════════════════════════════════════════════
      let codexEntryId = null;
      try {
        const fullName = `${personData.firstName} ${personData.lastName}`;
        
        // Build life dates string for subtitle
        let lifeDates = '';
        if (personData.dateOfBirth) {
          lifeDates = `b. ${personData.dateOfBirth}`;
          if (personData.dateOfDeath) {
            lifeDates += ` - d. ${personData.dateOfDeath}`;
          }
        } else if (personData.dateOfDeath) {
          lifeDates = `d. ${personData.dateOfDeath}`;
        }
        
        // Build subtitle with maiden name and/or dates
        let subtitle = '';
        if (personData.maidenName && lifeDates) {
          subtitle = `née ${personData.maidenName} | ${lifeDates}`;
        } else if (personData.maidenName) {
          subtitle = `née ${personData.maidenName}`;
        } else if (lifeDates) {
          subtitle = lifeDates;
        }
        
        codexEntryId = await createCodexEntry({
          type: 'personage',
          title: fullName,
          subtitle: subtitle || null,
          content: '', // Empty - user will fill in biography
          category: 'Personages',
          tags: [],
          era: null,
          personId: newId, // Critical: links Codex entry back to Person
          houseId: personData.houseId || null, // Link to house for reference
          // Store genealogical metadata for Codex display
          genealogyData: {
            dateOfBirth: personData.dateOfBirth || null,
            dateOfDeath: personData.dateOfDeath || null,
            gender: personData.gender || null,
            legitimacyStatus: personData.legitimacyStatus || null,
            maidenName: personData.maidenName || null
          },
          // Skeleton metadata flag - helps identify auto-generated entries
          isAutoGenerated: true
        });
        
        // Update the person record with their Codex entry ID
        await dbUpdatePerson(newId, { codexEntryId: codexEntryId });
        
        console.log('📖 Codex entry auto-created for:', fullName, '(ID:', codexEntryId, ')');
      } catch (codexErr) {
        // Don't fail person creation if Codex entry fails
        // Just log the error - the link can be created manually later
        console.warn('⚠️ Failed to auto-create Codex entry:', codexErr.message);
      }
      
      // 2. Update local state with the new person (including codexEntryId)
      const newPerson = { ...personData, id: newId, codexEntryId: codexEntryId };
      setPeople(prev => [...prev, newPerson]);
      setDataVersion(v => v + 1);
      
      console.log('✅ Person added:', newPerson.firstName, newPerson.lastName);
      return newId;
    } catch (err) {
      console.error('❌ Failed to add person:', err);
      throw err;
    }
  }, []);

  /**
   * Update an existing person
   * @param {number} id - The person's ID
   * @param {Object} updates - Fields to update
   */
  const updatePerson = useCallback(async (id, updates) => {
    try {
      // 1. Update in database
      await dbUpdatePerson(id, updates);
      
      // 2. Update local state
      setPeople(prev => prev.map(person => 
        person.id === id ? { ...person, ...updates } : person
      ));
      setDataVersion(v => v + 1);
      
      console.log('✅ Person updated:', id);
    } catch (err) {
      console.error('❌ Failed to update person:', err);
      throw err;
    }
  }, []);

  /**
   * Delete a person (also deletes their relationships and Codex entry)
   * @param {number} id - The person's ID
   * 
   * TREE-CODEX INTEGRATION: Cascade deletes the person's Codex entry
   * to prevent orphaned biography entries.
   */
  const deletePerson = useCallback(async (id) => {
    try {
      // ═══════════════════════════════════════════════════════════════════
      // 🔗 TREE-CODEX INTEGRATION: Get person's Codex entry ID before deletion
      // ═══════════════════════════════════════════════════════════════════
      // Find the person in local state to get their codexEntryId
      const personToDelete = people.find(p => p.id === id);
      const codexEntryId = personToDelete?.codexEntryId;
      
      // 1. Delete from database
      await dbDeletePerson(id);
      
      // ═══════════════════════════════════════════════════════════════════
      // 🔗 TREE-CODEX INTEGRATION: Cascade delete Codex entry
      // ═══════════════════════════════════════════════════════════════════
      if (codexEntryId) {
        try {
          await deleteCodexEntry(codexEntryId);
          console.log('📖 Codex entry cascade-deleted:', codexEntryId);
        } catch (codexErr) {
          // Don't fail person deletion if Codex cleanup fails
          // The orphaned entry can be cleaned up manually
          console.warn('⚠️ Failed to cascade-delete Codex entry:', codexErr.message);
        }
      }
      
      // 2. Remove from local state
      setPeople(prev => prev.filter(person => person.id !== id));
      
      // 3. Also remove any relationships involving this person
      setRelationships(prev => prev.filter(rel => 
        rel.person1Id !== id && rel.person2Id !== id
      ));
      setDataVersion(v => v + 1);
      
      console.log('✅ Person deleted:', id);
    } catch (err) {
      console.error('❌ Failed to delete person:', err);
      throw err;
    }
  }, [people]);

  // ==================== HOUSE OPERATIONS ====================

  /**
   * Add a new house
   * @param {Object} houseData - The house data to add
   * @returns {number} The new house's ID
   */
  const addHouse = useCallback(async (houseData) => {
    try {
      const newId = await dbAddHouse(houseData);
      const newHouse = { ...houseData, id: newId };
      setHouses(prev => [...prev, newHouse]);
      setDataVersion(v => v + 1);
      
      console.log('✅ House added:', newHouse.houseName);
      return newId;
    } catch (err) {
      console.error('❌ Failed to add house:', err);
      throw err;
    }
  }, []);

  /**
   * Update an existing house
   * @param {number} id - The house's ID
   * @param {Object} updates - Fields to update
   */
  const updateHouse = useCallback(async (id, updates) => {
    try {
      await dbUpdateHouse(id, updates);
      setHouses(prev => prev.map(house => 
        house.id === id ? { ...house, ...updates } : house
      ));
      setDataVersion(v => v + 1);
      
      console.log('✅ House updated:', id);
    } catch (err) {
      console.error('❌ Failed to update house:', err);
      throw err;
    }
  }, []);

  /**
   * Delete a house
   * @param {number} id - The house's ID
   */
  const deleteHouse = useCallback(async (id) => {
    try {
      await dbDeleteHouse(id);
      setHouses(prev => prev.filter(house => house.id !== id));
      setDataVersion(v => v + 1);
      
      console.log('✅ House deleted:', id);
    } catch (err) {
      console.error('❌ Failed to delete house:', err);
      throw err;
    }
  }, []);

  // ==================== RELATIONSHIP OPERATIONS ====================

  /**
   * Add a new relationship
   * @param {Object} relationshipData - The relationship data to add
   * @returns {number} The new relationship's ID
   */
  const addRelationship = useCallback(async (relationshipData) => {
    try {
      const newId = await dbAddRelationship(relationshipData);
      const newRelationship = { ...relationshipData, id: newId };
      setRelationships(prev => [...prev, newRelationship]);
      setDataVersion(v => v + 1);
      
      console.log('✅ Relationship added:', relationshipData.relationshipType);
      return newId;
    } catch (err) {
      console.error('❌ Failed to add relationship:', err);
      throw err;
    }
  }, []);

  /**
   * Update an existing relationship
   * @param {number} id - The relationship's ID
   * @param {Object} updates - Fields to update
   */
  const updateRelationship = useCallback(async (id, updates) => {
    try {
      await dbUpdateRelationship(id, updates);
      setRelationships(prev => prev.map(rel => 
        rel.id === id ? { ...rel, ...updates } : rel
      ));
      setDataVersion(v => v + 1);
      
      console.log('✅ Relationship updated:', id);
    } catch (err) {
      console.error('❌ Failed to update relationship:', err);
      throw err;
    }
  }, []);

  /**
   * Delete a relationship
   * @param {number} id - The relationship's ID
   */
  const deleteRelationship = useCallback(async (id) => {
    try {
      await dbDeleteRelationship(id);
      setRelationships(prev => prev.filter(rel => rel.id !== id));
      setDataVersion(v => v + 1);
      
      console.log('✅ Relationship deleted:', id);
    } catch (err) {
      console.error('❌ Failed to delete relationship:', err);
      throw err;
    }
  }, []);

  // ==================== SPECIAL OPERATIONS ====================

  /**
   * Found a cadet house (complex operation involving person + house)
   * @param {Object} ceremonyData - The cadet house ceremony data
   * @returns {Object} The new house and updated founder
   */
  const foundCadetHouse = useCallback(async (ceremonyData) => {
    try {
      const result = await dbFoundCadetHouse(ceremonyData);
      
      // Refresh all data since this operation touches multiple entities
      // (A new house is created AND the founder's person record is updated)
      await loadAllData();
      
      console.log('✅ Cadet house founded:', result.house.houseName);
      return result;
    } catch (err) {
      console.error('❌ Failed to found cadet house:', err);
      throw err;
    }
  }, [loadAllData]);

  /**
   * Delete ALL data (nuclear option)
   * Clears all people, houses, and relationships
   */
  const deleteAllData = useCallback(async () => {
    try {
      await dbDeleteAllData();
      
      // Clear local state
      setPeople([]);
      setHouses([]);
      setRelationships([]);
      setDataVersion(v => v + 1);
      
      console.log('✅ All data deleted');
    } catch (err) {
      console.error('❌ Failed to delete all data:', err);
      throw err;
    }
  }, []);

  // ==================== HELPER FUNCTIONS ====================
  // Convenience functions for common lookups

  /**
   * Get a person by ID
   * @param {number} id - The person's ID
   * @returns {Object|undefined} The person object or undefined
   */
  const getPersonById = useCallback((id) => {
    return people.find(p => p.id === id);
  }, [people]);

  /**
   * Get a house by ID
   * @param {number} id - The house's ID
   * @returns {Object|undefined} The house object or undefined
   */
  const getHouseById = useCallback((id) => {
    return houses.find(h => h.id === id);
  }, [houses]);

  /**
   * Get people belonging to a specific house
   * @param {number} houseId - The house's ID
   * @returns {Array} Array of people in that house
   */
  const getPeopleByHouse = useCallback((houseId) => {
    return people.filter(p => p.houseId === houseId);
  }, [people]);

  /**
   * Get relationships for a specific person
   * @param {number} personId - The person's ID
   * @returns {Array} Array of relationships involving that person
   */
  const getRelationshipsForPerson = useCallback((personId) => {
    return relationships.filter(r => 
      r.person1Id === personId || r.person2Id === personId
    );
  }, [relationships]);

  // ==================== CONTEXT VALUE ====================
  // This is the object that consuming components receive
  // It contains all the data AND all the functions to modify it
  
  const contextValue = {
    // Data (read-only from consumer's perspective)
    people,
    houses,
    relationships,
    
    // State
    loading,
    error,
    dataVersion,
    
    // Person operations
    addPerson,
    updatePerson,
    deletePerson,
    
    // House operations
    addHouse,
    updateHouse,
    deleteHouse,
    
    // Relationship operations
    addRelationship,
    updateRelationship,
    deleteRelationship,
    
    // Special operations
    foundCadetHouse,
    deleteAllData,
    
    // Helpers
    getPersonById,
    getHouseById,
    getPeopleByHouse,
    getRelationshipsForPerson,
    
    // Manual refresh (usually not needed, but available)
    refreshData: loadAllData
  };

  return (
    <GenealogyContext.Provider value={contextValue}>
      {children}
    </GenealogyContext.Provider>
  );
}

/**
 * useGenealogy Hook
 * 
 * This is how components access the shared genealogy data.
 * 
 * Usage:
 *   const { people, houses, addPerson, updateHouse } = useGenealogy();
 * 
 * The hook will throw an error if used outside of GenealogyProvider,
 * which helps catch setup mistakes early.
 */
export function useGenealogy() {
  const context = useContext(GenealogyContext);
  
  if (context === null) {
    throw new Error(
      'useGenealogy must be used within a GenealogyProvider. ' +
      'Make sure your component is wrapped in <GenealogyProvider>.'
    );
  }
  
  return context;
}

// Default export for convenience
export default GenealogyContext;
