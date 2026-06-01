// src/pages/billing/BillingPage.jsx
import React, { useMemo, useState, useCallback, useEffect } from "react";
import RevenueBreakdownDonut from "../../components/billing/charts/RevenueBreakdownDonut";
import RevenueOverviewBars from "../../components/billing/charts/RevenueOverviewBars";
import { FiDollarSign, FiUsers, FiGift, FiTrendingUp } from "react-icons/fi";
import MetricCard from "../../components/shared/MetricCard";
import DataTable from "../../components/shared/DataTable/DataTable";
import StatusPill from "../../components/shared/StatusPill";
import TableActions from "../../components/shared/DataTable/TableActions";
import TransactionDetailsModal from "../../components/billing/modals/TransactionDetailsModal";
import DeletePaymentModal from "../../components/billing/modals/DeletePaymentModal";
import useTableData from "../../hooks/useTableData";
import useToast from "../../hooks/useToastHook";
import billingService from "../../services/billing.service";

const STATUS_OPTIONS = ["Paid", "Pending", "Failed"];
const PAYMENT_TYPES = ["Subscription", "Mentorship", "Donation", "Event", "Course"];

function normalizeTransaction(row) {
  const amount = Number(row.amount ?? 0);
  return {
    ...row,
    txn: row.txn || row.transactionId,
    type: row.type || row.paymentType,
    amount: Number.isFinite(amount) ? `$${amount}` : row.amount,
    date: row.date || row.paymentDate,
  };
}

export default function BillingPage() {
  const toast = useToast();
  const [donutRange, setDonutRange] = useState("30");
  const [barsRange, setBarsRange] = useState("6");
  const [pie, setPie] = useState([]);
  const [bars, setBars] = useState([]);

  const [activeTxn, setActiveTxn] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const fetchTransactions = useCallback(async (params) => {
    const data = await billingService.list(params);
    return { ...data, items: data.items.map(normalizeTransaction) };
  }, []);

  const table = useTableData({
    fetcher: fetchTransactions,
    initialPageSize: 7,
    initialFilters: { status: "All", paymentType: "All" },
  });

  const rows = table.items;

  useEffect(() => {
    let active = true;
    billingService
      .revenueBreakdown({ range: donutRange })
      .then((data) => active && setPie(Array.isArray(data) ? data : []))
      .catch((error) => toast.error(error.message));
    return () => {
      active = false;
    };
  }, [donutRange, toast]);

  useEffect(() => {
    let active = true;
    billingService
      .revenueOverview({ range: barsRange })
      .then((data) => active && setBars(Array.isArray(data) ? data : []))
      .catch((error) => toast.error(error.message));
    return () => {
      active = false;
    };
  }, [barsRange, toast]);

  const mapRowToTransaction = useCallback((row) => {
    if (!row) return null;
    const rawAmount =
      typeof row.amount === "string"
        ? row.amount.replace(/[^0-9.-]/g, "")
        : row.amount;

    const amountNum =
      rawAmount === "" || rawAmount == null ? null : Number(rawAmount);

    return {
      user: row.user,
      email: row.email,
      location: row.location || "",
      transactionId: row.txn || row.transactionId,
      paymentMethod: row.paymentMethod || "",
      paymentType: row.type || row.paymentType,
      amount: amountNum,
      paymentDate: row.date || row.paymentDate,
      status: row.status,
      id: row.id,
    };
  }, []);

  const openView = useCallback(
    async (row) => {
      setActiveTxn(mapRowToTransaction(row));
      setViewOpen(true);
      try {
        const transaction = await billingService.getById(row.id);
        setActiveTxn(mapRowToTransaction(normalizeTransaction(transaction)));
      } catch (error) {
        toast.error(error.message);
      }
    },
    [mapRowToTransaction, toast],
  );

  const openDelete = useCallback(
    (row) => {
      setActiveTxn(mapRowToTransaction(row));
      setDeleteOpen(true);
    },
    [mapRowToTransaction],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!activeTxn) return;
    try {
      await billingService.remove(activeTxn.id);
      toast.success("Transaction deleted.");
      setDeleteOpen(false);
      setActiveTxn(null);
      table.refresh();
    } catch (error) {
      toast.error(error.message);
    }
  }, [activeTxn, table, toast]);

  const setFilter = useCallback(
    (key, value) => table.setFilters((prev) => ({ ...prev, [key]: value })),
    [table],
  );

  const summary = useMemo(() => {
    const paidRows = rows.filter((row) => row.status === "Paid");
    const revenue = paidRows.reduce((sum, row) => {
      const amount = String(row.amount || "").replace(/[^0-9.-]/g, "");
      return sum + (Number(amount) || 0);
    }, 0);
    return {
      revenue,
      subscriptions: rows.filter((row) => row.type === "Subscription").length,
      donations: rows.filter((row) => row.type === "Donation").length,
    };
  }, [rows]);

  const columns = useMemo(
    () => [
      { key: "user", header: "User" },
      { key: "txn", header: "Transaction ID" },
      { key: "email", header: "Email" },
      { key: "type", header: "Payment Type" },
      { key: "amount", header: "Amount" },
      {
        key: "status",
        header: "Status",
        cell: (r) => <StatusPill status={r.status} />,
      },
      { key: "date", header: "Date Submitted" },
      {
        key: "actions",
        header: "Actions",
        className: "text-right",
        cell: (r) => (
          <TableActions
            onDelete={() => openDelete(r)}
            onView={() => openView(r)}
          />
        ),
      },
    ],
    [openDelete, openView],
  );

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-3 text-sm font-semibold text-white/80">Summary</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={<FiDollarSign />}
            label="Total Revenue"
            value={`$${summary.revenue}`}
          />
          <MetricCard
            icon={<FiUsers />}
            label="Subscriptions Active"
            value={summary.subscriptions}
          />
          <MetricCard
            icon={<FiGift />}
            label="Donations Received"
            value={summary.donations}
          />
          <MetricCard
            icon={<FiTrendingUp />}
            label="Revenue This Month"
            value={table.total}
          />
        </div>
      </div>

      {/* ✅ IMPORTANT: No ChartCard wrapper (prevents double title / nested card) */}
      <div className="grid gap-4 lg:grid-cols-2">
        <RevenueBreakdownDonut
          data={pie}
          range={donutRange}
          onRangeChange={setDonutRange}
        />

        <RevenueOverviewBars
          data={bars}
          range={barsRange}
          onRangeChange={setBarsRange}
        />
      </div>

      <DataTable
        title="Overview"
        searchPlaceholder="Search by user, payment type, transaction ID, or email"
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
        countryValue={table.filters.paymentType}
        onCountryChange={(value) => setFilter("paymentType", value)}
        countryOptions={[
          { value: "All", label: "All Types" },
          ...PAYMENT_TYPES.map((value) => ({ value, label: value })),
        ]}
        statusOptions={[
          { value: "All", label: "All" },
          ...STATUS_OPTIONS.map((value) => ({ value, label: value })),
        ]}
      />

      <TransactionDetailsModal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        transaction={activeTxn}
      />

      <DeletePaymentModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        transaction={activeTxn}
      />
    </div>
  );
}
