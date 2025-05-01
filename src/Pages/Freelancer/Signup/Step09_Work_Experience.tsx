import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "./SignupContext";

interface Experience {
  title: string;
  description: string;
  budget_type: "fixed" | "hourly";
  fixed_price: string;
  hourly_min_rate: string;
  hourly_max_rate: string;
  project_duration: string;
  experience_level: "beginner" | "intermediate" | "expert";
}

const Step9 = () => {
  const { updateSignupData } = useSignup();
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      title: "",
      description: "",
      budget_type: "fixed",
      fixed_price: "",
      hourly_min_rate: "",
      hourly_max_rate: "",
      project_duration: "",
      experience_level: "beginner",
    },
  ]);

  const handleChange = (index: number, field: keyof Experience, value: string) => {
    const updated = [...experiences];
    (updated[index][field] as string) = value;
    setExperiences(updated);
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        title: "",
        description: "",
        budget_type: "fixed",
        fixed_price: "",
        hourly_min_rate: "",
        hourly_max_rate: "",
        project_duration: "",
        experience_level: "beginner",
      },
    ]);
  };

  const removeExperience = (index: number) => {
    const updated = experiences.filter((_, i) => i !== index);
    setExperiences(updated);
  };

  const handleNext = () => {
    updateSignupData({ experience: experiences });
    navigate("/signup/step10");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <p className="my-7">5/10</p>
      <p className="font-bold text-xl mb-4">Add Your Work Experience</p>
      <p className="text-gray-600 text-center mb-6">
        Add multiple past projects you've worked on. This helps clients trust your skills.
      </p>

      {experiences.map((exp, index) => (
        <div key={index} className="border p-4 rounded-md mb-6 bg-gray-50">
          <div className="mb-3">
            <label className="block font-semibold">Title</label>
            <input
              value={exp.title}
              onChange={(e) => handleChange(index, "title", e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-3">
            <label className="block font-semibold">Description</label>
            <textarea
              value={exp.description}
              onChange={(e) => handleChange(index, "description", e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-3">
            <label className="block font-semibold">Budget Type</label>
            <select
              value={exp.budget_type}
              onChange={(e) => handleChange(index, "budget_type", e.target.value as Experience["budget_type"])}
              className="w-full p-2 border rounded"
            >
              <option value="fixed">Fixed</option>
              <option value="hourly">Hourly</option>
            </select>
          </div>
          {exp.budget_type === "fixed" ? (
            <div className="mb-3">
              <label className="block font-semibold">Fixed Price</label>
              <input
                type="number"
                value={exp.fixed_price}
                onChange={(e) => handleChange(index, "fixed_price", e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          ) : (
            <div className="flex gap-3 mb-3">
              <div className="flex-1">
                <label className="block font-semibold">Hourly Min Rate</label>
                <input
                  type="number"
                  value={exp.hourly_min_rate}
                  onChange={(e) => handleChange(index, "hourly_min_rate", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex-1">
                <label className="block font-semibold">Hourly Max Rate</label>
                <input
                  type="number"
                  value={exp.hourly_max_rate}
                  onChange={(e) => handleChange(index, "hourly_max_rate", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          )}
          <div className="mb-3">
            <label className="block font-semibold">Project Duration</label>
            <input
              value={exp.project_duration}
              onChange={(e) => handleChange(index, "project_duration", e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-3">
            <label className="block font-semibold">Experience Level</label>
            <select
              value={exp.experience_level}
              onChange={(e) => handleChange(index, "experience_level", e.target.value as Experience["experience_level"])}
              className="w-full p-2 border rounded"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          {experiences.length > 1 && (
            <button
              onClick={() => removeExperience(index)}
              className="text-red-600 text-sm mt-2"
            >
              Remove This Experience
            </button>
          )}
        </div>
      ))}

      <button
        onClick={addExperience}
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        + Add Another Experience
      </button>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate("/signup/step10")}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          Back
        </button>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/signup/step8")}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Skip for Now
          </button>

          <button
            onClick={handleNext}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Next, Add Your Education
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step9;
