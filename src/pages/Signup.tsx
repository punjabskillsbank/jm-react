import { Outlet } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";

const Signup = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      {/* Progress Bar (optional) */}
      <ProgressBar />

      {/* Outlet renders the current step (Step1, Step2, etc.) */}
      <div className="w-full max-w-lg bg-white p-6 shadow-md rounded-md">
        <Outlet />
      </div>
    </div>
  );
};

export default Signup;
