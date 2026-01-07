import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEntry, getAllLinksForEntry, getEntry as getBacklinkEntry } from '../services/codexService';
import { parseWikiLinks, getContextSnippet } from '../utils/wikiLinkParser';
import Navigation from '../components/Navigation';
import './CodexEntryView.css';

/**
 * Codex Entry View Page - ENHANCED
 * 
 * Displays a single codex entry with:
 * - Rendered markdown content with wiki-links
 * - Entry metadata (type, tags, era)
 * - Edit button
 * - BACKLINKS PANEL - Shows all entries that reference this one
 */
function CodexEntryView() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [entry, setEntry] = useState(null);
  const [renderedContent, setRenderedContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Backlinks state
  const [backlinks, setBacklinks] = useState([]);
  const [backlinkDetails, setBacklinkDetails] = useState([]);
  const [loadingBacklinks, setLoadingBacklinks] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState({});
  
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
      
      // Load backlinks
      await loadBacklinks(entryData);
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading entry:', err);
      setError('Failed to load entry');
      setLoading(false);
    }
  }
  
  async function loadBacklinks(entryData) {
    try {
      setLoadingBacklinks(true);
      
      const links = await getAllLinksForEntry(entryData.id);
      const incomingLinks = links.incoming || [];
      
      setBacklinks(incomingLinks);
      
      // Load full details for each backlink
      if (incomingLinks.length > 0) {
        const details = await Promise.all(
          incomingLinks.map(async (link) => {
            const sourceEntry = await getBacklinkEntry(link.sourceId);
            
            // Extract context snippet
            const snippet = getContextSnippet(sourceEntry.content, entryData.title);
            
            return {
              ...link,
              entry: sourceEntry,
              snippet: snippet
            };
          })
        );
        
        setBacklinkDetails(details);
      }
      
      setLoadingBacklinks(false);
    } catch (err) {
      console.error('Error loading backlinks:', err);
      setLoadingBacklinks(false);
    }
  }
  
  function handleEdit() {
    navigate(`/codex/edit/${id}`);
  }
  
  function handleBackToCodex() {
    navigate('/codex');
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // 🔗 TREE-CODEX INTEGRATION: Navigate to Family Tree
  // ═══════════════════════════════════════════════════════════════════
  // When viewing a personage entry that's linked to a Person in the
  // genealogy database, this allows navigation to the Family Tree view.
  // The personId is stored in the entry when auto-created during person creation.
  // ═══════════════════════════════════════════════════════════════════
  function handleViewInFamilyTree() {
    // Navigate to the family tree page
    // TODO: In Phase 2, we can add query params to highlight the specific person
    // e.g., /tree?highlight=<personId>
    navigate('/tree');
  }
  
  function handleViewBacklink(backlinkId) {
    navigate(`/codex/entry/${backlinkId}`);
  }
  
  function toggleGroup(groupType) {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupType]: !prev[groupType]
    }));
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
  
  // Group backlinks by entry type
  function getGroupedBacklinks() {
    const grouped = {};
    
    backlinkDetails.forEach(backlink => {
      const type = backlink.entry.type;
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(backlink);
    });
    
    return grouped;
  }
  
  // Get type label (pluralized)
  function getTypeLabel(type, count) {
    const labels = {
      personage: count === 1 ? 'Personage' : 'Personages',
      house: count === 1 ? 'House' : 'Houses',
      location: count === 1 ? 'Location' : 'Locations',
      event: count === 1 ? 'Event' : 'Events',
      mysteria: count === 1 ? 'Mysteria' : 'Mysteria',
      custom: count === 1 ? 'Entry' : 'Entries'
    };
    return labels[type] || 'Entries';
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
  
  const groupedBacklinks = getGroupedBacklinks();
  const hasBacklinks = backlinkDetails.length > 0;
  
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
            
            {/* Reference Count Badge */}
            {hasBacklinks && (
              <div className="reference-count-badge">
                <span className="badge-icon">🔗</span>
                <span className="badge-text">
                  Referenced in {backlinkDetails.length} {backlinkDetails.length === 1 ? 'entry' : 'entries'}
                </span>
              </div>
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
              
              {/* 🔗 TREE-CODEX INTEGRATION: Show "View in Family Tree" for linked personages */}
              {entry.type === 'personage' && entry.personId && (
                <button onClick={handleViewInFamilyTree} className="action-button secondary">
                  <span className="button-icon">🌳</span>
                  View in Family Tree
                </button>
              )}
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
          
          {/* BACKLINKS PANEL */}
          <div className="entry-divider"></div>
          
          <section className="backlinks-section">
            <div className="backlinks-header">
              <h2 className="section-heading">
                <span className="heading-icon">🔗</span>
                Referenced In
              </h2>
              {loadingBacklinks && (
                <span className="loading-indicator">Loading...</span>
              )}
            </div>
            
            {!loadingBacklinks && !hasBacklinks && (
              <div className="backlinks-empty">
                <p className="empty-message">
                  No other entries reference this one yet.
                </p>
                <p className="empty-hint">
                  When other entries include <code>[[{entry.title}]]</code> in their content, they'll appear here.
                </p>
              </div>
            )}
            
            {!loadingBacklinks && hasBacklinks && (
              <div className="backlinks-content">
                <p className="section-description">
                  This entry is mentioned in {backlinkDetails.length} other {backlinkDetails.length === 1 ? 'entry' : 'entries'}:
                </p>
                
                {Object.entries(groupedBacklinks).map(([type, links]) => (
                  <div key={type} className="backlink-group">
                    <button 
                      className="backlink-group-header"
                      onClick={() => toggleGroup(type)}
                    >
                      <span className="group-icon">{getTypeIcon(type)}</span>
                      <span className="group-title">
                        {getTypeLabel(type, links.length)} ({links.length})
                      </span>
                      <span className={`collapse-icon ${collapsedGroups[type] ? 'collapsed' : 'expanded'}`}>
                        {collapsedGroups[type] ? '▶' : '▼'}
                      </span>
                    </button>
                    
                    {!collapsedGroups[type] && (
                      <ul className="backlinks-list">
                        {links.map(backlink => (
                          <li key={backlink.id} className="backlink-item">
                            <button 
                              onClick={() => handleViewBacklink(backlink.entry.id)}
                              className="backlink-button"
                            >
                              <div className="backlink-main">
                                <span className="backlink-icon">{getTypeIcon(backlink.entry.type)}</span>
                                <span className="backlink-title">{backlink.entry.title}</span>
                              </div>
                              {backlink.snippet && (
                                <div className="backlink-context">
                                  <span className="context-icon">💬</span>
                                  <span className="context-text">{backlink.snippet}</span>
                                </div>
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
          
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
