import React from "react";

export default function AuthCard({
  title,
  subtitle,
  children,
  className = "",
}) {
  return (
    <div
      className={[
        "w-full max-w-[460px] rounded-2xl border border-white/10 bg-[#1e1e1e]",
        "shadow-[0_20px_60px_rgba(0,0,0,0.6)]",
        "px-6 py-6 sm:px-7 sm:py-7",
        className,
      ].join(" ")}
    >
      {title ? (
        <div className="text-base font-semibold text-white sm:text-lg">
          {title}
        </div>
      ) : null}

      {subtitle ? (
        <div className="mt-1 text-xs leading-5 text-white/55 sm:text-sm">
          {subtitle}
        </div>
      ) : null}

      <div className="mt-5">{children}</div>
    </div>
  );
}
