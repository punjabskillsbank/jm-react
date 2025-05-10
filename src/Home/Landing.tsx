import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; 

const Landing = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-6 py-4 shadow bg-white relative">
        <h1 className="text-2xl font-bold text-blue-600">JobMatrix</h1>

        <div className="hidden md:flex space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup/step1")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Signup
          </button>
        </div>
        
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {menuOpen && (
          <div className="absolute top-full right-6 mt-2 bg-white border rounded shadow-md p-4 flex flex-col space-y-2 md:hidden z-10">
            <button
              onClick={() => {
                navigate("/login");
                setMenuOpen(false);
              }}
              className="text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-50"
            >
              Login
            </button>
            <button
              onClick={() => {
                navigate("/signup/step1");
                setMenuOpen(false);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Signup
            </button>
          </div>
        )}
      </header>
      <main className="flex flex-col items-center justify-center text-center py-20 px-6">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">
          Find the Right Talent for Your Projects
        </h2>
        <p className="text-lg text-gray-600 max-w-xl mb-8">
          Post a job, hire freelancers, and get things done with JobMatrix – your trusted freelance platform.
        </p>

        <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">Start by Posting a Job</h3>
          <button
            onClick={() => navigate("/client/post-job")}
            className="w-full bg-blue-600 text-white text-lg py-3 rounded hover:bg-blue-700"
          >
            ➕ Post a Job
          </button>
        </div>
      </main>
    </div>
  );
};

export default Landing;
