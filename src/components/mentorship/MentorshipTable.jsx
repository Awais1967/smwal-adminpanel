import React, { useEffect, useMemo, useState, startTransition } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import { FiEdit2, FiEye, FiTrash2 } from "react-icons/fi";
import IconButton from "../shared/IconButton";
import SelectField from "../shared/SelectField";
import AddSessionModal from "./modals/AddSessionModal";
import EditSessionModal from "./modals/EditSessionModal";
import ViewSessionModal from "./modals/ViewSessionModal";
import DeleteSessionModal from "./modals/DeleteSessionModal";

const STORAGE_KEY = "mih_admin_mentorship_sessions_v1";

const uid = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID()) ||
  `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;

const formatDate = (iso) => {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

const formatSlot = (dateIso, time) => {
  if (!dateIso && !time) return "-";
  const d = dateIso ? formatDate(dateIso) : "-";
  return `${d}${time ? ` - ${time}` : ""}`;
};

const statusStyles = {
  Scheduled: "border-purple-500/50 text-purple-300 bg-purple-500/10",
  Completed: "border-cyan-500/50 text-cyan-300 bg-cyan-500/10",
  Cancelled: "border-red-500/50 text-red-300 bg-red-500/10",
};

function StatusPillSelect({ value, onChange, options }) {
  const cls =
    statusStyles[value] || "border-white/15 text-white/70 bg-white/[0.04]";
  const normalized = options.map((o) => ({ value: o, label: o }));

  return (
    <div className={`inline-block text-xs ${cls} rounded-lg`}>
      <SelectField
        value={value}
        onChange={onChange}
        options={normalized}
        className="w-40"
        placeholder=""
      />
    </div>
  );
}

function SkeletonTable({ rows = 7, cols = 7 }) {
  return (
    <div className="animate-pulse">
      <div className="h-10 w-full rounded-lg bg-white/5" />
      <div className="mt-3 space-y-3">
        {Array.from({ length: rows }).map((_, r) => (
          <div
            key={r}
            className="grid gap-3"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: cols }).map((__, c) => (
              <div key={c} className="h-8 rounded-md bg-white/5" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MentorshipTable({ onStatsChange }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All");
  const [status, setStatus] = useState("All");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [activeRow, setActiveRow] = useState(null);

  // Load from localStorage (no hardcoding; works immediately)
  useEffect(() => {
    const t = setTimeout(() => {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setItems(Array.isArray(parsed) ? parsed : []);
      setLoading(false);
    }, 450); // skeleton feel like API
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const topicOptions = useMemo(() => {
    const set = new Set(items.flatMap((x) => x.topics || []));
    return ["All", ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((row) => {
      const matchesQ =
        !q ||
        row.user1?.toLowerCase().includes(q) ||
        row.user2?.toLowerCase().includes(q) ||
        row.status?.toLowerCase().includes(q) ||
        (row.topics || []).join(", ").toLowerCase().includes(q);

      const matchesTopic =
        topic === "All" || (row.topics || []).includes(topic);
      const matchesStatus = status === "All" || row.status === status;

      return matchesQ && matchesTopic && matchesStatus;
    });
  }, [items, query, topic, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // Compute stats like the screenshot cards
  useEffect(() => {
    const now = new Date();
    const weekFromNow = new Date(now);
    weekFromNow.setDate(now.getDate() + 7);

    const stats = {
      scheduled: items.filter((x) => x.status === "Scheduled").length,
      completed: items.filter((x) => x.status === "Completed").length,
      cancelled: items.filter((x) => x.status === "Cancelled").length,
      thisWeek: items.filter((x) => {
        if (!x.date) return false;
        const d = new Date(x.date);
        return d >= now && d <= weekFromNow;
      }).length,
    };
    onStatsChange?.(stats);
  }, [items, onStatsChange]);

  const openRow = (row, mode) => {
    setActiveRow(row);
    if (mode === "view") setOpenView(true);
    if (mode === "edit") setOpenEdit(true);
    if (mode === "delete") setOpenDelete(true);
  };

  const updateStatus = (id, nextStatus) => {
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, status: nextStatus } : x)),
    );
  };

  const handleCreate = (payload) => {
    const row = {
      id: uid(),
      createdAt: new Date().toISOString(),
      ...payload,
    };
    setItems((prev) => [row, ...prev]);
  };

  const handleEdit = (id, payload) => {
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, ...payload } : x)),
    );
  };

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  // keep page valid when filters change
  useEffect(() => {
    startTransition(() => setPage(1));
  }, [query, topic, status, pageSize]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/3 p-4 md:p-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-130">
          <FaSearch
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
            size={14}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, issue type, or ticket ID"
            className="h-10 w-full rounded-lg border border-white/10 bg-black/30 pl-9 pr-3 text-sm text-white/80 outline-none placeholder:text-white/35"
          />
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto md:justify-end">
          <div className="w-full sm:w-35">
            <SelectField
              value={topic}
              onChange={(v) => setTopic(v)}
              options={topicOptions}
              placeholder="All"
              className=""
            />
          </div>

          <div className="w-full sm:w-30">
            <SelectField
              value={status}
              onChange={(v) => setStatus(v)}
              options={["All", "Scheduled", "Completed", "Cancelled"]}
              className=""
            />
          </div>

          <button
            onClick={() => setOpenAdd(true)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#0B7CFF] px-4 text-sm font-medium text-white hover:brightness-110"
          >
            <FaPlus size={12} />
            Add Session
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
        <div className="overflow-x-auto">
          <div className="min-w-225 bg-white/3 p-4">
            {loading ? (
              <SkeletonTable rows={7} cols={7} />
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-white/65">
                  <tr className="border-b border-white/10">
                    <th className="pb-3">User 1</th>
                    <th className="pb-3">User 2</th>
                    <th className="pb-3">Topic</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Date Created</th>
                    <th className="pb-3">Preferred slot</th>
                    <th className="pb-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-white/80">
                  {paged.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-10 text-center text-white/45"
                      >
                        No sessions found.
                      </td>
                    </tr>
                  ) : (
                    paged.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-white/5 last:border-b-0"
                      >
                        <td className="py-3">{row.user1 || "-"}</td>
                        <td className="py-3">{row.user2 || "-"}</td>
                        <td className="py-3">
                          <div className="max-w-55 truncate text-white/75">
                            {(row.topics || []).join(", ") || "-"}
                          </div>
                        </td>
                        <td className="py-3">
                          <StatusPillSelect
                            value={row.status || "Scheduled"}
                            onChange={(v) => updateStatus(row.id, v)}
                            options={["Scheduled", "Completed", "Cancelled"]}
                          />
                        </td>
                        <td className="py-3 text-white/70">
                          {formatDate(row.createdAt)}
                        </td>
                        <td className="py-3 text-white/70">
                          {formatSlot(row.date, row.time)}
                        </td>
                        <td className="py-3">
                          <div className="flex items-center justify-center gap-3">
                            <IconButton
                              onClick={() => openRow(row, "view")}
                              icon={FiEye}
                              label="View session"
                              variant="subtle"
                            />
                            <IconButton
                              onClick={() => openRow(row, "edit")}
                              icon={FiEdit2}
                              label="Edit session"
                              variant="edit"
                            />
                            <IconButton
                              onClick={() => openRow(row, "delete")}
                              icon={FiTrash2}
                              label="Delete session"
                              variant="danger"
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t border-white/10 bg-black/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-white/55">
            <span>
              Showing Mentorships{" "}
              {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}
            </span>
            <span>to</span>
            <span>{Math.min(page * pageSize, filtered.length)}</span>
            <span>of</span>
            <span>{filtered.length}</span>
            <div className="ml-3 flex items-center gap-2">
              <span>Rows Per Page:</span>
              <div style={{ width: 96 }}>
                <SelectField
                  value={String(pageSize)}
                  onChange={(v) => setPageSize(Number(v))}
                  options={[6, 7, 10, 15]}
                  className=""
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-8 w-8 rounded-md bg-[#0B7CFF] text-white disabled:opacity-40"
              disabled={page <= 1}
              aria-label="prev"
            >
              {"<"}
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(4, totalPages) }).map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-8 w-8 rounded-md border text-xs ${
                      page === p
                        ? "border-[#0B7CFF] bg-[#0B7CFF]/20 text-white"
                        : "border-white/10 bg-black/20 text-white/70 hover:bg-white/5"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              {totalPages > 4 && (
                <span className="px-2 text-xs text-white/40">…</span>
              )}
              {totalPages > 4 && (
                <button
                  onClick={() => setPage(totalPages)}
                  className={`h-8 w-8 rounded-md border text-xs ${
                    page === totalPages
                      ? "border-[#0B7CFF] bg-[#0B7CFF]/20 text-white"
                      : "border-white/10 bg-black/20 text-white/70 hover:bg-white/5"
                  }`}
                >
                  {totalPages}
                </button>
              )}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 w-8 rounded-md bg-[#0B7CFF] text-white disabled:opacity-40"
              disabled={page >= totalPages}
              aria-label="next"
            >
              {">"}
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddSessionModal
        isOpen={openAdd}
        onClose={() => setOpenAdd(false)}
        onSubmit={handleCreate}
      />
      <EditSessionModal
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        session={activeRow}
        onSubmit={(payload) => activeRow && handleEdit(activeRow.id, payload)}
      />
      <ViewSessionModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        session={activeRow}
      />
      <DeleteSessionModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        session={activeRow}
        onConfirm={() => {
          if (!activeRow) return;
          handleDelete(activeRow.id);
          setOpenDelete(false);
        }}
      />
    </div>
  );
}
