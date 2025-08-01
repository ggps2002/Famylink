import React from "react";
import { NavLink } from "react-router-dom";
import Button from "./Button";

function Header() {
  return (
    <header>
      <div className="flex justify-between items-center py-2 sm:py-4">
        <div className="flex gap-1 items-center">
          <img src="/logo.svg" alt="logo" className="w-6 h-6 sm:w-8 sm:h-8" />
          <p className="font-bold text-lg sm:text-xl Livvic-Bold text-white">
            Famlink
          </p>
        </div>
        <div className="flex gap-2 sm:gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `Livvic-SemiBold text-lg ${
                isActive ? "text-white opacity-100" : "text-white opacity-40"
              }`
            }
          >
            Find Family
          </NavLink>

          <NavLink
            to="/jobSeekers"
            className={({ isActive }) =>
              `Livvic-SemiBold text-lg ${
                isActive ? "text-white opacity-100" : "text-white opacity-40"
              }`
            }
          >
            For Caregivers
          </NavLink>

          <NavLink
            to="/nannShare"
            className={({ isActive }) =>
              `Livvic-SemiBold text-lg ${
                isActive ? "text-white opacity-100" : "text-white opacity-40"
              }`
            }
          >
            Nanny Share
          </NavLink>
        </div>

        <div className="flex gap-2 sm:gap-4">
          <NavLink to="/login">
            <Button
              btnText="Log in"
              className="text-white text-sm sm:text-base"
            />
          </NavLink>
          <NavLink to="/joinNow">
            <Button
              btnText={"Join now"}
              className="bg-[#AEC4FF] text-sm sm:text-base"
            />
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default Header;
