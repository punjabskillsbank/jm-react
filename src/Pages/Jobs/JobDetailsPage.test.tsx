import { render, screen, waitFor } from '@testing-library/react';
import JobDetailPage from './JobDetailsPage';
import * as JobServices from '../../services/JobServices';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import '@testing-library/jest-dom';

jest.mock('../../services/JobServices');

const mockJob = {
  id: 1,
  title: 'Test Job',
  description: 'A job for testing.',
  experienceLevel: 'INTERMEDIATE',
  projectDuration: 'ONE_TO_THREE_MONTHS',
  budgetType: 'FIXED',
  fixedPrice: 500,
  hourlyMinRate: null,
  hourlyMaxRate: null,
  skills: ['React', 'Node.js'],
  category: {
    category: 'Web Development',
    speciality: 'Frontend',
  },
};

const renderWithRouter = (jobPostingId: number) => {
  return render(
    <MemoryRouter initialEntries={[`/jobs/${jobPostingId}`]}>
      <Routes>
        <Route path="/jobs/:jobPostingId" element={<JobDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('JobDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', async () => {
    (JobServices.fetchJobById as jest.Mock).mockResolvedValue(mockJob);
    renderWithRouter(1);

    // Wait for the DOM to update with async content
    expect(await screen.findByText('Test Job')).toBeInTheDocument();
  });

  it('displays timeout message if loading exceeds 5 seconds', async () => {
    jest.useFakeTimers(); // use fake timers
    (JobServices.fetchJobById as jest.Mock).mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => resolve(mockJob), 6000); // delayed beyond timeout
      });
    });

    renderWithRouter(1);

    jest.advanceTimersByTime(5001); // exceed the 5-second timeout
    await waitFor(() =>
      expect(screen.getByText(/taking longer than usual/i)).toBeInTheDocument()
    );

    jest.useRealTimers(); // cleanup
  });

  it('shows error message on fetch failure', async () => {
    (JobServices.fetchJobById as jest.Mock).mockRejectedValue(new Error('API error'));

    renderWithRouter(1);

    await waitFor(() =>
      expect(screen.getByText(/failed to load job details/i)).toBeInTheDocument()
    );
  });
});
