import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { fireToastMessage } from "../../toastContainer";
import { api } from "../../Config/api";
import { Loader2 } from "lucide-react";

function Footer() {
  const { pathname } = useLocation();
  const { user } = useSelector((s) => s.auth);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false)
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
          <path
            fill="#001243"
            d="M0,50 C360,0 1080,0 1440,50 L1440,120 L0,120 Z"
          />
        </svg>
      </div>

      {/* Footer content */}
      <div className="bg-[#001243] text-white -mt-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="sm:col-span-2 lg:col-span-1 order-2 sm:order-1">
              <div className="flex gap-1 items-center">
                <img src="/logo.svg" alt="logo" />
                <p className="font-bold text-3xl Livvic-Bold text-white">
                  Famlink
                </p>
              </div>
              <p className="Livvic-Medium text-md text-[#FFFFFFCC] mt-6 leading-[24px]">
                Connecting families with trusted caregivers
                <br /> and building a supportive community.
              </p>
              <div className="flex gap-4 mt-6">
                <a
                  href="https://www.facebook.com/profile.php?id=61573842520549"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/icons/Socials/facebook-icon.svg"
                    alt="facebook"
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </a>

                {/* <img
                  src="/icons/Socials/twitter-icon.svg"
                  alt="twitter"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                /> */}

                {/* <a
                  href="https://www.instagram.com/Famlink.us?igsh=NTc4MTIwNjQ2YQ%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/icons/Socials/instagram-icon.svg"
                    alt="instagram"
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </a> */}

                {/* <img
                  src="/icons/Socials/youtube-icon.svg"
                  alt="youtube"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                /> */}
              </div>
            </div>

            {/* Links Section */}
            <div className="order-3 sm:order-2">
              <p className="no-underline Livvic-SemiBold text-lg leading-[18px]">
                Links
              </p>
              <ul className="mt-4 flex flex-col gap-4">
                <li>
                  <NavLink
                    to="/"
                    className="Livvic-Medium text-md underline hover:text-[#AEC4FF] transition-colors"
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/jobSeekers"
                    className="Livvic-Medium text-md underline hover:text-[#AEC4FF] transition-colors"
                  >
                    For Job Seekers
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/nannShare"
                    className="Livvic-Medium text-md underline hover:text-[#AEC4FF] transition-colors"
                  >
                    Nanny Share
                  </NavLink>
                </li>
                {/* <li>
                  <a
                    href="#"
                    className="Livvic-Medium text-md underline hover:text-[#AEC4FF] transition-colors"
                  >
                    Contact
                  </a>
                </li> */}
              </ul>
            </div>

            {/* Contact Section */}
            <div className="order-4 sm:order-3">
              <p className="no-underline Livvic-SemiBold text-lg leading-[18px]">
                Contact
              </p>
              <ul className="mt-4 flex flex-col gap-4">
                {/* <li className="Livvic-Medium text-md underline hover:text-[#AEC4FF] transition-colors cursor-pointer">
                  + (000) 123456789
                </li>
                <li className="Livvic-Medium text-md underline hover:text-[#AEC4FF] transition-colors cursor-pointer">
                  A-1, Ipsum HQ, Lorem
                </li> */}
                <a href="mailto:info@Famlink.care">
                  <li className="Livvic-Medium text-md underline hover:text-[#AEC4FF] transition-colors cursor-pointer">
                    info@Famlink.care
                  </li>
                </a>
              </ul>
            </div>

            {/* Newsletter Section */}
            <div className="order-1 sm:order-4">
              <p className="Livvic-SemiBold text-lg leading-[30px]">
                Stay in the loop—get helpful
                <br className="hidden sm:block" /> childcare tips and platform
                updates.
              </p>
              <div className="flex mt-6 focus-within:ring-2 focus-within:ring-[#4f7eff] rounded-md transition duration-200">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your Email"
                  className="bg-[#152D6F] text-[#FFFFFF] border-none flex-1 pl-6 py-3 rounded-l-md Livvic focus:outline-none placeholder-[#FFFFFF66]"
                />
                <div className="p-1 bg-[#152D6F] rounded-r-md">
                  <button
                    onClick={async () => {
                      setIsLoading(true)
                      try {
                        const { data } = await api.post(
                          "/subscribe/news-letter",
                          {
                            email: email,
                          }
                        );
                        fireToastMessage({
                          message: data?.message || "Subscribed successfully!",
                        });

                        setEmail("");
                        setIsLoading(false)
                      } catch (error) {
                        const msg =
                          error?.response?.data?.message ||
                          "Something went wrong. Try again!";
                        fireToastMessage({ type: "error", message: msg });
                      }finally {
                        setIsLoading(false)
                      }
                      // your logic here
                    }}
                    className="bg-[#AEC4FF] w-10 h-10 p-1 rounded-[6px] flex justify-center items-center hover:bg-[#9BB8FF] transition-colors"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-primary"/>
                    ) : (<img
                      src="/arrow-right.svg"
                      alt="arrow-right"
                      className="w-10 h-10"
                    />)}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <hr className="mt-12 h-px bg-[#FFFFFF33] border-0" />
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
            <p className="Livvic-Medium text-sm sm:text-md text-[#FFFFFFCC] text-center sm:text-left">
              © Famlink {new Date().getFullYear()} - All rights reserved
            </p>
            {/* <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-4 text-sm sm:text-md">
              <p className="Livvic-Medium text-[#FFFFFFCC] cursor-pointer hover:text-white transition-colors">
                Help & Feedback
              </p>
              <p className="text-[#FFFFFFCC]">|</p>
              <p className="Livvic-Medium text-[#FFFFFFCC] cursor-pointer hover:text-white transition-colors">
                Privacy Policy
              </p>
              <p className="text-[#FFFFFFCC]">|</p>
              <NavLink
                to={
                  user?.type === "Nanny"
                    ? "/nanny/terms-and-conditions"
                    : user?.type === "Parents"
                    ? "/family/terms-and-conditions"
                    : "/terms-and-conditions"
                }
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <p className="Livvic-Medium text-[#FFFFFFCC] cursor-pointer hover:text-white transition-colors">
                  Terms & Conditions
                </p>
              </NavLink>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
