// src/pages/matches/MatchesPage.jsx
import React, { useMemo, useState } from "react";
import { FiUsers, FiUserCheck, FiXCircle, FiClock } from "react-icons/fi";
import MetricCard from "../../components/shared/MetricCard";
import DataTable from "../../components/shared/DataTable/DataTable";
import StatusPill from "../../components/shared/StatusPill";
import TableActions from "../../components/shared/DataTable/TableActions";
import Button from "../../components/shared/Button";
import MatchDetailsModal from "../../components/matches/modals/MatchDetailsModal";
import DeleteMatchModal from "../../components/matches/modals/DeleteMatchModal";

export default function MatchesPage() {
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(null);

  const initialRows = useMemo(
    () => [
      {
        id: "1",
        user1: "Martin K.",
        user2: "Sarah A.",
        status: "Active",
        dateMatched: "17 May, 2025",
      },
      {
        id: "2",
        user1: "John D.",
        user2: "Emily R.",
        status: "Active",
        dateMatched: "22 June, 2024",
      },
      {
        id: "3",
        user1: "Lucas T.",
        user2: "Olivia P.",
        status: "Active",
        dateMatched: "30 July, 2025",
      },
      {
        id: "4",
        user1: "Michael B.",
        user2: "Ava J.",
        status: "Pending",
        dateMatched: "10 August, 2023",
      },
      {
        id: "5",
        user1: "Ethan C.",
        user2: "Sophia L.",
        status: "Cancelled",
        dateMatched: "5 September, 2024",
      },
    ],
    [],
  );

  const [rows, setRows] = useState(initialRows);

  const columns = useMemo(
    () => [
      { key: "user1", header: "User 1" },
      { key: "user2", header: "User 2" },
      {
        key: "status",
        header: "Status",
        cell: (r) => <StatusPill status={r.status} />,
      },
      { key: "dateMatched", header: "Date Matched" },
      {
        key: "actions",
        header: "Actions",
        className: "text-right",
        cell: (r) => (
          <TableActions
            onDelete={() => {
              setActiveRow(r);
              setDeleteOpen(true);
            }}
            onView={() => {
              setActiveRow(r);
              setViewOpen(true);
            }}
          />
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      {/* ✅ Removed repeated page header block (Topbar handles greeting + subtitle) */}

      <div>
        <div className="mb-3 text-sm font-semibold text-white/80">Summary</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={<FiUserCheck />}
            label="Active Matches"
            value="12"
          />
          <MetricCard icon={<FiUsers />} label="Available Users" value="58" />
          <MetricCard
            icon={<FiXCircle />}
            label="Cancelled Matches"
            value="7"
          />
          <MetricCard
            icon={<FiClock />}
            label="Pending Confirmations"
            value="4"
          />
        </div>
      </div>

      <DataTable
        title="Overview"
        searchPlaceholder="Search by name, city, or match status"
        columns={columns}
        rows={rows}
        total={rows.length}
      />
      <MatchDetailsModal
        open={viewOpen}
        match={activeRow}
        onClose={() => setViewOpen(false)}
      />
      <DeleteMatchModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          // remove the row from state
          setRows((prev) => prev.filter((r) => r.id !== activeRow?.id));
          setDeleteOpen(false);
        }}
        loading={false}
      />
    </div>
  );
}
