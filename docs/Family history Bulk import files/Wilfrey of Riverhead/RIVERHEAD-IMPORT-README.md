# House Wilfrey of Riverhead - Import Guide

## Overview

This import creates the complete **House Wilfrey of Riverhead** branch including:

### Main Family (32 people across 5 generations)
- **Generation 0**: Lord Aldwin & Maeven (progenitors)
- **Generation 1**: Aldous, Renard, Cadmus, Osbert (4 sons of Aldwin)
- **Generation 2**: Lord Faraday (current), Kellam, Emmeris, Corvin (Grasper's father)
- **Generation 3**: Eldric (heir), Rosmund, Lysara, Rennick, Sorrel, Harmond (Grasper)
- **Generation 4**: Farren, Aldric, Cordelia, Thorin, Brynn, Marsh

### Houses Created (8 total)
| House | Color | Type | Notes |
|-------|-------|------|-------|
| House Wilfrey of Riverhead | #2e8b57 (sea green) | Main | The river seat |
| House Wilfriver | #4a7c6f (muted teal) | Cadet | Smugglers |
| House Salter of the Scorch | #c2a366 (dusty tan) | External | Dust Bowl salt lords |
| House Bridger of Longford | #5b7fa3 (slate blue) | External | River crossing |
| House Ironfell of the Marchlands | #6b4c4c (iron brown) | External | Military border lords |
| House Millward | #8b7355 (wheat brown) | Vassal | Local millers |
| House Reedham | #6b8e7d (marsh green) | Vassal | Local marshlands |
| House Tillbrook | #7a9b5a (field green) | Vassal | Local farmers |

### Codex Entries Created (8 total)
1. House Wilfrey of Riverhead (faction)
2. Faraday Wilfrey (person)
3. House Wilfriver (faction)
4. Harmond "The Grasper" Wilfrey (person)
5. House Salter of the Scorch (faction)
6. Riverhead - the castle (location)
7. House Bridger of Longford (faction)
8. House Ironfell of the Marchlands (faction)

---

## ⚠️ MANUAL STEPS REQUIRED AFTER IMPORT

The import cannot create relationships to **existing** Breakmount people. You must manually add these three spouse relationships:

### Marriage 1: Kellam ⚭ Bronnis
- **Kellam Wilfrey** (from import) marries **Bronnis Wilfrey** (ID 42)
- This is the first reward marriage for Faraday's military service
- Add spouse relationship in the tree or manage data

### Marriage 2: Rosmund ⚭ Kirk
- **Rosmund Wilfrey** (from import) marries **Kirk Wilfrey** (ID 186)
- Kirk is son of Thoroness Wilfrey
- Rosmund lives primarily at Breakmount with Kirk's family
- Their children Thorin and Brynn are in the import

### Betrothal: Aldric ↔ Marta
- **Aldric Wilfrey** (from import, b.2005) betrothed to **Marta Wilfrey** (ID 26, b.2008)
- Marta is daughter of Mychal (not firstborn)
- This is a betrothal, not yet married - add as spouse with note "betrothed"

### Parent Relationships for Kirk's Children
After adding Kirk as spouse to Rosmund, also add:
- **Kirk** (ID 186) as parent of **Thorin** (from import)
- **Kirk** (ID 186) as parent of **Brynn** (from import)

### Parent Relationships for Bronnis's Children
After adding Bronnis as spouse to Kellam, also add:
- **Bronnis** (ID 42) as parent of **Rennick** (from import)
- **Bronnis** (ID 42) as parent of **Sorrel** (from import)

---

## Family Tree Summary

```
LORD ALDWIN (d.1968) ⚭ Maeven Tillbrook
├── LORD ALDOUS (d.1990) ⚭ Seren Reedham
│   ├── LORD FARADAY ⚭ Elspeth Millward ← CURRENT LORD
│   │   ├── ELDRIC (heir) ⚭ Grisella Salter
│   │   │   ├── Farren (eldest)
│   │   │   ├── Aldric ↔ [betrothed to Marta of Breakmount]
│   │   │   └── Cordelia
│   │   ├── Rosmund ⚭ Kirk of Breakmount [ADD MANUALLY]
│   │   │   ├── Thorin
│   │   │   └── Brynn
│   │   └── Lysara ⚭ Colm Bridger
│   │
│   ├── KELLAM ⚭ Bronnis of Breakmount [ADD MANUALLY]
│   │   ├── Rennick ⚭ Tamsyn Reedham
│   │   │   └── Marsh
│   │   └── Sorrel (unmarried)
│   │
│   └── Emmeris ⚭ Roderick Ironfell
│
├── Renard (d.1988, no issue shown)
├── Cadmus (d.1995, no issue shown)
└── OSBERT (d.2005) ← GRASPER'S LINE
    └── Corvin (struggling)
        └── HARMOND "The Grasper"

HOUSE WILFRIVER (cadet branch - smugglers)
└── LORD GORAM "The Eel" ⚭ Hella Tillbrook
    ├── Baran (heir, involved in "the trade")
    └── Mira (respectable face, seeking good marriage)
```

---

## Key Characters

### Lord Faraday Wilfrey - "The Strategist"
- Current Lord of Riverhead
- Military genius, veteran of many campaigns
- His service rewarded with Breakmount marriages
- Practical, strategic thinker who views politics as warfare

### Harmond Wilfrey - "The Grasper"
- Great-grandson of Aldwin through the 4th son's line
- Legitimate but distant from inheritance
- Ambitious, capable, hungry for recognition
- Seeking any role to restore his branch's standing

### Lord Goram Wilfriver - "The Eel"
- Head of the smuggler cadet branch
- Slippery and charming, never caught
- Maintains legitimate barge trade as cover
- Moderate political standing, poor personal repute

---

## Import Statistics

| Category | Count |
|----------|-------|
| Houses | 8 |
| People | 32 |
| Relationships | ~50 |
| Codex Entries | 8 |
| Dignities | 1 |

---

## Notes

- All dates use the same timeline as existing Breakmount family (1895-2011)
- House colors chosen to complement existing Wilfrey blue (#0011ff)
- Codex entries use wiki-link syntax for cross-referencing
- The Wilfriver founding date (1890) is approximate
