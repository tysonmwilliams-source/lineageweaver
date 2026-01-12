import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import {
  createEntry,
  updateEntry,
  getEntry
} from '../services/codexService';
import { updateHeraldry } from '../services/heraldryService'; // PHASE 5 Batch 3
import Navigation from '../components/Navigation';
import './CodexEntryForm.css';

/**
 * Codex Entry Form
 * 
 * Handles creation and editing of codex entries.
 * Supports all 6 entry types with custom templates.
 */
function CodexEntryForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  
  const isEditing = Boolean(id);
  const initialType = searchParams.get('type') || 'personage';
  
  // PHASE 5 Batch 3: Get heraldryId and title from URL params (for Armory integration)
  const heraldryIdParam = searchParams.get('heraldryId');
  const titleParam = searchParams.get('title');
  
  // Form state
  const [formData, setFormData] = useState({
    type: initialType,
    title: titleParam || '',
    subtitle: '',
    content: '',
    tags: [],
    era: '',
    category: '',
    heraldryId: heraldryIdParam ? parseInt(heraldryIdParam) : null // PHASE 5 Batch 3
  });
  
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Load existing entry if editing
  useEffect(() => {
    if (isEditing) {
      loadEntry();
    } else {
      // Apply template for new entries
      applyTemplate(initialType);
    }
  }, [id, isEditing]);
  
  async function loadEntry() {
    try {
      setLoading(true);
      const entry = await getEntry(parseInt(id));
      if (entry) {
        setFormData({
          type: entry.type,
          title: entry.title,
          subtitle: entry.subtitle || '',
          content: entry.content,
          tags: entry.tags || [],
          era: entry.era || '',
          category: entry.category || '',
          heraldryId: entry.heraldryId || null // PHASE 5 Batch 3
        });
      } else {
        setError('Entry not found');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error loading entry:', err);
      setError('Failed to load entry');
      setLoading(false);
    }
  }
  
  function applyTemplate(type) {
    const template = ENTRY_TEMPLATES[type];
    if (template) {
      setFormData(prev => ({
        ...prev,
        type,
        content: template.content,
        category: template.defaultCategory || ''
      }));
    }
  }
  
  function handleTypeChange(newType) {
    setFormData(prev => ({
      ...prev,
      type: newType
    }));
    if (!isEditing) {
      applyTemplate(newType);
    }
  }
  
  function handleInputChange(field, value) {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }
  
  function handleAddTag(e) {
    e.preventDefault();
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  }
  
  function handleRemoveTag(tagToRemove) {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  }
  
  async function handleSave() {
    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      const entryData = {
        type: formData.type,
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim() || null,
        content: formData.content.trim(),
        tags: formData.tags,
        era: formData.era.trim() || null,
        category: formData.category.trim() || null,
        heraldryId: formData.heraldryId || null // PHASE 5 Batch 3
      };
      
      let codexEntryId;
      
      if (isEditing) {
        await updateEntry(parseInt(id), entryData);
        codexEntryId = parseInt(id);
      } else {
        codexEntryId = await createEntry(entryData);
      }
      
      // PHASE 5 Batch 3: Bidirectional linking - update heraldry record with codexEntryId
      if (entryData.heraldryId && codexEntryId) {
        try {
          await updateHeraldry(entryData.heraldryId, { codexEntryId });
          console.log('🔗 Bidirectional link created: Heraldry', entryData.heraldryId, '<-> Codex', codexEntryId);
        } catch (linkError) {
          // Don't fail the save if linking fails, just log it
          console.error('Warning: Failed to create bidirectional link:', linkError);
        }
      }
      
      // Navigate back to codex landing
      navigate('/codex');
    } catch (err) {
      console.error('Error saving entry:', err);
      setError('Failed to save entry');
      setSaving(false);
    }
  }
  
  function handleCancel() {
    if (window.confirm('Discard changes and return to Codex?')) {
      navigate('/codex');
    }
  }
  
  if (loading) {
    return (
      <>
        <Navigation />
        <div className="codex-entry-form loading">
          <div className="loading-spinner">
            <div className="text-4xl mb-4">📜</div>
            <p>Loading entry...</p>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Navigation />
      <div className="codex-entry-form">
        <header className="form-header">
          <h1 className="form-title">
            {isEditing ? 'Edit Entry' : 'Create New Entry'}
          </h1>
          <p className="form-subtitle">
            Document the lore and history of your world
          </p>
        </header>
        
        {error && (
          <div className="form-error">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
        
        <div className="form-content">
          {/* Entry Type Selector */}
          <section className="form-section">
            <label className="form-label">Entry Type</label>
            <div className="type-selector-grid">
              {ENTRY_TYPES.map(type => (
                <button
                  key={type.value}
                  type="button"
                  className={`type-option ${formData.type === type.value ? 'selected' : ''}`}
                  onClick={() => handleTypeChange(type.value)}
                >
                  <span className="type-icon">{type.icon}</span>
                  <span className="type-label">{type.label}</span>
                </button>
              ))}
            </div>
          </section>
          
          {/* Title */}
          <section className="form-section">
            <label className="form-label" htmlFor="title">
              Title *
            </label>
            <input
              id="title"
              type="text"
              className="form-input"
              placeholder="Enter the entry title..."
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </section>
          
          {/* Subtitle */}
          <section className="form-section">
            <label className="form-label" htmlFor="subtitle">
              Subtitle
            </label>
            <input
              id="subtitle"
              type="text"
              className="form-input"
              placeholder="Optional subtitle or tagline..."
              value={formData.subtitle}
              onChange={(e) => handleInputChange('subtitle', e.target.value)}
            />
          </section>
          
          {/* Era and Category */}
          <div className="form-row">
            <section className="form-section">
              <label className="form-label" htmlFor="era">
                Era / Time Period
              </label>
              <input
                id="era"
                type="text"
                className="form-input"
                placeholder="e.g., Second Age, Pre-War..."
                value={formData.era}
                onChange={(e) => handleInputChange('era', e.target.value)}
              />
            </section>
            
            <section className="form-section">
              <label className="form-label" htmlFor="category">
                Category
              </label>
              <input
                id="category"
                type="text"
                className="form-input"
                placeholder="e.g., Nobility, Religion..."
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              />
            </section>
          </div>
          
          {/* Tags */}
          <section className="form-section">
            <label className="form-label">Tags</label>
            <div className="tags-input-container">
              <div className="tags-display">
                {formData.tags.map(tag => (
                  <span key={tag} className="tag-pill">
                    {tag}
                    <button
                      type="button"
                      className="tag-remove"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <form onSubmit={handleAddTag} className="tag-input-form">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                />
                <button
                  type="submit"
                  className="tag-add-button"
                  disabled={!tagInput.trim()}
                >
                  Add
                </button>
              </form>
            </div>
          </section>
          
          {/* Content */}
          <section className="form-section">
            <label className="form-label" htmlFor="content">
              Content *
            </label>
            <div className="content-help">
              Use <code>[[Entry Name]]</code> to link to other entries
            </div>
            <textarea
              id="content"
              className="form-textarea"
              placeholder="Write your entry content here..."
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={20}
            />
          </section>
        </div>
        
        {/* Action Buttons */}
        <footer className="form-footer">
          <button
            type="button"
            className="form-button secondary"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            className="form-button primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : (isEditing ? 'Update Entry' : 'Create Entry')}
          </button>
        </footer>
      </div>
    </>
  );
}

// ============================================
// ENTRY TYPES CONFIGURATION
// ============================================

const ENTRY_TYPES = [
  { value: 'personage', label: 'Personage', icon: '👥' },
  { value: 'house', label: 'House', icon: '🏰' },
  { value: 'location', label: 'Location', icon: '🗺️' },
  { value: 'event', label: 'Event', icon: '📖' },
  { value: 'mysteria', label: 'Mysteria', icon: '🔮' },
  { value: 'heraldry', label: 'Heraldry', icon: '🛡️' },
  { value: 'custom', label: 'Custom', icon: '⚖️' }
];

// ============================================
// ENTRY TEMPLATES
// ============================================

const ENTRY_TEMPLATES = {
  personage: {
    content: `## Overview

[Brief description of who this person is]

## Background

**Born:** [Date/Era]
**Died:** [Date/Era, or "Living"]
**House:** [[House Name]]
**Titles:** [Any titles held]

## Life and Deeds

[Major events, accomplishments, or notable actions]

## Family

**Parents:** [[Parent 1]], [[Parent 2]]
**Spouse:** [[Spouse Name]]
**Children:** [[Child 1]], [[Child 2]]

## Legacy

[How this person is remembered or their impact on the world]`,
    defaultCategory: 'Historical Figures'
  },
  
  house: {
    content: `## Overview

[Brief description of this noble house/family]

## History

**Founded:** [Date/Era]
**Seat:** [[Location Name]]
**Sigil:** [Description of heraldic symbol]
**Words:** "[House motto/saying]"

## Notable Members

- [[Founder Name]] - [Brief note]
- [[Current Leader]] - [Brief note]

## Holdings and Influence

[Territories, resources, political power]

## Relations

**Allies:** [[House 1]], [[House 2]]
**Rivals:** [[House 3]]

## Current Status

[Present-day situation of the house]`,
    defaultCategory: 'Noble Houses'
  },
  
  location: {
    content: `## Overview

[Brief description of this place]

## Geography

**Region:** [Broader area it's part of]
**Type:** [City, fortress, forest, etc.]
**Climate:** [Weather and seasons]

## History

[How this place came to be, major events that occurred here]

## Notable Features

- [Feature 1]
- [Feature 2]
- [Feature 3]

## Inhabitants

[Who lives here, population, culture]

## Significance

[Why this place matters to your world]`,
    defaultCategory: 'Geography'
  },
  
  event: {
    content: `## Overview

[Brief description of what happened]

## When

**Date:** [Specific date or era]
**Duration:** [How long the event lasted]

## Where

**Location:** [[Location Name]]
**Scope:** [Local, regional, world-wide]

## Key Participants

- [[Person 1]] - [Their role]
- [[Person 2]] - [Their role]
- [[House/Faction]] - [Their involvement]

## What Happened

[Detailed account of the event]

## Consequences

[Immediate and long-term effects]

## Legacy

[How this event is remembered or changed the world]`,
    defaultCategory: 'Historical Events'
  },
  
  mysteria: {
    content: `## Overview

[Brief description of this magical/mysterious element]

## Nature

**Type:** [Magic system, artifact, prophecy, etc.]
**Origin:** [Where/how it came to be]

## Properties

[What it does, how it works, limitations]

## History

[First appearance, major uses, important events]

## Known Wielders/Keepers

- [[Person 1]] - [Their connection]
- [[Person 2]] - [Their connection]

## Current Status

[Where it is now, who has it, is it lost?]

## Significance

[Impact on your world and story]`,
    defaultCategory: 'Magic & Mystery'
  },
  
  heraldry: {
    content: `## Overview

[Brief description of this heraldic device and its significance]

## Blazon

**Technical Description:** [Formal heraldic blazon, e.g., "Argent, a lion rampant gules"]

## Symbolism

[Meaning behind the colors, charges, and design choices]

## History

**Created:** [Date/Era]
**Original Bearer:** [[Person or House Name]]
**Current Bearer:** [[Current holder]]

[History of this coat of arms - when it was granted, any modifications over time]

## Associated Houses & Bearers

- [[House Name]] - [Primary/Cadet branch]
- [[Person Name]] - [Relationship to arms]

## Heraldic Elements

**Field:** [Base color/pattern]
**Charges:** [Main symbols]
**Motto:** "[Associated motto if any]"

## Notable Appearances

[Where these arms have appeared in significant events, battles, ceremonies]

## Related Arms

- [[Related Heraldry 1]] - [Relationship, e.g., parent arms, cadet difference]
- [[Related Heraldry 2]] - [Relationship]`,
    defaultCategory: 'Heraldry'
  },
  
  custom: {
    content: `## Overview

[Brief description]

## Details

[Your custom content here]

## Significance

[Why this matters to your world]`,
    defaultCategory: 'Miscellaneous'
  }
};

export default CodexEntryForm;