import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

/**
 * FamilyTreeVisualization Component
 * 
 * SIMPLIFIED VERSION - Clean, basic positioning that works reliably
 * 
 * Core Algorithm:
 * 1. Calculate generations (oldest = 1, youngest = max)
 * 2. Position youngest generation first with 35px spacing
 * 3. Parents center above their children
 * 4. Spouses sit next to their partners (35px apart)
 * 
 * Features Preserved:
 * - Color coding (legitimacy status)
 * - Click to select
 * - Zoom and pan
 * - All relationship types
 */
function FamilyTreeVisualization({ people, houses, relationships, onPersonClick, centerAligned }) {
  const svgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    if (!people || people.length === 0) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    // Setup SVG with zoom
    const svg = d3.select(svgRef.current)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);

    const g = svg.append('g');

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Initial zoom to fit
    svg.call(zoom.transform, d3.zoomIdentity.translate(50, 50).scale(1));

    // STEP 1: Calculate generations
    const positionedPeople = calculateSimplePositions(people, relationships);

    // STEP 2: Draw relationship lines FIRST (so they appear behind cards)
    drawRelationshipLines(g, positionedPeople, relationships);

    // STEP 3: Draw person cards
    drawPersonCards(g, positionedPeople, houses, onPersonClick);

  }, [people, houses, relationships, onPersonClick, dimensions, centerAligned]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <svg ref={svgRef} className="border border-gray-200 rounded"></svg>
    </div>
  );
}

/**
 * SIMPLIFIED POSITIONING ALGORITHM
 * 
 * This is a clean, bottom-up approach:
 * 1. Find all generations (based on parent relationships)
 * 2. Position youngest generation first (left to right, 35px spacing)
 * 3. Position older generations by centering parents above children
 * 4. Place spouses next to their partners
 */
function calculateSimplePositions(people, relationships) {
  const CARD_WIDTH = 200;
  const CARD_HEIGHT = 100;
  const HORIZONTAL_SPACING = 35;
  const VERTICAL_SPACING = 150;

  // Create lookup maps
  const peopleMap = new Map(people.map(p => [p.id, { ...p }]));
  
  // Build parent-child relationships
  const childrenMap = new Map(); // parentId -> [childIds]
  const parentsMap = new Map();  // childId -> [parentIds]
  
  relationships.forEach(rel => {
    if (rel.relationshipType === 'parent' || 
        rel.relationshipType === 'adopted-parent' || 
        rel.relationshipType === 'foster-parent') {
      const parentId = rel.person1Id;
      const childId = rel.person2Id;
      
      if (!childrenMap.has(parentId)) childrenMap.set(parentId, []);
      childrenMap.get(parentId).push(childId);
      
      if (!parentsMap.has(childId)) parentsMap.set(childId, []);
      parentsMap.get(childId).push(parentId);
    }
  });

  // STEP 1: Assign generation numbers (1 = oldest, higher = younger)
  const generations = new Map();
  
  // Find root generation (people with no parents)
  const roots = people.filter(p => !parentsMap.has(p.id));
  
  function assignGeneration(personId, gen) {
    if (!generations.has(personId)) {
      generations.set(personId, gen);
    } else {
      // If already assigned, take the maximum (further from root)
      // This ensures children are always below parents
      generations.set(personId, Math.max(generations.get(personId), gen));
    }
    
    // Assign next generation to children
    const children = childrenMap.get(personId) || [];
    children.forEach(childId => assignGeneration(childId, gen + 1));
  }
  
  // Start from roots
  roots.forEach(root => assignGeneration(root.id, 1));
  
  // Assign generation to anyone not yet assigned (orphans)
  people.forEach(p => {
    if (!generations.has(p.id)) {
      generations.set(p.id, 1);
    }
  });

  // CRITICAL: Adjust spouse generations to match their partners
  // Spouses who married into the family should be on same generation as their partner
  const spouseRels = relationships.filter(r => r.relationshipType === 'spouse');
  
  spouseRels.forEach(rel => {
    const person1Gen = generations.get(rel.person1Id);
    const person2Gen = generations.get(rel.person2Id);
    
    if (person1Gen && person2Gen) {
      // Both have generations assigned
      const person1HasChildren = childrenMap.has(rel.person1Id);
      const person2HasChildren = childrenMap.has(rel.person2Id);
      
      // Determine who is the "blood" member (has parents in tree) vs married-in
      const person1HasParents = parentsMap.has(rel.person1Id);
      const person2HasParents = parentsMap.has(rel.person2Id);
      
      // Priority 1: If one has children and one doesn't, use the one with children
      if (person1HasChildren && !person2HasChildren) {
        generations.set(rel.person2Id, person1Gen);
      } else if (person2HasChildren && !person1HasChildren) {
        generations.set(rel.person1Id, person2Gen);
      }
      // Priority 2: If one has parents in tree and one doesn't, use the one with parents
      else if (person1HasParents && !person2HasParents) {
        generations.set(rel.person2Id, person1Gen);
      } else if (person2HasParents && !person1HasParents) {
        generations.set(rel.person1Id, person2Gen);
      }
      // Priority 3: If generations differ, use the deeper one (higher number)
      else if (person1Gen !== person2Gen) {
        const targetGen = Math.max(person1Gen, person2Gen);
        generations.set(rel.person1Id, targetGen);
        generations.set(rel.person2Id, targetGen);
      }
    }
  });

  // STEP 2: Group people by generation
  const genGroups = new Map();
  people.forEach(person => {
    const gen = generations.get(person.id);
    if (!genGroups.has(gen)) genGroups.set(gen, []);
    genGroups.get(gen).push(person);
  });

  // STEP 3: Organize each generation into family groups based on PRIMARY parent
  // Family groups will be positioned under their parent, keeping siblings together
  genGroups.forEach((group, gen) => {
    // Build spouse set - people who are spouses (will be positioned next to partners)
    const spouseSet = new Set();
    spouseRels.forEach(rel => {
      // Only track spouses in this generation
      if (generations.get(rel.person1Id) === gen) spouseSet.add(rel.person1Id);
      if (generations.get(rel.person2Id) === gen) spouseSet.add(rel.person2Id);
    });
    
    // Build family groups based on first parent (primary lineage)
    const familyGroups = new Map(); // parentId -> [children]
    const noParents = []; // People with no parents in tree (but NOT married-in spouses)
    
    group.forEach(person => {
      const parents = parentsMap.get(person.id) || [];
      
      if (parents.length === 0) {
        // Has no parents - but check if they're a married-in spouse
        const hasChildren = childrenMap.has(person.id);
        
        // Only add to noParents if they have children OR are not a spouse
        // This excludes married-in spouses with no children (they'll be positioned next to partner)
        if (hasChildren || !spouseSet.has(person.id)) {
          noParents.push(person);
        }
      } else {
        // Use FIRST parent as the primary lineage
        // This keeps all children of a person together, even from different marriages
        const primaryParent = parents[0];
        
        if (!familyGroups.has(primaryParent)) {
          familyGroups.set(primaryParent, []);
        }
        familyGroups.get(primaryParent).push(person);
      }
    });
    
    // Sort children within each family by birth date
    familyGroups.forEach(family => {
      family.sort((a, b) => {
        if (!a.dateOfBirth) return 1;
        if (!b.dateOfBirth) return -1;
        return a.dateOfBirth.localeCompare(b.dateOfBirth);
      });
    });
    
    // Sort no-parents group by birth date
    noParents.sort((a, b) => {
      if (!a.dateOfBirth) return 1;
      if (!b.dateOfBirth) return -1;
      return a.dateOfBirth.localeCompare(b.dateOfBirth);
    });
    
    // Store family groups for use in positioning
    // We'll use this in Step 4 to position children under their parent
    genGroups.set(gen, { familyGroups, noParents });
  });

  // STEP 4: SIMPLE POSITIONING - Build from top down
  // Gen 0 at top, position their children below in birth order, recurse down
  const positions = new Map();
  const maxGen = Math.max(...genGroups.keys());
  
  // Build spouse pair map (both directions)
  const spousePairs = new Map();
  spouseRels.forEach(rel => {
    spousePairs.set(rel.person1Id, rel.person2Id);
    spousePairs.set(rel.person2Id, rel.person1Id);
  });
  
  // Start with generation 1 (roots) and work down
  let currentX = 0;
  
  for (let gen = 1; gen <= maxGen; gen++) {
    const genData = genGroups.get(gen);
    if (!genData) continue;
    
    const { familyGroups, noParents } = genData;
    
    if (gen === 1) {
      // Generation 1: Position roots left to right by birth date
      noParents.forEach(person => {
        const spouseId = spousePairs.get(person.id);
        const spouse = spouseId ? peopleMap.get(spouseId) : null;
        const spouseInSameGen = spouse && generations.get(spouse.id) === gen;
        
        // Position this person
        positions.set(person.id, {
          x: currentX,
          y: gen * VERTICAL_SPACING,
          generation: gen
        });
        currentX += CARD_WIDTH + HORIZONTAL_SPACING;
        
        // Position spouse immediately next to them
        if (spouseInSameGen) {
          positions.set(spouse.id, {
            x: currentX,
            y: gen * VERTICAL_SPACING,
            generation: gen
          });
          currentX += CARD_WIDTH + HORIZONTAL_SPACING;
        }
      });
    } else {
      // Generations 2+: Position children under their parents
      // Get all parents from previous generation, in left-to-right order
      const parentsInPrevGen = people
        .filter(p => generations.get(p.id) === gen - 1)
        .filter(p => positions.has(p.id)) // Only positioned parents
        .sort((a, b) => positions.get(a.id).x - positions.get(b.id).x);
      
      currentX = 0; // Reset for this generation
      
      parentsInPrevGen.forEach(parent => {
        const children = familyGroups.get(parent.id);
        if (!children || children.length === 0) return;
        
        const parentPos = positions.get(parent.id);
        const spouseId = spousePairs.get(parent.id);
        const spousePos = spouseId ? positions.get(spouseId) : null;
        
        // Calculate family center (under parent or parent+spouse)
        let familyCenterX;
        if (spousePos && spousePos.generation === gen - 1) {
          familyCenterX = (parentPos.x + spousePos.x + CARD_WIDTH) / 2;
        } else {
          familyCenterX = parentPos.x + CARD_WIDTH / 2;
        }
        
        // Calculate how wide this family group will be
        let familyWidth = 0;
        children.forEach(child => {
          familyWidth += CARD_WIDTH;
          const childSpouseId = spousePairs.get(child.id);
          const childSpouse = childSpouseId ? peopleMap.get(childSpouseId) : null;
          if (childSpouse && generations.get(childSpouse.id) === gen) {
            familyWidth += CARD_WIDTH + HORIZONTAL_SPACING;
          }
          familyWidth += HORIZONTAL_SPACING; // Space before next child
        });
        familyWidth -= HORIZONTAL_SPACING; // Remove last spacing
        
        // Start position for first child (try to center under parents)
        let childX = familyCenterX - (familyWidth / 2);
        
        // Don't overlap previous families
        if (childX < currentX) {
          childX = currentX;
        }
        
        // Position each child (already sorted by DOB in Step 3)
        children.forEach(child => {
          // Position child
          positions.set(child.id, {
            x: childX,
            y: gen * VERTICAL_SPACING,
            generation: gen
          });
          childX += CARD_WIDTH + HORIZONTAL_SPACING;
          
          // Position child's spouse immediately next to them
          const childSpouseId = spousePairs.get(child.id);
          const childSpouse = childSpouseId ? peopleMap.get(childSpouseId) : null;
          if (childSpouse && generations.get(childSpouse.id) === gen) {
            positions.set(childSpouse.id, {
              x: childX,
              y: gen * VERTICAL_SPACING,
              generation: gen
            });
            childX += CARD_WIDTH + HORIZONTAL_SPACING;
          }
        });
        
        // Update currentX to end of this family
        currentX = childX;
      });
    }
  }

  // STEP 5: Enforce 35px minimum spacing - scan for overlaps and fix
  for (let gen = maxGen; gen >= 1; gen--) {
    const peopleInGen = people
      .filter(p => generations.get(p.id) === gen)
      .map(p => ({ id: p.id, pos: positions.get(p.id) }))
      .filter(p => p.pos) // Filter out undefined positions
      .sort((a, b) => a.pos.x - b.pos.x);
    
    for (let i = 1; i < peopleInGen.length; i++) {
      const prev = peopleInGen[i - 1];
      const curr = peopleInGen[i];
      const minX = prev.pos.x + CARD_WIDTH + HORIZONTAL_SPACING;
      
      if (curr.pos.x < minX) {
        // Overlap detected - shift current person and everyone after them
        const shift = minX - curr.pos.x;
        for (let j = i; j < peopleInGen.length; j++) {
          peopleInGen[j].pos.x += shift;
        }
      }
    }
  }

  // STEP 6: Convert to array with person data
  const result = people.map(person => ({
    ...person,
    x: positions.get(person.id)?.x || 0,
    y: positions.get(person.id)?.y || 0,
    generation: positions.get(person.id)?.generation || 1
  }));

  return result;
}

/**
 * Draw relationship lines
 * 
 * Lines are drawn HORIZONTALLY between generations:
 * - Green (legitimate) centered between parent and child generations
 * - Blue (adopted) 5px above green
 * - Orange (bastard) 5px below green
 */
function drawRelationshipLines(g, people, relationships) {
  const peopleMap = new Map(people.map(p => [p.id, p]));
  const CARD_WIDTH = 200;
  const CARD_HEIGHT = 100;
  const VERTICAL_SPACING = 150;

  // Draw parent-child lines
  relationships
    .filter(rel => 
      rel.relationshipType === 'parent' || 
      rel.relationshipType === 'adopted-parent' || 
      rel.relationshipType === 'foster-parent'
    )
    .forEach(rel => {
      const parent = peopleMap.get(rel.person1Id);
      const child = peopleMap.get(rel.person2Id);
      
      if (!parent || !child) return;

      // Determine line color and offset based on child's legitimacy
      let color = '#16a34a'; // Green for legitimate
      let yOffset = 0; // Centered
      
      if (child.legitimacyStatus === 'bastard') {
        color = '#f59e0b'; // Orange
        yOffset = 5; // 5px below center
      }
      if (child.legitimacyStatus === 'adopted') {
        color = '#3b82f6'; // Blue
        yOffset = -5; // 5px above center
      }

      // Calculate the Y position between generations
      const parentBottomY = parent.y + CARD_HEIGHT;
      const childTopY = child.y;
      const centerY = (parentBottomY + childTopY) / 2 + yOffset;

      // Parent card center X
      const parentX = parent.x + CARD_WIDTH / 2;
      // Child card center X
      const childX = child.x + CARD_WIDTH / 2;

      // Draw the line in 3 segments:
      // 1. Vertical from parent bottom to horizontal line
      // 2. Horizontal line between parent and child X positions
      // 3. Vertical from horizontal line to child top

      const path = `
        M ${parentX} ${parentBottomY}
        L ${parentX} ${centerY}
        L ${childX} ${centerY}
        L ${childX} ${childTopY}
      `;

      g.append('path')
        .attr('d', path)
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr('opacity', 0.7);
    });

  // Draw marriage lines (simple horizontal line between spouses)
  relationships
    .filter(rel => rel.relationshipType === 'spouse')
    .forEach(rel => {
      const person1 = peopleMap.get(rel.person1Id);
      const person2 = peopleMap.get(rel.person2Id);
      
      if (!person1 || !person2) return;

      // Only draw if on same generation
      if (person1.generation === person2.generation) {
        const x1 = person1.x + CARD_WIDTH;
        const y1 = person1.y + CARD_HEIGHT / 2;
        const x2 = person2.x;
        const y2 = person2.y + CARD_HEIGHT / 2;

        g.append('line')
          .attr('x1', x1)
          .attr('y1', y1)
          .attr('x2', x2)
          .attr('y2', y2)
          .attr('stroke', '#ec4899') // Pink for marriage
          .attr('stroke-width', 3)
          .attr('opacity', 0.8);
      }
    });
}

/**
 * Draw person cards
 */
function drawPersonCards(g, people, houses, onPersonClick) {
  const CARD_WIDTH = 200;
  const CARD_HEIGHT = 100;

  const housesMap = new Map(houses.map(h => [h.id, h]));

  people.forEach(person => {
    const house = housesMap.get(person.houseId);

    // Determine border color based on legitimacy
    let borderColor = '#16a34a'; // Green for legitimate
    if (person.legitimacyStatus === 'bastard') borderColor = '#f59e0b'; // Orange
    if (person.legitimacyStatus === 'adopted') borderColor = '#3b82f6'; // Blue

    // Check if cadet house (has parentHouseId)
    const isCadetHouse = house && house.parentHouseId;
    const borderStyle = isCadetHouse ? '4,4' : 'none'; // Dashed if cadet

    // Card group
    const cardGroup = g.append('g')
      .attr('transform', `translate(${person.x}, ${person.y})`)
      .style('cursor', 'pointer')
      .on('click', () => onPersonClick(person));

    // Card background
    cardGroup.append('rect')
      .attr('width', CARD_WIDTH)
      .attr('height', CARD_HEIGHT)
      .attr('fill', 'white')
      .attr('stroke', borderColor)
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', borderStyle)
      .attr('rx', 8);

    // House color bar at top
    if (house) {
      cardGroup.append('rect')
        .attr('width', CARD_WIDTH)
        .attr('height', 8)
        .attr('fill', house.colorCode || '#6b7280')
        .attr('rx', 8);
    }

    // Name
    const fullName = `${person.firstName} ${person.lastName}`;
    cardGroup.append('text')
      .attr('x', CARD_WIDTH / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('fill', '#1f2937')
      .text(fullName);

    // Maiden name if applicable
    if (person.maidenName) {
      cardGroup.append('text')
        .attr('x', CARD_WIDTH / 2)
        .attr('y', 45)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .attr('font-style', 'italic')
        .attr('fill', '#6b7280')
        .text(`(née ${person.maidenName})`);
    }

    // Dates
    let dateText = '';
    if (person.dateOfBirth) {
      const birthYear = person.dateOfBirth.split('-')[0];
      dateText = `b. ${birthYear}`;
    }
    if (person.dateOfDeath) {
      const deathYear = person.dateOfDeath.split('-')[0];
      dateText += ` - d. ${deathYear}`;
    }

    if (dateText) {
      cardGroup.append('text')
        .attr('x', CARD_WIDTH / 2)
        .attr('y', person.maidenName ? 62 : 55)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .attr('fill', '#6b7280')
        .text(dateText);
    }

    // Legitimacy badge
    if (person.legitimacyStatus !== 'legitimate') {
      const badgeText = person.legitimacyStatus.charAt(0).toUpperCase() + 
                       person.legitimacyStatus.slice(1);
      
      cardGroup.append('rect')
        .attr('x', 5)
        .attr('y', CARD_HEIGHT - 25)
        .attr('width', 65)
        .attr('height', 20)
        .attr('fill', borderColor)
        .attr('rx', 4);

      cardGroup.append('text')
        .attr('x', 37.5)
        .attr('y', CARD_HEIGHT - 11)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .attr('fill', 'white')
        .text(badgeText);
    }

    // Cadet house badge
    if (isCadetHouse) {
      cardGroup.append('rect')
        .attr('x', CARD_WIDTH - 70)
        .attr('y', CARD_HEIGHT - 25)
        .attr('width', 65)
        .attr('height', 20)
        .attr('fill', '#059669')
        .attr('rx', 4);

      cardGroup.append('text')
        .attr('x', CARD_WIDTH - 37.5)
        .attr('y', CARD_HEIGHT - 11)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .attr('fill', 'white')
        .text('Cadet');
    }
  });
}

export default FamilyTreeVisualization;
