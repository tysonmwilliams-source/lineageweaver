import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEntry, getAllLinksForEntry } from '../services/codexService';
import { parseWikiLinks } from '../utils/wikiLinkParser';
import Navigation from '../components/Navigation';
import './CodexEntryView.css';

/**
 * Codex Entry View Page
 * 
 * Displays a single codex entry with:
 * - Rendered markdown content with wiki-links
 * - Entry metadata (type, tags, era)
 * - Edit button
 * - Future: Backlinks panel (commented, ready to activate)
 */
function CodexEntryView() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [entry, setEntry] = useState(null);
  const [renderedContent, setRenderedContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Future feature: backlinks (entries that reference this one)
  // const [backlinks, setBacklinks] = useState([]);
  
  useEffect(() => {
    loadEntry();
  }, [id]);
  
  async function loadEntry() {
    try {
      setLoading(true);
      setError(null);
      
      const entryData = await getEntry(parseInt(id));
      
      if (!entryData) {
        setError('Entry not found');
        setLoading(false);
        return;
      }
      
      setEntry(entryData);
      
      // Parse markdown and process wiki-links
      const html = await parseWikiLinks(entryData.content, entryData.id);
      setRenderedContent(html);
      
      // Future feature: Load backlinks
      // const links = await getAllLinksForEntry(entryData.id);
      // setBacklinks(links.incoming);
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading entry:', err);
      setError('Failed to load entry');
      setLoading(false);
    }
  }
  
  function handleEdit() {
    navigate(`/codex/edit/${id}`);
  }
  
  function handleBackToCodex() {
    navigate('/codex');
  }
  
  // Format date for display
  function formatDate(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
  
  // Get icon for entry type
  function getTypeIcon(type) {
    const icons = {
      personage: '👤',
      house: '🏰',
      location: '📍',
      event: '⚔️',
      mysteria: '✨',
      custom: '📜'
    };
    return icons[type] || '📜';
  }
  
  // Loading state
  if (loading) {
    return (
      <>
        <Navigation />
        <div className="entry-view-container loading">
          <div className="loading-spinner">
            <div className="text-4xl">⏳</div>
            <p>Loading entry...</p>
          </div>
        </div>
      </>
    );
  }
  
  // Error state
  if (error || !entry) {
    return (
      <>
        <Navigation />
        <div className="entry-view-container error">
          <div className="error-message">
            <div className="text-4xl">❌</div>
            <h2>Entry Not Found</h2>
            <p>{error || 'The requested entry does not exist.'}</p>
            <button onClick={handleBackToCodex} className="back-button">
              ← Back to Codex
            </button>
          </div>
        </div>
      </>
    );
  }
  
  // Main render
  return (
    <>
      <Navigation />
      
      <div className="entry-view-container">
        <div className="entry-view-content">
          
          {/* Breadcrumb Navigation */}
          <div className="breadcrumb">
            <button onClick={handleBackToCodex} className="breadcrumb-link">
              The Codex
            </button>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">{entry.title}</span>
          </div>
          
          {/* Entry Header */}
          <header className="entry-header">
            <div className="entry-type-badge">
              <span className="type-icon">{getTypeIcon(entry.type)}</span>
              <span className="type-label">{entry.type}</span>
            </div>
            
            <h1 className="entry-title">{entry.title}</h1>
            
            {entry.subtitle && (
              <p className="entry-subtitle">{entry.subtitle}</p>
            )}
            
            {/* Metadata Row */}
            <div className="entry-metadata">
              {entry.era && (
                <span className="metadata-item">
                  <span className="metadata-label">Era:</span>
                  <span className="metadata-value">{entry.era}</span>
                </span>
              )}
              
              {entry.category && (
                <span className="metadata-item">
                  <span className="metadata-label">Category:</span>
                  <span className="metadata-value">{entry.category}</span>
                </span>
              )}
              
              {entry.wordCount > 0 && (
                <span className="metadata-item">
                  <span className="metadata-label">Words:</span>
                  <span className="metadata-value">{entry.wordCount.toLocaleString()}</span>
                </span>
              )}
            </div>
            
            {/* Tags */}
            {entry.tags && entry.tags.length > 0 && (
              <div className="entry-tags">
                {entry.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="entry-actions">
              <button onClick={handleEdit} className="action-button primary">
                <span className="button-icon">✏️</span>
                Edit Entry
              </button>
            </div>
          </header>
          
          {/* Divider */}
          <div className="entry-divider"></div>
          
          {/* Entry Content (Rendered Markdown) */}
          <article className="entry-content">
            <div 
              className="markdown-content"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />
          </article>
          
          {/* Future Feature: Backlinks Panel */}
          {/* Uncomment when ready to implement Phase 2 Week 2
          {backlinks && backlinks.length > 0 && (
            <>
              <div className="entry-divider"></div>
              <section className="backlinks-section">
                <h2 className="section-heading">Referenced In</h2>
                <p className="section-description">
                  Other entries that mention this one:
                </p>
                <ul className="backlinks-list">
                  {backlinks.map(link => (
                    <li key={link.id} className="backlink-item">
                      <button 
                        onClick={() => navigate(`/codex/entry/${link.sourceId}`)}
                        className="backlink-button"
                      >
                        View entry that references this
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}
          */}
          
          {/* Footer Metadata */}
          <footer className="entry-footer">
            <div className="footer-metadata">
              <span className="footer-item">
                Created: {formatDate(entry.created)}
              </span>
              {entry.updated && entry.updated !== entry.created && (
                <span className="footer-item">
                  Last updated: {formatDate(entry.updated)}
                </span>
              )}
            </div>
          </footer>
          
        </div>
      </div>
    </>
  );
}

export default CodexEntryView;
