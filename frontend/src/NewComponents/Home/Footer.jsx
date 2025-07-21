import React from "react";

function Footer() {
  return (
    <div className="relative pt-[34px] lg:pt-[127.5px]">
      {/* Top Curve */}
      <svg
        className="absolute top-0 left-0 w-full transform scale-y-[-1]"
        viewBox="0 0 1440 120"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path fill="#001243" d="M0,0 C360,100 1080,100 1440,0" />
      </svg>
      {/* Footer content */}
      <div className="relative pt-6 sm:pt-8 lg:pt-12 z-10 bg-[#001243] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-18 lg:py-24">
          <div className="flex flex-col lg:flex-row lg:flex-wrap lg:justify-between items-start gap-8 lg:gap-0">
            <div className="w-full lg:w-auto lg:max-w-sm">
              <div className="flex gap-1 items-center">
                <img src="/logo.svg" alt="logo" />
                <p className="font-bold text-3xl Livvic-Bold text-white">
                  FamilyLink
                </p>
              </div>
              <p className="Livvic-Medium text-md text-[#FFFFFFCC] mt-6 leading-[24px]">
                Connecting families with trusted caregivers
                <br /> and building a supportive community.
              </p>
              <div className="flex gap-4 mt-6">
                <img src="/icons/Socials/facebook-icon.svg" alt="facebook" />
                <img src="/icons/Socials/twitter-icon.svg" alt="twitter" />
                <img src="/icons/Socials/instagram-icon.svg" alt="instagram" />
                <img src="/icons/Socials/youtube-icon.svg" alt="youtube" />
              </div>
            </div>
            <div className="w-full sm:w-auto">
              <p className="no-underline Livvic-SemiBold text-lg leading-[18px]">
                Links
              </p>
              <ul className="mt-4 flex flex-col gap-4">
                <li>
                  <a href="#" className="Livvic-Medium text-md underline">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="Livvic-Medium text-md underline">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#" className="Livvic-Medium text-md underline">
                    For Job Seekers
                  </a>
                </li>
                <li>
                  <a href="#" className="Livvic-Medium text-md underline">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="Livvic-Medium text-md underline">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="Livvic-Medium text-md underline">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div className="w-full sm:w-auto">
              <p className="no-underline Livvic-SemiBold text-lg leading-[18px]">
                Contact
              </p>
              <ul className="mt-4 flex flex-col gap-4">
                <li className="Livvic-Medium text-md underline">
                  + (000) 123456789
                </li>
                <li className="Livvic-Medium text-md underline">
                  A-1, Ipsum HQ, Lorem
                </li>
                <li className="Livvic-Medium text-md underline">
                  Info@famylink.us
                </li>
              </ul>
            </div>
            <div className="w-full lg:w-auto lg:max-w-sm">
              <p className="Livvic-SemiBold text-lg leading-[30px]">
                Stay in the loop—get helpful
                <br /> childcare tips and platform updates.
              </p>
              <div className="flex mt-6 focus-within:ring-2 focus-within:ring-[#4f7eff] rounded-md transition duration-200">
                <input
                  type="email"
                  placeholder="Enter your Email"
                  className="bg-[#152D6F] text-[#FFFFFF] border-none flex-1 pl-6 py-2 rounded-l-md Livvic focus:outline-none"
                />
                <div className="p-1 w-fit bg-[#152D6F] rounded-r-md">
                  <button className="bg-[#AEC4FF] rounded-[6px] flex justify-center items-center">
                    <img src="/arrow-right.svg" alt="arrow-right" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <hr className="mt-8 sm:mt-10 lg:mt-12 h-px bg-[#FFFFFF33] border-0" />
          <div className="flex flex-col sm:flex-row justify-between mt-6 sm:mt-8 mb-6 sm:mb-8 lg:mb-12 gap-4 sm:gap-0">
            <p className="Livvic-Medium text-md text-[#FFFFFFCC]">
              © Familylink 2025 - All rights reserved
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <p className="Livvic-Medium text-md text-[#FFFFFFCC] cursor-pointer">
                Help & Feedback
              </p>
              <p className="text-[#FFFFFFCC]">|</p>
              <p className="Livvic-Medium text-md text-[#FFFFFFCC] cursor-pointer">
                Privacy Policy
              </p>
              <p className="text-[#FFFFFFCC]">|</p>
              <p className="Livvic-Medium text-md text-[#FFFFFFCC] cursor-pointer">
                Terms & Conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;