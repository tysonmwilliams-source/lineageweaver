/**
 * StatsGlance.jsx - Animated Statistics Dashboard
 * 
 * PURPOSE:
 * Shows the user their worldbuilding at a glance with animated count-up numbers.
 * Adapts to empty vs populated states - shows encouraging messages when empty.
 * 
 * ANIMATIONS:
 * - Count-up animation for numbers (0 → actual value)
 * - Staggered entrance for stat cards
 * - Subtle hover effects
 * 
 * FEATURES USED:
 * - statsGlance: Whether to show this section
 * - countUpAnimation: Whether numbers animate or appear instantly
 * - staggeredEntrance: Whether cards stagger in
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import Icon from '../icons';
import './StatsGlance.css';

// Animation variants defined outside component to prevent recreation on each render
const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  }
};

const CONTAINER_VARIANTS = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

/**
 * Custom hook for count-up animation
 * 
 * @param {number} end - Target number to count to
 * @param {number} duration - Animation duration in ms
 * @param {boolean} enabled - Whether to animate
 * @returns {number} Current animated value
 */
function useCountUp(end, duration = 1500, enabled = true) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const frameRef = useRef(null);
  
  useEffect(() => {
    if (!enabled || end === 0) {
      setCount(end);
      return;
    }
    
    const startTime = performance.now();
    countRef.current = 0;
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic for natural deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.round(easeOut * end);
      
      if (currentCount !== countRef.current) {
        countRef.current = currentCount;
        setCount(currentCount);
      }
      
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    
    frameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, duration, enabled]);
  
  return count;
}

/**
 * Individual stat card component
 */
function StatCard({ iconName, value, label, delay, features }) {
  const { countUpAnimation, staggeredEntrance, cardAnimations } = features;
  const displayValue = useCountUp(value, 1500, countUpAnimation);
  
  // Add delay to the shared variants
  const cardVariants = useMemo(() => ({
    ...CARD_VARIANTS,
    visible: {
      ...CARD_VARIANTS.visible,
      transition: {
        ...CARD_VARIANTS.visible.transition,
        delay: staggeredEntrance ? delay : 0
      }
    }
  }), [delay, staggeredEntrance]);
  
  return (
    <motion.div 
      className="stat-card"
      variants={staggeredEntrance ? cardVariants : {}}
      initial={staggeredEntrance ? "hidden" : false}
      animate={staggeredEntrance ? "visible" : false}
      whileHover={cardAnimations ? { 
        y: -4, 
        boxShadow: 'var(--shadow-lg)',
        transition: { duration: 0.2 }
      } : {}}
    >
      <span className="stat-icon">
        <Icon name={iconName} size={28} strokeWidth={1.5} />
      </span>
      <span className="stat-value">{displayValue}</span>
      <span className="stat-label">{label}</span>
    </motion.div>
  );
}

/**
 * StatsGlance Component
 * 
 * @param {Object} props
 * @param {Object} props.features - Feature flags
 * @param {Object} props.stats - Statistics object
 * @param {number} props.stats.people - Number of people
 * @param {number} props.stats.houses - Number of houses
 * @param {number} props.stats.relationships - Number of relationships
 * @param {number} props.stats.codexEntries - Number of codex entries
 * @param {number} props.stats.heraldry - Number of heraldry records
 */
export default function StatsGlance({ features, stats }) {
  const { statsGlance, staggeredEntrance } = features;
  
  // Don't render if feature is disabled
  if (!statsGlance) return null;
  
  const { people, houses, relationships, codexEntries, heraldry } = stats;
  const hasData = people > 0 || houses > 0;
  const totalItems = people + houses + codexEntries + heraldry;
  
  // Define the stats to display with Lucide icon names
  const statItems = [
    { iconName: 'users', value: people, label: 'People' },
    { iconName: 'castle', value: houses, label: 'Houses' },
    { iconName: 'heart', value: relationships, label: 'Bonds' },
    { iconName: 'book-open', value: codexEntries, label: 'Codex' },
    { iconName: 'shield', value: heraldry, label: 'Arms' },
  ];
  
  return (
    <section className="stats-glance">
      <motion.h2 
        className="stats-title"
        initial={staggeredEntrance ? { opacity: 0, y: -10 } : false}
        animate={staggeredEntrance ? { opacity: 1, y: 0 } : false}
        transition={{ duration: 0.4 }}
      >
        <Icon name="chart" size={24} className="section-title-icon" />
        {hasData ? 'Your World at a Glance' : 'Begin Your Chronicle'}
      </motion.h2>
      
      <motion.div 
        className="stats-grid"
        variants={staggeredEntrance ? CONTAINER_VARIANTS : {}}
        initial={staggeredEntrance ? "hidden" : false}
        animate={staggeredEntrance ? "visible" : false}
      >
        {statItems.map((stat, index) => (
          <StatCard
            key={stat.label}
            iconName={stat.iconName}
            value={stat.value}
            label={stat.label}
            delay={index * 0.1}
            features={features}
          />
        ))}
      </motion.div>
      
      {/* Encouraging message when empty or sparse */}
      {!hasData && (
        <motion.p 
          className="stats-empty-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Your world awaits. Add your first house or character to begin weaving your legacy.
        </motion.p>
      )}
      
      {hasData && totalItems < 20 && (
        <motion.p 
          className="stats-encouragement"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          A growing chronicle! Keep adding to enrich your world.
        </motion.p>
      )}
    </section>
  );
}
