import React from "react"
import "./SigninPage.css"

const SigninPage = () => {
  return (
     <section className="signin-section">
       <div className="signin-container">
         <div className="signin-row">
           <div className="signin-col">
             <div className="signin-box">
               <h3 className="signin-title">Sign in to your account</h3>
               <p className="signin-subtitle">Login to your account for a faster checkout.</p>
               
               {/* Google button */}
               <button className="signin-btn">
                <span className="btn-icon">
                  {/* Keep SVG here */}
                </span>
                 Sign in with Google
               </button>
               
               {/* Github button */}
               <button className="signin-btn">
                <span className="btn-icon">
                  {/* Keep SVG here */}
                </span>
                 Sign in with Github
               </button>
               
               <div className="divider">
                 <span className="divider-line"></span>
                 <p>Or, sign in with your email</p>
                 <span className="divider-line"></span>
               </div>
               
               {/* Form */}
               <form>
                 <div className="form-group">
                   <label htmlFor="email">Your Email</label>
                   <input type="email" name="email" placeholder="Enter your Email"/>
                 </div>
                 
                 <div className="form-group">
                   <label htmlFor="password">Your Password</label>
                   <input type="password" name="password" placeholder="Enter your Password"/>
                 </div>
                 
                 <div className="form-check">
                   <label htmlFor="checkboxLabel">
                     <input type="checkbox" id="checkboxLabel"/>
                     Keep me signed in
                   </label>
                   <a href="#0" className="forgot-link">Forgot Password?</a>
                 </div>
                 
                 <div className="form-submit">
                   <button className="submit-btn">Sign in</button>
                 </div>
               </form>
               
               <p className="signup-text">
                 Don’t you have an account? <a href="/signup">Sign up</a>
               </p>
             </div>
           </div>
         </div>
       </div>
       
       {/* Decorative background */}
       <div className="signin-bg">
         <svg width="1440" height="969" viewBox="0 0 1440 969" fill="none">
           {/* Keep <mask>, <linearGradient>, <defs> here */}
         </svg>
       </div>
     </section>
  )
}

export default SigninPage