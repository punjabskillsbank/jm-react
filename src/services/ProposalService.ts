import axios from 'axios';
import config from '../config/indexConfig';
import { uploadFilesToS3 } from '../utils/uploadUtils';

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


export const uploadProposalAttachments = async (files: File[], proposal_id: number) => {
  // Get presigned URLs from the server
  const presignRes = await API.post(
    '/api/v1/proposals/upload/proposal_attachment',
    { proposal_id, file: files.map(f => f.name) }
  );

  // Use the utility function to handle the actual S3 upload
  return uploadFilesToS3(files, presignRes.data);
};

// Save uploaded S3 keys to backend
export const saveAttachmentS3Keys = async (proposal_id: number, urls: string[]) => {
  return API.post(`/api/v1/proposals/${proposal_id}/attachments`, {
    attachmentUrls: urls,
  });
};
