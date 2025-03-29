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
    navigate("/signup/step6"); // Update to the correct next step
  };

  const handleBack = () => {
    navigate("/signup/step4");
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", textAlign: "center", padding: "20px" }}>
      <p>2/3</p>
      <h2>Got it. What's your biggest goal for freelancing?</h2>
      <p>
        Different people come to Upwork for various reasons. We want to highlight the opportunities 
        that fit your goals best while still showing you all the possibilities.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
        <button
          style={{
            padding: "10px",
            border: `2px solid ${freelanceGoal === "main_income" ? "black" : "lightgray"}`,
            cursor: "pointer",
          }}
          onClick={() => setFreelanceGoal("main_income")}
        >
          To earn my main income
        </button>
        <button
          style={{
            padding: "10px",
            border: `2px solid ${freelanceGoal === "side_income" ? "black" : "lightgray"}`,
            cursor: "pointer",
          }}
          onClick={() => setFreelanceGoal("side_income")}
        >
          To make money on the side
        </button>
        <button
          style={{
            padding: "10px",
            border: `2px solid ${freelanceGoal === "experience" ? "black" : "lightgray"}`,
            cursor: "pointer",
          }}
          onClick={() => setFreelanceGoal("experience")}
        >
          To get experience, for a full-time job
        </button>
        <button
          style={{
            padding: "10px",
            border: `2px solid ${freelanceGoal === "no_goal" ? "black" : "lightgray"}`,
            cursor: "pointer",
          }}
          onClick={() => setFreelanceGoal("no_goal")}
        >
          I don’t have a goal in mind yet
        </button>
      </div>

      {/* Navigation buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
        <button onClick={handleBack} style={{ padding: "10px 20px", cursor: "pointer" }}>
          Back
        </button>
        <button onClick={handleNext} style={{ padding: "10px 20px", cursor: "pointer" }}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Step5;
