import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "./SignupContext";

const suggestedSkills = [
  "Illustration",
  "Informational Infographic",
  "Brand Development",
  "Branding",
  "Branding & Marketing",
  "Brand Management",
  "Business Presentation",
  "Construction Document Preparation",
  "Presentation Design",
  "Presentations"
];
//TODO GET SKILLS FROM API
const Step8 = () => {
  const { signupData, updateSignupData } = useSignup();
  const navigate = useNavigate();
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    Array.isArray(signupData.skills) ? signupData.skills : []
  );

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prevSkills) =>
      prevSkills.includes(skill)
        ? prevSkills.filter((s) => s !== skill)
        : prevSkills.length < 15
        ? [...prevSkills, skill]
        : prevSkills
    );
  };

  const handleNext = () => {
    updateSignupData({ skills: selectedSkills });
    navigate("/signup/step9");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <p className="my-7">4/10</p>
      <p className="font-bold my-8">Nearly there!</p>
      <p className="text-gray-600  mb-6">
        Your skills show clients what you can offer, and help us choose which jobs to recommend to you.
      </p>

      <div className="border p-4 rounded-md">
        <h3 className="font-semibold mb-2">Your Skills (Max 15)</h3>
        <div className="flex flex-wrap gap-2">
          {selectedSkills.map((skill, index) => (
            <span
              key={index}
              className="bg-blue-500 text-white px-3 py-1 rounded-full cursor-pointer"
              onClick={() => handleSkillToggle(skill)}
            >
              {skill} ✖
            </span>
          ))}
        </div>
      </div>

      <h3 className="font-semibold mt-4">Suggested Skills</h3>
      <div className="flex flex-wrap gap-2">
        {suggestedSkills.map((skill, index) => (
          <button
            key={index}
            className={`px-3 py-1 rounded-full ${
              selectedSkills.includes(skill)
                ? "bg-green-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => handleSkillToggle(skill)}
          >
            {skill}
          </button>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate("/signup/step7")}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
          Back
        </button>

        <button
          onClick={handleNext}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
          Next
        </button>
      </div>
    </div>
  );
};

export default Step8;
