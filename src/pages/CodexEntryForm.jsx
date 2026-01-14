/**
 * CodexEntryForm.jsx - Codex Entry Creation/Editing Form
 *
 * Handles creation and editing of codex entries.
 * Supports all 6 entry types with custom templates.
 * Features medieval manuscript aesthetic with animations.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  createEntry,
  updateEntry,
  getEntry
} from '../services/codexService';
import { updateHeraldry } from '../services/heraldryService';
import { useDataset } from '../contexts/DatasetContext';
import Navigation from '../components/Navigation';
import Icon from '../components/icons/Icon';
import ActionButton from '../components/shared/ActionButton';
import LoadingState from '../components/shared/LoadingState';
import './CodexEntryForm.css';

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

const TYPE_ICONS = {
  personage: 'users',
  house: 'castle',
  location: 'map',
  event: 'book-open',
  mysteria: 'sparkles',
  heraldry: 'shield',
  custom: 'file-text'
};

function CodexEntryForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const { activeDataset } = useDataset();

  const isEditing = Boolean(id);
  const initialType = searchParams.get('type') || 'personage';

  // Get heraldryId and title from URL params (for Armory integration)
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
    heraldryId: heraldryIdParam ? parseInt(heraldryIdParam) : null
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
      applyTemplate(initialType);
    }
  }, [id, isEditing, activeDataset]);

  async function loadEntry() {
    try {
      setLoading(true);
      const datasetId = activeDataset?.id;
      const entry = await getEntry(parseInt(id), datasetId);
      if (entry) {
        setFormData({
          type: entry.type,
          title: entry.title,
          subtitle: entry.subtitle || '',
          content: entry.content,
          tags: entry.tags || [],
          era: entry.era || '',
          category: entry.category || '',
          heraldryId: entry.heraldryId || null
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
      const datasetId = activeDataset?.id;

      const entryData = {
        type: formData.type,
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim() || null,
        content: formData.content.trim(),
        tags: formData.tags,
        era: formData.era.trim() || null,
        category: formData.category.trim() || null,
        heraldryId: formData.heraldryId || null
      };

      let codexEntryId;

      if (isEditing) {
        await updateEntry(parseInt(id), entryData, datasetId);
        codexEntryId = parseInt(id);
      } else {
        codexEntryId = await createEntry(entryData, datasetId);
      }

      // Bidirectional linking - update heraldry record with codexEntryId
      if (entryData.heraldryId && codexEntryId) {
        try {
          await updateHeraldry(entryData.heraldryId, { codexEntryId }, null, datasetId);
        } catch (linkError) {
          console.error('Warning: Failed to create bidirectional link:', linkError);
        }
      }

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
        <div className="codex-entry-form codex-entry-form--loading">
          <LoadingState message="Loading entry..." icon="scroll" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <motion.div
        className="codex-entry-form"
        variants={CONTAINER_VARIANTS}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.header className="codex-entry-form__header" variants={ITEM_VARIANTS}>
          <h1 className="codex-entry-form__title">
            <Icon name={isEditing ? 'pencil' : 'plus'} size={32} />
            <span>{isEditing ? 'Edit Entry' : 'Create New Entry'}</span>
          </h1>
          <p className="codex-entry-form__subtitle">
            Document the lore and history of your world
          </p>
        </motion.header>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="codex-entry-form__error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Icon name="alert-circle" size={20} />
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="codex-entry-form__error-close"
              >
                <Icon name="x" size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="codex-entry-form__content">
          {/* Entry Type Selector */}
          <motion.section className="codex-entry-form__section" variants={ITEM_VARIANTS}>
            <label className="codex-entry-form__label">
              <Icon name="layout-grid" size={16} />
              <span>Entry Type</span>
            </label>
            <div className="codex-entry-form__type-grid">
              {ENTRY_TYPES.map(type => (
                <motion.button
                  key={type.value}
                  type="button"
                  className={`codex-entry-form__type-option ${formData.type === type.value ? 'codex-entry-form__type-option--selected' : ''}`}
                  onClick={() => handleTypeChange(type.value)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon name={TYPE_ICONS[type.value] || 'file'} size={24} />
                  <span className="codex-entry-form__type-label">{type.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.section>

          {/* Title */}
          <motion.section className="codex-entry-form__section" variants={ITEM_VARIANTS}>
            <label className="codex-entry-form__label" htmlFor="title">
              <Icon name="type" size={16} />
              <span>Title</span>
              <span className="codex-entry-form__required">*</span>
            </label>
            <input
              id="title"
              type="text"
              className="codex-entry-form__input"
              placeholder="Enter the entry title..."
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </motion.section>

          {/* Subtitle */}
          <motion.section className="codex-entry-form__section" variants={ITEM_VARIANTS}>
            <label className="codex-entry-form__label" htmlFor="subtitle">
              <Icon name="minus" size={16} />
              <span>Subtitle</span>
            </label>
            <input
              id="subtitle"
              type="text"
              className="codex-entry-form__input"
              placeholder="Optional subtitle or tagline..."
              value={formData.subtitle}
              onChange={(e) => handleInputChange('subtitle', e.target.value)}
            />
          </motion.section>

          {/* Era and Category */}
          <motion.div className="codex-entry-form__row" variants={ITEM_VARIANTS}>
            <section className="codex-entry-form__section">
              <label className="codex-entry-form__label" htmlFor="era">
                <Icon name="calendar" size={16} />
                <span>Era / Time Period</span>
              </label>
              <input
                id="era"
                type="text"
                className="codex-entry-form__input"
                placeholder="e.g., Second Age, Pre-War..."
                value={formData.era}
                onChange={(e) => handleInputChange('era', e.target.value)}
              />
            </section>

            <section className="codex-entry-form__section">
              <label className="codex-entry-form__label" htmlFor="category">
                <Icon name="folder" size={16} />
                <span>Category</span>
              </label>
              <input
                id="category"
                type="text"
                className="codex-entry-form__input"
                placeholder="e.g., Nobility, Religion..."
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              />
            </section>
          </motion.div>

          {/* Tags */}
          <motion.section className="codex-entry-form__section" variants={ITEM_VARIANTS}>
            <label className="codex-entry-form__label">
              <Icon name="tags" size={16} />
              <span>Tags</span>
            </label>
            <div className="codex-entry-form__tags">
              <div className="codex-entry-form__tags-display">
                <AnimatePresence>
                  {formData.tags.map(tag => (
                    <motion.span
                      key={tag}
                      className="codex-entry-form__tag"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      {tag}
                      <button
                        type="button"
                        className="codex-entry-form__tag-remove"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <Icon name="x" size={12} />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
                {formData.tags.length === 0 && (
                  <span className="codex-entry-form__tags-empty">No tags added</span>
                )}
              </div>
              <form onSubmit={handleAddTag} className="codex-entry-form__tag-form">
                <input
                  type="text"
                  className="codex-entry-form__input"
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                />
                <ActionButton
                  type="submit"
                  icon="plus"
                  disabled={!tagInput.trim()}
                  variant="secondary"
                  size="sm"
                >
                  Add
                </ActionButton>
              </form>
            </div>
          </motion.section>

          {/* Content */}
          <motion.section className="codex-entry-form__section" variants={ITEM_VARIANTS}>
            <label className="codex-entry-form__label" htmlFor="content">
              <Icon name="file-text" size={16} />
              <span>Content</span>
              <span className="codex-entry-form__required">*</span>
            </label>
            <p className="codex-entry-form__hint">
              Use <code>[[Entry Name]]</code> to link to other entries
            </p>
            <textarea
              id="content"
              className="codex-entry-form__textarea"
              placeholder="Write your entry content here..."
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={20}
            />
          </motion.section>
        </div>

        {/* Footer Actions */}
        <motion.footer className="codex-entry-form__footer" variants={ITEM_VARIANTS}>
          <ActionButton
            type="button"
            onClick={handleCancel}
            disabled={saving}
            variant="ghost"
          >
            Cancel
          </ActionButton>
          <ActionButton
            type="button"
            icon={isEditing ? 'save' : 'plus'}
            onClick={handleSave}
            disabled={saving}
            variant="primary"
          >
            {saving ? 'Saving...' : (isEditing ? 'Update Entry' : 'Create Entry')}
          </ActionButton>
        </motion.footer>
      </motion.div>
    </>
  );
}

// ============================================
// ENTRY TYPES CONFIGURATION
// ============================================

const ENTRY_TYPES = [
  { value: 'personage', label: 'Personage' },
  { value: 'house', label: 'House' },
  { value: 'location', label: 'Location' },
  { value: 'event', label: 'Event' },
  { value: 'mysteria', label: 'Mysteria' },
  { value: 'heraldry', label: 'Heraldry' },
  { value: 'custom', label: 'Custom' }
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
