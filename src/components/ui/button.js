import React from "react";

export default function Button({ children, className = "", variant = "default", ...props }) {
  const base = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    default: "bg-[#008C99] text-white hover:bg-[#007080]",
    ghost: "bg-transparent text-[#1E293B] hover:text-[#008C99]",
    outline: "border border-[#008C99] text-[#008C99] hover:bg-[#008C99] hover:text-white",
  };
  return (
    <button className={`${base} ${variants[variant] || variants.default} ${className}`} {...props}>
      {children}
    </button>
  );
}
