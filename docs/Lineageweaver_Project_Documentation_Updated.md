# Lineageweaver: Project Documentation

**Last Updated:** January 2025  
**Current Phase:** Feature Expansion  
**Version:** 2.0

---

## Project Overview

**Lineageweaver** is a web-based fantasy genealogy visualization tool designed specifically for worldbuilding. Unlike traditional ancestry tools, Lineageweaver handles the unique complexities of fictional family trees including magical bloodlines, non-human species, complex relationship structures, and comprehensive lore documentation.

### Core Systems

Lineageweaver now comprises **four major systems**:

| System | Status | Description |
|--------|--------|-------------|
| **🌳 Family Tree** | ✅ Complete | D3.js-powered genealogy visualization |
| **📚 The Codex** | ✅ Complete | Wiki-style encyclopedia system |
| **🛡️ The Armory** | ✅ Phases 1-3 | Standalone heraldry design system |
| **⚙️ Data Management** | ✅ Complete | CRUD operations for all entities |

---

## Technology Stack

### Frontend
- **React** - Component-based UI framework
- **D3.js** - Custom tree visualization (up to 300x zoom)
- **Vite** - Modern build tooling
- **Tailwind CSS** - Utility-first styling

### Data Layer
- **IndexedDB** via **Dexie.js** - Local browser database
- **Firebase** - Cloud authentication & synchronization
- **Google Auth** - User sign-in

### Theming
- **CSS Custom Properties** - Dynamic theme switching
- **Two Themes:**
  - "Royal Parchment" (Dark) - Default
  - "Light Manuscript" (Light)
- Medieval manuscript aesthetic throughout

### Deployment
- **Vercel** - Production hosting
- **Git** - Version control

---

## Current Database Schema (Version 12)

```javascript
// Core genealogy tables
people: '++id, firstName, lastName, houseId, dateOfBirth, dateOfDeath, 
         bastardStatus, codexEntryId, heraldryId'

houses: '++id, houseName, parentHouseId, houseType, codexEntryId, heraldryId'

relationships: '++id, person1Id, person2Id, relationshipType'

// The Codex tables
codexEntries: '++id, type, title, category, *tags, era, created, updated'
codexLinks: '++id, sourceId, targetId, type'

// The Armory tables
heraldry: '++id, name, category, *tags, created, updated'
heraldryLinks: '++id, heraldryId, entityType, entityId, linkType'

// The Dignities tables (titles & feudal hierarchy)
dignities: '++id, name, shortName, dignityClass, dignityRank, swornToId, 
            currentHolderId, currentHouseId, codexEntryId, created, updated'
dignityTenures: '++id, dignityId, personId, dateStarted, dateEnded, 
                 acquisitionType, endType, created'
dignityLinks: '++id, dignityId, entityType, entityId, linkType, created'

// Household Roles (non-hereditary service positions)
householdRoles: '++id, houseId, roleType, currentHolderId, startDate, 
                 created, updated'

// Utility tables
acknowledgedDuplicates: '++id, person1Id, person2Id, acknowledgedAt'
bugs: '++id, title, status, priority, system, page, created, resolved'
```

### Multi-Dataset Support
Each dataset gets its own IndexedDB database named `LineageweaverDB_{datasetId}`. This ensures complete data isolation between datasets.

---

## System 1: Family Tree 🌳

### Features Complete
- ✅ D3.js tree visualization with zoom/pan (up to 300x)
- ✅ Person cards with color-coded borders by legitimacy
- ✅ House-specific background colors
- ✅ Parent-child relationship lines (distinct styles for legitimate/bastard/adopted)
- ✅ Spouse connection visualization
- ✅ Primogeniture ordering (proper genealogical hierarchy)
- ✅ Auto-centering on selected person
- ✅ QuickEditPanel with smart form defaults
- ✅ Relationship navigation from edit panel
- ✅ Multi-generation display
- ✅ Cross-house marriage visualization

### Color Coding System
| Status | Border Color |
|--------|--------------|
| Legitimate | Green |
| Bastard | Orange/Amber |
| Adopted | Blue |
| Unknown | Gray |

### Relationship Line Types
- **Solid lines** - Legitimate children
- **Dashed lines** - Bastard children  
- **Dotted lines** - Adopted children

---

## System 2: The Codex 📚

### Features Complete
- ✅ Wiki-style encyclopedia entries
- ✅ 6 entry types: People, Locations, Events, Factions, Concepts, Mysteria
- ✅ Wiki-link parsing (`[[Entry Name]]` syntax)
- ✅ Backlinks panel showing all references
- ✅ Entry creation/editing forms
- ✅ Browse pages with filtering by type
- ✅ Category and era classification
- ✅ Tag system for organization
- ✅ Full-text search

### Tree-Codex Integration
- ✅ Bidirectional navigation (tree ↔ codex)
- ✅ Auto-creation of skeleton entries from people
- ✅ Cascade deletion handling
- ✅ Biography coverage statistics
- ✅ Entry linking to houses and people

### Entry Types
| Type | Icon | Use Case |
|------|------|----------|
| People | 👤 | Character biographies |
| Locations | 📍 | Places, territories, buildings |
| Events | 📅 | Battles, ceremonies, historical moments |
| Factions | ⚔️ | Organizations, guilds, orders |
| Concepts | 💡 | Abstract ideas, laws, customs |
| Mysteria | ✨ | Magic systems, prophecies, artifacts |

---

## System 3: The Armory 🛡️

### Completed Phases

#### Phase 1: Foundation ✅
- HeraldryLanding gallery page
- Navigation integration with shield icon
- Database migration (heraldry + heraldryLinks tables)
- Full CRUD service layer

#### Phase 2: Design Studio ✅
- Full-page HeraldryCreator interface
- Layered architecture: Field → Ordinaries → Charges
- 22 field divisions across 5 categories
- 17+ tinctures with rule-of-tincture guidance
- 10 decorative line styles
- 5 professional shield shapes
- Auto-generated blazon descriptions
- Live SVG preview at 400×400

#### Phase 3: Charges Library ✅
- 200+ heraldic charges from heraldicart.org
- 17 charge categories
- ChargesLibrary browseable page
- Lazy loading for performance
- Tincture preview functionality
- ExternalChargeRenderer component

### Division Categories
| Category | Count | Examples |
|----------|-------|----------|
| Plain | 1 | Solid field |
| Partitions | 6 | Per Pale, Per Fess, Per Bend |
| Complex | 5 | Quarterly, Gyronny, Tierced |
| Patterns | 5 | Paly, Barry, Chequy |
| Ordinaries | 10 | Chief, Fess, Chevron, Cross |

### Charge Categories
Beasts, Birds, Sea Creatures, Mythical, Insects, Serpents, Weapons, Flora, Architecture, Objects, Body Parts, Military, Celestial, Geometric, Crosses, Knots, Symbols

### Remaining Phases
- Phase 4: Personal Arms & Cadency (planned)
- Phase 5: Deep Integration (planned)
- Phase 6: Blazonry Parser (planned)
- Phase 7: Advanced Features (planned)

---

## System 4: Data Management ⚙️

### Features Complete
- ✅ Person CRUD with validation
- ✅ House CRUD with cadet branch support
- ✅ Relationship CRUD with type handling
- ✅ Cadet house founding ceremony workflow
- ✅ Bastard legitimization tracking
- ✅ Import/Export JSON functionality
- ✅ Data health dashboard
- ✅ Duplicate detection with namesake acknowledgment
- ✅ Smart data validation

### Person Entity Fields
```javascript
{
  id, firstName, lastName, maidenName,
  dateOfBirth, dateOfDeath, gender,
  houseId, legitimacyStatus, bastardStatus,
  species, magicalBloodline, titles,
  notes, portraitUrl, codexEntryId
}
```

### House Entity Fields
```javascript
{
  id, houseName, parentHouseId, houseType,
  foundedBy, foundedDate, swornTo,
  sigil, motto, colorCode, notes,
  codexEntryId, heraldryId,
  // Heraldry data (legacy support)
  heraldryImageData, heraldrySVG, heraldrySourceSVG,
  heraldryThumbnail, heraldryHighRes,
  heraldryShieldType, heraldrySource, heraldrySeed
}
```

### Relationship Types
- Parent (biological)
- Spouse (married, divorced, widowed)
- Adopted-parent
- Foster-parent
- Mentor
- Named-after (for namesakes)

---

## Cloud Synchronization

### Features
- ✅ Google Sign-In authentication
- ✅ Firestore cloud storage
- ✅ Hybrid local/cloud architecture ("local-first with cloud backup")
- ✅ Automatic sync on changes
- ✅ Manual sync controls
- ✅ Offline support (changes sync when back online)
- ✅ Multi-dataset support

### Architecture: Local-First with Cloud Backup

LineageWeaver uses a **local-first** approach where:
1. All operations happen on local IndexedDB first (instant UI updates)
2. Changes sync to Firestore in the background (non-blocking)
3. On login, cloud data is pulled down if it exists

```
┌─────────────────────────────────────────────────────────────────────┐
│                         User Action                                 │
│                    (add person, edit house)                         │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    1. Update Local IndexedDB                        │
│                       (immediate, offline-safe)                     │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    2. Update React State                            │
│                       (UI updates instantly)                        │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    3. Sync to Cloud (async)                         │
│                       (background, non-blocking)                    │
└─────────────────────────────────────────────────────────────────────┘
```

### Firestore Data Structure
```
/users/{userId}/
  └── /datasets/{datasetId}/
        ├── /people/{personId}           → Person documents
        ├── /houses/{houseId}            → House documents
        ├── /relationships/{id}          → Relationship documents
        ├── /codexEntries/{id}           → Codex entry documents
        ├── /codexLinks/{id}             → Codex link documents
        ├── /heraldry/{id}               → Heraldry documents
        ├── /heraldryLinks/{id}          → Heraldry link documents
        ├── /dignities/{id}              → Dignity documents
        ├── /dignityTenures/{id}         → Dignity tenure documents
        ├── /dignityLinks/{id}           → Dignity link documents
        ├── /householdRoles/{id}         → Household role documents
        └── /acknowledgedDuplicates/{id} → Namesake tracking
```

### Key Services

| Service | Purpose |
|---------|--------|
| `firestoreService.js` | Direct Firestore CRUD operations |
| `dataSyncService.js` | Sync orchestration between local & cloud |
| `GenealogyContext.jsx` | React state + sync integration |

### Sync Initialization Scenarios

| Local Data | Cloud Data | Action |
|------------|------------|--------|
| None | None | Fresh start, no sync needed |
| Yes | None | Upload local data to cloud |
| None | Yes | Download cloud data to local |
| Yes | Yes | Cloud takes precedence (download) |

### Conflict Resolution
Currently uses **"last-write-wins"** — the most recent change overwrites. This works well for single-user scenarios.

### Development Reference
See `DEVELOPMENT_GUIDELINES.md` for detailed instructions on:
- Adding sync to new entity types
- Required sync function patterns
- Error handling best practices
- Testing cloud sync

---

## Route Structure

```
/                        → Home (landing/dashboard)
/tree                    → FamilyTree (visualization)
/manage                  → ManageData (CRUD interface)

/codex                   → CodexLanding (encyclopedia home)
/codex/create            → CodexEntryForm (new entry)
/codex/edit/:id          → CodexEntryForm (edit entry)
/codex/entry/:id         → CodexEntryView (read entry)
/codex/browse/:type      → CodexBrowse (filtered list)
/codex/import            → CodexImport (bulk import)

/heraldry                → HeraldryLanding (gallery)
/heraldry/create         → HeraldryCreator (design studio)
/heraldry/edit/:id       → HeraldryCreator (edit mode)
/heraldry/charges        → ChargesLibrary (browse symbols)
```

---

## File Structure

```
/src
  /components
    /auth                    # Authentication components
    /heraldry                # Heraldry-specific components
    Navigation.jsx           # Main nav with 4 systems
    PersonCard.jsx           # Tree person display
    QuickEditPanel.jsx       # Sidebar editing
    HeraldryThumbnail.jsx    # Heraldry display component
    ThemeSelector.jsx        # Theme switching
    ...
    
  /contexts
    AuthContext.jsx          # Authentication state
    GenealogyContext.jsx     # Shared data + sync
    
  /data
    divisions.js             # 22 heraldic divisions
    tinctures.js             # 17+ tinctures
    unifiedChargesLibrary.js # 200+ charges
    
  /pages
    Home.jsx                 # Landing page
    FamilyTree.jsx           # Tree visualization
    ManageData.jsx           # Data management
    CodexLanding.jsx         # Encyclopedia home
    CodexEntryForm.jsx       # Entry editor
    CodexEntryView.jsx       # Entry display
    CodexBrowse.jsx          # Entry browser
    HeraldryLanding.jsx      # Armory gallery
    HeraldryCreator.jsx      # Design studio
    ChargesLibrary.jsx       # Charges browser
    
  /services
    database.js              # IndexedDB setup (v7)
    heraldryService.js       # Heraldry CRUD
    codexService.js          # Codex CRUD
    firestoreService.js      # Cloud operations
    dataSyncService.js       # Sync management
    
  /utils
    heraldryUtils.js         # Image processing
    shieldSVGProcessor.js    # SVG masking
    wikiLinkParser.js        # [[link]] parsing
    RelationshipCalculator.js # Family relationships
    ...
    
  /styles
    index.css                # Global styles + themes
    
/public
  /shields                   # 5 shield shape SVGs
  /heraldic-charges          # 200+ charge SVGs
```

---

## Theming System

### CSS Custom Properties
All colors defined as CSS variables for dynamic switching:
```css
:root {
  --bg-primary, --bg-secondary, --bg-tertiary
  --text-primary, --text-secondary, --text-tertiary
  --border-primary, --border-secondary
  --accent-primary, --accent-secondary
  --color-success, --color-warning, --color-error, --color-info
}
```

### Theme Characteristics
**Royal Parchment (Dark)**
- Warm parchment tones on dark background
- Gold/amber accents
- High contrast for readability

**Light Manuscript (Light)**
- Cream/ivory backgrounds
- Brown/sepia text
- Subtle aged paper aesthetic

---

## Development Workflow

### Setup
```bash
cd lineageweaver
npm install
npm run dev    # Start development server
```

### Build
```bash
npm run build  # Production build
```

### Deploy
Automatic deployment via Vercel on Git push.

---

## Key Design Principles

### Canonical Accuracy
All content must align with source material. No non-canonical interpretations.

### Visual Consistency
Medieval manuscript aesthetic maintained across all components.

### Genealogical Correctness
- Primogeniture ordering respected
- Proper relationship hierarchies
- Clear legitimacy distinctions

### Performance
- Lazy loading for large datasets
- SVG rendering for infinite zoom
- IndexedDB for fast local access

### Accessibility
- WCAG color contrast standards
- Keyboard navigation support
- Screen reader considerations

---

## Feature Roadmap

### Completed ✅
- Core genealogy visualization
- The Codex encyclopedia
- The Armory (Phases 1-3)
- Cloud synchronization
- Dual theming

### In Progress 🔄
- Heraldry Phase 3 polish
- UI/UX refinements

### Planned 📋
- Heraldry Phases 4-7
- Timeline visualization
- Advanced search/filtering
- Mobile optimization
- D3 tree status indicators from Codex
- Preview snippets on hover

---

## Version History

| Version | Date | Major Changes |
|---------|------|---------------|
| 0.1 | Dec 2024 | Initial planning |
| 1.0 | Dec 2024 | Core genealogy complete |
| 1.5 | Jan 2025 | The Codex complete |
| 2.0 | Jan 2025 | The Armory Phases 1-3 |

---

## Support Resources

- **Documentation:** `/docs` folder in project
- **Heraldry Source:** heraldicart.org (CC0)
- **Shield Shapes:** heraldicart.org

---

*This document serves as the core reference for Lineageweaver development. All development work should align with specifications outlined here.*
