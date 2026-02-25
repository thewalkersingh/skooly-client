import brandsData from "./brandsData.js";
import { Link } from "react-router-dom";

const Brands = () => {
  return (
     <section className="pt-16">
       <div className="container">
         <div className="-mx-4 flex flex-wrap">
           <div className="w-full px-4">
             <div className="flex flex-wrap items-center justify-center rounded-sm
             bg-gray-light px-8 py-8 dark:bg-gray-dark sm:px-10 md:px-[50px] md:py-[40px] xl:p-[50px]
             2xl:px-[70px] 2xl:py-[60px]">
               {brandsData.map((brand) => (
                  <SingleBrand key={brand.id} brand={brand}/>
               ))}
             </div>
           </div>
         </div>
       </div>
     </section>
  );
};
export default Brands;

const SingleBrand = ({ brand }) => {
  const { href, image, imageLight, name } = brand;
  return (
     <div className="flex w-1/2 items-center justify-center px-3 py-[15px] sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6">
       <Link
          to={href}
          target="_blank"
          rel="nofollow noreferrer"
          className="relative h-10 w-full opacity-70 transition hover:opacity-100 dark:opacity-60
          dark:hover:opacity-100"
       >
         <img src={imageLight}
              alt={name}
              className="mx-auto max-w-full drop-shadow-three hidden dark:block dark:drop-shadow-none lg:mr-0"/>
         <img src={image}
              alt={name}
              className="mx-auto max-w-full drop-shadow-three block dark:hidden dark:drop-shadow-none lg:mr-0"/>
       </Link>
     </div>
  );
};