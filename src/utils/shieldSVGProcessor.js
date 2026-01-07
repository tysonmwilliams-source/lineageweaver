/**
 * Shield SVG Processor - FIXED VERSION
 * 
 * Loads and processes professional shield SVG files from /public/shields/
 * Properly scales and positions heraldic content to fit shield bounds
 * Supports infinite zoom quality through vector graphics
 */

// Shield SVG file paths (in /public/shields/)
const SHIELD_FILES = {
  heater: '/shields/heater.svg',
  french: '/shields/french.svg',
  spanish: '/shields/spanish.svg',
  english: '/shields/english.svg',
  swiss: '/shields/swiss.svg'
};

// Cache loaded SVGs to avoid repeated fetches
const svgCache = {};

/**
 * Load shield SVG file and extract path data + bounds
 * 
 * @param {string} shieldType - One of: heater, french, spanish, english, swiss
 * @returns {Promise<Object>} Shield data with pathData, bounds, and full SVG
 */
export async function loadShieldSVG(shieldType) {
  // Return cached version if available
  if (svgCache[shieldType]) {
    return svgCache[shieldType];
  }
  
  try {
    const response = await fetch(SHIELD_FILES[shieldType]);
    
    if (!response.ok) {
      throw new Error(`Failed to load ${shieldType} shield: ${response.statusText}`);
    }
    
    const svgText = await response.text();
    
    // Parse SVG to extract path data
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    
    // Get the main path element (the shield outline)
    const pathElements = svgDoc.querySelectorAll('path');
    
    // Find the path with actual fill (not clipPath)
    let mainPath = null;
    for (const path of pathElements) {
      const fill = path.getAttribute('fill');
      const stroke = path.getAttribute('stroke');
      const parent = path.parentElement;
      
      // Skip paths inside clipPath or defs
      if (parent.tagName === 'clipPath' || parent.tagName === 'defs') {
        continue;
      }
      
      // Found the main shield path if it has:
      // - A fill that's not 'none' OR
      // - A stroke (for shields that are outline-only)
      if ((fill && fill !== 'none') || stroke) {
        mainPath = path;
        break;
      }
    }
    
    if (!mainPath) {
      throw new Error(`Could not find main path in ${shieldType} shield SVG`);
    }
    
    const pathData = mainPath.getAttribute('d');
    const svgElement = svgDoc.querySelector('svg');
    const viewBox = svgElement.getAttribute('viewBox');
    
    // Parse viewBox to get bounds
    const [vbX, vbY, vbWidth, vbHeight] = viewBox.split(' ').map(Number);
    
    // Get actual shield path bounds (for precise fitting)
    const bounds = getPathBounds(mainPath);
    
    // Cache the result
    svgCache[shieldType] = {
      svgText: svgText,
      pathData: pathData,
      viewBox: viewBox,
      viewBoxParsed: { x: vbX, y: vbY, width: vbWidth, height: vbHeight },
      bounds: bounds,
      originalSVG: svgElement.outerHTML
    };
    
    return svgCache[shieldType];
    
  } catch (error) {
    console.error(`Error loading shield SVG (${shieldType}):`, error);
    throw error;
  }
}

/**
 * Get bounding box of SVG path
 * Uses the browser's SVGPathElement.getBBox() if available
 * 
 * @param {SVGPathElement} pathElement - The path element
 * @returns {Object} Bounds with x, y, width, height
 */
function getPathBounds(pathElement) {
  try {
    // Create a temporary SVG to get accurate bounds
    const tempSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    tempSvg.style.position = 'absolute';
    tempSvg.style.visibility = 'hidden';
    document.body.appendChild(tempSvg);
    
    const clonedPath = pathElement.cloneNode(true);
    tempSvg.appendChild(clonedPath);
    
    const bbox = clonedPath.getBBox();
    
    document.body.removeChild(tempSvg);
    
    return {
      x: bbox.x,
      y: bbox.y,
      width: bbox.width,
      height: bbox.height
    };
  } catch (error) {
    console.error('Error getting path bounds:', error);
    // Fallback: parse from viewBox
    return null;
  }
}

/**
 * Create SVG heraldry with shield mask applied
 * Properly scales heraldic content to fit shield bounds
 * 
 * @param {string} sourceImageSVG - SVG content to be masked (should have viewBox="0 0 200 200")
 * @param {string} shieldType - Shield shape to use as mask
 * @param {number} size - Output size (default 400)
 * @returns {Promise<string>} Complete SVG with shield mask applied and properly scaled
 */
export async function createSVGHeraldryWithMask(sourceImageSVG, shieldType, size = 400) {
  const shield = await loadShieldSVG(shieldType);
  
  // Parse source SVG to extract content
  const parser = new DOMParser();
  const sourceDoc = parser.parseFromString(sourceImageSVG, 'image/svg+xml');
  const sourceRoot = sourceDoc.documentElement;
  
  // Get source viewBox (should be "0 0 200 200" from our generators)
  const sourceViewBox = sourceRoot.getAttribute('viewBox') || '0 0 200 200';
  const [srcX, srcY, srcWidth, srcHeight] = sourceViewBox.split(' ').map(Number);
  
  // Use shield bounds for precise fitting
  const targetBounds = shield.bounds || shield.viewBoxParsed;
  
  // Calculate transform to scale source content to fit shield bounds
  const scaleX = targetBounds.width / srcWidth;
  const scaleY = targetBounds.height / srcHeight;
  const translateX = targetBounds.x - (srcX * scaleX);
  const translateY = targetBounds.y - (srcY * scaleY);
  
  // Extract all content from source SVG (skip the svg wrapper itself)
  let sourceContent = '';
  for (let i = 0; i < sourceRoot.children.length; i++) {
    sourceContent += sourceRoot.children[i].outerHTML;
  }
  
  // Create unique ID for this mask to avoid conflicts
  const maskId = `shield-mask-${Date.now()}`;
  
  // Create masked SVG with properly transformed content
  const maskedSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="${shield.viewBox}" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style="max-width: 100%; max-height: 100%;">
  <defs>
    <clipPath id="${maskId}">
      <path d="${shield.pathData}" />
    </clipPath>
  </defs>
  <g clip-path="url(#${maskId})">
    <g transform="translate(${translateX}, ${translateY}) scale(${scaleX}, ${scaleY})">
      ${sourceContent}
    </g>
  </g>
  <path d="${shield.pathData}" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
  
  console.log(`🎯 Shield transform: translate(${translateX.toFixed(1)}, ${translateY.toFixed(1)}) scale(${scaleX.toFixed(2)}, ${scaleY.toFixed(2)})`);
  
  return maskedSVG;
}

/**
 * Get shield path data only (for canvas-based masking)
 * 
 * @param {string} shieldType - Shield type
 * @returns {Promise<string>} SVG path data string
 */
export async function getShieldPathData(shieldType) {
  const shield = await loadShieldSVG(shieldType);
  return shield.pathData;
}

/**
 * Get shield viewBox dimensions
 * 
 * @param {string} shieldType - Shield type
 * @returns {Promise<Object>} Object with x, y, width, height
 */
export async function getShieldViewBox(shieldType) {
  const shield = await loadShieldSVG(shieldType);
  return shield.viewBoxParsed;
}

/**
 * Preload all shield SVGs (call this on app initialization)
 * 
 * @returns {Promise<void>}
 */
export async function preloadAllShields() {
  const types = Object.keys(SHIELD_FILES);
  
  try {
    await Promise.all(types.map(type => loadShieldSVG(type)));
    console.log('✅ All shield SVGs preloaded successfully');
  } catch (error) {
    console.error('❌ Error preloading shields:', error);
  }
}

export default {
  loadShieldSVG,
  createSVGHeraldryWithMask,
  getShieldPathData,
  getShieldViewBox,
  preloadAllShields
};
