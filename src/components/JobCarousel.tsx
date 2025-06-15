import { useEffect, useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { JobPosting } from '../types/JobPosting';
import { fetchOpenJobPostings } from '../services/JobServices';
import { useNavigate } from 'react-router-dom';

const JobCarousel = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [pause, setPause] = useState(false);
  const navigate = useNavigate();

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      '(min-width: 640px)': {
        slides: { perView: 1.5, spacing: 20 },
      },
      '(min-width: 768px)': {
        slides: { perView: 2.5, spacing: 24 },
      },
      '(min-width: 1024px)': {
        slides: { perView: 4, spacing: 28 },
      },
    },
  });

  useEffect(() => {
    const fetchJobs = async () => {
      const response = await fetchOpenJobPostings();
      const sorted = response
        .sort(
          (a: JobPosting, b: JobPosting) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 16); 
      setJobs(sorted);
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!pause) {
        instanceRef.current?.next();
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [pause, instanceRef]);

  return (
    <div
      className="w-full max-w-7xl mx-auto px-4 py-12 overflow-hidden"
      onMouseEnter={() => setPause(true)}
      onMouseLeave={() => setPause(false)}
    >
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Explore Latest Jobs
      </h2>

      <div ref={sliderRef} className="keen-slider">
        {jobs.map((job) => (
          <div
            key={job.jobPostingId}
            className="keen-slider__slide bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer h-full"
            style={{ minWidth: 0 }}
            onClick={() => navigate(`/jobs/${job.jobPostingId}`)}
          >
            <div className="flex flex-col h-full">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                {job.title}
              </h3>
              <p className="text-sm text-indigo-600 font-medium mb-1">
                {job.category.category}
              </p>
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                {job.description}
              </p>
              <div className="text-sm font-semibold text-green-600 mt-auto">
                {job.budgetType === 'HOURLY'
                  ? `$${job.hourlyMinRate}–${job.hourlyMaxRate}/hr`
                  : `$${job.fixedPrice} fixed`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobCarousel;
