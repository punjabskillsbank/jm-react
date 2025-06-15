// OpenJobsPage.test.tsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import OpenJobsPage from '../Jobs/OpenJobsPage';
import * as JobServices from '../../services/JobServices';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';

jest.mock('../../services/JobServices');

const mockJobs = [
  {
    jobPostingId: 1,
    clientId: '123',
    title: 'Frontend Developer',
    description: 'React developer needed for SPA.',
    budgetType: 'HOURLY',
    hourlyMinRate: 15,
    hourlyMaxRate: 25,
    fixedPrice: null,
    projectDuration: '3 months',
    experienceLevel: 'intermediate',
    jobPostingStatus: 'OPEN',
    category: {
      categoryId: 101,
      category: 'Web Development',
      speciality: 'React',
      createdAt: '',
      updatedAt: '',
    },
    skills: ['React', 'JavaScript'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    jobPostingId: 2,
    clientId: '456',
    title: 'Backend Developer',
    description: 'Looking for Node.js backend dev.',
    budgetType: 'FIXED',
    hourlyMinRate: null,
    hourlyMaxRate: null,
    fixedPrice: 1000,
    projectDuration: '2 weeks',
    experienceLevel: 'expert',
    jobPostingStatus: 'OPEN',
    category: {
      categoryId: 102,
      category: 'Software Engineering',
      speciality: 'Node.js',
      createdAt: '',
      updatedAt: '',
    },
    skills: ['Node.js', 'Express'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

describe('OpenJobsPage – Filters', () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    (JobServices.fetchOpenJobPostings as jest.Mock).mockResolvedValue(mockJobs);
    (JobServices.fetchCategories as jest.Mock).mockResolvedValue([]);

    render(
      <Router>
        <OpenJobsPage />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/Frontend Developer/i)).toBeInTheDocument();
      expect(screen.getByText(/Backend Developer/i)).toBeInTheDocument();
    });
  });

  test('filters by tag (React)', async () => {
    const reactButton = screen.getByRole('button', { name: /React/i });
    fireEvent.click(reactButton);

    await waitFor(() => {
      expect(screen.getByText(/Frontend Developer/i)).toBeInTheDocument();
      expect(screen.queryByText(/Backend Developer/i)).not.toBeInTheDocument();
    });
  });

  test('filters by category name (Web Development)', async () => {
    const categoryButton = screen.getByRole('button', { name: /Web Development/i });
    fireEvent.click(categoryButton);

    await waitFor(() => {
      expect(screen.getByText(/Frontend Developer/i)).toBeInTheDocument();
      expect(screen.queryByText(/Backend Developer/i)).not.toBeInTheDocument();
    });
  });

  test('filters by both tag and category (React + Web Development)', async () => {
    fireEvent.click(screen.getByRole('button', { name: /React/i }));
    fireEvent.click(screen.getByRole('button', { name: /Web Development/i }));

    await waitFor(() => {
      expect(screen.getByText(/Frontend Developer/i)).toBeInTheDocument();
      expect(screen.queryByText(/Backend Developer/i)).not.toBeInTheDocument();
    });
  });

  test('clears tag filter and shows all jobs again', async () => {
    const tag = screen.getByRole('button', { name: /React/i });
    fireEvent.click(tag); // Apply filter
    fireEvent.click(tag); // Remove filter

    await waitFor(() => {
      expect(screen.getByText(/Frontend Developer/i)).toBeInTheDocument();
      expect(screen.getByText(/Backend Developer/i)).toBeInTheDocument();
    });
  });

  test('clears category name filter and shows all jobs again', async () => {
    const category = screen.getByRole('button', { name: /Web Development/i });
    fireEvent.click(category); // Apply filter
    fireEvent.click(category); // Remove filter

    await waitFor(() => {
      expect(screen.getByText(/Frontend Developer/i)).toBeInTheDocument();
      expect(screen.getByText(/Backend Developer/i)).toBeInTheDocument();
    });
  });
});
