/**
 * Heraldic Charges Library (Consolidated)
 * 
 * SVG path definitions for all heraldic charges.
 * All charges are defined in a 100x100 viewBox for consistent scaling.
 * Paths are designed to be filled with a single color (the charge's tincture).
 * 
 * This is the SINGLE SOURCE OF TRUTH for all charges in Lineageweaver.
 * Used by both the ChargesLibrary browser page and the HeraldryCreator.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CHARGE CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════════

export const CHARGE_CATEGORIES = {
  beasts: { name: 'Beasts', icon: '🦁' },
  birds: { name: 'Birds', icon: '🦅' },
  mythical: { name: 'Mythical', icon: '🐉' },
  crosses: { name: 'Crosses', icon: '✚' },
  celestial: { name: 'Celestial', icon: '⭐' },
  geometric: { name: 'Geometric', icon: '◆' },
  objects: { name: 'Objects', icon: '👑' },
  flora: { name: 'Flora', icon: '🌸' }
};

// ═══════════════════════════════════════════════════════════════════════════════
// POSITIONING OPTIONS
// Coordinates are for a 200x200 viewBox, adjusted for shield shape
// Shield usable area is roughly x: 20-180, y: 20-160 (bottom point limits depth)
// ═══════════════════════════════════════════════════════════════════════════════

export const CHARGE_POSITIONS = {
  // Single positions - adjusted for shield center of mass (slightly above geometric center)
  fessPoint: { name: 'Fess Point (Center)', x: 100, y: 90, single: true },
  chief: { name: 'In Chief', x: 100, y: 50, single: true },
  base: { name: 'In Base', x: 100, y: 135, single: true },
  dexter: { name: 'Dexter', x: 55, y: 90, single: true },
  sinister: { name: 'Sinister', x: 145, y: 90, single: true },
  
  // Honor points
  honorPoint: { name: 'Honor Point', x: 100, y: 65, single: true },
  nombrilPoint: { name: 'Nombril Point', x: 100, y: 115, single: true },
  
  // Corner positions
  chiefDexter: { name: 'Chief Dexter', x: 55, y: 50, single: true },
  chiefSinister: { name: 'Chief Sinister', x: 145, y: 50, single: true },
  baseDexter: { name: 'Base Dexter', x: 60, y: 130, single: true },
  baseSinister: { name: 'Base Sinister', x: 140, y: 130, single: true }
};

// Arrangements for multiple charges - adjusted for shield shape
export const CHARGE_ARRANGEMENTS = {
  1: {
    fessPoint: [{ x: 100, y: 90 }]
  },
  2: {
    pale: [{ x: 100, y: 55 }, { x: 100, y: 125 }],
    fess: [{ x: 60, y: 90 }, { x: 140, y: 90 }],
    bend: [{ x: 65, y: 60 }, { x: 135, y: 120 }]
  },
  3: {
    // 2 and 1 (most common) - two in chief, one in base
    twoAndOne: [{ x: 60, y: 55 }, { x: 140, y: 55 }, { x: 100, y: 120 }],
    // 1 and 2 - one in chief, two in base
    oneAndTwo: [{ x: 100, y: 50 }, { x: 65, y: 115 }, { x: 135, y: 115 }],
    // In pale (vertical line)
    pale: [{ x: 100, y: 40 }, { x: 100, y: 90 }, { x: 100, y: 140 }],
    // In fess (horizontal line)
    fess: [{ x: 45, y: 90 }, { x: 100, y: 90 }, { x: 155, y: 90 }],
    // In bend (diagonal)
    bend: [{ x: 55, y: 50 }, { x: 100, y: 90 }, { x: 145, y: 130 }]
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// SIZE OPTIONS
// Scale values represent the size relative to the 200x200 shield viewBox
// Charges are defined in 100x100, so scale 1.0 = 100px in the 200px shield
// ═══════════════════════════════════════════════════════════════════════════════

export const CHARGE_SIZES = {
  small: { name: 'Small', scale: 0.45, forCount: [2, 3] },
  medium: { name: 'Medium', scale: 0.65, forCount: [1, 2] },
  large: { name: 'Large', scale: 0.85, forCount: [1] },
  xlarge: { name: 'X-Large', scale: 1.05, forCount: [1] },
  huge: { name: 'Huge', scale: 1.25, forCount: [1] },
  massive: { name: 'Massive', scale: 1.5, forCount: [1] }
};

// ═══════════════════════════════════════════════════════════════════════════════
// CHARGE DEFINITIONS
// All paths are designed for a 100x100 viewBox, centered at 50,50
// ═══════════════════════════════════════════════════════════════════════════════

export const CHARGES = {
  // ─────────────────────────────────────────────────────────────────────────────
  // BEASTS
  // ─────────────────────────────────────────────────────────────────────────────
  
  lionRampant: {
    name: 'Lion Rampant',
    category: 'beasts',
    description: 'A lion standing on hind legs, facing dexter',
    blazonTerm: 'a lion rampant',
    path: `M 35 85 
           C 30 80, 28 70, 30 65 
           L 25 60 L 30 55 L 28 45 L 35 50 
           C 38 45, 42 40, 50 38 
           L 55 30 L 52 25 L 58 22 L 62 28 L 58 35 
           C 65 38, 70 42, 72 50 
           L 78 48 L 80 55 L 75 58 
           C 78 65, 76 75, 70 82 
           L 75 88 L 70 92 L 65 88 
           C 60 92, 55 94, 50 92 
           L 48 98 L 42 95 L 45 88 
           C 40 88, 36 87, 35 85 Z
           M 58 42 C 60 40, 63 41, 62 44 C 61 46, 58 45, 58 42 Z`,
    aspectRatio: 1
  },
  
  lionPassant: {
    name: 'Lion Passant',
    category: 'beasts',
    description: 'A lion walking, facing dexter',
    blazonTerm: 'a lion passant',
    path: `M 15 70 
           C 15 65, 18 60, 25 58 
           L 25 50 L 30 52 L 32 45 L 38 48 
           C 42 45, 48 44, 55 45 
           L 60 40 L 58 35 L 65 33 L 68 40 L 62 45 
           C 70 48, 78 55, 82 62 
           L 88 60 L 90 68 L 82 70 
           C 82 75, 78 78, 72 78 
           L 72 88 L 65 88 L 65 78 
           C 55 80, 45 80, 35 78 
           L 35 88 L 28 88 L 28 78 
           C 22 76, 18 73, 15 70 Z
           M 62 52 C 64 50, 67 51, 66 54 C 65 56, 62 55, 62 52 Z`,
    aspectRatio: 1.3
  },
  
  wolf: {
    name: 'Wolf',
    category: 'beasts',
    description: 'A wolf rampant',
    blazonTerm: 'a wolf rampant',
    path: `M 38 88 
           C 32 85, 28 78, 30 70 
           L 22 68 L 25 62 L 30 64 
           C 30 55, 35 45, 45 40 
           L 40 32 L 35 28 L 42 22 L 48 30 L 52 25 L 58 30 L 52 38 
           C 60 42, 68 50, 70 60 
           L 78 58 L 80 66 L 72 68 
           C 74 78, 70 86, 62 90 
           L 62 98 L 55 95 L 58 88 
           C 52 90, 45 90, 38 88 Z
           M 48 45 C 50 43, 53 44, 52 47 C 51 49, 48 48, 48 45 Z`,
    aspectRatio: 1
  },
  
  bear: {
    name: 'Bear',
    category: 'beasts',
    description: 'A bear rampant',
    blazonTerm: 'a bear rampant',
    path: `M 35 90 
           C 28 85, 25 75, 28 65 
           L 22 62 L 25 55 L 32 58 
           C 32 48, 38 38, 48 32 
           L 42 25 L 38 22 L 45 18 L 52 25 L 58 22 L 62 28 L 55 32 
           C 65 38, 72 50, 72 62 
           L 80 65 L 78 72 L 70 70 
           C 72 82, 68 90, 58 94 
           C 52 96, 45 95, 40 92 
           L 35 90 Z
           M 45 42 C 47 40, 50 41, 49 44 C 48 46, 45 45, 45 42 Z`,
    aspectRatio: 1
  },
  
  stag: {
    name: 'Stag',
    category: 'beasts',
    description: 'A male deer with antlers',
    blazonTerm: 'a stag',
    path: `M 35 90 L 37.5 77.5 L 32.5 70 L 35 60 L 30 50 L 35 45 L 32.5 35 L 27.5 27.5 
           L 30 22.5 L 35 25 L 40 20 L 42.5 25 L 47.5 22.5 L 45 30 L 50 27.5 L 47.5 35 
           L 55 32.5 L 52.5 40 L 57.5 42.5 L 52.5 47.5 L 57.5 52.5 L 50 57.5 L 55 65 
           L 50 72.5 L 55 80 L 50 87.5 L 45 90 L 35 90 Z
           M 62.5 50 L 65 42.5 L 72.5 45 L 70 37.5 L 77.5 40 L 75 32.5 L 82.5 35 
           L 87.5 40 L 85 47.5 L 80 52.5 L 72.5 50 L 67.5 55 L 62.5 50 Z`,
    aspectRatio: 1
  },
  
  boar: {
    name: 'Boar',
    category: 'beasts',
    description: 'A wild boar, symbol of courage',
    blazonTerm: 'a boar',
    path: `M 15 65 L 20 60 L 17.5 55 L 25 50 L 27.5 42.5 L 35 45 L 42.5 40 L 50 42.5 
           L 57.5 37.5 L 67.5 40 L 75 37.5 L 82.5 42.5 L 87.5 50 L 90 57.5 L 87.5 65 
           L 82.5 70 L 87.5 77.5 L 80 80 L 70 77.5 L 60 80 L 50 77.5 L 40 80 L 30 77.5 
           L 22.5 75 L 15 70 Z
           M 75 47.5 L 77.5 45 L 80 47.5 L 77.5 50 Z`,
    aspectRatio: 1.2
  },
  
  horse: {
    name: 'Horse',
    category: 'beasts',
    description: 'A horse rampant',
    blazonTerm: 'a horse rampant',
    path: `M 32.5 90 L 35 75 L 27.5 65 L 30 52.5 L 25 42.5 L 30 35 L 27.5 27.5 
           L 35 25 L 42.5 22.5 L 50 25 L 55 20 L 62.5 25 L 70 27.5 L 75 35 L 80 42.5 
           L 77.5 52.5 L 82.5 62.5 L 77.5 72.5 L 82.5 82.5 L 77.5 90 L 67.5 87.5 
           L 57.5 90 L 50 85 L 42.5 87.5 L 32.5 90 Z
           M 57.5 27.5 L 60 25 L 62.5 27.5 L 60 30 Z`,
    aspectRatio: 1
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // BIRDS
  // ─────────────────────────────────────────────────────────────────────────────
  
  eagleDisplayed: {
    name: 'Eagle Displayed',
    category: 'birds',
    description: 'An eagle with wings spread',
    blazonTerm: 'an eagle displayed',
    path: `M 50 15 
           L 48 25 L 45 22 L 42 30 L 38 25 L 35 35 
           C 25 32, 15 35, 10 45 
           L 18 48 L 12 55 L 22 55 L 18 62 L 28 58 
           C 25 70, 30 80, 38 85 
           L 35 95 L 42 92 L 45 98 L 50 90 
           L 55 98 L 58 92 L 65 95 L 62 85 
           C 70 80, 75 70, 72 58 
           L 82 62 L 78 55 L 88 55 L 82 48 L 90 45 
           C 85 35, 75 32, 65 35 
           L 62 25 L 58 30 L 55 22 L 52 25 L 50 15 Z
           M 45 45 C 47 43, 50 44, 49 47 C 48 49, 45 48, 45 45 Z
           M 55 45 C 57 43, 60 44, 59 47 C 58 49, 55 48, 55 45 Z`,
    aspectRatio: 1
  },
  
  raven: {
    name: 'Raven',
    category: 'birds',
    description: 'A raven',
    blazonTerm: 'a raven',
    path: `M 30 75 
           C 25 70, 25 60, 32 52 
           C 28 48, 28 40, 35 35 
           L 32 30 L 40 28 L 45 32 
           C 50 28, 58 28, 65 32 
           L 70 25 L 72 32 L 78 30 
           C 82 38, 80 48, 72 55 
           C 78 62, 78 72, 70 80 
           L 75 85 L 68 88 L 65 82 
           C 58 88, 45 88, 38 82 
           L 35 88 L 28 85 L 32 78 
           C 30 77, 30 76, 30 75 Z
           M 55 42 C 57 40, 60 41, 59 44 C 58 46, 55 45, 55 42 Z`,
    aspectRatio: 1.1
  },
  
  falcon: {
    name: 'Falcon',
    category: 'birds',
    description: 'A falcon, symbol of pursuit and hunting',
    blazonTerm: 'a falcon',
    path: `M 40 85 L 42.5 75 L 37.5 67.5 L 42.5 60 L 40 50 L 47.5 47.5 L 45 40 
           L 50 35 L 47.5 27.5 L 55 25 L 52.5 20 L 60 22.5 L 65 27.5 L 67.5 35 
           L 72.5 40 L 70 47.5 L 75 55 L 70 62.5 L 72.5 70 L 65 72.5 L 67.5 80 
           L 60 82.5 L 57.5 90 L 50 87.5 L 40 85 Z
           M 57.5 30 L 60 27.5 L 62.5 30 L 60 32.5 Z`,
    aspectRatio: 1
  },
  
  swan: {
    name: 'Swan',
    category: 'birds',
    description: 'A graceful swan, symbol of purity',
    blazonTerm: 'a swan',
    path: `M 20 65 L 25 60 L 27.5 50 L 25 40 L 30 32.5 L 27.5 25 L 35 22.5 
           L 42.5 25 L 47.5 22.5 L 50 27.5 L 55 25 L 57.5 30 L 62.5 35 L 60 42.5 
           L 65 50 L 70 57.5 L 77.5 62.5 L 85 65 L 87.5 72.5 L 82.5 77.5 L 72.5 80 
           L 62.5 77.5 L 52.5 80 L 42.5 77.5 L 32.5 80 L 25 75 L 20 70 Z
           M 45 27.5 L 47.5 25 L 50 27.5 L 47.5 30 Z`,
    aspectRatio: 1.1
  },
  
  owl: {
    name: 'Owl',
    category: 'birds',
    description: 'An owl, symbol of wisdom',
    blazonTerm: 'an owl',
    path: `M 35 87.5 L 37.5 77.5 L 32.5 70 L 35 60 L 30 52.5 L 35 45 L 32.5 37.5 
           L 40 32.5 L 37.5 25 L 47.5 25 L 50 20 L 52.5 25 L 62.5 25 L 60 32.5 
           L 67.5 37.5 L 65 45 L 70 52.5 L 65 60 L 67.5 70 L 62.5 77.5 L 65 87.5 
           L 55 85 L 50 90 L 45 85 L 35 87.5 Z
           M 40 42.5 L 45 40 L 47.5 45 L 42.5 47.5 Z
           M 52.5 45 L 57.5 40 L 60 42.5 L 55 47.5 Z
           M 47.5 55 L 50 52.5 L 52.5 55 L 50 57.5 Z`,
    aspectRatio: 1
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // MYTHICAL CREATURES
  // ─────────────────────────────────────────────────────────────────────────────
  
  dragon: {
    name: 'Dragon',
    category: 'mythical',
    description: 'A dragon rampant',
    blazonTerm: 'a dragon rampant',
    path: `M 30 88 
           C 25 82, 25 72, 30 65 
           L 20 62 L 15 55 L 25 52 L 22 45 L 30 48 
           C 32 40, 40 32, 50 28 
           L 48 18 L 55 15 L 58 22 L 65 18 L 68 25 L 60 30 
           C 70 35, 78 45, 80 58 
           L 88 55 L 90 65 L 80 68 
           L 85 78 L 78 82 L 72 75 
           C 68 85, 58 92, 45 92 
           L 42 98 L 35 95 L 38 88 
           L 30 88 Z
           M 52 38 C 54 36, 57 37, 56 40 C 55 42, 52 41, 52 38 Z`,
    aspectRatio: 1
  },
  
  griffin: {
    name: 'Griffin',
    category: 'mythical',
    description: 'A griffin with eagle head and lion body',
    blazonTerm: 'a griffin segreant',
    path: `M 27.5 90 L 30 75 L 25 65 L 27.5 55 L 22.5 45 L 27.5 37.5 L 25 27.5 
           L 32.5 25 L 37.5 20 L 45 22.5 L 50 17.5 L 57.5 22.5 L 65 25 L 72.5 32.5 
           L 77.5 27.5 L 80 37.5 L 85 45 L 82.5 55 L 87.5 65 L 82.5 75 L 85 90 
           L 72.5 87.5 L 62.5 90 L 52.5 85 L 42.5 87.5 L 32.5 90 Z
           M 50 25 L 52.5 22.5 L 55 25 L 52.5 27.5 Z
           M 72.5 37.5 L 80 35 L 87.5 40 L 85 47.5 L 77.5 45 L 72.5 42.5 Z`,
    aspectRatio: 1
  },
  
  unicorn: {
    name: 'Unicorn',
    category: 'mythical',
    description: 'A unicorn, symbol of purity and grace',
    blazonTerm: 'a unicorn rampant',
    path: `M 32.5 90 L 35 75 L 27.5 65 L 32.5 52.5 L 27.5 42.5 L 32.5 35 L 30 25 
           L 37.5 27.5 L 42.5 22.5 L 50 15 L 52.5 22.5 L 57.5 25 L 62.5 27.5 
           L 70 35 L 75 42.5 L 72.5 52.5 L 77.5 62.5 L 72.5 72.5 L 77.5 82.5 
           L 72.5 90 L 62.5 87.5 L 52.5 90 L 45 85 L 37.5 87.5 Z
           M 50 22.5 L 52.5 17.5 L 55 22.5 Z
           M 60 30 L 62.5 27.5 L 65 30 L 62.5 32.5 Z`,
    aspectRatio: 1
  },
  
  phoenix: {
    name: 'Phoenix',
    category: 'mythical',
    description: 'A phoenix rising from flames',
    blazonTerm: 'a phoenix',
    path: `M 50 12.5 L 47.5 20 L 42.5 17.5 L 45 27.5 L 37.5 25 L 42.5 35 L 32.5 35 
           L 40 45 L 27.5 47.5 L 40 55 L 30 60 L 42.5 65 L 37.5 72.5 L 47.5 72.5 
           L 45 82.5 L 50 77.5 L 55 82.5 L 52.5 72.5 L 62.5 72.5 L 57.5 65 L 70 60 
           L 60 55 L 72.5 47.5 L 60 45 L 67.5 35 L 57.5 35 L 62.5 25 L 55 27.5 
           L 57.5 17.5 L 52.5 20 Z
           M 45 40 L 50 35 L 55 40 L 50 45 Z`,
    aspectRatio: 1
  },
  
  wyvern: {
    name: 'Wyvern',
    category: 'mythical',
    description: 'A two-legged dragon with wings',
    blazonTerm: 'a wyvern',
    path: `M 50 15 L 45 22.5 L 37.5 20 L 40 30 L 30 27.5 L 35 40 L 22.5 42.5 
           L 35 50 L 27.5 60 L 40 62.5 L 37.5 75 L 45 72.5 L 47.5 85 L 50 77.5 
           L 52.5 85 L 55 72.5 L 62.5 75 L 60 62.5 L 72.5 60 L 65 50 L 77.5 42.5 
           L 65 40 L 70 27.5 L 60 30 L 62.5 20 L 55 22.5 Z
           M 45 37.5 L 47.5 35 L 50 37.5 L 47.5 40 Z
           M 50 37.5 L 52.5 35 L 55 37.5 L 52.5 40 Z`,
    aspectRatio: 1
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CROSSES
  // ─────────────────────────────────────────────────────────────────────────────
  
  cross: {
    name: 'Cross',
    category: 'crosses',
    description: 'A simple cross',
    blazonTerm: 'a cross',
    path: `M 42 10 L 58 10 L 58 42 L 90 42 L 90 58 L 58 58 L 58 90 L 42 90 L 42 58 L 10 58 L 10 42 L 42 42 Z`,
    aspectRatio: 1
  },
  
  crossPatee: {
    name: 'Cross Patée',
    category: 'crosses',
    description: 'A cross with arms widening at the ends',
    blazonTerm: 'a cross patée',
    path: `M 45 10 L 55 10 L 58 42 L 90 38 L 90 48 L 92 50 L 90 52 L 90 62 L 58 58 L 55 90 L 45 90 L 42 58 L 10 62 L 10 52 L 8 50 L 10 48 L 10 38 L 42 42 Z`,
    aspectRatio: 1
  },
  
  crossMoline: {
    name: 'Cross Moline',
    category: 'crosses',
    description: 'A cross with split and curved ends',
    blazonTerm: 'a cross moline',
    path: `M 44 15 C 40 10, 38 12, 38 18 L 44 25 L 44 44 L 25 44 L 18 38 C 12 38, 10 40, 15 44 
           L 15 56 C 10 60, 12 62, 18 62 L 25 56 L 44 56 L 44 75 L 38 82 C 38 88, 40 90, 44 85 
           L 56 85 C 60 90, 62 88, 62 82 L 56 75 L 56 56 L 75 56 L 82 62 C 88 62, 90 60, 85 56 
           L 85 44 C 90 40, 88 38, 82 38 L 75 44 L 56 44 L 56 25 L 62 18 C 62 12, 60 10, 56 15 Z`,
    aspectRatio: 1
  },
  
  crossMaltese: {
    name: 'Maltese Cross',
    category: 'crosses',
    description: 'An eight-pointed cross',
    blazonTerm: 'a cross of eight points',
    path: `M 50 8 L 58 35 L 65 28 L 72 35 L 65 42 L 92 50 L 65 58 L 72 65 L 65 72 L 58 65 
           L 50 92 L 42 65 L 35 72 L 28 65 L 35 58 L 8 50 L 35 42 L 28 35 L 35 28 L 42 35 Z`,
    aspectRatio: 1
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CELESTIAL
  // ─────────────────────────────────────────────────────────────────────────────
  
  mullet: {
    name: 'Mullet (Star)',
    category: 'celestial',
    description: 'A five-pointed star',
    blazonTerm: 'a mullet',
    path: `M 50 10 L 58 38 L 90 38 L 64 56 L 74 88 L 50 68 L 26 88 L 36 56 L 10 38 L 42 38 Z`,
    aspectRatio: 1
  },
  
  estoile: {
    name: 'Estoile',
    category: 'celestial',
    description: 'A six-pointed wavy star',
    blazonTerm: 'an estoile',
    path: `M 50 5 Q 55 30 50 35 Q 45 30 50 5 
           M 85 25 Q 62 38 58 35 Q 62 30 85 25 
           M 85 75 Q 62 62 58 65 Q 62 70 85 75 
           M 50 95 Q 45 70 50 65 Q 55 70 50 95 
           M 15 75 Q 38 62 42 65 Q 38 70 15 75 
           M 15 25 Q 38 38 42 35 Q 38 30 15 25 Z`,
    aspectRatio: 1
  },
  
  sunInSplendor: {
    name: 'Sun in Splendor',
    category: 'celestial',
    description: 'A sun with face and rays',
    blazonTerm: 'a sun in splendor',
    path: `M 50 15 L 54 30 L 68 18 L 62 32 L 80 28 L 70 40 L 88 42 L 74 50 L 88 58 L 70 60 
           L 80 72 L 62 68 L 68 82 L 54 70 L 50 85 L 46 70 L 32 82 L 38 68 L 20 72 L 30 60 
           L 12 58 L 26 50 L 12 42 L 30 40 L 20 28 L 38 32 L 32 18 L 46 30 Z
           M 50 35 A 15 15 0 1 1 50 65 A 15 15 0 1 1 50 35 Z`,
    aspectRatio: 1
  },
  
  crescent: {
    name: 'Crescent',
    category: 'celestial',
    description: 'A crescent moon',
    blazonTerm: 'a crescent',
    path: `M 50 15 
           C 25 15, 10 35, 10 55 
           C 10 75, 25 90, 50 90 
           C 75 90, 90 75, 90 55 
           C 90 35, 75 15, 50 15 
           M 50 25 
           C 68 25, 78 40, 78 55 
           C 78 70, 68 82, 50 82 
           C 32 82, 22 70, 22 55 
           C 22 40, 32 25, 50 25 Z`,
    aspectRatio: 1
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // GEOMETRIC
  // ─────────────────────────────────────────────────────────────────────────────
  
  roundel: {
    name: 'Roundel',
    category: 'geometric',
    description: 'A solid disc',
    blazonTerm: 'a roundel',
    path: `M 50 10 A 40 40 0 1 1 50 90 A 40 40 0 1 1 50 10 Z`,
    aspectRatio: 1
  },
  
  lozenge: {
    name: 'Lozenge',
    category: 'geometric',
    description: 'A diamond shape',
    blazonTerm: 'a lozenge',
    path: `M 50 10 L 85 50 L 50 90 L 15 50 Z`,
    aspectRatio: 1
  },
  
  escutcheon: {
    name: 'Escutcheon',
    category: 'geometric',
    description: 'A small shield shape',
    blazonTerm: 'an escutcheon',
    path: `M 15 15 L 85 15 L 85 55 C 85 75, 68 90, 50 92 C 32 90, 15 75, 15 55 Z`,
    aspectRatio: 0.9
  },
  
  billet: {
    name: 'Billet',
    category: 'geometric',
    description: 'A rectangle',
    blazonTerm: 'a billet',
    path: `M 30 15 L 70 15 L 70 85 L 30 85 Z`,
    aspectRatio: 0.6
  },
  
  annulet: {
    name: 'Annulet',
    category: 'geometric',
    description: 'A ring shape',
    blazonTerm: 'an annulet',
    path: `M 50 5 A 45 45 0 1 1 50 95 A 45 45 0 1 1 50 5 Z M 50 20 A 30 30 0 1 0 50 80 A 30 30 0 1 0 50 20 Z`,
    aspectRatio: 1
  },
  
  mascle: {
    name: 'Mascle',
    category: 'geometric',
    description: 'A hollow diamond',
    blazonTerm: 'a mascle',
    path: `M 50 5 L 95 50 L 50 95 L 5 50 Z M 50 20 L 80 50 L 50 80 L 20 50 Z`,
    aspectRatio: 1
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // OBJECTS
  // ─────────────────────────────────────────────────────────────────────────────
  
  crown: {
    name: 'Crown',
    category: 'objects',
    description: 'A royal crown',
    blazonTerm: 'a crown',
    path: `M 15 70 L 15 50 L 25 60 L 35 45 L 50 60 L 65 45 L 75 60 L 85 50 L 85 70 
           C 85 80, 75 85, 50 85 C 25 85, 15 80, 15 70 Z
           M 20 48 A 5 5 0 1 1 20 38 A 5 5 0 1 1 20 48
           M 35 38 A 5 5 0 1 1 35 28 A 5 5 0 1 1 35 38
           M 50 42 A 6 6 0 1 1 50 30 A 6 6 0 1 1 50 42
           M 65 38 A 5 5 0 1 1 65 28 A 5 5 0 1 1 65 38
           M 80 48 A 5 5 0 1 1 80 38 A 5 5 0 1 1 80 48`,
    aspectRatio: 1.2
  },
  
  sword: {
    name: 'Sword',
    category: 'objects',
    description: 'A sword pointing upward',
    blazonTerm: 'a sword',
    path: `M 47 10 L 53 10 L 54 65 L 65 65 L 65 72 L 54 72 L 54 78 L 58 78 L 58 85 L 42 85 L 42 78 L 46 78 L 46 72 L 35 72 L 35 65 L 46 65 Z`,
    aspectRatio: 0.5
  },
  
  tower: {
    name: 'Tower',
    category: 'objects',
    description: 'A castle tower',
    blazonTerm: 'a tower',
    path: `M 25 90 L 25 45 L 20 45 L 20 35 L 28 35 L 28 25 L 22 25 L 22 15 L 32 15 L 32 25 
           L 42 25 L 42 15 L 50 15 L 50 25 L 58 25 L 58 15 L 68 15 L 68 25 L 78 25 L 78 15 
           L 78 25 L 72 25 L 72 35 L 80 35 L 80 45 L 75 45 L 75 90 Z
           M 40 90 L 40 65 C 40 58, 50 55, 50 55 C 50 55, 60 58, 60 65 L 60 90 Z`,
    aspectRatio: 0.8
  },
  
  key: {
    name: 'Key',
    category: 'objects',
    description: 'A key',
    blazonTerm: 'a key',
    path: `M 50 15 A 18 18 0 1 1 50 51 L 47 51 L 47 60 L 55 60 L 55 65 L 47 65 L 47 75 L 55 75 L 55 80 L 47 80 L 47 90 L 53 90 L 53 51 
           A 18 18 0 1 1 50 15 Z
           M 50 25 A 8 8 0 1 0 50 41 A 8 8 0 1 0 50 25 Z`,
    aspectRatio: 0.6
  },
  
  fleurDeLis: {
    name: 'Fleur-de-lis',
    category: 'objects',
    description: 'A stylized lily',
    blazonTerm: 'a fleur-de-lis',
    path: `M 50 8 C 50 8, 55 25, 55 35 C 62 30, 75 28, 82 38 C 88 48, 82 58, 72 58 
           L 72 62 C 78 62, 85 70, 85 78 L 75 78 C 75 72, 68 68, 60 68 L 60 75 L 55 75 L 55 92 L 45 92 L 45 75 L 40 75 L 40 68 
           C 32 68, 25 72, 25 78 L 15 78 C 15 70, 22 62, 28 62 L 28 58 
           C 18 58, 12 48, 18 38 C 25 28, 38 30, 45 35 C 45 25, 50 8, 50 8 Z`,
    aspectRatio: 0.85
  },
  
  anchor: {
    name: 'Anchor',
    category: 'objects',
    description: 'An anchor, symbol of hope and maritime tradition',
    blazonTerm: 'an anchor',
    path: `M 50 17.5 L 55 17.5 L 55 22.5 L 52.5 22.5 L 52.5 37.5 L 65 37.5 L 65 42.5 
           L 52.5 42.5 L 52.5 72.5 L 67.5 65 L 70 70 L 52.5 80 L 52.5 85 L 47.5 85 
           L 47.5 80 L 30 70 L 32.5 65 L 47.5 72.5 L 47.5 42.5 L 35 42.5 L 35 37.5 
           L 47.5 37.5 L 47.5 22.5 L 45 22.5 L 45 17.5 Z
           M 47.5 25 L 50 22.5 L 52.5 25 L 52.5 30 L 47.5 30 Z`,
    aspectRatio: 0.7
  },
  
  book: {
    name: 'Book',
    category: 'objects',
    description: 'An open book, symbol of knowledge',
    blazonTerm: 'a book',
    path: `M 25 30 L 50 35 L 75 30 L 75 75 L 50 80 L 25 75 Z
           M 27.5 32.5 L 27.5 72.5 L 47.5 77.5 L 47.5 37.5 Z
           M 52.5 37.5 L 52.5 77.5 L 72.5 72.5 L 72.5 32.5 Z`,
    aspectRatio: 1
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // FLORA
  // ─────────────────────────────────────────────────────────────────────────────
  
  rose: {
    name: 'Rose',
    category: 'flora',
    description: 'A heraldic rose',
    blazonTerm: 'a rose',
    path: `M 50 20 C 58 20, 62 28, 58 35 C 70 32, 78 40, 75 50 
           C 82 55, 80 68, 70 70 C 75 80, 65 88, 55 82 
           C 50 90, 40 88, 38 80 C 28 85, 18 75, 25 65 
           C 15 58, 20 45, 32 45 C 28 35, 38 25, 50 20 Z
           M 50 35 A 15 15 0 1 1 50 65 A 15 15 0 1 1 50 35 Z`,
    aspectRatio: 1
  },
  
  trefoil: {
    name: 'Trefoil',
    category: 'flora',
    description: 'A three-leafed clover',
    blazonTerm: 'a trefoil',
    path: `M 50 18 C 65 18, 72 32, 65 45 C 80 42, 88 58, 78 72 C 68 85, 52 82, 50 70 
           C 48 82, 32 85, 22 72 C 12 58, 20 42, 35 45 C 28 32, 35 18, 50 18 Z
           M 50 70 L 50 92 L 45 92 L 45 75 L 50 70 Z`,
    aspectRatio: 0.9
  },
  
  oak: {
    name: 'Oak Leaf',
    category: 'flora',
    description: 'An oak leaf',
    blazonTerm: 'an oak leaf',
    path: `M 50 15 C 55 20, 62 18, 65 25 C 72 22, 78 28, 75 38 C 82 38, 85 48, 78 55 
           C 85 60, 82 72, 72 72 C 75 82, 65 88, 55 85 L 50 92 L 45 85 
           C 35 88, 25 82, 28 72 C 18 72, 15 60, 22 55 C 15 48, 18 38, 25 38 
           C 22 28, 28 22, 35 25 C 38 18, 45 20, 50 15 Z`,
    aspectRatio: 0.85
  },
  
  lily: {
    name: 'Lily',
    category: 'flora',
    description: 'A lily flower',
    blazonTerm: 'a lily',
    path: `M 50 15 L 52.5 25 L 57.5 22.5 L 55 32.5 L 62.5 30 L 57.5 42.5 L 65 47.5 
           L 55 50 L 57.5 65 L 62.5 75 L 57.5 77.5 L 55 72.5 L 50 80 L 45 72.5 
           L 42.5 77.5 L 37.5 75 L 42.5 65 L 45 50 L 35 47.5 L 42.5 42.5 L 37.5 30 
           L 45 32.5 L 42.5 22.5 L 47.5 25 Z`,
    aspectRatio: 0.9
  },
  
  thistle: {
    name: 'Thistle',
    category: 'flora',
    description: 'A thistle, symbol of Scotland',
    blazonTerm: 'a thistle',
    path: `M 50 17.5 L 45 25 L 40 22.5 L 42.5 30 L 35 32.5 L 40 40 L 32.5 45 
           L 42.5 50 L 40 57.5 L 45 55 L 47.5 62.5 L 50 57.5 L 52.5 62.5 L 55 55 
           L 60 57.5 L 57.5 50 L 67.5 45 L 60 40 L 65 32.5 L 57.5 30 L 60 22.5 
           L 55 25 Z
           M 47.5 70 L 50 65 L 52.5 70 L 52.5 85 L 47.5 85 Z`,
    aspectRatio: 0.85
  },
  
  wheat: {
    name: 'Wheat Sheaf',
    category: 'flora',
    description: 'A sheaf of wheat, symbol of plenty',
    blazonTerm: 'a garb',
    path: `M 42.5 85 L 45 70 L 40 60 L 45 50 L 42.5 40 L 47.5 35 L 45 27.5 
           L 50 22.5 L 55 27.5 L 52.5 35 L 57.5 40 L 55 50 L 60 60 L 55 70 
           L 57.5 85 L 50 82.5 Z
           M 37.5 55 L 32.5 50 L 35 42.5 L 40 47.5 Z
           M 62.5 55 L 67.5 50 L 65 42.5 L 60 47.5 Z`,
    aspectRatio: 0.8
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get a single charge by ID
 */
export function getCharge(id) {
  return CHARGES[id] || null;
}

/**
 * Get charges filtered by category
 */
export function getChargesByCategory(categoryId) {
  return Object.entries(CHARGES)
    .filter(([_, charge]) => charge.category === categoryId)
    .map(([id, charge]) => ({ id, ...charge }));
}

/**
 * Get all charges as an array with their IDs
 */
export function getAllCharges() {
  return Object.entries(CHARGES).map(([id, charge]) => ({ id, ...charge }));
}

/**
 * Search charges by name or description
 */
export function searchCharges(term) {
  const searchTerm = term.toLowerCase();
  return Object.entries(CHARGES)
    .filter(([_, charge]) =>
      charge.name.toLowerCase().includes(searchTerm) ||
      charge.description.toLowerCase().includes(searchTerm) ||
      charge.category.toLowerCase().includes(searchTerm)
    )
    .map(([id, charge]) => ({ id, ...charge }));
}

/**
 * Render a charge as a complete SVG string
 * Used for previews in the ChargesLibrary
 * 
 * @param {string} chargeId - The charge identifier
 * @param {string} color - The hex color to fill
 * @param {number} size - The width/height in pixels
 * @returns {string} Complete SVG markup
 */
export function renderCharge(chargeId, color, size = 100) {
  const charge = CHARGES[chargeId];
  if (!charge) return '';
  
  const coloredPath = charge.path.replace(/currentColor/g, color);
  
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <path d="${coloredPath}" fill="${color}" stroke="none"/>
  </svg>`;
}

/**
 * Generate SVG for a charge at a specific position and size
 * Used by HeraldryCreator for placing charges on shields
 * 
 * @param {string} chargeId - The charge identifier
 * @param {string} tincture - The hex color to fill
 * @param {number} x - Center X position (in 200x200 viewBox)
 * @param {number} y - Center Y position (in 200x200 viewBox)
 * @param {number} size - Scale factor (0.5 = small, 0.7 = medium, 0.9 = large)
 * @returns {string} SVG group element string
 */
export function generateChargeSVG(chargeId, tincture, x, y, size = 0.7) {
  const charge = CHARGES[chargeId];
  if (!charge) return '';
  
  // Base size is 100x100, we scale and translate
  const scaledSize = 100 * size;
  const offsetX = x - scaledSize / 2;
  const offsetY = y - scaledSize / 2;
  
  return `<g transform="translate(${offsetX}, ${offsetY}) scale(${size})">
    <path d="${charge.path}" fill="${tincture}" stroke="none"/>
  </g>`;
}

/**
 * Generate SVG for multiple charges in an arrangement
 * 
 * @param {string} chargeId - The charge identifier
 * @param {string} tincture - The hex color to fill
 * @param {number} count - Number of charges (1-3)
 * @param {string} arrangement - Arrangement type
 * @param {number} size - Scale factor
 * @returns {string} SVG string with all charges
 */
export function generateChargeArrangementSVG(chargeId, tincture, count, arrangement, size) {
  const arrangements = CHARGE_ARRANGEMENTS[count];
  if (!arrangements) return '';
  
  const positions = arrangements[arrangement] || arrangements[Object.keys(arrangements)[0]];
  if (!positions) return '';
  
  // Adjust size based on count - more charges = smaller each
  // For 2 charges, reduce to 70% of selected size
  // For 3 charges, reduce to 55% of selected size
  const countMultiplier = count === 1 ? 1.0 : count === 2 ? 0.7 : 0.55;
  const adjustedSize = size * countMultiplier;
  
  return positions
    .map(pos => generateChargeSVG(chargeId, tincture, pos.x, pos.y, adjustedSize))
    .join('\n');
}

/**
 * Generate blazon text for a charge
 */
export function generateChargeBlazon(chargeId, tinctureName, count = 1) {
  const charge = CHARGES[chargeId];
  if (!charge) return '';
  
  let term = charge.blazonTerm;
  
  // Pluralize if needed
  if (count > 1) {
    // Simple pluralization - could be expanded for irregular forms
    if (term.startsWith('a ')) {
      term = term.replace('a ', `${count} `);
      // Add 's' to the noun
      term = term.replace(/(\w+)$/, '$1s');
    } else if (term.startsWith('an ')) {
      term = term.replace('an ', `${count} `);
      term = term.replace(/(\w+)$/, '$1s');
    }
  }
  
  return `${term} ${tinctureName}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONVENIENCE EXPORTS
// For backwards compatibility and easier imports
// ═══════════════════════════════════════════════════════════════════════════════

// Export ALL_CHARGES as an alias for components that use that name
export const ALL_CHARGES = CHARGES;

export default {
  CHARGES,
  ALL_CHARGES,
  CHARGE_CATEGORIES,
  CHARGE_POSITIONS,
  CHARGE_ARRANGEMENTS,
  CHARGE_SIZES,
  getCharge,
  getChargesByCategory,
  getAllCharges,
  searchCharges,
  renderCharge,
  generateChargeSVG,
  generateChargeArrangementSVG,
  generateChargeBlazon
};
