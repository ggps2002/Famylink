import React from "react";

function Button({ btnText, btnTextColor = "white", btnBgColor = "", className = "" }) {
  return (
    <button
      className={`rounded-full px-6 py-4 Livvic-SemiBold ${btnTextColor && `text-[${btnTextColor}]`} ${btnBgColor && `bg-[${btnBgColor}]`} ${className}`}
    >
      {btnText}
    </button>
  );
}

export default Button;
