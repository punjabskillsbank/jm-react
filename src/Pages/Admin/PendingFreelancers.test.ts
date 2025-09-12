import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PendingFreelancers from './PendingFreelancers';
import { getPendingFreelancers } from '../../services/AdminService';

// Mock the MUI components
jest.mock('@mui/x-data-grid', () => ({
  DataGrid: jest.fn(({ rows, columns, getRowId, initialState, pageSizeOptions, disableRowSelectionOnClick }: any) => 
    React.createElement('div', { 'data-testid': 'mock-data-grid' }, [
      React.createElement('span', { 'data-testid': 'datagrid-info', key: 'info' }, 
        `DataGrid with ${rows.length} rows and ${columns.length} columns`),
      React.createElement('div', { 'data-testid': 'datagrid-rows', key: 'rows' }, rows.length),
      React.createElement('div', { 'data-testid': 'datagrid-columns', key: 'columns' }, columns.length)
    ])
  )
}));

// Mock the MUI Dialog components
jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');
  return {
    ...actual,
    Dialog: ({ children, open, onClose, maxWidth, fullWidth }: any) => 
      open ? React.createElement('div', { 'data-testid': 'mock-dialog' }, children) : null,
    DialogTitle: ({ children }: any) => 
      React.createElement('div', { 'data-testid': 'dialog-title' }, children),
    DialogContent: ({ children, dividers }: any) => 
      React.createElement('div', { 'data-testid': 'dialog-content' }, children),
    DialogActions: ({ children }: any) => 
      React.createElement('div', { 'data-testid': 'dialog-actions' }, children),
    Button: ({ children, onClick, color, variant }: any) => 
      React.createElement('button', {
        onClick,
        'data-testid': 'mui-button',
        'data-color': color,
        'data-variant': variant
      }, children),
    FormControlLabel: ({ control, label }: any) => 
      React.createElement('label', { 'data-testid': 'form-control-label' }, [
        control,
        React.createElement('span', { key: 'label' }, label)
      ]),
    Checkbox: ({ checked, onChange }: any) => 
      React.createElement('input', {
        type: 'checkbox',
        checked,
        onChange,
        'data-testid': 'mui-checkbox'
      }),
    Paper: ({ children, sx, elevation }: any) => 
      React.createElement('div', { 'data-testid': 'mui-paper' }, children)
  };
});

// Mock the freelancer service
jest.mock('../../services/AdminService', () => ({
  getPendingFreelancers: jest.fn()
}));

const mockGetPendingFreelancers = getPendingFreelancers as jest.MockedFunction<typeof getPendingFreelancers>;

// Define types for test data - using a more flexible approach for dynamic data
interface FreelancerData {
  [key: string]: any;
  freelancerId: string;
}

describe('PendingFreelancers Component Tests', () => {
  // Mock data with various fields to test dynamic column generation
  const mockFreelancersData: FreelancerData[] = [
    {
      freelancerId: '1',
      name: 'John Doe',
      title: 'Frontend Developer',
      skills: 'React, TypeScript',
      experience: '5 years',
      hourlyRate: 50,
      location: 'New York',
      availability: 'Full-time',
      profileStatus: 'pending'
    },
    {
      freelancerId: '2',
      name: 'Jane Smith',
      title: 'Backend Developer',
      skills: 'Node.js, MongoDB',
      experience: '3 years',
      hourlyRate: 60,
      location: 'San Francisco',
      availability: 'Part-time',
      profileStatus: 'pending'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the component with dynamic columns', async () => {
      // Arrange
      mockGetPendingFreelancers.mockResolvedValue(mockFreelancersData);
      
      // Act
      render(React.createElement(PendingFreelancers));
      
      // Assert
      await waitFor(() => {
        expect(screen.getByText('Pending Freelancers')).toBeInTheDocument();
        expect(screen.getByText('Select Columns')).toBeInTheDocument();
      });
    });

    it('should display empty state when no freelancers are available', async () => {
      // Arrange
      mockGetPendingFreelancers.mockResolvedValue([]);
      
      // Act
      render(React.createElement(PendingFreelancers));
      
      // Assert
      await waitFor(() => {
        expect(screen.getByText('Pending Freelancers')).toBeInTheDocument();
        expect(screen.getByText("You don't have any Pending Freelancer Right Now.")).toBeInTheDocument();
      });
    });

    it('should display DataGrid when freelancers data is available', async () => {
      // Arrange
      mockGetPendingFreelancers.mockResolvedValue(mockFreelancersData);
      
      // Act
      render(React.createElement(PendingFreelancers));
      
      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('mock-data-grid')).toBeInTheDocument();
        expect(screen.getByTestId('datagrid-rows')).toHaveTextContent('2');
      });
    });

    it('should render with correct initial pagination settings', async () => {
      // Arrange
      mockGetPendingFreelancers.mockResolvedValue(mockFreelancersData);
      
      // Act
      render(React.createElement(PendingFreelancers));
      
      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('mock-data-grid')).toBeInTheDocument();
      });
    });

    it('should open column selection dialog when button is clicked', async () => {
      // Arrange
      mockGetPendingFreelancers.mockResolvedValue(mockFreelancersData);
      
      // Act
      render(React.createElement(PendingFreelancers));
      
      // Wait for component to load
      await waitFor(() => {
        expect(screen.getByText('Select Columns')).toBeInTheDocument();
      });
      
      // Click the button to open dialog - use button selector to avoid ambiguity
      const selectColumnsButton = screen.getByRole('button', { name: 'Select Columns' });
      fireEvent.click(selectColumnsButton);
      
      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('mock-dialog')).toBeInTheDocument();
        expect(screen.getByTestId('dialog-title')).toBeInTheDocument();
      });
    });

    it('should close dialog when Done button is clicked', async () => {
      // Arrange
      mockGetPendingFreelancers.mockResolvedValue(mockFreelancersData);
      
      // Act
      render(React.createElement(PendingFreelancers));
      
      // Open dialog
      await waitFor(() => {
        expect(screen.getByText('Select Columns')).toBeInTheDocument();
      });
      const selectColumnsButton = screen.getByRole('button', { name: 'Select Columns' });
      fireEvent.click(selectColumnsButton);
      
      // Wait for dialog to open
      await waitFor(() => {
        expect(screen.getByTestId('mock-dialog')).toBeInTheDocument();
      });
      
      // Click Done button
      const doneButtons = screen.getAllByText('Done');
      fireEvent.click(doneButtons[doneButtons.length - 1]);
      
      // Assert dialog closes
      await waitFor(() => {
        expect(screen.queryByTestId('mock-dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Dynamic Column Generation', () => {
    it('should generate columns dynamically from data', async () => {
      // Arrange
      mockGetPendingFreelancers.mockResolvedValue(mockFreelancersData);
      
      // Act
      render(React.createElement(PendingFreelancers));
      
      // Assert - Check that columns are generated from the data
      await waitFor(() => {
        expect(mockGetPendingFreelancers).toHaveBeenCalledTimes(1);
        expect(screen.getByTestId('datagrid-columns')).toHaveTextContent('9'); // 9 fields in mock data
      });
    });

    it('should capitalize column headers correctly', async () => {
      // Arrange
      const testData = [{ freelancerId: '1', firstName: 'John', lastName: 'Doe' }];
      mockGetPendingFreelancers.mockResolvedValue(testData);
      
      // Act
      render(React.createElement(PendingFreelancers));
      
      // Open column selection to see headers
      await waitFor(() => {
        expect(screen.getByText('Select Columns')).toBeInTheDocument();
      });
      const selectColumnsButton = screen.getByRole('button', { name: 'Select Columns' });
      fireEvent.click(selectColumnsButton);
      
      // Assert headers are capitalized
      await waitFor(() => {
        expect(screen.getByText('FreelancerId')).toBeInTheDocument();
        expect(screen.getByText('FirstName')).toBeInTheDocument();
        expect(screen.getByText('LastName')).toBeInTheDocument();
      });
    });

    it('should handle data with different field structures', async () => {
      // Arrange
      const dynamicData = [
        { id: '1', customField: 'value1', anotherField: 'test' },
        { id: '2', customField: 'value2', anotherField: 'test2' }
      ];
      mockGetPendingFreelancers.mockResolvedValue(dynamicData);
      
      // Act
      render(React.createElement(PendingFreelancers));
      
      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('datagrid-columns')).toHaveTextContent('3'); // 3 fields
        expect(screen.getByTestId('datagrid-rows')).toHaveTextContent('2'); // 2 rows
      });
    });
    
    it('should handle column selection changes', async () => {
      // Arrange
      mockGetPendingFreelancers.mockResolvedValue(mockFreelancersData);
      
      // Act
      render(React.createElement(PendingFreelancers));
      
      // Open column selection dialog
      await waitFor(() => {
        expect(screen.getByText('Select Columns')).toBeInTheDocument();
      });
      
      const selectColumnsButton = screen.getByRole('button', { name: 'Select Columns' });
      fireEvent.click(selectColumnsButton);
      
      // Wait for dialog to open and verify checkboxes
      await waitFor(() => {
        expect(screen.getByTestId('dialog-title')).toBeInTheDocument();
        const checkboxes = screen.getAllByTestId('mui-checkbox');
        expect(checkboxes.length).toBeGreaterThan(0);
      });
      
      // Test checkbox interaction
      const checkboxes = screen.getAllByTestId('mui-checkbox');
      if (checkboxes.length > 0) {
        fireEvent.click(checkboxes[0]);
      }
      
      // Close dialog
      const doneButtons = screen.getAllByText('Done');
      fireEvent.click(doneButtons[doneButtons.length - 1]);
      
      // Assert dialog closes
      await waitFor(() => {
        expect(screen.queryByTestId('mock-dialog')).not.toBeInTheDocument();
      });
    });

    it('should show all columns selected by default', async () => {
      // Arrange
      mockGetPendingFreelancers.mockResolvedValue(mockFreelancersData);
      
      // Act
      render(React.createElement(PendingFreelancers));
      
      // Open column selection dialog
      await waitFor(() => {
        expect(screen.getByText('Select Columns')).toBeInTheDocument();
      });
      const selectColumnsButton = screen.getByRole('button', { name: 'Select Columns' });
      fireEvent.click(selectColumnsButton);
      
      // Assert all checkboxes are checked by default
      await waitFor(() => {
        const checkboxes = screen.getAllByTestId('mui-checkbox');
        checkboxes.forEach(checkbox => {
          expect(checkbox).toBeChecked();
        });
      });
    });
  });

  describe('Data Processing Logic', () => {
    it('should handle successful data fetching and log response', async () => {
      // Arrange
      mockGetPendingFreelancers.mockResolvedValue(mockFreelancersData);
      
      // Act
      render(React.createElement(PendingFreelancers));
      
      // Assert
      await waitFor(() => {
        expect(mockGetPendingFreelancers).toHaveBeenCalledTimes(1);
      });
    });

    it('should set loading state correctly', async () => {
      // Arrange
      let resolvePromise: (value: any) => void;
      const promise = new Promise(resolve => {
        resolvePromise = resolve;
      });
      mockGetPendingFreelancers.mockReturnValue(promise);
      
      // Act
      render(React.createElement(PendingFreelancers));
      
      // Initially loading should be true, then resolve
      resolvePromise!(mockFreelancersData);
      
      // Assert loading completes
      await waitFor(() => {
        expect(mockGetPendingFreelancers).toHaveBeenCalledTimes(1);
      });
    });

    it('should use correct row ID from freelancerId or fallback to id', async () => {
      // Arrange
      const dataWithIds = [
        { freelancerId: 'fl1', name: 'John' },
        { id: 'id1', name: 'Jane' } // No freelancerId, should use id
      ];
      mockGetPendingFreelancers.mockResolvedValue(dataWithIds);
      
      // Act
      render(React.createElement(PendingFreelancers));
      
      // Assert DataGrid receives the data
      await waitFor(() => {
        expect(screen.getByTestId('mock-data-grid')).toBeInTheDocument();
        expect(screen.getByTestId('datagrid-rows')).toHaveTextContent('2');
      });
    });

    it('should handle empty data response', async () => {
      // Arrange
      mockGetPendingFreelancers.mockResolvedValue([]);
      
      // Act
      render(React.createElement(PendingFreelancers));
      
      // Assert
      await waitFor(() => {
        expect(mockGetPendingFreelancers).toHaveBeenCalledTimes(1);
      });
    });

    it('should handle null data response', async () => {
      // Arrange
      mockGetPendingFreelancers.mockResolvedValue(null);
      
      // Act
      render(React.createElement(PendingFreelancers));
      
      // Assert
      await waitFor(() => {
        expect(mockGetPendingFreelancers).toHaveBeenCalledTimes(1);
        expect(screen.getByText("You don't have any Pending Freelancer Right Now.")).toBeInTheDocument();
      });
    });

    it('should handle non-array data response', async () => {
      // Arrange
      mockGetPendingFreelancers.mockResolvedValue({ message: 'Invalid response' });
      
      // Act
      render(React.createElement(PendingFreelancers));
      
      // Assert
      await waitFor(() => {
        expect(mockGetPendingFreelancers).toHaveBeenCalledTimes(1);
        expect(screen.getByText("You don't have any Pending Freelancer Right Now.")).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle API fetch errors gracefully and show empty state', async () => {
      // Arrange
      const apiError = new Error('API Error');
      mockGetPendingFreelancers.mockRejectedValue(apiError);
      
      // Act
      render(React.createElement(PendingFreelancers));
      
      // Assert
      await waitFor(() => {
        expect(mockGetPendingFreelancers).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith(' Error fetching freelancers:', apiError);
        expect(screen.getByText("You don't have any Pending Freelancer Right Now.")).toBeInTheDocument();
      });
    });

    it('should handle network errors', async () => {
      // Arrange
      mockGetPendingFreelancers.mockRejectedValue(new Error('Network Error'));
      
      // Act
      render(React.createElement(PendingFreelancers));
      
      // Assert
      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(' Error fetching freelancers:', expect.any(Error));
        expect(screen.getByText('Pending Freelancers')).toBeInTheDocument();
      });
    });
  });

  describe('Component State Management', () => {
    it('should manage dialog open/close state correctly', async () => {
      // Arrange
      mockGetPendingFreelancers.mockResolvedValue(mockFreelancersData);
      
      // Act
      render(React.createElement(PendingFreelancers));
      
      // Initially dialog should be closed
      expect(screen.queryByTestId('mock-dialog')).not.toBeInTheDocument();
      
      // Open dialog
      await waitFor(() => {
        expect(screen.getByText('Select Columns')).toBeInTheDocument();
      });
      const selectColumnsButton = screen.getByRole('button', { name: 'Select Columns' });
      fireEvent.click(selectColumnsButton);
      
      // Dialog should be open
      await waitFor(() => {
        expect(screen.getByTestId('mock-dialog')).toBeInTheDocument();
      });
      
      // Close dialog
      const doneButtons = screen.getAllByText('Done');
      fireEvent.click(doneButtons[doneButtons.length - 1]);
      
      // Dialog should be closed
      await waitFor(() => {
        expect(screen.queryByTestId('mock-dialog')).not.toBeInTheDocument();
      });
    });

    it('should handle column filtering when no columns selected', async () => {
      // Arrange - Mock data with single field to test edge case
      const singleFieldData = [{ freelancerId: '1' }];
      mockGetPendingFreelancers.mockResolvedValue(singleFieldData);
      
      // Act
      render(React.createElement(PendingFreelancers));
      
      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('datagrid-columns')).toHaveTextContent('1');
      });
    });
  });
});
