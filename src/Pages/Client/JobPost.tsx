import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchCategories } from '../../services/JobPostService';
import { createJobPosting, JobPostingPayload } from '../../services/JobPostService';
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
  const [jobPostingStatus, setJobPostingStatus] = useState<'DRAFT' | 'IN_REVIEW'>('IN_REVIEW');

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

  
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!title.trim()) return toast.error('Title is required');
  if (!description.trim()) return toast.error('Description is required');
  if (budgetType === 'HOURLY' && (hourlyMinRate == null || hourlyMaxRate == null)) {
    return toast.error('Please provide both min and max hourly rates');
  }
  if (budgetType === 'FIXED' && fixedPrice == null) {
    return toast.error('Please provide a fixed price');
  }

  const payload: JobPostingPayload = {
    clientId: '39f89cc0-2df7-4bb6-b503-09cb2c20616d',
    title: title.trim(),
    description: description.trim(),
    budgetType,
    hourlyMinRate: budgetType === 'HOURLY' ? hourlyMinRate : null,
    hourlyMaxRate: budgetType === 'HOURLY' ? hourlyMaxRate : null,
    fixedPrice: budgetType === 'FIXED' ? fixedPrice : null,
    projectDuration,
    experienceLevel,
    categoryId: subcategoryToId?.[selectedSubcategory] ?? 0,
    jobPostingStatus,
    skills: skills,
    questions: questions,
  };

  try {
    await createJobPosting(payload);
    toast.success('Job posted successfully!');
    // Optionally, reset form here
  } catch (err: any) {
    toast.error(`Submission failed: ${err.message}`);
  }
};
  const formRef = React.useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded shadow space-y-4">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium">Title</label>
        <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded p-2" />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium">Description</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded p-2" />
      </div>

      {/* Budget Type */}
      <div>
        <label htmlFor="budgetType" className="block text-sm font-medium">Budget Type</label>
        <select id="budgetType" value={budgetType} onChange={(e) => setBudgetType(e.target.value as 'HOURLY' | 'FIXED')} className="w-full border rounded p-2">
          <option value="HOURLY">Hourly</option>
          <option value="FIXED">Fixed</option>
        </select>
      </div>

      {/* Hourly or Fixed Rates */}
      {budgetType === 'HOURLY' ? (
        <div className="flex gap-4">
          <div className="w-1/2">
            <label htmlFor="hourlyMinRate" className="block text-sm font-medium">Min Rate</label>
            <input id="hourlyMinRate" type="number" value={hourlyMinRate ?? ''} onChange={(e) => setHourlyMinRate(Number(e.target.value))} className="w-full border rounded p-2" />
          </div>
          <div className="w-1/2">
            <label htmlFor="hourlyMaxRate" className="block text-sm font-medium">Max Rate</label>
            <input id="hourlyMaxRate" type="number" value={hourlyMaxRate ?? ''} onChange={(e) => setHourlyMaxRate(Number(e.target.value))} className="w-full border rounded p-2" />
          </div>
        </div>
      ) : (
        <div>
          <label htmlFor="fixedPrice" className="block text-sm font-medium">Fixed Price</label>
          <input id="fixedPrice" type="number" value={fixedPrice ?? ''} onChange={(e) => setFixedPrice(Number(e.target.value))} className="w-full border rounded p-2" />
        </div>
      )}

      {/* Project Duration */}
      <div>
        <label htmlFor="projectDuration" className="block text-sm font-medium">Project Duration</label>
        <select id="projectDuration" value={projectDuration} onChange={(e) => setProjectDuration(e.target.value)} className="w-full border rounded p-2">
          <option value="">-- Select Duration --</option>
          <option value="SHORT_TERM">Short Term</option>
          <option value="MEDIUM_TERM">Medium Term</option>
          <option value="LONG_TERM">Long Term</option>
        </select>
      </div>

      {/* Experience Level */}
      <div>
        <label htmlFor="experienceLevel" className="block text-sm font-medium">Experience Level</label>
        <select id="experienceLevel" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className="w-full border rounded p-2">
          <option value="">-- Select Experience Level --</option>
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>
      </div>

      {/* Category Selector */}
      <div>
        <label htmlFor="selectedSubcategory" className="block text-sm font-medium">Category</label>
        <select id="selectedSubcategory" value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)} className="w-full border rounded p-2">
          <option value="">-- Select --</option>
          {subcategories.map((subcategory) => (
            <option key={subcategory} value={subcategory}>{subcategory}</option>
          ))}
        </select>
      </div>

      {/* Skills */}
      <div>
        <label htmlFor="newSkill" className="block text-sm font-medium">Skills</label>
        <div className="flex gap-2 mb-2">
          <input id="newSkill" type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add skill" className="flex-grow p-2 border rounded" />
          <button type="button" onClick={() => { if (newSkill.trim()) { setSkills([...skills, newSkill.trim()]); setNewSkill(''); } }} className="px-3 py-1 bg-green-500 text-white rounded">
            Add
          </button>
        </div>
        <ul className="mb-4 space-y-1">
          {skills.map((skill, index) => (
            <li key={index} className="text-sm text-gray-700">
              {skill}
              <button type="button" onClick={() => setSkills(skills.filter((_, i) => i !== index))} className="ml-2 text-red-500 text-xs">
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Screening Questions */}
      <div>
        <label htmlFor="newQuestion" className="block text-sm font-medium">Screening Questions</label>
        <div className="flex gap-2 mb-2">
          <input id="newQuestion" type="text" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} placeholder="Add question" className="flex-grow p-2 border rounded" />
          <button type="button" onClick={() => { if (newQuestion.trim()) { setQuestions([...questions, newQuestion.trim()]); setNewQuestion(''); } }} className="px-3 py-1 bg-green-500 text-white rounded">
            Add
          </button>
        </div>
        <ul className="mb-4 space-y-1">
          {questions.map((q, index) => (
            <li key={index} className="text-sm text-gray-700">
              {q}
              <button type="button" onClick={() => setQuestions(questions.filter((_, i) => i !== index))} className="ml-2 text-red-500 text-xs">
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Submit Buttons */}
      <div className="flex justify-between gap-4">
        <button
          type="button"
          onClick={async () => {
            setJobPostingStatus('DRAFT');
            setTimeout(() => {
              formRef.current?.requestSubmit();
            }, 0);
          }}
          className="w-1/2 bg-gray-500 text-white py-2 rounded"
        >
          Draft Job
        </button>
        <button
          type="button"
          onClick={async () => {
            setJobPostingStatus('IN_REVIEW');
            setTimeout(() => {
              formRef.current?.requestSubmit();
            }, 0);
          }}
          className="w-1/2 bg-blue-600 text-white py-2 rounded"
        >
          Post Job
        </button>
      </div>
    </form>
  );
};

export default JobPost;
