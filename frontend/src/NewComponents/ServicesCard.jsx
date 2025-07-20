import React from "react";

function ServicesCard({ title, description, icon }) {
  return (
    <div className="rounded-2xl pl-6 pr-2 py-10 bg-white max-w-[18rem]">
      {/* Fixed-height image container */}
      <div className="h-[100px] flex items-center">
        <img
          src={icon}
          alt="nanny"
          className="h-[96px] w-[96px] object-contain"
        />
      </div>

      {/* Text content - always starts at the same vertical position */}
      <div className="mt-4">
        <p className="Livvic-SemiBold text-lg">{title}</p>
        <p className="text-[#8A8E99] Livvic">{description}</p>
      </div>
    </div>
  );
}

export default ServicesCard;
