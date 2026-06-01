import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { FiArrowLeft, FiX } from "react-icons/fi";

const SIZES = {
  sm: "max-w-[420px]",
  lg: "max-w-[900px]",
  xl: "max-w-[1040px]",
};

export default function CourseModalShell({
  open,
  onClose,
  title,
  subtitle,
  showBack = false,
  onBack,
  footer,
  size = "xl",
  children,
  hideHeader = false,
}) {
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/70 p-0 sm:p-6">
      <div
        className={[
          "w-full",
          SIZES[size] || SIZES.xl,
          "h-svh sm:h-auto",
          "sm:max-h-[calc(100svh-3rem)]",
          "rounded-none sm:rounded-2xl",
          "border border-white/10 bg-[#0f0f10] shadow-[0_18px_60px_rgba(0,0,0,0.6)]",
          "overflow-hidden",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
      >
        {!hideHeader ? (
          <div className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-4">
            <div className="flex items-start gap-3">
              {showBack ? (
                <button
                  type="button"
                  onClick={onBack || onClose}
                  className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-white/70 hover:bg-white/10"
                  aria-label="Back"
                >
                  <FiArrowLeft />
                </button>
              ) : null}

              <div>
                {title ? (
                  <div className="text-[16px] font-semibold text-white">
                    {title}
                  </div>
                ) : null}
                {subtitle ? (
                  <div className="mt-1 text-[12px] text-white/55">
                    {subtitle}
                  </div>
                ) : null}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-white/70 hover:bg-white/10"
              aria-label="Close"
            >
              <FiX />
            </button>
          </div>
        ) : null}

        {/* Scrollable content (important for mobile) */}
        <div className="max-h-[calc(100svh-120px)] overflow-y-auto px-5 py-4 sm:max-h-[calc(100svh-220px)]">
          {children}
        </div>

        {footer ? (
          <div className="border-t border-white/10 px-5 py-4">{footer}</div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
