# Dev Layout Mode - Integration Guide

This guide explains how to integrate the dev layout tools into your FamilyTree.jsx component.

## Files Created

| File | Purpose |
|------|---------|
| `src/hooks/useDevLayout.js` | State management for positions, rules, and mode |
| `src/utils/layoutPatternAnalyser.js` | Analyses positions to detect patterns |
| `src/components/dev/DevModeToggle.jsx` | Corner toggle for algorithm/manual mode |
| `src/components/dev/DevAuraOverlay.jsx` | SVG measurement lines to immediate family |
| `src/components/dev/RuleBuilderPanel.jsx` | Slide-out panel for pattern analysis & rules |
| `src/components/dev/DevRulePreviewOverlay.jsx` | Ghost overlay showing rule-based positions |
| `src/components/dev/index.js` | Barrel exports |

## Integration Steps

### Step 1: Add Imports to FamilyTree.jsx

Add these imports near the top of the file:

```jsx
// Dev layout tools
import { useDevLayout } from '../hooks/useDevLayout';
import { 
  DevModeToggle, 
  DevAuraOverlay, 
  RuleBuilderPanel, 
  DevRulePreviewOverlay 
} from '../components/dev';
```

### Step 2: Add State for Rule Builder Panel

Inside the component, add state for the panel visibility:

```jsx
// Dev layout panel visibility
const [ruleBuilderOpen, setRuleBuilderOpen] = useState(false);
```

### Step 3: Build Algorithm Positions Map

After your tree calculates positions (in the `drawTree` function), you need to capture
those positions for the dev layout hook. Add this near the end of `drawTree`, after
all cards are drawn:

```jsx
// Inside drawTree(), after all positionMap.set() calls:

// Build algorithm positions object for dev layout
const algorithmPositionsObj = {};
positionMap.forEach((pos, personId) => {
  algorithmPositionsObj[personId] = { x: pos.x, y: pos.y };
});

// Store in a ref so the hook can access it
algorithmPositionsRef.current = algorithmPositionsObj;
```

You'll need to add a ref at the top of the component:

```jsx
const algorithmPositionsRef = useRef({});
```

### Step 4: Initialize the Dev Layout Hook

Add the hook after your other hooks:

```jsx
// Dev layout hook - must be after algorithmPositionsRef is defined
const {
  mode,
  isManualMode,
  hasOverrides,
  overrideCount,
  effectivePositions,
  manualPositions,
  getPosition,
  setPosition,
  setPositions,
  getDelta,
  draggingPersonId,
  setDraggingPersonId,
  selectedPersonId,
  setSelectedPersonId,
  auraPersonId,
  draftRules,
  updateRule,
  updateNestedRule,
  showRulePreview,
  setShowRulePreview,
  toggleMode,
  resetAllPositions,
  clearSession,
  exportRules
} = useDevLayout(algorithmPositionsRef.current);
```

### Step 5: Modify D3 Drag Behavior

In your `drawTree` function, find where you draw person cards and add drag behavior.
Currently your cards have click handlers. You need to add drag support:

```jsx
// After creating the card group, add drag behavior if in manual mode
if (isManualMode) {
  const drag = d3.drag()
    .on('start', function(event) {
      setDraggingPersonId(person.id);
      d3.select(this).raise(); // Bring to front
    })
    .on('drag', function(event) {
      const newX = event.x;
      const newY = event.y;
      
      // Move the card visually
      d3.select(this).attr('transform', `translate(${newX}, ${newY})`);
      
      // Update position in hook (for real-time aura updates)
      setPosition(person.id, newX, newY);
    })
    .on('end', function(event) {
      setDraggingPersonId(null);
      // Position is already saved in the drag handler
    });
  
  card.call(drag);
  card.style('cursor', 'grab');
}
```

### Step 6: Use Effective Positions for Card Placement

Instead of always using algorithm-calculated positions, check the dev layout:

```jsx
// When positioning a card, use effective position if in manual mode
const effectivePos = effectivePositions[person.id];
const finalX = effectivePos ? effectivePos.x : calculatedX;
const finalY = effectivePos ? effectivePos.y : calculatedY;

const card = g.append('g')
  .attr('class', 'person-card')
  .attr('transform', `translate(${finalX}, ${finalY})`)
  // ... rest of card setup
```

### Step 7: Add UI Components

Add these components to your JSX return, outside the SVG:

```jsx
{/* Dev Mode Toggle - floating in corner */}
<DevModeToggle
  isManualMode={isManualMode}
  onToggle={toggleMode}
  onOpenRuleBuilder={() => setRuleBuilderOpen(true)}
  hasOverrides={hasOverrides}
  overrideCount={overrideCount}
  isDarkTheme={isDarkTheme()}
/>

{/* Rule Builder Panel - slides in from right */}
<RuleBuilderPanel
  isOpen={ruleBuilderOpen}
  onClose={() => setRuleBuilderOpen(false)}
  people={people}
  positions={manualPositions}
  relationships={relationships}
  draftRules={draftRules}
  onUpdateRule={updateRule}
  onUpdateNestedRule={updateNestedRule}
  showRulePreview={showRulePreview}
  onToggleRulePreview={setShowRulePreview}
  onExportRules={exportRules}
  onResetPositions={resetAllPositions}
  onClearSession={clearSession}
  isDarkTheme={isDarkTheme()}
/>
```

### Step 8: Add SVG Overlays

The SVG overlays need to be rendered inside your D3 visualization. Since you're using
D3 to build the SVG imperatively, you'll need to add these as D3 elements.

Here's how to add them at the end of your `drawTree` function:

```jsx
// At the end of drawTree(), after all cards and lines are drawn:

// Add aura overlay group
if (isManualMode && auraPersonId) {
  const auraGroup = g.append('g').attr('class', 'dev-aura-overlay');
  
  // Get immediate family
  const family = getImmediateFamily(auraPersonId, relationships);
  const selectedPos = positionMap.get(auraPersonId);
  
  if (selectedPos) {
    // Draw measurement lines to parents
    family.parents.forEach(parentId => {
      const parentPos = positionMap.get(parentId);
      if (parentPos) {
        const dist = Math.round(Math.abs(selectedPos.y - parentPos.y));
        // Vertical line
        auraGroup.append('line')
          .attr('x1', selectedPos.x + CARD_WIDTH/2)
          .attr('y1', selectedPos.y)
          .attr('x2', selectedPos.x + CARD_WIDTH/2)
          .attr('y2', parentPos.y + CARD_HEIGHT)
          .attr('stroke', 'var(--color-success)')
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '6,4')
          .attr('opacity', 0.8);
        // Distance label
        auraGroup.append('text')
          .attr('x', selectedPos.x + CARD_WIDTH/2 + 20)
          .attr('y', (selectedPos.y + parentPos.y + CARD_HEIGHT) / 2)
          .attr('fill', 'var(--color-success)')
          .attr('font-size', '12px')
          .attr('font-family', 'monospace')
          .text(`↕ ${dist}`);
      }
    });
    
    // Similar for siblings, spouse, children...
    // (See DevAuraOverlay.jsx for full implementation)
    
    // Coordinate display under selected card
    auraGroup.append('rect')
      .attr('x', selectedPos.x + CARD_WIDTH/2 - 45)
      .attr('y', selectedPos.y + CARD_HEIGHT + 8)
      .attr('width', 90)
      .attr('height', 24)
      .attr('fill', 'var(--bg-primary)')
      .attr('stroke', 'var(--accent-primary)')
      .attr('stroke-width', 2)
      .attr('rx', 4);
    
    auraGroup.append('text')
      .attr('x', selectedPos.x + CARD_WIDTH/2)
      .attr('y', selectedPos.y + CARD_HEIGHT + 24)
      .attr('fill', 'var(--accent-primary)')
      .attr('font-size', '12px')
      .attr('font-family', 'monospace')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'middle')
      .text(`${Math.round(selectedPos.x)}, ${Math.round(selectedPos.y)}`);
  }
}
```

## Alternative: React-Based SVG Overlays

If you prefer to use React components for the overlays instead of D3, you can
render them as a separate SVG layer on top of your D3 SVG:

```jsx
{/* Main D3 SVG */}
<svg ref={svgRef} className="tree-svg"></svg>

{/* React overlay SVG - positioned absolutely on top */}
{isManualMode && (
  <svg 
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none' // Let clicks pass through to D3 SVG
    }}
  >
    <g transform={/* same transform as D3 zoom group */}>
      <DevAuraOverlay
        selectedPersonId={auraPersonId}
        people={people}
        positions={effectivePositions}
        relationships={relationships}
        isVisible={isManualMode}
        cardWidth={CARD_WIDTH}
        cardHeight={CARD_HEIGHT}
      />
      
      {showRulePreview && (
        <DevRulePreviewOverlay
          people={people}
          relationships={relationships}
          manualPositions={manualPositions}
          draftRules={draftRules}
          isVisible={showRulePreview}
          cardWidth={CARD_WIDTH}
          cardHeight={CARD_HEIGHT}
        />
      )}
    </g>
  </svg>
)}
```

This approach requires syncing the transform, but keeps the React components intact.

## Spouse-Together Dragging

To make spouses move together when you drag one:

```jsx
const drag = d3.drag()
  .on('start', function(event) {
    const spouseId = spouseMap.get(person.id);
    // Store starting positions
    dragStartRef.current = {
      personId: person.id,
      spouseId: spouseId,
      personStart: { x: event.x, y: event.y },
      spouseStart: spouseId ? positionMap.get(spouseId) : null
    };
    setDraggingPersonId(person.id);
  })
  .on('drag', function(event) {
    const { spouseId, personStart, spouseStart } = dragStartRef.current;
    const deltaX = event.x - personStart.x;
    const deltaY = event.y - personStart.y;
    
    // Move person
    d3.select(this).attr('transform', `translate(${event.x}, ${event.y})`);
    setPosition(person.id, event.x, event.y);
    
    // Move spouse by same delta
    if (spouseId && spouseStart) {
      const newSpouseX = spouseStart.x + deltaX;
      const newSpouseY = spouseStart.y + deltaY;
      
      // Find and move spouse card
      g.selectAll('.person-card')
        .filter(function() {
          return d3.select(this).datum()?.id === spouseId;
        })
        .attr('transform', `translate(${newSpouseX}, ${newSpouseY})`);
      
      setPosition(spouseId, newSpouseX, newSpouseY);
    }
  })
  .on('end', function() {
    dragStartRef.current = null;
    setDraggingPersonId(null);
  });
```

## Shift+Drag for Family Units

To move entire family units with Shift held:

```jsx
// Track shift key
const [isShiftHeld, setIsShiftHeld] = useState(false);

useEffect(() => {
  const handleKeyDown = (e) => { if (e.key === 'Shift') setIsShiftHeld(true); };
  const handleKeyUp = (e) => { if (e.key === 'Shift') setIsShiftHeld(false); };
  
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  };
}, []);

// In drag handler:
.on('start', function(event) {
  if (isShiftHeld) {
    // Get all family unit IDs (person + spouse + children)
    const familyIds = getFamilyUnitIds(person.id, spouseMap, childrenMap);
    // Store all starting positions...
  }
})
```

## Summary

The integration requires:

1. **Imports** - Hook and components
2. **State** - Panel visibility, shift key tracking
3. **Ref** - Store algorithm positions
4. **Hook** - useDevLayout with algorithm positions
5. **D3 Drag** - Add drag behavior to cards in manual mode
6. **Position Override** - Use effective positions when placing cards
7. **UI Components** - DevModeToggle and RuleBuilderPanel
8. **SVG Overlays** - Aura and preview overlays (D3 or React approach)

The most complex part is integrating the drag behavior with your existing D3 code,
particularly for spouse-together and family-unit dragging. Start with basic
single-card dragging first, then add the relationship-aware features.
