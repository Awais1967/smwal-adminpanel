import React from "react";

export default function TextField({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  leftIcon,
  right,
  className = "",
  ...props
}) {
  return (
    <label className={["block text-sm", className].join(" ")}>
      {label && <div className="mb-1 text-xs text-white/60">{label}</div>}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-white/60">
            {leftIcon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          className={[
            "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white",
            leftIcon ? "pl-9" : "pl-3",
            right ? "pr-12" : "pr-3",
          ].join(" ")}
          {...props}
        />
        {right && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {right}
          </div>
        )}
      </div>
    </label>
  );
}
