import React, {useState} from 'react';
import '../../styles/Login.css';

export default function Signup() {
  const [form, setForm] = useState({name: '', email: '', password: ''});
  
  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signup Attempt:', form);
    alert('Signup functionality will be added later!');
  };
  
  return (
    <div className="form-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required/>
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required/>
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required/>
        </div>
        <button type="submit" className="btn btn-primary submit-btn">Signup</button>
      </form>
    </div>
  );
}