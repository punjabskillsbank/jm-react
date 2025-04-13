import { useNavigate } from "react-router-dom";
import { useSignup } from "../context/SignupContext";
import axios from "axios";
import { getMockUserId } from "../utils/initUser";


// Helper to convert file to base64
const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
  const freelancerId = getMockUserId("Ishmeet Singh"); // Get ID by name
  console.log("Freelancer ID:", freelancerId);
  
const storedFreelancerId = getMockUserId(); // Get ID from localStorage
console.log("Stored Freelancer ID:", storedFreelancerId);
const ProfileReview = () => {
  const { signupData } = useSignup();
  const navigate = useNavigate();
  localStorage.clear();
  

  const handlePublishProfile = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        alert("User ID not found in localStorage.");
        return;
      }

      let profilePhotoBase64 = "";
      if (signupData.photo) {
        profilePhotoBase64 = await toBase64(signupData.photo);
      }

      const payload = {
        freelancerId: userId,
        title: signupData.title?.trim(),
        bio: signupData.bio?.trim(),
        hourlyRate: Number(signupData.hourlyRate),
        city: signupData.city?.trim(),
        state: signupData.state?.trim(),
        country: signupData.country?.trim(),
        postalCode: signupData.zip?.trim(),
        address: signupData.address?.trim(),
        phoneNumber: signupData.phone?.trim(),
        isAbcMember: signupData.abcMembership === "yes",
        profilePhotoURL: profilePhotoBase64,
        profileStatus: "PENDING",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      

      console.log("📦 Payload sent to backend:", payload);

      const response = await axios.post(
        "http://localhost:8081/api/freelancer/create_profile",
        payload,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      console.log("✅ Profile created:", response.data);
      alert("🎉 Profile published successfully!");
      navigate("/freelancer-dashboard");

    } catch (error) {
      console.error("❌ Error publishing profile:", error);
      alert("Failed to publish profile. Check the console for details.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">🎉 Profile Review</h2>
      <p className="text-gray-600 text-center mb-8">
        Review your details before publishing your profile.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
          <p><strong>Title:</strong> {signupData.title}</p>
          <p><strong>Bio:</strong> {signupData.bio}</p>
          <p><strong>Email:</strong> {signupData.email}</p>
          <p><strong>Phone:</strong> {signupData.phone}</p>
          <p><strong>Country:</strong> {signupData.country}</p>
          <p><strong>ABC Membership:</strong> {signupData.abcMembership === "yes" ? "Yes" : "No"}</p>
        </div>

        <div className="border p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Address</h3>
          <p>{signupData.address}, {signupData.city}, {signupData.state}, {signupData.zip}</p>
        </div>

        <div className="border p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Freelancing Details</h3>
          <p><strong>Hourly Rate:</strong> ${signupData.hourlyRate || "Not specified"}/hr</p>
          <p><strong>Timezone:</strong> {signupData.timezone || "Asia/Kolkata"}</p>
        </div>

        <div className="border p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
          {signupData.photo ? (
            <img
              src={URL.createObjectURL(signupData.photo)}
              alt="Profile"
              className="w-32 h-32 rounded-full shadow-md object-cover"
            />
          ) : (
            <p className="text-gray-500">No photo uploaded</p>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Back
        </button>

        <button
          onClick={handlePublishProfile}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Publish Profile 🚀
        </button>
      </div>
    </div>
  );
};

export default ProfileReview;
