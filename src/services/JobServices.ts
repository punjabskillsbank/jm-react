import axios from 'axios';
import config from '../config/indexConfig';

const API = axios.create({
  baseURL: config.baseURLs.jobs,
});

export const fetchOpenJobPostings = async () => {
  const res = await API.get('/api/v1/job_postings/open_job_postings');
  return res.data;
};

export const fetchJobById = async (jobPostingId: number) => {
  const res = await API.get(`/api/v1/job_postings/${jobPostingId}`);
  return res.data;
};

export const fetchCategories = async () => {
  const res = await API.get('/api/v1/job_postings/categories');
  return Array.isArray(res.data) ? res.data : []; // guarantee it's an array
};

