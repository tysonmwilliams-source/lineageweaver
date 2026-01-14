/**
 * Bastard Naming Utilities
 * 
 * In this world, bastards of noble houses carry the "Dun-" prefix before their
 * parent house's name. This mark stays with them for life, even if they later
 * found their own cadet house (which would be "Dun-" + their chosen name).
 * 
 * Examples:
 * - Bastard of House Wilfrey → "Dunwilfrey"
 * - Bastard of House Forpine → "Dunforpine"
 * - Bastard of House Salomon → "Dunsalomon"
 * 
 * Rules:
 * - Only noble bastards (those with a houseId) get the Dun- prefix
 * - Commoner bastards (no houseId) keep their common surname
 * - The Dun- prefix is permanent - even founding a house keeps it
 * - Marriage can change surname, but maidenName preserves the Dun- origin
 * 
 * @module bastardNaming
 */

/**
 * The universal bastard prefix used in this world
 */
export const BASTARD_PREFIX = 'Dun';

/**
 * Extract the core house name from a full house name string.
 * Handles formats like "House Wilfrey of Blackmount" → "Wilfrey"
 * 
 * @param {string} houseName - Full house name (e.g., "House Wilfrey of Blackmount")
 * @returns {string} Core house name (e.g., "Wilfrey")
 */
export function extractCoreHouseName(houseName) {
  if (!houseName) return '';
  
  let name = houseName.trim();
  
  // Remove "House " prefix if present (case-insensitive)
  if (name.toLowerCase().startsWith('house ')) {
    name = name.substring(6);
  }
  
  // Remove " of [Location]" suffix if present
  const ofIndex = name.toLowerCase().indexOf(' of ');
  if (ofIndex !== -1) {
    name = name.substring(0, ofIndex);
  }
  
  return name.trim();
}

/**
 * Generate the bastard surname from a house name.
 * Adds the "Dun-" prefix to the core house name.
 * 
 * @param {string} houseName - House name (can be full or core)
 * @returns {string} Bastard surname (e.g., "Dunwilfrey")
 * 
 * @example
 * generateDunSurname("House Wilfrey of Blackmount") // → "Dunwilfrey"
 * generateDunSurname("Forpine") // → "Dunforpine"
 */
export function generateDunSurname(houseName) {
  const coreName = extractCoreHouseName(houseName);
  if (!coreName) return '';
  
  // Combine prefix with lowercase core name
  // "Dun" + "wilfrey" = "Dunwilfrey"
  return BASTARD_PREFIX + coreName.toLowerCase();
}

/**
 * Check if a surname follows the Dun- bastard convention.
 * 
 * @param {string} surname - Surname to check
 * @returns {boolean} True if surname starts with "Dun"
 * 
 * @example
 * isValidDunSurname("Dunwilfrey") // → true
 * isValidDunSurname("Wilfrey") // → false
 * isValidDunSurname("Duncan") // → true (edge case - real name)
 */
export function isValidDunSurname(surname) {
  if (!surname) return false;
  return surname.startsWith(BASTARD_PREFIX);
}

/**
 * Extract the house name component from a Dun- surname.
 * 
 * @param {string} dunSurname - A Dun- prefixed surname
 * @returns {string|null} The house name portion, or null if not a Dun- name
 * 
 * @example
 * extractHouseFromDunSurname("Dunwilfrey") // → "wilfrey"
 * extractHouseFromDunSurname("Dunforpine") // → "forpine"
 * extractHouseFromDunSurname("Wilfrey") // → null
 */
export function extractHouseFromDunSurname(dunSurname) {
  if (!isValidDunSurname(dunSurname)) return null;
  return dunSurname.substring(BASTARD_PREFIX.length);
}

/**
 * Check if a person should have a Dun- surname based on their data.
 * A person should have a Dun- surname if:
 * - They are marked as a bastard (legitimacyStatus === 'bastard')
 * - They belong to a noble house (houseId is not null)
 * 
 * @param {Object} person - Person object
 * @param {string} person.legitimacyStatus - Legitimacy status
 * @param {number|null} person.houseId - House ID (null for commoners)
 * @returns {boolean} True if person should have Dun- surname
 */
export function shouldHaveDunSurname(person) {
  if (!person) return false;
  return person.legitimacyStatus === 'bastard' && person.houseId != null;
}

/**
 * Validate a person's surname against their bastard status.
 * Returns validation result with details.
 * 
 * @param {Object} person - Person object with lastName, legitimacyStatus, houseId
 * @param {Object} house - House object with houseName
 * @returns {Object} Validation result
 * @returns {boolean} result.isValid - Whether surname is correct
 * @returns {string} result.message - Human-readable message
 * @returns {string|null} result.suggestedSurname - Suggested fix if invalid
 */
export function validateBastardSurname(person, house) {
  if (!person) {
    return { isValid: true, message: '', suggestedSurname: null };
  }
  
  const needsDunSurname = shouldHaveDunSurname(person);
  const hasDunSurname = isValidDunSurname(person.lastName);
  
  // Not a noble bastard - any surname is fine
  if (!needsDunSurname) {
    return { 
      isValid: true, 
      message: '', 
      suggestedSurname: null 
    };
  }
  
  // Noble bastard with correct Dun- surname
  if (hasDunSurname) {
    return { 
      isValid: true, 
      message: 'Surname follows bastard naming convention', 
      suggestedSurname: null 
    };
  }
  
  // Noble bastard without Dun- surname - needs fixing
  const suggestedSurname = house ? generateDunSurname(house.houseName) : null;
  
  return {
    isValid: false,
    message: `Noble bastards should have the "${BASTARD_PREFIX}-" prefix in their surname`,
    suggestedSurname
  };
}

/**
 * Generate a cadet house name from a parent house.
 * 
 * For NOBLE cadets: First 4 letters + suffix
 * For BASTARD cadets: "Dun" + first 4 letters + suffix
 * 
 * @param {string} parentHouseName - Parent house name
 * @param {string} suffix - Chosen suffix (e.g., "ford", "mere", "hall")
 * @param {boolean} isBastardFounder - Whether founder is a bastard
 * @returns {string} New house name
 * 
 * @example
 * generateCadetHouseName("Wilfrey", "ford", false) // → "Wilfford"
 * generateCadetHouseName("Wilfrey", "ford", true)  // → "Dunwilfford"
 */
export function generateCadetHouseName(parentHouseName, suffix, isBastardFounder = false) {
  const coreName = extractCoreHouseName(parentHouseName);
  if (!coreName || !suffix) return '';
  
  // Get first 4 letters (or full name if shorter)
  const root = coreName.substring(0, 4).toLowerCase();
  const cleanSuffix = suffix.toLowerCase().trim();
  
  if (isBastardFounder) {
    // Bastard-founded house: Dun + root + suffix
    return BASTARD_PREFIX + root + cleanSuffix;
  } else {
    // Noble cadet house: Root + suffix (capitalize first letter)
    const combined = root + cleanSuffix;
    return combined.charAt(0).toUpperCase() + combined.slice(1);
  }
}

/**
 * Suggested suffixes for cadet house names.
 * These are common medieval place-name endings.
 */
export const CADET_SUFFIXES = [
  'ford',   // river crossing
  'mere',   // lake/pond
  'vale',   // valley
  'holm',   // island/water meadow
  'wick',   // settlement
  'stead',  // place/farm
  'hall',   // manor house
  'mount',  // hill/mountain
  'brook',  // stream
  'wood',   // forest
  'stone',  // rocky place
  'garde',  // protected place
  'haven',  // safe harbour
  'crest',  // hilltop
  'hearth', // home/fireplace
  'moor',   // highland
  'dell',   // small valley
  'hollow', // depression
];

/**
 * Generate cadet house name suggestions.
 * 
 * @param {string} parentHouseName - Parent house name
 * @param {boolean} isBastardFounder - Whether founder is a bastard
 * @param {number} count - Number of suggestions to return
 * @returns {string[]} Array of suggested house names
 */
export function generateCadetNameSuggestions(parentHouseName, isBastardFounder = false, count = 6) {
  const suggestions = [];
  const shuffled = [...CADET_SUFFIXES].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    suggestions.push(generateCadetHouseName(parentHouseName, shuffled[i], isBastardFounder));
  }
  
  return suggestions;
}

/**
 * Audit a list of people for bastard naming compliance.
 * Returns people who should have Dun- surnames but don't.
 * 
 * @param {Array} people - Array of person objects
 * @param {Array} houses - Array of house objects
 * @returns {Array} Array of objects with person and suggested fix
 */
export function auditBastardNames(people, houses) {
  const housesById = new Map(houses.map(h => [h.id, h]));
  const issues = [];
  
  people.forEach(person => {
    if (!shouldHaveDunSurname(person)) return;
    if (isValidDunSurname(person.lastName)) return;
    
    const house = housesById.get(person.houseId);
    const suggestedSurname = house ? generateDunSurname(house.houseName) : null;
    
    issues.push({
      person,
      house,
      currentSurname: person.lastName,
      suggestedSurname,
      fullName: `${person.firstName} ${person.lastName}`,
      suggestedFullName: suggestedSurname 
        ? `${person.firstName} ${suggestedSurname}`
        : null
    });
  });
  
  return issues;
}
