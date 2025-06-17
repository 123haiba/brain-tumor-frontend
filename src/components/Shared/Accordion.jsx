import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const Accordion = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="w-full">
      <button
        className="w-full flex items-center justify-between py-5 px-4 text-left font-bold text-2xl sm:text-3xl text-white focus:outline-none transition"
        onClick={() => setOpen((o) => !o)}
      >
        <span>{title}</span>
        <FaChevronDown
          className={`text-cyan-400 text-3xl ml-4 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 bg-white/5 px-6 ${
          open ? "max-h-96 py-4" : "max-h-0 py-0"
        }`}
      >
        {open && (
          <div className="text-white text-lg font-medium">{children}</div>
        )}
      </div>
      <div className="border-b border-white/30 w-full" />
    </div>
  );
};

export default Accordion;
