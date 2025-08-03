import axios from 'axios';
import config from '../config/indexConfig';

const API = axios.create({
  baseURL: config.baseURLs.jobProposal,
});

export interface QuestionAnswer {
  questionId: number;
  answer: string;
}

export interface ProposalPayload {
jobPostingId: number;
freelancerId: string;
clientId: string;
proposedBidAmount: number;
proposalStatus: 'SUBMITTED' | 'DRAFT';
coverLetter: string;
questionAnswers: {
questionId: number;
answer: string;
}[];
}

export const submitProposal = async (payload: ProposalPayload) => {
  try {
    const response = await API.post('/api/v1/proposals/create_proposal', payload);
    console.log('Proposal submitted successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Proposal submission failed:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Failed to submit proposal');
  }
};
