# House Wilfson Import Data

**Generated from**: 01-House-Wilfson-Lineage.md (approved)
**Date**: 2026-01-27

This file contains structured data ready for import into Lineageweaver.

---

## Part 1: New House Required

### House Thornbury (NEW)

```json
{
  "name": "House Thornbury",
  "type": "minor",
  "parentHouseId": null,
  "motto": "",
  "notes": "Drith-level landed family from the eastern reaches, known for horse breeding. Outside the Wilfrey web but of respectable standing."
}
```

**Action Required**: Create this house before importing people. Note the assigned ID for use below.

---

## Part 2: Existing Characters to Update

These characters already exist and may need relationship data added:

| ID | Name | Update Needed |
|----|------|---------------|
| 343 | Jon Wilfson | Add parents (Bauric + Loveline), spouse (Saelis), children |
| 366 | Betts Wilfson | Add parents (Bauric + Loveline) |
| 78 | Saelis Athelmere | Add spouse (Jon Wilfson) |

---

## Part 3: New People for Import

**Starting ID**: 367
**House Wilfson ID**: 24

### Generation 0: Faramund's Family (~1722-1780)

```json
[
  {
    "id": 367,
    "firstName": "Faramund",
    "lastName": "Wilfson",
    "houseName": "House Wilfson",
    "houseId": 24,
    "birth": "1722",
    "death": "1775",
    "titles": ["Lord of House Wilfson", "Master of Silver Mines", "Castellan of Breakmount"],
    "notes": "Lord of House Wilfson. Father of Baudin, Adelise, Nivette, and Colard. Died peacefully with clean succession to Baudin, but Baudin died shortly after in The Scandal of 1776."
  },
  {
    "id": 368,
    "firstName": "Ermeline",
    "lastName": "Wilfrey",
    "houseName": "House Wilfson",
    "houseId": 24,
    "birth": "1726",
    "death": "1780",
    "titles": [],
    "notes": "Wife of Lord Faramund Wilfson. Born to House Wilfrey of Riverhead as 2nd daughter under The Old Right practice. Outlived her husband and witnessed the tragedy of The Scandal. Saw one son kill another."
  },
  {
    "id": 369,
    "firstName": "Baudin",
    "lastName": "Wilfson",
    "houseName": "House Wilfson",
    "houseId": 24,
    "birth": "1748",
    "death": "1776",
    "titles": [],
    "notes": "Eldest son of Faramund. Briefly Lord of House Wilfson after his father's death. Killed by his younger brother Colard in a duel during The Scandal of 1776. His death led to the founding of House Wilson by his sister Nivette."
  },
  {
    "id": 370,
    "firstName": "Adelise",
    "lastName": "Wilfson",
    "houseName": "House Wilfrey of Breakmount",
    "houseId": 5,
    "birth": "1750",
    "death": "1815",
    "titles": [],
    "notes": "Daughter of Faramund Wilfson. Married Aldric Wilfrey of Breakmount before The Scandal, maintaining a Wilfson connection to the main house untainted by the kinslaying. Lived long and witnessed the aftermath."
  },
  {
    "id": 371,
    "firstName": "Nivette",
    "lastName": "Wilfson",
    "houseName": "House Wilson ",
    "houseId": 75,
    "birth": "1752",
    "death": null,
    "titles": [],
    "notes": "Daughter of Faramund Wilfson. Fled with her betrothed Lennis of Fourhearth after The Scandal of 1776 to found House Wilson. Co-founder of the broken branch that received Crown recognition in 1685 to break from Wilfrey Drith authority."
  }
]
```

### Generation 1: Colard's Family (~1754-1820)

```json
[
  {
    "id": 372,
    "firstName": "Colard",
    "lastName": "Wilfson",
    "houseName": "House Wilfson",
    "houseId": 24,
    "birth": "1754",
    "death": "1812",
    "titles": ["Lord of House Wilfson", "Master of Silver Mines", "Castellan of Breakmount"],
    "notes": "The Kinslayer. Younger son of Faramund who killed his brother Baudin in a duel during The Scandal of 1776. Became Lord and preserved the house through 36 years of grim, dedicated service. Named his heir Baudric - a variant of Baudin - a controversial choice that divided the house."
  },
  {
    "id": 373,
    "firstName": "Giseline",
    "lastName": "Wilfrey",
    "houseName": "House Wilfson",
    "houseId": 24,
    "birth": "1758",
    "death": "1820",
    "titles": [],
    "notes": "Wife of Colard Wilfson. Born to House Wilfrey of Bramblehall. Their marriage in 1778, two years after The Scandal, was a gesture of reconciliation - Bramblehall forgave the chaos that originated from their seat."
  },
  {
    "id": 374,
    "firstName": "Baudric",
    "lastName": "Wilfson",
    "houseName": "House Wilfson",
    "houseId": 24,
    "birth": "1780",
    "death": "1848",
    "titles": ["Lord of House Wilfson", "Master of Silver Mines", "Castellan of Breakmount"],
    "notes": "Lord of House Wilfson 1812-1848. Named in memory of his uncle Baudin - a controversial choice. Some saw it as honoring the dead; others as tempting fate. Never discussed the matter publicly. First lord to marry outside the Wilfrey web after The Scandal."
  },
  {
    "id": 375,
    "firstName": "Farelin",
    "lastName": "Wilfson",
    "houseName": "House Goff",
    "houseId": 16,
    "birth": "1783",
    "death": "1855",
    "titles": [],
    "notes": "Second son of Colard. The 'spare heir' - married into House Goff. His line continues but not in direct succession. Named to honor his grandfather Faramund."
  },
  {
    "id": 376,
    "firstName": "Beraline",
    "lastName": "Wilfson",
    "houseName": "House Wilfern ",
    "houseId": 72,
    "birth": "1786",
    "death": null,
    "titles": [],
    "notes": "Daughter of Colard Wilfson. Married into House Wilfern, the Breakmount cadet branch."
  }
]
```

### Generation 2: Baudric's Family (~1780-1855)

```json
[
  {
    "id": 377,
    "firstName": "Aveline",
    "lastName": "Salter",
    "houseName": "House Wilfson",
    "houseId": 24,
    "birth": "1785",
    "death": "1855",
    "titles": [],
    "notes": "Wife of Lord Baudric Wilfson. Born to House Salter of the Scorch - a deliberate choice to bring fresh blood from outside the Wilfrey web after The Scandal. This began a pattern of alternating between Wilfrey marriages and outside alliances."
  },
  {
    "id": 378,
    "firstName": "Coland",
    "lastName": "Wilfson",
    "houseName": "House Wilfson",
    "houseId": 24,
    "birth": "1805",
    "death": "1878",
    "titles": ["Lord of House Wilfson", "Master of Silver Mines", "Castellan of Breakmount"],
    "notes": "Lord of House Wilfson 1848-1878. His name was a variant of Colard - the kinslayer redeemed through generations of loyal service. Third generation after The Scandal."
  },
  {
    "id": 379,
    "firstName": "Ermette",
    "lastName": "Wilfson",
    "houseName": "House Wilfrey of Fourhearth ",
    "houseId": 22,
    "birth": "1808",
    "death": null,
    "titles": [],
    "notes": "Daughter of Baudric Wilfson. Named to honor grandmother Ermeline. Married into House Wilfrey of Fourhearth, restoring connection to Lennis's old seat - a symbolic gesture given that Lennis's departure created House Wilson."
  },
  {
    "id": 380,
    "firstName": "Gisel",
    "lastName": "Wilfson",
    "houseName": "House Wilfson",
    "houseId": 24,
    "birth": "1812",
    "death": null,
    "titles": ["Fosterreeve"],
    "notes": "Third child of Baudric Wilfson. Named to honor his mother Giseline. Never married. Became a noted administrator, served as Fosterreeve for 30 years."
  }
]
```

### Generation 3: Coland's Family (~1805-1885)

**NOTE**: Uses House Thornbury - ensure house is created first and update houseId below.

```json
[
  {
    "id": 381,
    "firstName": "Helewise",
    "lastName": "Thornbury",
    "houseName": "House Wilfson",
    "houseId": 24,
    "birth": "1810",
    "death": "1885",
    "titles": [],
    "notes": "Wife of Lord Coland Wilfson. Born to House Thornbury of the eastern reaches - a Drith-level landed family known for horse breeding. Marriage represented diversification outside the Wilfrey web while maintaining appropriate standing for a cadet house."
  },
  {
    "id": 382,
    "firstName": "Berin",
    "lastName": "Wilfson",
    "houseName": "House Wilfson",
    "houseId": 24,
    "birth": "1830",
    "death": "1905",
    "titles": ["Lord of House Wilfson", "Master of Silver Mines", "Castellan of Breakmount"],
    "notes": "Lord of House Wilfson 1878-1905. Fourth generation after The Scandal. Returned to traditional Wilfrey alliance by marrying into Riverhead."
  },
  {
    "id": 383,
    "firstName": "Audeline",
    "lastName": "Wilfson",
    "houseName": "House Athelmere",
    "houseId": 19,
    "birth": "1833",
    "death": null,
    "titles": [],
    "notes": "Daughter of Coland Wilfson. Married into House Athelmere, establishing the connection that continues to the present day with Jon Wilfson's marriage to Saelis Athelmere."
  },
  {
    "id": 384,
    "firstName": "Colwin",
    "lastName": "Wilfson",
    "houseName": "House Wilfson",
    "houseId": 24,
    "birth": "1837",
    "death": null,
    "titles": ["Fosterbookman"],
    "notes": "Third child of Coland Wilfson. Named as a variant honoring grandfather Colard while remaining distinct. Never married. Served as Fosterbookman in the fostering system."
  }
]
```

### Generation 4: Berin's Family (~1830-1910)

```json
[
  {
    "id": 385,
    "firstName": "Celisse",
    "lastName": "Wilfrey",
    "houseName": "House Wilfson",
    "houseId": 24,
    "birth": "1835",
    "death": "1910",
    "titles": [],
    "notes": "Wife of Lord Berin Wilfson. Born to House Wilfrey of Riverhead - a return to traditional alliance four generations after The Scandal."
  },
  {
    "id": 386,
    "firstName": "Farmund",
    "lastName": "Wilfson",
    "houseName": "House Wilfson",
    "houseId": 24,
    "birth": "1858",
    "death": "1932",
    "titles": ["Lord of House Wilfson", "Master of Silver Mines", "Castellan of Breakmount"],
    "notes": "Lord of House Wilfson 1905-1932. Named to honor the ancestral founder Faramund with slightly varied spelling. Fifth generation after The Scandal."
  },
  {
    "id": 387,
    "firstName": "Celina",
    "lastName": "Wilfson",
    "houseName": "House Goff",
    "houseId": 16,
    "birth": "1861",
    "death": null,
    "titles": [],
    "notes": "Daughter of Berin Wilfson. Named after her mother Celisse. Married into House Goff."
  },
  {
    "id": 388,
    "firstName": "Aldwyn",
    "lastName": "Wilfson",
    "houseName": "House Wilfson",
    "houseId": 24,
    "birth": "1865",
    "death": null,
    "titles": [],
    "notes": "Third child of Berin Wilfson. Pursued a military career, never inherited."
  }
]
```

### Generation 5: Farmund's Family (~1858-1940)

```json
[
  {
    "id": 389,
    "firstName": "Roseline",
    "lastName": "Cawdry",
    "houseName": "House Wilfson",
    "houseId": 24,
    "birth": "1862",
    "death": "1940",
    "titles": [],
    "notes": "Wife of Lord Farmund Wilfson. Born to House Cawdry, a minor house - an appropriate practical match for a cadet branch."
  },
  {
    "id": 390,
    "firstName": "Colbert",
    "lastName": "Wilfson",
    "houseName": "House Wilfson",
    "houseId": 24,
    "birth": "1885",
    "death": "1960",
    "titles": ["Lord of House Wilfson", "Master of Silver Mines", "Castellan of Breakmount"],
    "notes": "Lord of House Wilfson 1932-1960. Sixth generation after The Scandal."
  },
  {
    "id": 391,
    "firstName": "Rosmund",
    "lastName": "Wilfson",
    "houseName": "House Eldwick",
    "houseId": 20,
    "birth": "1888",
    "death": null,
    "titles": [],
    "notes": "Daughter of Farmund Wilfson. Married into House Eldwick (motto: 'What Was, Remains') - a practical match for a cadet daughter."
  },
  {
    "id": 392,
    "firstName": "Bertelin",
    "lastName": "Wilfson",
    "houseName": "House Wilfson",
    "houseId": 24,
    "birth": "1892",
    "death": "1916",
    "titles": [],
    "notes": "Third child of Farmund Wilfson. Died young at 24 - likely in war or by accident."
  }
]
```

### Generation 6: Colbert's Family (~1885-1965)

```json
[
  {
    "id": 393,
    "firstName": "Maelisse",
    "lastName": "Parlin",
    "houseName": "House Wilfson",
    "houseId": 24,
    "birth": "1890",
    "death": "1965",
    "titles": [],
    "notes": "Wife of Lord Colbert Wilfson. Born to House Parlin, a minor house - another practical match maintaining appropriate standing."
  },
  {
    "id": 394,
    "firstName": "Bauric",
    "lastName": "Wilfson",
    "houseName": "House Wilfson",
    "houseId": 24,
    "birth": "1915",
    "death": "1985",
    "titles": ["Lord of House Wilfson", "Master of Silver Mines", "Castellan of Breakmount"],
    "notes": "Lord of House Wilfson 1960-1985. Seventh generation after The Scandal. Father of Jon Wilfson. His marriage to Loveline of Breakmount represented full restoration of House Wilfson's position - no longer marked by kinslaying, fully trusted."
  },
  {
    "id": 395,
    "firstName": "Maeline",
    "lastName": "Wilfson",
    "houseName": "House Wentburn",
    "houseId": 8,
    "birth": "1918",
    "death": null,
    "titles": [],
    "notes": "Daughter of Colbert Wilfson. Married into House Wentburn."
  },
  {
    "id": 396,
    "firstName": "Parris",
    "lastName": "Wilfson",
    "houseName": "House Wilfson",
    "houseId": 24,
    "birth": "1922",
    "death": null,
    "titles": ["Fostersteward"],
    "notes": "Third child of Colbert Wilfson. Unmarried. Served in the fostering system as Fostersteward."
  }
]
```

### Generation 7: Bauric's Family (~1915-2005)

```json
[
  {
    "id": 397,
    "firstName": "Loveline",
    "lastName": "Wilfrey",
    "houseName": "House Wilfson",
    "houseId": 24,
    "birth": "1925",
    "death": "2005",
    "titles": [],
    "notes": "Wife of Lord Bauric Wilfson. Born to House Wilfrey of Breakmount - this marriage represented the full restoration of House Wilfson's position after generations of rebuilding trust following The Scandal."
  },
  {
    "id": 398,
    "firstName": "Lovine",
    "lastName": "Wilfson",
    "houseName": "House Ferncross",
    "houseId": 74,
    "birth": "1958",
    "death": null,
    "titles": [],
    "notes": "Daughter of Bauric Wilfson, sister of Jon and Betts. Married into House Ferncross, a minor house."
  }
]
```

**Note**: Jon Wilfson (#343) and Betts Wilfson (#366) already exist.

### Generation 8: Jon's Family (1953-present)

```json
[
  {
    "id": 399,
    "firstName": "Baudin",
    "lastName": "Wilfson",
    "houseName": "House Wilfson",
    "houseId": 24,
    "birth": "2004",
    "death": null,
    "titles": [],
    "notes": "Heir of Jon Wilfson. Named for the ancestor who died in The Scandal of 1776 - 250 years later, the name is finally reclaimed. A sign that House Wilfson has fully processed the trauma of the kinslaying."
  },
  {
    "id": 400,
    "firstName": "Saelind",
    "lastName": "Wilfson",
    "houseName": "House Wilfson",
    "houseId": 24,
    "birth": "2007",
    "death": null,
    "titles": [],
    "notes": "Daughter of Jon Wilfson and Saelis Athelmere. Named as a variation of her mother's name."
  }
]
```

**Note**: Saelis Athelmere (#78) already exists.

---

## Part 4: Relationships to Create

**Starting Relationship ID**: 581

### DATA ISSUE NOTED

The existing relationships.json contains some entries that may need review:
- Relationship 541: Shows Jon Wilfson (343) as parent of Saelis Athelmere (78)
- Relationship 579: Shows Jon Wilfson (343) as spouse of Betts Wilfson (366)
- Relationship 580: Shows Betts Wilfson (366) as parent of Saelis Athelmere (78)

These appear to be errors. The intended relationships based on the approved lineage are:
- Jon Wilfson is married to Saelis Athelmere (not her parent)
- Betts Wilfson is Jon's sister (not spouse)

**Recommendation**: Delete relationships 541, 579, 580 before importing new data.

### Spouse Relationships (JSON)

```json
[
  {
    "id": 581,
    "type": "spouse",
    "person1": "Faramund Wilfson",
    "person1Id": 367,
    "person2": "Ermeline Wilfrey",
    "person2Id": 368
  },
  {
    "id": 582,
    "type": "spouse",
    "person1": "Colard Wilfson",
    "person1Id": 372,
    "person2": "Giseline Wilfrey",
    "person2Id": 373
  },
  {
    "id": 583,
    "type": "spouse",
    "person1": "Baudric Wilfson",
    "person1Id": 374,
    "person2": "Aveline Salter",
    "person2Id": 377
  },
  {
    "id": 584,
    "type": "spouse",
    "person1": "Coland Wilfson",
    "person1Id": 378,
    "person2": "Helewise Thornbury",
    "person2Id": 381
  },
  {
    "id": 585,
    "type": "spouse",
    "person1": "Berin Wilfson",
    "person1Id": 382,
    "person2": "Celisse Wilfrey",
    "person2Id": 385
  },
  {
    "id": 586,
    "type": "spouse",
    "person1": "Farmund Wilfson",
    "person1Id": 386,
    "person2": "Roseline Cawdry",
    "person2Id": 389
  },
  {
    "id": 587,
    "type": "spouse",
    "person1": "Colbert Wilfson",
    "person1Id": 390,
    "person2": "Maelisse Parlin",
    "person2Id": 393
  },
  {
    "id": 588,
    "type": "spouse",
    "person1": "Bauric Wilfson",
    "person1Id": 394,
    "person2": "Loveline Wilfrey",
    "person2Id": 397
  },
  {
    "id": 589,
    "type": "spouse",
    "person1": "Jon Wilfson",
    "person1Id": 343,
    "person2": "Saelis Athelmere",
    "person2Id": 78
  },
  {
    "id": 590,
    "type": "spouse",
    "person1": "Adelise Wilfson",
    "person1Id": 370,
    "person2": "Aldric Wilfrey",
    "person2Id": 317
  }
]
```

### Parent-Child Relationships (JSON)

```json
[
  {
    "id": 591,
    "type": "parent",
    "person1": "Faramund Wilfson",
    "person1Id": 367,
    "person2": "Baudin Wilfson",
    "person2Id": 369
  },
  {
    "id": 592,
    "type": "parent",
    "person1": "Ermeline Wilfrey",
    "person1Id": 368,
    "person2": "Baudin Wilfson",
    "person2Id": 369
  },
  {
    "id": 593,
    "type": "parent",
    "person1": "Faramund Wilfson",
    "person1Id": 367,
    "person2": "Adelise Wilfson",
    "person2Id": 370
  },
  {
    "id": 594,
    "type": "parent",
    "person1": "Ermeline Wilfrey",
    "person1Id": 368,
    "person2": "Adelise Wilfson",
    "person2Id": 370
  },
  {
    "id": 595,
    "type": "parent",
    "person1": "Faramund Wilfson",
    "person1Id": 367,
    "person2": "Nivette Wilfson",
    "person2Id": 371
  },
  {
    "id": 596,
    "type": "parent",
    "person1": "Ermeline Wilfrey",
    "person1Id": 368,
    "person2": "Nivette Wilfson",
    "person2Id": 371
  },
  {
    "id": 597,
    "type": "parent",
    "person1": "Faramund Wilfson",
    "person1Id": 367,
    "person2": "Colard Wilfson",
    "person2Id": 372
  },
  {
    "id": 598,
    "type": "parent",
    "person1": "Ermeline Wilfrey",
    "person1Id": 368,
    "person2": "Colard Wilfson",
    "person2Id": 372
  },
  {
    "id": 599,
    "type": "parent",
    "person1": "Colard Wilfson",
    "person1Id": 372,
    "person2": "Baudric Wilfson",
    "person2Id": 374
  },
  {
    "id": 600,
    "type": "parent",
    "person1": "Giseline Wilfrey",
    "person1Id": 373,
    "person2": "Baudric Wilfson",
    "person2Id": 374
  },
  {
    "id": 601,
    "type": "parent",
    "person1": "Colard Wilfson",
    "person1Id": 372,
    "person2": "Farelin Wilfson",
    "person2Id": 375
  },
  {
    "id": 602,
    "type": "parent",
    "person1": "Giseline Wilfrey",
    "person1Id": 373,
    "person2": "Farelin Wilfson",
    "person2Id": 375
  },
  {
    "id": 603,
    "type": "parent",
    "person1": "Colard Wilfson",
    "person1Id": 372,
    "person2": "Beraline Wilfson",
    "person2Id": 376
  },
  {
    "id": 604,
    "type": "parent",
    "person1": "Giseline Wilfrey",
    "person1Id": 373,
    "person2": "Beraline Wilfson",
    "person2Id": 376
  },
  {
    "id": 605,
    "type": "parent",
    "person1": "Baudric Wilfson",
    "person1Id": 374,
    "person2": "Coland Wilfson",
    "person2Id": 378
  },
  {
    "id": 606,
    "type": "parent",
    "person1": "Aveline Salter",
    "person1Id": 377,
    "person2": "Coland Wilfson",
    "person2Id": 378
  },
  {
    "id": 607,
    "type": "parent",
    "person1": "Baudric Wilfson",
    "person1Id": 374,
    "person2": "Ermette Wilfson",
    "person2Id": 379
  },
  {
    "id": 608,
    "type": "parent",
    "person1": "Aveline Salter",
    "person1Id": 377,
    "person2": "Ermette Wilfson",
    "person2Id": 379
  },
  {
    "id": 609,
    "type": "parent",
    "person1": "Baudric Wilfson",
    "person1Id": 374,
    "person2": "Gisel Wilfson",
    "person2Id": 380
  },
  {
    "id": 610,
    "type": "parent",
    "person1": "Aveline Salter",
    "person1Id": 377,
    "person2": "Gisel Wilfson",
    "person2Id": 380
  },
  {
    "id": 611,
    "type": "parent",
    "person1": "Coland Wilfson",
    "person1Id": 378,
    "person2": "Berin Wilfson",
    "person2Id": 382
  },
  {
    "id": 612,
    "type": "parent",
    "person1": "Helewise Thornbury",
    "person1Id": 381,
    "person2": "Berin Wilfson",
    "person2Id": 382
  },
  {
    "id": 613,
    "type": "parent",
    "person1": "Coland Wilfson",
    "person1Id": 378,
    "person2": "Audeline Wilfson",
    "person2Id": 383
  },
  {
    "id": 614,
    "type": "parent",
    "person1": "Helewise Thornbury",
    "person1Id": 381,
    "person2": "Audeline Wilfson",
    "person2Id": 383
  },
  {
    "id": 615,
    "type": "parent",
    "person1": "Coland Wilfson",
    "person1Id": 378,
    "person2": "Colwin Wilfson",
    "person2Id": 384
  },
  {
    "id": 616,
    "type": "parent",
    "person1": "Helewise Thornbury",
    "person1Id": 381,
    "person2": "Colwin Wilfson",
    "person2Id": 384
  },
  {
    "id": 617,
    "type": "parent",
    "person1": "Berin Wilfson",
    "person1Id": 382,
    "person2": "Farmund Wilfson",
    "person2Id": 386
  },
  {
    "id": 618,
    "type": "parent",
    "person1": "Celisse Wilfrey",
    "person1Id": 385,
    "person2": "Farmund Wilfson",
    "person2Id": 386
  },
  {
    "id": 619,
    "type": "parent",
    "person1": "Berin Wilfson",
    "person1Id": 382,
    "person2": "Celina Wilfson",
    "person2Id": 387
  },
  {
    "id": 620,
    "type": "parent",
    "person1": "Celisse Wilfrey",
    "person1Id": 385,
    "person2": "Celina Wilfson",
    "person2Id": 387
  },
  {
    "id": 621,
    "type": "parent",
    "person1": "Berin Wilfson",
    "person1Id": 382,
    "person2": "Aldwyn Wilfson",
    "person2Id": 388
  },
  {
    "id": 622,
    "type": "parent",
    "person1": "Celisse Wilfrey",
    "person1Id": 385,
    "person2": "Aldwyn Wilfson",
    "person2Id": 388
  },
  {
    "id": 623,
    "type": "parent",
    "person1": "Farmund Wilfson",
    "person1Id": 386,
    "person2": "Colbert Wilfson",
    "person2Id": 390
  },
  {
    "id": 624,
    "type": "parent",
    "person1": "Roseline Cawdry",
    "person1Id": 389,
    "person2": "Colbert Wilfson",
    "person2Id": 390
  },
  {
    "id": 625,
    "type": "parent",
    "person1": "Farmund Wilfson",
    "person1Id": 386,
    "person2": "Rosmund Wilfson",
    "person2Id": 391
  },
  {
    "id": 626,
    "type": "parent",
    "person1": "Roseline Cawdry",
    "person1Id": 389,
    "person2": "Rosmund Wilfson",
    "person2Id": 391
  },
  {
    "id": 627,
    "type": "parent",
    "person1": "Farmund Wilfson",
    "person1Id": 386,
    "person2": "Bertelin Wilfson",
    "person2Id": 392
  },
  {
    "id": 628,
    "type": "parent",
    "person1": "Roseline Cawdry",
    "person1Id": 389,
    "person2": "Bertelin Wilfson",
    "person2Id": 392
  },
  {
    "id": 629,
    "type": "parent",
    "person1": "Colbert Wilfson",
    "person1Id": 390,
    "person2": "Bauric Wilfson",
    "person2Id": 394
  },
  {
    "id": 630,
    "type": "parent",
    "person1": "Maelisse Parlin",
    "person1Id": 393,
    "person2": "Bauric Wilfson",
    "person2Id": 394
  },
  {
    "id": 631,
    "type": "parent",
    "person1": "Colbert Wilfson",
    "person1Id": 390,
    "person2": "Maeline Wilfson",
    "person2Id": 395
  },
  {
    "id": 632,
    "type": "parent",
    "person1": "Maelisse Parlin",
    "person1Id": 393,
    "person2": "Maeline Wilfson",
    "person2Id": 395
  },
  {
    "id": 633,
    "type": "parent",
    "person1": "Colbert Wilfson",
    "person1Id": 390,
    "person2": "Parris Wilfson",
    "person2Id": 396
  },
  {
    "id": 634,
    "type": "parent",
    "person1": "Maelisse Parlin",
    "person1Id": 393,
    "person2": "Parris Wilfson",
    "person2Id": 396
  },
  {
    "id": 635,
    "type": "parent",
    "person1": "Bauric Wilfson",
    "person1Id": 394,
    "person2": "Jon Wilfson",
    "person2Id": 343
  },
  {
    "id": 636,
    "type": "parent",
    "person1": "Loveline Wilfrey",
    "person1Id": 397,
    "person2": "Jon Wilfson",
    "person2Id": 343
  },
  {
    "id": 637,
    "type": "parent",
    "person1": "Bauric Wilfson",
    "person1Id": 394,
    "person2": "Lovine Wilfson",
    "person2Id": 398
  },
  {
    "id": 638,
    "type": "parent",
    "person1": "Loveline Wilfrey",
    "person1Id": 397,
    "person2": "Lovine Wilfson",
    "person2Id": 398
  },
  {
    "id": 639,
    "type": "parent",
    "person1": "Bauric Wilfson",
    "person1Id": 394,
    "person2": "Betts Wilfson",
    "person2Id": 366
  },
  {
    "id": 640,
    "type": "parent",
    "person1": "Loveline Wilfrey",
    "person1Id": 397,
    "person2": "Betts Wilfson",
    "person2Id": 366
  },
  {
    "id": 641,
    "type": "parent",
    "person1": "Jon Wilfson",
    "person1Id": 343,
    "person2": "Baudin Wilfson",
    "person2Id": 399
  },
  {
    "id": 642,
    "type": "parent",
    "person1": "Saelis Athelmere",
    "person1Id": 78,
    "person2": "Baudin Wilfson",
    "person2Id": 399
  },
  {
    "id": 643,
    "type": "parent",
    "person1": "Jon Wilfson",
    "person1Id": 343,
    "person2": "Saelind Wilfson",
    "person2Id": 400
  },
  {
    "id": 644,
    "type": "parent",
    "person1": "Saelis Athelmere",
    "person1Id": 78,
    "person2": "Saelind Wilfson",
    "person2Id": 400
  }
]
```

---

## Part 5: Summary Statistics

| Category | Count |
|----------|-------|
| New People | 34 |
| New Houses | 1 (Thornbury) |
| Existing People Updated | 3 (Jon #343, Betts #366, Saelis #78) |
| Erroneous Relationships to Delete | 3 (IDs 541, 579, 580) |
| New Spouse Relationships | 10 |
| New Parent Relationships | 54 |
| Total New Relationships | 64 |
| Total Generations | 9 (0-8) |
| Lords of House Wilfson | 9 |

---

## Part 6: Import Order

1. **Create House Thornbury** - Record the assigned ID
2. **Import Generation 0** (Faramund's family) - IDs 367-371
3. **Import Generation 1** (Colard's family) - IDs 372-376
4. **Import Generation 2** (Baudric's family) - IDs 377-380
5. **Import Generation 3** (Coland's family) - IDs 381-384 (uses Thornbury)
6. **Import Generation 4** (Berin's family) - IDs 385-388
7. **Import Generation 5** (Farmund's family) - IDs 389-392
8. **Import Generation 6** (Colbert's family) - IDs 393-396
9. **Import Generation 7** (Bauric's family) - IDs 397-398
10. **Import Generation 8** (Jon's children) - IDs 399-400
11. **Create parent-child relationships**
12. **Create marriage relationships**
13. **Update existing characters** (Jon #343, Betts #366, Saelis #78)

---

*End of Import Data*
