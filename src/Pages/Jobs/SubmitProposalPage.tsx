import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJobById } from '../../services/JobServices';
import { submitProposal } from '../../services/ProposalService';
import { JobPosting } from '../../types/JobPosting';

const SubmitProposalPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');

  const freelancerId = localStorage.getItem('user_id'); 

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await fetchJobById(Number(id));
        setJob(data);
      } catch (err) {
        console.error('Failed to load job', err);
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!freelancerId || !job) {
      setError('Missing job or freelancer info');
      return;
    }

    try {
      await submitProposal({
        jobPostingId: job.jobPostingId,
        freelancerId,
        clientId: job.clientId,
        proposedBidAmount: bidAmount,
        proposalStatus: 'SUBMITTED',
        coverLetter,
      });

      alert('Proposal submitted!');
      navigate('/my-proposals');
    } catch (err) {
      console.error(err);
      setError('Failed to submit proposal');
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (!job) return <p className="p-4 text-red-500">Job not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Apply to: {job.title}</h1>
      <p className="text-gray-700 mb-4">{job.description}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Bid Amount ($)</label>
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(Number(e.target.value))}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cover Letter</label>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            required
            className="w-full border p-2 rounded"
            rows={5}
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Proposal
        </button>
      </form>
    </div>
  );
};

export default SubmitProposalPage;
