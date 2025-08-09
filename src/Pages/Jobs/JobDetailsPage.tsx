import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchJobById } from '../../services/JobServices';
import { JobPosting } from '../../types/JobPosting';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const data = await fetchJobById(Number(id));
        setJob(data);
      } catch (error) {
        console.error('Failed to fetch job:', error);
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!job) return <p>Job not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
      <p className="text-gray-700 mb-4">{job.description}</p>

      <div className="grid grid-cols-2 gap-4 text-sm mb-6">
        <div>
          <strong>Budget:</strong>{' '}
          {job.budgetType === 'FIXED'
            ? `$${job.fixedPrice}`
            : `$${job.hourlyMinRate}–${job.hourlyMaxRate}/hr`}
        </div>
        <div><strong>Experience:</strong> {job.experienceLevel}</div>
        <div><strong>Duration:</strong> {job.projectDuration}</div>
        <div><strong>Status:</strong> {job.jobPostingStatus}</div>
        <div><strong>Category:</strong> {job.category?.category || 'N/A'}</div>
        <div><strong>Speciality:</strong> {job.category?.speciality || 'N/A'}</div>
      </div>

      {/* Skills (optional if empty) */}
      {job.skills && job.skills.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-1">Skills Required:</h3>
          <ul className="list-disc list-inside text-sm text-gray-800">
            {job.skills.map((skill, idx) => (
              <li key={idx}>{skill}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Screening Questions */}
      {job.questions && job.questions.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-1">Screening Questions:</h3>
          <ul className="list-disc list-inside text-sm text-gray-800">
            {job.questions.map((q, index) => (
              <li key={index}>{q.question}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={() => navigate(`/jobs/${job.jobPostingId}/apply`)}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-all"
      >
        Apply Now
      </button>
    </div>
  );
};

export default JobDetailsPage;
