import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../context/SignupContext";

const Step14 = () => {
  const { signupData, updateSignupData } = useSignup();
  const navigate = useNavigate();
  const [bio, setBio] = useState<string>(typeof signupData.bio === "string" ? signupData.bio : "");
  const minCharacters = 100;

  const handleNext = () => {
    updateSignupData({ bio });
    navigate("/signup/step15");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">8/10 - Write Your Bio</h2>
      <p className="text-gray-600 text-center mb-6">
        Help people get to know you. Highlight your top skills, experience, and interests.
      </p>

      <textarea
        className="w-full h-40 p-3 border rounded-md resize-none focus:ring-2 focus:ring-green-500"
        placeholder="Enter your bio here..."
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      ></textarea>

      <p className={`text-right mt-2 ${bio.length < minCharacters ? "text-red-500" : "text-green-600"}`}>
        {bio.length} / {minCharacters} characters
      </p>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate("/signup/step13")}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"  >
          Back
        </button>

        <button
          onClick={handleNext}
          className={`px-4 py-2 rounded-md text-white ${
            bio.length >= minCharacters ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={bio.length < minCharacters} >
          Next, Add Your Rate
        </button>
      </div>
    </div>
  );
};

export default Step14;
