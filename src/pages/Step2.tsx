import { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { useSignup } from "../context/SignupContext";

const Step2 = () => {
  const { signupData, updateSignupData } = useSignup();
  const navigate = useNavigate(); // Navigation hook

  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    country: string;
    agreeToTerms: boolean;
    receiveEmails: boolean;
  }>({
    firstName: String(signupData?.firstName || ""),
    lastName: String(signupData?.lastName || ""),
    email: signupData?.email || "",
    password: signupData?.password || "",
    country: String(signupData?.country || "India"),
    agreeToTerms: Boolean(signupData?.agreeToTerms), // Ensure it's a boolean
    receiveEmails: Boolean(signupData?.receiveEmails), // Ensure it's a boolean
  });
  

  // Handler for text inputs and select dropdown
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Separate handler for checkboxes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked, // Store checked state (boolean)
    }));
  };

  // Form Validation
  const validateForm = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      alert("First name and last name are required.");
      return false;
    }
    if (!formData.email.includes("@")) {
      alert("Please enter a valid email.");
      return false;
    }
    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return false;
    }
    if (!formData.agreeToTerms) {
      alert("You must agree to the Terms of Service to continue.");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
      if (!validateForm()) {
        return; // Stop submission if validation fails
      }
      updateSignupData(formData);
      navigate("/signup/step3"); // Ensure this path matches the router
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
      <h1>Sign up to find work you love</h1>
      <button>Continue with Apple</button>
      <button>Continue with Google</button>
      <p>or</p>

      <input type="text" name="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} required />
      <input type="text" name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password (8 or more characters)" value={formData.password} onChange={handleChange} required />

      <select name="country" value={formData.country} onChange={handleChange}>
        <option value="India">India</option>
        <option value="USA">USA</option>
        <option value="UK">UK</option>
        {/* Add more countries */}
      </select>

      {/* Checkboxes should use checked, not value */}
      <label>
        <input type="checkbox" name="receiveEmails" checked={formData.receiveEmails} onChange={handleCheckboxChange} />
        Send me helpful emails to find rewarding work and job leads.
      </label>

      <label>
        <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleCheckboxChange} />
        Yes, I understand and agree to the <a href="#">Upwork Terms of Service</a>, including the <a href="#">User Agreement</a> and <a href="#">Privacy Policy</a>.
      </label>

      <button onClick={handleSubmit}>Create my account</button>

      <p>
        Already have an account? <a href="/login">Log In</a>
      </p>
    </div>
  );
};

export default Step2;
