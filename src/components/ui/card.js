import React from "react";

export default function Card({ children, className = "", ...props }) {
  return (
    <div className={`rounded-xl border bg-white shadow-sm ${className}`} {...props}>
      {children}
    </div>
  );
}
