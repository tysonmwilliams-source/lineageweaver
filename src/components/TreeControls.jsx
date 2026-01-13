/**
 * TreeControls.jsx - Tree View Control Panel
 *
 * PURPOSE:
 * Provides interactive controls for the family tree visualization:
 * - Zoom in/out/reset buttons
 * - Layout toggle (vertical/horizontal)
 * - Current zoom level display
 * - Keyboard shortcuts
 *
 * Uses Framer Motion for animations and BEM CSS.
 */

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import Icon from './icons';
import './TreeControls.css';

// ==================== ANIMATION VARIANTS ====================
const PANEL_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 300
    }
  }
};

const HINT_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 0.6,
    y: 0,
    transition: { delay: 0.5, duration: 0.3 }
  }
};

function TreeControls({
  svgRef,
  zoomBehaviorRef,
  showCadetHouses,
  onToggleCadetHouses,
  zoomLevel,
  onZoomChange,
  layoutMode = 'vertical',
  onLayoutChange
}) {
  // ==================== ZOOM HANDLERS ====================
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

  // ==================== KEYBOARD SHORTCUTS ====================
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
      <motion.div
        className="tree-controls tree-controls--layout"
        variants={PANEL_VARIANTS}
        initial="hidden"
        animate="visible"
      >
        <span className="tree-controls__label">Layout</span>

        <div className="tree-controls__button-group">
          {/* Vertical Layout Button */}
          <button
            className={`tree-controls__layout-btn ${layoutMode === 'vertical' ? 'tree-controls__layout-btn--active' : ''}`}
            onClick={() => onLayoutChange && onLayoutChange('vertical')}
            title="Vertical Layout (ancestors at top) - Press H to toggle"
          >
            <svg className="tree-controls__layout-icon" viewBox="0 0 24 24" fill="currentColor">
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
            className={`tree-controls__layout-btn ${layoutMode === 'horizontal' ? 'tree-controls__layout-btn--active' : ''}`}
            onClick={() => onLayoutChange && onLayoutChange('horizontal')}
            title="Horizontal Layout (ancestors on left) - Press H to toggle"
          >
            <svg className="tree-controls__layout-icon" viewBox="0 0 24 24" fill="currentColor">
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

        <span className="tree-controls__hint">
          Press <kbd className="tree-controls__kbd">H</kbd> to toggle
        </span>
      </motion.div>

      {/* Zoom Controls - Bottom Right */}
      <motion.div
        className="tree-controls tree-controls--zoom"
        variants={PANEL_VARIANTS}
        initial="hidden"
        animate="visible"
      >
        <button
          className="tree-controls__zoom-btn tree-controls__zoom-btn--primary"
          onClick={handleZoomIn}
          title="Zoom In (+)"
        >
          <Icon name="plus" size={20} />
        </button>

        <button
          className="tree-controls__zoom-btn tree-controls__zoom-btn--primary"
          onClick={handleZoomOut}
          title="Zoom Out (-)"
        >
          <Icon name="minus" size={20} />
        </button>

        <button
          className="tree-controls__zoom-btn tree-controls__zoom-btn--secondary"
          onClick={handleResetView}
          title="Reset View (0)"
        >
          <Icon name="rotate-ccw" size={18} />
        </button>

        <span className="tree-controls__zoom-level">
          {Math.round(zoomLevel * 100)}%
        </span>
      </motion.div>

      {/* Keyboard Shortcuts Hint */}
      <motion.div
        className="tree-controls__shortcuts"
        variants={HINT_VARIANTS}
        initial="hidden"
        animate="visible"
      >
        <span className="tree-controls__shortcuts-label">Shortcuts:</span>
        <kbd className="tree-controls__kbd">+</kbd>/<kbd className="tree-controls__kbd">-</kbd> zoom
        <span className="tree-controls__shortcuts-divider">•</span>
        <kbd className="tree-controls__kbd">0</kbd> reset
        <span className="tree-controls__shortcuts-divider">•</span>
        <kbd className="tree-controls__kbd">H</kbd> layout
      </motion.div>
    </>
  );
}

export default TreeControls;
