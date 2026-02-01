// src/components/Submissions/SubmissionForm.jsx
import React, {useState} from 'react';
import {createSubmission} from '../../services/submissionService';

export default function SubmissionForm() {
  const [form, setForm] = useState({
    assignmentId: '',
    studentId: '',
    fileUrl: '',
  });
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    const {name, value} = e.target;
    setForm((prev) => ({...prev, [name]: value}));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSubmission(form);
      alert('Assignment submitted successfully!');
      setForm({assignmentId: '', studentId: '', fileUrl: ''});
    } catch (err) {
      setError('Error submitting assignment');
    }
  };
  
  return (
    <div className="submission-form">
      <h2>Submit Assignment</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Assignment ID: </label>
          <input type="text" name="assignmentId" value={form.assignmentId} onChange={handleChange} required/>
        </div>
        <div>
          <label>Student ID: </label>
          <input type="text" name="studentId" value={form.studentId} onChange={handleChange} required/>
        </div>
        <div>
          <label>File URL: </label>
          <input type="text" name="fileUrl" value={form.fileUrl} onChange={handleChange} required/>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}