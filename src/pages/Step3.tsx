import { useSignup } from "../context/SignupContext";
import { useNavigate } from "react-router-dom";

const Step3 = () => {
  const { signupData } = useSignup(); // Get user data from context
  const username = signupData.firstName || "User"; // Fallback if name is missing
  const navigate = useNavigate(); // Navigation hook

  const handleNext = () => {
    navigate("/signup/step4"); 
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", textAlign: "center" }}>
      <h1>Hey {username}. Ready for your next big opportunity?</h1>
      <p>Answer a few questions and start building your profile.</p>
      <ul style={{ textAlign: "left" }}>
        <li>Apply for open roles or list services for clients to buy.</li>
        <li>Get paid safely and know we're there to help.</li>
      </ul>
      <h3>Get started</h3>
      <p>It only takes 5-10 minutes and you can edit it later. We'll save as you go.</p>

      <button onClick={handleNext} style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}>
        Get Started
      </button>
    </div>
  );
};

export default Step3;
