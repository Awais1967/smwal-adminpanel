import React, { useState, useRef, useEffect } from "react";

function useOutsideClick(ref, handler) {
  useEffect(() => {
    const onClick = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) handler(e);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [ref, handler]);
}

export default function SelectField({
  label,
  value,
  onChange,
  options = [],
  className = "",
  placeholder = "Select...",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOutsideClick(ref, () => setOpen(false));

  const normalized = options.map((opt) =>
    typeof opt === "object" ? opt : { value: opt, label: String(opt) },
  );

  const selected = normalized.find((o) => String(o.value) === String(value));

  const toggle = () => setOpen((s) => !s);

  const handleSelect = (val) => {
    onChange && onChange(val);
    setOpen(false);
  };

  return (
    <label className={["block text-sm relative", className].join(" ")}>
      {label && <div className="mb-1 text-xs text-white/60">{label}</div>}

      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={toggle}
          className="flex w-full items-center justify-between gap-2 rounded-lg border border-white/10 bg-[#0b0b0e] px-3 py-2 text-left text-sm text-white"
        >
          <span className={["block truncate", selected ? "" : "text-white/50"].join(" ")}>
            {selected ? selected.label : placeholder}
          </span>
          <svg
            className="ml-2 h-4 w-4 text-white/60"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 8l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {open && (
          <ul className="absolute z-50 mt-1 max-h-60 min-w-full w-max overflow-x-hidden overflow-y-auto rounded-lg border border-white/10 bg-[#0f0f12] py-1">
            {normalized.length === 0 && (
              <li className="px-3 py-2 text-sm text-white/60">No options</li>
            )}
            {normalized.map((opt) => (
              <li
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={[
                  "cursor-pointer whitespace-nowrap px-3 py-2 text-sm",
                  String(opt.value) === String(value)
                    ? "bg-[#0b5fff] text-white"
                    : "text-white/90 hover:bg-white/5",
                ].join(" ")}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </label>
  );
}
