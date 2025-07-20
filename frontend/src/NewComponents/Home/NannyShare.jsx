import React from "react";
import Button from "../Button";

const benefits = [
  "Background-checked providers",
  "18-month average match duration",
  "Save $18,000–$26,000 annually",
  "Built-in support network of like-minded families",
];

function NannyShare() {
  return (
    <div className="container my-32 Livvic">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="Livvic-Bold text-6xl mt-12 leading-[80px]">
            Nanny Share & Shared
            <br /> Care—More Affordable
            <br /> Than You Think
          </h1>
          <p className="text-lg Livvic-Medium mt-9 leading-[30px] text-[#00000099]">
            FamyLink helps families connect with nearby families to share
            caregivers—
            <br />
            whether that’s a nanny, tutor, or coach. Save money, split
            schedules, and
            <br /> build consistency with our compatibility-based matching
            system.
          </p>
          <Button
            btnText={"Learn more about Nanny Share"}
            className="bg-[#D6FB9A] mt-6"
          />
        </div>
        <div className="border-2 border-[#EEEEEE] rounded-[20px] flex flex-col gap-6 p-12">
          <h2 className="text-[#001243] Livvic-SemiBold text-xl">Benefits Box:</h2>
          {benefits.map((benefit, i) => (
            <div key={i} className="flex gap-4">
              <img src="/icons/Check.svg" alt="check" />
              <p className="Livvic text-[#025738]">{benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NannyShare;
