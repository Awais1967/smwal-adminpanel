import React, { useEffect, useMemo, useState } from "react";
import { FiSearch, FiPlus, FiTrash2, FiEdit2, FiEye } from "react-icons/fi";
import { FiChevronDown } from "react-icons/fi";
import Button from "../shared/Button";
import IconButton from "../shared/IconButton";
import SelectField from "../shared/SelectField";
import CreateEventModal from "./modals/CreateEventModal";
import EditEventModal from "./modals/EditEventModal";
import ViewEventModal from "./modals/ViewEventModal";
import DeleteEventModal from "./modals/DeleteEventModal";

const STORAGE_KEY = "mih_events_v1";

const STATUS_STYLES = {
  Upcoming: "border-cyan-500/50 bg-cyan-500/10 text-cyan-300",
  Draft: "border-fuchsia-500/50 bg-fuchsia-500/10 text-fuchsia-300",
  Closed: "border-emerald-500/50 bg-emerald-500/10 text-emerald-300",
};

const COUNTRIES = [
  "All",
  "UK",
  "USA",
  "France",
  "Germany",
  "Canada",
  "Indonesia",
];
const STATUSES = ["All", "Upcoming", "Draft", "Closed"];

function formatDate(d) {
  try {
    const date = new Date(d);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return d;
  }
}

function seedEvents(count = 150) {
  const base = [
    {
      id: "evt_1",
      name: "Community Hangout",
      city: "Manchester",
      country: "UK",
      fee: 15,
      status: "Upcoming",
      registrations: 18,
      date: "2025-06-18",
      startTime: "08:00",
      endTime: "18:00",
      description: "A guided in-person gathering organized by the ministry.",
      coverName: "Image.png",
    },
    {
      id: "evt_2",
      name: "Tech Conference",
      city: "San Francisco",
      country: "USA",
      fee: 299,
      status: "Upcoming",
      registrations: 500,
      date: "2025-09-22",
      startTime: "09:00",
      endTime: "17:00",
      description: "A full-day tech and community event.",
    },
    {
      id: "evt_3",
      name: "Art Expo",
      city: "New York",
      country: "USA",
      fee: 45,
      status: "Draft",
      registrations: 200,
      date: "2025-04-30",
      startTime: "10:00",
      endTime: "14:00",
      description: "Explore creative works and community stories.",
    },
    {
      id: "evt_4",
      name: "Food Festival",
      city: "Paris",
      country: "France",
      fee: 25,
      status: "Upcoming",
      registrations: 300,
      date: "2025-07-10",
      startTime: "11:00",
      endTime: "16:00",
      description: "Food, fellowship, and fun.",
    },
    {
      id: "evt_5",
      name: "Startup Pitch Night",
      city: "Berlin",
      country: "Germany",
      fee: 10,
      status: "Draft",
      registrations: 50,
      date: "2025-03-15",
      startTime: "18:00",
      endTime: "20:00",
      description: "Ideas, innovation, and networking.",
    },
    {
      id: "evt_6",
      name: "Music Festival",
      city: "Toronto",
      country: "Canada",
      fee: 120,
      status: "Upcoming",
      registrations: 1000,
      date: "2025-08-05",
      startTime: "12:00",
      endTime: "22:00",
      description: "A celebration of music and worship.",
    },
    {
      id: "evt_7",
      name: "Wellness Retreat",
      city: "Bali",
      country: "Indonesia",
      fee: 450,
      status: "Closed",
      registrations: 30,
      date: "2025-11-12",
      startTime: "09:00",
      endTime: "16:00",
      description: "A restorative retreat experience.",
    },
  ];

  const out = [];
  for (let i = 0; i < count; i++) {
    const b = base[i % base.length];
    out.push({
      ...b,
      id: `evt_${i + 1}`,
      registrations: Math.max(
        0,
        Math.round(b.registrations * (0.7 + (i % 9) * 0.05)),
      ),
      fee: b.fee,
    });
  }
  return out;
}

function readEvents() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = seedEvents(150);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(raw) || [];
  } catch {
    return [];
  }
}

function writeEvents(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

const StatusSelect = ({ value, onChange }) => {
  const cls =
    STATUS_STYLES[value] || "border-white/10 bg-white/5 text-white/80";
  const opts = STATUSES.filter((s) => s !== "All").map((s) => ({
    value: s,
    label: s,
  }));
  return (
    <div className={`inline-flex items-center rounded-md ${cls}`}>
      <SelectField
        value={value}
        onChange={onChange}
        options={opts}
        className="w-[140px]"
      />
    </div>
  );
};

export default function EventsTable({ defaultRowsPerPage = 6 }) {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [country, setCountry] = useState("All");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  // modals
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setEvents(readEvents());
      setLoading(false);
    }, 450);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return events.filter((e) => {
      const matchesSearch =
        !q ||
        e.name.toLowerCase().includes(q) ||
        `${e.city}, ${e.country}`.toLowerCase().includes(q) ||
        e.country.toLowerCase().includes(q);

      const matchesStatus = status === "All" ? true : e.status === status;
      const matchesCountry = country === "All" ? true : e.country === country;

      return matchesSearch && matchesStatus && matchesCountry;
    });
  }, [events, search, status, country]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  const safePage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, safePage, rowsPerPage]);

  const footerText = useMemo(() => {
    const showing = pageItems.length;
    return `Showing Events ${showing} of ${total} in`;
  }, [pageItems.length, total]);

  function persist(next) {
    setEvents(next);
    writeEvents(next);
  }

  function onCreate(payload) {
    const next = [{ ...payload }, ...events];
    persist(next);
  }

  function onUpdate(id, patch) {
    const next = events.map((e) => (e.id === id ? { ...e, ...patch } : e));
    persist(next);
  }

  function onDelete(id) {
    const next = events.filter((e) => e.id !== id);
    persist(next);
  }

  function openEdit(row) {
    setActiveRow(row);
    setEditOpen(true);
  }

  function openView(row) {
    setActiveRow(row);
    setViewOpen(true);
  }

  function openDelete(row) {
    setActiveRow(row);
    setDeleteOpen(true);
  }

  return (
    <div className="mt-6">
      <h3 className="mb-3 text-sm font-semibold text-white/80">Overview</h3>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="relative w-full xl:flex-1">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by event name, location, or country"
            className="h-10 w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-3 text-[13px] text-white placeholder:text-white/35 outline-none focus:border-white/20"
          />
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
          <div className="w-full sm:w-36">
            <SelectField
              value={status}
              onChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
              options={STATUSES}
              className=""
            />
          </div>

          <div className="w-full sm:w-30">
            <SelectField
              value={country}
              onChange={(v) => {
                setCountry(v);
                setPage(1);
              }}
              options={COUNTRIES}
              className=""
            />
          </div>

          <Button variant="add" onClick={() => setCreateOpen(true)}>
            + Add Event
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="overflow-x-auto">
          <table className="min-w-230 w-full border-separate border-spacing-0">
            <thead>
              <tr className="text-left">
                {[
                  "Event Name",
                  "City, Country",
                  "Fee",
                  "Status",
                  "Registrations",
                  "Event Date",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-[11px] font-semibold text-white/70"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                Array.from({ length: rowsPerPage }).map((_, i) => (
                  <tr key={i} className="border-t border-white/5">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-3 w-full animate-pulse rounded bg-white/10" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : pageItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-sm text-white/50"
                  >
                    No events found.
                  </td>
                </tr>
              ) : (
                pageItems.map((row) => (
                  <tr key={row.id} className="border-t border-white/5">
                    <td className="px-4 py-4 text-[12px] text-white/85">
                      <div className="max-w-45 whitespace-normal leading-4">
                        {row.name}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[12px] text-white/65">
                      {row.city}, {row.country}
                    </td>
                    <td className="px-4 py-4 text-[12px] text-white/65">
                      ${row.fee}
                    </td>
                    <td className="px-4 py-4">
                      <StatusSelect
                        value={row.status}
                        onChange={(next) => onUpdate(row.id, { status: next })}
                      />
                    </td>
                    <td className="px-4 py-4 text-[12px] text-white/65">
                      {row.registrations}
                    </td>
                    <td className="px-4 py-4 text-[12px] text-white/65">
                      {formatDate(row.date)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <IconButton
                          onClick={() => openView(row)}
                          icon={FiEye}
                          label="View event"
                          variant="subtle"
                        />
                        <IconButton
                          onClick={() => openEdit(row)}
                          icon={FiEdit2}
                          label="Edit event"
                          variant="edit"
                        />
                        <IconButton
                          onClick={() => openDelete(row)}
                          icon={FiTrash2}
                          label="Delete event"
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
        <div className="mt-3 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-white/45">
            <span>{footerText}</span>

            <div className="relative">
              <div style={{ width: 160 }}>
                <SelectField
                  value={String(rowsPerPage)}
                  onChange={(v) => {
                    setRowsPerPage(Number(v));
                    setPage(1);
                  }}
                  options={[6, 7, 10, 15]}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-8 w-8 rounded-md bg-[#0B67CD] text-white hover:brightness-110 disabled:opacity-40"
              disabled={safePage === 1}
            >
              ‹
            </button>

            {Array.from({ length: Math.min(4, totalPages) }).map((_, i) => {
              const p = i + 1;
              const active = p === safePage;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-8 w-8 rounded-md text-[12px] ${
                    active
                      ? "bg-white/10 text-white"
                      : "bg-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {p}
                </button>
              );
            })}

            {totalPages > 4 && <span className="px-1 text-white/40">…</span>}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 w-8 rounded-md bg-[#0B67CD] text-white hover:brightness-110 disabled:opacity-40"
              disabled={safePage === totalPages}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateEventModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={(payload) => {
          onCreate(payload);
          setCreateOpen(false);
        }}
      />
      <EditEventModal
        open={editOpen}
        event={activeRow}
        onClose={() => setEditOpen(false)}
        onSave={(id, patch) => {
          onUpdate(id, patch);
          setEditOpen(false);
        }}
      />
      <ViewEventModal
        open={viewOpen}
        event={activeRow}
        onClose={() => setViewOpen(false)}
      />
      <DeleteEventModal
        open={deleteOpen}
        event={activeRow}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          if (activeRow?.id) onDelete(activeRow.id);
          setDeleteOpen(false);
        }}
      />
    </div>
  );
}
