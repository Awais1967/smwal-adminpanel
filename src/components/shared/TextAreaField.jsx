import React from "react";

const cx = (...c) => c.filter(Boolean).join(" ");

export default function TextAreaFeild({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  helperText,
  error,
  disabled,
  className,
  textareaClassName,
  required,
  name,
  id,
}) {
  const inputId = id || name;

  return (
    <div className={cx("w-full", className)}>
      {label ? (
        <label
          htmlFor={inputId}
          className="mb-2 block text-[12px] font-medium text-white/70"
        >
          {label} {required ? <span className="text-red-300">*</span> : null}
        </label>
      ) : null}

      <textarea
        id={inputId}
        name={name}
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={cx(
          "w-full rounded-xl border bg-white/5 px-3 py-2 text-[12px] text-white/80",
          "border-white/10 placeholder:text-white/35 outline-none transition",
          "focus:border-sky-500/30 focus:ring-4 focus:ring-sky-500/10",
          disabled ? "cursor-not-allowed opacity-60" : "",
          error
            ? "border-red-500/30 focus:border-red-500/40 focus:ring-red-500/10"
            : "",
          textareaClassName,
        )}
      />

      {error ? (
        <div className="mt-2 text-[11px] text-red-300">{error}</div>
      ) : helperText ? (
        <div className="mt-2 text-[11px] text-white/45">{helperText}</div>
      ) : null}
    </div>
  );
}
