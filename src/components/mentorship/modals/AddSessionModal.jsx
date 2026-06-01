import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaArrowLeft, FaPlus, FaChevronDown } from "react-icons/fa";

const topicsSeed = [
  "Pre-marriage preparation",
  "Conflict resolution",
  "Family involvement",
  "Effective communication",
  "General mentorship",
];

function ModalFrame({ isOpen, onClose, children }) {
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
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

const FieldLabel = ({ children }) => (
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

const TextArea = (props) => (
  <textarea
    {...props}
    className={
      "min-h-24 w-full resize-none rounded-lg border border-white/10 bg-black/30 px-3 py-3 text-sm text-white/80 outline-none placeholder:text-white/35 " +
      (props.className || "")
    }
  />
);

function Select({ value, onChange, options, placeholder }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full appearance-none rounded-lg border border-white/10 bg-black/30 px-3 pr-9 text-sm text-white/70 outline-none"
      >
        <option value="" className="bg-[#141414] text-white">
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#141414] text-white">
            {o}
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

function TopicChip({ label, selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${
        selected
          ? "border-[#0B7CFF]/50 bg-[#0B7CFF]/15 text-white"
          : "border-white/10 bg-white/3 text-white/70 hover:bg-white/5"
      }`}
    >
      <FaPlus size={10} className={selected ? "opacity-90" : "opacity-60"} />
      {label}
    </button>
  );
}

export default function AddSessionModal({ isOpen, onClose, onSubmit }) {
  const [user, setUser] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [status, setStatus] = useState("Scheduled");

  const canSubmit =
    user && selectedTopics.length > 0 && date && time && sessionType;

  const users = useMemo(
    () => ["Sarah J.", "Martin K.", "Emily R.", "John D.", "Olivia P."],
    [],
  );
  const types = useMemo(() => ["Remote", "In-person"], []);

  useEffect(() => {
    if (!isOpen) return;
    const id = setTimeout(() => {
      setUser("");
      setSelectedTopics([]);
      setDate("");
      setTime("");
      setSessionType("");
      setStatus("Scheduled");
    }, 0);
    return () => clearTimeout(id);
  }, [isOpen]);

  const toggleTopic = (t) => {
    setSelectedTopics((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  };

  return (
    <ModalFrame isOpen={isOpen} onClose={onClose}>
      <div className="relative p-4 md:p-8">
        {/* header */}
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
                Add Mentorship Session
              </h2>
              <p className="mt-1 text-sm text-white/55">
                Book a session with a user to give guidance and clarity in their
                journey.
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
            <FieldLabel>Select User</FieldLabel>
            <Select
              value={user}
              onChange={setUser}
              options={users}
              placeholder="e.g. Sarah J."
            />
          </div>

          <div>
            <FieldLabel>Choose a Topic</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {topicsSeed.map((t) => (
                <TopicChip
                  key={t}
                  label={t}
                  selected={selectedTopics.includes(t)}
                  onToggle={() => toggleTopic(t)}
                />
              ))}
            </div>
          </div>

          <div>
            <FieldLabel>Choose Date</FieldLabel>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="e.g. 17 Feb, 2026"
            />
          </div>

          <div>
            <FieldLabel>Choose Time</FieldLabel>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 10:00 AM"
            />
          </div>

          <div>
            <FieldLabel>Session Type</FieldLabel>
            <Select
              value={sessionType}
              onChange={setSessionType}
              options={types}
              placeholder="e.g. Remote"
            />
          </div>

          <div>
            <FieldLabel>Status</FieldLabel>
            <Select
              value={status}
              onChange={setStatus}
              options={["Scheduled", "Completed", "Cancelled"]}
              placeholder="Select status"
            />
          </div>
        </div>

        {/* footer */}
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
                user1: "—",
                user2: user,
                topics: selectedTopics,
                date,
                time,
                sessionType,
                status,
              });
              onClose();
            }}
            className="h-11 w-full rounded-lg bg-[#0B7CFF] text-sm font-medium text-white disabled:bg-white/20 disabled:text-white/50 sm:w-[48%]"
          >
            Add Session
          </button>
        </div>
      </div>
    </ModalFrame>
  );
}
