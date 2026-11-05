import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import StudentForm from './components/StudentForm.jsx';
import StudentTable from './components/StudentTable.jsx';
import Toast from './components/Toast.jsx';
import { studentService } from './services/studentService.js';

export default function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [alert, setAlert] = useState(null);

  // Trigger alert banner with auto-dismiss after 6 seconds
  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert((curr) => (curr?.message === message ? null : curr));
    }, 6000);
  };

  // Fetch all students from the API
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await studentService.getAll();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load students:', err);
      const isNetworkErr = err.message === 'Failed to fetch' || err.message.includes('NetworkError');
      const helpfulMsg = isNetworkErr
        ? `Could not reach backend at ${studentService.getCurrentEndpoint()}. Note: Render free tier services sleep when idle and take ~45–60s to wake up on first load. You can also click "API Config" in the top bar to verify or update the backend URL.`
        : `API Error: ${err.message}`;
      showAlert('error', helpfulMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle Create or Update from the inline form
  const handleSaveStudent = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingStudent) {
        // UPDATE student
        const updated = await studentService.update(editingStudent.id, formData);
        showAlert('success', `Student #${editingStudent.id} (${updated.firstname} ${updated.lastname}) updated successfully!`);
        setEditingStudent(null);
      } else {
        // CREATE student
        const created = await studentService.create(formData);
        showAlert('success', `Student (${created.firstname} ${created.lastname}) registered successfully!`);
      }
      await fetchStudents();
      return true;
    } catch (err) {
      console.error('Save failed:', err);
      showAlert('error', `Operation failed: ${err.message}`);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle inline Edit trigger
  const handleEditSelect = (student) => {
    setEditingStudent(student);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle inline Cancel Edit
  const handleCancelEdit = () => {
    setEditingStudent(null);
  };

  // Handle inline Delete
  const handleDeleteStudent = async (id) => {
    try {
      await studentService.delete(id);
      showAlert('success', `Student #${id} deleted successfully.`);
      if (editingStudent?.id === id) {
        setEditingStudent(null);
      }
      await fetchStudents();
    } catch (err) {
      console.error('Delete failed:', err);
      showAlert('error', `Failed to delete student: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        studentCount={students.length}
        onRefresh={fetchStudents}
        loading={loading}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Toast Alert Feedback */}
        <Toast alert={alert} onClose={() => setAlert(null)} />

        {/* Responsive Inline Split View (NO MODAL) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Inline Add/Edit Form Card (4 cols) */}
          <div className="lg:col-span-4">
            <StudentForm
              editingStudent={editingStudent}
              onSave={handleSaveStudent}
              onCancel={handleCancelEdit}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Right Column: Student Directory & Search (8 cols) */}
          <div className="lg:col-span-8">
            <StudentTable
              students={students}
              editingStudent={editingStudent}
              onEdit={handleEditSelect}
              onDelete={handleDeleteStudent}
              loading={loading}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        Student CRUD Frontend &bull; Powered by Vite, React &amp; Tailwind CSS
      </footer>
    </div>
  );
}
