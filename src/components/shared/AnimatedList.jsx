/**
 * AnimatedList.jsx - Staggered List Animation Wrapper
 *
 * PURPOSE:
 * Wraps a list of children to provide staggered entrance animations.
 * Creates a polished, professional feel when lists appear.
 *
 * USAGE:
 * <AnimatedList>
 *   {items.map(item => <Card key={item.id}>{item.name}</Card>)}
 * </AnimatedList>
 *
 * <AnimatedList stagger={0.05} direction="horizontal">
 *   {buttons.map(btn => <ActionButton key={btn.id}>{btn.label}</ActionButton>)}
 * </AnimatedList>
 */

import { Children, forwardRef, useMemo, cloneElement, isValidElement } from 'react';
import { motion } from 'framer-motion';
import './AnimatedList.css';

// Animation variants for different directions
const createContainerVariants = (stagger) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger
    }
  }
});

const createItemVariants = (direction) => {
  const baseHidden = { opacity: 0 };
  const baseVisible = {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  };

  switch (direction) {
    case 'left':
      return {
        hidden: { ...baseHidden, x: -20 },
        visible: { ...baseVisible, x: 0 }
      };
    case 'right':
      return {
        hidden: { ...baseHidden, x: 20 },
        visible: { ...baseVisible, x: 0 }
      };
    case 'up':
      return {
        hidden: { ...baseHidden, y: -20 },
        visible: { ...baseVisible, y: 0 }
      };
    case 'scale':
      return {
        hidden: { ...baseHidden, scale: 0.9 },
        visible: { ...baseVisible, scale: 1 }
      };
    case 'down':
    default:
      return {
        hidden: { ...baseHidden, y: 20 },
        visible: { ...baseVisible, y: 0 }
      };
  }
};

/**
 * AnimatedList Component
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - List items to animate
 * @param {number} props.stagger - Delay between items in seconds (default: 0.1)
 * @param {string} props.direction - 'down' | 'up' | 'left' | 'right' | 'scale' (default: 'down')
 * @param {boolean} props.animate - Enable animations (default: true)
 * @param {string} props.layout - 'vertical' | 'horizontal' | 'grid' (default: 'vertical')
 * @param {string} props.gap - Gap between items (default: 'md')
 * @param {string} props.as - HTML element to render as (default: 'div')
 * @param {string} props.className - Additional CSS classes
 */
const AnimatedList = forwardRef(function AnimatedList(
  {
    children,
    stagger = 0.1,
    direction = 'down',
    animate = true,
    layout = 'vertical',
    gap = 'md',
    as = 'div',
    className = '',
    ...props
  },
  ref
) {
  // Build class names
  const listClass = useMemo(() => {
    const classes = [
      'animated-list',
      `animated-list--${layout}`,
      `animated-list--gap-${gap}`
    ];
    if (className) classes.push(className);
    return classes.join(' ');
  }, [layout, gap, className]);

  // Memoize variants
  const containerVariants = useMemo(
    () => createContainerVariants(stagger),
    [stagger]
  );

  const itemVariants = useMemo(
    () => createItemVariants(direction),
    [direction]
  );

  // Animation props
  const containerProps = useMemo(() => {
    if (!animate) return {};
    return {
      variants: containerVariants,
      initial: 'hidden',
      animate: 'visible'
    };
  }, [animate, containerVariants]);

  // Process children to wrap each in motion.div
  const animatedChildren = useMemo(() => {
    if (!animate) return children;

    return Children.map(children, (child, index) => {
      if (!isValidElement(child)) return child;

      // If child is already a motion component, just add variants
      if (child.type?.displayName?.startsWith('motion.')) {
        return cloneElement(child, {
          variants: itemVariants,
          key: child.key || index
        });
      }

      // Wrap in motion.div for animation
      return (
        <motion.div
          key={child.key || index}
          variants={itemVariants}
          className="animated-list__item"
        >
          {child}
        </motion.div>
      );
    });
  }, [children, animate, itemVariants]);

  const Component = motion[as] || motion.div;

  return (
    <Component
      ref={ref}
      className={listClass}
      {...containerProps}
      {...props}
    >
      {animatedChildren}
    </Component>
  );
});

export default AnimatedList;
