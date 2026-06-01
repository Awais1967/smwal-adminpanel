// src/pages/users/UsersPage.jsx
import React, { useEffect, useMemo, useState } from "react";
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

const USERS_STORAGE_KEY = "mih_users_rows_v1";

const DEFAULT_ROWS = [
  {
    id: "1",
    name: "Martin K.",
    age: 28,
    married: "Yes",
    status: "Active",
    city: "London, UK",
    email: "martin@email.com",
    phone: "+92 300 656 5460",
  },
  {
    id: "2",
    name: "Sofia L.",
    age: 34,
    married: "No",
    status: "Inactive",
    city: "Barcelona, Spain",
    email: "sofia@email.com",
    phone: "+34 600 123 456",
  },
  {
    id: "3",
    name: "Arjun S.",
    age: 26,
    married: "Yes",
    status: "Active",
    city: "Mumbai, India",
    email: "arjun@email.com",
    phone: "+91 900 789 1234",
  },
];

function readUsersFromStorage() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return DEFAULT_ROWS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_ROWS;
  } catch {
    return DEFAULT_ROWS;
  }
}

export default function UsersPage() {
  const [rows, setRows] = useState(() => readUsersFromStorage());
  const [tableRenderKey, setTableRenderKey] = useState(0);
  const [activeUser, setActiveUser] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(rows));
  }, [rows]);

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
            onView={() => {
              setActiveUser(r);
              setViewOpen(true);
            }}
            onEdit={() => {
              setActiveUser(r);
              setEditOpen(true);
            }}
          />
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      {/* ✅ Removed repeated page header block */}

      <div>
        <div className="mb-3 text-sm font-semibold text-white/80">Summary</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={<FiUsers />} label="Total Users" value="12" />
          <MetricCard icon={<FiUser />} label="Available Users" value="92" />
          <MetricCard icon={<FiCheckSquare />} label="Matched" value="41" />
          <MetricCard icon={<FiSlash />} label="Inactive" value="17" />
        </div>
      </div>

      <DataTable
        key={`users-table-${tableRenderKey}`}
        title="Overview"
        searchPlaceholder="Search by name, email, phone, city, or country"
        columns={columns}
        rows={rows}
        total={rows.length}
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
        onConfirm={() => {
          setRows((prev) => prev.filter((u) => u.id !== activeUser?.id));
          setDeleteOpen(false);
        }}
      />
      <EditUserModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        user={activeUser}
        onSave={(id, updates) => {
          setRows((prev) =>
            prev.map((r) => (r.id === id ? { ...r, ...updates } : r)),
          );
          setEditOpen(false);
        }}
      />
      <AddUserModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreate={(payload) => {
          setRows((prev) => [payload, ...prev]);
          setTableRenderKey((v) => v + 1);
          setAddOpen(false);
        }}
      />
    </div>
  );
}
