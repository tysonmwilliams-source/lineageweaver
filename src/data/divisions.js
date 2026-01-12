/**
 * Divisions Library - Heraldic Field Divisions
 * 
 * This file defines all the ways a shield's field can be divided.
 * Each division includes its SVG rendering logic for different tinctures.
 * 
 * DIVISION CATEGORIES:
 * - Plain: Single solid color
 * - Partitions: Shield divided into 2 parts
 * - Complex: Shield divided into 3+ parts
 * - Patterns: Repeating stripe/grid patterns
 */

// ==================== PLAIN (No Division) ====================

export const PLAIN_DIVISIONS = {
  plain: {
    id: 'plain',
    name: 'Plain',
    displayName: 'Plain Field',
    category: 'plain',
    tincturesNeeded: 1,
    description: 'A solid field of one tincture',
    preview: '■',
    renderSVG: (tinctures, size = 200) => {
      return `<rect x="0" y="0" width="${size}" height="${size}" fill="${tinctures[0]}"/>`;
    }
  }
};

// ==================== PARTITIONS (2-part divisions) ====================

export const PARTITION_DIVISIONS = {
  perPale: {
    id: 'perPale',
    name: 'Per Pale',
    displayName: 'Divided Vertically',
    category: 'partition',
    tincturesNeeded: 2,
    description: 'Divided vertically down the middle',
    preview: '▌',
    renderSVG: (tinctures, size = 200) => {
      const half = size / 2;
      return `
        <rect x="0" y="0" width="${half}" height="${size}" fill="${tinctures[0]}"/>
        <rect x="${half}" y="0" width="${half}" height="${size}" fill="${tinctures[1]}"/>
      `;
    }
  },
  perFess: {
    id: 'perFess',
    name: 'Per Fess',
    displayName: 'Divided Horizontally',
    category: 'partition',
    tincturesNeeded: 2,
    description: 'Divided horizontally across the middle',
    preview: '▀',
    renderSVG: (tinctures, size = 200) => {
      const half = size / 2;
      return `
        <rect x="0" y="0" width="${size}" height="${half}" fill="${tinctures[0]}"/>
        <rect x="0" y="${half}" width="${size}" height="${half}" fill="${tinctures[1]}"/>
      `;
    }
  },
  perBend: {
    id: 'perBend',
    name: 'Per Bend',
    displayName: 'Diagonal (Top-Left)',
    category: 'partition',
    tincturesNeeded: 2,
    description: 'Divided diagonally from top-left to bottom-right',
    preview: '◢',
    renderSVG: (tinctures, size = 200) => {
      return `
        <polygon points="0,0 ${size},0 ${size},${size}" fill="${tinctures[0]}"/>
        <polygon points="0,0 0,${size} ${size},${size}" fill="${tinctures[1]}"/>
      `;
    }
  },
  perBendSinister: {
    id: 'perBendSinister',
    name: 'Per Bend Sinister',
    displayName: 'Diagonal (Top-Right)',
    category: 'partition',
    tincturesNeeded: 2,
    description: 'Divided diagonally from top-right to bottom-left',
    preview: '◣',
    renderSVG: (tinctures, size = 200) => {
      return `
        <polygon points="0,0 ${size},0 0,${size}" fill="${tinctures[0]}"/>
        <polygon points="${size},0 ${size},${size} 0,${size}" fill="${tinctures[1]}"/>
      `;
    }
  },
  perChevron: {
    id: 'perChevron',
    name: 'Per Chevron',
    displayName: 'Chevron Division',
    category: 'partition',
    tincturesNeeded: 2,
    description: 'Divided by a chevron line from the sides to the center top',
    preview: '⌃',
    renderSVG: (tinctures, size = 200) => {
      const mid = size / 2;
      return `
        <rect x="0" y="0" width="${size}" height="${size}" fill="${tinctures[1]}"/>
        <polygon points="0,${size} ${mid},${mid * 0.6} ${size},${size}" fill="${tinctures[0]}"/>
      `;
    }
  },
  perSaltire: {
    id: 'perSaltire',
    name: 'Per Saltire',
    displayName: 'X Division',
    category: 'partition',
    tincturesNeeded: 2,
    description: 'Divided by an X from corner to corner',
    preview: '✕',
    renderSVG: (tinctures, size = 200) => {
      const mid = size / 2;
      return `
        <polygon points="0,0 ${mid},${mid} 0,${size}" fill="${tinctures[0]}"/>
        <polygon points="${size},0 ${mid},${mid} ${size},${size}" fill="${tinctures[0]}"/>
        <polygon points="0,0 ${mid},${mid} ${size},0" fill="${tinctures[1]}"/>
        <polygon points="0,${size} ${mid},${mid} ${size},${size}" fill="${tinctures[1]}"/>
      `;
    }
  }
};

// ==================== COMPLEX DIVISIONS (3+ parts) ====================

export const COMPLEX_DIVISIONS = {
  quarterly: {
    id: 'quarterly',
    name: 'Quarterly',
    displayName: 'Quartered',
    category: 'complex',
    tincturesNeeded: 2,
    description: 'Divided into four quarters',
    preview: '▚',
    renderSVG: (tinctures, size = 200) => {
      const half = size / 2;
      return `
        <rect x="0" y="0" width="${half}" height="${half}" fill="${tinctures[0]}"/>
        <rect x="${half}" y="0" width="${half}" height="${half}" fill="${tinctures[1]}"/>
        <rect x="0" y="${half}" width="${half}" height="${half}" fill="${tinctures[1]}"/>
        <rect x="${half}" y="${half}" width="${half}" height="${half}" fill="${tinctures[0]}"/>
      `;
    }
  },
  gyronny: {
    id: 'gyronny',
    name: 'Gyronny',
    displayName: 'Eight Triangles',
    category: 'complex',
    tincturesNeeded: 2,
    description: 'Divided into eight triangular sections radiating from center',
    preview: '✳',
    renderSVG: (tinctures, size = 200) => {
      const mid = size / 2;
      return `
        <polygon points="${mid},${mid} 0,0 ${mid},0" fill="${tinctures[0]}"/>
        <polygon points="${mid},${mid} ${mid},0 ${size},0" fill="${tinctures[1]}"/>
        <polygon points="${mid},${mid} ${size},0 ${size},${mid}" fill="${tinctures[0]}"/>
        <polygon points="${mid},${mid} ${size},${mid} ${size},${size}" fill="${tinctures[1]}"/>
        <polygon points="${mid},${mid} ${size},${size} ${mid},${size}" fill="${tinctures[0]}"/>
        <polygon points="${mid},${mid} ${mid},${size} 0,${size}" fill="${tinctures[1]}"/>
        <polygon points="${mid},${mid} 0,${size} 0,${mid}" fill="${tinctures[0]}"/>
        <polygon points="${mid},${mid} 0,${mid} 0,0" fill="${tinctures[1]}"/>
      `;
    }
  },
  tiercedInPale: {
    id: 'tiercedInPale',
    name: 'Tierced in Pale',
    displayName: 'Three Vertical',
    category: 'complex',
    tincturesNeeded: 3,
    description: 'Divided into three vertical sections',
    preview: '|||',
    renderSVG: (tinctures, size = 200) => {
      const third = size / 3;
      return `
        <rect x="0" y="0" width="${third}" height="${size}" fill="${tinctures[0]}"/>
        <rect x="${third}" y="0" width="${third}" height="${size}" fill="${tinctures[1]}"/>
        <rect x="${third * 2}" y="0" width="${third}" height="${size}" fill="${tinctures[2] || tinctures[0]}"/>
      `;
    }
  },
  tiercedInFess: {
    id: 'tiercedInFess',
    name: 'Tierced in Fess',
    displayName: 'Three Horizontal',
    category: 'complex',
    tincturesNeeded: 3,
    description: 'Divided into three horizontal sections',
    preview: '≡',
    renderSVG: (tinctures, size = 200) => {
      const third = size / 3;
      return `
        <rect x="0" y="0" width="${size}" height="${third}" fill="${tinctures[0]}"/>
        <rect x="0" y="${third}" width="${size}" height="${third}" fill="${tinctures[1]}"/>
        <rect x="0" y="${third * 2}" width="${size}" height="${third}" fill="${tinctures[2] || tinctures[0]}"/>
      `;
    }
  },
  tiercedInPairle: {
    id: 'tiercedInPairle',
    name: 'Tierced in Pairle',
    displayName: 'Y-Shaped',
    category: 'complex',
    tincturesNeeded: 3,
    description: 'Divided by a Y shape into three sections',
    preview: 'Y',
    renderSVG: (tinctures, size = 200) => {
      const mid = size / 2;
      return `
        <polygon points="0,0 ${mid},${mid} 0,${size}" fill="${tinctures[0]}"/>
        <polygon points="${size},0 ${mid},${mid} ${size},${size}" fill="${tinctures[1]}"/>
        <polygon points="0,0 ${mid},0 ${mid},${mid} ${size},0 ${size},0" fill="${tinctures[0]}"/>
        <polygon points="0,${size} ${mid},${mid} ${size},${size}" fill="${tinctures[2] || tinctures[0]}"/>
        <rect x="0" y="0" width="${size}" height="${mid * 0.4}" fill="${tinctures[0]}"/>
        <polygon points="${mid},${mid * 0.4} 0,${mid * 0.4} 0,0 ${size},0 ${size},${mid * 0.4}" fill="${tinctures[2] || tinctures[0]}"/>
      `;
    }
  }
};

// ==================== PATTERN DIVISIONS (Stripes/Grids) ====================

export const PATTERN_DIVISIONS = {
  paly: {
    id: 'paly',
    name: 'Paly',
    displayName: 'Vertical Stripes',
    category: 'pattern',
    tincturesNeeded: 2,
    stripes: 6,
    description: 'Divided into an even number of vertical stripes',
    preview: '|||',
    renderSVG: (tinctures, size = 200, stripes = 6) => {
      const stripeWidth = size / stripes;
      let svg = '';
      for (let i = 0; i < stripes; i++) {
        const fill = i % 2 === 0 ? tinctures[0] : tinctures[1];
        svg += `<rect x="${i * stripeWidth}" y="0" width="${stripeWidth}" height="${size}" fill="${fill}"/>`;
      }
      return svg;
    }
  },
  barry: {
    id: 'barry',
    name: 'Barry',
    displayName: 'Horizontal Stripes',
    category: 'pattern',
    tincturesNeeded: 2,
    stripes: 6,
    description: 'Divided into an even number of horizontal stripes',
    preview: '≡',
    renderSVG: (tinctures, size = 200, stripes = 6) => {
      const stripeHeight = size / stripes;
      let svg = '';
      for (let i = 0; i < stripes; i++) {
        const fill = i % 2 === 0 ? tinctures[0] : tinctures[1];
        svg += `<rect x="0" y="${i * stripeHeight}" width="${size}" height="${stripeHeight}" fill="${fill}"/>`;
      }
      return svg;
    }
  },
  bendy: {
    id: 'bendy',
    name: 'Bendy',
    displayName: 'Diagonal Stripes',
    category: 'pattern',
    tincturesNeeded: 2,
    stripes: 6,
    description: 'Divided into diagonal stripes from top-left to bottom-right',
    preview: '⟍',
    renderSVG: (tinctures, size = 200, stripes = 6) => {
      const stripeWidth = (size * 2) / stripes;
      let svg = `<rect x="0" y="0" width="${size}" height="${size}" fill="${tinctures[1]}"/>`;
      for (let i = 0; i < stripes; i += 2) {
        const offset = i * stripeWidth - size;
        svg += `<polygon points="${offset},0 ${offset + stripeWidth},0 ${offset + stripeWidth + size},${size} ${offset + size},${size}" fill="${tinctures[0]}" clip-path="inset(0)"/>`;
      }
      // Clip to bounds
      return `<g clip-path="url(#bounds)">${svg}</g><defs><clipPath id="bounds"><rect x="0" y="0" width="${size}" height="${size}"/></clipPath></defs>`;
    }
  },
  chequy: {
    id: 'chequy',
    name: 'Chequy',
    displayName: 'Checkerboard',
    category: 'pattern',
    tincturesNeeded: 2,
    squares: 6,
    description: 'A checkerboard pattern',
    preview: '▚',
    renderSVG: (tinctures, size = 200, squares = 6) => {
      const squareSize = size / squares;
      let svg = '';
      for (let row = 0; row < squares; row++) {
        for (let col = 0; col < squares; col++) {
          const fill = (row + col) % 2 === 0 ? tinctures[0] : tinctures[1];
          svg += `<rect x="${col * squareSize}" y="${row * squareSize}" width="${squareSize}" height="${squareSize}" fill="${fill}"/>`;
        }
      }
      return svg;
    }
  },
  lozengy: {
    id: 'lozengy',
    name: 'Lozengy',
    displayName: 'Diamond Grid',
    category: 'pattern',
    tincturesNeeded: 2,
    diamonds: 5,
    description: 'A pattern of diamond shapes',
    preview: '◇',
    renderSVG: (tinctures, size = 200, diamonds = 5) => {
      const dSize = size / diamonds;
      let svg = `<rect x="0" y="0" width="${size}" height="${size}" fill="${tinctures[1]}"/>`;
      for (let row = -1; row <= diamonds; row++) {
        for (let col = -1; col <= diamonds; col++) {
          if ((row + col) % 2 === 0) {
            const cx = col * dSize + dSize / 2;
            const cy = row * dSize + dSize / 2;
            svg += `<polygon points="${cx},${cy - dSize / 2} ${cx + dSize / 2},${cy} ${cx},${cy + dSize / 2} ${cx - dSize / 2},${cy}" fill="${tinctures[0]}"/>`;
          }
        }
      }
      return `<g clip-path="url(#bounds2)">${svg}</g><defs><clipPath id="bounds2"><rect x="0" y="0" width="${size}" height="${size}"/></clipPath></defs>`;
    }
  }
};

// ==================== ORDINARIES AS DIVISIONS ====================
// These are common "charges" that fill a significant portion of the field

export const ORDINARY_DIVISIONS = {
  chief: {
    id: 'chief',
    name: 'Chief',
    displayName: 'Chief (Top Bar)',
    category: 'ordinary',
    tincturesNeeded: 2,
    description: 'A horizontal band across the top third',
    preview: '▔',
    renderSVG: (tinctures, size = 200) => {
      const chiefHeight = size / 3;
      return `
        <rect x="0" y="0" width="${size}" height="${size}" fill="${tinctures[0]}"/>
        <rect x="0" y="0" width="${size}" height="${chiefHeight}" fill="${tinctures[1]}"/>
      `;
    }
  },
  base: {
    id: 'base',
    name: 'Base',
    displayName: 'Base (Bottom Bar)',
    category: 'ordinary',
    tincturesNeeded: 2,
    description: 'A horizontal band across the bottom third',
    preview: '▁',
    renderSVG: (tinctures, size = 200) => {
      const baseHeight = size / 3;
      return `
        <rect x="0" y="0" width="${size}" height="${size}" fill="${tinctures[0]}"/>
        <rect x="0" y="${size - baseHeight}" width="${size}" height="${baseHeight}" fill="${tinctures[1]}"/>
      `;
    }
  },
  pale: {
    id: 'pale',
    name: 'Pale',
    displayName: 'Pale (Center Vertical)',
    category: 'ordinary',
    tincturesNeeded: 2,
    description: 'A vertical band down the center',
    preview: '|',
    renderSVG: (tinctures, size = 200) => {
      const paleWidth = size / 3;
      const paleX = (size - paleWidth) / 2;
      return `
        <rect x="0" y="0" width="${size}" height="${size}" fill="${tinctures[0]}"/>
        <rect x="${paleX}" y="0" width="${paleWidth}" height="${size}" fill="${tinctures[1]}"/>
      `;
    }
  },
  fess: {
    id: 'fess',
    name: 'Fess',
    displayName: 'Fess (Center Horizontal)',
    category: 'ordinary',
    tincturesNeeded: 2,
    description: 'A horizontal band across the center',
    preview: '—',
    renderSVG: (tinctures, size = 200) => {
      const fessHeight = size / 3;
      const fessY = (size - fessHeight) / 2;
      return `
        <rect x="0" y="0" width="${size}" height="${size}" fill="${tinctures[0]}"/>
        <rect x="0" y="${fessY}" width="${size}" height="${fessHeight}" fill="${tinctures[1]}"/>
      `;
    }
  },
  bend: {
    id: 'bend',
    name: 'Bend',
    displayName: 'Bend (Diagonal Band)',
    category: 'ordinary',
    tincturesNeeded: 2,
    description: 'A diagonal band from top-left to bottom-right',
    preview: '╲',
    renderSVG: (tinctures, size = 200) => {
      const bandWidth = size / 4;
      return `
        <rect x="0" y="0" width="${size}" height="${size}" fill="${tinctures[0]}"/>
        <polygon points="0,${bandWidth} 0,0 ${bandWidth},0 ${size},${size - bandWidth} ${size},${size} ${size - bandWidth},${size}" fill="${tinctures[1]}"/>
      `;
    }
  },
  bendSinister: {
    id: 'bendSinister',
    name: 'Bend Sinister',
    displayName: 'Bend Sinister (Reverse Diagonal)',
    category: 'ordinary',
    tincturesNeeded: 2,
    description: 'A diagonal band from top-right to bottom-left',
    preview: '╱',
    renderSVG: (tinctures, size = 200) => {
      const bandWidth = size / 4;
      return `
        <rect x="0" y="0" width="${size}" height="${size}" fill="${tinctures[0]}"/>
        <polygon points="${size - bandWidth},0 ${size},0 ${size},${bandWidth} ${bandWidth},${size} 0,${size} 0,${size - bandWidth}" fill="${tinctures[1]}"/>
      `;
    }
  },
  chevron: {
    id: 'chevron',
    name: 'Chevron',
    displayName: 'Chevron',
    category: 'ordinary',
    tincturesNeeded: 2,
    description: 'An inverted V-shape pointing upward',
    preview: '^',
    renderSVG: (tinctures, size = 200) => {
      const mid = size / 2;
      const thickness = size / 5;
      return `
        <rect x="0" y="0" width="${size}" height="${size}" fill="${tinctures[0]}"/>
        <polygon points="0,${size * 0.7} ${mid},${size * 0.3} ${size},${size * 0.7} ${size},${size * 0.7 + thickness} ${mid},${size * 0.3 + thickness} 0,${size * 0.7 + thickness}" fill="${tinctures[1]}"/>
      `;
    }
  },
  saltire: {
    id: 'saltire',
    name: 'Saltire',
    displayName: 'Saltire (X Cross)',
    category: 'ordinary',
    tincturesNeeded: 2,
    description: 'A diagonal cross (X shape)',
    preview: '✕',
    renderSVG: (tinctures, size = 200) => {
      const bandWidth = size / 5;
      const half = bandWidth / 2;
      return `
        <rect x="0" y="0" width="${size}" height="${size}" fill="${tinctures[0]}"/>
        <polygon points="0,${half} 0,0 ${half},0 ${size},${size - half} ${size},${size} ${size - half},${size}" fill="${tinctures[1]}"/>
        <polygon points="${size - half},0 ${size},0 ${size},${half} ${half},${size} 0,${size} 0,${size - half}" fill="${tinctures[1]}"/>
      `;
    }
  },
  cross: {
    id: 'cross',
    name: 'Cross',
    displayName: 'Cross',
    category: 'ordinary',
    tincturesNeeded: 2,
    description: 'A vertical and horizontal cross',
    preview: '+',
    renderSVG: (tinctures, size = 200) => {
      const armWidth = size / 4;
      const armStart = (size - armWidth) / 2;
      return `
        <rect x="0" y="0" width="${size}" height="${size}" fill="${tinctures[0]}"/>
        <rect x="${armStart}" y="0" width="${armWidth}" height="${size}" fill="${tinctures[1]}"/>
        <rect x="0" y="${armStart}" width="${size}" height="${armWidth}" fill="${tinctures[1]}"/>
      `;
    }
  },
  bordure: {
    id: 'bordure',
    name: 'Bordure',
    displayName: 'Border',
    category: 'ordinary',
    tincturesNeeded: 2,
    description: 'A border around the entire shield',
    preview: '□',
    renderSVG: (tinctures, size = 200) => {
      const borderWidth = size / 7;
      return `
        <rect x="0" y="0" width="${size}" height="${size}" fill="${tinctures[1]}"/>
        <rect x="${borderWidth}" y="${borderWidth}" width="${size - borderWidth * 2}" height="${size - borderWidth * 2}" fill="${tinctures[0]}"/>
      `;
    }
  }
};

// ==================== COMBINED EXPORTS ====================

export const ALL_DIVISIONS = {
  ...PLAIN_DIVISIONS,
  ...PARTITION_DIVISIONS,
  ...COMPLEX_DIVISIONS,
  ...PATTERN_DIVISIONS,
  ...ORDINARY_DIVISIONS
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Get division by ID
 */
export function getDivision(id) {
  return ALL_DIVISIONS[id] || null;
}

/**
 * Get divisions organized by category
 */
export function getDivisionsByCategory() {
  return {
    plain: Object.values(PLAIN_DIVISIONS),
    partitions: Object.values(PARTITION_DIVISIONS),
    complex: Object.values(COMPLEX_DIVISIONS),
    patterns: Object.values(PATTERN_DIVISIONS),
    ordinaries: Object.values(ORDINARY_DIVISIONS)
  };
}

/**
 * Render a division's SVG content
 */
export function renderDivision(divisionId, tinctures, size = 200) {
  const division = getDivision(divisionId);
  if (!division) {
    // Fallback to plain
    return `<rect x="0" y="0" width="${size}" height="${size}" fill="${tinctures[0] || '#888'}"/>`;
  }
  
  return division.renderSVG(tinctures, size);
}

/**
 * Create complete SVG with division
 */
export function createDivisionSVG(divisionId, tinctures, size = 200) {
  const content = renderDivision(divisionId, tinctures, size);
  return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
${content}
</svg>`;
}

export default {
  PLAIN_DIVISIONS,
  PARTITION_DIVISIONS,
  COMPLEX_DIVISIONS,
  PATTERN_DIVISIONS,
  ORDINARY_DIVISIONS,
  ALL_DIVISIONS,
  getDivision,
  getDivisionsByCategory,
  renderDivision,
  createDivisionSVG
};
