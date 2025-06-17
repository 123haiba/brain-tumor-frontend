import React from "react";

const Button = ({ children, type = "button", className = "", ...props }) => (
  <button
    type={type}
    className={
      "w-full bg-blue-700 cursor-pointer hover:bg-blue-800 transition-colors text-white py-2 rounded-md font-bold text-lg " +
      className
    }
    {...props}
  >
    {children}
  </button>
);

export default Button;
