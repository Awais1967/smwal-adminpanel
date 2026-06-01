// src/components/matches/modals/MatchDetailsModal.jsx
import React from "react";
import { createPortal } from "react-dom";
import { FiArrowLeft, FiX } from "react-icons/fi";

function StatusPill({ value }) {
  const v = (value || "").toLowerCase();

  const styles =
    v === "active"
      ? "border-[#1FB6B6]/40 bg-[#0C2A2A] text-[#38DADA]"
      : v === "pending"
        ? "border-[#A855F7]/35 bg-[#24102E] text-[#C084FC]"
        : v === "cancelled"
          ? "border-[#EF4444]/35 bg-[#2A0D0D] text-[#F87171]"
          : "border-[#3B82F6]/35 bg-[#0B1C33] text-[#60A5FA]";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${styles}`}
    >
      {value || "—"}
    </span>
  );
}

function Field({ label, value }) {
  return (
    <div className="grid grid-cols-1 gap-1">
      <div className="text-[11px] font-semibold text-[#C8CDD6]">{label}</div>
      <div className="text-[12px] text-[#9AA0AA]">{value ?? "—"}</div>
    </div>
  );
}

export default function MatchDetailsModal({ open, onClose, match }) {
  React.useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-60">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className="absolute inset-0 flex items-center justify-center p-3 md:p-6">
        <div
          className={[
            "w-full max-w-205 overflow-hidden rounded-2xl",
            "border border-[#23242B] bg-linear-to-b from-[#1A1B1F] to-[#141416]",
            "shadow-[0_18px_60px_rgba(0,0,0,0.7)]",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 px-5 pt-5 md:px-6">
            <div className="flex items-start gap-3">
              <button
                onClick={onClose}
                className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#0E0F12] text-white ring-1 ring-[#23242B] hover:bg-[#111217]"
                aria-label="Back"
              >
                <FiArrowLeft size={18} />
              </button>

              <div>
                <div className="text-[15px] font-semibold text-white">
                  View Match Details
                </div>
                <div className="mt-0.5 text-[12px] text-[#9AA0AA]">
                  Review match status, timeline, and next actions.
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#0E0F12] text-white ring-1 ring-[#23242B] hover:bg-[#111217]"
              aria-label="Close"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Body (scrollable for mobile) */}
          <div className="max-h-[70vh] overflow-y-auto px-5 pb-5 pt-4 md:max-h-[68vh] md:px-6">
            <div className="rounded-[14px] border border-[#23242B] bg-[#141416] p-4 md:p-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field
                  label="User 1"
                  value={match?.user1Name ?? match?.user1}
                />
                <Field
                  label="User 2"
                  value={match?.user2Name ?? match?.user2}
                />
                <Field
                  label="User 1 email"
                  value={match?.user1Email ?? match?.user1?.email}
                />
                <Field
                  label="User 2 email"
                  value={match?.user2Email ?? match?.user2?.email}
                />
                <Field
                  label="Match Start Date"
                  value={match?.startDate ?? match?.dateMatched}
                />
                <Field
                  label="Match End Date"
                  value={match?.endDate ?? match?.dateMatched}
                />
              </div>

              <div className="mt-4">
                <div className="text-[11px] font-semibold text-[#C8CDD6]">
                  Status
                </div>
                <div className="mt-2">
                  <StatusPill value={match?.status} />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-[#23242B] bg-[#141416] px-5 py-4 md:px-6">
            <button
              onClick={onClose}
              className="h-11 w-full rounded-[10px] bg-[#0B78FF] text-[13px] font-semibold text-white transition hover:bg-[#0A6FEA] active:scale-[0.99]"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
