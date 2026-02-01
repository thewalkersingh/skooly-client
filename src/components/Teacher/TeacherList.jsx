import React, {useEffect, useState} from 'react';
import {deleteTeacher, fetchTeachers} from '../../services/teacherService';
import {Link} from 'react-router-dom';
import '../../styles/tables.css';
import '../../styles/buttons.css';

export default function TeacherList() {
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadTeachers();
  }, []);
  
  const loadTeachers = async () => {
    try {
      const data = await fetchTeachers();
      setTeachers(data);
    } catch (err) {
      setError('Failed to load teachers: ' + err);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await deleteTeacher(id);
      loadTeachers();
    } catch (err) {
      alert('Error deleting teacher: ' + err);
    }
  };
  
  if (error) return <p>{error}</p>;
  
  return (
    <div className="table-container">
      <h2>Teachers</h2>
      <Link to="/teachers/new">
        <button className="btn btn-primary">Add New Teacher</button>
      </Link>
      <table>
        <thead>
        <tr>
          <th> Name</th>
          <th>Email</th>
          <th>Number</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {teachers.map(teacher => (
          <tr key={teacher.id}>
            <td>{teacher.name}</td>
            <td>{teacher.email}</td>
            <td>{teacher.phone}</td>
            <td>
              <Link to={`/teachers/${teacher.id}/edit`}>
                <button className="btn btn-success">Edit</button>
              </Link>
              <button className="btn btn-danger" onClick={() => handleDelete(teacher.id)}>
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