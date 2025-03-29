import { useSignup } from "../context/SignupContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Step8 = () => {
  const { signupData, updateSignupData } = useSignup();
  const navigate = useNavigate();

  const categories = [
    "Accounting & Consulting",
    "Admin Support",
    "Customer Service",
    "Data Science & Analytics",
    "Design & Creative",
    "Engineering & Architecture",
    "IT & Networking",
    "Legal",
    "Sales & Marketing",
    "Translation",
    "Web, Mobile & Software Dev",
    "Writing",
  ];

  // Track selected categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    Array.isArray(signupData.workCategories) ? signupData.workCategories : []
  );

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  // Proceed to Dashboard with stored data
  const handleNext = () => {
    updateSignupData({ workCategories: JSON.stringify(selectedCategories) });
    navigate("/dashboard"); // Redirects to Dashboard
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", textAlign: "center" }}>
      <h1>2/10: What kind of work are you here to do?</h1>
      <p>Don't worry, you can change these choices later on.</p>

      <div style={{ display: "grid", gap: "10px", margin: "20px 0" }}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategorySelect(category)}
            style={{
              padding: "10px",
              background: selectedCategories.includes(category) ? "#4CAF50" : "#ddd",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {category}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
        <button onClick={() => navigate("/signup/step7")} style={buttonStyle}>⬅ Back</button>
        <button onClick={handleNext} style={buttonStyle}>Next ➡</button>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
  borderRadius: "5px",
  border: "none",
  background: "#28a745",
  color: "white",
};

export default Step8;
