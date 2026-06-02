import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  startTransition,
} from "react";
import {
  FiSearch,
  FiChevronDown,
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiEye,
} from "react-icons/fi";
import Button from "../shared/Button";
import IconButton from "../shared/IconButton";
import SelectField from "../shared/SelectField";
import CoursesSummary from "./CoursesSummary";
import CreateCourseModal from "./modals/CreateCourseModal";
import EditCourseModal from "./modals/EditCourseModal";
import ViewCourseDetailsModal from "./modals/ViewCourseDetailsModal";
import DeleteCourseModal from "./modals/DeleteCourseModal";

const LS_KEY = "mih_courses_content_v1";

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

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

function statusColors(status) {
  const s = String(status || "").toLowerCase();
  if (s === "published")
    return "border-teal-400/35 bg-teal-400/15 text-teal-200";
  return "border-fuchsia-400/35 bg-fuchsia-400/15 text-fuchsia-200";
}

function SkeletonRow({ cols = 6 }) {
  return (
    <tr className="border-t border-white/5">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3 w-full max-w-55 animate-pulse rounded bg-white/10" />
        </td>
      ))}
    </tr>
  );
}

function Pagination({ page, totalPages, onChange }) {
  const pages = useMemo(() => {
    const max = 5;
    const start = Math.max(1, page - 1);
    const end = Math.min(totalPages, start + (max - 1));
    const s = Math.max(1, end - (max - 1));
    return Array.from({ length: end - s + 1 }, (_, i) => s + i);
  }, [page, totalPages]);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        className="h-8 w-8 rounded-md bg-white/5 text-white/70 hover:bg-white/10"
        aria-label="Previous page"
      >
        &lt;
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={[
            "h-8 w-8 rounded-md text-[12px] font-medium",
            p === page
              ? "bg-[#0B7BFF] text-white"
              : "bg-white/5 text-white/70 hover:bg-white/10",
          ].join(" ")}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        className="h-8 w-8 rounded-md bg-white/5 text-white/70 hover:bg-white/10"
        aria-label="Next page"
      >
        {">"}
      </button>
    </div>
  );
}

/**
 * Fully functional (no hardcoded rows):
 * - Stores data in localStorage (CRUD ready)
 * - Skeleton loading on filters/pagination changes
 */
export default function CoursesTable() {
  // ---------- data store ----------
  const [courses, setCourses] = useState([]);
  const loadedOnce = useRef(false);

  // ---------- UI state ----------
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [contentType, setContentType] = useState("All");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // ---------- modals ----------
  const [createOpen, setCreateOpen] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [viewCourse, setViewCourse] = useState(null);
  const [deleteCourse, setDeleteCourse] = useState(null);

  // ---------- initial load ----------
  useEffect(() => {
    if (loadedOnce.current) return;
    loadedOnce.current = true;
    const t = setTimeout(() => {
      const raw = localStorage.getItem(LS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setCourses(Array.isArray(parsed) ? parsed : []);
      setLoading(false);
    }, 350);

    return () => clearTimeout(t);
  }, []);

  const persist = (next) => {
    setCourses(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  };

  // “lazy load” feel for table changes (skeleton)
  useEffect(() => {
    if (!loadedOnce.current) return;
    startTransition(() => setLoading(true));
    const t = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(t);
  }, [search, categoryFilter, contentType, page, pageSize]);

  // ---------- derived ----------
  const metrics = useMemo(() => {
    const totalCourses = courses.length;
    const totalLessons = courses.reduce(
      (acc, c) => acc + (c.lessons?.length || 0),
      0,
    );
    const videoTeachings = courses
      .flatMap((c) => c.lessons || [])
      .filter((l) =>
        String(l.type || "")
          .toLowerCase()
          .includes("video"),
      ).length;
    const categories = new Set(courses.map((c) => c.category).filter(Boolean))
      .size;

    return { totalCourses, totalLessons, videoTeachings, categories };
  }, [courses]);

  const categoriesList = useMemo(() => {
    const set = new Set(courses.map((c) => c.category).filter(Boolean));
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [courses]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return courses.filter((c) => {
      const matchesQ =
        !q ||
        String(c.title || "")
          .toLowerCase()
          .includes(q) ||
        String(c.category || "")
          .toLowerCase()
          .includes(q);

      const matchesCat =
        categoryFilter === "All" || c.category === categoryFilter;

      // Content Type filter is included for UI parity; you can wire it to backend types later.
      const matchesType = contentType === "All" ? true : true;

      return matchesQ && matchesCat && matchesType;
    });
  }, [courses, search, categoryFilter, contentType]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    if (page > totalPages) {
      startTransition(() => setPage(totalPages));
    }
  }, [page, totalPages]);

  const rows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // ---------- CRUD ----------
  const createCourse = (payload) => {
    const now = new Date().toISOString();
    const next = [
      {
        id: uid(),
        title: payload.title,
        category: payload.category,
        shortDescription: payload.shortDescription || "",
        status: payload.status,
        coverPhoto: payload.coverPhoto || null,
        updatedAt: now,
        createdAt: now,
        lessons: [],
      },
      ...courses,
    ];
    persist(next);
  };

  const updateCourse = (id, patch) => {
    const now = new Date().toISOString();
    const next = courses.map((c) =>
      c.id === id ? { ...c, ...patch, updatedAt: now } : c,
    );
    persist(next);
  };

  const removeCourse = (id) => {
    const next = courses.filter((c) => c.id !== id);
    persist(next);
  };

  // ---------- UI ----------
  return (
    <div className="space-y-5">
      <div>
        <div className="text-[14px] font-semibold text-white/80">Summary</div>
        <div className="mt-3">
          <CoursesSummary metrics={metrics} />
        </div>
      </div>

      <div>
        <div className="text-[14px] font-semibold text-white/80">Overview</div>

        <div className="mt-3 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          {/* Search */}
          <div className="relative w-full xl:max-w-130">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/45" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by course name, category, or lesson title"
              className="h-10 w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-[12px] text-white/90 outline-none placeholder:text-white/35 focus:border-white/20"
            />
          </div>

          {/* Filters + action */}
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <div className="w-full sm:w-auto">
              <SelectField
                value={categoryFilter}
                onChange={(v) => {
                  setCategoryFilter(v);
                  setPage(1);
                }}
                options={categoriesList}
              />
            </div>

            <div className="w-full sm:w-auto">
              <SelectField
                value={contentType}
                onChange={(v) => {
                  setContentType(v);
                  setPage(1);
                }}
                options={["All", "Course", "Lesson"]}
              />
            </div>

            <Button variant="add" onClick={() => setCreateOpen(true)}>
              + Add Course
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-white/4">
          <div className="w-full overflow-x-auto">
            <table className="min-w-225 w-full">
              <thead>
                <tr className="text-left text-[11px] font-semibold text-white/70">
                  <th className="px-4 py-3">Course Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Lessons</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Last Updated</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="text-[12px] text-white/80">
                {loading ? (
                  <>
                    <SkeletonRow cols={6} />
                    <SkeletonRow cols={6} />
                    <SkeletonRow cols={6} />
                    <SkeletonRow cols={6} />
                    <SkeletonRow cols={6} />
                    <SkeletonRow cols={6} />
                  </>
                ) : rows.length === 0 ? (
                  <tr className="border-t border-white/5">
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-white/50"
                    >
                      No courses found.
                    </td>
                  </tr>
                ) : (
                  rows.map((c) => (
                    <tr
                      key={c.id}
                      className="border-t border-white/5 hover:bg-white/3"
                    >
                      <td className="px-4 py-3">
                        <div className="max-w-60 whitespace-normal wrap-break-words leading-5 text-white/90">
                          {c.title}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white/70">
                        {c.category || "-"}
                      </td>
                      <td className="px-4 py-3 text-white/70">
                        {c.lessons?.length || 0}
                      </td>

                      <td className="px-4 py-3">
                        {/* status pill-style select */}
                        <div className="inline-flex">
                          <SelectField
                            value={c.status || "Draft"}
                            onChange={(v) => updateCourse(c.id, { status: v })}
                            options={["Published", "Draft"]}
                            className={[
                              "w-[140px]",
                              statusColors(c.status),
                            ].join(" ")}
                          />
                        </div>
                      </td>

                      <td className="px-4 py-3 text-white/70">
                        {c.updatedAt ? formatDate(c.updatedAt) : "-"}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-3">
                          <IconButton
                            icon={FiEye}
                            label="View course"
                            onClick={() => setViewCourse(c)}
                            variant="subtle"
                          />
                          <IconButton
                            icon={FiEdit2}
                            label="Edit course"
                            onClick={() => setEditCourse(c)}
                            variant="edit"
                          />
                          <IconButton
                            icon={FiTrash2}
                            label="Delete course"
                            onClick={() => setDeleteCourse(c)}
                            variant="danger"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-3 border-t border-white/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/55">
              <span>
                Showing Courses{" "}
                <span className="text-white/75">{rows.length}</span> of{" "}
                <span className="text-white/75">{filtered.length}</span> in
              </span>

              <div>
                <div style={{ width: 160 }}>
                  <SelectField
                    value={String(pageSize)}
                    onChange={(v) => {
                      setPageSize(Number(v));
                      setPage(1);
                    }}
                    options={[6, 7, 10, 15, 20]}
                  />
                </div>
              </div>
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateCourseModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={(payload) => {
          createCourse(payload);
          setCreateOpen(false);
        }}
      />

      <EditCourseModal
        open={!!editCourse}
        onClose={() => setEditCourse(null)}
        course={editCourse}
        onSave={(patch) => {
          if (!editCourse) return;
          updateCourse(editCourse.id, patch);
          setEditCourse(null);
        }}
      />

      <ViewCourseDetailsModal
        open={!!viewCourse}
        onClose={() => setViewCourse(null)}
        course={viewCourse}
        onUpdateCourse={(patch) => {
          if (!viewCourse) return;
          updateCourse(viewCourse.id, patch);
          // keep modal course fresh
          setViewCourse((prev) => (prev ? { ...prev, ...patch } : prev));
        }}
        onReplaceLessons={(courseId, nextLessons) => {
          updateCourse(courseId, { lessons: nextLessons });
          setViewCourse((prev) =>
            prev?.id === courseId ? { ...prev, lessons: nextLessons } : prev,
          );
        }}
      />

      <DeleteCourseModal
        open={!!deleteCourse}
        onClose={() => setDeleteCourse(null)}
        course={deleteCourse}
        onConfirm={() => {
          if (!deleteCourse) return;
          removeCourse(deleteCourse.id);
          setDeleteCourse(null);
        }}
      />
    </div>
  );
}
