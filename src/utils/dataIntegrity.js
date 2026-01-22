/**
 * dataIntegrity.js - Data Validation & Integrity Utilities
 *
 * PURPOSE:
 * Provides validation functions to detect and prevent data integrity issues:
 * - Circular references in ancestry (person being their own ancestor)
 * - Orphaned records (references to non-existent entities)
 * - Duplicate detection for namesakes
 *
 * USAGE:
 * Import these validators before creating/updating relationships
 * to prevent invalid data from being saved.
 */

/**
 * Detects if adding a parent relationship would create a circular reference
 *
 * A circular reference occurs when:
 * - Person A is set as parent of Person B
 * - But Person B is already an ancestor of Person A
 *
 * This would create an impossible loop where someone is their own ancestor.
 *
 * @param {number} childId - The person who would be the child
 * @param {number} proposedParentId - The person being considered as parent
 * @param {Array} relationships - All relationships in the database
 * @param {Set} visited - Internal: tracks visited nodes to detect cycles
 * @returns {{ isCircular: boolean, path?: number[] }} Result with path if circular
 *
 * @example
 * const result = detectCircularAncestry(child.id, parent.id, allRelationships);
 * if (result.isCircular) {
 *   throw new Error(`Cannot set parent: would create circular ancestry: ${result.path.join(' → ')}`);
 * }
 */
export function detectCircularAncestry(childId, proposedParentId, relationships, visited = new Set(), path = []) {
  // Base case: if proposed parent is the child, direct circular reference
  if (childId === proposedParentId) {
    return { isCircular: true, path: [...path, proposedParentId] };
  }

  // Prevent infinite loops on already-visited nodes
  if (visited.has(proposedParentId)) {
    return { isCircular: false };
  }

  visited.add(proposedParentId);
  path.push(proposedParentId);

  // Find all ancestors of the proposed parent
  const parentRelationships = relationships.filter(
    r => r.relationshipType === 'parent-child' && r.person2Id === proposedParentId
  );

  // For each ancestor of the proposed parent, check if they lead back to child
  for (const rel of parentRelationships) {
    const ancestorId = rel.person1Id; // person1Id is the parent in parent-child

    // If this ancestor IS the child, we have a circular reference
    if (ancestorId === childId) {
      return { isCircular: true, path: [...path, childId] };
    }

    // Recursively check this ancestor's parents
    const result = detectCircularAncestry(childId, ancestorId, relationships, visited, [...path]);
    if (result.isCircular) {
      return result;
    }
  }

  return { isCircular: false };
}

/**
 * Validates that a parent-child relationship can be created
 *
 * Checks for:
 * 1. Self-reference (person cannot be their own parent)
 * 2. Circular ancestry (would create impossible loop)
 * 3. Duplicate relationship (relationship already exists)
 *
 * @param {number} parentId - The proposed parent
 * @param {number} childId - The proposed child
 * @param {Array} relationships - All existing relationships
 * @returns {{ valid: boolean, error?: string }} Validation result
 */
export function validateParentChildRelationship(parentId, childId, relationships) {
  // Check self-reference
  if (parentId === childId) {
    return { valid: false, error: 'A person cannot be their own parent' };
  }

  // Check for existing relationship
  const existingRelationship = relationships.find(
    r => r.relationshipType === 'parent-child' &&
         r.person1Id === parentId &&
         r.person2Id === childId
  );

  if (existingRelationship) {
    return { valid: false, error: 'This parent-child relationship already exists' };
  }

  // Check for circular ancestry
  // Note: We check if the child is already an ancestor of the proposed parent
  // by seeing if adding parent → child would create a loop
  const circularCheck = detectCircularAncestry(parentId, childId, relationships);

  if (circularCheck.isCircular) {
    const pathStr = circularCheck.path.join(' → ');
    return {
      valid: false,
      error: `Cannot create relationship: would cause circular ancestry (${pathStr})`
    };
  }

  return { valid: true };
}

/**
 * Finds all orphaned records in the database
 *
 * Orphaned records are:
 * - Relationships referencing non-existent people
 * - People referencing non-existent houses
 * - Codex links referencing non-existent entries
 *
 * @param {Object} data - Database data { people, houses, relationships, codexEntries, codexLinks }
 * @returns {Object} Orphaned records by type
 */
export function findOrphanedRecords(data) {
  const {
    people = [],
    houses = [],
    relationships = [],
    codexEntries = [],
    codexLinks = []
  } = data;

  const peopleIds = new Set(people.map(p => p.id));
  const houseIds = new Set(houses.map(h => h.id));
  const codexIds = new Set(codexEntries.map(e => e.id));

  const orphans = {
    relationships: [],
    peopleWithMissingHouse: [],
    codexLinks: []
  };

  // Check relationships for missing people
  for (const rel of relationships) {
    if (!peopleIds.has(rel.person1Id) || !peopleIds.has(rel.person2Id)) {
      orphans.relationships.push({
        id: rel.id,
        missingPerson1: !peopleIds.has(rel.person1Id) ? rel.person1Id : null,
        missingPerson2: !peopleIds.has(rel.person2Id) ? rel.person2Id : null
      });
    }
  }

  // Check people for missing houses
  for (const person of people) {
    if (person.houseId && !houseIds.has(person.houseId)) {
      orphans.peopleWithMissingHouse.push({
        personId: person.id,
        personName: `${person.firstName} ${person.lastName}`,
        missingHouseId: person.houseId
      });
    }
  }

  // Check codex links for missing entries
  for (const link of codexLinks) {
    if (!codexIds.has(link.sourceId) || !codexIds.has(link.targetId)) {
      orphans.codexLinks.push({
        id: link.id,
        missingSource: !codexIds.has(link.sourceId) ? link.sourceId : null,
        missingTarget: !codexIds.has(link.targetId) ? link.targetId : null
      });
    }
  }

  return orphans;
}

/**
 * Validates bidirectional integrity of relationships
 *
 * In some relationship types, both directions should be consistent.
 * For example, if A is married to B, B should be married to A.
 *
 * @param {Array} relationships - All relationships
 * @returns {Array} Inconsistent relationships
 */
export function validateBidirectionalRelationships(relationships) {
  const inconsistencies = [];

  // Marriage relationships should be bidirectional
  const marriageRelationships = relationships.filter(r => r.relationshipType === 'marriage');

  for (const marriage of marriageRelationships) {
    // Check if reverse relationship exists
    const reverse = marriageRelationships.find(
      m => m.person1Id === marriage.person2Id && m.person2Id === marriage.person1Id
    );

    // Marriages typically stored once (not bidirectionally), so this is informational
    // But if both directions exist, they should have consistent data
    if (reverse && marriage.id !== reverse.id) {
      if (marriage.marriageDate !== reverse.marriageDate) {
        inconsistencies.push({
          type: 'marriage-date-mismatch',
          relationship1: marriage.id,
          relationship2: reverse.id,
          person1: marriage.person1Id,
          person2: marriage.person2Id
        });
      }
    }
  }

  return inconsistencies;
}

/**
 * Run a full data integrity check
 *
 * @param {Object} data - All database data
 * @returns {Object} Full integrity report
 */
export function runIntegrityCheck(data) {
  const orphans = findOrphanedRecords(data);
  const bidirectionalIssues = validateBidirectionalRelationships(data.relationships || []);

  // Check for circular references in parent-child relationships
  const circularIssues = [];
  const parentChildRels = (data.relationships || []).filter(
    r => r.relationshipType === 'parent-child'
  );

  for (const rel of parentChildRels) {
    const check = detectCircularAncestry(rel.person1Id, rel.person2Id, data.relationships || []);
    if (check.isCircular) {
      circularIssues.push({
        relationshipId: rel.id,
        parentId: rel.person1Id,
        childId: rel.person2Id,
        path: check.path
      });
    }
  }

  const hasIssues =
    orphans.relationships.length > 0 ||
    orphans.peopleWithMissingHouse.length > 0 ||
    orphans.codexLinks.length > 0 ||
    bidirectionalIssues.length > 0 ||
    circularIssues.length > 0;

  return {
    healthy: !hasIssues,
    timestamp: new Date().toISOString(),
    issues: {
      orphanedRelationships: orphans.relationships,
      orphanedPeopleHouses: orphans.peopleWithMissingHouse,
      orphanedCodexLinks: orphans.codexLinks,
      bidirectionalInconsistencies: bidirectionalIssues,
      circularAncestry: circularIssues
    },
    summary: {
      totalOrphanedRelationships: orphans.relationships.length,
      totalOrphanedPeopleHouses: orphans.peopleWithMissingHouse.length,
      totalOrphanedCodexLinks: orphans.codexLinks.length,
      totalBidirectionalIssues: bidirectionalIssues.length,
      totalCircularIssues: circularIssues.length
    }
  };
}

export default {
  detectCircularAncestry,
  validateParentChildRelationship,
  findOrphanedRecords,
  validateBidirectionalRelationships,
  runIntegrityCheck
};
