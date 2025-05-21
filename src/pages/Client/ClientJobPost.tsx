import { useState } from "react";

const ClientJobPost = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budgetType: "HOURLY",
    hourlyMinRate: "",
    hourlyMaxRate: "",
    fixedPrice: "",
    projectDuration: "SHORT_TERM",
    experienceLevel: "",
    categoryId: "",
  });

  const clientId = "39f89cc0-2df7-4bb6-b503-09cb2c20616d"; 

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      clientId,
      title: formData.title.trim(),
      description: formData.description.trim(),
      budgetType: formData.budgetType,
      hourlyMinRate: formData.budgetType === "HOURLY" ? Number(formData.hourlyMinRate) : null,
      hourlyMaxRate: formData.budgetType === "HOURLY" ? Number(formData.hourlyMaxRate) : null,
      fixedPrice: formData.budgetType === "FIXED" ? Number(formData.fixedPrice) : null,
      projectDuration: formData.projectDuration,
      experienceLevel: formData.experienceLevel.toUpperCase(),
      categoryId: formData.categoryId,
    };

    console.log("✅ Job Post Payload:\n", JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(
        "http://localhost:8082/api/v1/job_postings/create_job_posting",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Job posting failed");

      alert("✅ Job posted successfully!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("❌ Error posting job:", error.message);
        alert("❌ Failed to post job: " + error.message);
      } else {
        console.error("❌ Unexpected error:", error);
        alert("❌ Failed to post job due to an unexpected error.");
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4">📝 Post a New Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Job Title"
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Job Description"
          rows={5}
          className="w-full p-2 border rounded"
        />
        <select
          name="budgetType"
          value={formData.budgetType}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="HOURLY">Hourly</option>
          <option value="FIXED">Fixed</option>
        </select>

        {formData.budgetType === "HOURLY" ? (
          <>
            <input
              name="hourlyMinRate"
              value={formData.hourlyMinRate}
              onChange={handleChange}
              placeholder="Hourly Min Rate (USD)"
              type="number"
              required
              className="w-full p-2 border rounded"
            />
            <input
              name="hourlyMaxRate"
              value={formData.hourlyMaxRate}
              onChange={handleChange}
              placeholder="Hourly Max Rate (USD)"
              type="number"
              required
              className="w-full p-2 border rounded"
            />
          </>
        ) : (
          <input
            name="fixedPrice"
            value={formData.fixedPrice}
            onChange={handleChange}
            placeholder="Fixed Price (USD)"
            type="number"
            required
            className="w-full p-2 border rounded"
          />
        )}

        <select
          name="projectDuration"
          value={formData.projectDuration}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="SHORT_TERM">Short Term</option>
          <option value="LONG_TERM">Long Term</option>
        </select>

        <select
          name="experienceLevel"
          value={formData.experienceLevel}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Experience Level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Expert</option>
        </select>

        <input
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          placeholder="Category ID"
          type="text"
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          🚀 Submit Job
        </button>
      </form>
    </div>
  );
};

export default ClientJobPost;