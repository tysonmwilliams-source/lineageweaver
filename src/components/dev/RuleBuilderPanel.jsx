// src/components/dev/RuleBuilderPanel.jsx
import React, { useMemo, useState } from 'react';
import { analyseLayoutPatterns, analyseFamilyUnitSpacing } from '../../utils/layoutPatternAnalyser';

/**
 * RULE BUILDER PANEL
 * 
 * Slide-out panel for analysing layout patterns and defining rules.
 * This is the heart of the dev layout tool - where you turn observations
 * from manual positioning into codified rules.
 * 
 * THREE SECTIONS:
 * 
 * 1. PATTERN ANALYSIS
 *    - Automatically analyses your manual positions
 *    - Shows statistics: min, max, average, consistency
 *    - Updates in real-time as you drag
 * 
 * 2. RULE DEFINITION
 *    - Input fields for each rule type
 *    - "Use observed" buttons to apply detected averages
 *    - Preview toggle to see rule-based positioning as ghosts
 * 
 * 3. EXPORT
 *    - Generate JavaScript or JSON output
 *    - Copy to clipboard
 *    - Clear session
 */
function RuleBuilderPanel({
  isOpen,
  onClose,
  people,
  positions,
  relationships,
  draftRules,
  onUpdateRule,
  onUpdateNestedRule,
  showRulePreview,
  onToggleRulePreview,
  onExportRules,
  onResetPositions,
  onClearSession,
  isDarkTheme
}) {
  const [exportFormat, setExportFormat] = useState('javascript');
  const [exportedCode, setExportedCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [showFamilyUnitDetails, setShowFamilyUnitDetails] = useState(false);

  // Analyse current manual layout
  const analysis = useMemo(() => {
    if (Object.keys(positions).length === 0) return null;
    return analyseLayoutPatterns(people, positions, relationships);
  }, [people, positions, relationships]);

  // Analyse family unit spacing (bounding box gaps between sibling families)
  const familyUnitAnalysis = useMemo(() => {
    if (Object.keys(positions).length === 0) return null;
    return analyseFamilyUnitSpacing(people, positions, relationships);
  }, [people, positions, relationships]);

  // Handle export
  const handleExport = () => {
    const code = onExportRules(exportFormat);
    setExportedCode(code);
  };

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportedCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!isOpen) return null;

  // Inline styles using CSS custom properties for theming
  const panelStyle = {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: '420px',
    backgroundColor: 'var(--bg-secondary)',
    borderLeft: '2px solid var(--border-primary)',
    boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.3)',
    zIndex: 1001,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'var(--font-body, Georgia, serif)',
    transition: 'transform 0.3s ease'
  };

  const headerStyle = {
    padding: '16px 20px',
    borderBottom: '1px solid var(--border-secondary)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'var(--bg-tertiary)'
  };

  const sectionHeaderStyle = {
    color: 'var(--text-primary)',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '12px',
    borderBottom: '1px solid var(--border-secondary)',
    paddingBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  return (
    <div style={panelStyle}>
      {/* ════════════════════════════════════════════════════════════════════
          HEADER
          ════════════════════════════════════════════════════════════════════ */}
      <div style={headerStyle}>
        <h2 style={{ 
          margin: 0, 
          color: 'var(--text-primary)',
          fontSize: '18px',
          fontFamily: 'var(--font-display, Cinzel, serif)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>📐</span>
          Rule Builder
        </h2>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '0 4px',
            lineHeight: 1
          }}
          title="Close panel"
        >
          ×
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          SCROLLABLE CONTENT
          ════════════════════════════════════════════════════════════════════ */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        
        {/* ──────────────────────────────────────────────────────────────────
            SECTION 1: PATTERN ANALYSIS
            ────────────────────────────────────────────────────────────────── */}
        <section style={{ marginBottom: '24px' }}>
          <h3 style={sectionHeaderStyle}>
            <span>📊</span>
            Observed Patterns
          </h3>
          
          {!analysis || analysis.summary.totalPeoplePositioned === 0 ? (
            <p style={{ 
              color: 'var(--text-tertiary)', 
              fontStyle: 'italic',
              padding: '12px',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              Drag some people around to see patterns emerge...
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PatternCard 
                label="Generation Height" 
                stats={analysis.generationHeight}
                description="Vertical distance between parent and child rows"
              />
              <PatternCard 
                label="Sibling Spacing" 
                stats={analysis.siblingSpacing}
                description="Horizontal distance between adjacent siblings"
              />
              <PatternCard 
                label="Spouse Spacing" 
                stats={analysis.spouseSpacing}
                description="Horizontal distance between married partners"
              />
              {analysis.bastardOffset.horizontal.count > 0 && (
                <PatternCard 
                  label="Bastard Offset" 
                  stats={analysis.bastardOffset.horizontal}
                  description="Horizontal offset of bastards from legitimate siblings"
                  showSign={true}
                />
              )}
              {analysis.adoptedOffset.horizontal.count > 0 && (
                <PatternCard
                  label="Adopted Offset"
                  stats={analysis.adoptedOffset.horizontal}
                  description="Horizontal offset of adopted children"
                  showSign={true}
                />
              )}

              {/* Family Unit Gap - Highlighted as key metric */}
              {familyUnitAnalysis?.overall?.count > 0 && (
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: 'var(--bg-primary)',
                    borderRadius: '6px',
                    border: '2px solid var(--accent-primary, #d4a574)'
                  }}
                >
                  {/* Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <span style={{
                      fontWeight: 'bold',
                      color: 'var(--accent-primary, #d4a574)',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span>📦</span>
                      Family Unit Gap
                    </span>
                    <span style={{
                      fontSize: '11px',
                      color: familyUnitAnalysis.overall.consistency >= 80
                        ? 'var(--color-success, #7cb97c)'
                        : familyUnitAnalysis.overall.consistency >= 50
                          ? 'var(--color-warning, #d4a574)'
                          : 'var(--color-error, #b97c7c)',
                      fontWeight: 'bold'
                    }}>
                      {familyUnitAnalysis.overall.consistency}% consistent
                    </span>
                  </div>

                  {/* Stats row */}
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    marginBottom: '8px'
                  }}>
                    <span>
                      Min: <strong style={{
                        color: familyUnitAnalysis.overall.min < 0 ? 'var(--color-error, #b97c7c)' : 'var(--text-primary)'
                      }}>
                        {familyUnitAnalysis.overall.min}px
                      </strong>
                    </span>
                    <span>
                      Max: <strong style={{ color: 'var(--text-primary)' }}>
                        {familyUnitAnalysis.overall.max}px
                      </strong>
                    </span>
                    <span>
                      Avg: <strong style={{ color: 'var(--accent-primary, #d4a574)' }}>
                        {familyUnitAnalysis.overall.avg}px
                      </strong>
                    </span>
                  </div>

                  {/* Description */}
                  <div style={{
                    fontSize: '11px',
                    color: 'var(--text-tertiary)',
                    marginBottom: '8px'
                  }}>
                    Horizontal gap between sibling family bounding boxes
                  </div>

                  {/* Expand/collapse details */}
                  <button
                    onClick={() => setShowFamilyUnitDetails(!showFamilyUnitDetails)}
                    style={{
                      background: 'none',
                      border: '1px solid var(--border-secondary)',
                      borderRadius: '4px',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '11px',
                      padding: '4px 8px',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    {showFamilyUnitDetails ? '▲ Hide Details' : '▼ Show Details'}
                  </button>

                  {/* Expanded details */}
                  {showFamilyUnitDetails && (
                    <div style={{ marginTop: '10px' }}>
                      {/* Category breakdown */}
                      {familyUnitAnalysis.byCategory && Object.keys(familyUnitAnalysis.byCategory).length > 0 && (
                        <div style={{ marginBottom: '10px' }}>
                          <div style={{
                            fontSize: '11px',
                            color: 'var(--text-secondary)',
                            marginBottom: '6px',
                            fontWeight: 'bold'
                          }}>
                            By Category:
                          </div>
                          {Object.entries(familyUnitAnalysis.byCategory).map(([category, stats]) => (
                            <div key={category} style={{
                              fontSize: '11px',
                              color: 'var(--text-tertiary)',
                              marginBottom: '4px',
                              paddingLeft: '8px',
                              display: 'flex',
                              justifyContent: 'space-between'
                            }}>
                              <span>{category.replace(/-/g, ' ')}</span>
                              <span>
                                avg: <strong style={{ color: 'var(--text-primary)' }}>{stats.avg}px</strong>
                                {' '}({stats.count} gaps)
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Individual measurements */}
                      <div style={{
                        fontSize: '11px',
                        color: 'var(--text-secondary)',
                        marginBottom: '6px',
                        fontWeight: 'bold'
                      }}>
                        Individual Gaps:
                      </div>
                      <div style={{
                        maxHeight: '150px',
                        overflowY: 'auto',
                        fontSize: '10px',
                        fontFamily: 'monospace'
                      }}>
                        {familyUnitAnalysis.familyUnitGaps.map((gap, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: '4px 6px',
                              backgroundColor: gap.gap < 0
                                ? 'rgba(185, 124, 124, 0.1)'
                                : idx % 2 === 0
                                  ? 'var(--bg-tertiary)'
                                  : 'transparent',
                              borderRadius: '3px',
                              marginBottom: '2px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              color: gap.gap < 0 ? 'var(--color-error, #b97c7c)' : 'var(--text-tertiary)'
                            }}
                          >
                            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {gap.leftPersonName} ↔ {gap.rightPersonName}
                            </span>
                            <strong style={{
                              color: gap.gap < 0 ? 'var(--color-error, #b97c7c)' : 'var(--text-primary)',
                              marginLeft: '8px'
                            }}>
                              {gap.gap}px
                            </strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Summary */}
              <div style={{
                fontSize: '11px',
                color: 'var(--text-tertiary)',
                marginTop: '8px',
                padding: '8px',
                backgroundColor: 'var(--bg-primary)',
                borderRadius: '4px'
              }}>
                <strong>Analysed:</strong> {analysis.summary.parentChildPairs} parent-child, {' '}
                {analysis.summary.siblingPairs} sibling, {' '}
                {analysis.summary.spousePairs} spouse pairs
                {familyUnitAnalysis?.summary && (
                  <>, {familyUnitAnalysis.summary.totalGaps} family unit gaps</>
                )}
              </div>
            </div>
          )}
        </section>

        {/* ──────────────────────────────────────────────────────────────────
            SECTION 2: RULE DEFINITION
            ────────────────────────────────────────────────────────────────── */}
        <section style={{ marginBottom: '24px' }}>
          <h3 style={sectionHeaderStyle}>
            <span>📐</span>
            Define Rules
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <RuleInput
              label="Generation Height"
              value={draftRules.generationHeight}
              onChange={(v) => onUpdateRule('generationHeight', v)}
              observed={analysis?.generationHeight?.avg}
              unit="px"
              description="Vertical distance between generations"
            />
            
            <RuleInput
              label="Sibling Spacing"
              value={draftRules.siblingSpacing}
              onChange={(v) => onUpdateRule('siblingSpacing', v)}
              observed={analysis?.siblingSpacing?.avg}
              unit="px"
              description="Horizontal gap between siblings"
            />
            
            <RuleInput
              label="Spouse Spacing"
              value={draftRules.spouseSpacing}
              onChange={(v) => onUpdateRule('spouseSpacing', v)}
              observed={analysis?.spouseSpacing?.avg}
              unit="px"
              description="Horizontal gap between spouses"
            />

            {/* Bastard Offset Group */}
            <div style={{ 
              padding: '12px',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '6px',
              border: '1px solid var(--border-secondary)'
            }}>
              <div style={{ 
                fontSize: '13px', 
                fontWeight: 'bold',
                color: 'var(--text-primary)',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ 
                  width: '12px', 
                  height: '12px', 
                  backgroundColor: 'var(--color-warning, #d4a574)',
                  borderRadius: '2px',
                  display: 'inline-block'
                }}></span>
                Bastard Offset
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <RuleInput
                  label="Horizontal"
                  value={draftRules.bastardOffset?.horizontal}
                  onChange={(v) => onUpdateNestedRule('bastardOffset', 'horizontal', v)}
                  observed={analysis?.bastardOffset?.horizontal?.avg}
                  unit="px"
                  compact
                />
                <RuleInput
                  label="Vertical"
                  value={draftRules.bastardOffset?.vertical}
                  onChange={(v) => onUpdateNestedRule('bastardOffset', 'vertical', v)}
                  observed={analysis?.bastardOffset?.vertical?.avg}
                  unit="px"
                  compact
                />
              </div>
            </div>

            {/* Adopted Offset Group */}
            <div style={{
              padding: '12px',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '6px',
              border: '1px solid var(--border-secondary)'
            }}>
              <div style={{
                fontSize: '13px',
                fontWeight: 'bold',
                color: 'var(--text-primary)',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: 'var(--color-info, #7c97b9)',
                  borderRadius: '2px',
                  display: 'inline-block'
                }}></span>
                Adopted Offset
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <RuleInput
                  label="Horizontal"
                  value={draftRules.adoptedOffset?.horizontal}
                  onChange={(v) => onUpdateNestedRule('adoptedOffset', 'horizontal', v)}
                  observed={analysis?.adoptedOffset?.horizontal?.avg}
                  unit="px"
                  compact
                />
                <RuleInput
                  label="Vertical"
                  value={draftRules.adoptedOffset?.vertical}
                  onChange={(v) => onUpdateNestedRule('adoptedOffset', 'vertical', v)}
                  observed={analysis?.adoptedOffset?.vertical?.avg}
                  unit="px"
                  compact
                />
              </div>
            </div>

            {/* Family Unit Gap Rule - Highlighted as key metric */}
            <div style={{
              padding: '12px',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '6px',
              border: '2px solid var(--accent-primary, #d4a574)'
            }}>
              <div style={{
                fontSize: '13px',
                fontWeight: 'bold',
                color: 'var(--accent-primary, #d4a574)',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>📦</span>
                Family Unit Gap
              </div>
              <RuleInput
                label="Gap between family bounding boxes"
                value={draftRules.familyUnitGap}
                onChange={(v) => onUpdateRule('familyUnitGap', v)}
                observed={familyUnitAnalysis?.overall?.avg}
                unit="px"
                description="Minimum horizontal gap between sibling families to prevent overlap"
              />
            </div>
          </div>

          {/* Preview toggle */}
          <div style={{ marginTop: '16px' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              fontSize: '13px',
              padding: '8px',
              backgroundColor: showRulePreview ? 'var(--accent-primary-transparent, rgba(212, 165, 116, 0.1))' : 'transparent',
              borderRadius: '6px',
              border: `1px solid ${showRulePreview ? 'var(--accent-primary, #d4a574)' : 'var(--border-secondary)'}`,
              transition: 'all 0.15s ease'
            }}>
              <input
                type="checkbox"
                checked={showRulePreview}
                onChange={(e) => onToggleRulePreview(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--accent-primary, #d4a574)' }}
              />
              <span>👻</span>
              Show rule preview overlay (ghost positions)
            </label>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────────
            SECTION 3: EXPORT
            ────────────────────────────────────────────────────────────────── */}
        <section>
          <h3 style={sectionHeaderStyle}>
            <span>📤</span>
            Export Rules
          </h3>

          {/* Format selector */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ 
              display: 'block',
              color: 'var(--text-secondary)',
              fontSize: '12px',
              marginBottom: '6px'
            }}>
              Format:
            </label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-secondary)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                fontSize: '13px'
              }}
            >
              <option value="javascript">JavaScript (export const)</option>
              <option value="json">JSON</option>
            </select>
          </div>

          {/* Export button */}
          <button
            onClick={handleExport}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'var(--accent-primary, #d4a574)',
              color: 'var(--bg-primary)',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '12px',
              transition: 'all 0.15s ease'
            }}
          >
            Generate Export
          </button>

          {/* Export output */}
          {exportedCode && (
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px'
              }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                  Output:
                </span>
                <button
                  onClick={handleCopy}
                  style={{
                    padding: '4px 10px',
                    backgroundColor: copySuccess ? 'var(--color-success, #7cb97c)' : 'var(--bg-tertiary)',
                    border: '1px solid var(--border-secondary)',
                    borderRadius: '4px',
                    color: copySuccess ? 'white' : 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {copySuccess ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
              <pre
                style={{
                  padding: '12px',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-secondary)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  margin: 0
                }}
              >
                {exportedCode}
              </pre>
            </div>
          )}
        </section>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          FOOTER ACTIONS
          ════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--border-secondary)',
          backgroundColor: 'var(--bg-tertiary)',
          display: 'flex',
          gap: '10px'
        }}
      >
        <button
          onClick={onResetPositions}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-secondary)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            transition: 'all 0.15s ease'
          }}
          title="Reset all manual positions to algorithm positions"
        >
          ↺ Reset Positions
        </button>
        <button
          onClick={() => {
            if (window.confirm('Clear all positions and rules? This cannot be undone.')) {
              onClearSession();
            }
          }}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: 'var(--color-error, #b97c7c)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            transition: 'all 0.15s ease'
          }}
          title="Clear all positions, rules, and start fresh"
        >
          🗑 Clear Session
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// PATTERN CARD - Shows observed statistics for a pattern type
// ════════════════════════════════════════════════════════════════════════════

function PatternCard({ label, stats, description, showSign = false }) {
  if (!stats || stats.count === 0) return null;
  
  // Color based on consistency (how uniform the values are)
  const getConsistencyColor = (consistency) => {
    if (consistency >= 80) return 'var(--color-success, #7cb97c)';
    if (consistency >= 50) return 'var(--color-warning, #d4a574)';
    return 'var(--color-error, #b97c7c)';
  };

  const formatValue = (value) => {
    if (value === null || value === undefined) return '—';
    if (showSign && value > 0) return `+${value}`;
    return value.toString();
  };

  return (
    <div
      style={{
        padding: '10px 12px',
        backgroundColor: 'var(--bg-primary)',
        borderRadius: '6px',
        border: '1px solid var(--border-secondary)'
      }}
    >
      {/* Header row */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '6px'
      }}>
        <span style={{ 
          fontWeight: 'bold', 
          color: 'var(--text-primary)',
          fontSize: '13px'
        }}>
          {label}
        </span>
        <span style={{ 
          fontSize: '11px',
          color: getConsistencyColor(stats.consistency),
          fontWeight: 'bold'
        }}>
          {stats.consistency}% consistent
        </span>
      </div>
      
      {/* Stats row */}
      <div style={{ 
        display: 'flex', 
        gap: '16px',
        fontSize: '12px',
        color: 'var(--text-secondary)'
      }}>
        <span>
          Min: <strong style={{ color: 'var(--text-primary)' }}>{formatValue(stats.min)}px</strong>
        </span>
        <span>
          Max: <strong style={{ color: 'var(--text-primary)' }}>{formatValue(stats.max)}px</strong>
        </span>
        <span>
          Avg: <strong style={{ color: 'var(--accent-primary, #d4a574)' }}>{formatValue(stats.avg)}px</strong>
        </span>
      </div>
      
      {/* Description */}
      {description && (
        <div style={{ 
          fontSize: '11px', 
          color: 'var(--text-tertiary)',
          marginTop: '4px'
        }}>
          {description}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// RULE INPUT - Input field for defining a rule value
// ════════════════════════════════════════════════════════════════════════════

function RuleInput({ 
  label, 
  value, 
  onChange, 
  observed, 
  unit = 'px', 
  description,
  compact = false 
}) {
  const handleChange = (e) => {
    const val = e.target.value;
    onChange(val === '' ? null : Number(val));
  };

  const useObserved = () => {
    if (observed !== null && observed !== undefined) {
      onChange(observed);
    }
  };

  return (
    <div style={{ flex: compact ? 1 : 'none' }}>
      {/* Label row */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '4px'
      }}>
        <label style={{ 
          color: 'var(--text-secondary)',
          fontSize: '12px'
        }}>
          {label}
        </label>
        
        {/* "Use observed" button */}
        {observed !== null && observed !== undefined && (
          <button
            onClick={useObserved}
            type="button"
            style={{
              padding: '2px 6px',
              backgroundColor: 'transparent',
              border: '1px solid var(--border-secondary)',
              borderRadius: '3px',
              color: 'var(--text-tertiary)',
              cursor: 'pointer',
              fontSize: '10px',
              transition: 'all 0.15s ease'
            }}
            title={`Use observed average: ${observed}${unit}`}
          >
            Use {observed}{unit}
          </button>
        )}
      </div>
      
      {/* Input row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <input
          type="number"
          value={value ?? ''}
          onChange={handleChange}
          placeholder={observed !== null && observed !== undefined ? String(observed) : '—'}
          style={{
            flex: 1,
            padding: '6px 8px',
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-secondary)',
            borderRadius: '4px',
            color: 'var(--text-primary)',
            fontSize: '13px',
            fontFamily: 'monospace',
            minWidth: 0 // Allow shrinking in flex
          }}
        />
        <span style={{ 
          color: 'var(--text-tertiary)',
          fontSize: '12px',
          flexShrink: 0
        }}>
          {unit}
        </span>
      </div>
      
      {/* Description (only for non-compact) */}
      {description && !compact && (
        <div style={{ 
          fontSize: '11px', 
          color: 'var(--text-tertiary)',
          marginTop: '4px'
        }}>
          {description}
        </div>
      )}
    </div>
  );
}

export default RuleBuilderPanel;
