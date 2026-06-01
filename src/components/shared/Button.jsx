import React from "react";

export default function Button({
  children,
  className = "",
  size = "",
  variant = "primary",
  leftIcon,
  rightIcon,
  ...props
}) {
  const sizeCls =
    size === "sm"
      ? "h-9 px-3.5 text-[13px]"
      : "h-10 px-4 text-[13px]";

  const variants = {
    primary: "rounded-lg bg-[#8B3DFF] font-medium text-white hover:opacity-95",
    add: "rounded-xl bg-[#2F6CF6] font-semibold text-white hover:bg-[#285FDC]",
  };

  const base =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap transition disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <button
      className={[
        base,
        sizeCls,
        variants[variant] || variants.primary,
        className,
      ].join(" ")}
      {...props}
    >
      {leftIcon && <span className="inline-flex">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="inline-flex">{rightIcon}</span>}
    </button>
  );
}
