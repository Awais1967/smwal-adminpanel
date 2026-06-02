import React, { useEffect, useMemo, useState } from "react";
import { FiUpload } from "react-icons/fi";
import SelectField from "../shared/SelectField";
import coursesService from "../../services/courses.service";
import CourseOutlineBuilder from "./CourseOutlineBuilder";
import {
  cleanLessonOutline,
  validateLessonOutline,
} from "./courseOutlineUtils";

const STATUS_OPTIONS = ["Published", "Scheduled", "Draft"];
const COURSE_TYPE_OPTIONS = ["Audio", "Video"];

const initialForm = (course = {}) => ({
  title: course.title || "",
  category: course.category || "",
  description: course.description || course.shortDescription || "",
  courseStatus: course.courseStatus || course.status || "Draft",
  coverPhoto:
    typeof course.coverPhoto === "string"
      ? course.coverPhoto
      : course.coverPhotoUrl || "",
  lessonType: course.lessonType || "",
  lessonUpload: course.lessonUpload || "",
  duration: course.duration || "",
  price: course.price ?? 0,
});

function Field({ label, children }) {
  return (
    <div>
      <label className="text-[12px] font-medium text-white/70">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function FilePreview({ file, onRemove }) {
  if (!file) return null;

  return (
    <div className="mt-3 inline-flex max-w-full items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/10 text-[11px] font-bold text-white/80">
        {String(file.name || "FILE").split(".").pop()?.toUpperCase() || "FILE"}
      </div>
      <div className="truncate text-[12px] text-white/80">{file.name}</div>
      <button
        type="button"
        onClick={onRemove}
        className="ml-2 shrink-0 rounded-md bg-[#FF4D4D]/15 px-2 py-1 text-[11px] font-semibold text-[#FF4D4D] hover:bg-[#FF4D4D]/20"
      >
        Remove
      </button>
    </div>
  );
}

function FileInput({ accept, file, label, onChange, onRemove }) {
  return (
    <div>
      <label className="mt-2 flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-white/10 bg-white/3 px-4 py-6 text-center hover:bg-white/5">
        <input
          type="file"
          className="hidden"
          accept={accept}
          onChange={(event) => onChange(event.target.files?.[0] || null)}
        />
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
            <FiUpload className="text-white/75" />
          </div>
          <div className="text-[12px] text-white/55">{label}</div>
        </div>
      </label>
      <FilePreview file={file} onRemove={onRemove} />
    </div>
  );
}

export default function CourseForm({ course, mode = "create", onCancel, onSubmit }) {
  const [form, setForm] = useState(() => initialForm(course));
  const [lessons, setLessons] = useState(course?.lessonOutline || []);
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [lessonUploadFile, setLessonUploadFile] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm(initialForm(course));
    setLessons(course?.lessonOutline || []);
    setCoverPhotoFile(null);
    setLessonUploadFile(null);
    setError("");
  }, [course]);

  const canSubmit = useMemo(() => {
    return (
      form.title.trim() &&
      form.category.trim() &&
      form.description.trim() &&
      form.courseStatus &&
      form.duration.trim() &&
      Number(form.price) >= 0
    );
  }, [form]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const uploadFile = async (file) => {
    if (!file) return "";
    const uploaded = await coursesService.upload(file);
    return uploaded.fileUrl || uploaded.url || "";
  };

  const submit = async () => {
    const lessonError = validateLessonOutline(lessons);
    if (!canSubmit) {
      setError("Title, category, description, status, duration, and valid price are required.");
      return;
    }
    if (lessonError) {
      setError(lessonError);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const [coverPhotoUrl, lessonUploadUrl] = await Promise.all([
        uploadFile(coverPhotoFile),
        uploadFile(lessonUploadFile),
      ]);

      await onSubmit?.({
        title: form.title.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        shortDescription: form.description.trim(),
        courseStatus: form.courseStatus,
        status: form.courseStatus,
        coverPhoto: coverPhotoUrl || form.coverPhoto.trim(),
        coverPhotoUrl: coverPhotoUrl || form.coverPhoto.trim(),
        lessonType: form.lessonType.trim(),
        lessonUpload: lessonUploadUrl || form.lessonUpload.trim(),
        duration: form.duration.trim(),
        price: Number(form.price || 0),
        lessonOutline: cleanLessonOutline(lessons),
      });
    } catch (submitError) {
      setError(submitError.message || "Course could not be saved.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Field label="Title">
          <input
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="Enter course title"
            className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-[12px] text-white/90 outline-none placeholder:text-white/30 focus:border-white/20"
          />
        </Field>

        <Field label="Category">
          <input
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
            placeholder="Foundations, Marriage, Parenting..."
            className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-[12px] text-white/90 outline-none placeholder:text-white/30 focus:border-white/20"
          />
        </Field>

        <Field label="Course Status">
          <SelectField
            value={form.courseStatus}
            onChange={(value) => updateField("courseStatus", value)}
            options={STATUS_OPTIONS}
            placeholder="Select status"
          />
        </Field>

        <Field label="Lesson Type">
          <SelectField
            value={form.lessonType}
            onChange={(value) => updateField("lessonType", value)}
            options={COURSE_TYPE_OPTIONS}
            placeholder="Select lesson type"
          />
        </Field>

        <Field label="Duration">
          <input
            value={form.duration}
            onChange={(event) => updateField("duration", event.target.value)}
            placeholder="4 weeks, Self-paced, 2h 30m"
            className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-[12px] text-white/90 outline-none placeholder:text-white/30 focus:border-white/20"
          />
        </Field>

        <Field label="Price">
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(event) => updateField("price", event.target.value)}
            placeholder="0"
            className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-[12px] text-white/90 outline-none placeholder:text-white/30 focus:border-white/20"
          />
        </Field>
      </div>

      <Field label="Description">
        <textarea
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Describe what learners will get from this course"
          rows={4}
          className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[12px] text-white/90 outline-none placeholder:text-white/30 focus:border-white/20"
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Field label="Cover Photo">
          <input
            value={form.coverPhoto}
            onChange={(event) => updateField("coverPhoto", event.target.value)}
            placeholder="Image URL"
            className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-[12px] text-white/90 outline-none placeholder:text-white/30 focus:border-white/20"
          />
          <FileInput
            accept="image/*"
            file={coverPhotoFile}
            label="Upload a cover image"
            onChange={setCoverPhotoFile}
            onRemove={() => setCoverPhotoFile(null)}
          />
        </Field>

        <Field label="Lesson Upload">
          <input
            value={form.lessonUpload}
            onChange={(event) => updateField("lessonUpload", event.target.value)}
            placeholder="Course file URL"
            className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-[12px] text-white/90 outline-none placeholder:text-white/30 focus:border-white/20"
          />
          <FileInput
            accept="video/mp4,audio/*"
            file={lessonUploadFile}
            label="Upload audio or video"
            onChange={setLessonUploadFile}
            onRemove={() => setLessonUploadFile(null)}
          />
        </Field>
      </div>

      <CourseOutlineBuilder value={lessons} onChange={setLessons} />

      {error ? <div className="text-[12px] text-[#FF4D4D]">{error}</div> : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="h-11 rounded-lg bg-white/5 text-[12px] font-semibold text-white/75 hover:bg-white/10 disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit || submitting}
          className={[
            "h-11 rounded-lg text-[12px] font-semibold transition",
            canSubmit && !submitting
              ? "bg-[#0B7BFF] text-white hover:brightness-110"
              : "bg-white/20 text-white/40",
          ].join(" ")}
        >
          {submitting
            ? "Saving..."
            : mode === "edit"
              ? "Save Changes"
              : "Create Course"}
        </button>
      </div>
    </div>
  );
}
