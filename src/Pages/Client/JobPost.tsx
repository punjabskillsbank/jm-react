import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { fetchCategories, createJobPosting, JobPostingPayload, uploadFilesToS3, saveAttachmentUrls,} from '../../services/JobPostService';

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
   const [attachments, setAttachments] = useState<File[]>([]);

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

  const addQuestion = () => {
    setQuestions([...questions, '']);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (
    e: React.FormEvent | null,
    status: 'DRAFT' | 'IN_REVIEW'
  ) => {
    if (e) e.preventDefault();

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
      category: {
        categoryId: subcategoryToId?.[selectedSubcategory] ?? 0,
      },
      jobPostingStatus: status,
      skills,
      questions: questions.map((q) => ({ question: q })),
    };

    try {
      const response = await createJobPosting(payload);
      const jobId = response.jobPostingId;

                  const fileURLs = attachments.length > 0
                    ? await uploadFilesToS3(attachments, jobId)
                    : [];

                  if (fileURLs.length > 0) {
                    await saveAttachmentUrls(jobId, fileURLs);
                  }
      toast.success(`Job ${status === 'DRAFT' ? 'drafted' : 'posted'} successfully!`);
    } catch (err: any) {
      toast.error(`Submission failed: ${err.message}`);
    }
  };

  return (
    <form
      onSubmit={(e) => handleSubmit(e, 'IN_REVIEW')}
      className="max-w-3xl mx-auto p-6 bg-white rounded shadow space-y-4"
    >
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

      {/* Rate Inputs */}
      {budgetType === 'HOURLY' ? (
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium">Min Rate</label>
            <input type="number" value={hourlyMinRate ?? ''} onChange={(e) => setHourlyMinRate(Number(e.target.value))} className="w-full border rounded p-2" />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium">Max Rate</label>
            <input type="number" value={hourlyMaxRate ?? ''} onChange={(e) => setHourlyMaxRate(Number(e.target.value))} className="w-full border rounded p-2" />
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium">Fixed Price</label>
          <input type="number" value={fixedPrice ?? ''} onChange={(e) => setFixedPrice(Number(e.target.value))} className="w-full border rounded p-2" />
        </div>
      )}

      {/* Duration */}
      <div>
        <label className="block text-sm font-medium">Project Duration</label>
        <select value={projectDuration} onChange={(e) => setProjectDuration(e.target.value)} className="w-full border rounded p-2">
          <option value="">-- Select --</option>
          <option value="SHORT_TERM">Short Term</option>
          <option value="MEDIUM_TERM">Medium Term</option>
          <option value="LONG_TERM">Long Term</option>
        </select>
      </div>

      {/* Experience */}
      <div>
        <label className="block text-sm font-medium">Experience Level</label>
        <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className="w-full border rounded p-2">
          <option value="">-- Select --</option>
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>
      </div>

      {/* Category */}
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

    {/* Job Posting Attachement*/}
    <label className="block text-sm font-medium mb-1">Attachments (Max 10 files)</label>
          <input
            type="file"
            multiple
            accept="*"
            onChange={(e) => {
              const newFiles = Array.from(e.target.files || []);

              const combinedFiles = [...attachments, ...newFiles];

              if (combinedFiles.length > 10) {
                toast.error('You can upload up to 10 files in total.');
                return;
              }
              setAttachments(combinedFiles);
            }}
            className="w-full p-2 border rounded"
          />
          <ul className="text-sm mt-2">
            {attachments.map((file, idx) => (
              <li key={idx} className="flex justify-between items-center">
                {file.name}
                <button
                  className="ml-2 text-red-500 text-xs"
                  onClick={() => {
                    setAttachments(prev => prev.filter((_, i) => i !== idx));
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

      {/* Screening Questions */}
      <div className="mb-4">
        <label className="font-medium">Screening Questions</label>
        {questions.map((q, index) => (
          <input
            key={index}
            type="text"
            className="w-full border px-3 py-2 my-2"
            placeholder={`Question ${index + 1}`}
            value={q}
            onChange={(e) => handleQuestionChange(index, e.target.value)}
          />
        ))}
        <button type="button" onClick={addQuestion} className="text-blue-600 mt-2 hover:underline">
          + Add Question
        </button>
      </div>

      {/* Buttons */}
      <div className="flex justify-between gap-4">
        <button
          type="button"
          onClick={() => handleSubmit(null, 'DRAFT')}
          className="w-1/2 bg-gray-500 text-white py-2 rounded"
        >
          Draft Job
        </button>
        <button
          type="button"
          onClick={() => handleSubmit(null, 'IN_REVIEW')}
          className="w-1/2 bg-blue-600 text-white py-2 rounded"
        >
          Post Job
        </button>
      </div>
    </form>
  );
};

export default JobPost;
