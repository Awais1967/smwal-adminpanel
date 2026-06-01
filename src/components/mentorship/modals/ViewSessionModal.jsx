import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaArrowLeft } from "react-icons/fa";

const statusStyles = {
  Scheduled: "border-purple-500/50 text-purple-300 bg-purple-500/10",
  Completed: "border-cyan-500/50 text-cyan-300 bg-cyan-500/10",
  Cancelled: "border-red-500/50 text-red-300 bg-red-500/10",
};

function ModalFrame({ isOpen, onClose, children }) {
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [isOpen]);

  if (!isOpen) return null;
  return createPortal(
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/60 p-3">
      <button
        className="absolute inset-0 z-0"
        onClick={onClose}
        aria-label="overlay-close"
      />
      <div className="relative z-10 w-[96vw] max-w-230 max-h-[92vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0f0f0f] shadow-2xl">
        {children}
      </div>
    </div>,
    document.body,
  );
}

const Field = ({ label, value, right }) => (
  <div className="mb-4">
    <div className="flex items-center justify-between">
      <p className="text-xs font-medium text-white/70">{label}</p>
      {right}
    </div>
    <p className="mt-1 text-sm text-white/80">{value || "-"}</p>
  </div>
);

export default function ViewSessionModal({ isOpen, onClose, session }) {
  const s = session || {};
  const pillCls =
    statusStyles[s.status] || "border-white/10 text-white/70 bg-white/[0.03]";

  return (
    <ModalFrame isOpen={isOpen} onClose={onClose}>
      <div className="relative p-4 md:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <button
              onClick={onClose}
              className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/3 text-white/80 hover:bg-white/6"
              aria-label="back"
            >
              <FaArrowLeft size={14} />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-white">
                View User Profile
              </h2>
              <p className="mt-1 text-sm text-white/55">
                Review user details and current availability status.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/3 text-white/70 hover:bg-white/6"
            aria-label="close"
          >
            <FaTimes size={14} />
          </button>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/3 p-4 md:p-6">
          <Field
            label="User 1"
            value={s.user1Name ?? s.user1 ?? (s.user && s.user.name) ?? "-"}
          />
          <Field
            label="User 2"
            value={s.user2Name ?? s.user2 ?? (s.user && s.user.partner) ?? "-"}
          />
          <Field
            label="Topic"
            value={
              Array.isArray(s.topics) ? s.topics.join(", ") : s.topics || "-"
            }
          />
          <Field
            label="Date"
            value={s.date ?? s.startDate ?? s.dateMatched ?? "-"}
          />
          <Field label="Time" value={s.time ?? "-"} />
          <Field label="Session type" value={s.sessionType ?? s.type ?? "-"} />
          <Field
            label="Status"
            value=""
            right={
              <span
                className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs ${pillCls}`}
              >
                {s.status || "-"}
              </span>
            }
          />
        </div>

        <button
          onClick={onClose}
          className="mt-6 h-12 w-full rounded-lg bg-[#0B7CFF] text-sm font-medium text-white hover:brightness-110"
        >
          Done
        </button>
      </div>
    </ModalFrame>
  );
}
