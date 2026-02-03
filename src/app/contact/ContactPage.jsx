import Breadcrumb from "../../components/Common/Breadcrumb.jsx"
import { Contact } from "../../pages/landingPage/contact.jsx"

const ContactPage = () => {
  return (
     <>
       <Breadcrumb
          pageName="Contact Page"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. In varius eros eget sapien
          consectetur ultrices. Ut quis dapibus libero."
       />
       
       <Contact/>
     </>
  )
}

export default ContactPage