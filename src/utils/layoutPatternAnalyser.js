// src/utils/layoutPatternAnalyser.js

/**
 * LAYOUT PATTERN ANALYSER
 * 
 * PURPOSE: Analyses your manually-arranged family tree positions and detects
 * patterns that can be codified into layout rules.
 * 
 * HOW IT WORKS:
 * 1. Takes your manual positions and relationship data
 * 2. Calculates distances between related people (parent-child, siblings, spouses)
 * 3. Returns statistics (min, max, average, consistency) for each relationship type
 * 4. Identifies special offsets (bastards, adopted) compared to legitimate siblings
 * 
 * WHAT IT RETURNS:
 * - generationHeight: Vertical distance between parents and children
 * - siblingSpacing: Horizontal distance between siblings
 * - spouseSpacing: Horizontal distance between married couples
 * - bastardOffset: How bastards are offset from legitimate siblings
 * - adoptedOffset: How adopted children are offset from legitimate siblings
 * - familyUnitGap: Horizontal gap between sibling family unit bounding boxes
 * 
 * Each measurement includes: count, min, max, average, consistency score (0-100%)
 */

/**
 * Build lookup maps from relationships array for efficient traversal.
 * 
 * @param {Array} relationships - Array of relationship objects
 * @returns {Object} Maps for parent->children, child->parents, person->spouses
 */
function buildRelationshipMaps(relationships) {
  const parentToChildren = new Map(); // parentId -> [childIds]
  const childToParents = new Map();   // childId -> [parentIds]
  const spouses = new Map();          // personId -> [spouseIds]
  
  relationships.forEach(rel => {
    if (rel.relationshipType === 'parent' || rel.relationshipType === 'adopted-parent') {
      // person1 is parent, person2 is child
      const children = parentToChildren.get(rel.person1Id) || [];
      children.push(rel.person2Id);
      parentToChildren.set(rel.person1Id, children);
      
      const parents = childToParents.get(rel.person2Id) || [];
      parents.push(rel.person1Id);
      childToParents.set(rel.person2Id, parents);
    }
    
    if (rel.relationshipType === 'spouse') {
      const spouses1 = spouses.get(rel.person1Id) || [];
      spouses1.push(rel.person2Id);
      spouses.set(rel.person1Id, spouses1);
      
      const spouses2 = spouses.get(rel.person2Id) || [];
      spouses2.push(rel.person1Id);
      spouses.set(rel.person2Id, spouses2);
    }
  });
  
  return { parentToChildren, childToParents, spouses };
}

/**
 * Get siblings for a person (others with same parents).
 * 
 * @param {number} personId - Person to find siblings for
 * @param {Map} childToParents - Map of child -> [parentIds]
 * @param {Map} parentToChildren - Map of parent -> [childIds]
 * @returns {Array} Array of sibling IDs
 */
function getSiblings(personId, childToParents, parentToChildren) {
  const parents = childToParents.get(personId) || [];
  if (parents.length === 0) return [];
  
  const siblingSet = new Set();
  parents.forEach(parentId => {
    const children = parentToChildren.get(parentId) || [];
    children.forEach(childId => {
      if (childId !== personId) {
        siblingSet.add(childId);
      }
    });
  });
  
  return [...siblingSet];
}

/**
 * Calculate statistics for an array of numbers.
 * 
 * @param {Array<number>} values - Numbers to analyse
 * @param {string} label - Human-readable label for this stat
 * @returns {Object} { count, min, max, avg, consistency, values, label }
 */
function calculateStats(values, label = '') {
  if (values.length === 0) {
    return { 
      count: 0, 
      min: null, 
      max: null, 
      avg: null, 
      consistency: null,
      values: [],
      label 
    };
  }
  
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  
  // Consistency = how close values are to each other (0-100%)
  // 100% means all values are identical
  // Lower consistency means more variation
  const range = max - min;
  const consistency = range === 0 ? 100 : Math.round(Math.max(0, 100 - (range / Math.max(avg, 1)) * 50));
  
  return {
    count: values.length,
    min: Math.round(min),
    max: Math.round(max),
    avg,
    consistency: Math.min(100, Math.max(0, consistency)), // Clamp to 0-100
    values: values.map(v => Math.round(v)),
    label
  };
}

/**
 * Main analysis function - detects patterns in manual positions.
 * 
 * @param {Array} people - Array of person objects
 * @param {Object} positions - { personId: { x, y } }
 * @param {Array} relationships - Array of relationship objects
 * @returns {Object} Analysis results with statistics for each pattern type
 */
export function analyseLayoutPatterns(people, positions, relationships) {
  const { parentToChildren, childToParents, spouses } = buildRelationshipMaps(relationships);
  
  // Create a map of person data for quick lookup
  const personMap = new Map(people.map(p => [p.id, p]));
  
  // Collection arrays for measurements
  const analysis = {
    generationHeights: [],
    siblingSpacings: [],
    spouseSpacings: [],
    bastardOffsets: { horizontal: [], vertical: [] },
    adoptedOffsets: { horizontal: [], vertical: [] },
    raw: {
      parentChildPairs: [],
      siblingPairs: [],
      spousePairs: []
    }
  };

  // --------------------
  // Analyse parent-child (generation height)
  // --------------------
  
  childToParents.forEach((parentIds, childId) => {
    const childPos = positions[childId];
    if (!childPos) return;
    
    parentIds.forEach(parentId => {
      const parentPos = positions[parentId];
      if (!parentPos) return;
      
      // Generation height is the vertical distance (Y axis)
      const verticalDistance = Math.abs(childPos.y - parentPos.y);
      analysis.generationHeights.push(verticalDistance);
      
      analysis.raw.parentChildPairs.push({
        parentId,
        childId,
        parentPos: { ...parentPos },
        childPos: { ...childPos },
        verticalDistance,
        horizontalDistance: Math.abs(childPos.x - parentPos.x)
      });
    });
  });

  // --------------------
  // Analyse spouse spacing
  // --------------------
  
  const processedSpousePairs = new Set();
  
  spouses.forEach((spouseIds, personId) => {
    const personPos = positions[personId];
    if (!personPos) return;
    
    spouseIds.forEach(spouseId => {
      // Avoid processing same pair twice (A-B and B-A)
      const pairKey = [personId, spouseId].sort((a, b) => a - b).join('-');
      if (processedSpousePairs.has(pairKey)) return;
      processedSpousePairs.add(pairKey);
      
      const spousePos = positions[spouseId];
      if (!spousePos) return;
      
      // Spouse spacing is the horizontal distance (X axis)
      const horizontalDistance = Math.abs(personPos.x - spousePos.x);
      analysis.spouseSpacings.push(horizontalDistance);
      
      analysis.raw.spousePairs.push({
        person1Id: personId,
        person2Id: spouseId,
        person1Pos: { ...personPos },
        person2Pos: { ...spousePos },
        horizontalDistance,
        verticalDistance: Math.abs(personPos.y - spousePos.y)
      });
    });
  });

  // --------------------
  // Analyse sibling spacing (and bastard/adopted offsets)
  // --------------------
  
  const processedSiblingPairs = new Set();
  
  people.forEach(person => {
    const personPos = positions[person.id];
    if (!personPos) return;
    
    const siblingIds = getSiblings(person.id, childToParents, parentToChildren);
    
    siblingIds.forEach(siblingId => {
      // Avoid processing same pair twice
      const pairKey = [person.id, siblingId].sort((a, b) => a - b).join('-');
      if (processedSiblingPairs.has(pairKey)) return;
      processedSiblingPairs.add(pairKey);
      
      const siblingPos = positions[siblingId];
      const sibling = personMap.get(siblingId);
      if (!siblingPos || !sibling) return;
      
      // Sibling spacing is the horizontal distance (X axis)
      const horizontalDistance = Math.abs(personPos.x - siblingPos.x);
      analysis.siblingSpacings.push(horizontalDistance);
      
      // Determine legitimacy status
      const person1Status = person.legitimacyStatus || person.bastardStatus || 'legitimate';
      const person2Status = sibling.legitimacyStatus || sibling.bastardStatus || 'legitimate';
      
      analysis.raw.siblingPairs.push({
        person1Id: person.id,
        person2Id: siblingId,
        person1Pos: { ...personPos },
        person2Pos: { ...siblingPos },
        person1Status,
        person2Status,
        horizontalDistance,
        verticalDistance: Math.abs(personPos.y - siblingPos.y)
      });
      
      // Check for bastard offsets (one bastard, one legitimate)
      const person1IsBastard = person1Status === 'bastard';
      const person2IsBastard = person2Status === 'bastard';
      
      if (person1IsBastard !== person2IsBastard) {
        // One is bastard, one is legitimate - calculate offset
        const bastardPos = person1IsBastard ? personPos : siblingPos;
        const legitPos = person1IsBastard ? siblingPos : personPos;
        
        // Offset is bastard position minus legitimate position
        // Positive = bastard is to the right/below
        analysis.bastardOffsets.horizontal.push(bastardPos.x - legitPos.x);
        analysis.bastardOffsets.vertical.push(bastardPos.y - legitPos.y);
      }
      
      // Check for adopted offsets
      const person1IsAdopted = person1Status === 'adopted';
      const person2IsAdopted = person2Status === 'adopted';
      
      if (person1IsAdopted !== person2IsAdopted) {
        const adoptedPos = person1IsAdopted ? personPos : siblingPos;
        const legitPos = person1IsAdopted ? siblingPos : personPos;
        
        analysis.adoptedOffsets.horizontal.push(adoptedPos.x - legitPos.x);
        analysis.adoptedOffsets.vertical.push(adoptedPos.y - legitPos.y);
      }
    });
  });

  // --------------------
  // Calculate statistics
  // --------------------
  
  return {
    generationHeight: calculateStats(analysis.generationHeights, 'Generation Height'),
    siblingSpacing: calculateStats(analysis.siblingSpacings, 'Sibling Spacing'),
    spouseSpacing: calculateStats(analysis.spouseSpacings, 'Spouse Spacing'),
    bastardOffset: {
      horizontal: calculateStats(analysis.bastardOffsets.horizontal, 'Bastard Horizontal Offset'),
      vertical: calculateStats(analysis.bastardOffsets.vertical, 'Bastard Vertical Offset')
    },
    adoptedOffset: {
      horizontal: calculateStats(analysis.adoptedOffsets.horizontal, 'Adopted Horizontal Offset'),
      vertical: calculateStats(analysis.adoptedOffsets.vertical, 'Adopted Vertical Offset')
    },
    raw: analysis.raw,
    summary: {
      totalPeoplePositioned: Object.keys(positions).length,
      parentChildPairs: analysis.raw.parentChildPairs.length,
      siblingPairs: analysis.raw.siblingPairs.length,
      spousePairs: analysis.raw.spousePairs.length
    }
  };
}

/**
 * Get immediate family for "aura" display.
 * The "aura" concept: only show measurements to people directly connected
 * to the selected person - parents, children, spouse, siblings.
 * 
 * @param {number} personId - Person to get family for
 * @param {Array} relationships - Array of relationship objects
 * @returns {Object} { parents: [], children: [], spouses: [], siblings: [] }
 */
export function getImmediateFamily(personId, relationships) {
  const { parentToChildren, childToParents, spouses } = buildRelationshipMaps(relationships);
  
  return {
    parents: childToParents.get(personId) || [],
    children: parentToChildren.get(personId) || [],
    spouses: spouses.get(personId) || [],
    siblings: getSiblings(personId, childToParents, parentToChildren)
  };
}

/**
 * Calculate where rules would position each person.
 * Used for the ghost preview overlay to compare rules vs manual layout.
 * 
 * NOTE: This is a simplified version for preview purposes. The actual
 * layout algorithm in FamilyTree.jsx is more sophisticated.
 * 
 * @param {Array} people - Array of person objects
 * @param {Array} relationships - Array of relationship objects
 * @param {Object} rules - Draft rules { generationHeight, siblingSpacing, etc. }
 * @param {Object} rootPosition - Starting position { x, y }
 * @returns {Object} { personId: { x, y }, ... }
 */
export function calculateRuleBasedPositions(people, relationships, rules, rootPosition = { x: 0, y: 0 }) {
  const positions = {};
  const { parentToChildren, childToParents, spouses } = buildRelationshipMaps(relationships);
  const personMap = new Map(people.map(p => [p.id, p]));
  
  // Find root nodes (people with no parents)
  const rootIds = people
    .filter(p => !childToParents.has(p.id) || childToParents.get(p.id).length === 0)
    .map(p => p.id);
  
  if (rootIds.length === 0) return positions;
  
  // Default rule values
  const genHeight = rules.generationHeight || 180;
  const sibSpacing = rules.siblingSpacing || 120;
  const spouseSpace = rules.spouseSpacing || 100;
  const familyUnitGap = rules.familyUnitGap || 50;
  const bastardH = rules.bastardOffset?.horizontal || 0;
  const adoptedH = rules.adoptedOffset?.horizontal || 0;
  
  /**
   * Recursively position a person and their descendants.
   */
  function positionPerson(personId, x, y, generation) {
    if (positions[personId]) return; // Already positioned
    
    const person = personMap.get(personId);
    if (!person) return;
    
    positions[personId] = { x, y };
    
    // Position spouse to the right
    const spouseIds = spouses.get(personId) || [];
    spouseIds.forEach((spouseId, idx) => {
      if (!positions[spouseId]) {
        const spouseX = x + spouseSpace * (idx + 1);
        positions[spouseId] = { x: spouseX, y };
      }
    });
    
    // Position children below
    const childIds = parentToChildren.get(personId) || [];
    if (childIds.length === 0) return;
    
    const childY = y + genHeight;
    
    // Sort children: legitimate first, then bastards, then adopted
    const sortedChildren = [...childIds].sort((a, b) => {
      const personA = personMap.get(a);
      const personB = personMap.get(b);
      const statusOrder = { legitimate: 0, unknown: 1, bastard: 2, adopted: 3 };
      const statusA = statusOrder[personA?.legitimacyStatus || personA?.bastardStatus || 'unknown'] || 1;
      const statusB = statusOrder[personB?.legitimacyStatus || personB?.bastardStatus || 'unknown'] || 1;
      return statusA - statusB;
    });
    
    // Calculate starting X to center children under parent
    const totalWidth = (sortedChildren.length - 1) * sibSpacing;
    let childX = x - totalWidth / 2;
    
    sortedChildren.forEach(childId => {
      if (positions[childId]) {
        childX += sibSpacing;
        return;
      }
      
      const child = personMap.get(childId);
      let finalX = childX;
      
      // Apply bastard offset
      if (child?.legitimacyStatus === 'bastard' || child?.bastardStatus === 'bastard') {
        finalX += bastardH;
      }
      
      // Apply adopted offset
      if (child?.legitimacyStatus === 'adopted' || child?.bastardStatus === 'adopted') {
        finalX += adoptedH;
      }
      
      positionPerson(childId, finalX, childY, generation + 1);
      childX += sibSpacing;
    });
  }
  
  // Position from first root
  positionPerson(rootIds[0], rootPosition.x, rootPosition.y, 0);
  
  // Position other roots offset to the side
  let rootX = rootPosition.x + 400;
  for (let i = 1; i < rootIds.length; i++) {
    if (!positions[rootIds[i]]) {
      positionPerson(rootIds[i], rootX, rootPosition.y, 0);
      rootX += 400;
    }
  }
  
  return positions;
}

/**
 * Detect family units and measure spacing between them.
 * 
 * A "family unit" is a person + their spouse (if any) + all their descendants.
 * This analyses the horizontal gaps between sibling family units -
 * i.e., the space between one sibling's entire descendant tree and the next.
 * 
 * This is the key metric for preventing overlap: if you want Lochlann's family
 * to not overlap with Steffan II's family, you need a consistent family unit gap.
 * 
 * @param {Array} people - Array of person objects
 * @param {Object} positions - { personId: { x, y } }
 * @param {Array} relationships - Array of relationship objects
 * @returns {Object} Family unit analysis with bounding boxes and gaps
 */
export function analyseFamilyUnitSpacing(people, positions, relationships) {
  const { parentToChildren, childToParents, spouses } = buildRelationshipMaps(relationships);
  const personMap = new Map(people.map(p => [p.id, p]));
  
  const CARD_WIDTH = 150;
  const CARD_HEIGHT = 70;
  
  /**
   * Calculate bounding box for a person and all their descendants.
   * Returns { minX, maxX, minY, maxY, personIds }
   */
  function getDescendantBounds(personId, visited = new Set()) {
    if (visited.has(personId)) return null;
    visited.add(personId);
    
    const pos = positions[personId];
    if (!pos) return null;
    
    // Start with this person's position
    let minX = pos.x;
    let maxX = pos.x + CARD_WIDTH;
    let minY = pos.y;
    let maxY = pos.y + CARD_HEIGHT;
    const personIds = new Set([personId]);
    
    // Include spouse
    const spouseList = spouses.get(personId) || [];
    const spouseId = spouseList[0]; // Primary spouse
    if (spouseId && positions[spouseId] && !visited.has(spouseId)) {
      visited.add(spouseId);
      const spousePos = positions[spouseId];
      minX = Math.min(minX, spousePos.x);
      maxX = Math.max(maxX, spousePos.x + CARD_WIDTH);
      minY = Math.min(minY, spousePos.y);
      maxY = Math.max(maxY, spousePos.y + CARD_HEIGHT);
      personIds.add(spouseId);
    }
    
    // Include all descendants recursively
    const children = parentToChildren.get(personId) || [];
    for (const childId of children) {
      const childBounds = getDescendantBounds(childId, visited);
      if (childBounds) {
        minX = Math.min(minX, childBounds.minX);
        maxX = Math.max(maxX, childBounds.maxX);
        minY = Math.min(minY, childBounds.minY);
        maxY = Math.max(maxY, childBounds.maxY);
        childBounds.personIds.forEach(id => personIds.add(id));
      }
    }
    
    // Also get descendants through spouse
    if (spouseId) {
      const spouseChildren = parentToChildren.get(spouseId) || [];
      for (const childId of spouseChildren) {
        if (!visited.has(childId)) {
          const childBounds = getDescendantBounds(childId, visited);
          if (childBounds) {
            minX = Math.min(minX, childBounds.minX);
            maxX = Math.max(maxX, childBounds.maxX);
            minY = Math.min(minY, childBounds.minY);
            maxY = Math.max(maxY, childBounds.maxY);
            childBounds.personIds.forEach(id => personIds.add(id));
          }
        }
      }
    }
    
    return { minX, maxX, minY, maxY, personIds, width: maxX - minX, height: maxY - minY };
  }
  
  /**
   * For each person with multiple children, analyse the gaps between
   * each child's family unit bounding boxes.
   */
  const familyUnitGaps = [];
  const analysedParents = new Set();
  
  // Find all people who have children
  parentToChildren.forEach((childIds, parentId) => {
    if (analysedParents.has(parentId)) return;
    
    // Also mark spouse as analysed to avoid duplicate analysis
    const spouseList = spouses.get(parentId) || [];
    const spouseId = spouseList[0];
    if (spouseId) analysedParents.add(spouseId);
    analysedParents.add(parentId);
    
    // Get all children (combine with spouse's children)
    const allChildIds = new Set(childIds);
    if (spouseId) {
      const spouseChildren = parentToChildren.get(spouseId) || [];
      spouseChildren.forEach(id => allChildIds.add(id));
    }
    
    if (allChildIds.size < 2) return; // Need at least 2 children to measure gaps
    
    // Calculate bounding box for each child's family unit
    const childUnits = [];
    for (const childId of allChildIds) {
      // Create a fresh visited set for each child, but exclude the parents
      const excludeSet = new Set([parentId]);
      if (spouseId) excludeSet.add(spouseId);
      
      const bounds = getDescendantBounds(childId, new Set(excludeSet));
      if (bounds) {
        const child = personMap.get(childId);
        const childSpouseList = spouses.get(childId) || [];
        childUnits.push({
          personId: childId,
          person: child,
          bounds,
          hasDescendants: bounds.personIds.size > (childSpouseList.length > 0 ? 2 : 1)
        });
      }
    }
    
    // Sort by X position (left to right)
    childUnits.sort((a, b) => a.bounds.minX - b.bounds.minX);
    
    // Measure gaps between adjacent family units
    for (let i = 0; i < childUnits.length - 1; i++) {
      const leftUnit = childUnits[i];
      const rightUnit = childUnits[i + 1];
      
      // Gap is from right edge of left unit to left edge of right unit
      const gap = rightUnit.bounds.minX - leftUnit.bounds.maxX;
      
      const parent = personMap.get(parentId);
      
      familyUnitGaps.push({
        leftPerson: leftUnit.person,
        rightPerson: rightUnit.person,
        leftPersonName: `${leftUnit.person?.firstName} ${leftUnit.person?.lastName}`,
        rightPersonName: `${rightUnit.person?.firstName} ${rightUnit.person?.lastName}`,
        leftBounds: leftUnit.bounds,
        rightBounds: rightUnit.bounds,
        gap,
        parentId,
        parentName: `${parent?.firstName} ${parent?.lastName}`,
        // Categorize: both have descendants, one has, or neither
        category: leftUnit.hasDescendants && rightUnit.hasDescendants ? 'both-have-families'
                : leftUnit.hasDescendants || rightUnit.hasDescendants ? 'one-has-family'
                : 'neither-has-family'
      });
    }
  });
  
  // Calculate statistics for each category
  const byCategory = {
    'both-have-families': familyUnitGaps.filter(g => g.category === 'both-have-families'),
    'one-has-family': familyUnitGaps.filter(g => g.category === 'one-has-family'),
    'neither-has-family': familyUnitGaps.filter(g => g.category === 'neither-has-family')
  };
  
  const categoryStats = {};
  for (const [category, gaps] of Object.entries(byCategory)) {
    if (gaps.length > 0) {
      const values = gaps.map(g => g.gap);
      categoryStats[category] = calculateStats(values, category);
    }
  }
  
  // Overall family unit gap stats
  const allGapValues = familyUnitGaps.map(g => g.gap);
  const overallStats = allGapValues.length > 0 ? calculateStats(allGapValues, 'Family Unit Gap') : null;
  
  return {
    familyUnitGaps,
    byCategory: categoryStats,
    overall: overallStats,
    summary: {
      totalGaps: familyUnitGaps.length,
      parentsAnalysed: analysedParents.size / 2, // Rough estimate
      gapsByCategory: {
        bothHaveFamilies: byCategory['both-have-families'].length,
        oneHasFamily: byCategory['one-has-family'].length,
        neitherHasFamily: byCategory['neither-has-family'].length
      }
    }
  };
}

export default {
  analyseLayoutPatterns,
  analyseFamilyUnitSpacing,
  getImmediateFamily,
  calculateRuleBasedPositions
};
