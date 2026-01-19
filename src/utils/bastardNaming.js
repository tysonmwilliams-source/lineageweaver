/**
 * Bastard Naming Utilities
 *
 * In this world, bastards of noble houses carry a prefix before their
 * parent house's name. The prefix indicates lineage:
 * - "Dun-" for bastards named after their father's house
 * - "Dum-" for bastards named after their mother's house
 *
 * This mark stays with them for life, even if they later found their own
 * cadet house (which would be "Dun/Dum-" + their chosen name).
 *
 * Examples:
 * - Bastard of House Wilfrey (father's line) → "Dunwilfrey"
 * - Bastard of House Forpine (mother's line) → "Dumforpine"
 * - Bastard of House Salomon (father's line) → "Dunsalomon"
 *
 * Rules:
 * - Only noble bastards (those with a houseId) get the prefix
 * - Commoner bastards (no houseId) keep their common surname
 * - The prefix is permanent - even founding a house keeps it
 * - Marriage can change surname, but maidenName preserves the origin
 * - Married women take their husband's name (not flagged by audit)
 *
 * @module bastardNaming
 */

/**
 * The bastard prefix for father's line
 */
export const BASTARD_PREFIX = 'Dun';

/**
 * The bastard prefix for mother's line
 */
export const BASTARD_PREFIX_MATERNAL = 'Dum';

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
 * Generate the bastard surname from a house name (father's line).
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
 * Generate the bastard surname from a house name (mother's line).
 * Adds the "Dum-" prefix to the core house name.
 *
 * @param {string} houseName - House name (can be full or core)
 * @returns {string} Bastard surname (e.g., "Dumwilfrey")
 *
 * @example
 * generateDumSurname("House Wilfrey of Blackmount") // → "Dumwilfrey"
 * generateDumSurname("Forpine") // → "Dumforpine"
 */
export function generateDumSurname(houseName) {
  const coreName = extractCoreHouseName(houseName);
  if (!coreName) return '';

  // Combine maternal prefix with lowercase core name
  // "Dum" + "wilfrey" = "Dumwilfrey"
  return BASTARD_PREFIX_MATERNAL + coreName.toLowerCase();
}

/**
 * Check if a surname follows the bastard naming convention.
 * Accepts either "Dun-" (father's line) or "Dum-" (mother's line) prefix.
 *
 * @param {string} surname - Surname to check
 * @returns {boolean} True if surname starts with "Dun" or "Dum"
 *
 * @example
 * isValidDunSurname("Dunwilfrey") // → true (father's line)
 * isValidDunSurname("Dumforpine") // → true (mother's line)
 * isValidDunSurname("Wilfrey") // → false
 * isValidDunSurname("Duncan") // → true (edge case - real name)
 */
export function isValidDunSurname(surname) {
  if (!surname) return false;
  return surname.startsWith(BASTARD_PREFIX) || surname.startsWith(BASTARD_PREFIX_MATERNAL);
}

/**
 * Extract the house name component from a bastard surname.
 *
 * @param {string} dunSurname - A Dun- or Dum- prefixed surname
 * @returns {string|null} The house name portion, or null if not a bastard name
 *
 * @example
 * extractHouseFromDunSurname("Dunwilfrey") // → "wilfrey"
 * extractHouseFromDunSurname("Dumforpine") // → "forpine"
 * extractHouseFromDunSurname("Wilfrey") // → null
 */
export function extractHouseFromDunSurname(dunSurname) {
  if (!dunSurname) return null;
  if (dunSurname.startsWith(BASTARD_PREFIX)) {
    return dunSurname.substring(BASTARD_PREFIX.length);
  }
  if (dunSurname.startsWith(BASTARD_PREFIX_MATERNAL)) {
    return dunSurname.substring(BASTARD_PREFIX_MATERNAL.length);
  }
  return null;
}

/**
 * Check if a person should have a bastard surname (Dun- or Dum-) based on their data.
 * A person should have a bastard surname if:
 * - They are marked as a bastard (legitimacyStatus === 'bastard')
 * - They belong to a noble house (houseId is not null)
 *
 * @param {Object} person - Person object
 * @param {string} person.legitimacyStatus - Legitimacy status
 * @param {number|null} person.houseId - House ID (null for commoners)
 * @returns {boolean} True if person should have a bastard surname
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

  // Noble bastard with correct prefix (Dun- or Dum-)
  if (hasDunSurname) {
    return {
      isValid: true,
      message: 'Surname follows bastard naming convention',
      suggestedSurname: null
    };
  }

  // Noble bastard without proper prefix - needs fixing
  // Default suggestion is Dun- (father's line); user can manually set Dum- if needed
  const suggestedSurname = house ? generateDunSurname(house.houseName) : null;

  return {
    isValid: false,
    message: `Noble bastards should have "${BASTARD_PREFIX}-" (father's line) or "${BASTARD_PREFIX_MATERNAL}-" (mother's line) prefix`,
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
 * Check if a person is a married woman (has spouse relationship and is female).
 * Married women take their husband's surname, so they shouldn't be flagged
 * for not having a Dun- surname.
 *
 * @param {Object} person - Person object
 * @param {Array} relationships - Array of relationship objects
 * @returns {boolean} True if person is a married woman
 */
export function isMarriedWoman(person, relationships = []) {
  if (!person || person.gender !== 'female') return false;

  // Check if this person has any spouse relationship
  return relationships.some(rel =>
    rel.relationshipType === 'spouse' &&
    (rel.person1Id === person.id || rel.person2Id === person.id)
  );
}

/**
 * Audit a list of people for bastard naming compliance.
 * Returns people who should have Dun- surnames but don't.
 *
 * Note: Married women are excluded - when bastard women marry into a noble
 * house, they take their husband's surname. Their bastard origin is preserved
 * in the maidenName field.
 *
 * @param {Array} people - Array of person objects
 * @param {Array} houses - Array of house objects
 * @param {Array} relationships - Array of relationship objects (optional)
 * @returns {Array} Array of objects with person and suggested fix
 */
export function auditBastardNames(people, houses, relationships = []) {
  const housesById = new Map(houses.map(h => [h.id, h]));
  const issues = [];

  people.forEach(person => {
    if (!shouldHaveDunSurname(person)) return;
    if (isValidDunSurname(person.lastName)) return;

    // Skip married women - they take their husband's surname
    if (isMarriedWoman(person, relationships)) return;

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
