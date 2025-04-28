import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSignup } from "./SignupContext";

const Step4 = () => {
  const navigate = useNavigate();
  const { signupData, updateSignupData } = useSignup();

  const [experienceLevel, setExperienceLevel] = useState(signupData?.experienceLevel || "");

  const handleNext = () => {
    if (!experienceLevel) {
      alert("Please select an option before proceeding.");
      return;
    }
    updateSignupData({ experienceLevel });
    navigate("/signup/step5");
  };

  const handleBack = () => {
    navigate("/signup/step3");
  };

  return (
    <div className="max-w-4xl mx-auto center p-5 my-7" >
      <p className="my-7">1/3</p>
      <h2 className="font-bold">A few quick questions: first, have you freelanced before?</h2>
      <p>
        This lets us know how much help to give you along the way. We won’t share your answer
        with anyone else, including potential clients.
      </p>
      <div className="flex flex-row gap-4 mt-5">
  <button
    className={`px-4 py-2 border-2 rounded-2xl flex-1 ${
      experienceLevel === "new" ? "border-black" : "border-gray-400"
    } cursor-pointer`}
    onClick={() => setExperienceLevel("new")}
  >
    I am brand new to this
  </button>
  <button
    className={`px-4 py-2 border-2 rounded-2xl flex-1 ${
      experienceLevel === "some_experience" ? "border-black" : "border-gray-400"
    } cursor-pointer`}
    onClick={() => setExperienceLevel("some_experience")}
  >
    I have some experience
  </button>
  <button
    className={`px-4 py-2 border-2 rounded-2xl flex-1 ${
      experienceLevel === "expert" ? "border-black" : "border-gray-400"
    } cursor-pointer`}
    onClick={() => setExperienceLevel("expert")}
  >
    I am an expert
  </button>
  <button
    className={`px-4 py-2 border-2 rounded-2xl flex-1 ${
      experienceLevel === "pro" ? "border-black" : "border-gray-400"
    } cursor-pointer`}
    onClick={() => setExperienceLevel("pro")}
  >
    I am a pro
  </button>
</div>



      {/* Navigation buttons */}
      <div className="flex justify-between mt-7">
              <button
            onClick={handleBack}
            className="px-5 py-2 text-lg border border-gray-400 rounded-lg hover:bg-gray-100 transition"
          > Back
                </button>
                <button
            onClick={handleNext}
            className="px-5 py-2 text-lg bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
                  Next
                </button>
      </div>
    </div>
  );
};

export default Step4;
