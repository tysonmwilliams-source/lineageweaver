/**
 * SystemCard.jsx - Enhanced Navigation Card for Major Systems
 * 
 * PURPOSE:
 * A visually rich card for navigating to one of the four major systems:
 * Family Tree, The Codex, The Armory, and Data Management.
 * 
 * ANIMATIONS:
 * - Entrance animation (fade + slide)
 * - Hover lift effect with shadow
 * - Icon animation on hover
 * 
 * FEATURES USED:
 * - cardAnimations: Hover effects
 * - staggeredEntrance: Entrance animation
 */

import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../icons';
import './SystemCard.css';

// Base animation variants defined outside component
const BASE_CARD_VARIANTS = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

/**
 * SystemCard Component
 * 
 * @param {Object} props
 * @param {string} props.iconName - Lucide icon name for the system
 * @param {string} props.title - System name
 * @param {string} props.subtitle - Brief description
 * @param {string} props.path - Navigation path
 * @param {string} props.accentColor - Optional accent color class
 * @param {Object} props.preview - Optional preview content
 * @param {number} props.delay - Animation delay for stagger
 * @param {Object} props.features - Feature flags
 */
export default function SystemCard({ 
  iconName, 
  title, 
  subtitle, 
  path, 
  accentColor,
  preview,
  delay = 0,
  features 
}) {
  const navigate = useNavigate();
  const { cardAnimations, staggeredEntrance } = features;
  
  // Memoize click handler
  const handleClick = useCallback(() => {
    navigate(path);
  }, [navigate, path]);
  
  // Memoize variants with delay
  const cardVariants = useMemo(() => ({
    ...BASE_CARD_VARIANTS,
    visible: {
      ...BASE_CARD_VARIANTS.visible,
      transition: {
        ...BASE_CARD_VARIANTS.visible.transition,
        delay: staggeredEntrance ? delay : 0
      }
    }
  }), [delay, staggeredEntrance]);
  
  return (
    <motion.article
      className={`system-card ${accentColor || ''}`}
      variants={staggeredEntrance ? cardVariants : {}}
      initial={staggeredEntrance ? "hidden" : false}
      animate={staggeredEntrance ? "visible" : false}
      whileHover={cardAnimations ? { 
        y: -8,
        transition: { duration: 0.2, ease: 'easeOut' }
      } : {}}
      whileTap={cardAnimations ? { scale: 0.98 } : {}}
      onClick={handleClick}
    >
      {/* Icon with animation */}
      <motion.div 
        className="system-icon"
        whileHover={cardAnimations ? { 
          scale: 1.1,
          rotate: [0, -5, 5, 0],
          transition: { duration: 0.3 }
        } : {}}
      >
        <Icon name={iconName} size={36} strokeWidth={1.5} />
      </motion.div>
      
      {/* Title and subtitle */}
      <div className="system-content">
        <h3 className="system-title">{title}</h3>
        <p className="system-subtitle">{subtitle}</p>
      </div>
      
      {/* Optional preview area */}
      {preview && (
        <div className="system-preview">
          {preview}
        </div>
      )}
      
      {/* Arrow indicator */}
      <div className="system-arrow">
        <Icon name="arrow-right" size={20} strokeWidth={2} />
      </div>
    </motion.article>
  );
}
