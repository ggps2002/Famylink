import React from "react";
import Button from "../Button";
import ZipInput from "../ZipInput";

function Hero() {
  return (
    <div className="Livvic container h-screen px-4 sm:px-6 lg:px-8">
      <header>
        <div className="flex justify-between items-center py-2 sm:py-4">
          <div className="flex gap-1 items-center">
            <img src="/logo.svg" alt="logo" className="w-6 h-6 sm:w-8 sm:h-8" />
            <p className="font-bold text-lg sm:text-xl Livvic-Bold text-white">
              FamilyLink
            </p>
          </div>
          <div className="flex gap-2 sm:gap-4">
            <Button btnText="Log in" className="text-white text-sm sm:text-base"/>
            <Button btnText={"Join now"} className="bg-[#AEC4FF] text-sm sm:text-base"/>
          </div>
        </div>
      </header>
      <div className="mt-32">
        <h1 className="Livvic-Bold text-4xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight sm:leading-[50px] md:leading-[60px] lg:leading-[80px]">
          Find the Right Childcare—
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          Without the Guesswork
        </h1>
        <h2 className="Livvic text-[#FFFFFF99] text-lg sm:text-xl mt-4 sm:mt-6 max-w-2xl">
          Smart matching for nannies, tutors, coaches, and everything your
          family needs.
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-7 max-w-md sm:max-w-none">
          <div className="flex-1 sm:flex-initial">
            <ZipInput />
          </div>
          <Button btnText="Find a Match" className="bg-[#AEC4FF] w-full sm:w-auto"/>
        </div>
      </div>
    </div>
  );
}

export default Hero;