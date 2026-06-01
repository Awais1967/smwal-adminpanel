import React, { useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiEye,
  FiChevronDown,
} from "react-icons/fi";
import Button from "../shared/Button";
import IconButton from "../shared/IconButton";
import SelectField from "../shared/SelectField";
import AddUserModal from "./modals/AddUserModal";
import EditUserModal from "./modals/EditUserModal";
import ViewUserProfileModal from "./modals/ViewUserProfileModal";
import DeleteUserModal from "./modals/DeleteUserModal";

const STORAGE_KEY = "mih_users_v1";

const STATUS_STYLES = {
  Active: "border-cyan-500/50 bg-cyan-500/10 text-cyan-300",
  Inactive: "border-fuchsia-500/50 bg-fuchsia-500/10 text-fuchsia-300",
};

const COUNTRIES = ["All", "UK", "Spain", "India", "Canada", "Australia"];
const STATUSES = ["All", "Active", "Inactive"];

function seedUsers(count = 150) {
  const base = [
    {
      id: "usr_1",
      name: "Martin K.",
      age: 28,
      married: "Yes",
      status: "Active",
      city: "London, UK",
      email: "martin@email.com",
      phone: "+92 300 656 5460",
      gender: "Male",
      country: "UK",
      match: "Sarah J.",
      portraitName: "portrait.png",
    },
    {
      id: "usr_2",
      name: "Sofia L.",
      age: 34,
      married: "No",
      status: "Inactive",
      city: "Barcelona, Spain",
      email: "sofia@email.com",
      phone: "+34 600 123 456",
      gender: "Female",
      country: "Spain",
      match: "",
      portraitName: "",
    },
    {
      id: "usr_3",
      name: "Arjun S.",
      age: 26,
      married: "Yes",
      status: "Active",
      city: "Mumbai, India",
      email: "arjun@email.com",
      phone: "+91 900 789 1234",
      gender: "Male",
      country: "India",
      match: "Emma T.",
      portraitName: "",
    },
    {
      id: "usr_4",
      name: "Emma T.",
      age: 30,
      married: "No",
      status: "Inactive",
      city: "Toronto, Canada",
      email: "emma@email.com",
      phone: "+1 647 123 4567",
      gender: "Female",
      country: "Canada",
      match: "Arjun S.",
      portraitName: "",
    },
    {
      id: "usr_5",
      name: "Liam R.",
      age: 22,
      married: "No",
      status: "Active",
      city: "Sydney, Australia",
      email: "liam@email.com",
      phone: "+61 2 9876 5432",
      gender: "Male",
      country: "Australia",
      match: "",
      portraitName: "",
    },
    {
      id: "usr_6",
      name: "Noah K.",
      age: 34,
      married: "No",
      status: "Inactive",
      city: "Brisbane, Australia",
      email: "noah@email.com",
      phone: "+61 7 2345 6789",
      gender: "Male",
      country: "Australia",
      match: "",
      portraitName: "",
    },
  ];

  const out = [];
  for (let i = 0; i < count; i++) {
    const b = base[i % base.length];
    out.push({ ...b, id: `usr_${i + 1}` });
  }
  return out;
}

function readUsers() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = seedUsers(150);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(raw) || [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

const StatusSelect = ({ value, onChange }) => {
  const cls =
    STATUS_STYLES[value] || "border-white/10 bg-white/5 text-white/80";
  const opts = STATUSES.filter((s) => s !== "All").map((s) => ({
    value: s,
    label: s,
  }));
  return (
    <div
      className={`relative inline-flex items-center rounded-md border px-2 py-1 text-[11px] ${cls}`}
    >
      <div className="min-w-20">
        <SelectField
          value={value}
          onChange={onChange}
          options={opts}
          placeholder=""
          className="w-full"
        />
      </div>
    </div>
  );
};

export default function UsersTable({ defaultRowsPerPage = 7 }) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("All");
  const [status, setStatus] = useState("All");

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setUsers(readUsers());
      setLoading(false);
    }, 450);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q) ||
        u.city.toLowerCase().includes(q);

      const matchesCountry = country === "All" ? true : u.country === country;
      const matchesStatus = status === "All" ? true : u.status === status;

      return matchesSearch && matchesCountry && matchesStatus;
    });
  }, [users, search, country, status]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  const safePage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, safePage, rowsPerPage]);

  function persist(next) {
    setUsers(next);
    writeUsers(next);
  }

  function onCreate(payload) {
    persist([{ ...payload }, ...users]);
  }

  function onUpdate(id, patch) {
    persist(users.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  }

  function onDelete(id) {
    persist(users.filter((u) => u.id !== id));
  }

  return (
    <div className="mt-6">
      <h3 className="mb-3 text-sm font-semibold text-white/80">Overview</h3>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="relative w-full xl:flex-1">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, email, phone, city, or country"
            className="h-10 w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-3 text-[13px] text-white placeholder:text-white/35 outline-none focus:border-white/20"
          />
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
          <div>
            <SelectField
              value={country}
              onChange={(v) => {
                setCountry(v);
                setPage(1);
              }}
              options={COUNTRIES.map((c) => ({
                value: c,
                label: c === "All" ? "Country" : c,
              }))}
              className="sm:w-30"
            />
          </div>

          <div>
            <SelectField
              value={status}
              onChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
              options={STATUSES.map((s) => ({
                value: s,
                label: s === "All" ? "Status" : s,
              }))}
              className="sm:w-30"
            />
          </div>

          <Button variant="add" onClick={() => setAddOpen(true)}>
            + Add User
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="overflow-x-auto">
          <table className="min-w-245 w-full border-separate border-spacing-0">
            <thead>
              <tr className="text-left">
                {[
                  "Name",
                  "Age",
                  "Married",
                  "Status",
                  "City",
                  "Email",
                  "Phone",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-[11px] font-semibold text-white/70"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                Array.from({ length: rowsPerPage }).map((_, i) => (
                  <tr key={i} className="border-t border-white/5">
                    {Array.from({ length: 8 }).map((__, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-3 w-full animate-pulse rounded bg-white/10" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : pageItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-sm text-white/50"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                pageItems.map((row) => (
                  <tr key={row.id} className="border-t border-white/5">
                    <td className="px-4 py-4 text-[12px] text-white/85">
                      {row.name}
                    </td>
                    <td className="px-4 py-4 text-[12px] text-white/65">
                      {row.age}
                    </td>
                    <td className="px-4 py-4 text-[12px] text-white/65">
                      {row.married}
                    </td>
                    <td className="px-4 py-4">
                      <StatusSelect
                        value={row.status}
                        onChange={(v) => onUpdate(row.id, { status: v })}
                      />
                    </td>
                    <td className="px-4 py-4 text-[12px] text-white/65">
                      {row.city}
                    </td>
                    <td className="px-4 py-4 text-[12px] text-white/65 break-all">
                      {row.email}
                    </td>
                    <td className="px-4 py-4 text-[12px] text-white/65">
                      {row.phone}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <IconButton
                          onClick={() => {
                            setActiveRow(row);
                            setViewOpen(true);
                          }}
                          icon={FiEye}
                          label="View user"
                          variant="subtle"
                        />
                        <IconButton
                          onClick={() => {
                            setActiveRow(row);
                            setEditOpen(true);
                          }}
                          icon={FiEdit2}
                          label="Edit user"
                          variant="edit"
                        />
                        <IconButton
                          onClick={() => {
                            setActiveRow(row);
                            setDeleteOpen(true);
                          }}
                          icon={FiTrash2}
                          label="Delete user"
                          variant="danger"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-3 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-white/45">
            <span>{`Showing Users ${pageItems.length} of ${total} in`}</span>

            <div>
              <SelectField
                value={rowsPerPage}
                onChange={(v) => {
                  setRowsPerPage(Number(v));
                  setPage(1);
                }}
                options={[6, 7, 10, 15].map((n) => ({
                  value: n,
                  label: `Rows Per Page: ${n}`,
                }))}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-8 w-8 rounded-md bg-[#0B67CD] text-white hover:brightness-110 disabled:opacity-40"
              disabled={safePage === 1}
            >
              ‹
            </button>

            {Array.from({ length: Math.min(4, totalPages) }).map((_, i) => {
              const p = i + 1;
              const active = p === safePage;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-8 w-8 rounded-md text-[12px] ${
                    active
                      ? "bg-white/10 text-white"
                      : "bg-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {p}
                </button>
              );
            })}

            {totalPages > 4 && <span className="px-1 text-white/40">…</span>}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 w-8 rounded-md bg-[#0B67CD] text-white hover:brightness-110 disabled:opacity-40"
              disabled={safePage === totalPages}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddUserModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreate={(payload) => {
          onCreate(payload);
          setAddOpen(false);
        }}
      />

      <EditUserModal
        open={editOpen}
        user={activeRow}
        onClose={() => setEditOpen(false)}
        onSave={(id, patch) => {
          onUpdate(id, patch);
          setEditOpen(false);
        }}
      />

      <ViewUserProfileModal
        open={viewOpen}
        user={activeRow}
        onClose={() => setViewOpen(false)}
      />

      <DeleteUserModal
        open={deleteOpen}
        user={activeRow}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          if (activeRow?.id) onDelete(activeRow.id);
          setDeleteOpen(false);
        }}
      />
    </div>
  );
}
