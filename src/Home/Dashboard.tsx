import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import ProfileDetailsModal from "./ProfileDetailsModal";
import { useSignup } from "../pages/Freelancer/Signup/SignupContext"; // adjust path if needed

export default function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { signupData } = useSignup(); // ✅ get from context

  return (
    <header className="flex justify-between items-center p-4 shadow bg-white">
      <div className="text-2xl font-bold">JobMatrix</div>
      <div className="relative">
        <button onClick={() => setShowDropdown(!showDropdown)}>
          <FontAwesomeIcon icon={faUserCircle} className="text-3xl text-gray-700" />
        </button>
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
            <button
              onClick={() => {
                setShowModal(true);
                setShowDropdown(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              My Account
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Settings</button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Help</button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Feedback</button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">Logout</button>
          </div>
        )}
      </div>

      {showModal && (
        <ProfileDetailsModal
          signupData={signupData}
          timezone={signupData.timezone || "N/A"} // fallback if not set
          onClose={() => setShowModal(false)}
        />
      )}
    </header>
  );
}
