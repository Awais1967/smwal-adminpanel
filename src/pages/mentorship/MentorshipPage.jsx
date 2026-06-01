// src/pages/mentorship/MentorshipPage.jsx
import React, { useCallback, useMemo, useState } from "react";
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
import useTableData from "../../hooks/useTableData";
import useToast from "../../hooks/useToastHook";
import mentorshipService from "../../services/mentorship.service";

const STATUS_OPTIONS = ["Scheduled", "Completed", "Cancelled"];
const SESSION_TYPE_OPTIONS = ["Remote", "In-person"];

function normalizeSession(session) {
  const topic = session.topic || (session.topics || []).join(", ");
  return {
    ...session,
    topic,
    slot:
      session.slot ||
      `${session.date || ""}${session.time ? ` - ${session.time}` : ""}`,
  };
}

export default function MentorshipPage() {
  const toast = useToast();
  const [activeRow, setActiveRow] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const fetchSessions = useCallback(async (params) => {
    const data = await mentorshipService.list(params);
    return { ...data, items: data.items.map(normalizeSession) };
  }, []);

  const table = useTableData({
    fetcher: fetchSessions,
    initialPageSize: 7,
    initialFilters: { status: "All", sessionType: "All" },
  });

  const rows = table.items;

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
        cell: (r) => r.slot || `${r.date || ""}${r.time ? ` - ${r.time}` : ""}`,
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
            onView={async () => {
              setActiveRow(r);
              setViewOpen(true);
              try {
                const session = await mentorshipService.getById(r.id);
                setActiveRow(normalizeSession(session));
              } catch (error) {
                toast.error(error.message);
              }
            }}
            onEdit={() => {
              setActiveRow(r);
              setEditOpen(true);
            }}
          />
        ),
      },
    ],
    [toast],
  );

  const summary = useMemo(
    () => ({
      scheduled: rows.filter((row) => row.status === "Scheduled").length,
      completed: rows.filter((row) => row.status === "Completed").length,
      cancelled: rows.filter((row) => row.status === "Cancelled").length,
    }),
    [rows],
  );

  const setFilter = useCallback(
    (key, value) => table.setFilters((prev) => ({ ...prev, [key]: value })),
    [table],
  );

  const handleCreate = useCallback(
    async (payload) => {
      try {
        await mentorshipService.create(payload);
        toast.success("Session created.");
        setCreateOpen(false);
        table.refresh();
      } catch (error) {
        toast.error(error.message);
      }
    },
    [table, toast],
  );

  const handleUpdate = useCallback(
    async (updates) => {
      if (!activeRow?.id) return;
      try {
        await mentorshipService.update(activeRow.id, updates);
        toast.success("Session updated.");
        setEditOpen(false);
        table.refresh();
      } catch (error) {
        toast.error(error.message);
      }
    },
    [activeRow, table, toast],
  );

  const handleDelete = useCallback(async () => {
    if (!activeRow?.id) return;
    try {
      await mentorshipService.remove(activeRow.id);
      toast.success("Session deleted.");
      setDeleteOpen(false);
      setActiveRow(null);
      table.refresh();
    } catch (error) {
      toast.error(error.message);
    }
  }, [activeRow, table, toast]);

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-3 text-sm font-semibold text-white/80">Summary</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={<FiCalendar />}
            label="Scheduled sessions"
            value={summary.scheduled}
          />
          <MetricCard
            icon={<FiCheckCircle />}
            label="Completed sessions"
            value={summary.completed}
          />
          <MetricCard
            icon={<FiXCircle />}
            label="Cancelled sessions"
            value={summary.cancelled}
          />
          <MetricCard
            icon={<FiClock />}
            label="Total Sessions"
            value={table.total}
          />
        </div>
      </div>

      <DataTable
        title="Overview"
        searchPlaceholder="Search by user, topic, or session status"
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
        countryValue={table.filters.sessionType}
        onCountryChange={(value) => setFilter("sessionType", value)}
        countryOptions={[
          { value: "All", label: "All Types" },
          ...SESSION_TYPE_OPTIONS.map((value) => ({ value, label: value })),
        ]}
        statusOptions={[
          { value: "All", label: "All" },
          ...STATUS_OPTIONS.map((value) => ({ value, label: value })),
        ]}
        primaryAction={
          <Button variant="add" onClick={() => setCreateOpen(true)}>
            + Add Session
          </Button>
        }
      />

      <AddSessionModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />

      <EditSessionModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        session={activeRow}
        onSubmit={handleUpdate}
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
        onConfirm={handleDelete}
      />
    </div>
  );
}
