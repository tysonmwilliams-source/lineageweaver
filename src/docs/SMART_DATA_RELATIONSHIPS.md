# Smart Data Relationships - Implementation Summary

## What Was Implemented

This update introduces **Smart Data Relationships** to Lineageweaver - a system that makes the application more intelligent about genealogical data.

---

## 5. Data Health Dashboard (`/src/components/DataHealthDashboard.jsx`)

A comprehensive database scanner accessible from the "Data Health" tab in Manage Data.

### Features

**Summary Cards:**
- Error count (red) - blocking issues
- Warning count (yellow) - potential problems
- Missing data count (blue) - incomplete records
- Suggestions count (gold) - improvements

**Health Score:**
- 0-100 score based on issue severity
- Color-coded: Excellent (green), Good (blue), Fair (yellow), Needs Attention (red)

**Issue Categories:**
- **Errors** - Blocking data integrity issues
- **Warnings** - Unusual but possible scenarios
- **Structural** - Database consistency problems (orphaned records, empty houses)
- **Missing Data** - People without birth dates, houses, or gender
- **Suggestions** - Isolated people, single parents, couples without children

### Scans Performed

| Check | Category | Description |
|-------|----------|-------------|
| Orphaned relationships | Structural | Relationships pointing to deleted people |
| Orphaned house refs | Structural | People assigned to deleted houses |
| Empty houses | Structural | Houses with no members |
| Extreme sibling gaps | Structural | Siblings 40+ years apart |
| Missing birth date | Missing | People without dateOfBirth |
| Missing house | Missing | People not assigned to any house |
| Missing gender | Missing | People without gender specified |
| Isolated people | Suggestion | People with no relationships |
| Single parent | Suggestion | Children with only one parent |
| Childless couples | Suggestion | Married couples with no shared children |

### Usage

1. Go to **Manage Data → Data Health** tab
2. Click **Run Health Check**
3. Review summary cards and health score
4. Click category tabs to filter issues
5. Click **View →** on any issue to edit that record
6. Click **🗑️ Delete** to remove problematic records
7. Click **👤 Named After** to resolve namesake duplicates

### Delete Features

**Individual Delete:**
- Click "🗑️ Delete" on any issue row
- Click "Confirm" to actually delete (double-click safety)
- Click elsewhere to cancel

**Bulk Cleanup Tools:**
- **Delete Orphaned Relationships** - Removes relationships pointing to non-existent people
- **Delete Unknown Persons** - Removes people with no name or named "Unknown"

### Named After Feature (Namesake Resolution)

When the scanner detects people with similar names, it shows a "Potential Duplicate" warning. For genealogy, same names are common (children named after ancestors).

**Quick Resolution:**
1. When you see a duplicate warning, click **👤 Named After**
2. If birth years are known, the system auto-detects who is older
3. If birth years are unknown, a dialog asks you to choose the direction
4. Click again to confirm
5. A "named-after" relationship is created, suppressing future warnings

**Auto-Suppression:**
The scanner automatically ignores same-name people when:
- They are 15+ years apart in birth dates (different generations)
- One died before the other was born
- Either has a generational suffix (I, II, III, Jr, Sr, etc.)
- A "named-after" relationship already exists between them

⚠️ Always export your data before using delete functions!

---

## 6. QuickEditPanel Integration

The tree view's quick-add panel now includes smart validation AND the ability to link existing people.

### Modes

When you click "Add Parent", "Add Spouse", etc., you now have two options:

| Mode | Description |
|------|-------------|
| **✨ Create New** | Create a new person and link them (original behavior) |
| **🔗 Link Existing** | Search and select someone already in your database |

### Link Existing Feature

Perfect for:
- Adding the second parent when they already exist in another family
- Linking siblings who were entered separately
- Connecting spouses from different houses
- Any situation where you'd otherwise create a duplicate

**How it works:**
1. Click "+ Add Parent" (or Spouse, Child, Sibling)
2. Click the **🔗 Link Existing** tab
3. Search by name or scroll the list
4. Click a person to select them
5. Click **🔗 Link [Relationship]** to create the connection

**Smart filtering:**
- Already-linked people are automatically excluded
- Search filters in real-time as you type
- Shows birth/death years and house for easy identification

### Validation (Both Modes)

- **Real-time validation** when adding spouse/parent/child/sibling
- **Error display** (red box) blocks impossible relationships
- **Warning display** (yellow box) with acknowledgment checkbox
- **Submit disabled** until errors resolved or warnings acknowledged

## 1. Smart Data Validator (`/src/utils/SmartDataValidator.js`)

A new utility module that provides intelligent validation for genealogical data.

### Features

#### Blocking Errors (Hard stops - can't save)
| Error Code | Description |
|------------|-------------|
| `CIRCULAR_ANCESTRY` | Prevents creating ancestor loops (A is parent of B who is parent of A) |
| `PARENT_BORN_AFTER_CHILD` | Parent can't be born after their child |
| `PARENT_DEAD_AT_BIRTH` | Parent can't die more than ~1 year before child is born |
| `DUPLICATE_RELATIONSHIP` | Same relationship can't exist twice |
| `SELF_RELATIONSHIP` | Can't create relationship with yourself |
| `MARRIED_AFTER_DEATH` | Can't marry someone after they've died |
| `DIVORCE_BEFORE_MARRIAGE` | Divorce date can't precede marriage date |
| `DEATH_BEFORE_BIRTH` | Death date can't be before birth date |

#### Soft Warnings (Shows warning, can override)
| Warning Code | Description |
|--------------|-------------|
| `PARENT_TOO_YOUNG` | Parent would be younger than 12 at child's birth |
| `EXTREME_PARENT_AGE` | Parent would be older than 80 at child's birth |
| `MULTIPLE_PARENTS` | Adding a 3rd+ parent (unusual) |
| `MANY_CHILDREN` | Person has 20+ children |
| `MARRIED_TOO_YOUNG` | Marriage before age 14 |
| `LARGE_SPOUSE_AGE_GAP` | 50+ year age difference between spouses |
| `ALREADY_MARRIED` | Person already in active marriage |
| `TWIN_BIRTH_YEAR_MISMATCH` | Twins born in different years |
| `POTENTIAL_DUPLICATE` | Similar person name already exists |
| `EXTREME_LIFESPAN` | Lifespan over 200 years |
| `PARENT_MAY_BE_DEAD` | Child born same year as parent's death |

#### Cascade Suggestions
Helpful prompts when creating relationships:
- **"Add spouse as second parent?"** - When adding parent A to child C, suggests adding A's spouse
- **"Link child to spouse?"** - When marrying, suggests linking existing children to new spouse  
- **"Mark as widowed?"** - When adding death date, suggests updating spouse's marriage status
- **"Move children to new house?"** - When changing house, suggests updating children

### Configuration
All thresholds are configurable in `VALIDATION_CONFIG`:
```javascript
{
  MIN_PARENT_AGE_DIFFERENCE: 12,
  MAX_PARENT_AGE_DIFFERENCE: 80,
  MIN_MARRIAGE_AGE: 14,
  MAX_SPOUSE_AGE_GAP_WARNING: 50,
  ENFORCE_BIOLOGICAL_RULES: true,  // Turn off for fantasy scenarios
  MAX_CHILDREN_WARNING: 20,
  // ... etc
}
```

---

## 2. Enhanced RelationshipForm (`/src/components/RelationshipForm.jsx`)

The relationship creation form now integrates smart validation.

### New Behaviors
- **Real-time validation** as you select people
- **Warning panel** shows non-blocking issues with checkbox to acknowledge
- **Suggestion panel** shows helpful cascade actions you can accept
- **Birth years shown** in person dropdowns for easier selection
- **Submit disabled** until warnings are acknowledged

### Visual Design
- **Yellow/amber** box for warnings with ⚠️ icon
- **Blue** box for suggestions with 💡 icon  
- **Red** error text for blocking issues
- Checkbox: "I understand these warnings and want to proceed anyway"

---

## 3. Enhanced Relationship Calculator (`/src/utils/RelationshipCalculator.js`)

The relationship calculator now supports more relationship types.

### New Relationship Types
| Category | Labels |
|----------|--------|
| **Half-siblings** | Half-Brother, Half-Sister, Half-Sibling |
| **Great-aunts/uncles** | Great-Uncle, Great-Aunt |
| **Grand-nieces/nephews** | Grand-Nephew, Grand-Niece |
| **2nd great-grandparents** | 2nd Great-Grandfather, 2nd Great-Grandmother |
| **Extended cousins** | 1st Cousin, 2nd Cousin, 3rd Cousin, etc. |
| **Cousins removed** | 1st Cousin Once Removed, 2nd Cousin Twice Removed, etc. |
| **In-laws** | Grandfather-in-Law, Son-in-Law, Daughter-in-Law |
| **Step-relations** | Step-Father, Step-Mother, Step-Brother, Step-Sister |

### New Helper Function
```javascript
import { buildRelationshipMaps } from './RelationshipCalculator';

const { parentMap, childrenMap, spouseMap } = buildRelationshipMaps(relationships);
```

---

## 4. ManageData Integration (`/src/pages/ManageData.jsx`)

The Manage Data page now passes required props for smart validation:

- `allRelationships` prop added to RelationshipForm
- `onSuggestionAccept` handler to apply cascade suggestions

---

## How It Works

### When Creating a Relationship

1. User opens "Add Relationship" modal
2. As they select Person 1 and Person 2, validation runs in real-time
3. **Blocking errors** appear immediately (red text near fields)
4. **Warnings** appear in yellow box - user must check "I understand"
5. **Suggestions** appear in blue box - user can click "Yes" to apply
6. Submit button is disabled until warnings are acknowledged
7. On save, cascade suggestions can auto-create related records

### Example Flow

```
User: Creates parent relationship (Edmund → Cedric)

System detects:
  ⚠️ Warning: "Edmund would have been only 15 years old when Cedric was born"
  💡 Suggestion: "Add Margery Wilfrey as Cedric's other parent?"

User: Checks "I understand" for the warning
User: Clicks "Yes" on the suggestion

Result: 
  - Parent relationship created (Edmund → Cedric)
  - Second parent relationship auto-created (Margery → Cedric)
```

---

## Files Changed

| File | Change |
|------|--------|
| `/src/utils/SmartDataValidator.js` | **NEW** - Core validation logic + health check |
| `/src/utils/RelationshipCalculator.js` | **ENHANCED** - More relationship types |
| `/src/components/RelationshipForm.jsx` | **ENHANCED** - Smart validation UI |
| `/src/components/QuickEditPanel.jsx` | **ENHANCED** - Smart validation in quick-add |
| `/src/components/DataHealthDashboard.jsx` | **NEW** - Database health scanner |
| `/src/pages/ManageData.jsx` | **UPDATED** - New Data Health tab |

---

## Future Enhancements (Not Yet Implemented)

These could be added later:

### More Cascade Suggestions
- Update children's surnames when parent's name changes
- Validate event dates against lifespan
- Auto-suggest fixing detected issues

### Fantasy-Specific Intelligence
- Magical bloodline inheritance rules
- Species-based lifespan validation
- Title succession tracking

### Batch Operations
- "Fix All" for common issues
- Bulk update house membership
- Mass relationship creation

---

## Testing Checklist

- [ ] Create parent relationship with parent born after child → **should block**
- [ ] Create parent relationship with small age gap → **should warn**
- [ ] Create duplicate relationship → **should block**
- [ ] Create circular ancestry (A parent of B, B parent of A) → **should block**
- [ ] Add parent when person has spouse → **should suggest adding spouse as co-parent**
- [ ] Create marriage after death date → **should block**
- [ ] Create twin relationship with different birth years → **should warn**
- [ ] Acknowledge warning and submit → **should succeed**

---

## Technical Notes

### Why Warnings vs Errors?

Genealogy is messy, especially in fantasy worlds:
- **Errors** = Logically impossible (time travel, being your own ancestor)
- **Warnings** = Unusual but possible (young parents, large age gaps, magic)

This lets worldbuilders override warnings for legitimate fantasy scenarios while still catching genuine mistakes.

### Performance

Validation runs on every form change, but it's optimized:
- Only validates when both people are selected
- Uses early returns for common cases
- Circular ancestry check uses visited set to prevent infinite loops
- Cousin calculation limited to 10 generations depth

---

*Document created: Smart Data Relationships v1.0*
*Last updated: Module 1F implementation*
