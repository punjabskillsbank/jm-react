import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import JobForm from "./JobForm";
import JobList from "./JobList";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = "http://localhost:8081/api/v1/job_postings";
const CATEGORY_API = "http://localhost:8081/api/v1/job_postings/categories";

const JobPostingPage = () => {
const [jobs, setJobs] = useState([]);
const [categories, setCategories] = useState({});
const [search, setSearch] = useState("");
const [form, setForm] = useState(initialFormState());
const [editingJobId, setEditingJobId] = useState(null);

  const fetchJobs = useCallback(async () => {
  try {
  const clientId = form.clientId;
  const res = await axios.get(`${API_BASE}/client/${clientId}`);
  setJobs(res.data);
  } catch (error) {
  console.error("Failed to fetch jobs:", error);
  toast.error("Failed to fetch jobs");
  }
  }, [form.clientId]);

  useEffect(() => {
  fetchJobs();
  fetchCategories();
  }, [fetchJobs]);

  const fetchCategories = async () => {
  try {
  const res = await axios.get(CATEGORY_API);
  const rawData = res.data;

    let idCounter = 1;
    const flatCategoryList = [];

    Object.entries(rawData).forEach(([group, subcategories]) => {
      (subcategories as string[]).forEach((sub) => {
        flatCategoryList.push({
          id: idCounter++,
          name: `${group} > ${sub}`,
        });
      });
    });

    const categoryMap = Object.fromEntries(
      flatCategoryList.map((cat) => [cat.id, cat.name])
    );

    setCategories(categoryMap);
  } catch (err) {
    console.error("Failed to fetch categories", err);
    toast.error("Failed to load categories");
  }
  };

  const handlePostOrUpdateJob = async () => {
  try {
  const payload = {
  ...form,
  hourlyMinRate: Number(form.hourlyMinRate),
  hourlyMaxRate: Number(form.hourlyMaxRate),
  fixedPrice: Number(form.fixedPrice),
  categoryId: Number(form.categoryId),
  };

    if (editingJobId) {
      // PATCH request to update job
      await axios.patch(`${API_BASE}/${editingJobId}`, payload);
      toast.success("Job updated successfully!");
    } else {
      // POST request to create new job
      await axios.post(`${API_BASE}/create_job_posting`, payload);
      toast.success("Job posted successfully!");
    }

    setForm(initialFormState());
    setEditingJobId(null);
    fetchJobs();
  } catch (error) {
    console.error("Job post/update failed:", error);
    toast.error("Failed to post/update job.");
  }
  };

    const handleEdit = (job) => {
    setForm({
    ...job,
    categoryId: String(job.categoryId),
    });
    setEditingJobId(job.job_posting_id); // Important: use correct ID field
    };



    const filteredJobs = jobs.filter((job) =>
    job.title?.toLowerCase().includes(search.toLowerCase())
    );

    return (
    <div className="max-w-5xl mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-6 text-center">Job Posting Portal</h1>

      <JobForm
        form={form}
        setForm={setForm}
        categories={categories}
        onSubmit={handlePostOrUpdateJob}
        editingJobId={editingJobId}
      />

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 p-2 border rounded"
        />
      </div>

      <JobList
        jobs={filteredJobs}
        categories={categories}
        onEdit={handleEdit}
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
    );
    };

    const initialFormState = () => ({
    clientId: "88033018-f0aa-44ff-9678-741b37dac853",
    title: "",
    description: "",
    budgetType: "HOURLY",
    hourlyMinRate: "",
    hourlyMaxRate: "",
    fixedPrice: "",
    projectDuration: "SHORT_TERM",
    experienceLevel: "BEGINNER",
    categoryId: "",
    });

export default JobPostingPage;