/**
 * Birth Order Utilities for Personal Arms & Cadency
 * 
 * This utility calculates a person's birth order among their legitimate siblings,
 * which is used to determine cadency marks for personal heraldry.
 * 
 * WHAT IS CADENCY?
 * In heraldry, cadency is a system of marking arms to distinguish between 
 * members of the same family. Traditionally, each son would add a small mark
 * to their father's arms to show their birth order.
 * 
 * LINEAGEWEAVER'S APPROACH:
 * Rather than traditional cadency marks (label, crescent, mullet, etc.),
 * we use a simpler visual system:
 * - Small black triangles pointing down from the top of the shield
 * - Number of triangles = birth position among legitimate sons
 * - 1st son = 1 triangle, 2nd son = 2 triangles, etc.
 * 
 * SCOPE:
 * - Only counts LEGITIMATE SONS (traditional approach)
 * - Bastards are excluded from the count
 * - Adopted children are excluded from the count
 * - Daughters are excluded (historically, daughters didn't bear differenced arms)
 */

/**
 * Calculate a person's birth order among their legitimate male siblings
 * 
 * @param {Object} person - The person to calculate birth order for
 * @param {Array} allPeople - Array of all people in the database
 * @param {Array} allRelationships - Array of all relationships
 * @returns {Object} Birth order information
 * 
 * RETURNS:
 * {
 *   position: number | null,     // 1 = first son, 2 = second son, etc. (null if not applicable)
 *   totalLegitimateSons: number, // Total count of legitimate sons from same parents
 *   isEligible: boolean,         // Whether this person can have cadency marks
 *   reason: string | null,       // Why not eligible (if applicable)
 *   siblings: Array              // List of legitimate male siblings in birth order
 * }
 */
export function calculateBirthOrder(person, allPeople, allRelationships) {
  // Default result for ineligible cases
  const ineligibleResult = (reason) => ({
    position: null,
    totalLegitimateSons: 0,
    isEligible: false,
    reason,
    siblings: []
  });

  // Validation checks
  if (!person) {
    return ineligibleResult('No person provided');
  }

  // Must be male to receive cadency marks (traditional rule)
  if (person.gender !== 'male') {
    return ineligibleResult('Cadency marks traditionally apply only to male heirs');
  }

  // Must be legitimate (bastards and adopted don't use cadency)
  const legitimacyStatus = person.legitimacyStatus || 'legitimate';
  if (legitimacyStatus === 'bastard') {
    return ineligibleResult('Bastards do not bear differenced arms of their father\'s house');
  }
  if (legitimacyStatus === 'adopted') {
    return ineligibleResult('Adopted children do not bear differenced arms through cadency');
  }

  // Find this person's parents (biological parents via 'parent' relationship)
  const parentRelationships = allRelationships.filter(rel => 
    rel.relationshipType === 'parent' && 
    rel.person2Id === person.id
  );

  if (parentRelationships.length === 0) {
    return ineligibleResult('No parents recorded - cannot determine birth order');
  }

  // Get parent IDs
  const parentIds = parentRelationships.map(rel => rel.person1Id);

  // Find all children of these parents
  // A child must share at least one parent to be considered a sibling
  const siblingRelationships = allRelationships.filter(rel => 
    rel.relationshipType === 'parent' && 
    parentIds.includes(rel.person1Id)
  );

  // Get unique child IDs (siblings including the person themselves)
  const childIds = [...new Set(siblingRelationships.map(rel => rel.person2Id))];

  // Get the actual sibling people objects
  const siblings = childIds
    .map(id => allPeople.find(p => p.id === id))
    .filter(Boolean);

  // Filter to only LEGITIMATE MALE siblings
  const legitimateMaleSiblings = siblings.filter(sibling => {
    // Must be male
    if (sibling.gender !== 'male') return false;
    
    // Must be legitimate (not bastard, not adopted)
    const status = sibling.legitimacyStatus || 'legitimate';
    if (status === 'bastard' || status === 'adopted') return false;
    
    return true;
  });

  // Sort by birth date (oldest first)
  // If no birth date, they go to the end (unknown position)
  legitimateMaleSiblings.sort((a, b) => {
    const dateA = parseBirthYear(a.dateOfBirth);
    const dateB = parseBirthYear(b.dateOfBirth);
    
    // Both have dates - compare them
    if (dateA !== null && dateB !== null) {
      return dateA - dateB;
    }
    
    // Only A has date - A comes first
    if (dateA !== null) return -1;
    
    // Only B has date - B comes first
    if (dateB !== null) return 1;
    
    // Neither has date - maintain original order (by ID as fallback)
    return (a.id || 0) - (b.id || 0);
  });

  // Find this person's position in the sorted list
  const position = legitimateMaleSiblings.findIndex(s => s.id === person.id) + 1;

  if (position === 0) {
    // Person wasn't found in the list - shouldn't happen if they passed earlier checks
    return ineligibleResult('Could not determine position among siblings');
  }

  return {
    position,
    totalLegitimateSons: legitimateMaleSiblings.length,
    isEligible: true,
    reason: null,
    siblings: legitimateMaleSiblings.map(s => ({
      id: s.id,
      firstName: s.firstName,
      lastName: s.lastName,
      dateOfBirth: s.dateOfBirth,
      isSelf: s.id === person.id
    }))
  };
}

/**
 * Parse a birth year from various date formats
 * 
 * Handles:
 * - "1250" (year only)
 * - "1250-03-15" (ISO date)
 * - "1250-03" (year-month)
 * 
 * @param {string|null} dateOfBirth - The date string to parse
 * @returns {number|null} The year as a number, or null if unparseable
 */
export function parseBirthYear(dateOfBirth) {
  if (!dateOfBirth) return null;
  
  // If it's just a number, return it
  const yearOnly = parseInt(dateOfBirth);
  if (!isNaN(yearOnly) && String(yearOnly) === String(dateOfBirth).trim()) {
    return yearOnly;
  }
  
  // Try to extract year from ISO format (YYYY-MM-DD or YYYY-MM)
  const match = String(dateOfBirth).match(/^(\d{4})/);
  if (match) {
    return parseInt(match[1]);
  }
  
  return null;
}

/**
 * Get the number of cadency triangles for a given birth position
 * 
 * The heir (1st legitimate son) traditionally would not have a mark,
 * but in our system we still show 1 triangle for visual consistency.
 * 
 * @param {number} position - Birth order position (1, 2, 3, etc.)
 * @returns {number} Number of triangles to display
 */
export function getCadencyTriangleCount(position) {
  if (!position || position < 1) return 0;
  return position;
}

/**
 * Generate a descriptive label for the birth position
 * 
 * @param {number} position - Birth order position
 * @returns {string} Human-readable label
 * 
 * Examples:
 * - 1 → "1st Son (Heir)"
 * - 2 → "2nd Son"
 * - 3 → "3rd Son"
 * - 4 → "4th Son"
 */
export function getBirthOrderLabel(position) {
  if (!position || position < 1) return 'Unknown';
  
  const suffix = getOrdinalSuffix(position);
  const isHeir = position === 1;
  
  return `${position}${suffix} Son${isHeir ? ' (Heir)' : ''}`;
}

/**
 * Get the ordinal suffix for a number
 * 
 * @param {number} n - The number
 * @returns {string} The suffix (st, nd, rd, th)
 */
export function getOrdinalSuffix(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

/**
 * Check if a person is eligible for personal arms with cadency
 * 
 * Quick check without full calculation - useful for UI filtering
 * 
 * @param {Object} person - The person to check
 * @returns {boolean} True if potentially eligible
 */
export function isEligibleForCadency(person) {
  if (!person) return false;
  if (person.gender !== 'male') return false;
  
  const status = person.legitimacyStatus || 'legitimate';
  if (status === 'bastard' || status === 'adopted') return false;
  
  return true;
}

/**
 * Generate SVG path data for cadency triangles
 * 
 * Creates small downward-pointing triangles along the top of a French shield.
 * The triangles are evenly spaced and sized appropriately for the shield.
 * 
 * @param {number} count - Number of triangles (1-9)
 * @param {number} shieldWidth - Width of the shield (default 200 for standard display)
 * @param {Object} options - Optional customization
 * @returns {Array} Array of triangle objects with x, y coordinates and path data
 * 
 * Each triangle object:
 * {
 *   x: number,      // Center X position
 *   y: number,      // Top Y position
 *   path: string,   // SVG path data
 *   size: number    // Triangle size
 * }
 */
export function generateCadencyTriangles(count, shieldWidth = 200, options = {}) {
  if (!count || count < 1 || count > 9) return [];
  
  const {
    triangleSize = 12,      // Size of each triangle
    topMargin = 8,          // Distance from top of shield
    fillColor = '#1a1410',  // Sable (black) - traditional for cadency
    strokeColor = '#e9dcc9', // Light outline for visibility
    strokeWidth = 0.5
  } = options;

  // Calculate spacing based on shield width and number of triangles
  // French shield is wider at top, so we use most of the width
  const usableWidth = shieldWidth * 0.7;  // Use 70% of shield width
  const startX = (shieldWidth - usableWidth) / 2 + (usableWidth / (count + 1));
  const spacing = usableWidth / (count + 1);
  
  const triangles = [];
  
  for (let i = 0; i < count; i++) {
    const centerX = startX + (spacing * i);
    const topY = topMargin;
    const bottomY = topY + triangleSize;
    const halfWidth = triangleSize * 0.6;  // Slightly narrower than tall
    
    // Downward-pointing triangle path
    const path = `M ${centerX} ${bottomY} L ${centerX - halfWidth} ${topY} L ${centerX + halfWidth} ${topY} Z`;
    
    triangles.push({
      x: centerX,
      y: topY,
      path,
      size: triangleSize,
      fillColor,
      strokeColor,
      strokeWidth
    });
  }
  
  return triangles;
}

/**
 * Generate complete SVG markup for cadency triangles overlay
 * 
 * This creates a standalone SVG element that can be layered over house arms
 * to show the cadency marks.
 * 
 * @param {number} count - Number of triangles
 * @param {number} width - SVG width
 * @param {number} height - SVG height
 * @param {Object} options - Customization options
 * @returns {string} Complete SVG markup
 */
export function generateCadencySVG(count, width = 200, height = 240, options = {}) {
  if (!count || count < 1) return '';
  
  const triangles = generateCadencyTriangles(count, width, options);
  
  if (triangles.length === 0) return '';
  
  const trianglePaths = triangles.map(t => 
    `<path d="${t.path}" fill="${t.fillColor}" stroke="${t.strokeColor}" stroke-width="${t.strokeWidth}"/>`
  ).join('\n    ');
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <g class="cadency-marks">
    ${trianglePaths}
  </g>
</svg>`;
}

/**
 * Get a summary of cadency information for display
 * 
 * @param {Object} birthOrderResult - Result from calculateBirthOrder()
 * @returns {Object} Display-ready summary
 */
export function getCadencySummary(birthOrderResult) {
  if (!birthOrderResult || !birthOrderResult.isEligible) {
    return {
      eligible: false,
      label: birthOrderResult?.reason || 'Not eligible for cadency',
      triangles: 0,
      description: null
    };
  }
  
  const { position, totalLegitimateSons } = birthOrderResult;
  
  return {
    eligible: true,
    label: getBirthOrderLabel(position),
    triangles: getCadencyTriangleCount(position),
    description: totalLegitimateSons > 1 
      ? `${position} of ${totalLegitimateSons} legitimate sons`
      : 'Only legitimate son',
    isHeir: position === 1
  };
}

export default {
  calculateBirthOrder,
  parseBirthYear,
  getCadencyTriangleCount,
  getBirthOrderLabel,
  getOrdinalSuffix,
  isEligibleForCadency,
  generateCadencyTriangles,
  generateCadencySVG,
  getCadencySummary
};
