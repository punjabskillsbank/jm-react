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