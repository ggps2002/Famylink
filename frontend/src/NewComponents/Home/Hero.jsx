import React from "react";
import Button from "../Button";
import ZipInput from "../ZipInput";

function Hero() {
  return (
    <div className="Livvic container h-screen">
      <header>
        <div className="flex justify-between items-center py-2">
          <div className="flex gap-1 items-center">
            <img src="/logo.svg" alt="logo" />
            <p className="font-bold text-xl Livvic-Bold text-white">
              FamilyLink
            </p>
          </div>
          <div className="flex gap-4">
            <Button btnText="Log in" className="text-white"/>
            <Button btnText={"Join now"} className="bg-[#AEC4FF]"/>
          </div>
        </div>
      </header>
      <div className="mt-32">
        <h1 className="Livvic-Bold text-6xl text-white leading-[80px]">
          Find the Right Childcare—
          <br />
          Without the Guesswork
        </h1>
        <h2 className="Livvic text-[#FFFFFF99] text-xl">
          Smart matching for nannies, tutors, coaches, and everything your
          family needs.
        </h2>
        <div className="flex gap-4 mt-7">
          <ZipInput />
          <Button btnText="Find a Match" className="bg-[#AEC4FF]"/>
        </div>
      </div>
    </div>
  );
}

export default Hero;
