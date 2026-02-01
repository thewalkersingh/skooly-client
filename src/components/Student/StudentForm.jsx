import React, {useEffect, useState} from 'react';
import {createStudent, fetchStudents, updateStudent} from '../../services/studentService';
import {useNavigate, useParams} from 'react-router-dom';
import '../../styles/forms.css';
import '../../styles/buttons.css';

export default function StudentForm() {
  const {id} = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  
  // Define the fields reflecting your StudentDTO structure
  const [form, setForm] = useState({
    admissionNumber: '',
    firstName: '',
    lastName: '',
    age: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (isEdit) {
      // Ideally, you would have a dedicated endpoint to fetch a student by id.
      // For simplicity, we are reusing fetchStudents and filtering.
      fetchStudents().then((students) => {
        const student = students.find(s => s.id.toString() === id);
        if (student) {
          setForm({
            admissionNumber: student.admissionNumber || '',
            firstName: student.firstName || '',
            lastName: student.lastName || '',
            age: student.age || '',
            phone: student.phone || '',
            email: student.email || '',
            address: student.address || '',
            city: student.city || '',
            state: student.state || '',
            zip: student.zip || '',
            country: student.country || ''
          });
        } else {
          setError('Student not found');
        }
      });
    }
  }, [id, isEdit]);
  
  const handleChange = e => {
    const {name, value} = e.target;
    setForm(prev => ({...prev, [name]: value}));
  };
  
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateStudent(id, form);
      } else {
        await createStudent(form);
      }
      navigate('/students');
    } catch (err) {
      setError('Error saving student data: ' + err);
    }
  };
  
  return (
    <div className="form-container">
      <h2>{isEdit ? 'Edit Student' : 'Add New Student'}</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Admission Number:</label>
          <input type="text" name="admissionNumber" value={form.admissionNumber} onChange={handleChange} required/>
        </div>
        
        <div className="form-group">
          <label>First Name:</label>
          <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required/>
        </div>
        
        <div className="form-group">
          <label>Last Name:</label>
          <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required/>
        </div>
        
        <div className="form-group">
          <label>Phone:</label>
          <input type="number" name="phone" value={form.phone} onChange={handleChange} required/>
        </div>
        
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required/>
        </div>
        
        <div className="form-group">
          <label>Age:</label>
          <input type="number" name="age" value={form.age} onChange={handleChange} required/>
        </div>
        
        <div className="form-group">
          <label>Address:</label>
          <input type="text" name="address" value={form.address} onChange={handleChange}/>
        </div>
        
        <div className="form-group">
          <label>City:</label>
          <input type="text" name="city" value={form.city} onChange={handleChange} required/>
        </div>
        
        <div className="form-group">
          <label>State:</label>
          <input type="text" name="state" value={form.state} onChange={handleChange} required/>
        </div>
        
        <div className="form-group">
          <label>Zip:</label>
          <input type="text" name="zip" value={form.zip} onChange={handleChange} required/>
        </div>
        
        <div className="form-group">
          <label>Country:</label>
          <input type="text" name="country" value={form.country} onChange={handleChange} required/>
        </div>
        
        <button type="submit" className="btn btn-success submit-btn">
          {isEdit ? 'Update Student' : 'Add Student'}
        </button>
      </form>
    </div>
  );
}