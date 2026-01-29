// Quick audit script - run in browser console on the Lineageweaver app
// Copy and paste this into the browser console (Cmd+Option+J)

(async function runAudit() {
  // Access the database
  const dbModule = await import('/src/services/database.js');
  const db = dbModule.db;

  // Get all data
  const people = await db.people.toArray();
  const relationships = await db.relationships.toArray();
  const houses = await db.houses.toArray();

  console.log('📊 DATA COUNTS:');
  console.log('   People:', people.length);
  console.log('   Relationships:', relationships.length);
  console.log('   Houses:', houses.length);

  const issues = [];
  const peopleById = new Map(people.map(p => [p.id, p]));
  const houseIds = new Set(houses.map(h => h.id));

  // 1. Orphaned relationships (reference non-existent people)
  console.log('\n🔍 Checking for orphaned relationships...');
  for (const rel of relationships) {
    if (!peopleById.has(rel.person1Id)) {
      issues.push({
        type: 'ORPHAN_REL',
        severity: 'error',
        message: 'Relationship ' + rel.id + ' references missing person1Id: ' + rel.person1Id,
        data: rel
      });
    }
    if (!peopleById.has(rel.person2Id)) {
      issues.push({
        type: 'ORPHAN_REL',
        severity: 'error',
        message: 'Relationship ' + rel.id + ' references missing person2Id: ' + rel.person2Id,
        data: rel
      });
    }
  }

  // 2. People with missing houses
  console.log('🔍 Checking for people with invalid houses...');
  for (const person of people) {
    if (person.houseId && !houseIds.has(person.houseId)) {
      issues.push({
        type: 'INVALID_HOUSE',
        severity: 'error',
        message: person.firstName + ' ' + person.lastName + ' (' + person.id + ') has invalid houseId: ' + person.houseId,
        data: person
      });
    }
  }

  // 3. Duplicate relationships
  console.log('🔍 Checking for duplicate relationships...');
  const relKeys = new Map();
  for (const rel of relationships) {
    const minId = rel.person1Id < rel.person2Id ? rel.person1Id : rel.person2Id;
    const maxId = rel.person1Id > rel.person2Id ? rel.person1Id : rel.person2Id;
    const key = rel.relationshipType + '-' + minId + '-' + maxId;
    if (relKeys.has(key)) {
      issues.push({
        type: 'DUPLICATE_REL',
        severity: 'warning',
        message: 'Duplicate ' + rel.relationshipType + ' relationship between ' + rel.person1Id + ' and ' + rel.person2Id,
        data: { rel1: relKeys.get(key), rel2: rel }
      });
    } else {
      relKeys.set(key, rel);
    }
  }

  // 4. Self-referencing relationships
  console.log('🔍 Checking for self-references...');
  for (const rel of relationships) {
    if (rel.person1Id === rel.person2Id) {
      issues.push({
        type: 'SELF_REF',
        severity: 'error',
        message: 'Relationship ' + rel.id + ' is self-referencing (person ' + rel.person1Id + ')',
        data: rel
      });
    }
  }

  // 5. Parent-child inconsistencies
  console.log('🔍 Checking parent-child relationships...');
  const parentRels = relationships.filter(r => r.relationshipType === 'parent' || r.relationshipType === 'adopted-parent');

  // Build parent map
  const parentMap = new Map(); // childId -> [parentIds]
  for (const rel of parentRels) {
    const parents = parentMap.get(rel.person2Id) || [];
    parents.push(rel.person1Id);
    parentMap.set(rel.person2Id, parents);
  }

  // Check for children with more than 2 parents (unusual)
  for (const [childId, parentIds] of parentMap) {
    if (parentIds.length > 2) {
      const child = peopleById.get(childId);
      const parentNames = parentIds.map(pid => {
        const p = peopleById.get(pid);
        return p ? (p.firstName + ' ' + p.lastName) : ('Unknown(' + pid + ')');
      });
      issues.push({
        type: 'TOO_MANY_PARENTS',
        severity: 'warning',
        message: (child ? child.firstName + ' ' + child.lastName : 'Unknown') + ' (' + childId + ') has ' + parentIds.length + ' parents: ' + parentNames.join(', '),
        data: { childId, parentIds }
      });
    }
  }

  // 6. Circular ancestry detection
  console.log('🔍 Checking for circular ancestry...');
  function getAncestors(personId, visited) {
    visited = visited || new Set();
    if (visited.has(personId)) return { circular: true, path: Array.from(visited) };
    visited.add(personId);

    const parents = parentMap.get(personId) || [];
    for (const parentId of parents) {
      const result = getAncestors(parentId, new Set(visited));
      if (result.circular) return result;
    }
    return { circular: false };
  }

  const checkedForCircular = new Set();
  for (const person of people) {
    if (checkedForCircular.has(person.id)) continue;
    checkedForCircular.add(person.id);

    const result = getAncestors(person.id);
    if (result.circular) {
      issues.push({
        type: 'CIRCULAR_ANCESTRY',
        severity: 'error',
        message: 'Circular ancestry detected involving ' + person.firstName + ' ' + person.lastName,
        data: { personId: person.id, path: result.path }
      });
    }
  }

  // 7. Spouse relationships check
  console.log('🔍 Checking spouse relationships...');
  const spouseRels = relationships.filter(r => r.relationshipType === 'spouse');
  for (const rel of spouseRels) {
    const p1 = peopleById.get(rel.person1Id);
    const p2 = peopleById.get(rel.person2Id);

    // Check if spouses are also in a parent-child relationship (error!)
    const p1IsParentOfP2 = parentRels.some(pr => pr.person1Id === rel.person1Id && pr.person2Id === rel.person2Id);
    const p2IsParentOfP1 = parentRels.some(pr => pr.person1Id === rel.person2Id && pr.person2Id === rel.person1Id);

    if (p1IsParentOfP2 || p2IsParentOfP1) {
      issues.push({
        type: 'SPOUSE_PARENT_CONFLICT',
        severity: 'error',
        message: (p1 ? p1.firstName + ' ' + p1.lastName : 'Unknown') + ' and ' + (p2 ? p2.firstName + ' ' + p2.lastName : 'Unknown') + ' are both spouse AND parent-child',
        data: rel
      });
    }
  }

  // 8. Check for relationships with wrong type stored
  console.log('🔍 Checking relationship types...');
  const validTypes = ['spouse', 'parent', 'adopted-parent', 'sibling'];
  for (const rel of relationships) {
    if (!validTypes.includes(rel.relationshipType)) {
      issues.push({
        type: 'INVALID_REL_TYPE',
        severity: 'warning',
        message: 'Relationship ' + rel.id + ' has unusual type: ' + rel.relationshipType,
        data: rel
      });
    }
  }

  // Print results
  console.log('\n' + '='.repeat(60));
  console.log('📋 AUDIT RESULTS');
  console.log('='.repeat(60));

  if (issues.length === 0) {
    console.log('✅ No issues found! Data looks healthy.');
  } else {
    const errors = issues.filter(i => i.severity === 'error');
    const warnings = issues.filter(i => i.severity === 'warning');

    if (errors.length > 0) {
      console.log('\n❌ ERRORS (' + errors.length + '):');
      errors.forEach(e => console.log('   - ' + e.message));
    }

    if (warnings.length > 0) {
      console.log('\n⚠️ WARNINGS (' + warnings.length + '):');
      warnings.forEach(w => console.log('   - ' + w.message));
    }
  }

  console.log('\n📊 Summary:');
  console.log('   Total issues:', issues.length);
  console.log('   Errors:', issues.filter(i => i.severity === 'error').length);
  console.log('   Warnings:', issues.filter(i => i.severity === 'warning').length);

  // Return issues for further inspection
  window.auditResults = issues;
  console.log('\n💡 Results stored in window.auditResults for inspection');

  return issues;
})();
