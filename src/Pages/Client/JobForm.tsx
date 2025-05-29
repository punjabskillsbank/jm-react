import React, { useEffect, useState } from 'react';
import axios from 'axios';

const JobForm = () => {
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [subcategoryToId, setSubcategoryToId] = useState<Record<string, number>>({});
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budgetType, setBudgetType] = useState<'HOURLY' | 'FIXED'>('HOURLY');
  const [hourlyMinRate, setHourlyMinRate] = useState<number>(0);
  const [hourlyMaxRate, setHourlyMaxRate] = useState<number>(0);
  const [fixedPrice, setFixedPrice] = useState<number>(0);
  const [projectDuration, setProjectDuration] = useState<'SHORT_TERM' | 'LONG_TERM'>('SHORT_TERM');
  const [experienceLevel, setExperienceLevel] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCE'>('BEGINNER');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/v1/job_postings/categories');
        const data = response.data;
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
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (jobPostingStatus: 'DRAFT' | 'IN_REVIEW') => {
    const payload = {
      jobPostingId: Date.now(),
      clientId: "88033018-f0aa-44ff-9678-741b37dac853",
      title,
      description,
      budgetType,
      hourlyMinRate: budgetType === 'HOURLY' ? hourlyMinRate : 0,
      hourlyMaxRate: budgetType === 'HOURLY' ? hourlyMaxRate : 0,
      fixedPrice: budgetType === 'FIXED' ? fixedPrice : 0,
      projectDuration,
      experienceLevel,
      categoryId: subcategoryToId[selectedSubcategory],
      jobPostingStatus,
    };

    try {
      console.log("Payload being sent:", payload);
      await axios.post('http://localhost:8081/api/v1/job_postings/create_job_posting', payload);
      alert(`Job ${jobPostingStatus} submitted successfully!`);
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold">Create Job Posting</h2>

      <input
        type="text"
        placeholder="Title"
        className="w-full p-2 border rounded"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        className="w-full p-2 border rounded"
        rows={4}
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      {/* Budget Type */}
      <div>
        <label htmlFor="budgetType" className="block text-sm font-medium mb-1">Budget Type</label>
        <select
          id="budgetType"
          className="w-full p-2 border rounded"
          value={budgetType}
          onChange={e => setBudgetType(e.target.value as 'HOURLY' | 'FIXED')}
        >
          <option value="HOURLY">Hourly</option>
          <option value="FIXED">Fixed</option>
        </select>
      </div>

      {/* Hourly or Fixed */}
      {budgetType === 'HOURLY' && (
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min Rate"
            className="w-full p-2 border rounded"
            value={hourlyMinRate}
            onChange={e => setHourlyMinRate(Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="Max Rate"
            className="w-full p-2 border rounded"
            value={hourlyMaxRate}
            onChange={e => setHourlyMaxRate(Number(e.target.value))}
          />
        </div>
      )}

      {budgetType === 'FIXED' && (
        <input
          type="number"
          placeholder="Fixed Price"
          className="w-full p-2 border rounded"
          value={fixedPrice}
          onChange={e => setFixedPrice(Number(e.target.value))}
        />
      )}

      {/* Project Duration */}
      <div>
        <label htmlFor="projectDuration" className="block text-sm font-medium mb-1">Project Duration</label>
        <select
          id="projectDuration"
          className="w-full p-2 border rounded"
          value={projectDuration}
          onChange={e => setProjectDuration(e.target.value as 'SHORT_TERM' | 'LONG_TERM')}
        >
          <option value="SHORT_TERM">Short Term</option>
          <option value="LONG_TERM">Long Term</option>
        </select>
      </div>

      {/* Experience Level */}
      <div>
        <label htmlFor="experienceLevel" className="block text-sm font-medium mb-1">Experience Level</label>
        <select
          id="experienceLevel"
          className="w-full p-2 border rounded"
          value={experienceLevel}
          onChange={e => setExperienceLevel(e.target.value as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCE')}
        >
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCE">ADVANCE</option>
        </select>
      </div>

      {/* Subcategory */}
      <div>
        <label htmlFor="subcategory" className="block text-sm font-medium mb-1">Subcategory</label>
        <select
          id="subcategory"
          className="w-full p-2 border rounded"
          value={selectedSubcategory}
          onChange={e => setSelectedSubcategory(e.target.value)}
        >
          <option value="">Select Subcategory</option>
          {subcategories.map((sub) => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-4">
        <button onClick={() => handleSubmit('DRAFT')} className="px-4 py-2 bg-gray-500 text-white rounded">Save as Draft</button>
        <button onClick={() => handleSubmit('IN_REVIEW')} className="px-4 py-2 bg-blue-600 text-white rounded">Post Job</button>
      </div>
    </div>
  );
};

export default JobForm;
