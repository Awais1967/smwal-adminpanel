import React from "react";

const cx = (...c) => c.filter(Boolean).join(" ");

export default function TableToolbar({
  title,
  subtitle,
  left,
  right,
  className,
}) {
  return (
    <div className={cx("flex items-start justify-between gap-3", className)}>
      <div className="min-w-0">
        {title ? (
          <div className="text-[14px] font-semibold text-white">{title}</div>
        ) : null}
        {subtitle ? (
          <div className="mt-1 text-[12px] text-white/55">{subtitle}</div>
        ) : null}
        {left ? <div className="mt-3">{left}</div> : null}
      </div>

      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}
