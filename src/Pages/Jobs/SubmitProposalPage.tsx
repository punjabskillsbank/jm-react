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
  const [questionAnswers, setQuestionAnswers] = useState<Record<number, string>>({});

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

  const handleAnswerChange = (questionId: number, answer: string) => {
    setQuestionAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

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
        questionAnswers: job.questions.map((q) => ({
          questionId: q.questionId,
          answer: questionAnswers[q.questionId] || '',
        })),
      });
      alert('Proposal submitted!');
      navigate('/');
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
          <label htmlFor="bidAmount" className="block text-sm font-medium mb-1">
            Bid Amount ($)
          </label>
          <input
            id="bidAmount"
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(Number(e.target.value))}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label htmlFor="coverLetter" className="block text-sm font-medium mb-1">
            Cover Letter
          </label>
          <textarea
            id="coverLetter"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            required
            className="w-full border p-2 rounded"
            rows={5}
          />
        </div>

        {job.questions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Screening Questions</h2>
            {job.questions.map((q) => (
              <div key={q.questionId}>
                <label
                  htmlFor={`question-${q.questionId}`}
                  className="block font-medium mb-1"
                >
                  {q.question}
                </label>
                <textarea
                  id={`question-${q.questionId}`}
                  rows={3}
                  className="w-full border p-2 rounded"
                  value={questionAnswers[q.questionId] || ''}
                  onChange={(e) => handleAnswerChange(q.questionId, e.target.value)}
                  required
                />
              </div>
            ))}
          </div>
        )}

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
