import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaArrowLeft, FaChevronDown } from "react-icons/fa";

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

const Label = ({ children }) => (
  <p className="mb-2 text-xs font-medium text-white/70">{children}</p>
);

const Input = (props) => (
  <input
    {...props}
    className={
      "h-10 w-full rounded-lg border border-white/10 bg-black/30 px-3 text-sm text-white/80 outline-none placeholder:text-white/35 " +
      (props.className || "")
    }
  />
);

function Select({ value, onChange, options, placeholder, loading = false }) {
  const normalized = options.map((option) =>
    typeof option === "object" ? option : { value: option, label: option },
  );

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full appearance-none rounded-lg border border-white/10 bg-black/30 px-3 pr-9 text-sm text-white/70 outline-none"
      >
        <option value="" className="bg-[#141414] text-white">
          {loading ? "Loading users..." : placeholder}
        </option>
        {normalized.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-[#141414] text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
      <FaChevronDown
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white"
        size={12}
      />
    </div>
  );
}

export default function EditSessionModal({
  isOpen,
  loadingUsers = false,
  onClose,
  session,
  onSubmit,
  users = [],
}) {
  const [user2, setUser2] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [status, setStatus] = useState("Scheduled");

  const types = useMemo(() => ["Remote", "In Person", "Hybrid"], []);
  const userOptions = useMemo(() => {
    const options = [...users];
    const currentId = session?.user2Id;

    if (
      currentId &&
      !options.some((option) => String(option.value) === String(currentId))
    ) {
      options.push({
        value: currentId,
        label: session?.user2 || session?.user2Name || "Current user",
      });
    }

    return options;
  }, [session, users]);
  const selectedUser = useMemo(
    () => userOptions.find((option) => String(option.value) === String(user2)),
    [user2, userOptions],
  );

  useEffect(() => {
    if (!isOpen) return;
    const vals = {
      user2: session?.user2Id || "",
      date: session?.date || "",
      time: session?.time || "",
      sessionType: session?.sessionType || "",
      status: session?.status || "Scheduled",
    };
    Promise.resolve().then(() => {
      setUser2(vals.user2);
      setDate(vals.date);
      setTime(vals.time);
      setSessionType(vals.sessionType);
      setStatus(vals.status);
    });
  }, [isOpen, session]);

  const canSubmit = user2 && date && time && sessionType;

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
                Edit Mentorship Session
              </h2>
              <p className="mt-1 text-sm text-white/55">
                Update session details to keep scheduling accurate and
                structured.
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

        <div className="space-y-5">
          <div>
            <Label>User</Label>
            <Select
              value={user2}
              onChange={setUser2}
              options={userOptions}
              placeholder={userOptions.length ? "Select user" : "No users found"}
              loading={loadingUsers}
            />
          </div>

          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <Label>Time</Label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div>
            <Label>Session Type</Label>
            <Select
              value={sessionType}
              onChange={setSessionType}
              options={types}
              placeholder="Select session type"
            />
          </div>

          <div>
            <Label>Status</Label>
            <Select
              value={status}
              onChange={setStatus}
              options={["Scheduled", "Completed", "Cancelled"]}
              placeholder="Select status"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            onClick={onClose}
            className="h-11 w-full rounded-lg border border-white/10 bg-white/3 text-sm font-medium text-white/80 hover:bg-white/6 sm:w-[48%]"
          >
            Cancel
          </button>
          <button
            disabled={!canSubmit}
            onClick={() => {
              if (!canSubmit) return;
              onSubmit?.({
                user2Id: user2,
                user2: selectedUser?.label || "",
                user2Name: selectedUser?.label || "",
                date,
                time,
                sessionType,
                status,
              });
              onClose();
            }}
            className="h-11 w-full rounded-lg bg-[#0B7CFF] text-sm font-medium text-white disabled:bg-white/20 disabled:text-white/50 sm:w-[48%]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </ModalFrame>
  );
}
