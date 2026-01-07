/**
 * VERITISTS CODEX IMPORT DATA
 * Source: Veritists Worldbuilding Session (2026-01-07)
 * 
 * This file contains all Veritist order entries ready for import into The Codex.
 * These entries follow the same structure as codex-seed-data.js and can be imported
 * using the same import tool.
 * 
 * ENTRIES INCLUDED:
 * 1. Verithold (institution/location)
 * 2. Veritown (supporting settlement)
 * 3. Chronicle Chambers (distributed institutional infrastructure)
 * 4. The Veritists (order overview)
 * 5. Acolytes (first rank - trainees)
 * 6. Recordants (second rank - traveling chroniclers)
 * 7. Provosts (third rank - masters and archivists)
 * 
 * USAGE:
 * Import these entries using the CodexImportTool or import-seed-data utility.
 * Can be merged with existing CODEX_SEED_DATA or imported separately.
 */

export const VERITISTS_CODEX_DATA = {
  
  // ============================================================================
  // LOCATIONS (2 entries)
  // ============================================================================
  
  locations: [
    {
      type: 'location',
      title: 'Verithold',
      subtitle: 'Ancient Seat of Historical Truth',
      category: 'Institutions & Organizations',
      tags: ['verithold', 'veritists', 'archives', 'history', 'neutral-institution', 'island', 'fourhearth-connection'],
      era: 'Ancient - Current',
      locationId: null, // HOOK: For future map integration
      
      content: `**Verithold** is the central institution and training facility of [[The Veritists]], the order of historians and chroniclers who maintain official records of noble houses. Located on an unnamed island approximately one day's sail from [[Fourhearth Castle]], Verithold serves as both the spiritual and administrative heart of the order.

## The Institution

### Ancient Origins
Verithold is as old or older than the great houses themselves, its true origins somewhat mythologized. The institution predates current political structures and has survived countless wars, successions, and upheavals by maintaining strict neutrality and essential function.

### The Archives
The heart of Verithold is its vast archives - countless volumes of histories, genealogies, and chronicles spanning generations. These records are:
- Meticulously organized by house, region, and era
- Accessible only to [[Provosts]] and authorized scholars
- Protected by elaborate preservation methods
- Considered the most authoritative historical records in the realm

### Training Facility
Verithold serves as the training ground for all [[Acolytes]]:
- Five-year intensive education program
- Instruction in reading, writing, history, memory techniques
- Training in interview methods and verification procedures
- Teaching neutrality and the ethical responsibilities of chroniclers
- Preparation for life as [[Recordants]]

## Geographic Significance

### Island Location
The deliberate choice of an island location provides:
- Physical separation from political powers
- Symbolic independence from any single house
- Natural protection for the archives
- Controlled access to the institution

### Relationship with Fourhearth
The proximity to [[Fourhearth Castle]] creates strategic benefits:
- Primary maritime supply route
- Gateway for arriving [[Acolytes]] taking the [[Verisol]] examination
- Source of specialized goods (parchment, inks, bookbinding materials)
- Enhanced reputation for Fourhearth as "gateway to knowledge"
- Economic interdependence benefiting [[Veritown]]

## The Perception Gap

### Common Folk View
To most common people, Veritists appear:
- Mystical or semi-magical
- Possessing supernatural memory
- Chosen by divine forces
- Keepers of sacred rather than scholarly knowledge

### Noble Understanding
The nobility recognizes Veritists as:
- Educated professionals with trained skills
- Politically valuable record-keepers
- Sources of legitimacy through documented lineage
- Potential tools (through selective emphasis) or threats (through accurate recording)

## Political Reality

Despite claims of neutrality, Verithold operates in political reality:

### The Corruption Dynamic
- Some [[Recordants]] and [[Provosts]] susceptible to payments
- Wealthy houses can influence emphasis and omissions
- Outright lies remain forbidden (damages credibility)
- Subtle shadings of truth more common than fabrication

### Maintaining Legitimacy
The order's power rests on perceived trustworthiness:
- Too much corruption destroys their value
- Core records must remain accurate
- Reputation for truth allows influence
- Balance between ideal and pragmatism

## Institutional Power

Verithold wields significant soft power through:
- Control of official historical narratives
- Validation of noble lineages
- Certification of marriages, births, deaths
- Authority over [[Chronicle Chambers]] in every major house
- Training and credentialing all [[Recordants]]

## Physical Description

While the exact architecture remains to be detailed, Verithold includes:
- The Great Archives (vast library and storage)
- Training halls for [[Acolytes]]
- Quarters for resident [[Provosts]]
- Administrative chambers
- Examination halls for the [[Verisol]]
- Docking facilities for maritime access

## Cultural Significance

In a society that deeply values accurate history as fundamental to identity and legitimacy, Verithold represents:
- The institutional memory of civilization
- Guardian of truth (however imperfectly)
- Arbiter of historical disputes
- Training ground for the educated elite
- Symbol of continuity across generations

## See Also
- [[The Veritists]]: The order that operates from Verithold
- [[Veritown]]: Supporting settlement on the same island
- [[Fourhearth Castle]]: Nearest major port and primary trade partner
- [[Chronicle Chambers]]: Distributed extensions of Verithold's authority
- [[Acolytes]], [[Recordants]], [[Provosts]]: The three ranks of the order
- [[Verisol]]: The examination administered at Verithold`,

      sections: [
        {
          heading: 'The Archives',
          content: 'Vast historical records spanning generations',
          order: 1
        },
        {
          heading: 'Training Facility',
          content: 'Five-year education for Acolytes',
          order: 2
        },
        {
          heading: 'Political Reality',
          content: 'Neutrality balanced with pragmatic corruption',
          order: 3
        }
      ]
    },
    
    {
      type: 'location',
      title: 'Veritown',
      subtitle: 'Port Settlement Serving Verithold',
      category: 'Settlements',
      tags: ['veritown', 'verithold', 'port', 'island', 'trade', 'fourhearth-connection'],
      era: 'Ancient - Current',
      locationId: null, // HOOK: Map integration
      
      content: `**Veritown** is the supporting settlement on the same island as [[Verithold]], serving as the port, market, and residential area for those who support the order but are not members themselves.

## Function and Purpose

### Supporting the Institution
Veritown exists to provide services Verithold requires:
- **Port facilities** for maritime traffic
- **Docking and warehousing** for supplies
- **Markets** for food, goods, and specialized materials
- **Lodging** for visiting [[Recordants]] and guests
- **Craftspeople** specializing in bookbinding, parchment-making, ink production

### Economic Foundation
The settlement's economy is entirely dependent on:
- Trade with [[Fourhearth Castle]] (primary partner)
- Supplying [[Verithold]]'s needs
- Serving [[Recordants]] returning from circuits
- Hosting families visiting [[Acolytes]]
- Producing specialized goods for the order

## Demographics

### Permanent Residents
- Skilled craftspeople (bookbinders, scribes, parchment makers)
- Merchants and traders
- Dockworkers and sailors
- Service providers (inn-keepers, cooks, launderers)
- Families of those working with the order

### Transient Population
- [[Recordants]] between assignments
- Merchants from [[Fourhearth Castle]]
- Families visiting [[Acolytes]]
- Aspiring candidates awaiting the [[Verisol]]
- Scholars seeking archive access

## Relationship with Verithold

### Separate But Connected
Veritown maintains clear boundaries:
- Not part of Verithold proper
- Governed by its own councils
- Cannot claim the order's neutrality
- Economically dependent but administratively independent

### The Buffer Zone
Veritown serves as intermediary between:
- The sacred/scholarly space of [[Verithold]]
- The commercial/political world beyond
- Common people and the educated elite
- Family connections and monastic separation

## Specialized Markets

### The Parchment Quarter
Multiple workshops producing:
- Various grades of parchment
- Specialized vellum for important records
- Practice materials for [[Acolytes]]
- Export quality goods for noble houses

### The Ink Makers
Craftspeople creating:
- Standard writing inks
- Archival-quality permanent inks
- Colored inks for illumination
- Specialized formulas for different climates

### Bookbinding Halls
Masters of the craft producing:
- Durable binding for archives
- Decorative volumes for wealthy patrons
- Repair services for damaged records
- Teaching binding techniques

## Cultural Character

### Educated Population
Unusual for a settlement of its size:
- High literacy rates (necessity for serving the order)
- Respect for learning and scholarship
- Pride in association with [[Verithold]]
- Understanding of the order's true nature (not mystical)

### Economic Pragmatism
Despite proximity to scholarly ideals:
- Shrewd traders aware of their monopoly position
- Not above price manipulation during high demand
- Competitive marketplace despite small size
- Balance between service and profit

## Trade Routes

### Primary Partnership with Fourhearth
The one-day sailing distance creates:
- Regular ferry service
- Predictable supply chains
- Economic interdependence
- Cultural exchange
- Strategic relationship

### Other Connections
While [[Fourhearth Castle]] dominates trade:
- Occasional ships from other ports
- [[Recordants]] arriving from various houses
- Scholars from distant institutions
- Rare exotic goods from far-flung sources

## Strategic Vulnerability

### Complete Dependence
Veritown's weakness is its reliance on:
- Maritime trade (vulnerable to storms, blockades)
- [[Verithold]]'s continued operation
- [[Fourhearth Castle]]'s goodwill
- Peaceful relations allowing commerce

### Political Shelter
Protected by:
- Association with [[Verithold]]'s neutrality
- Value to multiple houses through the order
- [[Fourhearth Castle]]'s vested interest
- No military value to conquer

## Daily Life

While specific details remain to be developed, Veritown likely features:
- Busy docks with [[Fourhearth Castle]] ferries
- Markets selling specialized goods
- Inns hosting transient populations
- Workshops producing archive materials
- Town square where news from the realm arrives
- Mix of scholarly and commercial atmosphere

## See Also
- [[Verithold]]: The institution the settlement serves
- [[Fourhearth Castle]]: Primary trade partner
- [[Recordants]]: Frequent visitors to the settlement
- [[Acolytes]]: Families may visit during training
- [[The Veritists]]: The order that draws people to the island`,

      sections: [
        {
          heading: 'Supporting Verithold',
          content: 'Port, markets, and specialized craftspeople',
          order: 1
        },
        {
          heading: 'Economic Dependence',
          content: 'Trade with Fourhearth and service to the order',
          order: 2
        },
        {
          heading: 'Specialized Markets',
          content: 'Parchment, inks, and bookbinding',
          order: 3
        }
      ]
    }
  ],
  
  // ============================================================================
  // MYSTERIA (5 entries) - Institutions, Ranks, Customs
  // ============================================================================
  
  mysteria: [
    {
      type: 'mysteria',
      title: 'Chronicle Chambers',
      subtitle: 'Neutral Spaces in Every Noble House',
      category: 'Customs & Institutions',
      tags: ['chronicle-chambers', 'veritists', 'recordants', 'neutral-space', 'noble-houses', 'history'],
      era: 'Ancient - Current',
      
      content: `**Chronicle Chambers** are standardized rooms maintained in every major noble house, serving as neutral territory where [[Recordants]] of [[The Veritists]] conduct their work. These chambers represent the physical manifestation of Verithold's authority throughout the realm.

## Function and Purpose

### Neutral Ground
Chronicle Chambers serve as:
- Spaces where [[Recordants]] work independent of house control
- Rooms that cannot be entered without a Recordant present
- Territory technically under [[Verithold]]'s authority, not the house's
- Symbolic representation of historical truth above political power

### Recording Work
Within these chambers, [[Recordants]]:
- Conduct formal interviews with family members
- Record births, deaths, marriages, significant events
- Review previous records for continuity
- Write preliminary drafts before final archive copies
- Store traveling copies of relevant house records

### Storage
Each chamber contains:
- Previous volumes of house chronicles
- Blank parchment and writing materials (supplied by the house)
- The Recordant's working notes and references
- Verification documents and correspondence
- Sealing materials for authenticating records

## Standard Design

### Universal Elements
Every Chronicle Chamber includes:
- **The Desk**: Large writing surface positioned to face the door
- **The Chair**: For the Recordant (only they may sit during formal interviews)
- **The Witness Bench**: Where subjects sit during interviews
- **The Archive Shelf**: Locked storage for records
- **The Seal Station**: Area for authenticating documents with wax and stamps

### Variations
While core elements remain consistent:
- Wealthy houses provide elaborate furnishings
- Poorer houses offer basic functional spaces
- Regional decorative styles may vary
- Size adjusted to house importance and record volume

### Required Neutrality
Despite being in noble houses:
- House cannot dictate chamber decoration
- Family heraldry explicitly forbidden
- Plain, scholarly atmosphere maintained
- Focus on function over grandeur (though some houses try to impress)

## Access Control

### The Lock and Key
- Each chamber has a single lock
- Only the assigned [[Recordant]] holds the key
- House members cannot enter without permission
- Even during [[Recordant]] absence, chamber remains sealed

### Violations
Breaking into a Chronicle Chamber:
- Considered attack on [[Verithold]] itself
- Damages house's relationship with the order
- May result in suspended chronicling (devastating for legitimacy)
- Treated as serious offense by other noble houses

## The Interview Process

### Formal Chronicling
When [[Recordants]] visit:
1. Chamber unlocked and prepared
2. Subject summoned for formal interview
3. Recordant asks prepared questions
4. Responses recorded in preliminary form
5. Key details verified against previous records
6. Subject may be dismissed or called for follow-up

### Atmosphere
Interviews conducted with:
- Formality reflecting the importance of official history
- Recordant maintaining professional distance
- Clear power dynamic (Recordant controls the narrative)
- Subject awareness this becomes permanent record

## Political Dynamics

### The Power of Space
Chronicle Chambers represent:
- Institutional authority within private domains
- Limits on noble power over their own houses
- Visual reminder of [[Verithold]]'s reach
- Check against complete autonomy

### The Leverage Game
Houses may try to:
- Provide luxurious chambers to impress [[Recordants]]
- Offer hospitality and gifts (indirect influence)
- Control information flow (what the Recordant hears)
- Schedule interviews strategically
- But cannot directly control what is written in their own chamber

## Cultural Significance

### Symbolic Weight
In a culture valuing accurate history:
- Chronicle Chambers represent institutional memory
- Space where family legacy is officially recorded
- Room where truth (theoretically) matters more than power
- Physical manifestation of "it will be remembered"

### The Phrase
"It will be written in the Chronicle Chamber" carries weight:
- Threat that actions will be officially recorded
- Promise that truth will be preserved
- Reminder of historical judgment
- Warning against actions that cannot be hidden

## Practical Reality

### The Corruption Factor
Despite ideals:
- Some [[Recordants]] influence-able by gifts and hospitality
- Wealthy houses can shape emphasis through indirect means
- Chamber's neutrality more symbolic than absolute
- Gap between theory and practice

### Essential Function
Regardless of corruption:
- Core records must remain accurate (preserves legitimacy)
- Chamber still serves its basic chronicling function
- Physical space maintains symbolic authority
- System works well enough to persist

## Variations by House

### Major Houses
([[Breakmount Castle]], [[Fourhearth Castle]], etc.)
- Larger chambers reflecting importance
- More frequent [[Recordant]] visits
- Greater volume of records stored
- More elaborate (but still neutral) furnishings

### Cadet Branches
- Smaller chambers
- Less frequent visits
- May share [[Recordant]] circuits
- Basic but functional spaces

### Minor Houses
- Minimal chambers
- Infrequent chronicling
- May lack full chronicle going back generations
- Still maintain the essential neutral space

## See Also
- [[The Veritists]]: The order that maintains Chronicle Chambers
- [[Recordants]]: Those who work in the chambers
- [[Verithold]]: Central institution training and certifying Recordants
- [[Provosts]]: Masters who review chamber records
- [[House Wilfrey]] and all major houses: Maintain Chronicle Chambers`,

      sections: [
        {
          heading: 'Neutral Ground',
          content: 'Spaces under Verithold authority within noble houses',
          order: 1
        },
        {
          heading: 'The Interview Process',
          content: 'How official history is recorded',
          order: 2
        },
        {
          heading: 'Power and Corruption',
          content: 'Symbolic neutrality vs. practical influence',
          order: 3
        }
      ]
    },
    
    {
      type: 'mysteria',
      title: 'The Veritists',
      subtitle: 'Order of Historians and Chroniclers',
      category: 'Customs & Institutions',
      tags: ['veritists', 'order', 'history', 'chroniclers', 'verithold', 'neutral-institution'],
      era: 'Ancient - Current',
      
      content: `**The Veritists** (from *veritas* - truth) are an order of historians and chroniclers responsible for maintaining official records of noble houses. Based at [[Verithold]], they serve as institutional memory for the realm, wielding significant soft power through their control of historical narratives.

## Overview and Purpose

### Institutional Function
The Veritists exist to:
- Maintain accurate records of births, deaths, marriages
- Chronicle significant events in noble houses
- Preserve lineages and genealogies
- Serve as arbiters in historical disputes
- Provide legitimacy through documented history

### Perceived Neutrality
The order claims to stand apart from:
- Political factions and alliances
- Individual house interests
- Personal friendships and enmities
- Temporal power struggles

Reality is more complex than the ideal.

## The Three Ranks

The order operates through a hierarchical structure:

### [[Acolytes]] (First Rank)
- Ages approximately 13-18
- Five years of intensive training at [[Verithold]]
- Learning reading, writing, history, memory techniques
- Testing before advancement to Recordant
- Not yet chroniclers but students

### [[Recordants]] (Second Rank)
- Traveling chroniclers assigned to circuits
- Visit noble houses periodically to record events
- Work in [[Chronicle Chambers]] within each house
- Conduct formal interviews and verify records
- May eventually be called back to Verithold as Provosts

### [[Provosts]] (Third Rank)
- Masters of the order residing at [[Verithold]]
- Guard and organize the central archives
- Train [[Acolytes]]
- Conduct the [[Verisol]] examination
- Engage in internal politics and knowledge-keeping
- Review and authenticate [[Recordant]] submissions

## Recruitment: The Verisol

### The Examination
Any person, regardless of birth, may take the [[Verisol]]:
- Tests intelligence, memory, aptitude for learning
- Administered at [[Verithold]]
- Pass rate deliberately low (perhaps 1 in 20 or fewer)
- Those who pass face immediate choice

### The Choice
Those who pass must decide immediately:
- Continue their current life (most common choice)
- Begin five-year training as [[Acolytes]]
- No middle ground or delayed decision
- Choice is irrevocable once made

### The Separation
Choosing to train means:
- Minimum five years at [[Verithold]]
- Separation from family and previous life
- Uncertain completion (some fail training)
- New identity as part of the order
- Abandoning previous social position

## The Perception Gap

### Common Folk View
To most common people, Veritists appear:
- Mystical or semi-magical
- Possessing supernatural memory
- Chosen by divine forces for sacred duty
- Keepers of sacred rather than scholarly knowledge
- Mysterious figures beyond normal understanding

### Noble Understanding
The nobility recognizes them as:
- Educated professionals with trained skills
- Politically valuable record-keepers
- Sources of legitimacy through documented lineage
- Potential tools (through selective emphasis)
- Potential threats (through accurate recording)
- Human beings susceptible to influence

## Political Reality: The Corruption Dynamic

### The Ideal vs. The Real
Official position:
- Absolute neutrality and truthfulness
- Incorruptible dedication to accurate history
- Serving historical truth above temporal concerns

Practical reality:
- Some [[Recordants]] and [[Provosts]] accept payments
- Wealthy houses can influence emphasis and omissions
- Subtle shadings more common than outright lies
- Gap between ideal and practice

### Why Not Complete Lies?
The order maintains standards because:
- Outright fabrication destroys credibility
- Once reputation for lies established, records become worthless
- Core function depends on perceived trustworthiness
- Major facts too well-known to falsify completely

### The Balance
The order walks a line:
- Accurate enough to remain legitimate
- Flexible enough to be pragmatic
- Corrupt enough to be human
- Principled enough to be valuable

## Institutional Power

### Soft Power Through Narrative
The order wields influence by:
- Controlling official historical narratives
- Validating noble lineages
- Certifying marriages and births
- Arbitrating historical disputes
- Creating or denying legitimacy

### Strategic Value
Houses value the order for:
- Legal proof of inheritance rights
- Documentation of alliances and treaties
- Legitimacy through recorded lineage
- Historical precedents in disputes
- Official certification of succession

## Cultural Significance

### In a Society That Values History
In a culture where accurate history is fundamental to:
- Identity and legitimacy
- Social order and hierarchy
- Legal rights and inheritance
- Political power and alliances

The Veritists serve essential function, however imperfectly.

### The Phrases
"It will be remembered" carries weight because:
- Official history matters for legitimacy
- Historical judgment affects reputation
- Future generations will know what happened
- The Veritists will write what endures

## Relationship with Noble Houses

### Universal Presence
Every major house maintains:
- [[Chronicle Chambers]] for [[Recordant]] work
- Regular visitation schedules
- Respect for the order's authority (publicly)
- Attempts to influence (privately)

### House-Specific Relationships
- Some houses more welcoming than others
- Some [[Recordants]] more corruptible than others
- Long-term relationships between houses and assigned Recordants
- Complexity of human interactions beneath formal structure

## The Order's Age

[[Verithold]] is as old or older than the great houses:
- Origins somewhat mythologized
- Survived countless wars and upheavals
- Institutional continuity across generations
- Authority derived from age and tradition

## See Also
- [[Verithold]]: Central institution and archives
- [[Acolytes]]: First rank, trainees
- [[Recordants]]: Second rank, traveling chroniclers
- [[Provosts]]: Third rank, masters and archivists
- [[Chronicle Chambers]]: Where Recordants work in noble houses
- [[Verisol]]: Examination for entry to the order
- [[Veritown]]: Supporting settlement
- All major noble houses maintain relationships with the order`,

      sections: [
        {
          heading: 'The Three Ranks',
          content: 'Acolytes, Recordants, and Provosts',
          order: 1
        },
        {
          heading: 'The Verisol',
          content: 'Examination and the Choice',
          order: 2
        },
        {
          heading: 'The Perception Gap',
          content: 'Mystical vs. educated professional',
          order: 3
        },
        {
          heading: 'Political Reality',
          content: 'Neutrality ideal balanced with pragmatic corruption',
          order: 4
        }
      ]
    },
    
    {
      type: 'mysteria',
      title: 'Acolytes',
      subtitle: 'First Rank of the Veritists',
      category: 'Customs & Institutions',
      tags: ['acolytes', 'veritists', 'verithold', 'training', 'verisol', 'education'],
      era: 'Ancient - Current',
      
      content: `**Acolytes** are the first rank of [[The Veritists]], young people (approximately ages 13-18) undergoing the rigorous five-year training program at [[Verithold]] to become [[Recordants]].

## Entry to the Order

### The Verisol Passage
Acolytes are those who:
- Passed the [[Verisol]] examination
- Chose training over continuing their previous life
- Made the irrevocable decision to join the order
- Left family, status, and former identity behind

### Immediate Commitment
Unlike many institutions:
- No provisional period or trial membership
- Decision made immediately upon passing examination
- Cannot return home and then decide later
- The Choice must be made in the moment

## The Five Years

### Duration and Completion
- Training lasts minimum five years
- Not all who begin will complete (some fail out)
- Age range typically 13-18, but some variation
- Those who fail training cannot retake
- Successful completion advances to [[Recordant]] rank

### Curriculum

**Reading and Writing**
- Advanced literacy beyond common education
- Multiple writing styles and hands
- Correct formation of letters for clarity
- Speed writing for taking notes during interviews

**History and Chronicles**
- Genealogies of major noble houses
- Significant historical events and their contexts
- How to cross-reference and verify information
- Recognizing common patterns in family histories
- Learning to spot contradictions and inconsistencies

**Memory Techniques**
- Methods for retaining large amounts of information
- Mental organization systems
- Recall under pressure
- Distinguishing what you remember vs. what you think you remember

**Interview Methods**
- How to ask questions that elicit truth
- Reading body language and hesitation
- Detecting lies and exaggerations
- Maintaining control of the interview
- Getting subjects to reveal more than they intend

**Ethics and Neutrality**
- The responsibilities of chroniclers
- Maintaining professional distance
- Resisting manipulation and bribes
- Serving truth above temporal concerns
- (The gap between this ideal and later reality is not yet apparent to Acolytes)

**Practical Skills**
- Parchment preparation and care
- Ink mixing and maintenance
- Document preservation
- Basic bookbinding and repair
- Proper handling of ancient texts

### Daily Life

**Structure and Discipline**
- Highly regimented schedule
- Study, practice, and examination
- Physical work maintaining [[Verithold]]
- Limited free time
- Supervised at all times

**Living Conditions**
- Communal dormitories
- Simple meals (adequate but not luxurious)
- Plain clothing marking them as students
- Little privacy or personal space
- Focus on learning over comfort

**Social Isolation**
- Little contact with family
- No visits home during training
- Limited interaction with [[Veritown]]
- Occasional supervised trips off [[Verithold]]
- Bonds form with fellow Acolytes instead

## The Testing Process

### Continuous Evaluation
- Regular examinations throughout training
- Both written and oral testing
- Practical demonstrations of skills
- Memory challenges
- Interview simulations

### Final Examination
Before advancement to [[Recordant]]:
- Comprehensive testing of all skills
- Demonstration of sufficient memory
- Interview proficiency examination
- Knowledge of major house histories
- Ethical understanding (theoretical)

### Failure
Those who fail training:
- Cannot retake examinations
- Cannot remain at [[Verithold]]
- May find work in [[Veritown]]
- Some become scribes elsewhere
- Carry the stigma of "failed Acolyte"

## The Transformation

### Identity Shift
Over five years, Acolytes:
- Lose connection to previous social class
- Adopt identity as Veritists first
- Learn to see themselves as above temporal concerns
- Develop professional detachment
- Begin to understand their future power

### The Illusion Persists
During training:
- High ideals about truth and neutrality maintained
- Corruption among [[Recordants]] and [[Provosts]] downplayed
- Ethical standards presented as universal
- The gap between ideal and practice not yet revealed
- Acolytes believe they will be incorruptible

### Skills Development
By the end, successful Acolytes can:
- Write clearly and quickly for hours
- Retain vast amounts of genealogical information
- Conduct effective interviews
- Spot inconsistencies in accounts
- Organize complex historical information
- Function as professional chroniclers

## Relationship with Other Ranks

### With Provosts
[[Provosts]] serve as:
- Teachers and examiners
- Models of what Acolytes will become
- Authority figures demanding respect
- Keepers of knowledge Acolytes seek
- Sometimes mentors, always superiors

### With Recordants
[[Recordants]] returning to [[Verithold]]:
- Bring stories from the wider world
- Represent the life Acolytes will soon lead
- Provide practical advice beyond formal curriculum
- Sometimes reveal the gap between training and reality
- Inspire or worry Acolytes about their future

## Emotional Journey

### Initial Period
- Excitement and pride at passing [[Verisol]]
- Homesickness and adjustment to new life
- Overwhelm at the curriculum's difficulty
- Forming bonds with fellow Acolytes
- Pride in wearing the student's garb

### Middle Years
- Growing confidence in abilities
- Frustration with restrictions
- Competition with peers
- Deepening knowledge and skill
- Anticipation of becoming [[Recordants]]

### Final Year
- Anxiety about final examinations
- Eagerness to leave [[Verithold]] and travel
- Nostalgia for the simplicity of student life
- Confidence in training received
- Idealism about serving truth

## Cultural Perception

### Viewed by Common Folk
Acolytes training at [[Verithold]]:
- Mysterious chosen ones
- Learning sacred knowledge
- Blessed or touched by something beyond
- Impressive for even attempting the path

### Viewed by Nobility
Acolytes are recognized as:
- Students in professional training
- Future [[Recordants]] who will chronicle their houses
- Young people making significant sacrifice
- Investments in the order's future
- Not yet fully formed in their roles

## See Also
- [[The Veritists]]: The order Acolytes join
- [[Verithold]]: Where all training occurs
- [[Verisol]]: Examination required for entry
- [[Recordants]]: What successful Acolytes become
- [[Provosts]]: Masters who train Acolytes
- [[Veritown]]: Where failed Acolytes may end up`,

      sections: [
        {
          heading: 'The Five Years',
          content: 'Intensive training in history, memory, and interview techniques',
          order: 1
        },
        {
          heading: 'Curriculum',
          content: 'Reading, writing, history, memory, ethics, practical skills',
          order: 2
        },
        {
          heading: 'The Transformation',
          content: 'From previous identity to Veritist in training',
          order: 3
        }
      ]
    },
    
    {
      type: 'mysteria',
      title: 'Recordants',
      subtitle: 'Second Rank of the Veritists - Traveling Chroniclers',
      category: 'Customs & Institutions',
      tags: ['recordants', 'veritists', 'chroniclers', 'chronicle-chambers', 'corruption', 'travel'],
      era: 'Ancient - Current',
      
      content: `**Recordants** are the second rank of [[The Veritists]], traveling chroniclers who visit noble houses periodically to record births, deaths, marriages, and significant events. They work in [[Chronicle Chambers]] and serve as the visible face of the order throughout the realm.

## Function and Duties

### Primary Responsibilities
Recordants travel circuits visiting assigned houses to:
- Conduct formal interviews with family members
- Record births, deaths, marriages in official chronicles
- Verify current information against previous records
- Document significant events (successions, scandals, achievements)
- Maintain continuity in each house's historical record
- Update [[Chronicle Chambers]] with new volumes

### The Circuit System
Each Recordant assigned:
- A specific region or set of houses
- Regular visitation schedule (annually, bi-annually, or as needed)
- Responsibility for multiple houses' chronicles
- Travel between assignments with materials
- Periodic returns to [[Verithold]] to submit records

## Advancement from Acolyte

### Requirements
[[Acolytes]] become Recordants by:
- Successfully completing five-year training
- Passing final comprehensive examinations
- Demonstrating sufficient skill and knowledge
- Receiving assignment to a circuit
- Taking formal vows of neutrality and accuracy

### The Reality Shock
New Recordants quickly discover:
- Training emphasized ideals; reality is messier
- Some senior Recordants accept payments and gifts
- Wealthy houses attempt (often successfully) to influence emphasis
- The gap between "neutral chronicler" and political reality
- Their own susceptibility to corruption

## The Work Process

### Arriving at a House
When visiting noble houses:
1. Recordant arrives and presents credentials
2. Given access to [[Chronicle Chambers]]
3. Reviews previous records for continuity
4. Requests interviews with relevant family members
5. Conducts formal sessions recording information
6. Updates chronicles with new entries
7. Seals and stores updated volumes
8. Departs for next assignment

### The Formal Interview
Conducted in [[Chronicle Chambers]]:
- Recordant controls the space and questioning
- Subject sits on Witness Bench
- Formal tone maintained throughout
- Questions prepared based on previous records
- Responses recorded in preliminary notes
- Follow-up interviews if needed for clarification

### Between Visits
Houses experience:
- Births and deaths that must wait for recording
- Events that will eventually be chronicled
- Anxiety about how events will be written
- Preparation for the Recordant's next visit
- Attempts to shape the narrative in advance

## The Temptation and the Fall

### Sources of Corruption

**The Gifts**
- "Hospitality" far beyond necessity
- Fine quarters and excellent food
- Personal gifts "in appreciation"
- Money offered "for travel expenses"
- Promises of future consideration

**The Pressure**
- Subtle hints about how to emphasize events
- Requests to downplay embarrassments
- Suggestions about what to include or omit
- Implicit threats about future cooperation
- Social pressure during extended stays

**The Rationalization**
- "I'm still recording the truth, just emphasizing differently"
- "Important families deserve better representation"
- "Omitting minor details isn't lying"
- "Everyone does it"
- "I need to survive financially"

### Degrees of Corruption

**Minor Shadings**
- Emphasis on favorable interpretations
- Downplaying of minor embarrassments
- Flattering descriptions of appearance and character
- Omission of trivial but unflattering details

**Moderate Compromise**
- Selective inclusion based on payment
- "Forgetting" to record certain events
- Emphasizing one heir's virtues over siblings'
- Accepting substantial gifts for favorable chronicling

**Severe Violations**
- Complete omission of major scandals
- False dating of events
- Invented accomplishments
- Destruction of previous unfavorable records
- (Rare, as this destroys individual credibility and order's reputation)

## Resistance and Integrity

### Those Who Maintain Standards
Not all Recordants succumb:
- Some maintain the ideals from [[Acolyte]] training
- Others resist specific attempts at influence
- A few become known for incorruptibility
- Some see themselves as genuinely neutral
- Others simply don't trust houses enough to accept bribes

### The Cost
Maintaining integrity can mean:
- Poorer treatment at assigned houses
- Requests for reassignment from wealthy families
- Social isolation from corrupted peers
- Financial hardship compared to compromised colleagues
- Satisfaction of maintaining professional standards

### The Spectrum
Most Recordants fall somewhere between:
- Complete corruption (rare)
- Perfect integrity (rare)
- Pragmatic compromise (common)
- Selective resistance (common)
- Case-by-case decisions based on circumstances

## Life as a Recordant

### The Travel
Recordants spend much time:
- On roads between assignments
- At inns and way stations
- Carrying traveling copies of records
- Protecting materials from weather and thieves
- Managing the physical demands of constant movement

### The Isolation
Despite constant contact with people:
- Professional distance from all houses
- Cannot form true friendships (neutrality requires it)
- Separated from [[Verithold]] community
- Fellow Recordants met only occasionally
- Lonely existence despite public role

### The Status
Recordants occupy unusual social position:
- Above common folk in education and authority
- Below nobility in birth and wealth
- Respected for role but not loved
- Feared for power to record permanently
- Neither peasant nor noble

## Relationship with Noble Houses

### Necessary Cooperation
Houses must:
- Grant access to [[Chronicle Chambers]]
- Provide subjects for interviews
- Supply materials (parchment, ink)
- Offer hospitality during visits
- Accept Recordant authority over chronicles

### Mutual Dependence
- Houses need legitimate records
- Recordants need cooperation and support
- Neither can function without the other
- Creates complex power dynamics
- Enables corruption on both sides

## Eventually: Return to Verithold

### Becoming Provosts
Some Recordants eventually:
- Called back to [[Verithold]] to become [[Provosts]]
- Return with years of practical experience
- Bring knowledge of how the order really functions
- May enforce standards or perpetuate corruption
- Become masters training new [[Acolytes]]

### Selection Criteria
Advancement to [[Provosts]] based on:
- Years of service
- Quality of work
- Political connections
- Available positions
- Sometimes merit, sometimes favor

## Cultural Significance

### The Visible Face
Recordants are:
- Most nobles' only contact with [[The Veritists]]
- Representatives of institutional authority
- Physical embodiment of "it will be remembered"
- Symbols of historical judgment
- Connection between houses and [[Verithold]]

### The Mystique
Despite knowing Recordants as individuals:
- Houses maintain formal respect
- The office carries weight beyond the person
- Professional distance preserved
- Power dynamic remains clear
- Authority of [[Verithold]] represented

## See Also
- [[The Veritists]]: The order Recordants serve
- [[Chronicle Chambers]]: Where Recordants conduct their work
- [[Acolytes]]: What Recordants once were
- [[Provosts]]: What successful Recordants may become
- [[Verithold]]: Central institution to which they report
- All major noble houses: Recordants visit them regularly`,

      sections: [
        {
          heading: 'The Circuit System',
          content: 'Traveling between assigned houses to record histories',
          order: 1
        },
        {
          heading: 'The Formal Interview',
          content: 'How official chronicling is conducted',
          order: 2
        },
        {
          heading: 'The Temptation',
          content: 'Sources and degrees of corruption',
          order: 3
        },
        {
          heading: 'Resistance',
          content: 'Those who maintain integrity and the cost',
          order: 4
        }
      ]
    },
    
    {
      type: 'mysteria',
      title: 'Provosts',
      subtitle: 'Third Rank of the Veritists - Masters and Archivists',
      category: 'Customs & Institutions',
      tags: ['provosts', 'veritists', 'verithold', 'archives', 'masters', 'power'],
      era: 'Ancient - Current',
      
      content: `**Provosts** are the third and highest rank of [[The Veritists]], masters who remain at [[Verithold]] as guardians of the archives, trainers of [[Acolytes]], administrators of the [[Verisol]], and de facto rulers of the order.

## Roles and Responsibilities

### Guardians of the Archives
Provosts protect and maintain [[Verithold]]'s vast collections:
- Organize and catalog centuries of records
- Preserve ancient documents from decay
- Control access to the archives
- Decide what becomes "official" history
- Authenticate submissions from [[Recordants]]

### Trainers of Acolytes
Provosts serve as teachers:
- Instruct [[Acolytes]] in all subjects
- Conduct examinations and evaluations
- Determine who advances and who fails
- Shape the next generation's understanding
- Pass on both ideals and practical realities (selectively)

### Administrators of the Verisol
Provosts control entry to the order:
- Design and administer the [[Verisol]] examination
- Judge who has sufficient aptitude
- Present "The Choice" to those who pass
- Control the number entering training
- Influence the order's future composition

### Institutional Leadership
Provosts collectively govern [[The Veritists]]:
- Determine policies and practices
- Assign [[Recordants]] to circuits
- Handle disputes and disciplinary matters
- Manage relationships with noble houses
- Preserve the order's power and reputation

## Path to Provosthood

### Selection from Recordants
Not all [[Recordants]] become Provosts:
- Only some are called back to [[Verithold]]
- Years of field experience required
- Vacancy in Provost ranks must exist
- Selection based on various criteria (see below)

### Selection Criteria
Advancement depends on:
- Years of competent service
- Quality of chronicling work
- Political connections within the order
- Relationships with powerful houses
- Specialized knowledge or skills
- Personal relationships with current Provosts
- Sometimes merit, often favor and politics

### The Return
Becoming a Provost means:
- Leaving the circuit permanently
- Settling at [[Verithold]] for remainder of life
- Shifting from field work to institutional power
- Trading travel and independence for influence and comfort
- Joining the order's inner circle

## The Reality They Know

### Beyond Idealism
Provosts fully understand:
- The gap between the order's ideals and actual practice
- How corruption functions in the field
- Which houses are most influential
- Where the real power lies
- How to balance principles with pragmatism

### The Choices They Make
Individual Provosts vary in:
- Tolerance for corruption among [[Recordants]]
- Enforcement of standards
- Personal integrity
- Willingness to accept influence from houses
- Balance between order's ideals and practical politics

### The Spectrum
Provosts range from:
- Rigorous enforcers of standards (rare)
- Pragmatic managers of reality (common)
- Corrupt manipulators of records (exists but dangerous)
- True believers in the mission (some remain)
- Cynical power brokers (some become)

## Internal Politics

### Factional Divisions
Provosts often divide along lines of:
- **Purists** vs. **Pragmatists**: Ideals vs. practical compromise
- **Reformers** vs. **Traditionalists**: Change vs. continuity
- **Field Experience** vs. **Archive Scholars**: Different expertise
- **House Allegiances**: Some favor certain noble houses
- **Personal Rivalries**: Accumulated over decades

### Power Struggles
Competition for influence over:
- Training curriculum for [[Acolytes]]
- [[Recordant]] assignments to circuits
- Archive access and organization
- Relationships with noble houses
- Future direction of the order
- Selection of new Provosts

### Collective Decisions
Major choices require consensus:
- Changes to [[Verisol]] standards
- Disciplinary actions against [[Recordants]]
- Formal positions on historical disputes
- Relationships with specific houses
- Institutional policies

## The Knowledge They Guard

### The Complete Archive
Provosts have access to:
- Records from all houses across generations
- Patterns not visible to individual [[Recordants]]
- Contradictions between different accounts
- Suppressed information that didn't make official chronicles
- The full truth behind many sanitized histories

### Selective Revelation
Provosts control:
- What [[Acolytes]] learn during training
- What [[Recordants]] know about other houses
- What information is shared between houses
- What becomes "official" historical record
- What remains buried in the archives

### The Power of Knowing
This knowledge provides:
- Leverage in disputes between houses
- Understanding of long-term patterns
- Ability to connect events across generations
- Insight into current political situations
- Soft power through selective disclosure

## Life at Verithold

### Physical Comfort
Compared to [[Recordants]], Provosts enjoy:
- Permanent residence at [[Verithold]]
- Private chambers (not communal)
- Better food and accommodations
- No travel hardships
- Access to [[Veritown]]'s markets and comforts

### Intellectual Stimulation
Provosts spend time:
- Studying ancient records
- Debating historical interpretations
- Training the next generation
- Conducting research projects
- Writing scholarly works (sometimes)

### Social Isolation
Despite community at [[Verithold]]:
- Permanent separation from outside world
- Intense, sometimes fractious relationships with other Provosts
- Distance from family and previous life
- Immersion in institutional concerns
- Limited fresh perspectives

## Relationship with Other Ranks

### With Acolytes
Provosts serve as:
- Authority figures demanding respect
- Teachers of skills and knowledge
- Examiners determining advancement
- Models of what students may become
- Sometimes mentors, always superiors

### With Recordants
Provosts function as:
- Supervisors reviewing submitted work
- Decision-makers on assignments
- Judges of performance and complaints
- Sources of guidance and instruction
- Future peers (for those who will advance)

### With Each Other
Provosts experience:
- Collegial relationships (sometimes)
- Intense rivalries (often)
- Shared commitment to the order (usually)
- Factional alliances (frequently)
- Decades-long relationships (inevitably)

## Corruption and Compromise

### Indirect Influence
Provosts may accept:
- "Donations" to [[Verithold]] from grateful houses
- Personal gifts and benefits
- Promises of consideration for [[Acolytes]] from specific families
- Pressure to assign favorable [[Recordants]] to certain houses
- Suggestions about how to interpret disputed histories

### The Justifications
- "Supporting the institution's financial needs"
- "Maintaining necessary relationships with noble houses"
- "Being realistic about political realities"
- "Everyone does it"
- "The core records remain accurate"

### The Damage
When Provosts are too corrupted:
- Standards for [[Recordants]] weaken
- [[Acolytes]] trained in cynicism
- Order's reputation suffers
- Legitimacy of all records questioned
- Power of the institution erodes

## Cultural Significance

### The Inner Circle
Provosts represent:
- The order's true authority
- Keepers of complete historical knowledge
- Masters of institutional memory
- Power that outlasts individual nobles
- Continuity across generations

### The Hidden Power
Most people never meet Provosts:
- Common folk unaware they exist
- Nobles deal primarily with [[Recordants]]
- Provosts' influence exerted indirectly
- True power structure largely invisible
- Myths and mystique maintained by distance

## See Also
- [[The Veritists]]: The order Provosts lead
- [[Verithold]]: Where Provosts reside permanently
- [[Recordants]]: Those Provosts once were and now supervise
- [[Acolytes]]: Students Provosts train and examine
- [[Verisol]]: Examination Provosts administer
- [[Chronicle Chambers]]: System Provosts oversee from afar`,

      sections: [
        {
          heading: 'Guardians of Knowledge',
          content: 'Control archives, train Acolytes, administer Verisol',
          order: 1
        },
        {
          heading: 'Internal Politics',
          content: 'Factional divisions and power struggles',
          order: 2
        },
        {
          heading: 'The Knowledge They Guard',
          content: 'Complete archives and selective revelation',
          order: 3
        },
        {
          heading: 'Corruption and Compromise',
          content: 'Indirect influence and justifications',
          order: 4
        }
      ]
    }
  ]
};

export default VERITISTS_CODEX_DATA;
