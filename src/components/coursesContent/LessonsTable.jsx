import React, { useEffect, useMemo, useState, startTransition } from "react";
import {
  FiSearch,
  FiChevronDown,
  FiPlus,
  FiTrash2,
  FiEdit2,
} from "react-icons/fi";
import Button from "../shared/Button";
import IconButton from "../shared/IconButton";
import SelectField from "../shared/SelectField";
import AddLessonModal from "./modals/AddLessonModal";
import EditLessonModal from "./modals/EditLessonModal";
import DeleteLessonModal from "./modals/DeleteLessonModal";

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
 * lessons are controlled by parent:
 * - courseId
 * - lessons[]
 * - onReplace(nextLessons)
 */
export default function LessonsTable({ courseId, lessons = [], onReplace }) {
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [contentType, setContentType] = useState("All");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // modals
  const [addOpen, setAddOpen] = useState(false);
  const [editLesson, setEditLesson] = useState(null);
  const [deleteLesson, setDeleteLesson] = useState(null);

  useEffect(() => {
    startTransition(() => setLoading(true));
    const t = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(t);
  }, [search, categoryFilter, contentType, page, pageSize]);

  const typesList = useMemo(() => {
    const set = new Set(lessons.map((l) => l.type).filter(Boolean));
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [lessons]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return lessons.filter((l) => {
      const matchesQ =
        !q ||
        String(l.title || "")
          .toLowerCase()
          .includes(q) ||
        String(l.type || "")
          .toLowerCase()
          .includes(q) ||
        String(l.summary || "")
          .toLowerCase()
          .includes(q);

      const matchesType =
        categoryFilter === "All" ? true : l.type === categoryFilter;
      const matchesContent = contentType === "All" ? true : true;

      return matchesQ && matchesType && matchesContent;
    });
  }, [lessons, search, categoryFilter, contentType]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    if (page > totalPages) startTransition(() => setPage(totalPages));
  }, [page, totalPages]);

  const rows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const replace = (next) => onReplace?.(courseId, next);

  return (
    <div>
      {/* filters row inside modal */}
      <div className="mt-3 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
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

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <div className="w-full sm:w-auto">
            <SelectField
              value={categoryFilter}
              onChange={(v) => {
                setCategoryFilter(v);
                setPage(1);
              }}
              options={typesList}
            />
          </div>

          <div className="w-full sm:w-auto">
            <SelectField
              value={contentType}
              onChange={(v) => {
                setContentType(v);
                setPage(1);
              }}
              options={["All", "Content Type"]}
            />
          </div>

          <Button variant="add" onClick={() => setAddOpen(true)}>
            + Add Lesson
          </Button>
        </div>
      </div>

      {/* table */}
      <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-white/4">
        <div className="w-full overflow-x-auto">
          <table className="min-w-245 w-full">
            <thead>
              <tr className="text-left text-[11px] font-semibold text-white/70">
                <th className="px-4 py-3">Lesson Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Lesson Summary</th>
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
                    No lessons found.
                  </td>
                </tr>
              ) : (
                rows.map((l) => (
                  <tr
                    key={l.id}
                    className="border-t border-white/5 hover:bg-white/3"
                  >
                    <td className="px-4 py-3">
                      <div className="max-w-55 whitespace-normal wrap-break-words leading-5 text-white/90">
                        {l.title}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/70">{l.type || "-"}</td>
                    <td className="px-4 py-3 text-white/70">
                      {l.duration || "-"}
                    </td>

                    <td className="px-4 py-3">
                      <div className="inline-flex">
                        <SelectField
                          value={l.status || "Draft"}
                          onChange={(v) => {
                            const next = lessons.map((x) =>
                              x.id === l.id ? { ...x, status: v } : x,
                            );
                            replace(next);
                          }}
                          options={["Published", "Draft"]}
                          className={["w-35", statusColors(l.status)].join(" ")}
                        />
                      </div>
                    </td>

                    <td className="px-4 py-3 text-white/70">
                      <div className="max-w-[320px] truncate">
                        {l.summary || "-"}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <IconButton
                          icon={FiEdit2}
                          label="Edit lesson"
                          onClick={() => setEditLesson(l)}
                          variant="edit"
                        />
                        <IconButton
                          icon={FiTrash2}
                          label="Delete lesson"
                          onClick={() => setDeleteLesson(l)}
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

        <div className="flex flex-col gap-3 border-t border-white/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/55">
            <span>
              Showing lessons{" "}
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
                  options={[6, 10, 15, 20]}
                />
              </div>
            </div>
          </div>

          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>

      {/* Modals */}
      <AddLessonModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={(payload) => {
          const next = [{ ...payload }, ...lessons];
          replace(next);
          setAddOpen(false);
        }}
      />

      <EditLessonModal
        open={!!editLesson}
        onClose={() => setEditLesson(null)}
        lesson={editLesson}
        onSave={(patch) => {
          if (!editLesson) return;
          const next = lessons.map((x) =>
            x.id === editLesson.id ? { ...x, ...patch } : x,
          );
          replace(next);
          setEditLesson(null);
        }}
      />

      <DeleteLessonModal
        open={!!deleteLesson}
        onClose={() => setDeleteLesson(null)}
        onConfirm={() => {
          if (!deleteLesson) return;
          replace(lessons.filter((x) => x.id !== deleteLesson.id));
          setDeleteLesson(null);
        }}
      />
    </div>
  );
}
