import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  createHeraldry,
  getHeraldry,
  updateHeraldry,
  linkHeraldryToEntity
} from '../services/heraldryService';
import { getAllHouses, getHouse, updateHouse } from '../services/database';
import { createSVGHeraldryWithMask } from '../utils/shieldSVGProcessor';
import { convertSVGtoPNG } from '../utils/armoriaIntegration';
import {
  CHARGES,
  CHARGE_CATEGORIES,
  getChargesByCategory,
  generateChargeBlazon
} from '../data/unifiedChargesLibrary';
import Navigation from '../components/Navigation';
import ExternalChargeRenderer, {
  generateExternalChargeSVGAsync
} from '../components/heraldry/ExternalChargeRenderer';
import './HeraldryCreator.css';

/**
 * HeraldryCreator - The Design Studio (Unified Charges Edition)
 * 
 * Full-page heraldry design interface with advanced customization:
 * - Division patterns with line style variations
 * - Multiplicity (multiple chevrons, bends, etc.)
 * - Thickness controls (normal, narrow, wide)
 * - Inversion options
 * - Position adjustments
 * - Traditional tinctures with proper naming
 * - Unified charges library with 250+ heraldic symbols
 */

// ═══════════════════════════════════════════════════════════════════════════════
// HERALDIC DATA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

// Traditional heraldic tinctures
const TINCTURES = {
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

// Line styles for partition lines
const LINE_STYLES = {
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

// Division patterns - grouped by type
const DIVISIONS = {
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
  
  // Ordinaries (support count, thickness, inversion, line styles)
  chief: { name: 'Chief', description: 'Top band', icon: '▀', group: 'ordinary', supportsLine: true, supportsThickness: true },
  base: { name: 'Base', description: 'Bottom band', icon: '▃', group: 'ordinary', supportsLine: true, supportsThickness: true },
  fess: { name: 'Fess', description: 'Horizontal band', icon: '▬', group: 'ordinary', supportsLine: true, supportsThickness: true, supportsCount: true, maxCount: 3 },
  pale: { name: 'Pale', description: 'Vertical band', icon: '│', group: 'ordinary', supportsLine: true, supportsThickness: true, supportsCount: true, maxCount: 3 },
  bend: { name: 'Bend', description: 'Diagonal band', icon: '╲', group: 'ordinary', supportsLine: true, supportsThickness: true, supportsCount: true, maxCount: 3 },
  bendSinister: { name: 'Bend Sinister', description: 'Reverse diagonal band', icon: '╱', group: 'ordinary', supportsLine: true, supportsThickness: true, supportsCount: true, maxCount: 3 },
  chevron: { name: 'Chevron', description: 'V-shape', icon: '⌃', group: 'ordinary', supportsLine: true, supportsThickness: true, supportsCount: true, maxCount: 3, supportsInvert: true },
  pile: { name: 'Pile', description: 'Triangle from top', icon: '▼', group: 'ordinary', supportsLine: true, supportsInvert: true, supportsCount: true, maxCount: 3 },
  cross: { name: 'Cross', description: 'Cross shape', icon: '✚', group: 'ordinary', supportsLine: true, supportsThickness: true },
  saltire: { name: 'Saltire', description: 'X-shape (St Andrew)', icon: '✕', group: 'ordinary', supportsLine: true, supportsThickness: true },
  
  // Tierced
  tiercedPale: { name: 'Tierced in Pale', description: 'Three vertical', icon: '▌', group: 'tierced', supportsLine: true },
  tiercedFess: { name: 'Tierced in Fess', description: 'Three horizontal', icon: '☷', group: 'tierced', supportsLine: true }
};

// Shield shapes
const SHIELD_TYPES = [
  { id: 'heater', name: 'Heater', description: 'Classic medieval (c.1245)', icon: '🛡️' },
  { id: 'english', name: 'English', description: 'Late medieval (c.1403)', icon: '🏰' },
  { id: 'french', name: 'French', description: 'Embowed/arched style', icon: '⚜️' },
  { id: 'spanish', name: 'Spanish', description: 'Engrailed notched', icon: '🌙' },
  { id: 'swiss', name: 'Swiss', description: 'Engrailed peaked', icon: '⛰️' }
];

// Categories
const CATEGORIES = [
  { id: 'noble', name: 'Noble Houses', icon: '🏰' },
  { id: 'personal', name: 'Personal Arms', icon: '👤' },
  { id: 'ecclesiastical', name: 'Ecclesiastical', icon: '⛪' },
  { id: 'civic', name: 'Civic', icon: '🏛️' },
  { id: 'guild', name: 'Guilds', icon: '⚒️' },
  { id: 'fantasy', name: 'Fantasy', icon: '✨' }
];

// Charge arrangements for multiple charges
const CHARGE_ARRANGEMENTS = {
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

// Charge sizes
const CHARGE_SIZES = {
  small: { name: 'Small', scale: 0.7 },
  medium: { name: 'Medium', scale: 0.9 },
  large: { name: 'Large', scale: 1.1 },
  xlarge: { name: 'X-Large', scale: 1.3 },
  xxlarge: { name: 'XX-Large', scale: 1.5 },
  massive: { name: 'Massive', scale: 1.7 },
  colossal: { name: 'Colossal', scale: 2.0 },
  titanic: { name: 'Titanic', scale: 2.3 }
};

// ═══════════════════════════════════════════════════════════════════════════════
// LINE PATH GENERATORS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate a styled line path between two points
 * Returns an SVG path 'd' attribute string
 */
function generateStyledLine(x1, y1, x2, y2, lineStyle, amplitude = 12) {
  if (lineStyle === 'straight' || !lineStyle) {
    return `M ${x1} ${y1} L ${x2} ${y2}`;
  }
  
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  if (length === 0) {
    return `M ${x1} ${y1}`;
  }
  
  const patternSize = 20;
  const patternCount = Math.max(4, Math.round(length / patternSize));
  
  const ux = dx / length;
  const uy = dy / length;
  const perpX = -uy;
  const perpY = ux;
  
  let path = `M ${x1} ${y1}`;
  
  switch (lineStyle) {
    case 'wavy': {
      const wavyAmp = amplitude * 1.2;
      for (let i = 0; i < patternCount; i++) {
        const startT = i / patternCount;
        const endT = (i + 1) / patternCount;
        const sx = x1 + dx * startT;
        const sy = y1 + dy * startT;
        const ex = x1 + dx * endT;
        const ey = y1 + dy * endT;
        const dir = (i % 2 === 0) ? 1 : -1;
        const cp1x = sx + (ex - sx) * 0.33 + perpX * wavyAmp * dir;
        const cp1y = sy + (ey - sy) * 0.33 + perpY * wavyAmp * dir;
        const cp2x = sx + (ex - sx) * 0.67 + perpX * wavyAmp * dir;
        const cp2y = sy + (ey - sy) * 0.67 + perpY * wavyAmp * dir;
        path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)} ${cp2x.toFixed(1)} ${cp2y.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
      }
      break;
    }
    
    case 'nebuly': {
      const nebulyAmp = amplitude * 2;
      for (let i = 0; i < patternCount; i++) {
        const startT = i / patternCount;
        const endT = (i + 1) / patternCount;
        const sx = x1 + dx * startT;
        const sy = y1 + dy * startT;
        const ex = x1 + dx * endT;
        const ey = y1 + dy * endT;
        const dir = (i % 2 === 0) ? 1 : -1;
        const cp1x = sx + (ex - sx) * 0.25 + perpX * nebulyAmp * dir;
        const cp1y = sy + (ey - sy) * 0.25 + perpY * nebulyAmp * dir;
        const cp2x = sx + (ex - sx) * 0.75 + perpX * nebulyAmp * dir;
        const cp2y = sy + (ey - sy) * 0.75 + perpY * nebulyAmp * dir;
        path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)} ${cp2x.toFixed(1)} ${cp2y.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
      }
      break;
    }
    
    case 'engrailed': {
      for (let i = 0; i < patternCount; i++) {
        const startT = i / patternCount;
        const endT = (i + 1) / patternCount;
        const sx = x1 + dx * startT;
        const sy = y1 + dy * startT;
        const ex = x1 + dx * endT;
        const ey = y1 + dy * endT;
        const cpx = (sx + ex) / 2 + perpX * amplitude;
        const cpy = (sy + ey) / 2 + perpY * amplitude;
        path += ` Q ${cpx.toFixed(1)} ${cpy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
      }
      break;
    }
    
    case 'invected': {
      for (let i = 0; i < patternCount; i++) {
        const startT = i / patternCount;
        const endT = (i + 1) / patternCount;
        const sx = x1 + dx * startT;
        const sy = y1 + dy * startT;
        const ex = x1 + dx * endT;
        const ey = y1 + dy * endT;
        const cpx = (sx + ex) / 2 - perpX * amplitude;
        const cpy = (sy + ey) / 2 - perpY * amplitude;
        path += ` Q ${cpx.toFixed(1)} ${cpy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
      }
      break;
    }
    
    case 'indented': {
      for (let i = 0; i < patternCount; i++) {
        const midT = (i + 0.5) / patternCount;
        const endT = (i + 1) / patternCount;
        const midX = x1 + dx * midT;
        const midY = y1 + dy * midT;
        const endX = x1 + dx * endT;
        const endY = y1 + dy * endT;
        const dir = (i % 2 === 0) ? 1 : -1;
        path += ` L ${(midX + perpX * amplitude * dir).toFixed(1)} ${(midY + perpY * amplitude * dir).toFixed(1)}`;
        path += ` L ${endX.toFixed(1)} ${endY.toFixed(1)}`;
      }
      break;
    }
    
    case 'dancetty': {
      const dancettyCount = Math.max(3, Math.round(patternCount / 2));
      const dancettyAmp = amplitude * 2;
      for (let i = 0; i < dancettyCount; i++) {
        const midT = (i + 0.5) / dancettyCount;
        const endT = (i + 1) / dancettyCount;
        const midX = x1 + dx * midT;
        const midY = y1 + dy * midT;
        const endX = x1 + dx * endT;
        const endY = y1 + dy * endT;
        const dir = (i % 2 === 0) ? 1 : -1;
        path += ` L ${(midX + perpX * dancettyAmp * dir).toFixed(1)} ${(midY + perpY * dancettyAmp * dir).toFixed(1)}`;
        path += ` L ${endX.toFixed(1)} ${endY.toFixed(1)}`;
      }
      break;
    }
    
    case 'embattled': {
      for (let i = 0; i < patternCount; i++) {
        const t1 = (i + 0.25) / patternCount;
        const t3 = (i + 0.75) / patternCount;
        const t4 = (i + 1) / patternCount;
        const raised = (i % 2 === 0);
        const offset = raised ? amplitude : 0;
        path += ` L ${(x1 + dx * t1 + perpX * offset).toFixed(1)} ${(y1 + dy * t1 + perpY * offset).toFixed(1)}`;
        path += ` L ${(x1 + dx * t3 + perpX * offset).toFixed(1)} ${(y1 + dy * t3 + perpY * offset).toFixed(1)}`;
        path += ` L ${(x1 + dx * t4).toFixed(1)} ${(y1 + dy * t4).toFixed(1)}`;
      }
      break;
    }
    
    case 'raguly': {
      for (let i = 0; i < patternCount; i++) {
        const t1 = (i + 0.3) / patternCount;
        const t2 = (i + 0.5) / patternCount;
        const t3 = (i + 1) / patternCount;
        const dir = (i % 2 === 0) ? 1 : -1;
        path += ` L ${(x1 + dx * t1 + perpX * amplitude * dir * 0.5).toFixed(1)} ${(y1 + dy * t1 + perpY * amplitude * dir * 0.5).toFixed(1)}`;
        path += ` L ${(x1 + dx * t2 + perpX * amplitude * dir).toFixed(1)} ${(y1 + dy * t2 + perpY * amplitude * dir).toFixed(1)}`;
        path += ` L ${(x1 + dx * t2).toFixed(1)} ${(y1 + dy * t2).toFixed(1)}`;
        path += ` L ${(x1 + dx * t3).toFixed(1)} ${(y1 + dy * t3).toFixed(1)}`;
      }
      break;
    }
    
    case 'dovetailed': {
      for (let i = 0; i < patternCount; i++) {
        const t1 = (i + 0.2) / patternCount;
        const t2 = (i + 0.4) / patternCount;
        const t3 = (i + 0.6) / patternCount;
        const t4 = (i + 0.8) / patternCount;
        const t5 = (i + 1) / patternCount;
        const dir = (i % 2 === 0) ? 1 : -1;
        path += ` L ${(x1 + dx * t1).toFixed(1)} ${(y1 + dy * t1).toFixed(1)}`;
        path += ` L ${(x1 + dx * t2 + perpX * amplitude * dir).toFixed(1)} ${(y1 + dy * t2 + perpY * amplitude * dir).toFixed(1)}`;
        path += ` L ${(x1 + dx * t3 + perpX * amplitude * dir).toFixed(1)} ${(y1 + dy * t3 + perpY * amplitude * dir).toFixed(1)}`;
        path += ` L ${(x1 + dx * t4).toFixed(1)} ${(y1 + dy * t4).toFixed(1)}`;
        path += ` L ${(x1 + dx * t5).toFixed(1)} ${(y1 + dy * t5).toFixed(1)}`;
      }
      break;
    }
    
    default:
      path += ` L ${x2} ${y2}`;
  }
  
  return path;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SVG GENERATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate SVG content for a heraldic division with all options
 */
function generateDivisionSVG(division, tincture1, tincture2, tincture3, options = {}) {
  const c1 = TINCTURES[tincture1]?.hex || tincture1;
  const c2 = TINCTURES[tincture2]?.hex || tincture2;
  const c3 = tincture3 ? (TINCTURES[tincture3]?.hex || tincture3) : c1;
  
  const {
    lineStyle = 'straight',
    count = 1,
    thickness = 'normal',
    inverted = false
  } = options;
  
  const thicknessMultiplier = thickness === 'narrow' ? 0.6 : thickness === 'wide' ? 1.4 : 1;
  
  let content = '';
  
  const bgColor = inverted && ['chevron', 'pile', 'perChevron'].includes(division) ? c2 : c1;
  const fgColor = inverted && ['chevron', 'pile', 'perChevron'].includes(division) ? c1 : c2;
  
  content = `<rect x="0" y="0" width="200" height="200" fill="${bgColor}"/>`;
  
  switch (division) {
    case 'plain':
      break;
      
    case 'perPale':
      if (lineStyle === 'straight') {
        content += `<rect x="100" y="0" width="100" height="200" fill="${c2}"/>`;
      } else {
        const linePath = generateStyledLine(100, 0, 100, 200, lineStyle);
        content += `<path d="${linePath} L 200 200 L 200 0 Z" fill="${c2}"/>`;
      }
      break;
      
    case 'perFess':
      if (lineStyle === 'straight') {
        content += `<rect x="0" y="100" width="200" height="100" fill="${c2}"/>`;
      } else {
        const linePath = generateStyledLine(0, 100, 200, 100, lineStyle);
        content += `<path d="${linePath} L 200 200 L 0 200 Z" fill="${c2}"/>`;
      }
      break;
      
    case 'perBend':
      if (lineStyle === 'straight') {
        content += `<path d="M 0 0 L 200 200 L 200 0 Z" fill="${c2}"/>`;
      } else {
        const linePath = generateStyledLine(0, 0, 200, 200, lineStyle);
        content += `<path d="${linePath} L 200 0 Z" fill="${c2}"/>`;
      }
      break;
      
    case 'perBendSinister':
      if (lineStyle === 'straight') {
        content += `<path d="M 200 0 L 0 200 L 0 0 Z" fill="${c2}"/>`;
      } else {
        const linePath = generateStyledLine(200, 0, 0, 200, lineStyle);
        content += `<path d="${linePath} L 0 0 Z" fill="${c2}"/>`;
      }
      break;
    
    case 'perChevron': {
      const peakY = inverted ? 140 : 60;
      const baseY = inverted ? 0 : 200;
      if (lineStyle === 'straight') {
        content += `<path d="M 0 ${baseY} L 100 ${peakY} L 200 ${baseY} Z" fill="${fgColor}"/>`;
      } else {
        const line1 = generateStyledLine(0, baseY, 100, peakY, lineStyle);
        const line2 = generateStyledLine(100, peakY, 200, baseY, lineStyle);
        content += `<path d="${line1} ${line2.replace(/^M [^ ]+ [^ ]+/, '')} Z" fill="${fgColor}"/>`;
      }
      break;
    }
      
    case 'quarterly':
      content += `
        <rect x="100" y="0" width="100" height="100" fill="${c2}"/>
        <rect x="0" y="100" width="100" height="100" fill="${c2}"/>
      `;
      break;
      
    case 'perSaltire':
      content += `<path d="M 100 0 L 200 100 L 100 200 L 0 100 Z" fill="${c2}"/>`;
      break;
      
    case 'paly': {
      const stripeCount = count || 6;
      const stripeWidth = 200 / stripeCount;
      for (let i = 0; i < stripeCount; i++) {
        if (i % 2 === 1) {
          content += `<rect x="${i * stripeWidth}" y="0" width="${stripeWidth}" height="200" fill="${c2}"/>`;
        }
      }
      break;
    }
      
    case 'barry': {
      const stripeCount = count || 6;
      const stripeHeight = 200 / stripeCount;
      for (let i = 0; i < stripeCount; i++) {
        if (i % 2 === 1) {
          content += `<rect x="0" y="${i * stripeHeight}" width="200" height="${stripeHeight}" fill="${c2}"/>`;
        }
      }
      break;
    }
      
    case 'bendy': {
      const stripeCount = count || 6;
      const stripeWidth = 400 / stripeCount;
      for (let i = 0; i < stripeCount * 2; i++) {
        if (i % 2 === 1) {
          const offset = i * stripeWidth / 2 - 200;
          content += `<path d="M ${offset} 0 L ${offset + stripeWidth/2} 0 L ${offset + 200 + stripeWidth/2} 200 L ${offset + 200} 200 Z" fill="${c2}"/>`;
        }
      }
      break;
    }
      
    case 'bendySinister': {
      const stripeCount = count || 6;
      const stripeWidth = 400 / stripeCount;
      for (let i = 0; i < stripeCount * 2; i++) {
        if (i % 2 === 1) {
          const offset = i * stripeWidth / 2 - 200;
          content += `<path d="M ${200 - offset} 0 L ${200 - offset - stripeWidth/2} 0 L ${-offset - stripeWidth/2} 200 L ${-offset} 200 Z" fill="${c2}"/>`;
        }
      }
      break;
    }
      
    case 'chequy': {
      const checkSize = 40;
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
          if ((row + col) % 2 === 1) {
            content += `<rect x="${col * checkSize}" y="${row * checkSize}" width="${checkSize}" height="${checkSize}" fill="${c2}"/>`;
          }
        }
      }
      break;
    }
      
    case 'lozengy': {
      const size = 35;
      for (let row = -2; row < 8; row++) {
        for (let col = -2; col < 8; col++) {
          if ((row + col) % 2 === 0) {
            const cx = col * size + (row % 2 === 0 ? 0 : size/2);
            const cy = row * size * 0.7;
            content += `<path d="M ${cx} ${cy - size/2} L ${cx + size/2} ${cy} L ${cx} ${cy + size/2} L ${cx - size/2} ${cy} Z" fill="${c2}"/>`;
          }
        }
      }
      break;
    }
    
    case 'fusily': {
      const width = 25;
      const height = 50;
      for (let row = -1; row < 5; row++) {
        for (let col = -1; col < 10; col++) {
          if ((row + col) % 2 === 0) {
            const cx = col * width + (row % 2 === 0 ? 0 : width/2);
            const cy = row * height * 0.8 + 20;
            content += `<path d="M ${cx} ${cy - height/2} L ${cx + width/2} ${cy} L ${cx} ${cy + height/2} L ${cx - width/2} ${cy} Z" fill="${c2}"/>`;
          }
        }
      }
      break;
    }
      
    case 'gyronny':
      content += `
        <path d="M 100 100 L 100 0 L 200 0 Z" fill="${c2}"/>
        <path d="M 100 100 L 200 100 L 200 200 Z" fill="${c2}"/>
        <path d="M 100 100 L 100 200 L 0 200 Z" fill="${c2}"/>
        <path d="M 100 100 L 0 100 L 0 0 Z" fill="${c2}"/>
      `;
      break;
      
    case 'chief': {
      const height = 60 * thicknessMultiplier;
      if (lineStyle === 'straight') {
        content += `<rect x="0" y="0" width="200" height="${height}" fill="${c2}"/>`;
      } else {
        const linePath = generateStyledLine(200, height, 0, height, lineStyle);
        content += `<path d="M 0 0 L 200 0 L 200 ${height} ${linePath.replace(/^M [\d.-]+ [\d.-]+\s*/, '')} Z" fill="${c2}"/>`;
      }
      break;
    }
      
    case 'base': {
      const height = 60 * thicknessMultiplier;
      const y = 200 - height;
      if (lineStyle === 'straight') {
        content += `<rect x="0" y="${y}" width="200" height="${height}" fill="${c2}"/>`;
      } else {
        const linePath = generateStyledLine(0, y, 200, y, lineStyle);
        content += `<path d="${linePath} L 200 200 L 0 200 Z" fill="${c2}"/>`;
      }
      break;
    }
      
    case 'fess': {
      const bandHeight = 50 * thicknessMultiplier;
      const bandCount = Math.min(count || 1, 3);
      const spacing = bandCount === 1 ? 0 : 30;
      const startY = 100 - (bandCount * bandHeight + (bandCount - 1) * spacing) / 2;
      
      for (let i = 0; i < bandCount; i++) {
        const y = startY + i * (bandHeight + spacing);
        if (lineStyle === 'straight') {
          content += `<rect x="0" y="${y}" width="200" height="${bandHeight}" fill="${c2}"/>`;
        } else {
          const topLine = generateStyledLine(0, y, 200, y, lineStyle);
          const bottomLine = generateStyledLine(200, y + bandHeight, 0, y + bandHeight, lineStyle);
          content += `<path d="${topLine} L 200 ${y + bandHeight} ${bottomLine.replace(/^M [^ ]+ [^ ]+/, '')} L 0 ${y} Z" fill="${c2}"/>`;
        }
      }
      break;
    }
      
    case 'pale': {
      const bandWidth = 50 * thicknessMultiplier;
      const bandCount = Math.min(count || 1, 3);
      const spacing = bandCount === 1 ? 0 : 20;
      const startX = 100 - (bandCount * bandWidth + (bandCount - 1) * spacing) / 2;
      
      for (let i = 0; i < bandCount; i++) {
        const x = startX + i * (bandWidth + spacing);
        if (lineStyle === 'straight') {
          content += `<rect x="${x}" y="0" width="${bandWidth}" height="200" fill="${c2}"/>`;
        } else {
          const leftLine = generateStyledLine(x, 0, x, 200, lineStyle);
          const rightLine = generateStyledLine(x + bandWidth, 200, x + bandWidth, 0, lineStyle);
          content += `<path d="${leftLine} L ${x} 200 ${rightLine.replace(/^M [^ ]+ [^ ]+/, '')} L ${x + bandWidth} 0 Z" fill="${c2}"/>`;
        }
      }
      break;
    }
      
    case 'bend': {
      const bandWidth = 45 * thicknessMultiplier;
      const bandCount = Math.min(count || 1, 3);
      
      for (let i = 0; i < bandCount; i++) {
        const offset = (i - (bandCount - 1) / 2) * (bandWidth + 15);
        if (lineStyle === 'straight') {
          content += `<path d="M ${-bandWidth/2 + offset} ${bandWidth/2} L ${bandWidth/2 + offset} ${-bandWidth/2} L ${200 + bandWidth/2 + offset} ${200 - bandWidth/2} L ${200 - bandWidth/2 + offset} ${200 + bandWidth/2} Z" fill="${c2}"/>`;
        } else {
          const line1 = generateStyledLine(-bandWidth/2 + offset, bandWidth/2, 200 - bandWidth/2 + offset, 200 + bandWidth/2, lineStyle);
          content += `<path d="${line1} L ${200 + bandWidth/2 + offset} ${200 - bandWidth/2} L ${bandWidth/2 + offset} ${-bandWidth/2} Z" fill="${c2}"/>`;
        }
      }
      break;
    }
      
    case 'bendSinister': {
      const bandWidth = 45 * thicknessMultiplier;
      const bandCount = Math.min(count || 1, 3);
      
      for (let i = 0; i < bandCount; i++) {
        const offset = (i - (bandCount - 1) / 2) * (bandWidth + 15);
        if (lineStyle === 'straight') {
          content += `<path d="M ${200 + bandWidth/2 - offset} ${bandWidth/2} L ${200 - bandWidth/2 - offset} ${-bandWidth/2} L ${-bandWidth/2 - offset} ${200 - bandWidth/2} L ${bandWidth/2 - offset} ${200 + bandWidth/2} Z" fill="${c2}"/>`;
        } else {
          const line1 = generateStyledLine(200 + bandWidth/2 - offset, bandWidth/2, bandWidth/2 - offset, 200 + bandWidth/2, lineStyle);
          content += `<path d="${line1} L ${-bandWidth/2 - offset} ${200 - bandWidth/2} L ${200 - bandWidth/2 - offset} ${-bandWidth/2} Z" fill="${c2}"/>`;
        }
      }
      break;
    }
      
    case 'chevron': {
      const bandWidth = 45 * thicknessMultiplier;
      const bandCount = Math.min(count || 1, 3);
      const baseY = inverted ? 40 : 160;
      const peakY = inverted ? 160 : 40;
      const direction = inverted ? -1 : 1;
      
      for (let i = 0; i < bandCount; i++) {
        const offset = i * (bandWidth + 15) * direction;
        const outerBaseY = baseY + offset;
        const innerBaseY = outerBaseY + bandWidth * direction;
        const outerPeakY = peakY + offset;
        const innerPeakY = outerPeakY + bandWidth * direction;
        
        if (lineStyle === 'straight') {
          content += `<path d="M 0 ${outerBaseY} L 100 ${outerPeakY} L 200 ${outerBaseY} L 200 ${innerBaseY} L 100 ${innerPeakY} L 0 ${innerBaseY} Z" fill="${fgColor}"/>`;
        } else {
          const outer1 = generateStyledLine(0, outerBaseY, 100, outerPeakY, lineStyle);
          const outer2 = generateStyledLine(100, outerPeakY, 200, outerBaseY, lineStyle);
          content += `<path d="${outer1} ${outer2.replace(/^M [^ ]+ [^ ]+/, '')} L 200 ${innerBaseY} L 100 ${innerPeakY} L 0 ${innerBaseY} Z" fill="${fgColor}"/>`;
        }
      }
      break;
    }
    
    case 'pile': {
      const pileCount = Math.min(count || 1, 3);
      const baseWidth = 200 / pileCount;
      const baseY = inverted ? 200 : 0;
      const pointY = inverted ? 40 : 160;
      
      for (let i = 0; i < pileCount; i++) {
        const centerX = baseWidth * (i + 0.5);
        const leftX = centerX - baseWidth * 0.4;
        const rightX = centerX + baseWidth * 0.4;
        
        if (lineStyle === 'straight') {
          content += `<path d="M ${leftX} ${baseY} L ${centerX} ${pointY} L ${rightX} ${baseY} Z" fill="${fgColor}"/>`;
        } else {
          const line1 = generateStyledLine(leftX, baseY, centerX, pointY, lineStyle);
          const line2 = generateStyledLine(centerX, pointY, rightX, baseY, lineStyle);
          content += `<path d="${line1} ${line2.replace(/^M [^ ]+ [^ ]+/, '')} Z" fill="${fgColor}"/>`;
        }
      }
      break;
    }
      
    case 'cross': {
      const armWidth = 50 * thicknessMultiplier;
      const halfArm = armWidth / 2;
      content += `<rect x="${100 - halfArm}" y="0" width="${armWidth}" height="200" fill="${c2}"/>`;
      content += `<rect x="0" y="${100 - halfArm}" width="200" height="${armWidth}" fill="${c2}"/>`;
      break;
    }
      
    case 'saltire': {
      const armWidth = 40 * thicknessMultiplier;
      content += `<path d="M 0 ${armWidth} L ${armWidth} 0 L 100 ${100 - armWidth} L ${200 - armWidth} 0 L 200 ${armWidth} L ${100 + armWidth} 100 L 200 ${200 - armWidth} L ${200 - armWidth} 200 L 100 ${100 + armWidth} L ${armWidth} 200 L 0 ${200 - armWidth} L ${100 - armWidth} 100 Z" fill="${c2}"/>`;
      break;
    }
      
    case 'tiercedPale':
      if (lineStyle === 'straight') {
        content += `<rect x="67" y="0" width="66" height="200" fill="${c2}"/>`;
        content += `<rect x="133" y="0" width="67" height="200" fill="${c3}"/>`;
      } else {
        const line1 = generateStyledLine(67, 0, 67, 200, lineStyle);
        content += `<path d="${line1} L 133 200 L 133 0 Z" fill="${c2}"/>`;
        const line2 = generateStyledLine(133, 0, 133, 200, lineStyle);
        content += `<path d="${line2} L 200 200 L 200 0 L 133 0 Z" fill="${c3}"/>`;
      }
      break;
      
    case 'tiercedFess':
      if (lineStyle === 'straight') {
        content += `<rect x="0" y="67" width="200" height="66" fill="${c2}"/>`;
        content += `<rect x="0" y="133" width="200" height="67" fill="${c3}"/>`;
      } else {
        const line1 = generateStyledLine(0, 67, 200, 67, lineStyle);
        content += `<path d="${line1} L 200 133 L 0 133 Z" fill="${c2}"/>`;
        const line2 = generateStyledLine(0, 133, 200, 133, lineStyle);
        content += `<path d="${line2} L 200 200 L 0 200 L 0 133 Z" fill="${c3}"/>`;
      }
      break;
      
    default:
      break;
  }
  
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${content}</svg>`;
}

/**
 * Generate a formal blazon with all modifiers
 */
function generateBlazonText(division, tincture1, tincture2, tincture3, options = {}) {
  const t1 = TINCTURES[tincture1]?.name.split(' ')[0] || tincture1;
  const t2 = TINCTURES[tincture2]?.name.split(' ')[0] || tincture2;
  const t3 = tincture3 ? (TINCTURES[tincture3]?.name.split(' ')[0] || tincture3) : null;
  
  const { lineStyle = 'straight', count = 1, inverted = false } = options;
  const lineDesc = LINE_STYLES[lineStyle]?.blazon || '';
  
  const countNames = {
    fess: { 1: 'a fess', 2: 'two bars', 3: 'three bars' },
    pale: { 1: 'a pale', 2: 'two pallets', 3: 'three pallets' },
    bend: { 1: 'a bend', 2: 'two bendlets', 3: 'three bendlets' },
    bendSinister: { 1: 'a bend sinister', 2: 'two bendlets sinister', 3: 'three bendlets sinister' },
    chevron: { 1: 'a chevron', 2: 'two chevronels', 3: 'three chevronels' },
    pile: { 1: 'a pile', 2: 'two piles', 3: 'three piles' }
  };
  
  let blazon = '';
  
  switch (division) {
    case 'plain':
      blazon = t1;
      break;
    case 'perPale':
      blazon = `Per pale ${lineDesc} ${t1} and ${t2}`.replace(/\s+/g, ' ').trim();
      break;
    case 'perFess':
      blazon = `Per fess ${lineDesc} ${t1} and ${t2}`.replace(/\s+/g, ' ').trim();
      break;
    case 'perBend':
      blazon = `Per bend ${lineDesc} ${t1} and ${t2}`.replace(/\s+/g, ' ').trim();
      break;
    case 'perBendSinister':
      blazon = `Per bend sinister ${lineDesc} ${t1} and ${t2}`.replace(/\s+/g, ' ').trim();
      break;
    case 'perChevron':
      blazon = `Per chevron ${lineDesc}${inverted ? ' inverted' : ''} ${t1} and ${t2}`.replace(/\s+/g, ' ').trim();
      break;
    case 'quarterly':
      blazon = `Quarterly ${t1} and ${t2}`;
      break;
    case 'perSaltire':
      blazon = `Per saltire ${t1} and ${t2}`;
      break;
    case 'paly':
      blazon = `Paly of ${count || 6} ${t1} and ${t2}`;
      break;
    case 'barry':
      blazon = `Barry of ${count || 6} ${t1} and ${t2}`;
      break;
    case 'bendy':
      blazon = `Bendy of ${count || 6} ${t1} and ${t2}`;
      break;
    case 'bendySinister':
      blazon = `Bendy sinister of ${count || 6} ${t1} and ${t2}`;
      break;
    case 'chequy':
      blazon = `Chequy ${t1} and ${t2}`;
      break;
    case 'lozengy':
      blazon = `Lozengy ${t1} and ${t2}`;
      break;
    case 'fusily':
      blazon = `Fusily ${t1} and ${t2}`;
      break;
    case 'gyronny':
      blazon = `Gyronny ${t1} and ${t2}`;
      break;
    case 'chief':
      blazon = `${t1}, a chief ${lineDesc} ${t2}`.replace(/\s+/g, ' ').trim();
      break;
    case 'base':
      blazon = `${t1}, in base ${lineDesc} ${t2}`.replace(/\s+/g, ' ').trim();
      break;
    case 'fess':
    case 'pale':
    case 'bend':
    case 'bendSinister':
    case 'chevron': {
      const ordinaryName = countNames[division]?.[count] || `a ${division}`;
      const invertedText = inverted ? ' inverted' : '';
      blazon = `${t1}, ${ordinaryName} ${lineDesc}${invertedText} ${t2}`.replace(/\s+/g, ' ').trim();
      break;
    }
    case 'pile': {
      const pileName = countNames.pile[count] || 'a pile';
      const invertedText = inverted ? ' reversed' : '';
      blazon = `${t1}, ${pileName}${invertedText} ${lineDesc} ${t2}`.replace(/\s+/g, ' ').trim();
      break;
    }
    case 'cross':
      blazon = `${t1}, a cross ${lineDesc} ${t2}`.replace(/\s+/g, ' ').trim();
      break;
    case 'saltire':
      blazon = `${t1}, a saltire ${lineDesc} ${t2}`.replace(/\s+/g, ' ').trim();
      break;
    case 'tiercedPale':
      blazon = `Tierced in pale ${lineDesc} ${t1}, ${t2}, and ${t3 || t1}`.replace(/\s+/g, ' ').trim();
      break;
    case 'tiercedFess':
      blazon = `Tierced in fess ${lineDesc} ${t1}, ${t2}, and ${t3 || t1}`.replace(/\s+/g, ' ').trim();
      break;
    default:
      blazon = t1;
  }
  
  return blazon;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LAZY LOADING CHARGE PREVIEW
// ═══════════════════════════════════════════════════════════════════════════════

function LazyChargePreview({ chargeId, tincture, size = 50, selected, onClick, showName = true }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  const chargeData = CHARGES[chargeId];
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px', threshold: 0.1 }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  if (!chargeData) return null;
  
  return (
    <button
      ref={cardRef}
      type="button"
      className={`charge-preview-btn ${selected ? 'selected' : ''}`}
      onClick={() => onClick?.(chargeId)}
      title={chargeData.description}
    >
      <div className="charge-preview-icon">
        {isVisible ? (
          <ExternalChargeRenderer
            chargeId={chargeId}
            tincture={tincture}
            size={size}
            showOutline={true}
          />
        ) : (
          <div className="charge-preview-placeholder" style={{ width: size, height: size }} />
        )}
      </div>
      {showName && (
        <span className="charge-preview-name">{chargeData.name}</span>
      )}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function HeraldryCreator() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const presetHouseId = searchParams.get('houseId');
  
  const isEditMode = !!id;
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [division, setDivision] = useState('plain');
  const [tincture1, setTincture1] = useState('azure');
  const [tincture2, setTincture2] = useState('or');
  const [tincture3, setTincture3] = useState('gules');
  const [shieldType, setShieldType] = useState('heater');
  const [category, setCategory] = useState('noble');
  const [tags, setTags] = useState('');
  const [linkedHouseId, setLinkedHouseId] = useState(presetHouseId || '');
  
  // Division options
  const [lineStyle, setLineStyle] = useState('straight');
  const [divisionCount, setDivisionCount] = useState(1);
  const [thickness, setThickness] = useState('normal');
  const [inverted, setInverted] = useState(false);
  
  // Charge options (unified library)
  const [chargeEnabled, setChargeEnabled] = useState(false);
  const [chargeId, setChargeId] = useState('lion4');
  const [chargeTincture, setChargeTincture] = useState('or');
  const [chargeCount, setChargeCount] = useState(1);
  const [chargeArrangement, setChargeArrangement] = useState('fessPoint');
  const [chargeSize, setChargeSize] = useState('medium');
  const [activeChargeCategory, setActiveChargeCategory] = useState('beasts');
  
  // Generated content
  const [blazon, setBlazon] = useState('');
  const [previewSVG, setPreviewSVG] = useState(null);
  const [rawSVG, setRawSVG] = useState(null);
  
  // Data
  const [houses, setHouses] = useState([]);
  const [existingHeraldry, setExistingHeraldry] = useState(null);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('division');
  const [showRuleWarning, setShowRuleWarning] = useState(false);
  
  // Get current division info
  const currentDivision = DIVISIONS[division] || {};
  const hasOptions = currentDivision.supportsLine || currentDivision.supportsCount || 
                     currentDivision.supportsThickness || currentDivision.supportsInvert;
  
  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, [id]);
  
  async function loadInitialData() {
    setLoading(true);
    try {
      const housesData = await getAllHouses();
      setHouses(housesData);
      
      if (isEditMode) {
        const heraldry = await getHeraldry(parseInt(id));
        if (heraldry) {
          setExistingHeraldry(heraldry);
          setName(heraldry.name || '');
          setDescription(heraldry.description || '');
          setShieldType(heraldry.shieldType || 'heater');
          setCategory(heraldry.category || 'noble');
          setTags(heraldry.tags?.join(', ') || '');
          setBlazon(heraldry.blazon || '');
          
          if (heraldry.composition) {
            setDivision(heraldry.composition.division || 'plain');
            setTincture1(heraldry.composition.tincture1 || 'azure');
            setTincture2(heraldry.composition.tincture2 || 'or');
            setTincture3(heraldry.composition.tincture3 || 'gules');
            setLineStyle(heraldry.composition.lineStyle || 'straight');
            setDivisionCount(heraldry.composition.count || 1);
            setThickness(heraldry.composition.thickness || 'normal');
            setInverted(heraldry.composition.inverted || false);
            
            // Restore charge settings
            if (heraldry.composition.chargeEnabled) {
              setChargeEnabled(true);
              // Support both old chargeId and externalChargeId
              const loadedChargeId = heraldry.composition.externalChargeId || heraldry.composition.chargeId || 'lion4';
              setChargeId(loadedChargeId);
              setChargeTincture(heraldry.composition.chargeTincture || 'or');
              setChargeCount(heraldry.composition.chargeCount || 1);
              setChargeArrangement(heraldry.composition.chargeArrangement || 'fessPoint');
              setChargeSize(heraldry.composition.chargeSize || 'medium');
              
              // Set category based on loaded charge
              const loadedCharge = CHARGES[loadedChargeId];
              if (loadedCharge) {
                setActiveChargeCategory(loadedCharge.category);
              }
            }
          }
          
          if (heraldry.heraldrySVG) {
            setPreviewSVG(heraldry.heraldrySVG);
          }
        }
      }
      
      if (presetHouseId && !isEditMode) {
        const house = await getHouse(parseInt(presetHouseId));
        if (house) {
          setName(`Arms of ${house.houseName}`);
          setLinkedHouseId(presetHouseId);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  }
  
  // Reset options when division changes
  useEffect(() => {
    const div = DIVISIONS[division];
    if (div) {
      if (!div.supportsLine) setLineStyle('straight');
      if (!div.supportsCount) setDivisionCount(div.defaultCount || 1);
      if (!div.supportsThickness) setThickness('normal');
      if (!div.supportsInvert) setInverted(false);
      if (div.defaultCount) setDivisionCount(div.defaultCount);
    }
  }, [division]);
  
  // Check rule of tincture
  useEffect(() => {
    const t1Type = TINCTURES[tincture1]?.type;
    const t2Type = TINCTURES[tincture2]?.type;
    const adjacentDivisions = ['perPale', 'perFess', 'perBend', 'perBendSinister', 'quarterly', 'perSaltire', 'perChevron'];
    
    if (adjacentDivisions.includes(division)) {
      if ((t1Type === 'metal' && t2Type === 'metal') || 
          (t1Type === 'colour' && t2Type === 'colour')) {
        setShowRuleWarning(true);
      } else {
        setShowRuleWarning(false);
      }
    } else {
      setShowRuleWarning(false);
    }
  }, [tincture1, tincture2, division]);
  
  // Generate preview
  const generatePreview = useCallback(async () => {
    setGenerating(true);
    try {
      const options = { lineStyle, count: divisionCount, thickness, inverted };
      let divSVG = generateDivisionSVG(division, tincture1, tincture2, tincture3, options);
      
      // Add charge if enabled
      if (chargeEnabled && chargeId) {
        const chargeHex = TINCTURES[chargeTincture]?.hex || chargeTincture;
        const sizeScale = CHARGE_SIZES[chargeSize]?.scale || 0.7;
        
        let chargeSVGContent = '';
        
        if (chargeCount === 1) {
          // Single charge at center
          chargeSVGContent = await generateExternalChargeSVGAsync(
            chargeId, 
            chargeHex, 
            100, 90, 
            sizeScale
          );
        } else {
          // Multiple charges
          const arrangements = CHARGE_ARRANGEMENTS[chargeCount];
          const arrangementKey = chargeArrangement || Object.keys(arrangements)[0];
          const positions = arrangements[arrangementKey];
          
          const chargePromises = positions.map(pos =>
            generateExternalChargeSVGAsync(
              chargeId,
              chargeHex,
              pos.x,
              pos.y,
              sizeScale * 0.7
            )
          );
          
          const chargeResults = await Promise.all(chargePromises);
          chargeSVGContent = chargeResults.join('');
        }
        
        if (chargeSVGContent) {
          divSVG = divSVG.replace('</svg>', `${chargeSVGContent}</svg>`);
        }
      }
      
      setRawSVG(divSVG);
      
      const maskedSVG = await createSVGHeraldryWithMask(divSVG, shieldType, 400);
      setPreviewSVG(maskedSVG);
      
      // Generate blazon
      let newBlazon = generateBlazonText(division, tincture1, tincture2, tincture3, options);
      
      if (chargeEnabled && chargeId) {
        const chargeTinctureName = TINCTURES[chargeTincture]?.name.split(' ')[0] || chargeTincture;
        const chargeBlazonPart = generateChargeBlazon(chargeId, chargeTinctureName, chargeCount);
        
        if (chargeBlazonPart) {
          newBlazon = `${newBlazon}, ${chargeBlazonPart}`;
        }
      }
      
      setBlazon(newBlazon);
    } catch (error) {
      console.error('Error generating preview:', error);
    }
    setGenerating(false);
  }, [division, tincture1, tincture2, tincture3, shieldType, lineStyle, divisionCount, thickness, inverted, chargeEnabled, chargeId, chargeTincture, chargeCount, chargeArrangement, chargeSize]);
  
  useEffect(() => {
    generatePreview();
  }, [generatePreview]);
  
  // Handle save
  async function handleSave() {
    if (!name.trim()) {
      alert('Please enter a name for this heraldry.');
      return;
    }
    
    if (!previewSVG) {
      alert('Please generate a preview first.');
      return;
    }
    
    setSaving(true);
    
    try {
      const pngVersions = await convertSVGtoPNG(previewSVG);
      
      const heraldryData = {
        name: name.trim(),
        description: description.trim() || null,
        blazon: blazon,
        heraldrySVG: previewSVG,
        heraldrySourceSVG: rawSVG,
        heraldryDisplay: pngVersions.display,
        heraldryThumbnail: pngVersions.thumbnail,
        heraldryHighRes: pngVersions.highRes,
        shieldType: shieldType,
        composition: {
          division,
          tincture1,
          tincture2,
          tincture3,
          lineStyle,
          count: divisionCount,
          thickness,
          inverted,
          // Unified charge data
          chargeEnabled,
          chargeId: chargeEnabled ? chargeId : null,
          chargeTincture: chargeEnabled ? chargeTincture : null,
          chargeCount: chargeEnabled ? chargeCount : null,
          chargeArrangement: chargeEnabled ? chargeArrangement : null,
          chargeSize: chargeEnabled ? chargeSize : null,
          generatedAt: new Date().toISOString()
        },
        category: category,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        source: 'creator'
      };
      
      let heraldryId;
      
      if (isEditMode) {
        await updateHeraldry(parseInt(id), heraldryData);
        heraldryId = parseInt(id);
      } else {
        heraldryId = await createHeraldry(heraldryData);
      }
      
      if (linkedHouseId) {
        await linkHeraldryToEntity({
          heraldryId: heraldryId,
          entityType: 'house',
          entityId: parseInt(linkedHouseId),
          linkType: 'primary'
        });
        
        await updateHouse(parseInt(linkedHouseId), {
          heraldrySVG: previewSVG,
          heraldrySourceSVG: rawSVG,
          heraldryImageData: pngVersions.display,
          heraldryThumbnail: pngVersions.thumbnail,
          heraldryHighRes: pngVersions.highRes,
          heraldryShieldType: shieldType,
          heraldrySource: 'creator',
          heraldryType: 'svg',
          heraldryId: heraldryId
        });
      }
      
      navigate(`/heraldry`);
    } catch (error) {
      console.error('Error saving heraldry:', error);
      alert('Failed to save heraldry. Please try again.');
    }
    
    setSaving(false);
  }
  
  if (loading) {
    return (
      <>
        <Navigation />
        <div className="heraldry-creator loading">
          <div className="loading-spinner">
            <div className="loading-icon">🛡️</div>
            <p>Preparing the Design Studio...</p>
          </div>
        </div>
      </>
    );
  }
  
  const needsThirdTincture = ['tiercedPale', 'tiercedFess'].includes(division);
  
  // Get charges for current category
  const categoryCharges = getChargesByCategory(activeChargeCategory);
  
  return (
    <>
      <Navigation />
      <div className="heraldry-creator">
        
        <header className="creator-header">
          <div className="header-content">
            <button className="back-button" onClick={() => navigate('/heraldry')}>
              ← Back to Armory
            </button>
            <h1 className="creator-title">
              {isEditMode ? 'Edit Heraldry' : 'Design New Heraldry'}
            </h1>
          </div>
        </header>
        
        <div className="creator-layout">
          
          {/* Preview Panel */}
          <aside className="preview-panel">
            <div className="preview-container">
              <h2 className="panel-title">Preview</h2>
              
              <div className="shield-preview">
                {generating ? (
                  <div className="generating-indicator">
                    <span>⚙️</span>
                    <p>Generating...</p>
                  </div>
                ) : previewSVG ? (
                  <div className="shield-display" dangerouslySetInnerHTML={{ __html: previewSVG }} />
                ) : (
                  <div className="preview-placeholder">
                    <span>🛡️</span>
                    <p>Your design will appear here</p>
                  </div>
                )}
              </div>
              
              {blazon && (
                <div className="blazon-display">
                  <h3>Blazon</h3>
                  <p className="blazon-text">{blazon}</p>
                </div>
              )}
              
              {showRuleWarning && (
                <div className="rule-warning">
                  <span className="warning-icon">⚠️</span>
                  <p>
                    <strong>Rule of Tincture:</strong> Metal on metal or colour on colour 
                    is traditionally avoided. This design may violate convention.
                  </p>
                </div>
              )}
            </div>
          </aside>
          
          {/* Design Panel */}
          <main className="design-panel">
            
            {/* Identity */}
            <section className="design-section">
              <h2 className="section-title">Identity</h2>
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Arms of House Wilfrey"
                  className="text-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional notes about this heraldry..."
                  className="text-input textarea"
                  rows={3}
                />
              </div>
            </section>
            
            {/* Division */}
            <section className="design-section">
              <h2 
                className={`section-title collapsible ${activeSection === 'division' ? 'active' : ''}`}
                onClick={() => setActiveSection(activeSection === 'division' ? '' : 'division')}
              >
                <span>Division</span>
                <span className="collapse-icon">{activeSection === 'division' ? '▼' : '▶'}</span>
              </h2>
              
              {activeSection === 'division' && (
                <>
                  <div className="division-grid">
                    {Object.entries(DIVISIONS).map(([key, div]) => (
                      <button
                        key={key}
                        className={`division-option ${division === key ? 'selected' : ''}`}
                        onClick={() => setDivision(key)}
                        title={div.description}
                      >
                        <span className="division-icon">{div.icon}</span>
                        <span className="division-name">{div.name}</span>
                      </button>
                    ))}
                  </div>
                  
                  {hasOptions && (
                    <div className="division-options">
                      <h3 className="options-title">Division Options</h3>
                      
                      {currentDivision.supportsLine && (
                        <div className="option-group">
                          <label>Line Style</label>
                          <div className="line-style-grid">
                            {Object.entries(LINE_STYLES).map(([key, style]) => (
                              <button
                                key={key}
                                className={`line-style-option ${lineStyle === key ? 'selected' : ''}`}
                                onClick={() => setLineStyle(key)}
                                title={style.description}
                              >
                                {style.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {currentDivision.supportsCount && (
                        <div className="option-group">
                          <label>Count</label>
                          <div className="count-controls">
                            {currentDivision.group === 'stripe' ? (
                              <input
                                type="range"
                                min="4"
                                max="10"
                                step="2"
                                value={divisionCount}
                                onChange={(e) => setDivisionCount(parseInt(e.target.value))}
                                className="count-slider"
                              />
                            ) : (
                              [1, 2, 3].map(num => (
                                <button
                                  key={num}
                                  className={`count-button ${divisionCount === num ? 'selected' : ''}`}
                                  onClick={() => setDivisionCount(num)}
                                  disabled={currentDivision.maxCount && num > currentDivision.maxCount}
                                >
                                  {num}
                                </button>
                              ))
                            )}
                            <span className="count-value">
                              {currentDivision.group === 'stripe' ? `${divisionCount} stripes` : 
                               divisionCount === 1 ? 'Single' : divisionCount === 2 ? 'Double' : 'Triple'}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {currentDivision.supportsThickness && (
                        <div className="option-group">
                          <label>Thickness</label>
                          <div className="thickness-controls">
                            {['narrow', 'normal', 'wide'].map(t => (
                              <button
                                key={t}
                                className={`thickness-button ${thickness === t ? 'selected' : ''}`}
                                onClick={() => setThickness(t)}
                              >
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {currentDivision.supportsInvert && (
                        <div className="option-group">
                          <label>
                            <input
                              type="checkbox"
                              checked={inverted}
                              onChange={(e) => setInverted(e.target.checked)}
                              className="invert-checkbox"
                            />
                            <span className="checkbox-label">
                              Inverted {division === 'pile' ? '(Reversed)' : ''}
                            </span>
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </section>
            
            {/* Tinctures */}
            <section className="design-section">
              <h2 
                className={`section-title collapsible ${activeSection === 'tinctures' ? 'active' : ''}`}
                onClick={() => setActiveSection(activeSection === 'tinctures' ? '' : 'tinctures')}
              >
                <span>Tinctures (Colors)</span>
                <span className="collapse-icon">{activeSection === 'tinctures' ? '▼' : '▶'}</span>
              </h2>
              
              {activeSection === 'tinctures' && (
                <div className="tinctures-section">
                  <div className="tincture-row">
                    <label>Primary (Field)</label>
                    <div className="tincture-grid">
                      {Object.entries(TINCTURES).map(([key, tinc]) => (
                        <button
                          key={key}
                          className={`tincture-option ${tincture1 === key ? 'selected' : ''}`}
                          onClick={() => setTincture1(key)}
                          title={tinc.name}
                          style={{ 
                            backgroundColor: tinc.hex,
                            color: ['or', 'argent'].includes(key) ? '#000' : '#fff'
                          }}
                        >
                          {key.charAt(0).toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="tincture-row">
                    <label>Secondary</label>
                    <div className="tincture-grid">
                      {Object.entries(TINCTURES).map(([key, tinc]) => (
                        <button
                          key={key}
                          className={`tincture-option ${tincture2 === key ? 'selected' : ''}`}
                          onClick={() => setTincture2(key)}
                          title={tinc.name}
                          style={{ 
                            backgroundColor: tinc.hex,
                            color: ['or', 'argent'].includes(key) ? '#000' : '#fff'
                          }}
                        >
                          {key.charAt(0).toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {needsThirdTincture && (
                    <div className="tincture-row">
                      <label>Tertiary</label>
                      <div className="tincture-grid">
                        {Object.entries(TINCTURES).map(([key, tinc]) => (
                          <button
                            key={key}
                            className={`tincture-option ${tincture3 === key ? 'selected' : ''}`}
                            onClick={() => setTincture3(key)}
                            title={tinc.name}
                            style={{ 
                              backgroundColor: tinc.hex,
                              color: ['or', 'argent'].includes(key) ? '#000' : '#fff'
                            }}
                          >
                            {key.charAt(0).toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="tincture-legend">
                    <span className="legend-item"><strong>Metals:</strong> Or, Argent</span>
                    <span className="legend-item"><strong>Colours:</strong> Gules, Azure, Sable, Vert, Purpure</span>
                    <span className="legend-item"><strong>Stains:</strong> Tenné, Sanguine, Murrey</span>
                  </div>
                </div>
              )}
            </section>
            
            {/* Charges - Unified Library */}
            <section className="design-section">
              <h2 
                className={`section-title collapsible ${activeSection === 'charges' ? 'active' : ''}`}
                onClick={() => setActiveSection(activeSection === 'charges' ? '' : 'charges')}
              >
                <span>Charges (Symbols)</span>
                <span className="collapse-icon">{activeSection === 'charges' ? '▼' : '▶'}</span>
              </h2>
              
              {activeSection === 'charges' && (
                <div className="charges-section">
                  <div className="option-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={chargeEnabled}
                        onChange={(e) => setChargeEnabled(e.target.checked)}
                        className="invert-checkbox"
                      />
                      <span className="checkbox-label">Add a Charge to Shield</span>
                    </label>
                  </div>
                  
                  {chargeEnabled && (
                    <div className="division-options">
                      <h3 className="options-title">Charge Options</h3>
                      
                      {/* Category Tabs */}
                      <div className="option-group">
                        <label>Category</label>
                        <div className="charge-category-tabs">
                          {Object.entries(CHARGE_CATEGORIES).map(([catId, cat]) => (
                            <button
                              key={catId}
                              type="button"
                              className={`line-style-option ${activeChargeCategory === catId ? 'selected' : ''}`}
                              onClick={() => setActiveChargeCategory(catId)}
                              title={cat.description}
                            >
                              <span>{cat.icon}</span> {cat.name}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Charge Grid with Lazy Loading */}
                      <div className="option-group">
                        <label>Select Charge</label>
                        <div className="unified-charge-grid">
                          {Object.entries(categoryCharges).map(([id, charge]) => (
                            <LazyChargePreview
                              key={id}
                              chargeId={id}
                              tincture={TINCTURES[chargeTincture]?.hex || '#000000'}
                              size={50}
                              selected={chargeId === id}
                              onClick={setChargeId}
                              showName={true}
                            />
                          ))}
                        </div>
                      </div>
                      
                      {/* Charge Tincture */}
                      <div className="option-group">
                        <label>Charge Tincture</label>
                        <div className="tincture-grid">
                          {Object.entries(TINCTURES).map(([key, tinc]) => (
                            <button
                              key={key}
                              type="button"
                              className={`tincture-option ${chargeTincture === key ? 'selected' : ''}`}
                              onClick={() => setChargeTincture(key)}
                              title={tinc.name}
                              style={{ 
                                backgroundColor: tinc.hex,
                                color: ['or', 'argent'].includes(key) ? '#000' : '#fff'
                              }}
                            >
                              {key.charAt(0).toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Charge Count */}
                      <div className="option-group">
                        <label>Number of Charges</label>
                        <div className="count-controls">
                          {[1, 2, 3].map(num => (
                            <button
                              key={num}
                              type="button"
                              className={`count-button ${chargeCount === num ? 'selected' : ''}`}
                              onClick={() => {
                                setChargeCount(num);
                                if (num === 1) setChargeArrangement('fessPoint');
                                else if (num === 2) setChargeArrangement('pale');
                                else setChargeArrangement('twoAndOne');
                              }}
                            >
                              {num}
                            </button>
                          ))}
                          <span className="count-value">
                            {chargeCount === 1 ? 'Single' : chargeCount === 2 ? 'Double' : 'Triple'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Arrangement */}
                      {chargeCount > 1 && (
                        <div className="option-group">
                          <label>Arrangement</label>
                          <div className="thickness-controls">
                            {Object.keys(CHARGE_ARRANGEMENTS[chargeCount] || {}).map(arr => (
                              <button
                                key={arr}
                                type="button"
                                className={`thickness-button ${chargeArrangement === arr ? 'selected' : ''}`}
                                onClick={() => setChargeArrangement(arr)}
                              >
                                {arr === 'twoAndOne' ? '2 & 1' :
                                 arr === 'oneAndTwo' ? '1 & 2' :
                                 arr === 'pale' ? 'In Pale' :
                                 arr === 'fess' ? 'In Fess' :
                                 arr === 'bend' ? 'In Bend' : arr}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Charge Size */}
                      <div className="option-group">
                        <label>Size</label>
                        <div className="thickness-controls">
                          {Object.entries(CHARGE_SIZES).map(([sizeId, size]) => (
                            <button
                              key={sizeId}
                              type="button"
                              className={`thickness-button ${chargeSize === sizeId ? 'selected' : ''}`}
                              onClick={() => setChargeSize(sizeId)}
                            >
                              {size.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
            
            {/* Shield Shape */}
            <section className="design-section">
              <h2 
                className={`section-title collapsible ${activeSection === 'shield' ? 'active' : ''}`}
                onClick={() => setActiveSection(activeSection === 'shield' ? '' : 'shield')}
              >
                <span>Shield Shape</span>
                <span className="collapse-icon">{activeSection === 'shield' ? '▼' : '▶'}</span>
              </h2>
              
              {activeSection === 'shield' && (
                <div className="shield-type-grid">
                  {SHIELD_TYPES.map(shield => (
                    <button
                      key={shield.id}
                      className={`shield-type-option ${shieldType === shield.id ? 'selected' : ''}`}
                      onClick={() => setShieldType(shield.id)}
                    >
                      <span className="shield-icon">{shield.icon}</span>
                      <span className="shield-name">{shield.name}</span>
                      <span className="shield-desc">{shield.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </section>
            
            {/* Classification */}
            <section className="design-section">
              <h2 
                className={`section-title collapsible ${activeSection === 'classification' ? 'active' : ''}`}
                onClick={() => setActiveSection(activeSection === 'classification' ? '' : 'classification')}
              >
                <span>Classification</span>
                <span className="collapse-icon">{activeSection === 'classification' ? '▼' : '▶'}</span>
              </h2>
              
              {activeSection === 'classification' && (
                <>
                  <div className="form-group">
                    <label>Category</label>
                    <div className="category-grid">
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat.id}
                          className={`category-option ${category === cat.id ? 'selected' : ''}`}
                          onClick={() => setCategory(cat.id)}
                        >
                          <span>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="tags">Tags (comma-separated)</label>
                    <input
                      type="text"
                      id="tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="e.g., royal, ancient, cadet branch"
                      className="text-input"
                    />
                  </div>
                </>
              )}
            </section>
            
            {/* House Linking */}
            <section className="design-section">
              <h2 
                className={`section-title collapsible ${activeSection === 'linking' ? 'active' : ''}`}
                onClick={() => setActiveSection(activeSection === 'linking' ? '' : 'linking')}
              >
                <span>Link to House</span>
                <span className="collapse-icon">{activeSection === 'linking' ? '▼' : '▶'}</span>
              </h2>
              
              {activeSection === 'linking' && (
                <div className="form-group">
                  <label htmlFor="house">Assign to House (optional)</label>
                  <select
                    id="house"
                    value={linkedHouseId}
                    onChange={(e) => setLinkedHouseId(e.target.value)}
                    className="select-input"
                  >
                    <option value="">-- No house linked --</option>
                    {houses.map(house => (
                      <option key={house.id} value={house.id}>
                        {house.houseName}
                        {house.heraldryId ? ' (has heraldry)' : ''}
                      </option>
                    ))}
                  </select>
                  <p className="help-text">
                    Linking this heraldry will update the house's coat of arms.
                  </p>
                </div>
              )}
            </section>
            
            {/* Actions */}
            <div className="action-bar">
              <button className="action-button secondary" onClick={() => navigate('/heraldry')}>
                Cancel
              </button>
              <button 
                className="action-button primary"
                onClick={handleSave}
                disabled={saving || !name.trim()}
              >
                {saving ? '💾 Saving...' : isEditMode ? '💾 Update Heraldry' : '💾 Save Heraldry'}
              </button>
            </div>
            
          </main>
        </div>
      </div>
    </>
  );
}

export default HeraldryCreator;
