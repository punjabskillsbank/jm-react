import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Welcome to Freelancer Signup</h1>
      <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded" onClick={() => navigate("/signup/step1")}>
        Signup
      </button>
      <button className="mt-4 px-6 py-2 bg-gray-600 text-white rounded" onClick={() => navigate("/login")}>
        Login
      </button>
    </div>
  );
};

export default Landing;
