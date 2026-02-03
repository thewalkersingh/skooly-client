import SingleBlog from "../../components/Blog/SingleBlog.jsx"
import blogData from "../../components/Blog/blogData.jsx"
import Breadcrumb from "../../components/Common/Breadcrumb.jsx"
import "./BlogPage.css"

const BlogPage = () => {
  return (
     <>
       <Breadcrumb
          pageName="Blog Grid"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. In varius eros eget sapien
          consectetur ultrices. Ut quis dapibus libero."
       />
       
       <section className="blog-section">
         <div className="container">
           <div className="blog-grid">
             {blogData.map((blog) => (
                <div key={blog.id} className="blog-col">
                  <SingleBlog blog={blog}/>
                </div>
             ))}
           </div>
           
           <div className="pagination-wrapper">
             <ul className="pagination">
               <li>
                 <a href="#0" className="page-link">Prev</a>
               </li>
               <li>
                 <a href="#0" className="page-link">1</a>
               </li>
               <li>
                 <a href="#0" className="page-link">2</a>
               </li>
               <li>
                 <a href="#0" className="page-link">3</a>
               </li>
               <li>
                 <span className="page-link disabled">...</span>
               </li>
               <li>
                 <a href="#0" className="page-link">12</a>
               </li>
               <li>
                 <a href="#0" className="page-link">Next</a>
               </li>
             </ul>
           </div>
         </div>
       </section>
     </>
  )
}

export default BlogPage