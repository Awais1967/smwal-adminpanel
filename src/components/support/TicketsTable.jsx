import React, { useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiTrash2,
  FiEye,
  FiEdit2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import SupportTicketModal from "./modals/SupportTicketModal";
import DeleteTicketModal from "./modals/DeleteTicketModal";
import IconButton from "../shared/IconButton";
import SelectField from "../shared/SelectField";

const DEFAULT_PAGE_SIZE = 6;

const ISSUE_TYPES = [
  "All",
  "Billing",
  "Account",
  "Events",
  "Courses",
  "Mentorship",
  "Other",
];
const STATUSES = ["All", "New", "In Progress", "Resolved", "Urgent"];

const statusStyles = {
  New: "bg-[#062f33] text-[#22d3ee] border-[#0ea5a4]",
  "In Progress": "bg-[#24153b] text-[#c084fc] border-[#7c3aed]",
  Resolved: "bg-[#052a18] text-[#34d399] border-[#16a34a]",
  Urgent: "bg-[#2b0a0a] text-[#f87171] border-[#ef4444]",
};

function StatusPillSelect({ value, onChange }) {
  const cls = statusStyles[value] || "bg-white/5 text-white/70 border-white/10";
  const opts = STATUSES.filter((s) => s !== "All").map((s) => ({
    value: s,
    label: s,
  }));
  return (
    <div className={cls + " rounded-md"}>
      <SelectField
        value={value}
        onChange={onChange}
        options={opts}
        className="min-w-30"
      />
    </div>
  );
}

function useDebounced(value, delay = 350) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

function Pagination({ page, pageCount, onChange }) {
  const pages = useMemo(() => {
    const arr = [];
    const max = Math.min(pageCount, 8);
    for (let i = 1; i <= max; i++) arr.push(i);
    return arr;
  }, [pageCount]);

  return (
    <div className="flex items-center gap-2">
      <button
        className="grid h-8 w-8 place-items-center rounded-md bg-[#0b74ff] text-white disabled:opacity-40"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        type="button"
      >
        <FiChevronLeft />
      </button>

      <div className="flex items-center gap-2">
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={[
              "grid h-8 w-8 place-items-center rounded-md border text-[12px]",
              p === page
                ? "border-[#0b74ff] bg-[#0b74ff] text-white"
                : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
            ].join(" ")}
          >
            {p}
          </button>
        ))}
        {pageCount > pages.length && (
          <span className="px-1 text-white/50">...</span>
        )}
      </div>

      <button
        className="grid h-8 w-8 place-items-center rounded-md bg-[#0b74ff] text-white disabled:opacity-40"
        onClick={() => onChange(Math.min(pageCount, page + 1))}
        disabled={page >= pageCount}
        type="button"
      >
        <FiChevronRight />
      </button>
    </div>
  );
}

export default function TicketsTable({
  fetchTickets, // REQUIRED for real data
  onDeleteTicket, // async (ticket) => void
  onSendReply, // async ({ ticketId, reply }) => void
}) {
  const [search, setSearch] = useState("");
  const [issueType, setIssueType] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const debouncedSearch = useDebounced(search);

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [replyMode, setReplyMode] = useState(false);
  const [active, setActive] = useState(null);

  useEffect(() => {
    let alive = true;
    const run = async () => {
      setLoading(true);
      try {
        if (!fetchTickets) {
          if (!alive) return;
          setRows([]);
          setTotal(0);
          return;
        }
        const res = await fetchTickets({
          page,
          pageSize,
          search: debouncedSearch,
          issueType: issueType === "All" ? "" : issueType,
          status: status === "All" ? "" : status,
        });
        if (!alive) return;
        setRows(res?.items || []);
        setTotal(res?.total ?? 0);
      } finally {
        if (alive) setLoading(false);
      }
    };
    run();
    return () => {
      alive = false;
    };
  }, [fetchTickets, page, pageSize, debouncedSearch, issueType, status]);

  const pageCount = Math.max(1, Math.ceil((total || 0) / pageSize));
  const showingFrom = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo = Math.min(page * pageSize, total || 0);

  return (
    <div className="mt-4">
      {/* Filters row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full items-center gap-3">
          <div className="relative w-full max-w-130">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, email, ticket ID, or issue"
              className="h-10 w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-[13px] text-white/80 outline-none placeholder:text-white/35 focus:border-[#0b74ff]"
            />
          </div>

          <div>
            <SelectField
              value={issueType}
              onChange={(v) => {
                setIssueType(v);
                setPage(1);
              }}
              options={ISSUE_TYPES.map((t) => ({
                value: t,
                label: t === "All" ? "Issue Type" : t,
              }))}
            />
          </div>

          <div>
            <SelectField
              value={status}
              onChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
              options={STATUSES.map((s) => ({
                value: s,
                label: s === "All" ? "Status" : s,
              }))}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-white/5">
        <div className="overflow-x-auto">
          <table className="min-w-245 w-full">
            <thead className="border-b border-white/10">
              <tr className="text-left text-[12px] font-medium text-white/60">
                <th className="px-5 py-4">Ticket ID</th>
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Issue Type</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Date Submitted</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {loading ? (
                Array.from({ length: pageSize }).map((_, i) => (
                  <tr key={i} className="text-[13px] text-white/70">
                    {Array.from({ length: 6 }).map((__, c) => (
                      <td key={c} className="px-5 py-4">
                        <div className="h-4 w-full max-w-45 animate-pulse rounded bg-white/10" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-[13px] text-white/45"
                  >
                    No tickets found.
                  </td>
                </tr>
              ) : (
                rows.map((t) => (
                  <tr key={t.id} className="text-[13px] text-white/75">
                    <td className="px-5 py-4">{t.id}</td>
                    <td className="px-5 py-4">
                      <div className="leading-5">
                        <div className="text-white/80">{t.user}</div>
                        <div className="text-[12px] text-white/45">
                          {t.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">{t.issueType}</td>
                    <td className="px-5 py-4">
                      <StatusPillSelect
                        value={t.status}
                        onChange={() => {
                          /* keep UI consistent; wire to API if needed */
                        }}
                      />
                    </td>
                    <td className="px-5 py-4">{t.dateSubmitted}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <IconButton
                          icon={FiEye}
                          label="View ticket"
                          onClick={() => {
                            setActive(t);
                            setReplyMode(false);
                            setViewOpen(true);
                          }}
                          variant="subtle"
                        />
                        <IconButton
                          icon={FiEdit2}
                          label="Reply ticket"
                          onClick={() => {
                            setActive(t);
                            setReplyMode(true);
                            setViewOpen(true);
                          }}
                          variant="edit"
                        />
                        <IconButton
                          icon={FiTrash2}
                          label="Delete ticket"
                          onClick={() => {
                            setActive(t);
                            setDeleteOpen(true);
                          }}
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
        <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-[12px] text-white/55">
            <span>
              Showing {showingFrom}-{showingTo} of {total || 0}
            </span>

            <div className="flex items-center gap-2">
              <span>Rows Per Page:</span>
              <SelectField
                value={pageSize}
                onChange={(v) => {
                  setPageSize(Number(v));
                  setPage(1);
                }}
                options={[6, 7, 10, 15, 20].map((n) => ({
                  value: n,
                  label: String(n),
                }))}
              />
            </div>
          </div>

          <Pagination page={page} pageCount={pageCount} onChange={setPage} />
        </div>
      </div>

      {/* Modals */}
      <SupportTicketModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        ticket={active}
        startInReplyMode={replyMode}
        onSendReply={onSendReply}
      />

      <DeleteTicketModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        ticket={active}
        onConfirm={async () => {
          if (onDeleteTicket && active) await onDeleteTicket(active);
          setDeleteOpen(false);
        }}
      />
    </div>
  );
}
