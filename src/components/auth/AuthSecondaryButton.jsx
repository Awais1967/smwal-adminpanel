import React from "react";

export default function AuthSecondaryButton({
  children,
  className = "",
  ...props
}) {
  return (
    <button
      {...props}
      className={[
        "flex h-10 w-full items-center justify-center rounded-lg",
        "border border-white/10 bg-black/60 text-sm font-medium text-white/80",
        "transition hover:bg-black/75 hover:text-white active:scale-[0.99] disabled:opacity-60",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
