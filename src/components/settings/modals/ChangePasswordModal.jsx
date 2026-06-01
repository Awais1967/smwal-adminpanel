import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiArrowLeft, FiX, FiEye, FiEyeOff } from "react-icons/fi";

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

function Label({ children }) {
  return (
    <div className="mb-2 text-[12px] font-medium text-white/70">{children}</div>
  );
}

function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={show ? "text" : "password"}
        className="h-10 w-full rounded-lg border border-white/10 bg-[#0b0b0e] px-3 pr-10 text-[13px] text-white/80 outline-none placeholder:text-white/30 focus:border-[#0b74ff]"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-white/60 hover:bg-white/5"
      >
        {show ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  );
}

export default function ChangePasswordModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm({ current: "", next: "", confirm: "" });
  }, [open]);

  const submit = async () => {
    setSaving(true);
    try {
      await onSubmit?.(form);
      onClose?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell open={open} onClose={onClose}>
      <div className="flex items-start justify-between border-b border-white/10 px-6 py-5">
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
              Change Password
            </div>
            <div className="mt-1 text-[12px] text-white/55">
              Update your account password securely.
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

      <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
        <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-5">
          <div>
            <Label>Current Password</Label>
            <PasswordInput
              value={form.current}
              onChange={(v) => setForm((s) => ({ ...s, current: v }))}
              placeholder="Enter current password"
            />
          </div>

          <div>
            <Label>New Password</Label>
            <PasswordInput
              value={form.next}
              onChange={(v) => setForm((s) => ({ ...s, next: v }))}
              placeholder="Enter new password"
            />
          </div>

          <div>
            <Label>Confirm New Password</Label>
            <PasswordInput
              value={form.confirm}
              onChange={(v) => setForm((s) => ({ ...s, confirm: v }))}
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-lg border border-white/10 bg-white/5 text-[13px] font-semibold text-white/80 hover:bg-white/10"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={submit}
            disabled={saving}
            className="h-11 rounded-lg bg-[#0b74ff] text-[13px] font-semibold text-white hover:bg-[#0a6be8] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save & Continue"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
