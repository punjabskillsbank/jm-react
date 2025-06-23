import axios from 'axios';
import config from '../config/indexConfig';

const API = axios.create({
  baseURL: config.baseURLs.jobs, // use 'jobs', 'jobPosting', or 'users' as needed
  timeout: 10000,
});

export default API;
export const JobPostingAPI = axios.create({
  baseURL: 'http://localhost:8080', // adjust if needed
});