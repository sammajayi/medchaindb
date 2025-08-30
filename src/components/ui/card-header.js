import React from "react";

export default function CardHeader({ children, className = "", ...props }) {
  return (
    <div className={`border-b px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
}
