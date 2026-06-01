import React, { useMemo } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const cx = (...c) => c.filter(Boolean).join(" ");

function range(start, end) {
  const out = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
}

function buildPages({ page, totalPages, siblings = 1 }) {
  if (totalPages <= 1) return [1];

  const first = 1;
  const last = totalPages;

  const left = Math.max(page - siblings, 2);
  const right = Math.min(page + siblings, totalPages - 1);

  const pages = [first];

  if (left > 2) pages.push("…");

  pages.push(...range(left, right));

  if (right < totalPages - 1) pages.push("…");

  pages.push(last);

  return pages;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  siblings = 1,
  className,
}) {
  const pages = useMemo(
    () => buildPages({ page, totalPages, siblings }),
    [page, totalPages, siblings],
  );

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className={cx("flex items-center justify-end gap-2", className)}>
      <button
        type="button"
        onClick={() => canPrev && onPageChange(page - 1)}
        disabled={!canPrev}
        className={cx(
          "inline-flex h-8 w-8 items-center justify-center rounded-lg border transition",
          "border-white/10 bg-white/5 text-white/70 hover:bg-white/8 hover:text-white",
          "disabled:opacity-40 disabled:hover:bg-white/5",
        )}
        aria-label="Previous page"
      >
        <FiChevronLeft />
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p, idx) => {
          const isActive = p === page;
          const isDots = p === "…";
          if (isDots) {
            return (
              <div
                key={`dots-${idx}`}
                className="px-2 text-[12px] text-white/45"
              >
                …
              </div>
            );
          }
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={cx(
                "inline-flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-[12px] transition",
                isActive
                  ? "border-sky-500/40 bg-sky-500/20 text-white"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/8 hover:text-white",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {p}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => canNext && onPageChange(page + 1)}
        disabled={!canNext}
        className={cx(
          "inline-flex h-8 w-8 items-center justify-center rounded-lg border transition",
          "border-white/10 bg-white/5 text-white/70 hover:bg-white/8 hover:text-white",
          "disabled:opacity-40 disabled:hover:bg-white/5",
        )}
        aria-label="Next page"
      >
        <FiChevronRight />
      </button>
    </div>
  );
}
