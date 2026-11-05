import React, { useState, useEffect } from 'react';

export default function StudentForm({ editingStudent, onSave, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    course: '',
    section: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  // Sync form data when an existing student is selected for editing
  useEffect(() => {
    if (editingStudent) {
      setFormData({
        firstname: editingStudent.firstname || '',
        lastname: editingStudent.lastname || '',
        course: editingStudent.course || '',
        section: editingStudent.section || '',
      });
      setValidationErrors({});
    } else {
      resetForm();
    }
  }, [editingStudent]);

  const resetForm = () => {
    setFormData({
      firstname: '',
      lastname: '',
      course: '',
      section: '',
    });
    setValidationErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.firstname.trim()) errors.firstname = 'First name is required';
    if (!formData.lastname.trim()) errors.lastname = 'Last name is required';
    if (!formData.course.trim()) errors.course = 'Course is required';
    if (!formData.section.trim()) errors.section = 'Section is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const success = await onSave(formData);
    if (success && !editingStudent) {
      resetForm();
    }
  };

  const isEditing = Boolean(editingStudent);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            {isEditing ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                Edit Student Details
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                Add New Student
              </>
            )}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isEditing
              ? `Modifying record ID #${editingStudent.id}`
              : 'Fill in details below to register a new student'}
          </p>
        </div>

        {isEditing && (
          <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full">
            ID: #{editingStudent.id}
          </span>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name */}
        <div>
          <label htmlFor="firstname" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            First Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="firstname"
            name="firstname"
            type="text"
            placeholder="e.g. Juan"
            value={formData.firstname}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none transition-all ${
              validationErrors.firstname
                ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
            }`}
          />
          {validationErrors.firstname && (
            <p className="text-xs text-rose-500 mt-1">{validationErrors.firstname}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastname" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Last Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="lastname"
            name="lastname"
            type="text"
            placeholder="e.g. Dela Cruz"
            value={formData.lastname}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none transition-all ${
              validationErrors.lastname
                ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
            }`}
          />
          {validationErrors.lastname && (
            <p className="text-xs text-rose-500 mt-1">{validationErrors.lastname}</p>
          )}
        </div>

        {/* Course */}
        <div>
          <label htmlFor="course" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Course <span className="text-rose-500">*</span>
          </label>
          <input
            id="course"
            name="course"
            type="text"
            placeholder="e.g. BSIT or IT"
            value={formData.course}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none transition-all ${
              validationErrors.course
                ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
            }`}
          />
          {validationErrors.course && (
            <p className="text-xs text-rose-500 mt-1">{validationErrors.course}</p>
          )}
        </div>

        {/* Section */}
        <div>
          <label htmlFor="section" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Section <span className="text-rose-500">*</span>
          </label>
          <input
            id="section"
            name="section"
            type="text"
            placeholder="e.g. 3A, WMD 3A"
            value={formData.section}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none transition-all ${
              validationErrors.section
                ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
            }`}
          />
          {validationErrors.section && (
            <p className="text-xs text-rose-500 mt-1">{validationErrors.section}</p>
          )}
        </div>

        {/* Form Action Buttons */}
        <div className="pt-3 space-y-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isEditing
                ? 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800 shadow-amber-200'
                : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-indigo-200'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? (
              <>
                <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>{isEditing ? 'Updating...' : 'Saving...'}</span>
              </>
            ) : (
              <>
                {isEditing ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Update Student</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add Student</span>
                  </>
                )}
              </>
            )}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full py-2 px-4 rounded-xl text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition-colors cursor-pointer"
            >
              Cancel Edit
            </button>
          )}

          {!isEditing && (formData.firstname || formData.lastname || formData.course || formData.section) && (
            <button
              type="button"
              onClick={resetForm}
              className="w-full py-1.5 px-3 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Clear Fields
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
