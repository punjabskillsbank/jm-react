import axios from 'axios';
import config from '../config/indexConfig';

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

// Upload attachments to S3
const S3_UPLOAD_RETRIES_NUM = 3;
export const uploadFilesToS3 = async (files: File[], job_posting_id: number): Promise<string[]> => {
  const uploadedKeys: string[] = [];
  const failedFiles: string[] = [];

  const originalFileNames = files.map(file => file.name);

  // Send POST to get presigned URLs
  const presignRes = await API.post(
    `/api/presigned_url/upload/job_attachment`,
    { job_posting_id, file: originalFileNames}
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