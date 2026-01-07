/**
 * CANONICAL CODEX SEED DATA
 * Source: House Wilfrey Datasheet
 * 
 * This file contains all canonical Codex entries extracted from the House Wilfrey
 * datasheet. These entries are "fully loaded" with integration hooks for future
 * features, even if those features aren't implemented yet.
 * 
 * INTEGRATION HOOKS INCLUDED:
 * - personId: Links to Person entity (future: click to view in family tree)
 * - houseId: Links to House entity (future: display heraldry, view family tree)
 * - locationId: Links to Location entity (future: map integration)
 * - eventId: Links to Event entity (future: timeline views)
 * - [[Wiki Links]]: Markdown syntax for cross-referencing (Phase 2)
 * - tags: Array for filtering/categorization
 * - era: Time period for timeline features
 * - sections: Structured content for advanced display
 * 
 * IMPORT INSTRUCTIONS:
 * Use the import-seed-data.js script to load this data into your database.
 */

export const CODEX_SEED_DATA = {
  
  // ============================================================================
  // HOUSES (9 entries)
  // ============================================================================
  
  houses: [
    {
      type: 'house',
      title: 'House Wilfrey',
      subtitle: 'The Silver Lords of Breakmount',
      category: 'Major Houses',
      tags: ['wilfrey', 'major-house', 'silver', 'breakmount'],
      era: 'Current Era',
      houseId: null, // HOOK: Set when house is created in main database
      
      content: `**House Wilfrey** is a high-ranking noble family ruling over a massive landmass divided into four main seats of power. Their wealth derives primarily from silver mines and semi-precious metal deposits at their principal seat, [[Breakmount Castle]].

## The Four Seats

House Wilfrey's power is distributed across four regional seats, each with distinct characteristics and resources:

### [[Breakmount Castle]] (Principal Seat)
The ancestral seat built into [[Night Mountain]], controlling the silver mines that have kept House Wilfrey wealthy for generations. Center of the [[Fostering System]] and seat of the Lord of House Wilfrey.

### [[Bramblehall]]
A massive wooden holdfast on the forest's edge, home to woodsmen and woods folk. The most insular of the four seats, maintaining old traditions disconnected from wider politics.

### [[Riverhead]]
Strategic castle commanding a major river bend and controlling a crucial bridge. Supplies half the food for House Wilfrey's entire region, giving the Riverhead Wilfreys significant political leverage.

### [[Fourhearth Castle]]
Coastal castle with major port town. The most cosmopolitan of the four seats, connected to wider world through trade and seafaring.

## Governance Structure

The four seats operate with significant autonomy while bound together through:
- **[[The Fostering System]]**: Heirs from all seats raised together at Breakmount
- **Economic Interdependence**: No single seat is self-sufficient
- **[[House Wilfson]]**: Premier cadet branch serving as Master of Silver Mines and Castellan
- **Council Authority**: Joint decisions on major house matters

## Cadet Branches

House Wilfrey has spawned numerous cadet branches, following the naming pattern "Wilf-" + descriptor. These include:

**Breakmount Region:**
- [[House Wilfson]] (Premier cadet branch)
- [[House Wilfriend]]
- [[House Wilfsbane]]

**Bramblehall Region:**
- [[House Wilfbauer]]
- [[House Wilfbole]]
- [[House Wilfbark]]

**Riverhead Region:**
- [[House Wilfriver]]

**Fourhearth Region:**
- [[House Wilfour]]
- [[House Wilfsands]]

## Historical Significance

House Wilfrey's history is marked by both unity and division. The most famous schism occurred with [[The Old Right]] scandal, which led to the founding of [[House Wilson]] approximately 250 years ago. This event still shapes house politics and serves as a cautionary tale about the tension between loyalty and love.

## Political Dynamics

Internal tensions arise from:
- Riverhead's food production used as political leverage
- Bramblehall's isolation vs. Fourhearth's cosmopolitanism
- Cadet branches competing for marriages and influence
- Debates over centralized vs. regional authority

Despite these tensions, the fostering system and economic interdependence have kept House Wilfrey unified for centuries.`,

      sections: [
        {
          heading: 'The Four Seats',
          content: 'Geographic distribution of power across mountain, forest, river, and coast',
          order: 1
        },
        {
          heading: 'Cadet Branches',
          content: 'Nine named cadet houses with regional variants',
          order: 2
        },
        {
          heading: 'Historical Events',
          content: 'The Old Right scandal and House Wilson founding',
          order: 3
        }
      ]
    },
    
    {
      type: 'house',
      title: 'House Wilfson',
      subtitle: 'Premier Cadet Branch - Masters of the Silver Mines',
      category: 'Cadet Houses',
      tags: ['wilfson', 'cadet-house', 'breakmount', 'silver-mines'],
      era: 'Current Era',
      houseId: null, // HOOK: Set when house is created
      
      content: `**House Wilfson** ("Wilf-Son" = "Son of Wilf") is the original and premier cadet branch of [[House Wilfrey]], holding preeminence over all other cadet branches.

## Hereditary Positions

House Wilfson holds two critical hereditary titles that make them essential to House Wilfrey's power:

### Master of the Silver Mines
Control over House Wilfrey's primary wealth source - the silver mines of [[Breakmount Castle]]. This position gives House Wilfson significant economic influence despite being a cadet branch.

### Castellan of Breakmount
Responsible for day-to-day governance of [[Breakmount Castle]] when the Lord is absent or during minorities. This makes House Wilfson the de facto administrators of the principal seat.

## The Burden of Loyalty

House Wilfson's history is forever marked by [[The Old Right]] scandal and the tragedy of [[Baudin Wilfson]]. The choice made by [[Colard Wilfson]] to kill his brother and maintain loyalty to House Wilfrey was vindicated - 250 years later, House Wilfson still serves in their hereditary positions.

They are forever marked as both:
- **Loyal Servants**: Proof that loyalty to the main house is rewarded with continuity and trust
- **Kinslayers**: The stain of brother killing brother for duty's sake

## Current Status

House Wilfson continues to serve House Wilfrey faithfully, their loyalty purchased at the price of blood. They stand as living proof that choosing duty over family bonds - no matter how agonizing - can preserve a house's position for centuries.

The choice stands as both warning and example to all cadet branches: loyalty is rewarded, but the price may be your soul.`,

      sections: [
        {
          heading: 'Hereditary Positions',
          content: 'Master of Silver Mines and Castellan of Breakmount',
          order: 1
        },
        {
          heading: 'Historical Tragedy',
          content: 'The Old Right and the kinslaying that defined the house',
          order: 2
        }
      ]
    },
    
    {
      type: 'house',
      title: 'House Wilfriend',
      subtitle: 'Cadet Branch of Breakmount',
      category: 'Cadet Houses',
      tags: ['wilfriend', 'cadet-house', 'breakmount'],
      era: 'Current Era',
      houseId: null, // HOOK: Set when created
      
      content: `**House Wilfriend** is a cadet branch of [[House Wilfrey]] based in the Breakmount region.

*Further details to be documented.*`
    },
    
    {
      type: 'house',
      title: 'House Wilfsbane',
      subtitle: 'Cadet Branch of Breakmount',
      category: 'Cadet Houses',
      tags: ['wilfsbane', 'cadet-house', 'breakmount'],
      era: 'Current Era',
      houseId: null,
      
      content: `**House Wilfsbane** is a cadet branch of [[House Wilfrey]] based in the Breakmount region.

*Further details to be documented.*`
    },
    
    {
      type: 'house',
      title: 'House Wilfbauer',
      subtitle: 'Woodland Cadet Branch',
      category: 'Cadet Houses',
      tags: ['wilfbauer', 'cadet-house', 'bramblehall', 'woodland'],
      era: 'Current Era',
      houseId: null,
      
      content: `**House Wilfbauer** is a cadet branch of [[House Wilfrey]] based in the [[Bramblehall]] region. Like all Bramblehall cadet branches, their name reflects the woodland culture of the region.

*Further details to be documented.*`
    },
    
    {
      type: 'house',
      title: 'House Wilfbole',
      subtitle: 'Woodland Cadet Branch',
      category: 'Cadet Houses',
      tags: ['wilfbole', 'cadet-house', 'bramblehall', 'woodland'],
      era: 'Current Era',
      houseId: null,
      
      content: `**House Wilfbole** (bole = tree trunk) is a cadet branch of [[House Wilfrey]] based in the [[Bramblehall]] region. Like all Bramblehall cadet branches, their name reflects the woodland culture of the region.

*Further details to be documented.*`
    },
    
    {
      type: 'house',
      title: 'House Wilfbark',
      subtitle: 'Woodland Cadet Branch',
      category: 'Cadet Houses',
      tags: ['wilfbark', 'cadet-house', 'bramblehall', 'woodland'],
      era: 'Current Era',
      houseId: null,
      
      content: `**House Wilfbark** is a cadet branch of [[House Wilfrey]] based in the [[Bramblehall]] region. Like all Bramblehall cadet branches, their name reflects the woodland culture of the region.

*Further details to be documented.*`
    },
    
    {
      type: 'house',
      title: 'House Wilfriver',
      subtitle: 'Riverhead Cadet Branch',
      category: 'Cadet Houses',
      tags: ['wilfriver', 'cadet-house', 'riverhead'],
      era: 'Current Era',
      houseId: null,
      
      content: `**House Wilfriver** is a cadet branch of [[House Wilfrey]] based in the [[Riverhead]] region.

## Reputation

House Wilfriver holds moderate political standing but bears ill repute generally within House Wilfrey's lands. The specific reasons for this poor reputation remain to be documented.

*Further details to be documented.*`
    },
    
    {
      type: 'house',
      title: 'House Wilfour',
      subtitle: 'Coastal Cadet Branch',
      category: 'Cadet Houses',
      tags: ['wilfour', 'cadet-house', 'fourhearth', 'coastal'],
      era: 'Current Era',
      houseId: null,
      
      content: `**House Wilfour** is a cadet branch of [[House Wilfrey]] based in the [[Fourhearth Castle]] region. Their name plays on "four" from Fourhearth, reflecting coastal naming traditions.

*Further details to be documented.*`
    },
    
    {
      type: 'house',
      title: 'House Wilfsands',
      subtitle: 'Coastal Cadet Branch',
      category: 'Cadet Houses',
      tags: ['wilfsands', 'cadet-house', 'fourhearth', 'coastal'],
      era: 'Current Era',
      houseId: null,
      
      content: `**House Wilfsands** is a cadet branch of [[House Wilfrey]] based in the [[Fourhearth Castle]] region. Their coastal-themed name reflects the maritime culture of Fourhearth.

*Further details to be documented.*`
    }
  ],
  
  // ============================================================================
  // LOCATIONS (5 entries)
  // ============================================================================
  
  locations: [
    {
      type: 'location',
      title: 'Breakmount Castle',
      subtitle: 'Principal Seat of House Wilfrey',
      category: 'Castles & Fortifications',
      tags: ['breakmount', 'castle', 'silver', 'night-mountain', 'principal-seat'],
      era: 'Ancient - Current',
      locationId: null, // HOOK: For future map integration
      houseId: null, // HOOK: Link to House Wilfrey when created
      
      content: `**Breakmount Castle** is the principal seat of [[House Wilfrey]], built into and upon [[Night Mountain]] (also called "the Nightmount" in local usage).

## Architecture

This massive and ancient castle appears to be cut into the mountain itself, a feat of engineering that speaks to its extreme age and the ambition of its builders. The integration of natural rock formations with constructed fortifications makes Breakmount nearly impregnable.

## The Silver Mines

Connected to the castle in various ways, the silver mines have kept [[House Wilfrey]] consistently wealthy for many generations. Control of these mines is the hereditary right of [[House Wilfson]] through their title of Master of the Silver Mines.

## Semi-Precious Metals

Beyond silver, the surrounding mountainous area yields copper and tin deposits, providing additional economic resources and raw materials for metalworking.

## Strategic Importance

As the principal seat, Breakmount serves multiple critical functions:

### Seat of the Lord
The Lord of House Wilfrey rules from Breakmount, making it the political center of all Wilfrey lands.

### Center of the Fostering System
All heirs of the four seats and cadet branches are sent to Breakmount at age 5 to be fostered together until age 16. This makes Breakmount the social and educational center that binds House Wilfrey's far-flung territories together.

### Economic Heart
The silver wealth flowing from Breakmount funds House Wilfrey's power and influence throughout the realm.

### Day-to-Day Governance
When the Lord is absent or during minorities, [[House Wilfson]] serves as Castellan, managing the castle's operations.

## Historical Significance

[[Night Mountain]] has its own storied history (details to be developed), suggesting Breakmount may have been built on a site of ancient importance.

The castle has witnessed pivotal moments in House Wilfrey's history, including [[The Old Right]] scandal that led to [[Baudin Wilfson]]'s death and the founding of [[House Wilson]].`,

      sections: [
        {
          heading: 'The Silver Mines',
          content: 'Source of House Wilfrey wealth for generations',
          order: 1
        },
        {
          heading: 'The Fostering System',
          content: 'Educational and political center for all heirs',
          order: 2
        },
        {
          heading: 'Strategic Functions',
          content: 'Political, economic, and social hub',
          order: 3
        }
      ]
    },
    
    {
      type: 'location',
      title: 'Bramblehall',
      subtitle: 'Woodland Seat of House Wilfrey',
      category: 'Castles & Fortifications',
      tags: ['bramblehall', 'holdfast', 'forest', 'woodland', 'regional-seat'],
      era: 'Ancient - Current',
      locationId: null, // HOOK: Map integration
      houseId: null, // HOOK: Link to House Wilfrey
      
      content: `**Bramblehall** (also considered: Hardwood Hall) is a regional seat of [[House Wilfrey]], located at the edge of a vast forest.

## Architecture

A huge wooden holdfast with some stone elements, Bramblehall is built in harmony with its forest environment. The primary use of timber reflects both the available resources and the woodland culture of its people.

## The People

The seat is home to woodsmen and general woods folk - an insular population somewhat disconnected from the wider context of [[House Wilfrey]]'s realm. Of all four seats, Bramblehall maintains the strongest connection to old traditions and ways.

## Resources

- **Timber**: Primary export and building material
- **Forestry**: Sustainable woodland management
- **Hunting**: Both subsistence and sport

## Culture

Bramblehall stands in stark contrast to cosmopolitan [[Fourhearth Castle]]. While Fourhearth connects to the wider world, Bramblehall deliberately maintains its isolation and traditional ways.

This cultural independence sometimes creates tension with the other seats, but also preserves knowledge and customs that might otherwise be lost to time.

## The Fostering System

Heirs sent to do a season at Bramblehall learn:
- Forestry and timber management
- Hunting and woodland survival
- Leading insular, independent-minded people
- Woodland warfare tactics

**Best Seasons**: Spring and autumn for logging; winter for hunting

## Cadet Branches

All Bramblehall-region cadet branches bear woodland-themed names:
- [[House Wilfbauer]]
- [[House Wilfbole]] (bole = tree trunk)
- [[House Wilfbark]]`,

      sections: [
        {
          heading: 'Woodland Culture',
          content: 'Insular traditions and forest-based economy',
          order: 1
        },
        {
          heading: 'Strategic Learning',
          content: 'Training ground for future lords in woodland leadership',
          order: 2
        }
      ]
    },
    
    {
      type: 'location',
      title: 'Riverhead',
      subtitle: 'Strategic River Seat of House Wilfrey',
      category: 'Castles & Fortifications',
      tags: ['riverhead', 'castle', 'river', 'food', 'strategic', 'regional-seat'],
      era: 'Ancient - Current',
      locationId: null, // HOOK: Map integration
      houseId: null, // HOOK: House Wilfrey
      
      content: `**Riverhead** is a regional seat of [[House Wilfrey]], a large castle situated on a landmass at a major bend in a large (yet unnamed) river that borders House Wilfrey's lands.

## Strategic Importance

Riverhead's position makes it one of the most strategically critical of the four seats:

### Commanding Views
The castle's location provides strategic views in all directions, making it nearly impossible to approach unseen.

### The Bridge
Controls a large defensible bridge spanning the river at its narrowest point (though still significantly wide). This bridge serves as:
- Key defensive chokepoint for House Wilfrey's borders
- Major trade route requiring toll payment
- Critical infrastructure for moving armies and supplies

### Border Defense
As a border castle on a major river, Riverhead serves as House Wilfrey's first line of defense against external threats from that direction.

## Economic Power

Riverhead's true strength lies in its agricultural output:

### Food Production
- Rich arable farmland surrounds the castle
- The river itself serves as a major food source
- **Supplies half the food for House Wilfrey's entire region**
- Generates surplus for trade

### Political Leverage

The Riverhead Wilfreys are keenly aware that food is power. During times of plenty, they leverage their agricultural dominance for political influence, often straining relationships with the wider house.

This creates ongoing tension - Riverhead is indispensable (you cannot rule without feeding your people), but their willingness to use food as leverage makes them simultaneously essential and resented.

## The Fostering System

Heirs sent to do a season at Riverhead learn:
- Harvest management
- Food storage and supply chain logistics
- Water management
- Bridge defense

**Best Seasons**: Late summer/autumn for harvest experience; winter for managing stores

## Political Dynamics

The paradox of Riverhead:
- **Indispensable**: No single seat can match their food production
- **Problematic**: Their political maneuvering creates friction
- **Vulnerable**: Despite their leverage, they cannot stand alone militarily
- **Connected**: The fostering system ensures Riverhead heirs form bonds with other seats

This tension between independence and interdependence defines Riverhead's role in House Wilfrey's politics.`,

      sections: [
        {
          heading: 'Strategic Position',
          content: 'River bend, bridge control, border defense',
          order: 1
        },
        {
          heading: 'Food as Power',
          content: 'Agricultural dominance and political leverage',
          order: 2
        },
        {
          heading: 'Internal Tensions',
          content: 'Essential but difficult political relationship',
          order: 3
        }
      ]
    },
    
    {
      type: 'location',
      title: 'Fourhearth Castle',
      subtitle: 'Coastal Seat of House Wilfrey',
      category: 'Castles & Fortifications',
      tags: ['fourhearth', 'castle', 'port', 'trade', 'coastal', 'regional-seat'],
      era: 'Ancient - Current',
      locationId: null, // HOOK: Map integration
      houseId: null, // HOOK: House Wilfrey
      
      content: `**Fourhearth Castle** is a regional seat of [[House Wilfrey]], a large castle on the coastline with a major surrounding port town.

## Origin of the Name

The castle derives its humble name from its historical beginning as a small hall with four hearths. This modest origin story is deliberately maintained despite the castle's current grandeur - a reminder that even great powers have small beginnings.

## The Port Town

Fourhearth is distinguished from the other seats by its extensive urban development. The port town surrounding the castle is a bustling center of:
- Maritime trade
- Shipbuilding
- International commerce
- Cultural exchange

## The People

The Fourhearth Wilfreys are captains and traders - seafaring folk connected to the wider world. They represent the cosmopolitan face of [[House Wilfrey]], often serving as diplomats and traders due to their experience with foreign customs and languages.

## Culture

Of all four seats, Fourhearth is the **most connected to the wider world and current events** - the exact opposite of [[Bramblehall]]'s deliberate insularity.

This creates both opportunities and tensions:
- **Opportunities**: Access to foreign goods, news, alliances, and innovations
- **Tensions**: Sometimes viewed with suspicion by more traditional Wilfreys; their cosmopolitan outlook can conflict with old ways

## Strengths

- **Trade Networks**: Extensive connections across seas
- **Naval Power**: Fleet of trading vessels that can be converted for war
- **Information**: First to hear news from abroad
- **Wealth**: Port duties and trade profits supplement House Wilfrey's silver wealth

## The Fostering System

Heirs sent to do a season at Fourhearth learn:
- Sailing and ship captaincy
- Trade negotiations
- Port management
- Navigation and weather reading

**Best Seasons**: Spring/summer for active sailing; autumn for trade winds

## Historical Significance

Fourhearth was the seat of [[Lennis Wilfrey]], whose love for [[Nivette Wilfson]] and defiance of the council led to [[The Old Right]] scandal. This connection to such a pivotal house tragedy adds layers to Fourhearth's history.

## Cadet Branches

Fourhearth cadet branches bear coastal-themed names:
- [[House Wilfour]] (playing on "four")
- [[House Wilfsands]]`,

      sections: [
        {
          heading: 'Maritime Power',
          content: 'Trade, seafaring, and naval capabilities',
          order: 1
        },
        {
          heading: 'Cosmopolitan Culture',
          content: 'Most worldly of the four seats',
          order: 2
        },
        {
          heading: 'Historical Connection',
          content: 'Seat of Lennis during The Old Right',
          order: 3
        }
      ]
    },
    
    {
      type: 'location',
      title: 'Night Mountain',
      subtitle: 'The Nightmount',
      category: 'Geographic Features',
      tags: ['night-mountain', 'nightmount', 'mountain', 'breakmount', 'ancient'],
      era: 'Ancient - Current',
      locationId: null, // HOOK: Map integration
      
      content: `**Night Mountain** (also called "the Nightmount" in local usage) is the mountain upon which [[Breakmount Castle]] is built.

## Ancient Significance

The mountain has its own storied history that predates [[House Wilfrey]]'s castle. While these tales remain to be fully documented, their existence suggests Night Mountain held importance long before the Wilfreys claimed it.

## The Castle Integration

[[Breakmount Castle]] is not merely built on the mountain but appears to be cut into the mountain itself, suggesting either:
- Extremely skilled stonemasons working over generations
- Ancient foundations predating current construction
- Natural cave systems expanded and fortified
- Some combination of all three

## The Silver Mines

The silver deposits that have enriched House Wilfrey for generations run through Night Mountain's depths. The mines connect to [[Breakmount Castle]] in various ways, creating a labyrinthine network beneath the mountain.

## Local Culture

The local name "Nightmount" suggests the mountain holds significance in regional folklore and daily life beyond its role as the site of the castle.

*Further historical details to be documented.*`,

      sections: [
        {
          heading: 'Ancient History',
          content: 'Predates House Wilfrey; storied past to be explored',
          order: 1
        },
        {
          heading: 'The Silver Veins',
          content: 'Source of House Wilfrey wealth',
          order: 2
        }
      ]
    }
  ],
  
  // ============================================================================
  // EVENTS (2 entries)
  // ============================================================================
  
  events: [
    {
      type: 'event',
      title: 'The Old Right',
      subtitle: 'The Scandal That Split a House',
      category: 'Historical Events',
      tags: ['old-right', 'scandal', 'tragedy', 'house-wilson', 'baudin', 'lennis'],
      era: '~250 Years Ago',
      eventId: null, // HOOK: Timeline integration
      
      content: `**The Old Right** is a historical scandal that occurred approximately 250 years ago, resulting in deaths, banishments, and the founding of [[House Wilson]]. The event continues to shape [[House Wilfrey]]'s politics and is taught to every generation of fosterlings as a cautionary tale.

## The Central Question

The scandal revolves around a fundamental question: **Does the council have the right to command marriage?**

This question, known as "The Old Right," gave the scandal its name and continues to be debated within House Wilfrey to this day.

## The Players

- **[[Lennis Wilfrey]]**: Young heir to [[Fourhearth Castle]]
- **[[Raylegh]]**: Mysterious woman of unknown house
- **[[The Old Knight]]**: Raylegh's elderly, wealthy betrothed
- **[[Baudin Wilfson]]**: Young Lord of [[House Wilfson]], fostering brother to Lennis
- **[[Nivette Wilfson]]**: Baudin's sister
- **[[Colard Wilfson]]**: Baudin's younger brother
- **The Council**: Gathered lords of House Wilfrey's seats and cadet branches

## The Scandal Unfolds

### The Night at the Festival

At a great festival, [[Lennis Wilfrey]], young heir to [[Fourhearth Castle]], met a beautiful woman who gave no house name. They spoke through the night, and before dawn, they shared a bed.

### The Revelation

The woman revealed herself as [[Raylegh]], betrothed to a wealthy old knight she did not love. She claimed:
- She was being forced into this marriage
- The old knight was three times her age
- She feared dying in childbirth
- Lennis was her only hope for escape

She begged Lennis to marry her instead.

### The Council Convenes

When Lennis sought approval to marry Raylegh:
- The council investigated her claims and found them true
- **However**: They discovered she had deliberately seduced Lennis knowing he was heir to Fourhearth
- The council concluded she was manipulating him to escape her arranged marriage
- Ancient law was invoked: Lennis must marry Raylegh or be stripped of his position as heir
- The vote was binding under House Wilfrey's traditional laws

## The Defiance

### Baudin's Choice

[[Baudin Wilfson]], barely into his lordship and fiercely loyal to his fostering brother, publicly supported Lennis:
- Argued that no council could command a man's heart
- Claimed that honor had many faces
- Declared the council's decision was tyranny dressed in tradition
- When the council would not bend, Baudin chose defiance over duty

### The Secret Marriage

In secret, Baudin arranged for his sister [[Nivette Wilfson]] to marry Lennis instead of Raylegh. The marriage was performed beyond the council's knowledge.

## The Consequences

### The Council's Rage

When discovered:
- Declared all three-Lennis, Baudin, and Nivette-banished from all House Wilfrey lands
- Their names were struck from the rolls of kinship
- Given no time to gather resources or support

### The Duel

[[Colard Wilfson]] challenged his brother Baudin for the dishonor brought to [[House Wilfson]].

**Motivations debated to this day:**
- Was it loyalty to House Wilfrey?
- Ambition for his brother's position?
- Genuine outrage at the betrayal?

**The outcome was swift:**
- Colard's blade found his brother's heart
- Baudin Wilfson fell, having ruled as Lord for less than two years
- Colard immediately became the new Lord Wilfson, restored to the main house's favor

### The Founding of House Wilson

Lennis and Nivette fled north. The king, hearing their tale (or seeing political opportunity), granted them:
- Leave to establish a new noble house
- Lands outside House Wilfrey's traditional territory

They took the name **Wilson** - close enough to "Wilfson" to claim lineage, different enough to mark independence.

## The Unanswered Questions

The songs and stories still ask:

**About Raylegh:**
- Was she a desperate girl grasping at life with the only agency she had?
- Or a manipulative schemer who destroyed houses for her own benefit?

**About Lennis:**
- Was he a victim of deception, seduced under false pretenses?
- Or a youth who simply refused to face his responsibilities?
- **Did he know Raylegh's true identity that night, or was he genuinely deceived?**

**About Baudin:**
- Was he a true brother unto death who honored fostering bonds above all?
- Or a fool who threw away his house and life for pride?

**About Colard:**
- Was he a loyal son who did what was necessary to restore family honor?
- Or a fratricide who killed his brother for ambition?

**About the Council:**
- Did they have the right to command marriage?
- Or did they overstep their authority?

**About Raylegh's Fate:**
- Did she marry the old knight anyway?
- Did she die in childbirth as she feared?
- **Does her child by Lennis exist somewhere with a potential claim?**

## The Legacy

### For House Wilfson
- Colard's choice vindicated - 250 years later, still serving as Master of Silver Mines and Castellan
- Forever marked as both loyal servants and kinslayers
- Proof that loyalty to the main house is rewarded with continuity and trust

### For House Wilson
- Successfully established as independent lords
- Gained their own lands and influence over 250 years
- Exist as both a rival and reminder of Breakmount's power limits
- Proof that defiance, while costly, can succeed

### Current Significance
- Taught to every generation of fosterlings as cautionary tale
- Demonstrates the fostering system both worked (created unbreakable bonds) and failed (those bonds defied the house)
- Reminder of council authority and its limits
- Used by different factions to argue for their positions
- **The existence of both houses 250 years later proves there was no single "right" answer**

## Related Events

See also: [[The Founding of House Wilson]] for the aftermath and establishment of the new house.`,

      sections: [
        {
          heading: 'The Scandal',
          content: 'Forbidden love and council authority',
          order: 1
        },
        {
          heading: 'The Tragedy',
          content: 'Brother kills brother; exile and founding',
          order: 2
        },
        {
          heading: 'The Questions',
          content: 'Moral ambiguities debated for 250 years',
          order: 3
        },
        {
          heading: 'The Legacy',
          content: 'How the event still shapes house politics',
          order: 4
        }
      ]
    },
    
    {
      type: 'event',
      title: 'The Founding of House Wilson',
      subtitle: 'Born of Blood and Defiance',
      category: 'Historical Events',
      tags: ['house-wilson', 'founding', 'exile', 'lennis', 'nivette', 'old-right'],
      era: '~250 Years Ago',
      eventId: null, // HOOK: Timeline integration
      
      content: `**The Founding of House Wilson** occurred approximately 250 years ago as the direct consequence of [[The Old Right]] scandal. The house was established by [[Lennis Wilfrey]] and [[Nivette Wilfson]] after their banishment from [[House Wilfrey]] lands.

## The Exile

Following the discovery of their secret marriage and the death of [[Baudin Wilfson]] in a duel with his brother:

### The Flight
- Lennis and Nivette fled north, carrying nothing but each other
- They bore the weight of Baudin's sacrifice - he had died defending their marriage
- They were houseless, landless, with only their names and the clothes on their backs

## Royal Favor

### The King's Grant

The couple found welcome at the royal court. The king, hearing their tale (or perhaps seeing political opportunity), granted them:
- Leave to establish a new noble house
- Lands outside of House Wilfrey's traditional territory
- Royal recognition and protection

## The Name "Wilson"

The choice of name was deliberate and meaningful:

**Wilson** = Close enough to "Wilfson" to:
- Claim their lineage as descendants of Wilfrey
- Maintain connection to their heritage
- Assert legitimacy through blood

**Wilson** = Different enough to:
- Mark their independence from House Wilfrey
- Signal a break from the main house
- Establish a new identity

## The Foundation

The house was founded on:
- **Scandal**: Born from defiance of council authority
- **Blood**: [[Baudin Wilfson]]'s death made the founding possible
- **Sacrifice**: The price paid by a fostering brother
- **Defiance**: Rejection of forced marriage and council control
- **Love**: The relationship between Lennis and Nivette

## 250 Years Later

### Success and Survival
- Established themselves as independent lords
- Gained their own lands, resources, and influence
- Exist as both rival and reminder of Breakmount's power limits
- Continued existence proves that defiance, while costly, can succeed

### The Relationship with House Wilfrey

Current relationships between House Wilfrey and House Wilson remain undefined. Questions include:
- Do they maintain diplomatic relations?
- Has there been conflict in the intervening centuries?
- Have there been marriages or alliances?
- Do they still view each other as kin, or as separate houses entirely?

## The Meaning

House Wilson's founding represents a fundamental tension in feudal society:
- **Individual vs. Institution**: Personal desire against house authority
- **Love vs. Duty**: Heart against obligation
- **Loyalty vs. Obedience**: Supporting a friend against the system
- **Authority vs. Autonomy**: Who has the right to command marriage?

The fact that House Wilson survived and thrived suggests that defiance of unjust authority - even when it costs everything - can ultimately succeed.

## See Also

- [[The Old Right]]: The scandal that led to the founding
- [[Baudin Wilfson]]: The brother who died defending the marriage
- [[Lennis Wilfrey]]: Founder and first Lord of House Wilson
- [[Nivette Wilfson]]: Co-founder and first Lady of House Wilson
- [[Colard Wilfson]]: The kinslayer whose choice preserved House Wilfson`,

      sections: [
        {
          heading: 'The Exile',
          content: 'Flight north with nothing',
          order: 1
        },
        {
          heading: 'Royal Grant',
          content: 'King establishes the new house',
          order: 2
        },
        {
          heading: 'The Name',
          content: 'Wilson - connection and independence',
          order: 3
        },
        {
          heading: '250 Years of Success',
          content: 'Proof that defiance can prevail',
          order: 4
        }
      ]
    }
  ],
  
  // ============================================================================
  // PERSONAGES (6 entries)
  // ============================================================================
  
  personages: [
    {
      type: 'personage',
      title: 'Lennis Wilfrey',
      subtitle: 'Founder of House Wilson',
      category: 'Historical Figures',
      tags: ['lennis', 'wilfrey', 'wilson', 'founder', 'old-right', 'fourhearth'],
      era: '~250 Years Ago',
      personId: null, // HOOK: Link to Person entity when/if created
      houseId: null, // HOOK: Originally House Wilfrey, later House Wilson
      
      content: `**Lennis Wilfrey** was the young heir to [[Fourhearth Castle]] approximately 250 years ago, whose defiance of council authority led to [[The Old Right]] scandal and the founding of [[House Wilson]].

## The Fateful Night

At a great festival, Lennis met a beautiful woman who gave no house name. They spoke through the night, and before dawn, they shared a bed. This single night would alter the course of two noble houses.

## The Woman's Revelation

The woman revealed herself as [[Raylegh]], betrothed to an old knight she did not love. She claimed she was being forced into marriage with a man three times her age, feared dying in childbirth, and begged Lennis to marry her instead - claiming he was her only hope for escape.

## The Council's Investigation

When Lennis sought approval to marry Raylegh:
- The council investigated and found her claims about the betrothal were true
- However, they concluded she had deliberately seduced Lennis knowing he was heir to Fourhearth
- They believed she was manipulating him to escape her arranged marriage
- Ancient law was invoked: Lennis must marry Raylegh or be stripped of his position as heir

## The Central Mystery

**Did Lennis know Raylegh's true identity that night, or was he genuinely deceived?**

This question remains unanswered. Was he:
- A victim of calculated seduction?
- A willing participant who later denied knowledge?
- Truly ignorant of her situation until morning?

The truth died with those who were there.

## The Defiance

Rather than marry Raylegh as commanded, Lennis:
- Accepted his fostering brother [[Baudin Wilfson]]'s support
- Married [[Nivette Wilfson]] in secret, defying the council
- Was banished from all House Wilfrey lands when discovered
- Fled north with Nivette, bearing the weight of Baudin's death

## Founder of House Wilson

With royal favor, Lennis established [[House Wilson]] with [[Nivette Wilfson]]:
- Granted lands outside House Wilfrey territory
- Chose the name "Wilson" to claim lineage while marking independence
- Built a new house from nothing, founded on scandal and blood

## The Questions That Remain

Songs and stories still debate Lennis's character:
- **Was he deceived?** A victim of Raylegh's manipulation under false pretenses?
- **Was he irresponsible?** A youth who refused to face the consequences of his actions?
- **Did he know?** Was his claim of ignorance a convenient lie?
- **Was he principled?** Standing against forced marriage regardless of the cost?

## Legacy

250 years later, [[House Wilson]] still exists, proof that Lennis's defiance - whatever its motivation - succeeded in establishing an independent house. His choice to defy the council rather than accept their command continues to inspire debate about authority, love, and duty.

## See Also
- [[The Old Right]]: The scandal he triggered
- [[Raylegh]]: The woman whose revelation changed everything
- [[Nivette Wilfson]]: His wife and co-founder of House Wilson
- [[Baudin Wilfson]]: The fostering brother who died for his choice
- [[The Founding of House Wilson]]: The aftermath of his exile`,

      sections: [
        {
          heading: 'The Scandal',
          content: 'One night that changed two houses',
          order: 1
        },
        {
          heading: 'The Mystery',
          content: 'What did he know, and when?',
          order: 2
        },
        {
          heading: 'The Founding',
          content: 'Exile to establishment of House Wilson',
          order: 3
        }
      ]
    },
    
    {
      type: 'personage',
      title: 'Raylegh',
      subtitle: 'The Woman Who Changed Everything',
      category: 'Historical Figures',
      tags: ['raylegh', 'mystery', 'old-right', 'scandal'],
      era: '~250 Years Ago',
      personId: null, // HOOK: Link if ever added to family tree
      
      content: `**Raylegh** is the mysterious woman whose single night with [[Lennis Wilfrey]] triggered [[The Old Right]] scandal and changed the fate of [[House Wilfrey]] forever.

## The Festival Meeting

At a great festival 250 years ago, Raylegh met [[Lennis Wilfrey]], heir to [[Fourhearth Castle]]. She gave no house name but spoke with him through the night. Before dawn, they shared a bed.

## The Morning Revelation

After their night together, Raylegh revealed:
- Her true identity and house (now unknown)
- She was betrothed to a wealthy old knight three times her age
- She was being forced into this marriage against her will
- She feared dying in childbirth
- She begged Lennis to marry her, calling him her only hope for escape

## The Council's Conclusion

When the council investigated:
- They confirmed her betrothal to the old knight was real
- They confirmed the age difference and wealth disparity
- **However**: They concluded she had deliberately seduced Lennis knowing he was heir to Fourhearth
- They believed she was manipulating him to escape her arranged marriage
- They saw her as the instigator of the scandal

## The Great Mystery

**Was Raylegh:**
- **A desperate woman** grasping at life with the only agency she had?
- **A manipulative schemer** who destroyed houses for her own benefit?
- **A victim** of circumstances who made the best choice available to her?
- **A calculating strategist** who used Lennis as a means of escape?

The truth depends on questions we cannot answer:
- Did she know Lennis was heir when she approached him?
- Was she truly ignorant, or did she research him beforehand?
- Did she lie about her fear of childbirth?
- Was the old knight as terrible as she claimed?

## What Happened to Her?

**The songs and histories do not say.**

Possible fates debated across 250 years:
- Did she marry the old knight anyway after Lennis was banished?
- Did she die in childbirth as she feared?
- Did she survive and marry someone else?
- **Does her child by Lennis exist somewhere with a potential claim to something?**
- Did she disappear from history entirely?

## The Child

If Raylegh was pregnant from her night with Lennis, questions multiply:
- Was the child raised as the old knight's heir?
- Does a bastard line exist with blood claim to both houses?
- Could this become a succession crisis centuries later?
- Was there even a child, or was pregnancy just a fear?

## Legacy

Raylegh's single night created:
- A house scandal that reverberates 250 years later
- The death of [[Baudin Wilfson]]
- The founding of [[House Wilson]]
- The kinslaying of [[Colard Wilfson]]
- Eternal debate about consent, manipulation, and agency

Whether victim or villain, her actions irrevocably changed House Wilfrey's history.

## See Also
- [[The Old Right]]: The scandal she triggered
- [[Lennis Wilfrey]]: The heir she approached
- [[The Old Knight]]: Her elderly betrothed`,

      sections: [
        {
          heading: 'The Revelation',
          content: 'Forced betrothal and plea for help',
          order: 1
        },
        {
          heading: 'The Mystery',
          content: 'Victim or manipulator?',
          order: 2
        },
        {
          heading: 'The Unknown Fate',
          content: 'What happened after?',
          order: 3
        },
        {
          heading: 'The Potential Child',
          content: 'Unresolved bloodline questions',
          order: 4
        }
      ]
    },
    
    {
      type: 'personage',
      title: 'Baudin Wilfson',
      subtitle: 'The Brother Who Chose Love Over Duty',
      category: 'Historical Figures',
      tags: ['baudin', 'wilfson', 'tragedy', 'old-right', 'kinslaying', 'loyalty'],
      era: '~250 Years Ago',
      personId: null, // HOOK: Link to Person entity
      houseId: null, // HOOK: House Wilfson
      
      content: `**Baudin Wilfson** was Lord of [[House Wilfson]] approximately 250 years ago, barely into his lordship when [[The Old Right]] scandal erupted. His choice to support his fostering brother over house authority cost him everything.

## The Fostering Bond

Baudin and [[Lennis Wilfrey]] were fostering brothers, raised together at [[Breakmount Castle]] from age 5 to 16 as part of [[The Fostering System]]. These bonds, forged over 11 years of shared childhood, were meant to unite House Wilfrey's leadership.

The system worked - perhaps too well.

## The Scandal Erupts

When the council commanded Lennis to marry [[Raylegh]] or lose his inheritance, Baudin publicly supported his fostering brother:
- Argued that no council could command a man's heart
- Claimed that honor had many faces
- Declared the council's decision was tyranny dressed in tradition
- When the council would not bend, **chose defiance over duty**

## The Secret Marriage

In an act of tremendous defiance, Baudin:
- Arranged for his sister [[Nivette Wilfson]] to marry Lennis in secret
- Performed the marriage beyond the council's knowledge
- Knowingly brought disgrace upon [[House Wilfson]]
- Chose love and loyalty to his fostering brother over his house's position

Some say Nivette loved Lennis already. Others claim she went willingly for her brother's sake. Either way, the vows were spoken in defiance of the council's authority.

## The Consequences

When the secret marriage was discovered:
- The council's rage was absolute
- All three-Lennis, Baudin, and Nivette-were banished from all House Wilfrey lands
- Their names were struck from the rolls of kinship
- They were given no time to gather resources or support

## The Duel

Baudin's younger brother [[Colard Wilfson]] challenged him for the dishonor brought to House Wilfson.

**The motivations remain debated:**
- Loyalty to House Wilfrey?
- Ambition for his brother's position?
- Genuine outrage at the betrayal of house trust?

**The outcome was swift:**
- Colard's blade found his brother's heart
- Baudin Wilfson fell, having ruled as Lord for **less than two years**
- He died having sacrificed his house, his title, and ultimately his life for the bonds of fostering

## The Questions

**Was Baudin:**
- **A true brother unto death** who honored fostering bonds above all else?
- **A fool** who threw away his house and life for pride?
- **A man of principle** standing against forced marriage and council tyranny?
- **A young lord** who didn't understand the consequences of his choices?

## The Tragedy

Baudin's death represents the ultimate failure and success of [[The Fostering System]]:

**Failure:**
- Created bonds so strong they defied house authority
- Led to kinslaying within House Wilfson
- Caused schism and founding of rival house

**Success:**
- Proved the bonds formed were unbreakable
- Demonstrated that fostering brothers truly become brothers
- Showed that love and loyalty could transcend political calculation

## Legacy

250 years later, [[House Wilfson]] still serves House Wilfrey faithfully - their loyalty purchased at the price of Baudin's blood. His choice stands as eternal reminder:
- Loyalty to the main house is rewarded with continuity
- Defiance, even for love, ends in death
- The fostering system creates bonds that can both unite and destroy

Baudin died defending his fostering brother's right to marry for love. Whether that makes him a hero or a fool depends on who tells the story.

## See Also
- [[The Old Right]]: The scandal that led to his death
- [[Colard Wilfson]]: The brother who killed him
- [[Lennis Wilfrey]]: The fostering brother he died defending
- [[Nivette Wilfson]]: His sister, married to Lennis
- [[House Wilfson]]: The house that survived his death
- [[The Fostering System]]: The bonds that led to tragedy`,

      sections: [
        {
          heading: 'The Fostering Bond',
          content: 'Brothers raised together at Breakmount',
          order: 1
        },
        {
          heading: 'The Defiance',
          content: 'Chose love over duty',
          order: 2
        },
        {
          heading: 'The Death',
          content: 'Killed by his brother after less than two years as Lord',
          order: 3
        },
        {
          heading: 'The Legacy',
          content: 'Hero or fool? The debate continues',
          order: 4
        }
      ]
    },
    
    {
      type: 'personage',
      title: 'Nivette Wilfson',
      subtitle: 'Co-Founder of House Wilson',
      category: 'Historical Figures',
      tags: ['nivette', 'wilfson', 'wilson', 'founder', 'old-right'],
      era: '~250 Years Ago',
      personId: null, // HOOK: Link to Person entity
      houseId: null, // HOOK: House Wilfson → House Wilson
      
      content: `**Nivette Wilfson** was the sister of [[Baudin Wilfson]], approximately 250 years ago. Her secret marriage to [[Lennis Wilfrey]] defied the council, led to her brother's death, and resulted in the founding of [[House Wilson]].

## The Secret Marriage

When the council commanded Lennis to marry [[Raylegh]] or lose his inheritance, Nivette's brother [[Baudin Wilfson]] arranged for her to marry Lennis in secret instead.

**The great mystery:** Did she go willingly?
- Some say Nivette loved Lennis already, having known him through the fostering system
- Others claim she went willingly for her brother Baudin's sake, sacrificing herself to save his fostering brother
- The truth, like so much about [[The Old Right]], remains unclear

Either way, the vows were spoken in defiance of the council's authority.

## The Banishment

When the secret marriage was discovered:
- All three-Lennis, Baudin, and Nivette-were banished from all House Wilfrey lands
- Their names were struck from the rolls of kinship
- They were given no time to gather resources or support
- They became houseless and landless

## The Flight

After Baudin's death in a duel with his brother [[Colard Wilfson]], Nivette and Lennis fled north:
- Carrying nothing but each other
- Bearing the weight of Baudin's sacrifice-he had died defending their marriage
- Houseless, landless, with only their names and the clothes on their backs

## Co-Founder of House Wilson

With royal favor, Nivette and Lennis established [[House Wilson]]:
- Granted lands outside House Wilfrey territory
- Given leave to establish a new noble house
- Chose the name "Wilson" to claim lineage while marking independence

Nivette became the first Lady of House Wilson, co-founder of a house born from scandal, defiance, blood, and the sacrifice of a brother.

## Legacy

250 years later, [[House Wilson]] still exists - proof that Nivette and Lennis's defiance succeeded in establishing an independent house.

Nivette's story raises questions that echo through the centuries:
- **Was she a willing participant** in the secret marriage, or a pawn in her brother's defiance?
- **Did she love Lennis**, or did she love her brother Baudin enough to sacrifice her own future?
- **How did she bear the weight** of knowing Baudin died for her marriage?
- **What kind of Lady** did she become, founding a house on such tragedy?

## See Also
- [[The Old Right]]: The scandal that changed her life
- [[Baudin Wilfson]]: Her brother who died defending her marriage
- [[Lennis Wilfrey]]: Her husband and co-founder
- [[The Founding of House Wilson]]: The house she helped establish
- [[Colard Wilfson]]: Her younger brother who killed Baudin`,

      sections: [
        {
          heading: 'The Secret Marriage',
          content: 'Love or duty to her brother?',
          order: 1
        },
        {
          heading: 'The Flight',
          content: 'Exile after Baudin\'s death',
          order: 2
        },
        {
          heading: 'The Founding',
          content: 'First Lady of House Wilson',
          order: 3
        }
      ]
    },
    
    {
      type: 'personage',
      title: 'Colard Wilfson',
      subtitle: 'The Kinslayer Who Saved His House',
      category: 'Historical Figures',
      tags: ['colard', 'wilfson', 'kinslayer', 'tragedy', 'old-right', 'loyalty'],
      era: '~250 Years Ago',
      personId: null, // HOOK: Link to Person entity
      houseId: null, // HOOK: House Wilfson
      
      content: `**Colard Wilfson** was the younger brother of [[Baudin Wilfson]] approximately 250 years ago. His choice to kill his brother and restore [[House Wilfson]]'s loyalty to [[House Wilfrey]] was vindicated-250 years later, House Wilfson still serves in their hereditary positions.

## The Challenge

When [[Baudin Wilfson]]'s secret marriage of his sister [[Nivette Wilfson]] to [[Lennis Wilfrey]] was discovered and all three were banished, Colard challenged his brother to a duel for the dishonor brought to House Wilfson.

## The Unanswerable Question

**Why did Colard challenge his brother?**

The motivations remain debated 250 years later:
- **Loyalty to House Wilfrey?** Believing the council was right and Baudin wrong?
- **Ambition for his brother's position?** Seeing an opportunity to become Lord Wilfson?
- **Genuine outrage at the betrayal?** Truly believing Baudin had destroyed their house?
- **Some combination of all three?** Human motivation is rarely pure

The truth died with the brothers.

## The Duel

The duel was swift:
- Colard's blade found his brother's heart
- Baudin Wilfson fell, having ruled as Lord of House Wilfson for less than two years
- Colard immediately became the new Lord Wilfson
- He was immediately restored to House Wilfrey's favor

## The Vindication

Colard's choice to kill his brother and maintain loyalty was vindicated:
- [[House Wilfson]] retained their hereditary positions:
  - Master of the Silver Mines
  - Castellan of [[Breakmount Castle]]
- 250 years later, House Wilfson **still serves in these roles**
- The choice stands as proof that loyalty to the main house is rewarded with continuity and trust

## The Stain

But vindication came at a price. House Wilfson is forever marked as:
- **Loyal Servants**: Who chose duty over brotherhood
- **Kinslayers**: The stain of brother killing brother

The choice saved the house but damned the soul.

## The Questions

**Was Colard:**
- **A loyal son** who did what was necessary to restore his family's honor?
- **A fratricide** who killed his brother for ambition?
- **A pragmatist** who saw the only path forward and took it?
- **A tragic figure** forced to choose between brother and house?

## The Legacy

250 years later, Colard's descendants still serve [[House Wilfrey]] faithfully. The kinslaying purchased:
- **Continuity**: Unbroken service across centuries
- **Trust**: House Wilfrey's continued faith in House Wilfson
- **Position**: Retention of critical hereditary roles
- **Guilt**: The eternal stain of fratricide

Every Lord Wilfson since Colard has inherited both the position and the question: **Was the price worth paying?**

## The Lesson

[[The Old Right]] scandal is taught to every generation of fosterlings. Colard's choice serves as one part of the lesson:
- Loyalty to the main house is rewarded
- Defiance, even for love, ends in death
- Sometimes duty requires the unthinkable
- The right choice can still damn your soul

Whether Colard was hero, villain, or simply human depends on who tells the story.

## See Also
- [[The Old Right]]: The scandal that forced his choice
- [[Baudin Wilfson]]: The brother he killed
- [[House Wilfson]]: The house he saved through kinslaying
- [[The Fostering System]]: The bonds his brother chose over duty`,

      sections: [
        {
          heading: 'The Challenge',
          content: 'Brother against brother',
          order: 1
        },
        {
          heading: 'The Duel',
          content: 'Swift death, immediate lordship',
          order: 2
        },
        {
          heading: 'The Vindication',
          content: '250 years of loyal service',
          order: 3
        },
        {
          heading: 'The Stain',
          content: 'Kinslayer forever',
          order: 4
        }
      ]
    },
    
    {
      type: 'personage',
      title: 'The Old Knight',
      subtitle: 'Raylegh\'s Elderly Betrothed',
      category: 'Historical Figures',
      tags: ['old-knight', 'raylegh', 'old-right', 'mystery'],
      era: '~250 Years Ago',
      personId: null, // HOOK: Link if ever added
      
      content: `**The Old Knight** was the wealthy, elderly man to whom [[Raylegh]] was betrothed approximately 250 years ago. His planned marriage to Raylegh triggered the chain of events leading to [[The Old Right]] scandal.

## What We Know

- He was wealthy
- He was three times Raylegh's age
- He was betrothed to marry Raylegh
- The council confirmed all these facts were true

## What We Don't Know

- His name
- His house
- Whether he was truly as terrible as Raylegh claimed
- Whether the betrothal was forced or arranged with family consent
- Whether he knew about Raylegh's night with [[Lennis Wilfrey]]
- What happened to him after the scandal
- Whether he married someone else
- Whether he ever learned the full truth

## The Question of Character

**Was he:**
- A cruel old man forcing a young woman into unwanted marriage?
- A legitimate suitor in a standard political arrangement?
- A victim of Raylegh's manipulation, his reputation unfairly maligned?
- Simply an old lord seeking a young wife, as was common in the era?

The truth depends on whether you believe Raylegh's account.

## The Mystery

The Old Knight's fate is one of the unanswered questions of [[The Old Right]]:
- If Raylegh married him anyway after Lennis was banished, did they have children?
- If Raylegh was pregnant by Lennis, was the child raised as the Old Knight's heir?
- Did he die before the marriage could take place?
- Did he refuse to marry Raylegh after the scandal?

These questions may never be answered, but they could become critically important if Raylegh's child by Lennis exists somewhere with a potential claim.

## Legacy

The Old Knight exists in history as a shadowy figure - simultaneously:
- Catalyst for the greatest scandal in House Wilfrey's history
- Potential villain forcing an unwilling bride
- Possible victim of a manipulative woman's scheme
- Unknown factor in questions of succession and legitimacy

## See Also
- [[Raylegh]]: His betrothed who fled
- [[The Old Right]]: The scandal his betrothal triggered
- [[Lennis Wilfrey]]: The young heir who interfered`,

      sections: [
        {
          heading: 'The Betrothal',
          content: 'Wealthy, elderly, and unknown',
          order: 1
        },
        {
          heading: 'The Questions',
          content: 'Villain, victim, or simply unlucky?',
          order: 2
        },
        {
          heading: 'The Unknown Fate',
          content: 'What happened after?',
          order: 3
        }
      ]
    }
  ],
  
  // ============================================================================
  // MYSTERIA (1 entry) - Customs, Institutions, Magic Systems
  // ============================================================================
  
  mysteria: [
    {
      type: 'mysteria',
      title: 'The Fostering System',
      subtitle: 'Bonds of Brotherhood That Bind a Realm',
      category: 'Customs & Institutions',
      tags: ['fostering', 'tradition', 'breakmount', 'heirs', 'education'],
      era: 'Ancient - Current',
      
      content: `**The Fostering System** is the primary institutional mechanism binding [[House Wilfrey]]'s geographically separated seats together, creating bonds of loyalty and shared culture across generations.

## Core Purpose

The fostering tradition serves multiple functions:
- Creates personal bonds between future leaders
- Ensures shared values and traditions across regions
- Provides comprehensive leadership training
- Acts as subtle hostage system ensuring regional loyalty
- Transmits House Wilfrey culture to each generation

## Requirements

### Mandatory Participants
- **Heirs to the four main seats** ([[Breakmount Castle]], [[Bramblehall]], [[Riverhead]], [[Fourhearth Castle]]) - required
- **Heirs of cadet branches** when pledging loyalty to House Wilfrey - required
- **Result**: Approximately 10+ young male heirs fostering at Breakmount at any given time

### Age and Duration
- **Start Age**: 5 years old
- **End Age**: 16 years old (considered manhood)
- **Total Duration**: 11 years

### Presentation Ceremony
Each heir must be presented by a delegation including their father. Exception: Another person of importance may present, but only with good reason (death, incapacity, etc.).

## The Fostering Process

### Early Years (Ages 5-12)

**Primary residence**: [[Breakmount Castle]]

During these formative years:
- Fostering cohorts grow up together
- Learn shared traditions, rituals, and values
- Form the foundational bonds of brotherhood
- Receive training befitting future lords
- Live, eat, learn, and play together for 7 years

These bonds are not theoretical - they are forged through shared childhood, creating relationships as strong as blood.

### "Doing a Season" (Ages 12-16)

**Requirement**: Each fosterling must spend one season at each of the three other seats

**Timing**: One-time requirement for each seat, typically completed between ages 12-16
**Duration**: Takes 3-4 years to complete all three rotations
**Group Size**: Small groups (2-4 fosterlings typically), occasionally individuals
**Strategic Purpose**: Assignments are made strategically to provide relevant leadership training

**Example Rotation**:
- Summer of 12th year: [[Riverhead]]
- Winter of 13th year: [[Fourhearth Castle]]
- Spring of 15th year: [[Bramblehall]]

## Strategic Seasonal Learning

### At Riverhead
Best for late summer/autumn (harvest) or winter (managing stores):
- Harvest management
- Food storage and supply chain logistics
- Water management
- Bridge defense
- Understanding agricultural power dynamics

### At Fourhearth
Best for spring/summer (active sailing) or autumn (trade winds):
- Sailing and ship captaincy
- Trade negotiations
- Port management
- Navigation and weather reading
- Diplomatic skills with foreign powers

### At Bramblehall
Best for spring/autumn (logging) or winter (hunting):
- Forestry and timber management
- Hunting and woodland survival
- Leading insular, independent-minded people
- Woodland warfare tactics
- Respecting traditional ways

### At Breakmount (Implicit)
As the home base for ages 5-12 and between rotations:
- Mining operations
- Silver commerce
- Central governance
- Managing the fostering program itself
- Mountain defense
- Metalwork

## Administration

### Master of Fosterlings

A highly sought-after and influential position responsible for:
- Coordinating complex rotation schedules
- Making strategic decisions about which heirs need what experiences
- Controlling timing and grouping of fosterlings
- Building alliances through access and influence
- Shaping the next generation of House Wilfrey's leadership

This position carries immense soft power - the Master of Fosterlings can:
- Determine which heirs develop close bonds
- Influence future alliances through strategic groupings
- Favor or disadvantage particular houses through assignments
- Shape the next generation's worldview

## Intended Outcomes

### Individual Benefits
- Future lords personally know all four regions intimately
- Deep understanding of different regional cultures and challenges
- Network of fostering brothers across all seats
- Comprehensive leadership training
- Shared identity as "sons of House Wilfrey"

### House Benefits
- Regional loyalty bound by personal relationships
- Reduced chance of civil war (would fight fostering brothers)
- Shared culture despite geographic separation
- Practical knowledge distributed across future leaders
- Subtle hostage system (harm to fosterlings brings retribution)

## [[The Old Right]] and the System's Paradox

The fostering system's greatest success became its greatest failure:

**Success**: [[Baudin Wilfson]] and [[Lennis Wilfrey]] became true brothers, their bond unbreakable even by death

**Failure**: That very bond led Baudin to defy the council, resulting in:
- His sister [[Nivette Wilfson]]'s secret marriage to Lennis
- Baudin's death in a duel with his brother [[Colard Wilfson]]
- The founding of [[House Wilson]] as a rival house
- Eternal debate about the limits of council authority

## Current Significance

250 years after [[The Old Right]], the fostering system continues to:
- Bind House Wilfrey's scattered seats together
- Create the next generation of leaders
- Serve as living reminder of both its power and its limits
- Function as the primary force holding the realm together

The story of Baudin and Lennis is taught to every new generation of fosterlings as a cautionary tale demonstrating that:
- The bonds formed are real and unbreakable
- Those bonds can both unite and destroy
- Loyalty to fostering brothers and loyalty to the house may conflict
- There are no easy answers when love and duty collide

## See Also
- [[Breakmount Castle]]: Center of the fostering system
- [[The Old Right]]: The scandal that tested the system's limits
- [[Baudin Wilfson]]: Fostering brother who died for the bonds
- [[Lennis Wilfrey]]: The friend who inspired that sacrifice
- The Four Seats: [[Bramblehall]], [[Riverhead]], [[Fourhearth Castle]]`,

      sections: [
        {
          heading: 'Core Structure',
          content: 'Ages 5-16, mandatory for all heirs',
          order: 1
        },
        {
          heading: 'Early Years',
          content: 'Ages 5-12 at Breakmount, forming bonds',
          order: 2
        },
        {
          heading: 'Doing a Season',
          content: 'Ages 12-16, learning at each of the three other seats',
          order: 3
        },
        {
          heading: 'The Paradox',
          content: 'Success and failure in The Old Right',
          order: 4
        }
      ]
    }
  ]
};

export default CODEX_SEED_DATA;
