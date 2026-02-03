import './landingpage.css'; // Import CSS for styling
import FAQ from "../../components/Faq/FAQ.jsx";
import Feedback from "../../components/Feedback/Feedback.jsx";
import {Hero} from "../../components/Hero/Hero.jsx";
import {Header} from "./header.jsx";
import {Features} from "./features.jsx";
import {About} from "./about.jsx";
import {Services} from "./services.jsx";
import {Gallery} from "./gallery.jsx";
import {Testimonials} from "./testimonials.jsx";
import {Team} from "./Team.jsx";
import {Contact} from "./contact.jsx";
import {useEffect, useState} from "react";
import JsonData from "../../data/data.json";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});
const LandingPage = () => {
  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);
  return (
    <div className='landing_page'>
      {/* Render Hero component */}
      <Hero/>
      <hr/>
      
      {/* Render Features and FAQ components */}
      <FAQ/>
      
      
      <Header data={landingPageData.Header}/>
      <Features data={landingPageData.Features}/>
      <About data={landingPageData.About}/>
      <Services data={landingPageData.Services}/>
      <Gallery data={landingPageData.Gallery}/>
      <Testimonials data={landingPageData.Testimonials}/>
      <Team data={landingPageData.Team}/>
      <Contact data={landingPageData.Contact}/>
      
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