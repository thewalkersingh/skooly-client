import React, {useEffect, useState} from 'react';
import {deleteCourse, fetchCourses} from '../../services/courseService';
import {Link} from 'react-router-dom';
import '../../styles/tables.css';
import '../../styles/buttons.css';

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadCourses();
  }, []);
  
  const loadCourses = async () => {
    try {
      const data = await fetchCourses();
      setCourses(data);
    } catch (err) {
      setError('Failed to load courses ' + err);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await deleteCourse(id);
      loadCourses();
    } catch (err) {
      alert('Error deleting course ' + err);
    }
  };
  
  if (error) return <p>{error}</p>;
  
  return (
    <div className="table-container">
      <h2>Courses</h2>
      <Link to="/courses/new">
        <button className="btn btn-primary">Add New Course</button>
      </Link>
      <table>
        <thead>
        <tr>
          <th>Course Code</th>
          <th>Name</th>
          <th>Teacher</th>
          <th>Students Enrolled</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {courses.map(course => (
          <tr key={course.id}>
            <td>{course.courseCode}</td>
            <td>{course.name}</td>
            <td>{course.teacherId ? `Teacher ID: ${course.teacherId}` : 'Unassigned'}</td>
            <td>{course.studentIds?.length || 0}</td>
            <td>
              <Link to={`/courses/${course.id}/edit`}>
                <button className="btn btn-success">Edit</button>
              </Link>
              <button className="btn btn-danger" onClick={() => handleDelete(course.id)}>
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