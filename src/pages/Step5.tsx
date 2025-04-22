import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSignup } from "../context/SignupContext";

const Step5 = () => {
  const navigate = useNavigate();
  const { signupData, updateSignupData } = useSignup();

  const [freelanceGoal, setFreelanceGoal] = useState(signupData?.freelanceGoal || "");

  const handleNext = () => {
    if (!freelanceGoal) {
      alert("Please select an option before proceeding.");
      return;
    }
    updateSignupData({ freelanceGoal });
    navigate("/signup/step6"); 
  };

  const handleBack = () => {
    navigate("/signup/step4");
  };

  return (
    <div className="max-w-4xl mx-auto center p-5 my-7">
      <p className="my-7">2/3</p>
      <p className="text-xl font-bold">Got it. What's your biggest goal for freelancing?</p>
      <p>
        Different people come to Upwork for various reasons. We want to highlight the opportunities 
        that fit your goals best while still showing you all the possibilities.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 w-full">
  <button
    className={`px-4 py-2 border-2 rounded-2xl ${
      freelanceGoal === "main_income" ? "border-black" : "border-gray-400"
    } cursor-pointer`}
    onClick={() => setFreelanceGoal("main_income")}
  >
    To earn my main income
  </button>
  <button
    className={`px-4 py-2 border-2 rounded-2xl ${
      freelanceGoal === "side_income" ? "border-black" : "border-gray-400"
    } cursor-pointer`}
    onClick={() => setFreelanceGoal("side_income")}
  >
    To make money on the side
  </button>
  <button
    className={`px-4 py-2 border-2 rounded-2xl ${
      freelanceGoal === "experience" ? "border-black" : "border-gray-400"
    } cursor-pointer`}
    onClick={() => setFreelanceGoal("experience")}
  >
    To get experience, for a full-time job
  </button>
  <button
    className={`px-4 py-2 border-2 rounded-2xl ${
      freelanceGoal === "no_goal" ? "border-black" : "border-gray-400"
    } cursor-pointer`}
    onClick={() => setFreelanceGoal("no_goal")}
  >
    I don’t have a goal in mind yet
  </button>
</div>


      {/* Navigation buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
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

export default Step5;
