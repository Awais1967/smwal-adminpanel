import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function PasswordField({
  label,
  icon,
  className = "",
  ...props
}) {
  const [show, setShow] = useState(false);

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

        <input
          {...props}
          type={show ? "text" : "password"}
          className={[
            "h-10 w-full rounded-lg border border-white/10 bg-black/70",
            "pl-10 pr-11 text-sm text-white placeholder:text-white/30",
            "outline-none transition",
            "focus:border-[#0B67CD] focus:ring-4 focus:ring-[#0B67CD]/20",
          ].join(" ")}
        />

        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45 hover:text-white/70"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
    </label>
  );
}
