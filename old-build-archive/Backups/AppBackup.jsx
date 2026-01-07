import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import FamilyTree from './pages/FamilyTree';
import ManageData from './pages/ManageData';
import CodexLanding from './pages/CodexLanding';
import CodexEntryForm from './pages/CodexEntryForm';
import { initializeSampleData } from './services/sampleData';
import { ThemeProvider } from './components/ThemeContext';

/**
 * Main App Component
 * 
 * This is the root component that:
 * 1. Sets up routing (navigation between pages)
 * 2. Initializes the database with sample data on first load
 * 3. Provides the overall app structure
 */
function App() {
  // State to track if database is initialized
  const [dbInitialized, setDbInitialized] = useState(false);
  const [initError, setInitError] = useState(null);

  // useEffect runs when the component first loads
  // It's perfect for one-time setup tasks like initializing the database
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
  }, []); // Empty array means this only runs once when app loads

  // Show loading screen while database initializes
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

  // Show error if database initialization failed
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

  // Main app with routing
  return (
    <ThemeProvider defaultTheme="royal-parchment">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tree" element={<FamilyTree />} />
          <Route path="/manage" element={<ManageData />} />
          <Route path="/codex" element={<CodexLanding />} />
          <Route path="/codex/create" element={<CodexEntryForm />} />
          <Route path="/codex/edit/:id" element={<CodexEntryForm />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
