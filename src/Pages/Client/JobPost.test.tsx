import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import JobPost from './JobPost';
import { toast } from 'react-toastify';
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();


jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock('../../services/JobPostService', () => ({
  fetchCategories: jest.fn().mockResolvedValue({
    Design: ['UI/UX'],
    Development: ['Frontend', 'Backend'],
  }),
}));

beforeEach(() => {
  fetchMock.resetMocks();
});

describe('JobPost', () => {
  it('renders form fields correctly', async () => {
    render(<JobPost />);
    expect(await screen.findByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
  });

  it('shows validation error when required fields are empty', async () => {
    render(<JobPost />);
    const postButton = screen.getByRole('button', { name: /Post Job/i });
    fireEvent.click(postButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Title is required');
    });
  });

  it('validates hourly rate fields', async () => {
    render(<JobPost />);
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'My Job' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'My Description' } });
    fireEvent.click(screen.getByRole('button', { name: /Post Job/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please provide both min and max hourly rates');
    });
  });

  it('validates fixed price when budget type is FIXED', async () => {
    render(<JobPost />);
    fireEvent.change(screen.getByLabelText(/Budget Type/i), { target: { value: 'FIXED' } });
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Fixed Job' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Some description' } });

    fireEvent.click(screen.getByRole('button', { name: /Post Job/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please provide a fixed price');
    });
  });

  it('submits form successfully with valid data (hourly)', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }), { status: 200 });

    render(<JobPost />);
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Dev Role' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Build something cool' } });
    fireEvent.change(screen.getByLabelText(/Min Rate/i), { target: { value: '20' } });
    fireEvent.change(screen.getByLabelText(/Max Rate/i), { target: { value: '50' } });

    const postButton = screen.getByRole('button', { name: /Post Job/i });
    fireEvent.click(postButton);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/create_job_posting'),
        expect.objectContaining({
          method: 'POST',
        })
      );
      expect(toast.success).toHaveBeenCalledWith('Job posted successfully!');
    });
  });

  it('shows error on failed submission', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: 'Server error' }), { status: 500 });

    render(<JobPost />);
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Error Job' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Oops' } });
    fireEvent.change(screen.getByLabelText(/Min Rate/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Max Rate/i), { target: { value: '30' } });

    fireEvent.click(screen.getByRole('button', { name: /Post Job/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('Submission failed'));
    });
  });
});
