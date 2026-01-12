/**
 * External Heraldic Charges Library
 * 
 * Catalog of high-quality SVG charges from Traceable Heraldic Art (public domain/CC0).
 * These are complex multi-element SVGs with black strokes and white fills,
 * designed to be colored dynamically at runtime.
 * 
 * Source: heraldicart.org - Traceable Heraldic Art PDF
 * License: Public Domain / CC0
 */

// ═══════════════════════════════════════════════════════════════════════════════
// EXTERNAL CHARGE CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════════

export const EXTERNAL_CHARGE_CATEGORIES = {
  beasts: { 
    name: 'Beasts', 
    icon: '🦁',
    description: 'Lions, bears, boars, wolves, and other land animals'
  },
  birds: { 
    name: 'Birds', 
    icon: '🦅',
    description: 'Eagles, falcons, owls, peacocks, and other birds'
  },
  seaCreatures: { 
    name: 'Sea Creatures', 
    icon: '🐟',
    description: 'Fish, sea-beasts, dolphins, and marine life'
  },
  mythical: { 
    name: 'Mythical', 
    icon: '🐉',
    description: 'Dragons, griffins, unicorns, and legendary creatures'
  },
  insects: { 
    name: 'Insects', 
    icon: '🐝',
    description: 'Bees, butterflies, beetles, and other insects'
  },
  serpents: { 
    name: 'Serpents', 
    icon: '🐍',
    description: 'Snakes, serpents, and reptiles'
  },
  weapons: { 
    name: 'Weapons', 
    icon: '⚔️',
    description: 'Swords, daggers, axes, bows, and other implements of war'
  },
  flora: { 
    name: 'Flora', 
    icon: '🌹',
    description: 'Roses, trees, leaves, flowers, and botanical elements'
  },
  architecture: { 
    name: 'Architecture', 
    icon: '🏰',
    description: 'Castles, towers, bridges, and buildings'
  },
  objects: { 
    name: 'Objects', 
    icon: '🏺',
    description: 'Vessels, tools, and miscellaneous objects'
  },
  bodyParts: { 
    name: 'Body Parts', 
    icon: '✋',
    description: 'Heads, limbs, and anatomical charges'
  },
  military: { 
    name: 'Military', 
    icon: '🛡️',
    description: 'Helms, armor, gauntlets, and military equipment'
  },
  celestial: { 
    name: 'Celestial', 
    icon: '☀️',
    description: 'Sun, moon, stars, comets, and heavenly bodies'
  },
  geometric: { 
    name: 'Geometric', 
    icon: '◆',
    description: 'Lozenges, roundels, triangles, and geometric shapes'
  },
  crosses: { 
    name: 'Crosses', 
    icon: '✚',
    description: 'Crosses of various forms and styles'
  },
  knots: { 
    name: 'Knots', 
    icon: '⚭',
    description: 'Heraldic knots, triquetras, and interlaced designs'
  },
  symbols: { 
    name: 'Symbols', 
    icon: '⚜',
    description: 'Hearts, keys, wheels, and miscellaneous symbols'
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXTERNAL CHARGES CATALOG
// ═══════════════════════════════════════════════════════════════════════════════

export const EXTERNAL_CHARGES = {
  // WEAPONS
  sword4: {
    name: 'Sword (Ornate)',
    category: 'weapons',
    filename: 'sword-4-mono.svg',
    blazonTerm: 'a sword',
    description: 'An ornate sword with decorated hilt',
    keywords: ['sword', 'blade', 'weapon']
  },
  sword10: {
    name: 'Sword (Simple)',
    category: 'weapons',
    filename: 'sword-10-mono.svg',
    blazonTerm: 'a sword',
    description: 'A simple straight sword',
    keywords: ['sword', 'blade', 'weapon']
  },
  sword14: {
    name: 'Sword (Broad)',
    category: 'weapons',
    filename: 'sword-14-mono.svg',
    blazonTerm: 'a sword',
    description: 'A broad-bladed sword',
    keywords: ['sword', 'blade', 'broadsword', 'weapon']
  },
  swordsFracted: {
    name: 'Swords Fracted in Chevron',
    category: 'weapons',
    filename: 'sword-fracted-in-chevron-mono.svg',
    blazonTerm: 'two swords fracted in chevron',
    description: 'Two broken swords arranged in a V-shape',
    keywords: ['sword', 'broken', 'chevron', 'crossed']
  },
  dagger: {
    name: 'Dagger',
    category: 'weapons',
    filename: 'dagger-5-mono.svg',
    blazonTerm: 'a dagger',
    description: 'A short stabbing blade',
    keywords: ['dagger', 'knife', 'blade', 'weapon']
  },
  rapier: {
    name: 'Rapier',
    category: 'weapons',
    filename: 'rapier-3-mono.svg',
    blazonTerm: 'a rapier',
    description: 'A slender thrusting sword',
    keywords: ['rapier', 'sword', 'fencing', 'blade']
  },
  axePole: {
    name: 'Pole Axe',
    category: 'weapons',
    filename: 'axe-pole-2-mono.svg',
    blazonTerm: 'a pole axe',
    description: 'A long-hafted battle axe',
    keywords: ['axe', 'polearm', 'weapon', 'battle']
  },
  spear6: {
    name: 'Spear (Simple)',
    category: 'weapons',
    filename: 'spear-6-mono.svg',
    blazonTerm: 'a spear',
    description: 'A simple thrusting spear',
    keywords: ['spear', 'lance', 'polearm', 'weapon']
  },
  spear8: {
    name: 'Spear (Ornate)',
    category: 'weapons',
    filename: 'spear-8-mono.svg',
    blazonTerm: 'a spear',
    description: 'An ornate spear with decorated head',
    keywords: ['spear', 'lance', 'polearm', 'weapon']
  },
  lance1: {
    name: 'Lance',
    category: 'weapons',
    filename: 'lance-1-mono.svg',
    blazonTerm: 'a lance',
    description: 'A cavalry lance',
    keywords: ['lance', 'spear', 'jousting', 'cavalry']
  },
  lancePennon: {
    name: 'Lance with Pennon',
    category: 'weapons',
    filename: 'lance-flying-a-pennon-mono.svg',
    blazonTerm: 'a lance flying a pennon',
    description: 'A lance with a streaming pennant',
    keywords: ['lance', 'pennon', 'flag', 'banner']
  },
  lancesFracted: {
    name: 'Lances Fracted in Chevron',
    category: 'weapons',
    filename: 'lance-fracted-in-chevron-mono.svg',
    blazonTerm: 'two lances fracted in chevron',
    description: 'Two broken lances arranged in a V-shape',
    keywords: ['lance', 'broken', 'chevron', 'tournament']
  },
  bow1: {
    name: 'Bow (Simple)',
    category: 'weapons',
    filename: 'bow-1-mono.svg',
    blazonTerm: 'a bow',
    description: 'A simple longbow',
    keywords: ['bow', 'archery', 'weapon']
  },
  bow3: {
    name: 'Bow (Recurve)',
    category: 'weapons',
    filename: 'bow-3-mono.svg',
    blazonTerm: 'a bow',
    description: 'A recurve bow',
    keywords: ['bow', 'archery', 'weapon', 'recurve']
  },
  crossbow: {
    name: 'Crossbow',
    category: 'weapons',
    filename: 'crossbow-4-mono.svg',
    blazonTerm: 'a crossbow',
    description: 'A mechanical crossbow',
    keywords: ['crossbow', 'arbalest', 'weapon']
  },
  maceFlanged: {
    name: 'Flanged Mace',
    category: 'weapons',
    filename: 'mace-flanged-1-mono.svg',
    blazonTerm: 'a mace',
    description: 'A flanged war mace',
    keywords: ['mace', 'club', 'weapon', 'flanged']
  },
  maceSpiked: {
    name: 'Spiked Mace',
    category: 'weapons',
    filename: 'mace-spiked-5-mono.svg',
    blazonTerm: 'a mace',
    description: 'A spiked morning star',
    keywords: ['mace', 'morningstar', 'spiked', 'weapon']
  },
  hammerWar: {
    name: 'War Hammer',
    category: 'weapons',
    filename: 'hammer-war-1-mono.svg',
    blazonTerm: 'a war hammer',
    description: 'A war hammer for armored combat',
    keywords: ['hammer', 'warhammer', 'weapon']
  },
  club: {
    name: 'Club',
    category: 'weapons',
    filename: 'club-1-mono.svg',
    blazonTerm: 'a club',
    description: 'A simple wooden club',
    keywords: ['club', 'cudgel', 'weapon']
  },
  batteringRam: {
    name: 'Battering Ram',
    category: 'weapons',
    filename: 'battering-ram-2-mono.svg',
    blazonTerm: 'a battering ram',
    description: 'A siege battering ram',
    keywords: ['ram', 'siege', 'battering']
  },
  caltrop: {
    name: 'Caltrop',
    category: 'weapons',
    filename: 'caltrop-2-mono.svg',
    blazonTerm: 'a caltrop',
    description: 'A four-pointed caltrop',
    keywords: ['caltrop', 'spike', 'trap']
  },
  scourge: {
    name: 'Scourge',
    category: 'weapons',
    filename: 'scourge-3-mono.svg',
    blazonTerm: 'a scourge',
    description: 'A multi-tailed whip',
    keywords: ['scourge', 'whip', 'flail']
  },

  // FLORA
  rose8: {
    name: 'Rose (Heraldic)',
    category: 'flora',
    filename: 'rose-8-mono.svg',
    blazonTerm: 'a rose',
    description: 'A traditional heraldic rose',
    keywords: ['rose', 'flower', 'tudor']
  },
  rose14: {
    name: 'Rose (Five Petal)',
    category: 'flora',
    filename: 'rose-14-mono.svg',
    blazonTerm: 'a rose',
    description: 'A five-petaled rose',
    keywords: ['rose', 'flower']
  },
  roseSlipped1: {
    name: 'Rose Slipped & Leaved',
    category: 'flora',
    filename: 'rose-slipped-and-leaved-1-mono.svg',
    blazonTerm: 'a rose slipped and leaved',
    description: 'A rose with stem and leaves',
    keywords: ['rose', 'flower', 'stem', 'leaves']
  },
  roseSlipped5: {
    name: 'Rose Slipped (Ornate)',
    category: 'flora',
    filename: 'rose-slipped-and-leaved-5-mono.svg',
    blazonTerm: 'a rose slipped and leaved',
    description: 'An ornate rose with stem and leaves',
    keywords: ['rose', 'flower', 'stem', 'leaves']
  },
  rosesChaplet2: {
    name: 'Chaplet of Roses',
    category: 'flora',
    filename: 'roses-chaplet-of-2-mono.svg',
    blazonTerm: 'a chaplet of roses',
    description: 'A circular wreath of roses',
    keywords: ['roses', 'chaplet', 'wreath', 'garland']
  },
  rosesChaplet3: {
    name: 'Chaplet of Roses (Full)',
    category: 'flora',
    filename: 'roses-chaplet-of-3-mono.svg',
    blazonTerm: 'a chaplet of roses',
    description: 'A full circular wreath of roses',
    keywords: ['roses', 'chaplet', 'wreath', 'garland']
  },
  oakLeaf1: {
    name: 'Oak Leaf',
    category: 'flora',
    filename: 'oak-leaf-1-mono.svg',
    blazonTerm: 'an oak leaf',
    description: 'A single oak leaf',
    keywords: ['oak', 'leaf', 'tree']
  },
  oakLeaf7: {
    name: 'Oak Leaf (Detailed)',
    category: 'flora',
    filename: 'oak-leaf-7-mono.svg',
    blazonTerm: 'an oak leaf',
    description: 'A detailed oak leaf',
    keywords: ['oak', 'leaf', 'tree']
  },
  oakTree: {
    name: 'Oak Tree Fructed',
    category: 'flora',
    filename: 'oak-tree-fructed-and-eradicated-2-mono.svg',
    blazonTerm: 'an oak tree fructed and eradicated',
    description: 'An oak tree with acorns, roots exposed',
    keywords: ['oak', 'tree', 'acorn', 'eradicated']
  },
  acorn: {
    name: 'Acorn',
    category: 'flora',
    filename: 'acorn-1-mono.svg',
    blazonTerm: 'an acorn',
    description: 'An oak acorn',
    keywords: ['acorn', 'oak', 'nut', 'seed']
  },
  wheatGarb: {
    name: 'Garb of Wheat',
    category: 'flora',
    filename: 'wheat-garb-of-3-mono.svg',
    blazonTerm: 'a garb',
    description: 'A sheaf of wheat bound together',
    keywords: ['wheat', 'garb', 'sheaf', 'harvest']
  },
  wheatSheaf1: {
    name: 'Wheat Sheaf',
    category: 'flora',
    filename: 'wheat-sheaf-of-1-mono.svg',
    blazonTerm: 'a sheaf of wheat',
    description: 'A simple wheat sheaf',
    keywords: ['wheat', 'sheaf', 'harvest', 'grain']
  },
  wheatSheaf3: {
    name: 'Wheat Sheaf (Full)',
    category: 'flora',
    filename: 'wheat-sheaf-of-3-mono.svg',
    blazonTerm: 'a sheaf of wheat',
    description: 'A full wheat sheaf',
    keywords: ['wheat', 'sheaf', 'harvest', 'grain']
  },
  wheatStalk: {
    name: 'Wheat Stalk',
    category: 'flora',
    filename: 'wheat-stalk-of-2-mono.svg',
    blazonTerm: 'a stalk of wheat',
    description: 'A single wheat stalk',
    keywords: ['wheat', 'stalk', 'grain']
  },
  pineTree: {
    name: 'Pine Tree',
    category: 'flora',
    filename: 'pine-tree-2-mono.svg',
    blazonTerm: 'a pine tree',
    description: 'An evergreen pine tree',
    keywords: ['pine', 'tree', 'evergreen', 'fir']
  },
  pineCone: {
    name: 'Pine Cone',
    category: 'flora',
    filename: 'pine-cone-mono.svg',
    blazonTerm: 'a pine cone',
    description: 'A pine cone',
    keywords: ['pine', 'cone', 'seed']
  },
  treeBlasted: {
    name: 'Tree Blasted',
    category: 'flora',
    filename: 'tree-blasted-1-mono.svg',
    blazonTerm: 'a tree blasted',
    description: 'A dead or lightning-struck tree',
    keywords: ['tree', 'blasted', 'dead', 'lightning']
  },
  treeBlastedEradicated: {
    name: 'Tree Blasted & Eradicated',
    category: 'flora',
    filename: 'tree-blasted-and-eradicated-1-mono.svg',
    blazonTerm: 'a tree blasted and eradicated',
    description: 'A dead tree with exposed roots',
    keywords: ['tree', 'blasted', 'dead', 'roots']
  },
  treeStump: {
    name: 'Tree Stump',
    category: 'flora',
    filename: 'tree-stump-eradicated-2-mono.svg',
    blazonTerm: 'a tree stump eradicated',
    description: 'A tree stump with roots',
    keywords: ['stump', 'tree', 'roots']
  },
  laurelWreath2: {
    name: 'Laurel Wreath',
    category: 'flora',
    filename: 'laurel-wreath-2-mono.svg',
    blazonTerm: 'a laurel wreath',
    description: 'A victory laurel wreath',
    keywords: ['laurel', 'wreath', 'victory', 'crown']
  },
  laurelWreath6: {
    name: 'Laurel Wreath (Full)',
    category: 'flora',
    filename: 'laurel-wreath-6-mono.svg',
    blazonTerm: 'a laurel wreath',
    description: 'A full laurel wreath',
    keywords: ['laurel', 'wreath', 'victory', 'crown']
  },
  wreath: {
    name: 'Wreath',
    category: 'flora',
    filename: 'wreath-mono.svg',
    blazonTerm: 'a wreath',
    description: 'A general wreath',
    keywords: ['wreath', 'garland', 'circle']
  },
  thornsWreath: {
    name: 'Wreath of Thorns',
    category: 'flora',
    filename: 'thorns-wreath-of-mono.svg',
    blazonTerm: 'a wreath of thorns',
    description: 'A crown of thorns',
    keywords: ['thorns', 'wreath', 'crown', 'christian']
  },
  ivyWreath: {
    name: 'Ivy Wreath',
    category: 'flora',
    filename: 'ivy-wreath-of-3-mono.svg',
    blazonTerm: 'a wreath of ivy',
    description: 'A circular ivy wreath',
    keywords: ['ivy', 'wreath', 'vine']
  },
  ivyVine: {
    name: 'Ivy Vine',
    category: 'flora',
    filename: 'ivy-vine-mono.svg',
    blazonTerm: 'an ivy vine',
    description: 'A trailing ivy vine',
    keywords: ['ivy', 'vine', 'climbing']
  },
  thistle: {
    name: 'Thistle',
    category: 'flora',
    filename: 'thistle-1-mono.svg',
    blazonTerm: 'a thistle',
    description: 'A Scottish thistle',
    keywords: ['thistle', 'scotland', 'flower']
  },
  tulipSlipped: {
    name: 'Tulip Slipped',
    category: 'flora',
    filename: 'tulip-slipped-and-leaved-1-mono.svg',
    blazonTerm: 'a tulip slipped and leaved',
    description: 'A tulip with stem and leaves',
    keywords: ['tulip', 'flower', 'stem']
  },
  tulipThree: {
    name: 'Three Tulips',
    category: 'flora',
    filename: 'tulip-of-three-blossoms-slipped-and-leaved-mono.svg',
    blazonTerm: 'a tulip of three blossoms slipped and leaved',
    description: 'Three tulip blooms on one stem',
    keywords: ['tulip', 'flower', 'three']
  },
  sunflower: {
    name: 'Sunflower',
    category: 'flora',
    filename: 'sunflower-slipped-and-leaved-2-mono.svg',
    blazonTerm: 'a sunflower slipped and leaved',
    description: 'A sunflower with stem and leaves',
    keywords: ['sunflower', 'flower', 'sun']
  },
  quatrefoil: {
    name: 'Quatrefoil',
    category: 'flora',
    filename: 'quatrefoil-2-mono.svg',
    blazonTerm: 'a quatrefoil',
    description: 'A four-lobed ornamental design',
    keywords: ['quatrefoil', 'four', 'leaf', 'clover']
  },
  morningGlory: {
    name: 'Morning Glory',
    category: 'flora',
    filename: 'morning-glory-sprig-mono.svg',
    blazonTerm: 'a sprig of morning glory',
    description: 'A morning glory sprig',
    keywords: ['morning glory', 'flower', 'vine']
  },
  poppyBoll: {
    name: 'Poppy Boll',
    category: 'flora',
    filename: 'poppy-boll-mono.svg',
    blazonTerm: 'a poppy boll',
    description: 'A poppy seed head',
    keywords: ['poppy', 'boll', 'seed']
  },
  poppyBollSlipped: {
    name: 'Poppy Boll Slipped',
    category: 'flora',
    filename: 'poppy-boll-slipped-mono.svg',
    blazonTerm: 'a poppy boll slipped',
    description: 'A poppy seed head with stem',
    keywords: ['poppy', 'boll', 'seed', 'stem']
  },
  poppyBollsThree: {
    name: 'Three Poppy Bolls',
    category: 'flora',
    filename: 'poppy-bolls-three-slipped-and-leaved-mono.svg',
    blazonTerm: 'three poppy bolls slipped and leaved',
    description: 'Three poppy seed heads with stem and leaves',
    keywords: ['poppy', 'boll', 'three']
  },
  mistletoe: {
    name: 'Mistletoe',
    category: 'flora',
    filename: 'mistletoe-sprig-of-mono.svg',
    blazonTerm: 'a sprig of mistletoe',
    description: 'A mistletoe sprig with berries',
    keywords: ['mistletoe', 'berry', 'christmas']
  },
  lindenBranch1: {
    name: 'Linden Branch',
    category: 'flora',
    filename: 'linden-branch-twined-on-itself-1-mono.svg',
    blazonTerm: 'a linden branch twined',
    description: 'A linden branch twined on itself',
    keywords: ['linden', 'branch', 'lime', 'tree']
  },
  lindenBranch2: {
    name: 'Linden Branch (Ornate)',
    category: 'flora',
    filename: 'linden-branch-twined-on-itself-2-mono.svg',
    blazonTerm: 'a linden branch twined',
    description: 'An ornate linden branch twined on itself',
    keywords: ['linden', 'branch', 'lime', 'tree']
  },
  rowanBerries: {
    name: 'Rowan Berries',
    category: 'flora',
    filename: 'rowan-berries-cluster-of-1-mono.svg',
    blazonTerm: 'a cluster of rowan berries',
    description: 'A cluster of rowan berries',
    keywords: ['rowan', 'berry', 'cluster', 'mountain ash']
  },
  pear: {
    name: 'Pear',
    category: 'flora',
    filename: 'pear-1-mono.svg',
    blazonTerm: 'a pear',
    description: 'A pear fruit',
    keywords: ['pear', 'fruit']
  },
  pearSlipped: {
    name: 'Pear Slipped & Leaved',
    category: 'flora',
    filename: 'pear-slipped-and-leaved-3-mono.svg',
    blazonTerm: 'a pear slipped and leaved',
    description: 'A pear with stem and leaves',
    keywords: ['pear', 'fruit', 'stem', 'leaves']
  },
  pomegranate1: {
    name: 'Pomegranate',
    category: 'flora',
    filename: 'pomegranate-slipped-and-leaved-1-mono.svg',
    blazonTerm: 'a pomegranate slipped and leaved',
    description: 'A pomegranate with stem and leaves',
    keywords: ['pomegranate', 'fruit', 'granada']
  },
  pomegranate5: {
    name: 'Pomegranate (Seeded)',
    category: 'flora',
    filename: 'pomegranate-slipped-and-leaved-5-mono.svg',
    blazonTerm: 'a pomegranate slipped and leaved seeded',
    description: 'A pomegranate showing seeds',
    keywords: ['pomegranate', 'fruit', 'seeds', 'granada']
  },
  mushroom: {
    name: 'Mushroom',
    category: 'flora',
    filename: 'mushroom-1-mono.svg',
    blazonTerm: 'a mushroom',
    description: 'A mushroom or toadstool',
    keywords: ['mushroom', 'fungus', 'toadstool']
  },
  pumpkin: {
    name: 'Pumpkin',
    category: 'flora',
    filename: 'pumpkin-mono.svg',
    blazonTerm: 'a pumpkin',
    description: 'A pumpkin or gourd',
    keywords: ['pumpkin', 'gourd', 'squash', 'harvest']
  },
  pepperChili: {
    name: 'Chili Pepper',
    category: 'flora',
    filename: 'pepper-chili-mono.svg',
    blazonTerm: 'a chili pepper',
    description: 'A chili pepper',
    keywords: ['pepper', 'chili', 'hot']
  },
  radish: {
    name: 'Radish',
    category: 'flora',
    filename: 'radish-5-mono.svg',
    blazonTerm: 'a radish',
    description: 'A radish with leaves',
    keywords: ['radish', 'vegetable', 'root']
  },

  // INSECTS
  bee1: {
    name: 'Bee (Displayed)',
    category: 'insects',
    filename: 'bee-1-mono.svg',
    blazonTerm: 'a bee volant',
    description: 'A bee with wings displayed',
    keywords: ['bee', 'insect', 'napoleonic']
  },
  bee6: {
    name: 'Bee (Simple)',
    category: 'insects',
    filename: 'bee-6-mono.svg',
    blazonTerm: 'a bee',
    description: 'A simple bee design',
    keywords: ['bee', 'insect']
  },
  ant: {
    name: 'Ant',
    category: 'insects',
    filename: 'ant-mono.svg',
    blazonTerm: 'an ant',
    description: 'An ant or emmet',
    keywords: ['ant', 'insect', 'emmet']
  },

  // SERPENTS
  serpentErect1: {
    name: 'Serpent Erect',
    category: 'serpents',
    filename: 'serpent-erect-1-mono.svg',
    blazonTerm: 'a serpent erect',
    description: 'A serpent rising upward',
    keywords: ['serpent', 'snake', 'erect']
  },
  serpentErect6: {
    name: 'Serpent Erect (Detailed)',
    category: 'serpents',
    filename: 'serpent-erect-6-mono.svg',
    blazonTerm: 'a serpent erect',
    description: 'A detailed serpent rising upward',
    keywords: ['serpent', 'snake', 'erect']
  },
  serpentGlissant: {
    name: 'Serpent Glissant',
    category: 'serpents',
    filename: 'serpent-glissant-4-mono.svg',
    blazonTerm: 'a serpent glissant',
    description: 'A serpent gliding horizontally',
    keywords: ['serpent', 'snake', 'gliding']
  },
  serpentNowed: {
    name: 'Serpent Nowed',
    category: 'serpents',
    filename: 'serpent-nowed-4-mono.svg',
    blazonTerm: 'a serpent nowed',
    description: 'A serpent tied in a knot',
    keywords: ['serpent', 'snake', 'knot', 'nowed']
  },
  serpentsEntwined: {
    name: 'Two Serpents Entwined',
    category: 'serpents',
    filename: 'serpents-two-entwined-mono.svg',
    blazonTerm: 'two serpents entwined',
    description: 'Two serpents coiled around each other',
    keywords: ['serpent', 'snake', 'caduceus', 'entwined']
  },

  // BEASTS
  lion4: {
    name: 'Lion Rampant',
    category: 'beasts',
    filename: 'lion-4-mono.svg',
    blazonTerm: 'a lion rampant',
    description: 'A lion rampant',
    keywords: ['lion', 'rampant', 'beast', 'cat']
  },
  lionPassant: {
    name: 'Lion Passant Reguardant',
    category: 'beasts',
    filename: 'lion-passant-reguardant-mono.svg',
    blazonTerm: 'a lion passant reguardant',
    description: 'A lion walking, looking backward',
    keywords: ['lion', 'passant', 'reguardant', 'beast']
  },
  lionQueueFourchy: {
    name: 'Lion Queue Fourchy',
    category: 'beasts',
    filename: 'lion-queue-fourchy-1-mono.svg',
    blazonTerm: 'a lion queue fourchy',
    description: 'A lion with forked tail',
    keywords: ['lion', 'forked', 'tail', 'queue']
  },
  lionsHeadCabossed: {
    name: "Lion's Head Cabossed",
    category: 'beasts',
    filename: 'lions-head-cabossed-3-mono.svg',
    blazonTerm: "a lion's head cabossed",
    description: "A lion's head facing forward",
    keywords: ['lion', 'head', 'cabossed', 'face']
  },
  bearPassant: {
    name: 'Bear Passant',
    category: 'beasts',
    filename: 'bear-passant-2-mono.svg',
    blazonTerm: 'a bear passant',
    description: 'A bear walking',
    keywords: ['bear', 'passant', 'beast']
  },
  bearRampant2: {
    name: 'Bear Rampant',
    category: 'beasts',
    filename: 'bear-rampant-2-mono.svg',
    blazonTerm: 'a bear rampant',
    description: 'A bear rearing up',
    keywords: ['bear', 'rampant', 'beast']
  },
  bearRampant10: {
    name: 'Bear Rampant (Detailed)',
    category: 'beasts',
    filename: 'bear-rampant-10-mono.svg',
    blazonTerm: 'a bear rampant',
    description: 'A detailed bear rearing up',
    keywords: ['bear', 'rampant', 'beast']
  },
  bearsHeadErased: {
    name: "Bear's Head Erased",
    category: 'beasts',
    filename: 'bears-head-erased-5-mono.svg',
    blazonTerm: "a bear's head erased",
    description: "A bear's head torn off",
    keywords: ['bear', 'head', 'erased']
  },
  bearsJambe: {
    name: "Bear's Jambe",
    category: 'beasts',
    filename: 'bears-jambe-fesswise-embowed-mono.svg',
    blazonTerm: "a bear's jambe fesswise embowed",
    description: "A bear's leg bent horizontally",
    keywords: ['bear', 'leg', 'paw', 'jambe']
  },
  boarPassant: {
    name: 'Boar Passant',
    category: 'beasts',
    filename: 'boar-passant-2-mono.svg',
    blazonTerm: 'a boar passant',
    description: 'A wild boar walking',
    keywords: ['boar', 'passant', 'pig', 'wild']
  },
  boarRampant: {
    name: 'Boar Rampant',
    category: 'beasts',
    filename: 'boar-rampant-2-mono.svg',
    blazonTerm: 'a boar rampant',
    description: 'A wild boar rearing up',
    keywords: ['boar', 'rampant', 'pig', 'wild']
  },
  boarsHeadCabossed: {
    name: "Boar's Head Cabossed",
    category: 'beasts',
    filename: 'boars-head-cabossed-3-mono.svg',
    blazonTerm: "a boar's head cabossed",
    description: "A boar's head facing forward",
    keywords: ['boar', 'head', 'cabossed', 'face']
  },
  bullPassant: {
    name: 'Bull Passant',
    category: 'beasts',
    filename: 'bull-passant-5-mono.svg',
    blazonTerm: 'a bull passant',
    description: 'A bull walking',
    keywords: ['bull', 'passant', 'ox', 'cattle']
  },
  badger5: {
    name: 'Badger',
    category: 'beasts',
    filename: 'badger-5-mono.svg',
    blazonTerm: 'a badger',
    description: 'A badger statant',
    keywords: ['badger', 'brock', 'beast']
  },
  badgerCourant: {
    name: 'Badger Courant Guardant',
    category: 'beasts',
    filename: 'badger-courant-guardant-mono.svg',
    blazonTerm: 'a badger courant guardant',
    description: 'A badger running, looking at viewer',
    keywords: ['badger', 'courant', 'running', 'guardant']
  },
  badgersHeadErased: {
    name: "Badger's Head Erased",
    category: 'beasts',
    filename: 'badgers-head-erased-3-mono.svg',
    blazonTerm: "a badger's head erased",
    description: "A badger's head torn off",
    keywords: ['badger', 'head', 'erased']
  },
  catCouchant: {
    name: 'Cat Couchant',
    category: 'beasts',
    filename: 'cat-domestic-couchant-3-mono.svg',
    blazonTerm: 'a cat couchant',
    description: 'A domestic cat lying down',
    keywords: ['cat', 'couchant', 'domestic', 'feline']
  },
  catsEye: {
    name: "Cat's Eye",
    category: 'beasts',
    filename: 'cats-domestic-eye-mono.svg',
    blazonTerm: "a cat's eye",
    description: "A cat's eye",
    keywords: ['cat', 'eye', 'feline']
  },
  foxCourant: {
    name: 'Fox Courant',
    category: 'beasts',
    filename: 'fox-courant-3-mono.svg',
    blazonTerm: 'a fox courant',
    description: 'A fox running',
    keywords: ['fox', 'courant', 'running', 'reynard']
  },
  goatPassant: {
    name: 'Goat Passant',
    category: 'beasts',
    filename: 'goat-passant-2-mono.svg',
    blazonTerm: 'a goat passant',
    description: 'A goat walking',
    keywords: ['goat', 'passant', 'beast']
  },
  horseRampant: {
    name: 'Horse Rampant',
    category: 'beasts',
    filename: 'horse-rampant-1-mono.svg',
    blazonTerm: 'a horse rampant',
    description: 'A horse rearing up',
    keywords: ['horse', 'rampant', 'steed']
  },
  assPassant: {
    name: 'Ass Passant',
    category: 'beasts',
    filename: 'ass-passant-3-mono.svg',
    blazonTerm: 'an ass passant',
    description: 'A donkey walking',
    keywords: ['ass', 'donkey', 'passant']
  },
  asssHeadCouped: {
    name: "Ass's Head Couped",
    category: 'beasts',
    filename: 'asss-head-couped-close-1-mono.svg',
    blazonTerm: "an ass's head couped close",
    description: "A donkey's head cut off cleanly",
    keywords: ['ass', 'donkey', 'head', 'couped']
  },
  camelStatant: {
    name: 'Camel Statant',
    category: 'beasts',
    filename: 'camel-statant-4-mono.svg',
    blazonTerm: 'a camel statant',
    description: 'A camel standing',
    keywords: ['camel', 'statant', 'desert']
  },
  elkTrippant: {
    name: 'Elk Trippant',
    category: 'beasts',
    filename: 'elk-trippant-1-mono.svg',
    blazonTerm: 'an elk trippant',
    description: 'An elk walking',
    keywords: ['elk', 'trippant', 'deer', 'moose']
  },
  stagsHeadCabossed: {
    name: "Stag's Head Cabossed",
    category: 'beasts',
    filename: 'stags-head-cabossed-5-mono.svg',
    blazonTerm: "a stag's head cabossed",
    description: "A stag's head facing forward",
    keywords: ['stag', 'deer', 'head', 'cabossed', 'antlers']
  },
  stagsMassacre: {
    name: "Stag's Massacre",
    category: 'beasts',
    filename: 'stags-massacre-1-mono.svg',
    blazonTerm: "a stag's massacre",
    description: 'Stag antlers attached to skull',
    keywords: ['stag', 'antlers', 'massacre', 'attires']
  },
  ramsHeadCabossed: {
    name: "Ram's Head Cabossed",
    category: 'beasts',
    filename: 'rams-head-cabossed-2-mono.svg',
    blazonTerm: "a ram's head cabossed",
    description: "A ram's head facing forward",
    keywords: ['ram', 'sheep', 'head', 'cabossed', 'horns']
  },
  elephantsHeadCabossed: {
    name: "Elephant's Head Cabossed",
    category: 'beasts',
    filename: 'elephants-head-cabossed-mono.svg',
    blazonTerm: "an elephant's head cabossed",
    description: "An elephant's head facing forward",
    keywords: ['elephant', 'head', 'cabossed', 'trunk']
  },
  hedgehogRampant: {
    name: 'Hedgehog Rampant',
    category: 'beasts',
    filename: 'hedgehog-rampant-2-mono.svg',
    blazonTerm: 'a hedgehog rampant',
    description: 'A hedgehog rearing up',
    keywords: ['hedgehog', 'rampant', 'urchin']
  },
  otterRampant: {
    name: 'Otter Rampant',
    category: 'beasts',
    filename: 'otter-rampant-2-mono.svg',
    blazonTerm: 'an otter rampant',
    description: 'An otter rearing up',
    keywords: ['otter', 'rampant', 'beast']
  },
  ottersCourantAnnulo: {
    name: 'Five Otters in Annulo',
    category: 'beasts',
    filename: 'otters-five-courant-in-annulo-mono.svg',
    blazonTerm: 'five otters courant in annulo',
    description: 'Five otters running in a circle',
    keywords: ['otter', 'annulo', 'circle', 'five']
  },
  rabbitSalient: {
    name: 'Rabbit Salient',
    category: 'beasts',
    filename: 'rabbit-salient-2-mono.svg',
    blazonTerm: 'a rabbit salient',
    description: 'A rabbit leaping',
    keywords: ['rabbit', 'salient', 'hare', 'coney']
  },
  rabbitsHeadCabossed: {
    name: "Rabbit's Head Cabossed",
    category: 'beasts',
    filename: 'rabbits-head-cabossed-1-mono.svg',
    blazonTerm: "a rabbit's head cabossed",
    description: "A rabbit's head facing forward",
    keywords: ['rabbit', 'head', 'cabossed', 'hare']
  },

  // BIRDS
  eagle5: {
    name: 'Eagle Displayed',
    category: 'birds',
    filename: 'eagle-5-mono.svg',
    blazonTerm: 'an eagle displayed',
    description: 'An eagle with wings spread',
    keywords: ['eagle', 'displayed', 'bird']
  },
  eagle20: {
    name: 'Eagle Displayed (Ornate)',
    category: 'birds',
    filename: 'eagle-20-mono.svg',
    blazonTerm: 'an eagle displayed',
    description: 'An ornate eagle with wings spread',
    keywords: ['eagle', 'displayed', 'bird', 'ornate']
  },
  eagleRising: {
    name: 'Eagle Rising',
    category: 'birds',
    filename: 'eagle-rising-2-mono.svg',
    blazonTerm: 'an eagle rising',
    description: 'An eagle taking flight',
    keywords: ['eagle', 'rising', 'bird']
  },
  eaglesHeadErased: {
    name: "Eagle's Head Erased",
    category: 'birds',
    filename: 'eagles-head-erased-2-mono.svg',
    blazonTerm: "an eagle's head erased",
    description: "An eagle's head torn off",
    keywords: ['eagle', 'head', 'erased']
  },
  eaglesLegErased: {
    name: "Eagle's Leg Erased",
    category: 'birds',
    filename: 'eagles-leg-erased-1-mono.svg',
    blazonTerm: "an eagle's leg erased",
    description: "An eagle's leg with talons",
    keywords: ['eagle', 'leg', 'talon', 'claw']
  },
  hawk1: {
    name: 'Hawk',
    category: 'birds',
    filename: 'hawk-1-mono.svg',
    blazonTerm: 'a hawk',
    description: 'A hawk',
    keywords: ['hawk', 'falcon', 'bird', 'raptor']
  },
  hawkRising: {
    name: 'Hawk Rising',
    category: 'birds',
    filename: 'hawk-rising-one-leg-raised-mono.svg',
    blazonTerm: 'a hawk rising one leg raised',
    description: 'A hawk rising with one leg raised',
    keywords: ['hawk', 'rising', 'bird', 'raptor']
  },
  falconStriking: {
    name: 'Falcon Striking',
    category: 'birds',
    filename: 'falcon-striking-mono.svg',
    blazonTerm: 'a falcon striking',
    description: 'A falcon diving to strike',
    keywords: ['falcon', 'striking', 'diving', 'stooping']
  },
  falconVolant: {
    name: 'Falcon Volant',
    category: 'birds',
    filename: 'falcon-volant-2-mono.svg',
    blazonTerm: 'a falcon volant',
    description: 'A falcon in flight',
    keywords: ['falcon', 'volant', 'flying', 'bird']
  },
  falconsHeadHooded: {
    name: "Falcon's Head Hooded",
    category: 'birds',
    filename: 'falcons-head-erased-and-hooded-mono.svg',
    blazonTerm: "a falcon's head erased and hooded",
    description: "A hooded falcon's head",
    keywords: ['falcon', 'head', 'hooded', 'falconry']
  },
  owl8: {
    name: 'Owl',
    category: 'birds',
    filename: 'owl-8-mono.svg',
    blazonTerm: 'an owl',
    description: 'An owl',
    keywords: ['owl', 'bird', 'wisdom']
  },
  owl14: {
    name: 'Owl (Detailed)',
    category: 'birds',
    filename: 'owl-14-mono.svg',
    blazonTerm: 'an owl',
    description: 'A detailed owl',
    keywords: ['owl', 'bird', 'wisdom']
  },
  owlLegRaised: {
    name: 'Owl Leg Raised',
    category: 'birds',
    filename: 'owl-dexter-leg-raised-mono.svg',
    blazonTerm: 'an owl dexter leg raised',
    description: 'An owl with one leg raised',
    keywords: ['owl', 'bird', 'leg']
  },
  owlDisplayed: {
    name: 'Owl Displayed',
    category: 'birds',
    filename: 'owl-displayed-1-mono.svg',
    blazonTerm: 'an owl displayed',
    description: 'An owl with wings spread',
    keywords: ['owl', 'displayed', 'bird']
  },
  owlRising: {
    name: 'Owl Rising',
    category: 'birds',
    filename: 'owl-rising-wings-displayed-mono.svg',
    blazonTerm: 'an owl rising wings displayed',
    description: 'An owl rising with wings displayed',
    keywords: ['owl', 'rising', 'displayed', 'bird']
  },
  cock: {
    name: 'Cock',
    category: 'birds',
    filename: 'cock-6-mono.svg',
    blazonTerm: 'a cock',
    description: 'A rooster',
    keywords: ['cock', 'rooster', 'bird', 'gamecock']
  },
  hen: {
    name: 'Hen',
    category: 'birds',
    filename: 'hen-1-mono.svg',
    blazonTerm: 'a hen',
    description: 'A domestic hen',
    keywords: ['hen', 'chicken', 'bird']
  },
  crane: {
    name: 'Crane',
    category: 'birds',
    filename: 'crane-2-mono.svg',
    blazonTerm: 'a crane',
    description: 'A crane',
    keywords: ['crane', 'heron', 'bird', 'wading']
  },
  heronVorant: {
    name: 'Heron Vorant of Fish',
    category: 'birds',
    filename: 'heron-wings-displayed-vorant-of-a-fish-mono.svg',
    blazonTerm: 'a heron wings displayed vorant of a fish',
    description: 'A heron eating a fish',
    keywords: ['heron', 'vorant', 'fish', 'eating']
  },
  crow6: {
    name: 'Crow',
    category: 'birds',
    filename: 'crow-6-mono.svg',
    blazonTerm: 'a crow',
    description: 'A crow',
    keywords: ['crow', 'raven', 'bird', 'corvid']
  },
  crowRegardant: {
    name: 'Crow Regardant',
    category: 'birds',
    filename: 'crow-regardant-mono.svg',
    blazonTerm: 'a crow regardant',
    description: 'A crow looking backward',
    keywords: ['crow', 'regardant', 'raven', 'bird']
  },
  duckPassant: {
    name: 'Duck Passant',
    category: 'birds',
    filename: 'duck-passant-mono.svg',
    blazonTerm: 'a duck passant',
    description: 'A duck walking',
    keywords: ['duck', 'passant', 'bird', 'waterfowl']
  },
  gooseEnraged: {
    name: 'Goose Enraged',
    category: 'birds',
    filename: 'goose-enraged-mono.svg',
    blazonTerm: 'a goose enraged',
    description: 'An angry goose',
    keywords: ['goose', 'enraged', 'bird', 'waterfowl']
  },
  doveMigrant: {
    name: 'Dove Migrant',
    category: 'birds',
    filename: 'dove-migrant-to-base-mono.svg',
    blazonTerm: 'a dove migrant to base',
    description: 'A dove flying downward',
    keywords: ['dove', 'migrant', 'peace', 'bird']
  },
  ostrich: {
    name: 'Ostrich',
    category: 'birds',
    filename: 'ostrich-1-mono.svg',
    blazonTerm: 'an ostrich',
    description: 'An ostrich',
    keywords: ['ostrich', 'bird', 'flightless']
  },
  peacockFeather: {
    name: 'Peacock Feather',
    category: 'birds',
    filename: 'peacock-feather-3-mono.svg',
    blazonTerm: 'a peacock feather',
    description: 'A peacock feather',
    keywords: ['peacock', 'feather', 'plume']
  },
  peacockInPride: {
    name: 'Peacock in Pride',
    category: 'birds',
    filename: 'peacock-in-his-pride-1-mono.svg',
    blazonTerm: 'a peacock in his pride',
    description: 'A peacock with tail displayed',
    keywords: ['peacock', 'pride', 'tail', 'displayed']
  },
  pelicanVulning: {
    name: 'Pelican Vulning',
    category: 'birds',
    filename: 'pelican-vulning-itself-2-mono.svg',
    blazonTerm: 'a pelican vulning itself',
    description: 'A pelican wounding itself to feed young',
    keywords: ['pelican', 'vulning', 'piety', 'christian']
  },
  feather1: {
    name: 'Feather',
    category: 'birds',
    filename: 'feather-1-mono.svg',
    blazonTerm: 'a feather',
    description: 'A single feather',
    keywords: ['feather', 'plume', 'quill']
  },
  feather6: {
    name: 'Feather (Ornate)',
    category: 'birds',
    filename: 'feather-6-mono.svg',
    blazonTerm: 'a feather',
    description: 'An ornate feather',
    keywords: ['feather', 'plume', 'quill']
  },
  birdsJambe: {
    name: "Bird's Jambe",
    category: 'birds',
    filename: 'birds-jambe-erased-1-mono.svg',
    blazonTerm: "a bird's jambe erased",
    description: "A bird's leg with claws",
    keywords: ['bird', 'leg', 'jambe', 'claw']
  },

  // SEA CREATURES
  fish10: {
    name: 'Fish',
    category: 'seaCreatures',
    filename: 'fish-10-mono.svg',
    blazonTerm: 'a fish',
    description: 'A generic fish',
    keywords: ['fish', 'sea', 'marine']
  },
  barbel: {
    name: 'Barbel',
    category: 'seaCreatures',
    filename: 'barbel-1-mono.svg',
    blazonTerm: 'a barbel',
    description: 'A barbel fish',
    keywords: ['barbel', 'fish', 'freshwater']
  },
  salmonHaurient: {
    name: 'Salmon Haurient',
    category: 'seaCreatures',
    filename: 'salmon-haurient-mono.svg',
    blazonTerm: 'a salmon haurient',
    description: 'A salmon leaping upward',
    keywords: ['salmon', 'haurient', 'fish', 'leaping']
  },
  trout: {
    name: 'Trout',
    category: 'seaCreatures',
    filename: 'trout-mono.svg',
    blazonTerm: 'a trout',
    description: 'A trout',
    keywords: ['trout', 'fish', 'freshwater']
  },
  eel: {
    name: 'Eel',
    category: 'seaCreatures',
    filename: 'eel-1-mono.svg',
    blazonTerm: 'an eel',
    description: 'An eel',
    keywords: ['eel', 'fish', 'serpentine']
  },
  eelHaurient: {
    name: 'Eel Haurient',
    category: 'seaCreatures',
    filename: 'eel-haurient-mono.svg',
    blazonTerm: 'an eel haurient',
    description: 'An eel rising upward',
    keywords: ['eel', 'haurient', 'rising']
  },
  whaleHaurient: {
    name: 'Whale Haurient',
    category: 'seaCreatures',
    filename: 'whale-haurient-embowed-mono.svg',
    blazonTerm: 'a whale haurient embowed',
    description: 'A whale rising and curved',
    keywords: ['whale', 'haurient', 'marine']
  },
  escallop: {
    name: 'Escallop',
    category: 'seaCreatures',
    filename: 'escallop-3-mono.svg',
    blazonTerm: 'an escallop',
    description: 'A scallop shell',
    keywords: ['escallop', 'shell', 'scallop', 'pilgrimage']
  },
  murexShell: {
    name: 'Murex Shell',
    category: 'seaCreatures',
    filename: 'murex-shell-mono.svg',
    blazonTerm: 'a murex shell',
    description: 'A murex shell',
    keywords: ['murex', 'shell', 'snail', 'purple']
  },
  nautilusShell: {
    name: 'Nautilus Shell',
    category: 'seaCreatures',
    filename: 'nautilus-shell-mono.svg',
    blazonTerm: 'a nautilus shell',
    description: 'A nautilus shell',
    keywords: ['nautilus', 'shell', 'spiral']
  },
  snailShell: {
    name: 'Snail Shell',
    category: 'seaCreatures',
    filename: 'snail-shell-1-mono.svg',
    blazonTerm: 'a snail shell',
    description: 'A snail shell',
    keywords: ['snail', 'shell', 'spiral']
  },
  crab: {
    name: 'Crab',
    category: 'seaCreatures',
    filename: 'crab-2-mono.svg',
    blazonTerm: 'a crab',
    description: 'A crab',
    keywords: ['crab', 'crustacean', 'sea']
  },
  crabsClaws: {
    name: "Crab's Claws",
    category: 'seaCreatures',
    filename: 'crabs-claws-pair-of-mono.svg',
    blazonTerm: "a pair of crab's claws",
    description: 'A pair of crab claws',
    keywords: ['crab', 'claws', 'pincers']
  },
  lobster: {
    name: 'Lobster',
    category: 'seaCreatures',
    filename: 'lobster-2-mono.svg',
    blazonTerm: 'a lobster',
    description: 'A lobster',
    keywords: ['lobster', 'crustacean', 'sea']
  },
  polypus1: {
    name: 'Polypus',
    category: 'seaCreatures',
    filename: 'polypus-1-mono.svg',
    blazonTerm: 'a polypus',
    description: 'An octopus',
    keywords: ['polypus', 'octopus', 'tentacles']
  },
  polypus5: {
    name: 'Polypus (Detailed)',
    category: 'seaCreatures',
    filename: 'polypus-5-mono.svg',
    blazonTerm: 'a polypus',
    description: 'A detailed octopus',
    keywords: ['polypus', 'octopus', 'tentacles']
  },
  calamarie: {
    name: 'Calamarie',
    category: 'seaCreatures',
    filename: 'calamarie-3-mono.svg',
    blazonTerm: 'a calamarie',
    description: 'A squid',
    keywords: ['calamarie', 'squid', 'cephalopod']
  },
  seaHorseNatural: {
    name: 'Sea Horse (Natural)',
    category: 'seaCreatures',
    filename: 'sea-horse-natural-2-mono.svg',
    blazonTerm: 'a sea horse natural',
    description: 'A natural seahorse',
    keywords: ['seahorse', 'hippocampus', 'natural']
  },
  seaTortoise: {
    name: 'Sea Tortoise',
    category: 'seaCreatures',
    filename: 'sea-tortoise-natural-1-mono.svg',
    blazonTerm: 'a sea tortoise natural',
    description: 'A sea turtle',
    keywords: ['tortoise', 'turtle', 'sea']
  },
  seaBear: {
    name: 'Sea Bear',
    category: 'seaCreatures',
    filename: 'sea-bear-mono.svg',
    blazonTerm: 'a sea bear',
    description: 'A bear with fish tail',
    keywords: ['sea bear', 'hybrid', 'monster']
  },
  seaBoar: {
    name: 'Sea Boar',
    category: 'seaCreatures',
    filename: 'sea-boar-mono.svg',
    blazonTerm: 'a sea boar',
    description: 'A boar with fish tail',
    keywords: ['sea boar', 'hybrid', 'monster']
  },
  seaBull: {
    name: 'Sea Bull',
    category: 'seaCreatures',
    filename: 'sea-bull-mono.svg',
    blazonTerm: 'a sea bull',
    description: 'A bull with fish tail',
    keywords: ['sea bull', 'hybrid', 'monster']
  },
  seaDog: {
    name: 'Sea Dog',
    category: 'seaCreatures',
    filename: 'sea-dog-1-mono.svg',
    blazonTerm: 'a sea dog',
    description: 'A dog with fish tail and fins',
    keywords: ['sea dog', 'hybrid', 'monster']
  },
  seaFerret: {
    name: 'Sea Ferret',
    category: 'seaCreatures',
    filename: 'sea-ferret-mono.svg',
    blazonTerm: 'a sea ferret',
    description: 'A ferret with fish tail',
    keywords: ['sea ferret', 'hybrid', 'monster']
  },
  seaFox: {
    name: 'Sea Fox',
    category: 'seaCreatures',
    filename: 'sea-fox-mono.svg',
    blazonTerm: 'a sea fox',
    description: 'A fox with fish tail',
    keywords: ['sea fox', 'hybrid', 'monster']
  },
  seaGoat: {
    name: 'Sea Goat',
    category: 'seaCreatures',
    filename: 'sea-goat-mono.svg',
    blazonTerm: 'a sea goat',
    description: 'A goat with fish tail (capricorn)',
    keywords: ['sea goat', 'capricorn', 'hybrid']
  },
  seaLeopard: {
    name: 'Sea Leopard',
    category: 'seaCreatures',
    filename: 'sea-leopard-guardant-mono.svg',
    blazonTerm: 'a sea leopard guardant',
    description: 'A leopard with fish tail',
    keywords: ['sea leopard', 'hybrid', 'monster']
  },
  seaSerpentAnnulo: {
    name: 'Sea Serpent in Annulo',
    category: 'seaCreatures',
    filename: 'sea-serpent-in-annulo-vorant-of-its-tail-mono.svg',
    blazonTerm: 'a sea serpent in annulo vorant of its tail',
    description: 'A sea serpent eating its tail (ouroboros)',
    keywords: ['sea serpent', 'ouroboros', 'circle', 'eternal']
  },
  seaSerpentOndoyant: {
    name: 'Sea Serpent Ondoyant',
    category: 'seaCreatures',
    filename: 'sea-serpent-ondoyant-2-mono.svg',
    blazonTerm: 'a sea serpent ondoyant',
    description: 'An undulating sea serpent',
    keywords: ['sea serpent', 'ondoyant', 'wave', 'monster']
  },
  seaSheep: {
    name: 'Sea Sheep',
    category: 'seaCreatures',
    filename: 'sea-sheep-mono.svg',
    blazonTerm: 'a sea sheep',
    description: 'A sheep with fish tail',
    keywords: ['sea sheep', 'hybrid', 'monster']
  },
  seaSquirrel: {
    name: 'Sea Squirrel',
    category: 'seaCreatures',
    filename: 'sea-squirrel-mono.svg',
    blazonTerm: 'a sea squirrel',
    description: 'A squirrel with fish tail',
    keywords: ['sea squirrel', 'hybrid', 'monster']
  },
  seaWolf: {
    name: 'Sea Wolf',
    category: 'seaCreatures',
    filename: 'sea-wolf-6-mono.svg',
    blazonTerm: 'a sea wolf',
    description: 'A wolf with fish tail',
    keywords: ['sea wolf', 'hybrid', 'monster']
  },
  mermaid: {
    name: 'Mermaid',
    category: 'seaCreatures',
    filename: 'mermaid-2-mono.svg',
    blazonTerm: 'a mermaid',
    description: 'A mermaid',
    keywords: ['mermaid', 'siren', 'marine']
  },
  merman: {
    name: 'Merman (Triton)',
    category: 'seaCreatures',
    filename: 'merman-or-triton-1-mono.svg',
    blazonTerm: 'a merman',
    description: 'A merman or triton',
    keywords: ['merman', 'triton', 'marine']
  },

  // MYTHICAL
  dragon6: {
    name: 'Dragon',
    category: 'mythical',
    filename: 'dragon-6-mono.svg',
    blazonTerm: 'a dragon',
    description: 'A dragon rampant',
    keywords: ['dragon', 'mythical', 'beast']
  },
  dragonCouchant: {
    name: 'Dragon Couchant',
    category: 'mythical',
    filename: 'dragon-couchant-dexter-forepaw-raised-mono.svg',
    blazonTerm: 'a dragon couchant dexter forepaw raised',
    description: 'A dragon lying with paw raised',
    keywords: ['dragon', 'couchant', 'mythical']
  },
  dragonPassant: {
    name: 'Dragon Passant',
    category: 'mythical',
    filename: 'dragon-passant-6-mono.svg',
    blazonTerm: 'a dragon passant',
    description: 'A dragon walking',
    keywords: ['dragon', 'passant', 'mythical']
  },
  dragonsHeadErased: {
    name: "Dragon's Head Erased",
    category: 'mythical',
    filename: 'dragons-head-erased-1-mono.svg',
    blazonTerm: "a dragon's head erased",
    description: "A dragon's head torn off",
    keywords: ['dragon', 'head', 'erased']
  },
  dragonsLegCouped: {
    name: "Dragon's Leg Couped",
    category: 'mythical',
    filename: 'dragons-leg-couped-4-mono.svg',
    blazonTerm: "a dragon's leg couped",
    description: "A dragon's leg cut off",
    keywords: ['dragon', 'leg', 'couped', 'claw']
  },
  griffinCouchant: {
    name: 'Griffin Couchant',
    category: 'mythical',
    filename: 'griffin-couchant-mono.svg',
    blazonTerm: 'a griffin couchant',
    description: 'A griffin lying down',
    keywords: ['griffin', 'couchant', 'eagle', 'lion']
  },
  unicornCourant: {
    name: 'Unicorn Courant',
    category: 'mythical',
    filename: 'unicorn-courant-2-mono.svg',
    blazonTerm: 'a unicorn courant',
    description: 'A unicorn running',
    keywords: ['unicorn', 'courant', 'horse', 'horn']
  },
  unicornRegardant: {
    name: 'Unicorn Regardant',
    category: 'mythical',
    filename: 'unicorn-regardant-mono.svg',
    blazonTerm: 'a unicorn regardant',
    description: 'A unicorn looking backward',
    keywords: ['unicorn', 'regardant', 'horse', 'horn']
  },
  pegasusSegreant: {
    name: 'Pegasus Segreant',
    category: 'mythical',
    filename: 'pegasus-segreant-1-mono.svg',
    blazonTerm: 'a pegasus segreant',
    description: 'A winged horse rearing',
    keywords: ['pegasus', 'segreant', 'winged', 'horse']
  },
  phoenix: {
    name: 'Phoenix',
    category: 'mythical',
    filename: 'phoenix-4-mono.svg',
    blazonTerm: 'a phoenix',
    description: 'A phoenix rising from flames',
    keywords: ['phoenix', 'fire', 'rebirth', 'bird']
  },
  basilisk: {
    name: 'Basilisk',
    category: 'mythical',
    filename: 'basilisk-mono.svg',
    blazonTerm: 'a basilisk',
    description: 'A basilisk (cockatrice variant)',
    keywords: ['basilisk', 'cockatrice', 'serpent', 'mythical']
  },
  cockatriceSejant: {
    name: 'Cockatrice Sejant',
    category: 'mythical',
    filename: 'cockatrice-sejant-dexter-forepaw-raised-mono.svg',
    blazonTerm: 'a cockatrice sejant dexter forepaw raised',
    description: 'A cockatrice sitting',
    keywords: ['cockatrice', 'sejant', 'mythical']
  },
  harpyRising: {
    name: 'Harpy Rising',
    category: 'mythical',
    filename: 'harpy-rising-wings-displayed-mono.svg',
    blazonTerm: 'a harpy rising wings displayed',
    description: 'A harpy with wings spread',
    keywords: ['harpy', 'rising', 'woman', 'bird']
  },
  hydraPassant: {
    name: 'Hydra Passant',
    category: 'mythical',
    filename: 'hydra-passant-2-mono.svg',
    blazonTerm: 'a hydra passant',
    description: 'A multi-headed hydra walking',
    keywords: ['hydra', 'passant', 'heads', 'serpent']
  },
  salamanderRegardant: {
    name: 'Salamander Regardant',
    category: 'mythical',
    filename: 'salamander-regardant-2-mono.svg',
    blazonTerm: 'a salamander regardant',
    description: 'A salamander looking backward',
    keywords: ['salamander', 'regardant', 'fire', 'lizard']
  },

  // MORE INSECTS
  beetle: {
    name: 'Beetle',
    category: 'insects',
    filename: 'beetle-1-mono.svg',
    blazonTerm: 'a beetle',
    description: 'A beetle',
    keywords: ['beetle', 'insect', 'scarab']
  },
  butterfly: {
    name: 'Butterfly',
    category: 'insects',
    filename: 'butterfly-3-mono.svg',
    blazonTerm: 'a butterfly',
    description: 'A butterfly',
    keywords: ['butterfly', 'insect', 'papillon']
  },
  cicada: {
    name: 'Cicada',
    category: 'insects',
    filename: 'cicada-3-mono.svg',
    blazonTerm: 'a cicada',
    description: 'A cicada',
    keywords: ['cicada', 'insect']
  },
  dragonfly: {
    name: 'Dragonfly',
    category: 'insects',
    filename: 'dragonfly-2-mono.svg',
    blazonTerm: 'a dragonfly',
    description: 'A dragonfly',
    keywords: ['dragonfly', 'insect']
  },
  grasshopperStatant: {
    name: 'Grasshopper Statant',
    category: 'insects',
    filename: 'grasshopper-statant-1-mono.svg',
    blazonTerm: 'a grasshopper statant',
    description: 'A grasshopper standing',
    keywords: ['grasshopper', 'insect', 'locust']
  },
  ladybird: {
    name: 'Ladybird',
    category: 'insects',
    filename: 'ladybird-mono.svg',
    blazonTerm: 'a ladybird',
    description: 'A ladybug',
    keywords: ['ladybird', 'ladybug', 'insect', 'beetle']
  },
  spider1: {
    name: 'Spider',
    category: 'insects',
    filename: 'spider-1-mono.svg',
    blazonTerm: 'a spider',
    description: 'A spider',
    keywords: ['spider', 'arachnid']
  },
  spider4: {
    name: 'Spider (Detailed)',
    category: 'insects',
    filename: 'spider-4-mono.svg',
    blazonTerm: 'a spider',
    description: 'A detailed spider',
    keywords: ['spider', 'arachnid']
  },
  snail: {
    name: 'Snail',
    category: 'insects',
    filename: 'snail-2-mono.svg',
    blazonTerm: 'a snail',
    description: 'A snail',
    keywords: ['snail', 'gastropod', 'shell']
  },

  // MORE SERPENTS
  crocodileRampant: {
    name: 'Crocodile Rampant',
    category: 'serpents',
    filename: 'crocodile-rampant-1-mono.svg',
    blazonTerm: 'a crocodile rampant',
    description: 'A crocodile rearing up',
    keywords: ['crocodile', 'alligator', 'reptile']
  },
  lizardRampant: {
    name: 'Lizard Rampant',
    category: 'serpents',
    filename: 'lizard-rampant-1-mono.svg',
    blazonTerm: 'a lizard rampant',
    description: 'A lizard rearing up',
    keywords: ['lizard', 'reptile']
  },
  chameleonSalient: {
    name: 'Chameleon Salient',
    category: 'serpents',
    filename: 'chameleon-salient-mono.svg',
    blazonTerm: 'a chameleon salient',
    description: 'A chameleon leaping',
    keywords: ['chameleon', 'lizard', 'reptile']
  },
  frog4: {
    name: 'Frog',
    category: 'serpents',
    filename: 'frog-4-mono.svg',
    blazonTerm: 'a frog',
    description: 'A frog',
    keywords: ['frog', 'toad', 'amphibian']
  },
  frogSejant: {
    name: 'Frog Sejant',
    category: 'serpents',
    filename: 'frog-sejant-2-mono.svg',
    blazonTerm: 'a frog sejant',
    description: 'A frog sitting',
    keywords: ['frog', 'toad', 'sejant', 'amphibian']
  },
  bat: {
    name: 'Bat',
    category: 'serpents',
    filename: 'bat-2-mono.svg',
    blazonTerm: 'a bat',
    description: 'A bat displayed',
    keywords: ['bat', 'wings', 'night']
  },

  // ARCHITECTURE
  castle7: {
    name: 'Castle',
    category: 'architecture',
    filename: 'castle-7-mono.svg',
    blazonTerm: 'a castle',
    description: 'A castle',
    keywords: ['castle', 'fortress', 'building']
  },
  castleThreeTowers: {
    name: 'Castle of Three Towers',
    category: 'architecture',
    filename: 'castle-of-three-towers-2-mono.svg',
    blazonTerm: 'a castle of three towers',
    description: 'A castle with three towers',
    keywords: ['castle', 'towers', 'fortress']
  },
  tower12: {
    name: 'Tower',
    category: 'architecture',
    filename: 'tower-12-mono.svg',
    blazonTerm: 'a tower',
    description: 'A tower',
    keywords: ['tower', 'castle', 'fortification']
  },
  tower18: {
    name: 'Tower (Ornate)',
    category: 'architecture',
    filename: 'tower-18-mono.svg',
    blazonTerm: 'a tower',
    description: 'An ornate tower',
    keywords: ['tower', 'castle', 'fortification']
  },
  tower42: {
    name: 'Tower (Tall)',
    category: 'architecture',
    filename: 'tower-42-mono.svg',
    blazonTerm: 'a tower',
    description: 'A tall tower',
    keywords: ['tower', 'castle', 'fortification']
  },
  bridge: {
    name: 'Bridge of Three Arches',
    category: 'architecture',
    filename: 'bridge-of-three-arches-1-mono.svg',
    blazonTerm: 'a bridge of three arches',
    description: 'A stone bridge with three arches',
    keywords: ['bridge', 'arches', 'stone']
  },
  archesPair: {
    name: 'Pair of Arches',
    category: 'architecture',
    filename: 'arches-pair-of-1-mono.svg',
    blazonTerm: 'a pair of arches',
    description: 'Two connected arches',
    keywords: ['arches', 'architecture']
  },
  doorArched: {
    name: 'Arched Door',
    category: 'architecture',
    filename: 'door-arched-2-mono.svg',
    blazonTerm: 'a door arched',
    description: 'An arched doorway',
    keywords: ['door', 'arch', 'portal', 'gate']
  },
  column: {
    name: 'Column',
    category: 'architecture',
    filename: 'column-11-mono.svg',
    blazonTerm: 'a column',
    description: 'A classical column',
    keywords: ['column', 'pillar', 'classical']
  },
  portcullis: {
    name: 'Portcullis',
    category: 'architecture',
    filename: 'portcullis-3-mono.svg',
    blazonTerm: 'a portcullis',
    description: 'A castle gate portcullis',
    keywords: ['portcullis', 'gate', 'castle']
  },
  lighthouse: {
    name: 'Lighthouse',
    category: 'architecture',
    filename: 'lighthouse-1-mono.svg',
    blazonTerm: 'a lighthouse',
    description: 'A lighthouse',
    keywords: ['lighthouse', 'beacon', 'tower']
  },
  pavilion: {
    name: 'Pavilion',
    category: 'architecture',
    filename: 'pavilion-5-mono.svg',
    blazonTerm: 'a pavilion',
    description: 'A tent or pavilion',
    keywords: ['pavilion', 'tent', 'camp']
  },

  // OBJECTS
  amphora: {
    name: 'Amphora',
    category: 'objects',
    filename: 'amphora-4-mono.svg',
    blazonTerm: 'an amphora',
    description: 'A classical amphora vessel',
    keywords: ['amphora', 'vessel', 'jar', 'greek']
  },
  chalice: {
    name: 'Chalice',
    category: 'objects',
    filename: 'chalice-1-mono.svg',
    blazonTerm: 'a chalice',
    description: 'A ceremonial chalice',
    keywords: ['chalice', 'cup', 'goblet', 'grail']
  },
  cup: {
    name: 'Cup',
    category: 'objects',
    filename: 'cup-9-mono.svg',
    blazonTerm: 'a cup',
    description: 'A drinking cup',
    keywords: ['cup', 'goblet', 'vessel']
  },
  hornDrinking: {
    name: 'Drinking Horn',
    category: 'objects',
    filename: 'horn-drinking-1-mono.svg',
    blazonTerm: 'a drinking horn',
    description: 'A drinking horn',
    keywords: ['horn', 'drinking', 'viking', 'norse']
  },
  hornsFretted: {
    name: 'Three Horns Fretted',
    category: 'objects',
    filename: 'horns-three-drinking-fretted-mono.svg',
    blazonTerm: 'three drinking horns fretted',
    description: 'Three interlocked drinking horns',
    keywords: ['horn', 'fretted', 'three', 'triskelion']
  },
  pitcher: {
    name: 'Pitcher',
    category: 'objects',
    filename: 'pitcher-2-mono.svg',
    blazonTerm: 'a pitcher',
    description: 'A water pitcher',
    keywords: ['pitcher', 'jug', 'ewer', 'vessel']
  },
  cauldron: {
    name: 'Cauldron',
    category: 'objects',
    filename: 'cauldron-4-mono.svg',
    blazonTerm: 'a cauldron',
    description: 'A cooking cauldron',
    keywords: ['cauldron', 'pot', 'kettle']
  },
  brazier: {
    name: 'Brazier',
    category: 'objects',
    filename: 'brazier-mono.svg',
    blazonTerm: 'a brazier',
    description: 'A fire brazier',
    keywords: ['brazier', 'fire', 'flame']
  },
  cresset: {
    name: 'Cresset',
    category: 'objects',
    filename: 'cresset-2-mono.svg',
    blazonTerm: 'a cresset',
    description: 'A fire basket or beacon',
    keywords: ['cresset', 'beacon', 'fire', 'light']
  },
  chairCurule: {
    name: 'Curule Chair',
    category: 'objects',
    filename: 'chair-curule-mono.svg',
    blazonTerm: 'a curule chair',
    description: 'A Roman curule chair',
    keywords: ['chair', 'curule', 'roman', 'throne']
  },

  // BODY PARTS
  fist: {
    name: 'Fist',
    category: 'bodyParts',
    filename: 'fist-mono.svg',
    blazonTerm: 'a fist',
    description: 'A clenched fist',
    keywords: ['fist', 'hand', 'clenched']
  },
  woman: {
    name: 'Woman',
    category: 'bodyParts',
    filename: 'woman-4-mono.svg',
    blazonTerm: 'a woman',
    description: 'A woman figure',
    keywords: ['woman', 'figure', 'person']
  },

  // MILITARY
  helm: {
    name: 'Helm (Affronty)',
    category: 'military',
    filename: 'helm-close-affronty-1-mono.svg',
    blazonTerm: 'a helm affronty',
    description: 'A closed helm facing forward',
    keywords: ['helm', 'helmet', 'armor', 'knight']
  },
  breastplate: {
    name: 'Breastplate',
    category: 'military',
    filename: 'breastplate-2-mono.svg',
    blazonTerm: 'a breastplate',
    description: 'A suit of plate armor',
    keywords: ['breastplate', 'armor', 'cuirass']
  },
  gauntletAversed: {
    name: 'Gauntlet Aversed',
    category: 'military',
    filename: 'gauntlet-aversed-3-mono.svg',
    blazonTerm: 'a gauntlet aversed',
    description: 'An armored glove showing back of hand',
    keywords: ['gauntlet', 'glove', 'armor', 'hand']
  },
  gauntletClenched: {
    name: 'Gauntlet Clenched',
    category: 'military',
    filename: 'gauntlet-clenched-3-mono.svg',
    blazonTerm: 'a gauntlet clenched',
    description: 'An armored fist',
    keywords: ['gauntlet', 'fist', 'armor', 'hand']
  },
  pennon: {
    name: 'Pennon',
    category: 'military',
    filename: 'pennon-5-mono.svg',
    blazonTerm: 'a pennon',
    description: "A knight's pennant flag",
    keywords: ['pennon', 'flag', 'banner', 'pennant']
  },
  arrow: {
    name: 'Arrow',
    category: 'military',
    filename: 'arrow-1-mono.svg',
    blazonTerm: 'an arrow',
    description: 'A single arrow',
    keywords: ['arrow', 'archery', 'projectile']
  },

  // CELESTIAL
  sun7: {
    name: 'Sun',
    category: 'celestial',
    filename: 'sun-7-mono.svg',
    blazonTerm: 'a sun',
    description: 'A sun with rays',
    keywords: ['sun', 'solar', 'celestial']
  },
  sunInSplendor: {
    name: 'Sun in His Splendor',
    category: 'celestial',
    filename: 'sun-in-his-splendor-1-mono.svg',
    blazonTerm: 'a sun in his splendor',
    description: 'A sun with face and rays',
    keywords: ['sun', 'splendor', 'face', 'celestial']
  },
  sunDemi: {
    name: 'Demi Sun',
    category: 'celestial',
    filename: 'sun-demi-2-mono.svg',
    blazonTerm: 'a demi sun',
    description: 'A half sun rising',
    keywords: ['sun', 'demi', 'rising', 'celestial']
  },
  moonPlenitude: {
    name: 'Moon in Plenitude',
    category: 'celestial',
    filename: 'moon-in-her-plenitude-3-mono.svg',
    blazonTerm: 'a moon in her plenitude',
    description: 'A full moon with face',
    keywords: ['moon', 'full', 'plenitude', 'celestial']
  },
  moonIncrescent: {
    name: 'Moon Increscent',
    category: 'celestial',
    filename: 'moon-increscent-1-mono.svg',
    blazonTerm: 'a moon increscent',
    description: 'A waxing crescent moon',
    keywords: ['moon', 'crescent', 'increscent', 'celestial']
  },
  crescent1: {
    name: 'Crescent',
    category: 'celestial',
    filename: 'crescent-1-mono.svg',
    blazonTerm: 'a crescent',
    description: 'A crescent moon',
    keywords: ['crescent', 'moon', 'celestial']
  },
  crescent9: {
    name: 'Crescent (Ornate)',
    category: 'celestial',
    filename: 'crescent-9-mono.svg',
    blazonTerm: 'a crescent',
    description: 'An ornate crescent',
    keywords: ['crescent', 'moon', 'celestial']
  },
  crescent16: {
    name: 'Crescent (Detailed)',
    category: 'celestial',
    filename: 'crescent-16-mono.svg',
    blazonTerm: 'a crescent',
    description: 'A detailed crescent',
    keywords: ['crescent', 'moon', 'celestial']
  },
  estoile: {
    name: 'Estoile',
    category: 'celestial',
    filename: 'estoile-2-mono.svg',
    blazonTerm: 'an estoile',
    description: 'A wavy-rayed star',
    keywords: ['estoile', 'star', 'celestial']
  },
  mullet5: {
    name: 'Mullet',
    category: 'celestial',
    filename: 'mullet-of-5-points-2-mono.svg',
    blazonTerm: 'a mullet',
    description: 'A five-pointed star',
    keywords: ['mullet', 'star', 'five', 'celestial']
  },
  mullet6: {
    name: 'Mullet of 6 Points',
    category: 'celestial',
    filename: 'mullet-of-6-points-1-mono.svg',
    blazonTerm: 'a mullet of six points',
    description: 'A six-pointed star',
    keywords: ['mullet', 'star', 'six', 'celestial']
  },
  comet: {
    name: 'Comet',
    category: 'celestial',
    filename: 'comet-4-mono.svg',
    blazonTerm: 'a comet',
    description: 'A comet with tail',
    keywords: ['comet', 'star', 'tail', 'celestial']
  },
  rainbow: {
    name: 'Rainbow',
    category: 'celestial',
    filename: 'rainbow-1-mono.svg',
    blazonTerm: 'a rainbow',
    description: 'A rainbow arc',
    keywords: ['rainbow', 'arc', 'celestial']
  },
  snowflake1: {
    name: 'Snowflake',
    category: 'celestial',
    filename: 'snowflake-1-mono.svg',
    blazonTerm: 'a snowflake',
    description: 'A snowflake',
    keywords: ['snowflake', 'ice', 'winter']
  },
  flame: {
    name: 'Flame',
    category: 'celestial',
    filename: 'flame-6-mono.svg',
    blazonTerm: 'a flame',
    description: 'A flame',
    keywords: ['flame', 'fire', 'burning']
  },
  compassRose: {
    name: 'Compass Rose',
    category: 'celestial',
    filename: 'compass-rose-2-mono.svg',
    blazonTerm: 'a compass rose',
    description: 'A compass rose',
    keywords: ['compass', 'rose', 'navigation', 'direction']
  },

  // GEOMETRIC
  lozenge1: {
    name: 'Lozenge',
    category: 'geometric',
    filename: 'lozenge-1-mono.svg',
    blazonTerm: 'a lozenge',
    description: 'A diamond shape',
    keywords: ['lozenge', 'diamond', 'geometric']
  },
  mascle1: {
    name: 'Mascle',
    category: 'geometric',
    filename: 'mascle-1-mono.svg',
    blazonTerm: 'a mascle',
    description: 'A voided lozenge',
    keywords: ['mascle', 'lozenge', 'voided', 'geometric']
  },
  rustre: {
    name: 'Rustre',
    category: 'geometric',
    filename: 'rustre-2-mono.svg',
    blazonTerm: 'a rustre',
    description: 'A lozenge with round hole',
    keywords: ['rustre', 'lozenge', 'pierced', 'geometric']
  },
  billet: {
    name: 'Billet',
    category: 'geometric',
    filename: 'billet-mono.svg',
    blazonTerm: 'a billet',
    description: 'A rectangle',
    keywords: ['billet', 'rectangle', 'geometric']
  },
  delf: {
    name: 'Delf',
    category: 'geometric',
    filename: 'delf-mono.svg',
    blazonTerm: 'a delf',
    description: 'A square',
    keywords: ['delf', 'square', 'geometric']
  },
  triangle: {
    name: 'Triangle',
    category: 'geometric',
    filename: 'triangle-mono.svg',
    blazonTerm: 'a triangle',
    description: 'A triangle',
    keywords: ['triangle', 'geometric']
  },
  annuletsFiveInterlaced: {
    name: 'Five Annulets Interlaced',
    category: 'geometric',
    filename: 'annulets-five-interlaced-in-cross-mono.svg',
    blazonTerm: 'five annulets interlaced in cross',
    description: 'Five interlocked rings in cross pattern',
    keywords: ['annulet', 'ring', 'five', 'interlaced']
  },
  ermineSpot1: {
    name: 'Ermine Spot',
    category: 'geometric',
    filename: 'ermine-spot-1-mono.svg',
    blazonTerm: 'an ermine spot',
    description: 'A single ermine spot',
    keywords: ['ermine', 'spot', 'fur']
  },
  mountainDevice: {
    name: 'Mountain',
    category: 'geometric',
    filename: 'mountain-1-device-mono.svg',
    blazonTerm: 'a mountain',
    description: 'A mountain',
    keywords: ['mountain', 'mount', 'landscape']
  },

  // CROSSES
  crossBottony: {
    name: 'Cross Bottony',
    category: 'crosses',
    filename: 'cross-bottony-1-mono.svg',
    blazonTerm: 'a cross bottony',
    description: 'A cross with trefoil ends',
    keywords: ['cross', 'bottony', 'trefoil']
  },
  crossAvellane: {
    name: 'Cross Avellane',
    category: 'crosses',
    filename: 'cross-avellane-2-mono.svg',
    blazonTerm: 'a cross avellane',
    description: 'A cross with filbert-shaped ends',
    keywords: ['cross', 'avellane', 'filbert']
  },
  crossFourchy: {
    name: 'Cross Fourchy',
    category: 'crosses',
    filename: 'cross-fourchy-4-mono.svg',
    blazonTerm: 'a cross fourchy',
    description: 'A cross with forked ends',
    keywords: ['cross', 'fourchy', 'forked']
  },
  crossBowen: {
    name: 'Cross Bowen',
    category: 'crosses',
    filename: 'cross-bowen-mono.svg',
    blazonTerm: 'a cross bowen',
    description: 'A Bowen knot cross',
    keywords: ['cross', 'bowen', 'knot']
  },
  crossCalatrava: {
    name: 'Cross of Calatrava',
    category: 'crosses',
    filename: 'cross-of-calatrava-3-mono.svg',
    blazonTerm: 'a cross of Calatrava',
    description: 'The cross of the Order of Calatrava',
    keywords: ['cross', 'calatrava', 'order', 'military']
  },
  escarbuncle: {
    name: 'Escarbuncle',
    category: 'crosses',
    filename: 'escarbuncle-7-mono.svg',
    blazonTerm: 'an escarbuncle',
    description: 'A radiating ornament',
    keywords: ['escarbuncle', 'rays', 'radiating']
  },

  // KNOTS
  knotStafford: {
    name: 'Stafford Knot',
    category: 'knots',
    filename: 'knot-stafford-3-mono.svg',
    blazonTerm: 'a Stafford knot',
    description: 'The Stafford family knot',
    keywords: ['knot', 'stafford', 'heraldic']
  },
  knotWake: {
    name: 'Wake Knot',
    category: 'knots',
    filename: 'knot-wake-or-ormonde-knot-2-mono.svg',
    blazonTerm: 'a Wake knot',
    description: 'The Wake or Ormonde knot',
    keywords: ['knot', 'wake', 'ormonde', 'heraldic']
  },
  knotSolomons: {
    name: "Solomon's Knot",
    category: 'knots',
    filename: 'knot-solomons-2-mono.svg',
    blazonTerm: "a Solomon's knot",
    description: 'An interlaced Solomon knot',
    keywords: ['knot', 'solomon', 'interlaced']
  },
  triquetra: {
    name: 'Triquetra',
    category: 'knots',
    filename: 'triquetra-3-mono.svg',
    blazonTerm: 'a triquetra',
    description: 'A Celtic three-pointed knot',
    keywords: ['triquetra', 'trinity', 'celtic', 'knot']
  },
  triskelionArms: {
    name: 'Triskelion of Arms',
    category: 'knots',
    filename: 'arms-triskelion-of-mono.svg',
    blazonTerm: 'a triskelion of arms',
    description: 'Three bent arms in spiral',
    keywords: ['triskelion', 'arms', 'spiral']
  },
  triskelionLegs: {
    name: 'Triskelion of Legs',
    category: 'knots',
    filename: 'legs-triskelion-of-armored-1-mono.svg',
    blazonTerm: 'a triskelion of armored legs',
    description: 'Three armored legs (Isle of Man)',
    keywords: ['triskelion', 'legs', 'armored', 'mann']
  },
  labyrinth: {
    name: 'Labyrinth',
    category: 'knots',
    filename: 'labyrinth-1-mono.svg',
    blazonTerm: 'a labyrinth',
    description: 'A maze pattern',
    keywords: ['labyrinth', 'maze', 'pattern']
  },

  // SYMBOLS
  heart8: {
    name: 'Heart',
    category: 'symbols',
    filename: 'heart-8-mono.svg',
    blazonTerm: 'a heart',
    description: 'A heart',
    keywords: ['heart', 'love', 'symbol']
  },
  heartWinged: {
    name: 'Heart Winged',
    category: 'symbols',
    filename: 'heart-winged-1-mono.svg',
    blazonTerm: 'a heart winged',
    description: 'A heart with wings',
    keywords: ['heart', 'winged', 'flying']
  },
  key4: {
    name: 'Key',
    category: 'symbols',
    filename: 'key-4-mono.svg',
    blazonTerm: 'a key',
    description: 'A key',
    keywords: ['key', 'lock', 'symbol']
  },
  padlock: {
    name: 'Padlock',
    category: 'symbols',
    filename: 'padlock-mono.svg',
    blazonTerm: 'a padlock',
    description: 'A padlock',
    keywords: ['padlock', 'lock', 'security']
  },
  wheelCatherine: {
    name: 'Catherine Wheel',
    category: 'symbols',
    filename: 'wheel-catherine-1-mono.svg',
    blazonTerm: 'a Catherine wheel',
    description: 'A spiked wheel (St. Catherine)',
    keywords: ['wheel', 'catherine', 'spiked', 'saint']
  },
  millWheel: {
    name: 'Mill Wheel',
    category: 'symbols',
    filename: 'mill-wheel-mono.svg',
    blazonTerm: 'a mill wheel',
    description: 'A mill wheel',
    keywords: ['mill', 'wheel', 'water']
  },
  candleEnflamed: {
    name: 'Candle Enflamed',
    category: 'symbols',
    filename: 'candle-enflamed-1-mono.svg',
    blazonTerm: 'a candle enflamed',
    description: 'A lit candle',
    keywords: ['candle', 'flame', 'light']
  },
  banner: {
    name: 'Banner',
    category: 'symbols',
    filename: 'banner-5-mono.svg',
    blazonTerm: 'a banner',
    description: 'A banner or flag',
    keywords: ['banner', 'flag', 'standard']
  },
  gonfalon: {
    name: 'Gonfalon',
    category: 'symbols',
    filename: 'gonfalon-11-mono.svg',
    blazonTerm: 'a gonfalon',
    description: 'A hanging banner',
    keywords: ['gonfalon', 'banner', 'hanging']
  },
  label1: {
    name: 'Label',
    category: 'symbols',
    filename: 'label-1-mono.svg',
    blazonTerm: 'a label',
    description: 'A label of three points',
    keywords: ['label', 'cadency', 'eldest']
  },
  orb: {
    name: 'Orb',
    category: 'symbols',
    filename: 'orb-5-mono.svg',
    blazonTerm: 'an orb',
    description: 'A royal orb',
    keywords: ['orb', 'royal', 'regalia']
  },
  scepter: {
    name: 'Scepter',
    category: 'symbols',
    filename: 'scepter-4-mono.svg',
    blazonTerm: 'a scepter',
    description: 'A royal scepter',
    keywords: ['scepter', 'royal', 'regalia']
  },
  cardPique: {
    name: 'Card Pique (Spade)',
    category: 'symbols',
    filename: 'card-pique-1-mono.svg',
    blazonTerm: 'a card pique',
    description: 'A spade from playing cards',
    keywords: ['card', 'pique', 'spade', 'playing']
  },
  wellFrame: {
    name: 'Well Frame',
    category: 'symbols',
    filename: 'well-frame-1-mono.svg',
    blazonTerm: 'a well frame',
    description: 'A well with frame',
    keywords: ['well', 'frame', 'water']
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function getExternalCharge(chargeId) {
  return EXTERNAL_CHARGES[chargeId] || null;
}

export function getExternalChargesByCategory(categoryId) {
  return Object.fromEntries(
    Object.entries(EXTERNAL_CHARGES).filter(
      ([_, charge]) => charge.category === categoryId
    )
  );
}

export function searchExternalCharges(query) {
  const lowerQuery = query.toLowerCase();
  return Object.fromEntries(
    Object.entries(EXTERNAL_CHARGES).filter(([_, charge]) => {
      return (
        charge.name.toLowerCase().includes(lowerQuery) ||
        charge.blazonTerm.toLowerCase().includes(lowerQuery) ||
        charge.description.toLowerCase().includes(lowerQuery) ||
        charge.keywords.some(kw => kw.toLowerCase().includes(lowerQuery))
      );
    })
  );
}

export function getExternalChargeUrl(chargeId) {
  const charge = EXTERNAL_CHARGES[chargeId];
  if (!charge) return null;
  return `/heraldic-charges/${charge.filename}`;
}

export function generateExternalChargeBlazon(chargeId, tincture, count = 1) {
  const charge = EXTERNAL_CHARGES[chargeId];
  if (!charge) return '';
  
  const term = charge.blazonTerm;
  
  if (count === 1) {
    return `${term} ${tincture}`;
  } else if (count === 2) {
    const pluralTerm = term
      .replace(/^a /, 'two ')
      .replace(/^an /, 'two ')
      .replace(/leaf$/, 'leaves')
      .replace(/([^s])$/, '$1s');
    return `${pluralTerm} ${tincture}`;
  } else if (count === 3) {
    const pluralTerm = term
      .replace(/^a /, 'three ')
      .replace(/^an /, 'three ')
      .replace(/leaf$/, 'leaves')
      .replace(/([^s])$/, '$1s');
    return `${pluralTerm} ${tincture}`;
  }
  
  return `${term} ${tincture}`;
}

export function getExternalChargeCategories() {
  return Object.keys(EXTERNAL_CHARGE_CATEGORIES);
}

export function getExternalChargeCounts() {
  const counts = {};
  for (const catId of Object.keys(EXTERNAL_CHARGE_CATEGORIES)) {
    counts[catId] = Object.values(EXTERNAL_CHARGES).filter(
      c => c.category === catId
    ).length;
  }
  return counts;
}

export const EXTERNAL_CHARGES_TOTAL = Object.keys(EXTERNAL_CHARGES).length;

/*
  crescentsFourSaltire: {
    name: 'Four Crescents in Saltire',
    category: 'celestial',
    filename: 'crescents-four-conjoined-in-saltire-horns-outwards-mono.svg',
    blazonTerm: 'four crescents conjoined in saltire horns outward',
    description: 'Four crescents arranged in X pattern',
    keywords: ['crescent', 'saltire', 'four', 'conjoined']
  },
  crescentsThreePallPoints: {
    name: 'Three Crescents in Pall (Points)',
    category: 'celestial',
    filename: 'crescents-three-conjoined-in-pall-at-the-points-mono.svg',
    blazonTerm: 'three crescents conjoined in pall at the points',
    description: 'Three crescents joined at points in Y pattern',
    keywords: ['crescent', 'pall', 'three', 'conjoined']
  },
  crescentsThreePallHorns: {
    name: 'Three Crescents in Pall (Horns)',
    category: 'celestial',
    filename: 'crescents-three-conjoined-in-pall-horns-outwards-mono.svg',
    blazonTerm: 'three crescents conjoined in pall horns outward',
    description: 'Three crescents in Y pattern, horns out',
    keywords: ['crescent', 'pall', 'three', 'conjoined']
  },
  estoile: {
    name: 'Estoile',
    category: 'celestial',
    filename: 'estoile-2-mono.svg',
    blazonTerm: 'an estoile',
    description: 'A wavy-rayed star',
    keywords: ['estoile', 'star', 'celestial']
  },
  estoile16: {
    name: 'Estoile of 16 Points',
    category: 'celestial',
    filename: 'estoile-of-16-points-mono.svg',
    blazonTerm: 'an estoile of sixteen points',
    description: 'A 16-pointed wavy star',
    keywords: ['estoile', 'star', 'sixteen', 'celestial']
  },
  estoilePierced: {
    name: 'Estoile Pierced',
    category: 'celestial',
    filename: 'estoile-pierced-mono.svg',
    blazonTerm: 'an estoile pierced',
    description: 'A wavy star with hole',
    keywords: ['estoile', 'star', 'pierced', 'celestial']
  },
  mullet5: {
    name: 'Mullet of 5 Points',
    category: 'celestial',
    filename: 'mullet-of-5-points-2-mono.svg',
    blazonTerm: 'a mullet',
    description: 'A five-pointed star',
    keywords: ['mullet', 'star', 'five', 'celestial']
  },
  mullet6a: {
    name: 'Mullet of 6 Points',
    category: 'celestial',
    filename: 'mullet-of-6-points-1-mono.svg',
    blazonTerm: 'a mullet of six points',
    description: 'A six-pointed star',
    keywords: ['mullet', 'star', 'six', 'celestial']
  },
  mullet6b: {
    name: 'Mullet of 6 Points (Alt)',
    category: 'celestial',
    filename: 'mullet-of-6-points-4-mono.svg',
    blazonTerm: 'a mullet of six points',
    description: 'An alternate six-pointed star',
    keywords: ['mullet', 'star', 'six', 'celestial']
  },
  mullet7Interlaced: {
    name: 'Mullet of 7 Points Interlaced',
    category: 'celestial',
    filename: 'mullet-of-7-points-voided-and-interlaced-1-mono.svg',
    blazonTerm: 'a mullet of seven points voided and interlaced',
    description: 'A seven-pointed interlaced star',
    keywords: ['mullet', 'star', 'seven', 'interlaced']
  },
  mullet8Interlaced: {
    name: 'Mullet of 8 Points Interlaced',
    category: 'celestial',
    filename: 'mullet-of-8-points-voided-and-interlaced-2-mono.svg',
    blazonTerm: 'a mullet of eight points voided and interlaced',
    description: 'An eight-pointed interlaced star',
    keywords: ['mullet', 'star', 'eight', 'interlaced']
  },
  comet: {
    name: 'Comet',
    category: 'celestial',
    filename: 'comet-4-mono.svg',
    blazonTerm: 'a comet',
    description: 'A comet with tail',
    keywords: ['comet', 'star', 'tail', 'celestial']
  },
  rainbow: {
    name: 'Rainbow',
    category: 'celestial',
    filename: 'rainbow-1-mono.svg',
    blazonTerm: 'a rainbow',
    description: 'A rainbow arc',
    keywords: ['rainbow', 'arc', 'celestial']
  },
  snowflake1: {
    name: 'Snowflake',
    category: 'celestial',
    filename: 'snowflake-1-mono.svg',
    blazonTerm: 'a snowflake',
    description: 'A snowflake',
    keywords: ['snowflake', 'ice', 'winter']
  },
  snowflake4: {
    name: 'Snowflake (Ornate)',
    category: 'celestial',
    filename: 'snowflake-4-mono.svg',
    blazonTerm: 'a snowflake',
    description: 'An ornate snowflake',
    keywords: ['snowflake', 'ice', 'winter']
  },
  flame: {
    name: 'Flame',
    category: 'celestial',
    filename: 'flame-6-mono.svg',
    blazonTerm: 'a flame',
    description: 'A flame',
    keywords: ['flame', 'fire', 'burning']
  },
  compassRose: {
    name: 'Compass Rose',
    category: 'celestial',
    filename: 'compass-rose-2-mono.svg',
    blazonTerm: 'a compass rose',
    description: 'A compass rose',
    keywords: ['compass', 'rose', 'navigation', 'direction']
  },

  // GEOMETRIC
  lozenge1: {
    name: 'Lozenge',
    category: 'geometric',
    filename: 'lozenge-1-mono.svg',
    blazonTerm: 'a lozenge',
    description: 'A diamond shape',
    keywords: ['lozenge', 'diamond', 'geometric']
  },
  lozenge3: {
    name: 'Lozenge (Alt)',
    category: 'geometric',
    filename: 'lozenge-3-mono.svg',
    blazonTerm: 'a lozenge',
    description: 'An alternate lozenge',
    keywords: ['lozenge', 'diamond', 'geometric']
  },
  lozenge5: {
    name: 'Lozenge (Wide)',
    category: 'geometric',
    filename: 'lozenge-5-mono.svg',
    blazonTerm: 'a lozenge',
    description: 'A wide lozenge',
    keywords: ['lozenge', 'diamond', 'geometric']
  },
  lozengePloye1: {
    name: 'Lozenge Ployé',
    category: 'geometric',
    filename: 'lozenge-ploye-1-mono.svg',
    blazonTerm: 'a lozenge ployé',
    description: 'A lozenge with curved sides',
    keywords: ['lozenge', 'ploye', 'curved', 'geometric']
  },
  lozengePloye3: {
    name: 'Lozenge Ployé (Alt)',
    category: 'geometric',
    filename: 'lozenge-ploye-3-mono.svg',
    blazonTerm: 'a lozenge ployé',
    description: 'An alternate curved lozenge',
    keywords: ['lozenge', 'ploye', 'curved', 'geometric']
  },
  lozengePometty: {
    name: 'Lozenge Pometty',
    category: 'geometric',
    filename: 'lozenge-pometty-2-mono.svg',
    blazonTerm: 'a lozenge pometty',
    description: 'A lozenge with rounded ends',
    keywords: ['lozenge', 'pometty', 'geometric']
  },
  mascle1: {
    name: 'Mascle',
    category: 'geometric',
    filename: 'mascle-1-mono.svg',
    blazonTerm: 'a mascle',
    description: 'A voided lozenge',
    keywords: ['mascle', 'lozenge', 'voided', 'geometric']
  },
  mascle2: {
    name: 'Mascle (Alt)',
    category: 'geometric',
    filename: 'mascle-2-mono.svg',
    blazonTerm: 'a mascle',
    description: 'An alternate voided lozenge',
    keywords: ['mascle', 'lozenge', 'voided', 'geometric']
  },
  masclePloye: {
    name: 'Mascle Ployé',
    category: 'geometric',
    filename: 'mascle-ploye-2-mono.svg',
    blazonTerm: 'a mascle ployé',
    description: 'A voided lozenge with curved sides',
    keywords: ['mascle', 'ploye', 'curved', 'geometric']
  },
  masclesThreeBraced: {
    name: 'Three Mascles Braced',
    category: 'geometric',
    filename: 'mascles-three-braced-in-pale-mono.svg',
    blazonTerm: 'three mascles braced in pale',
    description: 'Three interlocked mascles',
    keywords: ['mascle', 'braced', 'three', 'interlocked']
  },
  rustre: {
    name: 'Rustre',
    category: 'geometric',
    filename: 'rustre-2-mono.svg',
    blazonTerm: 'a rustre',
    description: 'A lozenge with round hole',
    keywords: ['rustre', 'lozenge', 'pierced', 'geometric']
  },
  billet: {
    name: 'Billet',
    category: 'geometric',
    filename: 'billet-mono.svg',
    blazonTerm: 'a billet',
    description: 'A rectangle',
    keywords: ['billet', 'rectangle', 'geometric']
  },
  delf: {
    name: 'Delf',
    category: 'geometric',
    filename: 'delf-mono.svg',
    blazonTerm: 'a delf',
    description: 'A square',
    keywords: ['delf', 'square', 'geometric']
  },
  delfVoided: {
    name: 'Delf Voided',
    category: 'geometric',
    filename: 'delf-voided-mono.svg',
    blazonTerm: 'a delf voided',
    description: 'A hollow square',
    keywords: ['delf', 'square', 'voided', 'geometric']
  },
  delfPloye: {
    name: 'Delf Ployé',
    category: 'geometric',
    filename: 'delf-ploye-mono.svg',
    blazonTerm: 'a delf ployé',
    description: 'A square with curved sides',
    keywords: ['delf', 'ploye', 'curved', 'geometric']
  },
  delfPloyeVoided: {
    name: 'Delf Ployé Voided',
    category: 'geometric',
    filename: 'delf-ploye-voided-mono.svg',
    blazonTerm: 'a delf ployé voided',
    description: 'A hollow curved square',
    keywords: ['delf', 'ploye', 'voided', 'geometric']
  },
  delfsTwoFretted: {
    name: 'Two Delfs Fretted',
    category: 'geometric',
    filename: 'delfs-two-voided-and-fretted-mono.svg',
    blazonTerm: 'two delfs voided and fretted',
    description: 'Two interlocked hollow squares',
    keywords: ['delf', 'fretted', 'two', 'interlocked']
  },
  roundelPiercedDelf: {
    name: 'Roundel Pierced of Delf',
    category: 'geometric',
    filename: 'roundel-pierced-of-a-delf-mono.svg',
    blazonTerm: 'a roundel pierced of a delf',
    description: 'A circle with square hole',
    keywords: ['roundel', 'delf', 'pierced', 'geometric']
  },
  triangle: {
    name: 'Triangle',
    category: 'geometric',
    filename: 'triangle-mono.svg',
    blazonTerm: 'a triangle',
    description: 'A triangle',
    keywords: ['triangle', 'geometric']
  },
  triangleVoided: {
    name: 'Triangle Voided',
    category: 'geometric',
    filename: 'triangle-voided-mono.svg',
    blazonTerm: 'a triangle voided',
    description: 'A hollow triangle',
    keywords: ['triangle', 'voided', 'geometric']
  },
  annuletFleury: {
    name: 'Annulet Fleury',
    category: 'geometric',
    filename: 'annulet-fleury-mono.svg',
    blazonTerm: 'an annulet fleury',
    description: 'A ring with fleur-de-lis decorations',
    keywords: ['annulet', 'ring', 'fleury', 'geometric']
  },
  annuletsFiveInterlaced: {
    name: 'Five Annulets Interlaced',
    category: 'geometric',
    filename: 'annulets-five-interlaced-in-cross-mono.svg',
    blazonTerm: 'five annulets interlaced in cross',
    description: 'Five interlocked rings in cross pattern',
    keywords: ['annulet', 'ring', 'five', 'interlaced']
  },
  annuletsThreeInterlaced: {
    name: 'Three Annulets Interlaced',
    category: 'geometric',
    filename: 'annulets-three-interlaced-mono.svg',
    blazonTerm: 'three annulets interlaced',
    description: 'Three interlocked rings',
    keywords: ['annulet', 'ring', 'three', 'interlaced']
  },
  annuletsTwoBraced: {
    name: 'Two Annulets Braced',
    category: 'geometric',
    filename: 'annulets-two-braced-mono.svg',
    blazonTerm: 'two annulets braced',
    description: 'Two linked rings',
    keywords: ['annulet', 'ring', 'two', 'braced']
  },
  ropeAnnulet: {
    name: 'Annulet of Rope',
    category: 'geometric',
    filename: 'rope-annulet-of-2-mono.svg',
    blazonTerm: 'an annulet of rope',
    description: 'A ring made of rope',
    keywords: ['annulet', 'rope', 'ring']
  },
  mandorla: {
    name: 'Mandorla',
    category: 'geometric',
    filename: 'mandorla-mono.svg',
    blazonTerm: 'a mandorla',
    description: 'An almond-shaped aureole',
    keywords: ['mandorla', 'vesica', 'almond', 'geometric']
  },
  cartouche: {
    name: 'Cartouche',
    category: 'geometric',
    filename: 'cartouche-1-mono.svg',
    blazonTerm: 'a cartouche',
    description: 'An oval frame',
    keywords: ['cartouche', 'oval', 'frame', 'geometric']
  },
  cinquefoilShape: {
    name: 'Cinquefoil Shape',
    category: 'geometric',
    filename: 'cinquefoil-shape-mono.svg',
    blazonTerm: 'a cinquefoil',
    description: 'A five-lobed shape',
    keywords: ['cinquefoil', 'five', 'flower', 'geometric']
  },
  quatrefoilShape: {
    name: 'Quatrefoil Shape',
    category: 'geometric',
    filename: 'quatrefoil-shape-mono.svg',
    blazonTerm: 'a quatrefoil',
    description: 'A four-lobed shape',
    keywords: ['quatrefoil', 'four', 'geometric']
  },
  corniceFourLobed: {
    name: 'Cornice Four-Lobed',
    category: 'geometric',
    filename: 'cornice-four-lobed-1-mono.svg',
    blazonTerm: 'a cornice four-lobed',
    description: 'A four-lobed decorative shape',
    keywords: ['cornice', 'four', 'lobed', 'geometric']
  },
  corniceFourLobedQuadrate: {
    name: 'Cornice Four-Lobed Quadrate',
    category: 'geometric',
    filename: 'cornice-four-lobed-quadrate-mono.svg',
    blazonTerm: 'a cornice four-lobed quadrate',
    description: 'A squared four-lobed shape',
    keywords: ['cornice', 'quadrate', 'geometric']
  },
  rogacinaDouble: {
    name: 'Rogacina Double-Pointed',
    category: 'geometric',
    filename: 'rogacina-double-pointed-mono.svg',
    blazonTerm: 'a rogacina double-pointed',
    description: 'A double-pointed charge',
    keywords: ['rogacina', 'pointed', 'geometric']
  },
  viresTwoMono: {
    name: 'Two Vires',
    category: 'geometric',
    filename: 'vires-two-mono.svg',
    blazonTerm: 'two vires',
    description: 'Two annulets diminished',
    keywords: ['vires', 'annulet', 'two', 'geometric']
  },
  ermineSpot1: {
    name: 'Ermine Spot',
    category: 'geometric',
    filename: 'ermine-spot-1-mono.svg',
    blazonTerm: 'an ermine spot',
    description: 'A single ermine spot',
    keywords: ['ermine', 'spot', 'fur']
  },
  ermineSpot4: {
    name: 'Ermine Spot (Alt)',
    category: 'geometric',
    filename: 'ermine-spot-4-mono.svg',
    blazonTerm: 'an ermine spot',
    description: 'An alternate ermine spot',
    keywords: ['ermine', 'spot', 'fur']
  },
  ermineSpot7: {
    name: 'Ermine Spot (Ornate)',
    category: 'geometric',
    filename: 'ermine-spot-7-mono.svg',
    blazonTerm: 'an ermine spot',
    description: 'An ornate ermine spot',
    keywords: ['ermine', 'spot', 'fur']
  },
  ermineSpot11: {
    name: 'Ermine Spot (Detailed)',
    category: 'geometric',
    filename: 'ermine-spot-11-mono.svg',
    blazonTerm: 'an ermine spot',
    description: 'A detailed ermine spot',
    keywords: ['ermine', 'spot', 'fur']
  },
  mountainDevice: {
    name: 'Mountain (Device)',
    category: 'geometric',
    filename: 'mountain-1-device-mono.svg',
    blazonTerm: 'a mountain',
    description: 'A mountain',
    keywords: ['mountain', 'mount', 'landscape']
  },
  mountain2Device: {
    name: 'Mountain (Device Alt)',
    category: 'geometric',
    filename: 'mountain-2-device-mono.svg',
    blazonTerm: 'a mountain',
    description: 'An alternate mountain',
    keywords: ['mountain', 'mount', 'landscape']
  },
  mountain2Badge: {
    name: 'Mountain (Badge)',
    category: 'geometric',
    filename: 'mountain-2-badge-mono.svg',
    blazonTerm: 'a mountain',
    description: 'A mountain as badge',
    keywords: ['mountain', 'mount', 'badge']
  },
  mountSixHillocks: {
    name: 'Mount of Six Hillocks',
    category: 'geometric',
    filename: 'mount-of-six-hillocks-couped-1-mono.svg',
    blazonTerm: 'a mount of six hillocks couped',
    description: 'A mount with six hills',
    keywords: ['mount', 'hillocks', 'six', 'landscape']
  },
  trimount1Badge: {
    name: 'Trimount (Badge)',
    category: 'geometric',
    filename: 'trimount-1-badge-mono.svg',
    blazonTerm: 'a trimount',
    description: 'A three-peaked mount as badge',
    keywords: ['trimount', 'mount', 'three', 'badge']
  },
  trimountCouped: {
    name: 'Trimount Couped',
    category: 'geometric',
    filename: 'trimount-couped-1-mono.svg',
    blazonTerm: 'a trimount couped',
    description: 'A three-peaked mount cut off',
    keywords: ['trimount', 'mount', 'couped']
  },
  streamFesswise: {
    name: 'Stream Fesswise',
    category: 'geometric',
    filename: 'stream-fesswise-throughout-device-mono.svg',
    blazonTerm: 'a stream fesswise',
    description: 'A horizontal stream or river',
    keywords: ['stream', 'river', 'water', 'fesswise']
  },
  tortoiseShellPlate: {
    name: 'Tortoise Shell Plate',
    category: 'geometric',
    filename: 'tortoise-shell-plate-3-mono.svg',
    blazonTerm: 'a tortoise shell plate',
    description: 'A hexagonal tortoise shell pattern',
    keywords: ['tortoise', 'shell', 'plate', 'hexagon']
  },
  tortoiseShellPlatesThree: {
    name: 'Three Tortoise Shell Plates',
    category: 'geometric',
    filename: 'tortoise-shell-plates-three-one-and-two-mono.svg',
    blazonTerm: 'three tortoise shell plates',
    description: 'Three tortoise shell plates arranged',
    keywords: ['tortoise', 'shell', 'three', 'plates']
  },

  // CROSSES
  crossBottony1: {
    name: 'Cross Bottony',
    category: 'crosses',
    filename: 'cross-bottony-1-mono.svg',
    blazonTerm: 'a cross bottony',
    description: 'A cross with trefoil ends',
    keywords: ['cross', 'bottony', 'trefoil']
  },
  crossBottony4: {
    name: 'Cross Bottony (Alt)',
    category: 'crosses',
    filename: 'cross-bottony-4-mono.svg',
    blazonTerm: 'a cross bottony',
    description: 'An alternate cross bottony',
    keywords: ['cross', 'bottony', 'trefoil']
  },
  crossAvellane: {
    name: 'Cross Avellane',
    category: 'crosses',
    filename: 'cross-avellane-2-mono.svg',
    blazonTerm: 'a cross avellane',
    description: 'A cross with filbert-shaped ends',
    keywords: ['cross', 'avellane', 'filbert']
  },
  crossAnnuletty: {
    name: 'Cross Annuletty',
    category: 'crosses',
    filename: 'cross-annuletty-mono.svg',
    blazonTerm: 'a cross annuletty',
    description: 'A cross with ring ends',
    keywords: ['cross', 'annuletty', 'rings']
  },
  crossFourchy: {
    name: 'Cross Fourchy',
    category: 'crosses',
    filename: 'cross-fourchy-4-mono.svg',
    blazonTerm: 'a cross fourchy',
    description: 'A cross with forked ends',
    keywords: ['cross', 'fourchy', 'forked']
  },
  crossBowen: {
    name: 'Cross Bowen',
    category: 'crosses',
    filename: 'cross-bowen-mono.svg',
    blazonTerm: 'a cross bowen',
    description: 'A Bowen knot cross',
    keywords: ['cross', 'bowen', 'knot']
  },
  crossDoubled: {
    name: 'Cross Doubled',
    category: 'crosses',
    filename: 'cross-doubled-mono.svg',
    blazonTerm: 'a cross doubled',
    description: 'A double-lined cross',
    keywords: ['cross', 'doubled', 'double']
  },
  crossPointedVoided: {
    name: 'Cross Pointed Voided',
    category: 'crosses',
    filename: 'cross-pointed-voided-mono.svg',
    blazonTerm: 'a cross pointed voided',
    description: 'A hollow pointed cross',
    keywords: ['cross', 'pointed', 'voided']
  },
  crossNorseSun: {
    name: 'Cross Norse Sun',
    category: 'crosses',
    filename: 'cross-norse-sun-2-mono.svg',
    blazonTerm: 'a cross Norse sun',
    description: 'A Norse sun cross',
    keywords: ['cross', 'norse', 'sun', 'solar']
  },
  crossCalatrava: {
    name: 'Cross of Calatrava',
    category: 'crosses',
    filename: 'cross-of-calatrava-3-mono.svg',
    blazonTerm: 'a cross of Calatrava',
    description: 'The cross of the Order of Calatrava',
    keywords: ['cross', 'calatrava', 'order', 'military']
  },
  escarbuncle: {
    name: 'Escarbuncle',
    category: 'crosses',
    filename: 'escarbuncle-7-mono.svg',
    blazonTerm: 'an escarbuncle',
    description: 'A radiating ornament',
    keywords: ['escarbuncle', 'rays', 'radiating']
  },

  // KNOTS
  knotHeneage: {
    name: 'Heneage Knot',
    category: 'knots',
    filename: 'knot-heneage-2-mono.svg',
    blazonTerm: 'a Heneage knot',
    description: 'The Heneage family knot',
    keywords: ['knot', 'heneage', 'heraldic']
  },
  knotLacy: {
    name: 'Lacy Knot',
    category: 'knots',
    filename: 'knot-lacy-2-mono.svg',
    blazonTerm: 'a Lacy knot',
    description: 'The Lacy family knot',
    keywords: ['knot', 'lacy', 'heraldic']
  },
  knotSolomons: {
    name: "Solomon's Knot",
    category: 'knots',
    filename: 'knot-solomons-2-mono.svg',
    blazonTerm: "a Solomon's knot",
    description: 'An interlaced Solomon knot',
    keywords: ['knot', 'solomon', 'interlaced']
  },
  knotStafford: {
    name: 'Stafford Knot',
    category: 'knots',
    filename: 'knot-stafford-3-mono.svg',
    blazonTerm: 'a Stafford knot',
    description: 'The Stafford family knot',
    keywords: ['knot', 'stafford', 'heraldic']
  },
  knotWake: {
    name: 'Wake Knot',
    category: 'knots',
    filename: 'knot-wake-or-ormonde-knot-2-mono.svg',
    blazonTerm: 'a Wake knot',
    description: 'The Wake or Ormonde knot',
    keywords: ['knot', 'wake', 'ormonde', 'heraldic']
  },
  knotTwoHearts: {
    name: 'Knot of Two Hearts',
    category: 'knots',
    filename: 'knot-of-two-hearts-voided-and-braced-mono.svg',
    blazonTerm: 'a knot of two hearts voided and braced',
    description: 'Two hearts intertwined',
    keywords: ['knot', 'hearts', 'love', 'intertwined']
  },
  triquetra: {
    name: 'Triquetra',
    category: 'knots',
    filename: 'triquetra-3-mono.svg',
    blazonTerm: 'a triquetra',
    description: 'A Celtic three-pointed knot',
    keywords: ['triquetra', 'trinity', 'celtic', 'knot']
  },
  triquetraAnnulet: {
    name: 'Triquetra with Annulet',
    category: 'knots',
    filename: 'triquetra-interlaced-with-an-annulet-mono.svg',
    blazonTerm: 'a triquetra interlaced with an annulet',
    description: 'A triquetra with ring',
    keywords: ['triquetra', 'annulet', 'celtic', 'knot']
  },
  triskelionArms: {
    name: 'Triskelion of Arms',
    category: 'knots',
    filename: 'arms-triskelion-of-mono.svg',
    blazonTerm: 'a triskelion of arms',
    description: 'Three bent arms in spiral',
    keywords: ['triskelion', 'arms', 'spiral']
  },
  triskelionLegsArmored: {
    name: 'Triskelion of Armored Legs',
    category: 'knots',
    filename: 'legs-triskelion-of-armored-1-mono.svg',
    blazonTerm: 'a triskelion of armored legs',
    description: 'Three armored legs (Isle of Man)',
    keywords: ['triskelion', 'legs', 'armored', 'mann']
  },
  triskelionPometty: {
    name: 'Triskelion Pometty',
    category: 'knots',
    filename: 'triskelion-pometty-mono.svg',
    blazonTerm: 'a triskelion pometty',
    description: 'A triskelion with rounded ends',
    keywords: ['triskelion', 'pometty', 'spiral']
  },
  labyrinth1: {
    name: 'Labyrinth',
    category: 'knots',
    filename: 'labyrinth-1-mono.svg',
    blazonTerm: 'a labyrinth',
    description: 'A maze pattern',
    keywords: ['labyrinth', 'maze', 'pattern']
  },
  labyrinth6: {
    name: 'Labyrinth (Classical)',
    category: 'knots',
    filename: 'labyrinth-6-mono.svg',
    blazonTerm: 'a labyrinth',
    description: 'A classical maze pattern',
    keywords: ['labyrinth', 'maze', 'classical']
  },

  // SYMBOLS
  heart8: {
    name: 'Heart',
    category: 'symbols',
    filename: 'heart-8-mono.svg',
    blazonTerm: 'a heart',
    description: 'A heart',
    keywords: ['heart', 'love', 'symbol']
  },
  heartWinged: {
    name: 'Heart Winged',
    category: 'symbols',
    filename: 'heart-winged-1-mono.svg',
    blazonTerm: 'a heart winged',
    description: 'A heart with wings',
    keywords: ['heart', 'winged', 'flying']
  },
  key4: {
    name: 'Key',
    category: 'symbols',
    filename: 'key-4-mono.svg',
    blazonTerm: 'a key',
    description: 'A key',
    keywords: ['key', 'lock', 'symbol']
  },
  key9: {
    name: 'Key (Ornate)',
    category: 'symbols',
    filename: 'key-9-mono.svg',
    blazonTerm: 'a key',
    description: 'An ornate key',
    keywords: ['key', 'ornate', 'symbol']
  },
  padlock: {
    name: 'Padlock',
    category: 'symbols',
    filename: 'padlock-mono.svg',
    blazonTerm: 'a padlock',
    description: 'A padlock',
    keywords: ['padlock', 'lock', 'security']
  },
  wheelCatherine: {
    name: 'Catherine Wheel',
    category: 'symbols',
    filename: 'wheel-catherine-1-mono.svg',
    blazonTerm: 'a Catherine wheel',
    description: 'A spiked wheel (St. Catherine)',
    keywords: ['wheel', 'catherine', 'spiked', 'saint']
  },
  wheelRimless: {
    name: 'Wheel Rimless',
    category: 'symbols',
    filename: 'wheel-rimless-1-mono.svg',
    blazonTerm: 'a wheel rimless',
    description: 'A wheel without rim',
    keywords: ['wheel', 'rimless', 'spokes']
  },
  millWheel: {
    name: 'Mill Wheel',
    category: 'symbols',
    filename: 'mill-wheel-mono.svg',
    blazonTerm: 'a mill wheel',
    description: 'A mill wheel',
    keywords: ['mill', 'wheel', 'water']
  },
  waterWheel: {
    name: 'Water Wheel',
    category: 'symbols',
    filename: 'water-wheel-1-mono.svg',
    blazonTerm: 'a water wheel',
    description: 'A water wheel',
    keywords: ['water', 'wheel', 'mill']
  },
  candleEnflamed: {
    name: 'Candle Enflamed',
    category: 'symbols',
    filename: 'candle-enflamed-1-mono.svg',
    blazonTerm: 'a candle enflamed',
    description: 'A lit candle',
    keywords: ['candle', 'flame', 'light']
  },
  banner: {
    name: 'Banner',
    category: 'symbols',
    filename: 'banner-5-mono.svg',
    blazonTerm: 'a banner',
    description: 'A banner or flag',
    keywords: ['banner', 'flag', 'standard']
  },
  gonfalon: {
    name: 'Gonfalon',
    category: 'symbols',
    filename: 'gonfalon-11-mono.svg',
    blazonTerm: 'a gonfalon',
    description: 'A hanging banner',
    keywords: ['gonfalon', 'banner', 'hanging']
  },
  label1: {
    name: 'Label',
    category: 'symbols',
    filename: 'label-1-mono.svg',
    blazonTerm: 'a label',
    description: 'A label of three points',
    keywords: ['label', 'cadency', 'eldest']
  },
  labelFivePoints: {
    name: 'Label of Five Points',
    category: 'symbols',
    filename: 'label-of-five-points-mono.svg',
    blazonTerm: 'a label of five points',
    description: 'A label with five points',
    keywords: ['label', 'five', 'cadency']
  },
  labelSixPoints: {
    name: 'Label of Six Points',
    category: 'symbols',
    filename: 'label-of-six-points-mono.svg',
    blazonTerm: 'a label of six points',
    description: 'A label with six points',
    keywords: ['label', 'six', 'cadency']
  },
  orb: {
    name: 'Orb',
    category: 'symbols',
    filename: 'orb-5-mono.svg',
    blazonTerm: 'an orb',
    description: 'A royal orb',
    keywords: ['orb', 'royal', 'regalia']
  },
  scepter: {
    name: 'Scepter',
    category: 'symbols',
    filename: 'scepter-4-mono.svg',
    blazonTerm: 'a scepter',
    description: 'A royal scepter',
    keywords: ['scepter', 'royal', 'regalia']
  },
  cardPique: {
    name: 'Card Pique (Spade)',
    category: 'symbols',
    filename: 'card-pique-1-mono.svg',
    blazonTerm: 'a card pique',
    description: 'A spade from playing cards',
    keywords: ['card', 'pique', 'spade', 'playing']
  },
  gemstoneStepCut1: {
    name: 'Gemstone Step Cut',
    category: 'symbols',
    filename: 'gemstone-step-cut-1-mono.svg',
    blazonTerm: 'a gemstone step cut',
    description: 'A faceted gemstone',
    keywords: ['gem', 'gemstone', 'jewel', 'faceted']
  },
  gemstoneStepCut2: {
    name: 'Gemstone Step Cut (Alt)',
    category: 'symbols',
    filename: 'gemstone-step-cut-2-mono.svg',
    blazonTerm: 'a gemstone step cut',
    description: 'An alternate faceted gemstone',
    keywords: ['gem', 'gemstone', 'jewel', 'faceted']
  },
  basketHand: {
    name: 'Hand Basket',
    category: 'symbols',
    filename: 'basket-hand-mono.svg',
    blazonTerm: 'a hand basket',
    description: 'A woven basket',
    keywords: ['basket', 'woven', 'container']
  },
  besom: {
    name: 'Besom',
    category: 'symbols',
    filename: 'besom-3-mono.svg',
    blazonTerm: 'a besom',
    description: 'A broom',
    keywords: ['besom', 'broom', 'sweeping']
  },
  wellFrame1: {
    name: 'Well Frame',
    category: 'symbols',
    filename: 'well-frame-1-mono.svg',
    blazonTerm: 'a well frame',
    description: 'A well with frame',
    keywords: ['well', 'frame', 'water']
  },
  wellFrame2: {
    name: 'Well Frame (Alt)',
    category: 'symbols',
    filename: 'well-frame-2-mono.svg',
    blazonTerm: 'a well frame',
    description: 'An alternate well frame',
    keywords: ['well', 'frame', 'water']
  }
*/
