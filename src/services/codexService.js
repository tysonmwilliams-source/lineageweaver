/**
 * Codex Service
 * 
 * Handles all database operations for The Codex encyclopedia system.
 * Manages codex entries (character bios, locations, events, etc.) and their links.
 */

import { db } from './database.js';

// ==================== CODEX ENTRY OPERATIONS ====================

/**
 * Create a new codex entry
 * @param {Object} entryData - Entry data with required fields
 * @returns {Promise<number>} - ID of created entry
 */
export async function createEntry(entryData) {
  try {
    // Ensure required fields
    const entry = {
      // Core identity
      type: entryData.type, // Required: 'personage', 'house', 'location', 'event', 'mysteria', 'custom'
      title: entryData.title, // Required
      subtitle: entryData.subtitle || null,
      
      // Content
      content: entryData.content || '', // Markdown text with [[wiki-links]]
      sections: entryData.sections || [], // Array of section objects
      
      // Organization
      category: entryData.category || null,
      tags: entryData.tags || [], // Array of strings
      era: entryData.era || null, // Time period
      
      // Links (for external references - personId, houseId, etc.)
      personId: entryData.personId || null, // Link to Person entity
      houseId: entryData.houseId || null, // Link to House entity
      
      // Metadata
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      wordCount: calculateWordCount(entryData.content || ''),
      
      // Version control (future)
      version: 1,
      changelog: []
    };
    
    const id = await db.codexEntries.add(entry);
    console.log('Codex entry created with ID:', id);
    return id;
  } catch (error) {
    console.error('Error creating codex entry:', error);
    throw error;
  }
}

/**
 * Get a single codex entry by ID
 */
export async function getEntry(id) {
  try {
    const entry = await db.codexEntries.get(id);
    return entry;
  } catch (error) {
    console.error('Error getting codex entry:', error);
    throw error;
  }
}

/**
 * Get a codex entry by personId
 * 
 * TREE-CODEX INTEGRATION: Used to find the Codex entry for a person
 * when navigating from the Family Tree or Data Management.
 * 
 * @param {number} personId - The person's database ID
 * @returns {Object|null} The codex entry or null if not found
 */
export async function getEntryByPersonId(personId) {
  try {
    const entries = await db.codexEntries
      .filter(entry => entry.personId === personId)
      .toArray();
    
    // Return the first match (should only be one per person)
    return entries.length > 0 ? entries[0] : null;
  } catch (error) {
    console.error('Error getting codex entry by personId:', error);
    throw error;
  }
}

/**
 * Get all codex entries
 */
export async function getAllEntries() {
  try {
    const entries = await db.codexEntries.toArray();
    return entries;
  } catch (error) {
    console.error('Error getting all codex entries:', error);
    throw error;
  }
}

/**
 * Get entries by type
 * @param {string} type - Entry type (personage, house, location, event, mysteria, custom)
 */
export async function getEntriesByType(type) {
  try {
    const entries = await db.codexEntries.where('type').equals(type).toArray();
    return entries;
  } catch (error) {
    console.error('Error getting entries by type:', error);
    throw error;
  }
}

/**
 * Get entries by category
 */
export async function getEntriesByCategory(category) {
  try {
    const entries = await db.codexEntries.where('category').equals(category).toArray();
    return entries;
  } catch (error) {
    console.error('Error getting entries by category:', error);
    throw error;
  }
}

/**
 * Get entries by era
 */
export async function getEntriesByEra(era) {
  try {
    const entries = await db.codexEntries.where('era').equals(era).toArray();
    return entries;
  } catch (error) {
    console.error('Error getting entries by era:', error);
    throw error;
  }
}

/**
 * Get entries by tag
 */
export async function getEntriesByTag(tag) {
  try {
    // Dexie's multi-entry index (the * prefix) allows this
    const entries = await db.codexEntries.where('tags').equals(tag).toArray();
    return entries;
  } catch (error) {
    console.error('Error getting entries by tag:', error);
    throw error;
  }
}

/**
 * Search entries by title (case-insensitive)
 */
export async function searchEntriesByTitle(searchTerm) {
  try {
    const allEntries = await db.codexEntries.toArray();
    const searchLower = searchTerm.toLowerCase();
    
    return allEntries.filter(entry => 
      entry.title.toLowerCase().includes(searchLower)
    );
  } catch (error) {
    console.error('Error searching entries:', error);
    throw error;
  }
}

/**
 * Full-text search across all entry content
 */
export async function searchEntriesFullText(searchTerm) {
  try {
    const allEntries = await db.codexEntries.toArray();
    const searchLower = searchTerm.toLowerCase();
    
    return allEntries.filter(entry => {
      const titleMatch = entry.title.toLowerCase().includes(searchLower);
      const subtitleMatch = entry.subtitle?.toLowerCase().includes(searchLower);
      const contentMatch = entry.content.toLowerCase().includes(searchLower);
      
      return titleMatch || subtitleMatch || contentMatch;
    });
  } catch (error) {
    console.error('Error in full-text search:', error);
    throw error;
  }
}

/**
 * Update an existing codex entry
 */
export async function updateEntry(id, updates) {
  try {
    // Always update the 'updated' timestamp and recalculate word count
    const modifiedUpdates = {
      ...updates,
      updated: new Date().toISOString()
    };
    
    if (updates.content !== undefined) {
      modifiedUpdates.wordCount = calculateWordCount(updates.content);
    }
    
    const result = await db.codexEntries.update(id, modifiedUpdates);
    console.log('Codex entry updated:', result);
    return result;
  } catch (error) {
    console.error('Error updating codex entry:', error);
    throw error;
  }
}

/**
 * Delete a codex entry
 */
export async function deleteEntry(id) {
  try {
    // Delete the entry
    await db.codexEntries.delete(id);
    
    // Delete all links associated with this entry
    await deleteLinksForEntry(id);
    
    console.log('Codex entry deleted:', id);
  } catch (error) {
    console.error('Error deleting codex entry:', error);
    throw error;
  }
}

// ==================== CODEX LINK OPERATIONS ====================

/**
 * Create a link between two entries
 * @param {Object} linkData - Link data
 */
export async function createLink(linkData) {
  try {
    const link = {
      sourceId: linkData.sourceId, // Entry ID that contains the link
      targetId: linkData.targetId, // Entry ID being linked to
      type: linkData.type || 'reference', // Type of relationship
      label: linkData.label || null, // Optional label for the link
      bidirectional: linkData.bidirectional !== undefined ? linkData.bidirectional : true
    };
    
    const id = await db.codexLinks.add(link);
    console.log('Codex link created with ID:', id);
    return id;
  } catch (error) {
    console.error('Error creating codex link:', error);
    throw error;
  }
}

/**
 * Get all outgoing links from an entry (links this entry makes to others)
 */
export async function getOutgoingLinks(entryId) {
  try {
    const links = await db.codexLinks.where('sourceId').equals(entryId).toArray();
    return links;
  } catch (error) {
    console.error('Error getting outgoing links:', error);
    throw error;
  }
}

/**
 * Get all incoming links to an entry (backlinks - other entries that mention this one)
 */
export async function getIncomingLinks(entryId) {
  try {
    const links = await db.codexLinks.where('targetId').equals(entryId).toArray();
    return links;
  } catch (error) {
    console.error('Error getting incoming links:', error);
    throw error;
  }
}

/**
 * Get all links for an entry (both incoming and outgoing)
 */
export async function getAllLinksForEntry(entryId) {
  try {
    const [outgoing, incoming] = await Promise.all([
      getOutgoingLinks(entryId),
      getIncomingLinks(entryId)
    ]);
    
    return {
      outgoing,
      incoming
    };
  } catch (error) {
    console.error('Error getting all links for entry:', error);
    throw error;
  }
}

/**
 * Delete all links associated with an entry
 */
export async function deleteLinksForEntry(entryId) {
  try {
    // Delete where this entry is the source
    await db.codexLinks.where('sourceId').equals(entryId).delete();
    
    // Delete where this entry is the target
    await db.codexLinks.where('targetId').equals(entryId).delete();
    
    console.log('All links deleted for entry:', entryId);
  } catch (error) {
    console.error('Error deleting links for entry:', error);
    throw error;
  }
}

/**
 * Delete a specific link
 */
export async function deleteLink(linkId) {
  try {
    await db.codexLinks.delete(linkId);
    console.log('Codex link deleted:', linkId);
  } catch (error) {
    console.error('Error deleting codex link:', error);
    throw error;
  }
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Calculate word count from markdown content
 */
function calculateWordCount(content) {
  if (!content) return 0;
  
  // Remove markdown syntax for more accurate count
  const cleanText = content
    .replace(/\[\[.*?\]\]/g, '') // Remove wiki links
    .replace(/[#*_`]/g, '') // Remove markdown formatting
    .trim();
  
  const words = cleanText.split(/\s+/).filter(word => word.length > 0);
  return words.length;
}

/**
 * Get entry statistics
 */
export async function getCodexStatistics() {
  try {
    const allEntries = await getAllEntries();
    
    const stats = {
      total: allEntries.length,
      byType: {},
      totalWords: 0,
      recentlyUpdated: []
    };
    
    // Count by type
    allEntries.forEach(entry => {
      stats.byType[entry.type] = (stats.byType[entry.type] || 0) + 1;
      stats.totalWords += entry.wordCount || 0;
    });
    
    // Get 5 most recently updated
    stats.recentlyUpdated = allEntries
      .sort((a, b) => new Date(b.updated) - new Date(a.updated))
      .slice(0, 5)
      .map(e => ({ id: e.id, title: e.title, updated: e.updated }));
    
    return stats;
  } catch (error) {
    console.error('Error getting codex statistics:', error);
    throw error;
  }
}

export default {
  // Entry operations
  createEntry,
  getEntry,
  getEntryByPersonId, // TREE-CODEX INTEGRATION
  getAllEntries,
  getEntriesByType,
  getEntriesByCategory,
  getEntriesByEra,
  getEntriesByTag,
  searchEntriesByTitle,
  searchEntriesFullText,
  updateEntry,
  deleteEntry,
  
  // Link operations
  createLink,
  getOutgoingLinks,
  getIncomingLinks,
  getAllLinksForEntry,
  deleteLinksForEntry,
  deleteLink,
  
  // Statistics
  getCodexStatistics
};