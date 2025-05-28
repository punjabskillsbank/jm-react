import React from "react";

const JobForm = ({ form, setForm, categories, onSubmit, editingJobId }) => (
  <div className="bg-white p-6 rounded-lg shadow mb-10">
    <h2 className="text-xl font-semibold mb-4">
      {editingJobId ? "Edit Job" : "Post a New Job"}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <Select
        label="Project Duration"
        value={form.projectDuration}
        options={{ SHORT_TERM: "Short Term", LONG_TERM: "Long Term" }}
        onChange={(e) => setForm({ ...form, projectDuration: e.target.value })}
      />
      <Select
        label="Budget Type"
        value={form.budgetType}
        options={{ HOURLY: "Hourly", FIXED: "Fixed" }}
        onChange={(e) => setForm({ ...form, budgetType: e.target.value })}
      />

      {form.budgetType === "HOURLY" && (
        <>
          <Input label="Hourly Min Rate ($)" type="number" value={form.hourlyMinRate}
                 onChange={(e) => setForm({ ...form, hourlyMinRate: e.target.value })} />
          <Input label="Hourly Max Rate ($)" type="number" value={form.hourlyMaxRate}
                 onChange={(e) => setForm({ ...form, hourlyMaxRate: e.target.value })} />
        </>
      )}

      {form.budgetType === "FIXED" && (
        <Input label="Fixed Price ($)" type="number" value={form.fixedPrice}
               onChange={(e) => setForm({ ...form, fixedPrice: e.target.value })} />
      )}

      <Select
        label="Experience Level"
        value={form.experienceLevel}
        options={{ BEGINNER: "Beginner", INTERMEDIATE: "Intermediate", ADVANCED: "Advanced" }}
        onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
      />
      <select
  value={form.categoryId}
  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
  className="w-full border rounded p-2"
>
  <option value="">Select a category</option>
  {Object.entries(categories).map(([id, name]) => (
    <option key={id} value={id}>
      {String(name)}
    </option>
  ))}
</select>

      <div className="md:col-span-2">
        <label className="font-medium">Job Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full mt-1 p-2 border rounded"
          rows={4}
          placeholder="Detailed job description"
        />
      </div>
    </div>
    <button
      onClick={onSubmit}
      className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
    >
      {editingJobId ? "Update Job" : "Post Job"}
    </button>
  </div>
);

const Input = ({ label, type = "text", value, onChange }) => (
  <div>
    <label className="font-medium">{label}</label>
    <input type={type} value={value} onChange={onChange} className="w-full mt-1 p-2 border rounded" />
  </div>
);

type SelectProps = {
  label: string;
  value: string;
  options: Record<string, string | number>;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  includePlaceholder?: boolean;
};

const Select: React.FC<SelectProps> = ({ label, value, options, onChange, includePlaceholder = false }) => (
  <div>
    <label className="font-medium">{label}</label>
    <select value={value} onChange={onChange} className="w-full mt-1 p-2 border rounded">
      {includePlaceholder && <option value="">Select {label}</option>}
      {Object.entries(options).map(([key, optionLabel]) => (
        <option key={key} value={key}>{String(optionLabel)}</option>
      ))}
    </select>
  </div>
);

export default JobForm;
