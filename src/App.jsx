import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import FamilyTree from './pages/FamilyTree';
import ManageData from './pages/ManageData';
import CodexLanding from './pages/CodexLanding';
import CodexEntryForm from './pages/CodexEntryForm';
import CodexEntryView from './pages/CodexEntryView';
import CodexBrowse from './pages/CodexBrowse';
import CodexImport from './pages/CodexImport';
import { initializeSampleData } from './services/sampleData';
import { ThemeProvider } from './components/ThemeContext';
import { GenealogyProvider } from './contexts/GenealogyContext';

/**
 * Main App Component
 * 
 * This is the root component that:
 * 1. Sets up routing (navigation between pages)
 * 2. Initializes the database with sample data on first load
 * 3. Provides the overall app structure
 * 
 * UPDATED: Added /codex/browse/:type routes for entry browsing
 */
function App() {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [initError, setInitError] = useState(null);

  useEffect(() => {
    async function setupDatabase() {
      try {
        console.log('Initializing database...');
        await initializeSampleData();
        setDbInitialized(true);
        console.log('Database ready!');
      } catch (error) {
        console.error('Failed to initialize database:', error);
        setInitError(error.message);
      }
    }

    setupDatabase();
  }, []);

  if (!dbInitialized && !initError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Initializing Lineageweaver...
          </h2>
          <p className="text-gray-600">Setting up your local database</p>
        </div>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-red-600 mb-2">
            Initialization Error
          </h2>
          <p className="text-gray-600 mb-4">
            Failed to initialize the database: {initError}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="royal-parchment">
      <GenealogyProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tree" element={<FamilyTree />} />
            <Route path="/manage" element={<ManageData />} />
            <Route path="/codex" element={<CodexLanding />} />
            <Route path="/codex/create" element={<CodexEntryForm />} />
            <Route path="/codex/edit/:id" element={<CodexEntryForm />} />
            <Route path="/codex/entry/:id" element={<CodexEntryView />} />
            <Route path="/codex/browse/:type" element={<CodexBrowse />} />
            <Route path="/codex/import" element={<CodexImport />} />
          </Routes>
        </Router>
      </GenealogyProvider>
    </ThemeProvider>
  );
}

export default App;
