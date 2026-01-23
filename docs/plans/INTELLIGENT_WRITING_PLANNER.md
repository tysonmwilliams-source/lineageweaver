# Intelligent Writing Planner - Feature Design Document

## Executive Summary

The Intelligent Writing Planner is a comprehensive AI-assisted story planning and narrative development system designed to help writers map out storylines, character arcs, and narrative structure at multiple levels—from individual scenes to entire novel series. It integrates deeply with LineageWeaver's existing codex, genealogy, and canon systems to provide intelligent, context-aware planning assistance.

---

## 1. Core Philosophy & Principles

### 1.1 Design Principles

1. **Canon-Aware Intelligence** - All planning suggestions respect established world data (people, houses, dignities, events, relationships)
2. **Multi-Level Granularity** - Support planning at scene, chapter, arc, book, and series levels
3. **Framework Agnostic** - Support multiple planning methodologies (Save the Cat, Three-Act, Snowflake, Hero's Journey, etc.)
4. **Non-Destructive Guidance** - Suggestions are always optional; the tool serves the writer's vision
5. **Living Document Integration** - Plans connect bidirectionally with actual written prose
6. **Collaborative Intelligence** - AI enhances human creativity rather than replacing it

### 1.2 Research-Backed Methodologies

The planner will incorporate proven storytelling frameworks:

| Framework | Best For | Key Elements |
|-----------|----------|--------------|
| **Save the Cat (15 Beats)** | Commercial fiction, tight pacing | Opening Image, Catalyst, Fun & Games, Midpoint, All Is Lost, Dark Night, Break into Three, Finale |
| **Three-Act Structure** | Universal foundation | Setup (25%), Confrontation (50%), Resolution (25%) |
| **Snowflake Method** | Expansion from concept | One sentence → paragraph → character sheets → scene list |
| **Hero's Journey** | Epic/adventure narratives | Call to Adventure, Threshold, Ordeal, Return |
| **Story Grid** | Genre-specific requirements | Obligatory scenes, conventions, value shifts |
| **Seven-Point Structure** | Plot-driven stories | Hook, Plot Turn 1, Pinch 1, Midpoint, Pinch 2, Plot Turn 2, Resolution |
| **Fichtean Curve** | Tension-focused narratives | Rising crises, climax, falling action |
| **Dan Harmon's Story Circle** | Character transformation | You, Need, Go, Search, Find, Take, Return, Change |

---

## 2. Feature Architecture

### 2.1 Planning Hierarchy

```
Series (optional)
  └── Book/Novel
        └── Part/Act
              └── Chapter
                    └── Scene
                          └── Beat
```

### 2.2 Core Planning Entities

#### Story Plan
The top-level container for a writing project's plan.

```javascript
{
  id: number,
  writingId: number,              // FK to writing (1:1 relationship)
  title: string,
  framework: enum['save-the-cat', 'three-act', 'snowflake', 'heros-journey',
                  'story-grid', 'seven-point', 'fichtean', 'story-circle', 'custom'],
  premise: string,                // One-sentence story summary
  synopsis: string,               // Expanded synopsis (paragraph)
  theme: string,                  // Central theme/message
  genre: string[],                // Genre tags
  targetWordCount: number,
  estimatedChapters: number,
  settings: {
    timelineStart: string,        // Story timeline start (in-world date)
    timelineEnd: string,          // Story timeline end
    primaryLocations: number[],   // FK to codex locations
    timeSpan: string              // Duration description
  },
  metadata: object,
  createdAt: ISO8601,
  updatedAt: ISO8601
}
```

#### Story Arc
Tracks narrative arcs (main plot + subplots).

```javascript
{
  id: number,
  storyPlanId: number,            // FK to StoryPlan
  name: string,                   // "Main Plot", "Romance Subplot", etc.
  type: enum['main', 'subplot', 'character', 'thematic'],
  description: string,
  startingState: string,          // Where does this arc begin?
  endingState: string,            // Where should it resolve?
  valueAtStake: string,           // What value shifts? (life/death, love/hate, etc.)
  status: enum['planned', 'in-progress', 'resolved', 'abandoned'],
  linkedCharacters: number[],     // FK to people involved
  order: number,                  // Display order
  color: string,                  // For visual timeline
  createdAt: ISO8601,
  updatedAt: ISO8601
}
```

#### Story Beat
Framework-specific story beats (Save the Cat beats, Hero's Journey stages, etc.).

```javascript
{
  id: number,
  storyPlanId: number,            // FK to StoryPlan
  storyArcId: number,             // FK to StoryArc (nullable for main story beats)
  name: string,                   // "Catalyst", "Midpoint", "All Is Lost"
  beatType: string,               // Framework-specific beat type
  description: string,            // What happens in this beat
  targetPercentage: number,       // Where in story (0-100%)
  targetWordCount: number,        // Approximate word count target
  actualChapterId: number,        // FK to actual chapter (once written)
  status: enum['planned', 'drafted', 'complete'],
  notes: string,
  order: number,
  createdAt: ISO8601,
  updatedAt: ISO8601
}
```

#### Scene Plan
Detailed scene-level planning.

```javascript
{
  id: number,
  storyPlanId: number,            // FK to StoryPlan
  chapterId: number,              // FK to Chapter (nullable until assigned)
  title: string,
  summary: string,                // What happens in this scene
  purpose: string,                // Why this scene exists

  // Scene Metadata
  povCharacterId: number,         // FK to person
  locationId: number,             // FK to codex location entry
  timelinePosition: string,       // When in story timeline

  // Narrative Elements
  goal: string,                   // POV character's goal
  conflict: string,               // What opposes the goal
  disaster: string,               // Outcome (usually negative for tension)
  reaction: string,               // Emotional response
  dilemma: string,                // Choice faced
  decision: string,               // What they decide

  // Scene Dynamics
  tensionLevel: number,           // 1-10 scale
  emotionalTone: string[],        // ["tense", "hopeful", "melancholy"]
  pacingType: enum['action', 'reaction', 'transition', 'exposition'],

  // Connections
  storyArcIds: number[],          // Which arcs this scene advances
  charactersPresent: number[],    // FK to people
  linkedBeats: number[],          // FK to StoryBeats this fulfills

  // Planning
  order: number,
  estimatedWordCount: number,
  status: enum['idea', 'planned', 'drafted', 'revised', 'complete'],
  notes: string,

  createdAt: ISO8601,
  updatedAt: ISO8601
}
```

#### Character Arc
Tracks character development throughout the story.

```javascript
{
  id: number,
  storyPlanId: number,            // FK to StoryPlan
  characterId: number,            // FK to person in genealogy
  arcType: enum['positive', 'negative', 'flat', 'corruption', 'disillusionment'],

  // Character State
  startingBelief: string,         // Lie they believe / Truth they embody
  endingBelief: string,           // Truth discovered / Lie embraced
  ghost: string,                  // Backstory wound
  want: string,                   // Conscious desire
  need: string,                   // Unconscious need

  // Development Milestones
  milestones: [{
    sceneId: number,              // FK to ScenePlan
    description: string,          // What changes
    internalShift: string,        // Belief/attitude change
    externalChange: string        // Visible behavior change
  }],

  // Arc Mapping
  linkedStoryArcId: number,       // FK to StoryArc (if character arc = subplot)

  status: enum['planned', 'in-progress', 'complete'],
  notes: string,
  createdAt: ISO8601,
  updatedAt: ISO8601
}
```

#### Plot Thread
Tracks specific narrative threads and their resolution.

```javascript
{
  id: number,
  storyPlanId: number,            // FK to StoryPlan
  name: string,                   // "The Missing Heir", "Forbidden Romance"
  description: string,
  threadType: enum['mystery', 'romance', 'conflict', 'quest', 'secret', 'prophecy'],

  // Thread State
  setupSceneId: number,           // Where thread is introduced
  payoffSceneId: number,          // Where thread resolves
  status: enum['setup', 'developing', 'climax', 'resolved', 'dropped'],

  // Connections
  involvedCharacters: number[],   // FK to people
  linkedScenes: number[],         // FK to ScenePlans
  linkedCodexEntries: number[],   // FK to codex entries

  // Foreshadowing
  plants: [{
    sceneId: number,
    description: string,
    isSubtle: boolean
  }],

  notes: string,
  createdAt: ISO8601,
  updatedAt: ISO8601
}
```

---

## 3. AI Intelligence Features

### 3.1 Planning Assistant

The AI assistant helps at every planning level:

#### 3.1.1 Premise Development
- **Input**: Rough idea, genre, themes
- **Output**: Refined premise, logline options, thematic exploration
- **Canon Integration**: Suggests relevant existing characters, locations, events

#### 3.1.2 Structure Suggestion
- **Input**: Premise, genre, target length
- **Output**: Recommended framework, beat sheet, pacing guide
- **Intelligence**: Learns from genre conventions and successful patterns

#### 3.1.3 Scene Generation
- **Input**: Beat requirements, characters involved, location
- **Output**: Scene concepts, conflict suggestions, tension opportunities
- **Canon Integration**: Respects character relationships, dignity conflicts, house rivalries

#### 3.1.4 Character Arc Builder
- **Input**: Character profile (from genealogy), story role
- **Output**: Arc suggestions, milestone ideas, internal journey mapping
- **Intelligence**: Considers character's history, relationships, dignities

### 3.2 Analysis Features

#### 3.2.1 Pacing Analysis
```javascript
// Analyzes scene distribution and tension curves
{
  tensionCurve: [{sceneId, tensionLevel}],
  pacingIssues: [
    { location: "Ch 5-7", issue: "tension_plateau", suggestion: "..." }
  ],
  actBalance: { act1: 22%, act2: 55%, act3: 23% },
  sceneTypeDistribution: { action: 40%, reaction: 35%, ... }
}
```

#### 3.2.2 Character Presence Tracking
```javascript
// Tracks where each character appears
{
  characterId: 123,
  appearances: [{ sceneId, role: 'pov'|'major'|'minor'|'mentioned' }],
  arcProgression: [{ milestone, sceneId, status }],
  absenceGaps: [{ fromScene, toScene, gapLength }]
}
```

#### 3.2.3 Timeline Validation
```javascript
// Validates story timeline against canon
{
  conflicts: [
    { type: 'character_deceased', characterId, sceneId, details: "..." },
    { type: 'dignity_not_held', dignityId, characterId, sceneId, ... }
  ],
  warnings: [
    { type: 'age_inconsistency', ... }
  ]
}
```

#### 3.2.4 Plot Thread Tracking
```javascript
// Ensures all threads are resolved
{
  unresolvedThreads: [{ threadId, lastMentionedScene, status }],
  danglingSetups: [{ plant, sceneId, noPayoff: true }],
  suggestions: ["Thread 'Missing Heir' set up in Ch 2 but not addressed since Ch 5"]
}
```

### 3.3 Smart Suggestions

#### 3.3.1 "What Could Happen Next"
Given current scene plan, suggests:
- Natural conflict escalations
- Character reaction options
- Canon-informed complications (rival house interference, dignity politics)
- Subplot weaving opportunities

#### 3.3.2 "Strengthen This Beat"
For any planned beat:
- Identifies if beat is hitting its purpose
- Suggests raising stakes
- Recommends emotional depth additions
- Connects to character arcs

#### 3.3.3 "Find the Hole"
Analyzes entire plan for:
- Missing obligatory scenes (genre-specific)
- Underdeveloped character arcs
- Pacing problems
- Unresolved setups
- Timeline inconsistencies

---

## 4. User Interface Design

### 4.1 Planner Views

#### 4.1.1 Dashboard View
The main planning hub showing:
- Story health score
- Progress indicators (planned vs. written)
- Quick access to all planning tools
- AI suggestions panel
- Recent activity

#### 4.1.2 Timeline View
Visual horizontal timeline showing:
- Story beats on main track
- Character arcs on parallel tracks
- Scene cards that can be dragged/reordered
- Tension curve overlay
- Canon events (births, deaths, dignity changes) marked

```
[Opening]---[Catalyst]---[Fun&Games]---[Midpoint]---[BadGuys]---[AllIsLost]---[DarkNight]---[Break3]---[Finale]
    ╰──── Jon's Arc ──────────────────────────────────────────────────────────────────────╯
    ╰──── Romance Subplot ────────────────────────────────────────────────────────────────╯
```

#### 4.1.3 Outline View
Hierarchical tree view:
```
▼ Act I: Setup (25%)
  ▼ Chapter 1: The Arrival
    ○ Scene 1.1: Lord Aldric receives letter [POV: Aldric]
    ○ Scene 1.2: Council meeting [POV: Aldric]
  ▼ Chapter 2: The Feast
    ...
▼ Act II: Confrontation (50%)
  ...
```

#### 4.1.4 Beat Sheet View
Framework-specific beat display:
- Visual cards for each beat
- Progress status (planned/drafted/complete)
- Word count targets vs. actuals
- Drag-and-drop scene assignment

#### 4.1.5 Character Arc View
Character-centric planning:
- Select character from genealogy
- View their journey through the story
- Map belief changes, milestones
- See all scenes where they appear
- Track internal/external arc alignment

#### 4.1.6 Subplot Manager
Track all narrative threads:
- Visual threads connecting scenes
- Setup/payoff pairing
- Resolution status
- Foreshadowing tracker

### 4.2 Planning Sidebar (Editor Integration)

New sidebar panel in WritingEditor:
- **Current Scene Context**: Shows plan for active chapter/scene
- **Beat Progress**: Which beats are in this chapter
- **Character Goals**: What characters want in this scene
- **Thread Status**: Active plot threads
- **Quick Notes**: Scene-specific notes from plan
- **AI Coach**: Context-aware suggestions

### 4.3 Interactive Planning Components

#### 4.3.1 Scene Card
Draggable planning unit:
```
┌─────────────────────────────────────────┐
│ ★ Scene 3.2: The Confrontation          │
│ ─────────────────────────────────────── │
│ POV: Lady Mira    📍 Great Hall         │
│ ─────────────────────────────────────── │
│ Goal: Expose the traitor                │
│ Conflict: Evidence is circumstantial    │
│ Disaster: Wrong person accused          │
│ ─────────────────────────────────────── │
│ Tension: ████████░░ 8/10               │
│ Arcs: Main Plot, Mira's Arc            │
│ ─────────────────────────────────────── │
│ Status: 📝 Planned   ~1,500 words      │
└─────────────────────────────────────────┘
```

#### 4.3.2 Arc Tracker
Visual arc progression:
```
Jon's Character Arc (Positive Change)
═══════════════════════════════════════════
LIE: "Power corrupts all"
    ↓ Ch 2: Sees father's cruelty
    ↓ Ch 5: First test of authority
    ↓ Ch 8: Tempted by power
    ↓ Ch 12: Chooses mercy
TRUTH: "Power reveals character"
═══════════════════════════════════════════
Progress: ████████░░ 80%
```

---

## 5. Integration Points

### 5.1 Codex Integration

The planner deeply integrates with the world codex:

| Codex Type | Integration |
|------------|-------------|
| **People** | POV selection, character arcs, scene presence |
| **Houses** | Political tensions, alliances, rivalries as conflict sources |
| **Locations** | Scene settings, travel time validation |
| **Events** | Historical context, callback opportunities |
| **Mysteria** | Magic system consistency, supernatural elements |
| **Dignities** | Authority conflicts, protocol violations, political plots |

### 5.2 Canon Validation

Real-time validation during planning:
- Character lifespan checks
- Dignity tenure validation
- Relationship consistency
- Location existence verification
- Event timeline alignment

### 5.3 Writing Link Integration

- Planned scenes link to actual chapters when written
- Progress tracking: planned → drafted → complete
- Deviation detection: plan vs. actual comparison
- Bidirectional navigation: plan ↔ prose

### 5.4 Export Integration

Export planning documents:
- Beat sheet PDFs
- Scene breakdown spreadsheets
- Character arc summaries
- Timeline visualizations
- Synopsis generation from plan

---

## 6. AI Prompt Engineering

### 6.1 Planning Prompt Templates

#### Story Premise Development
```
You are helping a writer develop their story premise for a {genre} novel.

EXISTING WORLD DATA:
{codex_summary}

WRITER'S INITIAL IDEA:
{user_input}

Please help develop this into:
1. A one-sentence logline (25-30 words)
2. A premise paragraph (100 words)
3. Core conflict identification
4. Theme suggestions (2-3 options)
5. How this connects to their existing world

Consider: {existing_characters}, {existing_locations}, {existing_events}
```

#### Beat Sheet Generation
```
You are a story structure expert helping plan a {genre} story using the {framework} method.

PREMISE: {premise}
MAIN CHARACTER: {character_data}
SUPPORTING CAST: {cast_summary}
WORLD CONTEXT: {world_summary}

Generate a complete beat sheet with:
1. Each required beat for {framework}
2. Target percentage/word count
3. Specific scene suggestions using the writer's existing characters
4. How each beat advances the character arc
5. Potential subplot integrations

Respect these canon facts: {canon_constraints}
```

#### Scene Development
```
Help develop this planned scene:

BEAT BEING FULFILLED: {beat_name}
POV CHARACTER: {character_profile}
SCENE SETTING: {location_details}
CHARACTERS PRESENT: {characters}
ACTIVE PLOT THREADS: {threads}

Current plan:
{scene_summary}

Suggest:
1. A specific goal for the POV character
2. Obstacles/conflicts (consider: {house_rivalries}, {dignity_politics})
3. A disaster or complication
4. How this advances their character arc
5. Subplot weaving opportunities
6. Sensory details appropriate to the setting
```

### 6.2 Analysis Prompts

#### Pacing Analysis
```
Analyze this story plan for pacing issues:

SCENE SEQUENCE:
{scenes_with_tension_levels}

ACT BREAKDOWN:
{act_percentages}

Identify:
1. Tension plateaus (>3 scenes same level)
2. Missing escalation before climax
3. Rushed resolutions
4. Overlong act sections
5. Scene type imbalance

Provide specific suggestions for each issue.
```

#### Plot Hole Detection
```
Review this story plan for plot holes and inconsistencies:

PLOT THREADS:
{threads_with_scenes}

CHARACTER KNOWLEDGE:
{what_each_character_knows_when}

TIMELINE:
{scene_timeline}

CANON CONSTRAINTS:
{character_lifespans}
{dignity_tenures}
{historical_events}

Identify:
1. Unresolved setups
2. Characters knowing things they shouldn't
3. Timeline impossibilities
4. Canon violations
5. Missing logical connections
```

---

## 7. Implementation Phases

### Phase 1: Foundation (Core Data & Basic UI)

**Data Models**
- [ ] Create `storyPlans` table
- [ ] Create `storyArcs` table
- [ ] Create `storyBeats` table
- [ ] Create `scenePlans` table
- [ ] Create planning service layer
- [ ] Integrate with existing cloud sync

**Basic UI**
- [ ] Planner Dashboard component
- [ ] Basic Outline View
- [ ] Scene Card component
- [ ] Planning Sidebar in WritingEditor
- [ ] Navigation from Writing to Plan

**Framework Support**
- [ ] Three-Act Structure template
- [ ] Save the Cat beat sheet template
- [ ] Custom/freeform option

### Phase 2: Visual Planning Tools

**Timeline View**
- [ ] Horizontal timeline component
- [ ] Draggable scene cards
- [ ] Beat markers
- [ ] Tension curve visualization

**Beat Sheet View**
- [ ] Framework-specific beat cards
- [ ] Scene-to-beat linking
- [ ] Progress tracking
- [ ] Word count targets

**Character Integration**
- [ ] Link characters from genealogy
- [ ] POV character assignment
- [ ] Characters present tracking

### Phase 3: Character Arcs & Subplots

**Character Arc System**
- [ ] Create `characterArcs` table
- [ ] Arc type templates (positive, negative, flat)
- [ ] Milestone tracking
- [ ] Arc visualization component

**Plot Thread System**
- [ ] Create `plotThreads` table
- [ ] Setup/payoff tracking
- [ ] Thread visualization
- [ ] Foreshadowing manager

**Advanced Connections**
- [ ] Scene-to-arc linking
- [ ] Multi-arc scene support
- [ ] Thread weaving suggestions

### Phase 4: AI Intelligence

**Planning Assistant**
- [ ] Premise development AI
- [ ] Beat suggestion AI
- [ ] Scene development AI
- [ ] Character arc AI

**Analysis Features**
- [ ] Pacing analysis
- [ ] Plot hole detection
- [ ] Character presence tracking
- [ ] Timeline validation

**Smart Suggestions**
- [ ] "What next" suggestions
- [ ] Beat strengthening
- [ ] Gap detection

### Phase 5: Deep Integration

**Canon Integration**
- [ ] Codex entity linking in plans
- [ ] Dignity/political conflict suggestions
- [ ] Location-aware planning
- [ ] Event timeline alignment

**Writing Integration**
- [ ] Plan-to-prose linking
- [ ] Deviation detection
- [ ] Progress synchronization
- [ ] Context panel in editor

**Export & Sharing**
- [ ] Beat sheet PDF export
- [ ] Timeline image export
- [ ] Synopsis generation
- [ ] Outline export

### Phase 6: Advanced Features

**Series Planning**
- [ ] Multi-book story arcs
- [ ] Series-level character development
- [ ] Cross-book thread tracking

**Collaboration Features**
- [ ] Plan sharing
- [ ] Comment/annotation system
- [ ] Version history

**Advanced AI**
- [ ] Learning from user's style
- [ ] Genre-specific conventions
- [ ] Comparative analysis

---

## 8. Technical Considerations

### 8.1 Performance

- **Lazy Loading**: Load scene details on demand
- **Virtual Scrolling**: For long scene lists
- **Debounced Updates**: Prevent database thrashing during drag operations
- **Indexed Queries**: Proper indexing on foreign keys

### 8.2 State Management

- Planning state separate from writing state
- Optimistic updates for drag-and-drop
- Conflict resolution for concurrent edits
- Undo/redo support for plan changes

### 8.3 AI Token Optimization

- Context windowing for large plans
- Summarization for distant scenes
- Caching of AI analysis results
- Incremental re-analysis

### 8.4 Data Migration

- Plans can exist without written content
- Graceful handling of deleted characters/locations
- Orphan cleanup for deleted writings

---

## 9. Success Metrics

### User Experience Metrics
- Time to create initial plan
- Plan completion rate
- Plan-to-prose conversion rate
- User satisfaction with AI suggestions

### Quality Metrics
- Accuracy of canon validation
- Relevance of AI suggestions
- Pacing analysis accuracy
- Plot hole detection precision

### Engagement Metrics
- Planner feature adoption rate
- Average planning depth (scenes per chapter)
- AI feature usage frequency
- Export feature usage

---

## 10. Research Sources

This design incorporates principles from:

- [Save the Cat Beat Sheet](https://kindlepreneur.com/save-the-cat-beat-sheet/) - 15-beat structure
- [Snowflake Method](https://kindlepreneur.com/snowflake-method/) - Expansion-based planning
- [Plottr](https://plottr.com/) - Visual timeline planning
- [Campfire Writing](https://www.campfirewriting.com/character-builder) - Character arc tracking
- [Story Grid](https://www.setyourmuseonfire.com/blog/save-the-cat-and-story-grid-structure-in-beats) - Genre conventions
- [Three-Act Structure](https://www.studiobinder.com/blog/three-act-structure/) - Foundational framework

---

## Appendix A: Beat Sheet Templates

### Save the Cat (15 Beats)

| Beat | % | Description |
|------|---|-------------|
| Opening Image | 0-1% | Visual snapshot of starting state |
| Theme Stated | 5% | Theme hinted (often by another character) |
| Setup | 1-10% | Introduce world, characters, stakes |
| Catalyst | 10% | Inciting incident |
| Debate | 10-20% | Hero reluctant, weighing options |
| Break into Two | 20% | Hero commits to journey |
| B Story | 22% | Subplot begins (often love interest) |
| Fun and Games | 20-50% | Promise of premise |
| Midpoint | 50% | False victory or false defeat |
| Bad Guys Close In | 50-75% | Opposition intensifies |
| All Is Lost | 75% | Lowest point |
| Dark Night of Soul | 75-80% | Despair, reflection |
| Break into Three | 80% | Epiphany, new plan |
| Finale | 80-99% | Final battle, resolution |
| Final Image | 99-100% | Mirror of opening, showing change |

### Hero's Journey (12 Stages)

| Stage | Act | Description |
|-------|-----|-------------|
| Ordinary World | I | Hero's normal life |
| Call to Adventure | I | Challenge presented |
| Refusal of the Call | I | Hero hesitates |
| Meeting the Mentor | I | Guidance received |
| Crossing the Threshold | I→II | Enters special world |
| Tests, Allies, Enemies | II | Learning the rules |
| Approach to Inmost Cave | II | Preparation for ordeal |
| Ordeal | II | Major crisis |
| Reward | II | Prize seized |
| The Road Back | II→III | Chase, pursuit |
| Resurrection | III | Final test |
| Return with Elixir | III | Hero transformed |

---

## Appendix B: Character Arc Types

### Positive Change Arc
Character starts believing a **lie**, faces challenges, and ultimately embraces the **truth**.
- Example: Scrooge learns generosity

### Negative Change Arc
Character starts with potential for truth but succumbs to the **lie**.
- Example: Walter White's descent

### Flat Arc
Character already knows the **truth** and uses it to change the world around them.
- Example: James Bond in most films

### Corruption Arc
Character knows the truth but is corrupted into believing the lie.
- Example: Anakin Skywalker

### Disillusionment Arc
Character believes a lie, learns the truth, but the truth is tragic.
- Example: Tragic heroes

---

*Document Version: 1.0*
*Created: January 2026*
*Status: Planning*
