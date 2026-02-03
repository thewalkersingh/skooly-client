import React from "react"
import "./SignupPage.css"

const SignupPage = () => {
  return (
     <section className="signup-section">
       <div className="signup-container">
         <div className="signup-row">
           <div className="signup-col">
             <div className="signup-box">
               <h3 className="signup-title">Create your account</h3>
               <p className="signup-subtitle">It’s totally free and super easy</p>
               
               {/* Google button */}
               <button className="signup-btn">
                <span className="btn-icon">
                  {/* Keep SVG here */}
                </span>
                 Sign in with Google
               </button>
               
               {/* Github button */}
               <button className="signup-btn">
                <span className="btn-icon">
                  {/* Keep SVG here */}
                </span>
                 Sign in with Github
               </button>
               
               <div className="divider">
                 <span className="divider-line"></span>
                 <p>Or, register with your email</p>
                 <span className="divider-line"></span>
               </div>
               
               {/* Form */}
               <form>
                 <div className="form-group">
                   <label htmlFor="name">Full Name</label>
                   <input type="text" name="name" placeholder="Enter your full name"/>
                 </div>
                 
                 <div className="form-group">
                   <label htmlFor="email">Work Email</label>
                   <input type="email" name="email" placeholder="Enter your Email"/>
                 </div>
                 
                 <div className="form-group">
                   <label htmlFor="password">Your Password</label>
                   <input type="password" name="password" placeholder="Enter your Password"/>
                 </div>
                 
                 <div className="form-check">
                   <label htmlFor="checkboxLabel">
                     <input type="checkbox" id="checkboxLabel"/>
                     <span>
                      By creating account means you agree to the{" "}
                       <a href="#0">Terms and Conditions</a>, and our{" "}
                       <a href="#0">Privacy Policy</a>
                    </span>
                   </label>
                 </div>
                 
                 <div className="form-submit">
                   <button className="submit-btn">Sign up</button>
                 </div>
               </form>
               
               <p className="signin-text">
                 Already using Startup? <a href="/signin">Sign in</a>
               </p>
             </div>
           </div>
         </div>
       </div>
       
       {/* Decorative background */}
       <div className="signup-bg">
         <svg width="1440" height="969" viewBox="0 0 1440 969" fill="none">
           {/* Keep <mask>, <linearGradient>, <defs> here */}
         </svg>
       </div>
     </section>
  )
}

export default SignupPage