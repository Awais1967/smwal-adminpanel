// src/pages/support/SupportPage.jsx
import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
  FiInbox,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import MetricCard from "../../components/shared/MetricCard";
import DataTable from "../../components/shared/DataTable/DataTable";
import StatusPill from "../../components/shared/StatusPill";
import TableActions from "../../components/shared/DataTable/TableActions";
import SupportTicketModal from "../../components/support/modals/SupportTicketModal";
import DeleteTicketModal from "../../components/support/modals/DeleteTicketModal";

const SUPPORT_STORAGE_KEY = "mih_support_rows_v1";

const DEFAULT_ROWS = [
  {
    id: "#1021",
    user: "Martin K.",
    type: "Technical",
    status: "New",
    date: "18 Jun, 2025",
  },
  {
    id: "#1022",
    user: "Julia R.",
    type: "Ministry",
    status: "In Progress",
    date: "20 Jun, 2025",
  },
  {
    id: "#1023",
    user: "James T.",
    type: "Payment",
    status: "In Progress",
    date: "22 Jun, 2025",
  },
  {
    id: "#1026",
    user: "Sophia T.",
    type: "Technical",
    status: "Resolved",
    date: "26 Jun, 2025",
  },
  {
    id: "#1027",
    user: "Kevin P.",
    type: "Ministry",
    status: "Resolved",
    date: "26 Jun, 2025",
  },
  {
    id: "#1028",
    user: "Zara A.",
    type: "Account",
    status: "Urgent",
    date: "27 Jun, 2025",
  },
];

function readSupportFromStorage() {
  try {
    const raw = localStorage.getItem(SUPPORT_STORAGE_KEY);
    if (!raw) return DEFAULT_ROWS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_ROWS;
  } catch {
    return DEFAULT_ROWS;
  }
}

export default function SupportPage() {
  const [rows, setRows] = useState(() => readSupportFromStorage());
  const [activeTicket, setActiveTicket] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(SUPPORT_STORAGE_KEY, JSON.stringify(rows));
  }, [rows]);

  const openView = useCallback((ticket) => {
    setActiveTicket({
      ...ticket,
      issueType: ticket.type,
      dateSubmitted: ticket.date,
      email: ticket.email || "",
      message: ticket.message || "",
    });
    setViewOpen(true);
  }, []);

  const openDelete = useCallback((ticket) => {
    setActiveTicket(ticket);
    setDeleteOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!activeTicket) return;
    setRows((prev) => prev.filter((r) => r.id !== activeTicket.id));
    setDeleteOpen(false);
    setActiveTicket(null);
  }, [activeTicket]);

  const columns = useMemo(
    () => [
      { key: "id", header: "Ticket ID" },
      { key: "user", header: "User" },
      { key: "type", header: "Issue Type" },
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
      {/* ✅ Removed repeated page header block */}

      <div>
        <div className="mb-3 text-sm font-semibold text-white/80">Summary</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={<FiInbox />} label="New Tickets" value="30" />
          <MetricCard icon={<FiClock />} label="In Progress" value="21" />
          <MetricCard icon={<FiCheckCircle />} label="Resolved" value="9" />
          <MetricCard icon={<FiAlertTriangle />} label="Urgent" value="3" />
        </div>
      </div>

      <DataTable
        title="Overview"
        searchPlaceholder="Search by name, issue type, or ticket ID"
        columns={columns}
        rows={rows}
        total={rows.length}
      />

      <SupportTicketModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        ticket={activeTicket}
        onSendReply={({ ticketId, reply }) => {
          // Placeholder: implement send reply behavior if needed
          console.log("send reply", ticketId, reply);
        }}
      />

      <DeleteTicketModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        ticket={activeTicket}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
