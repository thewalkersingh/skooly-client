import React, {useEffect, useState} from 'react';
import {createSchool, fetchSchools, updateSchool} from '../../services/schoolService';
import {useNavigate, useParams} from 'react-router-dom';
import '../../styles/forms.css';
import '../../styles/buttons.css';

export default function SchoolForm() {
  const {id} = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    name: '',
    address: '',
    contactNumber: '',
    email: '',
    schoolType: '',
    studentCount: ''
  });
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (isEdit) {
      fetchSchools().then((list) => {
        const s = list.find((x) => x.id.toString() === id);
        if (s) setForm(s);
        else setError('School not found');
      });
    }
  }, [id, isEdit]);
  
  const handleChange = (e) => {
    const {name, value} = e.target;
    setForm((prev) => ({...prev, [name]: value}));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) await updateSchool(id, form);
      else await createSchool(form);
      navigate('/schools');
    } catch (e) {
      setError('Save failed ' + e);
    }
  };
  
  return (
    <div className="form-container">
      <h2>{isEdit ? 'Edit School' : 'Add School'}</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        {[
          ['name', 'Name'],
          ['address', 'Address'],
          ['contactNumber', 'Contact Number'],
          ['email', 'Email'],
          ['schoolType', 'School Type'],
          ['studentCount', 'Student Count']
        ].map(([field, label]) => (
          <div key={field} className="form-group">
            <label>{label}:</label>
            <input
              name={field}
              value={form[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit" className="btn btn-success submit-btn">
          {isEdit ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
}