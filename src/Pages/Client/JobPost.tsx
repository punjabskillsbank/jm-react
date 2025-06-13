import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchCategories, createJobPosting } from '../../services/JobPostService';

const JobPost = () => {
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
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validateField = (field: string, value: string | number) => {
    switch (field) {
      case 'title':
        return value ? '' : 'Title is required.';
      case 'description':
        return value ? '' : 'Description is required.';
      case 'subcategory':
        return value ? '' : 'Please select a subcategory.';
      case 'hourlyMinRate':
      case 'hourlyMaxRate':
        if (budgetType === 'HOURLY' && !value) return 'Rate is required.';
        break;
      case 'fixedPrice':
        if (budgetType === 'FIXED' && !value) return 'Fixed price is required.';
        break;
      default:
        return '';
    }
    return '';
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {
      title: validateField('title', title),
      description: validateField('description', description),
      subcategory: validateField('subcategory', selectedSubcategory),
    };

    if (budgetType === 'HOURLY') {
      newErrors.hourlyMinRate = validateField('hourlyMinRate', hourlyMinRate);
      newErrors.hourlyMaxRate = validateField('hourlyMaxRate', hourlyMaxRate);
    } else {
      newErrors.fixedPrice = validateField('fixedPrice', fixedPrice);
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(err => !err);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setBudgetType('HOURLY');
    setHourlyMinRate(0);
    setHourlyMaxRate(0);
    setFixedPrice(0);
    setProjectDuration('SHORT_TERM');
    setExperienceLevel('BEGINNER');
    setSelectedSubcategory('');
    setErrors({});
  };

  const handleSubmit = async (jobPostingStatus: 'DRAFT' | 'IN_REVIEW') => {
    if (!validateForm()) {
      toast.error("Please fix form errors before submitting.");
      return;
    }

    const payload = {
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
      await createJobPosting(payload);
      console.log('Job posting created:', payload);
      toast.success(`Job ${jobPostingStatus === 'DRAFT' ? 'saved as draft' : 'posted'} successfully!`);
      resetForm();
    } catch {
      toast.error('Failed to submit job posting.');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold">Create Job Posting</h2>

      <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
      <input
        id="title"
        type="text"
        placeholder="Title"
        className="w-full p-2 border rounded"
        value={title}
        onChange={e => {
          setTitle(e.target.value);
          setErrors(prev => ({ ...prev, title: validateField('title', e.target.value) }));
        }}
      />
      {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

      <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
      <textarea
        id="description"
        placeholder="Description"
        className="w-full p-2 border rounded"
        rows={4}
        value={description}
        onChange={e => {
          setDescription(e.target.value);
          setErrors(prev => ({ ...prev, description: validateField('description', e.target.value) }));
        }}
      />
      {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

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

      {budgetType === 'HOURLY' && (
        <div className="flex gap-2">
          <div className="w-full">
            <label htmlFor="minRate" className="block text-sm font-medium mb-1">Min Rate</label>
            <input
              id="minRate"
              type="number"
              placeholder="Min Rate"
              className="w-full p-2 border rounded"
              value={hourlyMinRate}
              onChange={e => {
                setHourlyMinRate(Number(e.target.value));
                setErrors(prev => ({ ...prev, hourlyMinRate: validateField('hourlyMinRate', e.target.value) }));
              }}
            />
          </div>
          <div className="w-full">
            <label htmlFor="maxRate" className="block text-sm font-medium mb-1">Max Rate</label>
            <input
              id="maxRate"
              type="number"
              placeholder="Max Rate"
              className="w-full p-2 border rounded"
              value={hourlyMaxRate}
              onChange={e => {
                setHourlyMaxRate(Number(e.target.value));
                setErrors(prev => ({ ...prev, hourlyMaxRate: validateField('hourlyMaxRate', e.target.value) }));
              }}
            />
          </div>
        </div>
      )}
      {budgetType === 'HOURLY' && (errors.hourlyMinRate || errors.hourlyMaxRate) && (
        <p className="text-red-500 text-sm">{errors.hourlyMinRate || errors.hourlyMaxRate}</p>
      )}

      {budgetType === 'FIXED' && (
        <>
          <label htmlFor="fixedPrice" className="block text-sm font-medium mb-1">Fixed Price</label>
          <input
            id="fixedPrice"
            type="number"
            placeholder="Fixed Price"
            className="w-full p-2 border rounded"
            value={fixedPrice}
            onChange={e => {
              setFixedPrice(Number(e.target.value));
              setErrors(prev => ({ ...prev, fixedPrice: validateField('fixedPrice', e.target.value) }));
            }}
          />
          {errors.fixedPrice && <p className="text-red-500 text-sm">{errors.fixedPrice}</p>}
        </>
      )}

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

      <label htmlFor="experienceLevel" className="block text-sm font-medium mb-1">Experience Level</label>
      <select
        id="experienceLevel"
        className="w-full p-2 border rounded"
        value={experienceLevel}
        onChange={e => setExperienceLevel(e.target.value as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCE')}
      >
        <option value="BEGINNER">Beginner</option>
        <option value="INTERMEDIATE">Intermediate</option>
        <option value="ADVANCE">Advance</option>
      </select>

      <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
      <select
        id="category"
        className="w-full p-2 border rounded"
        value={selectedSubcategory}
        onChange={e => {
          setSelectedSubcategory(e.target.value);
          setErrors(prev => ({ ...prev, subcategory: validateField('subcategory', e.target.value) }));
        }}
      >
        <option value="">Select Category</option>
        {subcategories.map((sub) => (
          <option key={sub} value={sub}>{sub}</option>
        ))}
      </select>
      {errors.subcategory && <p className="text-red-500 text-sm">{errors.subcategory}</p>}

      <div className="flex gap-4">
        <button onClick={() => handleSubmit('DRAFT')} className="px-4 py-2 bg-gray-500 text-white rounded">Save as Draft</button>
        <button onClick={() => handleSubmit('IN_REVIEW')} className="px-4 py-2 bg-blue-600 text-white rounded">Post Job</button>
      </div>
    </div>
  );
};

export default JobPost;
