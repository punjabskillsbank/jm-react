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
hourlyMinRate: number;
hourlyMaxRate: number;
fixedPrice: number;
projectDuration: string;
experienceLevel: string;
categoryId: number;
jobPostingStatus: string;
//skills: string[];
questions: string[];
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
export const uploadFilesToS3 = async (files: File[], jobId: number): Promise<string[]> => {
  const uploadedKeys: string[] = [];

  const fileNames = files.map(file => file.name);

  // 🔁 Send POST to get presigned URLs
  const presignRes = await axios.post(
    `${config.baseURLs.jobPosting}/api/presigned_url/upload/job_attachment`,
    { jobId, fileNames }
  );

  const urls = presignRes.data as { uploadUrl: string; s3Key: string }[];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const { uploadUrl, s3Key } = urls[i];

    try {
      await axios.put(uploadUrl, file, {
        headers: { 'Content-Type': file.type },
      });

      uploadedKeys.push(s3Key);
    } catch (err) {
      console.error('Upload failed:', file.name, err);
      throw new Error(`Failed to upload ${file.name}`);
    }
  }

  return uploadedKeys;
};

// Save uploaded S3 keys to backend
export const saveAttachmentUrls = async (jobId: number, urls: string[]) => {
  return API.post(`/api/v1/job_postings/${jobId}/attachments`, {
    attachmentUrls: urls,
  });
try {
const response = await API.post('/api/v1/job_postings/create_job_posting', payload);
return response.data;
} catch (error: any) {
console.error('Error creating job posting:', error);
throw new Error(error?.response?.data?.message || 'Failed to create job posting');
}
};