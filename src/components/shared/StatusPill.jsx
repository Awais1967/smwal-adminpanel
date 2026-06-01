import React from "react";

const BASE_STATUS_PILL_CLASS =
  "inline-flex h-7 min-w-[64px] items-center justify-center whitespace-nowrap rounded-[6px] border px-3 text-[11px] font-medium leading-none";

const STATUS_PILL_STYLES = {
  // Cyan
  Active: "border-[#00D7E6] bg-[#00D7E6]/10 text-[#00D7E6]",
  Published: "border-[#00D7E6] bg-[#00D7E6]/10 text-[#00D7E6]",
  Completed: "border-[#00D7E6] bg-[#00D7E6]/10 text-[#00D7E6]",
  Upcoming: "border-[#00D7E6] bg-[#00D7E6]/10 text-[#00D7E6]",
  Paid: "border-[#00D7E6] bg-[#00D7E6]/10 text-[#00D7E6]",
  New: "border-[#00D7E6] bg-[#00D7E6]/10 text-[#00D7E6]",
  Sent: "border-[#00D7E6] bg-[#00D7E6]/10 text-[#00D7E6]",

  // Magenta
  Inactive: "border-[#D946EF] bg-[#D946EF]/10 text-[#D946EF]",
  Draft: "border-[#D946EF] bg-[#D946EF]/10 text-[#D946EF]",
  Scheduled: "border-[#D946EF] bg-[#D946EF]/10 text-[#D946EF]",
  Pending: "border-[#D946EF] bg-[#D946EF]/10 text-[#D946EF]",
  "In Progress": "border-[#D946EF] bg-[#D946EF]/10 text-[#D946EF]",

  // Red
  Cancelled: "border-[#FF3B30] bg-[#FF3B30]/10 text-[#FF3B30]",
  Failed: "border-[#FF3B30] bg-[#FF3B30]/10 text-[#FF3B30]",
  Urgent: "border-[#FF3B30] bg-[#FF3B30]/10 text-[#FF3B30]",

  // Green
  Closed: "border-[#00D26A] bg-[#00D26A]/10 text-[#00D26A]",
  Resolved: "border-[#00D26A] bg-[#00D26A]/10 text-[#00D26A]",
};

// eslint-disable-next-line react-refresh/only-export-components
export function getStatusPillClasses(value) {
  return (
    STATUS_PILL_STYLES[value] || "border-white/10 bg-white/3 text-white/70"
  );
}

export const StatusPill = ({ value, status, className = "" }) => {
  const val = value ?? status;

  return (
    <span
      className={[
        BASE_STATUS_PILL_CLASS,
        getStatusPillClasses(val),
        className,
      ].join(" ")}
    >
      {val}
    </span>
  );
};

export default StatusPill;
