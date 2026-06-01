import React, { useEffect } from "react";
import { createPortal } from "react-dom";

const cx = (...c) => c.filter(Boolean).join(" ");

export default function Modal({
  open,
  onClose,
  children,
  className,
  overlayClassName,
  closeOnOverlay = true,
  closeOnEsc = true,
}) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (!closeOnEsc) return;
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, closeOnEsc, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-80 flex items-center justify-center px-4 py-6">
      <div
        className={cx(
          "absolute inset-0 bg-black/65 backdrop-blur-sm",
          overlayClassName,
        )}
        onMouseDown={() => {
          if (closeOnOverlay) onClose?.();
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cx(
          "relative w-full max-w-190 overflow-hidden rounded-2xl border border-white/10",
          "bg-[#0b0f14]/90 shadow-(--shadow-card)",
          className,
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
