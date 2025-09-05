import axios from 'axios';
import config from '../config/indexConfig';
import { uploadFilesToS3 } from '../utils/uploadUtils';

const API = axios.create({
baseURL: config.baseURLs.jobPosting,
});

// Fetch categories
export const fetchCategories = async () => {
try {
const response = await API.get('/api/v1/job_postings/categories');
return response.data;
} catch (error: any) {
console.error('Error fetching categories:', error);
throw new Error(error?.response?.data?.message || 'Failed to fetch categories');
}
};

export interface JobPostingPayload {
  clientId: string;
  title: string;
  description: string;
  budgetType: 'HOURLY' | 'FIXED';
  hourlyMinRate: number | null;
  hourlyMaxRate: number | null;
  fixedPrice: number | null;
  projectDuration: string;
  experienceLevel: string;
  category: {
    categoryId: number;
  };
  jobPostingStatus: 'DRAFT' | 'IN_REVIEW';
  skills: string[];
  questions: { question: string }[];
}


// Create job posting
export const createJobPosting = async (payload: JobPostingPayload) => {
try {
const response = await API.post('/api/v1/job_postings/create_job_posting', payload);
return response.data;
} catch (error: any) {
console.error('Error creating job posting:', error);
throw new Error(error?.response?.data?.message || 'Failed to create job posting');
}
};

export const uploadJobAttachments = async (files: File[], job_posting_id: number) => {
    const originalFileNames = files.map(file => file.name);
    // Get presigned URLs from backend
    const presignRes = await API.post(
      `/api/presigned_url/upload/job_attachment`,
      { job_posting_id, fileNames: originalFileNames}
    );
    const presignedUrls = files.map(file => presignRes.data[file.name]);
    // Use the common utility to handle S3 PUT uploads
    return uploadFilesToS3(files, presignedUrls);
};

// Update job posting status
export const setJobPostingToDraft = async (job_posting_id: number) => {
  return API.post(`/api/v1/job_postings/${job_posting_id}/status`, {
    status: 'DRAFT',
  });
};

// Save uploaded S3 keys to backend
export const saveAttachmentUrls = async (job_posting_id: number, urls: string[]) => {
  return API.post(`/api/v1/job_postings/${job_posting_id}/attachments`, {
    attachmentUrls: urls,
  });
};