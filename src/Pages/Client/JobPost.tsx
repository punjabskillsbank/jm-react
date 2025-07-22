import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchCategories } from '../../services/JobPostService'; // adjust path as needed

const JobPost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budgetType, setBudgetType] = useState<'HOURLY' | 'FIXED'>('HOURLY');
  const [hourlyMinRate, setHourlyMinRate] = useState<number | null>(null);
  const [hourlyMaxRate, setHourlyMaxRate] = useState<number | null>(null);
  const [fixedPrice, setFixedPrice] = useState<number | null>(null);
  const [projectDuration, setProjectDuration] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [subcategoryToId, setSubcategoryToId] = useState<{ [key: string]: number }>({});
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [jobPostingStatus] = useState('ACTIVE');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        const subToIdMap: Record<string, number> = {};
        const allSubcategories: string[] = [];
        let id = 1;
        for (const main in data) {
          data[main].forEach((sub: string) => {
            subToIdMap[sub] = id++;
            allSubcategories.push(sub);
          });
        }
        setSubcategories(allSubcategories);
        setSubcategoryToId(subToIdMap);
      } catch {
        toast.error('Failed to load categories');
      }
    };
    loadCategories();
  }, []);

   const handleSubmit = async (status: 'DRAFT' | 'IN_REVIEW') => {
    const payload = {
      clientId: '39f89cc0-2df7-4bb6-b503-09cb2c20616d',
      title,
      description,
      budgetType,
      hourlyMinRate: budgetType === 'HOURLY' ? hourlyMinRate : 0,
      hourlyMaxRate: budgetType === 'HOURLY' ? hourlyMaxRate : 0,
      fixedPrice: budgetType === 'FIXED' ? fixedPrice : 0,
      projectDuration,
      experienceLevel,
      category: {
        categoryId: subcategoryToId?.[selectedSubcategory] ?? 0,
      },
      jobPostingStatus: status,
      skills: skills.map((skill, index) => ({
        skillId: index + 1,
        skill,
      })),
      questions: questions.map((question, index) => ({
        questionId: index + 1,
        question,
      })),
    };

    try {
      const response = await fetch('http://localhost:8081/api/v1/job_postings/create_job_posting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Job created:', data);
      toast.success(`Job ${status === 'DRAFT' ? 'saved as draft' : 'submitted for review'} successfully!`);
    } catch (err) {
      console.error('Error submitting job:', err);
      toast.error('Failed to submit job');
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="max-w-3xl mx-auto p-6 bg-white rounded shadow space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded p-2" />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded p-2" />
      </div>

      {/* Budget Type */}
      <div>
        <label className="block text-sm font-medium">Budget Type</label>
        <select value={budgetType} onChange={(e) => setBudgetType(e.target.value as 'HOURLY' | 'FIXED')} className="w-full border rounded p-2">
          <option value="HOURLY">Hourly</option>
          <option value="FIXED">Fixed</option>
        </select>
      </div>

      {/* Hourly Rates */}
      {budgetType === 'HOURLY' && (
        <div className="flex gap-4">
          <input type="number" placeholder="Min Rate" value={hourlyMinRate ?? ''} onChange={(e) => setHourlyMinRate(Number(e.target.value))} className="w-1/2 border rounded p-2" />
          <input type="number" placeholder="Max Rate" value={hourlyMaxRate ?? ''} onChange={(e) => setHourlyMaxRate(Number(e.target.value))} className="w-1/2 border rounded p-2" />
        </div>
      )}

      {/* Fixed Price */}
      {budgetType === 'FIXED' && (
        <div>
          <input type="number" placeholder="Fixed Price" value={fixedPrice ?? ''} onChange={(e) => setFixedPrice(Number(e.target.value))} className="w-full border rounded p-2" />
        </div>
      )}

      {/* Project Duration */}
      <div>
  <label className="block text-sm font-medium">Project Duration</label>
  <select
    value={projectDuration}
    onChange={(e) => setProjectDuration(e.target.value)}
    className="w-full border rounded p-2"
  >
    <option value="">-- Select Duration --</option>
    <option value="SHORT_TERM">Short Term</option>
    <option value="MEDIUM_TERM">Medium Term</option>
    <option value="LONG_TERM">Long Term</option>
  </select>
</div>


      {/* Experience Level */}
      <div>
  <label className="block text-sm font-medium">Experience Level</label>
  <select
    value={experienceLevel}
    onChange={(e) => setExperienceLevel(e.target.value)}
    className="w-full border rounded p-2"
  >
    <option value="">-- Select Experience Level --</option>
    <option value="BEGINNER">Beginner</option>
    <option value="INTERMEDIATE">Intermediate</option>
    <option value="ADVANCED">Advanced</option>
  </select>
</div>

      {/* Subcategory Selector */}
      <div>
        <label className="block text-sm font-medium">Category</label>
        <select value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)} className="w-full border rounded p-2">
          <option value="">-- Select --</option>
          {subcategories.map((subcategory) => (
            <option key={subcategory} value={subcategory}>{subcategory}</option>
          ))}
        </select>
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm font-medium">Skills</label>
        <div className="flex gap-2 mb-2">
          <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add skill" className="flex-grow p-2 border rounded" />
          <button
            type="button"
            onClick={() => {
              if (newSkill.trim()) {
                setSkills([...skills, newSkill.trim()]);
                setNewSkill('');
              }
            }}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            Add
          </button>
        </div>
        <ul className="mb-4 space-y-1">
          {skills.map((skill, index) => (
            <li key={index} className="text-sm text-gray-700">
              {skill}
              <button type="button" onClick={() => setSkills(skills.filter((_, i) => i !== index))} className="ml-2 text-red-500 text-xs">Remove</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Questions */}
      <div>
        <label className="block text-sm font-medium">Screening Questions</label>
        <div className="flex gap-2 mb-2">
          <input type="text" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} placeholder="Add question" className="flex-grow p-2 border rounded" />
          <button
            type="button"
            onClick={() => {
              if (newQuestion.trim()) {
                setQuestions([...questions, newQuestion.trim()]);
                setNewQuestion('');
              }
            }}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            Add
          </button>
        </div>
        <ul className="mb-4 space-y-1">
          {questions.map((q, index) => (
            <li key={index} className="text-sm text-gray-700">
              {q}
              <button type="button" onClick={() => setQuestions(questions.filter((_, i) => i !== index))} className="ml-2 text-red-500 text-xs">Remove</button>
            </li>
          ))}
        </ul>
      </div>

       <div className="flex gap-4">
        <button
          type="button"
          onClick={() => handleSubmit('DRAFT')}
          className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
        >
          Save as Draft
        </button>
        <button
          type="button"
          onClick={() => handleSubmit('IN_REVIEW')}
          className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Post Job
        </button>
      </div>
    </form>
  );
};
    
export default JobPost;
