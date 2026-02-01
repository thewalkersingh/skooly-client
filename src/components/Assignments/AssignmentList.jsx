// src/components/Assignments/AssignmentList.jsx
import React, {useEffect, useState} from 'react';
import {fetchAssignments} from '../../services/assignmentService';

export default function AssignmentList() {
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadAssignments();
  }, []);
  
  const loadAssignments = async () => {
    try {
      const data = await fetchAssignments();
      setAssignments(data);
    } catch (err) {
      setError('Failed to load assignments.');
    }
  };
  
  return (
    <div className="assignment-list">
      <h2>Assignments</h2>
      {error && <p className="error">{error}</p>}
      <ul>
        {assignments.map((assn) => (
          <li key={assn.id}>
            <h3>{assn.title}</h3>
            <p>{assn.description}</p>
            <p>Due: {assn.dueDate}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}