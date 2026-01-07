/**
 * Codex Import Tool Component
 * 
 * Simple UI for importing the House Wilfrey seed data into The Codex.
 * Can be added to your app temporarily or permanently as an admin tool.
 * 
 * USAGE:
 * Import this component in your main App.jsx or a settings page:
 * 
 * import CodexImportTool from './components/CodexImportTool';
 * 
 * Then render it:
 * <CodexImportTool />
 */

import React, { useState } from 'react';
import { importSeedData, clearCodex, getImportPreview } from '../utils/import-seed-data.js';

export default function CodexImportTool() {
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  
  const preview = getImportPreview();
  
  const handleImport = async () => {
    if (!window.confirm(
      `📚 Import House Wilfrey Codex Data\n\n` +
      `This will import ${preview.total} entries:\n` +
      `• ${preview.houses} Houses\n` +
      `• ${preview.locations} Locations\n` +
      `• ${preview.events} Events\n` +
      `• ${preview.personages} Personages\n` +
      `• ${preview.mysteria} Mysteria\n\n` +
      `Continue?`
    )) {
      return;
    }
    
    setImporting(true);
    setError(null);
    setResults(null);
    
    try {
      const importResults = await importSeedData();
      setResults(importResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setImporting(false);
    }
  };
  
  const handleClearAndImport = async () => {
    if (!window.confirm(
      `⚠️ CLEAR AND RE-IMPORT\n\n` +
      `This will DELETE all existing Codex entries and import fresh data.\n\n` +
      `This action cannot be undone.\n\n` +
      `Are you absolutely sure?`
    )) {
      return;
    }
    
    setImporting(true);
    setError(null);
    setResults(null);
    
    try {
      await clearCodex();
      const importResults = await importSeedData();
      setResults(importResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setImporting(false);
    }
  };
  
  return (
    <div style={{
      padding: '20px',
      maxWidth: '600px',
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
        📜 Codex Import Tool
      </h2>
      
      <p style={{
        margin: '0 0 20px 0',
        fontSize: '14px',
        color: 'var(--parchment-text-secondary)',
        lineHeight: '1.6'
      }}>
        Import canonical House Wilfrey data into The Codex. This includes houses, locations, 
        events, personages, and customs extracted from the official datasheet.
      </p>
      
      {/* Preview */}
      <div style={{
        padding: '15px',
        backgroundColor: 'rgba(139, 69, 19, 0.1)',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <h3 style={{
          margin: '0 0 10px 0',
          fontSize: '16px',
          color: 'var(--parchment-text)'
        }}>
          Preview: {preview.total} Total Entries
        </h3>
        <ul style={{
          margin: 0,
          paddingLeft: '20px',
          fontSize: '14px',
          color: 'var(--parchment-text-secondary)'
        }}>
          <li>Houses: {preview.houses}</li>
          <li>Locations: {preview.locations}</li>
          <li>Events: {preview.events}</li>
          <li>Personages: {preview.personages}</li>
          <li>Mysteria: {preview.mysteria}</li>
        </ul>
      </div>
      
      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px'
      }}>
        <button
          onClick={handleImport}
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
          onClick={handleClearAndImport}
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
          {importing ? '⏳ Clearing...' : '🗑️ Clear & Re-import'}
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
            {results.errors.length > 0 ? '⚠️ Import Completed with Errors' : '✅ Import Successful!'}
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
            <p style={{ margin: '5px 0' }}>
              Duration: {results.timing.duration}ms
            </p>
          </div>
          
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
                Errors ({results.errors.length}):
              </h4>
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                fontSize: '12px'
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
          <strong>ℹ️ About this import:</strong>
        </p>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>All entries include "integration hooks" for future features</li>
          <li>Wiki-link syntax [[Entry Name]] ready for Phase 2 editor</li>
          <li>Tags, eras, and categories ready for filtering</li>
          <li>PersonId/houseId fields ready to link to family tree</li>
          <li>See CODEX_ENTRIES_REFERENCE.md for full details</li>
        </ul>
      </div>
    </div>
  );
}
