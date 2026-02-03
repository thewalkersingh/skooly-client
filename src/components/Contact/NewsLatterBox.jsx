import "./NewsLatterBox.css";
import {useTheme} from "../../app/ThemeProvider";

const NewsLatterBox = () => {
  const {theme} = useTheme();

  return (
     <div className={`newsletter-box ${theme}`}>
       <h3 className="newsletter-title">
         Subscribe to receive future updates
       </h3>

       <p className="newsletter-desc">
         Lorem ipsum dolor sited Sed ullam corper consectur adipiscing Mae ornare
         massa quis lectus.
       </p>

       <div className="newsletter-form">
         <input type="text" placeholder="Enter your name"/>
         <input type="email" placeholder="Enter your email"/>
         <input type="submit" value="Subscribe"/>
         <p className="newsletter-note">
           No spam guaranteed, So please don’t send any spam mail.
         </p>
       </div>

       {/* Decorative SVGs */}
       <span className="shape shape-1">
        <svg width="57" height="65" viewBox="0 0 57 65">
          <path
             opacity="0.5"
             d="M0.407629 15.9573L39.1541 64.0714L56.4489 0.160793L0.407629 15.9573Z"
             fill="url(#grad1)"
          />
          <defs>
            <linearGradient id="grad1">
              <stop offset="0%" className="svg-start"/>
              <stop offset="100%" className="svg-end"/>
            </linearGradient>
          </defs>
        </svg>
      </span>
     </div>
  );
};

export default NewsLatterBox;