import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "./SignupContext";

const Step10 = () => {
  const { signupData, updateSignupData } = useSignup();
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>(typeof signupData.title === "string" ? signupData.title : "");

  const handleNext = () => {
    updateSignupData({ title });
    navigate("/signup/step10");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <p className="my-7">3/10</p>
        <p className="font-bold my-8">Add Your Title</p>
      <p className="text-gray-600 mb-6">
        This is the first thing clients see, so make it count! Stand out by describing your expertise in your own words.
      </p>

      <div className="mb-6">
        <label className="block font-semibold mb-2">Your Professional Role</label>
        <input
          type="text"
          placeholder="Creative Head"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate("/signup/step8")}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
          Back
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
          Next, Add Your Experience
        </button>
      </div>
    </div>
  );
};

export default Step10;
