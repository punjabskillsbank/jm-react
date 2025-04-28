import { useSignup } from "./SignupContext";
import { useNavigate } from "react-router-dom";

const Step3 = () => {
  const { signupData } = useSignup(); 
  const username = signupData.firstName || "User"; // Fallback if name is missing
  const navigate = useNavigate(); // Navigation hook

  const handleNext = () => {
    navigate("/signup/step4");
  };

  return (
    <div className="max-w-4xl mx-auto text-left py-10">
      <h1 className="text-5xl font-semibold mb-3">Hey {username}. Ready for your next big opportunity?</h1>
      
      <div className="space-y-4 text-center">
        <p className="text-2xl p-4 border-b border-gray-300">Answer a few questions and start building your profile</p>
        <p className="text-2xl p-4 border-b border-gray-300">Apply for open roles or list services for clients to buy</p>
        <p className="text-2xl p-4 border-b border-gray-300">Get paid safely and know we're there to help</p>
      </div>
      
      <div className="pt-4 mt-4 flex items-center space-x-4">
        <button onClick={handleNext} className="bg-green-600 text-white py-2 px-5 rounded-md text-lg font-medium">Get started</button>
        <p className="text-gray-600 text-sm">It only takes 5-10 minutes and you can edit it later. We’ll save as you go.</p>
      </div>
    </div>
  );
};

export default Step3;