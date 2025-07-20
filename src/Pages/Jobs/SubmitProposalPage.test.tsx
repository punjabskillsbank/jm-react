import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SubmitProposalPage from './SubmitProposalPage';
import { fetchJobById } from '../../services/JobServices';
import { submitProposal } from '../../services/ProposalService';
import { JobPosting } from '../../types/JobPosting';

jest.mock('../../services/JobServices');
jest.mock('../../services/ProposalService');

// Mock localStorage
beforeEach(() => {
  Storage.prototype.getItem = jest.fn(() => 'freelancer123');
});

const mockJob: JobPosting = {
    jobPostingId: 1,
    title: 'Test Job',
    description: 'Job Description',
    clientId: 'client123',
    budgetType: 'HOURLY',
    hourlyMinRate: 0,
    hourlyMaxRate: 0,
    fixedPrice: 0,
    projectDuration: '',
    experienceLevel: '',
    jobPostingStatus: '',
    category: {
        categoryId: 0,
        category: '',
        speciality: '',
        createdAt: '',
        updatedAt: ''
    },
    skills: [],
    createdAt: '',
    updatedAt: ''
};

describe('SubmitProposalPage', () => {
  it('renders loading state initially', async () => {
    (fetchJobById as jest.Mock).mockResolvedValueOnce(mockJob);

    render(
      <MemoryRouter initialEntries={['/jobs/1/apply']}>
        <Routes>
          <Route path="/jobs/:id/apply" element={<SubmitProposalPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    await waitFor(() => expect(fetchJobById).toHaveBeenCalled());
  });

  it('displays job details after fetch', async () => {
    (fetchJobById as jest.Mock).mockResolvedValueOnce(mockJob);

    render(
      <MemoryRouter initialEntries={['/jobs/1/apply']}>
        <Routes>
          <Route path="/jobs/:id/apply" element={<SubmitProposalPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(/Apply to:/)).toBeInTheDocument());
    expect(screen.getByText('Test Job')).toBeInTheDocument();
    expect(screen.getByText('Job Description')).toBeInTheDocument();
  });

  it('handles job fetch failure', async () => {
    (fetchJobById as jest.Mock).mockRejectedValueOnce(new Error('Fetch failed'));

    render(
      <MemoryRouter initialEntries={['/jobs/999/apply']}>
        <Routes>
          <Route path="/jobs/:id/apply" element={<SubmitProposalPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Failed to load job details')).toBeInTheDocument());
  });

  it('submits proposal successfully', async () => {
    window.alert = jest.fn();
    (fetchJobById as jest.Mock).mockResolvedValueOnce(mockJob);
    (submitProposal as jest.Mock).mockResolvedValueOnce({});

    render(
      <MemoryRouter initialEntries={['/jobs/1/apply']}>
        <Routes>
          <Route path="/jobs/:id/apply" element={<SubmitProposalPage />} />
          <Route path="/my-proposals" element={<div>Proposals Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText(/Apply to:/));

    fireEvent.change(screen.getByLabelText(/Bid Amount/), { target: { value: '500' } });
    fireEvent.change(screen.getByLabelText(/Cover Letter/), { target: { value: 'This is my proposal.' } });

    fireEvent.click(screen.getByRole('button', { name: /Submit Proposal/ }));

    await waitFor(() => {
      expect(submitProposal).toHaveBeenCalledWith({
        jobPostingId: 1,
        freelancerId: 'freelancer123',
        clientId: 'client123',
        proposedBidAmount: 500,
        proposalStatus: 'SUBMITTED',
        coverLetter: 'This is my proposal.',
      });
      expect(window.alert).toHaveBeenCalledWith('Proposal submitted!');
    });
  });

  it('shows error on proposal submission failure', async () => {
    (fetchJobById as jest.Mock).mockResolvedValueOnce(mockJob);
    (submitProposal as jest.Mock).mockRejectedValueOnce(new Error('Submission failed'));

    render(
      <MemoryRouter initialEntries={['/jobs/1/apply']}>
        <Routes>
          <Route path="/jobs/:id/apply" element={<SubmitProposalPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText(/Apply to:/));

    fireEvent.change(screen.getByLabelText(/Bid Amount/), { target: { value: '300' } });
    fireEvent.change(screen.getByLabelText(/Cover Letter/), { target: { value: 'Trying to apply' } });

    fireEvent.click(screen.getByRole('button', { name: /Submit Proposal/ }));

    await waitFor(() => {
      expect(screen.getByText('Failed to submit proposal')).toBeInTheDocument();
    });
  });
});
