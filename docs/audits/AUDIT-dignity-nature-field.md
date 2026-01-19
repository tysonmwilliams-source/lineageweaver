# Connection Audit: Dignity Nature Field Enhancement

**Date:** 2026-01-20
**Change:** Replace/augment `isHereditary: boolean` with `dignityNature` field
**Values:** `'territorial'` | `'office'` | `'personal-honour'` | `'courtesy'`

---

## Overview

The current system uses `isHereditary: boolean` to distinguish title types, but this is insufficient. A knighthood and an appointed office are both "not hereditary" but behave very differently. This change introduces a more nuanced `dignityNature` field that drives UI behavior, succession logic, and display formatting.

### Nature Definitions

| Nature | Description | Examples | Succession? | Tenure Tracking | Granted By? |
|--------|-------------|----------|-------------|-----------------|-------------|
| `territorial` | Attached to land/domain, hereditary | Lord of Breakmount, Warden of the North | Yes - full succession line | Yes - historical holders | Optional (original grant) |
| `office` | Appointed/elected position, non-hereditary | Master of Coin, High Septon | No succession | Yes - who served when | Yes - who appointed |
| `personal-honour` | Recognition given to individual, dies with them | Knighthood, "Defender of the Realm" | No succession | Minimal - grant date only | Yes - who granted |
| `courtesy` | Derived from relationship to holder | Dowager Lady, Prince Consort | No succession | No - tied to source | No - derived |

### New Fields for Grant Tracking

```javascript
// Added to dignity entity for office/personal-honour natures
grantedById: number | null,        // Person ID who granted this
grantedByDignityId: number | null, // Optional: Dignity they acted under (e.g., "as King")
grantDate: string | null,          // When it was granted (ISO date or year)
```

**Who can grant?**
- The Crown (sovereign authority)
- Drihten/lords for their subordinates
- Anyone with appropriate authority in their domain

This creates interesting data for storytelling - tracking chains of who granted what to whom.

---

## 1. Data Flow - Where Does This Data Go TO?

### Components That DISPLAY Dignity Data

| File | What It Shows | Adaptation Needed |
|------|---------------|-------------------|
| `DignitiesLanding.jsx` | Grid cards, hierarchy view, preview modal | Show nature indicator/badge; maybe filter by nature |
| `DignityView.jsx` | Full detail page, sidebar, succession section | **Major:** Hide succession for non-territorial; show "Granted by" for honours |
| `DignityForm.jsx` | Create/edit form | Displays current values |
| `QuickEditPanel.jsx` | Person's dignities list (lines 1069-1091) | Could show nature as subtle indicator |
| `FamilyTree.jsx` | Dignity badges on person nodes (lines 1010-1033) | No change needed - shows icon only |
| `BranchView.jsx` | Passed dignitiesByPerson map | No change needed - display only |
| `DignityVisuals.jsx` | RankPips, ChainOfCommand, ClassBadge | ChainOfCommand may need nature-awareness |
| `DignityEducationPanel.jsx` | Educational content | Add nature explanations |

### Other Entities That REFERENCE Dignities

| Entity | Relationship | Impact |
|--------|--------------|--------|
| Person | `currentHolderId` on dignity | None - relationship unchanged |
| House | `currentHouseId` on dignity | None - relationship unchanged |
| Codex Entry | `dignityId` field, cross-links | Display may want to show nature |
| Tenure Records | `dignityId` on tenure | Nature determines if tenures are relevant |

### Exports/Backups That INCLUDE This Data

| System | Location | Impact |
|--------|----------|--------|
| Backup JSON export | `database.js` | Automatic - field included if on entity |
| Cloud sync | `firestoreService.js` / `dataSyncService.js` | Automatic - field syncs with entity |
| Dataset export | `datasetService.js` | Automatic |

---

## 2. Data Flow - Where Does This Data Come FROM?

### Components That CREATE Dignity Data

| File | How | Changes Needed |
|------|-----|----------------|
| `DignityForm.jsx` | Main create/edit form | **Add:** Nature dropdown field, conditional visibility |
| `bulkFamilyImport.js` | Bulk import utility | Add `dignityNature` to import mapping |
| AI services (future) | `aiProposalExecutor.js` | Update proposal execution if creating dignities |

### Components That MODIFY Dignity Data

| File | How | Changes Needed |
|------|-----|----------------|
| `DignityForm.jsx` | Edit mode | Same as create |
| `DignityView.jsx` | Tenure management, succession rules | May need nature validation |
| Quick edit panel | Currently read-only for dignities | None |

### Import Tools

| File | Handles Dignities? | Changes Needed |
|------|-------------------|----------------|
| `bulkFamilyImport.js` | Yes (dignityIdMap at line 212) | Add nature field support |
| `EnhancedCodexImportTool.jsx` | Indirectly via links | None - links to existing dignities |
| Codex import | Creates links, not dignities | None |

---

## 3. Cross-System Integration

### Cloud Sync

| Function | File | Changes Needed |
|----------|------|----------------|
| `syncAddDignity()` | `dataSyncService.js` | **None** - passes full entity object |
| `syncUpdateDignity()` | `dataSyncService.js` | **None** - passes changed fields |
| `syncDeleteDignity()` | `dataSyncService.js` | None |
| Firestore operations | `firestoreService.js` | **None** - generic field handling |

### Backup/Restore

| System | Changes Needed |
|--------|----------------|
| `exportAllData()` in `database.js` | None - exports all fields |
| `restoreDignity()` in `database.js` | None - restores all fields |
| Dataset migration | None - new field added to existing records |

### Dataset Scoping

Already handled - dignities are dataset-scoped. No changes needed.

### Codex Cross-Linking

| Integration Point | Changes Needed |
|-------------------|----------------|
| `getEntryByDignityId()` | None - returns full entry |
| Codex entry display | **Consider:** Show dignity nature when displaying linked dignity |
| Cross-link creation | None - links to dignity ID |

---

## 4. UI Adaptation Points

### Conditional Rendering Based on Nature

| Component | Section | Current Behavior | New Behavior |
|-----------|---------|------------------|--------------|
| `DignityView.jsx` | Succession section | Always shows | **Hide** for `personal-honour`, `courtesy`; **Simplify** for `office` |
| `DignityView.jsx` | Tenure history | Always shows | Show for `territorial`, `office`; **Minimal** for `personal-honour` |
| `DignityView.jsx` | "Granted by" section | Doesn't exist | **Add** for `personal-honour`, `office` - shows grantor person + their dignity |
| `DignityView.jsx` | Sidebar "Type" | Shows "Hereditary" or not | **Replace** with nature display |
| `DignityForm.jsx` | Succession rules section | Always shows | **Hide** for non-territorial |
| `DignityForm.jsx` | "Hereditary" checkbox | Separate field | **Remove** - nature implies this |
| `DignityForm.jsx` | "Granted by" fields | Don't exist | **Add** for `personal-honour`, `office` - person selector + optional dignity selector + date |
| `DignitiesLanding.jsx` | Cards | No nature indicator | **Add** subtle nature badge |
| `DignitiesLanding.jsx` | Filters | Filter by class/rank | **Add** filter by nature |
| `DignitiesLanding.jsx` | Hierarchy view | Shows all | **Add** toggle to show/hide personal honours |

### Different Display Contexts

| Context | Current | Adaptation |
|---------|---------|------------|
| Grid cards | Class badge, rank pips | Add nature indicator (icon or text) |
| Hierarchy view | Shows sworn relationships | Maybe filter out personal-honours (no hierarchy) |
| Preview modal | Same as card | Include nature |
| Detail page header | Class badge, rank | Show nature prominently |
| Person's profile (QuickEdit) | List of dignities | Could group by nature |

### Navigation/Routing

| Area | Changes Needed |
|------|----------------|
| Filter dropdown | Add nature filter option |
| URL params | Could support `?nature=territorial` |
| Linked navigation | None |

---

## 5. Identified Touchpoints - Files to Update

### Services (Data Layer)

| File | Changes |
|------|---------|
| `dignityService.js` | Add `DIGNITY_NATURES` constant; update `createDignity()` schema; update `getDignityStatistics()` to count by nature |
| `dignityAnalysisService.js` | Update analysis to consider nature (e.g., don't suggest succession for personal-honours) |
| `database.js` | None - schema is flexible |
| `dataSyncService.js` | None - passes full objects |
| `codexService.js` | None - optional enhancement for display |

### Components (UI Layer)

| File | Changes | Priority |
|------|---------|----------|
| `DignityForm.jsx` | Add nature dropdown; remove `isHereditary` checkbox; conditionally show succession options | **High** |
| `DignityView.jsx` | Conditional succession section; nature display in sidebar; "Granted by" field | **High** |
| `DignitiesLanding.jsx` | Nature filter; nature indicator on cards | **Medium** |
| `DignityVisuals.jsx` | Consider `NatureBadge` component | **Medium** |
| `QuickEditPanel.jsx` | Optional: show nature in person's dignities list | **Low** |
| `DignityEducationPanel.jsx` | Add nature explanations | **Low** |

### Data Files

| File | Changes |
|------|---------|
| `dignityEducation.js` | Add education content explaining natures |

### CSS Files

| File | Changes |
|------|---------|
| `DignityForm.css` | Style for nature dropdown |
| `DignityView.css` | Style for "Granted by" section; nature badge |
| `DignitiesLanding.css` | Style for nature indicator on cards |
| `DignityVisuals.css` | Style for NatureBadge if created |

---

## 6. Migration Considerations

### Existing Data

Existing dignities have `isHereditary: boolean`. Migration strategy:

```javascript
// Migration mapping
if (dignity.isHereditary === true) {
  dignity.dignityNature = 'territorial';
} else if (dignity.dignityClass === 'sir') {
  dignity.dignityNature = 'personal-honour';
} else {
  dignity.dignityNature = 'office'; // Default for non-hereditary non-knights
}
```

### Backward Compatibility

- Keep `isHereditary` field as computed/derived for any code that reads it
- Or: Run migration on all dignities, remove `isHereditary` references

---

## 7. Implementation Order

**Phase 1: Data Layer**
1. Add `DIGNITY_NATURES` constant to `dignityService.js`
2. Add grant tracking fields to schema (`grantedById`, `grantedByDignityId`, `grantDate`)
3. Update `createDignity()` to accept new fields
4. Write migration for existing dignities (map `isHereditary` → `dignityNature`)
5. Update statistics to count by nature

**Phase 2: Form & Creation**
1. Update `DignityForm.jsx` with nature dropdown
2. Remove or derive `isHereditary` checkbox
3. Add conditional visibility for succession options (territorial only)
4. Add "Granted by" fields (person selector, dignity selector, date) for office/personal-honour
5. Wire up conditional field visibility based on nature

**Phase 3: Display & Detail View**
1. Update `DignityView.jsx` sidebar to show nature prominently
2. Conditionally hide succession section for non-territorial
3. Add "Granted by" section for office/personal-honour (show grantor + their acting dignity)
4. Update tenure history display based on nature
5. Ensure visual differentiation (styling for different natures)

**Phase 4: Landing Page & Visuals**
1. Add nature filter to `DignitiesLanding.jsx`
2. Add nature indicator/badge to grid cards
3. Add toggle to hierarchy view to show/hide personal honours
4. Update preview modal with nature display

**Phase 5: Polish & Education**
1. Update `DignityEducationPanel.jsx` with nature explanations
2. Update `dignityEducation.js` data with nature content
3. Update `dignityAnalysisService.js` to not suggest succession for personal-honours
4. Update quick edit panel (optional - show nature indicator)
5. Consider `NatureBadge` component in `DignityVisuals.jsx`

---

## 8. Testing Checklist

### Core Functionality
```
□ Create territorial dignity - full succession shows, no "granted by" required
□ Create office dignity - no succession, "granted by" fields available, tenure history works
□ Create personal-honour - no succession, "granted by" required, minimal tenure
□ Create courtesy dignity - derived, no succession, no granted by
□ Edit existing dignity - nature and grant fields persist
```

### Grant Tracking
```
□ "Granted by" person selector works
□ "Granted by" dignity selector works (optional field)
□ Grant date field works
□ Granted by section displays correctly on detail view
□ Grantor's name links to their person record
□ Acting dignity displays when provided
```

### Migration & Data
```
□ Migration correctly maps isHereditary → dignityNature
□ Knights (sir class) correctly become personal-honour
□ Non-hereditary non-knights correctly become office
□ Cloud sync works for all new fields
□ Backup/restore includes nature and grant fields
```

### UI & Filtering
```
□ Filter by nature works on landing page
□ Nature indicator shows on grid cards
□ Nature indicator shows on hierarchy view
□ Hierarchy view toggle shows/hides personal honours
□ All views display nature consistently
□ Visual differentiation is clear but not exclusionary
```

### Education & Polish
```
□ Education panel explains all four natures
□ Analysis service doesn't suggest succession for personal-honours
□ Quick edit panel shows nature (if implemented)
```

---

## 9. Resolved Questions

1. **Courtesy titles:** ✅ Include them as a dignity nature. Can remove later if not useful.

2. **Office succession:** Defer for now. Some offices have informal patterns but we won't model this initially.

3. **Personal-honour tracking:** ✅ Yes, add "granted by" fields:
   - `grantedById` - Person who granted (Crown, Drihten, any lord with authority)
   - `grantedByDignityId` - Optional: What dignity they acted under when granting
   - `grantDate` - When granted
   - Applies to `personal-honour` and `office` natures primarily

4. **Filter default:** Show all by default; user can filter as needed.

5. **Hierarchy view:** ✅ Don't exclude personal-honours. Add a **toggle** to show/hide them. They ARE titles, just non-hereditary - should be visible but clearly differentiated.

### Key Principle: Visual Clarity Without Exclusion

Personal honours are legitimate titles - they just don't pass on. The system should:
- Show them alongside other dignities (not hidden or second-class)
- Clearly mark them visually so inheritance isn't assumed
- Allow filtering/toggling for users who want to focus on hereditary titles only

---

## Summary

This change touches **15+ files** with two main additions:
1. **`dignityNature` field** - Categorizes dignities (territorial/office/personal-honour/courtesy)
2. **Grant tracking fields** - `grantedById`, `grantedByDignityId`, `grantDate` for non-territorial dignities

### Scope

| Area | Files | Complexity |
|------|-------|------------|
| Data layer | 2-3 | Low - add fields to schema |
| Form | 1 | Medium - conditional fields, new selectors |
| Detail view | 1 | High - major conditional rendering |
| Landing page | 1 | Medium - filter, toggle, indicators |
| Visuals/education | 3-4 | Low - additive content |
| Migration | 1 | Medium - must handle all existing data |

**Highest Risk Areas:**
- `DignityView.jsx` - Major conditional logic for sections
- `DignityForm.jsx` - Form restructuring with conditional fields
- Migration - Existing data must map correctly

**Lowest Risk Areas:**
- Cloud sync - Automatic (passes full objects)
- Backup/restore - Automatic
- Most display components - Additive changes only

### Key Design Principle

Personal honours ARE titles - they belong in this system. The goal is **clarity without exclusion**: clearly differentiate nature visually, allow filtering, but don't hide or demote non-hereditary dignities. A knighthood is as much a dignity as a lordship - it just works differently.
