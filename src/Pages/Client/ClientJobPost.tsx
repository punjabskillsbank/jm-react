// src/pages/ClientJobPost.tsx
import { useState } from "react";
import { useAuth } from "./AuthContext.js"; // Adjust the import path as necessary

const ClientJobPost = () => {
  const { token, role, email } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    experienceLevel: "",
    budget: "",
    deadline: "",
    skills: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (role !== "client") {
      alert("Only clients can post jobs!");
      return;
    }

    const payload = {
      ...formData,
      skills: formData.skills.split(",").map((s) => s.trim()),
      postedBy: email,
    };

    console.log("✅ Job Post Payload:", payload);
    console.log("🔐 Token:", token);

    // Example API call
    // fetch("/api/jobs", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: JSON.stringify(payload),
    // });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4">📝 Post a New Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={formData.title} onChange={handleChange} placeholder="Job Title" required className="w-full p-2 border rounded" />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Job Description" rows={5} className="w-full p-2 border rounded" />
        
        <input name="category" value={formData.category} onChange={handleChange} placeholder="Job Category" className="w-full p-2 border rounded" />
        
        <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Select Experience Level</option>
          <option value="entry">Entry</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Expert</option>
        </select>

        <input name="budget" value={formData.budget} onChange={handleChange} placeholder="Budget (in USD)" type="number" className="w-full p-2 border rounded" />
        <input name="deadline" value={formData.deadline} onChange={handleChange} placeholder="Deadline (e.g. 2025-04-15)" type="date" className="w-full p-2 border rounded" />
        <input name="skills" value={formData.skills} onChange={handleChange} placeholder="Required Skills (comma separated)" className="w-full p-2 border rounded" />

        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
          🚀 Submit Job
        </button>
      </form>
    </div>
  );
};

export default ClientJobPost;
