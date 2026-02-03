import React, { useEffect, useState } from "react"
import "./Header.css"
import ThemeToggler from "./ThemeToggler.jsx"
import menuData from "./menuData.jsx"

const Header = () => {
  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false)
  const navbarToggleHandler = () => setNavbarOpen(!navbarOpen)
  
  // Sticky Navbar
  const [sticky, setSticky] = useState(false)
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true)
    } else {
      setSticky(false)
    }
  }
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar)
  }, [])
  
  // Submenu handler
  const [openIndex, setOpenIndex] = useState(-1)
  const handleSubmenu = (index) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }
  
  return (
     <header className={`header ${sticky ? "sticky" : ""}`}>
       <div className="header-container">
         <div className="header-row">
           {/* Logo */}
           <div className="header-logo">
             <a href="/">
               <img
                  src="/images/logo/logo-2.svg"
                  alt="logo"
                  className="light-mode"
                  width={140}
                  height={30}
               />
               <img
                  src="/images/logo/logo.svg"
                  alt="logo"
                  className="dark-mode"
                  width={140}
                  height={30}
               />
             </a>
           </div>
           
           {/* Navbar */}
           <div className="header-nav">
             <button
                onClick={navbarToggleHandler}
                aria-label="Mobile Menu"
                className="navbar-toggler"
             >
               <span className={`bar ${navbarOpen ? "open-top" : ""}`}/>
               <span className={`bar ${navbarOpen ? "hidden" : ""}`}/>
               <span className={`bar ${navbarOpen ? "open-bottom" : ""}`}/>
             </button>
             
             <nav className={`navbar ${navbarOpen ? "open" : ""}`}>
               <ul className="navbar-list">
                 {menuData.map((menuItem, index) => (
                    <li key={index} className="navbar-item">
                      {menuItem.path ? (
                         <a
                            href={menuItem.path}
                            className="navbar-link"
                         >
                           {menuItem.title}
                         </a>
                      ) : (
                         <>
                           <p
                              onClick={() => handleSubmenu(index)}
                              className="navbar-link submenu-toggle"
                           >
                             {menuItem.title}
                             <span className="submenu-arrow">
                            <svg width="25" height="24" viewBox="0 0 25 24">
                              <path
                                 fillRule="evenodd"
                                 clipRule="evenodd"
                                 d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z"
                                 fill="currentColor"
                              />
                            </svg>
                          </span>
                           </p>
                           <div
                              className={`submenu ${openIndex === index ? "open" : ""}`}
                           >
                             {menuItem.submenu.map((submenuItem, subIndex) => (
                                <a
                                   href={submenuItem.path}
                                   key={subIndex}
                                   className="submenu-link"
                                >
                                  {submenuItem.title}
                                </a>
                             ))}
                           </div>
                         </>
                      )}
                    </li>
                 ))}
               </ul>
             </nav>
           </div>
           
           {/* Right side buttons */}
           <div className="header-actions">
             <a href="/signin" className="signin-btn">Sign In</a>
             <a href="/signup" className="signup-btn">Sign Up</a>
             <ThemeToggler/>
           </div>
         </div>
       </div>
     </header>
  )
}

export default Header