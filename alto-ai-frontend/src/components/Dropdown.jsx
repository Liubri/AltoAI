import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
export default function Dropdown({ options, setSelectedAI }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    setSelected(option); // store selected option
    setSelectedAI(option.name); // notify parent
    setIsOpen(false); // close menu
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 bg-quaternary rounded shadow hover:bg-quaternary transition"
      >
        {selected ? selected.icon : <ChevronDown size={25} />}
      </button>

      {isOpen && (
        <ul className="absolute mt-1 w-40 bg-tertiary rounded shadow-lg z-20">
          {options.map((option, index) => (
            <li
              key={index}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-quaternary transition-colors first:rounded-t last:rounded-b"
              onClick={() => handleSelect(option)}
            >
              {/* icon */}
              {option.icon}

              {/* text */}
              <span>{option.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
