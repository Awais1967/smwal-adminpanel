import React from "react";
import { FiArrowRight } from "react-icons/fi";

export default function AuthPrimaryButton({
  children,
  className = "",
  ...props
}) {
  return (
    <button
      {...props}
      className={[
        "group relative flex h-10 w-full items-center justify-center gap-2 rounded-lg",
        "bg-[#0B67CD] text-sm font-semibold text-white",
        "shadow-[0_12px_30px_rgba(11,103,205,0.25)]",
        "transition hover:bg-[#095cb6] active:scale-[0.99] disabled:opacity-60",
        className,
      ].join(" ")}
    >
      <span>{children}</span>
      <FiArrowRight className="translate-x-0.5 transition group-hover:translate-x-1" />
    </button>
  );
}
