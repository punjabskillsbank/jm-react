import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../context/SignupContext";

const Step12 = () => {
  const { signupData, updateSignupData } = useSignup();
  const navigate = useNavigate();
  const [education, setEducation] = useState({
    degree: String(signupData.degree || ""),
    institution: String(signupData.institution || ""),
    year: String(signupData.year || ""),
  });
  const [educationFile, setEducationFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEducation({ ...education, [e.target.name]: e.target.value });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setEducationFile(event.target.files[0]);
    }
  };

  const handleNext = () => {
    updateSignupData({ ...education, educationFile: educationFile?.name });
    navigate("/signup/step13");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">6/10 - Add Your Education</h2>
      <p className="text-gray-600 text-center mb-6">
        Clients like to know what you know. You don’t have to have a degree, but adding relevant education helps make your profile more visible.
      </p>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Degree</label>
        <input
          type="text"
          name="degree"
          value={education.degree}
          onChange={handleInputChange}
          placeholder="e.g., Bachelor's in Computer Science"
          className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Institution</label>
        <input
          type="text"
          name="institution"
          value={education.institution}
          onChange={handleInputChange}
          placeholder="e.g., Harvard University"
          className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Year of Completion</label>
        <input
          type="text"
          name="year"
          value={education.year}
          onChange={handleInputChange}
          placeholder="e.g., 2025"
          className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label className="block font-semibold mb-2">Upload Education Certificate (Optional, PDF/DOCX)</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {educationFile && (
          <p className="mt-2 text-green-600">Uploaded: {educationFile.name}</p>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate("/signup/step11")}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          Back
        </button>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/signup/step13")}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
            Skip for Now
          </button>

          <button
            onClick={handleNext}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step12;
