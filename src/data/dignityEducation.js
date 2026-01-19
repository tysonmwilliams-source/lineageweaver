/**
 * Dignity Education Data - Reference Guide for Ranks & Titles
 *
 * PURPOSE:
 * Educational content explaining the hierarchy of dignities, their
 * modern equivalents, responsibilities, and place in the feudal order.
 * Based on "The Codified Charter of Driht, Ward, and Service"
 *
 * STRUCTURE:
 * Each class contains ranks with:
 * - name: Original term
 * - modernEquivalent: Familiar title for reference
 * - pronunciation: How to say it
 * - description: What this rank represents
 * - responsibilities: What they typically do
 * - commands: Who reports to them
 * - answersTo: Their superior
 * - pips: Visual rank indicator (1-5)
 */

export const DIGNITY_EDUCATION = {
  // ====================
  // CROWN - Sovereign Authority
  // ====================
  crown: {
    id: 'crown',
    name: 'Crown',
    icon: 'crown',
    modernEquivalent: 'Royalty',
    description: 'The sovereign authority of the realm. The Crown is the source of all legitimate power and the ultimate arbiter of law.',
    articleRef: 'Above the Charter',
    ranks: {
      sovereign: {
        name: 'Sovereign',
        modernEquivalent: 'King / Queen',
        pronunciation: 'SOV-rin',
        description: 'The Crown itself. The highest authority in the realm, from whom all other dignities flow.',
        responsibilities: [
          'Ultimate arbiter of law and justice',
          'Grants and revokes all dignities',
          'Commands the realm\'s armies',
          'Treats with foreign powers',
          'Protects the peace of the realm'
        ],
        commands: 'All lords, wardens, and knights',
        answersTo: 'The gods and their conscience',
        pips: 5
      },
      heir: {
        name: 'Heir',
        modernEquivalent: 'Crown Prince / Princess',
        pronunciation: 'AIR',
        description: 'The designated successor to the Crown. Holds authority second only to the Sovereign.',
        responsibilities: [
          'Learns the arts of governance',
          'May rule as regent if needed',
          'Represents the Crown at court',
          'Commands in the Sovereign\'s absence'
        ],
        commands: 'By delegation from the Sovereign',
        answersTo: 'The Sovereign',
        pips: 4
      },
      prince: {
        name: 'Prince',
        modernEquivalent: 'Prince / Princess',
        pronunciation: 'PRINTS',
        description: 'Royal blood not in direct line of succession. May hold territories in their own right.',
        responsibilities: [
          'Upholds the honour of the royal house',
          'May govern granted territories',
          'Serves the realm in war and peace'
        ],
        commands: 'Varies by specific grant',
        answersTo: 'The Sovereign',
        pips: 3
      }
    }
  },

  // ====================
  // DRIHT - Lordship by Right (Article I)
  // ====================
  driht: {
    id: 'driht',
    name: 'Driht',
    icon: 'castle',
    modernEquivalent: 'Lordship',
    description: 'Lordship by right - the authority to rule over lands and people by inheritance, grant, or conquest. The backbone of the feudal order.',
    articleRef: 'Article I of the Charter',
    ranks: {
      drihten: {
        name: 'Drihten',
        modernEquivalent: 'High Lord / Duke',
        pronunciation: 'DRIH-ten',
        description: 'Paramount lord of a house or region. The highest rank of lordship below the Crown.',
        responsibilities: [
          'Rules over multiple territories',
          'Commands armies in time of war',
          'Dispenses high justice',
          'Collects taxes from subordinate lords',
          'Maintains the peace of their lands',
          'Advises the Crown on matters of state'
        ],
        commands: 'Drithens, Driths, Drithlings, Drithmen, and all household knights',
        answersTo: 'The Crown directly',
        pips: 5
      },
      drithen: {
        name: 'Drithen',
        modernEquivalent: 'Great Lord / Marquess',
        pronunciation: 'DRIH-then',
        description: 'Great lord by inheritance or royal grant. Holds substantial territories and commands significant forces.',
        responsibilities: [
          'Governs granted territories',
          'Leads forces in battle',
          'Dispenses justice in their domain',
          'Collects and remits taxes',
          'Maintains roads and defenses'
        ],
        commands: 'Driths, Drithlings, Drithmen under their banner',
        answersTo: 'Their Drihten or the Crown',
        pips: 4
      },
      drith: {
        name: 'Drith',
        modernEquivalent: 'Lord / Earl / Count',
        pronunciation: 'DRITH',
        description: 'Full lord over persons and lands. The standard rank of landed nobility with complete authority in their domain.',
        responsibilities: [
          'Rules their estate and its people',
          'Provides military service when called',
          'Maintains local law and order',
          'Manages agricultural production',
          'Settles disputes among tenants'
        ],
        commands: 'Drithlings, Drithmen, household retainers',
        answersTo: 'Their Drithen or Drihten',
        pips: 3
      },
      drithling: {
        name: 'Drithling',
        modernEquivalent: 'Lesser Lord / Baron',
        pronunciation: 'DRITH-ling',
        description: 'Cadet lord of the blood - a younger son or cousin of a noble house who holds land in their own right, though less than a full Drith.',
        responsibilities: [
          'Manages a smaller estate',
          'Provides military service',
          'Supports the main house',
          'May administer justice locally'
        ],
        commands: 'Drithmen, household servants',
        answersTo: 'The head of their house (usually a Drith or higher)',
        pips: 2
      },
      drithman: {
        name: 'Drithman',
        modernEquivalent: 'Lord-in-Service / Landed Knight',
        pronunciation: 'DRITH-man',
        description: 'Lord-in-service. Holds land or title through service rather than inheritance. The entry rank of the Driht class.',
        responsibilities: [
          'Serves their lord faithfully',
          'Manages assigned lands or duties',
          'Provides military service',
          'May collect rents on behalf of their lord'
        ],
        commands: 'Personal retainers only',
        answersTo: 'The lord who granted their position',
        pips: 1
      }
    }
  },

  // ====================
  // WARD - Custodial Authority (Article II)
  // ====================
  ward: {
    id: 'ward',
    name: 'Ward',
    icon: 'shield-check',
    modernEquivalent: 'Wardenship',
    description: 'Custodial authority held in trust. Wardens do not own their lands outright but hold them as stewards for another power - often the Crown, a house, or an institution.',
    articleRef: 'Article II of the Charter',
    ranks: {
      wardyn: {
        name: 'Wardyn',
        modernEquivalent: 'High Warden / Lord Protector',
        pronunciation: 'WAR-din',
        description: 'Senior custodian of land. The highest rank of ward authority, often overseeing strategically vital territories.',
        responsibilities: [
          'Protects and administers entrusted lands',
          'Maintains defenses and garrisons',
          'Reports to the granting authority',
          'May not alienate land without permission',
          'Prepares territories for their rightful lord'
        ],
        commands: 'Landwards, Holdwards, Marchwards, garrison forces',
        answersTo: 'The Crown or granting authority',
        pips: 4
      },
      landward: {
        name: 'Landward',
        modernEquivalent: 'Warden / Steward',
        pronunciation: 'LAND-ward',
        description: 'Custodial landholder. Manages an estate on behalf of its true owner, often during a minority or absence.',
        responsibilities: [
          'Manages day-to-day estate operations',
          'Collects rents and pays dues',
          'Maintains the land in good order',
          'Protects the interests of the true owner'
        ],
        commands: 'Holdwards, estate workers',
        answersTo: 'The Wardyn or granting authority',
        pips: 3
      },
      holdward: {
        name: 'Holdward',
        modernEquivalent: 'Castellan / Keep-Warden',
        pronunciation: 'HOLD-ward',
        description: 'Minor estate custodian. Typically holds a single fortification or small holding in trust.',
        responsibilities: [
          'Maintains the fortification',
          'Commands the local garrison',
          'Protects travelers and merchants',
          'Reports on local conditions'
        ],
        commands: 'Garrison soldiers, household staff',
        answersTo: 'The Landward or granting lord',
        pips: 2
      },
      marchward: {
        name: 'Marchward',
        modernEquivalent: 'March Warden / Border Lord',
        pronunciation: 'MARCH-ward',
        description: 'Custodian of borderlands. A special rank for those who guard the realm\'s frontiers.',
        responsibilities: [
          'Patrols and defends the border',
          'Reports on foreign movements',
          'May treat with neighboring powers',
          'Maintains border fortifications',
          'First response to invasion'
        ],
        commands: 'Border patrols, garrison forces',
        answersTo: 'The Crown or regional Wardyn',
        pips: 3
      }
    }
  },

  // ====================
  // SIR - Knightly Honour (Article III)
  // ====================
  sir: {
    id: 'sir',
    name: 'Sir',
    icon: 'sword',
    modernEquivalent: 'Knighthood',
    description: 'Knightly honour of service. Unlike Driht lords, knights do not inherently hold land - their honour comes from martial skill and sworn service.',
    articleRef: 'Article III of the Charter',
    ranks: {
      sir: {
        name: 'Sir',
        modernEquivalent: 'Knight',
        pronunciation: 'SUR',
        description: 'A knight honoured for martial prowess and sworn service. May be landless or hold land separately from their knightly status.',
        responsibilities: [
          'Serves their sworn lord in battle',
          'Upholds the code of chivalry',
          'Protects the weak and innocent',
          'May train squires and pages',
          'Represents their lord at tournaments'
        ],
        commands: 'Squires, personal retainers',
        answersTo: 'The lord who knighted them or to whom they are sworn',
        pips: 2
      }
    }
  },

  // ====================
  // OTHER - Non-Charter Dignities
  // ====================
  other: {
    id: 'other',
    name: 'Other',
    icon: 'scroll-text',
    modernEquivalent: 'Various',
    description: 'Dignities not defined by the Charter. Includes religious offices, guild ranks, foreign titles, and other honours.',
    articleRef: 'Outside the Charter',
    ranks: {
      custom: {
        name: 'Custom',
        modernEquivalent: 'Varies',
        pronunciation: 'Varies',
        description: 'A user-defined rank for titles that don\'t fit the standard categories.',
        responsibilities: ['Defined by the specific dignity'],
        commands: 'Varies',
        answersTo: 'Varies',
        pips: 1
      }
    }
  }
};

/**
 * Dignity Nature Education - Understanding Types of Dignities
 *
 * The four natures describe how a dignity behaves in terms of
 * succession, tenure tracking, and how it was acquired.
 */
export const DIGNITY_NATURE_EDUCATION = {
  territorial: {
    id: 'territorial',
    name: 'Territorial',
    icon: 'castle',
    summary: 'Hereditary titles attached to land',
    description: 'Territorial dignities are the classic feudal titles - lordships, earldoms, duchies. They are attached to specific lands and domains, passing from parent to child through hereditary succession. The holder rules over both the land and its people.',
    characteristics: [
      'Passes to heirs upon death (hereditary succession)',
      'Attached to specific lands or domains',
      'Holder has authority over the territory',
      'Succession follows defined rules (primogeniture, etc.)',
      'Can be disputed through inheritance claims'
    ],
    examples: [
      'Lord of Breakmount',
      'Earl of Riverhead',
      'Drihten of the Northern Marches',
      'Warden of the Eastern Shore'
    ],
    whenToUse: 'Use for any title that comes with land and passes to heirs - the traditional nobility.'
  },
  office: {
    id: 'office',
    name: 'Office',
    icon: 'briefcase',
    summary: 'Appointed positions that do not pass to heirs',
    description: 'Offices are positions of authority granted by someone with power to appoint. Unlike territorial dignities, they do not pass automatically to heirs - when the holder dies or is removed, the position must be filled by a new appointment.',
    characteristics: [
      'Granted by an authority (Crown, lord, institution)',
      'Does not pass to heirs automatically',
      'Tracks who has served in the position over time',
      'Can be revoked by the granting authority',
      'May come with responsibilities but not land'
    ],
    examples: [
      'Master of Coin',
      'Hand of the King',
      'High Septon',
      'Castellan of the Red Keep',
      'Lord Commander of the Kingsguard'
    ],
    whenToUse: 'Use for appointed positions, government offices, and roles that serve at the pleasure of another.'
  },
  'personal-honour': {
    id: 'personal-honour',
    name: 'Personal Honour',
    icon: 'medal',
    summary: 'Recognition given to an individual that dies with them',
    description: 'Personal honours are dignities bestowed upon a specific person in recognition of their achievements, service, or status. They cannot be inherited - when the holder dies, the honour dies with them.',
    characteristics: [
      'Granted to a specific individual',
      'Cannot be inherited or passed on',
      'Dies with the holder',
      'Tracks who granted the honour',
      'Often awarded for specific achievements'
    ],
    examples: [
      'Knighthood (Sir)',
      'Hero of the Realm',
      'Defender of the Faith',
      'Champion of the Tournament',
      'Savior of Breakmount'
    ],
    whenToUse: 'Use for knighthoods, honorary titles, awards for valor, and any recognition given to a person rather than a position.'
  },
  courtesy: {
    id: 'courtesy',
    name: 'Courtesy',
    icon: 'heart-handshake',
    summary: 'Titles derived from relationship to a holder',
    description: 'Courtesy titles are not independently held - they derive from someone else\'s dignity. A lord\'s wife may be addressed as "Lady" not because she holds a dignity herself, but as a courtesy due to her relationship to the lord.',
    characteristics: [
      'Derived from another person\'s dignity',
      'No independent authority or succession',
      'Changes when the source relationship changes',
      'Primarily a matter of address and protocol',
      'Cannot be granted or revoked independently'
    ],
    examples: [
      'Dowager Lady (widow of a lord)',
      'Lady Mother (mother of the current lord)',
      'Prince Consort (husband of a queen)',
      'Heir Apparent (styled by courtesy)'
    ],
    whenToUse: 'Use for titles held only by virtue of relationship to a dignity holder - spouses, parents, children awaiting inheritance.'
  }
};

/**
 * Quick reference for modern equivalents
 * Maps original terms to familiar titles
 */
export const MODERN_EQUIVALENTS = {
  // Crown
  sovereign: 'King/Queen',
  heir: 'Crown Prince',
  prince: 'Prince/Princess',

  // Driht
  drihten: 'High Lord (Duke)',
  drithen: 'Great Lord (Marquess)',
  drith: 'Lord (Earl/Count)',
  drithling: 'Lesser Lord (Baron)',
  drithman: 'Lord-in-Service',

  // Ward
  wardyn: 'High Warden',
  landward: 'Warden/Steward',
  holdward: 'Castellan',
  marchward: 'March Warden',

  // Sir
  sir: 'Knight',

  // Other
  custom: 'Custom Title'
};

/**
 * Get class display order (for consistent ordering)
 */
export const CLASS_ORDER = ['crown', 'driht', 'ward', 'sir', 'other'];

/**
 * Helper to get education data for a specific rank
 */
export function getRankEducation(dignityClass, dignityRank) {
  const classData = DIGNITY_EDUCATION[dignityClass];
  if (!classData) return null;

  const rankData = classData.ranks[dignityRank];
  if (!rankData) return null;

  return {
    ...rankData,
    class: classData
  };
}

/**
 * Helper to get all ranks in display order
 */
export function getAllRanksOrdered() {
  const result = [];

  for (const classId of CLASS_ORDER) {
    const classData = DIGNITY_EDUCATION[classId];
    if (!classData) continue;

    for (const [rankId, rankData] of Object.entries(classData.ranks)) {
      result.push({
        classId,
        className: classData.name,
        classIcon: classData.icon,
        rankId,
        ...rankData
      });
    }
  }

  return result;
}

/**
 * Helper to get education data for a specific nature
 */
export function getNatureEducation(nature) {
  return DIGNITY_NATURE_EDUCATION[nature] || null;
}

/**
 * Get all natures in display order
 */
export const NATURE_ORDER = ['territorial', 'office', 'personal-honour', 'courtesy'];

export default DIGNITY_EDUCATION;
