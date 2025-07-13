// src/Pages/Admin/AdminReview.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/axios"; 

interface Freelancer {
  id: string;
  name: string;
  email: string;
  skills?: string[];
}

const AdminReview = () => {
  const [pendingFreelancers, setPendingFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch pending freelancers on load
  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await axios.get("/api/admin/freelancers/pending");
        setPendingFreelancers(res.data);
      } catch (err) {
        console.error("Error fetching pending freelancers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await axios.post(`/api/admin/freelancers/${id}/approve`);
      setPendingFreelancers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Approval failed:", err);
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await axios.post(`/api/admin/freelancers/${id}/decline`);
      setPendingFreelancers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Decline failed:", err);
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Pending Freelancer Profiles</h1>

      {pendingFreelancers.length === 0 ? (
        <p>No profiles to review.</p>
      ) : (
        <div className="space-y-4">
          {pendingFreelancers.map((freelancer) => (
            <div
              key={freelancer.id}
              className="border rounded-xl p-4 shadow flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-bold">{freelancer.name}</h2>
                <p>Email: {freelancer.email}</p>
                <p>Skills: {freelancer.skills?.join(", ") || "N/A"}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(freelancer.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDecline(freelancer.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Decline
                </button>
                <button
                  onClick={() => navigate(`/admin/freelancer/${freelancer.id}`)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReview;
