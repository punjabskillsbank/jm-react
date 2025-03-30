import { useNavigate } from "react-router-dom";

const Step7 = () => {
  const navigate = useNavigate(); // Navigation hook

  const handleNext = () => {
    navigate("/signup/step8"); // Navigate to Step8
  };

  const handleBack = () => {
    navigate("/signup/step6"); // Navigate to Step6
  };

  return (
    <div className="max-w-4xl mx-auto center p-5 my-7">
      <p className="my-7">1/10</p>
      <h2 className="font-bold my-8"> Create your profile</h2>
      
      <h1 className="font-bold my-8">Now it's the right time to tell us about yourself.</h1>
      <p className="my-7">
        We need to get a sense of your education, experience, and skills.
        It's quickest to import your information, and you can edit it before your profile goes live.
      </p>


      {/* Navigation Buttons */}
      <div className="flex justify-between mt-7">
              <button
            onClick={handleBack}
            className="px-5 py-2 text-lg border border-gray-400 rounded-lg hover:bg-gray-100 transition"
          > Back
                </button>
                <button
            onClick={handleNext}
            className="px-5 py-2 text-lg bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
                  Next
                </button>
      </div>
    </div>
  );
};

export default Step7;
