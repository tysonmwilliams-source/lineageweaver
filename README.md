# Lineageweaver

A web-based fantasy genealogy visualization tool for worldbuilders with an integrated wiki-style encyclopedia system.

## What is Lineageweaver?

Lineageweaver helps fantasy writers and worldbuilders track complex family relationships, including:
- Multiple marriages and illegitimate children
- Magical bloodlines and non-human species
- Political titles and succession
- Inter-family alliances and marriages
- **Rich worldbuilding through The Codex encyclopedia system**
- **Seamless integration between family trees and character biographies**

## Current Version: 0.8.2 - Module 1E Complete

### What's New in v0.8.2 (January 7, 2026)

**📍 HORIZONTAL LAYOUT**

View your family tree with ancestors on the left and descendants flowing to the right!

**Features:**
- **Toggle Button** - Click the layout icons in the bottom-left corner
- **Keyboard Shortcut** - Press `H` to toggle between vertical/horizontal
- **Persistent Preference** - Your choice is saved in localStorage
- **Auto-Center** - Tree automatically centers on content when switching
- **Both Themes** - Works perfectly in Royal Parchment and Light Manuscript

**Keyboard Shortcuts (new):**
| Key | Action |
|-----|--------|
| `H` | Toggle horizontal/vertical layout |
| `+` / `=` | Zoom in |
| `-` | Zoom out |
| `0` | Reset view |

---

### Previous Version: 0.8.1 - Module 1E Core Features (January 7, 2026)

**📦 MODULE 1E COMPLETE**

All core Module 1E features are now fully implemented:

| Feature | Status |
|---------|--------|
| ✅ Export to JSON | Auto-backup every 15 mins + manual |
| ✅ Import from JSON | Validation, preview, conflict resolution |
| ✅ Species Field | Non-human characters supported |
| ✅ Titles System | Noble titles with date ranges |
| ✅ Magical Bloodlines | Inherited abilities tracking |
| ✅ Horizontal Layout | Left-to-right tree view with toggle |
| 🅿️ Timeline View | Parked indefinitely |

**Import from JSON Features:**
- File selection for `.json` backups
- Automatic validation (version, required fields)
- Preview showing counts before import
- Conflict detection for duplicate IDs
- Three conflict resolution strategies:
  - **Skip** - Don't import conflicting records (safest)
  - **Overwrite** - Replace existing records
  - **Keep Both** - Create duplicates with new IDs
- Progress tracking with status messages
- Automatic version migration (v1 → v2)
- Codex entries import support

**Location:** Manage Data → Import/Export tab

---

### Previous Version: 0.8.0 - Tree-Codex Integration (January 7, 2026)

**🔗 TREE-CODEX INTEGRATION - Phase 1 Complete**

The Family Tree and The Codex are now fully connected. Every person in your genealogy can have a rich biography in The Codex, with seamless navigation between both systems.

---

#### ✅ Auto-Creation of Codex Entries

**What It Does:** When you create a new person in Data Management, a skeleton Codex entry is automatically created for them.

**Entry Contents:**
- **Title:** Full name (e.g., "Aldric Wilfrey")
- **Subtitle:** Combines maiden name and life dates
  - Example: "née Thornwood | b. 1245 - d. 1289"
  - Or just dates: "b. 1245 - d. 1289"
  - Or just maiden name: "née Thornwood"
- **Type:** Personage
- **Category:** Personages
- **Content:** Empty (ready for you to write their biography)
- **Genealogy Metadata:** DOB, DOD, gender, legitimacy status, house link

**Benefits:**
- No duplicate data entry
- Every person is pre-linked to The Codex
- Fill in biographies at your leisure
- All vital stats sync automatically

---

#### ✅ Cascade Delete

**What It Does:** When you delete a person from the genealogy database, their Codex entry is automatically deleted too.

**Benefits:**
- No orphaned biography entries
- Data stays consistent
- One-click cleanup

---

#### ✅ Migration Tool for Existing People

**What It Does:** Creates Codex entries for people who existed before the integration was implemented.

**Location:** Data Management → Import/Export tab → "🔗 Codex Integration" section

**Features:**
- Shows count of people needing migration
- Preview list before running
- Progress bar with real-time logging
- Auto-refreshes all data on completion
- Handles errors gracefully (one failure doesn't stop the batch)

**Usage:**
1. Navigate to Data Management → Import/Export
2. Scroll to "🔗 Codex Integration"
3. Review the count and preview
4. Click "Create X Codex Entries"
5. Watch the progress
6. Done! All people now have Codex entries

---

#### ✅ Bidirectional Navigation

**From Data Management → Codex:**
- When editing a person with a Codex entry, you'll see a **"📖 Biography Available"** section
- Click **"📖 View Biography"** to navigate directly to their Codex entry

**From Family Tree → Codex:**
- Click any person to open the QuickEditPanel sidebar
- If they have a Codex entry, you'll see a **"📖 View Biography"** link
- Click it to navigate to their biography

**From Codex → Family Tree:**
- When viewing a personage Codex entry
- Click **"🌳 View in Family Tree"** button
- Navigate directly to the Family Tree page

---

#### ✅ Visual Indicators (📖 Badges)

**In Data Management (People Tab):**
- People with Codex entries show a **"📖 Biography"** badge
- Quickly see who has been documented

**In Family Tree (QuickEditPanel):**
- When viewing a person's details
- **"📖 View Biography"** link appears if they have a Codex entry
- Golden amber styling matches The Codex aesthetic

---

#### ✅ Biography Coverage Stats

**Location:** The Codex landing page → "📖 Biography Coverage" section

**Shows:**
- **Progress bar** with completion percentage
- **Total People** count from genealogy database
- **With Biographies** count (linked to Codex)
- **Awaiting Entry** count (not yet linked)
- **✅ "All people have Codex entries!"** message when 100% complete
- **💡 Migration hint** if some people need entries

**Purpose:**
- Track your documentation progress
- Quickly identify gaps
- Motivate comprehensive worldbuilding

---

#### 📁 Files Added/Modified in v0.8.0

**New Files:**
- `src/components/CodexMigrationTool.jsx` - Migration tool component with progress tracking

**Modified Files:**
- `src/contexts/GenealogyContext.jsx` - Auto-creation on addPerson(), cascade delete on deletePerson()
- `src/services/codexService.js` - Added `getEntryByPersonId()` helper function
- `src/components/PersonForm.jsx` - Added "📖 View Biography" button section
- `src/components/PersonList.jsx` - Added 📖 badge for people with Codex entries
- `src/components/PersonCard.jsx` - Added "📖 View Biography" link in sidebar
- `src/components/ImportExportManager.jsx` - Integrated CodexMigrationTool
- `src/pages/CodexEntryView.jsx` - Added "🌳 View in Family Tree" button
- `src/pages/CodexEntryView.css` - Secondary button styling
- `src/pages/CodexLanding.jsx` - Added Biography Coverage stats section
- `src/pages/CodexLanding.css` - Stats section styling

---

### Previous Version: 0.7.0 - Shared State Architecture & Relationship Management

**🔗 SHARED STATE ARCHITECTURE**

ManageData and FamilyTree are tethered through a shared context system - edit in one place, see changes everywhere instantly.

**Key Features:**
- GenealogyContext provides single source of truth
- Instant synchronization between all views
- Enhanced QuickEditPanel with relationship management
- Add spouse/parent/child/sibling directly from tree view
- Smart defaults for new person forms
- Clickable navigation between related people
- Auto-center tree on content at load

---

### Previous Version: 0.6.1 - Generation Sorting & Bastard Line Fixes

**🎯 CRITICAL GENEALOGY FIXES**

- **Parent DOB Sorting** - Groups sort by parent's birth date, not eldest child's
- **Bastard Line Origin Fix** - Lines issue from correct biological parent(s)
- **Generation Spacing** - Adjusted to 100px default

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

1. **Import Sample Data** - The Codex comes with 23 canonical House Wilfrey entries
   - Navigate to `/codex`
   - Click "📥 Import House Wilfrey Data"
   - Explore the interconnected entries!

2. **Run the Migration Tool** - Connect existing people to The Codex
   - Navigate to `/manage` (Data Management)
   - Go to Import/Export tab
   - Scroll to "🔗 Codex Integration"
   - Click "Create X Codex Entries" if any people need migration

3. **Explore The Family Tree** - Sample Wilfrey family data is pre-loaded
   - Navigate to `/tree`
   - Click any person card to open the relationship panel
   - Try the "📖 View Biography" link!

4. **Switch Themes** - Try both medieval manuscript themes
   - Click the sun/moon toggle in the navigation bar
   - See how colors adapt instantly

---

## Technology Stack

- **React 18** - UI framework with modern hooks
- **D3.js v7** - Data visualization and tree rendering
- **Vite** - Build tool and dev server
- **Dexie.js** - IndexedDB wrapper for local data storage
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v6** - Navigation between pages
- **marked** - Markdown parsing for Codex entries

---

## Project Structure

```
lineageweaver/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── Navigation.jsx       # Unified navigation bar
│   │   ├── QuickEditPanel.jsx   # Relationship management sidebar
│   │   ├── PersonCard.jsx       # Person details with Codex link
│   │   ├── PersonList.jsx       # People list with 📖 badges
│   │   ├── PersonForm.jsx       # Person edit form with biography link
│   │   ├── CodexMigrationTool.jsx # Migration tool (NEW v0.8.0)
│   │   ├── ThemeContext.jsx     # Theme state management
│   │   └── ...
│   ├── contexts/                # React Context providers
│   │   └── GenealogyContext.jsx # Shared data state + Codex integration
│   ├── pages/                   # Page components
│   │   ├── Home.jsx             # Landing page
│   │   ├── FamilyTree.jsx       # Tree visualization
│   │   ├── ManageData.jsx       # Data management
│   │   ├── CodexLanding.jsx     # Codex home + Biography stats
│   │   ├── CodexEntryView.jsx   # Entry view + Tree navigation
│   │   ├── CodexBrowse.jsx      # Browse entries by type
│   │   └── ...
│   ├── services/                # Database operations
│   │   ├── database.js          # Dexie setup & genealogy CRUD
│   │   ├── codexService.js      # Codex CRUD + getEntryByPersonId()
│   │   └── ...
│   ├── utils/                   # Helper functions
│   │   ├── wikiLinkParser.js    # Wiki-link processing
│   │   ├── themeColors.js       # Theme utilities
│   │   ├── RelationshipCalculator.js # Family relationship labels
│   │   └── ...
│   ├── data/                    # Sample data
│   │   ├── codex-seed-data.js   # 23 House Wilfrey entries
│   │   └── sampleData.js        # Family tree data
│   ├── styles/                  # Global styles and themes
│   │   └── themes/              # Theme CSS files
│   └── App.jsx                  # Root component with routing
├── public/                      # Static assets
├── PHASE1_COMPLETE.md           # Tree-Codex integration documentation
└── package.json
```

---

## Features Overview

### 🌳 Family Tree Visualization

**Core Features:**
- Interactive D3.js-powered genealogy tree
- Unlimited generation support with dynamic detection
- Three independent line systems (legitimate/bastard/adopted)
- Auto-center on content at load
- Parent DOB sorting preserves family hierarchy
- Smart bastard lines issue from correct parent(s)
- Color-coded relationships and house affiliations
- Zoom and pan for large family trees
- Search and highlight people by name
- Relationship calculator with gender-aware labels

**Quick Edit Panel (Enhanced):**
- View person details - Name, dates, house, status
- **📖 View Biography link** - Navigate to Codex entry (NEW v0.8.0)
- See all relationships - Spouses, parents, siblings, children
- Add new family members directly from the panel
- Smart defaults - Form pre-fills based on relationship type
- Navigate relationships - Click any person to switch to their panel
- Scrollable content with fixed header/footer

**Visual Design:**
- 150×70px person cards with birth/death dates
- Color-coded borders (legitimacy status)
- Color-coded backgrounds (house affiliation)
- Independent line systems prevent overlap
- Medieval manuscript aesthetic

---

### 📚 The Codex Encyclopedia

**Core Features:**
- Wiki-style encyclopedia for worldbuilding
- Six entry types: Personages, Houses, Locations, Events, Mysteria, Custom
- Markdown content support with `[[wiki-link]]` syntax
- Automatic bi-directional linking
- Backlinks panel showing all references
- Advanced browse pages with filtering/sorting/pagination
- Full-text search across all content
- Tag-based organization
- Era/timeline categorization

**Tree-Codex Integration (NEW v0.8.0):**
- **Auto-creation** - New people get Codex entries automatically
- **Cascade delete** - Delete person → delete Codex entry
- **📖 View Biography** - Navigate from tree to biography
- **🌳 View in Family Tree** - Navigate from biography to tree
- **📖 Badges** - Visual indicators showing who has biographies
- **Biography Coverage Stats** - Track documentation progress
- **Migration Tool** - Bulk-create entries for existing people

**Content Discovery:**
- Browse entries by type
- Filter by tags, era, search terms
- Sort by date, title, or word count
- Navigate through wiki-links
- Discover connections via backlinks
- "Article of Interest" random discovery

---

### 🔗 Shared State Architecture

**GenealogyContext provides:**
- Single source of truth for all data
- Instant synchronization between views
- Automatic tree redraw on data changes
- Centralized CRUD operations with Codex integration
- Error handling and loading states

**How to use in components:**
```jsx
import { useGenealogy } from '../contexts/GenealogyContext';

function MyComponent() {
  const { 
    people, 
    houses, 
    relationships,
    addPerson,      // Auto-creates Codex entry
    updatePerson,
    deletePerson    // Cascade deletes Codex entry
  } = useGenealogy();
  
  // Data is always fresh, changes propagate everywhere
}
```

---

### 🎨 Medieval Theme System

**Two Professional Themes:**
- **Royal Parchment** (Dark) - Warm browns for low-light viewing
- **Light Manuscript** (Light) - Cream backgrounds for daylight

**Features:**
- Instant theme switching (< 100ms)
- Persistent selection via localStorage
- 16 heraldic house colors auto-harmonize
- WCAG 2.1 AA accessibility compliance
- Full Codex integration
- Medieval typography (Cinzel + Crimson Text)

---

### 💾 Data Management

**Storage:**
- Local IndexedDB database (offline-first)
- Auto-backup every 15 minutes
- Manual backup to JSON
- 23 pre-loaded House Wilfrey codex entries
- Sample Wilfrey family tree data

**Operations:**
- Full CRUD for people, houses, relationships, codex entries
- **Auto-creation of Codex entries** on person creation
- **Cascade deletion** when removing people
- Data validation and integrity checks
- Relationship linking with legitimacy types
- Import/export with automatic view refresh

**Migration Tool:**
- Bulk-create Codex entries for existing people
- Progress tracking with detailed logging
- Automatic data refresh on completion

---

## Development Roadmap

### ✅ Completed Phases

#### Module 1A-1D: Core Application (v0.1-0.3)
- [x] React foundation with IndexedDB
- [x] Person, House, Relationship CRUD
- [x] D3.js tree visualization
- [x] Three-line system for legitimacy types
- [x] Search, quick-edit, relationship calculator
- [x] House selector and navigation

#### Theme System (v0.4)
- [x] Dual-theme system (Royal Parchment + Light Manuscript)
- [x] CSS custom properties architecture
- [x] React Context state management
- [x] Theme utilities and documentation
- [x] Full D3.js integration

#### The Codex - Phase 1 & 2 (v0.5-0.6)
- [x] Database schema (codexEntries + codexLinks tables)
- [x] Full CRUD with codex service
- [x] Wiki-link parser (`[[Name]]` → clickable links)
- [x] Backlinks panel with context snippets
- [x] Browse pages with advanced filtering
- [x] 23 canonical seed entries
- [x] Medieval manuscript aesthetic

#### Critical Genealogy Fixes (v0.6.1)
- [x] Parent DOB sorting (not eldest child)
- [x] Bastard line origin fix (one parent vs both parents)
- [x] Vertical spacing adjustment (150px → 100px default)

#### Shared State & Relationship Management (v0.7.0)
- [x] GenealogyContext shared data provider
- [x] Instant synchronization between ManageData and FamilyTree
- [x] Enhanced QuickEditPanel with relationship management
- [x] Add spouse/parent/child/sibling directly from tree
- [x] Smart defaults for new person forms
- [x] Clickable navigation between related people
- [x] Auto-center tree on content at load
- [x] Import triggers automatic context refresh

#### Tree-Codex Integration - Phase 1 (v0.8.0) ✅ COMPLETE
- [x] Auto-creation of Codex entries when creating people
- [x] Enhanced skeleton entries with DOB/DOD metadata
- [x] Cascade delete of Codex entries when deleting people
- [x] Navigation: Data Management → Codex ("📖 View Biography")
- [x] Navigation: Family Tree → Codex ("📖 View Biography")
- [x] Navigation: Codex → Family Tree ("🌳 View in Family Tree")
- [x] 📖 badges in PersonList showing who has biographies
- [x] 📖 link in PersonCard sidebar
- [x] Biography Coverage stats on Codex landing page
- [x] Migration tool for existing people
- [x] `getEntryByPersonId()` service helper

---

### 🔜 Next Phases

#### The Codex - Phase 2: Enhanced Integration
**Status:** Ready to Begin
- [ ] Biography content status indicators (empty vs written)
- [ ] Preview snippets on hover
- [ ] Bulk biography editing
- [ ] Person highlighting when navigating from Codex to tree
- [ ] Mini family tree widget in personage entries

#### The Codex - Phase 3: Knowledge Graph
**Status:** Awaiting Phase 2
- [ ] Interactive graph visualization
- [ ] D3 force-directed layout
- [ ] Filter by entry type, era, house
- [ ] Click nodes to navigate to entries

#### Module 1E: Advanced Tree Features
**Status:** Complete ✅
- [x] Export to JSON (auto-backup)
- [x] Manual backup functionality
- [x] Import from JSON (with validation, preview, conflict resolution)
- [x] Additional metadata (maiden name, legitimacy, cadet houses)
- [x] Species field (non-human characters)
- [x] Titles system
- [x] Magical bloodlines tracking
- [x] Horizontal layout option (with toggle + keyboard shortcut)
- [ ] ~~Timeline view~~ (parked indefinitely)

---

## Key Accomplishments

### What Works Now

**Family Tree:**
- ✅ Render unlimited generation trees dynamically
- ✅ Three independent line systems (no overlap)
- ✅ Auto-center on content at load
- ✅ Parent DOB sorting preserves family hierarchy
- ✅ Smart bastard lines (one parent vs both parents)
- ✅ Color-coded relationships and houses
- ✅ Search, quick-edit, relationship calculator
- ✅ Add family members directly from QuickEditPanel
- ✅ Navigate between related people in sidebar
- ✅ **📖 View Biography link in sidebar** (NEW v0.8.0)
- ✅ Zoom/pan with preserved state
- ✅ Adjustable generation spacing

**Tree-Codex Integration:**
- ✅ **Auto-creation** - New people get Codex entries automatically
- ✅ **Enhanced skeleton entries** - DOB/DOD in subtitle, genealogy metadata stored
- ✅ **Cascade delete** - No orphaned Codex entries
- ✅ **📖 View Biography** - Navigate from tree/manage to Codex
- ✅ **🌳 View in Family Tree** - Navigate from Codex to tree
- ✅ **📖 Badges** - Visual indicators in PersonList
- ✅ **Biography Coverage Stats** - Progress tracking on Codex landing
- ✅ **Migration Tool** - Bulk-create entries for existing people

**Shared State:**
- ✅ GenealogyContext provides single source of truth
- ✅ Changes in ManageData instantly update FamilyTree
- ✅ Changes in FamilyTree instantly update ManageData
- ✅ Import data automatically refreshes all views
- ✅ No more stale data when switching pages

**The Codex:**
- ✅ Create, read, update, delete entries
- ✅ Six entry types with tag/era organization
- ✅ Markdown content with `[[wiki-link]]` syntax
- ✅ Automatic link creation and backlinks
- ✅ Browse pages with advanced filtering
- ✅ Full-text search across content
- ✅ 23 canonical entries pre-loaded
- ✅ **Biography Coverage tracking** (NEW v0.8.0)

**System:**
- ✅ Two professional themes with instant switching
- ✅ Unified navigation across all pages
- ✅ IndexedDB with auto-backup
- ✅ Medieval manuscript aesthetic
- ✅ Fully responsive design
- ✅ WCAG 2.1 AA accessibility

---

### Unique Innovations

**Not Found in Other Genealogy Tools:**
1. **Tree-Codex Integration** - Genealogy and encyclopedia seamlessly connected
2. **Auto-Creation** - Every person automatically gets a biography entry
3. **Bidirectional Navigation** - Jump between tree and codex with one click
4. **Biography Coverage Tracking** - See documentation progress at a glance
5. **Shared State Architecture** - ManageData and FamilyTree sync instantly
6. **In-Tree Relationship Management** - Add family members without leaving the tree
7. **Smart Form Defaults** - Add Child pre-fills +25 years, same house, same surname
8. **Three-Line System** - Separate visual layers for legitimate/bastard/adopted
9. **Parent DOB Sorting** - Preserves family unit hierarchy across generations
10. **Smart Bastard Lines** - Context-aware line origin (one parent vs both parents)
11. **Medieval Theme System** - Professional dual themes with auto-harmonizing colors
12. **Wiki-Link Intelligence** - Automatic relationship discovery through `[[Name]]` syntax

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

**Optimizations:**
- Theme switching: < 100ms
- Context updates: < 16ms (instant feel)
- Tree redraw: ~200ms for 50+ people
- Auto-center calculation: ~10ms
- Wiki-link parsing: ~50ms per entry
- Migration tool: ~50ms per person

**Scalability:**
- Family tree: Tested with 100+ people
- Codex: Designed for 1000+ entries
- Context: Handles thousands of records efficiently
- Migration: Handles 100+ people with progress tracking

---

## Contributing

This is a personal worldbuilding tool built with permission-based development. Suggestions and bug reports welcome!

---

## License

MIT

---

## Author

Ty Williams  
December 2024 - January 2026

---

**Current Version:** 0.8.2 (Module 1E Complete)  
**Last Updated:** January 7, 2026

---

## Quick Links

- **Family Tree:** Navigate to `/tree`
- **The Codex:** Navigate to `/codex`
- **Browse Personages:** Navigate to `/codex/browse/personage`
- **Browse Houses:** Navigate to `/codex/browse/house`
- **Data Management:** Navigate to `/manage`

---

## What's Next?

**Phase 2: Enhanced Integration**
- Biography content status (empty vs written)
- Preview snippets on hover
- Person highlighting when navigating from Codex
- Mini family tree in personage entries

Stay tuned! 🚀
