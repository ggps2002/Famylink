import React from "react";
import { NavLink } from "react-router-dom";
import { AnimatedWrapper } from "./animation";
export default function Sec1({ pic, head, preHead , nannyShare}) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <AnimatedWrapper
          animationConfig={{
            from: { opacity: 0, y: -50 },
            to: { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" },
          }}
        >
          <p className="Classico sec1-head">{head}</p>
        </AnimatedWrapper>
        <p className="Elliana-Samantha sec1-pre-head">
          {" "}
          {preHead.split(",").map((part, idx, arr) => (
            <React.Fragment key={idx}>
              {part}
              {idx < arr.length - 1 && <span className="font-sans"> ,</span>}
            </React.Fragment>
          ))}
        </p>
        <NavLink
          to="/joinNow"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <button
            style={{ background: "#EFECE6" }}
            className="mt-10 mb-4 px-6 py-1 font-normal text-base transition hover:-translate-y-1 duration-700 delay-150 ... ease-in-out hover:scale-110 margin-btn-acc"
          >
            {nannyShare ? "Find Nanny Share Opportunities" : "Get Started Today"}
          </button>
        </NavLink>

        <p className="font-normal text-base already-acc">
          <NavLink
            className="hover:text-blue-600 transition-colors duration-300 cursor-pointer"
            to="/login"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Already have an account? Log in
          </NavLink>
        </p>
      </div>
      <img className="sec1-pic" src={pic} alt={pic} />
    </div>
  );
}
