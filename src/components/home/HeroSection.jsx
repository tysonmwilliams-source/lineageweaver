/**
 * HeroSection.jsx - Animated Hero Section for Home Page
 * 
 * PURPOSE:
 * Creates an evocative, animated header that sets the medieval fantasy tone
 * for LineageWeaver. Features the app title with optional decorative elements.
 * 
 * ANIMATIONS:
 * - Title fades in with subtle scale effect
 * - Subtitle slides up with delay
 * - Decorative flourishes draw in (SVG path animation)
 * - Optional particle/mote effects
 * 
 * FEATURES USED:
 * - heroAnimations: Main title animation
 * - decorativeFlourishes: SVG corner decorations
 */

import { motion } from 'framer-motion';
import './HeroSection.css';

/**
 * Fleur-de-lis SVG component for decorative divider
 */
function FleurDeLis({ size = 24, className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor"
      className={`fleur-de-lis ${className}`}
      aria-hidden="true"
    >
      <path d="M12 2C12 2 9.5 5 9.5 7.5C9.5 9.5 10.5 10.5 10.5 10.5C10.5 10.5 8 9.5 6 11C4 12.5 4.5 15 4.5 15C4.5 15 6 14 7.5 14.5C9 15 9 16.5 9 16.5L9 20L7 22L12 20L17 22L15 20L15 16.5C15 16.5 15 15 16.5 14.5C18 14 19.5 15 19.5 15C19.5 15 20 12.5 18 11C16 9.5 13.5 10.5 13.5 10.5C13.5 10.5 14.5 9.5 14.5 7.5C14.5 5 12 2 12 2Z" />
    </svg>
  );
}

/**
 * HeroSection Component
 * 
 * @param {Object} props
 * @param {Object} props.features - Feature flags from parent
 */
export default function HeroSection({ features }) {
  const { heroAnimations, decorativeFlourishes } = features;
  
  // Animation variants for the title
  const titleVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      filter: 'blur(10px)'
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] // Custom easing
      }
    }
  };
  
  // Animation variants for subtitle
  const subtitleVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.3,
        ease: 'easeOut'
      }
    }
  };
  
  // Animation for decorative elements
  const flourishVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: {
        duration: 1.5,
        delay: 0.5,
        ease: 'easeInOut'
      }
    }
  };
  
  // Container variants for stagger effect
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  return (
    <motion.header 
      className="hero-section"
      variants={heroAnimations ? containerVariants : {}}
      initial={heroAnimations ? "hidden" : false}
      animate={heroAnimations ? "visible" : false}
    >
      {/* Decorative flourishes - top corners */}
      {decorativeFlourishes && (
        <>
          <motion.svg 
            className="flourish flourish-top-left"
            viewBox="0 0 100 100"
            initial="hidden"
            animate="visible"
          >
            <motion.path
              d="M 0 50 Q 25 50 50 25 Q 50 10 40 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              variants={flourishVariants}
            />
            <motion.path
              d="M 0 30 Q 15 30 30 15 Q 30 5 20 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              variants={flourishVariants}
            />
          </motion.svg>
          
          <motion.svg 
            className="flourish flourish-top-right"
            viewBox="0 0 100 100"
            initial="hidden"
            animate="visible"
          >
            <motion.path
              d="M 100 50 Q 75 50 50 25 Q 50 10 60 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              variants={flourishVariants}
            />
            <motion.path
              d="M 100 30 Q 85 30 70 15 Q 70 5 80 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              variants={flourishVariants}
            />
          </motion.svg>
        </>
      )}
      
      {/* Main title with illuminated initial */}
      <motion.h1 
        className="hero-title"
        variants={heroAnimations ? titleVariants : {}}
      >
        <span className="illuminated-letter">L</span>
        <span className="title-rest">ineageweaver</span>
      </motion.h1>
      
      {/* Tagline */}
      <motion.p 
        className="hero-subtitle"
        variants={heroAnimations ? subtitleVariants : {}}
      >
        Weave the threads of legacy. Chronicle the bloodlines of worlds.
      </motion.p>
      
      {/* Decorative divider with fleur-de-lis */}
      {decorativeFlourishes && (
        <motion.div 
          className="hero-divider"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <FleurDeLis size={20} className="divider-ornament" />
        </motion.div>
      )}
    </motion.header>
  );
}
