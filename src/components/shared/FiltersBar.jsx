import React from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";

const cx = (...c) => c.filter(Boolean).join(" ");

function Select({ value, onChange, options = [], placeholder, className }) {
  return (
    <div className={cx("relative", className)}>
      <select
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        className={cx(
          "h-9 w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-3 pr-9",
          "text-[12px] text-white/80 outline-none transition",
          "focus:border-sky-500/30 focus:ring-4 focus:ring-sky-500/10",
        )}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/45" />
    </div>
  );
}

export default function FiltersBar({
  search,
  onSearchChange,
  searchPlaceholder = "Search…",
  filters = [],
  className,
}) {
  return (
    <div
      className={cx(
        "flex flex-col gap-3 md:flex-row md:items-center",
        className,
      )}
    >
      {/* Search */}
      <div className="relative w-full md:flex-1">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/45" />
        <input
          value={search ?? ""}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder={searchPlaceholder}
          className={cx(
            "h-9 w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-3",
            "text-[12px] text-white/80 placeholder:text-white/35 outline-none transition",
            "focus:border-sky-500/30 focus:ring-4 focus:ring-sky-500/10",
          )}
        />
      </div>

      {/* Filters */}
      <div className="flex w-full gap-2 md:w-auto">
        {filters.map((f) => (
          <Select
            key={f.key}
            value={f.value}
            onChange={(val) => f.onChange?.(val)}
            options={f.options}
            placeholder={f.placeholder}
            className={f.className || "w-full md:w-30"}
          />
        ))}
      </div>
    </div>
  );
}
