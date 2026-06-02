import React, { useMemo, useState } from "react";
import {
  FiArrowDown,
  FiArrowUp,
  FiEdit2,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import SelectField from "../shared/SelectField";
import {
  cleanLessonOutline,
  validateLessonOutline,
} from "./courseOutlineUtils";

const STATUS_OPTIONS = ["Published", "Scheduled", "Draft"];
const LESSON_TYPE_OPTIONS = ["Audio", "Video"];

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const emptyLesson = () => ({
  id: uid(),
  coverPhoto: "",
  title: "",
  description: "",
  type: "",
  summary: "",
  duration: "",
  attachmentUrl: "",
  status: "Draft",
  reflectionText: "",
  keyTakeaways: [],
});

const normalizeLesson = (lesson = {}) => ({
  ...emptyLesson(),
  ...lesson,
  id: lesson.id || lesson._id || uid(),
  keyTakeaways: Array.isArray(lesson.keyTakeaways)
    ? lesson.keyTakeaways
    : String(lesson.keyTakeaways || "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
});

function Field({ label, children }) {
  return (
    <div>
      <label className="text-[12px] font-medium text-white/70">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function textInput(value, onChange, placeholder) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-[12px] text-white/90 outline-none placeholder:text-white/30 focus:border-white/20"
    />
  );
}

function textarea(value, onChange, placeholder, rows = 3) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[12px] text-white/90 outline-none placeholder:text-white/30 focus:border-white/20"
    />
  );
}

export default function CourseOutlineBuilder({ value = [], onChange }) {
  const lessons = useMemo(() => value.map(normalizeLesson), [value]);
  const [draft, setDraft] = useState(emptyLesson);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const updateDraft = (field, nextValue) => {
    setDraft((prev) => ({ ...prev, [field]: nextValue }));
    setError("");
  };

  const resetDraft = () => {
    setDraft(emptyLesson());
    setEditingId(null);
    setError("");
  };

  const saveDraft = () => {
    const normalized = normalizeLesson(draft);
    const message = validateLessonOutline([normalized]);
    if (message) {
      setError(message);
      return;
    }

    const cleaned = cleanLessonOutline([normalized])[0];
    if (editingId) {
      onChange?.(
        lessons.map((lesson) => (lesson.id === editingId ? cleaned : lesson)),
      );
    } else {
      onChange?.([...lessons, { ...cleaned, id: uid() }]);
    }
    resetDraft();
  };

  const removeLesson = (id) => {
    onChange?.(lessons.filter((lesson) => lesson.id !== id));
  };

  const moveLesson = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= lessons.length) return;

    const reordered = [...lessons];
    const [lesson] = reordered.splice(index, 1);
    reordered.splice(nextIndex, 0, lesson);
    onChange?.(reordered);
  };

  return (
    <div className="space-y-4 rounded-xl border border-white/10 bg-white/4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[13px] font-semibold text-white">
            Course Outline
          </div>
          <div className="mt-1 text-[12px] text-white/50">
            {lessons.length} lesson{lessons.length === 1 ? "" : "s"} added
          </div>
        </div>
        {editingId ? (
          <button
            type="button"
            onClick={resetDraft}
            className="h-9 rounded-lg bg-white/5 px-3 text-[12px] font-semibold text-white/70 hover:bg-white/10"
          >
            Cancel Edit
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Field label="Lesson Title">
          {textInput(draft.title, (value) => updateDraft("title", value), "Lesson title")}
        </Field>
        <Field label="Lesson Type">
          <SelectField
            value={draft.type}
            onChange={(value) => updateDraft("type", value)}
            options={LESSON_TYPE_OPTIONS}
            placeholder="Select lesson type"
          />
        </Field>
        <Field label="Duration">
          {textInput(draft.duration, (value) => updateDraft("duration", value), "12 min")}
        </Field>
        <Field label="Lesson Status">
          <SelectField
            value={draft.status}
            onChange={(value) => updateDraft("status", value)}
            options={STATUS_OPTIONS}
            placeholder="Select status"
          />
        </Field>
        <Field label="Cover Photo URL">
          {textInput(draft.coverPhoto, (value) => updateDraft("coverPhoto", value), "https://...")}
        </Field>
        <Field label="Attachment URL">
          {textInput(draft.attachmentUrl, (value) => updateDraft("attachmentUrl", value), "https://...")}
        </Field>
      </div>

      <Field label="Description">
        {textarea(draft.description, (value) => updateDraft("description", value), "What this lesson covers")}
      </Field>
      <Field label="Summary">
        {textarea(draft.summary, (value) => updateDraft("summary", value), "Short lesson summary")}
      </Field>
      <Field label="Reflection Text">
        {textarea(draft.reflectionText, (value) => updateDraft("reflectionText", value), "Reflection prompt for learners")}
      </Field>
      <Field label="Key Takeaways">
        {textarea(
          (draft.keyTakeaways || []).join("\n"),
          (value) =>
            updateDraft(
              "keyTakeaways",
              value
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean),
            ),
          "One takeaway per line",
          4,
        )}
      </Field>

      {error ? <div className="text-[12px] text-[#FF4D4D]">{error}</div> : null}

      <button
        type="button"
        onClick={saveDraft}
        className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0B7BFF] px-4 text-[12px] font-semibold text-white hover:brightness-110"
      >
        <FiPlus />
        {editingId ? "Update Lesson" : "Add Lesson"}
      </button>

      <div className="space-y-3">
        {lessons.length === 0 ? (
          <div className="rounded-lg border border-dashed border-white/10 bg-black/10 px-4 py-6 text-center text-[12px] text-white/45">
            No outline lessons added yet.
          </div>
        ) : (
          lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className="rounded-lg border border-white/10 bg-black/15 p-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-[12px] font-semibold text-white/90">
                    {index + 1}. {lesson.title}
                  </div>
                  <div className="mt-1 text-[11px] text-white/50">
                    {[lesson.type, lesson.duration, lesson.status]
                      .filter(Boolean)
                      .join(" | ")}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveLesson(index, -1)}
                    disabled={index === 0}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/70 hover:bg-white/10 disabled:opacity-30"
                    aria-label="Move lesson up"
                  >
                    <FiArrowUp />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveLesson(index, 1)}
                    disabled={index === lessons.length - 1}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/70 hover:bg-white/10 disabled:opacity-30"
                    aria-label="Move lesson down"
                  >
                    <FiArrowDown />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDraft(normalizeLesson(lesson));
                      setEditingId(lesson.id);
                      setError("");
                    }}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/70 hover:bg-white/10"
                    aria-label="Edit lesson"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeLesson(lesson.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF4D4D]/15 text-[#FF6B6B] hover:bg-[#FF4D4D]/20"
                    aria-label="Delete lesson"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              {lesson.summary ? (
                <div className="mt-2 text-[12px] text-white/60">
                  {lesson.summary}
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
