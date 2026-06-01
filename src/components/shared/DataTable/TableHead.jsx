import React from "react";

const cx = (...c) => c.filter(Boolean).join(" ");

export default function TableHead({ columns = [], className }) {
  return (
    <thead className={cx("border-b border-white/10", className)}>
      <tr>
        {columns.map((col) => (
          <th
            key={col.key}
            className={cx(
              "px-4 py-3 text-left text-[11px] font-semibold text-white/55",
              col.thClassName,
            )}
            style={col.width ? { width: col.width } : undefined}
          >
            {col.header}
          </th>
        ))}
      </tr>
    </thead>
  );
}
