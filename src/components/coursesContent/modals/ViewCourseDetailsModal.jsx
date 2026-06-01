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
  const cls =
    s === "published"
      ? "border-teal-400/35 bg-teal-400/15 text-teal-200"
      : "border-fuchsia-400/35 bg-fuchsia-400/15 text-fuchsia-200";

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-1 text-[11px] font-semibold ${cls}`}
    >
      {status || "Draft"}
    </span>
  );
}

export default function ViewCourseDetailsModal({ open, onClose, course }) {
  const [tab, setTab] = useState("basic");

  const lessons = useMemo(() => {
    const l = course?.lessons;
    if (!l) return [];
    return Array.isArray(l) ? l : Object.values(l);
  }, [course]);

  return (
    <CourseModalShell
      open={open}
      onClose={onClose}
      title="View Course Details"
      subtitle="Change the lead status to keep tracking accurate."
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
            <div className="space-y-3 text-[12px]">
              <div>
                <div className="text-white/60">Course Title</div>
                <div className="mt-1 text-white/85">{course?.title || "-"}</div>
              </div>

              <div>
                <div className="text-white/60">Category</div>
                <div className="mt-1 text-white/85">
                  {course?.category || "-"}
                </div>
              </div>

              <div>
                <div className="text-white/60">Short Description</div>
                <div className="mt-1 text-white/75">
                  {course?.shortDescription?.trim()
                    ? course.shortDescription
                    : "-"}
                </div>
              </div>

              <div>
                <div className="text-white/60">Cover Photo</div>
                {course?.coverPhoto?.name ? (
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-white/10" />
                    <div className="text-white/75">
                      {course.coverPhoto.name}
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 text-white/45">-</div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div>
                  <div className="text-white/60">Course Status</div>
                  <div className="mt-2">
                    {statusPill(course?.status || "Draft")}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-white/60">Last Modified</div>
                <div className="mt-1 text-white/75">
                  {course?.updatedAt ? formatDate(course.updatedAt) : "-"}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/4 p-4">
            {lessons.length === 0 ? (
              <div className="text-white/60">No lessons found.</div>
            ) : (
              <div className="space-y-6 text-[12px]">
                {lessons.map((l, idx) => (
                  <div key={l.id} className="space-y-3">
                    <div className="text-white/60">Lesson {idx + 1}</div>

                    <div>
                      <div className="text-white/60">Lesson Title</div>
                      <div className="mt-1 text-white/85">{l.title || "-"}</div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <div className="text-white/60">Type</div>
                        <div className="mt-1 text-white/85">
                          {l.type || "-"}
                        </div>
                      </div>

                      <div>
                        <div className="text-white/60">Duration</div>
                        <div className="mt-1 text-white/85">
                          {l.duration || "-"}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-white/60">Lesson Summary</div>
                      <div className="mt-1 text-white/75">
                        {l.summary || "-"}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div>
                        <div className="text-white/60">Lesson Status</div>
                        <div className="mt-2">{statusPill(l.status)}</div>
                      </div>

                      <div>
                        <div className="text-white/60">Last Modified</div>
                        <div className="mt-1 text-white/75">
                          {l.updatedAt ? formatDate(l.updatedAt) : "-"}
                        </div>
                      </div>
                    </div>
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
