import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useGenealogy } from '../contexts/GenealogyContext';
import Navigation from '../components/Navigation';
import TreeControls from '../components/TreeControls';
import QuickEditPanel from '../components/QuickEditPanel';
import { calculateAllRelationships } from '../utils/RelationshipCalculator';
import { useTheme } from '../components/ThemeContext';
import { getAllThemeColors, getHouseColor } from '../utils/themeColors';

function FamilyTree() {
  // Use the global theme system
  const { theme, isDarkTheme } = useTheme();
  
  // ==================== SHARED STATE FROM CONTEXT ====================
  // This is the key change: FamilyTree now shares data with ManageData!
  // Any changes in ManageData will automatically update the tree.
  const {
    people,
    houses,
    relationships,
    loading,
    dataVersion  // Used to detect when to redraw
  } = useGenealogy();

  // ==================== LOCAL UI STATE ====================
  const [selectedHouseId, setSelectedHouseId] = useState(null);
  const [showCadetHouses, setShowCadetHouses] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const svgRef = useRef(null);
  const zoomBehaviorRef = useRef(null);

  // BATCH 1: Search functionality
  const [searchResults, setSearchResults] = useState([]);
  
  // BATCH 1: Quick edit panel
  const [selectedPerson, setSelectedPerson] = useState(null);
  
  // BATCH 1: Relationship calculator
  const [showRelationships, setShowRelationships] = useState(false);
  const [referencePerson, setReferencePerson] = useState(null);
  const [relationshipMap, setRelationshipMap] = useState(new Map());
  const showRelationshipsRef = useRef(false);
  
  // Controls panel collapse state
  const [controlsPanelExpanded, setControlsPanelExpanded] = useState(false);
  
  // Vertical spacing control for testing
  const [verticalSpacing, setVerticalSpacing] = useState(100);

  // Layout mode: 'vertical' (top-to-bottom) or 'horizontal' (left-to-right)
  // Persisted in localStorage for user preference
  const [layoutMode, setLayoutMode] = useState(() => {
    const saved = localStorage.getItem('lineageweaver-layout-mode');
    return saved === 'horizontal' ? 'horizontal' : 'vertical';
  });



  // Handle layout change with persistence
  const handleLayoutChange = (newMode) => {
    setLayoutMode(newMode);
    localStorage.setItem('lineageweaver-layout-mode', newMode);
  };

  // Card dimensions - can swap in horizontal mode for better flow
  const CARD_WIDTH = 150;
  const CARD_HEIGHT = 70;
  const SPACING = 35;
  const GROUP_SPACING = 50;
  
  // Anchor and start positions - depend on layout mode
  // Vertical: anchor is X position (center column), start is Y position (top)
  // Horizontal: anchor is Y position (center row), start is X position (left)
  const ANCHOR_X = 1500;  // Used in vertical mode
  const ANCHOR_Y = 800;   // Used in horizontal mode
  const START_Y = 100;    // Used in vertical mode
  const START_X = 100;    // Used in horizontal mode
  
  // Generation spacing - controls distance between generations
  // In vertical mode: vertical distance
  // In horizontal mode: horizontal distance
  const GENERATION_SPACING = verticalSpacing + CARD_HEIGHT;

  // ═══════════════════════════════════════════════════════════════════════════
  // LAYOUT HELPERS
  // ═══════════════════════════════════════════════════════════════════════════
  // These functions abstract away the X/Y coordinate logic so we can switch
  // between vertical and horizontal layouts without duplicating drawing code.
  //
  // Conceptual axes:
  // - "Gen axis": The axis along which generations flow (down in vertical, right in horizontal)
  // - "Sib axis": The axis along which siblings spread (left-right in vertical, up-down in horizontal)
  // ═══════════════════════════════════════════════════════════════════════════
  
  const isHorizontal = layoutMode === 'horizontal';
  
  // Get the anchor position for centering content
  const getAnchor = () => isHorizontal ? ANCHOR_Y : ANCHOR_X;
  
  // Get the starting position for first generation
  const getStart = () => isHorizontal ? START_X : START_Y;
  
  // Convert logical (siblingPos, genPos) to actual (x, y) coordinates
  // In vertical: siblingPos = x, genPos = y
  // In horizontal: siblingPos = y, genPos = x
  const toCoords = (siblingPos, genPos) => {
    return isHorizontal 
      ? { x: genPos, y: siblingPos }
      : { x: siblingPos, y: genPos };
  };

  // Helper function to harmonize house colors with current theme
  const harmonizeColor = (hexColor) => {
    const hex = hexColor.replace('#', '');
    let r = parseInt(hex.substr(0, 2), 16);
    let g = parseInt(hex.substr(2, 2), 16);
    let b = parseInt(hex.substr(4, 2), 16);

    if (isDarkTheme()) {
      const warmBrown = { r: 120, g: 100, b: 80 };
      const desaturationAmount = 0.5;
      r = Math.round(r * (1 - desaturationAmount) + warmBrown.r * desaturationAmount);
      g = Math.round(g * (1 - desaturationAmount) + warmBrown.g * desaturationAmount);
      b = Math.round(b * (1 - desaturationAmount) + warmBrown.b * desaturationAmount);
      const darkenAmount = 0.7;
      r = Math.round(r * darkenAmount);
      g = Math.round(g * darkenAmount);
      b = Math.round(b * darkenAmount);
    } else {
      const warmCream = { r: 180, g: 160, b: 140 };
      const desaturationAmount = 0.4;
      r = Math.round(r * (1 - desaturationAmount) + warmCream.r * desaturationAmount);
      g = Math.round(g * (1 - desaturationAmount) + warmCream.g * desaturationAmount);
      b = Math.round(b * (1 - desaturationAmount) + warmCream.b * desaturationAmount);
      const adjustAmount = 0.8;
      r = Math.round(r * adjustAmount);
      g = Math.round(g * adjustAmount);
      b = Math.round(b * adjustAmount);
    }

    const toHex = (n) => {
      const hex = n.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // ==================== EFFECTS ====================
  
  // Select first house when houses become available
  useEffect(() => {
    if (houses.length > 0 && !selectedHouseId) {
      setSelectedHouseId(houses[0].id);
    }
  }, [houses, selectedHouseId]);

  // Redraw tree when data changes
  // Note: dataVersion increments whenever context data changes,
  // which triggers this effect and redraws the tree
  useEffect(() => {
    if (selectedHouseId && people.length > 0) drawTree();
  }, [selectedHouseId, people, houses, relationships, showCadetHouses, theme, searchResults, relationshipMap, verticalSpacing, layoutMode, dataVersion]);

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  const handlePersonClick = (person) => {
    setSelectedPerson(person);
    
    if (showRelationshipsRef.current) {
      setReferencePerson(person);
      const { parentMap, childrenMap, spouseMap } = buildRelationshipMaps();
      const relationships = calculateAllRelationships(person.id, people, parentMap, childrenMap, spouseMap);
      setRelationshipMap(relationships);
    }
  };

  const buildRelationshipMaps = () => {
    const peopleById = new Map(people.map(p => [p.id, p]));
    const housesById = new Map(houses.map(h => [h.id, h]));
    const parentMap = new Map();
    const childrenMap = new Map();
    const spouseMap = new Map();

    relationships.forEach(rel => {
      if (rel.relationshipType === 'spouse') {
        if (peopleById.has(rel.person1Id) && peopleById.has(rel.person2Id)) {
          spouseMap.set(rel.person1Id, rel.person2Id);
          spouseMap.set(rel.person2Id, rel.person1Id);
        }
      } else if (rel.relationshipType === 'parent' || rel.relationshipType === 'adopted-parent') {
        const parentId = rel.person1Id;
        const childId = rel.person2Id;
        if (!parentMap.has(childId)) parentMap.set(childId, []);
        parentMap.get(childId).push(parentId);
        if (!childrenMap.has(parentId)) childrenMap.set(parentId, []);
        childrenMap.get(parentId).push(childId);
      }
    });

    return { peopleById, housesById, parentMap, childrenMap, spouseMap };
  };

  /**
   * SIMPLIFIED: Detect generations
   * - Gen 0 = ALL people with no parents (sorted by birth date)
   * - Gen 1 = Their children
   * - Gen 2 = Their grandchildren
   * - etc.
   */
  const detectGenerations = (peopleById, parentMap, childrenMap, spouseMap) => {
    // Find ALL people with no parents - they are ALL Gen 0
    const gen0People = Array.from(peopleById.values())
      .filter(p => !parentMap.has(p.id))
      .sort((a, b) => parseInt(a.dateOfBirth) - parseInt(b.dateOfBirth));
    
    if (gen0People.length === 0) {
      console.warn('No root people found (everyone has parents)');
      return [];
    }
    
    console.log('Root candidates (no parents):', gen0People.map(p => `${p.firstName} ${p.lastName} (b.${p.dateOfBirth})`));
    
    // Use ONLY the oldest person as Gen 0
    const rootPerson = gen0People[0];
    console.log(`Root (Gen 0): ${rootPerson.firstName} ${rootPerson.lastName}`);
    
    const generations = [];
    const processedIds = new Set();
    
    // Gen 0: Just the oldest person (not all people with no parents)
    generations.push([rootPerson.id]);
    processedIds.add(rootPerson.id);
    
    // Mark spouse as processed (if they have one)
    const rootSpouseId = spouseMap.get(rootPerson.id);
    if (rootSpouseId) {
      processedIds.add(rootSpouseId);
    }
    
    // Build subsequent generations
    let currentGenIndex = 0;
    while (currentGenIndex < generations.length) {
      const currentGen = generations[currentGenIndex];
      const nextGenIds = new Set();
      
      // For each person in current gen, get their children
      currentGen.forEach(personId => {
        const children = childrenMap.get(personId) || [];
        children.forEach(childId => {
          if (!processedIds.has(childId)) {
            nextGenIds.add(childId);
            processedIds.add(childId);
          }
        });
        
        // Also check spouse's children
        const spouseId = spouseMap.get(personId);
        if (spouseId && peopleById.has(spouseId)) {
          const spouseChildren = childrenMap.get(spouseId) || [];
          spouseChildren.forEach(childId => {
            if (!processedIds.has(childId)) {
              nextGenIds.add(childId);
              processedIds.add(childId);
            }
          });
        }
      });
      
      if (nextGenIds.size > 0) {
        generations.push(Array.from(nextGenIds));
      }
      
      currentGenIndex++;
    }
    
    console.log('Generations detected:', generations.map((g, i) => `Gen ${i}: ${g.length} people`));
    return generations;
  };

  const drawPersonCard = (g, person, x, y, housesById, themeColors) => {
    const birthHouse = housesById.get(person.houseId);
    const originalColor = birthHouse ? birthHouse.colorCode : '#666666';
    const harmonizedBg = harmonizeColor(originalColor);
    
    let borderColor = themeColors.statusBorders.legitimate;
    if (person.legitimacyStatus === 'bastard') borderColor = themeColors.statusBorders.bastard;
    if (person.legitimacyStatus === 'adopted') borderColor = themeColors.statusBorders.adopted;

    const card = g.append('g')
      .attr('class', 'person-card')
      .attr('transform', `translate(${x}, ${y})`)
      .style('cursor', 'pointer')
      .on('click', () => handlePersonClick(person));
    
    card.append('rect')
      .attr('width', CARD_WIDTH)
      .attr('height', CARD_HEIGHT)
      .attr('fill', harmonizedBg)
      .attr('stroke', borderColor)
      .attr('stroke-width', 2.5)
      .attr('rx', 6);
    
    const glowColor = isDarkTheme() ? 'rgba(233, 220, 201, 0.1)' : 'rgba(255, 255, 255, 0.3)';
    card.append('rect')
      .attr('x', 1).attr('y', 1)
      .attr('width', CARD_WIDTH - 2).attr('height', CARD_HEIGHT - 2)
      .attr('fill', 'none').attr('stroke', glowColor).attr('stroke-width', 1).attr('rx', 5);
    
    card.append('text')
      .attr('x', CARD_WIDTH / 2).attr('y', 22)
      .attr('text-anchor', 'middle').attr('class', 'person-name')
      .attr('fill', '#e9dcc9')
      .text(`${person.firstName} ${person.lastName}`);
    
    let currentY = 22;
    if (person.maidenName) {
      currentY += 15;
      card.append('text')
        .attr('x', CARD_WIDTH / 2).attr('y', currentY)
        .attr('text-anchor', 'middle').attr('class', 'person-maiden')
        .attr('fill', '#b8a891')
        .text(`(née ${person.maidenName})`);
    }
    currentY += 18;
    const dates = `b. ${person.dateOfBirth}${person.dateOfDeath ? ` - d. ${person.dateOfDeath}` : ''}`;
    card.append('text')
      .attr('x', CARD_WIDTH / 2).attr('y', currentY)
      .attr('text-anchor', 'middle').attr('class', 'person-dates')
      .attr('fill', '#b8a891')
      .text(dates);

    const isHighlighted = searchResults.some(p => p.id === person.id);
    if (isHighlighted) {
      card.append('rect')
        .attr('width', CARD_WIDTH)
        .attr('height', CARD_HEIGHT)
        .attr('fill', 'none')
        .attr('stroke', '#ffff00')
        .attr('stroke-width', 3)
        .attr('rx', 6)
        .attr('class', 'search-highlight');
    }
    
    if (showRelationships && relationshipMap.has(person.id)) {
      const relationship = relationshipMap.get(person.id);
      card.append('rect')
        .attr('x', 5)
        .attr('y', CARD_HEIGHT - 20)
        .attr('width', CARD_WIDTH - 10)
        .attr('height', 16)
        .attr('fill', 'rgba(0, 0, 0, 0.7)')
        .attr('rx', 3);
      
      card.append('text')
        .attr('x', CARD_WIDTH / 2)
        .attr('y', CARD_HEIGHT - 8)
        .attr('text-anchor', 'middle')
        .attr('fill', '#ffffff')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .text(relationship);
    }
    
    return { x, y, width: CARD_WIDTH, height: CARD_HEIGHT, personId: person.id };
  };

  const drawMarriageLine = (g, pos1, pos2, themeColors) => {
    const marriageColor = isDarkTheme() ? '#c08a7a' : '#b87a8a';
    
    let x1, y1, x2, y2;
    
    if (isHorizontal) {
      // Horizontal layout: spouses are stacked vertically, line goes down
      x1 = pos1.x + pos1.width / 2;
      y1 = pos1.y + pos1.height;
      x2 = pos2.x + pos2.width / 2;
      y2 = pos2.y;
    } else {
      // Vertical layout: spouses are side by side, line goes right
      x1 = pos1.x + pos1.width;
      y1 = pos1.y + pos1.height / 2;
      x2 = pos2.x;
      y2 = pos2.y + pos2.height / 2;
    }
    
    g.append('line').attr('class', 'marriage-line')
      .attr('x1', x1).attr('y1', y1).attr('x2', x2).attr('y2', y2)
      .attr('stroke', marriageColor);
    return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
  };

  const drawChildLines = (g, marriageCenter, positions, parentY, childY, peopleById, parentMap, positionMap, themeColors, yOffset = 0, parentId = null, spouseId = null) => {
    if (positions.length === 0) return;
    const midY = parentY + (childY - parentY) / 2;
    
    const legitimateChildren = [];
    const bastardChildren = [];
    const adoptedChildren = [];
    
    positions.forEach(pos => {
      const person = peopleById.get(pos.personId);
      if (person) {
        if (person.legitimacyStatus === 'bastard') {
          bastardChildren.push(pos);
        } else if (person.legitimacyStatus === 'adopted') {
          adoptedChildren.push(pos);
        } else {
          legitimateChildren.push(pos);
        }
      }
    });

    const lineSystemsCount = [legitimateChildren.length > 0, bastardChildren.length > 0, adoptedChildren.length > 0].filter(Boolean).length;
    
    let legitOffset = 0;
    let bastardOffset = 0;
    let adoptedOffset = 0;
    
    if (lineSystemsCount === 1) {
      legitOffset = bastardOffset = adoptedOffset = 0;
    } else if (lineSystemsCount === 2) {
      if (legitimateChildren.length > 0 && bastardChildren.length > 0) {
        legitOffset = 2.5;
        bastardOffset = -2.5;
      } else if (legitimateChildren.length > 0 && adoptedChildren.length > 0) {
        legitOffset = -2.5;
        adoptedOffset = 2.5;
      } else if (bastardChildren.length > 0 && adoptedChildren.length > 0) {
        bastardOffset = -2.5;
        adoptedOffset = 2.5;
      }
    } else if (lineSystemsCount === 3) {
      bastardOffset = -5;
      legitOffset = 0;
      adoptedOffset = 5;
    }

    if (legitimateChildren.length > 0) {
      const legitFirstX = legitimateChildren[0].x + CARD_WIDTH / 2;
      const legitLastX = legitimateChildren[legitimateChildren.length - 1].x + CARD_WIDTH / 2;
      const legitCenterX = (legitFirstX + legitLastX) / 2;
      const legitMarriageX = marriageCenter.x + legitOffset;
      const legitY = midY + yOffset;

      g.append('line').attr('class', 'child-line-legit').attr('stroke', themeColors.lines.legitimate).attr('stroke-width', 2).attr('x1', legitMarriageX).attr('y1', marriageCenter.y).attr('x2', legitMarriageX).attr('y2', legitY);
      g.append('line').attr('class', 'child-line-legit').attr('stroke', themeColors.lines.legitimate).attr('stroke-width', 2).attr('x1', legitMarriageX).attr('y1', legitY).attr('x2', legitCenterX).attr('y2', legitY);
      g.append('line').attr('class', 'child-line-legit').attr('stroke', themeColors.lines.legitimate).attr('stroke-width', 2).attr('x1', legitFirstX).attr('y1', legitY).attr('x2', legitLastX).attr('y2', legitY);
      legitimateChildren.forEach(pos => {
        g.append('line').attr('class', 'child-line-legit').attr('stroke', themeColors.lines.legitimate).attr('stroke-width', 2).attr('x1', pos.x + CARD_WIDTH / 2).attr('y1', legitY).attr('x2', pos.x + CARD_WIDTH / 2).attr('y2', pos.y);
      });
    }

    if (bastardChildren.length > 0) {
      const bastardFirstX = bastardChildren[0].x + CARD_WIDTH / 2;
      const bastardLastX = bastardChildren[bastardChildren.length - 1].x + CARD_WIDTH / 2;
      const bastardCenterX = (bastardFirstX + bastardLastX) / 2;
      const bastardY = midY - 5 + yOffset;
      
      let bastardMarriageX = marriageCenter.x + bastardOffset;
      let bastardStartY = marriageCenter.y;
      
      // CRITICAL: Check if bastards have BOTH parents or just ONE
      // If a bastard has only ONE parent in this couple, line comes from that parent's card
      // If a bastard has BOTH parents (pre-marital), line comes from marriage center
      const firstBastard = peopleById.get(bastardChildren[0].personId);
      if (firstBastard) {
        const bastardParents = parentMap.get(firstBastard.id) || [];
        const hasBothParents = spouseId && bastardParents.includes(parentId) && bastardParents.includes(spouseId);
        
        if (!hasBothParents) {
          // Only ONE parent - line comes from parent's card center (no offset)
          const parentPos = positionMap.get(parentId);
          if (parentPos) {
            bastardMarriageX = parentPos.x + CARD_WIDTH / 2;
            bastardStartY = parentY;
          }
        }
      }

      g.append('line').attr('class', 'child-line-bastard').attr('stroke', themeColors.lines.bastard).attr('stroke-width', 2).attr('x1', bastardMarriageX).attr('y1', bastardStartY).attr('x2', bastardMarriageX).attr('y2', bastardY);
      g.append('line').attr('class', 'child-line-bastard').attr('stroke', themeColors.lines.bastard).attr('stroke-width', 2).attr('x1', bastardMarriageX).attr('y1', bastardY).attr('x2', bastardCenterX).attr('y2', bastardY);
      g.append('line').attr('class', 'child-line-bastard').attr('stroke', themeColors.lines.bastard).attr('stroke-width', 2).attr('x1', bastardFirstX).attr('y1', bastardY).attr('x2', bastardLastX).attr('y2', bastardY);
      bastardChildren.forEach(pos => {
        g.append('line').attr('class', 'child-line-bastard').attr('stroke', themeColors.lines.bastard).attr('stroke-width', 2).attr('x1', pos.x + CARD_WIDTH / 2).attr('y1', bastardY).attr('x2', pos.x + CARD_WIDTH / 2).attr('y2', pos.y);
      });
    }

    if (adoptedChildren.length > 0) {
      const adoptedFirstX = adoptedChildren[0].x + CARD_WIDTH / 2;
      const adoptedLastX = adoptedChildren[adoptedChildren.length - 1].x + CARD_WIDTH / 2;
      const adoptedCenterX = (adoptedFirstX + adoptedLastX) / 2;
      const adoptedMarriageX = marriageCenter.x + adoptedOffset;
      const adoptedY = midY + 5 + yOffset;

      g.append('line').attr('class', 'child-line-adopted').attr('stroke', themeColors.lines.adopted).attr('stroke-width', 2).attr('x1', adoptedMarriageX).attr('y1', marriageCenter.y).attr('x2', adoptedMarriageX).attr('y2', adoptedY);
      g.append('line').attr('class', 'child-line-adopted').attr('stroke', themeColors.lines.adopted).attr('stroke-width', 2).attr('x1', adoptedMarriageX).attr('y1', adoptedY).attr('x2', adoptedCenterX).attr('y2', adoptedY);
      g.append('line').attr('class', 'child-line-adopted').attr('stroke', themeColors.lines.adopted).attr('stroke-width', 2).attr('x1', adoptedFirstX).attr('y1', adoptedY).attr('x2', adoptedLastX).attr('y2', adoptedY);
      adoptedChildren.forEach(pos => {
        g.append('line').attr('class', 'child-line-adopted').attr('stroke', themeColors.lines.adopted).attr('stroke-width', 2).attr('x1', pos.x + CARD_WIDTH / 2).attr('y1', adoptedY).attr('x2', pos.x + CARD_WIDTH / 2).attr('y2', pos.y);
      });
    }
  };

  const drawTree = () => {
    const themeColors = getAllThemeColors();
    
    // Check if we have a saved transform from before redraw
    let savedTransform = null;
    const existingGroup = d3.select(svgRef.current).select('.zoom-group');
    if (!existingGroup.empty()) {
      const transformStr = existingGroup.attr('transform');
      if (transformStr) {
        savedTransform = d3.zoomTransform(existingGroup.node());
      }
    }

    d3.select(svgRef.current).selectAll('*').remove();
    const { peopleById, housesById, parentMap, childrenMap, spouseMap } = buildRelationshipMaps();
    
    const svg = d3.select(svgRef.current).attr('width', '100%').attr('height', '100%');
    const g = svg.append('g').attr('class', 'zoom-group');

    const zoom = d3.zoom().scaleExtent([0.1, 3])
      .on('zoom', (event) => { g.attr('transform', event.transform); setZoomLevel(event.transform.k); });

    svg.call(zoom);
    zoomBehaviorRef.current = zoom;
    
    // NOTE: We'll set the transform AFTER drawing so we can center on content

    // Draw anchor line based on layout mode
    // Vertical: vertical line at center X
    // Horizontal: horizontal line at center Y
    if (layoutMode === 'vertical') {
      g.append('line').attr('class', 'anchor-line')
        .attr('x1', ANCHOR_X).attr('y1', 0).attr('x2', ANCHOR_X).attr('y2', 5000)
        .attr('stroke', themeColors.lines.anchor);
    } else {
      g.append('line').attr('class', 'anchor-line')
        .attr('x1', 0).attr('y1', ANCHOR_Y).attr('x2', 5000).attr('y2', ANCHOR_Y)
        .attr('stroke', themeColors.lines.anchor);
    }

    if (people.length === 0) {
      g.append('text').attr('x', ANCHOR_X).attr('y', 200).attr('text-anchor', 'middle').attr('font-size', '20px').attr('fill', '#e9dcc9').text('No data available.');
      return;
    }

    const generations = detectGenerations(peopleById, parentMap, childrenMap, spouseMap);
    
    if (generations.length === 0) {
      g.append('text').attr('x', ANCHOR_X).attr('y', 200).attr('text-anchor', 'middle').attr('font-size', '20px').attr('fill', '#e9dcc9').text('No root couple found.');
      return;
    }

    const positionMap = new Map();
    const marriageCenters = new Map();
    const marriageLinesToDraw = [];
    
    // ════════════════════════════════════════════════════════════════════════
    // LAYOUT-AWARE POSITIONING
    // ════════════════════════════════════════════════════════════════════════
    // In vertical mode: generations go down (Y increases), siblings spread horizontally (X varies)
    // In horizontal mode: generations go right (X increases), siblings spread vertically (Y varies)
    // 
    // We use "genPos" for the generation axis and "sibPos" for the sibling axis
    // Then map to actual X/Y based on layout mode
    // ════════════════════════════════════════════════════════════════════════
    
    let currentGenPos = isHorizontal ? START_X : START_Y;  // Position along generation axis
    const anchorSibPos = isHorizontal ? ANCHOR_Y : ANCHOR_X;  // Anchor along sibling axis
    
    // Helper to convert layout positions to X,Y
    const layoutToXY = (sibPos, genPos) => {
      return isHorizontal 
        ? { x: genPos, y: sibPos }
        : { x: sibPos, y: genPos };
    };
    
    // Get the "sibling size" (width in vertical, height in horizontal)
    const siblingSize = isHorizontal ? CARD_HEIGHT : CARD_WIDTH;
    const genSize = isHorizontal ? CARD_WIDTH : CARD_HEIGHT;
    const genSpacing = verticalSpacing;
    
    generations.forEach((genIds, genIndex) => {
      console.log(`Drawing generation ${genIndex} with ${genIds.length} people (${layoutMode} layout)`);
      
      // Special handling for Gen 0 (single root person + spouse if exists)
      if (genIndex === 0) {
        const rootPerson = peopleById.get(genIds[0]);
        if (!rootPerson) {
          console.error('Root person not found');
          return;
        }
        
        const rootSpouseId = spouseMap.get(rootPerson.id);
        const rootSpouse = rootSpouseId ? peopleById.get(rootSpouseId) : null;
        
        // Calculate width along sibling axis (person + spouse if exists)
        const gen0Cards = rootSpouse ? 2 : 1;
        const gen0SibWidth = gen0Cards * siblingSize + (gen0Cards - 1) * SPACING;
        let gen0SibPos = anchorSibPos - (gen0SibWidth / 2);
        
        // Draw root person
        const coords = layoutToXY(gen0SibPos, currentGenPos);
        const rootPos = drawPersonCard(g, rootPerson, coords.x, coords.y, housesById, themeColors);
        positionMap.set(rootPerson.id, rootPos);
        gen0SibPos += siblingSize + SPACING;
        
        // Draw spouse if exists
        if (rootSpouse) {
          const spouseCoords = layoutToXY(gen0SibPos, currentGenPos);
          const spousePos = drawPersonCard(g, rootSpouse, spouseCoords.x, spouseCoords.y, housesById, themeColors);
          positionMap.set(rootSpouse.id, spousePos);
          
          // Store marriage center
          const mc = isHorizontal ? {
            x: (rootPos.x + spousePos.x + CARD_WIDTH) / 2,
            y: (rootPos.y + rootPos.height + spousePos.y) / 2
          } : {
            x: (rootPos.x + rootPos.width + spousePos.x) / 2,
            y: (rootPos.y + rootPos.height/2 + spousePos.y + spousePos.height/2) / 2
          };
          marriageCenters.set([rootPerson.id, rootSpouse.id].sort().join('-'), mc);
          marriageLinesToDraw.push([rootPos, spousePos]);
        }
        
        currentGenPos += genSize + genSpacing;
        return; // Skip to next generation
      }
      
      // For all other generations, build groups by parent
      const prevGenIds = generations[genIndex - 1];
      const groups = [];
      const processedChildren = new Set();
      
      // Get ALL people from previous generation including spouses
      const prevGenPeople = new Set(prevGenIds);
      prevGenIds.forEach(pid => {
        const spouse = spouseMap.get(pid);
        if (spouse) prevGenPeople.add(spouse);
      });
      
      prevGenPeople.forEach(parentId => {
        const parent = peopleById.get(parentId);
        if (!parent) return;
        
        const spouseId = spouseMap.get(parentId);
        const children = childrenMap.get(parentId) || [];
        const childSet = new Set(children);
        
        // Add spouse's children
        if (spouseId) {
          const spouseChildren = childrenMap.get(spouseId) || [];
          spouseChildren.forEach(c => childSet.add(c));
        }
        
        // Filter to only children in THIS generation who haven't been processed
        const genChildren = Array.from(childSet)
          .filter(id => genIds.includes(id) && !processedChildren.has(id))
          .map(id => peopleById.get(id))
          .filter(p => p)
          .sort((a, b) => parseInt(a.dateOfBirth) - parseInt(b.dateOfBirth));
        
        if (genChildren.length === 0) return;
        
        // Mark as processed
        genChildren.forEach(child => processedChildren.add(child.id));
        
        const groupKey = spouseId ? [parentId, spouseId].sort().join('-') : parentId.toString();
        
        // Skip if this couple already has a group
        if (groups.find(g => g.key === groupKey)) return;
        
        groups.push({
          key: groupKey,
          parentId: parentId,
          spouseId: spouseId,
          children: genChildren
        });
      });
      
      // ════════════════════════════════════════════════════════════════════════
      // PRIMOGENITURE ORDERING: Sort groups by inherited ancestral position
      // ════════════════════════════════════════════════════════════════════════
      // The key insight: A person's position in the tree is determined by their
      // ANCESTRY, not their individual birth date. Wenton's entire line (children,
      // grandchildren, etc.) comes before Steffan's entire line because Wenton
      // is the elder sibling - regardless of when individual descendants were born.
      //
      // We build an "ancestral order key" for each parent by tracing back to find
      // their position within each generation of ancestors.
      // ════════════════════════════════════════════════════════════════════════
      
      // ════════════════════════════════════════════════════════════════════════
      // HELPER: Check if a person can be traced back to the tree root
      // This determines if they're a "blood relative" vs "married in"
      // 
      // MEMOIZED: Results are cached so we only calculate once per person,
      // making this performant even with 10+ generations and hundreds of people.
      // ════════════════════════════════════════════════════════════════════════
      const traceableCache = new Map();
      
      const canTraceToRoot = (personId, visited = new Set()) => {
        // Return cached result if we've already calculated this person
        if (traceableCache.has(personId)) return traceableCache.get(personId);
        
        if (visited.has(personId)) return false; // Prevent infinite loops
        visited.add(personId);
        
        const person = peopleById.get(personId);
        if (!person) {
          traceableCache.set(personId, false);
          return false;
        }
        
        // Check if this person is the root (first person in Gen 0)
        const rootPersonId = generations[0]?.[0];
        if (personId === rootPersonId) {
          traceableCache.set(personId, true);
          return true;
        }
        
        // Check if spouse of root
        const rootSpouseId = spouseMap.get(rootPersonId);
        if (personId === rootSpouseId) {
          traceableCache.set(personId, true);
          return true;
        }
        
        // Try to trace through parents
        const parents = parentMap.get(personId);
        if (!parents || parents.length === 0) {
          traceableCache.set(personId, false);
          return false;
        }
        
        // If ANY parent can trace to root, this person can too
        const result = parents.some(pid => canTraceToRoot(pid, new Set(visited)));
        traceableCache.set(personId, result);
        return result;
      };
      
      const getAncestralOrderKey = (personId) => {
        // Build a chain of birth order positions from root to this person
        // e.g., [0, 1, 0] means: root's 1st child → their 2nd child → their 1st child
        const orderChain = [];
        let currentId = personId;
        
        while (currentId) {
          const person = peopleById.get(currentId);
          if (!person) break;
          
          // Find this person's parents
          const parents = parentMap.get(currentId);
          if (!parents || parents.length === 0) {
            // This is a root person - they get position 0
            orderChain.unshift(0);
            break;
          }
          
          // ════════════════════════════════════════════════════════════════════
          // CRITICAL FIX: Pick the parent who can trace back to the tree root
          // This ensures we follow the BLOODLINE, not spouses who married in
          // ════════════════════════════════════════════════════════════════════
          let parentId = parents[0]; // Default to first
          if (parents.length > 1) {
            // Find the parent who is a blood relative (can trace to root)
            const bloodParent = parents.find(pid => canTraceToRoot(pid));
            if (bloodParent) {
              parentId = bloodParent;
            }
          }
          
          const parent = peopleById.get(parentId);
          if (!parent) break;
          
          // Get all siblings (children of the same parent)
          const siblingIds = childrenMap.get(parentId) || [];
          const siblings = siblingIds
            .map(id => peopleById.get(id))
            .filter(p => p)
            .sort((a, b) => parseInt(a.dateOfBirth) - parseInt(b.dateOfBirth));
          
          // Find this person's position among siblings (birth order)
          const birthPosition = siblings.findIndex(s => s.id === currentId);
          orderChain.unshift(birthPosition >= 0 ? birthPosition : 999);
          
          // Move up to parent
          currentId = parentId;
        }
        
        return orderChain;
      };
      
      // Compare two ancestral order keys
      // [0, 1] < [0, 2] (same grandparent, but 2nd vs 3rd child)
      // [0] < [1] (1st vs 2nd child of root)
      // [0, 0] < [1, 0] (grandchild of 1st child vs grandchild of 2nd child)
      const compareOrderKeys = (keyA, keyB) => {
        const maxLen = Math.max(keyA.length, keyB.length);
        for (let i = 0; i < maxLen; i++) {
          const a = keyA[i] ?? 0;
          const b = keyB[i] ?? 0;
          if (a !== b) return a - b;
        }
        return 0;
      };
      
      groups.sort((a, b) => {
        const keyA = getAncestralOrderKey(a.parentId);
        const keyB = getAncestralOrderKey(b.parentId);
        return compareOrderKeys(keyA, keyB);
      });
      
      // Calculate generation width along sibling axis
      let totalCards = 0;
      groups.forEach(group => {
        // CRITICAL FIX: Count children in BIRTH ORDER, not by legitimacy type
        totalCards += group.children.length;
        
        group.children.forEach(child => {
          const childSpouseId = spouseMap.get(child.id);
          if (childSpouseId && peopleById.has(childSpouseId)) {
            totalCards++;
          }
        });
      });
      
      // Calculate sibling axis width and starting position
      const genSibWidth = totalCards * siblingSize + (totalCards - 1) * SPACING + (groups.length - 1) * GROUP_SPACING;
      let currentSibPos = anchorSibPos - (genSibWidth / 2);
      
      // Draw each group
      groups.forEach((group, groupIdx) => {
        const groupPositions = [];
        
        // CRITICAL FIX: Draw children in BIRTH ORDER (already sorted)
        group.children.forEach(child => {
          const coords = layoutToXY(currentSibPos, currentGenPos);
          const childPos = drawPersonCard(g, child, coords.x, coords.y, housesById, themeColors);
          positionMap.set(child.id, childPos);
          groupPositions.push(childPos);
          currentSibPos += siblingSize + SPACING;
          
          // Draw spouse ALWAYS (not just if in same generation)
          const childSpouseId = spouseMap.get(child.id);
          if (childSpouseId && peopleById.has(childSpouseId)) {
            const spouse = peopleById.get(childSpouseId);
            const spouseCoords = layoutToXY(currentSibPos, currentGenPos);
            const spousePos = drawPersonCard(g, spouse, spouseCoords.x, spouseCoords.y, housesById, themeColors);
            positionMap.set(childSpouseId, spousePos);
            
            // Marriage center depends on layout
            const mc = isHorizontal ? {
              x: (childPos.x + spousePos.x + CARD_WIDTH) / 2,
              y: (childPos.y + childPos.height + spousePos.y) / 2
            } : {
              x: (childPos.x + childPos.width + spousePos.x) / 2,
              y: (childPos.y + childPos.height/2 + spousePos.y + spousePos.height/2) / 2
            };
            marriageCenters.set([child.id, childSpouseId].sort().join('-'), mc);
            marriageLinesToDraw.push([childPos, spousePos]);
            
            currentSibPos += siblingSize + SPACING;
          }
        });
        
        // Draw child lines (only in vertical mode for now - horizontal needs different line logic)
        if (!isHorizontal) {
          const mcKey = group.spouseId ? [group.parentId, group.spouseId].sort().join('-') : group.parentId.toString();
          const parentPos = positionMap.get(group.parentId);
          
          // Skip if parent position not found (shouldn't happen but safety check)
          if (!parentPos) {
            console.warn(`Parent position not found for parentId: ${group.parentId}`);
            if (groupIdx < groups.length - 1) {
              currentSibPos += GROUP_SPACING;
            }
            return;
          }
          
          const parentMC = marriageCenters.get(mcKey) || {
            x: parentPos.x + CARD_WIDTH/2,
            y: parentPos.y + CARD_HEIGHT
          };
          
          const prevGenY = currentGenPos - genSpacing - CARD_HEIGHT;
          
          // Preserve Lochlann special case
          const isLochlann = group.parentId === 18;
          const yOffset = isLochlann ? -5 : 0;
          
          // Draw child lines using the classic triple-offset system
          drawChildLines(g, parentMC, groupPositions, prevGenY + CARD_HEIGHT, currentGenPos, peopleById, parentMap, positionMap, themeColors, yOffset, group.parentId, group.spouseId);
        }
        
        if (groupIdx < groups.length - 1) {
          currentSibPos += GROUP_SPACING;
        }
      });
      
      currentGenPos += genSize + genSpacing;
    });
    
    // Draw all marriage lines
    marriageLinesToDraw.forEach(([pos1, pos2]) => drawMarriageLine(g, pos1, pos2, themeColors));
    
    // ==================== CENTER VIEW ON CONTENT ====================
    // Calculate bounding box of all drawn cards to center the view
    if (positionMap.size > 0) {
      const positions = Array.from(positionMap.values());
      
      // Find bounding box of all cards
      const minX = Math.min(...positions.map(p => p.x));
      const maxX = Math.max(...positions.map(p => p.x + p.width));
      const minY = Math.min(...positions.map(p => p.y));
      const maxY = Math.max(...positions.map(p => p.y + p.height));
      
      // Calculate center of content
      const contentCenterX = (minX + maxX) / 2;
      const contentCenterY = (minY + maxY) / 2;
      const contentWidth = maxX - minX;
      const contentHeight = maxY - minY;
      
      // Get viewport dimensions
      const svgElement = svgRef.current;
      const viewportWidth = svgElement?.clientWidth || window.innerWidth;
      const viewportHeight = svgElement?.clientHeight || window.innerHeight;
      
      if (savedTransform) {
        // If we have a saved transform (from redraw), use it
        svg.call(zoom.transform, savedTransform);
      } else {
        // Calculate ideal scale to fit content with some padding
        const padding = 100;
        const scaleX = (viewportWidth - padding * 2) / contentWidth;
        const scaleY = (viewportHeight - padding * 2) / contentHeight;
        const idealScale = Math.min(scaleX, scaleY, 1); // Don't zoom in beyond 1x
        const finalScale = Math.max(idealScale, 0.3); // Don't zoom out too far
        
        // Calculate translation to center content in viewport
        const translateX = (viewportWidth / 2) - (contentCenterX * finalScale);
        const translateY = (viewportHeight / 2) - (contentCenterY * finalScale);
        
        // Apply the calculated transform
        const initialTransform = d3.zoomIdentity
          .translate(translateX, translateY)
          .scale(finalScale);
        
        svg.call(zoom.transform, initialTransform);
        setZoomLevel(finalScale);
        
        console.log('🎯 Tree centered:', {
          contentCenter: { x: contentCenterX, y: contentCenterY },
          contentSize: { width: contentWidth, height: contentHeight },
          viewport: { width: viewportWidth, height: viewportHeight },
          scale: finalScale
        });
      }
    } else {
      // Fallback if no positions (empty tree)
      const fallbackTransform = savedTransform || d3.zoomIdentity.translate(200, 100).scale(0.8);
      svg.call(zoom.transform, fallbackTransform);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Loading Family Tree...</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Fetching your genealogy data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navigation 
        people={people}
        onSearchResults={handleSearchResults}
        showSearch={true}
        showControlsToggle={true}
        controlsExpanded={controlsPanelExpanded}
        onToggleControls={() => setControlsPanelExpanded(!controlsPanelExpanded)}
      />

      <div className="fixed top-20 right-6 z-10">
        <div
          className="rounded-lg shadow-lg transition-all duration-300 ease-in-out overflow-hidden"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderWidth: '1px',
            borderColor: 'var(--border-primary)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            maxHeight: controlsPanelExpanded ? '500px' : '0',
            opacity: controlsPanelExpanded ? '1' : '0',
            padding: controlsPanelExpanded ? '1rem' : '0 1rem'
          }}
        >
          <label className="block mb-2 font-medium" style={{ color: 'var(--text-primary)' }}>View House:</label>
          <select value={selectedHouseId || ''} onChange={(e) => setSelectedHouseId(Number(e.target.value))}
            className="w-48 p-2 rounded transition"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              borderWidth: '1px',
              borderColor: 'var(--border-primary)',
              borderRadius: 'var(--radius-md)'
            }}>
            {houses.map(house => (<option key={house.id} value={house.id}>{house.houseName}</option>))}
          </select>
          <div className="mt-4 pt-4" style={{ borderTopWidth: '1px', borderColor: 'var(--border-primary)' }}>
            <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Generation Spacing:</label>
            <select 
              value={verticalSpacing} 
              onChange={(e) => setVerticalSpacing(Number(e.target.value))}
              className="w-48 p-2 rounded transition"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                borderWidth: '1px',
                borderColor: 'var(--border-primary)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <option value={150}>150px</option>
              <option value={140}>140px</option>
              <option value={130}>130px</option>
              <option value={120}>120px</option>
              <option value={110}>110px</option>
              <option value={100}>100px (Default)</option>
            </select>
          </div>

          <div className="mt-4 pt-4" style={{ borderTopWidth: '1px', borderColor: 'var(--border-primary)' }}>
            <label className="flex items-center cursor-pointer transition-opacity hover:opacity-80" style={{ color: 'var(--text-primary)' }}>
              <input
                type="checkbox"
                checked={showRelationships}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setShowRelationships(checked);
                  showRelationshipsRef.current = checked;
                  if (!checked) {
                    setReferencePerson(null);
                    setRelationshipMap(new Map());
                  }
                }}
                className="mr-2 w-4 h-4"
              />
              <span className="text-sm">Show Relationships</span>
            </label>
            {showRelationships && referencePerson && (
              <div className="mt-2 text-xs p-2 rounded" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                Reference: {referencePerson.firstName} {referencePerson.lastName}
              </div>
            )}
          </div>
        </div>
      </div>

      <TreeControls 
        svgRef={svgRef} 
        zoomBehaviorRef={zoomBehaviorRef} 
        showCadetHouses={showCadetHouses}
        onToggleCadetHouses={(checked) => setShowCadetHouses(checked)} 
        zoomLevel={zoomLevel}
        onZoomChange={(level) => setZoomLevel(level)} 
        isDarkTheme={isDarkTheme()}
        layoutMode={layoutMode}
        onLayoutChange={handleLayoutChange}
      />

      <div className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <svg ref={svgRef} className="tree-svg"></svg>
      </div>

      {selectedPerson && (
        <QuickEditPanel
          person={selectedPerson}
          onClose={() => setSelectedPerson(null)}
          onPersonSelect={(newPerson) => {
            // Navigate to the clicked related person
            setSelectedPerson(newPerson);
            // Also update relationship calculator if active
            if (showRelationshipsRef.current) {
              setReferencePerson(newPerson);
              const { parentMap, childrenMap, spouseMap } = buildRelationshipMaps();
              const newRelationships = calculateAllRelationships(newPerson.id, people, parentMap, childrenMap, spouseMap);
              setRelationshipMap(newRelationships);
            }
          }}
          isDarkTheme={isDarkTheme()}
        />
      )}

      <style>{`
        .person-card { cursor: pointer; transition: all 0.2s ease; }
        .person-card:hover { filter: brightness(${isDarkTheme() ? '1.15' : '0.95'}); }
        .person-name { 
          font-weight: bold; 
          font-size: 13px; 
          font-family: var(--font-display), 'Georgia', serif; 
          text-shadow: 0 1px 2px rgba(0, 0, 0, ${isDarkTheme() ? '0.3' : '0.1'}); 
        }
        .person-dates { 
          font-size: 10px; 
          font-family: var(--font-body), 'Georgia', serif;
          text-shadow: 0 1px 1px rgba(0, 0, 0, ${isDarkTheme() ? '0.2' : '0.1'}); 
        }
        .person-maiden { 
          font-size: 10px; 
          font-style: italic; 
          font-family: var(--font-body), 'Georgia', serif;
          text-shadow: 0 1px 1px rgba(0, 0, 0, ${isDarkTheme() ? '0.2' : '0.1'}); 
        }
        .marriage-line { stroke-width: 2.5; fill: none; opacity: 0.8; }
        .child-line-legit { fill: none; opacity: 0.8; }
        .child-line-bastard { fill: none; opacity: 0.8; }
        .child-line-adopted { fill: none; opacity: 0.8; }
        .anchor-line { stroke-width: 1; stroke-dasharray: 5,5; opacity: 0.15; }
        .search-highlight {
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export default FamilyTree;