import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import { submitProposal, ProposalPayload } from './ProposalService'; // adjust path as needed
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
  };

  afterEach(() => {
    mock.reset();
  });

  it('should successfully submit a proposal and return data', async () => {
    const mockResponse = { success: true, proposalId: 'abc123' };

    mock.onPost(`${baseURL}${endpoint}`).reply(200, mockResponse);

    const result = await submitProposal(mockPayload);

    expect(result).toEqual(mockResponse);
  });

  it('should throw an error when API responds with error', async () => {
    const errorMessage = 'Proposal already submitted';

    mock.onPost(`${baseURL}${endpoint}`).reply(400, {
      message: errorMessage,
    });

    await expect(submitProposal(mockPayload)).rejects.toThrow(errorMessage);
  });

  it('should throw generic error if no response data is available', async () => {
    mock.onPost(`${baseURL}${endpoint}`).networkError();

    await expect(submitProposal(mockPayload)).rejects.toThrow('Failed to submit proposal');
  });
});
