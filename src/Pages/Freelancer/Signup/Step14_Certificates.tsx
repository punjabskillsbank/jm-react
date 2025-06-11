import { useSignup } from "../Signup/SignupContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Step14 = () => {
  const { signupData, updateSignupData } = useSignup();
  const [certificates, setCertificates] = useState(signupData.certificate || []);
  const navigate = useNavigate();

  const handleAddCertificate = () => {
    const updated = [
      ...certificates,
      {
        certificateName: "",
        issuedBy: "",
        issueDate: "",
        expiryDate: "",
        credentialUrl: "",
      },
    ];
    setCertificates(updated);
    updateSignupData({ certificate: updated });
  };

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...certificates];
    updated[index][field] = value;
    setCertificates(updated);
    updateSignupData({ certificate: updated });
  };

  const goNext = () => {
    updateSignupData({ certificate: certificates });
    navigate("/signup/step15");
  };

  const goBack = () => {
    navigate("/signup/step13");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <p className="my-7">10/10</p>
      <h2 className="text-xl font-bold mb-4">Certificates</h2>
      <p className="text-gray-600 text-center mb-6">Add any certificates you've earned (optional).</p>

      {certificates.map((cert, index) => (
        <div key={index} className="mb-6 p-4 border rounded bg-gray-50">
          <input
            type="text"
            placeholder="Certificate Name"
            value={cert.certificateName}
            onChange={(e) => handleChange(index, "certificateName", e.target.value)}
            className="block w-full mb-2 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Issued By"
            value={cert.issuedBy}
            onChange={(e) => handleChange(index, "issuedBy", e.target.value)}
            className="block w-full mb-2 p-2 border rounded"
          />
          <input
            type="date"
            value={cert.issueDate}
            onChange={(e) => handleChange(index, "issueDate", e.target.value)}
            className="block w-full mb-2 p-2 border rounded"
          />
          <input
            type="date"
            value={cert.expiryDate}
            onChange={(e) => handleChange(index, "expiryDate", e.target.value)}
            className="block w-full mb-2 p-2 border rounded"
          />
          <input
            type="url"
            placeholder="Credential URL"
            value={cert.credentialUrl}
            onChange={(e) => handleChange(index, "credentialUrl", e.target.value)}
            className="block w-full p-2 border rounded"
          />
        </div>
      ))}

      <button
        onClick={handleAddCertificate}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        Add Certificate
      </button>

      <div className="flex justify-between mt-8">
        <button
          onClick={goBack}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Back
        </button>
        <button
          onClick={goNext}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step14;
