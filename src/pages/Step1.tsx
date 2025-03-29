import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../context/SignupContext";

const Step1 = () => {
  const navigate = useNavigate();
  const { signupData, updateSignupData } = useSignup();
  const [selectedRole, setSelectedRole] = useState(signupData.role || "");

  const handleRoleSelection = (role: string) => {
    setSelectedRole(role);
  };

  const handleSubmit = () => {
    if (!selectedRole) {
      alert("Please select a role before continuing.");
      return;
    }

    updateSignupData({ role: selectedRole });
    navigate("/signup/step2"); // Redirect to Step 2
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
      <h1>Join as a client or freelancer</h1>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <button
          onClick={() => handleRoleSelection("client")}
          style={{
            border: selectedRole === "client" ? "2px solid black" : "1px solid gray",
            padding: "20px",
          }}
        >
          I’m a client, hiring for a project
        </button>

        <button
          onClick={() => handleRoleSelection("freelancer")}
          style={{
            border: selectedRole === "freelancer" ? "2px solid black" : "1px solid gray",
            padding: "20px",
          }}
        >
          I’m a freelancer, looking for work
        </button>
      </div>

      <button onClick={handleSubmit} disabled={!selectedRole} style={{ marginTop: "20px" }}>
        Create Account
      </button>

      <p>
        Already have an account? <a href="/login">Log In</a>
      </p>
    </div>
  );
};

export default Step1;
