import React, {useEffect, useState} from 'react';
import {createTeacher, fetchTeachers, updateTeacher} from '../../services/teacherService';
import {useNavigate, useParams} from 'react-router-dom';
import '../../styles/forms.css';
import '../../styles/buttons.css';

export default function TeacherForm() {
  const {id} = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  
  // Initialize the form state based on TeacherDTO structure
  const [form, setForm] = useState({
    employeeCode: '',
    name: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState(null);
  
  // If editing, load the teacher details by filtering from the list (for simplicity)
  useEffect(() => {
    if (isEdit) {
      // Ideally, if you have a getTeacherById endpoint, use that.
      fetchTeachers().then((teachers) => {
        const teacher = teachers.find(t => t.id.toString() === id);
        if (teacher) {
          setForm({
            employeeCode: teacher.employeeCode || '',
            name: teacher.name || '',
            email: teacher.email || '',
            phone: teacher.phone || ''
          });
        } else {
          setError('Teacher not found');
        }
      });
    }
  }, [id, isEdit]);
  
  const handleChange = (e) => {
    const {name, value} = e.target;
    setForm(prev => ({...prev, [name]: value}));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateTeacher(id, form);
      } else {
        await createTeacher(form);
      }
      navigate('/teachers');
    } catch (err) {
      setError('Error saving teacher data ' + err);
    }
  };
  
  return (
    <div className="form-container">
      <h2>{isEdit ? 'Edit Teacher' : 'Add New Teacher'}</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label> Name:</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required/>
        </div>
        
        <div className="form-group">
          <label>Email:</label>
          <input type="text" name="email" value={form.email} onChange={handleChange} required/>
        </div>
        
        <div className="form-group">
          <label>Phone:</label>
          <input type="text" name="phone" value={form.phone} onChange={handleChange} required/>
        </div>
        
        <button type="submit" className="btn btn-success submit-btn">
          {isEdit ? 'Update Teacher' : 'Add Teacher'}
        </button>
      </form>
    </div>
  );
}