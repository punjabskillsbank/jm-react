import { useSignup } from "./SignupContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface Category {
id: string;
name: string;
}

const Step6 = () => {
const { signupData, updateSignupData } = useSignup();
const navigate = useNavigate();

const [categories, setCategories] = useState<Category[]>([]);
const [selectedCategory, setSelectedCategory] = useState<string>(
typeof signupData.workCategories === "string" ? signupData.workCategories : ""
);

// Fetch unique categories from API
useEffect(() => {
const fetchCategories = async () => {
try {
const response = await fetch("http://localhost:8081/api/v1/job_postings/categories");
const data = await response.json();


    if (Array.isArray(data)) {
      // Ensure uniqueness by category name
      const unique = Array.from(new Map(data.map(item => [item.name, item])).values());
      setCategories(unique);
    } else {
      console.error("Unexpected categories format:", data);
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

fetchCategories();
}, []);

const handleCategorySelect = (category: string) => {
setSelectedCategory(category);
};

const handleBack = () => {
navigate("/signup/step5");
};

const handleNext = () => {
updateSignupData({ workCategories: selectedCategory });
navigate("/signup/step7");
};

return (
<div className="max-w-4xl mx-auto center p-5 my-7">
<p className="my-7">2/10</p>
<p className="font-bold my-8">What kind of work are you here to do?</p>
<p>Don't worry, you can change this choice later on.</p>


  <div className="grid gap-2 my-5">
    {categories.map((category) => (
      <button
        key={category.id}
        onClick={() => handleCategorySelect(category.name)}
        className={`px-4 py-2 rounded-md cursor-pointer border-none transition ${
          selectedCategory === category.name ? "bg-green-600 text-white" : "bg-gray-300 text-black"
        }`}
      >
        {category.name}
      </button>
    ))}
  </div>

  <div className="flex justify-between mt-7">
    <button
      onClick={handleBack}
      className="px-5 py-2 text-lg border border-gray-400 rounded-lg hover:bg-gray-100 transition"
    >
      Back
    </button>
    <button
      onClick={handleNext}
      disabled={!selectedCategory}
      className={`px-5 py-2 text-lg rounded-lg transition ${
        selectedCategory ? "bg-black text-white hover:bg-gray-800" : "bg-gray-400 text-white cursor-not-allowed"
      }`}
    >
      Next
    </button>
  </div>
</div>
);
};

export default Step6;