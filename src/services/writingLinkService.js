/**
 * writingLinkService.js - Writing Link CRUD Operations
 *
 * Handles wiki-link references from writings to entities (People, Houses, Dignities, etc.)
 * These links are created when authors use [[wiki-links]] in their writing.
 */

import { getDatabase } from './database';

// ==================== CONSTANTS ====================

export const LINK_TARGET_TYPES = {
  PERSON: 'person',
  HOUSE: 'house',
  CODEX_ENTRY: 'codexEntry',
  DIGNITY: 'dignity',
  HERALDRY: 'heraldry'
};

// ==================== CRUD OPERATIONS ====================

/**
 * Create a new writing link
 * @param {Object} data - Link data
 * @param {number} data.writingId - Writing ID
 * @param {number} data.chapterId - Chapter ID
 * @param {string} data.targetType - Type of linked entity
 * @param {number} data.targetId - ID of linked entity
 * @param {string} [data.displayText] - Display text used in [[wiki-link]]
 * @param {string} [data.context] - Surrounding text for context
 * @param {Object} [data.position] - Position in document { from, to }
 * @param {string} [datasetId] - Dataset ID
 * @returns {Promise<number>} New link ID
 */
export async function createWritingLink(data, datasetId) {
  const db = getDatabase(datasetId);

  const link = {
    writingId: data.writingId,
    chapterId: data.chapterId,
    targetType: data.targetType,
    targetId: data.targetId,
    displayText: data.displayText || '',
    context: data.context || '',
    position: data.position || null,
    createdAt: new Date().toISOString()
  };

  const linkId = await db.writingLinks.add(link);
  console.log('Writing link created:', linkId);
  return linkId;
}

/**
 * Get a link by ID
 * @param {number} id - Link ID
 * @param {string} [datasetId] - Dataset ID
 * @returns {Promise<Object|undefined>} Link data
 */
export async function getWritingLink(id, datasetId) {
  const db = getDatabase(datasetId);
  return await db.writingLinks.get(id);
}

/**
 * Get all links for a writing
 * @param {number} writingId - Writing ID
 * @param {string} [datasetId] - Dataset ID
 * @returns {Promise<Array>} Array of links
 */
export async function getLinksByWriting(writingId, datasetId) {
  const db = getDatabase(datasetId);
  return await db.writingLinks.where('writingId').equals(writingId).toArray();
}

/**
 * Get all links for a chapter
 * @param {number} chapterId - Chapter ID
 * @param {string} [datasetId] - Dataset ID
 * @returns {Promise<Array>} Array of links
 */
export async function getLinksByChapter(chapterId, datasetId) {
  const db = getDatabase(datasetId);
  return await db.writingLinks.where('chapterId').equals(chapterId).toArray();
}

/**
 * Get all links to a specific entity
 * (backlinks - find writings that reference an entity)
 * @param {string} targetType - Entity type
 * @param {number} targetId - Entity ID
 * @param {string} [datasetId] - Dataset ID
 * @returns {Promise<Array>} Array of links
 */
export async function getLinksByTarget(targetType, targetId, datasetId) {
  const db = getDatabase(datasetId);
  return await db.writingLinks
    .where('targetType')
    .equals(targetType)
    .and(link => link.targetId === targetId)
    .toArray();
}

/**
 * Get all links
 * @param {string} [datasetId] - Dataset ID
 * @returns {Promise<Array>} Array of links
 */
export async function getAllWritingLinks(datasetId) {
  const db = getDatabase(datasetId);
  return await db.writingLinks.toArray();
}

/**
 * Delete a link
 * @param {number} id - Link ID
 * @param {string} [datasetId] - Dataset ID
 */
export async function deleteWritingLink(id, datasetId) {
  const db = getDatabase(datasetId);
  await db.writingLinks.delete(id);
  console.log('Writing link deleted:', id);
}

/**
 * Delete all links for a chapter
 * @param {number} chapterId - Chapter ID
 * @param {string} [datasetId] - Dataset ID
 * @returns {Promise<number>} Number deleted
 */
export async function deleteLinksByChapter(chapterId, datasetId) {
  const db = getDatabase(datasetId);
  const deleted = await db.writingLinks.where('chapterId').equals(chapterId).delete();
  console.log('Deleted', deleted, 'links for chapter', chapterId);
  return deleted;
}

/**
 * Delete all links for a writing
 * @param {number} writingId - Writing ID
 * @param {string} [datasetId] - Dataset ID
 * @returns {Promise<number>} Number deleted
 */
export async function deleteLinksByWriting(writingId, datasetId) {
  const db = getDatabase(datasetId);
  const deleted = await db.writingLinks.where('writingId').equals(writingId).delete();
  console.log('Deleted', deleted, 'links for writing', writingId);
  return deleted;
}

/**
 * Restore a link (for cloud sync)
 * @param {Object} data - Full link data including id
 * @param {string} [datasetId] - Dataset ID
 * @returns {Promise<number>} Link ID
 */
export async function restoreWritingLink(data, datasetId) {
  const db = getDatabase(datasetId);
  const id = await db.writingLinks.put({
    ...data,
    id: parseInt(data.id) || data.id
  });
  console.log('Writing link restored:', id);
  return id;
}

/**
 * Sync links for a chapter based on parsed content
 * Removes old links and creates new ones
 *
 * @param {number} chapterId - Chapter ID
 * @param {number} writingId - Writing ID
 * @param {Array} parsedLinks - Array of { targetType, targetId, displayText, context, position }
 * @param {string} [datasetId] - Dataset ID
 */
export async function syncChapterLinks(chapterId, writingId, parsedLinks, datasetId) {
  // Delete existing links for this chapter
  await deleteLinksByChapter(chapterId, datasetId);

  // Create new links
  for (const link of parsedLinks) {
    await createWritingLink({
      writingId,
      chapterId,
      ...link
    }, datasetId);
  }

  console.log('Synced', parsedLinks.length, 'links for chapter', chapterId);
}

/**
 * Get unique entities referenced in a writing
 * @param {number} writingId - Writing ID
 * @param {string} [datasetId] - Dataset ID
 * @returns {Promise<Object>} Object grouped by entity type
 */
export async function getReferencedEntities(writingId, datasetId) {
  const links = await getLinksByWriting(writingId, datasetId);

  const entities = {};
  for (const link of links) {
    if (!entities[link.targetType]) {
      entities[link.targetType] = new Set();
    }
    entities[link.targetType].add(link.targetId);
  }

  // Convert Sets to Arrays
  for (const type in entities) {
    entities[type] = Array.from(entities[type]);
  }

  return entities;
}

/**
 * Get link count by entity type for a writing
 * @param {number} writingId - Writing ID
 * @param {string} [datasetId] - Dataset ID
 * @returns {Promise<Object>} Counts by type
 */
export async function getLinkCountsByType(writingId, datasetId) {
  const links = await getLinksByWriting(writingId, datasetId);

  const counts = {};
  for (const link of links) {
    counts[link.targetType] = (counts[link.targetType] || 0) + 1;
  }

  return counts;
}

/**
 * Extract wiki-links from TipTap JSON content
 * Recursively walks the document tree to find wikiLink nodes
 *
 * @param {Object} content - TipTap JSON content
 * @returns {Array} Array of { targetType, targetId, displayText }
 */
export function extractWikiLinksFromContent(content) {
  const links = [];

  function walkNode(node) {
    if (!node) return;

    // Check if this is a wikiLink node
    if (node.type === 'wikiLink' && node.attrs) {
      const { id, type, label } = node.attrs;
      if (id && type) {
        links.push({
          targetType: type,
          targetId: parseInt(id),
          displayText: label || ''
        });
      }
    }

    // Recursively walk children
    if (node.content && Array.isArray(node.content)) {
      for (const child of node.content) {
        walkNode(child);
      }
    }
  }

  walkNode(content);
  return links;
}

export default {
  LINK_TARGET_TYPES,
  createWritingLink,
  getWritingLink,
  getLinksByWriting,
  getLinksByChapter,
  getLinksByTarget,
  getAllWritingLinks,
  deleteWritingLink,
  deleteLinksByChapter,
  deleteLinksByWriting,
  restoreWritingLink,
  syncChapterLinks,
  getReferencedEntities,
  getLinkCountsByType,
  extractWikiLinksFromContent
};
