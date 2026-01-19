// src/components/dev/DevModeToggle.jsx
import React from 'react';

/**
 * DEV MODE TOGGLE
 * 
 * Small floating toggle in the corner of the family tree view.
 * Switches between algorithm positioning (normal) and manual positioning (drag-to-arrange).
 * 
 * Also provides quick access to the Rule Builder panel for pattern analysis.
 */
function DevModeToggle({ 
  isManualMode, 
  onToggle, 
  onOpenRuleBuilder,
  hasOverrides,
  overrideCount,
  isDarkTheme 
}) {
  return (
    <div
      style={{
        position: 'fixed',
        top: '80px',
        left: '20px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        backgroundColor: 'var(--bg-secondary)',
        border: `2px solid ${isManualMode ? 'var(--color-warning, #d4a574)' : 'var(--border-primary)'}`,
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        fontFamily: 'var(--font-body, Georgia, serif)',
        fontSize: '13px',
        transition: 'all 0.2s ease'
      }}
    >
      {/* Mode indicator with icon */}
      <span 
        style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: isManualMode ? 'var(--color-warning, #d4a574)' : 'var(--text-secondary)',
          fontWeight: isManualMode ? 'bold' : 'normal'
        }}
      >
        <span style={{ fontSize: '14px' }}>🛠️</span>
        <span>{isManualMode ? 'MANUAL' : 'Algorithm'}</span>
      </span>
      
      {/* Toggle button */}
      <button
        onClick={onToggle}
        style={{
          padding: '4px 10px',
          border: '1px solid var(--border-secondary)',
          borderRadius: '4px',
          backgroundColor: isManualMode ? 'var(--color-warning, #d4a574)' : 'var(--bg-tertiary)',
          color: isManualMode ? 'var(--bg-primary)' : 'var(--text-primary)',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: isManualMode ? 'bold' : 'normal',
          transition: 'all 0.15s ease'
        }}
        title={isManualMode ? 'Switch to algorithm positioning' : 'Enable drag-to-position mode'}
      >
        {isManualMode ? 'Use Algorithm' : 'Enable Drag'}
      </button>
      
      {/* Override count badge - shows when there are manual positions */}
      {hasOverrides && (
        <span
          style={{
            padding: '2px 6px',
            backgroundColor: 'var(--accent-primary, #d4a574)',
            color: 'var(--bg-primary)',
            borderRadius: '10px',
            fontSize: '11px',
            fontWeight: 'bold',
            minWidth: '20px',
            textAlign: 'center'
          }}
          title={`${overrideCount} manual position${overrideCount !== 1 ? 's' : ''} set`}
        >
          {overrideCount}
        </span>
      )}
      
      {/* Open Rule Builder button */}
      <button
        onClick={onOpenRuleBuilder}
        style={{
          padding: '4px 8px',
          border: '1px solid var(--border-secondary)',
          borderRadius: '4px',
          backgroundColor: 'var(--bg-tertiary)',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.15s ease'
        }}
        title="Open Rule Builder panel"
      >
        ⚙️
      </button>
    </div>
  );
}

export default DevModeToggle;
