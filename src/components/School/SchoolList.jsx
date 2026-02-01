import React, {useEffect, useState} from 'react';
import {deleteSchool, fetchSchools} from '../../services/schoolService';
import {Link} from 'react-router-dom';
import '../../styles/buttons.css';
import '../../styles/tables.css';

export default function SchoolList() {
  const [schools, setSchools] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadSchools();
  }, []);
  
  const loadSchools = async () => {
    try {
      const data = await fetchSchools();
      setSchools(data);
    } catch (e) {
      setError('Failed to load schools ' + e);
    }
  };
  
  const handleDelete = async (id) => {
    await deleteSchool(id);
    loadSchools();
  };
  
  if (error) return <p>{error}</p>;
  
  return (
    <div className="table-container">
      <h2>Schools</h2>
      <Link to="/schools/new">
        <button className="btn btn-primary">Add New School</button>
      </Link>
      <table>
        <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Count</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {schools.map((s) => (
          <tr key={s.id}>
            <td>{s.name}</td>
            <td>{s.schoolType}</td>
            <td>{s.studentCount}</td>
            <td>
              <Link to={`/schools/${s.id}/edit`}>
                <button className="btn btn-success">Edit</button>
              </Link>
              <button className="btn btn-danger" onClick={() => handleDelete(s.id)}>
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