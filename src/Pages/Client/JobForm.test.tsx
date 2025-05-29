import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import JobForm from './JobForm';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('JobForm', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        Development: ['Frontend', 'Backend'],
        Design: ['UI/UX', 'Graphic Design'],
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('handles submission errors gracefully', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Submission failed'));

    render(<JobForm />);

    // Fill required inputs
    fireEvent.change(screen.getByPlaceholderText(/title/i), {
      target: { value: 'Error Job' },
    });

    fireEvent.change(screen.getByPlaceholderText(/description/i), {
      target: { value: 'Desc' },
    });

    // Wait for subcategory select to appear
    const subcategorySelect = await screen.findByLabelText(/subcategory/i);
    fireEvent.change(subcategorySelect, { target: { value: 'Frontend' } });

    // Mock alert
    window.alert = jest.fn();

    // Click "Save as Draft"
    fireEvent.click(screen.getByText(/save as draft/i));

    // Check alert is not called (because submission failed)
    await waitFor(() => {
      expect(window.alert).not.toHaveBeenCalled();
    });
  });
});
