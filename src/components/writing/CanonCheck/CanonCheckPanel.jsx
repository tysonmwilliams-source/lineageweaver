/**
 * CanonCheckPanel.jsx - Canon Validation Results Panel
 *
 * Displays the results of canon validation checks.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../icons';
import { ISSUE_TYPES } from '../../../services/canonCheckService';
import './CanonCheckPanel.css';

/**
 * IssueIcon - Get appropriate icon for issue type
 */
function IssueIcon({ type }) {
  switch (type) {
    case ISSUE_TYPES.ERROR:
      return <Icon name="alert-triangle" size={16} strokeWidth={2} />;
    case ISSUE_TYPES.WARNING:
      return <Icon name="alert-circle" size={16} strokeWidth={2} />;
    case ISSUE_TYPES.INFO:
    default:
      return <Icon name="info" size={16} strokeWidth={2} />;
  }
}

/**
 * IssueCard Component - Single issue display
 */
function IssueCard({ issue, onDismiss }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className={`canon-issue canon-issue--${issue.type}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      layout
    >
      <button
        className="canon-issue__header"
        onClick={() => setIsExpanded(!isExpanded)}
        type="button"
      >
        <div className="canon-issue__icon">
          <IssueIcon type={issue.type} />
        </div>
        <div className="canon-issue__content">
          <span className="canon-issue__title">{issue.title}</span>
          <span className="canon-issue__description">{issue.description}</span>
        </div>
        <Icon
          name={isExpanded ? 'chevron-down' : 'chevron-right'}
          size={14}
          strokeWidth={2}
          className="canon-issue__chevron"
        />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="canon-issue__details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {issue.suggestion && (
              <div className="canon-issue__suggestion">
                <Icon name="lightbulb" size={14} strokeWidth={2} />
                <span>{issue.suggestion}</span>
              </div>
            )}
            {issue.details && (
              <div className="canon-issue__extra">
                {issue.details}
              </div>
            )}
            <div className="canon-issue__actions">
              <button
                className="canon-issue__dismiss"
                onClick={(e) => {
                  e.stopPropagation();
                  onDismiss(issue.id);
                }}
                type="button"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * CanonCheckPanel Component
 *
 * @param {Object} props
 * @param {Array} props.issues - Array of issues from validation
 * @param {boolean} props.isChecking - Whether a check is in progress
 * @param {string} props.checkType - 'quick' or 'ai' to show what's running
 * @param {Function} props.onRunQuickCheck - Callback to run quick (rule-based) check
 * @param {Function} props.onRunAICheck - Callback to run AI-powered check
 * @param {Function} props.onDismissIssue - Callback to dismiss an issue
 * @param {Function} props.onClose - Callback to close panel
 * @param {Date} props.lastChecked - When last check was run
 */
export default function CanonCheckPanel({
  issues = [],
  isChecking = false,
  checkType = null,
  onRunQuickCheck,
  onRunAICheck,
  onDismissIssue,
  onClose,
  lastChecked
}) {
  // Group issues by type
  const errorCount = issues.filter(i => i.type === ISSUE_TYPES.ERROR).length;
  const warningCount = issues.filter(i => i.type === ISSUE_TYPES.WARNING).length;
  const infoCount = issues.filter(i => i.type === ISSUE_TYPES.INFO).length;

  return (
    <div className="canon-panel">
      {/* Header */}
      <div className="canon-panel__header">
        <div className="canon-panel__title">
          <Icon name="shield-check" size={20} strokeWidth={2} />
          <h3>Canon Check</h3>
        </div>
        <button
          className="canon-panel__close"
          onClick={onClose}
          type="button"
          title="Close"
        >
          <Icon name="x" size={18} strokeWidth={2} />
        </button>
      </div>

      {/* Summary */}
      <div className="canon-panel__summary">
        <div className={`canon-summary__stat canon-summary__stat--error ${errorCount > 0 ? 'canon-summary__stat--active' : ''}`}>
          <span className="canon-summary__count">{errorCount}</span>
          <span className="canon-summary__label">Errors</span>
        </div>
        <div className={`canon-summary__stat canon-summary__stat--warning ${warningCount > 0 ? 'canon-summary__stat--active' : ''}`}>
          <span className="canon-summary__count">{warningCount}</span>
          <span className="canon-summary__label">Warnings</span>
        </div>
        <div className={`canon-summary__stat canon-summary__stat--info ${infoCount > 0 ? 'canon-summary__stat--active' : ''}`}>
          <span className="canon-summary__count">{infoCount}</span>
          <span className="canon-summary__label">Info</span>
        </div>
      </div>

      {/* Check Buttons */}
      <div className="canon-panel__actions">
        <div className="canon-panel__buttons">
          <button
            className="canon-panel__check-btn canon-panel__check-btn--quick"
            onClick={onRunQuickCheck}
            disabled={isChecking}
            type="button"
            title="Fast rule-based validation"
          >
            {isChecking && checkType === 'quick' ? (
              <>
                <div className="loader-spinner loader-spinner--small" />
                Checking...
              </>
            ) : (
              <>
                <Icon name="zap" size={16} strokeWidth={2} />
                Quick Check
              </>
            )}
          </button>
          <button
            className="canon-panel__check-btn canon-panel__check-btn--ai"
            onClick={onRunAICheck}
            disabled={isChecking}
            type="button"
            title="Deep AI-powered analysis"
          >
            {isChecking && checkType === 'ai' ? (
              <>
                <div className="loader-spinner loader-spinner--small" />
                Analyzing...
              </>
            ) : (
              <>
                <Icon name="sparkles" size={16} strokeWidth={2} />
                AI Check
              </>
            )}
          </button>
        </div>
        {lastChecked && (
          <span className="canon-panel__last-check">
            Last: {lastChecked.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Issues List */}
      <div className="canon-panel__issues">
        {isChecking && issues.length === 0 && (
          <div className="canon-panel__checking">
            <div className="loader-spinner" />
            <span>
              {checkType === 'ai'
                ? 'AI is analyzing your writing for canon issues...'
                : 'Checking for canon issues...'}
            </span>
          </div>
        )}

        {!isChecking && issues.length === 0 && lastChecked && (
          <div className="canon-panel__no-issues">
            <Icon name="check-circle" size={32} strokeWidth={1.5} />
            <p>No issues found</p>
            <span>Your writing is consistent with your established lore.</span>
          </div>
        )}

        {!isChecking && issues.length === 0 && !lastChecked && (
          <div className="canon-panel__no-issues">
            <Icon name="shield" size={32} strokeWidth={1.5} />
            <p>Ready to check</p>
            <span>Run a canon check to validate your writing against your world data.</span>
          </div>
        )}

        <AnimatePresence>
          {issues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onDismiss={onDismissIssue}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
