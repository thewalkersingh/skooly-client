import React from "react"
import "./BlogSidebarPage.css"
import RelatedPost from "../Blog/RelatedPost"
import SharePost from "../Blog/SharePost"
import TagButton from "../Blog/TagButton"
import NewsLatterBox from "../Contact/NewsLatterBox"

const BlogSidebarPage = () => {
  return (
     <section className="blog-sidebar-section">
       <div className="blog-container">
         <div className="blog-row">
           {/* Main content */}
           <div className="blog-main">
             <h1 className="blog-title">
               10 amazing sites to download stock photos & digital assets for free
             </h1>
             
             {/* Meta info */}
             <div className="blog-meta">
               <div className="author-info">
                 <div className="author-avatar">
                   <img src="/images/blog/author-02.png" alt="author"/>
                 </div>
                 <span className="author-name">By Musharof Chy</span>
               </div>
               
               <div className="meta-details">
                 <p className="meta-item">
                   <span className="meta-icon">{/* Keep SVG here */}</span>
                   12 Jan 2024
                 </p>
                 <p className="meta-item">
                   <span className="meta-icon">{/* Keep SVG here */}</span>
                   50
                 </p>
                 <p className="meta-item">
                   <span className="meta-icon">{/* Keep SVG here */}</span>
                   35
                 </p>
               </div>
               
               <div className="tag-badge">
                 <a href="#0">Design</a>
               </div>
             </div>
             
             {/* Blog content */}
             <p className="blog-paragraph">
               Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
               pariatur.
             </p>
             
             <div className="blog-image">
               <img src="/images/blog/blog-details-01.jpg" alt="blog"/>
             </div>
             
             <p className="blog-paragraph">
               Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
               et dolore magna aliqua.
               <strong className="highlight">malesuada</strong> proin libero nunc consequat interdum varius.
             </p>
             
             <p className="blog-paragraph">
               Semper auctor neque vitae tempus quam pellentesque nec.
               <span className="highlight underline">Amet dictum sit amet justo</span> donec enim diam.
             </p>
             
             <h3 className="blog-subtitle">Digital marketplace for Ui/Ux designers.</h3>
             
             <p className="blog-paragraph">
               consectetur adipiscing elit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
             </p>
             
             <ul className="blog-list">
               <li>Consectetur adipiscing elit in voluptate velit.</li>
               <li>Mattis vulputate cupidatat.</li>
               <li>Vulputate enim nulla aliquet porttitor odio pellentesque</li>
               <li>Ligula ullamcorper malesuada proin</li>
             </ul>
             
             {/* Quote box */}
             <div className="quote-box">
               <p>
                 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod incididunt labore et
                 dolore magna aliqua.
               </p>
               <span className="quote-bg">
                <svg width="132" height="109" viewBox="0 0 132 109" fill="none">
                  {/* Keep <linearGradient> and <defs> here */}
                </svg>
              </span>
               <span className="quote-bg">
                <svg width="53" height="30" viewBox="0 0 53 30" fill="none">
                  {/* Keep <mask>, <filter>, <radialGradient> here */}
                </svg>
              </span>
             </div>
             
             {/* Tags + Share */}
             <div className="tags-share">
               <div className="tags">
                 <h4>Popular Tags :</h4>
                 <TagButton text="Design"/>
                 <TagButton text="Development"/>
                 <TagButton text="Info"/>
               </div>
               <div className="share">
                 <h5>Share this post :</h5>
                 <SharePost/>
               </div>
             </div>
           </div>
           
           {/* Sidebar */}
           <div className="blog-sidebar">
             {/* Search box */}
             <div className="sidebar-box">
               <div className="search-box">
                 <input type="text" placeholder="Search here..."/>
                 <button aria-label="search button">
                   {/* Keep SVG here */}
                 </button>
               </div>
             </div>
             
             {/* Related posts */}
             <div className="sidebar-box">
               <h3 className="sidebar-heading">Related Posts</h3>
               <ul>
                 <li><RelatedPost title="Best way to boost your online sales."
                                  image="/images/blog/post-01.jpg"
                                  slug="#"
                                  date="12 Feb 2025"/></li>
                 <li><RelatedPost title="50 Best web design tips & tricks that will help you."
                                  image="/images/blog/post-02.jpg"
                                  slug="#"
                                  date="15 Feb 2024"/></li>
                 <li><RelatedPost title="The 8 best landing page builders, reviewed"
                                  image="/images/blog/post-03.jpg"
                                  slug="#"
                                  date="05 Jun 2024"/></li>
               </ul>
             </div>
             
             {/* Categories */}
             <div className="sidebar-box">
               <h3 className="sidebar-heading">Popular Category</h3>
               <ul>
                 <li><a href="#0">Tailwind Templates</a></li>
                 <li><a href="#0">Landing page</a></li>
                 <li><a href="#0">Startup</a></li>
                 <li><a href="#0">Business</a></li>
                 <li><a href="#0">Multipurpose</a></li>
               </ul>
             </div>
             
             {/* Tags */}
             <div className="sidebar-box">
               <h3 className="sidebar-heading">Popular Tags</h3>
               <div className="tags">
                 <TagButton text="Themes"/>
                 <TagButton text="UI Kit"/>
                 <TagButton text="Tailwind"/>
                 <TagButton text="Startup"/>
                 <TagButton text="Business"/>
               </div>
             </div>
             
             <NewsLatterBox/>
           </div>
         </div>
       </div>
     </section>
  )
}

export default BlogSidebarPage