import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "./SignupContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface EducationEntry {
  institute: string;
  degree: string;
  start_year: string;
  end_year: string;
  description: string;
}

const Step11 = () => {
  const { updateSignupData } = useSignup();
  const navigate = useNavigate();

  const [educationList, setEducationList] = useState<EducationEntry[]>([
    {
      institute: "",
      degree: "",
      start_year: "",
      end_year: "",
      description: "",
    },
  ]);

  const handleChange = (index: number, field: keyof EducationEntry, value: string) => {
    const updated = [...educationList];
    updated[index][field] = value;
    setEducationList(updated);
  };

  const addEducation = () => {
    setEducationList([
      ...educationList,
      {
        institute: "",
        degree: "",
        start_year: "",
        end_year: "",
        description: "",
      },
    ]);
  };

  const removeEducation = (index: number) => {
    setEducationList(educationList.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    updateSignupData({ education: educationList });
    navigate("/signup/step12");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <p className="my-7">7/10</p>
      <p className="font-bold text-xl mb-4">Add Your Education</p>
      <p className="text-gray-600 text-center mb-6">
        Add schools, colleges, or institutions where you’ve studied. You can list multiple.
      </p>

      {educationList.map((edu, index) => {
        const prefix = `edu-${index}`;
        return (
          <div key={index} className="border p-4 rounded-md mb-6 bg-gray-50">
            <div className="mb-3">
              <label htmlFor={`${prefix}-institute`} className="block font-semibold">Institute</label>
              <input
                id={`${prefix}-institute`}
                value={edu.institute}
                onChange={(e) => handleChange(index, "institute", e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-3">
              <label htmlFor={`${prefix}-degree`} className="block font-semibold">Degree</label>
              <input
                id={`${prefix}-degree`}
                value={edu.degree}
                onChange={(e) => handleChange(index, "degree", e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex gap-4 mb-3">
              <div className="flex-1">
                <label htmlFor={`${prefix}-start-year`} className="block font-semibold">Start Year</label>
                <input
                  id={`${prefix}-start-year`}
                  type="text"
                  value={edu.start_year}
                  onChange={(e) => handleChange(index, "start_year", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex-1">
                <label htmlFor={`${prefix}-end-year`} className="block font-semibold">End Year</label>
                <input
                  id={`${prefix}-end-year`}
                  type="text"
                  value={edu.end_year}
                  onChange={(e) => handleChange(index, "end_year", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor={`${prefix}-description`} className="block font-semibold">Description</label>
              <textarea
                id={`${prefix}-description`}
                value={edu.description}
                onChange={(e) => handleChange(index, "description", e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            {educationList.length > 1 && (
              <button
                onClick={() => removeEducation(index)}
                className="text-red-600 text-sm mt-2"
              >
                Remove This Education
              </button>
            )}
          </div>
        );
      })}

      <button
        onClick={addEducation}
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        <FontAwesomeIcon icon={faPlus} /> Add Another Education
      </button>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate("/signup/step10")}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step11;