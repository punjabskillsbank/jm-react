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

// Upload attachments to S3
export const S3_UPLOAD_RETRIES_NUM = 3;
export const uploadFilesToS3 = async (files: File[], proposal_id: number): Promise<{uploadedKeys: string[], failedFiles: string[]}> => {
  const uploadedKeys: string[] = [];
  const failedFiles: string[] = [];

  const originalFileNames = files.map(file => file.name);

  // Send POST to get presigned URLs
  const presignRes = await API.post(
    `/api/presigned_url/upload/proposal_attachment`,
    { proposal_id, file: originalFileNames}
  );

  const urls = presignRes.data as { uploadUrl: string; s3Key: string }[];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const { uploadUrl, s3Key } = urls[i];

    let success = false;
    for (let attempt = 1; attempt <= S3_UPLOAD_RETRIES_NUM; attempt++) {
      try {
        await axios.put(uploadUrl, file, {
          headers: { 'Content-Type': file.type },
        });
        uploadedKeys.push(s3Key);
        success = true;
        break;
      } catch (err) {
        console.warn(`Upload attempt ${attempt} failed for ${file.name}`);
        if (attempt === S3_UPLOAD_RETRIES_NUM) {
          failedFiles.push(file.name);
        }
      }
    }
  }

  return {uploadedKeys,failedFiles};
};

// Save uploaded S3 keys to backend
export const saveAttachmentUrls = async (proposal_id: number, urls: string[]) => {
  return API.post(`/api/v1/proposals/${proposal_id}/attachments`, {
    attachmentUrls: urls,
  });
};
