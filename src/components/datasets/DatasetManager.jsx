/**
 * DatasetManager.jsx - Dataset Management Modal
 *
 * PURPOSE:
 * Provides a full-featured interface for managing datasets:
 * - Create new datasets
 * - Rename existing datasets
 * - Delete datasets (with confirmation)
 * - View dataset info
 *
 * Uses the shared Modal component and BEM CSS.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDataset } from '../../contexts/DatasetContext';
import Modal from '../Modal';
import Icon from '../icons';
import './DatasetManager.css';

// Animation variants for list items
const ITEM_VARIANTS = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 10 }
};

export default function DatasetManager({ isOpen, onClose }) {
  const {
    datasets,
    activeDataset,
    createDataset,
    renameDataset,
    deleteDataset,
    switchDataset,
    isLoading
  } = useDataset();

  // Local state
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Reset state when modal closes
  const handleClose = () => {
    setIsCreating(false);
    setNewName('');
    setEditingId(null);
    setEditName('');
    setDeletingId(null);
    setError(null);
    onClose();
  };

  // Create new dataset
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim() || processing) return;

    try {
      setProcessing(true);
      setError(null);
      await createDataset(newName.trim());
      setNewName('');
      setIsCreating(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  // Start editing a dataset name
  const startEditing = (dataset) => {
    setEditingId(dataset.id);
    setEditName(dataset.name);
    setError(null);
  };

  // Save renamed dataset
  const handleRename = async (e) => {
    e.preventDefault();
    if (!editName.trim() || processing) return;

    try {
      setProcessing(true);
      setError(null);
      await renameDataset(editingId, editName.trim());
      setEditingId(null);
      setEditName('');
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setError(null);
  };

  // Confirm delete
  const confirmDelete = (dataset) => {
    if (dataset.id === activeDataset?.id) {
      setError('Cannot delete the currently active dataset. Switch to another dataset first.');
      return;
    }
    if (datasets.length <= 1) {
      setError('Cannot delete the only dataset.');
      return;
    }
    setDeletingId(dataset.id);
    setError(null);
  };

  // Execute delete
  const handleDelete = async () => {
    if (!deletingId || processing) return;

    try {
      setProcessing(true);
      setError(null);
      await deleteDataset(deletingId);
      setDeletingId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeletingId(null);
    setError(null);
  };

  // Switch to dataset and close
  const handleSwitchAndClose = async (datasetId) => {
    if (activeDataset?.id === datasetId) return;

    try {
      setProcessing(true);
      await switchDataset(datasetId);
      handleClose();
      // Reload to refresh all data
      window.location.reload();
    } catch (err) {
      setError(err.message);
      setProcessing(false);
    }
  };

  // Get the dataset being deleted
  const datasetToDelete = deletingId ? datasets.find(d => d.id === deletingId) : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Manage Datasets"
      icon="database"
      size="md"
    >
      <div className="dataset-manager">
        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="dataset-manager__error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Icon name="alert-circle" size={16} />
              <span>{error}</span>
              <button
                className="dataset-manager__error-close"
                onClick={() => setError(null)}
              >
                <Icon name="x" size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation */}
        <AnimatePresence>
          {deletingId && datasetToDelete && (
            <motion.div
              className="dataset-manager__confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="dataset-manager__confirm-icon">
                <Icon name="alert-triangle" size={32} />
              </div>
              <h3 className="dataset-manager__confirm-title">Delete Dataset?</h3>
              <p className="dataset-manager__confirm-text">
                Are you sure you want to delete "{datasetToDelete.name}"?
                <strong> This will permanently delete all data in this dataset.</strong>
              </p>
              <div className="dataset-manager__confirm-actions">
                <button
                  className="dataset-manager__confirm-cancel"
                  onClick={cancelDelete}
                  disabled={processing}
                >
                  Cancel
                </button>
                <button
                  className="dataset-manager__confirm-delete"
                  onClick={handleDelete}
                  disabled={processing}
                >
                  {processing ? 'Deleting...' : 'Delete Dataset'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content - hidden during delete confirmation */}
        {!deletingId && (
          <>
            {/* Description */}
            <p className="dataset-manager__description">
              Datasets keep your genealogy projects separate. Each dataset has its own
              people, houses, relationships, and all other data.
            </p>

            {/* Dataset List */}
            <div className="dataset-manager__list">
              {isLoading ? (
                <div className="dataset-manager__loading">
                  <Icon name="loader" size={20} className="dataset-manager__spinner" />
                  <span>Loading datasets...</span>
                </div>
              ) : datasets.length === 0 ? (
                <div className="dataset-manager__empty">
                  <Icon name="folder-open" size={32} />
                  <p>No datasets yet. Create one to get started.</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {datasets.map(dataset => (
                    <motion.div
                      key={dataset.id}
                      className={`dataset-manager__item ${
                        activeDataset?.id === dataset.id
                          ? 'dataset-manager__item--active'
                          : ''
                      }`}
                      variants={ITEM_VARIANTS}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                    >
                      {editingId === dataset.id ? (
                        // Edit mode
                        <form
                          className="dataset-manager__edit-form"
                          onSubmit={handleRename}
                        >
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="dataset-manager__edit-input"
                            placeholder="Dataset name"
                            autoFocus
                            disabled={processing}
                          />
                          <div className="dataset-manager__edit-actions">
                            <button
                              type="button"
                              className="dataset-manager__edit-cancel"
                              onClick={cancelEditing}
                              disabled={processing}
                            >
                              <Icon name="x" size={16} />
                            </button>
                            <button
                              type="submit"
                              className="dataset-manager__edit-save"
                              disabled={!editName.trim() || processing}
                            >
                              <Icon name="check" size={16} />
                            </button>
                          </div>
                        </form>
                      ) : (
                        // Display mode
                        <>
                          <button
                            className="dataset-manager__item-main"
                            onClick={() => handleSwitchAndClose(dataset.id)}
                            disabled={activeDataset?.id === dataset.id || processing}
                          >
                            <Icon
                              name={activeDataset?.id === dataset.id ? 'check-circle' : 'circle'}
                              size={18}
                              className="dataset-manager__item-icon"
                            />
                            <span className="dataset-manager__item-name">
                              {dataset.name}
                            </span>
                            {dataset.isDefault && (
                              <span className="dataset-manager__item-badge">Default</span>
                            )}
                          </button>
                          <div className="dataset-manager__item-actions">
                            <button
                              className="dataset-manager__item-action"
                              onClick={() => startEditing(dataset)}
                              title="Rename dataset"
                              disabled={processing}
                            >
                              <Icon name="pencil" size={14} />
                            </button>
                            <button
                              className="dataset-manager__item-action dataset-manager__item-action--delete"
                              onClick={() => confirmDelete(dataset)}
                              title="Delete dataset"
                              disabled={
                                processing ||
                                activeDataset?.id === dataset.id ||
                                datasets.length <= 1
                              }
                            >
                              <Icon name="trash-2" size={14} />
                            </button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Create New Dataset */}
            <div className="dataset-manager__create">
              {isCreating ? (
                <form className="dataset-manager__create-form" onSubmit={handleCreate}>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="dataset-manager__create-input"
                    placeholder="New dataset name"
                    autoFocus
                    disabled={processing}
                  />
                  <div className="dataset-manager__create-actions">
                    <button
                      type="button"
                      className="dataset-manager__create-cancel"
                      onClick={() => {
                        setIsCreating(false);
                        setNewName('');
                      }}
                      disabled={processing}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="dataset-manager__create-submit"
                      disabled={!newName.trim() || processing}
                    >
                      {processing ? 'Creating...' : 'Create'}
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  className="dataset-manager__create-button"
                  onClick={() => setIsCreating(true)}
                  disabled={processing}
                >
                  <Icon name="plus" size={16} />
                  <span>New Dataset</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
