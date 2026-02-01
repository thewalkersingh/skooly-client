// src/components/Student/StudentList.jsx
import React, {useEffect, useState} from 'react';
import {deleteStudent, fetchStudents} from '../../services/studentService';
import {Link} from 'react-router-dom';
import '../../styles/tables.css';
import '../../styles/buttons.css';

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadStudents();
  }, []);
  
  const loadStudents = async () => {
    try {
      const data = await fetchStudents();
      setStudents(data);
    } catch (err) {
      setError('Failed to load students ' + err);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await deleteStudent(id);
      loadStudents();
    } catch (err) {
      alert('Error deleting student ' + err);
    }
  };
  
  if (error) return <p>{error}</p>;
  
  return (
    <div className="table-container">
      <h2>Students</h2>
      <Link to="/students/new">
        <button className="btn btn-primary">Add New Student</button>
      </Link>
      <table>
        <thead>
        <tr>
          <th>Admission Number:</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>age</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Address</th>
          <th>City</th>
          <th>State</th>
          <th>Zip</th>
          <th>Country</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {students.map(student => (
          <tr key={student.id}>
            <td>{student.admissionNumber}</td>
            <td>{student.firstName}</td>
            <td>{student.lastName}</td>
            <td>{student.age}</td>
            <td>{student.email}</td>
            <td>{student.phone}</td>
            <td>{student.address}</td>
            <td>{student.city}</td>
            <td>{student.state}</td>
            <td>{student.zip}</td>
            <td>{student.country}</td>
            <td>
              <Link to={`/students/${student.id}/edit`}>
                <button className="btn btn-success">Edit</button>
              </Link>
              <button className="btn btn-danger" onClick={() => handleDelete(student.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}