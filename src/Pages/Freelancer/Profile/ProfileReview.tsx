import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../Signup/SignupContext";
import axios from "axios";
import { getMockUserId } from "../../../utils/initUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard } from "@fortawesome/free-solid-svg-icons";

const ProfileReview = () => {
  const { signupData } = useSignup();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(userTimezone);
    console.log("Freelancer ID (mock):", getMockUserId(signupData.name || "User"));
    console.log("Stored Freelancer ID:", getMockUserId());
  }, [signupData.name]);

  const uploadToS3 = async (presignedUrl: string, file: File) => {
    try {
      await axios.put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      });
      return true;
    } catch (error) {
      console.error('Error uploading to S3:', error);
      throw new Error('Failed to upload profile photo');
    }
  };

  const handlePublishProfile = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        alert("User ID not found in localStorage.");
        return;
      }

      const payload = {
        freelancerId: userId,
        name: signupData.name || "",
        title: signupData.title?.trim() || "",
        bio: signupData.bio?.trim() || "",
        hourlyRate: signupData.hourlyRate || 0,
        city: signupData.city?.trim() || "",
        state: signupData.state?.trim() || "",
        country: signupData.country?.trim() || "",
        postalCode: signupData.zip?.trim() || "",
        address: signupData.address?.trim() || "",
        phoneNumber: signupData.phone?.trim() || "",
        isAbcMember: !!signupData.isAbcMember,
        profilePhotoURL: "sample_url", // Replace with actual upload logic if needed
        profileStatus: "PENDING",
        timezone: timezone
      };

      // Get content type from the photo file
      const contentType = signupData.photo.type;


      // First request to create profile and get presigned URL
      const response = await axios.post(
        `http://localhost:8080/api/freelancer/create_profile?contentType=${contentType}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Extract presigned URL from response
      const { freelancerDTO, presignedUrl } = response.data;
      
      if (!presignedUrl) {
        console.error('Response data:', response.data);
        throw new Error("No presigned URL received from server");
      }

       try {
        await uploadToS3(presignedUrl, signupData.photo);
        console.log('Photo uploaded successfully');
      } catch (uploadError) {
        console.error('Photo upload error:', uploadError);
        throw new Error('Failed to upload profile photo. Please try again.');
      }


      alert("Profile published successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error(" Error publishing profile:", error);
      alert("Failed to publish profile. Check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center"><FontAwesomeIcon icon={faAddressCard} /> Profile Review</h2>
      <p className="text-gray-600 text-center mb-8">
        Review your details before publishing your profile.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
          <p><strong>Name:</strong> {signupData.name || "N/A"}</p>
          <p><strong>Title:</strong> {signupData.title || "N/A"}</p>
          <p><strong>Bio:</strong> {signupData.bio || "N/A"}</p>
          <p><strong>Email:</strong> {signupData.email || "N/A"}</p>
          <p><strong>Phone:</strong> {signupData.phone || "N/A"}</p>
          <p><strong>Country:</strong> {signupData.country || "N/A"}</p>
          <p><strong>ABC Membership:</strong> {signupData.isAbcMember ? "Yes" : "No"}</p>
        </div>

        <div className="border p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Address</h3>
          <p>
            {signupData.address || "N/A"}, {signupData.city || "N/A"},{" "}
            {signupData.state || "N/A"}, {signupData.zip || "N/A"}
          </p>
        </div>

        <div className="border p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Freelancing Details</h3>
          <p><strong>Hourly Rate:</strong> ${signupData.hourlyRate || "Not specified"}/hr</p>
          <p><strong>Timezone:</strong> {timezone}</p>
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
          disabled={loading}
          className={`px-6 py-3 rounded-lg text-white ${
            loading ? "bg-green-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {loading ? "Publishing..." : "Publish Profile "}
        </button>
      </div>
    </div>
  );
};

export default ProfileReview;
