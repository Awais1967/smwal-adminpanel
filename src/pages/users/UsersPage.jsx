// src/pages/users/UsersPage.jsx
import React, { useCallback, useMemo, useState } from "react";
import { FiUsers, FiUser, FiCheckSquare, FiSlash } from "react-icons/fi";
import MetricCard from "../../components/shared/MetricCard";
import DataTable from "../../components/shared/DataTable/DataTable";
import StatusPill from "../../components/shared/StatusPill";
import TableActions from "../../components/shared/DataTable/TableActions";
import Button from "../../components/shared/Button";
import ViewUserProfileModal from "../../components/users/modals/ViewUserProfileModal";
import DeleteUserModal from "../../components/users/modals/DeleteUserModal";
import EditUserModal from "../../components/users/modals/EditUserModal";
import AddUserModal from "../../components/users/modals/AddUserModal";
import useTableData from "../../hooks/useTableData";
import useToast from "../../hooks/useToastHook";
import usersService from "../../services/users.service";

const STATUS_OPTIONS = ["Active", "Inactive"];

export default function UsersPage() {
  const toast = useToast();
  const [activeUser, setActiveUser] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const fetchUsers = useCallback((params) => usersService.list(params), []);

  const table = useTableData({
    fetcher: fetchUsers,
    initialPageSize: 7,
    initialFilters: { country: "All", status: "All" },
  });

  const rows = table.items;

  const columns = useMemo(
    () => [
      { key: "name", header: "Name" },
      { key: "age", header: "Age" },
      { key: "married", header: "Married" },
      {
        key: "status",
        header: "Status",
        cell: (r) => <StatusPill status={r.status} />,
      },
      { key: "city", header: "City" },
      { key: "email", header: "Email" },
      { key: "phone", header: "Phone" },
      {
        key: "actions",
        header: "Actions",
        className: "text-right",
        cell: (r) => (
          <TableActions
            onDelete={() => {
              setActiveUser(r);
              setDeleteOpen(true);
            }}
            onView={async () => {
              setActiveUser(r);
              setViewOpen(true);
              try {
                const user = await usersService.getById(r.id);
                setActiveUser(user);
              } catch (error) {
                toast.error(error.message);
              }
            }}
            onEdit={() => {
              setActiveUser(r);
              setEditOpen(true);
            }}
          />
        ),
      },
    ],
    [toast],
  );

  const summary = useMemo(() => {
    const active = rows.filter((row) => row.status === "Active").length;
    const inactive = rows.filter((row) => row.status === "Inactive").length;
    const matched = rows.filter((row) => row.match).length;
    return { active, inactive, matched };
  }, [rows]);

  const setFilter = useCallback(
    (key, value) => table.setFilters((prev) => ({ ...prev, [key]: value })),
    [table],
  );

  const handleCreate = useCallback(
    async (payload) => {
      try {
        await usersService.create(payload);
        toast.success("User created.");
        setAddOpen(false);
        table.setSearch("");
        table.setFilters({ country: "All", status: "All" });
        table.setPage(1);
        setTimeout(() => table.refresh(), 0);
      } catch (error) {
        toast.error(error.message);
      }
    },
    [table, toast],
  );

  const handleUpdate = useCallback(
    async (id, updates) => {
      try {
        const updatedUser = await usersService.update(id, updates);
        setActiveUser(updatedUser);
        toast.success("User updated.");
        setEditOpen(false);
        table.refresh();
        return updatedUser;
      } catch (error) {
        toast.error(error.message);
        throw error;
      }
    },
    [table, toast],
  );

  const handleDelete = useCallback(async () => {
    if (!activeUser?.id) return;
    try {
      await usersService.remove(activeUser.id);
      toast.success("User deleted.");
      setDeleteOpen(false);
      setActiveUser(null);
      table.refresh();
    } catch (error) {
      toast.error(error.message);
    }
  }, [activeUser, table, toast]);

  return (
    <div className="space-y-6">
      {/* ✅ Removed repeated page header block */}

      <div>
        <div className="mb-3 text-sm font-semibold text-white/80">Summary</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={<FiUsers />} label="Total Users" value={table.total} />
          <MetricCard icon={<FiUser />} label="Available Users" value={summary.active} />
          <MetricCard icon={<FiCheckSquare />} label="Matched" value={summary.matched} />
          <MetricCard icon={<FiSlash />} label="Inactive" value={summary.inactive} />
        </div>
      </div>

      <DataTable
        title="Overview"
        searchPlaceholder="Search by name, email, phone, city, or country"
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
        countryValue={table.filters.country}
        onCountryChange={(value) => setFilter("country", value)}
        statusValue={table.filters.status}
        onStatusChange={(value) => setFilter("status", value)}
        statusOptions={[
          { value: "All", label: "All" },
          ...STATUS_OPTIONS.map((value) => ({ value, label: value })),
        ]}
        primaryAction={
          <Button variant="add" onClick={() => setAddOpen(true)}>
            + Add User
          </Button>
        }
      />

      <ViewUserProfileModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        user={activeUser}
      />
      <DeleteUserModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
      <EditUserModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        user={activeUser}
        onSave={handleUpdate}
      />
      <AddUserModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
