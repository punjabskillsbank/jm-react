import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import { submitProposal, ProposalPayload } from './ProposalService';
import config from '../config/indexConfig';

describe('submitProposal', () => {
  const mock = new AxiosMockAdapter(axios);
  const baseURL = config.baseURLs.jobProposal;
  const endpoint = '/api/v1/proposals/create_proposal';

  const mockPayload: ProposalPayload = {
    jobPostingId: 123,
    freelancerId: 'freelancer_1',
    clientId: 'client_1',
    proposedBidAmount: 5000,
    proposalStatus: 'SUBMITTED',
    coverLetter: 'I am the best fit for this job.',
    questionAnswers: [
      { questionId: 1, answer: 'Yes' },
      { questionId: 2, answer: 'No' }
    ]
  };

  afterEach(() => {
    mock.reset();
    jest.clearAllMocks();
  });

  it('should successfully submit a proposal and return data', async () => {
    const mockResponse = { success: true, proposalId: 'abc123' };
    mock.onPost(endpoint).reply(200, mockResponse);

    const result = await submitProposal(mockPayload);

    expect(result).toEqual(mockResponse);
  });

  it('should throw an error when API responds with error', async () => {
    const errorMessage = 'Proposal already submitted';
    mock.onPost(endpoint).reply(400, { message: errorMessage });

    await expect(submitProposal(mockPayload)).rejects.toThrow(errorMessage);
  });

  it('should throw generic error if no response data is available', async () => {
    mock.onPost(endpoint).networkError();

    await expect(submitProposal(mockPayload)).rejects.toThrow('Failed to submit proposal');
  });

  it('should log success message on successful submission', async () => {
    const mockResponse = { success: true, proposalId: 'xyz789' };
    mock.onPost(endpoint).reply(200, mockResponse);
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await submitProposal(mockPayload);

    expect(logSpy).toHaveBeenCalledWith('Proposal submitted successfully:', mockResponse);
    logSpy.mockRestore();
  });

  it('should log error message on failed submission', async () => {
    const errorMessage = 'Invalid payload';
    mock.onPost(endpoint).reply(400, { message: errorMessage });
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(submitProposal(mockPayload)).rejects.toThrow(errorMessage);

    expect(errorSpy).toHaveBeenCalledWith(
      'Proposal submission failed:',
      { message: errorMessage }
    );
    errorSpy.mockRestore();
  });

  it('should handle empty questionAnswers array', async () => {
    const payload = { ...mockPayload, questionAnswers: [] };
    const mockResponse = { success: true, proposalId: 'emptyQ' };
    mock.onPost(endpoint).reply(200, mockResponse);

    const result = await submitProposal(payload);

    expect(result).toEqual(mockResponse);
  });

  it('should handle DRAFT proposalStatus', async () => {
    const payload = { ...mockPayload, proposalStatus: 'DRAFT' as const };
    const mockResponse = { success: true, proposalId: 'draft123' };
    mock.onPost(endpoint).reply(200, mockResponse);

    const result = await submitProposal(payload);

    expect(result).toEqual(mockResponse);
  });
});
