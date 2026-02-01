// src/components/Grades/GradeForm.jsx
import React, {useState} from 'react';
import {submitGrade} from '../../services/gradeService';

export default function GradeForm() {
  const [form, setForm] = useState({
    submissionId: '',
    teacherId: '',
    score: '',
    feedback: '',
  });
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    const {name, value} = e.target;
    setForm((prev) => ({...prev, [name]: value}));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitGrade(form);
      alert('Grading successful!');
      setForm({submissionId: '', teacherId: '', score: '', feedback: ''});
    } catch (err) {
      setError('Error grading assignment');
    }
  };
  
  return (
    <div className="grade-form">
      <h2>Grade Submission</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Submission ID: </label>
          <input type="text" name="submissionId" value={form.submissionId} onChange={handleChange} required/>
        </div>
        <div>
          <label>Teacher ID: </label>
          <input type="text" name="teacherId" value={form.teacherId} onChange={handleChange} required/>
        </div>
        <div>
          <label>Score: </label>
          <input type="number" name="score" value={form.score} onChange={handleChange} required/>
        </div>
        <div>
          <label>Feedback: </label>
          <textarea name="feedback" value={form.feedback} onChange={handleChange}/>
        </div>
        <button type="submit">Submit Grade</button>
      </form>
    </div>
  );
}