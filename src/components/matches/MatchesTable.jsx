// src/components/matches/MatchesTable.jsx
import React from "react";
import IconButton from "../shared/IconButton";
import SelectField from "../shared/SelectField";
import { FiSearch, FiTrash2, FiEye, FiChevronDown } from "react-icons/fi";
import MatchDetailsModal from "./modals/MatchDetailsModal";
import DeleteMatchModal from "./modals/DeleteMatchModal";
import { getStatusPillClasses } from "../shared/StatusPill";

function StatusDropdownPill({ value }) {
  return (
    <span
      className={[
        "inline-flex h-7 min-w-[64px] items-center justify-center gap-1.5 rounded-[6px] border px-3 text-[11px] font-medium leading-none",
        getStatusPillClasses(value),
      ].join(" ")}
    >
      {value}
      <FiChevronDown size={12} className="opacity-80" />
    </span>
  );
}

function SelectPill({ value, onChange, options, className }) {
  const opts = options || [];
  return (
    <div className={className}>
      <SelectField
        value={value}
        onChange={onChange}
        options={opts}
        placeholder={opts.find((o) => o.value === value)?.label || ""}
        className="w-full"
      />
    </div>
  );
}

function createMockMatches(count = 150) {
  const first = [
    "Martin",
    "John",
    "Lucas",
    "Michael",
    "Ethan",
    "Daniel",
    "Sarah",
    "Emily",
    "Olivia",
    "Ava",
    "Sophia",
  ];
  const last = [
    "K.",
    "D.",
    "T.",
    "B.",
    "C.",
    "H.",
    "A.",
    "P.",
    "J.",
    "L.",
    "N.",
  ];
  const statuses = ["Active", "Pending", "Cancelled"];
  const countries = [
    "UK",
    "USA",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "India",
  ];

  const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const pad = (n) => String(n).padStart(2, "0");

  const randomDate = () => {
    const y = 2023 + Math.floor(Math.random() * 3);
    const m = 1 + Math.floor(Math.random() * 12);
    const d = 1 + Math.floor(Math.random() * 28);
    return `${pad(d)} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m - 1]}, ${y}`;
  };

  return Array.from({ length: count }).map((_, i) => {
    const u1 = `${rand(first)} ${rand(last)}`;
    const u2 = `${rand(first)} ${rand(last)}`;
    const user1Email = `${u1.split(" ")[0].toLowerCase()}@gmail.com`;
    const user2Email = `${u2.split(" ")[0].toLowerCase()}@gmail.com`;

    return {
      id: `match_${i + 1}`,
      user1Name: u1,
      user2Name: u2,
      user1Email,
      user2Email,
      status: rand(statuses),
      dateMatched: randomDate(),
      country: rand(countries),
      startDate: randomDate(),
      endDate: Math.random() > 0.75 ? randomDate() : "",
    };
  });
}

export default function MatchesTable({
  data,
  total,
  onFetch, // async ({ page, pageSize, search, country, status }) => { rows, total }
}) {
  const [search, setSearch] = React.useState("");
  const [country, setCountry] = React.useState("All");
  const [status, setStatus] = React.useState("All");

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(7);

  const [fullRows, setFullRows] = React.useState(() =>
    Array.isArray(data) ? data : createMockMatches(150),
  );

  const [rows, setRows] = React.useState(() => fullRows);
  const [rowsTotal, setRowsTotal] = React.useState(() =>
    typeof total === "number" ? total : fullRows.length,
  );

  const [loading, setLoading] = React.useState(false);

  const [viewOpen, setViewOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [activeRow, setActiveRow] = React.useState(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  // Debounce search input (lightweight)
  const [debouncedSearch, setDebouncedSearch] = React.useState(search);
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Keep fullRows in sync when parent provides `data` or `total` changes
  React.useEffect(() => {
    const base = Array.isArray(data) ? data : createMockMatches(150);
    setFullRows(base);
    setRowsTotal(typeof total === "number" ? total : base.length);
    setPage(1);
  }, [data, total]);

  // Fetch / lazy load simulation
  React.useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);

      try {
        if (onFetch) {
          const res = await onFetch({
            page,
            pageSize,
            search: debouncedSearch,
            country,
            status,
          });

          if (!alive) return;
          setRows(res?.rows ?? []);
          setRowsTotal(typeof res?.total === "number" ? res.total : 0);
        } else {
          // Local filtering/pagination fallback (still functional)
          // Use the full dataset (fullRows) rather than the already-paginated
          // `rows` state so filters apply to the complete collection.
          const base = Array.isArray(data) ? data : fullRows;
          const filtered = base.filter((r) => {
            const q = debouncedSearch.trim().toLowerCase();
            const matchQ =
              !q ||
              r.user1Name.toLowerCase().includes(q) ||
              r.user2Name.toLowerCase().includes(q) ||
              (r.status || "").toLowerCase().includes(q);

            const matchCountry =
              country === "All" ? true : (r.country || "") === country;
            const matchStatus =
              status === "All" ? true : (r.status || "") === status;

            return matchQ && matchCountry && matchStatus;
          });

          const start = (page - 1) * pageSize;
          const paged = filtered.slice(start, start + pageSize);

          // simulate lazy loading delay
          await new Promise((r) => setTimeout(r, 350));

          if (!alive) return;
          setRows(paged);
          setRowsTotal(filtered.length);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onFetch, page, pageSize, debouncedSearch, country, status]);

  const totalPages = Math.max(1, Math.ceil(rowsTotal / pageSize));

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  function openView(row) {
    setActiveRow(row);
    setViewOpen(true);
  }

  function openDelete(row) {
    setActiveRow(row);
    setDeleteOpen(true);
  }

  async function confirmDelete() {
    setDeleteLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      setDeleteOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  }

  const countryOptions = React.useMemo(() => {
    const base = Array.isArray(data) ? data : fullRows;
    const values = Array.from(
      new Set(base.map((r) => r.country).filter(Boolean)),
    ).sort();
    const merged = [
      "All",
      ...(values.length
        ? values
        : ["UK", "USA", "Canada", "Australia", "Germany", "France", "India"]),
    ];
    return merged.map((c) => ({
      label: c === "All" ? "All Country" : c,
      value: c,
    }));
  }, [data, fullRows]);

  const statusOptions = [
    { label: "All", value: "All" },
    { label: "Active", value: "Active" },
    { label: "Pending", value: "Pending" },
    { label: "Cancelled", value: "Cancelled" },
  ];

  return (
    <div className="mt-6">
      {/* Overview filters */}
      <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-140">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8B91A0]">
            <FiSearch size={16} />
          </span>
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search by name, city, or match status"
            className={[
              "h-9.5 w-full rounded-xl border border-[#23242B] bg-[#0E0F12] pl-9 pr-3",
              "text-[12px] text-white placeholder:text-[#6D7380] outline-none transition",
              "focus:border-[#2B6BFF] focus:ring-2 focus:ring-[#2B6BFF]/20",
            ].join(" ")}
          />
        </div>

        <div className="flex items-center gap-2">
          <SelectPill
            className="min-w-28"
            value={country}
            onChange={(v) => {
              setPage(1);
              setCountry(v);
            }}
            options={countryOptions}
          />
          <SelectPill
            className="min-w-28"
            value={status}
            onChange={(v) => {
              setPage(1);
              setStatus(v);
            }}
            options={statusOptions}
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[14px] border border-[#23242B] bg-[#141416] shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
        <div className="w-full overflow-x-auto">
          <table className="min-w-190 w-full border-collapse">
            <thead>
              <tr className="border-b border-[#23242B]">
                {["User 1", "User 2", "Status", "Date Matched", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-4 text-left text-[11px] font-semibold text-[#C8CDD6]"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                Array.from({ length: pageSize }).map((_, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-[#1C1D22] last:border-b-0"
                  >
                    <td className="px-5 py-4">
                      <div className="h-3 w-24 animate-pulse rounded bg-[#23242B]" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-3 w-24 animate-pulse rounded bg-[#23242B]" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-6 w-20 animate-pulse rounded bg-[#23242B]" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-3 w-28 animate-pulse rounded bg-[#23242B]" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 animate-pulse rounded bg-[#23242B]" />
                        <div className="h-8 w-8 animate-pulse rounded bg-[#23242B]" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : rows.length ? (
                rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-[#1C1D22] last:border-b-0"
                  >
                    <td className="px-5 py-4 text-[12px] text-[#C8CDD6]">
                      {r.user1Name}
                    </td>
                    <td className="px-5 py-4 text-[12px] text-[#C8CDD6]">
                      {r.user2Name}
                    </td>
                    <td className="px-5 py-4">
                      <StatusDropdownPill value={r.status} />
                    </td>
                    <td className="px-5 py-4 text-[12px] text-[#9AA0AA]">
                      {r.dateMatched}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <IconButton
                          onClick={() => openView(r)}
                          icon={FiEye}
                          label="View match"
                          variant="subtle"
                          className="text-[#9AA0AA] hover:bg-white/5 hover:text-white"
                        />
                        <IconButton
                          onClick={() => openDelete(r)}
                          icon={FiTrash2}
                          label="Delete match"
                          variant="danger"
                          className="hover:bg-white/5"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-[12px] text-[#9AA0AA]"
                  >
                    No matches found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer: rows per page + pagination */}
        <div className="flex flex-col gap-3 border-t border-[#23242B] px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#9AA0AA]">
            <span>
              Showing Matches{" "}
              <span className="text-[#C8CDD6]">{rows.length}</span> of{" "}
              <span className="text-[#C8CDD6]">{rowsTotal}</span> in
            </span>

            <label className="relative">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPage(1);
                  setPageSize(Number(e.target.value));
                }}
                className="h-8 rounded-[10px] border border-[#23242B] bg-[#0E0F12] px-2 pr-7 text-[11px] text-white outline-none"
              >
                {[6, 7, 10, 20].map((n) => (
                  <option key={n} value={n} className="bg-[#0E0F12]">
                    Rows Per Page: {n}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#8B91A0]">
                <FiChevronDown size={14} />
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#0E0F12] text-white ring-1 ring-[#23242B] disabled:opacity-50"
              aria-label="Previous"
            >
              ‹
            </button>

            {renderPagination(page, totalPages, setPage)}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#0E0F12] text-white ring-1 ring-[#23242B] disabled:opacity-50"
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <MatchDetailsModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        match={activeRow}
      />
      <DeleteMatchModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        loading={deleteLoading}
      />
    </div>
  );
}

function PageBtn({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        "inline-flex h-8 min-w-8 items-center justify-center rounded-[10px] px-2 text-[11px] font-semibold",
        "ring-1 ring-[#23242B]",
        active
          ? "bg-[#0B78FF] text-white"
          : "bg-[#0E0F12] text-[#C8CDD6] hover:text-white",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function renderPagination(page, totalPages, setPage) {
  // Match screenshot style: small set of pages with ellipsis
  const items = [];

  const push = (p) =>
    items.push(
      <PageBtn key={p} active={p === page} onClick={() => setPage(p)}>
        {p}
      </PageBtn>,
    );

  const pushDots = (k) =>
    items.push(
      <span key={k} className="px-1 text-[#6D7380]">
        …
      </span>,
    );

  if (totalPages <= 5) {
    for (let p = 1; p <= totalPages; p++) push(p);
    return items;
  }

  // Always show first, current neighborhood, last
  push(1);

  if (page > 3) pushDots("l");

  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  for (let p = start; p <= end; p++) push(p);

  if (page < totalPages - 2) pushDots("r");

  push(totalPages);

  return items;
}
