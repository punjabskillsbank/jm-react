import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../context/SignupContext";

const Step13 = () => {
  const { signupData, updateSignupData } = useSignup();
  const navigate = useNavigate();
  const [abcMembership, setAbcMembership] = useState(signupData.abcMembership || "");

  const handleOptionChange = (option: string) => {
    setAbcMembership(option);
  };

  const handleNext = () => {
    updateSignupData({ abcMembership });
    navigate("/signup/step14");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">7/10 - Are you an ABC Member?</h2>
      <p className="text-gray-600 text-center mb-6">
        Some clients prefer working with ABC members. Let us know if you are one.
      </p>

      <div className="flex flex-col gap-4 border p-4 rounded-md">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="abcMembership"
            value="yes"
            checked={abcMembership === "yes"}
            onChange={() => handleOptionChange("yes")}
            className="w-5 h-5"
          />
          <span className="text-lg">Yes, I am an ABC Member</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="abcMembership"
            value="no"
            checked={abcMembership === "no"}
            onChange={() => handleOptionChange("no")}
            className="w-5 h-5"
          />
          <span className="text-lg">No, I want to join</span>
        </label>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate("/signup/step12")}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400" >
          Back
        </button>

        <button
          onClick={handleNext}
          className={`px-4 py-2 rounded-md text-white ${
            abcMembership ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!abcMembership}>
          Next, Add Overview
        </button>
      </div>
    </div>
  );
};

export default Step13;
