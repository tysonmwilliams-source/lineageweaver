// src/hooks/useDevLayout.js
import { useState, useEffect, useCallback, useMemo } from 'react';

const STORAGE_KEY = 'lineageweaver_dev_layout';

/**
 * Custom hook for dev layout mode.
 * 
 * PURPOSE: Enables drag-and-drop positioning of person cards in the family tree
 * so you can manually arrange them, observe the patterns, and then codify those
 * patterns into layout rules.
 * 
 * WORKFLOW:
 * 1. Enable manual mode
 * 2. Drag people around until the layout "looks right"
 * 3. Open Rule Builder to see detected patterns
 * 4. Define rules based on those patterns
 * 5. Toggle preview to compare rules vs manual layout
 * 6. Export final rules as code
 * 
 * STORAGE:
 * - Manual positions and draft rules stored in localStorage for the session
 * - Cleared on browser close unless explicitly exported
 * - Never touches your actual IndexedDB/Firestore data
 * 
 * @param {Object} algorithmPositions - Positions calculated by D3 tree layout: { personId: { x, y } }
 * @returns {Object} Dev layout state and controls
 */
export function useDevLayout(algorithmPositions = {}) {
  // --------------------
  // State
  // --------------------
  
  // 'algorithm' = normal tree behavior, 'manual' = drag-to-position enabled
  const [mode, setMode] = useState('algorithm');
  
  // Manual position overrides: { personId: { x, y } }
  const [manualPositions, setManualPositions] = useState({});
  
  // Draft rules being tested
  const [draftRules, setDraftRules] = useState({
    generationHeight: null,
    siblingSpacing: null,
    spouseSpacing: null,
    bastardOffset: { horizontal: null, vertical: null, position: 'end' },
    adoptedOffset: { horizontal: null, vertical: null, position: 'end' },
    familyUnitGap: null,
  });
  
  // Whether to show the ghost overlay of rule-based positions
  const [showRulePreview, setShowRulePreview] = useState(false);
  
  // Currently dragging person (for aura overlay)
  const [draggingPersonId, setDraggingPersonId] = useState(null);
  
  // Selected person (for aura overlay when not dragging)
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  
  // Track if we've loaded from localStorage
  const [isInitialized, setIsInitialized] = useState(false);

  // --------------------
  // localStorage sync
  // --------------------
  
  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setMode(parsed.mode || 'algorithm');
        setManualPositions(parsed.positions || {});
        setDraftRules(prev => ({ ...prev, ...parsed.draftRules }));
        console.log('🛠️ Dev layout loaded from localStorage:', {
          mode: parsed.mode,
          positionCount: Object.keys(parsed.positions || {}).length
        });
      }
    } catch (error) {
      console.warn('Failed to load dev layout from localStorage:', error);
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (!isInitialized) return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        mode,
        positions: manualPositions,
        draftRules,
        lastModified: new Date().toISOString()
      }));
    } catch (error) {
      console.warn('Failed to save dev layout to localStorage:', error);
    }
  }, [mode, manualPositions, draftRules, isInitialized]);

  // --------------------
  // Position management
  // --------------------
  
  /**
   * Get the effective position for a person.
   * In manual mode, returns manual position if set, otherwise algorithm position.
   * In algorithm mode, always returns algorithm position.
   */
  const getPosition = useCallback((personId) => {
    if (mode === 'algorithm') {
      return algorithmPositions[personId] || { x: 0, y: 0 };
    }
    return manualPositions[personId] || algorithmPositions[personId] || { x: 0, y: 0 };
  }, [mode, manualPositions, algorithmPositions]);

  /**
   * Update position for a single person (only works in manual mode)
   */
  const setPosition = useCallback((personId, x, y) => {
    if (mode !== 'manual') return;
    setManualPositions(prev => ({
      ...prev,
      [personId]: { x: Math.round(x), y: Math.round(y) }
    }));
  }, [mode]);

  /**
   * Update positions for multiple people at once.
   * Used for spouse-together and shift+family-unit dragging.
   * @param {Object} updates - { personId: { x, y }, ... }
   */
  const setPositions = useCallback((updates) => {
    if (mode !== 'manual') return;
    const rounded = {};
    Object.entries(updates).forEach(([id, pos]) => {
      rounded[id] = { x: Math.round(pos.x), y: Math.round(pos.y) };
    });
    setManualPositions(prev => ({ ...prev, ...rounded }));
  }, [mode]);

  /**
   * Calculate the delta (offset) from algorithm position.
   * Useful for seeing "how far did I move this from where the algorithm put it?"
   */
  const getDelta = useCallback((personId) => {
    const algo = algorithmPositions[personId] || { x: 0, y: 0 };
    const manual = manualPositions[personId];
    if (!manual) return { deltaX: 0, deltaY: 0 };
    return {
      deltaX: Math.round(manual.x - algo.x),
      deltaY: Math.round(manual.y - algo.y)
    };
  }, [algorithmPositions, manualPositions]);

  // --------------------
  // Rule management
  // --------------------
  
  /**
   * Update a top-level rule value (e.g., generationHeight, siblingSpacing)
   */
  const updateRule = useCallback((ruleName, value) => {
    setDraftRules(prev => ({
      ...prev,
      [ruleName]: value
    }));
  }, []);

  /**
   * Update a nested rule value (e.g., bastardOffset.horizontal)
   */
  const updateNestedRule = useCallback((ruleName, field, value) => {
    setDraftRules(prev => ({
      ...prev,
      [ruleName]: {
        ...prev[ruleName],
        [field]: value
      }
    }));
  }, []);

  // --------------------
  // Mode controls
  // --------------------
  
  const toggleMode = useCallback(() => {
    setMode(prev => {
      const newMode = prev === 'algorithm' ? 'manual' : 'algorithm';
      console.log(`🛠️ Dev layout mode: ${newMode}`);
      return newMode;
    });
  }, []);

  const resetAllPositions = useCallback(() => {
    setManualPositions({});
    console.log('🛠️ All manual positions reset');
  }, []);

  const resetPosition = useCallback((personId) => {
    setManualPositions(prev => {
      const next = { ...prev };
      delete next[personId];
      return next;
    });
  }, []);

  /**
   * Clear entire session - positions, rules, everything
   */
  const clearSession = useCallback(() => {
    setManualPositions({});
    setDraftRules({
      generationHeight: null,
      siblingSpacing: null,
      spouseSpacing: null,
      bastardOffset: { horizontal: null, vertical: null, position: 'end' },
      adoptedOffset: { horizontal: null, vertical: null, position: 'end' },
      familyUnitGap: null,
    });
    setShowRulePreview(false);
    setDraggingPersonId(null);
    setSelectedPersonId(null);
    localStorage.removeItem(STORAGE_KEY);
    console.log('🛠️ Dev layout session cleared');
  }, []);

  // --------------------
  // Export
  // --------------------
  
  /**
   * Export rules in specified format.
   * @param {'javascript' | 'json'} format - Export format
   * @returns {string} Formatted rules string
   */
  const exportRules = useCallback((format = 'javascript') => {
    // Build clean rules object (remove nulls)
    const rules = {};
    
    if (draftRules.generationHeight !== null) {
      rules.generationHeight = draftRules.generationHeight;
    }
    if (draftRules.siblingSpacing !== null) {
      rules.siblingSpacing = draftRules.siblingSpacing;
    }
    if (draftRules.spouseSpacing !== null) {
      rules.spouseSpacing = draftRules.spouseSpacing;
    }
    
    // Bastard offset
    const bastard = draftRules.bastardOffset || {};
    if (bastard.horizontal !== null || bastard.vertical !== null) {
      rules.bastardOffset = {};
      if (bastard.horizontal !== null) rules.bastardOffset.horizontal = bastard.horizontal;
      if (bastard.vertical !== null) rules.bastardOffset.vertical = bastard.vertical;
      if (bastard.position) rules.bastardOffset.position = bastard.position;
    }
    
    // Adopted offset
    const adopted = draftRules.adoptedOffset || {};
    if (adopted.horizontal !== null || adopted.vertical !== null) {
      rules.adoptedOffset = {};
      if (adopted.horizontal !== null) rules.adoptedOffset.horizontal = adopted.horizontal;
      if (adopted.vertical !== null) rules.adoptedOffset.vertical = adopted.vertical;
      if (adopted.position) rules.adoptedOffset.position = adopted.position;
    }

    // Family unit gap
    if (draftRules.familyUnitGap !== null) {
      rules.familyUnitGap = draftRules.familyUnitGap;
    }

    if (format === 'json') {
      const output = JSON.stringify(rules, null, 2);
      console.log('=== LAYOUT RULES (JSON) ===\n', output);
      return output;
    }

    // JavaScript format
    const lines = [
      '// Tree Layout Rules',
      `// Generated: ${new Date().toISOString()}`,
      '// From manual positioning in Dev Layout Mode',
      '',
      'export const TREE_LAYOUT_RULES = {'
    ];

    if (rules.generationHeight !== undefined) {
      lines.push(`  // Vertical distance between parent and child generations`);
      lines.push(`  generationHeight: ${rules.generationHeight},`);
      lines.push('');
    }
    if (rules.siblingSpacing !== undefined) {
      lines.push(`  // Horizontal distance between adjacent siblings`);
      lines.push(`  siblingSpacing: ${rules.siblingSpacing},`);
      lines.push('');
    }
    if (rules.spouseSpacing !== undefined) {
      lines.push(`  // Horizontal distance between married partners`);
      lines.push(`  spouseSpacing: ${rules.spouseSpacing},`);
      lines.push('');
    }
    if (rules.bastardOffset) {
      lines.push(`  // Offset for bastard children relative to legitimate siblings`);
      lines.push('  bastardOffset: {');
      if (rules.bastardOffset.horizontal !== undefined) {
        lines.push(`    horizontal: ${rules.bastardOffset.horizontal},`);
      }
      if (rules.bastardOffset.vertical !== undefined) {
        lines.push(`    vertical: ${rules.bastardOffset.vertical},`);
      }
      if (rules.bastardOffset.position) {
        lines.push(`    position: '${rules.bastardOffset.position}', // 'afterLegitimate' | 'end'`);
      }
      lines.push('  },');
      lines.push('');
    }
    if (rules.adoptedOffset) {
      lines.push(`  // Offset for adopted children relative to legitimate siblings`);
      lines.push('  adoptedOffset: {');
      if (rules.adoptedOffset.horizontal !== undefined) {
        lines.push(`    horizontal: ${rules.adoptedOffset.horizontal},`);
      }
      if (rules.adoptedOffset.vertical !== undefined) {
        lines.push(`    vertical: ${rules.adoptedOffset.vertical},`);
      }
      if (rules.adoptedOffset.position) {
        lines.push(`    position: '${rules.adoptedOffset.position}', // 'afterLegitimate' | 'end'`);
      }
      lines.push('  },');
      lines.push('');
    }
    if (rules.familyUnitGap !== undefined) {
      lines.push(`  // Minimum gap between sibling family bounding boxes`);
      lines.push(`  familyUnitGap: ${rules.familyUnitGap},`);
      lines.push('');
    }

    lines.push('};');

    const output = lines.join('\n');
    console.log('=== LAYOUT RULES (JavaScript) ===\n', output);
    return output;
  }, [draftRules]);

  // --------------------
  // Computed values
  // --------------------
  
  /**
   * Effective positions map - what should actually be rendered.
   * In algorithm mode: just algorithm positions
   * In manual mode: algorithm with manual overrides
   */
  const effectivePositions = useMemo(() => {
    if (mode === 'algorithm') return algorithmPositions;
    return { ...algorithmPositions, ...manualPositions };
  }, [mode, algorithmPositions, manualPositions]);

  const isManualMode = mode === 'manual';
  const hasOverrides = Object.keys(manualPositions).length > 0;
  const overrideCount = Object.keys(manualPositions).length;

  // Person ID for aura display (dragging takes priority)
  const auraPersonId = draggingPersonId || selectedPersonId;

  // --------------------
  // Return
  // --------------------
  
  return {
    // State
    mode,
    isManualMode,
    isInitialized,
    hasOverrides,
    overrideCount,
    
    // Positions
    effectivePositions,
    manualPositions,
    algorithmPositions,
    getPosition,
    setPosition,
    setPositions,
    getDelta,
    
    // Drag/selection tracking
    draggingPersonId,
    setDraggingPersonId,
    selectedPersonId,
    setSelectedPersonId,
    auraPersonId,
    
    // Rules
    draftRules,
    updateRule,
    updateNestedRule,
    showRulePreview,
    setShowRulePreview,
    
    // Controls
    toggleMode,
    resetAllPositions,
    resetPosition,
    clearSession,
    exportRules
  };
}

export default useDevLayout;
