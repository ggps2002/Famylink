import React from "react";
import ZipInput from "../ZipInput";
import Button from "../Button";

function CaregiverPreview() {
  return (
    <>
      <div className="container relative Livvic flex justify-center items-center min-h-[600px] my-20">
        <div className="absolute right-0 top-0">
          <img src="/icons/Background/Sun.svg" alt="sun" />
        </div>
        <div>
          <h1 className="Livvic-Bold text-5xl text-center leading-[70px]">
            Find nannies, tutors, babysitters, or house<br/> managers near you.
            Search by location to<br/> get matched faster.
          </h1>
          <div className="flex gap-4 mt-12 justify-center">
            <ZipInput border={true} />
            <Button btnText={"Find Care"} className="bg-[#AEC4FF]" />
            <Button btnText={"Post a Job"} className="bg-[#F6F3EE]" />
          </div>
        </div>
        <div className="absolute left-0 -bottom-4">
          <img src="/icons/Background/Rainbow.svg" alt="rainbow" />
        </div>
      </div>
    </>
  );
}

export default CaregiverPreview;
