/**
 * BASTARDY NAMING CONVENTIONS - CODEX IMPORT DATA
 * Source: Crown Proclamation on Noble Progeny Nomenclature
 * 
 * This file contains Codex entries establishing the legal framework for
 * bastard naming conventions in Estargenn. These entries complement the
 * existing Charter documentation and integrate with the nobility system.
 * 
 * ENTRIES INCLUDED:
 * 
 * CONCEPTS (5 entries - Law & Governance):
 * 1. The Proclamation on Noble Progeny Nomenclature - The legal document
 * 2. Dun-Names - Prefix for bastards of noble fathers
 * 3. Dum-Names - Prefix for bastards of noble mothers only
 * 4. Legitimization - Process of elevating bastards to full status
 * 5. Bastard Rights and Restrictions - Legal standing of bastards
 * 
 * INTEGRATION HOOKS:
 * - Links to [[Crown of Estargenn]] as issuing authority
 * - Links to [[The Codified Charter of Driht, Ward, and Service]] as parent law
 * - Links to [[House Wilfrey]] and cadet houses as examples
 * - Links to [[Cadency]] rules for inheritance implications
 * - Links to [[The Veritists]] as record-keepers of legitimacy status
 * - Links to [[Fealty]] system for bastard obligations
 * 
 * USAGE:
 * Import using the CodexImportTool or EnhancedCodexImportTool.
 * These entries are designed to complement Charter and house documentation.
 */

export const BASTARDY_NAMING_CODEX_DATA = {
  
  // ============================================================================
  // CONCEPTS (5 entries - Law & Governance)
  // ============================================================================
  
  concepts: [
    {
      type: 'concept',
      title: 'The Proclamation on Noble Progeny Nomenclature',
      subtitle: 'Crown Codification of Bastard Naming Traditions',
      category: 'Law & Governance',
      tags: ['law', 'bastards', 'naming', 'crown', 'estargenn', 'legitimacy', 'dun', 'dum', 'nomenclature'],
      era: '',
      
      content: `**The Proclamation on Noble Progeny Nomenclature** is a royal decree issued by the [[Crown of Estargenn]] that codifies into law the ancient traditions governing how children born out of wedlock to noble parents are to be named and recognized.

## Preamble

*"The Crown hereby codifies in law the ongoing tradition of noble houses and their progeny, that order may be preserved in lineage and the rights of lawful heirs be made distinct from those born outside the bonds of matrimony, yet the blood of nobility be not wholly disavowed."*

## The Two Prefixes

The Proclamation establishes two naming prefixes for bastard children based on the status of their noble parent:

### The Dun-Prefix

> *"Children born out of wedlock shall be bastards of their noble father's house and carry the prefix* ***Dun*** *before their given name."*

A [[Dun-Names|Dun-Name]] marks a child as:
- Born to a noble father and common-born (or lesser noble) mother
- Acknowledged by the father's house
- Carrying the blood but not the full rights of that house

**Example:** If Lord Edric Wilfrey fathers a bastard son named Aldric, the child would be styled **Aldric Dunwilfrey** — the "Dun" prefix on the surname marks him as Wilfrey blood born outside wedlock.

### The Dum-Prefix

> *"Those born only of a noble mother shall carry their noble mother's house name and carry the prefix* ***Dum*** *before their given name."*

A [[Dum-Names|Dum-Name]] marks a child as:
- Born to a noble mother and common-born (or unknown) father
- Claiming connection through the maternal line only
- Of higher birth through the mother, yet with no claim through the father

**Example:** If Lady Margery Wilfrey bears a child named Rosamund to an unknown or common father, the child would be styled **Rosamund Dumwilfrey** — the "Dum" prefix on the surname marks her as having only maternal noble connection.

## Legal Rationale

The Proclamation exists to:
- **Distinguish lawful heirs** from those born outside marriage
- **Acknowledge noble blood** even when produced outside proper channels
- **Preserve house integrity** by marking bastards visibly in their names
- **Maintain records** by providing clear naming conventions for [[The Veritists]] to chronicle
- **Prevent succession disputes** by making legitimacy status immediately apparent

## Relationship to Other Laws

### The Charter
The Proclamation operates under the broader framework of [[The Codified Charter of Driht, Ward, and Service]]. While the Charter defines the hierarchy of [[Driht]] authority and [[Cadency]] rules, the Proclamation addresses the specific question of illegitimate offspring.

### Inheritance Rights
Under the Proclamation:
- Dun-named bastards may inherit **only** if no legitimate heirs exist **and** they receive formal [[Legitimization]]
- Dum-named bastards stand even further from succession, their connection being maternal only
- Both categories are barred from automatic inheritance regardless of birth order

### Record-Keeping
[[The Veritists]] are bound to record:
- The circumstances of birth (when known)
- The prefix assigned
- Any subsequent [[Legitimization]]
- The lineage connection to the noble house

## The Dual Standard

The distinction between Dun and Dum reflects the patrilineal nature of most noble succession in [[Estargenn]]:

| Aspect | Dun-Named (Noble Father) | Dum-Named (Noble Mother) |
|--------|--------------------------|--------------------------|
| House Claim | Father's house | Mother's house |
| Inheritance Potential | Low but possible | Very low |
| Social Standing | Higher | Lower |
| Path to [[Legitimization]] | More common | Rarer |
| Typical Outcome | Service to father's house | Often absorbed into mother's household |

## Exceptions and Edge Cases

### Both Parents Noble
When a bastard is born to two noble parents (neither married to each other):
- The Dun-prefix typically applies (following the father's house)
- The mother's house connection may be recorded but not reflected in the name
- Political negotiations may determine which house claims the child

### Unknown Fathers
When the father is unknown:
- The Dum-prefix applies
- The child carries the mother's house name
- No paternal claim can later be asserted without verification

### Acknowledged vs. Unacknowledged
- A noble father may choose not to acknowledge a bastard
- Unacknowledged bastards cannot bear the house name with either prefix
- Acknowledgment is typically recorded by [[Recordants]] in [[Chronicle Chambers]]

## Social Implications

The Proclamation shapes social reality:
- Bastards are immediately identifiable by their names
- Marriage prospects are affected by bastard status
- Service in household positions is common for Dun-named bastards
- Dum-named bastards often face greater social challenges

## Historical Context

While the Proclamation codifies **existing tradition**, the practices it describes predate the document itself:
- Dun and Dum prefixes used informally for generations
- The Crown's decree provides legal weight to customary usage
- [[The Veritists]] already recorded bastards using these conventions
- The Proclamation standardizes and legitimizes the practice

## See Also
- [[Crown of Estargenn]]: The authority that issued this Proclamation
- [[The Codified Charter of Driht, Ward, and Service]]: The broader legal framework
- [[Dun-Names]]: Bastards of noble fathers
- [[Dum-Names]]: Bastards of noble mothers only
- [[Legitimization]]: Process of elevating bastards to full status
- [[Bastard Rights and Restrictions]]: What bastards may and may not do
- [[Cadency]]: Rules of succession affected by legitimacy
- [[The Veritists]]: Record-keepers of lineage and legitimacy`,

      sections: [
        {
          heading: 'The Two Prefixes',
          content: 'Dun for noble fathers, Dum for noble mothers only',
          order: 1
        },
        {
          heading: 'Legal Rationale',
          content: 'Distinguishing heirs, preserving records, preventing disputes',
          order: 2
        },
        {
          heading: 'The Dual Standard',
          content: 'Patrilineal succession shapes different outcomes for each prefix',
          order: 3
        }
      ]
    },
    
    {
      type: 'concept',
      title: 'Dun-Names',
      subtitle: 'Bastards of Noble Fathers',
      category: 'Law & Governance',
      tags: ['dun', 'bastards', 'naming', 'noble-father', 'legitimacy', 'inheritance'],
      era: '',
      
      content: `**Dun-Names** refer to the naming convention applied to children born out of wedlock whose **noble father** has acknowledged them. Per [[The Proclamation on Noble Progeny Nomenclature]], such children carry the prefix "Dun" before their given name.

## Etymology and Meaning

The prefix "Dun" derives from an archaic word meaning "of" or "from" combined with a root suggesting "shadow" or "secondary line." A Dun-named child is thus linguistically marked as "from the shadow of" the noble house — present, acknowledged, but not fully in the light of legitimacy.

## The Naming Convention

### Formation
The Dun-prefix attaches directly to the **house surname**, not the given name:

| Given Name | Original House | Full Bastard Name |
|------------|----------------|-------------------|
| Aldric | Wilfrey | **Aldric Dunwilfrey** |
| Bertram | Wilfson | **Bertram Dunwilfson** |
| Elara | Wilfriver | **Elara Dunwilfriver** |

### Usage
- The Dun-prefix modifies the surname in all formal contexts
- In casual settings, the given name alone may be used (e.g., "Aldric")
- The surname "Dunwilfrey" is spoken as one word
- Official documents always include the prefixed surname
- [[The Veritists]] record the full Dun-surname in [[Chronicle Chambers]]

## Rights and Standing

### What Dun-Named Bastards May Do
- Bear the house name with the Dun-prefix
- Serve the house in martial, administrative, or household capacities
- Receive maintenance and support from the noble father (customary, not required)
- Potentially be [[Legitimization|legitimized]] by the father or [[Crown of Estargenn]]
- Own property in their own name
- Marry (though prospects may be limited)

### What They May Not Do
- Inherit ahead of legitimate children (except through [[Legitimization]])
- Use the house name without the Dun-prefix
- Claim [[Driht]] authority by birth right
- Assume they will be legitimized
- Demand equal treatment with legitimate siblings

## Path to Legitimization

Dun-named bastards have the clearest path to [[Legitimization]] because:
- Noble blood is proven through the father
- The father may petition the [[Crown of Estargenn]] for legitimization
- Service and loyalty can earn elevation
- Lack of legitimate heirs may make legitimization politically necessary

### The Process
1. Father (or head of house after father's death) petitions the Crown
2. [[The Veritists]] provide records confirming parentage
3. Crown may grant or deny based on circumstances
4. If granted, the Dun-prefix is removed
5. New status is recorded in [[Chronicle Chambers]]

## Social Reality

### Common Occupations for Dun-Named Bastards
- **Household knights** (Sir Dunaldric, sworn to the house)
- **Castellans and stewards** (trusted but not inheriting)
- **Military commanders** (loyal to the house through blood)
- **Diplomats and envoys** (representing without binding)
- **Masters of various household functions** (silversmith, horsemaster, etc.)

### Relationships with Legitimate Siblings
Often complex:
- May be raised together (especially if mother has standing in household)
- Legitimate siblings may resent potential competitors
- Strong bonds can form despite legal distinction
- Jealousy and conflict are common
- Some legitimate heirs champion their bastard half-siblings

### Marriage Prospects
- Marriage to lower nobility or wealthy commoners most common
- Rarely marry into houses of equal standing (unless legitimized first)
- May marry other Dun-named bastards
- Sometimes used in political marriages where full legitimacy not required

## Famous Examples

*Note: These would be specific to your world's history and may be documented elsewhere.*

The naming convention has produced many notable figures across [[Estargenn]]'s history, including warriors, advisors, and even (through [[Legitimization]]) rulers of cadet branches.

## Comparison to Dum-Names

| Aspect | Dun-Named | [[Dum-Names|Dum-Named]] |
|--------|-----------|--------------------------|
| Noble Parent | Father | Mother |
| House Claim | Paternal house | Maternal house |
| Legitimization Path | Clearer | Rarer |
| Social Standing | Higher | Lower |
| Typical Role | Service to father's house | Varies widely |

## See Also
- [[The Proclamation on Noble Progeny Nomenclature]]: The law establishing this convention
- [[Dum-Names]]: The maternal equivalent
- [[Legitimization]]: Process of elevation to full status
- [[Bastard Rights and Restrictions]]: Legal standing
- [[Crown of Estargenn]]: Authority for legitimization
- [[Cadency]]: How legitimization affects succession`,

      sections: [
        {
          heading: 'The Naming Convention',
          content: 'Dun-prefix attached directly to given name',
          order: 1
        },
        {
          heading: 'Rights and Standing',
          content: 'What Dun-named bastards may and may not do',
          order: 2
        },
        {
          heading: 'Path to Legitimization',
          content: 'How bastards of noble fathers may be elevated',
          order: 3
        }
      ]
    },
    
    {
      type: 'concept',
      title: 'Dum-Names',
      subtitle: 'Bastards of Noble Mothers Only',
      category: 'Law & Governance',
      tags: ['dum', 'bastards', 'naming', 'noble-mother', 'legitimacy', 'maternal'],
      era: '',
      
      content: `**Dum-Names** refer to the naming convention applied to children born out of wedlock whose **noble mother** bears them, but whose father is either common-born, unknown, or unacknowledging. Per [[The Proclamation on Noble Progeny Nomenclature]], such children carry the prefix "Dum" before their given name.

## Etymology and Meaning

The prefix "Dum" derives from roots suggesting "of the distaff" or "from the mother's line only." It marks a child as having noble blood solely through maternal connection — a distinction that carries different implications in the patrilineal succession system of [[Estargenn]].

## The Naming Convention

### Formation
The Dum-prefix attaches directly to the **house surname**, not the given name:

| Given Name | Original House | Full Bastard Name |
|------------|----------------|-------------------|
| Rosamund | Wilfrey | **Rosamund Dumwilfrey** |
| Celeste | Wilfson | **Celeste Dumwilfson** |
| Gareth | Wilfriver | **Gareth Dumwilfriver** |

### Usage
- The Dum-prefix modifies the surname in all formal contexts
- The surname "Dumwilfrey" is spoken as one word
- Carries stronger stigma than the Dun-prefix in most contexts
- Official documents always include the prefixed surname
- [[The Veritists]] record the circumstances of birth when known

## Why the Distinction Matters

The separate prefix exists because:
- **Patrilineal succession** means father's blood determines most inheritance
- **Uncertain paternity** is more problematic than uncertain maternity
- **Lesser claim** to house resources and protection
- **Different social trajectory** typically follows

## Rights and Standing

### What Dum-Named Bastards May Do
- Bear the mother's house name with the Dum-prefix
- Receive support from the mother's family (if they choose)
- Serve in household capacities (though often lower status)
- Marry (though prospects are more limited than [[Dun-Names]])
- Own property in their own name

### What They May Not Do
- Claim any connection to the father's house (if known)
- Inherit from the mother's house except in extreme circumstances
- Use the house name without the Dum-prefix
- Claim [[Driht]] authority by birth
- Expect [[Legitimization]] (exceedingly rare)

## The Harder Path

### Legitimization Challenges
Dum-named bastards face greater barriers to [[Legitimization]]:
- Cannot prove noble blood through paternal line
- Mother's family often has less interest in elevation
- [[Crown of Estargenn]] rarely grants legitimization for maternal bastards
- Path usually requires extraordinary service or political necessity

### Social Standing
Generally lower than [[Dun-Names|Dun-named bastards]] because:
- Paternal line carries more weight in succession
- Lack of acknowledged noble father raises questions
- Some assume the circumstances of conception were shameful
- Less investment from noble family in their success

## Circumstances Creating Dum-Names

### Unknown Father
Most common when:
- Mother does not reveal father's identity
- Father is unknown even to the mother
- Father died before acknowledgment could occur
- Political reasons prevent identification

### Common-Born Father
When the father is known but common:
- No noble blood from paternal side
- Marriage was not possible due to status difference
- Child can only claim maternal connection
- Sometimes occurs in cases of genuine love matches

### Father Refuses Acknowledgment
Occasionally:
- Noble father denies paternity
- Father's family prevents acknowledgment
- Political reasons prevent recognition
- Child defaults to maternal house only

## Social Reality

### Common Outcomes for Dum-Named Individuals
- **Service in mother's household** (domestic roles)
- **Entry into religious orders** (where birth matters less)
- **Craft apprenticeships** (learning trades)
- **Marriage to commoners** (most common path)
- **Service to [[The Veritists]]** (if they pass the [[Verisol]])

### Relationship with Noble Family
Often distant:
- May be raised separately from legitimate children
- Sometimes supported but not acknowledged publicly
- Mother's family may view them as embarrassment
- Occasionally championed by sympathetic relatives

### Marriage Prospects
Most limited of all bastard categories:
- Rarely marry into any nobility
- Often marry commoners
- May marry other Dum-named individuals
- Sometimes remain unmarried

## Comparison to Dun-Names

| Aspect | [[Dun-Names|Dun-Named]] | Dum-Named |
|--------|--------------------------|-----------|
| Noble Parent | Father | Mother |
| Noble Blood Proof | Paternal | Maternal only |
| Succession Standing | Low | Very low |
| Legitimization | Possible | Rare |
| Social Status | Higher | Lower |
| Family Investment | More common | Less common |

## Exceptional Cases

Despite the general pattern, some Dum-named individuals have risen to prominence through:
- Extraordinary personal merit
- Service to [[The Veritists]] (where birth matters less)
- Martial prowess in times of war
- Political marriages when other options exhausted
- Becoming essential to household operations

## See Also
- [[The Proclamation on Noble Progeny Nomenclature]]: The law establishing this convention
- [[Dun-Names]]: The paternal equivalent
- [[Legitimization]]: The difficult path to full status
- [[Bastard Rights and Restrictions]]: Legal standing
- [[Crown of Estargenn]]: Authority for legitimization
- [[The Veritists]]: Where birth status matters less`,

      sections: [
        {
          heading: 'Why the Distinction Matters',
          content: 'Patrilineal succession creates different implications',
          order: 1
        },
        {
          heading: 'Circumstances Creating Dum-Names',
          content: 'Unknown father, common father, or refused acknowledgment',
          order: 2
        },
        {
          heading: 'The Harder Path',
          content: 'Greater barriers to legitimization and social advancement',
          order: 3
        }
      ]
    },
    
    {
      type: 'concept',
      title: 'Legitimization',
      subtitle: 'Elevation of Bastards to Lawful Status',
      category: 'Law & Governance',
      tags: ['legitimization', 'bastards', 'crown', 'succession', 'elevation', 'law'],
      era: '',
      
      content: `**Legitimization** is the legal process by which a bastard — whether bearing a [[Dun-Names|Dun-Name]] or [[Dum-Names|Dum-Name]] — is elevated to the full status of a lawfully-born child, removing the prefix from their name and granting them rights to inheritance and succession.

## Authority to Legitimize

### The Crown
Only the [[Crown of Estargenn]] possesses the ultimate authority to legitimize bastards:
- All legitimizations require royal decree
- The Crown may act on petition or of its own initiative
- Crown decree is recorded by [[The Veritists]] and becomes permanent law
- No lesser authority can override or revoke Crown legitimization

### The Noble Father (Petition Only)
A noble father (or head of house) may:
- Petition the Crown for legitimization of a [[Dun-Names|Dun-named]] bastard
- Provide evidence and arguments for elevation
- NOT legitimize by personal decree alone
- NOT compel the Crown to grant the petition

### The Church (Limited Cases)
In some circumstances:
- Religious authorities may certify marriages that retroactively legitimize children
- Such cases require specific conditions to have been met
- Crown recognition still required for full effect

## Grounds for Legitimization

### Extinction of Legitimate Lines
Most common when:
- All legitimate heirs have died
- No other succession option exists
- The bastard is the only remaining blood connection
- Political stability requires clear succession

### Extraordinary Service
Occasionally granted for:
- Heroism in battle preserving the realm or house
- Long years of exceptional service
- Saving the life of the lord or Crown
- Actions of profound benefit to [[Estargenn]]

### Political Necessity
Sometimes required when:
- Alliance or marriage requires legitimate status
- Diplomatic situations demand clarity of succession
- Consolidation of power requires legitimized heirs

### Retroactive Marriage
In specific circumstances:
- Parents later marry, legitimizing existing children
- Requires proof the impediment to marriage has been removed
- Crown must recognize the marriage as valid

## The Process

### Petition
1. Father, house head, or other party submits formal petition to Crown
2. Petition must state grounds for legitimization
3. [[The Veritists]] provide records of parentage and circumstances

### Investigation
1. Crown may order inquiry into the circumstances
2. [[Recordants]] verify claims of parentage
3. Witnesses may be called to testify
4. Political implications assessed

### Decision
1. Crown grants or denies the petition
2. If granted, formal decree issued
3. Decree specifies new status and any conditions
4. Original bastard status records annotated, not destroyed

### Recording
1. [[The Veritists]] update records in [[Chronicle Chambers]]
2. New status recorded with date of legitimization
3. Original Dun/Dum-surname preserved in historical record (e.g., "formerly Aldric Dunwilfrey")
4. All subsequent documents use the restored house name (e.g., "Aldric Wilfrey")

## Effects of Legitimization

### Immediate Changes
- Dun or Dum prefix removed from surname (e.g., "Dunwilfrey" becomes "Wilfrey")
- Full rights of legitimate child granted
- May now inherit according to birth order
- Social status elevated

### Inheritance Rights
Upon legitimization, the former bastard:
- Enters the succession according to their birth date
- May inherit ahead of younger legitimate siblings
- Gains rights to all family property and titles
- Becomes eligible for [[Driht]] authority

### Succession Complications
Legitimization can create:
- Displacement of those who expected to inherit
- Challenges from legitimate relatives
- Political tensions within the house
- Questions about the legitimacy of the legitimization itself

## Limitations and Conditions

### Conditional Legitimization
The Crown may attach conditions:
- Legitimized only for specific succession (e.g., one property)
- Barred from higher titles
- Required to take certain actions
- Time-limited in some cases

### Partial Legitimization
Some legitimizations are limited:
- May grant inheritance of property but not titles
- May apply only within the house, not for Crown succession
- May exclude from certain rights retained by fully legitimate children

### Challenges
Legitimization may be challenged by:
- Other heirs claiming procedural irregularities
- Those with better claims under existing law
- Future rulers questioning predecessor's decisions
- Parties who can prove false testimony was used

## Comparison: Dun vs. Dum Legitimization

| Factor | Dun-Named | Dum-Named |
|--------|-----------|-----------|
| Frequency | More common | Very rare |
| Typical Grounds | Extinction, service | Only extinction |
| Father's Role | Can petition | N/A |
| Political Support | Usually present | Often absent |
| Outcome Rate | Higher approval | Lower approval |

## Famous Legitimizations

*Note: Specific historical examples would depend on your world's established history.*

Across [[Estargenn]]'s history, legitimized bastards have:
- Founded cadet branches that endure today
- Ruled in times of crisis
- Served as bridges between warring factions
- Occasionally triggered wars of succession

## The Shadow of Illegitimacy

Even after legitimization:
- Some always remember the person was born a bastard
- Political opponents may raise the origin as weakness
- Descendants may face questions about their lineage
- The historical record preserves the truth

## See Also
- [[The Proclamation on Noble Progeny Nomenclature]]: The law governing bastard naming
- [[Dun-Names]]: Bastards of noble fathers
- [[Dum-Names]]: Bastards of noble mothers
- [[Crown of Estargenn]]: Authority for legitimization
- [[Bastard Rights and Restrictions]]: Pre-legitimization status
- [[The Veritists]]: Record-keepers of legitimacy changes
- [[Cadency]]: How legitimized bastards fit into house structure`,

      sections: [
        {
          heading: 'Authority to Legitimize',
          content: 'Only the Crown can grant full legitimization',
          order: 1
        },
        {
          heading: 'Grounds for Legitimization',
          content: 'Extinction, extraordinary service, political necessity',
          order: 2
        },
        {
          heading: 'Effects of Legitimization',
          content: 'Name change, inheritance rights, and complications',
          order: 3
        }
      ]
    },
    
    {
      type: 'concept',
      title: 'Bastard Rights and Restrictions',
      subtitle: 'Legal Standing of Noble-Born Illegitimate Children',
      category: 'Law & Governance',
      tags: ['bastards', 'rights', 'law', 'inheritance', 'nobility', 'restrictions'],
      era: '',
      
      content: `**Bastard Rights and Restrictions** defines the legal standing of children born out of wedlock to noble parents in [[Estargenn]]. This framework operates under [[The Proclamation on Noble Progeny Nomenclature]] and [[The Codified Charter of Driht, Ward, and Service]].

## Fundamental Principle

The core principle governing bastards:

> *"The blood of nobility shall not be wholly disavowed, yet neither shall it be placed equal to that which flows through lawful bonds of matrimony."*

Bastards are acknowledged as having noble blood but are distinguished from legitimate children in rights, obligations, and social standing.

## Rights of All Bastards

### What Bastards May Do

**Name and Identity**
- Bear the house surname with appropriate prefix ([[Dun-Names|Dun]] or [[Dum-Names|Dum]]) — e.g., "Dunwilfrey" or "Dumwilfrey"
- Claim connection to the noble house
- Use house colors (though not always arms)
- Be identified as having noble blood

**Property and Livelihood**
- Own property in their own name
- Enter contracts and conduct business
- Inherit from non-noble relatives normally
- Receive gifts and bequests (at giver's discretion)
- Engage in trade or crafts
- Earn wages for service

**Legal Standing**
- Testify in courts (though weight of testimony may vary)
- Sue and be sued
- Make oaths (though they may be given less credence)
- Participate in legal proceedings

**Personal Life**
- Marry (subject to social constraints)
- Have legitimate children (who bear no bastard prefix)
- Travel freely within [[Estargenn]]
- Worship according to their conscience
- Join [[The Veritists]] if they pass the [[Verisol]]

**Service**
- Serve the noble house in various capacities
- Bear arms in defense of the house
- Hold household positions (steward, master of horses, etc.)
- Represent the house in matters where full authority not required

## Restrictions on All Bastards

### What Bastards May NOT Do

**Inheritance and Succession**
- Inherit titles or [[Driht]] authority by birth right
- Inherit property from the noble parent automatically
- Take precedence over legitimate children
- Assume they will be included in succession
- Demand equal share in division of estates
- Use the unprefixed house name (e.g., cannot call themselves "Wilfrey" — must use "Dunwilfrey" or "Dumwilfrey")

**Authority**
- Exercise [[Driht]] authority without explicit grant
- Command legitimate family members by birth right
- Represent the house in matters requiring full legitimacy
- Vote in councils reserved for legitimate members
- Hold certain offices reserved for lawful-born

**Heraldry and Honors**
- Bear undifferenced family arms (must use bastard marks)
- Use the full style of the house
- Claim honors belonging to legitimate heirs
- Assume courtesy titles

**Fealty**
- Receive [[Fealty]] oaths from others by birth right
- Hold wardship or custody without explicit grant
- Swear fealty on behalf of the house

## Difference by Prefix

### Dun-Named (Noble Father)

**Additional Rights:**
- Stronger claim to support from father's house
- More likely path to [[Legitimization]]
- Greater social standing
- More likely to hold household positions of trust

**Typical Expectations:**
- Service to the father's house
- Potential military career
- Possible marriage to lower nobility
- Some chance of legitimization if situation demands

### Dum-Named (Noble Mother)

**Additional Restrictions:**
- Weaker claim to support (mother's family may be embarrassed)
- Very rare path to [[Legitimization]]
- Lower social standing
- Often absorbed into lesser roles

**Typical Expectations:**
- Service in mother's household or elsewhere
- Often learns a trade or craft
- Marriage to commoners most likely
- Little expectation of elevation

## Obligations of Bastards

### To the House
- Loyalty to the noble house (not automatically enforced but expected)
- Not bringing shame upon the house name
- Serving when called upon (if receiving support)
- Maintaining the honor of the blood they carry

### To the Realm
- Same obligations as any subject of [[Estargenn]]
- Military service when levied (as commoners, unless specifically raised)
- Payment of taxes on any property owned
- Obedience to the [[Crown of Estargenn]]

## Obligations of Houses to Bastards

### Customary (Not Legally Required)
Noble houses typically:
- Provide some maintenance during childhood
- Offer education appropriate to station
- Arrange marriages when possible
- Find positions within the household
- Protect from serious harm

### Not Obligated To
- Treat bastards equally with legitimate children
- Include bastards in inheritance
- Publicly acknowledge bastards
- Provide for bastards beyond basic needs
- Legitimize bastards

## Record-Keeping

### Veritist Documentation
[[The Veritists]] record in [[Chronicle Chambers]]:
- Birth of bastards with circumstances (when known)
- The assigned prefixed surname (e.g., "Dunwilfrey" or "Dumwilfrey")
- The noble parent(s) involved
- Any subsequent [[Legitimization]] and restoration of unprefixed surname
- Deaths, marriages, and significant events

### Why Records Matter
Accurate records:
- Prove noble blood connection
- Document any changes in status
- Prevent fraud and false claims
- Preserve truth for historical purposes
- Support legitimization petitions when needed

## Social Realities

### The Bastard's Life
Despite legal framework:
- Treatment varies enormously by family
- Some bastards raised with legitimate siblings
- Others kept distant or hidden
- Personal relationships matter as much as law
- Luck and circumstance shape individual fates

### Paths to Advancement
Bastards may improve their standing through:
- [[Legitimization]] (when possible)
- Exceptional service earning honor
- Marriage improving station
- Wealth acquired through business or war
- Entry into [[The Veritists]] or religious orders
- Founding cadet branches (if legitimized)

## See Also
- [[The Proclamation on Noble Progeny Nomenclature]]: The foundational law
- [[Dun-Names]]: Bastards of noble fathers
- [[Dum-Names]]: Bastards of noble mothers
- [[Legitimization]]: Process of elevation
- [[Crown of Estargenn]]: Ultimate authority over status
- [[The Codified Charter of Driht, Ward, and Service]]: Broader legal framework
- [[Cadency]]: Rules for cadet branches (relevant if legitimized)
- [[The Veritists]]: Record-keepers of bastard status`,

      sections: [
        {
          heading: 'Rights of All Bastards',
          content: 'What bastards may do: own property, marry, serve',
          order: 1
        },
        {
          heading: 'Restrictions on All Bastards',
          content: 'What bastards may not do: inherit, hold authority, use arms',
          order: 2
        },
        {
          heading: 'Difference by Prefix',
          content: 'Dun-named vs. Dum-named standing',
          order: 3
        },
        {
          heading: 'Record-Keeping',
          content: 'Veritist documentation of bastard status',
          order: 4
        }
      ]
    }
  ]
};

// Export both named and default for flexibility
export default BASTARDY_NAMING_CODEX_DATA;
