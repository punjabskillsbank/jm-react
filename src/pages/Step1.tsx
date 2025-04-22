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
    navigate("/signup/step2"); 
  };

  return (
    <div className="m-auto text-center max-w-2xl">
      <p className="text-4xl m-10">Join as a client or freelancer</p>
      <div className="flex justify-center gap-5">
        <button
          onClick={() => handleRoleSelection("client")} 
          className={`p-5 border rounded-lg m-4 text-2xl ${
            selectedRole === "client" ? "border-2  border-black" : "border border-gray-500"
          }`}
        >
          I’m a client, hiring for a project
        </button>

        <button
          onClick={() => handleRoleSelection("freelancer")}
          className={`p-5 border rounded-lg m-4 text-2xl ${
            selectedRole === "freelancer" ? "border-2 border-black" : "border border-gray-500"
          }`}
        >
          I’m a freelancer, looking for work
        </button>
      </div>

      <button onClick={handleSubmit} disabled={!selectedRole} className="mt-5 border-amber-400 border-2 p-3 rounded-md text-white bg-amber-400 hover:bg-amber-500 transition duration-300 ease-in-out">
        Create Account
      </button>

      <p className="mt-5 text-gray-500">
        Already have an account? <a href="/login" className="text-green-500 underline-offset-2">Log In</a>
      </p>
    </div>
  );
};

export default Step1;
