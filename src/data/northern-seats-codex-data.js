/**
 * NORTHERN CROWN SEATS - CODEX IMPORT DATA
 *
 * Codex entries for the seats/estates of the 10 Northern Crown Houses.
 * These houses hold directly from the Crown and form the marriage network
 * for House Wilson.
 *
 * ENTRIES INCLUDED:
 *
 * LOCATIONS (10 entries):
 * 1. Merehall - Seat of House Northmere
 * 2. Wardkeep - Seat of House Kingsward
 * 3. Granford Keep - Seat of House Granford
 * 4. Moorstead - Seat of House Croftmoor
 * 5. Helm Castle - Seat of House Helmward
 * 6. Blackmoor Hall - Seat of House Blackmoor
 * 7. Cresthold - Seat of House Stormcrest
 * 8. Thornwick Manor - Seat of House Thornwick
 * 9. Ashford Hall - Seat of House Ashford
 * 10. Fenwick Keep - Seat of House Fenwick
 *
 * USAGE:
 * Import using the EnhancedCodexImportTool or programmatically via:
 *
 * import NORTHERN_SEATS_CODEX_DATA from './data/northern-seats-codex-data';
 * import { importCodexData } from './utils/enhanced-codex-import';
 * await importCodexData(NORTHERN_SEATS_CODEX_DATA);
 */

export const NORTHERN_SEATS_CODEX_DATA = {

  // ============================================================================
  // LOCATIONS (10 entries)
  // ============================================================================

  locations: [
    {
      type: 'locations',
      title: 'Merehall',
      subtitle: 'Seat of House Northmere',
      category: 'Northern Crown Seats',
      tags: ['seat', 'northmere', 'northern-crown', 'lake', 'hall'],
      era: 'Current Era',

      content: `**Merehall** is the seat of [[House Northmere]], situated on the shores of the great northern lake.

## Architecture
A sprawling, low-built hall of grey stone, more longhouse than castle. The original structure dates back centuries, with additions built as needed rather than planned. Docks extend into the lake where fishing boats tie up.

## Surroundings
The great lake dominates the landscape - cold, deep, and rich with fish. Peat bogs stretch inland, providing fuel for the north. The Northmeres have fished these waters since before anyone kept records.

## Notable Features
- The Long Dock: Where the fishing fleet moors
- The Smoke House: Ancient structure for preserving fish
- The Peat Stores: Vast covered yards of drying peat`
    },
    {
      type: 'locations',
      title: 'Wardkeep',
      subtitle: 'Seat of House Kingsward',
      category: 'Northern Crown Seats',
      tags: ['seat', 'kingsward', 'northern-crown', 'garrison', 'fortress'],
      era: 'Current Era',

      content: `**Wardkeep** is the seat of [[House Kingsward]], a fortified garrison on the northern royal road.

## Architecture
A functional military fortress rather than a lordly castle. Square towers, thick walls, and a large gatehouse spanning the road. Designed to control passage, not to impress.

## Surroundings
Wardkeep straddles the northern royal road at a natural chokepoint between hills. All traffic north or south must pass through its gates and pay its tolls.

## Notable Features
- The King's Gate: Main passage through, tolls collected here
- The Garrison Yard: Barracks for Crown soldiers
- The Road Tower: Watchtower with views for miles in each direction`
    },
    {
      type: 'locations',
      title: 'Granford Keep',
      subtitle: 'Seat of House Granford',
      category: 'Northern Crown Seats',
      tags: ['seat', 'granford', 'northern-crown', 'farmland', 'keep'],
      era: 'Current Era',

      content: `**Granford Keep** is the seat of [[House Granford]], surrounded by the richest farmland in the Northern Crown Marches.

## Architecture
A practical, well-maintained keep with extensive outbuildings - barns, granaries, and cattle sheds. The Granfords invest in their farms, not their walls.

## Surroundings
Rolling fields of wheat, barley, and oats stretch to the horizon. Fat cattle graze in meadows. This is the breadbasket of the north - modest by southern standards, but vital up here.

## Notable Features
- The Great Granary: Stores enough grain to feed the northern houses through hard winters
- The Cattle Fair: Annual market drawing buyers from across the region
- The Mill: Water-powered, grinding grain for the whole district`
    },
    {
      type: 'locations',
      title: 'Moorstead',
      subtitle: 'Seat of House Croftmoor',
      category: 'Northern Crown Seats',
      tags: ['seat', 'croftmoor', 'northern-crown', 'moorland', 'tower'],
      era: 'Current Era',

      content: `**Moorstead** is the seat of [[House Croftmoor]], a remote stronghold on the edge of the northern moors.

## Architecture
A squat, weathered tower surrounded by a low wall - built to endure harsh conditions rather than siege. Outbuildings cluster close for protection from the wind.

## Surroundings
Endless moorland stretches in all directions - heather, gorse, and rough grass. Sheep dot the landscape. The wind never stops. It is beautiful in a bleak way, and deeply isolated.

## Notable Features
- The Herb Garden: Walled enclosure where moorland medicinals are cultivated
- The Sheep Folds: Stone enclosures dotting the moors for miles
- The Signal Tower: For communicating across the vast moorland distances`
    },
    {
      type: 'locations',
      title: 'Helm Castle',
      subtitle: 'Seat of House Helmward',
      category: 'Northern Crown Seats',
      tags: ['seat', 'helmward', 'northern-crown', 'border', 'castle', 'military'],
      era: 'Current Era',

      content: `**Helm Castle** is the seat of [[House Helmward]], a border fortress in the northern marches.

## Architecture
A true military castle - high walls, strong towers, and a well-designed killing ground before the gates. The Helmwards have defended this border for generations and their home reflects it.

## Surroundings
Rocky, defensible terrain on the edge of settled lands. Beyond lies wilderness - and whatever threats emerge from it. The castle watches the passes and guards the approaches.

## Notable Features
- The Armoury: One of the finest collections of weapons in the north
- The Training Yard: Where every Helmward child learns the sword
- The Watch Fires: Beacon system to warn of approaching threats`
    },
    {
      type: 'locations',
      title: 'Blackmoor Hall',
      subtitle: 'Seat of House Blackmoor',
      category: 'Northern Crown Seats',
      tags: ['seat', 'blackmoor', 'northern-crown', 'peatlands', 'hall', 'ancient'],
      era: 'Current Era',

      content: `**Blackmoor Hall** is the seat of [[House Blackmoor]], rising from the dark peatlands of the northern bogs.

## Architecture
An ancient hall built on an island of solid ground amid the bogs. Dark stone, small windows, and a perpetual smell of peat smoke. The approach is treacherous to those who don't know the paths.

## Surroundings
Black water, dark peat, and grey mist. The bogs are dangerous but productive - peat for fuel, bog iron for smithing, eels for eating. The Blackmoors know every safe path; outsiders frequently don't.

## Notable Features
- The Bog Paths: Secret routes known only to the family and trusted servants
- The Iron Pits: Where bog iron is harvested and smelted
- The Old Shrine: Ancient stones predating the hall, still honored with offerings`
    },
    {
      type: 'locations',
      title: 'Cresthold',
      subtitle: 'Seat of House Stormcrest',
      category: 'Northern Crown Seats',
      tags: ['seat', 'stormcrest', 'northern-crown', 'coastal', 'castle', 'harbor'],
      era: 'Current Era',

      content: `**Cresthold** is the seat of [[House Stormcrest]], perched on cliffs overlooking the northern sea.

## Architecture
A windswept castle built into the cliff face, with a protected harbor below. Salt-stained stone and iron-bound doors that can withstand the worst storms. Ships are as important as walls here.

## Surroundings
The northern sea - grey, cold, and full of fish. Rocky coastline with hidden coves. The Stormcrests know every inlet and current along this stretch of coast.

## Notable Features
- The Harbor: Protected anchorage carved from the cliff base
- The Salt Works: Where sea water is evaporated for salt
- The Trader's Hall: Where goods from distant ports are bought and sold`
    },
    {
      type: 'locations',
      title: 'Thornwick Manor',
      subtitle: 'Seat of House Thornwick',
      category: 'Northern Crown Seats',
      tags: ['seat', 'thornwick', 'northern-crown', 'manor', 'newest'],
      era: 'Current Era',

      content: `**Thornwick Manor** is the seat of [[House Thornwick]], the newest of the Northern Crown Houses.

## Architecture
A comfortable manor house rather than a castle - the Thornwicks were elevated to nobility only three generations ago and their home reflects their origins as wealthy farmers. Well-built but unpretentious.

## Surroundings
Good farmland, some woodland, a village of tenants. Nothing remarkable, but solid and productive. The Thornwicks are still building their legacy.

## Notable Features
- The New Hall: Recently expanded great hall, eager to host important guests
- The Orchards: Apple and pear trees, a point of pride
- The Village: Prosperous tenants who remember when the Thornwicks were just farmers like them`
    },
    {
      type: 'locations',
      title: 'Ashford Hall',
      subtitle: 'Seat of House Ashford',
      category: 'Northern Crown Seats',
      tags: ['seat', 'ashford', 'northern-crown', 'hall', 'river-crossing'],
      era: 'Current Era',

      content: `**Ashford Hall** is the seat of [[House Ashford]], a modest manor near a river crossing.

## Architecture
A comfortable old hall, neither grand nor decrepit. The Ashfords have held this land for centuries, maintaining it without expanding it. The hall looks much as it did generations ago.

## Surroundings
Mixed farmland along a small river. An old stone bridge gives the place its name - "ash ford" from the ash trees that once lined the crossing. Pleasant, unremarkable country.

## Notable Features
- The Old Bridge: Stone crossing that has stood for centuries
- The Ash Grove: Replanted after the original trees died, maintaining tradition
- The Family Chapel: Small but ancient, with Ashford tombs dating back generations`
    },
    {
      type: 'locations',
      title: 'Fenwick Keep',
      subtitle: 'Seat of House Fenwick',
      category: 'Northern Crown Seats',
      tags: ['seat', 'fenwick', 'northern-crown', 'keep', 'ancient', 'forest'],
      era: 'Current Era',

      content: `**Fenwick Keep** is the seat of [[House Fenwick]], an ancient tower in the northern forests.

## Architecture
A single tall tower of old stone, surrounded by wooden outbuildings. The keep predates written records - the Fenwicks claim it was ancient when their ancestors first held it. It has been repaired but never expanded.

## Surroundings
Dense forest - oak, ash, and pine. Hunting grounds that have provided for the Fenwicks for longer than anyone remembers. The trees press close, and the keep feels hidden from the world.

## Notable Features
- The Ancient Tower: Original structure of unknown age
- The Hunting Lodge: Deep in the forest, where the lords stay during long hunts
- The Fur Store: Where pelts are prepared for trade`
    }
  ]
};

export default NORTHERN_SEATS_CODEX_DATA;
