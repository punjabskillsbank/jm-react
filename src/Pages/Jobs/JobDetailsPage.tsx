import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { JobPosting } from '../../types/JobPosting';
import { fetchJobById } from '../../services/JobServices';

const JobDetailPage: React.FC = () => {
  const { jobPostingId } = useParams();
  const [job, setJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeoutExceeded, setTimeoutExceeded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const loadJob = async () => {
      if (!jobPostingId) return;

      setLoading(true);
      setTimeoutExceeded(false);
      timeoutId = setTimeout(() => setTimeoutExceeded(true), 5000);

      try {
        const data = await fetchJobById(Number(jobPostingId));
        setJob(data);
      } catch (error) {
        console.error('Error loading job:', error);
      } finally {
        setLoading(false);
        clearTimeout(timeoutId);
      }
    };

    loadJob();

    return () => clearTimeout(timeoutId);
  }, [jobPostingId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
        {timeoutExceeded && (
          <p className="mt-4 text-sm text-gray-500">
            Taking longer than usual to load. Please wait or check your connection.
          </p>
        )}
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-red-600">
        Failed to load job details. Please try again later.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
      <p className="mb-4 text-gray-700">{job.description}</p>

      <div className="space-y-2 text-sm">
        <p>
          <strong>Category:</strong>{' '}
          {job.category?.category} → {job.category?.speciality}
        </p>
        <p>
          <strong>Experience Level:</strong> {job.experienceLevel}
        </p>
        <p>
          <strong>Project Duration:</strong>{' '}
          {job.projectDuration?.replace('_', ' ') || 'N/A'}
        </p>
        <p>
          <strong>Budget Type:</strong> {job.budgetType}
        </p>

        {job.budgetType === 'HOURLY' ? (
          <p>
            <strong>Hourly Rate:</strong> ${job.hourlyMinRate ?? '-'} - ${job.hourlyMaxRate ?? '-'}/hr
          </p>
        ) : (
          <p>
            <strong>Fixed Price:</strong> ${job.fixedPrice ?? '-'}
          </p>
        )}

        {job.skills?.length > 0 && (
          <p>
            <strong>Skills:</strong> {job.skills.join(', ')}
          </p>
        )}
      </div>
    </div>
  );
};

export default JobDetailPage;
