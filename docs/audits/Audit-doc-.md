# Comprehensive Codebase Audit Best Practices for Worldbuilding Genealogy Applications

Auditing a React/D3.js/IndexedDB/Firebase application requires a multi-layered approach spanning frontend architecture, data integrity, visualization performance, and professional audit methodology. This guide synthesizes industry best practices across all relevant domains to create **actionable audit frameworks** for a genealogy worldbuilding application.

## The core audit framework spans six interconnected domains

A genealogy application presents unique audit challenges: **tree data structures** demanding referential integrity, **local-first sync** requiring conflict resolution verification, **D3.js visualizations** with memory leak potential, and **React state** that must stay consistent across all views. The audit must verify these components work as a unified system, not just individually.

**Critical path priorities** for this application type:
- Parent-child relationship integrity (broken links destroy the user's genealogy)
- Sync reliability (data loss on offline-to-online transitions)
- Tree rendering performance (genealogies can grow to thousands of nodes)
- Bidirectional navigation consistency (viewing a person from family tree vs. detail view)

---

## React/JavaScript audit methodology

### Static analysis configuration

The foundation of React auditing is proper ESLint configuration with React-specific plugins. Essential plugins include **eslint-plugin-react** (100+ rules), **eslint-plugin-react-hooks** (critical for hooks compliance), and **eslint-plugin-jsx-a11y** (accessibility enforcement).

**Critical rules to enable:**
| Rule | Purpose | Severity |
|------|---------|----------|
| `react-hooks/rules-of-hooks` | Prevents hooks called in invalid locations | Critical |
| `react-hooks/exhaustive-deps` | Validates dependency arrays, prevents stale closures | Critical |
| `react/no-array-index-key` | Flags index as key anti-pattern | High |
| `react/jsx-no-bind` | Detects inline function creation causing re-renders | High |

For deeper analysis, **SonarQube** provides 48 React-specific rules including deprecated method detection, props mutation, and state mutation anti-patterns. Complexity metrics should target **cyclomatic complexity <10** per function and **cognitive complexity <15**.

### Component architecture review

Audit component hierarchy for these red flags: **god components** exceeding 200-300 lines, components with **5+ useState hooks**, props passed through **3+ levels unchanged** (props drilling), and components receiving **10+ props**. File structure should follow feature-based organization with maximum **4 levels of nesting**.

### Context API specific audit points

Context API auditing focuses on detecting the **mega-context anti-pattern** where everything lives in one context causing unnecessary re-renders. Look for:

- Contexts providing both state and dispatch (should be split into separate contexts)
- Context values not memoized (creating new object references each render)
- High-frequency data (search queries, form inputs) stored in context instead of local state
- Contexts placed too high in the component tree

**Detection technique:** Use React DevTools Profiler with "Record why each component rendered" enabled to trace context-related re-renders.

### Performance audit techniques

Use the **React DevTools Profiler** to identify unnecessary re-renders. Key metrics: **actualDuration** (time spent rendering) versus **baseDuration** (worst-case without memoization)—if these are roughly equal, memoization isn't helping.

**Bundle analysis** with webpack-bundle-analyzer should identify dependencies over **100KB**, duplicate packages, and code-splitting opportunities. Route-level components should use `React.lazy()` with Suspense boundaries.

### Anti-patterns checklist

| Anti-pattern | Detection Method |
|--------------|------------------|
| Hook dependency array issues | ESLint `exhaustive-deps` rule, search for disable comments |
| Effect cleanup problems | Console warnings about unmounted component updates |
| Prop mutation | SonarQube rule, code review for direct assignment |
| Index as key | ESLint `react/no-array-index-key` |
| Inline function/object creation | ESLint `react/jsx-no-bind`, Profiler "props changed" reason |
| Nested component definitions | Manual code review (components recreated each render) |
| Direct state mutation | Review for `array.push()` on state values |

---

## Data layer audit for IndexedDB, Firebase, and Dexie.js

### Schema integrity verification

**IndexedDB/Dexie.js audit points:**
- Version numbers increment correctly with each schema change
- `onupgradeneeded` handles all version transitions
- `onblocked` handler implemented for multi-tab scenarios
- Primary keys use appropriate Dexie prefixes (`++` for auto-increment, `&` for unique)
- Historical versions with upgraders are preserved (never delete old version definitions)

**Red flags:** Version numbers jumping (skipping versions), schema changes without migration logic, missing `onblocked` handler (causes silent failures in multi-tab), and `Version.upgrade()` used on cloud-synced tables (violates Dexie Cloud rules).

### Sync architecture audit

For local-first with cloud backup architectures, verify:

1. **Local database is primary source of truth** (not server)
2. **Writes go to local first** with background sync
3. **Conflict resolution strategy documented** and appropriate per field type:
   - Simple values: Last Write Wins with serverTimestamp()
   - Counters: Firebase `increment()` not LWW
   - Arrays: `arrayUnion()` for set-like operations
4. **Pending operations queue** has no stale operations (>24 hours old) or excessive retries (>5)
5. **Exponential backoff** implemented for sync failures
6. **Dead letter queue** exists for permanently failed operations

**Audit query for sync health:**
```javascript
async function auditSyncQueue(syncStore) {
  const pending = await syncStore.where('status').equals('pending').toArray();
  const staleOps = pending.filter(op => Date.now() - op.timestamp > 86400000);
  const excessRetries = pending.filter(op => op.retryCount > 5);
  return { totalPending: pending.length, staleOps, excessRetries };
}
```

### Data integrity checks for genealogy data

**Orphaned data detection:**
```javascript
async function detectOrphanedRecords(db) {
  const persons = await db.persons.toArray();
  const personIds = new Set(persons.map(p => p.id));
  const orphans = [];
  
  for (const person of persons) {
    if (person.fatherId && !personIds.has(person.fatherId))
      orphans.push({ id: person.id, type: 'missing_father', ref: person.fatherId });
    if (person.motherId && !personIds.has(person.motherId))
      orphans.push({ id: person.id, type: 'missing_mother', ref: person.motherId });
  }
  return orphans;
}
```

**Circular reference detection** (critical for genealogy):
```javascript
function detectCircularReferences(persons) {
  const personMap = new Map(persons.map(p => [p.id, p]));
  
  function findAncestors(personId, visited = new Set(), path = []) {
    if (visited.has(personId)) {
      const cycleStart = path.indexOf(personId);
      return path.slice(cycleStart).concat(personId); // Found cycle
    }
    const person = personMap.get(personId);
    if (!person) return null;
    
    visited.add(personId);
    path.push(personId);
    
    for (const parentId of [person.fatherId, person.motherId].filter(Boolean)) {
      const cycle = findAncestors(parentId, new Set(visited), [...path]);
      if (cycle) return cycle;
    }
    return null;
  }
  
  return persons.map(p => findAncestors(p.id)).filter(Boolean);
}
```

**Bidirectional relationship validation:**
```javascript
async function validateBidirectionalLinks(db) {
  const issues = [];
  const persons = await db.persons.toArray();
  
  for (const person of persons) {
    for (const childId of (person.childrenIds || [])) {
      const child = await db.persons.get(childId);
      if (child) {
        const isLinked = child.fatherId === person.id || child.motherId === person.id;
        if (!isLinked) {
          issues.push({
            type: 'broken_bidirectional_link',
            parent: person.id,
            child: childId
          });
        }
      }
    }
  }
  return issues;
}
```

### Migration script audit

Verify migrations are **idempotent** (can run multiple times safely) by checking for guard clauses. Pattern:
```javascript
upgrade(tx => tx.table.toCollection().modify(record => {
  if (!record._migrated_v3) {  // Guard clause
    record.newField = transform(record.oldField);
    record._migrated_v3 = true;
  }
}))
```

**Red flags:** Migrations without guard clauses, no rollback procedure documented, missing transaction wrapping, DELETE/DROP without existence checks.

---

## D3.js visualization audit for tree structures

### Performance patterns for genealogy trees

**Element thresholds:** SVG handles **<1,000 elements** well for animation, **<3,000** for static renders. Beyond that, consider Canvas or virtualization. For large genealogies, implement **collapse-by-default** for subtrees and **viewport culling** (only render visible nodes).

**Key function requirement:** All `.data()` calls must include a key function—`d => d.id`—for proper object constancy. Missing key functions cause incorrect DOM reconciliation and memory leaks.

**Modern D3 v7 pattern (selection.join):**
```javascript
svg.selectAll("g.node")
  .data(nodes, d => d.id)  // KEY FUNCTION CRITICAL
  .join(
    enter => enter.append("g").attr("class", "node"),
    update => update,
    exit => exit.on("click", null).remove()  // Clear handlers before remove
  )
```

### Memory leak detection

**Common leak sources in D3:**
1. Event listeners not removed on component unmount
2. Closures retaining data references (especially with key functions)
3. Exit selection not calling `.remove()`
4. `d3.timer()` or `d3.interval()` not stopped
5. Transitions not interrupted before starting new ones

**Cleanup pattern for React integration:**
```javascript
useEffect(() => {
  const selection = d3.select(ref.current);
  selection.on("click", handleClick);
  
  return () => {
    selection.on("click", null);  // Remove listeners
    selection.selectAll("*").interrupt();  // Cancel transitions
  };
}, []);
```

**Chrome DevTools audit process:**
1. Take heap snapshot (baseline)
2. Perform action (expand/collapse tree nodes)
3. Force garbage collection (click trash icon)
4. Take second snapshot
5. Filter by "Detached" elements—any `Detached SVGElement` indicates leak
6. Check `__on` property for retained event handlers

### Tree-specific optimizations

**Collapsible tree pattern:**
```javascript
function toggle(event, d) {
  if (d.children) {
    d._children = d.children;  // Store for later
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);  // Re-render from this node only
}
```

**Zoom/pan optimization:** Use `requestAnimationFrame` throttling since zoom events fire 3-120x more frequently than screen refresh:
```javascript
let ticking = false;
function onZoom(event) {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateVisualization(event.transform);
      ticking = false;
    });
    ticking = true;
  }
}
```

### Accessibility in D3 visualizations

Add ARIA attributes for screen readers:
```javascript
svg.attr("role", "img")
   .attr("aria-label", "Family tree showing 5 generations");
   
nodes.attr("tabindex", 0)
     .attr("aria-label", d => `${d.name}, ${d.children?.length || 0} children`);
```

---

## System integration audit

### Bidirectional navigation verification

For a genealogy app where users navigate between tree view and detail view, verify:

1. **State consistency:** Clicking a person in tree view → detail view → back to tree view returns to same position
2. **Data synchronization:** Edits in detail view immediately reflect in tree view
3. **URL/route integrity:** Deep links to specific persons work correctly
4. **Selection state:** Selected person highlighted consistently across views

### API contract verification

Audit Firebase/backend integration:
- [ ] Authentication at every endpoint
- [ ] Authorization scoped to user's data (users can't access others' genealogies)
- [ ] Input validation for all writes
- [ ] Firebase security rules tested with emulator
- [ ] No rules with `allow read, write: if true;`
- [ ] Rate limiting on write operations

### Integration point mapping

Document all data flows:
1. **IndexedDB ↔ React state:** How local data syncs to component state
2. **React state ↔ D3:** How data changes trigger visualization updates
3. **IndexedDB ↔ Firebase:** Sync queue, conflict resolution, error handling
4. **Route changes ↔ data loading:** Lazy loading, caching strategy

---

## General code audit checklist

### Security audit (OWASP Top 10:2025)

| Risk | Audit Points | Severity |
|------|--------------|----------|
| **Broken Access Control** | Firebase security rules, IDOR vulnerabilities, CORS configuration | 🔴 Critical |
| **Security Misconfiguration** | Debug mode disabled, error handling sanitized, HTTP headers (HSTS, CSP) | 🔴 Critical |
| **Supply Chain Failures** | `npm audit`, Snyk scan, outdated packages, lockfile integrity | 🔴 Critical |
| **Injection/XSS** | Check `dangerouslySetInnerHTML`, DOM-based XSS, input sanitization | 🟠 High |
| **Sensitive Data Exposure** | No secrets in client code, API keys not in bundles, source maps disabled | 🟠 High |

### Technical debt identification

**Automated detection:**
- Run `grep -rn "TODO\|FIXME\|HACK\|XXX" src/` to inventory debt markers
- Use `ts-prune` for unused TypeScript exports
- Run `knip` for comprehensive unused code detection
- Analyze complexity with SonarQube

**Metrics to track:**
- Files with cyclomatic complexity >10
- Functions exceeding 50 lines
- Components with >5 useState hooks
- Files with 300+ lines

### Accessibility (WCAG 2.1 AA)

**Automated testing:**
```javascript
// jest-axe for component testing
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

test('should have no accessibility violations', async () => {
  const { container } = render(<FamilyTree />);
  expect(await axe(container)).toHaveNoViolations();
});
```

**Manual verification:**
- [ ] Keyboard navigation through tree (Tab, Arrow keys, Enter)
- [ ] Focus indicators visible on all interactive elements
- [ ] Color contrast ≥4.5:1 for text, ≥3:1 for UI components
- [ ] Screen reader announces person names and relationships
- [ ] Touch targets ≥44x44 CSS pixels

### CSS architecture audit

Check for:
- [ ] CSS custom properties organized (primitives → semantic → component tokens)
- [ ] No `!important` except justified cases
- [ ] Specificity graph relatively flat
- [ ] Unused CSS <20% of total (use Chrome Coverage or PurgeCSS)
- [ ] Theme switching works without page reload
- [ ] `prefers-color-scheme` respected

---

## Professional audit report structure

### Severity classification framework

| Severity | Definition | Timeline |
|----------|------------|----------|
| **Critical** | Immediate exploitation risk, data loss, system compromise | Fix within 24-48 hours |
| **High** | Serious vulnerability requiring specific conditions | Fix within 1-2 weeks |
| **Medium** | Moderate risk, harder to exploit | Fix within 1 sprint |
| **Low** | Minor issues, negligible risk | Schedule for future |
| **Informational** | Best practice observations, enhancements | As capacity allows |

### Report structure template

```
1. EXECUTIVE SUMMARY (1 page max)
   - Finding counts by severity
   - Overall risk assessment
   - Top 3-5 priority recommendations

2. FINDINGS DASHBOARD
   - Visual severity distribution
   - Findings by category
   - Trend vs. prior audits

3. DETAILED FINDINGS (for each issue)
   - ID, Title, Severity, Location
   - Description with evidence (code snippets)
   - Impact (technical and business)
   - Recommendation with before/after code
   - References (CWE, OWASP)

4. REMEDIATION PLAN
   - Phase 1: Critical (0-2 weeks)
   - Phase 2: High (2-6 weeks)
   - Phase 3: Medium (1-3 months)
   - Resource estimates per item
```

### Remediation prioritization

Use **cost-impact matrix**:
- **High Impact, Low Cost:** Quick wins—prioritize first
- **High Impact, High Cost:** Major projects—plan carefully
- **Low Impact, Low Cost:** Fill-ins—do when convenient
- **Low Impact, High Cost:** Reconsider—may not be worth doing

---

## Claude Code audit prompt template

This template can be adapted for the specific genealogy application:

```markdown
# COMPREHENSIVE CODEBASE AUDIT

## Application Context
- **Name:** [Worldbuilding Genealogy Application]
- **Stack:** React, D3.js, IndexedDB (Dexie.js), Firebase
- **Purpose:** Manage family trees for fictional worldbuilding
- **Architecture:** Local-first with cloud sync

## Audit Scope
Analyze these areas in priority order:

### 1. Data Integrity (HIGHEST PRIORITY)
- Detect orphaned person records (missing parent/child references)
- Verify bidirectional relationship consistency
- Check for circular references in ancestry chains
- Validate required fields populated on all records
- Audit sync queue for stale/failed operations

### 2. React Architecture
- Identify god components (>200 lines, >5 useState hooks)
- Detect Context API misuse (mega-contexts, missing memoization)
- Find props drilling (>2 levels deep)
- Check hook dependency arrays for completeness
- Identify unnecessary re-renders

### 3. D3.js Visualization
- Verify key functions on all .data() calls
- Check for memory leaks (missing event cleanup, retained selections)
- Audit transition/timer cleanup
- Verify collapsible tree state management
- Check accessibility (ARIA, keyboard navigation)

### 4. Sync Layer
- Verify local-first pattern (reads from IndexedDB first)
- Check conflict resolution strategy per field type
- Audit error handling and retry logic
- Verify pending operations queue health
- Check Firebase security rules

### 5. Security
- XSS vectors (dangerouslySetInnerHTML, DOM manipulation)
- Firebase security rules (no open access)
- Sensitive data exposure (API keys, source maps)
- Dependency vulnerabilities (npm audit)

### 6. Code Quality
- Technical debt markers (TODO, FIXME, HACK)
- Dead code and unused exports
- Complexity hotspots (cyclomatic >10)
- Test coverage gaps in critical paths
- Documentation completeness

## Output Format
Return findings as JSON:
{
  "audit_summary": {
    "overall_risk": "critical|high|medium|low",
    "finding_counts": { "critical": N, "high": N, ... }
  },
  "findings": [{
    "id": "AUDIT-001",
    "severity": "critical|high|medium|low|info",
    "category": "data_integrity|react|d3|sync|security|quality",
    "title": "Brief description",
    "location": "file:line",
    "description": "Detailed explanation",
    "impact": "What could go wrong",
    "recommendation": "How to fix",
    "code_before": "...",
    "code_after": "..."
  }],
  "remediation_phases": [
    { "phase": 1, "items": [...], "timeline": "0-2 weeks" },
    ...
  ]
}

## Important Notes
- Flag only real issues, not style preferences
- For data integrity issues, include specific IDs of affected records
- Rate confidence level for each finding
- Prioritize issues that could cause data loss or corruption
```

---

## Audit tool summary

| Category | Recommended Tools |
|----------|-------------------|
| **React Static Analysis** | ESLint + plugins, SonarQube, TypeScript strict mode |
| **React Performance** | React DevTools Profiler, why-did-you-render, webpack-bundle-analyzer |
| **Data Integrity** | Custom audit scripts (see code examples above), Firebase Emulator |
| **D3 Memory** | Chrome DevTools Memory tab (Heap snapshots, Detached elements) |
| **Security** | npm audit, Snyk, OWASP ZAP, CSP Evaluator |
| **Accessibility** | axe DevTools, Lighthouse, jest-axe, cypress-axe |
| **CSS** | CSS Stats, PurgeCSS, Stylelint |
| **Technical Debt** | knip, ts-prune, grep for TODOs, Madge (dependencies) |

This comprehensive framework provides **actionable audit methodologies** across all layers of a React/D3.js/IndexedDB/Firebase genealogy application. The audit prompt template can be customized with specific file paths and domain constraints for the actual codebase review.