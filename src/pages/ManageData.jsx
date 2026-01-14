/**
 * ManageData.jsx - Data Management Page
 *
 * PURPOSE:
 * Central hub for managing genealogical data including:
 * - People (personages in the family tree)
 * - Houses (noble lineages and families)
 * - Relationships (connections between people)
 * - Import/Export functionality
 * - Data health and validation tools
 *
 * DESIGN:
 * Follows the medieval manuscript aesthetic established in Home.jsx
 * Uses Lucide icons, Framer Motion animations, and CSS custom properties
 *
 * STATE:
 * Uses GenealogyContext for shared state management.
 * Changes made here are immediately reflected in FamilyTree and vice versa.
 */

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGenealogy } from '../contexts/GenealogyContext';
import { useAuth } from '../contexts/AuthContext';
import { useDataset } from '../contexts/DatasetContext';
import Navigation from '../components/Navigation';
import Icon from '../components/icons';
import { LoadingState, SectionHeader, ActionButton, Card } from '../components/shared';
import Modal from '../components/Modal';
import PersonForm from '../components/PersonForm';
import PersonList from '../components/PersonList';
import HouseForm from '../components/HouseForm';
import HouseList from '../components/HouseList';
import RelationshipForm from '../components/RelationshipForm';
import RelationshipList from '../components/RelationshipList';
import CadetHouseCeremonyModal from '../components/CadetHouseCeremonyModal';
import ImportExportManager from '../components/ImportExportManager';
import DataHealthDashboard from '../components/DataHealthDashboard';
import BulkFamilyImportTool from '../components/BulkFamilyImportTool';
import BastardNameAudit from '../components/BastardNameAudit';
import { getMigrationStatus, runAllMigrations } from '../services/migrationService';
import './ManageData.css';

// Animation variants
const TAB_CONTENT_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 }
  }
};

// Tab configuration with Lucide icons
const TABS = [
  { id: 'people', label: 'People', icon: 'users' },
  { id: 'houses', label: 'Houses', icon: 'castle' },
  { id: 'relationships', label: 'Relationships', icon: 'link' },
  { id: 'import-export', label: 'Import/Export', icon: 'hard-drive' },
  { id: 'bulk-import', label: 'Bulk Import', icon: 'users-round' },
  { id: 'health', label: 'Data Health', icon: 'heart-pulse' },
  { id: 'maintenance', label: 'Maintenance', icon: 'wrench' }
];

/**
 * ManageData Component
 */
function ManageData() {
  // Shared state from context
  const {
    people,
    houses,
    relationships,
    loading,
    addPerson,
    updatePerson,
    deletePerson,
    addHouse,
    updateHouse,
    deleteHouse,
    addRelationship,
    updateRelationship,
    deleteRelationship,
    foundCadetHouse,
    deleteAllData
  } = useGenealogy();

  // Auth and dataset context for cloud sync
  const { user } = useAuth();
  const { activeDataset } = useDataset();

  // Local UI state
  const [activeTab, setActiveTab] = useState('people');

  // Modal states
  const [showPersonModal, setShowPersonModal] = useState(false);
  const [showHouseModal, setShowHouseModal] = useState(false);
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);
  const [showCadetModal, setShowCadetModal] = useState(false);

  // Editing states
  const [editingPerson, setEditingPerson] = useState(null);
  const [editingHouse, setEditingHouse] = useState(null);
  const [editingRelationship, setEditingRelationship] = useState(null);
  const [cadetFounder, setCadetFounder] = useState(null);
  const [cadetParentHouse, setCadetParentHouse] = useState(null);

  // Migration states
  const [migrationStatus, setMigrationStatus] = useState(null);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResults, setMigrationResults] = useState(null);

  // Load migration status when maintenance tab is active
  useEffect(() => {
    if (activeTab === 'maintenance') {
      getMigrationStatus()
        .then(setMigrationStatus)
        .catch(err => console.error('Error loading migration status:', err));
    }
  }, [activeTab]);

  // Migration handler
  const handleRunMigrations = useCallback(async () => {
    if (!window.confirm('Run data migrations?\n\nThis will create Codex entries for houses and dignities that don\'t have them.')) {
      return;
    }

    setIsMigrating(true);
    setMigrationResults(null);

    try {
      // Build sync context if user is logged in (enables cloud sync of created links)
      const syncContext = user?.uid && activeDataset?.id
        ? { userId: user.uid, datasetId: activeDataset.id }
        : null;

      const results = await runAllMigrations(syncContext);
      setMigrationResults(results);

      // Refresh migration status
      const newStatus = await getMigrationStatus();
      setMigrationStatus(newStatus);

      if (results.success) {
        alert(`Migration complete!\n\nHouses migrated: ${results.houses?.migrated || 0}\nDignities migrated: ${results.dignities?.migrated || 0}\nCross-links created: ${results.crossLinks?.totalLinked || 0}`);
      } else {
        alert(`Migration completed with ${results.errors.length} errors. Check console for details.`);
      }
    } catch (error) {
      alert('Migration failed: ' + error.message);
    } finally {
      setIsMigrating(false);
    }
  }, [user, activeDataset]);

  // Person handlers
  const handleAddPerson = useCallback(() => {
    setEditingPerson(null);
    setShowPersonModal(true);
  }, []);

  const handleEditPerson = useCallback((person) => {
    setEditingPerson(person);
    setShowPersonModal(true);
  }, []);

  const handleSavePerson = useCallback(async (personData) => {
    try {
      if (editingPerson) {
        await updatePerson(editingPerson.id, personData);
      } else {
        await addPerson(personData);
      }
      setShowPersonModal(false);
      setEditingPerson(null);
    } catch (error) {
      alert('Error saving person: ' + error.message);
    }
  }, [editingPerson, updatePerson, addPerson]);

  const handleDeletePerson = useCallback(async (person) => {
    if (!window.confirm(`Delete ${person.firstName} ${person.lastName}? This will also delete their relationships.`)) {
      return;
    }
    try {
      await deletePerson(person.id);
    } catch (error) {
      alert('Error deleting person: ' + error.message);
    }
  }, [deletePerson]);

  // House handlers
  const handleAddHouse = useCallback(() => {
    setEditingHouse(null);
    setShowHouseModal(true);
  }, []);

  const handleEditHouse = useCallback((house) => {
    setEditingHouse(house);
    setShowHouseModal(true);
  }, []);

  const handleSaveHouse = useCallback(async (houseData) => {
    try {
      if (editingHouse) {
        await updateHouse(editingHouse.id, houseData);
      } else {
        await addHouse(houseData);
      }
      setShowHouseModal(false);
      setEditingHouse(null);
    } catch (error) {
      alert('Error saving house: ' + error.message);
    }
  }, [editingHouse, updateHouse, addHouse]);

  const handleDeleteHouse = useCallback(async (house) => {
    if (!window.confirm(`Delete ${house.houseName}?`)) return;
    try {
      await deleteHouse(house.id);
    } catch (error) {
      alert('Error deleting house: ' + error.message);
    }
  }, [deleteHouse]);

  // Relationship handlers
  const handleAddRelationship = useCallback(() => {
    setEditingRelationship(null);
    setShowRelationshipModal(true);
  }, []);

  const handleEditRelationship = useCallback((relationship) => {
    setEditingRelationship(relationship);
    setShowRelationshipModal(true);
  }, []);

  const handleSaveRelationship = useCallback(async (relationshipData) => {
    try {
      if (editingRelationship) {
        await updateRelationship(editingRelationship.id, relationshipData);
      } else {
        await addRelationship(relationshipData);
      }
      setShowRelationshipModal(false);
      setEditingRelationship(null);
    } catch (error) {
      alert('Error saving relationship: ' + error.message);
    }
  }, [editingRelationship, updateRelationship, addRelationship]);

  const handleDeleteRelationship = useCallback(async (relationship) => {
    if (!window.confirm('Delete this relationship?')) return;
    try {
      await deleteRelationship(relationship.id);
    } catch (error) {
      alert('Error deleting relationship: ' + error.message);
    }
  }, [deleteRelationship]);

  // Cadet house handlers
  const handleFoundCadetHouse = useCallback(async (ceremonyData) => {
    try {
      const result = await foundCadetHouse(ceremonyData);
      alert(`Cadet house ${result.house.houseName} founded successfully!`);
      setShowCadetModal(false);
      setCadetFounder(null);
      setCadetParentHouse(null);
    } catch (error) {
      alert('Error founding cadet house: ' + error.message);
    }
  }, [foundCadetHouse]);

  // Reset all data handler
  const handleResetAllData = useCallback(async () => {
    const confirmMessage = `This will DELETE:\n\n` +
      `- All ${people.length} people\n` +
      `- All ${houses.length} houses\n` +
      `- All ${relationships.length} relationships\n\n` +
      `This action CANNOT be undone!\n\nAre you absolutely sure?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    const confirmText = window.prompt(
      'To confirm, please type: DELETE ALL\n\n(Type exactly as shown, in uppercase)'
    );

    if (confirmText !== 'DELETE ALL') {
      alert('Reset cancelled. Data is safe.');
      return;
    }

    try {
      await deleteAllData();
      alert('All data has been deleted. You can now start fresh!');
    } catch (error) {
      alert('Error resetting data: ' + error.message);
    }
  }, [people.length, houses.length, relationships.length, deleteAllData]);

  // Get count for tab badge
  const getTabCount = useCallback((tabId) => {
    switch (tabId) {
      case 'people': return people.length;
      case 'houses': return houses.length;
      case 'relationships': return relationships.length;
      default: return null;
    }
  }, [people.length, houses.length, relationships.length]);

  // Loading state
  if (loading) {
    return (
      <>
        <Navigation />
        <div className="manage-page">
          <div className="manage-container">
            <LoadingState message="Loading your genealogy data..." size="lg" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="manage-page">
        <div className="manage-container">
          <motion.div
            className="manage-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Hero Section */}
            <motion.header
              className="manage-hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="manage-hero__title">
                <span className="manage-hero__initial">D</span>
                <span>ATA MANAGEMENT</span>
              </h1>
              <p className="manage-hero__subtitle">
                Organize and maintain your genealogical records
              </p>
              <div className="manage-hero__divider">
                <Icon name="database" size={20} className="manage-hero__divider-icon" />
              </div>
            </motion.header>

            {/* Quick Stats */}
            <motion.section
              className="manage-stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="manage-stats__grid">
                <div className="manage-stats__item">
                  <Icon name="users" size={20} className="manage-stats__icon" />
                  <span className="manage-stats__value">{people.length}</span>
                  <span className="manage-stats__label">People</span>
                </div>
                <div className="manage-stats__item">
                  <Icon name="castle" size={20} className="manage-stats__icon" />
                  <span className="manage-stats__value">{houses.length}</span>
                  <span className="manage-stats__label">Houses</span>
                </div>
                <div className="manage-stats__item">
                  <Icon name="link" size={20} className="manage-stats__icon" />
                  <span className="manage-stats__value">{relationships.length}</span>
                  <span className="manage-stats__label">Relationships</span>
                </div>
              </div>
            </motion.section>

            {/* Tabs Card */}
            <motion.section
              className="manage-tabs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="manage-tabs__card" padding="none">
                {/* Tab Navigation */}
                <div className="manage-tabs__nav">
                  {TABS.map(tab => {
                    const count = getTabCount(tab.id);
                    return (
                      <button
                        key={tab.id}
                        className={`manage-tabs__button ${activeTab === tab.id ? 'manage-tabs__button--active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <Icon name={tab.icon} size={18} />
                        <span className="manage-tabs__button-label">{tab.label}</span>
                        {count !== null && (
                          <span className="manage-tabs__button-count">{count}</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Tab Content */}
                <div className="manage-tabs__content">
                  <AnimatePresence mode="wait">
                    {/* People Tab */}
                    {activeTab === 'people' && (
                      <motion.div
                        key="people"
                        className="manage-panel"
                        variants={TAB_CONTENT_VARIANTS}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <div className="manage-panel__header">
                          <SectionHeader icon="users" title="People" size="sm" />
                          <ActionButton icon="plus" variant="primary" onClick={handleAddPerson}>
                            Add Person
                          </ActionButton>
                        </div>
                        <PersonList
                          people={people}
                          houses={houses}
                          onEdit={handleEditPerson}
                          onDelete={handleDeletePerson}
                        />
                      </motion.div>
                    )}

                    {/* Houses Tab */}
                    {activeTab === 'houses' && (
                      <motion.div
                        key="houses"
                        className="manage-panel"
                        variants={TAB_CONTENT_VARIANTS}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <div className="manage-panel__header">
                          <SectionHeader icon="castle" title="Houses" size="sm" />
                          <ActionButton icon="plus" variant="primary" onClick={handleAddHouse}>
                            Add House
                          </ActionButton>
                        </div>
                        <HouseList
                          houses={houses}
                          onEdit={handleEditHouse}
                          onDelete={handleDeleteHouse}
                        />
                      </motion.div>
                    )}

                    {/* Relationships Tab */}
                    {activeTab === 'relationships' && (
                      <motion.div
                        key="relationships"
                        className="manage-panel"
                        variants={TAB_CONTENT_VARIANTS}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <div className="manage-panel__header">
                          <SectionHeader icon="link" title="Relationships" size="sm" />
                          <ActionButton icon="plus" variant="primary" onClick={handleAddRelationship}>
                            Add Relationship
                          </ActionButton>
                        </div>
                        <RelationshipList
                          relationships={relationships}
                          people={people}
                          onEdit={handleEditRelationship}
                          onDelete={handleDeleteRelationship}
                        />
                      </motion.div>
                    )}

                    {/* Import/Export Tab */}
                    {activeTab === 'import-export' && (
                      <motion.div
                        key="import-export"
                        className="manage-panel"
                        variants={TAB_CONTENT_VARIANTS}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <ImportExportManager />
                      </motion.div>
                    )}

                    {/* Bulk Family Import Tab */}
                    {activeTab === 'bulk-import' && (
                      <motion.div
                        key="bulk-import"
                        className="manage-panel"
                        variants={TAB_CONTENT_VARIANTS}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <BulkFamilyImportTool />
                      </motion.div>
                    )}

                    {/* Data Health Tab */}
                    {activeTab === 'health' && (
                      <motion.div
                        key="health"
                        className="manage-panel"
                        variants={TAB_CONTENT_VARIANTS}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <DataHealthDashboard
                          isDarkTheme={true}
                          onNavigateToPerson={(personId) => {
                            const person = people.find(p => p.id === personId);
                            if (person) handleEditPerson(person);
                          }}
                          onNavigateToRelationship={(relId) => {
                            const rel = relationships.find(r => r.id === relId);
                            if (rel) handleEditRelationship(rel);
                          }}
                        />
                      </motion.div>
                    )}

                    {/* Maintenance Tab */}
                    {activeTab === 'maintenance' && (
                      <motion.div
                        key="maintenance"
                        className="manage-panel"
                        variants={TAB_CONTENT_VARIANTS}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <div className="manage-panel__header">
                          <SectionHeader icon="wrench" title="Data Maintenance" size="sm" />
                        </div>

                        {/* Migration Status */}
                        <div className="maintenance-section">
                          <h3 className="maintenance-section__title">
                            <Icon name="database" size={18} />
                            Data Integration Status
                          </h3>
                          <p className="maintenance-section__description">
                            Ensure all houses and dignities have corresponding Codex entries for full system integration.
                          </p>

                          {migrationStatus ? (
                            <div className="maintenance-status">
                              <div className="maintenance-status__item">
                                <div className="maintenance-status__label">
                                  <Icon name="castle" size={16} />
                                  Houses
                                </div>
                                <div className="maintenance-status__values">
                                  <span className="maintenance-status__count">{migrationStatus.houses.withCodex}</span>
                                  <span className="maintenance-status__separator">/</span>
                                  <span className="maintenance-status__total">{migrationStatus.houses.total}</span>
                                  <span className="maintenance-status__label-text">with Codex</span>
                                </div>
                                {migrationStatus.houses.needsMigration > 0 && (
                                  <span className="maintenance-status__badge maintenance-status__badge--warning">
                                    {migrationStatus.houses.needsMigration} need migration
                                  </span>
                                )}
                                {migrationStatus.houses.needsMigration === 0 && (
                                  <span className="maintenance-status__badge maintenance-status__badge--success">
                                    <Icon name="check" size={12} /> Complete
                                  </span>
                                )}
                              </div>

                              <div className="maintenance-status__item">
                                <div className="maintenance-status__label">
                                  <Icon name="crown" size={16} />
                                  Dignities
                                </div>
                                <div className="maintenance-status__values">
                                  <span className="maintenance-status__count">{migrationStatus.dignities.withCodex}</span>
                                  <span className="maintenance-status__separator">/</span>
                                  <span className="maintenance-status__total">{migrationStatus.dignities.total}</span>
                                  <span className="maintenance-status__label-text">with Codex</span>
                                </div>
                                {migrationStatus.dignities.needsMigration > 0 && (
                                  <span className="maintenance-status__badge maintenance-status__badge--warning">
                                    {migrationStatus.dignities.needsMigration} need migration
                                  </span>
                                )}
                                {migrationStatus.dignities.needsMigration === 0 && (
                                  <span className="maintenance-status__badge maintenance-status__badge--success">
                                    <Icon name="check" size={12} /> Complete
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <LoadingState message="Loading migration status..." size="sm" />
                          )}

                          {/* Cross-Links Status */}
                          {migrationStatus?.crossLinks && (
                            <div className="maintenance-status" style={{ marginTop: 'var(--space-4)' }}>
                              <div className="maintenance-status__item">
                                <div className="maintenance-status__label">
                                  <Icon name="link" size={16} />
                                  Person ↔ House
                                </div>
                                <div className="maintenance-status__values">
                                  <span className="maintenance-status__count">{migrationStatus.crossLinks.personHouse.existing}</span>
                                  <span className="maintenance-status__separator">/</span>
                                  <span className="maintenance-status__total">{migrationStatus.crossLinks.personHouse.potential}</span>
                                  <span className="maintenance-status__label-text">links</span>
                                </div>
                                {migrationStatus.crossLinks.personHouse.existing < migrationStatus.crossLinks.personHouse.potential ? (
                                  <span className="maintenance-status__badge maintenance-status__badge--warning">
                                    Needs linking
                                  </span>
                                ) : migrationStatus.crossLinks.personHouse.potential > 0 && (
                                  <span className="maintenance-status__badge maintenance-status__badge--success">
                                    <Icon name="check" size={12} /> Complete
                                  </span>
                                )}
                              </div>

                              <div className="maintenance-status__item">
                                <div className="maintenance-status__label">
                                  <Icon name="link" size={16} />
                                  Person ↔ Dignity
                                </div>
                                <div className="maintenance-status__values">
                                  <span className="maintenance-status__count">{migrationStatus.crossLinks.personDignity.existing}</span>
                                  <span className="maintenance-status__separator">/</span>
                                  <span className="maintenance-status__total">{migrationStatus.crossLinks.personDignity.potential}</span>
                                  <span className="maintenance-status__label-text">links</span>
                                </div>
                                {migrationStatus.crossLinks.personDignity.existing < migrationStatus.crossLinks.personDignity.potential ? (
                                  <span className="maintenance-status__badge maintenance-status__badge--warning">
                                    Needs linking
                                  </span>
                                ) : migrationStatus.crossLinks.personDignity.potential > 0 && (
                                  <span className="maintenance-status__badge maintenance-status__badge--success">
                                    <Icon name="check" size={12} /> Complete
                                  </span>
                                )}
                              </div>

                              <div className="maintenance-status__item">
                                <div className="maintenance-status__label">
                                  <Icon name="link" size={16} />
                                  House ↔ Dignity
                                </div>
                                <div className="maintenance-status__values">
                                  <span className="maintenance-status__count">{migrationStatus.crossLinks.houseDignity.existing}</span>
                                  <span className="maintenance-status__separator">/</span>
                                  <span className="maintenance-status__total">{migrationStatus.crossLinks.houseDignity.potential}</span>
                                  <span className="maintenance-status__label-text">links</span>
                                </div>
                                {migrationStatus.crossLinks.houseDignity.existing < migrationStatus.crossLinks.houseDignity.potential ? (
                                  <span className="maintenance-status__badge maintenance-status__badge--warning">
                                    Needs linking
                                  </span>
                                ) : migrationStatus.crossLinks.houseDignity.potential > 0 && (
                                  <span className="maintenance-status__badge maintenance-status__badge--success">
                                    <Icon name="check" size={12} /> Complete
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {migrationStatus?.needsMigration && (
                            <div className="maintenance-actions">
                              <ActionButton
                                icon={isMigrating ? 'loader' : 'play'}
                                variant="primary"
                                onClick={handleRunMigrations}
                                disabled={isMigrating}
                              >
                                {isMigrating ? 'Running Migrations...' : 'Run Migrations'}
                              </ActionButton>
                              <p className="maintenance-actions__note">
                                Creates Codex entries and cross-links for full data integration.
                              </p>
                            </div>
                          )}

                          {migrationResults && (
                            <div className={`maintenance-results ${migrationResults.success ? 'maintenance-results--success' : 'maintenance-results--error'}`}>
                              <h4>
                                <Icon name={migrationResults.success ? 'check-circle' : 'alert-circle'} size={16} />
                                Migration Results
                              </h4>
                              <ul>
                                <li>Houses migrated: {migrationResults.houses?.migrated || 0}</li>
                                <li>Dignities migrated: {migrationResults.dignities?.migrated || 0}</li>
                                <li>Cross-links created: {migrationResults.crossLinks?.totalLinked || 0}</li>
                                {migrationResults.errors.length > 0 && (
                                  <li className="maintenance-results__errors">Errors: {migrationResults.errors.length}</li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Bastard Naming Audit */}
                        <div className="maintenance-section" style={{ marginTop: 'var(--space-6)' }}>
                          <BastardNameAudit
                            people={people}
                            houses={houses}
                            onUpdatePerson={updatePerson}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.section>

            {/* Danger Zone */}
            <motion.section
              className="manage-danger"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="manage-danger__card">
                <div className="manage-danger__header">
                  <Icon name="alert-triangle" size={24} className="manage-danger__icon" />
                  <div className="manage-danger__info">
                    <h3 className="manage-danger__title">Danger Zone</h3>
                    <p className="manage-danger__description">
                      Permanently delete all people, houses, and relationships. This action cannot be undone.
                    </p>
                  </div>
                </div>
                <motion.button
                  className="manage-danger__button"
                  onClick={handleResetAllData}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon name="trash-2" size={18} />
                  Reset All Data
                </motion.button>
              </div>
            </motion.section>

            {/* Footer */}
            <footer className="manage-footer">
              <p>Careful stewardship of your lineage records</p>
            </footer>
          </motion.div>
        </div>
      </div>

      {/* Modals */}

      {/* Person Modal */}
      <Modal
        isOpen={showPersonModal}
        onClose={() => {
          setShowPersonModal(false);
          setEditingPerson(null);
        }}
        title={editingPerson ? 'Edit Person' : 'Add Person'}
      >
        <PersonForm
          person={editingPerson}
          houses={houses}
          onSave={handleSavePerson}
          onCancel={() => {
            setShowPersonModal(false);
            setEditingPerson(null);
          }}
        />
      </Modal>

      {/* House Modal */}
      <Modal
        isOpen={showHouseModal}
        onClose={() => {
          setShowHouseModal(false);
          setEditingHouse(null);
        }}
        title={editingHouse ? 'Edit House' : 'Add House'}
      >
        <HouseForm
          house={editingHouse}
          people={people}
          onSave={handleSaveHouse}
          onCancel={() => {
            setShowHouseModal(false);
            setEditingHouse(null);
          }}
        />
      </Modal>

      {/* Relationship Modal */}
      <Modal
        isOpen={showRelationshipModal}
        onClose={() => {
          setShowRelationshipModal(false);
          setEditingRelationship(null);
        }}
        title={editingRelationship ? 'Edit Relationship' : 'Add Relationship'}
      >
        <RelationshipForm
          relationship={editingRelationship}
          people={people}
          allRelationships={relationships}
          onSave={handleSaveRelationship}
          onCancel={() => {
            setShowRelationshipModal(false);
            setEditingRelationship(null);
          }}
          onSuggestionAccept={async (suggestion) => {
            if (suggestion.action.type === 'addRelationship') {
              try {
                await addRelationship(suggestion.action.data);
              } catch (error) {
                console.error('Error applying suggestion:', error);
              }
            }
          }}
        />
      </Modal>

      {/* Cadet House Ceremony Modal */}
      {showCadetModal && cadetFounder && cadetParentHouse && (
        <Modal
          isOpen={showCadetModal}
          onClose={() => {
            setShowCadetModal(false);
            setCadetFounder(null);
            setCadetParentHouse(null);
          }}
          title="Found Cadet House"
        >
          <CadetHouseCeremonyModal
            founder={cadetFounder}
            parentHouse={cadetParentHouse}
            onFound={handleFoundCadetHouse}
            onCancel={() => {
              setShowCadetModal(false);
              setCadetFounder(null);
              setCadetParentHouse(null);
            }}
          />
        </Modal>
      )}
    </>
  );
}

export default ManageData;
