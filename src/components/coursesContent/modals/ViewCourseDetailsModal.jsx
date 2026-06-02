import React, { useMemo, useState } from "react";
import CourseModalShell from "../_CourseModalShell";
import CourseDetailsTabs from "../CourseDetailsTabs";

function formatDate(d) {
  try {
    const dt = new Date(d);
    return dt.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "-";
  }
}

function statusPill(status) {
  const s = String(status || "").toLowerCase();
  let cls = "border-fuchsia-400/35 bg-fuchsia-400/15 text-fuchsia-200";

  if (s === "published") {
    cls = "border-teal-400/35 bg-teal-400/15 text-teal-200";
  }

  if (s === "scheduled") {
    cls = "border-sky-400/35 bg-sky-400/15 text-sky-200";
  }

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-1 text-[11px] font-semibold ${cls}`}
    >
      {status || "Draft"}
    </span>
  );
}

function Field({ label, value, children }) {
  return (
    <div>
      <div className="text-white/60">{label}</div>
      {children || <div className="mt-1 break-words text-white/75">{value || "-"}</div>}
    </div>
  );
}

export default function ViewCourseDetailsModal({ open, onClose, course }) {
  const [tab, setTab] = useState("basic");

  const lessons = useMemo(() => {
    if (Array.isArray(course?.lessonOutline)) return course.lessonOutline;
    if (Array.isArray(course?.lessons)) return course.lessons;
    return [];
  }, [course]);

  const coverPhoto = course?.coverPhoto || course?.coverPhotoUrl || "";

  return (
    <CourseModalShell
      open={open}
      onClose={onClose}
      title="View Course Details"
      subtitle="Review course information and embedded lesson outline."
      showBack
      footer={
        <button
          type="button"
          onClick={onClose}
          className="h-11 w-full rounded-lg bg-[#0B7BFF] text-[12px] font-semibold text-white hover:brightness-110"
        >
          Done
        </button>
      }
    >
      <div className="space-y-4">
        <CourseDetailsTabs value={tab} onChange={setTab} />

        {tab === "basic" ? (
          <div className="rounded-xl border border-white/10 bg-white/4 p-4">
            <div className="space-y-4 text-[12px]">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Course Title" value={course?.title} />
                <Field label="Category" value={course?.category} />
              </div>

              <Field
                label="Description"
                value={course?.description || course?.shortDescription}
              />

              <Field label="Cover Photo">
                {coverPhoto ? (
                  <div className="mt-2 flex items-center gap-3 break-all">
                    {String(coverPhoto).startsWith("http") ||
                    String(coverPhoto).startsWith("/") ? (
                      <img
                        src={coverPhoto}
                        alt=""
                        className="h-12 w-16 rounded-md object-cover"
                      />
                    ) : (
                      <div className="h-12 w-16 rounded-md bg-white/10" />
                    )}
                    <div className="text-white/75">{coverPhoto}</div>
                  </div>
                ) : (
                  <div className="mt-1 text-white/45">-</div>
                )}
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Course Status">
                  <div className="mt-2">
                    {statusPill(course?.courseStatus || course?.status || "Draft")}
                  </div>
                </Field>
                <Field label="Duration" value={course?.duration} />
                <Field
                  label="Price"
                  value={Number(course?.price || 0).toLocaleString()}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Lesson Type" value={course?.lessonType} />
                <Field label="Lesson Upload" value={course?.lessonUpload} />
              </div>

              <Field
                label="Last Modified"
                value={course?.updatedAt ? formatDate(course.updatedAt) : "-"}
              />
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/4 p-4">
            {lessons.length === 0 ? (
              <div className="text-white/60">No lessons found.</div>
            ) : (
              <div className="space-y-4 text-[12px]">
                {lessons.map((lesson, index) => (
                  <div
                    key={lesson.id || `${lesson.title}-${index}`}
                    className="space-y-3 rounded-lg border border-white/10 bg-black/15 p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="font-semibold text-white/90">
                        Lesson {index + 1}: {lesson.title || "-"}
                      </div>
                      {statusPill(lesson.status)}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field label="Type" value={lesson.type} />
                      <Field label="Duration" value={lesson.duration} />
                    </div>

                    <Field label="Description" value={lesson.description} />
                    <Field label="Summary" value={lesson.summary} />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field label="Cover Photo" value={lesson.coverPhoto} />
                      <Field label="Attachment URL">
                        {lesson.attachmentUrl ? (
                          <a
                            href={lesson.attachmentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 block break-all text-[#6EA8FF] hover:underline"
                          >
                            {lesson.attachmentUrl}
                          </a>
                        ) : (
                          <div className="mt-1 text-white/45">-</div>
                        )}
                      </Field>
                    </div>

                    <Field label="Reflection" value={lesson.reflectionText} />

                    <Field label="Key Takeaways">
                      {Array.isArray(lesson.keyTakeaways) &&
                      lesson.keyTakeaways.length ? (
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-white/75">
                          {lesson.keyTakeaways.map((item, itemIndex) => (
                            <li key={`${item}-${itemIndex}`}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className="mt-1 text-white/45">-</div>
                      )}
                    </Field>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </CourseModalShell>
  );
}
