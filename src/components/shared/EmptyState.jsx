import React from "react";
import { FiInbox } from "react-icons/fi";

const cx = (...c) => c.filter(Boolean).join(" ");

export default function EmptyState({
  icon,
  title = "Nothing here yet",
  description = "There’s no data to display.",
  action,
  className,
}) {
  const Icon = icon ?? FiInbox;
  return (
    <div
      className={cx(
        "flex w-full flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 p-10 text-center",
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
        <Icon className="text-[22px] text-white/70" />
      </div>
      <div className="mt-4 text-[14px] font-semibold text-white">{title}</div>
      <div className="mt-1 max-w-130 text-[12px] text-white/55">
        {description}
      </div>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
