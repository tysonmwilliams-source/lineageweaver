/**
 * Quick test script for the Context Library system
 * Run with: node test-context-system.mjs
 *
 * This uses the browser's IndexedDB, so it needs to be run
 * in the browser console instead. Copy-paste the test functions.
 */

console.log(`
=== Context Library Test Instructions ===

Since the context system uses IndexedDB (browser storage),
you need to test it in the browser console.

1. Open the app at http://localhost:5178/
2. Open browser DevTools (F12 or Cmd+Shift+I)
3. Go to the Console tab
4. Paste and run the following test code:

------- COPY FROM HERE -------

// Import the context service functions
const contextService = await import('/src/services/contextService.js');

// Get current dataset ID from localStorage or use default
const datasetId = localStorage.getItem('currentDatasetId') || 'local';
console.log('Testing with dataset:', datasetId);

// Test 1: Discover contexts
console.log('\\n=== Test 1: Discover Contexts ===');
const discovery = await contextService.discoverContexts(datasetId);
console.log('Total Houses:', discovery.totalHouses);
console.log('Total People:', discovery.totalPeople);
console.log('Total Codex Entries:', discovery.totalCodex);
console.log('Total Relationships:', discovery.totalRelationships);
console.log('\\nMajor Houses (qualify for dedicated context):');
discovery.majorHouses.forEach(h => {
  console.log(\`  - \${h.houseName}: \${h.peopleCount} people, \${h.codexCount} codex, threshold: \${h.threshold}\`);
});
console.log('\\nMinor Houses:');
discovery.minorHouses.slice(0, 5).forEach(h => {
  console.log(\`  - \${h.houseName}: \${h.peopleCount} people, \${h.codexCount} codex\`);
});
if (discovery.minorHouses.length > 5) {
  console.log(\`  ... and \${discovery.minorHouses.length - 5} more\`);
}

// Test 2: Generate all contexts
console.log('\\n=== Test 2: Generate All Contexts ===');
const result = await contextService.generateAllContexts(datasetId);
console.log('Generation result:', result);

// Test 3: Check what was generated
console.log('\\n=== Test 3: Check Registry ===');
const registry = await contextService.getContextRegistry(datasetId);
console.log('Registered contexts:', registry.length);
registry.forEach(ctx => {
  console.log(\`  - \${ctx.contextId} (\${ctx.contextType}): \${ctx.status}\`);
});

// Test 4: Get system status
console.log('\\n=== Test 4: System Status ===');
const status = await contextService.getContextSystemStatus(datasetId);
console.log('System Status:', status);

console.log('\\n=== Tests Complete ===');

------- COPY TO HERE -------
`);
