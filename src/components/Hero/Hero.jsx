import './hero.css';
import Social from '../Social/Social.jsx';

const Hero = () => {
  return (
    <section className='hero_section'>
      {/* Container for the Hero image */}
      <div className="image_container">
        <img src="/schoolBackgroud.png"
             alt="Skooly illustration"/>
      </div>
      
      {/* Background overlay with text and Social links */}
      <div className='blur_bg'>
        <h1>
          Welcome to <span>&#10077; Skooly &#10078;</span>
        </h1>
        <p>
          SwiftShoppers: Fast, Easy, and Affordable. <br/>
          Your One-Stop Shop for Everything!
        </p>
        <button>Book Demo Now</button>
        <Social/>
      </div>
    </section>
  );
};

export default Hero;