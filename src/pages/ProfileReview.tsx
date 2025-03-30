import { useNavigate } from "react-router-dom";
import { useSignup } from "../context/SignupContext";

const ProfileReview = () => {
  const { signupData } = useSignup();
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      console.log("Profile Review Data:", signupData);

      <h2 className="text-2xl font-bold mb-4 text-center">🎉 Profile Review</h2>
      <p className="text-gray-600 text-center mb-6">
        Review your details before publishing your profile.
      </p>

      {/* Personal Details */}
      <div className="border p-4 rounded-md mb-4">
        <h3 className="font-semibold mb-2">Personal Details</h3>
        <p><strong>Full Name:</strong> {signupData.firstName} {signupData.lastName}</p>
        <p><strong>Email:</strong> {signupData.email}</p>
        <p><strong>Phone:</strong> {signupData.phone}</p>
        <p><strong>Date of Birth:</strong> {signupData.dob}</p>
        <p><strong>Country:</strong> {signupData.country}</p>
        <p><strong>ABC Membership:</strong> {signupData.isAbcMember ? "Yes" : "No"}</p>
      </div>

      {/* Address */}
      <div className="border p-4 rounded-md mb-4">
        <h3 className="font-semibold mb-2">Address</h3>
        <p>{signupData.address}, {signupData.city}, {signupData.state}, {signupData.zip}</p>
      </div>

      {/* Education */}
      {signupData.education && (
        <div className="border p-4 rounded-md mb-4">
          <h3 className="font-semibold mb-2">Education</h3>
          <p>{signupData.education}</p>
        </div>
      )}

      {/* Skills */}
      <div className="border p-4 rounded-md mb-4">
        <h3 className="font-semibold mb-2">Skills</h3>
        <p>{signupData.skills?.join(", ") || "No skills added"}</p>
      </div>

      {/* Work Experience */}
      <div className="border p-4 rounded-md mb-4">
        <h3 className="font-semibold mb-2">Work Experience</h3>
        <p>{signupData.experience || "Not provided"}</p>
      </div>

      {/* Hourly Rate */}
      <div className="border p-4 rounded-md mb-4">
        <h3 className="font-semibold mb-2">Hourly Rate</h3>
        <p>${signupData.hourlyRate || "Not provided"}/hr</p>
      </div>

      {/* Profile Photo */}
      <div className="text-center">
        {signupData.photo ? (
          <img src={URL.createObjectURL(signupData.photo)} alt="Profile" className="w-32 h-32 rounded-full mx-auto" />
        ) : (
          <p className="text-gray-500">No photo uploaded</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Back
        </button>

        <button
          onClick={() => {
            console.log(signupData);
            alert("Profile Published!");
          }}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Publish Profile 🚀
        </button>
      </div>
    </div>
  );
};

export default ProfileReview;
