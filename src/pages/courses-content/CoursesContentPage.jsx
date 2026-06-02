// src/pages/courses-content/CoursesContentPage.jsx
import React, { useCallback, useMemo, useState } from "react";
import { FiBookOpen, FiFileText, FiVideo, FiGrid } from "react-icons/fi";
import MetricCard from "../../components/shared/MetricCard";
import DataTable from "../../components/shared/DataTable/DataTable";
import StatusPill from "../../components/shared/StatusPill";
import TableActions from "../../components/shared/DataTable/TableActions";
import Button from "../../components/shared/Button";
import CreateCourseModal from "../../components/coursesContent/modals/CreateCourseModal";
import EditCourseModal from "../../components/coursesContent/modals/EditCourseModal";
import ViewCourseDetailsModal from "../../components/coursesContent/modals/ViewCourseDetailsModal";
import DeleteCourseModal from "../../components/coursesContent/modals/DeleteCourseModal";
import useTableData from "../../hooks/useTableData";
import useToast from "../../hooks/useToastHook";
import coursesService from "../../services/courses.service";

const STATUS_OPTIONS = ["Published", "Scheduled", "Draft"];

const getLessonCount = (row) => {
  if (Array.isArray(row.lessonOutline)) return row.lessonOutline.length;
  if (Array.isArray(row.lessons)) return row.lessons.length;
  return Number(row.lessonsCount || row.lessons || 0);
};

const getVideoLessonCount = (row) => {
  const lessons = Array.isArray(row.lessonOutline) ? row.lessonOutline : [];
  if (lessons.length) {
    return lessons.filter((lesson) =>
      String(lesson.type || "").toLowerCase().includes("video"),
    ).length;
  }

  return String(row.lessonType || row.type || "")
    .toLowerCase()
    .includes("video")
    ? 1
    : 0;
};

export default function CoursesContentPage() {
  const toast = useToast();
  const [addOpen, setAddOpen] = useState(false);

  const [activeCourse, setActiveCourse] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const fetchCourses = useCallback((params) => coursesService.list(params), []);
  const table = useTableData({
    fetcher: fetchCourses,
    initialPageSize: 7,
    initialFilters: { status: "All", category: "All" },
  });
  const rows = table.items;

  const columns = useMemo(
    () => [
      { key: "title", header: "Course Title" },
      { key: "category", header: "Category" },
      {
        key: "lessons",
        header: "Lessons",
        cell: (r) => getLessonCount(r),
      },
      {
        key: "status",
        header: "Status",
        cell: (r) => <StatusPill status={r.status} />,
      },
      { key: "updated", header: "Last Updated" },
      {
        key: "actions",
        header: "Actions",
        className: "text-right",
        cell: (r) => (
          <TableActions
            onDelete={() => {
              setActiveCourse(r);
              setDeleteOpen(true);
            }}
            onView={async () => {
              setActiveCourse(r);
              setViewOpen(true);
              try {
                const course = await coursesService.getById(r.id);
                setActiveCourse(course);
              } catch (error) {
                toast.error(error.message);
              }
            }}
            onEdit={async () => {
              setActiveCourse(r);
              setEditOpen(true);
              try {
                const course = await coursesService.getById(r.id);
                setActiveCourse(course);
              } catch (error) {
                toast.error(error.message);
              }
            }}
          />
        ),
      },
    ],
    [toast],
  );

  const summary = useMemo(() => {
    const lessons = rows.reduce((sum, row) => sum + getLessonCount(row), 0);
    const categories = new Set(rows.map((row) => row.category).filter(Boolean));
    return {
      lessons,
      categories: categories.size,
      videos: rows.reduce((sum, row) => sum + getVideoLessonCount(row), 0),
    };
  }, [rows]);

  const categoryOptions = useMemo(() => {
    const categories = [...new Set(rows.map((row) => row.category).filter(Boolean))];
    return categories.map((value) => ({ value, label: value }));
  }, [rows]);

  const setFilter = useCallback(
    (key, value) => table.setFilters((prev) => ({ ...prev, [key]: value })),
    [table],
  );

  const handleCreate = useCallback(
    async (payload) => {
      try {
        await coursesService.create(payload);
        toast.success("Course created.");
        setAddOpen(false);
        table.refresh();
      } catch (error) {
        toast.error(error.message);
      }
    },
    [table, toast],
  );

  const handleUpdate = useCallback(
    async (patch) => {
      if (!activeCourse?.id) return;
      try {
        await coursesService.update(activeCourse.id, patch);
        toast.success("Course updated.");
        setEditOpen(false);
        table.refresh();
      } catch (error) {
        toast.error(error.message);
      }
    },
    [activeCourse, table, toast],
  );

  const handleDelete = useCallback(async () => {
    if (!activeCourse?.id) return;
    try {
      await coursesService.remove(activeCourse.id);
      toast.success("Course deleted.");
      setDeleteOpen(false);
      setActiveCourse(null);
      table.refresh();
    } catch (error) {
      toast.error(error.message);
    }
  }, [activeCourse, table, toast]);

  return (
    <div className="space-y-6">
      {/* ✅ Removed repeated page header block */}

      <div>
        <div className="mb-3 text-sm font-semibold text-white/80">Summary</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={<FiBookOpen />} label="Total Courses" value={table.total} />
          <MetricCard icon={<FiFileText />} label="Total Lessons" value={summary.lessons} />
          <MetricCard icon={<FiVideo />} label="Video Teachings" value={summary.videos} />
          <MetricCard icon={<FiGrid />} label="Categories" value={summary.categories} />
        </div>
      </div>

      <DataTable
        title="Overview"
        searchPlaceholder="Search by course name, category, or lesson title"
        columns={columns}
        rows={rows}
        total={table.total}
        manual
        loading={table.loading}
        error={table.error}
        page={table.page}
        pageSize={table.pageSize}
        onPageChange={table.setPage}
        onPageSizeChange={table.setPageSize}
        searchValue={table.search}
        onSearchChange={table.setSearch}
        statusValue={table.filters.status}
        onStatusChange={(value) => setFilter("status", value)}
        countryValue={table.filters.category}
        onCountryChange={(value) => setFilter("category", value)}
        countryOptions={[
          { value: "All", label: "All Categories" },
          ...categoryOptions,
        ]}
        statusOptions={[
          { value: "All", label: "All" },
          ...STATUS_OPTIONS.map((value) => ({ value, label: value })),
        ]}
        primaryAction={
          <Button variant="add" onClick={() => setAddOpen(true)}>
            + Add Course
          </Button>
        }
      />

      <CreateCourseModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreate={handleCreate}
      />
      <EditCourseModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        course={activeCourse}
        onSave={handleUpdate}
      />

      <ViewCourseDetailsModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        course={activeCourse}
      />

      <DeleteCourseModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        course={activeCourse}
        onConfirm={handleDelete}
      />
    </div>
  );
}
