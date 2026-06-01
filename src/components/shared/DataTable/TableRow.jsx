import React from "react";

const cx = (...c) => c.filter(Boolean).join(" ");

export default function TableRow({ row, columns = [], onRowClick, className }) {
  const clickable = typeof onRowClick === "function";

  return (
    <tr
      onClick={() => clickable && onRowClick(row)}
      className={cx(
        "border-b border-white/5 transition",
        clickable ? "cursor-pointer hover:bg-white/3" : "",
        className,
      )}
    >
      {columns.map((col) => {
        const content = col.render
          ? col.render(row)
          : col.accessor
            ? col.accessor(row)
            : row?.[col.key];

        return (
          <td
            key={col.key}
            className={cx(
              "px-4 py-3 text-[12px] text-white/70",
              col.tdClassName,
            )}
          >
            {content}
          </td>
        );
      })}
    </tr>
  );
}
