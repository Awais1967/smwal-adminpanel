import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { getStatusPillClasses } from "./StatusPill";

const cx = (...c) => c.filter(Boolean).join(" ");

const DEFAULT_OPTIONS = [
  { value: "active", label: "Active", variant: "active" },
  { value: "pending", label: "Pending", variant: "pending" },
  { value: "cancelled", label: "Cancelled", variant: "cancelled" },
  { value: "new", label: "New", variant: "new" },
];

export default function StatusDropdownPill({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
  className,
  disabled,
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const current = useMemo(() => {
    return options.find((o) => o.value === value) || options[0];
  }, [value, options]);

  useEffect(() => {
    const onDoc = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div ref={wrapRef} className={cx("relative inline-flex", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((s) => !s)}
        className={cx(
          "inline-flex h-7 min-w-[64px] items-center justify-center gap-1.5 rounded-[6px] border px-3 text-[11px] font-medium leading-none outline-none transition",
          getStatusPillClasses(current?.label || value),
          "focus:ring-4 focus:ring-sky-500/10 disabled:opacity-50 disabled:cursor-not-allowed",
        )}
      >
        <span>{current?.label || value}</span>
        <FiChevronDown className="opacity-80" />
      </button>

      {open ? (
        <div
          className={cx(
            "absolute right-0 top-[calc(100%+8px)] z-30 min-w-40 overflow-hidden rounded-xl border",
            "border-white/10 bg-[#0b0f14]/95 shadow-(--shadow-card) backdrop-blur",
          )}
        >
          <div className="p-1">
            {options.map((o) => {
              const active = o.value === value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => {
                    onChange?.(o.value);
                    setOpen(false);
                  }}
                  className={cx(
                    "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-[12px] transition",
                    active
                      ? "bg-white/8 text-white"
                      : "text-white/75 hover:bg-white/6 hover:text-white",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={cx(
                        "h-2.5 w-2.5 rounded-full",
                        o.variant === "active" ? "bg-emerald-400/90" : "",
                        o.variant === "pending" ? "bg-fuchsia-400/90" : "",
                        o.variant === "cancelled" ? "bg-red-400/90" : "",
                        o.variant === "new" ? "bg-cyan-400/90" : "",
                        !o.variant ? "bg-white/35" : "",
                      )}
                    />
                    {o.label}
                  </span>
                  {active ? <span className="text-white/50">✓</span> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
