import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { FiArrowLeft, FiX } from "react-icons/fi";

const statusStyles = {
  New: "bg-[#062f33] text-[#22d3ee] border-[#0ea5a4]",
  "In Progress": "bg-[#24153b] text-[#c084fc] border-[#7c3aed]",
  Resolved: "bg-[#052a18] text-[#34d399] border-[#16a34a]",
  Urgent: "bg-[#2b0a0a] text-[#f87171] border-[#ef4444]",
};

function ModalShell({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-999">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-3">
        <div className="w-full max-w-215 overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f12] shadow-[0_25px_80px_rgba(0,0,0,.65)]">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function Field({ label, value, right }) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div>
        <div className="text-[12px] font-medium text-white/55">{label}</div>
        <div className="mt-1 text-[13px] text-white/80">{value || "-"}</div>
      </div>
      {right}
    </div>
  );
}

export default function SupportTicketModal({
  open,
  onClose,
  ticket,
  startInReplyMode = false,
  onSendReply,
}) {
  const [replyMode, setReplyMode] = useState(startInReplyMode);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => setReplyMode(startInReplyMode), [startInReplyMode, open]);

  const statusCls = useMemo(
    () =>
      statusStyles[ticket?.status] ||
      "bg-white/5 text-white/70 border-white/10",
    [ticket],
  );

  const send = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      await onSendReply?.({ ticketId: ticket?.id, reply: reply.trim() });
      setReply("");
      setReplyMode(false);
    } finally {
      setSending(false);
    }
  };

  return (
    <ModalShell open={open} onClose={onClose}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-white/10 px-6 py-5">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onClose}
            className="mt-0.5 grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-white/70 hover:bg-white/10"
          >
            <FiArrowLeft />
          </button>

          <div>
            <div className="text-[18px] font-semibold text-white">
              Support Ticket
            </div>
            <div className="mt-1 text-[12px] text-white/55">
              Review the user’s request and respond quickly.
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-white/70 hover:bg-white/10"
        >
          <FiX />
        </button>
      </div>

      {/* Body */}
      <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-4">
              <Field label="User" value={ticket?.user} />
              <Field label="Email" value={ticket?.email} />
              <Field label="Ticket ID" value={ticket?.id} />
              <Field label="Issue Type" value={ticket?.issueType} />
              <Field label="Date Submitted" value={ticket?.dateSubmitted} />
              <Field label="Message" value={ticket?.message} />
            </div>

            <button
              type="button"
              className="text-[12px] font-medium text-[#a855f7] hover:text-[#c084fc]"
              onClick={() => setReplyMode((v) => !v)}
            >
              Add Reply
            </button>
          </div>

          <div className="mt-5">
            <div className="text-[12px] font-medium text-white/55">Status</div>
            <div className="mt-2 inline-flex items-center">
              <span
                className={[
                  "rounded-md border px-2 py-1 text-[12px]",
                  statusCls,
                ].join(" ")}
              >
                {ticket?.status || "-"}
              </span>
            </div>
          </div>

          {replyMode && (
            <div className="mt-5">
              <div className="mb-2 text-[12px] font-medium text-white/55">
                Admin Response
              </div>
              <div className="flex items-center gap-3">
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Write your response..."
                  className="h-10 w-full rounded-lg border border-white/10 bg-[#0b0b0e] px-3 text-[13px] text-white/80 outline-none placeholder:text-white/30 focus:border-[#0b74ff]"
                />
                <button
                  type="button"
                  onClick={send}
                  disabled={sending || !reply.trim()}
                  className="h-10 shrink-0 rounded-lg bg-transparent px-3 text-[12px] font-semibold text-[#a855f7] disabled:opacity-40"
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 h-12 w-full rounded-lg bg-[#0b74ff] text-[13px] font-semibold text-white hover:bg-[#0a6be8]"
        >
          Done
        </button>
      </div>
    </ModalShell>
  );
}
