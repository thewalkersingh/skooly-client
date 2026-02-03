import ScrollUp from "../components/Common/ScrollUp.jsx";
import AboutSectionOne from "../components/About/AboutSectionOne.jsx";
import Features from "../components/Features/Features.jsx";
import Hero from "../components/Hero/Hero.jsx";
import Brands from "../components/Brands/Brands";
import AboutSectionTwo from "../components/About/AboutSectionTwo.jsx";
import Testimonials from "../components/Testimonials/Testimonials.jsx";
import Pricing from "../components/Pricing/Pricing.jsx";
import Blog from "./blog/BlogPage.jsx";
import Contact from "../components/Contact/Contact.jsx";
import Video from "../components/Video/Video";

export default function Home () {
  return (
     <div
        style={{
          maxWidth: "1280px", // Tailwind max-w-7xl
          margin: "0 auto",   // Tailwind mx-auto
        }}
     >
       <ScrollUp/>
       <Hero/>
       <Features/>
       <Video/>
       <Brands/>
       <AboutSectionOne/>
       <AboutSectionTwo/>
       <Testimonials/>
       <Pricing/>
       <Blog/>
       <Contact/>
     </div>
  );
}