import React from "react";

const cx = (...c) => c.filter(Boolean).join(" ");

const VARIANTS = {
  active: "border-emerald-400/35 bg-emerald-500/15 text-emerald-200",
  pending: "border-fuchsia-400/35 bg-fuchsia-500/15 text-fuchsia-200",
  cancelled: "border-red-400/35 bg-red-500/15 text-red-200",
  new: "border-cyan-400/35 bg-cyan-500/15 text-cyan-200",
  info: "border-sky-400/35 bg-sky-500/15 text-sky-200",
  neutral: "border-white/10 bg-white/5 text-white/75",
};

const SIZES = {
  sm: "px-2 py-0.5 text-[11px]",
  md: "px-2.5 py-1 text-[12px]",
};

export default function Badge({
  children,
  variant = "neutral",
  size = "sm",
  className,
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-md border font-medium leading-none",
        VARIANTS[variant] || VARIANTS.neutral,
        SIZES[size] || SIZES.sm,
        className,
      )}
    >
      {children}
    </span>
  );
}
