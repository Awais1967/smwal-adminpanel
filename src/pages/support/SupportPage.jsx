// src/pages/support/SupportPage.jsx
import React, { useCallback, useMemo, useState } from "react";
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
import useTableData from "../../hooks/useTableData";
import useToast from "../../hooks/useToastHook";
import supportService from "../../services/support.service";

const STATUS_OPTIONS = ["New", "In Progress", "Resolved", "Urgent"];
const ISSUE_TYPES = ["Account", "Technical", "Payment", "Ministry"];

function normalizeTicket(ticket) {
  return {
    ...ticket,
    id: ticket.id || ticket.ticketId,
    ticketId: ticket.ticketId || ticket.id,
    type: ticket.type || ticket.issueType,
    issueType: ticket.issueType || ticket.type,
    date: ticket.date || ticket.dateSubmitted,
    dateSubmitted: ticket.dateSubmitted || ticket.date,
  };
}

export default function SupportPage() {
  const toast = useToast();
  const [activeTicket, setActiveTicket] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const fetchTickets = useCallback(async (params) => {
    const data = await supportService.list(params);
    return { ...data, items: data.items.map(normalizeTicket) };
  }, []);

  const table = useTableData({
    fetcher: fetchTickets,
    initialPageSize: 7,
    initialFilters: { status: "All", type: "All" },
  });

  const rows = table.items;

  const openView = useCallback(
    async (ticket) => {
      setActiveTicket(normalizeTicket(ticket));
      setViewOpen(true);
      try {
        const detail = await supportService.getById(ticket.id);
        setActiveTicket(normalizeTicket(detail));
      } catch (error) {
        toast.error(error.message);
      }
    },
    [toast],
  );

  const openDelete = useCallback((ticket) => {
    setActiveTicket(normalizeTicket(ticket));
    setDeleteOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!activeTicket?.id) return;
    try {
      await supportService.remove(activeTicket.id);
      toast.success("Ticket deleted.");
      setDeleteOpen(false);
      setActiveTicket(null);
      table.refresh();
    } catch (error) {
      toast.error(error.message);
    }
  }, [activeTicket, table, toast]);

  const handleReply = useCallback(
    async ({ ticketId, reply }) => {
      try {
        await supportService.reply(ticketId, { reply });
        toast.success("Reply sent.");
        table.refresh();
      } catch (error) {
        toast.error(error.message);
      }
    },
    [table, toast],
  );

  const setFilter = useCallback(
    (key, value) => table.setFilters((prev) => ({ ...prev, [key]: value })),
    [table],
  );

  const summary = useMemo(
    () => ({
      newTickets: rows.filter((row) => row.status === "New").length,
      inProgress: rows.filter((row) => row.status === "In Progress").length,
      resolved: rows.filter((row) => row.status === "Resolved").length,
      urgent: rows.filter((row) => row.status === "Urgent").length,
    }),
    [rows],
  );

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
      <div>
        <div className="mb-3 text-sm font-semibold text-white/80">Summary</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={<FiInbox />} label="New Tickets" value={summary.newTickets} />
          <MetricCard icon={<FiClock />} label="In Progress" value={summary.inProgress} />
          <MetricCard icon={<FiCheckCircle />} label="Resolved" value={summary.resolved} />
          <MetricCard icon={<FiAlertTriangle />} label="Urgent" value={summary.urgent} />
        </div>
      </div>

      <DataTable
        title="Overview"
        searchPlaceholder="Search by name, issue type, or ticket ID"
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
        countryValue={table.filters.type}
        onCountryChange={(value) => setFilter("type", value)}
        countryOptions={[
          { value: "All", label: "All Types" },
          ...ISSUE_TYPES.map((value) => ({ value, label: value })),
        ]}
        statusOptions={[
          { value: "All", label: "All" },
          ...STATUS_OPTIONS.map((value) => ({ value, label: value })),
        ]}
      />

      <SupportTicketModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        ticket={activeTicket}
        onSendReply={handleReply}
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
