// ManageTeachers.jsx
import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {deleteTeacher, fetchTeachers} from '../../services/teacherService';
import '../../styles/buttons.css';

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadTeacher();
  }, []);
  const loadTeacher = async () => {
    try {
      const data = await fetchTeachers();
      setTeachers(data);
    } catch (err) {
      setError('Failed to load teachers: ' + err);
    }
  }
  
  return (
    <div>
      <h2>Manage Teachers</h2>
      <table border="1" cellPadding="5">
        <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {teachers.map((teacher) => (
          <tr key={teacher.id}>
            <td>{teacher.id}</td>
            <td>
              {teacher.firstName} {teacher.lastName}
            </td>
            <td>{teacher.email}</td>
            <td>
              <Link to={`/teachers/${teacher.id}/edit`}>
                <button className="btn btn-success">Edit</button>
              </Link>
              <button className="btn btn-danger" onClick={() => deleteTeacher(teacher.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageTeachers;