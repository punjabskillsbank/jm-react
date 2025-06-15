import React, { useEffect, useState } from 'react';
import { fetchOpenJobPostings, fetchCategories } from '../../services/JobServices';
import { JobPosting } from '../../types/JobPosting';
import { useNavigate } from 'react-router-dom';

const OpenJobsPage = () => {
  const [allJobs, setAllJobs] = useState<JobPosting[]>([]);
  const [displayedJobs, setDisplayedJobs] = useState<JobPosting[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedCategoryNames, setSelectedCategoryNames] = useState<string[]>([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest' | 'highest_budget' | 'lowest_budget'>('latest');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [budgetTypes, setBudgetTypes] = useState<string[]>([]);
  const [experienceLevels, setExperienceLevels] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();
  const jobsPerPage = 20;

  const allTags = Array.from(
    new Set(allJobs.flatMap(job => job.category.speciality || []))
  ).sort();

  const allCategoryNames = Array.from(
    new Set(allJobs.map(job => job.category.category).filter(Boolean))
  ).sort();

  useEffect(() => {
    fetchCategories().then((data) => {
      const grouped: Record<string, { id: number; name: string }[]> = {};
      data.forEach((item: { id: number; name: string; categoryName: string }) => {
        const group = item.categoryName || 'Other';
        if (!grouped[group]) grouped[group] = [];
        grouped[group].push({ id: item.id, name: item.name });
      });
      
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchOpenJobPostings()
      .then((data) => setAllJobs(data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!allJobs.length) return;
    let filtered = [...allJobs];

    if (selectedCategories.length) {
      filtered = filtered.filter((job) =>
        selectedCategories.includes(job.category.categoryId)
      );
    }

    if (selectedCategoryNames.length) {
      filtered = filtered.filter((job) =>
        selectedCategoryNames.includes(job.category.category)
      );
    }

    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(keyword) ||
          job.description.toLowerCase().includes(keyword)
      );
    }

    if (selectedSpeciality.length) {
      filtered = filtered.filter((job) => {
        const speciality = job.category.speciality;
        const tagsArray = Array.isArray(speciality)
          ? speciality
          : speciality
          ? [speciality]
          : [];
        return tagsArray.some(tag => selectedSpeciality.includes(tag));
      });
    }

    if (experienceLevels.length) {
      filtered = filtered.filter((job) =>
        experienceLevels.includes(job.experienceLevel.toLowerCase())
      );
    }

    if (budgetTypes.length) {
      filtered = filtered.filter((job) =>
        budgetTypes.includes(job.budgetType.toUpperCase())
      );
    }

    if (sortOrder === 'latest') {
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
      );
    } else {
      filtered.sort((a, b) => {
        const aBudget = a.budgetType === 'FIXED' ? a.fixedPrice || 0 : a.hourlyMaxRate || 0;
        const bBudget = b.budgetType === 'FIXED' ? b.fixedPrice || 0 : b.hourlyMaxRate || 0;
        return bBudget - aBudget;
      });
    }

    const start = (page - 1) * jobsPerPage;
    setDisplayedJobs(filtered.slice(start, start + jobsPerPage));
  }, [allJobs, selectedCategories, selectedCategoryNames, sortOrder, page, searchKeyword, selectedSpeciality, experienceLevels, budgetTypes]);

  const handleCategoryToggle = (id: number) => {
    setPage(1);
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleCategoryNameToggle = (name: string) => {
    setPage(1);
    setSelectedCategoryNames((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleTagToggle = (tag: string) => {
    setPage(1);
    setSelectedSpeciality((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleBudgetTypeToggle = (type: string) => {
    setPage(1);
    setBudgetTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const handleExperienceToggle = (level: string) => {
    setPage(1);
    setExperienceLevels((prev) =>
      prev.includes(level)
        ? prev.filter((l) => l !== level)
        : [...prev, level]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedCategoryNames([]);
    setSelectedSpeciality([]);
    setSortOrder('latest');
    setSearchKeyword('');
    setExperienceLevels([]);
    setBudgetTypes([]);
    setPage(1);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Open Jobs</h1>

      <div className="md:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {(showFilters || window.innerWidth >= 768) && (
          <aside className="w-full md:w-1/4 border p-4 rounded shadow-sm bg-white">
              {/* Search */}
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchKeyword}
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                  setPage(1);
                }}
                className="p-2 border rounded w-full mb-4"
              />

              {/* Budget Type */}
              <div className="mb-4">
                <label className="font-medium">Budget Type:</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {['FIXED', 'HOURLY'].map((type) => (
                    <label key={type} className="text-sm">
                      <input
                        type="checkbox"
                        checked={budgetTypes.includes(type)}
                        onChange={() => handleBudgetTypeToggle(type)}
                        className="mr-1"
                      />
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="mb-4">
                <label className="font-medium">Experience:</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {['beginner', 'intermediate', 'expert'].map((level) => (
                    <label key={level} className="text-sm">
                      <input
                        type="checkbox"
                        checked={experienceLevels.includes(level)}
                        onChange={() => handleExperienceToggle(level)}
                        className="mr-1"
                      />
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="mb-4">
                <label className="font-medium">Sort by:</label>
                <select
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value as 'latest' | 'oldest' | 'highest_budget' | 'lowest_budget');
                    setPage(1);
                  }}
                  className="w-full mt-1 border p-2 rounded"
                >
                  <option value="latest">Latest</option>
                  <option value="oldest">Oldest</option>
                  <option value="highest_budget">Highest Budget</option>
                  <option value="lowest_budget">Lowest Budget</option>
                </select>
              </div>

              {/* Tags */}
              <div className="mb-4">
                <label className="font-medium">Tags:</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      className={`px-2 py-1 border rounded text-sm ${
                        selectedSpeciality.includes(tag)
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-black'
                      }`}
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Names */}
              <div className="mb-4">
                <label className="font-medium">Category Names:</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {allCategoryNames.map((name) => (
                    <button
                      key={name}
                      className={`px-2 py-1 border rounded text-sm ${
                        selectedCategoryNames.includes(name)
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-black'
                      }`}
                      onClick={() => handleCategoryNameToggle(name)}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={clearAllFilters}
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 text-sm"
              >
                Clear All Filters
              </button>
            </aside>

        )}

        {/* Jobs List */}
        <main className="w-full md:w-3/4">
          {loading ? (
            <div className="flex flex-col gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-4 bg-gray-200 animate-pulse h-36 rounded"></div>
              ))}
            </div>
          ) : displayedJobs.length ? (
            <div className="flex flex-col gap-4">
              {displayedJobs.map((job) => (
                <div
                  key={job.jobPostingId}
                  className="p-4 bg-white shadow rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => navigate(`/jobs/${job.jobPostingId}`)}
                >
                  <h2 className="text-xl font-semibold">{job.title}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {job.description.slice(0, 120)}...
                  </p>
                  <p className="text-xs mt-2 text-gray-400">{job.category.speciality}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-4">No jobs found.</p>
          )}

          {/* Pagination */}
          <div className="mt-6 flex justify-center items-center gap-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>Page {page}</span>
            <button
              disabled={page * jobsPerPage >= allJobs.length}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OpenJobsPage;
