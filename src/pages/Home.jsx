import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { wilfreyData } from '../data/wilfreyData';
import { addPerson, addHouse, addRelationship } from '../services/database';
import Navigation from '../components/Navigation';
import './Home.css';

/**
 * Home Page Component
 * 
 * Landing page with navigation to main features and quick-load for Wilfrey data
 */
function Home() {
  const navigate = useNavigate();
  const [importStatus, setImportStatus] = useState(null);
  const [isImporting, setIsImporting] = useState(false);

  async function handleQuickLoadWilfrey() {
    try {
      setIsImporting(true);
      setImportStatus({ type: 'info', message: 'Loading House Wilfrey data...' });
      
      // Import houses first
      for (const house of wilfreyData.houses) {
        await addHouse(house);
      }
      
      // Then import people
      for (const person of wilfreyData.people) {
        await addPerson(person);
      }
      
      // Finally import relationships
      for (const relationship of wilfreyData.relationships) {
        await addRelationship(relationship);
      }
      
      setImportStatus({ 
        type: 'success', 
        message: '✅ House Wilfrey data loaded successfully!' 
      });
      
      // Navigate to tree after 1 second
      setTimeout(() => {
        navigate('/tree');
      }, 1000);
    } catch (error) {
      console.error('Error loading Wilfrey data:', error);
      setImportStatus({ 
        type: 'error', 
        message: `❌ Error: ${error.message}` 
      });
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <>
      <Navigation />
      <div className="home-page">
        <div className="home-container">
        <div className="home-content">
          {/* Header */}
          <header className="home-header">
            <h1 className="home-title">Lineageweaver</h1>
            <p className="home-subtitle">
              Medieval Fantasy Genealogy & Worldbuilding
            </p>
          </header>

          {/* Quick Load Wilfrey Card */}
          <div className="wilfrey-card">
            <h2 className="wilfrey-title">🏰 House Wilfrey</h2>
            <p className="wilfrey-description">
              Load the complete House Wilfrey dataset with all four regional seats,
              cadet branches, and the fostering system.
            </p>
            <button 
              className="wilfrey-button"
              onClick={handleQuickLoadWilfrey}
              disabled={isImporting}
            >
              {isImporting ? 'Loading...' : 'Quick Load House Wilfrey'}
            </button>
            {importStatus && (
              <div className={`import-status status-${importStatus.type}`}>
                {importStatus.message}
              </div>
            )}
          </div>

          {/* Navigation Cards */}
          <div className="nav-cards">
            <div className="nav-card">
              <h2 className="nav-card-title">🌳 Family Trees</h2>
              <p className="nav-card-description">
                Visualize complex family relationships with interactive genealogy trees.
                Pan, zoom, and explore generations.
              </p>
              <a href="/tree" className="nav-card-button button-primary">
                View Family Trees
              </a>
            </div>

            <div className="nav-card">
              <h2 className="nav-card-title">📜 The Codex</h2>
              <p className="nav-card-description">
                Wiki-style encyclopedia for your world. Document characters, locations,
                events, and lore with linked entries.
              </p>
              <a href="/codex" className="nav-card-button button-secondary">
                Open The Codex
              </a>
            </div>

            <div className="nav-card">
              <h2 className="nav-card-title">⚙️ Manage Data</h2>
              <p className="nav-card-description">
                Add people, houses, and relationships. Edit details and manage your
                worldbuilding database.
              </p>
              <a href="/manage" className="nav-card-button button-primary">
                Manage Data
              </a>
            </div>
          </div>

          {/* Info Card */}
          <div className="info-card">
            <h3 className="info-card-title">Getting Started</h3>
            <div className="info-card-content">
              <p>
                <strong>New to Lineageweaver?</strong> Start by exploring the House Wilfrey
                example using the Quick Load button above, or create your own houses and
                characters in Manage Data.
              </p>
              <p>
                <strong>The Codex</strong> is your worldbuilding companion - document everything
                from character backstories to historical events with wiki-style linked entries.
              </p>
              <p>
                All data is stored locally in your browser and can be exported as JSON backups.
              </p>
            </div>
          </div>

          {/* Footer */}
          <footer className="home-footer">
            <p>Built for worldbuilders, writers, and game masters</p>
          </footer>
        </div>
        </div>
      </div>
    </>
  );
}

export default Home;