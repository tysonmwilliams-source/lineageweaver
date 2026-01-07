/**
 * Relationship Calculator - ENHANCED VERSION
 * 
 * Calculates family relationships with:
 * - Gender-aware labels (Mother vs Father, etc.)
 * - Half-sibling detection
 * - Extended cousin support (1st, 2nd, 3rd cousins + removals)
 * - Great-great grandparent/child support
 * - More in-law relationships
 * 
 * USAGE:
 * import { calculateRelationship, calculateAllRelationships } from './RelationshipCalculator';
 * 
 * const label = calculateRelationship(selectedPersonId, targetPersonId, parentMap, childrenMap, spouseMap, peopleById);
 * // Returns: "Grandmother", "Half-Brother", "2nd Cousin", "Great-Great-Grandfather", etc.
 */

/**
 * Calculate the relationship between two people
 * 
 * @param {number} personId - The "reference" person (e.g., the selected person)
 * @param {number} targetId - The person we're calculating the relationship for
 * @param {Map} parentMap - Map of personId -> [parentId, parentId]
 * @param {Map} childrenMap - Map of personId -> [childId, childId, ...]
 * @param {Map} spouseMap - Map of personId -> spouseId
 * @param {Map} peopleById - Map of personId -> person object (for gender lookup)
 * @returns {string|null} The relationship label or null if unrelated
 */
export function calculateRelationship(personId, targetId, parentMap, childrenMap, spouseMap, peopleById) {
  if (personId === targetId) {
    return 'Self';
  }

  const targetPerson = peopleById.get(targetId);
  if (!targetPerson) return null;

  // ══════════════════════════════════════════════════════════════════════
  // DIRECT RELATIONSHIPS (1 degree)
  // ══════════════════════════════════════════════════════════════════════
  
  // Check if spouse
  if (spouseMap.get(personId) === targetId) {
    return getGenderedLabel(targetPerson, 'Husband', 'Wife', 'Spouse');
  }

  // Check if parent
  const personParents = parentMap.get(personId) || [];
  if (personParents.includes(targetId)) {
    return getGenderedLabel(targetPerson, 'Father', 'Mother', 'Parent');
  }

  // Check if child
  const personChildren = childrenMap.get(personId) || [];
  if (personChildren.includes(targetId)) {
    return getGenderedLabel(targetPerson, 'Son', 'Daughter', 'Child');
  }

  // Check if sibling (including half-sibling detection)
  const siblingType = getSiblingType(personId, targetId, parentMap);
  if (siblingType) {
    if (siblingType === 'full') {
      return getGenderedLabel(targetPerson, 'Brother', 'Sister', 'Sibling');
    } else {
      return getGenderedLabel(targetPerson, 'Half-Brother', 'Half-Sister', 'Half-Sibling');
    }
  }

  // ══════════════════════════════════════════════════════════════════════
  // GRANDPARENTS & GRANDCHILDREN (2 degrees)
  // ══════════════════════════════════════════════════════════════════════
  
  const grandparents = getGrandparents(personId, parentMap);
  if (grandparents.includes(targetId)) {
    return getGenderedLabel(targetPerson, 'Grandfather', 'Grandmother', 'Grandparent');
  }

  const grandchildren = getGrandchildren(personId, childrenMap);
  if (grandchildren.includes(targetId)) {
    return getGenderedLabel(targetPerson, 'Grandson', 'Granddaughter', 'Grandchild');
  }

  // ══════════════════════════════════════════════════════════════════════
  // AUNTS/UNCLES & NIECES/NEPHEWS (2 degrees)
  // ══════════════════════════════════════════════════════════════════════
  
  if (isAuntUncle(personId, targetId, parentMap, childrenMap)) {
    return getGenderedLabel(targetPerson, 'Uncle', 'Aunt', 'Aunt/Uncle');
  }

  if (isNieceNephew(personId, targetId, parentMap, childrenMap)) {
    return getGenderedLabel(targetPerson, 'Nephew', 'Niece', 'Niece/Nephew');
  }

  // ══════════════════════════════════════════════════════════════════════
  // GREAT-GRANDPARENTS & GREAT-GRANDCHILDREN (3 degrees)
  // ══════════════════════════════════════════════════════════════════════
  
  const greatGrandparents = getGreatGrandparents(personId, parentMap);
  if (greatGrandparents.includes(targetId)) {
    return getGenderedLabel(targetPerson, 'Great-Grandfather', 'Great-Grandmother', 'Great-Grandparent');
  }

  const greatGrandchildren = getGreatGrandchildren(personId, childrenMap);
  if (greatGrandchildren.includes(targetId)) {
    return getGenderedLabel(targetPerson, 'Great-Grandson', 'Great-Granddaughter', 'Great-Grandchild');
  }

  // ══════════════════════════════════════════════════════════════════════
  // GREAT-AUNTS/UNCLES & GRAND-NIECES/NEPHEWS
  // ══════════════════════════════════════════════════════════════════════
  
  if (isGreatAuntUncle(personId, targetId, parentMap, childrenMap)) {
    return getGenderedLabel(targetPerson, 'Great-Uncle', 'Great-Aunt', 'Great-Aunt/Uncle');
  }

  if (isGrandNieceNephew(personId, targetId, parentMap, childrenMap)) {
    return getGenderedLabel(targetPerson, 'Grand-Nephew', 'Grand-Niece', 'Grand-Niece/Nephew');
  }

  // ══════════════════════════════════════════════════════════════════════
  // GREAT-GREAT GRANDPARENTS & CHILDREN (4 degrees)
  // ══════════════════════════════════════════════════════════════════════
  
  const greatGreatGrandparents = getGreatGreatGrandparents(personId, parentMap);
  if (greatGreatGrandparents.includes(targetId)) {
    return getGenderedLabel(targetPerson, '2nd Great-Grandfather', '2nd Great-Grandmother', '2nd Great-Grandparent');
  }

  const greatGreatGrandchildren = getGreatGreatGrandchildren(personId, childrenMap);
  if (greatGreatGrandchildren.includes(targetId)) {
    return getGenderedLabel(targetPerson, '2nd Great-Grandson', '2nd Great-Granddaughter', '2nd Great-Grandchild');
  }

  // ══════════════════════════════════════════════════════════════════════
  // COUSINS (same generation, different lines)
  // ══════════════════════════════════════════════════════════════════════
  
  const cousinResult = getCousinRelationship(personId, targetId, parentMap, childrenMap);
  if (cousinResult) {
    return cousinResult;
  }

  // ══════════════════════════════════════════════════════════════════════
  // IN-LAWS
  // ══════════════════════════════════════════════════════════════════════
  
  const inLawResult = getInLawRelationship(personId, targetId, spouseMap, parentMap, childrenMap, peopleById);
  if (inLawResult) {
    return inLawResult;
  }

  // ══════════════════════════════════════════════════════════════════════
  // STEP-RELATIONSHIPS
  // ══════════════════════════════════════════════════════════════════════
  
  const stepResult = getStepRelationship(personId, targetId, spouseMap, parentMap, childrenMap, peopleById);
  if (stepResult) {
    return stepResult;
  }

  return null; // Unrelated or too distant
}

// ════════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Get gendered label based on person's gender
 */
function getGenderedLabel(person, maleLabel, femaleLabel, neutralLabel) {
  if (person.gender === 'male') return maleLabel;
  if (person.gender === 'female') return femaleLabel;
  return neutralLabel;
}

/**
 * Check if two people are siblings and determine if full or half
 * Returns: 'full' | 'half' | null
 */
function getSiblingType(person1Id, person2Id, parentMap) {
  const parents1 = parentMap.get(person1Id) || [];
  const parents2 = parentMap.get(person2Id) || [];
  
  if (parents1.length === 0 || parents2.length === 0) return null;
  
  // Find shared parents
  const sharedParents = parents1.filter(p => parents2.includes(p));
  
  if (sharedParents.length === 0) return null;
  
  // If both have exactly 2 parents and share both, they're full siblings
  // If they share only 1 parent, they're half siblings
  if (sharedParents.length >= 2 || 
      (parents1.length === 1 && parents2.length === 1 && sharedParents.length === 1)) {
    return 'full';
  }
  
  return 'half';
}

/**
 * Get all siblings (full and half) for a person
 */
function getSiblings(personId, parentMap, childrenMap) {
  const parents = parentMap.get(personId) || [];
  if (parents.length === 0) return [];
  
  const siblings = new Set();
  
  parents.forEach(parentId => {
    const parentChildren = childrenMap.get(parentId) || [];
    parentChildren.forEach(childId => {
      if (childId !== personId) {
        siblings.add(childId);
      }
    });
  });
  
  return Array.from(siblings);
}

/**
 * Get grandparents (2 generations up)
 */
function getGrandparents(personId, parentMap) {
  const parents = parentMap.get(personId) || [];
  const grandparents = [];
  
  parents.forEach(parentId => {
    const parentParents = parentMap.get(parentId) || [];
    grandparents.push(...parentParents);
  });
  
  return grandparents;
}

/**
 * Get grandchildren (2 generations down)
 */
function getGrandchildren(personId, childrenMap) {
  const children = childrenMap.get(personId) || [];
  const grandchildren = [];
  
  children.forEach(childId => {
    const childChildren = childrenMap.get(childId) || [];
    grandchildren.push(...childChildren);
  });
  
  return grandchildren;
}

/**
 * Get great-grandparents (3 generations up)
 */
function getGreatGrandparents(personId, parentMap) {
  const grandparents = getGrandparents(personId, parentMap);
  const greatGrandparents = [];
  
  grandparents.forEach(gpId => {
    const gpParents = parentMap.get(gpId) || [];
    greatGrandparents.push(...gpParents);
  });
  
  return greatGrandparents;
}

/**
 * Get great-grandchildren (3 generations down)
 */
function getGreatGrandchildren(personId, childrenMap) {
  const grandchildren = getGrandchildren(personId, childrenMap);
  const greatGrandchildren = [];
  
  grandchildren.forEach(gcId => {
    const gcChildren = childrenMap.get(gcId) || [];
    greatGrandchildren.push(...gcChildren);
  });
  
  return greatGrandchildren;
}

/**
 * Get great-great-grandparents (4 generations up)
 */
function getGreatGreatGrandparents(personId, parentMap) {
  const greatGrandparents = getGreatGrandparents(personId, parentMap);
  const ggGrandparents = [];
  
  greatGrandparents.forEach(ggpId => {
    const ggpParents = parentMap.get(ggpId) || [];
    ggGrandparents.push(...ggpParents);
  });
  
  return ggGrandparents;
}

/**
 * Get great-great-grandchildren (4 generations down)
 */
function getGreatGreatGrandchildren(personId, childrenMap) {
  const greatGrandchildren = getGreatGrandchildren(personId, childrenMap);
  const ggGrandchildren = [];
  
  greatGrandchildren.forEach(ggcId => {
    const ggcChildren = childrenMap.get(ggcId) || [];
    ggGrandchildren.push(...ggcChildren);
  });
  
  return ggGrandchildren;
}

/**
 * Check if target is aunt/uncle of person
 */
function isAuntUncle(personId, targetId, parentMap, childrenMap) {
  const parents = parentMap.get(personId) || [];
  
  for (const parentId of parents) {
    const parentSiblings = getSiblings(parentId, parentMap, childrenMap);
    if (parentSiblings.includes(targetId)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Check if target is niece/nephew of person
 */
function isNieceNephew(personId, targetId, parentMap, childrenMap) {
  const siblings = getSiblings(personId, parentMap, childrenMap);
  
  for (const siblingId of siblings) {
    const siblingChildren = childrenMap.get(siblingId) || [];
    if (siblingChildren.includes(targetId)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Check if target is great-aunt/uncle of person
 */
function isGreatAuntUncle(personId, targetId, parentMap, childrenMap) {
  const grandparents = getGrandparents(personId, parentMap);
  
  for (const gpId of grandparents) {
    const gpSiblings = getSiblings(gpId, parentMap, childrenMap);
    if (gpSiblings.includes(targetId)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Check if target is grand-niece/nephew of person
 */
function isGrandNieceNephew(personId, targetId, parentMap, childrenMap) {
  const siblings = getSiblings(personId, parentMap, childrenMap);
  
  for (const siblingId of siblings) {
    const niblings = childrenMap.get(siblingId) || [];
    for (const niblingId of niblings) {
      const niblingChildren = childrenMap.get(niblingId) || [];
      if (niblingChildren.includes(targetId)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Get cousin relationship with degree and removal
 * Returns labels like "1st Cousin", "2nd Cousin", "1st Cousin Once Removed", etc.
 */
function getCousinRelationship(personId, targetId, parentMap, childrenMap) {
  // Find common ancestor and calculate degrees
  const personAncestors = getAllAncestorsWithDepth(personId, parentMap);
  const targetAncestors = getAllAncestorsWithDepth(targetId, parentMap);
  
  // Find the closest common ancestor
  let closestCommon = null;
  let personDepth = Infinity;
  let targetDepth = Infinity;
  
  for (const [ancestorId, pDepth] of personAncestors) {
    const tDepth = targetAncestors.get(ancestorId);
    if (tDepth !== undefined) {
      // Found a common ancestor
      if (closestCommon === null || 
          Math.min(pDepth, tDepth) < Math.min(personDepth, targetDepth)) {
        closestCommon = ancestorId;
        personDepth = pDepth;
        targetDepth = tDepth;
      }
    }
  }
  
  if (!closestCommon) return null;
  
  // Direct line ancestors/descendants aren't cousins
  if (personDepth <= 1 || targetDepth <= 1) return null;
  
  // Siblings aren't cousins
  if (personDepth === 1 && targetDepth === 1) return null;
  
  // Calculate cousin degree and removal
  // Cousin degree = min(depth1, depth2) - 1
  // Removal = |depth1 - depth2|
  const cousinDegree = Math.min(personDepth, targetDepth) - 1;
  const removal = Math.abs(personDepth - targetDepth);
  
  if (cousinDegree < 1) return null;
  
  // Build the label
  const degreeLabel = getOrdinal(cousinDegree);
  
  if (removal === 0) {
    return `${degreeLabel} Cousin`;
  } else if (removal === 1) {
    return `${degreeLabel} Cousin Once Removed`;
  } else if (removal === 2) {
    return `${degreeLabel} Cousin Twice Removed`;
  } else {
    return `${degreeLabel} Cousin ${removal}x Removed`;
  }
}

/**
 * Get all ancestors with their depth from the person
 * Returns Map of ancestorId -> depth
 */
function getAllAncestorsWithDepth(personId, parentMap, maxDepth = 10) {
  const ancestors = new Map();
  const queue = [[personId, 0]];
  
  while (queue.length > 0) {
    const [currentId, depth] = queue.shift();
    
    if (depth >= maxDepth) continue;
    
    const parents = parentMap.get(currentId) || [];
    for (const parentId of parents) {
      const newDepth = depth + 1;
      if (!ancestors.has(parentId) || ancestors.get(parentId) > newDepth) {
        ancestors.set(parentId, newDepth);
        queue.push([parentId, newDepth]);
      }
    }
  }
  
  return ancestors;
}

/**
 * Get ordinal string (1st, 2nd, 3rd, etc.)
 */
function getOrdinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Get in-law relationship
 */
function getInLawRelationship(personId, targetId, spouseMap, parentMap, childrenMap, peopleById) {
  const spouse = spouseMap.get(personId);
  if (!spouse) return null;

  const targetPerson = peopleById.get(targetId);
  if (!targetPerson) return null;
  
  // Spouse's parent = Parent-in-Law
  const spouseParents = parentMap.get(spouse) || [];
  if (spouseParents.includes(targetId)) {
    return getGenderedLabel(targetPerson, 'Father-in-Law', 'Mother-in-Law', 'Parent-in-Law');
  }
  
  // Spouse's sibling = Sibling-in-Law
  const spouseSiblings = getSiblings(spouse, parentMap, childrenMap);
  if (spouseSiblings.includes(targetId)) {
    return getGenderedLabel(targetPerson, 'Brother-in-Law', 'Sister-in-Law', 'Sibling-in-Law');
  }
  
  // Sibling's spouse = Sibling-in-Law
  const personSiblings = getSiblings(personId, parentMap, childrenMap);
  for (const siblingId of personSiblings) {
    if (spouseMap.get(siblingId) === targetId) {
      return getGenderedLabel(targetPerson, 'Brother-in-Law', 'Sister-in-Law', 'Sibling-in-Law');
    }
  }
  
  // Child's spouse = Child-in-Law
  const personChildren = childrenMap.get(personId) || [];
  for (const childId of personChildren) {
    if (spouseMap.get(childId) === targetId) {
      return getGenderedLabel(targetPerson, 'Son-in-Law', 'Daughter-in-Law', 'Child-in-Law');
    }
  }
  
  // Spouse's grandparent
  const spouseGrandparents = getGrandparents(spouse, parentMap);
  if (spouseGrandparents.includes(targetId)) {
    return getGenderedLabel(targetPerson, 'Grandfather-in-Law', 'Grandmother-in-Law', 'Grandparent-in-Law');
  }
  
  return null;
}

/**
 * Get step-relationship
 */
function getStepRelationship(personId, targetId, spouseMap, parentMap, childrenMap, peopleById) {
  const targetPerson = peopleById.get(targetId);
  if (!targetPerson) return null;
  
  // Person's parent's spouse's children (step-siblings)
  const personParents = parentMap.get(personId) || [];
  for (const parentId of personParents) {
    const parentSpouse = spouseMap.get(parentId);
    if (parentSpouse) {
      const stepParentChildren = childrenMap.get(parentSpouse) || [];
      if (stepParentChildren.includes(targetId)) {
        // Make sure they're not also biological siblings
        const siblingType = getSiblingType(personId, targetId, parentMap);
        if (!siblingType) {
          return getGenderedLabel(targetPerson, 'Step-Brother', 'Step-Sister', 'Step-Sibling');
        }
      }
    }
  }
  
  // Spouse's child (step-child)
  const spouse = spouseMap.get(personId);
  if (spouse) {
    const spouseChildren = childrenMap.get(spouse) || [];
    const personChildren = childrenMap.get(personId) || [];
    
    if (spouseChildren.includes(targetId) && !personChildren.includes(targetId)) {
      return getGenderedLabel(targetPerson, 'Step-Son', 'Step-Daughter', 'Step-Child');
    }
  }
  
  // Parent's spouse (step-parent)
  for (const parentId of personParents) {
    const parentSpouse = spouseMap.get(parentId);
    if (parentSpouse === targetId && !personParents.includes(targetId)) {
      return getGenderedLabel(targetPerson, 'Step-Father', 'Step-Mother', 'Step-Parent');
    }
  }
  
  return null;
}

/**
 * Get all relationships for a person
 * Returns a Map of personId -> relationship label
 */
export function calculateAllRelationships(personId, allPeople, parentMap, childrenMap, spouseMap) {
  const relationships = new Map();
  const peopleById = new Map(allPeople.map(p => [p.id, p]));
  
  allPeople.forEach(person => {
    if (person.id === personId) {
      relationships.set(person.id, 'Self');
    } else {
      const relationship = calculateRelationship(
        personId,
        person.id,
        parentMap,
        childrenMap,
        spouseMap,
        peopleById
      );
      if (relationship) {
        relationships.set(person.id, relationship);
      }
    }
  });
  
  return relationships;
}

/**
 * Build relationship maps from raw relationship data
 * Helper function for components that need to set up the maps
 */
export function buildRelationshipMaps(relationships) {
  const parentMap = new Map();     // childId -> [parentId, parentId]
  const childrenMap = new Map();   // parentId -> [childId, ...]
  const spouseMap = new Map();     // personId -> spouseId (latest active marriage)
  
  relationships.forEach(rel => {
    if (rel.relationshipType === 'parent' || rel.relationshipType === 'adopted-parent') {
      // person1 is parent of person2
      const existingParents = parentMap.get(rel.person2Id) || [];
      parentMap.set(rel.person2Id, [...existingParents, rel.person1Id]);
      
      const existingChildren = childrenMap.get(rel.person1Id) || [];
      childrenMap.set(rel.person1Id, [...existingChildren, rel.person2Id]);
    }
    
    if (rel.relationshipType === 'spouse') {
      // Only track active marriages for the spouseMap
      if (rel.marriageStatus !== 'divorced') {
        spouseMap.set(rel.person1Id, rel.person2Id);
        spouseMap.set(rel.person2Id, rel.person1Id);
      }
    }
  });
  
  return { parentMap, childrenMap, spouseMap };
}

export default {
  calculateRelationship,
  calculateAllRelationships,
  buildRelationshipMaps
};
