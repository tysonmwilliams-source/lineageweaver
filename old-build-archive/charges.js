/**
 * Charges Library - Heraldic Symbols and Emblems
 * 
 * This file defines the built-in charges (symbols) available in the heraldry system.
 * Charges are organized by category for easy browsing.
 * 
 * CHARGE CATEGORIES:
 * - Beasts: Lions, wolves, bears, etc.
 * - Birds: Eagles, falcons, ravens, etc.
 * - Mythical: Dragons, griffins, unicorns, etc.
 * - Flora: Roses, trees, leaves, etc.
 * - Objects: Swords, crowns, keys, etc.
 * - Celestial: Sun, moon, stars, etc.
 * - Geometric: Basic shapes used as charges
 * 
 * Each charge includes:
 * - SVG path data for rendering
 * - Available attitudes (positions)
 * - Default tincture suggestions
 */

// ==================== BEASTS ====================

export const BEASTS = {
  lionRampant: {
    id: 'lionRampant',
    name: 'Lion Rampant',
    category: 'beasts',
    description: 'A lion standing on one hind leg with forepaws raised',
    attitude: 'rampant',
    defaultTincture: 'or',
    // Simplified lion silhouette - in production, use detailed SVG
    svg: `<path d="M60 180 L60 140 L50 120 L60 100 L55 80 L70 70 L85 75 L95 65 L110 70 L120 60 L130 70 L140 65 L145 80 L155 90 L150 100 L160 120 L150 130 L155 150 L145 160 L150 180 L130 175 L120 180 L100 170 L90 180 L80 175 L60 180 Z M110 85 L115 80 L120 85 L115 90 Z" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  },
  lionPassant: {
    id: 'lionPassant',
    name: 'Lion Passant',
    category: 'beasts',
    description: 'A lion walking with one forepaw raised',
    attitude: 'passant',
    defaultTincture: 'or',
    svg: `<path d="M30 140 L40 130 L50 135 L60 125 L75 130 L90 120 L100 125 L110 115 L125 120 L130 110 L140 115 L145 105 L155 110 L160 100 L170 105 L175 120 L170 135 L175 150 L165 160 L175 170 L160 175 L145 170 L130 175 L115 170 L100 175 L85 170 L70 175 L55 170 L40 165 L30 155 Z M145 115 L150 110 L155 115 L150 120 Z" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  },
  wolf: {
    id: 'wolf',
    name: 'Wolf',
    category: 'beasts',
    description: 'A wolf, often shown rampant or passant',
    attitude: 'rampant',
    defaultTincture: 'sable',
    svg: `<path d="M55 180 L60 150 L50 130 L55 110 L65 95 L60 80 L75 70 L90 65 L100 55 L115 60 L130 55 L145 65 L155 60 L160 75 L170 85 L165 100 L175 115 L165 130 L170 150 L160 165 L170 180 L145 175 L125 180 L105 170 L85 175 L65 180 Z M120 75 L125 70 L130 75 L125 80 Z" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  },
  bear: {
    id: 'bear',
    name: 'Bear',
    category: 'beasts',
    description: 'A bear, symbol of strength and protection',
    attitude: 'rampant',
    defaultTincture: 'sable',
    svg: `<path d="M50 180 L55 145 L45 120 L55 95 L50 75 L65 65 L75 55 L90 60 L100 50 L115 55 L130 50 L145 60 L155 55 L165 70 L175 85 L170 105 L180 125 L170 150 L175 180 L150 175 L130 180 L110 170 L90 175 L70 180 Z M105 70 L110 65 L115 70 L110 75 Z M130 70 L135 65 L140 70 L135 75 Z" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  },
  stag: {
    id: 'stag',
    name: 'Stag',
    category: 'beasts',
    description: 'A male deer with antlers',
    attitude: 'statant',
    defaultTincture: 'argent',
    svg: `<path d="M70 180 L75 155 L65 140 L70 120 L60 100 L70 90 L65 70 L55 55 L60 45 L70 50 L80 40 L85 50 L95 45 L90 60 L100 55 L95 70 L110 65 L105 80 L115 85 L105 95 L115 105 L100 115 L110 130 L100 145 L110 160 L100 175 L90 180 L70 180 Z M125 100 L130 85 L145 90 L140 75 L155 80 L150 65 L165 70 L175 80 L170 95 L160 105 L145 100 L135 110 L125 100 Z" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  },
  boar: {
    id: 'boar',
    name: 'Boar',
    category: 'beasts',
    description: 'A wild boar, symbol of courage',
    attitude: 'passant',
    defaultTincture: 'sable',
    svg: `<path d="M30 130 L40 120 L35 110 L50 100 L55 85 L70 90 L85 80 L100 85 L115 75 L135 80 L150 75 L165 85 L175 100 L180 115 L175 130 L165 140 L175 155 L160 160 L140 155 L120 160 L100 155 L80 160 L60 155 L45 150 L30 140 Z M150 95 L155 90 L160 95 L155 100 Z" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  },
  horse: {
    id: 'horse',
    name: 'Horse',
    category: 'beasts',
    description: 'A horse, often shown rampant or courant',
    attitude: 'rampant',
    defaultTincture: 'argent',
    svg: `<path d="M65 180 L70 150 L55 130 L60 105 L50 85 L60 70 L55 55 L70 50 L85 45 L100 50 L110 40 L125 50 L140 55 L150 70 L160 85 L155 105 L165 125 L155 145 L165 165 L155 180 L135 175 L115 180 L100 170 L85 175 L65 180 Z M115 55 L120 50 L125 55 L120 60 Z" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  }
};

// ==================== BIRDS ====================

export const BIRDS = {
  eagleDisplayed: {
    id: 'eagleDisplayed',
    name: 'Eagle Displayed',
    category: 'birds',
    description: 'An eagle with wings spread wide, facing the viewer',
    attitude: 'displayed',
    defaultTincture: 'sable',
    svg: `<path d="M100 30 L95 45 L85 40 L80 55 L70 50 L65 65 L55 60 L50 80 L35 75 L40 95 L25 100 L40 110 L30 125 L50 130 L45 145 L65 145 L60 160 L75 155 L80 170 L90 160 L100 175 L110 160 L120 170 L125 155 L140 160 L135 145 L155 145 L150 130 L170 125 L160 110 L175 100 L160 95 L165 75 L150 80 L145 60 L135 65 L130 50 L120 55 L115 40 L105 45 Z M90 80 L95 75 L100 80 L95 85 Z M100 80 L105 75 L110 80 L105 85 Z" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  },
  falcon: {
    id: 'falcon',
    name: 'Falcon',
    category: 'birds',
    description: 'A falcon, symbol of pursuit and hunting',
    attitude: 'close',
    defaultTincture: 'argent',
    svg: `<path d="M80 170 L85 150 L75 135 L85 120 L80 100 L95 95 L90 80 L100 70 L95 55 L110 50 L105 40 L120 45 L130 55 L135 70 L145 80 L140 95 L150 110 L140 125 L145 140 L130 145 L135 160 L120 165 L115 180 L100 175 L80 170 Z M115 60 L120 55 L125 60 L120 65 Z" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  },
  swan: {
    id: 'swan',
    name: 'Swan',
    category: 'birds',
    description: 'A graceful swan, symbol of purity',
    attitude: 'naiant',
    defaultTincture: 'argent',
    svg: `<path d="M40 130 L50 120 L55 100 L50 80 L60 65 L55 50 L70 45 L85 50 L95 45 L100 55 L110 50 L115 60 L125 70 L120 85 L130 100 L140 115 L155 125 L170 130 L175 145 L165 155 L145 160 L125 155 L105 160 L85 155 L65 160 L50 150 L40 140 Z M90 55 L95 50 L100 55 L95 60 Z" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  },
  raven: {
    id: 'raven',
    name: 'Raven',
    category: 'birds',
    description: 'A raven, often associated with wisdom or prophecy',
    attitude: 'close',
    defaultTincture: 'sable',
    svg: `<path d="M70 170 L75 145 L65 125 L75 105 L70 85 L85 80 L80 65 L95 60 L90 45 L110 45 L120 55 L130 50 L140 60 L145 75 L155 85 L150 100 L160 115 L150 130 L155 145 L140 150 L130 165 L115 170 L100 165 L85 170 Z M115 55 L120 50 L125 55 L120 60 Z" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  },
  owl: {
    id: 'owl',
    name: 'Owl',
    category: 'birds',
    description: 'An owl, symbol of wisdom',
    attitude: 'guardant',
    defaultTincture: 'argent',
    svg: `<path d="M70 175 L75 155 L65 140 L70 120 L60 105 L70 90 L65 75 L80 65 L75 50 L95 50 L100 40 L105 50 L125 50 L120 65 L135 75 L130 90 L140 105 L130 120 L135 140 L125 155 L130 175 L110 170 L100 180 L90 170 L70 175 Z M80 85 L90 80 L95 90 L85 95 Z M105 90 L115 80 L120 85 L110 95 Z M95 110 L100 105 L105 110 L100 115 Z" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  }
};

// ==================== MYTHICAL CREATURES ====================

export const MYTHICAL = {
  dragon: {
    id: 'dragon',
    name: 'Dragon',
    category: 'mythical',
    description: 'A dragon, symbol of power and protection',
    attitude: 'rampant',
    defaultTincture: 'gules',
    svg: `<path d="M50 180 L55 150 L45 130 L55 110 L50 90 L40 75 L50 60 L45 45 L60 50 L75 40 L90 50 L100 35 L115 45 L130 40 L140 55 L155 50 L160 70 L175 80 L170 100 L180 120 L165 135 L175 155 L160 165 L170 180 L145 175 L125 180 L105 170 L85 175 L65 180 Z M130 55 L135 50 L140 55 L135 60 Z M160 140 L175 145 L180 155 L175 165 L165 160 L160 150 Z" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  },
  griffin: {
    id: 'griffin',
    name: 'Griffin',
    category: 'mythical',
    description: 'A griffin with eagle head and lion body',
    attitude: 'segreant',
    defaultTincture: 'or',
    svg: `<path d="M55 180 L60 150 L50 130 L55 110 L45 90 L55 75 L50 55 L65 50 L75 40 L90 45 L100 35 L115 45 L130 50 L145 65 L155 55 L160 75 L170 90 L165 110 L175 130 L165 150 L170 180 L145 175 L125 180 L105 170 L85 175 L65 180 Z M100 50 L105 45 L110 50 L105 55 Z M145 75 L160 70 L175 80 L170 95 L155 90 L145 85 Z" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  },
  unicorn: {
    id: 'unicorn',
    name: 'Unicorn',
    category: 'mythical',
    description: 'A unicorn, symbol of purity and grace',
    attitude: 'rampant',
    defaultTincture: 'argent',
    svg: `<path d="M65 180 L70 150 L55 130 L65 105 L55 85 L65 70 L60 50 L75 55 L85 45 L100 30 L105 45 L115 50 L125 55 L140 70 L150 85 L145 105 L155 125 L145 145 L155 165 L145 180 L125 175 L105 180 L90 170 L75 175 Z M100 45 L105 35 L110 45 Z M120 60 L125 55 L130 60 L125 65 Z" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  },
  phoenix: {
    id: 'phoenix',
    name: 'Phoenix',
    category: 'mythical',
    description: 'A phoenix rising from flames',
    attitude: 'rising',
    defaultTincture: 'gules',
    svg: `<path d="M100 25 L95 40 L85 35 L90 55 L75 50 L85 70 L65 70 L80 90 L55 95 L80 110 L60 120 L85 130 L75 145 L95 145 L90 165 L100 155 L110 165 L105 145 L125 145 L115 130 L140 120 L120 110 L145 95 L120 90 L135 70 L115 70 L125 50 L110 55 L115 35 L105 40 Z M90 80 L100 70 L110 80 L100 90 Z" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  },
  wyvern: {
    id: 'wyvern',
    name: 'Wyvern',
    category: 'mythical',
    description: 'A two-legged dragon with wings',
    attitude: 'displayed',
    defaultTincture: 'vert',
    svg: `<path d="M100 30 L90 45 L75 40 L80 60 L60 55 L70 80 L45 85 L70 100 L55 120 L80 125 L75 150 L90 145 L95 170 L100 155 L105 170 L110 145 L125 150 L120 125 L145 120 L130 100 L155 85 L130 80 L140 55 L120 60 L125 40 L110 45 Z M90 75 L95 70 L100 75 L95 80 Z M100 75 L105 70 L110 75 L105 80 Z" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  }
};

// ==================== FLORA ====================

export const FLORA = {
  rose: {
    id: 'rose',
    name: 'Rose',
    category: 'flora',
    description: 'A heraldic rose with five petals',
    defaultTincture: 'gules',
    svg: `<path d="M100 40 L115 55 L135 50 L130 70 L150 80 L135 95 L145 115 L125 115 L120 135 L100 125 L80 135 L75 115 L55 115 L65 95 L50 80 L70 70 L65 50 L85 55 Z M100 70 L110 80 L105 95 L90 95 L85 80 Z" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  },
  lily: {
    id: 'lily',
    name: 'Lily',
    category: 'flora',
    description: 'A fleur-de-lis, symbol of royalty',
    defaultTincture: 'or',
    svg: `<path d="M100 30 L105 50 L115 45 L110 65 L125 60 L115 85 L130 95 L110 100 L115 130 L125 150 L115 155 L110 145 L100 160 L90 145 L85 155 L75 150 L85 130 L90 100 L70 95 L85 85 L75 60 L90 65 L85 45 L95 50 Z" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  },
  thistle: {
    id: 'thistle',
    name: 'Thistle',
    category: 'flora',
    description: 'A thistle, symbol of Scotland',
    defaultTincture: 'purpure',
    svg: `<path d="M100 35 L90 50 L80 45 L85 60 L70 65 L80 80 L65 90 L85 100 L80 115 L90 110 L95 125 L100 115 L105 125 L110 110 L120 115 L115 100 L135 90 L120 80 L130 65 L115 60 L120 45 L110 50 Z M95 140 L100 130 L105 140 L105 170 L95 170 Z" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  },
  oakTree: {
    id: 'oakTree',
    name: 'Oak Tree',
    category: 'flora',
    description: 'An oak tree, symbol of strength',
    defaultTincture: 'vert',
    svg: `<path d="M100 30 L85 45 L70 40 L75 60 L55 65 L70 80 L50 90 L70 100 L55 115 L80 120 L75 135 L95 130 L90 160 L95 170 L105 170 L110 160 L105 130 L125 135 L120 120 L145 115 L130 100 L150 90 L130 80 L145 65 L125 60 L130 40 L115 45 Z" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  },
  wheat: {
    id: 'wheat',
    name: 'Wheat Sheaf',
    category: 'flora',
    description: 'A sheaf of wheat, symbol of plenty',
    defaultTincture: 'or',
    svg: `<path d="M85 170 L90 140 L80 120 L90 100 L85 80 L95 70 L90 55 L100 45 L110 55 L105 70 L115 80 L110 100 L120 120 L110 140 L115 170 L100 165 Z M75 110 L65 100 L70 85 L80 95 Z M125 110 L135 100 L130 85 L120 95 Z" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  }
};

// ==================== OBJECTS ====================

export const OBJECTS = {
  sword: {
    id: 'sword',
    name: 'Sword',
    category: 'objects',
    description: 'A sword, symbol of justice and military honor',
    defaultTincture: 'argent',
    svg: `<path d="M100 30 L105 35 L105 130 L115 140 L115 150 L105 145 L105 160 L110 165 L105 175 L100 170 L95 175 L90 165 L95 160 L95 145 L85 150 L85 140 L95 130 L95 35 Z" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  },
  crown: {
    id: 'crown',
    name: 'Crown',
    category: 'objects',
    description: 'A royal crown',
    defaultTincture: 'or',
    svg: `<path d="M50 130 L50 100 L65 110 L75 85 L90 105 L100 70 L110 105 L125 85 L135 110 L150 100 L150 130 L145 145 L55 145 Z M70 125 L75 115 L80 125 Z M95 125 L100 115 L105 125 Z M120 125 L125 115 L130 125 Z" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  },
  key: {
    id: 'key',
    name: 'Key',
    category: 'objects',
    description: 'A key, symbol of authority',
    defaultTincture: 'or',
    svg: `<path d="M100 45 L115 45 L120 50 L120 65 L115 70 L105 70 L105 130 L115 135 L115 145 L105 145 L105 155 L115 160 L115 170 L95 170 L95 70 L85 70 L80 65 L80 50 L85 45 Z M90 55 L90 65 L100 65 L100 55 Z" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  },
  tower: {
    id: 'tower',
    name: 'Tower',
    category: 'objects',
    description: 'A castle tower, symbol of defense',
    defaultTincture: 'argent',
    svg: `<path d="M70 170 L70 80 L60 80 L60 60 L70 60 L70 50 L80 50 L80 60 L90 60 L90 50 L100 50 L100 60 L110 60 L110 50 L120 50 L120 60 L130 60 L130 50 L140 50 L140 60 L140 80 L130 80 L130 170 L110 170 L110 130 L105 125 L95 125 L90 130 L90 170 Z" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  },
  anchor: {
    id: 'anchor',
    name: 'Anchor',
    category: 'objects',
    description: 'An anchor, symbol of hope and maritime tradition',
    defaultTincture: 'sable',
    svg: `<path d="M100 35 L110 35 L110 45 L105 45 L105 75 L130 75 L130 85 L105 85 L105 145 L135 130 L140 140 L105 160 L105 170 L95 170 L95 160 L60 140 L65 130 L95 145 L95 85 L70 85 L70 75 L95 75 L95 45 L90 45 L90 35 Z M95 50 L100 45 L105 50 L105 60 L95 60 Z" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  },
  book: {
    id: 'book',
    name: 'Book',
    category: 'objects',
    description: 'An open book, symbol of knowledge',
    defaultTincture: 'argent',
    svg: `<path d="M50 60 L100 70 L150 60 L150 150 L100 160 L50 150 Z M55 65 L55 145 L95 155 L95 75 Z M105 75 L105 155 L145 145 L145 65 Z M75 90 L90 93 M75 105 L90 108 M75 120 L90 123 M110 93 L125 90 M110 108 L125 105 M110 123 L125 120" fill="currentColor" stroke="currentColor" stroke-width="2"/>`,
    viewBox: '0 0 200 200'
  }
};

// ==================== CELESTIAL ====================

export const CELESTIAL = {
  sun: {
    id: 'sun',
    name: 'Sun in Splendour',
    category: 'celestial',
    description: 'A sun with face and rays',
    defaultTincture: 'or',
    svg: `<circle cx="100" cy="100" r="35" fill="currentColor"/>
      <path d="M100 30 L105 55 L95 55 Z M100 170 L105 145 L95 145 Z M30 100 L55 105 L55 95 Z M170 100 L145 105 L145 95 Z M45 45 L65 65 L55 75 Z M155 45 L145 65 L135 55 Z M45 155 L65 135 L55 125 Z M155 155 L135 135 L145 125 Z" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  },
  moon: {
    id: 'moon',
    name: 'Crescent',
    category: 'celestial',
    description: 'A crescent moon',
    defaultTincture: 'argent',
    svg: `<path d="M130 50 C90 50 60 85 60 125 C60 165 90 195 130 195 C100 185 80 155 80 120 C80 85 100 55 130 50 Z" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  },
  mullet: {
    id: 'mullet',
    name: 'Mullet (Star)',
    category: 'celestial',
    description: 'A five-pointed star',
    defaultTincture: 'or',
    svg: `<path d="M100 30 L115 75 L165 75 L125 105 L140 155 L100 125 L60 155 L75 105 L35 75 L85 75 Z" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  },
  estoile: {
    id: 'estoile',
    name: 'Estoile',
    category: 'celestial',
    description: 'A six-pointed star with wavy rays',
    defaultTincture: 'or',
    svg: `<path d="M100 30 L105 80 L150 50 L115 95 L170 100 L115 105 L150 150 L105 120 L100 170 L95 120 L50 150 L85 105 L30 100 L85 95 L50 50 L95 80 Z" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  }
};

// ==================== GEOMETRIC (Simple Charges) ====================

export const GEOMETRIC = {
  roundel: {
    id: 'roundel',
    name: 'Roundel',
    category: 'geometric',
    description: 'A solid circular charge',
    defaultTincture: 'or',
    svg: `<circle cx="100" cy="100" r="50" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  },
  lozenge: {
    id: 'lozenge',
    name: 'Lozenge',
    category: 'geometric',
    description: 'A diamond shape',
    defaultTincture: 'azure',
    svg: `<polygon points="100,30 160,100 100,170 40,100" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  },
  billet: {
    id: 'billet',
    name: 'Billet',
    category: 'geometric',
    description: 'A small rectangle',
    defaultTincture: 'sable',
    svg: `<rect x="70" y="50" width="60" height="100" fill="currentColor"/>`,
    viewBox: '0 0 200 200'
  },
  annulet: {
    id: 'annulet',
    name: 'Annulet',
    category: 'geometric',
    description: 'A ring shape',
    defaultTincture: 'or',
    svg: `<circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" stroke-width="15"/>`,
    viewBox: '0 0 200 200'
  },
  mascle: {
    id: 'mascle',
    name: 'Mascle',
    category: 'geometric',
    description: 'A hollow diamond',
    defaultTincture: 'sable',
    svg: `<polygon points="100,30 160,100 100,170 40,100" fill="none" stroke="currentColor" stroke-width="12"/>`,
    viewBox: '0 0 200 200'
  }
};

// ==================== COMBINED EXPORTS ====================

export const ALL_CHARGES = {
  ...BEASTS,
  ...BIRDS,
  ...MYTHICAL,
  ...FLORA,
  ...OBJECTS,
  ...CELESTIAL,
  ...GEOMETRIC
};

export const CHARGE_CATEGORIES = {
  beasts: { name: 'Beasts', icon: '🦁', charges: BEASTS },
  birds: { name: 'Birds', icon: '🦅', charges: BIRDS },
  mythical: { name: 'Mythical Creatures', icon: '🐉', charges: MYTHICAL },
  flora: { name: 'Flora', icon: '🌹', charges: FLORA },
  objects: { name: 'Objects', icon: '⚔️', charges: OBJECTS },
  celestial: { name: 'Celestial', icon: '☀️', charges: CELESTIAL },
  geometric: { name: 'Geometric', icon: '◆', charges: GEOMETRIC }
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Get charge by ID
 */
export function getCharge(id) {
  return ALL_CHARGES[id] || null;
}

/**
 * Get all charges in a category
 */
export function getChargesByCategory(category) {
  return CHARGE_CATEGORIES[category]?.charges || {};
}

/**
 * Search charges by name
 */
export function searchCharges(term) {
  const searchTerm = term.toLowerCase();
  return Object.values(ALL_CHARGES).filter(charge =>
    charge.name.toLowerCase().includes(searchTerm) ||
    charge.description.toLowerCase().includes(searchTerm) ||
    charge.category.toLowerCase().includes(searchTerm)
  );
}

/**
 * Render a charge SVG with specific tincture
 */
export function renderCharge(chargeId, tincture, size = 100) {
  const charge = getCharge(chargeId);
  if (!charge) return '';
  
  // Replace currentColor with the actual tincture
  const svg = charge.svg.replace(/currentColor/g, tincture);
  
  return `<svg viewBox="${charge.viewBox}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    ${svg}
  </svg>`;
}

export default {
  ALL_CHARGES,
  CHARGE_CATEGORIES,
  BEASTS,
  BIRDS,
  MYTHICAL,
  FLORA,
  OBJECTS,
  CELESTIAL,
  GEOMETRIC,
  getCharge,
  getChargesByCategory,
  searchCharges,
  renderCharge
};
