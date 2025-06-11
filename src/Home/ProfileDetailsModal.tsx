import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function ProfileDetailsModal({ signupData, timezone, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-6 overflow-y-auto max-h-[90vh] relative">
        <button className="absolute top-3 right-4 text-xl text-gray-600" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2 className="text-3xl font-bold mb-4 text-center">
          <FontAwesomeIcon icon={faAddressCard} /> Profile Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Personal Details */}
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">Personal</h3>
            <p><strong>Name:</strong> {signupData.name || "N/A"}</p>
            <p><strong>Title:</strong> {signupData.title || "N/A"}</p>
            <p><strong>Bio:</strong> {signupData.bio || "N/A"}</p>
            <p><strong>Email:</strong> {signupData.email || "N/A"}</p>
            <p><strong>Phone:</strong> {signupData.phone || "N/A"}</p>
            <p><strong>Country:</strong> {signupData.country || "N/A"}</p>
            <p><strong>ABC Member:</strong> {signupData.isAbcMember ? "Yes" : "No"}</p>
          </div>

          {/* Address */}
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">Address</h3>
            <p>{signupData.address || "N/A"}, {signupData.city || "N/A"}, {signupData.state || "N/A"}, {signupData.zip || "N/A"}</p>
          </div>

          {/* Freelancing */}
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">Freelancing</h3>
            <p><strong>Hourly Rate:</strong> ${signupData.hourlyRate || "N/A"}/hr</p>
            <p><strong>Timezone:</strong> {timezone}</p>
          </div>

          {/* Profile Picture */}
          <div className="border p-4 rounded text-center">
            <h3 className="font-semibold mb-2">Profile Picture</h3>
            {signupData.photo ? (
              <img
                src={URL.createObjectURL(signupData.photo)}
                alt="Profile"
                className="w-24 h-24 mx-auto rounded-full object-cover"
              />
            ) : (
              <p className="text-gray-500">No photo uploaded</p>
            )}
          </div>

          {/* Certificates */}
          <div className="border p-4 rounded md:col-span-2">
            <h3 className="font-semibold mb-2">Certificates</h3>
            {signupData.certificate?.length ? (
              <ul className="list-disc list-inside space-y-2">
                {signupData.certificate.map((cert, idx) => (
                  <li key={idx}>
                    <strong>{cert.certificateName}</strong> by {cert.issuedBy} ({cert.issueDate} - {cert.expiryDate || "Present"}) 
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl} className="text-blue-500 ml-2" target="_blank">[Link]</a>
                    )}
                  </li>
                ))}
              </ul>
            ) : <p className="text-gray-500">No certificates added</p>}
          </div>

          {/* Education */}
          <div className="border p-4 rounded md:col-span-2">
            <h3 className="font-semibold mb-2">Education</h3>
            {signupData.education?.length ? (
              <ul className="list-disc list-inside space-y-2">
                {signupData.education.map((edu, idx) => (
                  <li key={idx}>
                    <strong>{edu.degree}</strong> at {edu.institute} ({edu.start_year} - {edu.end_year || "Present"})
                    <p className="text-sm text-gray-600">{edu.description}</p>
                  </li>
                ))}
              </ul>
            ) : <p className="text-gray-500">No education added</p>}
          </div>

          {/* Experience */}
          <div className="border p-4 rounded md:col-span-2">
            <h3 className="font-semibold mb-2">Experience</h3>
            {signupData.experience?.length ? (
              <ul className="list-disc list-inside space-y-3">
                {signupData.experience.map((job, idx) => (
                  <li key={idx}>
                    <p><strong>Title:</strong> {job.title}</p>
                    <p><strong>Description:</strong> {job.description}</p>
                    <p><strong>Budget:</strong> {job.budget_type}</p>
                    {job.budget_type === "fixed" ? (
                      <p><strong>Fixed Price:</strong> ${job.fixed_price}</p>
                    ) : (
                      <>
                        <p><strong>Hourly Rate:</strong> ${job.hourly_min_rate} - ${job.hourly_max_rate}</p>
                      </>
                    )}
                    <p><strong>Duration:</strong> {job.project_duration}</p>
                    <p><strong>Level:</strong> {job.experience_level}</p>
                  </li>
                ))}
              </ul>
            ) : <p className="text-gray-500">No experience added</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
