import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobPost from './JobPost';
import { createJobPosting } from '../../services/JobPostService';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

jest.mock('../../services/JobPostService', () => ({
  createJobPosting: jest.fn(),
}));

const renderComponent = () => {
  render(
    <>
      <JobPost />
      <ToastContainer />
    </>
  );
};

describe('JobPost Component - All Job Scenarios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const fillCommonFields = () => {
    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: 'Sample Job Title' },
    });

    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: 'Sample job description goes here.' },
    });

    fireEvent.change(screen.getByLabelText(/Project Duration/i), {
      target: { value: 'LONG_TERM' },
    });

    fireEvent.change(screen.getByLabelText(/Experience Level/i), {
      target: { value: 'EXPERT' },
    });

    fireEvent.change(screen.getByLabelText(/Category/i), {
      target: { value: 'Design' },
    });

    // Add skill
    const skillInput = screen.getByPlaceholderText(/Add skill/i);
    fireEvent.change(skillInput, { target: { value: 'Figma' } });
    fireEvent.click(screen.getAllByText(/Add/i)[0]);

    // Add question
    const questionInput = screen.getByPlaceholderText(/Add question/i);
    fireEvent.change(questionInput, { target: { value: 'What is UX?' } });
    fireEvent.click(screen.getAllByText(/Add/i)[1]);
  };

  test('submits HOURLY job post successfully', async () => {
    (createJobPosting as jest.Mock).mockResolvedValueOnce({
      message: 'Hourly job created successfully',
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/Budget Type/i), {
      target: { value: 'HOURLY' },
    });

    fireEvent.change(screen.getByLabelText(/Min Rate/i), {
      target: { value: '30' },
    });

    fireEvent.change(screen.getByLabelText(/Max Rate/i), {
      target: { value: '60' },
    });

    fillCommonFields();
    fireEvent.click(screen.getByText(/Post Job/i));

    await waitFor(() => {
      expect(createJobPosting).toHaveBeenCalled();
      expect(screen.getByText(/Job posted successfully!/i)).toBeInTheDocument();
    });
  });

  test('submits FIXED job post successfully', async () => {
    (createJobPosting as jest.Mock).mockResolvedValueOnce({
      message: 'Fixed price job created successfully',
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/Budget Type/i), {
      target: { value: 'FIXED' },
    });

    fireEvent.change(screen.getByLabelText(/Fixed Price/i), {
      target: { value: '500' },
    });

    fillCommonFields();
    fireEvent.click(screen.getByText(/Post Job/i));

    await waitFor(() => {
      expect(createJobPosting).toHaveBeenCalled();
      expect(screen.getByText(/Job posted successfully!/i)).toBeInTheDocument();
    });
  });

  test('shows error toast on API failure', async () => {
    (createJobPosting as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Failed to post job' } },
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/Budget Type/i), {
      target: { value: 'FIXED' },
    });

    fireEvent.change(screen.getByLabelText(/Fixed Price/i), {
      target: { value: '100' },
    });

    fillCommonFields();
    fireEvent.click(screen.getByText(/Post Job/i));

    await waitFor(() => {
      expect(createJobPosting).toHaveBeenCalled();
      expect(screen.getByText(/Submission failed/i)).toBeInTheDocument();
    });
  });

  test('shows validation error if required fields are missing', async () => {
    renderComponent();

    fireEvent.click(screen.getByText(/Post Job/i));

    await waitFor(() => {
      expect(createJobPosting).not.toHaveBeenCalled();
      expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
    });
  });

  test('handles missing skill or question gracefully', async () => {
    (createJobPosting as jest.Mock).mockResolvedValueOnce({
      message: 'Job created without skills/questions',
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/Budget Type/i), {
      target: { value: 'HOURLY' },
    });

    fireEvent.change(screen.getByLabelText(/Min Rate/i), {
      target: { value: '10' },
    });

    fireEvent.change(screen.getByLabelText(/Max Rate/i), {
      target: { value: '25' },
    });

    // fill rest except skills/questions
    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: 'Another Job' },
    });

    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: 'No skill/question' },
    });

    fireEvent.change(screen.getByLabelText(/Project Duration/i), {
      target: { value: 'ONE_TIME' },
    });

    fireEvent.change(screen.getByLabelText(/Experience Level/i), {
      target: { value: 'INTERMEDIATE' },
    });

    fireEvent.change(screen.getByLabelText(/Category/i), {
      target: { value: 'Backend' },
    });

    fireEvent.click(screen.getByText(/Post Job/i));

    await waitFor(() => {
      expect(createJobPosting).toHaveBeenCalled();
      expect(screen.getByText(/Job posted successfully!/i)).toBeInTheDocument();
    });
  });
});
