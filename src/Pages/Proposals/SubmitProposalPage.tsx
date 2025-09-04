import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJobById } from '../../services/JobServices';
import { submitProposal, uploadProposalAttachments, saveAttachmentUrls, S3_UPLOAD_RETRIES_NUM } from '../../services/ProposalService';
import { JobPosting } from '../../types/JobPosting';
import { toast } from 'react-toastify';

const SubmitProposalPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');
  const [questionAnswers, setQuestionAnswers] = useState<Record<number, string>>({});
     const [attachments, setAttachments] = useState<File[]>([]);


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
    setError('');

    if (!freelancerId || !job) {
      setError('Missing job or freelancer info');
      return;
    }

    try {
      // First submit the proposal
      const response = await submitProposal({
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

      console.log('Proposal submission response:', response);

      // Ensure we have a valid response
      if (!response) {
        throw new Error('No response received from server');
      }
      
      // The server returns the proposal data directly, so we can use the response as is
      // and we don't need to extract a separate proposalId
      const proposal = response;
      
      if (!proposal) {
        console.error('Invalid response format. Expected proposal data in:', response);
        throw new Error('Invalid response format from server');
      }

      // If there are attachments, upload them to S3
      if (attachments.length > 0) {
        try {
          const { uploadedKeys, failedFiles } = await uploadProposalAttachments(attachments, proposal.proposalId);
          
          // Save the successfully uploaded file URLs
          if (uploadedKeys.length > 0) {
            await saveAttachmentUrls(proposal.proposalId, uploadedKeys);
          }

          if (failedFiles.length > 0) {
            toast.warning(`Some files failed to upload: ${failedFiles.join(', ')}`);
          }
        } catch (uploadError) {
          console.error('Error uploading files:', uploadError);
          toast.error('Proposal was submitted but there was an error uploading some files');
        }
      }

      console.log('Proposal submitted successfully!', response);
      toast.success('Proposal submitted successfully!');
      navigate('/');
    } catch (err) {
      console.error('Proposal submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit proposal');
      toast.error('Failed to submit proposal');
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

        {/* Job Posting Attachement*/}
    <label className="block text-sm font-medium mb-1">Attachments (Max 10 files)</label>
          <input
            type="file"
            multiple
            accept="*"
            onChange={(e) => {
              const newFiles = Array.from(e.target.files || []);

              const combinedFiles = [...attachments, ...newFiles];

              if (combinedFiles.length > 10) {
                toast.error('You can upload up to 10 files in total.');
                return;
              }
              setAttachments(combinedFiles);
            }}
            className="w-full p-2 border rounded"
          />
          <ul className="text-sm mt-2">
            {attachments.map((file, idx) => (
              <li key={idx} className="flex justify-between items-center">
                {file.name}
                <button
                  className="ml-2 text-red-500 text-xs"
                  onClick={() => {
                    setAttachments(prev => prev.filter((_, i) => i !== idx));
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

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
