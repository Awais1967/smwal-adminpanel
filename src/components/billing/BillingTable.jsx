import React, { useEffect, useMemo, useState } from "react";
import { FaSearch, FaChevronDown } from "react-icons/fa";
import { FiEye, FiTrash2 } from "react-icons/fi";
import IconButton from "../shared/IconButton";
import RevenueBreakdownDonut from "./charts/RevenueBreakdownDonut";
import RevenueOverviewBars from "./charts/RevenueOverviewBars";
import TransactionDetailsModal from "./modals/TransactionDetailsModal";
import DeletePaymentModal from "./modals/DeletePaymentModal";

const STORAGE_KEY = "mih_admin_billing_transactions_v1";

const statusStyles = {
  Paid: "border-cyan-500/50 text-cyan-300 bg-cyan-500/10",
  Pending: "border-purple-500/50 text-purple-300 bg-purple-500/10",
  Failed: "border-red-500/50 text-red-300 bg-red-500/10",
};

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

export default function BillingTable({ onStatsChange }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [paymentType, setPaymentType] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [activeRow, setActiveRow] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    // loading is initialized to true; perform async load and clear loading when done
    const t = setTimeout(() => {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setItems(Array.isArray(parsed) ? parsed : []);
      setLoading(false);
    }, 450);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((x) => {
      const matchesQ =
        !q ||
        x.user?.toLowerCase().includes(q) ||
        x.transactionId?.toLowerCase().includes(q) ||
        x.email?.toLowerCase().includes(q) ||
        x.paymentType?.toLowerCase().includes(q);

      const matchesType =
        paymentType === "All" || x.paymentType === paymentType;
      const matchesStatus = status === "All" || x.status === status;
      return matchesQ && matchesType && matchesStatus;
    });
  }, [items, query, paymentType, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  useEffect(() => {
    const totalRevenue = items.reduce((s, x) => s + (Number(x.amount) || 0), 0);
    const subsActive = items.filter(
      (x) => x.paymentType === "Subscription" && x.status === "Paid",
    ).length;
    const donations = items
      .filter((x) => x.paymentType === "Donation" && x.status === "Paid")
      .reduce((s, x) => s + (Number(x.amount) || 0), 0);

    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const revenueThisMonth = items
      .filter((x) => {
        if (!x.dateSubmitted) return false;
        const d = new Date(x.dateSubmitted);
        return (
          d.getMonth() === thisMonth &&
          d.getFullYear() === thisYear &&
          x.status === "Paid"
        );
      })
      .reduce((s, x) => s + (Number(x.amount) || 0), 0);

    onStatsChange?.({
      totalRevenue: `$${totalRevenue.toLocaleString()}`,
      subsActive,
      donations: `$${donations.toLocaleString()}`,
      revenueThisMonth: `$${revenueThisMonth.toLocaleString()}`,
    });
  }, [items, onStatsChange]);

  const donutData = useMemo(() => {
    const subs = items
      .filter((x) => x.paymentType === "Subscription" && x.status === "Paid")
      .reduce((s, x) => s + (Number(x.amount) || 0), 0);
    const events = items
      .filter((x) => x.paymentType === "Event" && x.status === "Paid")
      .reduce((s, x) => s + (Number(x.amount) || 0), 0);
    const dons = items
      .filter((x) => x.paymentType === "Donation" && x.status === "Paid")
      .reduce((s, x) => s + (Number(x.amount) || 0), 0);
    return [
      { name: "Subscriptions", value: subs },
      { name: "Events", value: events },
      { name: "Donations", value: dons },
    ];
  }, [items]);

  const barsData = useMemo(() => {
    // lightweight monthly rollup (uses dateSubmitted)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((m, idx) => {
      const matchMonth = (x) => {
        if (!x.dateSubmitted) return false;
        const d = new Date(x.dateSubmitted);
        return d.getMonth() === idx;
      };
      const sum = (type) =>
        items
          .filter(
            (x) =>
              x.status === "Paid" && matchMonth(x) && x.paymentType === type,
          )
          .reduce((s, x) => s + (Number(x.amount) || 0), 0);

      return {
        month: m,
        Subscriptions: sum("Subscription"),
        Events: sum("Event"),
        Donations: sum("Donation"),
      };
    });
  }, [items]);

  const openRow = (row, mode) => {
    setActiveRow(row);
    if (mode === "view") setOpenView(true);
    if (mode === "delete") setOpenDelete(true);
  };

  const deleteRow = (id) => setItems((prev) => prev.filter((x) => x.id !== id));

  return (
    <div className="space-y-4">
      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RevenueBreakdownDonut data={donutData} />
        <RevenueOverviewBars data={barsData} />
      </div>

      {/* Table card */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:p-5">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-[520px]">
            <FaSearch
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
              size={14}
            />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by user, payment type, transaction ID, or email"
              className="h-10 w-full rounded-lg border border-white/10 bg-black/30 pl-9 pr-3 text-sm text-white/80 outline-none placeholder:text-white/35"
            />
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto md:justify-end">
            <div className="relative">
              <select
                value={paymentType}
                onChange={(e) => {
                  setPaymentType(e.target.value);
                  setPage(1);
                }}
                className="h-10 w-full appearance-none rounded-lg border border-white/10 bg-black/30 px-3 pr-9 text-sm text-white/70 outline-none sm:w-[150px]"
              >
                {["All", "Subscription", "Mentorship", "Donation", "Event"].map(
                  (o) => (
                    <option
                      key={o}
                      value={o}
                      className="bg-[#141414] text-white"
                    >
                      {o === "All" ? "Payment Type" : o}
                    </option>
                  ),
                )}
              </select>
              <FaChevronDown
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/50"
                size={12}
              />
            </div>

            <div className="relative">
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="h-10 w-full appearance-none rounded-lg border border-white/10 bg-black/30 px-3 pr-9 text-sm text-white/70 outline-none sm:w-[120px]"
              >
                {["All", "Paid", "Pending", "Failed"].map((o) => (
                  <option key={o} value={o} className="bg-[#141414] text-white">
                    {o === "All" ? "Status" : o}
                  </option>
                ))}
              </select>
              <FaChevronDown
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/50"
                size={12}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
          <div className="overflow-x-auto">
            <div className="min-w-[980px] bg-white/[0.02] p-4">
              {loading ? (
                <SkeletonTable rows={7} cols={7} />
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="text-xs text-white/65">
                    <tr className="border-b border-white/10">
                      <th className="pb-3">User</th>
                      <th className="pb-3">Transaction ID</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Payment Type</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Date Submitted</th>
                      <th className="pb-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/80">
                    {paged.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="py-10 text-center text-white/45"
                        >
                          No payments found.
                        </td>
                      </tr>
                    ) : (
                      paged.map((row) => (
                        <tr
                          key={row.id}
                          className="border-b border-white/5 last:border-b-0"
                        >
                          <td className="py-3">{row.user || "-"}</td>
                          <td className="py-3 text-white/70">
                            {row.transactionId || "-"}
                          </td>
                          <td className="py-3 text-white/70">
                            {row.email || "-"}
                          </td>
                          <td className="py-3">{row.paymentType || "-"}</td>
                          <td className="py-3 text-white/70">
                            ${Number(row.amount || 0).toLocaleString()}
                          </td>
                          <td className="py-3">
                            <span
                              className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs ${
                                statusStyles[row.status] ||
                                "border-white/10 bg-white/[0.03] text-white/70"
                              }`}
                            >
                              {row.status || "-"}
                            </span>
                          </td>
                          <td className="py-3 text-white/70">
                            {row.dateSubmitted || "-"}
                          </td>
                          <td className="py-3">
                            <div className="flex items-center justify-center gap-3">
                              <IconButton
                                onClick={() => openRow(row, "view")}
                                icon={FiEye}
                                label="View payment"
                                variant="subtle"
                              />
                              <IconButton
                                onClick={() => openRow(row, "delete")}
                                icon={FiTrash2}
                                label="Delete payment"
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
                Showing payments{" "}
                {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}
              </span>
              <span>to</span>
              <span>{Math.min(page * pageSize, filtered.length)}</span>
              <span>of</span>
              <span>{filtered.length}</span>
              <div className="ml-3 flex items-center gap-2">
                <span>Rows Per Page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="h-8 rounded-md border border-white/10 bg-black/30 px-2 text-xs text-white/70 outline-none"
                >
                  {[6, 7, 10, 15].map((n) => (
                    <option
                      key={n}
                      value={n}
                      className="bg-[#141414] text-white"
                    >
                      {n}
                    </option>
                  ))}
                </select>
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
      </div>

      {/* Modals */}
      <TransactionDetailsModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        transaction={activeRow}
      />
      <DeletePaymentModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        transaction={activeRow}
        onConfirm={() => {
          if (!activeRow) return;
          deleteRow(activeRow.id);
          setOpenDelete(false);
        }}
      />
    </div>
  );
}
