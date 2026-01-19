// src/components/dev/DevAuraOverlay.jsx
import React, { useMemo } from 'react';
import { getImmediateFamily } from '../../utils/layoutPatternAnalyser';

/**
 * DEV AURA OVERLAY
 * 
 * SVG overlay showing measurement lines ONLY to the selected person's
 * immediate family. This creates a focused "aura" of information around
 * whoever you're currently working with.
 * 
 * THE AURA CONCEPT:
 * Instead of showing all measurements everywhere (overwhelming), we only show
 * distances to people directly connected to the selected/dragging person:
 * - Parents (above)
 * - Children (below)  
 * - Spouse (beside)
 * - Siblings (beside)
 * 
 * This keeps the display clean while providing exactly the information you
 * need to understand and refine positioning for that person.
 * 
 * WHAT IT SHOWS:
 * - Vertical distance lines to parents/children (green)
 * - Horizontal distance lines to spouse (orange/gold)
 * - Horizontal distance lines to siblings (blue)
 * - Coordinate label on the selected person's card
 */
function DevAuraOverlay({
  selectedPersonId,
  people,
  positions,
  relationships,
  isVisible = true,
  cardWidth = 150,
  cardHeight = 70
}) {
  // Build person lookup map
  const personMap = useMemo(() => {
    return new Map(people.map(p => [p.id, p]));
  }, [people]);

  // Get immediate family for the selected person
  const immediateFamily = useMemo(() => {
    if (!selectedPersonId) return null;
    return getImmediateFamily(selectedPersonId, relationships);
  }, [selectedPersonId, relationships]);

  // Build measurement lines
  const measurements = useMemo(() => {
    if (!selectedPersonId || !immediateFamily) return [];
    
    const selectedPos = positions[selectedPersonId];
    if (!selectedPos) return [];
    
    const lines = [];

    // Helper to get center of a card
    const getCardCenter = (pos) => ({
      x: pos.x + cardWidth / 2,
      y: pos.y + cardHeight / 2
    });

    const selectedCenter = getCardCenter(selectedPos);

    // ── PARENT LINES (vertical, green) ──
    immediateFamily.parents.forEach(parentId => {
      const parentPos = positions[parentId];
      if (!parentPos) return;
      
      const parent = personMap.get(parentId);
      const parentCenter = getCardCenter(parentPos);
      const verticalDist = Math.abs(selectedCenter.y - parentCenter.y);
      
      lines.push({
        type: 'parent',
        fromId: selectedPersonId,
        toId: parentId,
        x1: selectedCenter.x,
        y1: selectedPos.y, // Top of selected card
        x2: selectedCenter.x,
        y2: parentPos.y + cardHeight, // Bottom of parent card
        labelX: selectedCenter.x + 20,
        labelY: (selectedPos.y + parentPos.y + cardHeight) / 2,
        label: `↕ ${Math.round(verticalDist)}`,
        color: 'var(--color-success, #7cb97c)',
        name: parent ? `${parent.firstName}` : 'Parent'
      });
    });

    // ── CHILDREN LINES (vertical, green) ──
    immediateFamily.children.forEach(childId => {
      const childPos = positions[childId];
      if (!childPos) return;
      
      const child = personMap.get(childId);
      const childCenter = getCardCenter(childPos);
      const verticalDist = Math.abs(selectedCenter.y - childCenter.y);
      
      lines.push({
        type: 'child',
        fromId: selectedPersonId,
        toId: childId,
        x1: selectedCenter.x,
        y1: selectedPos.y + cardHeight, // Bottom of selected card
        x2: selectedCenter.x,
        y2: childPos.y, // Top of child card
        labelX: selectedCenter.x + 20,
        labelY: (selectedPos.y + cardHeight + childPos.y) / 2,
        label: `↕ ${Math.round(verticalDist)}`,
        color: 'var(--color-success, #7cb97c)',
        name: child ? `${child.firstName}` : 'Child'
      });
    });

    // ── SPOUSE LINES (horizontal, gold/orange) ──
    immediateFamily.spouses.forEach(spouseId => {
      const spousePos = positions[spouseId];
      if (!spousePos) return;
      
      const spouse = personMap.get(spouseId);
      const spouseCenter = getCardCenter(spousePos);
      const horizontalDist = Math.abs(selectedCenter.x - spouseCenter.x);
      
      // Determine which side spouse is on
      const spouseIsRight = spousePos.x > selectedPos.x;
      
      lines.push({
        type: 'spouse',
        fromId: selectedPersonId,
        toId: spouseId,
        x1: spouseIsRight ? selectedPos.x + cardWidth : selectedPos.x,
        y1: selectedCenter.y,
        x2: spouseIsRight ? spousePos.x : spousePos.x + cardWidth,
        y2: spouseCenter.y,
        labelX: (selectedCenter.x + spouseCenter.x) / 2,
        labelY: selectedCenter.y - 15,
        label: `↔ ${Math.round(horizontalDist)}`,
        color: 'var(--color-warning, #d4a574)',
        name: spouse ? `${spouse.firstName}` : 'Spouse'
      });
    });

    // ── SIBLING LINES (horizontal, blue) ──
    immediateFamily.siblings.forEach(siblingId => {
      const siblingPos = positions[siblingId];
      if (!siblingPos) return;
      
      const sibling = personMap.get(siblingId);
      const siblingCenter = getCardCenter(siblingPos);
      const horizontalDist = Math.abs(selectedCenter.x - siblingCenter.x);
      
      // Skip siblings that are too close (likely overlapping with spouse line)
      if (horizontalDist < cardWidth) return;
      
      // Determine which side sibling is on
      const siblingIsRight = siblingPos.x > selectedPos.x;
      
      // Get legitimacy status for label color
      const siblingStatus = sibling?.legitimacyStatus || sibling?.bastardStatus || 'legitimate';
      const statusColor = siblingStatus === 'bastard' 
        ? 'var(--color-warning, #d4a574)' 
        : siblingStatus === 'adopted'
          ? 'var(--color-info, #7c97b9)'
          : 'var(--color-info, #7c97b9)';
      
      lines.push({
        type: 'sibling',
        fromId: selectedPersonId,
        toId: siblingId,
        x1: siblingIsRight ? selectedPos.x + cardWidth : selectedPos.x,
        y1: selectedCenter.y,
        x2: siblingIsRight ? siblingPos.x : siblingPos.x + cardWidth,
        y2: siblingCenter.y,
        labelX: (selectedCenter.x + siblingCenter.x) / 2,
        labelY: selectedCenter.y + cardHeight / 2 + 15,
        label: `↔ ${Math.round(horizontalDist)}`,
        color: statusColor,
        name: sibling ? `${sibling.firstName}` : 'Sibling',
        status: siblingStatus
      });
    });

    return lines;
  }, [selectedPersonId, immediateFamily, positions, personMap, cardWidth, cardHeight]);

  // Don't render if not visible or no selection
  if (!isVisible || !selectedPersonId) {
    return null;
  }

  const selectedPos = positions[selectedPersonId];
  if (!selectedPos) return null;

  return (
    <g className="dev-aura-overlay">
      {/* Measurement lines */}
      {measurements.map((m, idx) => (
        <g key={`${m.type}-${m.toId}-${idx}`}>
          {/* The measurement line */}
          <line
            x1={m.x1}
            y1={m.y1}
            x2={m.x2}
            y2={m.y2}
            stroke={m.color}
            strokeWidth={2}
            strokeDasharray="6,4"
            opacity={0.8}
          />
          
          {/* Distance label background */}
          <rect
            x={m.labelX - 28}
            y={m.labelY - 10}
            width={56}
            height={20}
            fill="var(--bg-secondary)"
            opacity={0.95}
            rx={4}
          />
          
          {/* Distance label */}
          <text
            x={m.labelX}
            y={m.labelY + 4}
            fill={m.color}
            fontSize="12px"
            fontFamily="monospace"
            fontWeight="bold"
            textAnchor="middle"
          >
            {m.label}
          </text>
          
          {/* Target node indicator circle */}
          <circle
            cx={positions[m.toId].x + cardWidth / 2}
            cy={positions[m.toId].y + cardHeight / 2}
            r={8}
            fill="none"
            stroke={m.color}
            strokeWidth={2}
            opacity={0.5}
          />
        </g>
      ))}

      {/* Selected person coordinate display */}
      <g className="selected-coords">
        {/* Background */}
        <rect
          x={selectedPos.x + cardWidth / 2 - 45}
          y={selectedPos.y + cardHeight + 8}
          width={90}
          height={24}
          fill="var(--bg-primary)"
          stroke="var(--accent-primary, #d4a574)"
          strokeWidth={2}
          rx={4}
          opacity={0.95}
        />
        
        {/* Coordinates text */}
        <text
          x={selectedPos.x + cardWidth / 2}
          y={selectedPos.y + cardHeight + 24}
          fill="var(--accent-primary, #d4a574)"
          fontSize="12px"
          fontFamily="monospace"
          fontWeight="bold"
          textAnchor="middle"
        >
          {Math.round(selectedPos.x)}, {Math.round(selectedPos.y)}
        </text>
      </g>

      {/* Selection highlight ring around the selected card */}
      <rect
        x={selectedPos.x - 4}
        y={selectedPos.y - 4}
        width={cardWidth + 8}
        height={cardHeight + 8}
        fill="none"
        stroke="var(--accent-primary, #d4a574)"
        strokeWidth={2}
        strokeDasharray="8,4"
        rx={10}
        opacity={0.6}
        className="selection-ring"
      />
    </g>
  );
}

export default DevAuraOverlay;
