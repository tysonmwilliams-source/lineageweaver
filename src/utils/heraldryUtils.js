/**
 * HERALDRY IMAGE PROCESSING UTILITIES
 * 
 * This file contains all the image processing functions needed for the heraldry system.
 * These utilities ensure ALL images (from any source) conform to Lineageweaver's standards.
 * 
 * Location: src/utils/heraldryUtils.js
 */

/**
 * Shield SVG mask templates
 * These define the shapes that all heraldry images will be clipped to
 */
export const SHIELD_MASKS = {
  heater: `
    M 100 0
    L 180 0
    L 180 140
    L 140 200
    L 100 200
    L 60 200
    L 20 140
    L 20 0
    Z
  `,
  
  french: `
    M 100 0
    L 180 0
    L 180 120
    Q 180 160, 140 180
    Q 100 200, 60 180
    Q 20 160, 20 120
    L 20 0
    Z
  `,
  
  spanish: `
    M 100 0
    L 170 0
    L 180 10
    L 180 140
    Q 180 180, 100 200
    Q 20 180, 20 140
    L 20 10
    L 30 0
    Z
  `,
  
  english: `
    M 80 0
    Q 90 20, 100 20
    Q 110 20, 120 0
    L 180 0
    L 180 140
    L 140 200
    L 100 200
    L 60 200
    L 20 140
    L 20 0
    Z
  `,
  
  swiss: `
    M 100 0
    Q 60 20, 20 0
    L 20 140
    L 60 200
    L 100 200
    L 140 200
    L 180 140
    L 180 0
    Q 140 20, 100 0
    Z
  `
};

/**
 * Image size constants
 */
export const IMAGE_SIZES = {
  THUMBNAIL: 40,
  DISPLAY: 200,
  HIGH_RES: 400,
  MAX_FILE_SIZE_KB: 100,
  MAX_UPLOAD_SIZE_MB: 5
};

/**
 * Convert a File or Blob to base64 data URL
 */
export async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Convert base64 data URL to Image element
 */
export function base64ToImage(base64) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = base64;
  });
}

/**
 * Resize image to specified dimensions while maintaining aspect ratio
 * Centers the image and crops to fit
 */
export function resizeImage(img, targetSize) {
  const canvas = document.createElement('canvas');
  canvas.width = targetSize;
  canvas.height = targetSize;
  const ctx = canvas.getContext('2d');
  
  // Calculate dimensions to fill the canvas (cover, not contain)
  const scale = Math.max(
    targetSize / img.width,
    targetSize / img.height
  );
  
  const scaledWidth = img.width * scale;
  const scaledHeight = img.height * scale;
  
  // Center the image
  const x = (targetSize - scaledWidth) / 2;
  const y = (targetSize - scaledHeight) / 2;
  
  ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
  
  return canvas;
}

/**
 * Apply shield mask to canvas
 * Creates an SVG mask and clips the image to the shield shape
 */
export function applyShieldMask(canvas, shieldType = 'heater') {
  const size = canvas.width;
  const maskedCanvas = document.createElement('canvas');
  maskedCanvas.width = size;
  maskedCanvas.height = size;
  const ctx = maskedCanvas.getContext('2d');
  
  // Scale shield path to canvas size
  const scale = size / 200; // Shield paths are designed for 200x200
  const path = SHIELD_MASKS[shieldType] || SHIELD_MASKS.heater;
  
  // Create path from SVG
  const path2D = new Path2D(
    path.replace(/(\d+)/g, (match) => parseInt(match) * scale)
  );
  
  // Fill with shield shape as clipping mask
  ctx.save();
  ctx.clip(path2D);
  ctx.drawImage(canvas, 0, 0);
  ctx.restore();
  
  return maskedCanvas;
}

/**
 * Compress canvas to meet target file size
 * Iteratively reduces quality until under target
 */
export async function compressCanvas(canvas, targetSizeKB = 100) {
  let quality = 0.95;
  let blob;
  let dataUrl;
  
  do {
    dataUrl = canvas.toDataURL('image/png', quality);
    // Rough estimate: base64 is ~1.37x the binary size
    const sizeKB = (dataUrl.length * 0.75) / 1024;
    
    if (sizeKB <= targetSizeKB) {
      return dataUrl;
    }
    
    quality -= 0.05;
  } while (quality > 0.3);
  
  // If still too large, return best effort
  return dataUrl;
}

/**
 * MAIN PROCESSING PIPELINE
 * This is the function that ensures ALL images conform to Lineageweaver standards
 * 
 * @param {File|Blob|string} input - Image file, blob, or base64 string
 * @param {string} shieldType - Shield shape to apply
 * @returns {Object} - { display, thumbnail, highRes } all as base64
 */
export async function processHeraldryImage(input, shieldType = 'heater') {
  try {
    // Step 1: Convert input to base64 if needed
    let base64;
    if (typeof input === 'string') {
      base64 = input; // Already base64
    } else {
      base64 = await fileToBase64(input);
    }
    
    // Step 2: Load as Image element
    const img = await base64ToImage(base64);
    
    // Step 3: Resize to high-res working size (400x400)
    const highResCanvas = resizeImage(img, IMAGE_SIZES.HIGH_RES);
    
    // Step 4: Apply shield mask to high-res version
    const maskedHighRes = applyShieldMask(highResCanvas, shieldType);
    
    // Step 5: Create display version (200x200)
    const displayCanvas = document.createElement('canvas');
    displayCanvas.width = IMAGE_SIZES.DISPLAY;
    displayCanvas.height = IMAGE_SIZES.DISPLAY;
    const displayCtx = displayCanvas.getContext('2d');
    displayCtx.drawImage(maskedHighRes, 0, 0, IMAGE_SIZES.DISPLAY, IMAGE_SIZES.DISPLAY);
    
    // Step 6: Create thumbnail (40x40)
    const thumbnailCanvas = document.createElement('canvas');
    thumbnailCanvas.width = IMAGE_SIZES.THUMBNAIL;
    thumbnailCanvas.height = IMAGE_SIZES.THUMBNAIL;
    const thumbnailCtx = thumbnailCanvas.getContext('2d');
    thumbnailCtx.drawImage(maskedHighRes, 0, 0, IMAGE_SIZES.THUMBNAIL, IMAGE_SIZES.THUMBNAIL);
    
    // Step 7: Compress display version to target size
    const compressedDisplay = await compressCanvas(displayCanvas, IMAGE_SIZES.MAX_FILE_SIZE_KB);
    
    // Step 8: Convert all versions to base64
    const result = {
      display: compressedDisplay,
      thumbnail: thumbnailCanvas.toDataURL('image/png'),
      highRes: maskedHighRes.toDataURL('image/png')
    };
    
    console.log('✅ Heraldry image processed successfully');
    console.log('   Display size:', (result.display.length * 0.75 / 1024).toFixed(2), 'KB');
    console.log('   Shield type:', shieldType);
    
    return result;
    
  } catch (error) {
    console.error('❌ Error processing heraldry image:', error);
    throw error;
  }
}

/**
 * Validate uploaded file
 * Checks file size and type before processing
 */
export function validateHeraldryUpload(file) {
  const errors = [];
  
  // Check file size (max 5MB for upload)
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > IMAGE_SIZES.MAX_UPLOAD_SIZE_MB) {
    errors.push(`File too large (${sizeMB.toFixed(2)}MB). Maximum size is ${IMAGE_SIZES.MAX_UPLOAD_SIZE_MB}MB.`);
  }
  
  // Check file type
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    errors.push(`Invalid file type (${file.type}). Accepted types: PNG, JPG, WEBP`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Generate placeholder heraldry with house colors
 * Used as fallback when upload fails or is corrupted
 */
export function generatePlaceholderHeraldry(houseName, colorCode = '#8B4513', shieldType = 'heater') {
  const canvas = document.createElement('canvas');
  canvas.width = IMAGE_SIZES.HIGH_RES;
  canvas.height = IMAGE_SIZES.HIGH_RES;
  const ctx = canvas.getContext('2d');
  
  // Create shield path
  const scale = IMAGE_SIZES.HIGH_RES / 200;
  const path = SHIELD_MASKS[shieldType] || SHIELD_MASKS.heater;
  const path2D = new Path2D(
    path.replace(/(\d+)/g, (match) => parseInt(match) * scale)
  );
  
  // Fill shield with house color
  ctx.fillStyle = colorCode;
  ctx.fill(path2D);
  
  // Add border
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;
  ctx.stroke(path2D);
  
  // Add house initial in center
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 120px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const initial = houseName.charAt(0).toUpperCase();
  ctx.fillText(initial, IMAGE_SIZES.HIGH_RES / 2, IMAGE_SIZES.HIGH_RES / 2);
  
  return canvas.toDataURL('image/png');
}

/**
 * Create halved (impalement) composition
 * Combines two heraldries side-by-side
 */
export async function createHalvedHeraldry(leftBase64, rightBase64, shieldType = 'heater') {
  const canvas = document.createElement('canvas');
  canvas.width = IMAGE_SIZES.HIGH_RES;
  canvas.height = IMAGE_SIZES.HIGH_RES;
  const ctx = canvas.getContext('2d');
  
  // Load both images
  const leftImg = await base64ToImage(leftBase64);
  const rightImg = await base64ToImage(rightBase64);
  
  // Draw left half
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, IMAGE_SIZES.HIGH_RES / 2, IMAGE_SIZES.HIGH_RES);
  ctx.clip();
  ctx.drawImage(leftImg, 0, 0, IMAGE_SIZES.HIGH_RES, IMAGE_SIZES.HIGH_RES);
  ctx.restore();
  
  // Draw right half
  ctx.save();
  ctx.beginPath();
  ctx.rect(IMAGE_SIZES.HIGH_RES / 2, 0, IMAGE_SIZES.HIGH_RES / 2, IMAGE_SIZES.HIGH_RES);
  ctx.clip();
  ctx.drawImage(rightImg, 0, 0, IMAGE_SIZES.HIGH_RES, IMAGE_SIZES.HIGH_RES);
  ctx.restore();
  
  // Apply shield mask to final composition
  const masked = applyShieldMask(canvas, shieldType);
  
  return masked.toDataURL('image/png');
}

/**
 * Create quartered composition
 * Combines four heraldries in quadrants
 */
export async function createQuarteredHeraldry(
  q1Base64, 
  q2Base64, 
  q3Base64, 
  q4Base64, 
  shieldType = 'heater'
) {
  const canvas = document.createElement('canvas');
  canvas.width = IMAGE_SIZES.HIGH_RES;
  canvas.height = IMAGE_SIZES.HIGH_RES;
  const ctx = canvas.getContext('2d');
  
  const halfSize = IMAGE_SIZES.HIGH_RES / 2;
  
  // Load all images
  const q1Img = await base64ToImage(q1Base64);
  const q2Img = await base64ToImage(q2Base64);
  const q3Img = await base64ToImage(q3Base64);
  const q4Img = await base64ToImage(q4Base64);
  
  // Draw quadrants
  // Q1: Top-left
  ctx.drawImage(q1Img, 0, 0, halfSize, halfSize);
  
  // Q2: Top-right
  ctx.drawImage(q2Img, halfSize, 0, halfSize, halfSize);
  
  // Q3: Bottom-left
  ctx.drawImage(q3Img, 0, halfSize, halfSize, halfSize);
  
  // Q4: Bottom-right
  ctx.drawImage(q4Img, halfSize, halfSize, halfSize, halfSize);
  
  // Apply shield mask to final composition
  const masked = applyShieldMask(canvas, shieldType);
  
  return masked.toDataURL('image/png');
}

/**
 * Fetch heraldry from Armoria API
 * Free, no authentication required
 */
export async function generateArmoriaHeraldry(houseName, options = {}) {
  try {
    const seed = houseName.toLowerCase().replace(/\s+/g, '_');
    const size = options.size || IMAGE_SIZES.HIGH_RES;
    const format = 'png';
    
    const url = `https://armoria.herokuapp.com/?format=${format}&size=${size}&seed=${seed}`;
    
    console.log('🛡️ Generating Armoria heraldry for:', houseName);
    console.log('   Seed:', seed);
    console.log('   URL:', url);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Armoria API error: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    const base64 = await fileToBase64(blob);
    
    console.log('✅ Armoria heraldry generated successfully');
    
    return {
      base64,
      seed,
      source: 'armoria'
    };
    
  } catch (error) {
    console.error('❌ Armoria generation failed:', error);
    throw error;
  }
}

/**
 * Get shield type display name
 */
export function getShieldTypeName(type) {
  const names = {
    heater: 'Heater (Classic)',
    french: 'French (Ornate)',
    spanish: 'Spanish (Rounded)',
    english: 'English (Three-lobed)',
    swiss: 'Swiss (Curved Top)'
  };
  return names[type] || 'Unknown';
}

/**
 * Export heraldry as downloadable file
 */
export function downloadHeraldry(base64, houseName, quality = 'display') {
  const link = document.createElement('a');
  link.href = base64;
  link.download = `${houseName.toLowerCase().replace(/\s+/g, '_')}_heraldry_${quality}.png`;
  link.click();
}
