import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../context/SignupContext";

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  country: string;
  agreeToTerms: boolean;
  receiveEmails: boolean;
  [key: string]: string | boolean; 
}

const Step2 = () => {
  const { signupData, updateSignupData } = useSignup();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SignupFormData>({
    firstName: String(signupData?.firstName || ""),
    lastName: String(signupData?.lastName || ""),
    email: signupData?.email || "",
    password: signupData?.password || "",
    country: String(signupData?.country || "India"),
    agreeToTerms: Boolean(signupData?.agreeToTerms),
    receiveEmails: Boolean(signupData?.receiveEmails),
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const validateForm = (): boolean => {
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
    if (!validateForm()) return;
    updateSignupData(formData);
    navigate("/signup/step3");
  };

  return (
    <div className="max-w-2xl mx-auto mt-5 bg-gray-100 p-6 rounded-lg shadow-md text-center space-y-4">
      <h1 className="text-2xl font-semibold">Sign up to find work you love</h1>

      <div className="space-y-3">
        <input type="text" name="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} required className="w-full p-2 border rounded-md" />
        <input type="text" name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} required className="w-full p-2 border rounded-md" />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-2 border rounded-md" />
        <input type="password" name="password" placeholder="Password (8 or more characters)" value={formData.password} onChange={handleChange} required className="w-full p-2 border rounded-md" />
        
        <select name="country" value={formData.country} onChange={handleChange} className="w-full p-2 border rounded-md">
          <option value="India">India</option>
          <option value="USA">USA</option>
          <option value="UK">UK</option>
        </select>
      </div>

      <div className="text-left space-y-2">
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="receiveEmails" checked={formData.receiveEmails} onChange={handleCheckboxChange} className="w-4 h-4" />
          <span className="text-sm text-gray-600">Send me helpful emails to find rewarding work and job leads.</span>
        </label>
        
        <label className="flex items-start space-x-2">
          <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleCheckboxChange} className="w-4 h-4 mt-1" />
          <span className="text-sm text-gray-600">
            Yes, I understand and agree to the <a href="#" className="text-blue-500">Upwork Terms of Service</a>, including the <a href="#" className="text-blue-500">User Agreement</a> and <a href="#" className="text-blue-500">Privacy Policy</a>.
          </span>
        </label>
      </div>

      <button onClick={handleSubmit} className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Create my account</button>

      <p className="text-gray-500 text-sm">
        Already have an account? <a href="/login" className="text-blue-500">Log In</a>
      </p>
    </div>
  );
};

export default Step2;