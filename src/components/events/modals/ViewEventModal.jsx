import React, { useEffect } from "react";
import { FiArrowLeft, FiX } from "react-icons/fi";

function useLockBody(open) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [open]);
}

const Row = ({ k, v }) => (
  <div className="space-y-1">
    <p className="text-[12px] font-medium text-white/70">{k}</p>
    <p className="text-[12px] text-white/55">{v || "-"}</p>
  </div>
);

export default function ViewEventModal({ open, onClose, event }) {
  useLockBody(open);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#161616] shadow-2xl">
        <div className="flex items-start justify-between p-6">
          <div className="flex items-start gap-4">
            <button
              onClick={onClose}
              className="rounded-md p-2 text-white/70 hover:bg-white/5 hover:text-white"
            >
              <FiArrowLeft size={18} />
            </button>
            <div>
              <h3 className="text-[16px] font-semibold text-white">
                View Event
              </h3>
              <p className="mt-1 text-[12px] text-white/55">
                Review event details and status.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-white/60 hover:bg-white/5 hover:text-white"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto px-6 pb-6">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Row k="Event Name" v={event?.name} />
              <Row
                k="Location"
                v={event ? `${event.city}, ${event.country}` : "-"}
              />
              <Row k="Event Date" v={event?.date} />
              <Row
                k="Time"
                v={
                  event
                    ? `${event.startTime || "-"} - ${event.endTime || "-"}`
                    : "-"
                }
              />
              <Row k="Fee" v={event ? `$${event.fee ?? 0}` : "-"} />
              <Row k="Status" v={event?.status} />
              <Row k="Registrations" v={event?.registrations} />
              <Row k="Cover" v={event?.coverName} />
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 p-5">
          <button
            onClick={onClose}
            className="h-10 w-full rounded-lg bg-[#0B67CD] text-[13px] font-medium text-white hover:brightness-110"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
