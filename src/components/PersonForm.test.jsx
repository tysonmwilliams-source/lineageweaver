/**
 * PersonForm Component Tests
 *
 * Tests for the PersonForm component including:
 * - Rendering with empty state (new person)
 * - Rendering with existing data (edit mode)
 * - Form validation
 * - Form submission
 * - Cancel behavior
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test/testUtils';
import PersonForm from './PersonForm';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock the feature flags
vi.mock('../config/featureFlags', () => ({
  isFeatureEnabled: vi.fn(() => false),
}));

// Mock react-router-dom's useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('PersonForm', () => {
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();
  const mockHouses = [
    { id: 1, houseName: 'Stark' },
    { id: 2, houseName: 'Lannister' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render empty form for new person', () => {
      renderWithProviders(
        <PersonForm
          person={null}
          houses={mockHouses}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      // Check required fields are present
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();

      // Check fields are empty
      expect(screen.getByLabelText(/first name/i)).toHaveValue('');
      expect(screen.getByLabelText(/last name/i)).toHaveValue('');
    });

    it('should render form with existing person data', () => {
      const existingPerson = {
        id: 1,
        firstName: 'Jon',
        lastName: 'Snow',
        gender: 'male',
        dateOfBirth: '980',
        dateOfDeath: null,
        houseId: 1,
        legitimacyStatus: 'bastard',
      };

      renderWithProviders(
        <PersonForm
          person={existingPerson}
          houses={mockHouses}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByLabelText(/first name/i)).toHaveValue('Jon');
      expect(screen.getByLabelText(/last name/i)).toHaveValue('Snow');
    });

    it('should display house options in dropdown', () => {
      renderWithProviders(
        <PersonForm
          person={null}
          houses={mockHouses}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const houseSelect = screen.getByLabelText(/^house$/i);
      expect(houseSelect).toBeInTheDocument();

      // Check house options are present
      expect(screen.getByText(/stark/i)).toBeInTheDocument();
      expect(screen.getByText(/lannister/i)).toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    it('should show error for empty first name', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <PersonForm
          person={null}
          houses={mockHouses}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      // Fill in last name but leave first name empty
      await user.type(screen.getByLabelText(/last name/i), 'Snow');

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /create person/i });
      await user.click(submitButton);

      // Check for error message
      expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();
      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should show error for empty last name', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <PersonForm
          person={null}
          houses={mockHouses}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      // Fill in first name but leave last name empty
      await user.type(screen.getByLabelText(/first name/i), 'Jon');

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /create person/i });
      await user.click(submitButton);

      // Check for error message
      expect(await screen.findByText(/last name is required/i)).toBeInTheDocument();
      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should show error for invalid date format', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <PersonForm
          person={null}
          houses={mockHouses}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      // Fill required fields
      await user.type(screen.getByLabelText(/first name/i), 'Jon');
      await user.type(screen.getByLabelText(/last name/i), 'Snow');

      // Enter invalid date
      await user.type(screen.getByLabelText(/date of birth/i), 'invalid-date');

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /create person/i });
      await user.click(submitButton);

      // Check for error message
      expect(await screen.findByText(/date must be/i)).toBeInTheDocument();
      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should not submit form if death date is before birth date', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <PersonForm
          person={null}
          houses={mockHouses}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      // Fill required fields
      await user.type(screen.getByLabelText(/first name/i), 'Jon');
      await user.type(screen.getByLabelText(/last name/i), 'Snow');

      // Enter dates with death before birth
      await user.type(screen.getByLabelText(/date of birth/i), '1000');
      await user.type(screen.getByLabelText(/date of death/i), '990');

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /create person/i });
      await user.click(submitButton);

      // Form should not have called onSave due to validation error
      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should clear error when user corrects input', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <PersonForm
          person={null}
          houses={mockHouses}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      // Fill only last name and submit
      await user.type(screen.getByLabelText(/last name/i), 'Snow');
      const submitButton = screen.getByRole('button', { name: /create person/i });
      await user.click(submitButton);

      // Error should be displayed
      expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();

      // Now fix the error
      await user.type(screen.getByLabelText(/first name/i), 'Jon');

      // Error should be cleared
      await waitFor(() => {
        expect(screen.queryByText(/first name is required/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should call onSave with correct data for new person', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <PersonForm
          person={null}
          houses={mockHouses}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      // Fill out the form - just required fields
      await user.type(screen.getByLabelText(/first name/i), 'Arya');
      await user.type(screen.getByLabelText(/last name/i), 'Stark');

      // Submit
      const submitButton = screen.getByRole('button', { name: /create person/i });
      await user.click(submitButton);

      // Verify onSave was called with correct data
      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledTimes(1);
      });
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'Arya',
          lastName: 'Stark',
        })
      );
    });

    it('should preserve existing id when editing', async () => {
      const user = userEvent.setup();
      const existingPerson = {
        id: 42,
        firstName: 'Jon',
        lastName: 'Snow',
        gender: 'male',
      };

      renderWithProviders(
        <PersonForm
          person={existingPerson}
          houses={mockHouses}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      // Just submit without changes - button says "Update Person" for edit mode
      const submitButton = screen.getByRole('button', { name: /update person/i });
      await user.click(submitButton);

      // Verify id is preserved
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 42,
          firstName: 'Jon',
          lastName: 'Snow',
        })
      );
    });

    it('should parse houseId as integer', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <PersonForm
          person={null}
          houses={mockHouses}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      // Fill required fields
      await user.type(screen.getByLabelText(/first name/i), 'Jon');
      await user.type(screen.getByLabelText(/last name/i), 'Snow');

      // Select a house
      const houseSelect = screen.getByLabelText(/^house$/i);
      await user.selectOptions(houseSelect, '1');

      // Submit
      const submitButton = screen.getByRole('button', { name: /create person/i });
      await user.click(submitButton);

      // Verify houseId is an integer
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          houseId: 1, // Should be number, not string
        })
      );
    });
  });

  describe('Cancel Behavior', () => {
    it('should call onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <PersonForm
          person={null}
          houses={mockHouses}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  describe('Field Interactions', () => {
    it('should update form data when user types', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <PersonForm
          person={null}
          houses={mockHouses}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const firstNameInput = screen.getByLabelText(/first name/i);

      await user.type(firstNameInput, 'Daenerys');

      expect(firstNameInput).toHaveValue('Daenerys');
    });

    it('should handle gender selection', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <PersonForm
          person={null}
          houses={mockHouses}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const genderSelect = screen.getByLabelText(/gender/i);

      // Default should be male
      expect(genderSelect).toHaveValue('male');

      // Change to female
      await user.selectOptions(genderSelect, 'female');
      expect(genderSelect).toHaveValue('female');
    });

    it('should handle legitimacy status selection', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <PersonForm
          person={null}
          houses={mockHouses}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const legitimacySelect = screen.getByLabelText(/legitimacy status/i);

      // Default should be legitimate
      expect(legitimacySelect).toHaveValue('legitimate');

      // Change to bastard
      await user.selectOptions(legitimacySelect, 'bastard');
      expect(legitimacySelect).toHaveValue('bastard');
    });
  });
});
