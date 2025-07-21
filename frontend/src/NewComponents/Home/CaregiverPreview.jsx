import React from "react";
import ZipInput from "../ZipInput";
import Button from "../Button";

function CaregiverPreview() {
  return (
    <>
      <div className="container relative Livvic flex justify-center items-center min-h-[400px] sm:min-h-[600px] my-12 sm:my-20">
        {/* Sun decoration - hidden on mobile */}
        <div className="absolute right-0 top-0 hidden sm:block">
          <img src="/icons/Background/Sun.svg" alt="sun" />
        </div>
        
        <div className="text-center">
          <h1 className="Livvic-Bold text-2xl sm:text-5xl sm:leading-[70px] ">
            Find nannies, tutors, babysitters, or house
            <br className="hidden sm:block" /><span className="sm:hidden"> </span>
            managers near you. Search by location to
            <br className="hidden sm:block" /><span className="sm:hidden"> </span>
            get matched faster.
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-12 justify-center">
            <ZipInput border={true} />
            <Button 
              btnText={"Find Care"} 
              className="bg-[#AEC4FF] w-full sm:w-auto" 
            />
            <Button 
              btnText={"Post a Job"} 
              className="bg-[#F6F3EE] w-full sm:w-auto" 
            />
          </div>
        </div>
        
        {/* Rainbow decoration - hidden on mobile */}
        <div className="absolute left-0 -bottom-4 hidden sm:block">
          <img src="/icons/Background/Rainbow.svg" alt="rainbow" />
        </div>
      </div>
    </>
  );
}

export default CaregiverPreview;