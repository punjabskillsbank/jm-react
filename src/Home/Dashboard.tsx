import React from "react";
import { useSignup } from "../pages/Freelancer/Signup/SignupContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faChartSimple, faCheck } from "@fortawesome/free-solid-svg-icons";
const Dashboard = () => {
  const { signupData } = useSignup();

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px", textAlign: "center" }}>
      <h1><FontAwesomeIcon icon={faChartSimple} /><FontAwesomeIcon icon={faAddressCard} /> Your Profile Summary</h1>

      <div style={{ textAlign: "left", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", background: "#f9f9f9" }}>
        <h3><FontAwesomeIcon icon="user" className="text-blue-600 mr-2" /> Personal Details</h3>
        <p><strong>Name:</strong> {signupData.firstName} {signupData.lastName}</p>
        <p><strong>Email:</strong> {signupData.email}</p>
        <p><strong>Country:</strong> {signupData.country}</p>

        <h3><FontAwesomeIcon icon="key" /> Account Preferences</h3>
        <p><strong>Receive Emails:</strong> {signupData.receiveEmails ? "Yes" : "No"}</p>
        <p><strong>Agreed to Terms:</strong> {signupData.agreeToTerms ? "Yes" : "No"}</p>

        <h3><FontAwesomeIcon icon="briefcase" className="text-blue-600 mr-2" /> Work Preferences</h3>
        <p><strong>Freelancing Experience:</strong> {String(signupData.freelanceExperience ?? "")}</p>
        <p><strong>Freelancing Goal:</strong> {String(signupData.freelanceGoal ?? "")}</p>
        <p><strong>Work Preferences:</strong> {Array.isArray(signupData.workPreferences) ? signupData.workPreferences.join(", ") : "Not selected"}</p>
        <p><strong>Selected Work Categories:</strong> {Array.isArray(signupData.workCategories) ? signupData.workCategories.join(", ") : "Not selected"}</p>
      </div>

      <button onClick={() => alert("Profile Submitted! ")} style={buttonStyle}>Submit Profile <FontAwesomeIcon icon={faCheck} /></button>
    </div>
  );
};

const buttonStyle = {
  marginTop: "20px",
  padding: "12px 24px",
  fontSize: "16px",
  cursor: "pointer",
  borderRadius: "5px",
  border: "none",
  background: "#007BFF",
  color: "white",
};

export default Dashboard;
