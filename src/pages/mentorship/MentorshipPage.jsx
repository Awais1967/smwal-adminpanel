// src/pages/mentorship/MentorshipPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { FiCalendar, FiCheckCircle, FiXCircle, FiClock } from "react-icons/fi";
import MetricCard from "../../components/shared/MetricCard";
import DataTable from "../../components/shared/DataTable/DataTable";
import StatusPill from "../../components/shared/StatusPill";
import TableActions from "../../components/shared/DataTable/TableActions";
import Button from "../../components/shared/Button";

import AddSessionModal from "../../components/mentorship/modals/AddSessionModal";
import EditSessionModal from "../../components/mentorship/modals/EditSessionModal";
import ViewSessionModal from "../../components/mentorship/modals/ViewSessionModal";
import DeleteSessionModal from "../../components/mentorship/modals/DeleteSessionModal";

const MENTORSHIP_STORAGE_KEY = "mih_mentorship_rows_v1";

const DEFAULT_ROWS = [
  {
    id: "1",
    user1: "Martin K.",
    user2: "Sarah A.",
    topic: "Communication guidance",
    status: "Completed",
    created: "21 June, 2024",
    slot: "22 June, 2024 - 09:30 AM",
  },
  {
    id: "2",
    user1: "Michael B.",
    user2: "Ava J.",
    topic: "General mentorship",
    status: "Scheduled",
    created: "14 August, 2024",
    slot: "15 August, 2024 - 03:45 PM",
  },
  {
    id: "3",
    user1: "Ethan C.",
    user2: "Sophia L.",
    topic: "Conflict resolution",
    status: "Cancelled",
    created: "27 August, 2024",
    slot: "28 August, 2024 - 10:00 AM",
  },
];

function readMentorshipFromStorage() {
  try {
    const raw = localStorage.getItem(MENTORSHIP_STORAGE_KEY);
    if (!raw) return DEFAULT_ROWS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_ROWS;
  } catch {
    return DEFAULT_ROWS;
  }
}

export default function MentorshipPage() {
  const [rows, setRows] = useState(() => readMentorshipFromStorage());
  const [activeRow, setActiveRow] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(MENTORSHIP_STORAGE_KEY, JSON.stringify(rows));
  }, [rows]);

  const columns = useMemo(
    () => [
      { key: "user1", header: "User 1" },
      { key: "user2", header: "User 2" },
      { key: "topic", header: "Topic" },
      {
        key: "status",
        header: "Status",
        cell: (r) => <StatusPill status={r.status} />,
      },
      { key: "created", header: "Date Created" },
      {
        key: "slot",
        header: "Preferred slot",
        cell: (r) => r.slot || `${r.date || ""}${r.time ? " - " + r.time : ""}`,
      },
      {
        key: "actions",
        header: "Actions",
        className: "text-right",
        cell: (r) => (
          <TableActions
            onDelete={() => {
              setActiveRow(r);
              setDeleteOpen(true);
            }}
            onView={() => {
              setActiveRow(r);
              setViewOpen(true);
            }}
            onEdit={() => {
              setActiveRow(r);
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
      <div>
        <div className="mb-3 text-sm font-semibold text-white/80">Summary</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={<FiCalendar />}
            label="Scheduled sessions"
            value="30"
          />
          <MetricCard
            icon={<FiCheckCircle />}
            label="Completed sessions"
            value="20"
          />
          <MetricCard
            icon={<FiXCircle />}
            label="Cancelled sessions"
            value="4"
          />
          <MetricCard
            icon={<FiClock />}
            label="Sessions This Week"
            value="12"
          />
        </div>
      </div>

      <DataTable
        title="Overview"
        searchPlaceholder="Search by name, issue type, or ticket ID"
        columns={columns}
        rows={rows}
        total={rows.length}
        primaryAction={
          <Button variant="add" onClick={() => setCreateOpen(true)}>
            + Add Session
          </Button>
        }
      />

      <AddSessionModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={(payload) => {
          const id = `m_${Date.now()}`;
          const newRow = {
            id,
            user1: "—",
            user2: payload.user2,
            topic: (payload.topics || []).join(", ") || "",
            status: payload.status,
            created: payload.date,
            slot: `${payload.date} - ${payload.time}`,
            date: payload.date,
            time: payload.time,
            sessionType: payload.sessionType,
            topics: payload.topics,
          };
          setRows((p) => [newRow, ...p]);
          setCreateOpen(false);
        }}
      />

      <EditSessionModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        session={activeRow}
        onSubmit={(updates) => {
          if (!activeRow) return;
          setRows((prev) =>
            prev.map((r) =>
              r.id === activeRow.id
                ? {
                    ...r,
                    user2: updates.user2 || r.user2,
                    date: updates.date || r.date,
                    time: updates.time || r.time,
                    sessionType: updates.sessionType || r.sessionType,
                    status: updates.status || r.status,
                    slot: `${updates.date || r.date} - ${updates.time || r.time}`,
                  }
                : r,
            ),
          );
          setEditOpen(false);
        }}
      />

      <ViewSessionModal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        session={activeRow}
      />

      <DeleteSessionModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        session={activeRow}
        onConfirm={() => {
          if (!activeRow) return;
          setRows((prev) => prev.filter((r) => r.id !== activeRow.id));
          setDeleteOpen(false);
        }}
      />
    </div>
  );
}
