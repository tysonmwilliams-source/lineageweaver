/**
 * Test Utilities
 *
 * Provides helper functions for testing React components with proper context providers.
 * Use these utilities instead of @testing-library/react directly when testing
 * components that need context (theme, auth, genealogy data, etc.)
 */

import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

/**
 * Mock Theme Context Provider
 */
const MockThemeProvider = ({ children }) => {
  const themeValue = {
    theme: 'royal-parchment',
    setTheme: vi.fn(),
    isDarkTheme: () => false,
  };

  return children;
};

/**
 * Mock Auth Context Provider
 */
const MockAuthProvider = ({ children, user = null }) => {
  // In real tests, you might want to create a proper mock context
  return children;
};

/**
 * Mock Genealogy Context Provider
 */
const MockGenealogyProvider = ({ children, people = [], houses = [], relationships = [] }) => {
  // In real tests, you might want to create a proper mock context
  return children;
};

/**
 * All Providers Wrapper
 *
 * Wraps components with all necessary providers for testing.
 * Customize the mock data by passing options.
 */
const AllProviders = ({ children, options = {} }) => {
  const {
    user = null,
    people = [],
    houses = [],
    relationships = [],
  } = options;

  return (
    <BrowserRouter>
      <MockThemeProvider>
        <MockAuthProvider user={user}>
          <MockGenealogyProvider people={people} houses={houses} relationships={relationships}>
            {children}
          </MockGenealogyProvider>
        </MockAuthProvider>
      </MockThemeProvider>
    </BrowserRouter>
  );
};

/**
 * Custom render function that wraps components with providers
 *
 * @param {React.ReactElement} ui - Component to render
 * @param {Object} options - Render options
 * @param {Object} options.providerOptions - Options for mock providers
 * @returns {RenderResult} - Testing library render result
 *
 * @example
 * const { getByText } = renderWithProviders(<MyComponent />, {
 *   providerOptions: {
 *     user: { uid: '123', email: 'test@test.com' },
 *     people: [{ id: 1, firstName: 'John', lastName: 'Doe' }]
 *   }
 * });
 */
export function renderWithProviders(ui, options = {}) {
  const { providerOptions = {}, ...renderOptions } = options;

  const Wrapper = ({ children }) => (
    <AllProviders options={providerOptions}>{children}</AllProviders>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Render with just Router (for simpler components)
 */
export function renderWithRouter(ui, options = {}) {
  const Wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
  return render(ui, { wrapper: Wrapper, ...options });
}

/**
 * Create mock functions for common operations
 */
export const createMockFunctions = () => ({
  onSave: vi.fn(),
  onCancel: vi.fn(),
  onDelete: vi.fn(),
  onEdit: vi.fn(),
  onSelect: vi.fn(),
  onChange: vi.fn(),
});

/**
 * Wait for element to appear (with timeout)
 */
export async function waitForElement(callback, timeout = 3000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      return callback();
    } catch {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
  return callback(); // Final attempt, let it throw
}

/**
 * Simulate user typing in an input
 */
export async function typeInInput(input, text) {
  const { default: userEvent } = await import('@testing-library/user-event');
  const user = userEvent.setup();
  await user.clear(input);
  await user.type(input, text);
}

/**
 * Re-export everything from @testing-library/react
 */
export * from '@testing-library/react';
