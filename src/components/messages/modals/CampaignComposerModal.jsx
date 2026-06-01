import React, { startTransition, useEffect, useMemo, useState } from "react";
import { FiArrowLeft, FiChevronDown, FiX } from "react-icons/fi";
import Modal from "../../shared/Modal/Modal";

const SEGMENT_OPTIONS = [
  "All Active Users",
  "Inactive 30-Day Users",
  "Newly Registered Users",
  "Event Attendees",
  "Mentorship Applicants",
];

const PRIORITY_OPTIONS = ["Normal", "High", "Low"];

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <div className="text-[13px] font-medium text-white/85">{label}</div>
      {children}
    </div>
  );
}

function Input({ className = "", disabled, ...props }) {
  return (
    <input
      {...props}
      disabled={disabled}
      className={[
        "h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-[13px] text-white placeholder:text-white/35 outline-none transition",
        "focus:border-white/20",
        disabled ? "cursor-not-allowed opacity-75" : "",
        className,
      ].join(" ")}
    />
  );
}

function Textarea({ className = "", disabled, ...props }) {
  return (
    <textarea
      {...props}
      disabled={disabled}
      className={[
        "min-h-26 w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-[13px] text-white placeholder:text-white/35 outline-none transition",
        "focus:border-white/20",
        disabled ? "cursor-not-allowed opacity-75" : "",
        className,
      ].join(" ")}
    />
  );
}

function Select({ children, className = "", disabled, ...props }) {
  return (
    <div className="relative">
      <select
        {...props}
        disabled={disabled}
        className={[
          "h-11 w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-3 pr-10 text-[13px] text-white/85 outline-none transition",
          "focus:border-white/20",
          disabled ? "cursor-not-allowed opacity-75" : "",
          className,
        ].join(" ")}
      >
        {children}
      </select>
      <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/45" />
    </div>
  );
}

export default function CampaignComposerModal({
  open,
  mode = "create",
  campaign,
  onClose,
  onSubmit,
}) {
  const isView = mode === "view";
  const isEdit = mode === "edit";

  const [campaignName, setCampaignName] = useState("");
  const [segment, setSegment] = useState("");
  const [message, setMessage] = useState("");
  const [sendDate, setSendDate] = useState("");
  const [sendTime, setSendTime] = useState("");
  const [priority, setPriority] = useState("Normal");

  useEffect(() => {
    if (!open) return;

    startTransition(() => {
      setCampaignName(campaign?.campaignName || "");
      setSegment(campaign?.segment || "");
      setMessage(campaign?.message || "");
      setSendDate(campaign?.sendDate || "");
      setSendTime(campaign?.sendTime || "");
      setPriority(campaign?.priority || "Normal");
    });
  }, [campaign, open]);

  const title = useMemo(() => {
    if (isView) return "Campaign Details";
    if (isEdit) return "Edit Campaign Modal";
    return "New Campaign Modal";
  }, [isEdit, isView]);

  const subtitle = useMemo(() => {
    if (isView) return "Review this campaign before making changes.";
    return "Add a new campaign and send to users.";
  }, [isView]);

  const canSubmit = useMemo(() => {
    return (
      campaignName.trim().length > 0 &&
      segment &&
      message.trim().length > 0 &&
      sendDate &&
      sendTime &&
      priority
    );
  }, [campaignName, message, priority, segment, sendDate, sendTime]);

  const payload = useMemo(
    () => ({
      campaignName: campaignName.trim(),
      segment,
      message: message.trim(),
      sendDate,
      sendTime,
      priority,
    }),
    [campaignName, message, priority, segment, sendDate, sendTime],
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="max-w-[720px] border-white/10 bg-[#101010] shadow-[0_24px_80px_rgba(0,0,0,0.68)]"
    >
      <div className="flex items-start justify-between gap-3 px-5 py-5">
        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={onClose}
            className="mt-0.5 rounded-md p-2 text-white/75 transition hover:bg-white/5 hover:text-white"
            aria-label="Back"
          >
            <FiArrowLeft size={18} />
          </button>

          <div>
            <div className="text-[16px] font-semibold text-white">{title}</div>
            <div className="mt-1 text-[13px] text-white/60">{subtitle}</div>
          </div>
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

      <div className="max-h-[70vh] overflow-y-auto px-5 pb-5">
        <div className="space-y-5">
          <Field label="Campaign Name">
            <Input
              placeholder="e.g. June Re-engagement Drive"
              value={campaignName}
              onChange={(event) => setCampaignName(event.target.value)}
              disabled={isView}
            />
          </Field>

          <Field label="Target Segment">
            <Select
              value={segment}
              onChange={(event) => setSegment(event.target.value)}
              disabled={isView}
            >
              <option value="" className="bg-[#141414]">
                e.g. All Active Users
              </option>
              {SEGMENT_OPTIONS.map((option) => (
                <option key={option} value={option} className="bg-[#141414]">
                  {option}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Message">
            <Textarea
              rows={4}
              placeholder="Write a one-line event summary"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              disabled={isView}
            />
          </Field>

          <Field label="Send Date">
            <Input
              type="date"
              value={sendDate}
              onChange={(event) => setSendDate(event.target.value)}
              disabled={isView}
            />
          </Field>

          <Field label="Send Time">
            <Input
              type="time"
              value={sendTime}
              onChange={(event) => setSendTime(event.target.value)}
              disabled={isView}
            />
          </Field>

          <Field label="Priority">
            <Select
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              disabled={isView}
            >
              <option value="" className="bg-[#141414]">
                Normal / High / Low
              </option>
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option} value={option} className="bg-[#141414]">
                  {option}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
        {isView ? (
          <button
            type="button"
            onClick={onClose}
            className="h-12 w-full rounded-lg border border-white/10 bg-white/5 text-[14px] font-semibold text-white/85 transition hover:bg-white/8"
          >
            Close
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onSubmit?.(payload, "draft")}
              disabled={!canSubmit}
              className="h-12 w-full rounded-lg border border-white/10 bg-white/5 text-[14px] font-semibold text-white/85 transition hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-50 sm:w-1/2"
            >
              Save As Draft
            </button>

            <button
              type="button"
              onClick={() =>
                onSubmit?.(payload, isEdit ? "save" : "publish")
              }
              disabled={!canSubmit}
              className="h-12 w-full rounded-lg bg-[#2F6CF6] text-[14px] font-semibold text-white transition hover:bg-[#285FDC] disabled:cursor-not-allowed disabled:opacity-50 sm:w-1/2"
            >
              {isEdit ? "Save Details" : "Add Campaign"}
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}
