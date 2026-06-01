import React from "react";
import {
  FiInfo,
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
  FiX,
} from "react-icons/fi";

const cx = (...c) => c.filter(Boolean).join(" ");

const MAP = {
  info: {
    icon: FiInfo,
    cls: "border-sky-500/25 bg-sky-500/10 text-sky-100",
  },
  success: {
    icon: FiCheckCircle,
    cls: "border-emerald-500/25 bg-emerald-500/10 text-emerald-100",
  },
  warning: {
    icon: FiAlertTriangle,
    cls: "border-amber-500/25 bg-amber-500/10 text-amber-100",
  },
  danger: {
    icon: FiXCircle,
    cls: "border-red-500/25 bg-red-500/10 text-red-100",
  },
};

export default function Alert({
  type = "info",
  title,
  children,
  onClose,
  className,
}) {
  const cfg = MAP[type] || MAP.info;
  const Icon = cfg.icon;

  return (
    <div
      className={cx(
        "relative flex gap-3 rounded-xl border p-4",
        cfg.cls,
        className,
      )}
      role="alert"
    >
      <div className="mt-0.5">
        <Icon className="text-[18px] opacity-90" />
      </div>

      <div className="min-w-0">
        {title ? (
          <div className="text-[13px] font-semibold text-white">{title}</div>
        ) : null}
        {children ? (
          <div className="mt-1 text-[12px] text-white/75">{children}</div>
        ) : null}
      </div>

      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close alert"
          className={cx(
            "absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-lg",
            "border border-white/10 bg-white/5 text-white/70 hover:bg-white/8 hover:text-white",
          )}
        >
          <FiX />
        </button>
      ) : null}
    </div>
  );
}
