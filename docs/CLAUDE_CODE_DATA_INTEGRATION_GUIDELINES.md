# LineageWeaver: Claude Code Data Integration Guidelines

## Ultimate Goal

**Zero-touch, flawless data integration.** Claude Code reads source material, analyzes the existing database, generates perfectly-formed data, imports it, validates results, and iterates until every entity is correctly created and connected with no manual intervention required.

---

## Philosophy

### The Problem with Traditional Imports
- Manual linking required after import
- No validation against existing data
- Partial failures leave orphaned records
- Human error in ID matching
- Multiple passes needed to "fix" connections

### The Claude Code Advantage
- Can read and understand both source material AND existing database
- Can reason about relationships, ages, timelines, and genealogical logic
- Can execute imports directly via the application
- Can verify results and identify gaps
- Can iterate until perfect

---

## The Integration Process

### Phase 1: UNDERSTAND

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Read the source material (family description, codex, etc.)  │
│ 2. Export current database state                                │
│ 3. Build mental model of:                                       │
│    - Who exists in the database                                 │
│    - Who needs to be created                                    │
│    - Where connections must be made                             │
│    - What codex entries are needed                              │
│    - What dignities/titles apply                                │
└─────────────────────────────────────────────────────────────────┘
```

**Key Questions to Answer:**
- What new houses need to be created?
- What new people need to be created?
- Which NEW people marry EXISTING people?
- Which NEW people are children of EXISTING people?
- What codex entries should exist?
- What dignities/titles should be assigned?

### Phase 2: PLAN

```
┌─────────────────────────────────────────────────────────────────┐
│ Create an execution plan with explicit connection points:       │
│                                                                 │
│ NEW ENTITY              CONNECTS TO           EXISTING ENTITY   │
│ ─────────────────────────────────────────────────────────────── │
│ Kellam Wilfrey          spouse                Bronnis (ID 42)   │
│ Rosmund Wilfrey         spouse                Kirk (ID 186)     │
│ Thorin Wilfrey          child of              Kirk (ID 186)     │
│ House Wilfrey Riverhead sworn to              House Breakmount  │
│ Lord of Riverhead       current holder        Faraday (new)     │
└─────────────────────────────────────────────────────────────────┘
```

**The plan must identify:**
1. Order of operations (houses before people, people before relationships)
2. All cross-references between new and existing entities
3. Validation checkpoints

### Phase 3: EXECUTE

```
┌─────────────────────────────────────────────────────────────────┐
│ Execute in strict order:                                        │
│                                                                 │
│ 1. Create all NEW houses                                        │
│    → Record new IDs                                             │
│                                                                 │
│ 2. Create all NEW people                                        │
│    → Assign to correct houses (new or existing)                 │
│    → Record new IDs                                             │
│                                                                 │
│ 3. Create ALL relationships (new↔new AND new↔existing)          │
│    → Parent relationships                                       │
│    → Spouse relationships                                       │
│    → Other relationship types                                   │
│                                                                 │
│ 4. Create Codex entries                                         │
│    → Link to people/houses                                      │
│    → Ensure wiki-links resolve                                  │
│                                                                 │
│ 5. Create/assign Dignities                                      │
│    → Link to holders                                            │
│    → Set up feudal hierarchy                                    │
└─────────────────────────────────────────────────────────────────┘
```

**Execution Methods:**
- Direct database operations via app running locally
- API calls if available
- Import file + manual trigger as fallback
- Browser automation as last resort

### Phase 4: VERIFY

```
┌─────────────────────────────────────────────────────────────────┐
│ After execution, verify EVERY expected outcome:                 │
│                                                                 │
│ □ All houses exist with correct properties                      │
│ □ All people exist with correct house assignments               │
│ □ All parent-child relationships exist                          │
│ □ All spouse relationships exist                                │
│ □ All cross-family marriages are connected                      │
│ □ All codex entries exist and are linked                        │
│ □ All dignities exist with correct holders                      │
│ □ No orphaned records                                           │
│ □ No duplicate records                                          │
│ □ Family tree renders correctly                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Verification Methods:**
- Export database and analyze
- Query specific records
- Visual inspection of family tree
- Codex entry link validation

### Phase 5: ITERATE

```
┌─────────────────────────────────────────────────────────────────┐
│ If ANY verification fails:                                      │
│                                                                 │
│ 1. Identify the specific gap/error                              │
│ 2. Determine root cause                                         │
│ 3. Generate fix (create missing, update incorrect, delete dup)  │
│ 4. Execute fix                                                  │
│ 5. Re-verify                                                    │
│ 6. Repeat until FLAWLESS                                        │
└─────────────────────────────────────────────────────────────────┘
```

**"Flawless" Definition:**
- Every entity in source material exists in database
- Every relationship in source material exists in database
- Every cross-reference resolves correctly
- No orphaned or duplicate records
- Visual tree shows correct structure
- Codex links all work

---

## Data Validation Rules

### People Validation

| Rule | Check | Severity |
|------|-------|----------|
| Birth before death | `dateOfBirth < dateOfDeath` | ERROR |
| Parents older than children | Parent birth + 13 < Child birth | ERROR |
| Reasonable lifespans | Death - Birth < 120 years | WARNING |
| Spouse age compatibility | Spouse ages within 50 years | WARNING |
| Gender consistency | Spouse pairs not same gender (unless noted) | WARNING |
| House assignment | Every person has a valid houseId | ERROR |
| Name present | firstName and lastName not empty | ERROR |

### Relationship Validation

| Rule | Check | Severity |
|------|-------|----------|
| No self-relationships | person1Id ≠ person2Id | ERROR |
| No duplicate relationships | Unique (p1, p2, type) combo | ERROR |
| Parent relationship direction | person1Id = PARENT, person2Id = CHILD | ERROR |
| Both people exist | person1Id and person2Id in database | ERROR |
| Max 2 biological parents | Each person has ≤ 2 parent relationships | ERROR |

### House Validation

| Rule | Check | Severity |
|------|-------|----------|
| Unique names | No duplicate houseNames | ERROR |
| Valid parent house | parentHouseId exists if set | ERROR |
| Color code format | colorCode matches #RRGGBB | WARNING |

### Codex Validation

| Rule | Check | Severity |
|------|-------|----------|
| Wiki-links resolve | All [[Link]] targets exist | WARNING |
| Linked entity exists | personId/houseId valid if set | ERROR |
| No duplicate titles | Unique titles within type | WARNING |

---

## Execution Strategies

### Strategy A: Direct Database (Preferred)

If LineageWeaver is running locally with dev tools access:

```javascript
// Access via browser console or Node.js script
import { addHouse, addPerson, addRelationship } from './services/database';
import { createEntry } from './services/codexService';

// Execute operations directly
const houseId = await addHouse({ houseName: "House Wilfrey of Riverhead", ... });
const personId = await addPerson({ firstName: "Faraday", houseId, ... });
await addRelationship({ person1Id: existingParentId, person2Id: personId, ... });
```

### Strategy B: Enhanced Import File

Generate a JSON file that the BulkFamilyImportTool can process:

```javascript
{
  "houses": [...],
  "people": [...],
  "relationships": [...],  // Including refs to existing IDs
  "codexEntries": [...],
  "dignities": [...]
}
```

Then trigger import via UI or script.

### Strategy C: Hybrid Approach

1. Use import file for bulk creation of new entities
2. Use direct database calls to create cross-references
3. Use direct calls to fix any gaps

---

## The Iteration Loop

```
START
  │
  ▼
┌─────────────────┐
│ Export current  │
│ database state  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Analyze gaps    │
│ between desired │
│ and actual      │
└────────┬────────┘
         │
         ▼
    ┌────────────┐
    │ Gaps = 0?  │───YES───► DONE (Flawless!)
    └─────┬──────┘
          │ NO
          ▼
┌─────────────────┐
│ Generate fixes  │
│ for each gap    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Execute fixes   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Verify fixes    │
│ applied         │
└────────┬────────┘
         │
         └──────────► (loop back to Export)
```

---

## Gap Types and Fixes

| Gap Type | Detection | Fix |
|----------|-----------|-----|
| Missing house | House in source not in DB | Create house |
| Missing person | Person in source not in DB | Create person |
| Missing relationship | Expected rel not in DB | Create relationship |
| Wrong house assignment | Person.houseId incorrect | Update person |
| Missing codex entry | Person/house has no codex | Create & link entry |
| Broken codex link | Wiki-link target missing | Create target or fix link |
| Missing dignity | Title holder not assigned | Create/update dignity |
| Duplicate record | Same entity twice | Delete duplicate |
| Orphaned record | Record with invalid refs | Fix refs or delete |

---

## Success Criteria Checklist

Before declaring integration complete, ALL must be true:

### Data Completeness
- [ ] All houses from source material exist
- [ ] All people from source material exist
- [ ] All relationships from source material exist
- [ ] All codex entries planned are created
- [ ] All dignities/titles are assigned

### Data Integrity
- [ ] No orphaned records (refs to non-existent entities)
- [ ] No duplicate records
- [ ] All validation rules pass
- [ ] Parent-child relationships form valid trees
- [ ] Spouse relationships are bidirectional

### Cross-References
- [ ] All new↔existing marriages connected
- [ ] All new↔existing parent-child relations connected
- [ ] All house sworn-to relationships set
- [ ] All codex wiki-links resolve

### Visual Verification
- [ ] Family tree renders without errors
- [ ] New family appears connected to existing tree
- [ ] Codex entries display correctly
- [ ] No console errors in application

---

## Example Session Flow

```
USER: "Add the Riverhead Wilfreys to the database. Here's their family 
       description: [paste]. They should connect to Breakmount via 
       marriages to Bronnis, Kirk, and a betrothal to Marta."

CLAUDE CODE:
1. "Let me export the current database to understand what exists..."
   → Executes export, analyzes 63 people, 18 houses

2. "I see Bronnis (ID 42), Kirk (ID 186), and Marta (ID 26). 
    Now I'll generate the Riverhead family data..."
   → Creates complete data structure with explicit ID references

3. "Executing import: 8 houses, 32 people, 53 relationships..."
   → Runs import operations

4. "Verifying results..."
   → Exports database, compares to expected state

5. "Found 2 gaps:
    - Kellam↔Bronnis spouse relationship missing
    - Kirk not set as parent of Thorin"
   → Generates fix operations

6. "Executing fixes..."
   → Adds missing relationships

7. "Re-verifying... All checks pass. Integration complete."
   → Final export confirms flawless state

USER: "Perfect!"
```

---

## Integration with Project Files

This guidelines document should be added to the LineageWeaver project:

```
/lineageweaver
  /docs
    CLAUDE_CODE_DATA_INTEGRATION_GUIDELINES.md  ← This file
  /import-templates
    family-import-template.json
  ...
```

When Claude Code begins a data integration task, it should:
1. Read this guidelines document
2. Read the project documentation
3. Read the development guidelines
4. Follow the process defined here

---

## Future Enhancements

### Automated Verification Script
A script that can be run to verify database integrity:
```bash
npm run verify-data
# Outputs: ✓ All checks pass / ✗ 3 issues found
```

### Integration Test Suite
Tests that confirm specific family structures:
```javascript
test('Riverhead connected to Breakmount', () => {
  expect(getSpouse('Kellam Wilfrey')).toBe('Bronnis Wilfrey');
  expect(getParents('Thorin Wilfrey')).toContain('Kirk Wilfrey');
});
```

### Change Detection
Before integration, detect what would change:
```
CHANGES PREVIEW:
+ 8 houses to create
+ 32 people to create  
+ 53 relationships to create
~ 3 existing people will gain relationships
```

---

*This document defines the standard for Claude Code data integration in LineageWeaver. The goal is always: flawless, zero-touch integration achieved through intelligent iteration.*
