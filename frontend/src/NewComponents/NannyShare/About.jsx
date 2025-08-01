import React from "react";
import Button from "../Button";
import { NavLink } from "react-router-dom";

function About() {
  return (
   <div className="container Livvic px-4 sm:px-6 lg:px-8 min-h-[550px] mx-auto max-w-7xl">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 lg:gap-12 py-8 lg:py-12">
        <div className="space-y-4 lg:space-y-6 max-w-2xl w-full lg:w-1/2">
          <h1 className="Livvic-Bold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight">
            What Is Nanny Sharing?
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-[#00000099] Livvic-Medium mt-4 sm:mt-6 leading-relaxed">
            Nanny sharing is a childcare setup where two or more families hire a
            single nanny to care for their children together. It's a great way
            to access high-quality, personalized care at a lower cost—while
            giving kids the benefit of social interaction in a home-based
            setting.
          </p>
          <div className="pt-2 lg:pt-4">
            <NavLink to="/joinNow">
              <Button
                btnText={"Join Now"}
                className="bg-[#FFADE1] text-[#3B0025] w-full sm:w-auto px-8 py-4 text-lg font-semibold"
              />
            </NavLink>
          </div>
        </div>
        
        <div className="relative w-full lg:w-1/2 h-[250px] sm:h-[300px] lg:h-[350px] xl:h-[400px]">
          <div className="relative w-full h-full">
            <img
              src="/nanny/nanny-share-about-1.jpg"
              alt="nanny"
              className="absolute top-0 left-0 w-[60%] sm:w-[55%] lg:w-[50%] h-[60%] sm:h-[65%] lg:h-[70%] object-cover z-20 rounded-[15px] sm:rounded-[20px] lg:rounded-[25px]"
            />
            <img
              src="/nanny/nanny-share-about-2.jpg"
              alt="nanny"
              className="absolute bottom-0 right-6 w-[60%] sm:w-[55%] lg:w-[50%] h-[60%] sm:h-[65%] lg:h-[70%] object-cover z-30 rounded-[15px] sm:rounded-[20px] lg:rounded-[25px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
