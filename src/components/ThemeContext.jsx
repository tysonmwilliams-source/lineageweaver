/**
 * ThemeContext.jsx
 *
 * Provides theme management functionality for Lineageweaver.
 * Handles theme switching, localStorage persistence, and theme state.
 *
 * PERFORMANCE: Theme CSS is now loaded dynamically on demand instead of
 * all themes being loaded at startup. This reduces initial CSS parsing.
 */

import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

// Import theme CSS files using Vite's glob import with ?url to get bundled paths
// This ensures the CSS files are properly processed and available in production
const themeModules = import.meta.glob('../styles/themes/theme-*.css', { query: '?url', import: 'default', eager: true });

// Build theme CSS paths from the glob imports
const THEME_CSS_PATHS = Object.entries(themeModules).reduce((acc, [path, url]) => {
  // Extract theme ID from path: ../styles/themes/theme-royal-parchment.css -> royal-parchment
  const match = path.match(/theme-(.+)\.css$/);
  if (match) {
    acc[match[1]] = url;
  }
  return acc;
}, {});

// Cache for loaded theme stylesheets
const loadedThemes = new Set();

// Available themes configuration
export const AVAILABLE_THEMES = [
  {
    id: 'royal-parchment',
    name: 'Royal Parchment',
    category: 'dark',
    description: 'Warm dark theme inspired by candlelit manuscripts'
  },
  {
    id: 'light-manuscript',
    name: 'Light Manuscript',
    category: 'light',
    description: 'Fresh parchment theme for daylight viewing'
  },
  {
    id: 'emerald-court',
    name: 'Emerald Court',
    category: 'light',
    description: 'Forest greens inspired by castle gardens and botanical manuscripts'
  },
  {
    id: 'sapphire-dynasty',
    name: 'Sapphire Dynasty',
    category: 'light',
    description: 'Cool blues and silvers evoking northern kingdoms and winter courts'
  },
  {
    id: 'autumn-chronicle',
    name: 'Autumn Chronicle',
    category: 'light',
    description: 'Warm russet and amber tones like harvest manuscripts by firelight'
  },
  {
    id: 'rose-lineage',
    name: 'Rose Lineage',
    category: 'light',
    description: 'Soft burgundy and dusty rose inspired by heraldic roses and courtly elegance'
  },
  {
    id: 'twilight-realm',
    name: 'Twilight Realm',
    category: 'dark',
    description: 'Deep purples and midnight blues evoking astral mysticism and celestial courts'
  }
];

// Create context
const ThemeContext = createContext(undefined);

/**
 * ThemeProvider Component
 * 
 * Wraps the application to provide theme management.
 * Automatically persists theme preference to localStorage.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.defaultTheme - Default theme if none saved (optional)
 */
export const ThemeProvider = ({ children, defaultTheme = 'royal-parchment' }) => {
  // Load saved theme from localStorage, fallback to default
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem('lineageweaver-theme');
      // Validate that saved theme exists in available themes
      if (saved && AVAILABLE_THEMES.find(t => t.id === saved)) {
        return saved;
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
    }
    return defaultTheme;
  });

  // Dynamically load theme CSS file
  const loadThemeCSS = async (themeId) => {
    // Skip if already loaded
    if (loadedThemes.has(themeId)) {
      return;
    }

    const cssPath = THEME_CSS_PATHS[themeId];
    if (!cssPath) {
      console.warn(`No CSS path for theme: ${themeId}`);
      return;
    }

    try {
      // Check if stylesheet already exists in document
      const existingLink = document.querySelector(`link[data-theme="${themeId}"]`);
      if (existingLink) {
        loadedThemes.add(themeId);
        return;
      }

      // Create and append stylesheet link
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssPath;
      link.setAttribute('data-theme', themeId);

      // Wait for stylesheet to load
      await new Promise((resolve, reject) => {
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
      });

      loadedThemes.add(themeId);
      console.log(`🎨 Theme CSS loaded: ${themeId}`);
    } catch (error) {
      console.error(`Failed to load theme CSS: ${themeId}`, error);
    }
  };

  // Apply theme to document and save to localStorage whenever it changes
  useEffect(() => {
    const applyTheme = async () => {
      try {
        // Load the theme CSS dynamically
        await loadThemeCSS(theme);

        // Apply theme attribute to document root
        document.documentElement.setAttribute('data-theme', theme);

        // Save to localStorage
        localStorage.setItem('lineageweaver-theme', theme);

        // Log theme change (useful for debugging)
        console.log(`Theme changed to: ${theme}`);
      } catch (error) {
        console.error('Failed to apply theme:', error);
      }
    };

    applyTheme();
  }, [theme]);

  /**
   * Set theme with validation
   * @param {string} newTheme - Theme ID to set
   */
  const setTheme = (newTheme) => {
    // Validate theme exists
    const themeConfig = AVAILABLE_THEMES.find(t => t.id === newTheme);
    if (!themeConfig) {
      console.error(`Invalid theme: ${newTheme}`);
      return;
    }
    setThemeState(newTheme);
  };

  /**
   * Toggle between light and dark themes
   * Finds the opposite category theme
   */
  const toggleTheme = () => {
    const currentThemeConfig = AVAILABLE_THEMES.find(t => t.id === theme);
    if (!currentThemeConfig) return;

    // Find a theme in the opposite category
    const oppositeCategory = currentThemeConfig.category === 'dark' ? 'light' : 'dark';
    const oppositeTheme = AVAILABLE_THEMES.find(t => t.category === oppositeCategory);
    
    if (oppositeTheme) {
      setTheme(oppositeTheme.id);
    }
  };

  /**
   * Get current theme configuration
   * @returns {Object} Current theme config
   */
  const getCurrentThemeConfig = () => {
    return AVAILABLE_THEMES.find(t => t.id === theme) || AVAILABLE_THEMES[0];
  };

  /**
   * Check if current theme is dark
   * @returns {boolean}
   */
  const isDarkTheme = () => {
    const config = getCurrentThemeConfig();
    return config.category === 'dark';
  };

  // Context value
  const value = {
    theme,                      // Current theme ID
    setTheme,                   // Set theme by ID
    toggleTheme,                // Toggle between light/dark
    getCurrentThemeConfig,      // Get current theme config object
    isDarkTheme,                // Check if dark theme
    availableThemes: AVAILABLE_THEMES  // All available themes
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * useTheme Hook
 * 
 * Access theme context from any component.
 * Must be used within a ThemeProvider.
 * 
 * @returns {Object} Theme context value
 * @throws {Error} If used outside ThemeProvider
 * 
 * @example
 * function MyComponent() {
 *   const { theme, setTheme, isDarkTheme } = useTheme();
 *   return <div>Current theme: {theme}</div>;
 * }
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

/**
 * withTheme HOC
 * 
 * Higher-order component to inject theme props into class components.
 * 
 * @param {React.Component} Component - Component to wrap
 * @returns {React.Component} Wrapped component with theme props
 * 
 * @example
 * class MyClassComponent extends React.Component {
 *   render() {
 *     return <div>Theme: {this.props.theme}</div>;
 *   }
 * }
 * export default withTheme(MyClassComponent);
 */
export const withTheme = (Component) => {
  return function ThemedComponent(props) {
    const theme = useTheme();
    return <Component {...props} theme={theme} />;
  };
};

export default ThemeContext;
