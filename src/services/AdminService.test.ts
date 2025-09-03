import { getPendingFreelancers } from './AdminService';
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

describe('AdminService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getPendingFreelancers', () => {
    it('should fetch pending freelancers with dynamic fields successfully', async () => {
      // Arrange - Using a more comprehensive dataset to test dynamic fields
      const mockData = [
        { 
          freelancerId: '1', 
          name: 'John Doe',
          title: 'Frontend Developer',
          skills: 'React, TypeScript',
          experience: '5 years',
          hourlyRate: 50,
          location: 'New York',
          availability: 'Full-time',
          profileStatus: 'pending'
        },
        {
          freelancerId: '2',
          name: 'Jane Smith',
          title: 'Backend Developer',
          skills: 'Node.js, MongoDB',
          experience: '3 years',
          hourlyRate: 60,
          location: 'San Francisco',
          availability: 'Part-time',
          profileStatus: 'pending'
        }
      ];
      
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
      expect(result[0]).toHaveProperty('freelancerId');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('skills');
      expect(result[0]).toHaveProperty('experience');
      expect(result[0]).toHaveProperty('hourlyRate');
    });

    it('should handle empty array response', async () => {
      // Arrange
      const mockData = [];
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockData)
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await getPendingFreelancers();

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
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

    it('should handle network errors', async () => {
      // Arrange
      const networkError = new Error('Network error');
      (global.fetch as jest.Mock).mockRejectedValue(networkError);

      // Act & Assert
      await expect(getPendingFreelancers()).rejects.toThrow('Network error');
    });
  });
});
