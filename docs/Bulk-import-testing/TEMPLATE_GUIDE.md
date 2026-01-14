# LineageWeaver Family Import Template Guide

This guide explains how to use the bulk import template to add an entire family (with houses, people, relationships, and optionally Codex entries, heraldry, and dignities) into LineageWeaver in one go.

## Quick Start

1. **Copy** `family-import-template.json` to a new file (e.g., `house-stark.json`)
2. **Fill in** your family data following the structure below
3. **Import** using Data Management → Bulk Import tab in LineageWeaver

---

## The ID System (Important!)

The template uses **temporary string IDs** (like `"person_1"`, `"house_main"`) that you define. These let you reference entities before they exist in the database.

### How It Works

```json
// Define a person with a temp ID
{
  "_tempId": "person_ned",
  "firstName": "Eddard",
  "lastName": "Stark",
  "houseId": "house_stark"  // References a house temp ID
}

// Define a relationship using temp IDs
{
  "person1Id": "person_ned",
  "person2Id": "person_robb",
  "relationshipType": "parent"
}
```

During import, these temp IDs are automatically converted to real database IDs, and all references are updated to match.

### Naming Convention

Use descriptive temp IDs that make the file easy to read:
- Houses: `house_main`, `house_cadet_branch`, `house_spouse_family`
- People: `person_patriarch`, `person_child_1`, `person_ned_stark`
- Codex: `codex_house_main`, `codex_battle_of_x`
- Heraldry: `heraldry_house_main`
- Dignities: `dignity_lord_of_x`

---

## Section: Houses

Houses must be defined BEFORE people, since people reference houses.

### Required Fields

| Field | Description | Example |
|-------|-------------|---------|
| `_tempId` | Your temporary ID for this house | `"house_stark"` |
| `houseName` | The house name | `"House Stark"` |

### Optional Fields

| Field | Description | Example |
|-------|-------------|---------|
| `houseType` | `"main"`, `"cadet"`, `"vassal"`, `"extinct"` | `"main"` |
| `parentHouseId` | Temp ID of parent house (for cadet branches) | `"house_main"` |
| `colorCode` | Hex color for visualization | `"#4169E1"` |
| `motto` | House motto/words | `"Winter is Coming"` |
| `sigil` | Text description of arms | `"A grey direwolf on white"` |
| `foundedDate` | Year founded | `"1200"` |
| `foundedBy` | Temp ID of founder | `"person_founder"` |
| `swornTo` | Temp ID of liege house | `"house_main"` |
| `notes` | Any additional notes | `""` |

### Example: Main House + Cadet Branch

```json
"houses": [
  {
    "_tempId": "house_stark",
    "houseName": "House Stark",
    "houseType": "main",
    "colorCode": "#708090",
    "motto": "Winter is Coming",
    "sigil": "A grey direwolf on an ice-white field"
  },
  {
    "_tempId": "house_karstark",
    "houseName": "House Karstark",
    "houseType": "cadet",
    "parentHouseId": "house_stark",
    "colorCode": "#4a4a5a",
    "swornTo": "house_stark",
    "foundedDate": "1000",
    "notes": "Cadet branch founded by Karlon Stark"
  }
]
```

---

## Section: People

People reference houses and can have various legitimacy statuses.

### Required Fields

| Field | Description | Example |
|-------|-------------|---------|
| `_tempId` | Your temporary ID | `"person_ned"` |
| `firstName` | First name | `"Eddard"` |
| `lastName` | Last/family name | `"Stark"` |
| `gender` | `"male"`, `"female"`, `"other"` | `"male"` |
| `houseId` | Temp ID of their house | `"house_stark"` |

### Optional Fields

| Field | Description | Example |
|-------|-------------|---------|
| `maidenName` | Birth surname (if changed) | `"Tully"` |
| `dateOfBirth` | Birth year/date | `"1960"` |
| `dateOfDeath` | Death year/date (null if living) | `"2011"` |
| `legitimacyStatus` | `"legitimate"`, `"bastard"`, `"adopted"`, `"unknown"` | `"legitimate"` |
| `bastardStatus` | For bastards: `null`, `"active"`, `"legitimized"`, `"founded"` | `null` |
| `notes` | Character notes | `""` |
| `epithets` | Array of epithet objects | `[]` |

### Special Case: Bastards

For bastard children, set:
- `legitimacyStatus`: `"bastard"`
- `bastardStatus`: `"active"` (can later become `"legitimized"` or `"founded"`)

```json
{
  "_tempId": "person_jon",
  "firstName": "Jon",
  "lastName": "Snow",
  "gender": "male",
  "houseId": "house_stark",
  "legitimacyStatus": "bastard",
  "bastardStatus": "active"
}
```

### Special Case: Married Women

For women who changed their name at marriage:
- `lastName`: Their married name
- `maidenName`: Their birth name
- `houseId`: Their birth house (not husband's house)

```json
{
  "_tempId": "person_catelyn",
  "firstName": "Catelyn",
  "lastName": "Stark",
  "maidenName": "Tully",
  "gender": "female",
  "houseId": "house_tully",
  "legitimacyStatus": "legitimate"
}
```

### Using Generations

The `_generation` field is optional but helps organize:
- Generation 1: Great-grandparents
- Generation 2: Grandparents  
- Generation 3: Parents
- Generation 4: Current generation
- Generation 5: Children

---

## Section: Relationships

Relationships connect people together.

### Relationship Types

| Type | Description | person1Id | person2Id |
|------|-------------|-----------|-----------|
| `parent` | Parent-child | PARENT | CHILD |
| `spouse` | Marriage | Either | Either |
| `adopted-parent` | Adoption | ADOPTIVE PARENT | CHILD |
| `foster-parent` | Foster care | FOSTER PARENT | CHILD |
| `mentor` | Mentor/apprentice | MENTOR | APPRENTICE |
| `named-after` | Namesake | PERSON | NAMESAKE |

### Parent Relationships

⚠️ **Important**: For parent relationships:
- `person1Id` = The PARENT
- `person2Id` = The CHILD
- `biologicalParent`: `true` for biological, `false`/omit for adoptive

Create TWO parent relationships for each child (one for each parent):

```json
// Father is parent of child
{
  "person1Id": "person_ned",
  "person2Id": "person_robb",
  "relationshipType": "parent",
  "biologicalParent": true
},
// Mother is parent of child
{
  "person1Id": "person_catelyn",
  "person2Id": "person_robb",
  "relationshipType": "parent",
  "biologicalParent": true
}
```

### Spouse Relationships

```json
{
  "person1Id": "person_ned",
  "person2Id": "person_catelyn",
  "relationshipType": "spouse",
  "marriageDate": "1980",
  "marriageStatus": "married"
}
```

Marriage status options: `"married"`, `"divorced"`, `"widowed"`

---

## Section: Codex Entries (Optional)

Create encyclopedia entries that auto-link to people/houses.

```json
"codexEntries": [
  {
    "_tempId": "codex_ned",
    "_autoLink": {
      "entityType": "person",
      "personId": "person_ned"
    },
    "type": "people",
    "title": "Eddard Stark",
    "subtitle": "Lord of Winterfell",
    "content": "## Biography\n\nNed Stark was the head of House Stark...\n\n## Family\n\nMarried to [[Catelyn Stark]].",
    "category": "nobility",
    "tags": ["stark", "lord", "warden"]
  }
]
```

### Wiki-Links in Content

Use `[[Name]]` syntax to link to other Codex entries:
- `[[Catelyn Stark]]` - Links to entry titled "Catelyn Stark"
- `[[House Stark]]` - Links to entry titled "House Stark"

---

## Section: Heraldry (Optional)

Define heraldic devices to link to houses.

```json
"heraldry": [
  {
    "_tempId": "heraldry_stark",
    "_autoLink": {
      "entityType": "house",
      "entityId": "house_stark"
    },
    "name": "Arms of House Stark",
    "description": "Argent, a direwolf sejant proper",
    "category": "noble",
    "tags": ["stark", "north", "direwolf"]
  }
]
```

Note: You can also create heraldry later in The Armory's design studio.

---

## Section: Dignities (Optional)

Define titles and positions.

```json
"dignities": [
  {
    "_tempId": "dignity_winterfell",
    "name": "Lord of Winterfell",
    "shortName": "Lord Winterfell",
    "dignityClass": "lord",
    "dignityRank": 5,
    "currentHolderId": "person_ned",
    "currentHouseId": "house_stark"
  }
]
```

---

## Complete Example: Small Family

```json
{
  "houses": [
    {
      "_tempId": "house_main",
      "houseName": "House Smith",
      "houseType": "main",
      "colorCode": "#2E8B57"
    },
    {
      "_tempId": "house_jones",
      "houseName": "House Jones",
      "houseType": "main",
      "colorCode": "#B22222"
    }
  ],
  
  "people": [
    {
      "_tempId": "person_john",
      "firstName": "John",
      "lastName": "Smith",
      "gender": "male",
      "dateOfBirth": "1950",
      "houseId": "house_main",
      "legitimacyStatus": "legitimate"
    },
    {
      "_tempId": "person_mary",
      "firstName": "Mary",
      "lastName": "Smith",
      "maidenName": "Jones",
      "gender": "female",
      "dateOfBirth": "1952",
      "houseId": "house_jones",
      "legitimacyStatus": "legitimate"
    },
    {
      "_tempId": "person_james",
      "firstName": "James",
      "lastName": "Smith",
      "gender": "male",
      "dateOfBirth": "1975",
      "houseId": "house_main",
      "legitimacyStatus": "legitimate"
    }
  ],
  
  "relationships": [
    {
      "person1Id": "person_john",
      "person2Id": "person_mary",
      "relationshipType": "spouse",
      "marriageStatus": "married"
    },
    {
      "person1Id": "person_john",
      "person2Id": "person_james",
      "relationshipType": "parent",
      "biologicalParent": true
    },
    {
      "person1Id": "person_mary",
      "person2Id": "person_james",
      "relationshipType": "parent",
      "biologicalParent": true
    }
  ]
}
```

---

## Validation Checklist

Before importing, verify:

- [ ] All temp IDs are unique within their category
- [ ] All `houseId` references in people point to valid house temp IDs
- [ ] All `person1Id` and `person2Id` in relationships point to valid person temp IDs
- [ ] Every child has TWO parent relationships (one per parent)
- [ ] Parent relationships have parent as `person1Id`, child as `person2Id`
- [ ] Required fields are filled in for all entries
- [ ] Date formats are consistent (YYYY preferred)

---

## Tips

1. **Work top-down**: Define houses first, then oldest generation, then their children, etc.

2. **Use comments**: The `_comment` field is ignored during import - use it for notes.

3. **Start small**: Test with 3-4 people first to verify the import works correctly.

4. **Codex can wait**: You don't need to include Codex entries - LineageWeaver can auto-generate them later.

5. **Check the tree**: After import, open the Family Tree view to verify all relationships rendered correctly.

---

## Troubleshooting

### "House not found" Error
- Check that the `houseId` in the person matches a valid house `_tempId`
- Make sure houses are defined BEFORE people in the file

### Missing Relationships
- Verify both `person1Id` and `person2Id` are valid temp IDs
- Check relationship direction (parent should be person1Id for parent relationships)

### Tree Not Rendering Correctly
- Ensure each child has relationships to BOTH parents (if both exist)
- Check that all people have valid `houseId` references

---

## Bringing Back to Claude

Once you've populated the template, you can:
1. Share the completed JSON file back in this chat
2. I'll validate it for errors before you import
3. Help debug any issues after import
4. Verify the integration worked correctly in the Family Tree
