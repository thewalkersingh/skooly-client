import React, {useState} from 'react';
import '../../styles/Login.css';

export default function Login() {
  const [form, setForm] = useState({email: '', password: ''});
  
  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login Attempt:', form);
    alert('Login functionality will be added later!');
  };
  
  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required/>
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required/>
        </div>
        <button type="submit" className="btn btn-success submit-btn">Login</button>
      </form>
    </div>
  );
}