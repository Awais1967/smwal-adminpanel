// src/pages/events/EventsPage.jsx
import React, { useCallback, useMemo, useState } from "react";
import { FiCalendar, FiUserCheck, FiGlobe, FiEdit } from "react-icons/fi";
import MetricCard from "../../components/shared/MetricCard";
import DataTable from "../../components/shared/DataTable/DataTable";
import StatusPill from "../../components/shared/StatusPill";
import TableActions from "../../components/shared/DataTable/TableActions";
import Button from "../../components/shared/Button";
import CreateEventModal from "../../components/events/modals/CreateEventModal";
import EditEventModal from "../../components/events/modals/EditEventModal";
import ViewEventModal from "../../components/events/modals/ViewEventModal";
import DeleteEventModal from "../../components/events/modals/DeleteEventModal";
import useTableData from "../../hooks/useTableData";
import useToast from "../../hooks/useToastHook";
import eventsService from "../../services/events.service";

const STATUS_OPTIONS = ["Upcoming", "Draft", "Closed"];
const COUNTRY_OPTIONS = ["UK", "USA", "France", "Germany", "Canada", "Indonesia"];

function parseLocation(location) {
  const parts = String(location || "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  if (!parts.length) return { city: "", country: "" };
  if (parts.length === 1) return { city: parts[0], country: "" };

  return { city: parts[0], country: parts.slice(1).join(", ") };
}

function toFeeLabel(value) {
  const raw =
    typeof value === "string" ? value.replace(/[^0-9.-]/g, "") : value;
  const num = Number(raw);
  if (!Number.isFinite(num)) return "$0";
  return `$${num}`;
}

function normalizeEventRow(row, index = 0) {
  const base = row || {};
  const parsed = parseLocation(base.location);
  const city = String(base.city ?? parsed.city ?? "").trim();
  const country = String(base.country ?? parsed.country ?? "").trim();
  const location =
    String(base.location ?? "").trim() || [city, country].filter(Boolean).join(", ");

  const regsRaw = Number(base.regs ?? base.registrations ?? 0);
  const regs = Number.isFinite(regsRaw) ? regsRaw : 0;

  const fee =
    typeof base.fee === "string" && base.fee.trim().startsWith("$")
      ? base.fee.trim()
      : toFeeLabel(base.fee);

  return {
    ...base,
    id: base.id ?? `evt_seed_${index + 1}`,
    city,
    country,
    location,
    fee,
    regs,
    registrations:
      Number.isFinite(Number(base.registrations)) && base.registrations !== ""
        ? Number(base.registrations)
        : regs,
  };
}

export default function EventsPage() {
  const toast = useToast();
  const [activeEvent, setActiveEvent] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const fetchEvents = useCallback(async (params) => {
    const data = await eventsService.list(params);
    return {
      ...data,
      items: data.items.map((item, index) => normalizeEventRow(item, index)),
    };
  }, []);

  const table = useTableData({
    fetcher: fetchEvents,
    initialPageSize: 7,
    initialFilters: { status: "All", country: "All" },
  });
  const rows = table.items;

  const columns = useMemo(
    () => [
      { key: "name", header: "Event Name" },
      { key: "location", header: "City, Country" },
      { key: "fee", header: "Fee" },
      {
        key: "status",
        header: "Status",
        cell: (r) => <StatusPill status={r.status} />,
      },
      { key: "regs", header: "Registrations" },
      { key: "date", header: "Event Date" },
      {
        key: "actions",
        header: "Actions",
        className: "text-right",
        cell: (r) => (
          <TableActions
            onDelete={() => {
              setActiveEvent(r);
              setDeleteOpen(true);
            }}
            onView={async () => {
              setActiveEvent(r);
              setViewOpen(true);
              try {
                const event = await eventsService.getById(r.id);
                setActiveEvent(normalizeEventRow(event));
              } catch (error) {
                toast.error(error.message);
              }
            }}
            onEdit={() => {
              setActiveEvent(r);
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
      upcoming: rows.filter((row) => row.status === "Upcoming").length,
      draft: rows.filter((row) => row.status === "Draft").length,
      registrations: rows.reduce(
        (sum, row) => sum + Number(row.regs || row.registrations || 0),
        0,
      ),
      countries: new Set(rows.map((row) => row.country).filter(Boolean)).size,
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
        await eventsService.create(payload);
        toast.success("Event created.");
        setCreateOpen(false);
        table.refresh();
      } catch (error) {
        toast.error(error.message);
      }
    },
    [table, toast],
  );

  const handleUpdate = useCallback(
    async (id, updates) => {
      try {
        await eventsService.update(id, updates);
        toast.success("Event updated.");
        setEditOpen(false);
        table.refresh();
      } catch (error) {
        toast.error(error.message);
      }
    },
    [table, toast],
  );

  const handleDelete = useCallback(async () => {
    if (!activeEvent?.id) return;
    try {
      await eventsService.remove(activeEvent.id);
      toast.success("Event deleted.");
      setDeleteOpen(false);
      setActiveEvent(null);
      table.refresh();
    } catch (error) {
      toast.error(error.message);
    }
  }, [activeEvent, table, toast]);

  return (
    <div className="space-y-6">
      {/* ✅ Removed repeated page header block */}

      <div>
        <div className="mb-3 text-sm font-semibold text-white/80">Summary</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={<FiCalendar />}
            label="Upcoming Events"
            value={summary.upcoming}
          />
          <MetricCard
            icon={<FiUserCheck />}
            label="Active Registrations"
            value={summary.registrations}
          />
          <MetricCard icon={<FiGlobe />} label="Countries Covered" value={summary.countries} />
          <MetricCard icon={<FiEdit />} label="Draft Events" value={summary.draft} />
        </div>
      </div>

      <DataTable
        title="Overview"
        searchPlaceholder="Search by event name, location, or country"
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
        countryValue={table.filters.country}
        onCountryChange={(value) => setFilter("country", value)}
        statusValue={table.filters.status}
        onStatusChange={(value) => setFilter("status", value)}
        countryOptions={[
          { value: "All", label: "All Country" },
          ...COUNTRY_OPTIONS.map((value) => ({ value, label: value })),
        ]}
        statusOptions={[
          { value: "All", label: "All" },
          ...STATUS_OPTIONS.map((value) => ({ value, label: value })),
        ]}
        primaryAction={
          <Button variant="add" onClick={() => setCreateOpen(true)}>
            + Add Event
          </Button>
        }
      />

      <CreateEventModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />

      <EditEventModal
        open={editOpen}
        event={activeEvent}
        onClose={() => setEditOpen(false)}
        onSave={handleUpdate}
      />

      <ViewEventModal
        open={viewOpen}
        event={activeEvent}
        onClose={() => setViewOpen(false)}
      />

      <DeleteEventModal
        open={deleteOpen}
        event={activeEvent}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
