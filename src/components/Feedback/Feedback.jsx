import React, {useState} from 'react';
import './feedback.css';

const Feedback = () => {
  // State to manage form input values
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback: ''
  });
  
  // Handle form input changes and update state
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();  // Prevent default form submission behavior
    console.log(formData);  // Log form data (could be sent to an API)
    alert('Thank you for your Feedback!');  // Notify user of form submission
  };
  
  return (
    <div className="feedback-form-container">
      <h2>We'd Love Your Feedback</h2>
      <form className="feedback-form" onSubmit={handleSubmit}>
        {/* Input field for name */}
        <div className="form-field">
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            required  // Make field required
          />
        </div>
        
        {/* Input field for email */}
        <div className="form-field">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            required  // Make field required
          />
        </div>
        
        {/* Textarea for Feedback */}
        <div className="form-field">
                    <textarea
                      id="feedback"
                      name="feedback"
                      value={formData.feedback}
                      onChange={handleChange}
                      placeholder="Your Feedback"
                      required  // Make field required
                    />
        </div>
        
        {/* Submit button */}
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default Feedback;