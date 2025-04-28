import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "./SignupContext";

const Step11 = () => {
  const { updateSignupData } = useSignup();
  const navigate = useNavigate();
  const [experienceFile, setExperienceFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setExperienceFile(event.target.files[0]);
    }
  };

  const handleNext = () => {
    if (experienceFile) {
      updateSignupData({ experience: experienceFile.name });
    }
    navigate("/signup/step12");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <p className="my-7">5/10</p>
      <p className="font-bold my-8">Add Your Work Experience</p>
      <p className="text-gray-600 text-center mb-6">
        Freelancers who add their experience are twice as likely to win work. If you're just starting out, 
        you can still create a great profile!
      </p>

      <div className="mb-6">
        <label className="block font-semibold mb-2">Upload Work Experience (PDF, DOCX)</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {experienceFile && (
          <p className="mt-2 text-green-600">Uploaded: {experienceFile.name}</p>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate("/signup/step10")}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          Back
        </button>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/signup/step12")}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
            Skip for Now
          </button>

          <button
            onClick={handleNext}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            disabled={!experienceFile}>
            Next, Add Your Education
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step11;
