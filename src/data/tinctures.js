/**
 * Tinctures Library - Traditional Heraldic Colors
 * 
 * This file defines all the tinctures (colors) available in the heraldry system.
 * Follows traditional heraldic conventions with fantasy extensions.
 * 
 * THE RULE OF TINCTURE:
 * In traditional heraldry, metal should not be placed on metal,
 * nor colour on colour. This ensures visibility and contrast.
 * We provide guidance but allow override for fantasy worlds.
 */

// ==================== METALS (Light Colors) ====================
// Metals are the "light" tinctures - gold and silver

export const METALS = {
  or: {
    id: 'or',
    name: 'Or',
    displayName: 'Gold',
    hex: '#FFD700',
    type: 'metal',
    description: 'The metal gold, representing generosity and elevation of the mind',
    aliases: ['gold', 'yellow']
  },
  argent: {
    id: 'argent',
    name: 'Argent',
    displayName: 'Silver',
    hex: '#FFFFFF',
    type: 'metal',
    description: 'The metal silver, representing peace and sincerity',
    aliases: ['silver', 'white']
  }
};

// ==================== COLOURS (Dark Colors) ====================
// Colours are the "dark" tinctures

export const COLOURS = {
  gules: {
    id: 'gules',
    name: 'Gules',
    displayName: 'Red',
    hex: '#DC143C',
    type: 'colour',
    description: 'Red, representing warrior and military strength',
    aliases: ['red', 'crimson']
  },
  azure: {
    id: 'azure',
    name: 'Azure',
    displayName: 'Blue',
    hex: '#0047AB',
    type: 'colour',
    description: 'Blue, representing truth and loyalty',
    aliases: ['blue']
  },
  sable: {
    id: 'sable',
    name: 'Sable',
    displayName: 'Black',
    hex: '#000000',
    type: 'colour',
    description: 'Black, representing constancy and grief',
    aliases: ['black']
  },
  vert: {
    id: 'vert',
    name: 'Vert',
    displayName: 'Green',
    hex: '#228B22',
    type: 'colour',
    description: 'Green, representing hope, joy, and loyalty in love',
    aliases: ['green']
  },
  purpure: {
    id: 'purpure',
    name: 'Purpure',
    displayName: 'Purple',
    hex: '#9B30FF',
    type: 'colour',
    description: 'Purple, representing royal majesty, sovereignty, and justice',
    aliases: ['purple', 'violet']
  }
};

// ==================== STAINS (Less Common Colors) ====================
// Stains are less common tinctures, sometimes considered "lesser"

export const STAINS = {
  tenne: {
    id: 'tenne',
    name: 'Tenné',
    displayName: 'Orange-Brown',
    hex: '#CD853F',
    type: 'stain',
    description: 'Orange-brown, representing ambition and endurance',
    aliases: ['tawny', 'orange']
  },
  sanguine: {
    id: 'sanguine',
    name: 'Sanguine',
    displayName: 'Blood Red',
    hex: '#8B0000',
    type: 'stain',
    description: 'Blood red, representing patience in battle',
    aliases: ['blood', 'dark red']
  },
  murrey: {
    id: 'murrey',
    name: 'Murrey',
    displayName: 'Mulberry',
    hex: '#8B008B',
    type: 'stain',
    description: 'Mulberry, a reddish-purple color',
    aliases: ['mulberry']
  }
};

// ==================== FURS (Patterns) ====================
// Furs are patterns rather than solid colors
// They can be placed on either metals or colours

export const FURS = {
  ermine: {
    id: 'ermine',
    name: 'Ermine',
    displayName: 'Ermine',
    pattern: 'ermine',
    background: '#FFFFFF',
    spots: '#000000',
    type: 'fur',
    description: 'White field with black ermine spots (tails)',
    canTouchMetal: true,
    canTouchColour: true
  },
  ermines: {
    id: 'ermines',
    name: 'Ermines',
    displayName: 'Counter-Ermine',
    pattern: 'ermines',
    background: '#000000',
    spots: '#FFFFFF',
    type: 'fur',
    description: 'Black field with white ermine spots (reverse of ermine)',
    canTouchMetal: true,
    canTouchColour: true
  },
  erminois: {
    id: 'erminois',
    name: 'Erminois',
    displayName: 'Erminois',
    pattern: 'erminois',
    background: '#FFD700',
    spots: '#000000',
    type: 'fur',
    description: 'Gold field with black ermine spots',
    canTouchMetal: true,
    canTouchColour: true
  },
  pean: {
    id: 'pean',
    name: 'Pean',
    displayName: 'Pean',
    pattern: 'pean',
    background: '#000000',
    spots: '#FFD700',
    type: 'fur',
    description: 'Black field with gold ermine spots',
    canTouchMetal: true,
    canTouchColour: true
  },
  vair: {
    id: 'vair',
    name: 'Vair',
    displayName: 'Vair',
    pattern: 'vair',
    color1: '#0047AB',
    color2: '#FFFFFF',
    type: 'fur',
    description: 'Blue and white bell-shaped pattern representing squirrel fur',
    canTouchMetal: true,
    canTouchColour: true
  },
  countervair: {
    id: 'countervair',
    name: 'Counter-Vair',
    displayName: 'Counter-Vair',
    pattern: 'countervair',
    color1: '#0047AB',
    color2: '#FFFFFF',
    type: 'fur',
    description: 'Vair with bells arranged base-to-base',
    canTouchMetal: true,
    canTouchColour: true
  },
  potent: {
    id: 'potent',
    name: 'Potent',
    displayName: 'Potent',
    pattern: 'potent',
    color1: '#0047AB',
    color2: '#FFFFFF',
    type: 'fur',
    description: 'Blue and white crutch-shaped (T-shaped) pattern',
    canTouchMetal: true,
    canTouchColour: true
  }
};

// ==================== FANTASY EXTENSIONS ====================
// Additional colors for fantasy worldbuilding

export const FANTASY_TINCTURES = {
  starfield: {
    id: 'starfield',
    name: 'Starfield',
    displayName: 'Night Sky',
    pattern: 'starfield',
    background: '#0a0a2e',
    stars: '#FFFFFF',
    type: 'fantasy',
    description: 'A deep night sky scattered with stars',
    isFantasy: true
  },
  flames: {
    id: 'flames',
    name: 'Flames',
    displayName: 'Living Fire',
    pattern: 'flames',
    colors: ['#FF4500', '#FF6600', '#FFD700'],
    type: 'fantasy',
    description: 'Animated flames pattern',
    isFantasy: true
  },
  void: {
    id: 'void',
    name: 'Void',
    displayName: 'The Void',
    hex: '#0a0a0a',
    pattern: 'void',
    type: 'fantasy',
    description: 'An absence of light, darker than black',
    isFantasy: true
  },
  prismatic: {
    id: 'prismatic',
    name: 'Prismatic',
    displayName: 'Rainbow',
    pattern: 'prismatic',
    colors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'],
    type: 'fantasy',
    description: 'Shifting rainbow colors, often magical',
    isFantasy: true
  }
};

// ==================== COMBINED EXPORTS ====================

// All solid tinctures (no patterns)
export const SOLID_TINCTURES = {
  ...METALS,
  ...COLOURS,
  ...STAINS
};

// All traditional tinctures
export const TRADITIONAL_TINCTURES = {
  ...METALS,
  ...COLOURS,
  ...STAINS,
  ...FURS
};

// Everything including fantasy
export const ALL_TINCTURES = {
  ...TRADITIONAL_TINCTURES,
  ...FANTASY_TINCTURES
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Get tincture by ID
 */
export function getTincture(id) {
  return ALL_TINCTURES[id] || null;
}

/**
 * Get tincture hex color (for solid tinctures)
 */
export function getTinctureColor(id) {
  const tincture = getTincture(id);
  if (!tincture) return '#888888';
  return tincture.hex || tincture.background || '#888888';
}

/**
 * Check if two tinctures violate the rule of tincture
 * Returns true if there's a violation
 */
export function checkRuleOfTincture(tincture1Id, tincture2Id) {
  const t1 = getTincture(tincture1Id);
  const t2 = getTincture(tincture2Id);
  
  if (!t1 || !t2) return false;
  
  // Furs can touch anything
  if (t1.type === 'fur' || t2.type === 'fur') return false;
  
  // Fantasy tinctures ignore rules
  if (t1.type === 'fantasy' || t2.type === 'fantasy') return false;
  
  // Metal on metal = violation
  if (t1.type === 'metal' && t2.type === 'metal') return true;
  
  // Colour on colour = violation (stains count as colours)
  const isColour1 = t1.type === 'colour' || t1.type === 'stain';
  const isColour2 = t2.type === 'colour' || t2.type === 'stain';
  if (isColour1 && isColour2) return true;
  
  return false;
}

/**
 * Get contrasting tinctures for a given tincture
 * (Tinctures that won't violate the rule)
 */
export function getContrastingTinctures(tinctureId) {
  const tincture = getTincture(tinctureId);
  if (!tincture) return Object.values(SOLID_TINCTURES);
  
  if (tincture.type === 'metal') {
    // Metals contrast with colours
    return [...Object.values(COLOURS), ...Object.values(STAINS)];
  } else if (tincture.type === 'colour' || tincture.type === 'stain') {
    // Colours contrast with metals
    return Object.values(METALS);
  }
  
  // Furs and fantasy can go with anything
  return Object.values(SOLID_TINCTURES);
}

/**
 * Get tinctures organized by type for UI display
 */
export function getTincturesByType(includeFantasy = false) {
  const groups = {
    metals: Object.values(METALS),
    colours: Object.values(COLOURS),
    stains: Object.values(STAINS),
    furs: Object.values(FURS)
  };
  
  if (includeFantasy) {
    groups.fantasy = Object.values(FANTASY_TINCTURES);
  }
  
  return groups;
}

export default {
  METALS,
  COLOURS,
  STAINS,
  FURS,
  FANTASY_TINCTURES,
  SOLID_TINCTURES,
  TRADITIONAL_TINCTURES,
  ALL_TINCTURES,
  getTincture,
  getTinctureColor,
  checkRuleOfTincture,
  getContrastingTinctures,
  getTincturesByType
};
