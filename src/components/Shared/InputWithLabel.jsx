import React from "react";

const InputWithLabel = ({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  className = "",
  children,
  error = null,
  ...props
}) => (
  <div className={"relative w-full " + className}>
    {label && (
      <label className="block text-white font-semibold mb-1">{label}</label>
    )}
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 pr-10 rounded text-black placeholder-gray-500 focus:outline-none ${
          error ? "border-2 border-red-500 bg-red-50" : "bg-white"
        }`}
        {...props}
      />
      {children && (
        <div className="absolute top-[50%] -translate-y-1/2 right-3 flex items-center justify-center pointer-events-none">
          {children}
        </div>
      )}
    </div>
    {error && (
      <div className="text-red-400 text-xs mt-1 font-medium">{error}</div>
    )}
  </div>
);

export default InputWithLabel;
