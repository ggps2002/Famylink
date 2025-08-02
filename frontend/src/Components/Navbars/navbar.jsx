import { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/images/logo.png";

// Reusable HeaderLink component
const HeaderLink = ({ to, label, onClick }) => (
  <NavLink
    to={to}
    onClick={() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      onClick?.();
    }}
  >
    {({ isActive }) => (
      <p
        className={`font-normal  mb-2 lg:mb-0 text-lg uppercase hover:text-[#38AEE3] transition-colors duration-300`}
        style={{ color: isActive ? "#49A2FC" : "" }}
      >
        {label}
      </p>
    )}
  </NavLink>
);

export default function Header({ join }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleNavbar = () => setIsOpen(!isOpen);
  const closeNavbar = () => setIsOpen(false);

  const navItems = [
    { to: "forFamilies", label: "For Families" },
    { to: "jobSeekers", label: "For Job Seekers" },
    { to: "nannShare", label: "NANNY SHARE" },
    { to: "services", label: "Services" },
    { to: "yourBusiness", label: "List your Business" },
  ];

  return (
    <>
      {join ? (
        <div className="top-0 z-50 sticky flex items-center justify-center bg-white mb-3 w-full h-20">
          <NavLink
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="flex gap-1 items-center">
              <img
                src="/logo3.png"
                alt="logo"
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
              <p className="font-bold text-lg sm:text-xl Livvic-Bold">
                Famlink
              </p>
            </div>
          </NavLink>
        </div>
      ) : (
        <header className="top-0 z-50 sticky w-full bg-white shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 lg:py-5">
            {/* Logo */}
            <NavLink
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <img src={logo} alt="Logo" className="w-36" />
            </NavLink>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex gap-8 items-center">
              {navItems.map(({ to, label }) => (
                <HeaderLink key={to} to={to} label={label} />
              ))}
            </nav>

            {/* Desktop Buttons */}
            <div className="hidden lg:flex gap-3 items-center">
              <NavLink to="login">
                <button className="border border-[#38AEE3] text-base px-4 py-1 rounded-lg hover:scale-105 transition">
                  Login
                </button>
              </NavLink>
              <NavLink to="/joinNow">
                <button className="bg-[#85D1F1] text-base px-4 py-1 rounded-full hover:scale-105 transition">
                  Join Now
                </button>
              </NavLink>
            </div>

            {/* Mobile Buttons + Toggle */}
            <div className="flex items-center gap-3 lg:hidden">
              {/* Mobile Login Button */}
              <NavLink to="login" onClick={closeNavbar}>
                <button className="border border-[#38AEE3] px-3 py-1 text-sm rounded-md hover:scale-105 transition">
                  Login
                </button>
              </NavLink>

              {/* Toggle Button */}
              <button
                onClick={toggleNavbar}
                className="text-gray-600 focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Smooth Mobile Dropdown */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
              isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-4 pb-2 pt-2">
              {navItems.map(({ to, label }) => (
                <HeaderLink
                  key={to}
                  to={to}
                  label={label}
                  onClick={closeNavbar}
                />
              ))}

              {/* Join Now button */}
              <NavLink to="/joinNow" onClick={closeNavbar}>
                <button className="w-full bg-[#85D1F1] py-1 rounded-md text-base">
                  Join Now
                </button>
              </NavLink>
            </div>
          </div>
        </header>
      )}
    </>
  );
}
