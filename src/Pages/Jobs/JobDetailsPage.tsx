import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchJobById } from '../../services/JobServices';

const JobDetailsPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const data = await fetchJobById(id!); // force unwrap or add check
        setJob(data);
      } catch (error) {
        console.error("Failed to fetch job:", error);
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!job) return <p>Job not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
      <p className="text-gray-700 mb-4">{job.description}</p>
      <div className="grid grid-cols-2 gap-4">
        <div><strong>Budget:</strong> {job.budgetType}</div>
        <div><strong>Experience:</strong> {job.experienceLevel}</div>
        <div><strong>Duration:</strong> {job.projectDuration}</div>
        <div><strong>Status:</strong> {job.jobPostingStatus}</div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
