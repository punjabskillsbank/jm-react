import { render, screen, waitFor } from '@testing-library/react';
import JobDetailsPage from './JobDetailsPage';
import * as JobServices from '../../services/JobServices';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import '@testing-library/jest-dom';

jest.mock('../../services/JobServices');

const mockJob = {
  jobPostingId: 1,
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
  jobPostingStatus: 'OPEN',
  questions: [{ question: 'What is your experience with React?' }],
};

const renderWithRouter = (id: number) => {
  return render(
    <MemoryRouter initialEntries={[`/jobs/${id}`]}>
      <Routes>
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('JobDetailsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', async () => {
    (JobServices.fetchJobById as jest.Mock).mockResolvedValue(mockJob);
    renderWithRouter(1);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(await screen.findByText('Test Job')).toBeInTheDocument();
  });

  it('shows job details after loading', async () => {
    (JobServices.fetchJobById as jest.Mock).mockResolvedValue(mockJob);
    renderWithRouter(1);

    expect(await screen.findByText('Test Job')).toBeInTheDocument();
    expect(screen.getByText('A job for testing.')).toBeInTheDocument();
    expect(screen.getByText('Budget:')).toBeInTheDocument();
    expect(screen.getByText('$500')).toBeInTheDocument();
    expect(screen.getByText('Experience:')).toBeInTheDocument();
    expect(screen.getByText('INTERMEDIATE')).toBeInTheDocument();
    expect(screen.getByText('Duration:')).toBeInTheDocument();
    expect(screen.getByText('ONE_TO_THREE_MONTHS')).toBeInTheDocument();
    expect(screen.getByText('Status:')).toBeInTheDocument();
    expect(screen.getByText('OPEN')).toBeInTheDocument();
    expect(screen.getByText('Category:')).toBeInTheDocument();
    expect(screen.getByText('Web Development')).toBeInTheDocument();
    expect(screen.getByText('Speciality:')).toBeInTheDocument();
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('Skills Required:')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('Screening Questions:')).toBeInTheDocument();
    expect(screen.getByText('What is your experience with React?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apply now/i })).toBeInTheDocument();
  });

  it('shows "Job not found" if job is null', async () => {
    (JobServices.fetchJobById as jest.Mock).mockResolvedValue(null);
    renderWithRouter(1);

    expect(await screen.findByText('Job not found')).toBeInTheDocument();
  });

  it('shows "Job not found" on fetch failure', async () => {
    (JobServices.fetchJobById as jest.Mock).mockRejectedValue(new Error('API error'));
    renderWithRouter(1);

    expect(await screen.findByText('Job not found')).toBeInTheDocument();
  });
});
