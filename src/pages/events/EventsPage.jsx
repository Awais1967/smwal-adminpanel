// src/pages/events/EventsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
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

const EVENTS_STORAGE_KEY = "mih_events_rows_v1";

const DEFAULT_ROWS = [
  {
    id: "1",
    name: "Community Hangout",
    location: "Manchester, UK",
    fee: "$15",
    status: "Upcoming",
    regs: 18,
    date: "18 Jun, 2025",
  },
  {
    id: "2",
    name: "Tech Conference",
    location: "San Francisco, USA",
    fee: "$299",
    status: "Upcoming",
    regs: 500,
    date: "22 Sep, 2025",
  },
  {
    id: "3",
    name: "Art Expo",
    location: "New York, USA",
    fee: "$45",
    status: "Draft",
    regs: 200,
    date: "30 Apr, 2025",
  },
  {
    id: "4",
    name: "Wellness Retreat",
    location: "Bali, Indonesia",
    fee: "$450",
    status: "Closed",
    regs: 30,
    date: "12 Nov, 2025",
  },
];

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

function readEventsFromStorage() {
  try {
    const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (!raw) return DEFAULT_ROWS.map((r, i) => normalizeEventRow(r, i));
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : DEFAULT_ROWS;
    return list.map((r, i) => normalizeEventRow(r, i));
  } catch {
    return DEFAULT_ROWS.map((r, i) => normalizeEventRow(r, i));
  }
}

export default function EventsPage() {
  const [rows, setRows] = useState(() => readEventsFromStorage());
  const [activeEvent, setActiveEvent] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(rows));
  }, [rows]);

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
            onView={() => {
              setActiveEvent(r);
              setViewOpen(true);
            }}
            onEdit={() => {
              setActiveEvent(r);
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
          <MetricCard
            icon={<FiCalendar />}
            label="Upcoming Events"
            value="12"
          />
          <MetricCard
            icon={<FiUserCheck />}
            label="Active Registrations"
            value="92"
          />
          <MetricCard icon={<FiGlobe />} label="Countries Covered" value="41" />
          <MetricCard icon={<FiEdit />} label="Draft Events" value="17" />
        </div>
      </div>

      <DataTable
        title="Overview"
        searchPlaceholder="Search by event name, location, or country"
        columns={columns}
        rows={rows}
        total={rows.length}
        primaryAction={
          <Button variant="add" onClick={() => setCreateOpen(true)}>
            + Add Event
          </Button>
        }
      />

      <CreateEventModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={(payload) => {
          setRows((prev) => [normalizeEventRow(payload), ...prev]);
          setCreateOpen(false);
        }}
      />

      <EditEventModal
        open={editOpen}
        event={activeEvent}
        onClose={() => setEditOpen(false)}
        onSave={(id, updates) => {
          setRows((prev) =>
            prev.map((r) =>
              r.id === id ? normalizeEventRow({ ...r, ...updates }) : r,
            ),
          );
          setEditOpen(false);
        }}
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
        onConfirm={() => {
          setRows((prev) => prev.filter((r) => r.id !== activeEvent?.id));
          setDeleteOpen(false);
        }}
      />
    </div>
  );
}
