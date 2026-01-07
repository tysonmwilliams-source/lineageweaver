import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

/**
 * TreeControls Component - Dual Theme Support
 * 
 * Provides interactive controls for the family tree:
 * - Zoom in/out/reset buttons
 * - Layout toggle (vertical/horizontal)
 * - Current zoom level display
 * - Keyboard shortcuts
 * - Adapts styling based on isDarkTheme prop
 * 
 * UPDATED: v0.8.2 - Added horizontal layout toggle
 */
function TreeControls({ 
  svgRef, 
  zoomBehaviorRef, 
  showCadetHouses, 
  onToggleCadetHouses,
  zoomLevel,
  onZoomChange,
  isDarkTheme = true,
  // Layout controls
  layoutMode = 'vertical',
  onLayoutChange
}) {

  // Theme-aware colors
  const theme = isDarkTheme ? {
    bg: {
      primary: '#2d2418',
      secondary: '#3a2f20',
    },
    text: '#e9dcc9',
    textSecondary: '#a89880',
    border: '#4a3d2a',
    accent: '#d4a574',
    accentLight: 'rgba(212, 165, 116, 0.3)',
    buttonPrimary: '#d4a574',
    buttonSecondary: '#8c6a4f',
    buttonActive: '#e8c49a',
  } : {
    bg: {
      primary: '#ede7dc',
      secondary: '#e5dfd0',
    },
    text: '#2d2418',
    textSecondary: '#6b5d4d',
    border: '#d4c4a4',
    accent: '#b8874a',
    accentLight: 'rgba(184, 135, 74, 0.3)',
    buttonPrimary: '#b8874a',
    buttonSecondary: '#c99558',
    buttonActive: '#a07040',
  };

  const handleZoomIn = () => {
    if (zoomBehaviorRef.current && svgRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomBehaviorRef.current.scaleBy, 1.3);
    }
  };

  const handleZoomOut = () => {
    if (zoomBehaviorRef.current && svgRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomBehaviorRef.current.scaleBy, 0.7);
    }
  };

  const handleResetView = () => {
    if (zoomBehaviorRef.current && svgRef.current) {
      const initialTransform = d3.zoomIdentity.translate(200, 100).scale(0.8);
      d3.select(svgRef.current)
        .transition()
        .duration(500)
        .call(zoomBehaviorRef.current.transform, initialTransform);
    }
  };

  const handleToggleLayout = () => {
    if (onLayoutChange) {
      const newMode = layoutMode === 'vertical' ? 'horizontal' : 'vertical';
      onLayoutChange(newMode);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
      }
      
      switch (e.key) {
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
        case '_':
          handleZoomOut();
          break;
        case '0':
          handleResetView();
          break;
        case 'h':
        case 'H':
          // Toggle horizontal layout
          handleToggleLayout();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [layoutMode, onLayoutChange]);

  return (
    <>
      {/* Layout Toggle - Bottom Left */}
      <div 
        className="fixed bottom-6 left-6 p-3 rounded-lg shadow-lg z-10"
        style={{
          backgroundColor: theme.bg.primary,
          borderWidth: '1px',
          borderColor: theme.border,
          boxShadow: isDarkTheme 
            ? '0 10px 15px -3px rgba(0, 0, 0, 0.4)' 
            : '0 10px 15px -3px rgba(45, 36, 24, 0.15)'
        }}
      >
        <div 
          className="text-xs mb-2 text-center font-semibold"
          style={{ color: theme.textSecondary }}
        >
          Layout
        </div>
        
        <div className="flex gap-1">
          {/* Vertical Layout Button */}
          <button
            onClick={() => onLayoutChange && onLayoutChange('vertical')}
            className="w-10 h-10 rounded flex items-center justify-center transition-all hover:brightness-110"
            style={{
              backgroundColor: layoutMode === 'vertical' ? theme.buttonActive : theme.buttonSecondary,
              color: layoutMode === 'vertical' ? (isDarkTheme ? '#1a1410' : '#ffffff') : theme.text,
              border: layoutMode === 'vertical' ? `2px solid ${theme.accent}` : 'none'
            }}
            title="Vertical Layout (ancestors at top) - Press H to toggle"
          >
            {/* Vertical tree icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="10" y="2" width="4" height="4" rx="1" />
              <rect x="4" y="10" width="4" height="4" rx="1" />
              <rect x="16" y="10" width="4" height="4" rx="1" />
              <rect x="1" y="18" width="4" height="4" rx="1" />
              <rect x="7" y="18" width="4" height="4" rx="1" />
              <rect x="13" y="18" width="4" height="4" rx="1" />
              <rect x="19" y="18" width="4" height="4" rx="1" />
              <line x1="12" y1="6" x2="12" y2="8" stroke="currentColor" strokeWidth="1.5" />
              <line x1="6" y1="8" x2="18" y2="8" stroke="currentColor" strokeWidth="1.5" />
              <line x1="6" y1="8" x2="6" y2="10" stroke="currentColor" strokeWidth="1.5" />
              <line x1="18" y1="8" x2="18" y2="10" stroke="currentColor" strokeWidth="1.5" />
              <line x1="6" y1="14" x2="6" y2="16" stroke="currentColor" strokeWidth="1.5" />
              <line x1="3" y1="16" x2="9" y2="16" stroke="currentColor" strokeWidth="1.5" />
              <line x1="3" y1="16" x2="3" y2="18" stroke="currentColor" strokeWidth="1.5" />
              <line x1="9" y1="16" x2="9" y2="18" stroke="currentColor" strokeWidth="1.5" />
              <line x1="18" y1="14" x2="18" y2="16" stroke="currentColor" strokeWidth="1.5" />
              <line x1="15" y1="16" x2="21" y2="16" stroke="currentColor" strokeWidth="1.5" />
              <line x1="15" y1="16" x2="15" y2="18" stroke="currentColor" strokeWidth="1.5" />
              <line x1="21" y1="16" x2="21" y2="18" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>

          {/* Horizontal Layout Button */}
          <button
            onClick={() => onLayoutChange && onLayoutChange('horizontal')}
            className="w-10 h-10 rounded flex items-center justify-center transition-all hover:brightness-110"
            style={{
              backgroundColor: layoutMode === 'horizontal' ? theme.buttonActive : theme.buttonSecondary,
              color: layoutMode === 'horizontal' ? (isDarkTheme ? '#1a1410' : '#ffffff') : theme.text,
              border: layoutMode === 'horizontal' ? `2px solid ${theme.accent}` : 'none'
            }}
            title="Horizontal Layout (ancestors on left) - Press H to toggle"
          >
            {/* Horizontal tree icon (rotated 90°) */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="2" y="10" width="4" height="4" rx="1" />
              <rect x="10" y="4" width="4" height="4" rx="1" />
              <rect x="10" y="16" width="4" height="4" rx="1" />
              <rect x="18" y="1" width="4" height="4" rx="1" />
              <rect x="18" y="7" width="4" height="4" rx="1" />
              <rect x="18" y="13" width="4" height="4" rx="1" />
              <rect x="18" y="19" width="4" height="4" rx="1" />
              <line x1="6" y1="12" x2="8" y2="12" stroke="currentColor" strokeWidth="1.5" />
              <line x1="8" y1="6" x2="8" y2="18" stroke="currentColor" strokeWidth="1.5" />
              <line x1="8" y1="6" x2="10" y2="6" stroke="currentColor" strokeWidth="1.5" />
              <line x1="8" y1="18" x2="10" y2="18" stroke="currentColor" strokeWidth="1.5" />
              <line x1="14" y1="6" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5" />
              <line x1="16" y1="3" x2="16" y2="9" stroke="currentColor" strokeWidth="1.5" />
              <line x1="16" y1="3" x2="18" y2="3" stroke="currentColor" strokeWidth="1.5" />
              <line x1="16" y1="9" x2="18" y2="9" stroke="currentColor" strokeWidth="1.5" />
              <line x1="14" y1="18" x2="16" y2="18" stroke="currentColor" strokeWidth="1.5" />
              <line x1="16" y1="15" x2="16" y2="21" stroke="currentColor" strokeWidth="1.5" />
              <line x1="16" y1="15" x2="18" y2="15" stroke="currentColor" strokeWidth="1.5" />
              <line x1="16" y1="21" x2="18" y2="21" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        <div 
          className="text-xs mt-2 text-center"
          style={{ color: theme.textSecondary }}
        >
          Press <kbd style={{ 
            backgroundColor: theme.bg.secondary, 
            padding: '1px 4px', 
            borderRadius: '3px',
            border: `1px solid ${theme.border}`
          }}>H</kbd> to toggle
        </div>
      </div>

      {/* Zoom Controls - Bottom Right */}
      <div 
        className="fixed bottom-6 right-6 p-3 rounded-lg shadow-lg z-10 flex flex-col gap-2"
        style={{
          backgroundColor: theme.bg.primary,
          borderWidth: '1px',
          borderColor: theme.border,
          boxShadow: isDarkTheme 
            ? '0 10px 15px -3px rgba(0, 0, 0, 0.4)' 
            : '0 10px 15px -3px rgba(45, 36, 24, 0.15)'
        }}
      >
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 rounded font-bold text-xl transition-all hover:brightness-110"
          style={{
            backgroundColor: theme.buttonPrimary,
            color: isDarkTheme ? '#1a1410' : '#ffffff'
          }}
          title="Zoom In (+)"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 rounded font-bold text-xl transition-all hover:brightness-110"
          style={{
            backgroundColor: theme.buttonPrimary,
            color: isDarkTheme ? '#1a1410' : '#ffffff'
          }}
          title="Zoom Out (-)"
        >
          −
        </button>
        <button
          onClick={handleResetView}
          className="w-10 h-10 rounded text-lg transition-all hover:brightness-110"
          style={{
            backgroundColor: theme.buttonSecondary,
            color: theme.text
          }}
          title="Reset View (0)"
        >
          ⟲
        </button>
        <div 
          className="text-xs text-center mt-1 font-semibold"
          style={{ color: theme.text }}
        >
          {Math.round(zoomLevel * 100)}%
        </div>
      </div>

      {/* Keyboard Shortcuts Hint - appears briefly on load */}
      <div 
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg z-10 opacity-60 pointer-events-none"
        style={{
          backgroundColor: theme.bg.primary,
          borderWidth: '1px',
          borderColor: theme.border,
          color: theme.textSecondary,
          fontSize: '0.75rem'
        }}
      >
        <span className="font-semibold" style={{ color: theme.text }}>Shortcuts:</span>
        {' '}
        <kbd style={{ backgroundColor: theme.bg.secondary, padding: '1px 4px', borderRadius: '3px' }}>+</kbd>/<kbd style={{ backgroundColor: theme.bg.secondary, padding: '1px 4px', borderRadius: '3px' }}>-</kbd> zoom
        {' • '}
        <kbd style={{ backgroundColor: theme.bg.secondary, padding: '1px 4px', borderRadius: '3px' }}>0</kbd> reset
        {' • '}
        <kbd style={{ backgroundColor: theme.bg.secondary, padding: '1px 4px', borderRadius: '3px' }}>H</kbd> layout
      </div>
    </>
  );
}

export default TreeControls;
