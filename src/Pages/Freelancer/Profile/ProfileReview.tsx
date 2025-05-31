import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../Signup/SignupContext";
import axios from "axios";
import { getMockUserId, initMockUser } from "../../../utils/initUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard } from "@fortawesome/free-solid-svg-icons";

const ProfileReview = () => {
  const { signupData } = useSignup();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [timezone, setTimezone] = useState("Asia/Kolkata");

  useEffect(() => {
    // Always assign a fresh user
    initMockUser();

    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(userTimezone);

    console.log("Freelancer ID (mock):", getMockUserId(signupData.name || "User"));
    console.log("Stored Freelancer ID:", getMockUserId());
  }, [signupData.name]);

  const handlePublishProfile = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        alert("User ID not found in localStorage.");
        setLoading(false);
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
        certificates:
          signupData.certificate?.map((cert) => ({
            certificateName: cert.certificateName,
            issuedBy: cert.issuedBy,
            issueDate: cert.issueDate,
            expiryDate: cert.expiryDate,
            credentialUrl: cert.credentialUrl,
            freelancerId: userId,
          })) || [],
        education:
          signupData.education?.map((edu) => ({
            institute: edu.institute,
            degree: edu.degree,
            start_year: edu.start_year,
            end_year: edu.end_year,
            description: edu.description,
            freelancerId: userId,
          })) || [],
        jobs:
          signupData.experience?.map((job) => ({
            title: job.title,
            description: job.description,
            budget_type: job.budget_type,
            fixed_price: job.fixed_price,
            hourly_min_rate: job.hourly_min_rate,
            hourly_max_rate: job.hourly_max_rate,
            project_duration: job.project_duration,
            experience_level: job.experience_level,
          })) || [],
        profilePhotoURL: "sample_url",
        profileStatus: "PENDING",
        timezone: timezone,
      };

      await axios.post(
        "http://localhost:8081/api/freelancer/create_profile",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert("Profile published successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error publishing profile:", error);
      alert("Failed to publish profile. Check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">
        <FontAwesomeIcon icon={faAddressCard} /> Profile Review
      </h2>
      <p className="text-gray-600 text-center mb-8">
        Review your details before publishing your profile.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details */}
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

        {/* Address */}
        <div className="border p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Address</h3>
          <p>
            {signupData.address || "N/A"}, {signupData.city || "N/A"},{" "}
            {signupData.state || "N/A"}, {signupData.zip || "N/A"}
          </p>
        </div>

        {/* Freelancing Details */}
        <div className="border p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Freelancing Details</h3>
          <p><strong>Hourly Rate:</strong> ${signupData.hourlyRate || "Not specified"}/hr</p>
          <p><strong>Timezone:</strong> {timezone}</p>
        </div>

        {/* Profile Picture */}
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

        {/* Certificates */}
        <div className="border p-6 rounded-lg shadow-sm md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Certificates</h3>
          {signupData.certificate && signupData.certificate.length > 0 ? (
            <ul className="list-disc list-inside space-y-2 max-h-48 overflow-y-auto">
              {signupData.certificate.map((cert, idx) => (
                <li key={idx}>
                  <strong>{cert.certificateName}</strong> by {cert.issuedBy} (
                  {cert.issueDate} - {cert.expiryDate || "Present"})
                  {cert.credentialUrl && (
                    <> — <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Credential Link</a></>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No certificates added</p>
          )}
        </div>

        {/* Education */}
        <div className="border p-6 rounded-lg shadow-sm md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Education</h3>
          {signupData.education && signupData.education.length > 0 ? (
            <ul className="list-disc list-inside space-y-2 max-h-48 overflow-y-auto">
              {signupData.education.map((edu, idx) => (
                <li key={idx}>
                  <strong>{edu.degree}</strong> at {edu.institute} ({edu.start_year} - {edu.end_year || "Present"})
                  <p className="text-gray-700">{edu.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No education records added</p>
          )}
        </div>

        {/* Work Experience */}
        <div className="border p-6 rounded-lg shadow-sm md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Work Experience</h3>
          {signupData.experience && signupData.experience.length > 0 ? (
            <ul className="list-disc list-inside space-y-4 max-h-64 overflow-y-auto">
              {signupData.experience.map((job, idx) => (
                <li key={idx}>
                  <p><strong>Title:</strong> {job.title}</p>
                  <p><strong>Description:</strong> {job.description}</p>
                  <p><strong>Budget Type:</strong> {job.budget_type}</p>
                  {job.budget_type === "fixed" ? (
                    <p><strong>Fixed Price:</strong> ${job.fixed_price}</p>
                  ) : (
                    <>
                      <p><strong>Hourly Min Rate:</strong> ${job.hourly_min_rate}</p>
                      <p><strong>Hourly Max Rate:</strong> ${job.hourly_max_rate}</p>
                    </>
                  )}
                  <p><strong>Project Duration:</strong> {job.project_duration}</p>
                  <p><strong>Experience Level:</strong> {job.experience_level}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No work experience added</p>
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
          {loading ? "Publishing..." : "Publish Profile"}
        </button>
      </div>
    </div>
  );
};

export default ProfileReview;
