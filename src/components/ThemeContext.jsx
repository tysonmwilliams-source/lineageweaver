/**
 * ThemeContext.jsx
 * 
 * Provides theme management functionality for Lineageweaver.
 * Handles theme switching, localStorage persistence, and theme state.
 */

import React, { createContext, useState, useContext, useEffect } from 'react';

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

  // Apply theme to document and save to localStorage whenever it changes
  useEffect(() => {
    try {
      // Apply theme attribute to document root
      document.documentElement.setAttribute('data-theme', theme);
      
      // Save to localStorage
      localStorage.setItem('lineageweaver-theme', theme);
      
      // Log theme change (useful for debugging)
      console.log(`Theme changed to: ${theme}`);
    } catch (error) {
      console.error('Failed to apply theme:', error);
    }
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
