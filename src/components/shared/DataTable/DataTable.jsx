import React, { useMemo, useState } from "react";
import SelectField from "../SelectField";
import { FiSearch } from "react-icons/fi";

function buildPagination(current, totalPages) {
  if (totalPages <= 5)
    return Array.from({ length: totalPages }, (_, i) => i + 1);

  if (current <= 2) return [1, 2, "...", totalPages];

  if (current >= totalPages - 1) return [1, "...", totalPages - 1, totalPages];

  return [1, "...", current, "...", totalPages];
}

function SelectPill({
  value,
  onChange,
  children,
  className = "",
  selectClassName = "w-auto",
}) {
  const opts = React.Children.toArray(children).map((c) => ({
    value: c.props.value,
    label: Array.isArray(c.props.children)
      ? c.props.children.join("")
      : c.props.children,
  }));

  return (
    <div className={className}>
      <SelectField
        value={value}
        onChange={onChange}
        options={opts}
        placeholder={opts.find((o) => o.value === value)?.label || ""}
        className={selectClassName}
      />
    </div>
  );
}

function getRowCountry(row) {
  const direct = String(row?.country ?? "").trim();
  if (direct) return direct;

  const city = String(row?.city ?? "").trim();
  if (!city.includes(",")) return "";

  const parts = city
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  return parts.length > 1 ? parts[parts.length - 1] : "";
}

export default function DataTable({
  title = "Overview",
  searchPlaceholder = "Search by name, city, or match status",
  columns = [],
  rows = [],
  total = 0,
  entityName = "Matches", // for footer text
  primaryAction = null,
  loading = false,
  error = null,
  manual = false,
  searchValue,
  onSearchChange,
  countryValue,
  onCountryChange,
  statusValue,
  onStatusChange,
  page: controlledPage,
  pageSize: controlledPageSize,
  onPageChange,
  onPageSizeChange,
  countryOptions: providedCountryOptions,
  statusOptions: providedStatusOptions,
}) {
  const defaultPerPage = 7;
  const [localPerPage, setLocalPerPage] = useState(defaultPerPage);
  const [localPage, setLocalPage] = useState(1);

  // (UI-only states; hook these to parent later if needed)
  const [localCountry, setLocalCountry] = useState("All");
  const [localStatus, setLocalStatus] = useState("All");
  const [localQ, setLocalQ] = useState("");

  const perPage = controlledPageSize ?? localPerPage;
  const page = controlledPage ?? localPage;
  const country = countryValue ?? localCountry;
  const status = statusValue ?? localStatus;
  const q = searchValue ?? localQ;

  const setPage = onPageChange ?? setLocalPage;
  const setPerPage = onPageSizeChange ?? setLocalPerPage;
  const setCountry = onCountryChange ?? setLocalCountry;
  const setStatus = onStatusChange ?? setLocalStatus;
  const setQ = onSearchChange ?? setLocalQ;
  const changePage = (next) => {
    const value = typeof next === "function" ? next(page) : next;
    setPage(value);
  };

  const statusOptions = useMemo(() => {
    const values = Array.from(
      new Set(
        rows
          .map((r) => r?.status)
          .filter(
            (v) =>
              typeof v === "string" &&
              v.trim() &&
              v !== "Status" &&
              v !== "All",
          ),
      ),
    );

    const generated = [
      { value: "All", label: "All" },
      ...values.map((v) => ({ value: v, label: v })),
    ];
    return providedStatusOptions || generated;
  }, [providedStatusOptions, rows]);

  const countryOptions = useMemo(() => {
    const byKey = new Map();
    rows.forEach((row) => {
      const c = getRowCountry(row);
      if (!c || c.toLowerCase() === "all") return;
      const key = c.toLowerCase();
      if (!byKey.has(key)) byKey.set(key, c);
    });

    const values = Array.from(byKey.values()).sort((a, b) =>
      a.localeCompare(b),
    );

    const generated = [
      { value: "All", label: "All Country" },
      ...values.map((v) => ({ value: v, label: v })),
    ];
    return providedCountryOptions || generated;
  }, [providedCountryOptions, rows]);

  const filteredRows = useMemo(() => {
    if (manual) return rows;

    const query = q.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesSearch =
        !query ||
        Object.values(row).some((val) =>
          String(val ?? "")
            .toLowerCase()
            .includes(query),
        );

      const matchesStatus =
        status === "All" ||
        String(row?.status ?? "").toLowerCase() === status.toLowerCase();

      const matchesCountry =
        country === "All" ||
        getRowCountry(row).toLowerCase() === country.toLowerCase();

      return matchesSearch && matchesStatus && matchesCountry;
    });
  }, [country, manual, q, rows, status]);

  const hasActiveFilter =
    q.trim().length > 0 ||
    status !== "All" ||
    country !== "All";

  const shownTotal = manual
    ? total || rows.length
    : hasActiveFilter
      ? filteredRows.length
      : total || rows.length;

  const pages = useMemo(() => {
    const st = manual ? shownTotal : filteredRows.length;
    const p = Math.max(1, Math.ceil(st / perPage));
    return p;
  }, [filteredRows.length, manual, perPage, shownTotal]);

  const safePage = Math.min(page, pages);
  const start = (safePage - 1) * perPage;
  const pagedRows = manual
    ? filteredRows
    : filteredRows.slice(start, start + perPage);

  const pageItems = useMemo(
    () => buildPagination(safePage, pages),
    [safePage, pages],
  );
  const tableMinWidth = Math.max(900, columns.length * 145);

  return (
    <div className="w-full">
      {/* Title */}
      <div className="mb-4">
        <div className="text-[15px] font-semibold text-white">{title}</div>
      </div>

      {/* Search + Filters row */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              changePage(1);
            }}
            autoComplete="off"
            name="table-search"
            spellCheck={false}
            className="h-10 w-full rounded-lg border border-white/10 bg-white/3 pl-9 pr-3 text-sm text-white/80 placeholder:text-white/35 outline-none hover:bg-white/5 focus:border-white/20"
            placeholder={searchPlaceholder}
          />
        </div>

        <div className="flex items-center gap-3">
          <SelectPill
            className="min-w-28"
            selectClassName="w-full"
            value={country}
            onChange={(v) => {
              setCountry(v);
              changePage(1);
            }}
          >
            {countryOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </SelectPill>

          <SelectPill
            className="min-w-28"
            selectClassName="w-full"
            value={status}
            onChange={(v) => {
              setStatus(v);
              changePage(1);
            }}
          >
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </SelectPill>
          <div className="ml-3">{primaryAction}</div>
        </div>
      </div>

      {/* Table card */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/3">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth: tableMinWidth }}>
            <thead>
              <tr className="border-b border-white/10 bg-white/2">
                {columns.map((c) => {
                  const isActionsCol = c.key === "actions";
                  const isStatusCol = c.key === "status";
                  return (
                    <th
                      key={c.key}
                      className={[
                        "px-6 py-4 text-left text-[12px] font-medium text-white/55 whitespace-nowrap",
                        isActionsCol ? "min-w-38" : "",
                        isStatusCol ? "min-w-28" : "",
                        c.className || "",
                      ].join(" ")}
                    >
                      {c.header}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-12 text-center text-white/55"
                  >
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-12 text-center text-[#FF6B6B]"
                  >
                    {error?.message || "Unable to load data."}
                  </td>
                </tr>
              ) : pagedRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-12 text-center text-white/55"
                  >
                    No records found.
                  </td>
                </tr>
              ) : null}

              {!loading && !error && pagedRows.map((r, idx) => (
                <tr
                  key={r.id ?? idx}
                  className="border-b border-white/5 last:border-b-0 hover:bg-white/2"
                >
                  {columns.map((c) => {
                    const isActionsCol = c.key === "actions";
                    const isStatusCol = c.key === "status";
                    return (
                      <td
                        key={c.key}
                        className={[
                          "px-6 py-4 align-top text-white/80",
                          isActionsCol
                            ? "min-w-38 whitespace-nowrap"
                            : isStatusCol
                              ? "min-w-28 whitespace-nowrap"
                              : "[overflow-wrap:anywhere]",
                          c.className || "",
                        ].join(" ")}
                      >
                        {c.cell ? c.cell(r) : r[c.key]}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3 text-xs text-white/55">
          <span>
            Showing {entityName} {pagedRows.length} of {shownTotal} in
          </span>

          <SelectPill
            value={perPage}
            onChange={(v) => {
              setPerPage(Number(v));
              changePage(1);
            }}
          >
            <option value={5}>Rows Per Page: 5</option>
            <option value={7}>Rows Per Page: 7</option>
            <option value={10}>Rows Per Page: 10</option>
            <option value={20}>Rows Per Page: 20</option>
          </SelectPill>
        </div>

        {/* Pagination (screenshot style) */}
        <div className="flex items-center gap-2">
          <button
            disabled={safePage <= 1}
            onClick={() => changePage((p) => Math.max(1, p - 1))}
            className={[
              "h-9 w-9 rounded-lg grid place-items-center border",
              "bg-[#1D4ED8] border-[#1D4ED8] text-white",
              "disabled:opacity-40 disabled:cursor-not-allowed",
            ].join(" ")}
            aria-label="Previous page"
          >
            &lt;
          </button>

          {pageItems.map((it, i) =>
            it === "..." ? (
              <div
                key={`dots-${i}`}
                className="h-9 min-w-9 rounded-lg border border-white/10 bg-white/2 px-3 grid place-items-center text-white/60"
              >
                ...
              </div>
            ) : (
              <button
                key={it}
                onClick={() => changePage(it)}
                className={[
                  "h-9 min-w-9 rounded-lg border px-3 text-sm",
                  safePage === it
                    ? "border-white/15 bg-white/8 text-white"
                    : "border-white/10 bg-white/2 text-white/70 hover:bg-white/5",
                ].join(" ")}
              >
                {it}
              </button>
            ),
          )}

          <button
            disabled={safePage >= pages}
            onClick={() => changePage((p) => Math.min(pages, p + 1))}
            className={[
              "h-9 w-9 rounded-lg grid place-items-center border",
              "bg-[#1D4ED8] border-[#1D4ED8] text-white",
              "disabled:opacity-40 disabled:cursor-not-allowed",
            ].join(" ")}
            aria-label="Next page"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
