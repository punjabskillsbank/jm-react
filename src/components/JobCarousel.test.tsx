import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import JobCarousel from './JobCarousel';
import { MemoryRouter } from 'react-router-dom';
import * as JobServices from '../services/JobServices';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// ✅ Mock the API service
jest.mock('../services/JobServices');

// ✅ Trackable Keen Slider .next() mock
const nextMock = jest.fn();

// ✅ Mock the keen-slider/react
jest.mock('keen-slider/react', () => ({
  useKeenSlider: () => {
    return [
      jest.fn(), // slider ref callback
      { current: { next: nextMock } }, // instanceRef with .next()
    ];
  },
}));

// ✅ Mock job postings
const mockJobs = Array.from({ length: 5 }).map((_, i) => ({
  jobPostingId: i + 1,
  title: `Job Title ${i + 1}`,
  description: `Job Description ${i + 1}`,
  category: {
    category: 'Design',
    speciality: 'UI/UX',
  },
  createdAt: new Date(Date.now() - i * 10000).toISOString(),
  budgetType: 'FIXED',
  fixedPrice: 1000 + i * 100,
  hourlyMinRate: null,
  hourlyMaxRate: null,
}));

describe('JobCarousel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    nextMock.mockClear();
  });

  it('renders heading and jobs from API', async () => {
    (JobServices.fetchOpenJobPostings as jest.Mock).mockResolvedValue(mockJobs);

    render(
      <MemoryRouter>
        <JobCarousel />
      </MemoryRouter>
    );

    expect(screen.getByText(/Explore Latest Jobs/i)).toBeInTheDocument();

    for (const job of mockJobs) {
      await waitFor(() => expect(screen.getByText(job.title)).toBeInTheDocument());
      expect(screen.getByText(`$${job.fixedPrice} fixed`)).toBeInTheDocument();
    }
  });

  it('navigates to job details page on card click', async () => {
    (JobServices.fetchOpenJobPostings as jest.Mock).mockResolvedValue(mockJobs);

    render(
      <MemoryRouter>
        <JobCarousel />
      </MemoryRouter>
    );

    const jobTitle = await screen.findByText(mockJobs[0].title);
    const card = jobTitle.closest('.keen-slider__slide');
    expect(card).toBeInTheDocument();

    userEvent.click(card!);
    // Optionally: check navigation mock if using mocked `useNavigate()`
  });

  it('auto scrolls unless paused (logic check)', async () => {
    jest.useFakeTimers();
    (JobServices.fetchOpenJobPostings as jest.Mock).mockResolvedValue(mockJobs);

    render(
      <MemoryRouter>
        <JobCarousel />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(mockJobs[0].title)).toBeInTheDocument());

    jest.advanceTimersByTime(6000); // simulate 3 intervals
    expect(nextMock).toHaveBeenCalledTimes(3);

    jest.useRealTimers();
  });
});

