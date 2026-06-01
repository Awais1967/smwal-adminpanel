import React, { useMemo, useState } from "react";
import { FiUpload } from "react-icons/fi";
import SelectField from "../../shared/SelectField";
import CourseModalShell from "../_CourseModalShell";

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

function FilePreview({ file, onRemove }) {
  if (!file) return null;
  return (
    <div className="mt-3 inline-flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-[11px] font-bold text-white/80">
        {String(file.name || "FILE")
          .split(".")
          .pop()
          ?.toUpperCase() || "FILE"}
      </div>
      <div className="text-[12px] text-white/80">{file.name}</div>
      <button
        type="button"
        onClick={onRemove}
        className="ml-2 rounded-md bg-[#FF4D4D]/15 px-2 py-1 text-[11px] font-semibold text-[#FF4D4D] hover:bg-[#FF4D4D]/20"
      >
        Remove
      </button>
    </div>
  );
}

export default function AddLessonModal({ open, onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [summary, setSummary] = useState("");
  const [duration, setDuration] = useState("");
  const [status, setStatus] = useState("");
  const [attachment, setAttachment] = useState(null);

  const canSubmit = useMemo(
    () => title.trim() && type && status,
    [title, type, status],
  );

  const reset = () => {
    setTitle("");
    setType("");
    setSummary("");
    setDuration("");
    setStatus("");
    setAttachment(null);
  };

  const handleClose = () => {
    reset();
    onClose?.();
  };

  const submit = () => {
    if (!canSubmit) return;
    onAdd?.({
      id: uid(),
      title: title.trim(),
      type,
      summary: summary.trim(),
      duration: duration.trim(),
      status,
      attachment,
    });
    handleClose();
  };

  return (
    <CourseModalShell
      open={open}
      onClose={handleClose}
      title="Add Lesson"
      subtitle="Create a new lesson inside this course."
      showBack
    >
      <div className="space-y-4">
        <div>
          <label className="text-[12px] font-medium text-white/70">
            Lesson Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter lesson title"
            className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-[12px] text-white/90 outline-none placeholder:text-white/30 focus:border-white/20"
          />
        </div>

        <div>
          <label className="text-[12px] font-medium text-white/70">
            Lesson Type
          </label>
          <div className="mt-2">
            <SelectField
              value={type}
              onChange={(v) => setType(v)}
              options={[
                "Written and Audio",
                "Video and Interactive",
                "Webinar",
                "E-book",
                "Workshop",
                "Podcast",
              ]}
              placeholder="Select lesson type"
            />
          </div>
        </div>

        <div>
          <label className="text-[12px] font-medium text-white/70">
            Lesson Summary
          </label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Write a one-line description"
            rows={4}
            className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[12px] text-white/90 outline-none placeholder:text-white/30 focus:border-white/20"
          />
        </div>

        <div>
          <label className="text-[12px] font-medium text-white/70">
            Estimated Duration
          </label>
          <input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Example 10 minutes"
            className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-[12px] text-white/90 outline-none placeholder:text-white/30 focus:border-white/20"
          />
        </div>

        <div>
          <label className="text-[12px] font-medium text-white/70">
            Status
          </label>
          <div className="mt-2">
            <SelectField
              value={status}
              onChange={(v) => setStatus(v)}
              options={["Published", "Draft"]}
              placeholder="Select status"
            />
          </div>
        </div>

        <div>
          <label className="text-[12px] font-medium text-white/70">
            Attachment (Optional)
          </label>
          <label className="mt-2 flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-white/10 bg-white/3 px-4 py-6 text-center hover:bg-white/5">
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f)
                  setAttachment({ name: f.name, type: f.type, size: f.size });
              }}
            />
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                <FiUpload className="text-white/75" />
              </div>
              <div className="text-[12px] text-white/55">
                Drop images or click to add
              </div>
            </div>
          </label>

          <FilePreview file={attachment} onRemove={() => setAttachment(null)} />
        </div>

        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleClose}
            className="h-11 rounded-lg bg-white/5 text-[12px] font-semibold text-white/75 hover:bg-white/10"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className={[
              "h-11 rounded-lg text-[12px] font-semibold transition",
              canSubmit
                ? "bg-[#0B7BFF] text-white hover:brightness-110"
                : "bg-white/20 text-white/40",
            ].join(" ")}
          >
            Add Lesson
          </button>
        </div>
      </div>
    </CourseModalShell>
  );
}
