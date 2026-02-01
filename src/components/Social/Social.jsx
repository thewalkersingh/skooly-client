import './social.css'; // Import CSS for styling
import {FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter} from 'react-icons/fa'; // Import Social media icons

// Social component to display Social media links
const Social = () => {
  return (
    <div className="social-container"> {/* Container for Social links */}
      {/* Facebook link */}
      <a
        href="https://www.facebook.com"
        target="_blank"
        rel="noopener noreferrer"
        className="social-link facebook"
      >
        <FaFacebookF/> {/* Facebook icon */}
      </a>
      
      {/* Twitter link */}
      <a
        href="https://www.twitter.com"
        target="_blank"
        rel="noopener noreferrer"
        className="social-link twitter"
      >
        <FaTwitter/> {/* Twitter icon */}
      </a>
      
      {/* Instagram link */}
      <a
        href="https://www.instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className="social-link instagram"
      >
        <FaInstagram/> {/* Instagram icon */}
      </a>
      
      {/* LinkedIn link */}
      <a
        href="https://www.linkedin.com"
        target="_blank"
        rel="noopener noreferrer"
        className="social-link linkedin"
      >
        <FaLinkedinIn/> {/* LinkedIn icon */}
      </a>
    </div>
  );
}

export default Social;