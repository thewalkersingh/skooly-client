import "./footer.css";
import Social from '../Social/Social.jsx';

const Footer = () => {
  return (
    <div className='footer'>
      {/* Top section of the Footer with a call-to-action */}
      <div className='top_section'>
        <h1 className='poppins-bold'>
          Unlock a New Dimension of School Management <br/>
          Manage Ahead of the Curve!
        </h1>
        <button className='poppins-regular'>Subscribe Now</button>
      </div>
      
      {/* Middle section with company info and navigation links */}
      <div className='middle_section'>
        {/* Left side with branding information */}
        <div className='middle_left_section'>
          <h2>Skooly</h2>
          <p className='poppins-regular'>
            Skooly: Fast, Easy, and Affordable. <br/>
            Your One-Stop App for Managing Your School!
          </p>
        </div>
        
        {/* Right side with links and contact info */}
        <div className='middle_right_section'>
          {/* Links section */}
          <div>
            <p>Links</p>
            <li> About</li>
            <li>Social Media</li>
            <li>Counters</li>
            <li>Contact</li>
          </div>
          {/* Company policies */}
          <div>
            <p>Company</p>
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
            <li>Contact</li>
          </div>
          {/* Contact details */}
          <div>
            <p>Get in Touch</p>
            <li>New Delhi, India 10037</li>
            <li>085-1234567</li>
            <li>info@skooly.net</li>
          </div>
        </div>
      </div>
      
      {/* Bottom section with Social icons and copyright info */}
      <div className='bottom_section'>
        <Social/>
        <p>© 2021 Thewa Tech. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;