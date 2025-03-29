import { useNavigate } from "react-router-dom";

const Step7 = () => {
  const navigate = useNavigate(); // Navigation hook

  const handleNext = () => {
    navigate("/signup/step8"); // Navigate to Step8
  };

  const handleBack = () => {
    navigate("/signup/step6"); // Navigate to Step6
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", textAlign: "center", padding: "20px" }}>
      <p>1/10</p>
      <h2> Create your profile</h2>
      
      <h1>Now it's the right time to tell us about yourself.</h1>
      <p>
        We need to get a sense of your education, experience, and skills.
        It's quickest to import your information, and you can edit it before your profile goes live.
      </p>

      <blockquote style={{ backgroundColor: "#f3f3f3", padding: "10px", borderLeft: "5px solid #00aaff" }}>
        <strong>Upwork Pro Tip:</strong> Your Upwork profile is how you stand out from the crowd.
        It's what you use to win work, so let's make it a good one.
      </blockquote>

      {/* Navigation Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
        <button onClick={handleBack} style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}>
          Back
        </button>
        <button onClick={handleNext} style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Step7;
