// src/pages/matches/MatchesPage.jsx
import React, { useCallback, useMemo, useState } from "react";
import { FiUsers, FiUserCheck, FiXCircle, FiClock } from "react-icons/fi";
import MetricCard from "../../components/shared/MetricCard";
import DataTable from "../../components/shared/DataTable/DataTable";
import StatusPill from "../../components/shared/StatusPill";
import TableActions from "../../components/shared/DataTable/TableActions";
import MatchDetailsModal from "../../components/matches/modals/MatchDetailsModal";
import DeleteMatchModal from "../../components/matches/modals/DeleteMatchModal";
import useTableData from "../../hooks/useTableData";
import useToast from "../../hooks/useToastHook";
import matchesService from "../../services/matches.service";

const STATUS_OPTIONS = ["Active", "Pending", "Cancelled"];

export default function MatchesPage() {
  const toast = useToast();
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(null);

  const fetchMatches = useCallback((params) => matchesService.list(params), []);
  const table = useTableData({
    fetcher: fetchMatches,
    initialPageSize: 7,
    initialFilters: { status: "All", country: "All" },
  });
  const rows = table.items;

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
            onView={async () => {
              setActiveRow(r);
              setViewOpen(true);
              try {
                const match = await matchesService.getById(r.id);
                setActiveRow(match);
              } catch (error) {
                toast.error(error.message);
              }
            }}
          />
        ),
      },
    ],
    [toast],
  );

  const summary = useMemo(
    () => ({
      active: rows.filter((row) => row.status === "Active").length,
      pending: rows.filter((row) => row.status === "Pending").length,
      cancelled: rows.filter((row) => row.status === "Cancelled").length,
    }),
    [rows],
  );

  const setFilter = useCallback(
    (key, value) => table.setFilters((prev) => ({ ...prev, [key]: value })),
    [table],
  );

  const handleDelete = useCallback(async () => {
    if (!activeRow?.id) return;
    try {
      await matchesService.remove(activeRow.id);
      toast.success("Match deleted.");
      setDeleteOpen(false);
      setActiveRow(null);
      table.refresh();
    } catch (error) {
      toast.error(error.message);
    }
  }, [activeRow, table, toast]);

  return (
    <div className="space-y-6">
      {/* ✅ Removed repeated page header block (Topbar handles greeting + subtitle) */}

      <div>
        <div className="mb-3 text-sm font-semibold text-white/80">Summary</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={<FiUserCheck />}
            label="Active Matches"
            value={summary.active}
          />
          <MetricCard icon={<FiUsers />} label="Total Matches" value={table.total} />
          <MetricCard
            icon={<FiXCircle />}
            label="Cancelled Matches"
            value={summary.cancelled}
          />
          <MetricCard
            icon={<FiClock />}
            label="Pending Confirmations"
            value={summary.pending}
          />
        </div>
      </div>

      <DataTable
        title="Overview"
        searchPlaceholder="Search by name, city, or match status"
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
        countryValue={table.filters.country}
        onCountryChange={(value) => setFilter("country", value)}
        statusOptions={[
          { value: "All", label: "All" },
          ...STATUS_OPTIONS.map((value) => ({ value, label: value })),
        ]}
      />
      <MatchDetailsModal
        open={viewOpen}
        match={activeRow}
        onClose={() => setViewOpen(false)}
      />
      <DeleteMatchModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={false}
      />
    </div>
  );
}
