/**
 * Simple Heraldry Generator
 * 
 * Creates basic medieval heraldic patterns without external APIs
 * Uses traditional tinctures (colors) and divisions
 * Perfect for testing and guaranteed to work with our shield shapes
 */

import { createSVGHeraldryWithMask } from './shieldSVGProcessor';
import { convertSVGtoPNG } from './armoriaIntegration';

// Traditional heraldic tinctures (colors)
const TINCTURES = {
  // Metals (light colors)
  or: '#FFD700',      // Gold
  argent: '#FFFFFF',  // Silver/White
  
  // Colors (dark colors)
  gules: '#DC143C',   // Red
  azure: '#0047AB',   // Blue
  sable: '#000000',   // Black
  vert: '#228B22',    // Green
  purpure: '#9B30FF', // Purple
};

// Traditional heraldic divisions
const DIVISIONS = [
  'plain',      // Solid color
  'paly',       // Vertical stripes
  'barry',      // Horizontal stripes
  'quarterly',  // Quartered
  'chevron',    // Chevron shape
  'bend',       // Diagonal stripe
  'cross',      // Cross
];

/**
 * Generate simple heraldic field based on house name
 * Uses hash of house name to deterministically select colors and pattern
 * 
 * @param {string} houseName - Name of house
 * @param {string|null} seed - Optional seed for variation
 * @returns {Object} Heraldry data
 */
export function generateSimpleHeraldry(houseName, seed = null) {
  const hashValue = seed ? parseInt(seed) : hashString(houseName);
  
  // Select colors based on hash
  const tinctures = Object.keys(TINCTURES);
  const color1Index = hashValue % tinctures.length;
  const color2Index = (hashValue * 7) % tinctures.length;
  
  // Ensure different colors (no gold on gold, etc.)
  let finalColor2Index = color2Index;
  if (color1Index === color2Index) {
    finalColor2Index = (color2Index + 1) % tinctures.length;
  }
  
  const color1 = TINCTURES[tinctures[color1Index]];
  const color2 = TINCTURES[tinctures[finalColor2Index]];
  
  // Select division pattern
  const divisionIndex = (hashValue * 13) % DIVISIONS.length;
  const division = DIVISIONS[divisionIndex];
  
  // Create SVG based on division
  const svg = createHeraldricSVG(division, color1, color2);
  
  return {
    svg,
    colors: { primary: color1, secondary: color2 },
    division,
    seed: hashValue.toString()
  };
}

/**
 * Create SVG markup for heraldic field
 * 
 * @param {string} division - Type of division
 * @param {string} color1 - Primary color
 * @param {string} color2 - Secondary color
 * @returns {string} SVG markup (content only, no shield outline)
 */
function createHeraldricSVG(division, color1, color2) {
  const viewBox = '0 0 200 200';
  
  let content = '';
  
  switch (division) {
    case 'plain':
      // Solid color
      content = `<rect x="0" y="0" width="200" height="200" fill="${color1}"/>`;
      break;
      
    case 'paly':
      // Vertical stripes (6 stripes)
      const stripeWidth = 200 / 6;
      for (let i = 0; i < 6; i++) {
        const fillColor = i % 2 === 0 ? color1 : color2;
        content += `<rect x="${i * stripeWidth}" y="0" width="${stripeWidth}" height="200" fill="${fillColor}"/>`;
      }
      break;
      
    case 'barry':
      // Horizontal stripes (6 stripes)
      const barHeight = 200 / 6;
      for (let i = 0; i < 6; i++) {
        const fillColor = i % 2 === 0 ? color1 : color2;
        content += `<rect x="0" y="${i * barHeight}" width="200" height="${barHeight}" fill="${fillColor}"/>`;
      }
      break;
      
    case 'quarterly':
      // Quartered (4 sections)
      content = `
        <rect x="0" y="0" width="100" height="100" fill="${color1}"/>
        <rect x="100" y="0" width="100" height="100" fill="${color2}"/>
        <rect x="0" y="100" width="100" height="100" fill="${color2}"/>
        <rect x="100" y="100" width="100" height="100" fill="${color1}"/>
      `;
      break;
      
    case 'chevron':
      // Chevron
      content = `
        <rect x="0" y="0" width="200" height="200" fill="${color1}"/>
        <path d="M 0 200 L 100 100 L 200 200 L 200 150 L 100 50 L 0 150 Z" fill="${color2}"/>
      `;
      break;
      
    case 'bend':
      // Diagonal stripe
      content = `
        <rect x="0" y="0" width="200" height="200" fill="${color1}"/>
        <path d="M 0 50 L 150 200 L 200 200 L 200 150 L 50 0 L 0 0 Z" fill="${color2}"/>
      `;
      break;
      
    case 'cross':
      // Cross
      content = `
        <rect x="0" y="0" width="200" height="200" fill="${color1}"/>
        <rect x="75" y="0" width="50" height="200" fill="${color2}"/>
        <rect x="0" y="75" width="200" height="50" fill="${color2}"/>
      `;
      break;
      
    default:
      content = `<rect x="0" y="0" width="200" height="200" fill="${color1}"/>`;
  }
  
  return `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
${content}
</svg>`;
}

/**
 * Hash string to number (same as armoriaIntegration)
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Create complete heraldry for house using simple generator
 * 
 * @param {Object} house - House object
 * @param {string|null} seed - Optional seed
 * @returns {Promise<Object>} Complete heraldry package
 */
export async function createSimpleHeraldryForHouse(house, seed = null) {
  try {
    console.log(`🛡️ Generating simple heraldry for ${house.houseName}...`);
    
    // Generate heraldic pattern
    const heraldry = generateSimpleHeraldry(house.houseName, seed);
    
    // Apply shield mask
    const shieldType = house.heraldryShieldType || 'heater';
    console.log(`🛡️ Applying ${shieldType} shield mask...`);
    const maskedSVG = await createSVGHeraldryWithMask(
      heraldry.svg,
      shieldType,
      400
    );
    
    // Generate PNG fallbacks
    console.log('🛡️ Converting to PNG fallbacks...');
    const pngVersions = await convertSVGtoPNG(maskedSVG);
    
    return {
      heraldrySVG: maskedSVG,
      heraldrySourceSVG: heraldry.svg,
      heraldryType: 'svg',
      heraldryImageData: pngVersions.display,
      heraldryThumbnail: pngVersions.thumbnail,
      heraldryHighRes: pngVersions.highRes,
      heraldrySource: 'simple',
      heraldrySeed: heraldry.seed,
      heraldryShieldType: shieldType,
      heraldryMetadata: {
        generatedAt: new Date().toISOString(),
        division: heraldry.division,
        colors: heraldry.colors
      }
    };
  } catch (error) {
    console.error('❌ Error creating simple heraldry:', error);
    throw error;
  }
}

export default {
  generateSimpleHeraldry,
  createSimpleHeraldryForHouse
};
