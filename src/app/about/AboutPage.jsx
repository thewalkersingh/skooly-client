import Breadcrumb from "../../components/Common/Breadcrumb.jsx"
import AboutSectionOne from "../../components/About/AboutSectionOne"
import AboutSectionTwo from "../../components/About/AboutSectionTwo"

const AboutPage = () => {
  return (
     <>
       <Breadcrumb
          pageName="About Page"
          description="This is about page. We are a School Management App"
       />
       <AboutSectionOne/>
       <AboutSectionTwo/>
     </>
  )
}

export default AboutPage