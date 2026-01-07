/**
 * Enhanced Codex Import Tool Component
 * 
 * Flexible UI for importing codex data from multiple sources.
 * Supports the original House Wilfrey data, Veritists expansion,
 * and any custom data following the same format.
 * 
 * USAGE:
 * 
 * 1. Add to your app:
 * ```javascript
 * import EnhancedCodexImportTool from './components/EnhancedCodexImportTool';
 * ```
 * 
 * 2. Render with optional Veritists data:
 * ```jsx
 * import VERITISTS_CODEX_DATA from '../data/veritists-codex-import';
 * 
 * <EnhancedCodexImportTool 
 *   veritistsData={VERITISTS_CODEX_DATA}
 * />
 * ```
 */

import React, { useState } from 'react';
import { importCodexData, clearCodex, getImportPreview, quickImports } from '../utils/enhanced-codex-import.js';
import CODEX_SEED_DATA from '../data/codex-seed-data.js';

export default function EnhancedCodexImportTool({ veritistsData = null }) {
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(null);
  const [selectedSource, setSelectedSource] = useState('house-wilfrey');
  
  // Get previews for available sources
  const wilfryPreview = getImportPreview(CODEX_SEED_DATA);
  const veritistsPreview = veritistsData ? getImportPreview(veritistsData) : null;
  
  const handleImport = async (clearFirst = false) => {
    // Determine what to import
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
    } else if (selectedSource === 'both') {
      if (!veritistsData) {
        setError('Veritists data not available.');
        return;
      }
      confirmMessage = `Import ALL entries (House Wilfrey + Veritists)?`;
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
      // Clear if requested
      if (clearFirst) {
        await clearCodex();
      }
      
      // Import based on selection
      let importResults;
      if (selectedSource === 'both') {
        importResults = await quickImports.everything(veritistsData, {
          onProgress: (prog) => setProgress(prog)
        });
      } else {
        importResults = await importCodexData(dataToImport, {
          onProgress: (prog) => setProgress(prog)
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
  
  return (
    <div style={{
      padding: '20px',
      maxWidth: '800px',
      margin: '20px auto',
      border: '2px solid var(--parchment-border)',
      borderRadius: '8px',
      backgroundColor: 'var(--parchment-bg)',
      fontFamily: 'var(--font-serif)'
    }}>
      <h2 style={{
        margin: '0 0 10px 0',
        fontSize: '24px',
        color: 'var(--parchment-text)'
      }}>
        📜 Enhanced Codex Import Tool
      </h2>
      
      <p style={{
        margin: '0 0 20px 0',
        fontSize: '14px',
        color: 'var(--parchment-text-secondary)',
        lineHeight: '1.6'
      }}>
        Import canonical worldbuilding data into The Codex. Select which data set to import below.
      </p>
      
      {/* Data Source Selection */}
      <div style={{
        padding: '15px',
        backgroundColor: 'rgba(139, 69, 19, 0.1)',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <h3 style={{
          margin: '0 0 15px 0',
          fontSize: '16px',
          color: 'var(--parchment-text)'
        }}>
          Select Data Source
        </h3>
        
        {/* House Wilfrey Option */}
        <label style={{
          display: 'block',
          marginBottom: '10px',
          cursor: 'pointer',
          padding: '10px',
          backgroundColor: selectedSource === 'house-wilfrey' ? 'rgba(139, 69, 19, 0.2)' : 'transparent',
          borderRadius: '4px'
        }}>
          <input
            type="radio"
            name="dataSource"
            value="house-wilfrey"
            checked={selectedSource === 'house-wilfrey'}
            onChange={(e) => setSelectedSource(e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <strong>House Wilfrey (Original)</strong> - {wilfryPreview.total} entries
          <div style={{ marginLeft: '25px', fontSize: '12px', color: 'var(--parchment-text-secondary)' }}>
            Houses: {wilfryPreview.counts.houses || 0} | 
            Locations: {wilfryPreview.counts.locations || 0} | 
            Events: {wilfryPreview.counts.events || 0} | 
            Personages: {wilfryPreview.counts.personages || 0} | 
            Mysteria: {wilfryPreview.counts.mysteria || 0}
          </div>
        </label>
        
        {/* Veritists Option */}
        {veritistsData && veritistsPreview && (
          <label style={{
            display: 'block',
            marginBottom: '10px',
            cursor: 'pointer',
            padding: '10px',
            backgroundColor: selectedSource === 'veritists' ? 'rgba(139, 69, 19, 0.2)' : 'transparent',
            borderRadius: '4px'
          }}>
            <input
              type="radio"
              name="dataSource"
              value="veritists"
              checked={selectedSource === 'veritists'}
              onChange={(e) => setSelectedSource(e.target.value)}
              style={{ marginRight: '10px' }}
            />
            <strong>The Veritists (Expansion)</strong> - {veritistsPreview.total} entries
            <div style={{ marginLeft: '25px', fontSize: '12px', color: 'var(--parchment-text-secondary)' }}>
              Locations: {veritistsPreview.counts.locations || 0} | 
              Mysteria: {veritistsPreview.counts.mysteria || 0}
            </div>
          </label>
        )}
        
        {/* Both Option */}
        {veritistsData && (
          <label style={{
            display: 'block',
            cursor: 'pointer',
            padding: '10px',
            backgroundColor: selectedSource === 'both' ? 'rgba(139, 69, 19, 0.2)' : 'transparent',
            borderRadius: '4px'
          }}>
            <input
              type="radio"
              name="dataSource"
              value="both"
              checked={selectedSource === 'both'}
              onChange={(e) => setSelectedSource(e.target.value)}
              style={{ marginRight: '10px' }}
            />
            <strong>Everything (Combined)</strong> - {wilfryPreview.total + veritistsPreview.total} entries
            <div style={{ marginLeft: '25px', fontSize: '12px', color: 'var(--parchment-text-secondary)' }}>
              All House Wilfrey + All Veritists content
            </div>
          </label>
        )}
        
        {!veritistsData && (
          <div style={{
            marginTop: '10px',
            padding: '10px',
            backgroundColor: 'rgba(66, 133, 244, 0.1)',
            borderRadius: '4px',
            fontSize: '12px',
            color: 'var(--parchment-text-secondary)'
          }}>
            ℹ️ Veritists data not loaded. To enable, import it in the component.
          </div>
        )}
      </div>
      
      {/* Progress Bar */}
      {progress && (
        <div style={{
          padding: '15px',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <div style={{
            marginBottom: '10px',
            fontSize: '14px',
            color: 'var(--parchment-text)'
          }}>
            Importing: {progress.current}
          </div>
          <div style={{
            width: '100%',
            height: '20px',
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(progress.processed / progress.total) * 100}%`,
              height: '100%',
              backgroundColor: 'var(--parchment-accent)',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{
            marginTop: '5px',
            fontSize: '12px',
            color: 'var(--parchment-text-secondary)'
          }}>
            {progress.processed} / {progress.total} entries
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px'
      }}>
        <button
          onClick={() => handleImport(false)}
          disabled={importing}
          style={{
            flex: 1,
            padding: '12px 20px',
            backgroundColor: importing ? '#666' : 'var(--parchment-accent)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: importing ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-serif)'
          }}
        >
          {importing ? '⏳ Importing...' : '📥 Import Data'}
        </button>
        
        <button
          onClick={() => handleImport(true)}
          disabled={importing}
          style={{
            flex: 1,
            padding: '12px 20px',
            backgroundColor: importing ? '#666' : '#c23b22',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: importing ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-serif)'
          }}
        >
          {importing ? '⏳ Clearing...' : '🗑️ Clear & Import'}
        </button>
      </div>
      
      {/* Results */}
      {results && (
        <div style={{
          padding: '15px',
          backgroundColor: results.errors.length > 0 ? 'rgba(194, 59, 34, 0.1)' : 'rgba(76, 175, 80, 0.1)',
          borderRadius: '4px',
          marginTop: '15px'
        }}>
          <h3 style={{
            margin: '0 0 10px 0',
            fontSize: '16px',
            color: results.errors.length > 0 ? '#c23b22' : '#4caf50'
          }}>
            {results.errors.length > 0 ? '⚠️ Import Completed with Issues' : '✅ Import Successful!'}
          </h3>
          
          <div style={{
            fontSize: '14px',
            color: 'var(--parchment-text-secondary)',
            marginBottom: '10px'
          }}>
            <p style={{ margin: '5px 0' }}>Houses: {results.houses.length}</p>
            <p style={{ margin: '5px 0' }}>Locations: {results.locations.length}</p>
            <p style={{ margin: '5px 0' }}>Events: {results.events.length}</p>
            <p style={{ margin: '5px 0' }}>Personages: {results.personages.length}</p>
            <p style={{ margin: '5px 0' }}>Mysteria: {results.mysteria.length}</p>
            <p style={{ margin: '5px 0' }}>Skipped (duplicates): {results.skipped.length}</p>
            <p style={{ margin: '5px 0' }}>Duration: {results.timing.duration}ms</p>
          </div>
          
          {results.skipped.length > 0 && (
            <div style={{
              marginTop: '10px',
              padding: '10px',
              backgroundColor: 'rgba(255, 193, 7, 0.2)',
              borderRadius: '4px'
            }}>
              <h4 style={{
                margin: '0 0 5px 0',
                fontSize: '14px',
                color: '#f57c00'
              }}>
                ⊘ Skipped ({results.skipped.length}):
              </h4>
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                fontSize: '12px',
                maxHeight: '150px',
                overflowY: 'auto'
              }}>
                {results.skipped.map((item, i) => (
                  <li key={i}>
                    {item.title} - {item.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {results.errors.length > 0 && (
            <div style={{
              marginTop: '10px',
              padding: '10px',
              backgroundColor: 'rgba(194, 59, 34, 0.2)',
              borderRadius: '4px'
            }}>
              <h4 style={{
                margin: '0 0 5px 0',
                fontSize: '14px',
                color: '#c23b22'
              }}>
                ❌ Errors ({results.errors.length}):
              </h4>
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                fontSize: '12px',
                maxHeight: '150px',
                overflowY: 'auto'
              }}>
                {results.errors.map((err, i) => (
                  <li key={i}>
                    {err.type}: {err.title} - {err.error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {/* Error */}
      {error && (
        <div style={{
          padding: '15px',
          backgroundColor: 'rgba(194, 59, 34, 0.1)',
          borderRadius: '4px',
          marginTop: '15px',
          color: '#c23b22'
        }}>
          <h3 style={{
            margin: '0 0 10px 0',
            fontSize: '16px'
          }}>
            ❌ Critical Error
          </h3>
          <p style={{
            margin: 0,
            fontSize: '14px'
          }}>
            {error}
          </p>
        </div>
      )}
      
      {/* Help Text */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: 'rgba(66, 133, 244, 0.1)',
        borderRadius: '4px',
        fontSize: '12px',
        color: 'var(--parchment-text-secondary)',
        lineHeight: '1.6'
      }}>
        <p style={{ margin: '0 0 10px 0' }}>
          <strong>ℹ️ About this import system:</strong>
        </p>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Duplicate detection: Entries with matching titles will be skipped</li>
          <li>All entries include wiki-link syntax [[Entry Name]] for cross-referencing</li>
          <li>Tags, eras, and categories are ready for filtering</li>
          <li>Integration hooks (personId, houseId) ready for future features</li>
          <li>Clear & Import: Use this to remove old entries before reimporting</li>
        </ul>
      </div>
    </div>
  );
}
