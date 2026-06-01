import React from "react";

export default function AuthInput({
  label,
  icon,
  as = "input",
  className = "",
  inputClassName = "",
  ...props
}) {
  const Comp = as;

  return (
    <label className={["block", className].join(" ")}>
      {label ? (
        <div className="mb-2 text-xs font-medium text-white/65">{label}</div>
      ) : null}

      <div className="relative">
        {icon ? (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/45">
            {icon}
          </span>
        ) : null}

        <Comp
          {...props}
          className={[
            "w-full rounded-lg border border-white/10 bg-black/70",
            "text-sm text-white placeholder:text-white/30",
            "outline-none transition",
            "focus:border-[#0B67CD] focus:ring-4 focus:ring-[#0B67CD]/20",
            icon ? "pl-10 pr-3" : "px-3",
            as === "textarea" ? "min-h-11 py-3" : "h-10",
            inputClassName,
          ].join(" ")}
        />
      </div>
    </label>
  );
}
