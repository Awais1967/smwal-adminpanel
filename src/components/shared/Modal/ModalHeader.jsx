import React from "react";
import { FiArrowLeft, FiX } from "react-icons/fi";

const cx = (...c) => c.filter(Boolean).join(" ");

export default function ModalHeader({
  title,
  subtitle,
  onClose,
  onBack,
  showBack = false,
  className,
}) {
  return (
    <div
      className={cx(
        "flex items-start justify-between gap-3 border-b border-white/10 px-6 py-5",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        {showBack ? (
          <button
            type="button"
            onClick={onBack}
            className={cx(
              "mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl",
              "border border-white/10 bg-white/5 text-white/75",
              "hover:bg-white/8 hover:text-white transition",
            )}
            aria-label="Back"
          >
            <FiArrowLeft />
          </button>
        ) : null}

        <div className="min-w-0">
          {title ? (
            <div className="text-[14px] font-semibold text-white">{title}</div>
          ) : null}
          {subtitle ? (
            <div className="mt-1 text-[12px] text-white/55">{subtitle}</div>
          ) : null}
        </div>
      </div>

      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className={cx(
            "inline-flex h-9 w-9 items-center justify-center rounded-xl",
            "border border-white/10 bg-white/5 text-white/75",
            "hover:bg-white/8 hover:text-white transition",
          )}
          aria-label="Close"
        >
          <FiX />
        </button>
      ) : null}
    </div>
  );
}
