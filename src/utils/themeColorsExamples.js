/**
 * Theme Color Utilities - Usage Examples
 * 
 * This file demonstrates how to use the theme color utilities
 * in various scenarios throughout the Lineageweaver app.
 */

import { 
  getThemeColor, 
  getHouseColor, 
  getAllThemeColors,
  getRelationshipColors,
  getBackgroundColors,
  getTextColors,
  getAllHouseColors,
  isDarkTheme,
  getShadowIntensity
} from './themeColors';

// ============================================
// EXAMPLE 1: Simple color retrieval
// ============================================

function Example1_SimpleColors() {
  // Get a single color
  const primaryBg = getThemeColor('--bg-primary');
  const primaryText = getThemeColor('--text-primary');
  
  // Use in inline styles
  return (
    <div style={{ 
      backgroundColor: primaryBg, 
      color: primaryText 
    }}>
      Simple colored div
    </div>
  );
}

// ============================================
// EXAMPLE 2: House colors for person cards
// ============================================

function Example2_HouseColors({ house, houseIndex }) {
  const houseColor = getHouseColor(houseIndex);
  
  return (
    <div style={{
      backgroundColor: houseColor,
      opacity: 0.15,  // Subtle background tint
      padding: '20px',
      borderRadius: '8px'
    }}>
      <h3>{house.houseName}</h3>
      <p>Color: {houseColor}</p>
    </div>
  );
}

// ============================================
// EXAMPLE 3: D3.js visualization with theme colors
// ============================================

function Example3_D3Visualization() {
  useEffect(() => {
    const colors = getAllThemeColors();
    
    const svg = d3.select('#my-svg');
    
    // Draw relationship lines with theme colors
    svg.selectAll('.line-legitimate')
      .data(legitimateRelationships)
      .join('line')
      .attr('stroke', colors.relationship.legitimate)
      .attr('stroke-width', 2.5);
    
    svg.selectAll('.line-bastard')
      .data(bastardRelationships)
      .join('line')
      .attr('stroke', colors.relationship.bastard)
      .attr('stroke-width', 2.5)
      .attr('stroke-dasharray', '8,4');
    
    svg.selectAll('.line-adopted')
      .data(adoptedRelationships)
      .join('line')
      .attr('stroke', colors.relationship.adopted)
      .attr('stroke-width', 2.5)
      .attr('stroke-dasharray', '2,3');
    
    // Draw text
    svg.selectAll('.person-name')
      .data(people)
      .join('text')
      .attr('fill', colors.text.primary)
      .text(d => d.name);
      
  }, [people, relationships, theme]); // Re-render when theme changes
}

// ============================================
// EXAMPLE 4: Conditional styling based on theme
// ============================================

function Example4_ConditionalStyling() {
  const isDark = isDarkTheme();
  const shadowOpacity = getShadowIntensity();
  
  return (
    <div 
      className="card"
      style={{
        backgroundColor: getThemeColor('--bg-tertiary'),
        boxShadow: `0 4px 12px rgba(0, 0, 0, ${shadowOpacity})`,
        filter: isDark ? 'brightness(1.0)' : 'brightness(0.98)'
      }}
    >
      <h3 style={{ color: getThemeColor('--text-primary') }}>
        Card Title
      </h3>
      <p style={{ color: getThemeColor('--text-secondary') }}>
        Card content with proper theme colors
      </p>
    </div>
  );
}

// ============================================
// EXAMPLE 5: Dynamic house color picker
// ============================================

function Example5_ColorPicker() {
  const allColors = getAllHouseColors();
  
  return (
    <div className="color-picker">
      <h4>Choose House Color:</h4>
      <div className="color-grid">
        {allColors.map((color, index) => (
          <button
            key={index}
            style={{
              backgroundColor: color,
              width: '40px',
              height: '40px',
              border: '2px solid ' + getThemeColor('--border-primary'),
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            onClick={() => selectHouseColor(index)}
            title={`House Color ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================
// EXAMPLE 6: Themed button component
// ============================================

function Example6_ThemedButton({ children, variant = 'primary' }) {
  const getButtonColors = () => {
    switch(variant) {
      case 'primary':
        return {
          bg: getThemeColor('--interactive-default'),
          text: getThemeColor('--text-primary'),
          hover: getThemeColor('--interactive-hover')
        };
      case 'success':
        return {
          bg: getThemeColor('--color-success'),
          text: getThemeColor('--text-primary'),
          hover: getThemeColor('--color-success-light')
        };
      case 'danger':
        return {
          bg: getThemeColor('--color-error'),
          text: getThemeColor('--text-primary'),
          hover: getThemeColor('--color-error-light')
        };
      default:
        return {
          bg: getThemeColor('--bg-tertiary'),
          text: getThemeColor('--text-primary'),
          hover: getThemeColor('--bg-elevated')
        };
    }
  };
  
  const colors = getButtonColors();
  
  return (
    <button
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        border: `2px solid ${getThemeColor('--border-primary')}`,
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontFamily: getThemeColor('--font-body')
      }}
      onMouseEnter={(e) => e.target.style.backgroundColor = colors.hover}
      onMouseLeave={(e) => e.target.style.backgroundColor = colors.bg}
    >
      {children}
    </button>
  );
}

// ============================================
// EXAMPLE 7: Relationship status badge
// ============================================

function Example7_StatusBadge({ person }) {
  const relationshipColors = getRelationshipColors();
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'legitimate': return relationshipColors.legitimate;
      case 'bastard': return relationshipColors.bastard;
      case 'adopted': return relationshipColors.adopted;
      default: return relationshipColors.unknown;
    }
  };
  
  const statusColor = getStatusColor(person.legitimacyStatus);
  
  return (
    <span
      className="status-badge"
      style={{
        backgroundColor: statusColor + '30', // Add transparency
        color: statusColor,
        border: `2px solid ${statusColor}`,
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: 'bold',
        textTransform: 'uppercase'
      }}
    >
      {person.legitimacyStatus}
    </span>
  );
}

// ============================================
// EXAMPLE 8: Modal with theme colors
// ============================================

function Example8_ThemedModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  
  const backgrounds = getBackgroundColors();
  const texts = getTextColors();
  const borders = getBorderColors();
  
  return (
    <div 
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: backgrounds.primary + 'DD', // Semi-transparent
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div
        className="modal-container"
        style={{
          backgroundColor: backgrounds.tertiary,
          border: `2px solid ${borders.secondary}`,
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '600px',
          boxShadow: `0 20px 40px rgba(0, 0, 0, ${getShadowIntensity()})`
        }}
      >
        <div style={{ color: texts.primary }}>
          {children}
        </div>
        <button 
          onClick={onClose}
          style={{
            marginTop: '20px',
            backgroundColor: getThemeColor('--interactive-default'),
            color: texts.primary,
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ============================================
// EXAMPLE 9: Legend for family tree
// ============================================

function Example9_TreeLegend() {
  const relationshipColors = getRelationshipColors();
  const textColor = getThemeColor('--text-primary');
  
  const legendItems = [
    { label: 'Legitimate Child', color: relationshipColors.legitimate, pattern: 'solid' },
    { label: 'Bastard Child', color: relationshipColors.bastard, pattern: 'dashed' },
    { label: 'Adopted Child', color: relationshipColors.adopted, pattern: 'dotted' }
  ];
  
  return (
    <div 
      className="tree-legend"
      style={{
        backgroundColor: getThemeColor('--bg-secondary'),
        border: `2px solid ${getThemeColor('--border-primary')}`,
        borderRadius: '8px',
        padding: '16px'
      }}
    >
      <h4 style={{ color: textColor, marginBottom: '12px' }}>
        Relationship Types
      </h4>
      {legendItems.map((item, i) => (
        <div 
          key={i} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '8px',
            color: getThemeColor('--text-secondary')
          }}
        >
          <div
            style={{
              width: '40px',
              height: '3px',
              backgroundColor: item.color,
              marginRight: '12px',
              borderStyle: item.pattern === 'dashed' ? 'dashed' : 
                          item.pattern === 'dotted' ? 'dotted' : 'solid'
            }}
          />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================
// EXAMPLE 10: Using colors in CSS-in-JS
// ============================================

function Example10_CSSinJS() {
  const styles = {
    container: {
      backgroundColor: getThemeColor('--bg-primary'),
      minHeight: '100vh',
      padding: '20px'
    },
    header: {
      backgroundColor: getThemeColor('--bg-secondary'),
      color: getThemeColor('--text-primary'),
      fontFamily: getThemeColor('--font-display'),
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '20px'
    },
    card: {
      backgroundColor: getThemeColor('--bg-tertiary'),
      border: `2px solid ${getThemeColor('--border-primary')}`,
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
      boxShadow: `0 4px 8px rgba(0, 0, 0, ${getShadowIntensity()})`
    },
    cardTitle: {
      color: getThemeColor('--text-primary'),
      fontFamily: getThemeColor('--font-display'),
      fontSize: '18px',
      marginBottom: '8px'
    },
    cardText: {
      color: getThemeColor('--text-secondary'),
      fontFamily: getThemeColor('--font-body'),
      lineHeight: 1.6
    }
  };
  
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>My Page Title</h1>
      </header>
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Card Title</h2>
        <p style={styles.cardText}>Card content goes here...</p>
      </div>
    </div>
  );
}

// ============================================
// BEST PRACTICES
// ============================================

/*
1. Always use getThemeColor() or specific helpers instead of hardcoding colors
2. Re-render D3 visualizations when theme changes (add 'theme' to useEffect deps)
3. Use getAllThemeColors() once per render instead of calling getThemeColor() repeatedly
4. Cache color values in local variables if using them multiple times
5. Use CSS custom properties in styles when possible: style={{ backgroundColor: 'var(--bg-primary)' }}
6. For D3.js, always call color functions inside the render/draw function
7. Test your component in both themes to ensure colors work well
*/

// ============================================
// PERFORMANCE TIP
// ============================================

/*
If you need colors in multiple places in the same component:

// GOOD - Call once, use multiple times
const colors = getAllThemeColors();
svg.rect.attr('fill', colors.bg.primary);
svg.text.attr('fill', colors.text.primary);
svg.line.attr('stroke', colors.relationship.legitimate);

// LESS GOOD - Multiple DOM queries
svg.rect.attr('fill', getThemeColor('--bg-primary'));
svg.text.attr('fill', getThemeColor('--text-primary'));
svg.line.attr('stroke', getThemeColor('--legitimate-primary'));
*/

export {
  Example1_SimpleColors,
  Example2_HouseColors,
  Example3_D3Visualization,
  Example4_ConditionalStyling,
  Example5_ColorPicker,
  Example6_ThemedButton,
  Example7_StatusBadge,
  Example8_ThemedModal,
  Example9_TreeLegend,
  Example10_CSSinJS
};
