import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../context/SignupContext";

const Step15 = () => {
  const { signupData, updateSignupData } = useSignup();
  const navigate = useNavigate();
  const [hourlyRate, setHourlyRate] = useState<number>(typeof signupData.hourlyRate === "number" ? signupData.hourlyRate : 30);

  const serviceFeeRate = 0.2; // 20% service fee
  const serviceFee = (hourlyRate * serviceFeeRate).toFixed(2);
  const earnings = (hourlyRate * (1 - serviceFeeRate)).toFixed(2);

  const handleNext = () => {
    updateSignupData({ hourlyRate });
    navigate("/signup/step16");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">9/10 - Set Your Hourly Rate</h2>
      <p className="text-gray-600 text-center mb-6">
        Clients will see this rate on your profile. You can adjust it while submitting proposals.
      </p>

      <div className="flex flex-col gap-4">
        {/* Hourly Rate Input */}
        <label className="font-semibold">Hourly Rate ($/hr)</label>
        <input
          type="number"
          min="5"
          step="1"
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(Number(e.target.value))}
        />

        {/* Breakdown */}
        <div className="p-4 border rounded-md bg-gray-100">
          <p className="flex justify-between">
            <span>Total amount client sees:</span>
            <span className="font-semibold">${hourlyRate.toFixed(2)}</span>
          </p>
          <p className="flex justify-between text-red-500">
            <span>Service fee (20%):</span>
            <span className="font-semibold">-${serviceFee}</span>
          </p>
          <p className="flex justify-between text-green-600">
            <span>You'll receive:</span>
            <span className="font-semibold">${earnings}</span>
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate("/signup/step14")}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          Back
        </button>

        <button
          onClick={handleNext}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Next, Add Photo & Location
        </button>
      </div>
    </div>
  );
};

export default Step15;
