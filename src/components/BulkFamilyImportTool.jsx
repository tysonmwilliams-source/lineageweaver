/**
 * BulkFamilyImportTool.jsx - Bulk Family Import Component
 * 
 * PURPOSE:
 * Provides a user interface for importing family templates created
 * outside of LineageWeaver. This allows bulk creation of:
 * - Houses
 * - People
 * - Relationships
 * - Optionally: Codex entries, heraldry, dignities
 * 
 * USAGE:
 * Add this component to ManageData.jsx or create a dedicated route.
 * Users upload a JSON file following the template format, preview
 * what will be created, and confirm the import.
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGenealogy } from '../contexts/GenealogyContext';
import { useDataset } from '../contexts/DatasetContext';
import { useAuth } from '../contexts/AuthContext';
import {
  validateTemplate,
  processFamilyImport,
  generateImportReport
} from '../utils/bulkFamilyImport';
import { forceUploadToCloud } from '../services/dataSyncService';
import Icon from './icons';
import './BulkFamilyImportTool.css';

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════════════════════

const SECTION_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const ALERT_VARIANTS = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } }
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function BulkFamilyImportTool() {
  const { refreshData } = useGenealogy();
  const { user } = useAuth();
  const { activeDataset } = useDataset();
  
  // File and template state
  const [selectedFile, setSelectedFile] = useState(null);
  const [template, setTemplate] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  
  // Import options
  const [options, setOptions] = useState({
    skipCodex: false,
    skipHeraldry: true,
    skipDignities: true
  });
  
  // Import state
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState({ step: '', message: '' });
  const [importResult, setImportResult] = useState(null);
  
  // ─────────────────────────────────────────────────────────────────────────
  // FILE HANDLING
  // ─────────────────────────────────────────────────────────────────────────
  
  const handleFileSelect = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setSelectedFile(file);
    setTemplate(null);
    setValidationResult(null);
    setImportResult(null);
    
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      
      // Remove template metadata fields before validation
      const cleanTemplate = { ...parsed };
      delete cleanTemplate._template_info;
      delete cleanTemplate._id_system;
      delete cleanTemplate._validation_rules;
      
      setTemplate(cleanTemplate);
      
      // Validate the template
      const validation = validateTemplate(cleanTemplate);
      setValidationResult(validation);
      
    } catch (err) {
      setValidationResult({
        valid: false,
        errors: [`Failed to parse JSON: ${err.message}`]
      });
    }
  }, []);
  
  // ─────────────────────────────────────────────────────────────────────────
  // IMPORT EXECUTION
  // ─────────────────────────────────────────────────────────────────────────
  
  const handleImport = useCallback(async () => {
    if (!template || !validationResult?.valid) return;
    
    // Confirmation
    const counts = {
      houses: template.houses?.length || 0,
      people: template.people?.length || 0,
      relationships: template.relationships?.length || 0
    };
    
    const confirmMsg = `This will create:\n• ${counts.houses} houses\n• ${counts.people} people\n• ${counts.relationships} relationships\n\nProceed with import?`;
    
    if (!confirm(confirmMsg)) return;
    
    setImporting(true);
    setProgress({ step: 'starting', message: 'Starting import...' });
    
    try {
      const result = await processFamilyImport(template, {
        ...options,
        datasetId: activeDataset?.id, // CRITICAL: Pass current dataset ID
        onProgress: (step, message) => {
          setProgress({ step, message });
        }
      });
      
      setImportResult(result);

      // Refresh the context data if successful
      if (result.success) {
        await refreshData();

        // CRITICAL: Force upload to cloud to prevent data loss
        // Without this, imported data could be lost on next sync
        if (user && activeDataset) {
          setProgress({ step: 'syncing', message: 'Syncing to cloud...' });
          try {
            await forceUploadToCloud(user.uid, activeDataset.id);
            console.log('✅ Import data synced to cloud');
          } catch (syncErr) {
            console.warn('⚠️ Could not sync to cloud:', syncErr);
          }
        }
      }
      
    } catch (err) {
      setImportResult({
        success: false,
        errors: [`Import failed: ${err.message}`]
      });
    } finally {
      setImporting(false);
    }
  }, [template, validationResult, options, refreshData]);
  
  // ─────────────────────────────────────────────────────────────────────────
  // RESET
  // ─────────────────────────────────────────────────────────────────────────
  
  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setTemplate(null);
    setValidationResult(null);
    setImportResult(null);
    setProgress({ step: '', message: '' });
    
    // Reset the file input
    const fileInput = document.getElementById('bulk-import-file');
    if (fileInput) fileInput.value = '';
  }, []);
  
  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  
  return (
    <div className="bulk-import">
      <div className="bulk-import__header">
        <Icon name="users" size={24} />
        <div className="bulk-import__header-text">
          <h2 className="bulk-import__title">Bulk Family Import</h2>
          <p className="bulk-import__subtitle">
            Import a complete family from a template file
          </p>
        </div>
      </div>
      
      {/* File Selection */}
      <motion.div 
        className="bulk-import__section"
        variants={SECTION_VARIANTS}
        initial="hidden"
        animate="visible"
      >
        <h3 className="bulk-import__section-title">
          <Icon name="file-up" size={18} />
          <span>1. Select Template File</span>
        </h3>
        
        <div className="bulk-import__file-area">
          <input
            id="bulk-import-file"
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="bulk-import__file-input"
            disabled={importing}
          />
          
          {selectedFile && (
            <div className="bulk-import__file-info">
              <Icon name="file-text" size={16} />
              <span>{selectedFile.name}</span>
              <span className="bulk-import__file-size">
                ({(selectedFile.size / 1024).toFixed(1)} KB)
              </span>
            </div>
          )}
        </div>
        
        <p className="bulk-import__hint">
          Use the <code>family-import-template.json</code> format. 
          See <code>TEMPLATE_GUIDE.md</code> for instructions.
        </p>
      </motion.div>
      
      {/* Validation Results */}
      <AnimatePresence mode="wait">
        {validationResult && (
          <motion.div 
            className="bulk-import__section"
            variants={SECTION_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <h3 className="bulk-import__section-title">
              <Icon name={validationResult.valid ? 'check-circle' : 'alert-triangle'} size={18} />
              <span>2. Validation</span>
            </h3>
            
            {validationResult.valid ? (
              <div className="bulk-import__validation bulk-import__validation--success">
                <Icon name="check" size={20} />
                <div className="bulk-import__validation-content">
                  <strong>Template is valid!</strong>
                  <p>
                    Ready to import {template.houses?.length || 0} houses, {' '}
                    {template.people?.length || 0} people, and {' '}
                    {template.relationships?.length || 0} relationships.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bulk-import__validation bulk-import__validation--error">
                <Icon name="x-circle" size={20} />
                <div className="bulk-import__validation-content">
                  <strong>Validation Failed</strong>
                  <ul className="bulk-import__error-list">
                    {validationResult.errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Preview */}
      <AnimatePresence mode="wait">
        {template && validationResult?.valid && !importResult && (
          <motion.div 
            className="bulk-import__section"
            variants={SECTION_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <h3 className="bulk-import__section-title">
              <Icon name="list" size={18} />
              <span>3. Preview</span>
            </h3>
            
            <div className="bulk-import__preview">
              {/* Houses Preview */}
              <div className="bulk-import__preview-group">
                <h4 className="bulk-import__preview-title">
                  <Icon name="castle" size={16} />
                  Houses ({template.houses?.length || 0})
                </h4>
                <ul className="bulk-import__preview-list">
                  {template.houses?.slice(0, 5).map((house, i) => (
                    <li key={i} className="bulk-import__preview-item">
                      <span 
                        className="bulk-import__color-dot" 
                        style={{ backgroundColor: house.colorCode || '#ccc' }}
                      />
                      <span>{house.houseName}</span>
                      <span className="bulk-import__preview-type">
                        {house.houseType || 'main'}
                      </span>
                    </li>
                  ))}
                  {(template.houses?.length || 0) > 5 && (
                    <li className="bulk-import__preview-more">
                      +{template.houses.length - 5} more...
                    </li>
                  )}
                </ul>
              </div>
              
              {/* People Preview */}
              <div className="bulk-import__preview-group">
                <h4 className="bulk-import__preview-title">
                  <Icon name="users" size={16} />
                  People ({template.people?.length || 0})
                </h4>
                <ul className="bulk-import__preview-list">
                  {template.people?.slice(0, 5).map((person, i) => (
                    <li key={i} className="bulk-import__preview-item">
                      <span>{person.firstName} {person.lastName}</span>
                      {person.legitimacyStatus !== 'legitimate' && (
                        <span className="bulk-import__preview-badge">
                          {person.legitimacyStatus}
                        </span>
                      )}
                    </li>
                  ))}
                  {(template.people?.length || 0) > 5 && (
                    <li className="bulk-import__preview-more">
                      +{template.people.length - 5} more...
                    </li>
                  )}
                </ul>
              </div>
              
              {/* Relationships Preview */}
              <div className="bulk-import__preview-group">
                <h4 className="bulk-import__preview-title">
                  <Icon name="link" size={16} />
                  Relationships ({template.relationships?.length || 0})
                </h4>
                <div className="bulk-import__relationship-counts">
                  {countRelationshipTypes(template.relationships).map(({ type, count }) => (
                    <span key={type} className="bulk-import__relationship-type">
                      {type}: {count}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Import Options */}
            <div className="bulk-import__options">
              <h4 className="bulk-import__options-title">Import Options</h4>
              
              <label className="bulk-import__option">
                <input
                  type="checkbox"
                  checked={!options.skipCodex}
                  onChange={(e) => setOptions(prev => ({ 
                    ...prev, 
                    skipCodex: !e.target.checked 
                  }))}
                />
                <span>Create Codex entries</span>
                <span className="bulk-import__option-hint">
                  ({template.codexEntries?.length || 0} defined)
                </span>
              </label>
              
              <label className="bulk-import__option">
                <input
                  type="checkbox"
                  checked={!options.skipHeraldry}
                  onChange={(e) => setOptions(prev => ({ 
                    ...prev, 
                    skipHeraldry: !e.target.checked 
                  }))}
                />
                <span>Create Heraldry</span>
                <span className="bulk-import__option-hint">
                  ({template.heraldry?.length || 0} defined)
                </span>
              </label>
              
              <label className="bulk-import__option">
                <input
                  type="checkbox"
                  checked={!options.skipDignities}
                  onChange={(e) => setOptions(prev => ({ 
                    ...prev, 
                    skipDignities: !e.target.checked 
                  }))}
                />
                <span>Create Dignities</span>
                <span className="bulk-import__option-hint">
                  ({template.dignities?.length || 0} defined)
                </span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Progress */}
      <AnimatePresence>
        {importing && (
          <motion.div 
            className="bulk-import__progress"
            variants={ALERT_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Icon name="loader" size={20} className="bulk-import__spinner" />
            <span>{progress.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Import Result */}
      <AnimatePresence mode="wait">
        {importResult && (
          <motion.div 
            className="bulk-import__section"
            variants={SECTION_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <h3 className="bulk-import__section-title">
              <Icon 
                name={importResult.success ? 'check-circle' : 'x-circle'} 
                size={18} 
              />
              <span>Import Result</span>
            </h3>
            
            {importResult.success ? (
              <div className="bulk-import__result bulk-import__result--success">
                <Icon name="party-popper" size={24} />
                <div className="bulk-import__result-content">
                  <strong>Import Successful!</strong>
                  <div className="bulk-import__result-stats">
                    <span>✓ {importResult.summary.housesCreated} houses</span>
                    <span>✓ {importResult.summary.peopleCreated} people</span>
                    <span>✓ {importResult.summary.relationshipsCreated} relationships</span>
                    {importResult.summary.codexEntriesCreated > 0 && (
                      <span>✓ {importResult.summary.codexEntriesCreated} Codex entries</span>
                    )}
                  </div>
                  <p className="bulk-import__result-hint">
                    Open the Family Tree to view your imported family!
                  </p>
                </div>
              </div>
            ) : (
              <div className="bulk-import__result bulk-import__result--error">
                <Icon name="x-circle" size={24} />
                <div className="bulk-import__result-content">
                  <strong>Import Failed</strong>
                  <ul className="bulk-import__error-list">
                    {importResult.errors?.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Actions */}
      <div className="bulk-import__actions">
        {template && !importing && (
          <button
            className="bulk-import__btn bulk-import__btn--secondary"
            onClick={handleReset}
          >
            <Icon name="refresh-cw" size={16} />
            <span>Reset</span>
          </button>
        )}
        
        {validationResult?.valid && !importResult && (
          <button
            className="bulk-import__btn bulk-import__btn--primary"
            onClick={handleImport}
            disabled={importing}
          >
            {importing ? (
              <>
                <Icon name="loader" size={16} className="bulk-import__spinner" />
                <span>Importing...</span>
              </>
            ) : (
              <>
                <Icon name="download" size={16} />
                <span>Import Family</span>
              </>
            )}
          </button>
        )}
        
        {importResult?.success && (
          <a
            href="/tree"
            className="bulk-import__btn bulk-import__btn--primary"
          >
            <Icon name="git-branch" size={16} />
            <span>View Family Tree</span>
          </a>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function countRelationshipTypes(relationships) {
  if (!relationships) return [];
  
  const counts = {};
  relationships.forEach(rel => {
    const type = rel.relationshipType;
    counts[type] = (counts[type] || 0) + 1;
  });
  
  return Object.entries(counts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
}

export default BulkFamilyImportTool;
