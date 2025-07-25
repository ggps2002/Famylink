import React from "react";
import Hero from "./Hero";
import Services from "./Services";
import CaregiverPreview from "./CaregiverPreview";
import Metrics from "./Metrics";
import NannyShare from "./NannyShare";
import Community from "./Community";
import Featurres from "./Features";
import Testimonial from "./Testimonial";
import FAQ from "./FAQ";
import Footer from "../Footer/Footer";

function NewHome() {
  return (
    <>
      <div className="relative bg-[url('/Hero.jpg')] bg-cover bg-center h-screen">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

        {/* Content */}
        <div className="relative z-10">
          <Hero />
        </div>

        {/* Bottom Curve */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#F6F3EE"
            d="M0,0 C360,120 1080,120 1440,0 L1440,120 L0,120 Z"
          />
        </svg>
      </div>
      <div className="bg-[#F6F3EE] py-12">
        <Services />
      </div>
      <CaregiverPreview />
      <div className="bg-[#F6F3EE] py-12 mb-8">
        <Metrics />
      </div>
      <NannyShare />
      <div className="bg-[#E7FCFF] py-24">
        <Community />
      </div>
      <Featurres />
      <div className="bg-[#F6F3EE] py-24">
        <Testimonial />
      </div>
      <FAQ />
    </>
  );
}

export default NewHome;
