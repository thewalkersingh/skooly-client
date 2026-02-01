// src/components/Attendance/AttendanceList.jsx
import React, {useEffect, useState} from 'react';
import {
  fetchAttendanceByDate,
  fetchAttendanceByStudent,
  fetchAttendanceRecords
} from '../../services/attendanceService';
import {fetchStudents} from '../../services/studentService';
import '../../styles/tables.css';

export default function AttendanceList() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchStudentId, setSearchStudentId] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadAttendanceRecords();
    loadStudents();
  }, []);
  
  const loadAttendanceRecords = async () => {
    try {
      const data = await fetchAttendanceRecords();
      setAttendanceRecords(data);
    } catch (err) {
      setError('Failed to load attendance records.');
    }
  };
  
  const loadStudents = async () => {
    try {
      const data = await fetchStudents();
      setStudents(data);
    } catch (err) {
      setError('Failed to load students.');
    }
  };
  
  const handleSearchByStudent = async () => {
    if (!searchStudentId) return;
    try {
      const data = await fetchAttendanceByStudent(searchStudentId);
      setAttendanceRecords(data);
    } catch (err) {
      setError('Error fetching attendance by student.');
    }
  };
  
  const handleSearchByDate = async () => {
    if (!searchDate) return;
    try {
      const data = await fetchAttendanceByDate(searchDate);
      setAttendanceRecords(data);
    } catch (err) {
      setError('Error fetching attendance by date.');
    }
  };
  
  return (
    <div className="table-container">
      <h2>Attendance Records</h2>
      
      {/* Filters */}
      <div className="filters">
        <div>
          <label>Search by Student:</label>
          <select value={searchStudentId} onChange={(e) => setSearchStudentId(e.target.value)}>
            <option value="">Select Student</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>{student.firstName} {student.lastName}</option>
            ))}
          </select>
          <button onClick={handleSearchByStudent} className="btn btn-primary">Search</button>
        </div>
        
        <div>
          <label>Search by Date:</label>
          <input type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)}/>
          <button onClick={handleSearchByDate} className="btn btn-primary">Search</button>
        </div>
      </div>
      
      {error && <p className="error-message">{error}</p>}
      
      <table>
        <thead>
        <tr>
          <th>Student ID</th>
          <th>Date</th>
          <th>Status</th>
          <th>Remarks</th>
        </tr>
        </thead>
        <tbody>
        {attendanceRecords.map(record => (
          <tr key={record.id}>
            <td>{record.studentId}</td>
            <td>{record.date}</td>
            <td>{record.status}</td>
            <td>{record.remarks || '--'}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}