import React, {useEffect, useState} from 'react';
import {markAttendance} from '../../services/attendanceService';
import {fetchStudents} from '../../services/studentService';
import '../../styles/forms.css';

export default function MarkAttendance() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    studentId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'PRESENT',
    remarks: '',
  });
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadStudents();
  }, []);
  
  const loadStudents = async () => {
    try {
      const data = await fetchStudents();
      setStudents(data);
    } catch (err) {
      setError('Failed to load students.');
    }
  };
  
  const handleChange = (e) => {
    const {name, value} = e.target;
    setForm(prev => ({...prev, [name]: value}));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await markAttendance(form);
      alert('Attendance marked successfully!');
    } catch (err) {
      setError('Error marking attendance.');
    }
  };
  
  return (
    <div className="form-container">
      <h2>Mark Attendance</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Student:</label>
          <select name="studentId" value={form.studentId} onChange={handleChange} required>
            <option value="">Select Student</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>{student.firstName} {student.lastName}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} required/>
        </div>
        <div className="form-group">
          <label>Status:</label>
          <select name="status" value={form.status} onChange={handleChange} required>
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="LATE">Late</option>
            <option value="EXCUSED">Excused</option>
          </select>
        </div>
        <div className="form-group">
          <label>Remarks (Optional):</label>
          <input type="text" name="remarks" value={form.remarks} onChange={handleChange}/>
        </div>
        <button type="submit" className="btn btn-success">Submit</button>
      </form>
    </div>
  );
}