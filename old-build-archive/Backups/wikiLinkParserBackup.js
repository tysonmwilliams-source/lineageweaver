/**
 * Wiki-Link Parser Utility
 * 
 * Converts markdown content to HTML and processes [[wiki-link]] syntax.
 * Automatically creates codexLinks records for discovered links.
 * 
 * HOW IT WORKS:
 * 1. Parse markdown → HTML using 'marked' library
 * 2. Find all [[Entry Name]] patterns
 * 3. Look up entries in database by title
 * 4. Replace with clickable links (or mark as broken)
 * 5. Auto-create link records in codexLinks table
 * 
 * REQUIRES: npm install marked
 */

import { marked } from 'marked';
import { 
  getAllEntries, 
  createLink, 
  getOutgoingLinks 
} from '../services/codexService';

/**
 * Parse markdown content with wiki-link processing
 * 
 * @param {string} markdown - Raw markdown text with [[wiki-links]]
 * @param {number} sourceEntryId - ID of the entry containing this content (for auto-linking)
 * @returns {Promise<string>} - HTML with processed wiki-links
 */
export async function parseWikiLinks(markdown, sourceEntryId = null) {
  if (!markdown) return '';
  
  try {
    // Step 1: Convert markdown to HTML
    const html = marked.parse(markdown);
    
    // Step 2: Find all [[Entry Name]] patterns
    const wikiLinkPattern = /\[\[([^\]]+)\]\]/g;
    const matches = [...html.matchAll(wikiLinkPattern)];
    
    if (matches.length === 0) {
      return html; // No wiki-links found
    }
    
    // Step 3: Get all entries from database (for lookup)
    const allEntries = await getAllEntries();
    
    // Create a lookup map: title → entry
    const entryMap = new Map();
    allEntries.forEach(entry => {
      // Store both exact title and lowercase for case-insensitive matching
      entryMap.set(entry.title.toLowerCase(), entry);
    });
    
    // Step 4: Get existing outgoing links (if sourceEntryId provided)
    let existingLinks = [];
    if (sourceEntryId) {
      existingLinks = await getOutgoingLinks(sourceEntryId);
    }
    
    // Step 5: Process each wiki-link
    let processedHtml = html;
    const linksToCreate = [];
    
    for (const match of matches) {
      const fullMatch = match[0]; // "[[Entry Name]]"
      const linkText = match[1].trim(); // "Entry Name"
      
      // Check for alias syntax: [[Display Text|Actual Entry]]
      let displayText = linkText;
      let searchText = linkText;
      
      if (linkText.includes('|')) {
        const parts = linkText.split('|');
        displayText = parts[0].trim();
        searchText = parts[1].trim();
      }
      
      // Look up entry (case-insensitive)
      const targetEntry = entryMap.get(searchText.toLowerCase());
      
      if (targetEntry) {
        // Entry exists - create clickable link
        const linkHtml = `<a href="/codex/entry/${targetEntry.id}" class="wiki-link" data-entry-id="${targetEntry.id}">${displayText}</a>`;
        processedHtml = processedHtml.replace(fullMatch, linkHtml);
        
        // Track link for auto-creation
        if (sourceEntryId && targetEntry.id !== sourceEntryId) {
          // Check if link already exists
          const linkExists = existingLinks.some(
            link => link.targetId === targetEntry.id
          );
          
          if (!linkExists) {
            linksToCreate.push({
              sourceId: sourceEntryId,
              targetId: targetEntry.id,
              type: 'wiki-reference',
              label: displayText !== targetEntry.title ? displayText : null,
              bidirectional: true
            });
          }
        }
      } else {
        // Entry doesn't exist - create broken link
        const brokenLinkHtml = `<span class="wiki-link-broken" title="Entry not found: ${searchText}">${displayText}</span>`;
        processedHtml = processedHtml.replace(fullMatch, brokenLinkHtml);
      }
    }
    
    // Step 6: Auto-create new links (future hook for knowledge graph)
    if (linksToCreate.length > 0) {
      await Promise.all(
        linksToCreate.map(linkData => createLink(linkData))
      );
      console.log(`Auto-created ${linksToCreate.length} wiki-links from entry ${sourceEntryId}`);
    }
    
    return processedHtml;
    
  } catch (error) {
    console.error('Error parsing wiki-links:', error);
    // Fallback: just parse markdown without wiki-links
    return marked.parse(markdown);
  }
}

/**
 * Extract all wiki-link references from markdown (without rendering)
 * Useful for validation or preview
 * 
 * @param {string} markdown - Raw markdown text
 * @returns {Array<Object>} - Array of { text, isAlias, display, search }
 */
export function extractWikiLinks(markdown) {
  if (!markdown) return [];
  
  const wikiLinkPattern = /\[\[([^\]]+)\]\]/g;
  const matches = [...markdown.matchAll(wikiLinkPattern)];
  
  return matches.map(match => {
    const linkText = match[1].trim();
    
    if (linkText.includes('|')) {
      const parts = linkText.split('|');
      return {
        text: linkText,
        isAlias: true,
        display: parts[0].trim(),
        search: parts[1].trim()
      };
    }
    
    return {
      text: linkText,
      isAlias: false,
      display: linkText,
      search: linkText
    };
  });
}

/**
 * Validate wiki-links against database
 * Returns list of broken links
 * 
 * @param {string} markdown - Raw markdown text
 * @returns {Promise<Array<string>>} - Array of entry names that don't exist
 */
export async function validateWikiLinks(markdown) {
  const links = extractWikiLinks(markdown);
  if (links.length === 0) return [];
  
  const allEntries = await getAllEntries();
  const entryTitles = new Set(
    allEntries.map(e => e.title.toLowerCase())
  );
  
  const brokenLinks = links.filter(link => {
    return !entryTitles.has(link.search.toLowerCase());
  });
  
  return brokenLinks.map(link => link.search);
}

/**
 * Get suggested entries for auto-complete
 * Used in markdown editor for type-ahead suggestions
 * 
 * @param {string} partialText - Partial entry name being typed
 * @param {number} limit - Maximum number of suggestions
 * @returns {Promise<Array<Object>>} - Array of matching entries
 */
export async function getSuggestedEntries(partialText, limit = 10) {
  if (!partialText || partialText.length < 2) return [];
  
  const allEntries = await getAllEntries();
  const searchLower = partialText.toLowerCase();
  
  // Fuzzy match: title starts with OR contains the search text
  const matches = allEntries.filter(entry => {
    const titleLower = entry.title.toLowerCase();
    return titleLower.startsWith(searchLower) || titleLower.includes(searchLower);
  });
  
  // Sort: exact matches first, then starts-with, then contains
  matches.sort((a, b) => {
    const aTitle = a.title.toLowerCase();
    const bTitle = b.title.toLowerCase();
    
    // Exact match (case-insensitive)
    if (aTitle === searchLower) return -1;
    if (bTitle === searchLower) return 1;
    
    // Starts with
    const aStarts = aTitle.startsWith(searchLower);
    const bStarts = bTitle.startsWith(searchLower);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    
    // Alphabetical
    return aTitle.localeCompare(bTitle);
  });
  
  return matches.slice(0, limit);
}

export default {
  parseWikiLinks,
  extractWikiLinks,
  validateWikiLinks,
  getSuggestedEntries
};
