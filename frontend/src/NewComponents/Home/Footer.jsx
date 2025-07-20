import React from "react";

function Footer() {
  return (
    <div className="container py-24">
      <div className="flex flex-wrap justify-between items-start">
        <div>
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
        <div>
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
        <div>
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
        <div>
          <p className="Livvic-SemiBold text-lg leading-[30px]">
            Stay in the loop—get helpful
            <br /> childcare tips and platform updates.
          </p>
          <div className="flex mt-6 focus-within:ring-2 focus-within:ring-[#4f7eff] rounded-md transition duration-200">
            <input
              type="email"
              placeholder="Enter your Email"
              className="bg-[#152D6F] border-none input-width pl-6 py-2 rounded-l-md Livvic focus:outline-none"
            />
            <div className="p-1 w-fit bg-[#152D6F] rounded-r-md">
              <button className="bg-[#AEC4FF] rounded-[6px] flex justify-center items-center">
                <img src="/arrow-right.svg" alt="arrow-right" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr className="mt-12 h-px bg-[#FFFFFF33] border-0" />
      <div className="flex justify-between mt-8 mb-12">
        <p className="Livvic-Medium text-md text-[#FFFFFFCC]">
          © Familylink 2025 - All rights reserved
        </p>
        <div className="flex gap-4">
          <p className="Livvic-Medium text-md text-[#FFFFFFCC] cursor-pointer">
            Help & Feedback
          </p>
          <p>|</p>
          <p className="Livvic-Medium text-md text-[#FFFFFFCC] cursor-pointer">
            Privacy Policy
          </p>
          <p>|</p>
          <p className="Livvic-Medium text-md text-[#FFFFFFCC] cursor-pointer">
            Terms & Conditions
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
