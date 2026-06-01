import React from "react";

export default function Card({ children, className = "", ...props }) {
  const base = "rounded-xl border border-white/8 bg-[#0b0e14] p-4";
  return (
    <div className={[base, className].join(" ")} {...props}>
      {children}
    </div>
  );
}
