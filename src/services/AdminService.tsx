
import axios from "./axios";
export const getPendingFreelancers = async (): Promise<UserType[]> => {
  const res = await axios.get("/api/admin/freelancers/pending");
  return res.data;
};

export const approveFreelancer = async (id: string) => {
  return axios.post(`/api/admin/freelancers/${id}/approve`);
};

export const declineFreelancer = async (id: string) => {
  return axios.post(`/api/admin/freelancers/${id}/decline`);
};

export const getFreelancerById = async (id: string): Promise<UserType> => {
  const res = await axios.get(`/api/admin/freelancers/${id}`);
  return res.data;
};
