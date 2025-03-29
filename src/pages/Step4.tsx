import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSignup } from "../context/SignupContext";

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
    navigate("/signup/step5"); // Update to the correct next step
  };

  const handleBack = () => {
    navigate("/signup/step3");
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", textAlign: "center", padding: "20px" }}>
      <p>1/3</p>
      <h2>A few quick questions: first, have you freelanced before?</h2>
      <p>
        This lets us know how much help to give you along the way. We won’t share your answer
        with anyone else, including potential clients.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
        <button
          style={{
            padding: "10px",
            border: `2px solid ${experienceLevel === "new" ? "black" : "lightgray"}`,
            cursor: "pointer",
          }}
          onClick={() => setExperienceLevel("new")}
        >
          I am brand new to this
        </button>
        <button
          style={{
            padding: "10px",
            border: `2px solid ${experienceLevel === "some_experience" ? "black" : "lightgray"}`,
            cursor: "pointer",
          }}
          onClick={() => setExperienceLevel("some_experience")}
        >
          I have some experience
        </button>
        <button
          style={{
            padding: "10px",
            border: `2px solid ${experienceLevel === "expert" ? "black" : "lightgray"}`,
            cursor: "pointer",
          }}
          onClick={() => setExperienceLevel("expert")}
        >
          I am an expert
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

export default Step4;
