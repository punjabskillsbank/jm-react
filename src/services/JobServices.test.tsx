import { fetchOpenJobPostings } from './JobServices';

// ✅ Declare BEFORE mock
let mockGet: jest.Mock;

jest.mock('axios', () => {
  mockGet = jest.fn(); // assign mock here

  return {
    create: () => ({
      get: mockGet,
    }),
  };
});

describe('JobServices API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetchOpenJobPostings: returns job list on success', async () => {
    const mockResponse = { data: [{ id: 1, title: 'Frontend Developer' }] };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await fetchOpenJobPostings();
    expect(result).toEqual(mockResponse.data);
    expect(mockGet).toHaveBeenCalledWith('/api/v1/job_postings/open_job_postings');
  });

  it('fetchOpenJobPostings: throws error on failure', async () => {
    mockGet.mockRejectedValueOnce(new Error('Network Error'));

    await expect(fetchOpenJobPostings()).rejects.toThrow('Network Error');
  });
});
