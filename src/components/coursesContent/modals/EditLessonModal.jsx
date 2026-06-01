import React, { useEffect, useMemo, useState, startTransition } from "react";
import CourseModalShell from "../_CourseModalShell";
import SelectField from "../../shared/SelectField";

export default function EditLessonModal({ open, onClose, lesson, onSave }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [summary, setSummary] = useState("");
  const [duration, setDuration] = useState("");
  const [status, setStatus] = useState("");
  const [attachment, setAttachment] = useState(null);

  useEffect(() => {
    if (!lesson) return;
    startTransition(() => {
      setTitle(lesson.title || "");
      setType(lesson.type || "");
      setSummary(lesson.summary || "");
      setDuration(lesson.duration || "");
      setStatus(lesson.status || "Published");
      setAttachment(lesson.attachment || null);
    });
  }, [lesson]);

  const canSubmit = useMemo(
    () => title.trim() && type && status,
    [title, type, status],
  );

  const submit = () => {
    if (!lesson || !canSubmit) return;
    onSave?.({
      title: title.trim(),
      type,
      summary: summary.trim(),
      duration: duration.trim(),
      status,
      attachment,
    });
  };

  return (
    <CourseModalShell
      open={open}
      onClose={onClose}
      title="Edit Lesson"
      subtitle="Update lesson details to keep learning content accurate and structured."
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
            className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-[12px] text-white/90 outline-none focus:border-white/20"
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
            rows={5}
            className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[12px] text-white/90 outline-none focus:border-white/20"
          />
        </div>

        <div>
          <label className="text-[12px] font-medium text-white/70">
            Estimated Duration
          </label>
          <input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-[12px] text-white/90 outline-none focus:border-white/20"
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
            />
          </div>
        </div>

        {attachment?.name ? (
          <div>
            <label className="text-[12px] font-medium text-white/70">
              Attachment (Optional)
            </label>
            <div className="mt-3 inline-flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-[11px] font-bold text-white/80">
                {String(attachment.name).split(".").pop()?.toUpperCase() ||
                  "FILE"}
              </div>
              <div className="text-[12px] text-white/80">{attachment.name}</div>
              <button
                type="button"
                onClick={() => setAttachment(null)}
                className="ml-2 rounded-md bg-[#FF4D4D]/15 px-2 py-1 text-[11px] font-semibold text-[#FF4D4D] hover:bg-[#FF4D4D]/20"
              >
                Remove
              </button>
            </div>
          </div>
        ) : null}

        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-lg bg-white/5 text-[12px] font-semibold text-white/75 hover:bg-white/10"
          >
            Cancel
          </button>

          {/* Screenshot shows "Add Lesson" on this button — keeping the same UI label */}
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
