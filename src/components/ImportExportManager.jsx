/**
 * ═══════════════════════════════════════════════════════════════════════════
 * IMPORT/EXPORT MANAGER COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Comprehensive data backup and restore system with:
 * - JSON export with metadata
 * - JSON import with validation
 * - Conflict detection and resolution
 * - Progress tracking
 * - Version compatibility checking
 * 
 * INTEGRATION:
 * Add to ManageData.jsx as a new tab: "Import/Export"
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState } from 'react';
import { 
  getAllPeople, 
  getAllHouses, 
  getAllRelationships,
  db 
} from '../services/database';
import { useGenealogy } from '../contexts/GenealogyContext';
import { 
  exportData, 
  importData, 
  CURRENT_VERSION 
} from '../services/database/MigrationHooks';
import { getAllEntries } from '../services/codexService';
import CodexMigrationTool from './CodexMigrationTool';

function ImportExportManager() {
  // Access context for data refresh after import
  const { refreshData } = useGenealogy();

  // Export state
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportError, setExportError] = useState(null);

  // Import state
  const [importing, setImporting] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState(null);
  const [importConflicts, setImportConflicts] = useState(null);
  const [importErrors, setImportErrors] = useState(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [conflictResolution, setConflictResolution] = useState('skip'); // 'skip', 'overwrite', 'keep-both'

  // Progress tracking
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');

  // ═══════════════════════════════════════════════════════════════════════
  // EXPORT FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Export all data to JSON file
   */
  const handleExport = async () => {
    try {
      setExporting(true);
      setExportError(null);
      setExportSuccess(false);
      setProgress(0);

      // Gather all data
      setProgressMessage('Gathering people...');
      setProgress(20);
      const people = await getAllPeople();

      setProgressMessage('Gathering houses...');
      setProgress(40);
      const houses = await getAllHouses();

      setProgressMessage('Gathering relationships...');
      setProgress(60);
      const relationships = await getAllRelationships();

      setProgressMessage('Gathering Codex entries...');
      setProgress(70);
      const codexEntries = await getAllEntries();

      // Format data using MigrationHooks
      setProgressMessage('Formatting export...');
      setProgress(80);
      const exportedData = exportData({
        people,
        houses,
        relationships,
        codexEntries: codexEntries || []
      }, 'json');

      // Create download
      setProgressMessage('Creating download...');
      setProgress(90);
      const blob = new Blob([JSON.stringify(exportedData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      link.download = `lineageweaver-backup-${timestamp}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setProgress(100);
      setProgressMessage('Export complete!');
      setExportSuccess(true);

      // Reset after 3 seconds
      setTimeout(() => {
        setExportSuccess(false);
        setProgress(0);
        setProgressMessage('');
      }, 3000);

    } catch (error) {
      console.error('Export error:', error);
      setExportError(error.message);
    } finally {
      setExporting(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // IMPORT FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Handle file selection
   */
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImportFile(file);
    setImportErrors(null);
    setImportConflicts(null);
    setImportPreview(null);
    setImportSuccess(false);

    try {
      // Read file
      const fileContent = await readFileAsText(file);
      
      // Get existing data
      const existingPeople = await getAllPeople();
      const existingHouses = await getAllHouses();
      const existingRelationships = await getAllRelationships();

      // Validate and check conflicts
      const result = importData(fileContent, {
        people: existingPeople,
        houses: existingHouses,
        relationships: existingRelationships
      });

      if (result.errors) {
        setImportErrors(result.errors);
        return;
      }

      // Set preview data
      setImportPreview({
        version: result.data.version,
        exportDate: result.data.exportDate,
        metadata: result.data.metadata,
        counts: {
          people: result.data.people.length,
          houses: result.data.houses.length,
          relationships: result.data.relationships.length,
          codexEntries: result.data.codexEntries?.length || 0
        }
      });

      // Set conflicts if any
      if (result.conflicts && result.conflicts.length > 0) {
        setImportConflicts(result.conflicts);
      }

    } catch (error) {
      setImportErrors([error.message]);
    }
  };

  /**
   * Execute the import
   */
  const handleImport = async () => {
    if (!importFile) return;

    // Final confirmation
    const hasConflicts = importConflicts && importConflicts.length > 0;
    const confirmMessage = hasConflicts
      ? `⚠️ IMPORT WITH CONFLICTS\n\nThis will import data with ${importConflicts.length} conflicts.\nResolution strategy: ${conflictResolution.toUpperCase()}\n\nContinue?`
      : `Import ${importPreview.counts.people} people, ${importPreview.counts.houses} houses, and ${importPreview.counts.relationships} relationships?\n\nThis action cannot be undone without a backup!`;

    if (!confirm(confirmMessage)) return;

    try {
      setImporting(true);
      setProgress(0);
      setImportSuccess(false);

      // Read file again
      setProgressMessage('Reading import file...');
      setProgress(10);
      const fileContent = await readFileAsText(importFile);
      const data = JSON.parse(fileContent);

      // Handle conflicts
      let finalPeople = data.people;
      let finalHouses = data.houses;
      let finalRelationships = data.relationships;

      if (hasConflicts) {
        setProgressMessage('Resolving conflicts...');
        setProgress(20);

        if (conflictResolution === 'skip') {
          // Filter out conflicting items
          const existingPeopleIds = (await getAllPeople()).map(p => p.id);
          const existingHouseIds = (await getAllHouses()).map(h => h.id);
          finalPeople = data.people.filter(p => !existingPeopleIds.includes(p.id));
          finalHouses = data.houses.filter(h => !existingHouseIds.includes(h.id));
        } else if (conflictResolution === 'overwrite') {
          // Delete conflicting items first
          setProgressMessage('Removing conflicting records...');
          for (const conflict of importConflicts) {
            if (conflict.type === 'person') {
              await db.people.delete(conflict.id);
            } else if (conflict.type === 'house') {
              await db.houses.delete(conflict.id);
            }
          }
        } else if (conflictResolution === 'keep-both') {
          // Generate new IDs for imports
          setProgressMessage('Generating new IDs...');
          const idMap = new Map();
          
          finalPeople = data.people.map(person => {
            const existing = importConflicts.find(c => c.type === 'person' && c.id === person.id);
            if (existing) {
              const newId = Date.now() + Math.random();
              idMap.set(person.id, newId);
              return { ...person, id: newId };
            }
            return person;
          });

          finalHouses = data.houses.map(house => {
            const existing = importConflicts.find(c => c.type === 'house' && c.id === house.id);
            if (existing) {
              const newId = Date.now() + Math.random();
              idMap.set(house.id, newId);
              return { ...house, id: newId };
            }
            return house;
          });

          // Update relationship references
          finalRelationships = data.relationships.map(rel => ({
            ...rel,
            person1Id: idMap.get(rel.person1Id) || rel.person1Id,
            person2Id: idMap.get(rel.person2Id) || rel.person2Id
          }));
        }
      }

      // Import houses first (people reference houses)
      setProgressMessage(`Importing ${finalHouses.length} houses...`);
      setProgress(40);
      await db.houses.bulkAdd(finalHouses);

      // Import people
      setProgressMessage(`Importing ${finalPeople.length} people...`);
      setProgress(60);
      await db.people.bulkAdd(finalPeople);

      // Import relationships
      setProgressMessage(`Importing ${finalRelationships.length} relationships...`);
      setProgress(80);
      await db.relationships.bulkAdd(finalRelationships);

      // Import Codex entries if present
      if (data.codexEntries && data.codexEntries.length > 0) {
        setProgressMessage(`Importing ${data.codexEntries.length} Codex entries...`);
        setProgress(90);
        await db.codexEntries.bulkAdd(data.codexEntries);
      }

      setProgress(100);
      setProgressMessage('Import complete!');
      setImportSuccess(true);

      // Refresh the shared context so ManageData and FamilyTree update automatically
      await refreshData();

      // Reset form after success
      setTimeout(() => {
        setImportFile(null);
        setImportPreview(null);
        setImportConflicts(null);
        setImportSuccess(false);
        setProgress(0);
        setProgressMessage('');
        // Reset file input
        document.getElementById('import-file-input').value = '';
      }, 3000);

    } catch (error) {
      console.error('Import error:', error);
      setImportErrors([error.message]);
    } finally {
      setImporting(false);
    }
  };

  /**
   * Helper: Read file as text
   */
  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  /**
   * Cancel import
   */
  const handleCancelImport = () => {
    setImportFile(null);
    setImportPreview(null);
    setImportConflicts(null);
    setImportErrors(null);
    setImportSuccess(false);
    document.getElementById('import-file-input').value = '';
  };

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════

  return (
    <div className="import-export-manager" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* EXPORT SECTION */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          📤 Export Data
        </h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
          Create a complete backup of your Lineageweaver data including people, houses, relationships, and Codex entries.
        </p>

        <div style={{ 
          backgroundColor: 'var(--surface-raised)', 
          padding: '1.5rem', 
          borderRadius: '8px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                JSON Format
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Human-readable, version {CURRENT_VERSION}
              </p>
            </div>
            <button
              onClick={handleExport}
              disabled={exporting}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: exporting ? 'var(--border-color)' : 'var(--accent-primary)',
                color: 'white',
                borderRadius: '6px',
                border: 'none',
                cursor: exporting ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}
            >
              {exporting ? '⏳ Exporting...' : '📥 Download Backup'}
            </button>
          </div>

          {/* Progress bar */}
          {exporting && (
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {progressMessage}
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                  {progress}%
                </span>
              </div>
              <div style={{ 
                width: '100%', 
                height: '8px', 
                backgroundColor: 'var(--border-color)', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${progress}%`,
                  height: '100%',
                  backgroundColor: 'var(--accent-primary)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          )}

          {/* Success message */}
          {exportSuccess && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              backgroundColor: '#d4edda', 
              color: '#155724',
              borderRadius: '6px',
              fontSize: '0.875rem'
            }}>
              ✅ Export successful! Your backup has been downloaded.
            </div>
          )}

          {/* Error message */}
          {exportError && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              backgroundColor: '#f8d7da', 
              color: '#721c24',
              borderRadius: '6px',
              fontSize: '0.875rem'
            }}>
              ❌ Export failed: {exportError}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* IMPORT SECTION */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          📥 Import Data
        </h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
          Restore data from a Lineageweaver backup file. Automatic version migration and conflict detection included.
        </p>

        <div style={{ 
          backgroundColor: 'var(--surface-raised)', 
          padding: '1.5rem', 
          borderRadius: '8px',
          border: '1px solid var(--border-color)'
        }}>
          
          {/* File selection */}
          {!importPreview && (
            <div>
              <input
                id="import-file-input"
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                style={{ marginBottom: '1rem' }}
              />
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Select a .json backup file exported from Lineageweaver
              </p>
            </div>
          )}

          {/* Validation errors */}
          {importErrors && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              backgroundColor: '#f8d7da', 
              color: '#721c24',
              borderRadius: '6px'
            }}>
              <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                ❌ Import Validation Failed
              </h4>
              <ul style={{ paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
                {importErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Import preview */}
          {importPreview && !importSuccess && (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                📋 Import Preview
              </h3>
              
              {/* Metadata */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--background-primary)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Schema Version
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                    {importPreview.version}
                  </div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: 'var(--background-primary)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Export Date
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                    {new Date(importPreview.exportDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Counts */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)', 
                gap: '0.5rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: 'var(--background-primary)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{importPreview.counts.people}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>People</div>
                </div>
                <div style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: 'var(--background-primary)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{importPreview.counts.houses}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Houses</div>
                </div>
                <div style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: 'var(--background-primary)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{importPreview.counts.relationships}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Relationships</div>
                </div>
                <div style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: 'var(--background-primary)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{importPreview.counts.codexEntries}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Codex Entries</div>
                </div>
              </div>

              {/* Conflicts */}
              {importConflicts && importConflicts.length > 0 && (
                <div style={{ 
                  marginBottom: '1.5rem', 
                  padding: '1rem', 
                  backgroundColor: '#fff3cd', 
                  border: '1px solid #ffc107',
                  borderRadius: '6px'
                }}>
                  <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#856404' }}>
                    ⚠️ {importConflicts.length} Conflicts Detected
                  </h4>
                  <p style={{ fontSize: '0.875rem', marginBottom: '1rem', color: '#856404' }}>
                    The following records already exist in your database:
                  </p>
                  <div style={{ maxHeight: '150px', overflowY: 'auto', marginBottom: '1rem' }}>
                    {importConflicts.slice(0, 10).map((conflict, index) => (
                      <div key={index} style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: '#856404' }}>
                        • {conflict.type === 'person' ? '👤' : '🏰'} {conflict.importName}
                      </div>
                    ))}
                    {importConflicts.length > 10 && (
                      <div style={{ fontSize: '0.875rem', fontStyle: 'italic', color: '#856404' }}>
                        ...and {importConflicts.length - 10} more
                      </div>
                    )}
                  </div>

                  {/* Conflict resolution strategy */}
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#856404' }}>
                    Resolution Strategy:
                  </label>
                  <select
                    value={conflictResolution}
                    onChange={(e) => setConflictResolution(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: '1px solid #ffc107',
                      backgroundColor: 'white',
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="skip">Skip conflicting records (safest)</option>
                    <option value="overwrite">Overwrite existing records (replaces data)</option>
                    <option value="keep-both">Keep both (creates duplicates with new IDs)</option>
                  </select>
                </div>
              )}

              {/* Import progress */}
              {importing && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {progressMessage}
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                      {progress}%
                    </span>
                  </div>
                  <div style={{ 
                    width: '100%', 
                    height: '8px', 
                    backgroundColor: 'var(--border-color)', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${progress}%`,
                      height: '100%',
                      backgroundColor: 'var(--accent-primary)',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleCancelImport}
                  disabled={importing}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: importing ? 'not-allowed' : 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={importing}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: importing ? 'var(--border-color)' : 'var(--accent-primary)',
                    color: 'white',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: importing ? 'not-allowed' : 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}
                >
                  {importing ? '⏳ Importing...' : '✅ Confirm Import'}
                </button>
              </div>
            </div>
          )}

          {/* Success message */}
          {importSuccess && (
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#d4edda', 
              color: '#155724',
              borderRadius: '6px',
              fontSize: '0.875rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
              <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Import Successful!</div>
              <div>Your data has been restored. All views are now updated!</div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 🔗 TREE-CODEX INTEGRATION: Migration Tool */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          🔗 Codex Integration
        </h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
          Create Codex biography entries for people added before the Tree-Codex integration.
        </p>
        <CodexMigrationTool />
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* BEST PRACTICES */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#e7f3ff', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', color: '#004085' }}>
          💡 Best Practices
        </h3>
        <ul style={{ fontSize: '0.875rem', color: '#004085', paddingLeft: '1.5rem', lineHeight: '1.6' }}>
          <li>Export backups regularly, especially before major data changes</li>
          <li>Store backups in multiple locations (local drive, cloud storage, email)</li>
          <li>Name backups with dates for easy identification</li>
          <li>Test imports on a separate device or browser profile first</li>
          <li>Always export before importing to preserve current state</li>
        </ul>
      </section>
    </div>
  );
}

export default ImportExportManager;
