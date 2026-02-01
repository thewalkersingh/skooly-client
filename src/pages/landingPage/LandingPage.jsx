import './landingpage.css'; // Import CSS for styling
import Hero from "../../components/Hero/Hero.jsx";
import FAQ from "../../components/Faq/FAQ.jsx";
import Feedback from "../../components/Feedback/Feedback.jsx";

const LandingPage = () => {
  
  return (
    <div className='landing_page'>
      {/* Render Hero component */}
      <Hero/>
      <hr/>
      
      {/* Render Features and FAQ components */}
      <FAQ/>
      
      {/* Feedback section with image */}
      <div className='feedback_container'>
        <Feedback/>
        <img
          src="/511c801d-9fa9-4664-88a9-67c63e91493f.png"
          alt="Feedback"
        />
      </div>
    </div>
  );
}

export default LandingPage;