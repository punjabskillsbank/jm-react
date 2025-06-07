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
  } catch {
    throw new Error('Failed to fetch categories');
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
}

// Create job posting
export const createJobPosting = async (payload: JobPostingPayload) => {
  try {
    const response = await API.post('/api/v1/job_postings/create_job_posting', payload);
    return response.data;
  } catch {
    throw new Error('Failed to create job posting');
  }
};
