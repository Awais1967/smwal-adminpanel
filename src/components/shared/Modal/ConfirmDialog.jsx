import React from "react";
import Modal from "./Modal";
import ModalHeader from "./ModalHeader";
import ModalBody from "./ModalBody";
import ModalFooter from "./ModalFooter";

const cx = (...c) => c.filter(Boolean).join(" ");

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Confirm action",
  description = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  loading = false,
}) {
  return (
    <Modal open={open} onClose={onClose} className="max-w-140">
      <ModalHeader title={title} subtitle={null} onClose={onClose} />

      <ModalBody>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-[12px] text-white/70">{description}</div>
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className={cx(
              "h-10 rounded-lg border px-4 text-[12px] font-medium transition",
              "border-white/10 bg-white/5 text-white/75 hover:bg-white/8 hover:text-white",
              "disabled:opacity-60 disabled:cursor-not-allowed",
            )}
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={cx(
              "h-10 rounded-lg px-4 text-[12px] font-semibold transition",
              danger
                ? "bg-red-500/90 text-white hover:bg-red-500"
                : "bg-sky-500/90 text-white hover:bg-sky-500",
              "disabled:opacity-60 disabled:cursor-not-allowed",
            )}
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
