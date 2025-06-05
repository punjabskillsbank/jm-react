import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobPost from './JobPost';
import * as JobPostService from '../../services/JobPostService';

jest.mock('../../services/JobPostService');

const mockCategories = {
  "Development": ["Frontend", "Backend"],
  "Design": ["UI/UX"]
};

describe('JobPost Component - Varied Jobs', () => {
  beforeEach(async () => {
    (JobPostService.fetchCategories as jest.Mock).mockResolvedValue(mockCategories);
    render(<JobPost />);
    await waitFor(() => screen.getByText('Create Job Posting'));
  });

  const fillAndSubmitJob = async (jobData, statusLabel) => {
    if (jobData.budgetType === 'FIXED') {
      fireEvent.change(screen.getByDisplayValue('Hourly'), { target: { value: 'FIXED' } });
      fireEvent.change(screen.getByPlaceholderText('Fixed Price'), { target: { value: jobData.fixedPrice } });
    } else {
      fireEvent.change(screen.getByPlaceholderText('Min Rate'), { target: { value: jobData.hourlyMinRate } });
      fireEvent.change(screen.getByPlaceholderText('Max Rate'), { target: { value: jobData.hourlyMaxRate } });
    }

    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: jobData.title } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: jobData.description } });
    fireEvent.change(screen.getByLabelText('Project Duration'), { target: { value: jobData.projectDuration } });
    fireEvent.change(screen.getByLabelText('Experience Level'), { target: { value: jobData.experienceLevel } });
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: jobData.category } });

    fireEvent.click(screen.getByText(statusLabel));

    await waitFor(() => {
      expect(JobPostService.createJobPosting).toHaveBeenCalled();
    });
  };

  test('Job 1: Frontend, hourly, short term, beginner', async () => {
    (JobPostService.createJobPosting as jest.Mock).mockResolvedValue({});
    await fillAndSubmitJob({
      title: 'Frontend Fixes',
      description: 'Fix header bugs and optimize layout',
      budgetType: 'HOURLY',
      hourlyMinRate: 10,
      hourlyMaxRate: 25,
      fixedPrice: 0,
      projectDuration: 'SHORT_TERM',
      experienceLevel: 'BEGINNER',
      category: 'Frontend',
    }, 'Post Job');
  });

  test('Job 2: Backend, fixed price, long term, intermediate', async () => {
    (JobPostService.createJobPosting as jest.Mock).mockResolvedValue({});
    await fillAndSubmitJob({
      title: 'Backend API Dev',
      description: 'Build scalable APIs for mobile app',
      budgetType: 'FIXED',
      hourlyMinRate: 0,
      hourlyMaxRate: 0,
      fixedPrice: 800,
      projectDuration: 'LONG_TERM',
      experienceLevel: 'INTERMEDIATE',
      category: 'Backend',
    }, 'Post Job');
  });

  test('Job 3: UI/UX, hourly, long term, advanced', async () => {
    (JobPostService.createJobPosting as jest.Mock).mockResolvedValue({});
    await fillAndSubmitJob({
      title: 'App Redesign',
      description: 'Revamp app interface with better UX flow',
      budgetType: 'HOURLY',
      hourlyMinRate: 30,
      hourlyMaxRate: 50,
      fixedPrice: 0,
      projectDuration: 'LONG_TERM',
      experienceLevel: 'ADVANCE',
      category: 'UI/UX',
    }, 'Post Job');
  });

  test('Job 4: Frontend, fixed price, short term, intermediate', async () => {
    (JobPostService.createJobPosting as jest.Mock).mockResolvedValue({});
    await fillAndSubmitJob({
      title: 'Landing Page',
      description: 'Build responsive landing page for product launch',
      budgetType: 'FIXED',
      hourlyMinRate: 0,
      hourlyMaxRate: 0,
      fixedPrice: 300,
      projectDuration: 'SHORT_TERM',
      experienceLevel: 'INTERMEDIATE',
      category: 'Frontend',
    }, 'Post Job');
  });

  test('Job 5: Backend, hourly, short term, advanced', async () => {
    (JobPostService.createJobPosting as jest.Mock).mockResolvedValue({});
    await fillAndSubmitJob({
      title: 'Database Optimization',
      description: 'Improve DB queries and schema for performance',
      budgetType: 'HOURLY',
      hourlyMinRate: 40,
      hourlyMaxRate: 60,
      fixedPrice: 0,
      projectDuration: 'SHORT_TERM',
      experienceLevel: 'ADVANCE',
      category: 'Backend',
    }, 'Post Job');
  });
});