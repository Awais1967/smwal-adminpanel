import React from "react";
import { FiTrash2, FiX } from "react-icons/fi";
import Modal from "./Modal";

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  loading = false,
  title = "Delete Item?",
  description = "This will permanently remove this item from the platform. This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  icon: Icon = FiTrash2,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      className="max-w-[430px] border-white/10 bg-[#101010] shadow-[0_24px_80px_rgba(0,0,0,0.68)]"
    >
      <div className="px-5 py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E7EFFF] text-[#0B67CD]">
            <Icon size={18} />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-white/65 transition hover:bg-white/5 hover:text-white"
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="mt-5">
          <div className="text-[18px] font-semibold text-white">{title}</div>
          <div className="mt-2 max-w-80 text-[14px] leading-6 text-white/75">
            {description}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="h-12 w-full rounded-xl bg-[#2F6CF6] text-[14px] font-semibold text-white transition hover:bg-[#285FDC] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Deleting..." : confirmText}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="h-12 w-full rounded-xl border border-white/10 bg-white/5 text-[14px] font-semibold text-white/85 transition hover:bg-white/8"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
