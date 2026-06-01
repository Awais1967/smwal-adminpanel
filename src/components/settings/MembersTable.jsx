import React, { useEffect, useMemo, useState } from "react";
import {
  FiTrash2,
  FiEye,
  FiEdit2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import IconButton from "../shared/IconButton";

const DEFAULT_PAGE_SIZE = 6;

const statusStyles = {
  Active: "bg-[#062f33] text-[#22d3ee] border-[#0ea5a4]",
  Inactive: "bg-[#24153b] text-[#c084fc] border-[#7c3aed]",
};

function StatusPillSelect({ value }) {
  const cls = statusStyles[value] || "bg-white/5 text-white/70 border-white/10";
  return (
    <span
      className={[
        "inline-flex rounded-md border px-2 py-1 text-[12px]",
        cls,
      ].join(" ")}
    >
      {value}
    </span>
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
          <span className="px-1 text-white/50">…</span>
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

export default function MembersTable({
  className = "",
  fetchMembers, // ({ page, pageSize, search, role, status }) => { items, total }
  filters,
  onView,
  onEdit,
  onDelete,
}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  const debouncedSearch = useDebounced(filters?.search || "");

  useEffect(() => {
    let alive = true;
    const run = async () => {
      setLoading(true);
      try {
        if (!fetchMembers) {
          if (!alive) return;
          setRows([]);
          setTotal(0);
          return;
        }
        const res = await fetchMembers({
          page,
          pageSize,
          search: debouncedSearch,
          role: filters?.role || "",
          status: filters?.status || "",
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
  }, [
    fetchMembers,
    page,
    pageSize,
    debouncedSearch,
    filters?.role,
    filters?.status,
  ]);

  const pageCount = Math.max(1, Math.ceil((total || 0) / pageSize));
  const showingFrom = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo = Math.min(page * pageSize, total || 0);

  return (
    <div className={className}>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
        <div className="overflow-x-auto">
          <table className="min-w-245 w-full">
            <thead className="border-b border-white/10">
              <tr className="text-left text-[12px] font-medium text-white/60">
                <th className="px-5 py-4">Member Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {loading ? (
                Array.from({ length: pageSize }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((__, c) => (
                      <td key={c} className="px-5 py-4">
                        <div className="h-4 w-full max-w-55 animate-pulse rounded bg-white/10" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-[13px] text-white/45"
                  >
                    No members found.
                  </td>
                </tr>
              ) : (
                rows.map((m) => (
                  <tr key={m.id} className="text-[13px] text-white/75">
                    <td className="px-5 py-4">{m.name}</td>
                    <td className="px-5 py-4">{m.email}</td>
                    <td className="px-5 py-4">{m.role}</td>
                    <td className="px-5 py-4">
                      <StatusPillSelect value={m.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <IconButton
                          icon={FiEye}
                          label="View member"
                          onClick={() => onView?.(m)}
                          variant="subtle"
                        />
                        <IconButton
                          icon={FiEdit2}
                          label="Edit member"
                          onClick={() => onEdit?.(m)}
                          variant="edit"
                        />
                        <IconButton
                          icon={FiTrash2}
                          label="Delete member"
                          onClick={() => onDelete?.(m)}
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

        <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-[12px] text-white/55">
            <span>
              Showing {showingFrom}-{showingTo} of {total || 0}
            </span>

            <div className="flex items-center gap-2">
              <span>Rows Per Page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="h-8 rounded-md border border-white/10 bg-white/5 px-2 text-[12px] text-white/70 outline-none"
              >
                {[6, 7, 10, 15, 20].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Pagination page={page} pageCount={pageCount} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}
