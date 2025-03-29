import { useLocation } from "react-router-dom";

const ProgressBar = () => {
  const location = useLocation();
  const steps = ["/signup/step1", "/signup/step2", "/signup/step3", "/signup/review"];
  const currentStep = steps.indexOf(location.pathname) + 1;

  return (
    <div className="w-full max-w-lg my-4">
      <div className="w-full bg-gray-300 h-2 rounded-full">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        ></div>
      </div>
      <p className="text-center mt-2 text-sm">Step {currentStep} of {steps.length}</p>
    </div>
  );
};

export default ProgressBar;
