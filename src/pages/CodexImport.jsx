/**
 * Codex Import Page
 * 
 * Dedicated page for importing worldbuilding content into The Codex.
 * Provides UI for importing House Wilfrey seed data, Veritists expansion,
 * or any custom data following the same format.
 */

import { useNavigate } from 'react-router-dom';
import EnhancedCodexImportTool from '../components/EnhancedCodexImportTool';
import VERITISTS_CODEX_DATA from '../data/veritists-codex-import';

export default function CodexImport() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--parchment-bg)]">
      {/* Header */}
      <div className="bg-[var(--parchment-accent)] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">
                📚 Codex Import
              </h1>
              <p className="text-sm opacity-90">
                Import worldbuilding content into The Codex
              </p>
            </div>
            <button
              onClick={() => navigate('/codex')}
              className="px-4 py-2 bg-white text-[var(--parchment-accent)] rounded-lg hover:bg-gray-100 transition-colors font-serif"
            >
              ← Back to Codex
            </button>
          </div>
        </div>
      </div>

      {/* Import Tool */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <EnhancedCodexImportTool veritistsData={VERITISTS_CODEX_DATA} />
      </div>
    </div>
  );
}
