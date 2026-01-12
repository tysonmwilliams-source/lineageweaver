/**
 * CHARTER OF DRIHT, WARD, AND SERVICE - CODEX IMPORT DATA
 * Source: The Codified Charter of Driht, Ward, and Service in Estargenn
 * 
 * This file contains all Codex entries derived from the Charter document,
 * plus the four lordly Wilfrey houses that hold the four seats.
 * 
 * ENTRIES INCLUDED:
 * 
 * LOCATIONS (1 entry):
 * 1. Estargenn - The realm
 * 
 * CONCEPTS (16 entries):
 * 2. The Codified Charter of Driht, Ward, and Service - The document itself
 * 3. Crown of Estargenn - Supreme authority
 * 4. Driht - Concept of ruling authority
 * 5. Drihten - Paramount lord rank
 * 6. Drithen - Great lord rank
 * 7. Drith - Full lord rank
 * 8. Drithling - Cadet lord rank
 * 9. Drithman - Lord-in-service rank
 * 10. Ward - Concept of custodial authority
 * 11. Wardyn - Senior custodian rank
 * 12. Landward - Estate custodian rank
 * 13. Holdward - Minor custodian rank
 * 14. Marchward - Border custodian rank
 * 15. Fealty - The oath-bond system
 * 16. Sir - Knightly honour
 * 17. Cadency - Rules of cadet house derivation
 * 
 * HOUSES (4 entries):
 * 18. House Wilfrey of Breakmount - Principal seat (Drihten)
 * 19. House Wilfrey of Bramblehall - Forest seat (Drithen)
 * 20. House Wilfrey of Riverhead - River seat (Drithen)
 * 21. House Wilfrey of Fourhearth - Coastal seat (Drithen)
 * 
 * USAGE:
 * Import using the CodexImportTool or enhanced-codex-import utility.
 * This data is designed to complement existing House Wilfrey entries.
 */

export const CHARTER_CODEX_DATA = {
  
  // ============================================================================
  // LOCATIONS (1 entry)
  // ============================================================================
  
  locations: [
    {
      type: 'location',
      title: 'Estargenn',
      subtitle: 'The Realm',
      category: 'Realms & Kingdoms',
      tags: ['estargenn', 'realm', 'kingdom', 'crown', 'charter'],
      era: '',
      locationId: null,
      
      content: `**Estargenn** is the realm in which [[House Wilfrey]] and its vassal houses hold their lands and titles. All lawful authority within Estargenn ultimately proceeds from the [[Crown of Estargenn]].

## Governance

The realm is governed according to [[The Codified Charter of Driht, Ward, and Service]], which sets forth the ancient customs of lordship, wardship, and service that have long been observed within its bounds.

### The Crown

The [[Crown of Estargenn]] represents the supreme and undivided authority of the realm. The bearer of the Crown is unnamed in the Charter, yet absolute in law. All [[Drihten]] (paramount lords) owe faith directly to the Crown, and no authority may be exercised within the realm save by its sufferance.

### The Great Houses

Beneath the Crown stand the great houses of the realm, each ruled by a [[Drihten]] exercising paramount authority over their lands and people. These include:

- [[House Wilfrey of Breakmount]] - Lords of the silver mountains
- *(Other great houses to be documented)*

### The System of Authority

Estargenn's social order is defined by the hierarchy of [[Driht]] (lordship) and [[Ward]] (custodial authority):

**Driht Authority** (rule by right):
- [[Drihten]] - Paramount lords
- [[Drithen]] - Great lords
- [[Drith]] - Full lords
- [[Drithling]] - Cadet lords
- [[Drithman]] - Lords-in-service

**Ward Authority** (custody in trust):
- [[Wardyn]] - Senior custodians
- [[Landward]] - Estate custodians
- [[Holdward]] - Minor custodians
- [[Marchward]] - Border custodians

## Culture and Law

The people of Estargenn place great weight upon:

- **Lineage and Blood** - Who you descend from determines much of your station
- **Oaths and [[Fealty]]** - Sworn bonds that cannot be set aside save by death or attainder
- **Accurate History** - Maintained by chroniclers who record births, deaths, and great deeds
- **The Charter** - Ancient customs now codified and sealed by royal authority

## See Also
- [[Crown of Estargenn]]: The supreme authority
- [[The Codified Charter of Driht, Ward, and Service]]: The foundational legal document
- [[House Wilfrey]]: One of the great houses of the realm
- [[Driht]]: The system of lordship
- [[Ward]]: The system of custodial authority`,

      sections: [
        {
          heading: 'The Crown',
          content: 'Supreme and undivided authority of the realm',
          order: 1
        },
        {
          heading: 'The System of Authority',
          content: 'Hierarchy of Driht and Ward',
          order: 2
        },
        {
          heading: 'Culture and Law',
          content: 'Values of lineage, oaths, history, and the Charter',
          order: 3
        }
      ]
    }
  ],
  
  // ============================================================================
  // CONCEPTS (16 entries)
  // ============================================================================
  
  concepts: [
    {
      type: 'concept',
      title: 'The Codified Charter of Driht, Ward, and Service',
      subtitle: 'Foundational Law of Estargenn',
      category: 'Law & Governance',
      tags: ['charter', 'law', 'driht', 'ward', 'estargenn', 'governance', 'authority'],
      era: '',
      
      content: `**The Codified Charter of Driht, Ward, and Service** is the foundational legal document of [[Estargenn]], setting forth in ordered word the customs of lordship, wardship, and service that have governed the realm since time out of record.

## Purpose

The Charter was set forth not to make new law, but to preserve in writing what was previously kept by memory and rite. It codifies:

- The hierarchy of [[Driht]] authority (lordship by right)
- The system of [[Ward]] authority (custody in trust)
- The honour of [[Sir]] (knightly service)
- Rules of [[Fealty]] and sworn bonds
- Guidelines for tenure, place, and style
- The relationship between houses and [[Cadency|cadet branches]]

## Authority

The Charter proceeds **by authority of the [[Crown of Estargenn]]**, set forth by the will of the Sovereign who bears that Crown. It stands binding upon all houses, cadet lines, wards, and sworn persons owing faith within the realm.

## The Seven Articles

### Article I — Of Driht and the Right to Rule
Defines the hierarchy of lordship:
- [[Drihten]] - Paramount lord of a house or region
- [[Drithen]] - Great lord by inheritance or grant
- [[Drith]] - Full lord over persons and lands
- [[Drithling]] - Cadet lord of the blood
- [[Drithman]] - Lord-in-service

No Driht authority may be assumed by residence alone, nor by marriage, nor by tenure of land held in trust, save where expressly granted and recorded.

### Article II — Of Wardship and the Holding of Land
Defines custodial authority:
- [[Wardyn]] - Senior custodian of land
- [[Landward]] - Custodial landholder
- [[Holdward]] - Minor estate custodian
- [[Marchward]] - Custodian of borderlands

All Ward authority is conditional, revocable, and bound to service.

### Article III — Of Sir and the Honour of Service
Defines [[Sir]] as knightly honour without inherent land. A Sir may:
- Hold no land, possessing only honour and oath
- Be granted land as Landward, Holdward, or Wardyn
- Be styled "Sir [Name], Drithman of [House or Place]"
- Bear the style alongside any Driht or Ward title

### Article IV — Of Tenure, Place, and Style
Defines the meaning of styling conventions:
- "of [Place]" — lawful holding and governance
- "in [Place]" — residence without rule
- "at [Place]" — household seat or lodging only
- "of the House of [Name]" — blood descent without land
- "of the Name of [Name]" — a cadet line
- "in Fee of" — land bound in service to another house
- "in Wardship under" — land held in trust

### Article V — Of Fealty and Bond
All authorities bound by oath sworn **to**, **liege to**, or **under the banner of** their superior. [[Fealty]] once sworn may not be set aside save by death, lawful release, or attainder. Where fealty is broken, all derived honours are forfeit.

### Article VI — Of Houses and Cadency
Defines rules for [[Cadency|cadet houses]]:
- Ruling houses hold authority by Driht right, by sufferance of the Crown
- Cadet houses may bear [[Drithling]] authority by blood
- Cadet houses holding land do so in Fee of or in Wardship under the parent house
- No cadet house may claim the style of [[Drihten]] without lawful elevation

### Article VII — Of Record and Seal
All grants of authority shall be recorded in the rolls of the realm. The Charter is sealed by authority of the [[Crown of Estargenn]] and witnessed by the heads of the great houses.

## Significance

The Charter represents the codification of ancient custom into written law.

## The Closing Words

*"Thus codified, that order may endure and memory not fail."*

## See Also
- [[Estargenn]]: The realm governed by this Charter
- [[Crown of Estargenn]]: The authority that sealed it
- [[Driht]]: The system of lordship it defines
- [[Ward]]: The system of wardship it defines
- [[Fealty]]: The oath system it codifies
- [[Cadency]]: The rules for cadet houses`,

      sections: [
        {
          heading: 'The Seven Articles',
          content: 'Structure and major provisions of the Charter',
          order: 1
        },
        {
          heading: 'Authority',
          content: 'Proceeds by authority of the Crown of Estargenn',
          order: 2
        }
      ]
    },
    
    {
      type: 'concept',
      title: 'Crown of Estargenn',
      subtitle: 'Supreme Authority of the Realm',
      category: 'Law & Governance',
      tags: ['crown', 'estargenn', 'sovereignty', 'authority', 'monarchy'],
      era: '',
      
      content: `The **Crown of Estargenn** represents the supreme and undivided authority of the realm of [[Estargenn]], from which all lawful power proceeds.

## Nature of the Crown

The Crown is both symbol and reality:
- **As Symbol** — The physical crown worn by the Sovereign
- **As Authority** — The abstract power that rules the realm
- **As Institution** — The enduring office that outlasts individual bearers

The bearer of the Crown is unnamed in [[The Codified Charter of Driht, Ward, and Service]], yet absolute in law.

## Powers of the Crown

All lawful authority in [[Estargenn]] derives from the Crown:

### Over Driht Authority
- Confirms or denies the elevation of [[Drihten]] (paramount lords)
- May raise [[Drithen]] or [[Drith]] to higher rank
- Grants lawful authority where custom alone is insufficient

### Over Ward Authority
- All lands ultimately held of the Crown
- May recall wardships or reassign custodial authority

### Over Fealty
- Receives the fealty of all [[Drihten]] directly
- May release persons from oaths sworn to attainted lords
- Pronounces attainder, breaking fealty and forfeiting honours

## See Also
- [[Estargenn]]: The realm the Crown rules
- [[The Codified Charter of Driht, Ward, and Service]]: The law sealed by the Crown
- [[Drihten]]: Paramount lords who owe faith directly to the Crown
- [[Fealty]]: The oath system binding all authority to the Crown`,

      sections: [
        {
          heading: 'Nature of the Crown',
          content: 'Symbol, authority, and institution',
          order: 1
        },
        {
          heading: 'Powers',
          content: 'Authority over Driht, Ward, and Fealty',
          order: 2
        }
      ]
    },
    
    {
      type: 'concept',
      title: 'Driht',
      subtitle: 'Authority to Rule by Right',
      category: 'Law & Governance',
      tags: ['driht', 'lordship', 'authority', 'rule', 'charter'],
      era: '',
      
      content: `**Driht** is the term used in [[Estargenn]] to denote authority over people, lineage, and command — the right to rule, whether held by blood, oath, or lawful elevation.

## Definition

According to [[The Codified Charter of Driht, Ward, and Service]]:

> *"The word Driht (a full lord, ruling by right) shall denote authority over people, lineage, and command, whether held by blood, oath, or lawful elevation."*

## The Hierarchy of Driht

The Charter defines five degrees of Driht authority:

### [[Drihten]] — Paramount Lord
The highest Driht authority within a house or region.

### [[Drithen]] — Great Lord
A lord holding great lordship by inheritance or confirmed grant.

### [[Drith]] — Full Lord
A full lord exercising authority over persons and lands rightly theirs.

### [[Drithling]] — Cadet Lord
One of the blood of a ruling house, bearing lawful authority derived from that house.

### [[Drithman]] — Lord-in-Service
One sworn into the ruling authority of a house, empowered to command in its name.

## Acquiring Driht Authority

**May Be Acquired By:**
- Blood descent from a ruling house
- Lawful elevation by a superior authority
- Express grant recorded in the rolls

**May NOT Be Assumed By:**
- Residence alone
- Marriage (unless expressly granted)
- Tenure of land held in trust

## See Also
- [[The Codified Charter of Driht, Ward, and Service]]: Where Driht is defined
- [[Ward]]: The complementary system of custodial authority
- [[Fealty]]: The oath system binding Driht authority`,

      sections: [
        {
          heading: 'The Hierarchy',
          content: 'Five degrees from Drihten to Drithman',
          order: 1
        },
        {
          heading: 'Acquiring Authority',
          content: 'How Driht may and may not be obtained',
          order: 2
        }
      ]
    },
    
    {
      type: 'concept',
      title: 'Drihten',
      subtitle: 'Paramount Lord of a House or Region',
      category: 'Law & Governance',
      tags: ['drihten', 'driht', 'paramount', 'lord', 'charter'],
      era: '',
      
      content: `A **Drihten** is a paramount lord — the highest [[Driht]] authority within a house or region. A Drihten owes civil obedience to none save the [[Crown of Estargenn]].

## Definition

According to [[The Codified Charter of Driht, Ward, and Service]]:

> *"The highest such authority within a house or region shall be styled Drihten (paramount lord of a house or region), and no person so styled shall owe civil obedience to any save the Crown of Estargenn."*

## Authority

A Drihten exercises:
- Supreme authority over their house and all its cadet branches
- Governance of their principal seat and all lands held of it
- Command of persons sworn to their house
- The right to grant [[Drithling]], [[Drithman]], and [[Ward]] titles

## The Great Wilfrey Drihten

[[House Wilfrey]] is structured with four Drihten-level houses:

| House | Seat | Authority |
|-------|------|-----------|
| [[House Wilfrey of Breakmount]] | [[Breakmount Castle]] | Principal house |
| [[House Wilfrey of Bramblehall]] | [[Bramblehall]] | Forest seat |
| [[House Wilfrey of Riverhead]] | [[Riverhead]] | River seat |
| [[House Wilfrey of Fourhearth]] | [[Fourhearth Castle]] | Coastal seat |

## See Also
- [[Driht]]: The system of lordship
- [[Crown of Estargenn]]: The only superior authority
- [[Drithen]]: The rank below Drihten`,

      sections: [
        {
          heading: 'Authority',
          content: 'Supreme lordship within house and region',
          order: 1
        },
        {
          heading: 'The Great Wilfrey Drihten',
          content: 'Four paramount houses holding the four seats',
          order: 2
        }
      ]
    },
    
    {
      type: 'concept',
      title: 'Drithen',
      subtitle: 'Great Lord by Inheritance or Grant',
      category: 'Law & Governance',
      tags: ['drithen', 'driht', 'great-lord', 'charter'],
      era: '',
      
      content: `A **Drithen** is a great lord, holding extensive rule by inheritance or confirmed grant. A Drithen owes [[Fealty]] directly to a [[Drihten]] or to the [[Crown of Estargenn]].

## Definition

According to [[The Codified Charter of Driht, Ward, and Service]]:

> *"Beneath the Drihten may stand Drithen (great lord), holding great lordship by inheritance or confirmed grant."*

## Position in the Hierarchy

| Rank | Description |
|------|-------------|
| [[Drihten]] | Paramount lord — answers only to Crown |
| **Drithen** | **Great lord — answers to Drihten or Crown** |
| [[Drith]] | Full lord — basic independent lordship |
| [[Drithling]] | Cadet lord — derived authority |
| [[Drithman]] | Lord-in-service — delegated authority |

## See Also
- [[Driht]]: The system of lordship
- [[Drihten]]: The rank above Drithen
- [[Drith]]: The rank below Drithen`,

      sections: [
        {
          heading: 'Position in Hierarchy',
          content: 'Second tier of Driht authority',
          order: 1
        }
      ]
    },
    
    {
      type: 'concept',
      title: 'Drith',
      subtitle: 'Full Lord over Persons and Lands',
      category: 'Law & Governance',
      tags: ['drith', 'driht', 'lord', 'charter'],
      era: '',
      
      content: `A **Drith** is a full lord, exercising lawful authority over people and land properly theirs. This is the basic rank of independent lordship in [[Estargenn]].

## Definition

According to [[The Codified Charter of Driht, Ward, and Service]]:

> *"Drith (full lord), holding lordship over persons and lands rightly theirs."*

## What Makes a Drith

A Drith is distinguished by:
- **Independent right** — their authority is their own
- **Both people and land** — they rule persons AND hold land
- **Lawful title** — their position is recorded and recognized

## See Also
- [[Driht]]: The system of lordship
- [[Drithen]]: The rank above Drith
- [[Drithling]]: The rank below Drith`,

      sections: [
        {
          heading: 'What Makes a Drith',
          content: 'Independent right over both people and land',
          order: 1
        }
      ]
    },
    
    {
      type: 'concept',
      title: 'Drithling',
      subtitle: 'Cadet Lord of the Blood',
      category: 'Law & Governance',
      tags: ['drithling', 'driht', 'cadet', 'blood', 'charter'],
      era: '',
      
      content: `A **Drithling** is a cadet lord of the blood — one born of a ruling house who bears lawful authority derived from that house, yet does not stand as its head.

## Definition

According to [[The Codified Charter of Driht, Ward, and Service]]:

> *"A Drithling (cadet lord of the blood) shall be one of the blood of a ruling house, bearing lawful authority derived from that house, yet not standing as its head."*

## Key Characteristics

- **Blood connection** — must be of the blood of a ruling house
- **Derived authority** — power flows from the parent house
- **Not the head** — does not lead the house from which they descend

## Cadet Houses and Drithlings

Most cadet houses are headed by Drithlings. In [[House Wilfrey]]'s structure:

- [[House Wilfson]] — Premier cadet branch
- [[House Wilfriend]], [[House Wilfsbane]] — Breakmount region
- [[House Wilfbauer]], [[House Wilfbole]], [[House Wilfbark]] — Bramblehall region
- [[House Wilfriver]] — Riverhead region
- [[House Wilfour]], [[House Wilfsands]] — Fourhearth region

## Limitations

A Drithling may NOT:
- Claim the style of [[Drihten]] without lawful elevation
- Override the head of their parent house

## See Also
- [[Driht]]: The system of lordship
- [[Drith]]: The rank above Drithling
- [[Drithman]]: The rank below (authority by oath, not blood)
- [[Cadency]]: Rules governing cadet houses`,

      sections: [
        {
          heading: 'Key Characteristics',
          content: 'Blood connection, derived authority, not the head',
          order: 1
        },
        {
          heading: 'Cadet Houses',
          content: 'Most cadet branches headed by Drithlings',
          order: 2
        }
      ]
    },
    
    {
      type: 'concept',
      title: 'Drithman',
      subtitle: 'Lord-in-Service',
      category: 'Law & Governance',
      tags: ['drithman', 'driht', 'service', 'oath', 'charter'],
      era: '',
      
      content: `A **Drithman** is a lord-in-service — one sworn into the ruling authority of a house, empowered to command in its name, yet holding no independent right of succession unless further raised.

## Definition

According to [[The Codified Charter of Driht, Ward, and Service]]:

> *"A Drithman (lord-in-service) shall be one sworn into the ruling authority of a house, empowered to command in its name, yet holding no independent right of succession unless further raised."*

## Key Characteristics

- **Sworn authority** — power comes from oath, not blood
- **Commands in another's name** — represents the house, not themselves
- **No succession right** — cannot inherit unless further elevated

## Distinction from Drithling

| Drithman | Drithling |
|----------|-----------|
| Authority by oath | Authority by blood |
| May be anyone | Must be of the blood |
| No succession right | Potential heir if others fail |

## Typical Styling

> **Sir [Name], Drithman of [House or Place]**

## See Also
- [[Driht]]: The system of lordship
- [[Drithling]]: Authority by blood rather than oath
- [[Sir]]: Knightly honour often held alongside Drithman`,

      sections: [
        {
          heading: 'Key Characteristics',
          content: 'Sworn authority, commands in another\'s name',
          order: 1
        },
        {
          heading: 'Distinction from Drithling',
          content: 'Authority by oath vs. authority by blood',
          order: 2
        }
      ]
    },
    
    {
      type: 'concept',
      title: 'Ward',
      subtitle: 'Custodial Authority in Trust',
      category: 'Law & Governance',
      tags: ['ward', 'wardship', 'custody', 'stewardship', 'charter'],
      era: '',
      
      content: `**Ward** is the term used in [[Estargenn]] to denote custodial authority — governance exercised over land, holdings, or marches **in trust**, not by sovereign right.

## Definition

According to [[The Codified Charter of Driht, Ward, and Service]]:

> *"The word Ward (custodial authority, not sovereignty) shall denote custody and stewardship, being authority exercised over land, holdings, or marches in trust, and not by sovereign right."*

## The Hierarchy of Ward

- [[Wardyn]] — Senior custodian of land
- [[Landward]] — Custodial landholder
- [[Holdward]] — Minor estate custodian
- [[Marchward]] — Custodian of borderlands

## Key Principle

> *"All Ward authority is conditional, revocable, and bound to service. No Ward may lawfully claim the style or rights of Driht by wardship alone."*

## Comparison to Driht

| Ward | Driht |
|------|-------|
| Custody in trust | Rule by right |
| Conditional | Inherent |
| Revocable | Heritable |
| Over land primarily | Over people and lineage |

## See Also
- [[The Codified Charter of Driht, Ward, and Service]]: Where Ward is defined
- [[Driht]]: The complementary system of lordship
- [[House Wilfson]]: Example of Ward authority in practice`,

      sections: [
        {
          heading: 'The Hierarchy',
          content: 'Four types from Wardyn to Marchward',
          order: 1
        },
        {
          heading: 'Key Principle',
          content: 'Conditional, revocable, bound to service',
          order: 2
        }
      ]
    },
    
    {
      type: 'concept',
      title: 'Wardyn',
      subtitle: 'Senior Custodian of Land',
      category: 'Law & Governance',
      tags: ['wardyn', 'ward', 'custodian', 'steward', 'charter'],
      era: '',
      
      content: `A **Wardyn** is a senior custodian of land held in wardship — the highest rank of [[Ward]] authority.

## Definition

According to [[The Codified Charter of Driht, Ward, and Service]]:

> *"A Wardyn (senior custodian of land) shall be a recognised holder of land in wardship, bound to maintain, defend, and render account of that land to the Driht authority under which it is held."*

## Obligations

A Wardyn must:
- **Maintain** the land
- **Defend** the land
- **Render account** to the [[Driht]] authority

## Example

In [[House Wilfrey]], [[House Wilfson]]'s role as Castellan of [[Breakmount Castle]] represents Wardyn-level authority.

## See Also
- [[Ward]]: The system of custodial authority
- [[Landward]]: The rank below Wardyn
- [[House Wilfson]]: Example of Wardyn authority`,

      sections: [
        {
          heading: 'Obligations',
          content: 'Maintain, defend, render account',
          order: 1
        }
      ]
    },
    
    {
      type: 'concept',
      title: 'Landward',
      subtitle: 'Custodial Landholder',
      category: 'Law & Governance',
      tags: ['landward', 'ward', 'custodian', 'estate', 'charter'],
      era: '',
      
      content: `A **Landward** is a custodial landholder — one who keeps and governs an estate or demesne granted for service or good keeping, without right to alienate or divide it.

## Definition

According to [[The Codified Charter of Driht, Ward, and Service]]:

> *"A Landward (custodial landholder) shall keep and govern an estate or demesne granted for service or good keeping, without right to alienate or divide it beyond the terms of grant."*

## Key Characteristics

- Holds an estate or demesne
- Governs for service or good keeping
- Cannot sell, give away, or divide the land

## See Also
- [[Ward]]: The system of custodial authority
- [[Wardyn]]: The rank above Landward
- [[Holdward]]: The rank below Landward
- [[Sir]]: Often combined with Landward status`,

      sections: [
        {
          heading: 'Key Characteristics',
          content: 'Governs without right to alienate or divide',
          order: 1
        }
      ]
    },
    
    {
      type: 'concept',
      title: 'Holdward',
      subtitle: 'Minor Estate Custodian',
      category: 'Law & Governance',
      tags: ['holdward', 'ward', 'custodian', 'manor', 'charter'],
      era: '',
      
      content: `A **Holdward** is a minor estate custodian — one who keeps a manor, hall, or lesser holding.

## Definition

According to [[The Codified Charter of Driht, Ward, and Service]]:

> *"A Holdward (minor estate custodian) shall keep a manor, hall, or lesser holding, owing duty both to the Wardyn above and the Driht authority paramount."*

## Dual Obligation

The Holdward answers to both:
- [[Wardyn]] — immediate superior in the custodial chain
- [[Driht]] — ultimate authority over the holding

## See Also
- [[Ward]]: The system of custodial authority
- [[Landward]]: The rank above Holdward
- [[Wardyn]]: Senior authority`,

      sections: [
        {
          heading: 'Dual Obligation',
          content: 'Answers to both Wardyn and Driht',
          order: 1
        }
      ]
    },
    
    {
      type: 'concept',
      title: 'Marchward',
      subtitle: 'Custodian of Borderlands',
      category: 'Law & Governance',
      tags: ['marchward', 'ward', 'border', 'march', 'martial', 'charter'],
      era: '',
      
      content: `A **Marchward** is a custodian of borderlands — one who holds custody of borders, passes, or liminal territories, with limited martial authority as necessity demands.

## Definition

According to [[The Codified Charter of Driht, Ward, and Service]]:

> *"A Marchward (custodian of borderlands) shall hold custody of borderlands, passes, or liminal territories, and may exercise limited martial authority as necessity demands."*

## Special Authority

Unlike other [[Ward]] ranks, a Marchward has:
- **Limited martial authority** — can raise and command troops
- **Defensive discretion** — may act without waiting for orders
- **Necessity-based power** — authority expands when threat demands

## See Also
- [[Ward]]: The system of custodial authority
- [[Wardyn]]: Senior Ward rank
- [[Estargenn]]: The realm whose borders are guarded`,

      sections: [
        {
          heading: 'Special Authority',
          content: 'Limited martial power as necessity demands',
          order: 1
        }
      ]
    },
    
    {
      type: 'concept',
      title: 'Fealty',
      subtitle: 'The Sworn Bond of Loyalty',
      category: 'Law & Governance',
      tags: ['fealty', 'oath', 'loyalty', 'bond', 'charter'],
      era: '',
      
      content: `**Fealty** is the sworn bond of loyalty binding all [[Driht]], [[Ward]], and [[Sir]] authorities to their lawful superior.

## Definition

According to [[The Codified Charter of Driht, Ward, and Service]]:

> *"All Driht, Ward, and Sir authorities shall be bound by oath, whether sworn to, liege to, or under the banner of their lawful superior."*

## Forms of Fealty

- **"Sworn To"** — Direct personal oath
- **"Liege To"** — Primary allegiance
- **"Under the Banner Of"** — Service under authority

## The Unbreakable Bond

> *"Fealty once sworn may not be set aside save by death, lawful release, or attainder."*

## Consequences of Breaking Fealty

> *"Where fealty is broken, all lands, wardships, and honours derived therefrom are forfeit, pending judgment."*

## See Also
- [[The Codified Charter of Driht, Ward, and Service]]: Where fealty is defined
- [[Crown of Estargenn]]: Apex of all fealty chains
- [[Driht]]: System of lordship bound by fealty`,

      sections: [
        {
          heading: 'Forms of Fealty',
          content: 'Sworn to, liege to, under the banner of',
          order: 1
        },
        {
          heading: 'The Unbreakable Bond',
          content: 'Only ends by death, release, or attainder',
          order: 2
        }
      ]
    },
    
    {
      type: 'concept',
      title: 'Sir',
      subtitle: 'Knightly Honour Without Inherent Land',
      category: 'Law & Governance',
      tags: ['sir', 'knight', 'honour', 'service', 'charter'],
      era: '',
      
      content: `**Sir** is the style denoting personal honour, commonly arising from knighthood, sworn service, or notable merit. It carries no inherent land but represents recognised worth.

## Definition

According to [[The Codified Charter of Driht, Ward, and Service]]:

> *"The style Sir (knightly honour without inherent land) shall denote personal honour, commonly arising from knighthood, sworn service, or notable merit."*

## Categories of Sir

### Sir Without Land
Simply **Sir [Name], sworn to their liege**

### Sir With Ward Authority
**Sir [Name], Landward of [Place]**

### Sir as Drithman
**Sir [Name], Drithman of [House or Place]**

## Compatibility

> *"The style of Sir may be borne alongside any Driht or Ward title lawfully held, and shall not be diminished thereby."*

## See Also
- [[The Codified Charter of Driht, Ward, and Service]]: Where Sir is defined
- [[Driht]]: System Sir may be elevated to
- [[Ward]]: System Sir may hold lands under
- [[Drithman]]: Service position often held by Sirs`,

      sections: [
        {
          heading: 'Categories',
          content: 'Without land, with Ward, as Drithman',
          order: 1
        },
        {
          heading: 'Compatibility',
          content: 'May be borne alongside other titles',
          order: 2
        }
      ]
    },
    
    {
      type: 'concept',
      title: 'Cadency',
      subtitle: 'Rules of Cadet House Derivation',
      category: 'Law & Governance',
      tags: ['cadency', 'cadet', 'house', 'succession', 'charter'],
      era: '',
      
      content: `**Cadency** refers to the rules governing cadet houses — branches that spring from ruling houses but do not stand as their head.

## Charter Provisions

[[The Codified Charter of Driht, Ward, and Service]] addresses cadency in Article VI:

> *"Cadet houses sprung from it may bear Drithling authority by blood, whether or not they hold land."*

> *"Where such cadet houses hold land, they shall do so in Fee of or in Wardship under the parent house, unless raised further."*

> *"No cadet house may claim the style of Drihten without lawful elevation and consent of Estargenn."*

## Key Principles

- **Authority by Blood** — Drithling status from descent
- **Land Tenure** — Held in Fee of or in Wardship under parent house
- **Limitation on Elevation** — Cannot claim Drihten without Crown consent

## The Wilfrey Example

**The Four Drihten Houses:**
- [[House Wilfrey of Breakmount]] (Principal)
- [[House Wilfrey of Bramblehall]]
- [[House Wilfrey of Riverhead]]
- [[House Wilfrey of Fourhearth]]

**The Drithling Cadet Branches:**
- [[House Wilfson]], [[House Wilfriend]], [[House Wilfsbane]]
- [[House Wilfbauer]], [[House Wilfbole]], [[House Wilfbark]]
- [[House Wilfriver]], [[House Wilfour]], [[House Wilfsands]]

## Naming Conventions

In [[House Wilfrey]], cadet branches follow "Wilf-" + descriptor.

## See Also
- [[The Codified Charter of Driht, Ward, and Service]]: Where cadency rules are defined
- [[Drithling]]: The rank held by cadet house heads
- [[House Wilfrey]]: Example of cadet house structure`,

      sections: [
        {
          heading: 'Charter Provisions',
          content: 'Article VI on houses and cadency',
          order: 1
        },
        {
          heading: 'The Wilfrey Example',
          content: 'Four Drihten houses and their cadet branches',
          order: 2
        }
      ]
    }
  ],
  
  // ============================================================================
  // HOUSES (4 entries - The Four Lordly Wilfrey Houses)
  // ============================================================================
  
  houses: [
    {
      type: 'house',
      title: 'House Wilfrey of Breakmount',
      subtitle: 'Principal Seat of the Wilfrey Drihten',
      category: 'Major Houses',
      tags: ['wilfrey', 'breakmount', 'drihten', 'principal', 'silver', 'night-mountain'],
      era: '',
      houseId: null,
      
      content: `**House Wilfrey of Breakmount** is the principal house of the Wilfrey [[Drihten]], holding paramount authority over [[Breakmount Castle]] and the silver mines of [[Night Mountain]].

## Status and Authority

House Wilfrey of Breakmount holds [[Drihten]] status — paramount lordship — under [[The Codified Charter of Driht, Ward, and Service]]. The head of this house:
- Owes [[Fealty]] directly to the [[Crown of Estargenn]]
- Exercises supreme authority over all Wilfrey lands
- Commands the loyalty of the three other seat-holding houses
- Presides over the council of Wilfrey lords

## Relationship to Other Wilfrey Houses

| House | Seat | Relationship |
|-------|------|--------------|
| [[House Wilfrey of Bramblehall]] | [[Bramblehall]] | Sworn to Breakmount |
| [[House Wilfrey of Riverhead]] | [[Riverhead]] | Sworn to Breakmount |
| [[House Wilfrey of Fourhearth]] | [[Fourhearth Castle]] | Sworn to Breakmount |

## Cadet Branches

The Breakmount region hosts [[Drithling]] cadet branches:
- [[House Wilfson]] — Premier cadet branch, Castellans and Masters of the Silver Mines
- [[House Wilfriend]]
- [[House Wilfsbane]]

## See Also
- [[House Wilfrey]]: Overview of the entire house structure
- [[Breakmount Castle]]: The principal seat
- [[House Wilfson]]: Premier cadet branch
- [[Drihten]]: The rank held by the lord of this house`,

      sections: [
        {
          heading: 'Status and Authority',
          content: 'Drihten — paramount lordship of the Wilfrey domain',
          order: 1
        },
        {
          heading: 'Relationship to Other Houses',
          content: 'Three other seats sworn to Breakmount',
          order: 2
        }
      ]
    },
    
    {
      type: 'house',
      title: 'House Wilfrey of Bramblehall',
      subtitle: 'Lords of the Forest Seat',
      category: 'Major Houses',
      tags: ['wilfrey', 'bramblehall', 'drihten', 'forest', 'woodland', 'insular'],
      era: '',
      houseId: null,
      
      content: `**House Wilfrey of Bramblehall** holds [[Drihten]] authority over [[Bramblehall]] and its surrounding woodland territories. The most insular of the four Wilfrey seats.

## Status and Authority

House Wilfrey of Bramblehall holds [[Drihten]] status while remaining sworn to [[House Wilfrey of Breakmount]].

## Culture

The Bramblehall Wilfreys are known for:
- **Insularity** — preference for their own ways
- **Traditionalism** — maintaining old customs
- **Woodcraft** — expertise in forest living

## Cadet Branches

Woodland-themed [[Drithling]] cadet branches:
- [[House Wilfbauer]]
- [[House Wilfbole]]
- [[House Wilfbark]]

## See Also
- [[House Wilfrey]]: Overview of the entire house structure
- [[Bramblehall]]: The forest seat
- [[House Wilfrey of Breakmount]]: The principal house
- [[House Wilfrey of Fourhearth]]: Cultural opposite`,

      sections: [
        {
          heading: 'Status and Authority',
          content: 'Drihten over their seat, sworn to Breakmount',
          order: 1
        },
        {
          heading: 'Culture',
          content: 'Insular, traditional, woodland-focused',
          order: 2
        }
      ]
    },
    
    {
      type: 'house',
      title: 'House Wilfrey of Riverhead',
      subtitle: 'Lords of the River Seat',
      category: 'Major Houses',
      tags: ['wilfrey', 'riverhead', 'drihten', 'river', 'food', 'strategic'],
      era: '',
      houseId: null,
      
      content: `**House Wilfrey of Riverhead** holds [[Drihten]] authority over [[Riverhead]] and its agricultural territories. Commanding a strategic river position and supplying half the food for the Wilfrey domain.

## Status and Authority

House Wilfrey of Riverhead holds [[Drihten]] status while sworn to [[House Wilfrey of Breakmount]].

## Political Leverage

The Riverhead Wilfreys are known for using food as political power — their control over half the domain's food supply gives them significant influence in councils.

## Cadet Branches

- [[House Wilfriver]] — holds moderate political standing but ill repute

## See Also
- [[House Wilfrey]]: Overview of the entire house structure
- [[Riverhead]]: The river seat
- [[House Wilfrey of Breakmount]]: The principal house`,

      sections: [
        {
          heading: 'Status and Authority',
          content: 'Drihten over their seat, sworn to Breakmount',
          order: 1
        },
        {
          heading: 'Political Leverage',
          content: 'Food production as source of power',
          order: 2
        }
      ]
    },
    
    {
      type: 'house',
      title: 'House Wilfrey of Fourhearth',
      subtitle: 'Lords of the Coastal Seat',
      category: 'Major Houses',
      tags: ['wilfrey', 'fourhearth', 'drihten', 'coastal', 'port', 'trade', 'cosmopolitan'],
      era: '',
      houseId: null,
      
      content: `**House Wilfrey of Fourhearth** holds [[Drihten]] authority over [[Fourhearth Castle]] and its port town. The most cosmopolitan of the four Wilfrey seats.

## Status and Authority

House Wilfrey of Fourhearth holds [[Drihten]] status while sworn to [[House Wilfrey of Breakmount]].

## Culture

The Fourhearth Wilfreys are:
- **Seafaring** — expertise in ships and sailing
- **Trade-focused** — merchant activity and commerce
- **Cosmopolitan** — awareness of foreign affairs

Cultural opposite of [[House Wilfrey of Bramblehall]].

## Cadet Branches

Coastal-themed [[Drithling]] cadet branches:
- [[House Wilfour]]
- [[House Wilfsands]]

## Historical Significance

Fourhearth was the seat of [[Lennis Wilfrey]], whose role in [[The Old Right]] shapes the castle's history.

## See Also
- [[House Wilfrey]]: Overview of the entire house structure
- [[Fourhearth Castle]]: The coastal seat
- [[House Wilfrey of Breakmount]]: The principal house
- [[House Wilfrey of Bramblehall]]: Cultural opposite
- [[The Veritists]]: Connected via Veritown`,

      sections: [
        {
          heading: 'Status and Authority',
          content: 'Drihten over their seat, sworn to Breakmount',
          order: 1
        },
        {
          heading: 'Culture',
          content: 'Cosmopolitan, seafaring, trade-focused',
          order: 2
        }
      ]
    }
  ]
};

export default CHARTER_CODEX_DATA;
