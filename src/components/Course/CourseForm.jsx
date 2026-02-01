import React, {useEffect, useState} from 'react';
import {
  createCourse,
  fetchCourseById,
  fetchStudents,
  fetchTeachers,
  updateCourse
} from '../../services/courseService';
import {useNavigate, useParams} from 'react-router-dom';
import '../../styles/forms.css';
import '../../styles/buttons.css';

export default function CourseForm() {
  const {id} = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    courseCode: '',
    name: '',
    description: '',
    schedule: '',
    teacherId: '',
    studentIds: []
  });
  
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadTeachersAndStudents();
    if (isEdit) loadCourseDetails();
  }, []);
  
  const loadTeachersAndStudents = async () => {
    try {
      const teachersData = await fetchTeachers();
      setTeachers(teachersData);  // ✅ Ensure state is set correctly
      const studentsData = await fetchStudents();
      setStudents(studentsData);
    } catch (err) {
      setError("Failed to load teachers or students " + err);
    }
  };
  
  const loadCourseDetails = async () => {
    try {
      const course = await fetchCourseById(id);
      setForm(course);
    } catch (err) {
      setError('Course not found ' + err);
    }
  };
  
  const handleChange = (e) => {
    const {name, value} = e.target;
    setForm(prev => ({...prev, [name]: value}));
  };
  
  const handleStudentSelection = (studentId) => {
    setForm(prev => ({
      ...prev,
      studentIds: prev.studentIds.includes(studentId)
        ? prev.studentIds.filter(id => id !== studentId)
        : [...prev.studentIds, studentId]
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateCourse(id, form);
      } else {
        await createCourse(form);
      }
      navigate('/courses');
    } catch (err) {
      setError('Error saving course data ' + err);
    }
  };
  
  return (
    <div className="form-container">
      <h2>{isEdit ? 'Edit Course' : 'Add New Course'}</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Course Code:</label>
          <input type="text" name="courseCode" value={form.courseCode} onChange={handleChange} required/>
        </div>
        <div className="form-group">
          <label>Course Name:</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required/>
        </div>
        <div className="form-group">
          <label>Teacher:</label>
          <select name="teacherId" value={form.teacherId} onChange={handleChange} required>
            <option value="">Select Teacher</option>
            {teachers.length > 0 ? (
              teachers.map(teacher => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.firstName} {teacher.lastName}
                </option>
              ))
            ) : (
              <option disabled>No teachers available</option>
            )}
          </select>
        </div>
        <div className="form-group">
          <label>Students Enrolled:</label>
          {students.map(student => (
            <div key={student.id}>
              <input
                type="checkbox"
                checked={form.studentIds.includes(student.id)}
                onChange={() => handleStudentSelection(student.id)}
              /> {student.firstName} {student.lastName}
            </div>
          ))}
        </div>
        <button type="submit" className="btn btn-success">{isEdit ? 'Update Course' : 'Add Course'}</button>
      </form>
    </div>
  );
}