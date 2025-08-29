import axios from "axios";

const API_BASE = "http://localhost:8080/api/admin_management"; // keep base clean

export const getPendingFreelancers = async () => {
  const res = await axios.get(`${API_BASE}/pending_freelancers`);
  return res.data;
};
