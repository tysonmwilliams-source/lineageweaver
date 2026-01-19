# LineageWeaver Development Guidelines

Quick reference for building efficiently. Follow these patterns to avoid common pitfalls.

---

## 🚀 Performance Essentials

### Code-Splitting
```jsx
// ✅ DO: Lazy load routes
const FamilyTree = React.lazy(() => import('./pages/FamilyTree'));

// ❌ DON'T: Eager import everything
import FamilyTree from './pages/FamilyTree';
```

### Memoization
```jsx
// ✅ DO: Memoize expensive objects
const theme = useMemo(() => ({ primary: isDark ? '#gold' : '#brown' }), [isDark]);

// ✅ DO: Wrap handlers in useCallback
const handleClick = useCallback(() => doThing(id), [id]);

// ❌ DON'T: Create objects inline in render
<Component style={{ color: isDark ? 'gold' : 'brown' }} />
```

### Debouncing
```jsx
// ✅ DO: Debounce user input and API calls
const debouncedSearch = useMemo(() => debounce(setQuery, 300), []);
const debouncedSync = useMemo(() => debounce(syncToCloud, 500), []);

// ❌ DON'T: Fire on every keystroke/change
onChange={(e) => syncToCloud(e.target.value)}
```

### Data Lookups
```jsx
// ✅ DO: Use Map for O(1) lookups
const peopleMap = useMemo(() => new Map(people.map(p => [p.id, p])), [people]);
const person = peopleMap.get(id);

// ❌ DON'T: Use find() repeatedly (O(n) each time)
people.find(p => p.id === id);
```

---

## 📐 File Size Limits

| Type | Max Lines | Action if Exceeded |
|------|-----------|-------------------|
| Components | 500 | Split into sub-components |
| Services | 400 | Split by domain |
| Pages | 800 | Extract hooks/logic |
| Utilities | 200 | Split by function group |

---

## 🧹 Code Organization

### DRY Patterns - Extract When Repeated 3+ Times

| Pattern | Extract To |
|---------|-----------|
| Form state logic | `useFormState()` hook |
| Data loading | `useDataLoader()` hook |
| Entity lookup | `src/utils/entityLookup.js` |
| Theme objects | Memoized constant |
| Form CSS | `shared-forms.css` |

### Folder Structure
```
src/
├── components/     # Reusable UI pieces
│   └── index.js    # Barrel exports
├── hooks/          # Custom React hooks
├── pages/          # Route components
├── services/       # Data/API operations
├── utils/          # Pure helper functions
├── contexts/       # React contexts
└── styles/         # CSS files
    └── shared/     # Shared CSS modules
```

---

## 🔗 Connection Audit (Pre-Implementation)

Before implementing significant changes to data models, features, or UI components, perform a **Connection Audit** to identify all system touchpoints. This prevents bugs, technical debt, and the discovery of broken integrations after the fact.

### Why This Matters

LineageWeaver's systems are interconnected:
- People reference Houses, Dignities reference People
- Codex entries cross-link to all entity types
- The same data renders in multiple views (tree, lists, detail pages)
- Cloud sync must handle all entity types consistently

A change to one system often has **flow-through effects** that aren't immediately obvious. Auditing connections upfront means changes are holistic rather than piecemeal.

### The Connection Audit Template

Before making changes, fill out this template:

```markdown
## Connection Audit: [Feature/Change Name]

### 1. Data Flow - Where does this data go TO?
- [ ] Which components DISPLAY this data?
- [ ] Which other entities REFERENCE this data?
- [ ] Which exports/backups INCLUDE this data?
- [ ] Which reports/analysis tools USE this data?

### 2. Data Flow - Where does this data come FROM?
- [ ] Which components CREATE this data?
- [ ] Which components MODIFY this data?
- [ ] Which import tools PRODUCE this data?
- [ ] Which forms/editors AFFECT this data?

### 3. Cross-System Integration
- [ ] Codex cross-linking implications?
- [ ] Cloud sync (add/update/delete functions)?
- [ ] Backup/restore handling?
- [ ] Dataset scoping?

### 4. UI Adaptation Points
- [ ] Conditional rendering based on this data?
- [ ] Different display contexts (card vs detail vs tree)?
- [ ] Navigation/routing affected?
- [ ] Quick edit panel interactions?

### 5. Identified Touchpoints (files to update)
- Component: [filename] - [what needs changing]
- Service: [filename] - [what needs changing]
- CSS: [filename] - [what needs changing]
```

### Common Connection Patterns in LineageWeaver

| Entity Type | Typically Connected To |
|-------------|----------------------|
| Person | House, Relationships, Dignities, Codex, Family Tree, Heraldry (via House) |
| House | People, Dignities, Heraldry, Codex, Color coding throughout app |
| Dignity | Person (holder), House, Codex, Tenure history, Succession |
| Codex Entry | Any entity via cross-links, Categories, Related entries |
| Heraldry | House, Person (via House), Codex |
| Relationship | Two People, Family Tree rendering, Succession calculations |

### Red Flags to Watch For

These indicate you may have missed connections:

1. **"This field doesn't show up in..."** - Data exists but isn't rendered somewhere it should be
2. **"Changes don't persist after..."** - Missing cloud sync or state update
3. **"The old value still appears in..."** - Stale data in a component not receiving updates
4. **"Import works but X doesn't..."** - Import tool not creating all related data
5. **"It works in grid view but not..."** - Inconsistent rendering across view modes

### Example: Adding a New Field to Dignities

**Change:** Add `dignityNature` field (territorial/office/personal-honour/courtesy)

**Audit Result:**
```
Data flows TO:
- DignitiesLanding.jsx (grid cards, hierarchy view)
- DignityView.jsx (detail page, sidebar)
- DignityForm.jsx (create/edit form)
- Person profile (if we show dignities there)
- Codex entry display (when linked)
- Export/backup JSON

Data flows FROM:
- DignityForm.jsx (user input)
- Codex import tool (if importing dignities)
- Bulk import tool
- Any migration scripts

Cross-system:
- Cloud sync: syncAddDignity/syncUpdateDignity need to handle field
- Backup: Field included automatically if in dignity object

UI Adaptation:
- Succession section: Hide if nature === 'personal-honour'
- Tenure history: Different labeling for offices vs hereditary
- Form: New dropdown field needed
- Cards: Maybe show nature as badge/indicator
```

### When to Perform an Audit

- **Always:** New fields on existing entities
- **Always:** New entity types
- **Always:** Changes to data relationships
- **Recommended:** Significant UI restructuring
- **Recommended:** New cross-linking functionality
- **Optional:** Bug fixes (but consider if bug reveals missing connection)

### Documenting Audit Results

For significant changes, create a brief audit document in `/docs/audits/` or include the audit in your PR description. This helps future developers understand why certain files were touched.

---

## ☁️ Firebase & Cloud Sync Rules

LineageWeaver uses a **"local-first with cloud backup"** architecture. Understanding this pattern is critical for all data operations.

### Architecture Overview
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

### The Golden Rule: ALWAYS Sync After Local Operations

When modifying data through GenealogyContext or any service, the pattern is:

```jsx
// ✅ DO: Local first, then sync
const addPerson = useCallback(async (personData) => {
  // 1. Add to local IndexedDB
  const newId = await dbAddPerson(personData, datasetId);
  
  // 2. Update React state (instant UI feedback)
  setPeople(prev => [...prev, { ...personData, id: newId }]);
  
  // 3. Sync to cloud (async, non-blocking)
  if (user) {
    syncAddPerson(user.uid, datasetId, newId, personData);
  }
  
  return newId;
}, [user, datasetId]);

// ❌ DON'T: Forget the cloud sync
const addPerson = useCallback(async (personData) => {
  const newId = await dbAddPerson(personData, datasetId);
  setPeople(prev => [...prev, { ...personData, id: newId }]);
  // Missing sync! Data won't persist to cloud!
  return newId;
}, [datasetId]);
```

### Required Sync Functions for Each Entity Type

Always use the appropriate sync function from `dataSyncService.js`:

| Entity | Add | Update | Delete |
|--------|-----|--------|--------|
| Person | `syncAddPerson()` | `syncUpdatePerson()` | `syncDeletePerson()` |
| House | `syncAddHouse()` | `syncUpdateHouse()` | `syncDeleteHouse()` |
| Relationship | `syncAddRelationship()` | `syncUpdateRelationship()` | `syncDeleteRelationship()` |
| Codex Entry | `syncAddCodexEntry()` | `syncUpdateCodexEntry()` | `syncDeleteCodexEntry()` |
| Codex Link | `syncAddCodexLink()` | — | `syncDeleteCodexLink()` |
| Heraldry | `syncAddHeraldry()` | `syncUpdateHeraldry()` | `syncDeleteHeraldry()` |
| Heraldry Link | `syncAddHeraldryLink()` | — | `syncDeleteHeraldryLink()` |
| Dignity | `syncAddDignity()` | `syncUpdateDignity()` | `syncDeleteDignity()` |
| Dignity Tenure | `syncAddDignityTenure()` | `syncUpdateDignityTenure()` | `syncDeleteDignityTenure()` |
| Dignity Link | `syncAddDignityLink()` | — | `syncDeleteDignityLink()` |
| Household Role | `syncAddHouseholdRole()` | `syncUpdateHouseholdRole()` | `syncDeleteHouseholdRole()` |

### Sync Function Parameters

All sync functions follow the same signature pattern:

```jsx
// Add operations: (userId, datasetId, localId, fullData)
syncAddPerson(user.uid, datasetId, newPersonId, personData);

// Update operations: (userId, datasetId, entityId, changedFields)
syncUpdatePerson(user.uid, datasetId, personId, { firstName: 'New Name' });

// Delete operations: (userId, datasetId, entityId)
syncDeletePerson(user.uid, datasetId, personId);
```

### Checking User Before Sync

Always guard sync calls with a user check:

```jsx
// ✅ DO: Check user exists before syncing
if (user) {
  syncAddPerson(user.uid, datasetId, newId, personData);
}

// ✅ ALSO OK: Let the sync function handle it (it checks internally)
// But explicit checks make intent clearer
syncAddPerson(user?.uid, datasetId, newId, personData);
```

### Dataset ID is Required

Always pass the `datasetId` to sync functions. Get it from the `DatasetContext`:

```jsx
import { useDataset } from '../contexts/DatasetContext';

function MyComponent() {
  const { activeDataset } = useDataset();
  const datasetId = activeDataset?.id || 'default';
  
  // Now use datasetId in all sync calls
}
```

### Adding New Entity Types to Cloud Sync

When adding a new entity type (table) that needs cloud sync:

1. **Add Firestore operations** in `firestoreService.js`:
   ```jsx
   export async function addNewEntityCloud(userId, datasetId, data) { ... }
   export async function getAllNewEntitiesCloud(userId, datasetId) { ... }
   export async function updateNewEntityCloud(userId, datasetId, id, updates) { ... }
   export async function deleteNewEntityCloud(userId, datasetId, id) { ... }
   ```

2. **Add sync wrappers** in `dataSyncService.js`:
   ```jsx
   export async function syncAddNewEntity(userId, datasetId, id, data) {
     if (!userId || !isOnline) return;
     try {
       await addNewEntityCloud(userId, datasetId, { ...data, id });
     } catch (error) {
       console.error('☁️ Failed to sync new entity add:', error);
     }
   }
   ```

3. **Update bulk sync** in `syncAllToCloud()` and `downloadAllFromCloud()`:
   ```jsx
   // In syncAllToCloud:
   for (const entity of newEntities || []) {
     const docRef = getUserDoc(userId, datasetId, 'newEntities', String(entity.id));
     batch.set(docRef, { ...entity, localId: entity.id, syncedAt: serverTimestamp() });
     await checkBatch();
   }
   ```

4. **Update initializeSync** in `dataSyncService.js` to restore the new entity type.

5. **Export from firestoreService.js default export**.

### Error Handling in Sync

Sync errors should NOT block local operations:

```jsx
// ✅ DO: Catch sync errors silently (local operation already succeeded)
try {
  await addNewEntityCloud(userId, datasetId, data);
} catch (error) {
  console.error('☁️ Failed to sync:', error);
  // Don't throw! Local operation was successful.
}

// ❌ DON'T: Let sync errors propagate
await addNewEntityCloud(userId, datasetId, data); // Uncaught error breaks UI
```

### Firestore Document Structure

All cloud documents follow this pattern:

```javascript
{
  ...entityData,           // All local fields
  localId: entity.id,      // Original local ID for mapping
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  // OR for non-updatable entities:
  syncedAt: serverTimestamp()
}
```

### Firestore Batch Limits

When doing bulk operations, Firestore batches have a **500 operation limit**:

```jsx
// ✅ DO: Check batch size and commit when approaching limit
let operationCount = 0;
let batch = writeBatch(db);

const checkBatch = async () => {
  operationCount++;
  if (operationCount >= 450) { // Leave buffer
    await batch.commit();
    batch = writeBatch(db);
    operationCount = 0;
  }
};
```

---

## 🔒 Robustness Checklist

### Every Component Should Have:
- [ ] Error Boundary wrapper (for critical paths)
- [ ] Loading states
- [ ] Empty states
- [ ] Cleanup in useEffect (AbortController or isMounted flag)

### Async Pattern
```jsx
useEffect(() => {
  let cancelled = false;
  
  async function load() {
    const data = await fetchData();
    if (!cancelled) setData(data);
  }
  
  load();
  return () => { cancelled = true; };
}, [deps]);
```

---

## 🎨 Theming Rules

1. **Never hardcode colors** - Use CSS custom properties
2. **One theme file for structure**, separate files for color values only
3. **Test both themes** before committing

```css
/* ✅ DO */
color: var(--text-primary);

/* ❌ DON'T */
color: #1a1a2e;
```

---

## 🗑️ Cleanup Discipline

### Before Each Commit:
- Remove `console.log` statements (or use `import.meta.env.DEV` guard)
- Delete commented-out code (Git has history)
- Move unused files to `/_archived/` outside src/
- Update version in package.json for releases

### Quarterly:
- Run bundle analyzer: `npx vite-bundle-visualizer`
- Audit unused dependencies
- Review files > 500 lines

---

## ⚡ useEffect Rules

### Split by Concern
```jsx
// ✅ DO: One effect per responsibility
useEffect(() => { /* fetch data */ }, [id]);
useEffect(() => { /* set up event listener */ }, []);
useEffect(() => { /* sync to cloud */ }, [data]);

// ❌ DON'T: One massive effect with 10+ dependencies
useEffect(() => { /* everything */ }, [a, b, c, d, e, f, g, h, i, j]);
```

### Dependency Limit
- **Target:** ≤ 4 dependencies per effect
- **If more:** Split effect or memoize inputs

---

## 📋 Quick Checklist for New Features

### Pre-Implementation
```
□ Connection Audit completed? (see section above)
□ All touchpoints identified?
□ Cross-system implications documented?
```

### Implementation
```
□ Is the file under 500 lines?
□ Are expensive computations memoized?
□ Are handlers wrapped in useCallback?
□ Is user input debounced?
□ Are theme colors using CSS variables?
□ Is there error handling?
□ Is there cleanup for async effects?
□ No console.logs left in?
□ Works in both themes?
□ Cloud sync implemented for all CRUD operations?
□ Dataset ID passed to all data operations?
□ User check before sync calls?
```

### Post-Implementation
```
□ All identified touchpoints updated?
□ UI adapts correctly in all contexts?
□ Data flows correctly in both directions?
□ Tested in all affected views?
```

---

## 🔧 Vite Config Essentials

```js
// vite.config.js - Optimal chunking
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom', 'react-router-dom'],
        firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
        d3: ['d3'],
      }
    }
  }
}
```

**Target Bundle Sizes:**
- Main chunk: < 200KB
- Vendor chunk: < 150KB  
- Route chunks: < 100KB each

---

## 🧪 Testing Cloud Sync

### Manual Testing Checklist
1. **Create** an entity → Verify it appears in Firebase Console
2. **Update** the entity → Verify changes reflect in Firebase
3. **Delete** the entity → Verify removed from Firebase
4. **Log out and log in** → Verify data persists
5. **Clear local storage** → Verify data downloads from cloud
6. **Go offline, make changes, go online** → Verify sync completes

### Firebase Console Location
```
Firebase Console → Firestore Database → 
  users/{userId}/datasets/{datasetId}/{collection}
```

### Common Sync Issues

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Data not syncing | Missing `user` check | Add `if (user)` guard |
| Data disappears on refresh | Missing sync call after add | Add `syncAdd*()` call |
| Duplicate entries | Using `createEntry` instead of `restoreEntry` | Use restore for sync downloads |
| Wrong dataset | Missing/wrong `datasetId` | Check `useDataset()` hook |
| Batch fails | Over 500 operations | Add batch size checking |

---

*Keep it clean. Keep it fast. Keep it synced. Keep it maintainable.*
