import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SubmitProposalPage from './SubmitProposalPage';
import { BrowserRouter } from 'react-router-dom';
import * as JobServices from '../../services/JobServices';
import * as ProposalService from '../../services/ProposalService';

// Mock useParams
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({ id: '123' }),
    useNavigate: () => jest.fn(),
  })
);

describe('SubmitProposalPage', () => {
const mockJob = {
jobPostingId: 123,
clientId: 'client-uuid',
title: 'Frontend Developer',
description: 'We need a React expert.',
budgetType: 'FIXED',
hourlyMinRate: 0,
hourlyMaxRate: 0,
fixedPrice: 500,
projectDuration: '1 Month',
experienceLevel: 'Intermediate',
jobPostingStatus: 'OPEN',
category: {
categoryId: 1,
category: 'Development',
speciality: 'Frontend',
},
skills: ['React', 'TypeScript'],
questions: [
{
questionId: 1,
question: 'Why should we hire you?',
},
],
};

beforeEach(() => {
localStorage.setItem('user_id', 'freelancer-uuid');
jest.spyOn(JobServices, 'fetchJobById').mockResolvedValue(mockJob);
jest.spyOn(ProposalService, 'submitProposal').mockResolvedValue({ success: true });
});

afterEach(() => {
jest.clearAllMocks();
});

it('renders job details and form fields', async () => {
render(
<BrowserRouter>
<SubmitProposalPage />
</BrowserRouter>
);

expect(screen.getByText(/Loading/i)).toBeInTheDocument();

await waitFor(() => {
  expect(screen.getByText('Apply to: Frontend Developer')).toBeInTheDocument();
  expect(screen.getByLabelText(/Bid Amount/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Cover Letter/i)).toBeInTheDocument();
  expect(screen.getByText(/Why should we hire you\?/i)).toBeInTheDocument();
});
});

it('submits form with correct payload', async () => {
render(
<BrowserRouter>
<SubmitProposalPage />
</BrowserRouter>
);


await waitFor(() => screen.getByText('Apply to: Frontend Developer'));

fireEvent.change(screen.getByLabelText(/Bid Amount/i), { target: { value: 100 } });
fireEvent.change(screen.getByLabelText(/Cover Letter/i), { target: { value: 'I am a great fit.' } });
fireEvent.change(screen.getByLabelText(/Why should we hire you\?/i), { target: { value: 'Because I can deliver fast.' } });

fireEvent.click(screen.getByText(/Submit Proposal/i));

await waitFor(() => {
  expect(ProposalService.submitProposal).toHaveBeenCalledWith({
    jobPostingId: 123,
    freelancerId: 'freelancer-uuid',
    clientId: 'client-uuid',
    proposedBidAmount: 100,
    proposalStatus: 'SUBMITTED',
    coverLetter: 'I am a great fit.',
    questionAnswers: [{ questionId: 1, answer: 'Because I can deliver fast.' }],
  });
});
});

it('shows error message if fetch fails', async () => {
jest.spyOn(JobServices, 'fetchJobById').mockRejectedValue(new Error('API Failed'));


render(
  <BrowserRouter>
    <SubmitProposalPage />
  </BrowserRouter>
);
await waitFor(() => {
  expect(screen.getByText(/Job not found/i)).toBeInTheDocument();
});

});
});

