import React from "react";

function Footer() {
  return (
    <div className="relative">
      {/* Top Curve */}
      <div className="w-full h-16 sm:h-20 md:h-24 lg:h-28 xl:h-32 overflow-hidden">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path fill="#001243" d="M0,50 C360,0 1080,0 1440,50 L1440,120 L0,120 Z" />
        </svg>
      </div>
      
      {/* Footer content */}
      <div className="bg-[#001243] text-white -mt-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="sm:col-span-2 lg:col-span-1">
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
                <img src="/icons/Socials/facebook-icon.svg" alt="facebook" className="cursor-pointer hover:opacity-80 transition-opacity" />
                <img src="/icons/Socials/twitter-icon.svg" alt="twitter" className="cursor-pointer hover:opacity-80 transition-opacity" />
                <img src="/icons/Socials/instagram-icon.svg" alt="instagram" className="cursor-pointer hover:opacity-80 transition-opacity" />
                <img src="/icons/Socials/youtube-icon.svg" alt="youtube" className="cursor-pointer hover:opacity-80 transition-opacity" />
              </div>
            </div>
            
            {/* Links Section */}
            <div>
              <p className="no-underline Livvic-SemiBold text-lg leading-[18px]">
                Links
              </p>
              <ul className="mt-4 flex flex-col gap-4">
                <li>
                  <a href="#" className="Livvic-Medium text-md underline hover:text-[#AEC4FF] transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="Livvic-Medium text-md underline hover:text-[#AEC4FF] transition-colors">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#" className="Livvic-Medium text-md underline hover:text-[#AEC4FF] transition-colors">
                    For Job Seekers
                  </a>
                </li>
                <li>
                  <a href="#" className="Livvic-Medium text-md underline hover:text-[#AEC4FF] transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="Livvic-Medium text-md underline hover:text-[#AEC4FF] transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="Livvic-Medium text-md underline hover:text-[#AEC4FF] transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Contact Section */}
            <div>
              <p className="no-underline Livvic-SemiBold text-lg leading-[18px]">
                Contact
              </p>
              <ul className="mt-4 flex flex-col gap-4">
                <li className="Livvic-Medium text-md underline hover:text-[#AEC4FF] transition-colors cursor-pointer">
                  + (000) 123456789
                </li>
                <li className="Livvic-Medium text-md underline hover:text-[#AEC4FF] transition-colors cursor-pointer">
                  A-1, Ipsum HQ, Lorem
                </li>
                <li className="Livvic-Medium text-md underline hover:text-[#AEC4FF] transition-colors cursor-pointer">
                  Info@famylink.us
                </li>
              </ul>
            </div>
            
            {/* Newsletter Section */}
            <div>
              <p className="Livvic-SemiBold text-lg leading-[30px]">
                Stay in the loop—get helpful
                <br className="hidden sm:block" /> childcare tips and platform updates.
              </p>
              <div className="flex mt-6 focus-within:ring-2 focus-within:ring-[#4f7eff] rounded-md transition duration-200">
                <input
                  type="email"
                  placeholder="Enter your Email"
                  className="bg-[#152D6F] text-[#FFFFFF] border-none flex-1 pl-6 py-3 rounded-l-md Livvic focus:outline-none placeholder-[#FFFFFF66]"
                />
                <div className="p-1 bg-[#152D6F] rounded-r-md">
                  <button className="bg-[#AEC4FF] p-1 rounded-[6px] flex justify-center items-center hover:bg-[#9BB8FF] transition-colors">
                    <img src="/arrow-right.svg" alt="arrow-right" className="w-10 h-10"/>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Section */}
          <hr className="mt-12 h-px bg-[#FFFFFF33] border-0" />
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
            <p className="Livvic-Medium text-sm sm:text-md text-[#FFFFFFCC] text-center sm:text-left">
              © Familylink 2025 - All rights reserved
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-4 text-sm sm:text-md">
              <p className="Livvic-Medium text-[#FFFFFFCC] cursor-pointer hover:text-white transition-colors">
                Help & Feedback
              </p>
              <p className="text-[#FFFFFFCC]">|</p>
              <p className="Livvic-Medium text-[#FFFFFFCC] cursor-pointer hover:text-white transition-colors">
                Privacy Policy
              </p>
              <p className="text-[#FFFFFFCC]">|</p>
              <p className="Livvic-Medium text-[#FFFFFFCC] cursor-pointer hover:text-white transition-colors">
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