import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export const CustomSelect = ({ options, placeholder }) => {
  const [selected, setSelected] = useState(placeholder); // Default to placeholder
  const [open, setOpen] = useState(false);
  const selectRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-64" ref={selectRef}>
      {/* Select Box */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-full bg-white shadow-md focus:outline-none"
      >
        <span className={`mr-6 ${selected === placeholder ? "text-gray-400" : "text-gray-900"}`}>
          {selected}
        </span>
        <ChevronDown fill="#7C8493" color="#7C8493" size={18} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Options */}
      {open && (
        <ul className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {/* Placeholder as selectable option */}
          <li
            onClick={() => {
              setSelected(placeholder); // Reset to placeholder
              setOpen(false);
            }}
            className="px-4 py-2 text-gray-400 hover:bg-gray-100 cursor-pointer"
          >
            {placeholder}
          </li>

          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => {
                setSelected(option); // Set selected option
                setOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};