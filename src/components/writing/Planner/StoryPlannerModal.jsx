/**
 * StoryPlannerModal.jsx
 *
 * A modal wrapper for the StoryPlannerDashboard.
 * Allows users to access the full planner from the WritingEditor.
 * Supports navigation between different planner views.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../icons';
import StoryPlannerDashboard from './StoryPlannerDashboard';
import OutlineView from './OutlineView';
import TimelineView from './TimelineView';
import BeatSheetView from './BeatSheetView';
import CharacterArcsView from './CharacterArcsView';
import PlotThreadsView from './PlotThreadsView';
import StoryArcsView from './StoryArcsView';
import './StoryPlannerModal.css';

// Animation variants
const BACKDROP_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const MODAL_VARIANTS = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 300 }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.15 }
  }
};

// View name mappings for display
const VIEW_TITLES = {
  dashboard: 'Story Planner',
  outline: 'Story Outline',
  beats: 'Beat Sheet',
  timeline: 'Timeline',
  characters: 'Character Arcs',
  threads: 'Plot Threads',
  arcs: 'Story Arcs'
};

function StoryPlannerModal({
  isOpen,
  onClose,
  writingId,
  writingTitle,
  datasetId
}) {
  const modalRef = useRef(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [currentPlanId, setCurrentPlanId] = useState(null);

  // Reset view when modal closes
  useEffect(() => {
    if (!isOpen) {
      setActiveView('dashboard');
      setCurrentPlanId(null);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        // If in a sub-view, go back to dashboard first
        if (activeView !== 'dashboard') {
          setActiveView('dashboard');
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, activeView]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle navigation to different views
  const handleNavigateToView = (view, planId) => {
    if (planId) {
      setCurrentPlanId(planId);
    }
    setActiveView(view);
  };

  // Handle going back to dashboard
  const handleBack = () => {
    setActiveView('dashboard');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="story-planner-modal__backdrop"
          variants={BACKDROP_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={handleBackdropClick}
        >
          <motion.div
            ref={modalRef}
            className="story-planner-modal"
            variants={MODAL_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby="planner-modal-title"
          >
            {/* Header */}
            <header className="story-planner-modal__header">
              <div className="story-planner-modal__header-content">
                {activeView !== 'dashboard' && (
                  <button
                    className="story-planner-modal__back-btn"
                    onClick={handleBack}
                    aria-label="Back to dashboard"
                  >
                    <Icon name="arrow-left" size={20} />
                  </button>
                )}
                <Icon name="map" size={24} className="story-planner-modal__icon" />
                <div className="story-planner-modal__titles">
                  <h2 id="planner-modal-title" className="story-planner-modal__title">
                    {VIEW_TITLES[activeView] || 'Story Planner'}
                  </h2>
                  {writingTitle && (
                    <span className="story-planner-modal__subtitle">
                      {writingTitle}
                    </span>
                  )}
                </div>
              </div>
              <button
                className="story-planner-modal__close-btn"
                onClick={onClose}
                aria-label="Close planner"
              >
                <Icon name="x" size={20} />
              </button>
            </header>

            {/* Content */}
            <div className="story-planner-modal__content">
              {activeView === 'dashboard' && (
                <StoryPlannerDashboard
                  writingId={writingId}
                  writingTitle={writingTitle}
                  datasetId={datasetId}
                  onNavigateToView={handleNavigateToView}
                />
              )}

              {activeView === 'outline' && currentPlanId && (
                <OutlineView
                  storyPlanId={currentPlanId}
                  writingId={writingId}
                  onClose={handleBack}
                />
              )}

              {activeView === 'timeline' && currentPlanId && (
                <TimelineView
                  storyPlanId={currentPlanId}
                  writingId={writingId}
                  datasetId={datasetId}
                  onClose={handleBack}
                />
              )}

              {activeView === 'beats' && currentPlanId && (
                <BeatSheetView
                  storyPlanId={currentPlanId}
                  writingId={writingId}
                  datasetId={datasetId}
                  onClose={handleBack}
                />
              )}

              {activeView === 'characters' && currentPlanId && (
                <CharacterArcsView
                  storyPlanId={currentPlanId}
                  writingId={writingId}
                  datasetId={datasetId}
                  onClose={handleBack}
                />
              )}

              {activeView === 'threads' && currentPlanId && (
                <PlotThreadsView
                  storyPlanId={currentPlanId}
                  datasetId={datasetId}
                  onClose={handleBack}
                />
              )}

              {activeView === 'arcs' && currentPlanId && (
                <StoryArcsView
                  storyPlanId={currentPlanId}
                  datasetId={datasetId}
                  onClose={handleBack}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default StoryPlannerModal;
