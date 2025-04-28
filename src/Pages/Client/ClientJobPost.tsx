
import { useState } from "react";
// import { useAuth } from "./AuthContext"; 

const ClientJobPost = () => {
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

    const payload = {
      ...formData,
      skills: formData.skills.split(",").map((s) => s.trim()),
      postedBy: "anonymous", 
    };

    console.log("✅ Job Post Payload:", payload);

    // Example API call (uncomment when backend is ready)
    // fetch("/api/jobs", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
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
        <input name="deadline" value={formData.deadline} onChange={handleChange} placeholder="Deadline" type="date" className="w-full p-2 border rounded" />
        <input name="skills" value={formData.skills} onChange={handleChange} placeholder="Required Skills (comma separated)" className="w-full p-2 border rounded" />

        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
          🚀 Submit Job
        </button>
      </form>
    </div>
  );
};

export default ClientJobPost;
