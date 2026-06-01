// src/pages/courses-content/CoursesContentPage.jsx
import React, { useEffect, useMemo, useState } from "react";
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

const COURSES_STORAGE_KEY = "mih_courses_rows_v1";

const DEFAULT_ROWS = [
  {
    id: "1",
    title: "Purposeful Relationships",
    category: "Foundations",
    lessons: 6,
    status: "Published",
    updated: "18 Jun, 2026",
  },
  {
    id: "2",
    title: "Building Effective Communication",
    category: "Foundations",
    lessons: 7,
    status: "Published",
    updated: "20 Jul, 2025",
  },
  {
    id: "3",
    title: "Embracing Vulnerability",
    category: "Foundations",
    lessons: 8,
    status: "Draft",
    updated: "15 Aug, 2025",
  },
];

function readCoursesFromStorage() {
  try {
    const raw = localStorage.getItem(COURSES_STORAGE_KEY);
    if (!raw) return DEFAULT_ROWS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_ROWS;
  } catch {
    return DEFAULT_ROWS;
  }
}

export default function CoursesContentPage() {
  const [rows, setRows] = useState(() => readCoursesFromStorage());
  const [addOpen, setAddOpen] = useState(false);

  const [activeCourse, setActiveCourse] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(rows));
  }, [rows]);

  const columns = useMemo(
    () => [
      { key: "title", header: "Course Title" },
      { key: "category", header: "Category" },
      { key: "lessons", header: "Lessons" },
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
            onView={() => {
              setActiveCourse(r);
              setViewOpen(true);
            }}
            onEdit={() => {
              setActiveCourse(r);
              setEditOpen(true);
            }}
          />
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      {/* ✅ Removed repeated page header block */}

      <div>
        <div className="mb-3 text-sm font-semibold text-white/80">Summary</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={<FiBookOpen />} label="Total Courses" value="12" />
          <MetricCard icon={<FiFileText />} label="Total Lessons" value="92" />
          <MetricCard icon={<FiVideo />} label="Video Teachings" value="41" />
          <MetricCard icon={<FiGrid />} label="Categories" value="17" />
        </div>
      </div>

      <DataTable
        title="Overview"
        searchPlaceholder="Search by course name, category, or lesson title"
        columns={columns}
        rows={rows}
        total={rows.length}
        primaryAction={
          <Button variant="add" onClick={() => setAddOpen(true)}>
            + Add Course
          </Button>
        }
      />

      <CreateCourseModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreate={(payload) => {
          setRows((prev) => [payload, ...prev]);
          setAddOpen(false);
        }}
      />
      <EditCourseModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        course={activeCourse}
        onSave={(patch) => {
          if (!activeCourse) return;
          setRows((prev) =>
            prev.map((r) =>
              r.id === activeCourse.id ? { ...r, ...patch } : r,
            ),
          );
          setEditOpen(false);
        }}
      />

      <ViewCourseDetailsModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        course={activeCourse}
        onUpdateCourse={(patch) => {
          if (!activeCourse) return;
          setRows((prev) =>
            prev.map((r) =>
              r.id === activeCourse.id ? { ...r, ...patch } : r,
            ),
          );
          setActiveCourse((prev) => (prev ? { ...prev, ...patch } : prev));
        }}
      />

      <DeleteCourseModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        course={activeCourse}
        onConfirm={() => {
          if (!activeCourse) return;
          setRows((prev) => prev.filter((r) => r.id !== activeCourse.id));
          setDeleteOpen(false);
        }}
      />
    </div>
  );
}
