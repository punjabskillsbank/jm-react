import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../context/SignupContext";

const Step16 = () => {
  const { signupData, updateSignupData } = useSignup();
  const navigate = useNavigate();

  const [dob, setDob] = useState<string>(typeof signupData.dob === "string" ? signupData.dob : "");
  const [country, setCountry] = useState(signupData.country || "India");
  const [address, setAddress] = useState(signupData.address || "");
  const [city, setCity] = useState(signupData.city || "");
  const [state, setState] = useState(signupData.state || "");
  const [zip, setZip] = useState(signupData.zip || "");
  const [phone, setPhone] = useState(signupData.phone || "");
  const [photo, setPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!dob) newErrors.dob = "Date of birth is required";
    if (!country) newErrors.country = "Country is required";
    if (!address) newErrors.address = "Street address is required";
    if (!city) newErrors.city = "City is required";
    if (!state) newErrors.state = "State/Province is required";
    if (!zip) newErrors.zip = "ZIP/Postal Code is required";
    if (!phone) newErrors.phone = "Phone number is required";
    if (!photo) newErrors.photo = "Profile photo is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      updateSignupData({ dob, country, address, city, state, zip, phone, photo });
      navigate("/signup/profile-review");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">10/10 - Final Details</h2>
      <p className="text-gray-600 text-center mb-6">
        A professional photo helps build trust. We also need your details for secure transactions.
      </p>

      {/* Photo Upload */}
      <div className="mb-4">
        <label className="block font-semibold">Upload Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="w-full p-2 border rounded-md"
        />
        {errors.photo && <p className="text-red-500 text-sm">{errors.photo}</p>}
      </div>

      {/* Date of Birth */}
      <div className="mb-4">
        <label className="block font-semibold">Date of Birth</label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
        {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
      </div>

      {/* Country */}
      <div className="mb-4">
        <label className="block font-semibold">Country</label>
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
        {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
      </div>

      {/* Address Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block font-semibold">Street Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
        </div>
        <div className="mb-4">
          <label className="block font-semibold">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
        </div>
      </div>

      {/* State & Zip */}
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block font-semibold">State/Province</label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
        </div>
        <div className="mb-4">
          <label className="block font-semibold">ZIP/Postal Code</label>
          <input
            type="text"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          {errors.zip && <p className="text-red-500 text-sm">{errors.zip}</p>}
        </div>
      </div>

      {/* Phone Number */}
      <div className="mb-4">
        <label className="block font-semibold">Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate("/signup/step15")}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          Back
        </button>

        <button
          onClick={handleNext}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Review Your Profile
        </button>
      </div>
    </div>
  );
};

export default Step16;