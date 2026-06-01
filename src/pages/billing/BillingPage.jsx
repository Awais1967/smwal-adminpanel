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

const BILLING_STORAGE_KEY = "mih_billing_rows_v1";

const DEFAULT_ROWS = [
  {
    id: "1",
    user: "Martin K.",
    txn: "TXN-92001",
    email: "martin@email.com",
    type: "Subscription",
    amount: "$19",
    status: "Paid",
    date: "18 Jun, 2025",
  },
  {
    id: "2",
    user: "Sophia L.",
    txn: "TXN-92002",
    email: "sophia@email.com",
    type: "Mentorship",
    amount: "$49",
    status: "Pending",
    date: "20 Jun, 2025",
  },
  {
    id: "3",
    user: "James T.",
    txn: "TXN-92003",
    email: "james@email.com",
    type: "Donation",
    amount: "$16",
    status: "Failed",
    date: "22 Jun, 2025",
  },
];

function readBillingFromStorage() {
  try {
    const raw = localStorage.getItem(BILLING_STORAGE_KEY);
    if (!raw) return DEFAULT_ROWS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_ROWS;
  } catch {
    return DEFAULT_ROWS;
  }
}

export default function BillingPage() {
  const [donutRange, setDonutRange] = useState("30");
  const [barsRange, setBarsRange] = useState("6");

  // Generate pie data based on range
  const pie = useMemo(() => {
    const baseData = [
      { name: "Subscriptions", value: 45, trend: "up" },
      { name: "Events", value: 30, trend: "up" },
      { name: "Donations", value: 25, trend: "down" },
    ];

    // Vary the values slightly based on range for visual feedback
    const multiplier = donutRange === "30" ? 1 : 1.2;
    return baseData.map((item) => ({
      ...item,
      value: Math.round(item.value * multiplier),
    }));
  }, [donutRange]);

  // Generate bars data based on range - show different months
  const bars = useMemo(() => {
    const allMonths = [
      { month: "Jan", Subscriptions: 6000, Events: 3000, Donations: 2200 },
      { month: "Feb", Subscriptions: 5200, Events: 3700, Donations: 1600 },
      { month: "Mar", Subscriptions: 4200, Events: 3100, Donations: 4800 },
      { month: "Apr", Subscriptions: 5200, Events: 3800, Donations: 2200 },
      { month: "May", Subscriptions: 4100, Events: 2900, Donations: 1700 },
      { month: "Jun", Subscriptions: 4300, Events: 3100, Donations: 1100 },
      { month: "Jul", Subscriptions: 5500, Events: 3300, Donations: 2400 },
      { month: "Aug", Subscriptions: 4900, Events: 3200, Donations: 1900 },
      { month: "Sep", Subscriptions: 5800, Events: 3900, Donations: 2600 },
      { month: "Oct", Subscriptions: 5100, Events: 3400, Donations: 2000 },
      { month: "Nov", Subscriptions: 5900, Events: 4000, Donations: 2700 },
      { month: "Dec", Subscriptions: 6200, Events: 4200, Donations: 3000 },
    ];

    // Show 6 months for "Last 6 Months", 12 months for "Last 12 Months"
    return barsRange === "6" ? allMonths.slice(-6) : allMonths;
  }, [barsRange]);

  const [rows, setRows] = useState(() => readBillingFromStorage());

  const [activeTxn, setActiveTxn] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(BILLING_STORAGE_KEY, JSON.stringify(rows));
  }, [rows]);

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
    (row) => {
      setActiveTxn(mapRowToTransaction(row));
      setViewOpen(true);
    },
    [mapRowToTransaction],
  );

  const openDelete = useCallback(
    (row) => {
      setActiveTxn(mapRowToTransaction(row));
      setDeleteOpen(true);
    },
    [mapRowToTransaction],
  );

  const handleConfirmDelete = useCallback(() => {
    if (!activeTxn) return;
    setRows((prev) => prev.filter((r) => r.id !== activeTxn.id));
    setDeleteOpen(false);
    setActiveTxn(null);
  }, [activeTxn]);

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
            value="$12,480"
          />
          <MetricCard
            icon={<FiUsers />}
            label="Subscriptions Active"
            value="86"
          />
          <MetricCard
            icon={<FiGift />}
            label="Donations Received"
            value="$3,200"
          />
          <MetricCard
            icon={<FiTrendingUp />}
            label="Revenue This Month"
            value="$2,140"
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
        total={rows.length}
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
