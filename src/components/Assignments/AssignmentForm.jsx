// src/components/Assignments/AssignmentForm.jsx
import React, {useState} from 'react';
import {createAssignment} from '../../services/assignmentService';

export default function AssignmentForm() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    courseId: '', // Provide a course selection if needed
  });
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    const {name, value} = e.target;
    setForm((prev) => ({...prev, [name]: value}));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAssignment(form);
      alert('Assignment created successfully!');
      setForm({title: '', description: '', dueDate: '', courseId: ''});
    } catch (err) {
      setError('Error creating assignment');
    }
  };
  
  return (
    <div className="assignment-form">
      <h2>Create Assignment</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title: </label>
          <input type="text" name="title" value={form.title} onChange={handleChange} required/>
        </div>
        <div>
          <label>Description: </label>
          <textarea name="description" value={form.description} onChange={handleChange}/>
        </div>
        <div>
          <label>Due Date: </label>
          <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} required/>
        </div>
        <div>
          <label>Course ID: </label>
          <input type="text" name="courseId" value={form.courseId} onChange={handleChange} required/>
        </div>
        <button type="submit">Create Assignment</button>
      </form>
    </div>
  );
}