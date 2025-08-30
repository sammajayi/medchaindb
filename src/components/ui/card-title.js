import React from "react";

export default function CardTitle({ children, className = "", ...props }) {
  return (
    <h3 className={`font-semibold text-lg ${className}`} {...props}>
      {children}
    </h3>
  );
}
