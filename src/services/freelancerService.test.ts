import { getPendingFreelancers } from './freelancerService';
import common from '../config/commonConfig';
import local from '../config/localConfig';

// Mock the config modules
jest.mock('../config/commonConfig', () => ({
  endpoints: {
    pendingFreelancers: '/pending-freelancers'
  }
}));

jest.mock('../config/localConfig', () => ({
  baseURLs: {
    adminManagement: 'http://localhost:3000/api'
  }
}));

// Mock fetch globally
global.fetch = jest.fn();

describe('freelancerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getPendingFreelancers', () => {
    it('should fetch pending freelancers successfully', async () => {
      // Arrange
      const mockData = [{ freelancerId: '1', title: 'Developer' }];
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockData)
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await getPendingFreelancers();

      // Assert
      expect(global.fetch).toHaveBeenCalledWith(
        `${local.baseURLs.adminManagement}${common.endpoints.pendingFreelancers}`
      );
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      // Arrange
      const mockResponse = {
        ok: false,
        status: 404
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Act & Assert
      await expect(getPendingFreelancers()).rejects.toThrow(
        'Failed to fetch pending freelancers: 404'
      );
    });
  });
});
