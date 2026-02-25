import ScrollUp from "../components/Common/ScrollUp";

import Features from "./FeaturesPage.jsx";
import Video from "../components/Video/Video.jsx";
import Hero from "../components/Hero/Hero.jsx";
import Brands from "../components/Brands/Brands.jsx";
import AboutSectionOne from "../components/About/AboutSectionOne.jsx";
import AboutSectionTwo from "../components/About/AboutSectionTwo.jsx";
import Testimonials from "../components/Testimonials/Testimonials.jsx";
import Pricing from "./PricingPage.jsx";
import BlogPage from "./BlogPage.jsx";

const Home = () => {
  return (
     <>
       <ScrollUp/>
       <Hero/>
       <Features/>
       <Video/>
       <Brands/>
       <AboutSectionOne/>
       <AboutSectionTwo/>
       <Testimonials/>
       <Pricing/>
       <BlogPage/>
     
     </>
  );
};

export default Home;