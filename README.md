# Lineageweaver

A web-based fantasy genealogy visualization tool for worldbuilders with an integrated wiki-style encyclopedia system and heraldic design studio.

## What is Lineageweaver?

Lineageweaver helps fantasy writers and worldbuilders track complex family relationships, including:
- Multiple marriages and illegitimate children
- Magical bloodlines and non-human species
- Political titles and succession
- Inter-family alliances and marriages
- **Rich worldbuilding through The Codex encyclopedia system**
- **Seamless integration between family trees and character biographies**
- **Professional heraldry design with The Armory** *(NEW in v0.9.0)*

## Current Version: 0.9.0 - The Heraldry Reboot

### What's New in v0.9.0 (January 9, 2026)

**🛡️ THE HERALDRY REBOOT - Phases 0-3 Complete**

A complete ground-up rebuild of the heraldry system with professional SVG-based design tools.

---

## The Armory - Heraldry System

### Overview

The Armory is Lineageweaver's integrated heraldry design system. Create authentic coats of arms using traditional heraldic principles, then link them to your noble houses.

**Access:** Navigate to `/heraldry` or click "The Armory" in the navigation bar.

---

### Phase 0: Planning & Architecture ✅

**7-Phase Roadmap Established:**
| Phase | Name | Status |
|-------|------|--------|
| 0 | Planning | ✅ Complete |
| 1 | Foundation | ✅ Complete |
| 2 | Design Studio | ✅ Complete |
| 3 | Charges Library | ✅ Complete |
| 4 | House Integration | 🔜 Next |
| 5 | Advanced Features | Planned |
| 6 | Polish & Export | Planned |

---

### Phase 1: Foundation ✅

**Database Migration (v3):**
- New `heraldry` table for coat of arms storage
- New `heraldryLinks` table for entity relationships
- Compound index for efficient queries
- Migration from v2 → v3 automatic

**Schema - Heraldry Table:**
```javascript
{
  id: auto,                    // Primary key
  name: string,                // "Arms of House Wilfrey"
  description: string,         // Optional notes
  blazon: string,              // Formal heraldic description
  heraldrySVG: string,         // Full SVG with shield mask
  heraldrySourceSVG: string,   // Raw division SVG (200×200)
  heraldryDisplay: string,     // PNG base64 (200px)
  heraldryThumbnail: string,   // PNG base64 (64px)
  heraldryHighRes: string,     // PNG base64 (400px)
  shieldType: string,          // heater|english|french|spanish|swiss
  composition: object,         // All design parameters
  category: string,            // noble|personal|ecclesiastical|civic|guild|fantasy
  tags: array,                 // Custom tags
  source: string,              // 'creator'|'upload'|'external'
  linkedEntities: array,       // Entity references
  createdAt: date,
  updatedAt: date
}
```

**Heraldry Service Layer (`heraldryService.js`):**
- `createHeraldry(data)` - Create new coat of arms
- `getHeraldry(id)` - Retrieve by ID
- `getAllHeraldry()` - List all heraldry
- `updateHeraldry(id, data)` - Update existing
- `deleteHeraldry(id)` - Remove (with cascade)
- `linkHeraldryToEntity(link)` - Connect to house/person
- `unlinkHeraldryFromEntity(heraldryId, entityType, entityId)` - Remove link
- `getHeraldryByEntity(entityType, entityId)` - Find linked heraldry
- `searchHeraldry(query)` - Text search

**Landing Page - The Armory (`/heraldry`):**
- Gallery grid of all created heraldry
- Thumbnail previews with names
- "Create New Heraldry" prominent button
- Empty state with getting started guide
- Navigation integrated with main app

---

### Phase 2: The Design Studio ✅

**Full-Page Design Interface (`/heraldry/create`):**

A professional heraldry design workspace with real-time preview and formal blazon generation.

**Layout:**
- **Left Panel (400px):** Live shield preview + blazon display
- **Right Panel:** Collapsible design sections
- **Sticky Header:** Back button + page title

#### Division Patterns (24+)

**Simple:**
- Plain (solid field)

**Partitions (support line styles):**
- Per Pale (vertical half)
- Per Fess (horizontal half)
- Per Bend (diagonal dexter)
- Per Bend Sinister (diagonal sinister)
- Per Chevron (chevron division)
- Quarterly (four quarters)
- Per Saltire (X-shaped quarters)

**Stripes (support count 4-10):**
- Paly (vertical stripes)
- Barry (horizontal stripes)
- Bendy (diagonal stripes)
- Bendy Sinister (reverse diagonal)

**Complex Patterns:**
- Chequy (checkerboard)
- Lozengy (diamond pattern)
- Fusily (elongated diamonds)
- Gyronny (8-way radial)

**Ordinaries (support count, thickness, line styles):**
- Chief (top band)
- Base (bottom band)
- Fess (horizontal band)
- Pale (vertical band)
- Bend (diagonal band)
- Bend Sinister (reverse diagonal band)
- Chevron (V-shape)
- Pile (triangle from top)
- Cross
- Saltire (X-shape)

**Tierced:**
- Tierced in Pale (three vertical)
- Tierced in Fess (three horizontal)

#### Tinctures (10 Traditional Colors)

**Metals:**
- Or (Gold) `#FFD700`
- Argent (Silver/White) `#FFFFFF`

**Colours:**
- Gules (Red) `#DC143C`
- Azure (Blue) `#0047AB`
- Sable (Black) `#000000`
- Vert (Green) `#228B22`
- Purpure (Purple) `#9B30FF`

**Stains:**
- Tenné (Orange-Brown) `#CD853F`
- Sanguine (Blood Red) `#8B0000`
- Murrey (Mulberry) `#8B008B`

#### Line Styles (10 Variations)

All partition lines can use decorative styles:

| Style | Description | Blazon Term |
|-------|-------------|-------------|
| Straight | Default straight line | (none) |
| Wavy | Undulating waves | wavy |
| Engrailed | Scalloped outward | engrailed |
| Invected | Scalloped inward | invected |
| Embattled | Battlements/crenellated | embattled |
| Indented | Zigzag teeth | indented |
| Dancetty | Large zigzag | dancetty |
| Raguly | Broken branch stubs | raguly |
| Dovetailed | Dovetail joints | dovetailed |
| Nebuly | Cloud-like curves | nebuly |

#### Division Options

**Multiplicity (for stripes/ordinaries):**
- Stripes: 4, 6, 8, or 10 count
- Ordinaries: 1, 2, or 3 count
- Automatic diminutive naming (fess → bars, pale → pallets, etc.)

**Thickness (for ordinaries):**
- Narrow (60% width)
- Normal (100% width)
- Wide (140% width)

**Inversion (for chevron/pile):**
- Toggle to flip orientation
- Chevron inverted, Pile reversed

#### Shield Shapes (5 Historical Types)

| Shape | Name | Description |
|-------|------|-------------|
| 🛡️ | Heater | Classic medieval (c.1245) |
| 🏰 | English | Late medieval (c.1403) |
| ⚜️ | French | Embowed/arched style |
| 🌙 | Spanish | Engrailed notched |
| ⛰️ | Swiss | Engrailed peaked |

**SVG Masks:**
- Professional shield outlines from heraldicart.org
- Creative Commons licensed
- Crisp rendering at all sizes

#### Blazon Generation

Automatic formal heraldic descriptions:

**Examples:**
- "Azure" (plain blue field)
- "Per pale Gules and Or" (red and gold vertical split)
- "Azure, a chevron wavy Or" (blue field, gold wavy chevron)
- "Barry of 6 Argent and Sable" (6 white/black horizontal stripes)
- "Gules, three bendlets sinister Argent" (red field, 3 white diagonal bands)

#### Rule of Tincture Warning

Visual warning when placing:
- Metal on metal (Or on Argent)
- Colour on colour (Gules on Azure)

Non-blocking but educational for heraldic authenticity.

---

### Phase 3: Charges Library ✅

**25 Heraldic Charges Across 7 Categories:**

#### 🦁 Beasts (5)
- Lion Rampant (standing, forelegs raised)
- Lion Passant (walking)
- Bear Rampant
- Boar
- Stag (Hart)

#### 🦅 Birds (4)
- Eagle Displayed (spread wings)
- Falcon
- Raven
- Swan

#### ✚ Crosses (4)
- Cross (standard)
- Cross Patée (flared ends)
- Cross Moline (split ends)
- Cross Flory (fleur-de-lis ends)

#### ⭐ Celestial (4)
- Mullet (5-pointed star)
- Estoile (wavy-rayed star)
- Sun in Splendor
- Crescent

#### ◆ Geometric (3)
- Lozenge (diamond)
- Roundel (circle)
- Billet (rectangle)

#### 👑 Objects (3)
- Crown
- Sword
- Key

#### 🌹 Flora (2)
- Rose
- Fleur-de-lis

#### Charge Positioning System

**Single Charge Positions:**
- Fess Point (center) - default
- Chief (top)
- Base (bottom)
- Dexter (left from viewer)
- Sinister (right from viewer)
- Honor Point (upper center)
- Nombril Point (lower center)

**Multiple Charge Arrangements:**

For 2 charges:
- In Pale (vertical line)
- In Fess (horizontal line)
- In Bend (diagonal)

For 3 charges:
- 2 & 1 (two above, one below) - most common
- 1 & 2 (one above, two below)
- In Pale (vertical line)
- In Fess (horizontal line)
- In Bend (diagonal)

#### Charge Size Options

| Size | Scale | Best For |
|------|-------|----------|
| Small | 0.45× | Multiple charges |
| Medium | 0.65× | 1-2 charges |
| Large | 0.85× | Single dominant charge |

**Auto-Scaling:**
- 2 charges: 70% of selected size
- 3 charges: 55% of selected size

#### Charge Blazon Generation

Automatic formal descriptions:

**Examples:**
- "a lion rampant Or" (gold standing lion)
- "three mullets Argent" (three silver stars)
- "two eagles displayed Sable" (two black spread eagles)

---

### Design Studio UI

**Collapsible Sections:**
1. **Identity** - Name, description
2. **Division** - Pattern selection + options
3. **Tinctures** - Color pickers for 2-3 fields
4. **Charges** - Symbol selection + options *(NEW)*
5. **Shield Shape** - Historical shape selection
6. **Classification** - Category + tags
7. **Link to House** - Associate with noble house

**Charges Section Features:**
- Enable/disable toggle
- Category filter tabs (7 categories)
- Charge selection grid
- Tincture picker for charge color
- Count selector (1-3)
- Arrangement options (for 2+ charges)
- Size controls (Small/Medium/Large)

**Real-Time Preview:**
- Instant SVG regeneration on any change
- Shield mask applied automatically
- Blazon updates in real-time

**Save Process:**
1. Generate final SVG with shield mask
2. Create PNG versions (64px, 200px, 400px)
3. Store composition data for editing
4. Link to selected house (optional)
5. Update house record with heraldry

---

### Files Added/Modified in v0.9.0

**New Files:**
```
src/
├── data/
│   └── chargesLibrary.js          # 25 charges, positions, arrangements, SVG generation
├── pages/
│   ├── HeraldryLanding.jsx        # Armory gallery page
│   ├── HeraldryLanding.css        # Gallery styling
│   ├── HeraldryCreator.jsx        # Full design studio (1800+ lines)
│   └── HeraldryCreator.css        # Design studio styling
├── services/
│   └── heraldryService.js         # Full CRUD + linking operations
└── utils/
    ├── shieldMasks.js             # 5 professional shield SVG paths
    └── shieldSVGProcessor.js      # SVG masking and composition
```

**Modified Files:**
```
src/
├── services/
│   └── database.js                # v3 migration, heraldry + heraldryLinks tables
├── components/
│   └── Navigation.jsx             # Added "The Armory" nav link
└── App.jsx                        # Added /heraldry routes
```

---

### Technical Implementation

**SVG Generation Pipeline:**

1. **Division SVG (200×200 viewBox)**
   - Generate base field with tinctures
   - Apply line style variations
   - Add ordinaries with options

2. **Charge Overlay**
   - Position charges on field
   - Apply tincture and scaling
   - Handle multiple charge arrangements

3. **Shield Masking**
   - Load shield shape SVG path
   - Create clipPath definition
   - Apply mask to combined design

4. **PNG Conversion**
   - Canvas-based rasterization
   - Three size variants
   - Base64 encoding for storage

**Line Style Algorithm:**

Each decorative line is generated mathematically:
- Calculate line length and direction
- Determine pattern count based on length
- Generate control points for curves/angles
- Build SVG path with appropriate commands

```javascript
// Example: Wavy line generation
for (let i = 0; i < patternCount; i++) {
  const dir = (i % 2 === 0) ? 1 : -1;
  const cp1 = midpoint + perpendicular * amplitude * dir;
  path += ` C ${cp1} ${cp2} ${endpoint}`;
}
```

**Charge SVG Structure:**

Each charge is defined with:
- Unique ID and name
- Category classification
- SVG path data (100×100 viewBox)
- Blazon term
- Optional description

```javascript
lionRampant: {
  id: 'lionRampant',
  name: 'Lion Rampant',
  category: 'beasts',
  blazon: 'a lion rampant',
  description: 'Lion standing on hind legs',
  path: 'M 50 10 C 45 15...' // Full SVG path
}
```

---

### What's Next: Phase 4 - House Integration

**Planned Features:**
- Heraldry display on house cards
- Heraldry in family tree visualization
- Batch assignment tools
- Cadet branch variations
- Heraldry history/lineage tracking

---

## Previous Versions

### v0.8.2 - Module 1E Complete (January 7, 2026)

**📍 HORIZONTAL LAYOUT**

View your family tree with ancestors on the left and descendants flowing to the right!

**Features:**
- **Toggle Button** - Click the layout icons in the bottom-left corner
- **Keyboard Shortcut** - Press `H` to toggle between vertical/horizontal
- **Persistent Preference** - Your choice is saved in localStorage
- **Auto-Center** - Tree automatically centers on content when switching
- **Both Themes** - Works perfectly in Royal Parchment and Light Manuscript

**Keyboard Shortcuts:**
| Key | Action |
|-----|--------|
| `H` | Toggle horizontal/vertical layout |
| `+` / `=` | Zoom in |
| `-` | Zoom out |
| `0` | Reset view |

---

### v0.8.1 - Module 1E Core Features (January 7, 2026)

**📦 MODULE 1E COMPLETE**

| Feature | Status |
|---------|--------|
| ✅ Export to JSON | Auto-backup every 15 mins + manual |
| ✅ Import from JSON | Validation, preview, conflict resolution |
| ✅ Species Field | Non-human characters supported |
| ✅ Titles System | Noble titles with date ranges |
| ✅ Magical Bloodlines | Inherited abilities tracking |
| ✅ Horizontal Layout | Left-to-right tree view with toggle |
| 🅿️ Timeline View | Parked indefinitely |

---

### v0.8.0 - Tree-Codex Integration (January 7, 2026)

**🔗 TREE-CODEX INTEGRATION - Phase 1 Complete**

- ✅ Auto-creation of Codex entries when creating people
- ✅ Cascade delete of Codex entries when deleting people
- ✅ Navigation: Data Management → Codex ("📖 View Biography")
- ✅ Navigation: Family Tree → Codex ("📖 View Biography")
- ✅ Navigation: Codex → Family Tree ("🌳 View in Family Tree")
- ✅ 📖 badges in PersonList showing who has biographies
- ✅ Biography Coverage stats on Codex landing page
- ✅ Migration tool for existing people

---

### v0.7.0 - Shared State Architecture (January 6, 2026)

**🔗 SHARED STATE ARCHITECTURE**

- GenealogyContext provides single source of truth
- Instant synchronization between all views
- Enhanced QuickEditPanel with relationship management
- Add spouse/parent/child/sibling directly from tree view

---

### v0.6.1 - Generation Sorting Fixes (January 5, 2026)

**🎯 CRITICAL GENEALOGY FIXES**

- Parent DOB Sorting - Groups sort by parent's birth date
- Bastard Line Origin Fix - Lines issue from correct parent(s)
- Generation Spacing - Adjusted to 100px default

---

## Getting Started

### Prerequisites

- Node.js 16+ installed
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone or download the project
2. Navigate to the project directory:
```bash
cd lineageweaver
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:5173`

### First Time Setup

1. **Create Your First Heraldry** *(NEW)*
   - Navigate to `/heraldry`
   - Click "Create New Heraldry"
   - Design your coat of arms
   - Link it to a house!

2. **Import Sample Data** - The Codex comes with 23 canonical House Wilfrey entries
   - Navigate to `/codex`
   - Click "📥 Import House Wilfrey Data"

3. **Run the Migration Tool** - Connect existing people to The Codex
   - Navigate to `/manage` (Data Management)
   - Go to Import/Export tab
   - Click "Create X Codex Entries"

4. **Explore The Family Tree**
   - Navigate to `/tree`
   - Click any person card to open the relationship panel
   - Try the "📖 View Biography" link!

---

## Technology Stack

- **React 18** - UI framework with modern hooks
- **D3.js v7** - Data visualization and tree rendering
- **Vite** - Build tool and dev server
- **Dexie.js** - IndexedDB wrapper for local data storage
- **React Router v6** - Navigation between pages
- **marked** - Markdown parsing for Codex entries

---

## Project Structure

```
lineageweaver/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── Navigation.jsx       # Unified nav with Armory link
│   │   ├── QuickEditPanel.jsx   # Relationship management sidebar
│   │   ├── PersonCard.jsx       # Person details with Codex link
│   │   ├── CodexMigrationTool.jsx
│   │   └── ...
│   ├── contexts/                # React Context providers
│   │   └── GenealogyContext.jsx # Shared data state
│   ├── data/                    # Data definitions
│   │   ├── chargesLibrary.js    # Heraldic charges (NEW)
│   │   ├── codex-seed-data.js   # Sample Codex entries
│   │   └── sampleData.js        # Family tree data
│   ├── pages/                   # Page components
│   │   ├── Home.jsx
│   │   ├── FamilyTree.jsx
│   │   ├── ManageData.jsx
│   │   ├── CodexLanding.jsx
│   │   ├── HeraldryLanding.jsx  # Armory gallery (NEW)
│   │   ├── HeraldryCreator.jsx  # Design Studio (NEW)
│   │   └── ...
│   ├── services/                # Database operations
│   │   ├── database.js          # Dexie setup (v3 with heraldry)
│   │   ├── codexService.js
│   │   └── heraldryService.js   # Heraldry CRUD (NEW)
│   ├── utils/                   # Helper functions
│   │   ├── shieldMasks.js       # Shield SVG paths (NEW)
│   │   ├── shieldSVGProcessor.js # SVG masking (NEW)
│   │   ├── wikiLinkParser.js
│   │   └── ...
│   └── App.jsx                  # Root with /heraldry routes
└── package.json
```

---

## Features Overview

### 🛡️ The Armory (Heraldry System) *(NEW)*

**Design Studio:**
- 24+ division patterns
- 10 traditional tinctures
- 10 decorative line styles
- 5 historical shield shapes
- 25 heraldic charges in 7 categories
- Multiple charge arrangements
- Real-time preview
- Automatic blazon generation

**Gallery:**
- Browse all created heraldry
- Thumbnail grid view
- Edit existing designs
- Link to houses

---

### 🌳 Family Tree Visualization

**Core Features:**
- Interactive D3.js-powered genealogy tree
- Three independent line systems (legitimate/bastard/adopted)
- Horizontal and vertical layout options
- Auto-center on content
- Color-coded relationships and house affiliations

**Quick Edit Panel:**
- View person details
- 📖 View Biography link
- Add family members directly
- Navigate relationships

---

### 📚 The Codex Encyclopedia

**Core Features:**
- Wiki-style encyclopedia for worldbuilding
- Six entry types with tag/era organization
- Markdown with `[[wiki-link]]` syntax
- Automatic backlinks
- Full-text search

**Tree Integration:**
- Auto-creation of entries for new people
- Cascade delete
- Bidirectional navigation

---

### 🎨 Medieval Theme System

**Two Themes:**
- **Royal Parchment** (Dark) - Warm browns
- **Light Manuscript** (Light) - Cream backgrounds

---

## Development Roadmap

### ✅ Completed

| Module | Version | Status |
|--------|---------|--------|
| Core Application | v0.1-0.3 | ✅ Complete |
| Theme System | v0.4 | ✅ Complete |
| The Codex Phase 1-2 | v0.5-0.6 | ✅ Complete |
| Genealogy Fixes | v0.6.1 | ✅ Complete |
| Shared State | v0.7.0 | ✅ Complete |
| Tree-Codex Integration | v0.8.0 | ✅ Complete |
| Module 1E (Import/Export) | v0.8.1-0.8.2 | ✅ Complete |
| **Heraldry Phases 0-3** | **v0.9.0** | **✅ Complete** |

### 🔜 In Progress

| Feature | Status |
|---------|--------|
| Heraldry Phase 4: House Integration | Next |
| Heraldry Phase 5: Advanced Features | Planned |
| Heraldry Phase 6: Polish & Export | Planned |
| Codex Phase 3: Knowledge Graph | Planned |

---

## Browser Compatibility

**Tested On:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

**Requires:**
- D3.js v7 support
- ES6+ JavaScript
- SVG rendering
- CSS Grid and Flexbox
- IndexedDB support

---

## Performance

**Heraldry System:**
- SVG generation: ~50ms
- Shield masking: ~100ms
- PNG conversion: ~200ms
- Preview update: Real-time

**General:**
- Theme switching: < 100ms
- Context updates: < 16ms
- Tree redraw: ~200ms for 50+ people

---

## License

MIT

---

## Author

Ty Williams  
December 2024 - January 2026

---

**Current Version:** 0.9.0 (Heraldry Phases 0-3 Complete)  
**Last Updated:** January 9, 2026

---

## Quick Links

- **The Armory:** `/heraldry` *(NEW)*
- **Design Studio:** `/heraldry/create` *(NEW)*
- **Family Tree:** `/tree`
- **The Codex:** `/codex`
- **Data Management:** `/manage`
