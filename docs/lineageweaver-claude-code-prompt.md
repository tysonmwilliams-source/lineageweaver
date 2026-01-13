# Claude Code Integration Implementation Prompt
## LineageWeaver - Achieving Full Data Interconnectivity

**Purpose:** This prompt guides Claude Code through a systematic audit and implementation of cross-system integration in LineageWeaver.

---

## Context

You are working on **LineageWeaver**, a fantasy genealogy visualization tool with 6 major interconnected systems:

1. **Family Tree** - D3.js visualization of people and relationships
2. **The Codex** - Wiki-style encyclopedia system
3. **The Armory** - Heraldry design and management
4. **Dignities** - Titles, tenures, and feudal hierarchy
5. **Data Management** - CRUD operations and cloud sync
6. **Household Roles** - Non-hereditary service positions

The goal is to achieve **full integration** where every entity is properly connected to related entities across all systems. Currently, only ~40% of potential integrations are implemented.

---

## Your Mission

Execute a **phased implementation** to achieve complete cross-system data integration. Follow the Development Guidelines in `/DEVELOPMENT_GUIDELINES.md` for all code changes.

### Phase 1: Audit Current State

**Task 1.1:** Run this integration health check script:

```bash
# Create a diagnostic script
cat > /tmp/integration-audit.js << 'EOF'
// Run with: node /tmp/integration-audit.js (from lineageweaver directory)

const Dexie = require('dexie');

async function auditIntegration() {
  const db = new Dexie('LineageweaverDB');
  db.version(12).stores({
    people: '++id, firstName, lastName, houseId, codexEntryId, heraldryId',
    houses: '++id, houseName, codexEntryId, heraldryId',
    codexEntries: '++id, type, title, personId, houseId, heraldryId',
    heraldry: '++id, name, codexEntryId',
    dignities: '++id, name, currentHolderId, currentHouseId, codexEntryId',
    householdRoles: '++id, houseId, currentHolderId'
  });

  await db.open();

  const results = {
    people: { total: 0, withCodex: 0, withHeraldry: 0 },
    houses: { total: 0, withCodex: 0, withHeraldry: 0 },
    codexEntries: { total: 0, orphaned: 0, byType: {} },
    heraldry: { total: 0, withCodex: 0, linkedToHouses: 0, linkedToPeople: 0 },
    dignities: { total: 0, withCodex: 0, withHolder: 0 },
    householdRoles: { total: 0 }
  };

  // Audit people
  const people = await db.people.toArray();
  results.people.total = people.length;
  results.people.withCodex = people.filter(p => p.codexEntryId).length;
  results.people.withHeraldry = people.filter(p => p.heraldryId).length;

  // Audit houses
  const houses = await db.houses.toArray();
  results.houses.total = houses.length;
  results.houses.withCodex = houses.filter(h => h.codexEntryId).length;
  results.houses.withHeraldry = houses.filter(h => h.heraldryId).length;

  // Audit codex entries
  const codexEntries = await db.codexEntries.toArray();
  results.codexEntries.total = codexEntries.length;
  codexEntries.forEach(e => {
    results.codexEntries.byType[e.type] = (results.codexEntries.byType[e.type] || 0) + 1;
    if (e.type === 'personage' && !e.personId) results.codexEntries.orphaned++;
    if (e.type === 'house' && !e.houseId) results.codexEntries.orphaned++;
  });

  // Audit dignities
  const dignities = await db.dignities.toArray();
  results.dignities.total = dignities.length;
  results.dignities.withCodex = dignities.filter(d => d.codexEntryId).length;
  results.dignities.withHolder = dignities.filter(d => d.currentHolderId).length;

  // Audit heraldry
  const heraldry = await db.heraldry.toArray();
  results.heraldry.total = heraldry.length;
  results.heraldry.withCodex = heraldry.filter(h => h.codexEntryId).length;
  results.heraldry.linkedToHouses = houses.filter(h => h.heraldryId).length;
  results.heraldry.linkedToPeople = people.filter(p => p.heraldryId).length;

  // Audit household roles
  const roles = await db.householdRoles.toArray();
  results.householdRoles.total = roles.length;

  console.log('\n=== LINEAGEWEAVER INTEGRATION AUDIT ===\n');
  console.log('PEOPLE:', results.people.total);
  console.log('  - With Codex entry:', results.people.withCodex, `(${Math.round(results.people.withCodex/results.people.total*100)}%)`);
  console.log('  - With Personal Arms:', results.people.withHeraldry);
  console.log('');
  console.log('HOUSES:', results.houses.total);
  console.log('  - With Codex entry:', results.houses.withCodex, `(${Math.round(results.houses.withCodex/results.houses.total*100 || 0)}%)`);
  console.log('  - With Heraldry:', results.houses.withHeraldry);
  console.log('');
  console.log('CODEX ENTRIES:', results.codexEntries.total);
  console.log('  - By Type:', results.codexEntries.byType);
  console.log('  - Orphaned:', results.codexEntries.orphaned);
  console.log('');
  console.log('DIGNITIES:', results.dignities.total);
  console.log('  - With Codex entry:', results.dignities.withCodex, `(${Math.round(results.dignities.withCodex/results.dignities.total*100 || 0)}%)`);
  console.log('  - With Current Holder:', results.dignities.withHolder);
  console.log('');
  console.log('HERALDRY:', results.heraldry.total);
  console.log('  - With Codex entry:', results.heraldry.withCodex, `(${Math.round(results.heraldry.withCodex/results.heraldry.total*100 || 0)}%)`);
  console.log('  - Linked to Houses:', results.heraldry.linkedToHouses);
  console.log('  - Linked to People:', results.heraldry.linkedToPeople);
  console.log('');
  console.log('HOUSEHOLD ROLES:', results.householdRoles.total);
  
  console.log('\n=== INTEGRATION GAPS ===\n');
  if (results.houses.withCodex < results.houses.total) {
    console.log('⚠️  Houses missing Codex entries:', results.houses.total - results.houses.withCodex);
  }
  if (results.dignities.withCodex < results.dignities.total) {
    console.log('⚠️  Dignities missing Codex entries:', results.dignities.total - results.dignities.withCodex);
  }
  if (results.heraldry.withCodex < results.heraldry.total) {
    console.log('⚠️  Heraldry missing Codex entries:', results.heraldry.total - results.heraldry.withCodex);
  }
  
  db.close();
}

auditIntegration().catch(console.error);
EOF
```

**Task 1.2:** Read and understand these key files:
- `/src/contexts/GenealogyContext.jsx` - Current integration hub
- `/src/services/codexService.js` - Codex CRUD operations
- `/src/services/dignityService.js` - Dignity operations
- `/src/services/heraldryService.js` - Heraldry operations
- `/src/components/PersonCard.jsx` - Tree visualization component

---

### Phase 2: House → Codex Integration (CRITICAL)

**Goal:** When a house is created, automatically create a corresponding Codex entry.

**File to modify:** `src/contexts/GenealogyContext.jsx`

**Current `addHouse` function (around line 210):**
```javascript
const addHouse = useCallback(async (houseData) => {
  try {
    const newId = await dbAddHouse(houseData);
    const newHouse = { ...houseData, id: newId };
    setHouses(prev => [...prev, newHouse]);
    setDataVersion(v => v + 1);
    
    if (user) {
      syncAddHouse(user.uid, newId, newHouse);
    }
    
    console.log('✅ House added:', newHouse.houseName);
    return newId;
  } catch (err) {
    console.error('❌ Failed to add house:', err);
    throw err;
  }
}, [user]);
```

**Modified version (add Codex auto-creation):**
```javascript
const addHouse = useCallback(async (houseData) => {
  try {
    // 1. Add to local database
    const newId = await dbAddHouse(houseData);
    
    // 2. Auto-create Codex entry for house
    let codexEntryId = null;
    try {
      codexEntryId = await createCodexEntry({
        type: 'house',
        title: houseData.houseName,
        subtitle: houseData.motto || null,
        content: '',
        category: 'Houses',
        tags: ['house', houseData.houseType || 'noble'],
        era: houseData.foundedDate ? `Founded ${houseData.foundedDate}` : null,
        houseId: newId,
        isAutoGenerated: true
      });
      
      // Update house with codex link
      await dbUpdateHouse(newId, { codexEntryId: codexEntryId });
      console.log('📖 Codex entry auto-created for house:', houseData.houseName);
      
      // Sync codex entry to cloud
      if (user) {
        syncAddCodexEntry(user.uid, codexEntryId, {
          type: 'house',
          title: houseData.houseName,
          houseId: newId
        });
      }
    } catch (codexErr) {
      console.warn('⚠️ Failed to auto-create Codex entry for house:', codexErr.message);
    }
    
    // 3. Update local state
    const newHouse = { ...houseData, id: newId, codexEntryId: codexEntryId };
    setHouses(prev => [...prev, newHouse]);
    setDataVersion(v => v + 1);
    
    // 4. Sync to cloud
    if (user) {
      syncAddHouse(user.uid, newId, newHouse);
    }
    
    console.log('✅ House added:', newHouse.houseName);
    return newId;
  } catch (err) {
    console.error('❌ Failed to add house:', err);
    throw err;
  }
}, [user]);
```

**Also update `deleteHouse` for cascade deletion:**
```javascript
const deleteHouse = useCallback(async (id) => {
  try {
    const houseToDelete = houses.find(h => h.id === id);
    const codexEntryId = houseToDelete?.codexEntryId;
    
    await dbDeleteHouse(id);
    
    // Cascade delete Codex entry
    if (codexEntryId) {
      try {
        await deleteCodexEntry(codexEntryId);
        console.log('📖 Codex entry cascade-deleted for house:', codexEntryId);
        
        if (user) {
          syncDeleteCodexEntry(user.uid, codexEntryId);
        }
      } catch (codexErr) {
        console.warn('⚠️ Failed to cascade-delete Codex entry:', codexErr.message);
      }
    }
    
    setHouses(prev => prev.filter(house => house.id !== id));
    setDataVersion(v => v + 1);
    
    if (user) {
      syncDeleteHouse(user.uid, id);
    }
    
    console.log('✅ House deleted:', id);
  } catch (err) {
    console.error('❌ Failed to delete house:', err);
    throw err;
  }
}, [houses, user]);
```

---

### Phase 3: Dignity → Codex Integration (CRITICAL)

**Goal:** When a dignity is created, optionally create a corresponding Codex entry.

**File to modify:** `src/services/dignityService.js`

**Modify `createDignity` function (around line 280):**

```javascript
/**
 * Create a new dignity record with optional Codex entry
 * 
 * @param {Object} dignityData - The dignity data to save
 * @param {boolean} createCodexEntry - Whether to auto-create Codex entry (default: true)
 * @param {string} [userId] - Optional user ID for cloud sync
 */
export async function createDignity(dignityData, createCodexDoc = true, userId = null) {
  try {
    const now = new Date().toISOString();
    
    const record = {
      // ... existing record fields ...
      name: dignityData.name || 'Untitled Dignity',
      shortName: dignityData.shortName || null,
      dignityClass: dignityData.dignityClass || 'driht',
      dignityRank: dignityData.dignityRank || null,
      // ... rest of fields ...
      codexEntryId: dignityData.codexEntryId || null,
      created: now,
      updated: now
    };
    
    const id = await db.dignities.add(record);
    console.log('📜 Dignity created with ID:', id, '-', record.name);
    
    // Auto-create Codex entry for dignity documentation
    if (createCodexDoc && !record.codexEntryId) {
      try {
        // Import codex service (add at top of file)
        const { createEntry } = await import('./codexService');
        
        const codexEntryId = await createEntry({
          type: 'custom',
          title: record.name,
          subtitle: record.shortName || null,
          content: `## ${record.name}\n\n*A ${DIGNITY_CLASSES[record.dignityClass]?.name || 'dignity'} of the realm.*\n\n### Description\n\n[Add description here]\n\n### History\n\n[Add history here]`,
          category: 'Dignities',
          tags: ['dignity', record.dignityClass, record.dignityRank].filter(Boolean),
          era: null,
          // Custom field for dignity linking
          metadata: { dignityId: id }
        });
        
        // Update dignity with codex link
        await db.dignities.update(id, { codexEntryId });
        console.log('📖 Codex entry auto-created for dignity:', record.name);
        
        // Return updated record
        record.codexEntryId = codexEntryId;
        record.id = id;
        
        // Sync codex to cloud
        if (userId) {
          const { syncAddCodexEntry } = await import('./dataSyncService');
          syncAddCodexEntry(userId, codexEntryId, {
            type: 'custom',
            title: record.name,
            category: 'Dignities'
          });
        }
      } catch (codexErr) {
        console.warn('⚠️ Failed to auto-create Codex entry for dignity:', codexErr.message);
      }
    }
    
    // Sync to cloud if userId provided
    if (userId) {
      syncAddDignity(userId, id, record);
    }
    
    return id;
  } catch (error) {
    console.error('❌ Error creating dignity:', error);
    throw error;
  }
}
```

---

### Phase 4: PersonCard Dignity Display

**Goal:** Show dignity icons on person cards in the Family Tree.

**File to modify:** `src/components/PersonCard.jsx`

**Add dignities display to PersonCard:**

```javascript
// Add to imports
import { getDignityIcon, DIGNITY_CLASSES } from '../services/dignityService';

// Add prop for person's dignities
function PersonCard({ 
  person, 
  house, 
  onClick, 
  selected,
  personDignities = []  // NEW: Pass dignities from parent
}) {
  // ... existing code ...
  
  // In the render, add dignity indicator
  return (
    <div className={`person-card ${selected ? 'person-card--selected' : ''}`}>
      {/* Existing content */}
      <div className="person-card__name">
        {person.firstName} {person.lastName}
      </div>
      
      {/* NEW: Dignity indicator */}
      {personDignities.length > 0 && (
        <div className="person-card__dignities" title={personDignities.map(d => d.name).join(', ')}>
          <span className="person-card__dignity-icon">
            {getDignityIcon(personDignities[0]) || '👑'}
          </span>
          {personDignities.length > 1 && (
            <span className="person-card__dignity-count">+{personDignities.length - 1}</span>
          )}
        </div>
      )}
      
      {/* Rest of existing content */}
    </div>
  );
}
```

**Add CSS for dignity display:**

```css
/* In PersonCard.css */
.person-card__dignities {
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 12px;
}

.person-card__dignity-icon {
  font-size: 14px;
}

.person-card__dignity-count {
  font-size: 10px;
  color: var(--text-secondary);
  background: var(--bg-tertiary);
  padding: 0 4px;
  border-radius: 4px;
}
```

**Update FamilyTree.jsx to load and pass dignities:**

```javascript
// In FamilyTree.jsx, add dignities loading
import { getAllDignities } from '../services/dignityService';

// In component
const [dignities, setDignities] = useState([]);

useEffect(() => {
  async function loadDignities() {
    const allDignities = await getAllDignities();
    setDignities(allDignities);
  }
  loadDignities();
}, []);

// Create lookup map
const dignitiesByPerson = useMemo(() => {
  const map = new Map();
  dignities.forEach(d => {
    if (d.currentHolderId) {
      const existing = map.get(d.currentHolderId) || [];
      map.set(d.currentHolderId, [...existing, d]);
    }
  });
  return map;
}, [dignities]);

// Pass to PersonCard
<PersonCard
  person={person}
  house={house}
  personDignities={dignitiesByPerson.get(person.id) || []}
  // ... other props
/>
```

---

### Phase 5: Heraldry → Codex Integration

**File to modify:** `src/services/heraldryService.js`

**Add Codex creation option to `createHeraldry`:**

```javascript
export async function createHeraldry(heraldryData, createCodexDoc = false) {
  try {
    const now = new Date().toISOString();
    
    const record = {
      // ... existing fields ...
      codexEntryId: heraldryData.codexEntryId || null,
      created: now,
      updated: now
    };
    
    const id = await db.heraldry.add(record);
    console.log('🛡️ Heraldry created with ID:', id);
    
    // Optional Codex documentation
    if (createCodexDoc && !record.codexEntryId) {
      try {
        const { createEntry } = await import('./codexService');
        
        const codexEntryId = await createEntry({
          type: 'heraldry',
          title: record.name,
          subtitle: record.blazon || null,
          content: record.description || `*${record.blazon || 'Arms to be described.'}*`,
          category: 'Heraldry',
          tags: ['heraldry', record.category, record.shieldType].filter(Boolean),
          heraldryId: id
        });
        
        await db.heraldry.update(id, { codexEntryId });
        console.log('📖 Codex entry created for heraldry:', record.name);
      } catch (err) {
        console.warn('⚠️ Could not create Codex entry for heraldry:', err.message);
      }
    }
    
    return id;
  } catch (error) {
    console.error('❌ Error creating heraldry:', error);
    throw error;
  }
}
```

---

### Phase 6: Migration Script for Existing Data

**Create a migration script to add Codex entries for existing houses/dignities:**

```javascript
// File: src/utils/codex-migration.js

import { db } from '../services/database';
import { createEntry } from '../services/codexService';

/**
 * Create Codex entries for all houses without them
 */
export async function migrateHousesToCodex(userId = null) {
  const houses = await db.houses.toArray();
  const migratedCount = { success: 0, skipped: 0, failed: 0 };
  
  for (const house of houses) {
    if (house.codexEntryId) {
      migratedCount.skipped++;
      continue;
    }
    
    try {
      const codexEntryId = await createEntry({
        type: 'house',
        title: house.houseName,
        subtitle: house.motto || null,
        content: house.notes || '',
        category: 'Houses',
        tags: ['house', house.houseType || 'main'],
        era: house.foundedDate ? `Founded ${house.foundedDate}` : null,
        houseId: house.id
      });
      
      await db.houses.update(house.id, { codexEntryId });
      migratedCount.success++;
      console.log('✅ Migrated house:', house.houseName);
    } catch (err) {
      migratedCount.failed++;
      console.error('❌ Failed to migrate house:', house.houseName, err);
    }
  }
  
  return migratedCount;
}

/**
 * Create Codex entries for all dignities without them
 */
export async function migrateDignitiesToCodex(userId = null) {
  const dignities = await db.dignities.toArray();
  const migratedCount = { success: 0, skipped: 0, failed: 0 };
  
  for (const dignity of dignities) {
    if (dignity.codexEntryId) {
      migratedCount.skipped++;
      continue;
    }
    
    try {
      const codexEntryId = await createEntry({
        type: 'custom',
        title: dignity.name,
        subtitle: dignity.shortName || null,
        content: dignity.notes || `*A ${dignity.dignityClass} of the realm.*`,
        category: 'Dignities',
        tags: ['dignity', dignity.dignityClass, dignity.dignityRank].filter(Boolean)
      });
      
      await db.dignities.update(dignity.id, { codexEntryId });
      migratedCount.success++;
      console.log('✅ Migrated dignity:', dignity.name);
    } catch (err) {
      migratedCount.failed++;
      console.error('❌ Failed to migrate dignity:', dignity.name, err);
    }
  }
  
  return migratedCount;
}

/**
 * Run full Codex migration
 */
export async function runFullMigration() {
  console.log('🔄 Starting Codex migration...\n');
  
  console.log('📚 Migrating houses...');
  const houseResults = await migrateHousesToCodex();
  console.log('Houses:', houseResults, '\n');
  
  console.log('👑 Migrating dignities...');
  const dignityResults = await migrateDignitiesToCodex();
  console.log('Dignities:', dignityResults, '\n');
  
  console.log('✅ Migration complete!');
  
  return {
    houses: houseResults,
    dignities: dignityResults
  };
}
```

---

## Verification Commands

After implementation, run these verification checks:

```bash
# 1. Check for TypeScript/ESLint errors
cd /Users/tywilliams/Desktop/lineageweaver
npm run lint

# 2. Test build
npm run build

# 3. Run the app and manually test:
# - Create a new house → verify Codex entry appears
# - Create a new dignity → verify Codex entry appears
# - Delete a house → verify Codex entry deleted
# - Check Tree view → verify dignity icons appear on people with titles
```

---

## Summary Checklist

- [ ] Phase 2: House → Codex auto-creation implemented
- [ ] Phase 2: House deletion → Codex cascade deletion implemented
- [ ] Phase 3: Dignity → Codex auto-creation implemented
- [ ] Phase 4: PersonCard shows dignity icons
- [ ] Phase 4: FamilyTree loads and passes dignities
- [ ] Phase 5: Heraldry → Codex optional creation
- [ ] Phase 6: Migration script for existing data
- [ ] All changes follow Development Guidelines
- [ ] Theme colors use CSS variables only
- [ ] Cloud sync functions called after local operations
- [ ] Console logs removed or guarded with import.meta.env.DEV

---

## Important Notes

1. **Always use `useCallback` for context functions** to prevent unnecessary re-renders
2. **Always call sync functions after local operations** (not before) for local-first architecture
3. **Never hardcode colors** - use CSS custom properties
4. **Test both themes** before committing
5. **File size limits**: Components < 500 lines, Services < 400 lines
6. **Preserve existing functionality** - make surgical edits, don't rebuild

---

*Execute phases sequentially, testing after each phase before moving to the next.*
