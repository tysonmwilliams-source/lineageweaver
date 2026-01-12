/**
 * Enhanced Codex Import Tool Component
 * 
 * Flexible UI for importing codex data from multiple sources.
 * Supports the original House Wilfrey data, Veritists expansion,
 * Charter data, and any custom data following the same format.
 * 
 * STYLED TO MATCH: Medieval manuscript aesthetic using theme CSS variables
 */

import React, { useState } from 'react';
import { importCodexData, clearCodex, getImportPreview } from '../utils/enhanced-codex-import.js';
import CODEX_SEED_DATA from '../data/codex-seed-data.js';
import { useAuth } from '../contexts/AuthContext';
import './EnhancedCodexImportTool.css';

export default function EnhancedCodexImportTool({ veritistsData = null, charterData = null }) {
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(null);
  const [selectedSource, setSelectedSource] = useState('house-wilfrey');
  
  // ☁️ Get current user for cloud sync
  const { user } = useAuth();
  
  // Get previews for available sources
  const wilfryPreview = getImportPreview(CODEX_SEED_DATA);
  const veritistsPreview = veritistsData ? getImportPreview(veritistsData) : null;
  const charterPreview = charterData ? getImportPreview(charterData) : null;
  
  const handleImport = async (clearFirst = false) => {
    let dataToImport;
    let confirmMessage = '';
    
    if (selectedSource === 'house-wilfrey') {
      dataToImport = CODEX_SEED_DATA;
      confirmMessage = `Import ${wilfryPreview.total} House Wilfrey entries?`;
    } else if (selectedSource === 'veritists') {
      if (!veritistsData) {
        setError('Veritists data not available. Please ensure it is imported in the component.');
        return;
      }
      dataToImport = veritistsData;
      confirmMessage = `Import ${veritistsPreview.total} Veritists entries?`;
    } else if (selectedSource === 'charter') {
      if (!charterData) {
        setError('Charter data not available. Please ensure it is imported in the component.');
        return;
      }
      dataToImport = charterData;
      confirmMessage = `Import ${charterPreview.total} Charter entries?`;
    } else if (selectedSource === 'all') {
      confirmMessage = `Import ALL available entries?`;
    }
    
    if (clearFirst) {
      confirmMessage = '⚠️ CLEAR AND IMPORT\n\nThis will DELETE all existing entries first.\n\n' + confirmMessage;
    }
    
    if (!window.confirm(confirmMessage)) {
      return;
    }
    
    setImporting(true);
    setError(null);
    setResults(null);
    setProgress(null);
    
    try {
      if (clearFirst) {
        await clearCodex();
      }
      
      let importResults;
      if (selectedSource === 'all') {
        const allResults = {
          houses: [],
          locations: [],
          events: [],
          personages: [],
          mysteria: [],
          concepts: [],
          skipped: [],
          errors: [],
          timing: { start: Date.now(), end: 0, duration: 0 }
        };
        
        setProgress({ current: 'House Wilfrey data...', processed: 0, total: 3 });
        const wilfryResults = await importCodexData(CODEX_SEED_DATA, { userId: user?.uid });
        mergeResults(allResults, wilfryResults);
        
        if (veritistsData) {
          setProgress({ current: 'Veritists data...', processed: 1, total: 3 });
          const veritistsResults = await importCodexData(veritistsData, { userId: user?.uid });
          mergeResults(allResults, veritistsResults);
        }
        
        if (charterData) {
          setProgress({ current: 'Charter data...', processed: 2, total: 3 });
          const charterResults = await importCodexData(charterData, { userId: user?.uid });
          mergeResults(allResults, charterResults);
        }
        
        allResults.timing.end = Date.now();
        allResults.timing.duration = allResults.timing.end - allResults.timing.start;
        importResults = allResults;
      } else {
        importResults = await importCodexData(dataToImport, {
          onProgress: (prog) => setProgress(prog),
          userId: user?.uid
        });
      }
      
      setResults(importResults);
      setProgress(null);
    } catch (err) {
      setError(err.message);
      setProgress(null);
    } finally {
      setImporting(false);
    }
  };
  
  const mergeResults = (target, source) => {
    target.houses.push(...(source.houses || []));
    target.locations.push(...(source.locations || []));
    target.events.push(...(source.events || []));
    target.personages.push(...(source.personages || []));
    target.mysteria.push(...(source.mysteria || []));
    target.concepts.push(...(source.concepts || []));
    target.skipped.push(...(source.skipped || []));
    target.errors.push(...(source.errors || []));
  };
  
  const allTotal = wilfryPreview.total + 
    (veritistsPreview?.total || 0) + 
    (charterPreview?.total || 0);
  
  return (
    <div className="import-tool">
      <h2 className="import-tool__title">
        📜 Codex Import Tool
      </h2>
      
      <p className="import-tool__description">
        Import canonical worldbuilding data into The Codex. Select which data set to import below.
      </p>
      
      {/* Cloud Sync Status */}
      <div className={`import-tool__sync-status ${user ? 'import-tool__sync-status--active' : 'import-tool__sync-status--warning'}`}>
        <span className="import-tool__sync-icon">{user ? '☁️' : '⚠️'}</span>
        <span>
          {user 
            ? <><strong>Cloud Sync Active:</strong> Imported entries will be saved to your cloud account and persist across devices.</>
            : <><strong>Not Signed In:</strong> Imported entries will only be saved locally and may be lost if you sign in later.</>}
        </span>
      </div>
      
      {/* Data Source Selection */}
      <div className="import-tool__sources">
        <h3 className="import-tool__sources-title">Select Data Source</h3>
        
        {/* House Wilfrey */}
        <label className={`import-tool__option ${selectedSource === 'house-wilfrey' ? 'import-tool__option--selected' : ''}`}>
          <input
            type="radio"
            name="dataSource"
            value="house-wilfrey"
            checked={selectedSource === 'house-wilfrey'}
            onChange={(e) => setSelectedSource(e.target.value)}
          />
          <div className="import-tool__option-content">
            <strong>🏰 House Wilfrey (Original)</strong>
            <span className="import-tool__option-count">{wilfryPreview.total} entries</span>
          </div>
          <div className="import-tool__option-details">
            Houses: {wilfryPreview.counts.houses || 0} | 
            Locations: {wilfryPreview.counts.locations || 0} | 
            Events: {wilfryPreview.counts.events || 0} | 
            Personages: {wilfryPreview.counts.personages || 0} | 
            Mysteria: {wilfryPreview.counts.mysteria || 0}
          </div>
        </label>
        
        {/* Veritists */}
        {veritistsData && veritistsPreview && (
          <label className={`import-tool__option ${selectedSource === 'veritists' ? 'import-tool__option--selected' : ''}`}>
            <input
              type="radio"
              name="dataSource"
              value="veritists"
              checked={selectedSource === 'veritists'}
              onChange={(e) => setSelectedSource(e.target.value)}
            />
            <div className="import-tool__option-content">
              <strong>📚 The Veritists (Expansion)</strong>
              <span className="import-tool__option-count">{veritistsPreview.total} entries</span>
            </div>
            <div className="import-tool__option-details">
              Locations: {veritistsPreview.counts.locations || 0} | 
              Mysteria: {veritistsPreview.counts.mysteria || 0}
            </div>
          </label>
        )}
        
        {/* Charter */}
        {charterData && charterPreview && (
          <label className={`import-tool__option ${selectedSource === 'charter' ? 'import-tool__option--selected' : ''}`}>
            <input
              type="radio"
              name="dataSource"
              value="charter"
              checked={selectedSource === 'charter'}
              onChange={(e) => setSelectedSource(e.target.value)}
            />
            <div className="import-tool__option-content">
              <strong>⚖️ Charter of Driht & Ward</strong>
              <span className="import-tool__option-count">{charterPreview.total} entries</span>
            </div>
            <div className="import-tool__option-details">
              Locations: {charterPreview.counts.locations || 0} | 
              Concepts: {charterPreview.counts.concepts || 0} | 
              Houses: {charterPreview.counts.houses || 0}
            </div>
            <div className="import-tool__option-subtitle">
              Estargenn realm, Driht/Ward hierarchy, Four Wilfrey lordly houses
            </div>
          </label>
        )}
        
        {/* All */}
        {(veritistsData || charterData) && (
          <label className={`import-tool__option ${selectedSource === 'all' ? 'import-tool__option--selected' : ''}`}>
            <input
              type="radio"
              name="dataSource"
              value="all"
              checked={selectedSource === 'all'}
              onChange={(e) => setSelectedSource(e.target.value)}
            />
            <div className="import-tool__option-content">
              <strong>✨ Everything (All Available)</strong>
              <span className="import-tool__option-count">{allTotal} entries</span>
            </div>
            <div className="import-tool__option-details">
              House Wilfrey + {veritistsData ? 'Veritists + ' : ''}{charterData ? 'Charter' : ''}
            </div>
          </label>
        )}
      </div>
      
      {/* Progress Bar */}
      {progress && (
        <div className="import-tool__progress">
          <div className="import-tool__progress-label">
            Importing: {progress.current}
          </div>
          <div className="import-tool__progress-bar">
            <div 
              className="import-tool__progress-fill"
              style={{ width: `${(progress.processed / progress.total) * 100}%` }}
            />
          </div>
          <div className="import-tool__progress-count">
            {progress.processed} / {progress.total} {selectedSource === 'all' ? 'data sources' : 'entries'}
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="import-tool__actions">
        <button
          onClick={() => handleImport(false)}
          disabled={importing}
          className="import-tool__button import-tool__button--primary"
        >
          {importing ? '⏳ Importing...' : '📥 Import Data'}
        </button>
        
        <button
          onClick={() => handleImport(true)}
          disabled={importing}
          className="import-tool__button import-tool__button--danger"
        >
          {importing ? '⏳ Clearing...' : '🗑️ Clear & Import'}
        </button>
      </div>
      
      {/* Results */}
      {results && (
        <div className={`import-tool__results ${results.errors.length > 0 ? 'import-tool__results--warning' : 'import-tool__results--success'}`}>
          <h3 className="import-tool__results-title">
            {results.errors.length > 0 ? '⚠️ Import Completed with Issues' : '✅ Import Successful!'}
          </h3>
          
          <div className="import-tool__results-stats">
            <p>Houses: <strong>{results.houses.length}</strong></p>
            <p>Locations: <strong>{results.locations.length}</strong></p>
            <p>Events: <strong>{results.events.length}</strong></p>
            <p>Personages: <strong>{results.personages.length}</strong></p>
            <p>Mysteria: <strong>{results.mysteria.length}</strong></p>
            <p>Concepts: <strong>{results.concepts?.length || 0}</strong></p>
            <p>Skipped: <strong>{results.skipped.length}</strong></p>
            <p>Duration: <strong>{results.timing.duration}ms</strong></p>
          </div>
          
          {results.skipped.length > 0 && (
            <div className="import-tool__results-skipped">
              <h4>⊘ Skipped ({results.skipped.length}):</h4>
              <ul>
                {results.skipped.map((item, i) => (
                  <li key={i}>{item.title} — {item.reason}</li>
                ))}
              </ul>
            </div>
          )}
          
          {results.errors.length > 0 && (
            <div className="import-tool__results-errors">
              <h4>❌ Errors ({results.errors.length}):</h4>
              <ul>
                {results.errors.map((err, i) => (
                  <li key={i}>{err.type}: {err.title} — {err.error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {/* Error */}
      {error && (
        <div className="import-tool__error">
          <h3>❌ Critical Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      {/* Help Text */}
      <div className="import-tool__help">
        <p><strong>ℹ️ About this import system:</strong></p>
        <ul>
          <li>Duplicate detection: Entries with matching titles will be skipped</li>
          <li>All entries include wiki-link syntax [[Entry Name]] for cross-referencing</li>
          <li>Tags, eras, and categories are ready for filtering</li>
          <li>Clear & Import: Use this to remove old entries before reimporting</li>
        </ul>
      </div>
    </div>
  );
}
