import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "./SignupContext";

const Step12 = () => {
  const { signupData, updateSignupData } = useSignup();
  const navigate = useNavigate();
  const [bio, setBio] = useState<string>(typeof signupData.bio === "string" ? signupData.bio : "");

  const handleNext = () => {
    updateSignupData({ bio });
    navigate("/signup/step13");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">8/10 - Write Your Bio</h2>
      <p className="text-gray-600 text-center mb-6">
        Help people get to know you. Highlight your top skills, experience, and interests.
      </p>
      <label htmlFor="bio" className="block mb-2 font-medium text-gray-700">Your Bio</label>
      <textarea
        className="w-full h-40 p-3 border rounded-md resize-none focus:ring-2 focus:ring-green-500"
        placeholder="Enter your bio here..."
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      ></textarea>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate("/signup/step11")}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"  >
          Back
        </button>

        <button
          onClick={handleNext}
          className="px-4 py-2 rounded-md text-white bg-green-500 hover:bg-green-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step12;
