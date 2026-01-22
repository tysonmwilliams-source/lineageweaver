/**
 * Heraldic Data Definitions
 *
 * Constants for heraldry creation including:
 * - Tinctures (colors and metals)
 * - Line styles for partitions
 * - Field divisions (background patterns)
 * - Ordinaries (shapes placed on the field)
 * - Categories and arrangements
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TINCTURES
// ═══════════════════════════════════════════════════════════════════════════════

export const TINCTURES = {
  // Metals
  or: { hex: '#FFD700', name: 'Or (Gold)', type: 'metal' },
  argent: { hex: '#D8DEE9', name: 'Argent (Silver)', type: 'metal' },
  copper: { hex: '#B87333', name: 'Copper (Bronze)', type: 'metal' },
  steel: { hex: '#71797E', name: 'Steel (Grey)', type: 'metal' },

  // Traditional Colours
  gules: { hex: '#DC143C', name: 'Gules (Red)', type: 'colour' },
  azure: { hex: '#0047AB', name: 'Azure (Blue)', type: 'colour' },
  sable: { hex: '#000000', name: 'Sable (Black)', type: 'colour' },
  vert: { hex: '#228B22', name: 'Vert (Green)', type: 'colour' },
  purpure: { hex: '#9B30FF', name: 'Purpure (Purple)', type: 'colour' },

  // Historical Colours
  celeste: { hex: '#87CEEB', name: 'Celeste (Sky)', type: 'colour' },
  carnation: { hex: '#FFCBA4', name: 'Carnation (Flesh)', type: 'colour' },
  brunatre: { hex: '#8B4513', name: 'Brunâtre (Brown)', type: 'colour' },

  // Fantasy Colours
  crimson: { hex: '#990000', name: 'Crimson (Blood)', type: 'colour' },
  midnight: { hex: '#191970', name: 'Midnight (Navy)', type: 'colour' },
  jade: { hex: '#00A86B', name: 'Jade (Sea Green)', type: 'colour' },

  // Stains
  tenne: { hex: '#CD853F', name: 'Tenné (Orange-Brown)', type: 'stain' },
  sanguine: { hex: '#8B0000', name: 'Sanguine (Blood Red)', type: 'stain' },
  murrey: { hex: '#8B008B', name: 'Murrey (Mulberry)', type: 'stain' }
};

// ═══════════════════════════════════════════════════════════════════════════════
// LINE STYLES
// ═══════════════════════════════════════════════════════════════════════════════

export const LINE_STYLES = {
  straight: { name: 'Straight', description: 'Default straight line', blazon: '' },
  wavy: { name: 'Wavy', description: 'Undulating waves', blazon: 'wavy' },
  engrailed: { name: 'Engrailed', description: 'Scalloped outward', blazon: 'engrailed' },
  invected: { name: 'Invected', description: 'Scalloped inward', blazon: 'invected' },
  embattled: { name: 'Embattled', description: 'Battlements/crenellated', blazon: 'embattled' },
  indented: { name: 'Indented', description: 'Zigzag teeth', blazon: 'indented' },
  dancetty: { name: 'Dancetty', description: 'Large zigzag', blazon: 'dancetty' },
  raguly: { name: 'Raguly', description: 'Broken branch stubs', blazon: 'raguly' },
  dovetailed: { name: 'Dovetailed', description: 'Dovetail joints', blazon: 'dovetailed' },
  nebuly: { name: 'Nebuly', description: 'Cloud-like curves', blazon: 'nebuly' }
};

// ═══════════════════════════════════════════════════════════════════════════════
// FIELD DIVISIONS
// Patterns that divide the shield's background
// ═══════════════════════════════════════════════════════════════════════════════

export const FIELD_DIVISIONS = {
  // Simple
  plain: { name: 'Plain', description: 'Solid field', icon: '▮', group: 'simple', supportsLine: false },

  // Partitions (support line styles)
  perPale: { name: 'Per Pale', description: 'Vertical half', icon: '▐', group: 'partition', supportsLine: true },
  perFess: { name: 'Per Fess', description: 'Horizontal half', icon: '▄', group: 'partition', supportsLine: true },
  perBend: { name: 'Per Bend', description: 'Diagonal (dexter)', icon: '◢', group: 'partition', supportsLine: true },
  perBendSinister: { name: 'Per Bend Sinister', description: 'Diagonal (sinister)', icon: '◣', group: 'partition', supportsLine: true },
  perChevron: { name: 'Per Chevron', description: 'Chevron division', icon: '⌃', group: 'partition', supportsLine: true, supportsInvert: true },
  quarterly: { name: 'Quarterly', description: 'Four quarters', icon: '▚', group: 'partition', supportsLine: false },
  perSaltire: { name: 'Per Saltire', description: 'X-shaped quarters', icon: '╳', group: 'partition', supportsLine: false },

  // Stripes (support count)
  paly: { name: 'Paly', description: 'Vertical stripes', icon: '║', group: 'stripe', supportsCount: true, defaultCount: 6 },
  barry: { name: 'Barry', description: 'Horizontal stripes', icon: '═', group: 'stripe', supportsCount: true, defaultCount: 6 },
  bendy: { name: 'Bendy', description: 'Diagonal stripes', icon: '╲', group: 'stripe', supportsCount: true, defaultCount: 6 },
  bendySinister: { name: 'Bendy Sinister', description: 'Reverse diagonal', icon: '╱', group: 'stripe', supportsCount: true, defaultCount: 6 },

  // Complex patterns
  chequy: { name: 'Chequy', description: 'Checkerboard', icon: '▦', group: 'complex', supportsLine: false },
  lozengy: { name: 'Lozengy', description: 'Diamond pattern', icon: '◆', group: 'complex', supportsLine: false },
  fusily: { name: 'Fusily', description: 'Elongated diamonds', icon: '◇', group: 'complex', supportsLine: false },
  gyronny: { name: 'Gyronny', description: '8-way radial', icon: '✳', group: 'complex', supportsLine: false },

  // Tierced
  tiercedPale: { name: 'Tierced in Pale', description: 'Three vertical', icon: '▌', group: 'tierced', supportsLine: true },
  tiercedFess: { name: 'Tierced in Fess', description: 'Three horizontal', icon: '☷', group: 'tierced', supportsLine: true }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ORDINARIES
// Shapes placed ON TOP of the field - independent layers with their own tinctures
// ═══════════════════════════════════════════════════════════════════════════════

export const ORDINARIES = {
  chief: {
    name: 'Chief',
    description: 'Top band',
    icon: '▀',
    supportsLine: true,
    supportsThickness: true,
    blazonSingle: 'a chief',
    blazonPlural: null
  },
  base: {
    name: 'Base',
    description: 'Bottom band',
    icon: '▃',
    supportsLine: true,
    supportsThickness: true,
    blazonSingle: 'in base',
    blazonPlural: null
  },
  fess: {
    name: 'Fess',
    description: 'Horizontal band',
    icon: '▬',
    supportsLine: true,
    supportsThickness: true,
    supportsCount: true,
    maxCount: 3,
    blazonSingle: 'a fess',
    blazonPlural: { 2: 'two bars', 3: 'three bars' }
  },
  pale: {
    name: 'Pale',
    description: 'Vertical band',
    icon: '│',
    supportsLine: true,
    supportsThickness: true,
    supportsCount: true,
    maxCount: 3,
    blazonSingle: 'a pale',
    blazonPlural: { 2: 'two pallets', 3: 'three pallets' }
  },
  bend: {
    name: 'Bend',
    description: 'Diagonal band',
    icon: '╲',
    supportsLine: true,
    supportsThickness: true,
    supportsCount: true,
    maxCount: 3,
    blazonSingle: 'a bend',
    blazonPlural: { 2: 'two bendlets', 3: 'three bendlets' }
  },
  bendSinister: {
    name: 'Bend Sinister',
    description: 'Reverse diagonal band',
    icon: '╱',
    supportsLine: true,
    supportsThickness: true,
    supportsCount: true,
    maxCount: 3,
    blazonSingle: 'a bend sinister',
    blazonPlural: { 2: 'two bendlets sinister', 3: 'three bendlets sinister' }
  },
  chevron: {
    name: 'Chevron',
    description: 'V-shape',
    icon: '⌃',
    supportsLine: true,
    supportsThickness: true,
    supportsCount: true,
    maxCount: 3,
    supportsInvert: true,
    blazonSingle: 'a chevron',
    blazonPlural: { 2: 'two chevronels', 3: 'three chevronels' }
  },
  pile: {
    name: 'Pile',
    description: 'Triangle from top',
    icon: '▼',
    supportsLine: true,
    supportsInvert: true,
    supportsCount: true,
    maxCount: 3,
    blazonSingle: 'a pile',
    blazonPlural: { 2: 'two piles', 3: 'three piles' }
  },
  cross: {
    name: 'Cross',
    description: 'Cross shape',
    icon: '✚',
    supportsLine: true,
    supportsThickness: true,
    blazonSingle: 'a cross',
    blazonPlural: null
  },
  saltire: {
    name: 'Saltire',
    description: 'X-shape (St Andrew)',
    icon: '✕',
    supportsLine: true,
    supportsThickness: true,
    blazonSingle: 'a saltire',
    blazonPlural: null
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════════

export const CATEGORIES = [
  { id: 'noble', name: 'Noble Houses', icon: '🏰' },
  { id: 'personal', name: 'Personal Arms', icon: '👤' },
  { id: 'ecclesiastical', name: 'Ecclesiastical', icon: '⛪' },
  { id: 'civic', name: 'Civic', icon: '🏛️' },
  { id: 'guild', name: 'Guilds', icon: '⚒️' },
  { id: 'fantasy', name: 'Fantasy', icon: '✨' }
];

// ═══════════════════════════════════════════════════════════════════════════════
// CHARGE ARRANGEMENTS
// Positions for multiple charges on the shield
// ═══════════════════════════════════════════════════════════════════════════════

export const CHARGE_ARRANGEMENTS = {
  1: { fessPoint: [{ x: 100, y: 90 }] },
  2: {
    pale: [{ x: 100, y: 60 }, { x: 100, y: 130 }],
    fess: [{ x: 65, y: 90 }, { x: 135, y: 90 }]
  },
  3: {
    twoAndOne: [{ x: 65, y: 60 }, { x: 135, y: 60 }, { x: 100, y: 130 }],
    oneAndTwo: [{ x: 100, y: 50 }, { x: 65, y: 120 }, { x: 135, y: 120 }],
    pale: [{ x: 100, y: 40 }, { x: 100, y: 100 }, { x: 100, y: 160 }],
    fess: [{ x: 50, y: 90 }, { x: 100, y: 90 }, { x: 150, y: 90 }],
    bend: [{ x: 50, y: 50 }, { x: 100, y: 100 }, { x: 150, y: 150 }]
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// CHARGE SIZES
// ═══════════════════════════════════════════════════════════════════════════════

export const CHARGE_SIZES = {
  small: { name: 'Small', scale: 0.7 },
  medium: { name: 'Medium', scale: 0.9 },
  large: { name: 'Large', scale: 1.1 },
  xlarge: { name: 'X-Large', scale: 1.3 },
  xxlarge: { name: 'XX-Large', scale: 1.5 },
  massive: { name: 'Massive', scale: 1.7 },
  colossal: { name: 'Colossal', scale: 2.0 },
  titanic: { name: 'Titanic', scale: 2.3 }
};

// Shield types (currently using single default, but available for future expansion)
export const SHIELD_TYPES = [
  { id: 'default', name: 'Default', description: 'Standard shield shape', icon: '🛡️' },
  { id: 'heater', name: 'Heater', description: 'Classic medieval (c.1245)', icon: '🛡️' },
  { id: 'english', name: 'English', description: 'Late medieval (c.1403)', icon: '🏰' },
  { id: 'spanish', name: 'Spanish', description: 'Engrailed notched', icon: '🌙' },
  { id: 'swiss', name: 'Swiss', description: 'Engrailed peaked', icon: '⛰️' }
];
