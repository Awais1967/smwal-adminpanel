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

const Row = ({ k, v, right }) => (
  <div className="flex items-start justify-between gap-4">
    <div>
      <p className="text-[12px] font-medium text-white/70">{k}</p>
      <p className="mt-1 text-[12px] text-white/55">{v || "-"}</p>
    </div>
    {right}
  </div>
);

export default function ViewUserProfileModal({ open, onClose, user }) {
  useLockBody(open);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#161616] shadow-2xl">
        <div className="flex items-start justify-between gap-3 p-6">
          <div className="flex items-start gap-4">
            <button
              onClick={onClose}
              className="mt-0.5 rounded-md p-2 text-white/70 hover:bg-white/5 hover:text-white"
            >
              <FiArrowLeft size={18} />
            </button>
            <div>
              <h3 className="text-[16px] font-semibold text-white">
                View User Profile
              </h3>
              <p className="mt-1 text-[12px] text-white/55">
                Review user details and current availability status.
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
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">
            <Row k="Full Name" v={user?.name} />
            <Row k="Age" v={user?.age} />
            <Row k="Gender" v={user?.gender} />
            <Row k="Location" v={user?.city} />
            <Row k="Email Address" v={user?.email} />
            <Row k="Phone Number" v={user?.phone} />
            <Row
              k="Current Match"
              v={user?.match || "-"}
              right={
                <button className="text-[12px] text-fuchsia-300 hover:underline">
                  View profile
                </button>
              }
            />
            <Row k="Married" v={user?.married} />
            <Row k="Status" v={user?.status} />
            <Row k="User Portrait" v={user?.portraitName || "-"} />
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
