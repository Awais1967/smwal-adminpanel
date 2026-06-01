import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiArrowLeft, FiX } from "react-icons/fi";

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

export default function AddMemberModal({
  open,
  onClose,
  mode = "add", // add | edit | view
  initialValues,
  onSubmit, // async (payload) => void
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      name: initialValues?.name || "",
      email: initialValues?.email || "",
      role: initialValues?.role || "",
      status: initialValues?.status || "",
    });
  }, [initialValues, open]);

  const readonly = mode === "view";

  const submit = async () => {
    setSaving(true);
    try {
      await onSubmit?.({ ...initialValues, ...form });
      onClose?.();
    } finally {
      setSaving(false);
    }
  };

  const title =
    mode === "edit"
      ? "Edit Role"
      : mode === "view"
        ? "View Role"
        : "Add New Role";

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
            <div className="text-[18px] font-semibold text-white">{title}</div>
            <div className="mt-1 text-[12px] text-white/55">
              Manage member access permissions.
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
            <Label>Full Name</Label>
            <input
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              placeholder="Enter full name"
              disabled={readonly}
              className="h-10 w-full rounded-lg border border-white/10 bg-[#0b0b0e] px-3 text-[13px] text-white/80 outline-none placeholder:text-white/30 focus:border-[#0b74ff] disabled:opacity-60"
            />
          </div>

          <div>
            <Label>Email Address</Label>
            <input
              value={form.email}
              onChange={(e) =>
                setForm((s) => ({ ...s, email: e.target.value }))
              }
              placeholder="Email address"
              disabled={readonly}
              className="h-10 w-full rounded-lg border border-white/10 bg-[#0b0b0e] px-3 text-[13px] text-white/80 outline-none placeholder:text-white/30 focus:border-[#0b74ff] disabled:opacity-60"
            />
          </div>

          <div>
            <Label>Role</Label>
            <select
              value={form.role}
              onChange={(e) => setForm((s) => ({ ...s, role: e.target.value }))}
              disabled={readonly}
              className="h-10 w-full rounded-lg border border-white/10 bg-[#0b0b0e] px-3 text-[13px] text-white/75 outline-none focus:border-[#0b74ff] disabled:opacity-60"
            >
              <option value="">Select role</option>
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>

          <div>
            <Label>Status</Label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm((s) => ({ ...s, status: e.target.value }))
              }
              disabled={readonly}
              className="h-10 w-full rounded-lg border border-white/10 bg-[#0b0b0e] px-3 text-[13px] text-white/75 outline-none focus:border-[#0b74ff] disabled:opacity-60"
            >
              <option value="">Select status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
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

          {readonly ? (
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-lg bg-[#0b74ff] text-[13px] font-semibold text-white hover:bg-[#0a6be8]"
            >
              Done
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={saving}
              className="h-11 rounded-lg bg-[#0b74ff] text-[13px] font-semibold text-white hover:bg-[#0a6be8] disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save & Continue"}
            </button>
          )}
        </div>
      </div>
    </ModalShell>
  );
}
