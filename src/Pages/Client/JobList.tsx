import React from "react";

type Job = {
  id: string;
  title: string;
  description: string;
  budgetType: "HOURLY" | "FIXED";
  hourlyMinRate?: number;
  hourlyMaxRate?: number;
  fixedPrice?: number;
  projectDuration: string;
  experienceLevel: string;
  categoryId: string;
};

type JobListProps = {
  jobs: Job[];
  categories: { [key: string]: string };
  onEdit: (job: Job) => void;
};

const JobList: React.FC<JobListProps> = ({ jobs, categories, onEdit }) => (
  <div className="grid gap-6">
    {jobs.length > 0 ? (
      jobs.map((job) => (
        <div key={job.id} className="p-4 border rounded shadow-sm">
          <div className="flex justify-between">
            <div>
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{job.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                <span><strong>Type:</strong> {job.budgetType}</span>
                {job.budgetType === "HOURLY" ? (
                  <span><strong>Rate:</strong> ${job.hourlyMinRate} - ${job.hourlyMaxRate}/hr</span>
                ) : (
                  <span><strong>Fixed Price:</strong> ${job.fixedPrice}</span>
                )}
                <span><strong>Duration:</strong> {job.projectDuration}</span>
                <span><strong>Experience:</strong> {job.experienceLevel}</span>
                <span><strong>Category:</strong> {categories[job.categoryId]}</span>
              </div>
            </div>
            <div className="space-x-2">
              <button onClick={() => onEdit(job)} className="text-blue-600 underline">Edit</button>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p>No open jobs found.</p>
    )}
  </div>
);

export default JobList;
