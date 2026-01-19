// src/components/dev/DevRulePreviewOverlay.jsx
import React, { useMemo } from 'react';
import { calculateRuleBasedPositions } from '../../utils/layoutPatternAnalyser';

/**
 * DEV RULE PREVIEW OVERLAY
 * 
 * Shows ghost/translucent card outlines where the RULES would position
 * each person, overlaid on your MANUAL positions.
 * 
 * PURPOSE:
 * Lets you visually compare "where I put things" vs "where rules would put things"
 * so you can see if your rules accurately capture your manual arrangement.
 * 
 * WHAT IT SHOWS:
 * - Dashed rectangle outlines where rule-based positions would be
 * - Delta labels showing the difference (Δ) between manual and rule positions
 * - Lines connecting manual position to rule position when there's a difference
 * 
 * WHEN TO USE:
 * Toggle on after arranging things manually and defining some rules.
 * If the ghosts line up with your cards, your rules are capturing the pattern.
 * If they don't, adjust your rule values.
 */
function DevRulePreviewOverlay({
  people,
  relationships,
  manualPositions,
  draftRules,
  isVisible = true,
  cardWidth = 150,
  cardHeight = 70
}) {
  // Calculate where rules would put each person
  const rulePositions = useMemo(() => {
    // Only calculate if we have some rules defined
    const hasRules = Object.entries(draftRules).some(([key, value]) => {
      if (value === null) return false;
      if (typeof value === 'object') {
        return Object.values(value).some(v => v !== null);
      }
      return true;
    });
    
    if (!hasRules) return {};
    
    // Use a root position based on the manual positions
    const manualValues = Object.values(manualPositions);
    if (manualValues.length === 0) return {};
    
    // Find the top-left-most manual position as reference
    const avgX = manualValues.reduce((sum, p) => sum + p.x, 0) / manualValues.length;
    const minY = Math.min(...manualValues.map(p => p.y));
    
    return calculateRuleBasedPositions(
      people, 
      relationships, 
      draftRules, 
      { x: avgX, y: minY }
    );
  }, [people, relationships, draftRules, manualPositions]);

  // Don't render if not visible or no rule positions calculated
  if (!isVisible || Object.keys(rulePositions).length === 0) {
    return null;
  }

  // Build comparison data: only for people who have both manual and rule positions
  const comparisons = useMemo(() => {
    const result = [];
    
    Object.entries(rulePositions).forEach(([personId, rulePos]) => {
      const manualPos = manualPositions[personId];
      
      // Only show comparison if there's a manual position
      if (!manualPos) return;
      
      // Calculate difference
      const deltaX = Math.round(rulePos.x - manualPos.x);
      const deltaY = Math.round(rulePos.y - manualPos.y);
      
      // Only show if there's a meaningful difference (> 5px)
      const hasDifference = Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5;
      
      result.push({
        personId: Number(personId),
        manualPos,
        rulePos,
        deltaX,
        deltaY,
        hasDifference,
        // Total distance for sorting
        distance: Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      });
    });
    
    return result;
  }, [rulePositions, manualPositions]);

  return (
    <g className="dev-rule-preview-overlay">
      {comparisons.map(comp => (
        <g key={`ghost-${comp.personId}`}>
          {/* Ghost card outline (where rules would put it) */}
          <rect
            x={comp.rulePos.x}
            y={comp.rulePos.y}
            width={cardWidth}
            height={cardHeight}
            fill="none"
            stroke="var(--accent-primary, #d4a574)"
            strokeWidth={2}
            strokeDasharray="8,4"
            opacity={comp.hasDifference ? 0.7 : 0.3}
            rx={6}
          />
          
          {/* Connecting line from manual to rule position (if different) */}
          {comp.hasDifference && (
            <line
              x1={comp.manualPos.x + cardWidth / 2}
              y1={comp.manualPos.y + cardHeight / 2}
              x2={comp.rulePos.x + cardWidth / 2}
              y2={comp.rulePos.y + cardHeight / 2}
              stroke="var(--accent-primary, #d4a574)"
              strokeWidth={1}
              strokeDasharray="4,4"
              opacity={0.4}
            />
          )}
          
          {/* Delta label (showing the difference) */}
          {comp.hasDifference && (
            <g>
              {/* Background */}
              <rect
                x={comp.rulePos.x + cardWidth / 2 - 30}
                y={comp.rulePos.y - 22}
                width={60}
                height={18}
                fill="var(--bg-secondary)"
                stroke="var(--accent-primary, #d4a574)"
                strokeWidth={1}
                opacity={0.95}
                rx={4}
              />
              
              {/* Delta text */}
              <text
                x={comp.rulePos.x + cardWidth / 2}
                y={comp.rulePos.y - 9}
                fill="var(--accent-primary, #d4a574)"
                fontSize="10px"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
              >
                Δ {comp.deltaX >= 0 ? '+' : ''}{comp.deltaX}, {comp.deltaY >= 0 ? '+' : ''}{comp.deltaY}
              </text>
            </g>
          )}
          
          {/* Match indicator when positions align */}
          {!comp.hasDifference && (
            <text
              x={comp.rulePos.x + cardWidth / 2}
              y={comp.rulePos.y - 8}
              fill="var(--color-success, #7cb97c)"
              fontSize="12px"
              textAnchor="middle"
            >
              ✓
            </text>
          )}
        </g>
      ))}
      
      {/* Summary badge */}
      {comparisons.length > 0 && (
        <g className="preview-summary">
          <rect
            x={10}
            y={10}
            width={160}
            height={50}
            fill="var(--bg-secondary)"
            stroke="var(--accent-primary, #d4a574)"
            strokeWidth={2}
            rx={6}
            opacity={0.95}
          />
          <text
            x={90}
            y={28}
            fill="var(--text-primary)"
            fontSize="11px"
            fontWeight="bold"
            textAnchor="middle"
          >
            👻 Rule Preview
          </text>
          <text
            x={90}
            y={45}
            fill="var(--text-secondary)"
            fontSize="10px"
            textAnchor="middle"
          >
            {comparisons.filter(c => !c.hasDifference).length}/{comparisons.length} positions match
          </text>
        </g>
      )}
    </g>
  );
}

export default DevRulePreviewOverlay;
