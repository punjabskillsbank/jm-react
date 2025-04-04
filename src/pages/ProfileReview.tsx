import { useNavigate } from "react-router-dom";
import { useSignup } from "../context/SignupContext";

const ProfileReview = () => {
  const { signupData } = useSignup();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">🎉 Profile Review</h2>
      <p className="text-gray-600 text-center mb-8">
        Review your details before publishing your profile.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="border p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
          <p><strong>Full Name:</strong> {signupData.firstName} {signupData.lastName}</p>
          <p><strong>Email:</strong> {signupData.email}</p>
          <p><strong>Phone:</strong> {signupData.phone}</p>
          <p><strong>Date of Birth:</strong> {signupData.dob}</p>
          <p><strong>Country:</strong> {signupData.country}</p>
          <p><strong>ABC Membership:</strong> {signupData.abcMembership === "yes" ? "Yes" : "No"}</p>
        </div>

        {/* Address */}
        <div className="border p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Address</h3>
          <p>{signupData.address}, {signupData.city}, {signupData.state}, {signupData.zip}</p>
        </div>

        {/* Education */}
        <div className="border p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Education</h3>
          <p><strong>Education:</strong> {signupData.education || "Not provided"}</p>
        </div>

        {/* Skills */}
        <div className="border p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Skills</h3>
          <ul className="list-disc ml-5">
            {(signupData.skills ?? []).length > 0
              ? signupData.skills?.map((skill, index) => <li key={index}>{skill}</li>)
              : <li>No skills added</li>}
          </ul>
        </div>

        {/* Work Experience */}
        <div className="border p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Work Experience</h3>
          <p>{signupData.experience || "Not provided"}</p>
        </div>

        {/* Freelancing Info */}
        <div className="border p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Freelancing Details</h3>
          <p><strong>Hourly Rate:</strong> ${signupData.hourlyRate || "Not specified"}/hr</p>
        </div>
      </div>

      {/* Profile Photo */}
      <div className="text-center mt-8">
        {signupData.photo ? (
          <img
            src={URL.createObjectURL(signupData.photo)}
            alt="Profile"
            className="w-40 h-40 rounded-full mx-auto shadow-md"
          />
        ) : (
          <p className="text-gray-500">No photo uploaded</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Back
        </button>

        <button
          onClick={() => {
            console.log(signupData);
            alert("Profile Published!");
            // Optionally navigate to dashboard
            navigate("/");
          }}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Publish Profile 🚀
        </button>
      </div>
    </div>
  );
};

export default ProfileReview;
