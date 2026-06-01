import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import Button from "../shared/Button";
import MembersTable from "./MembersTable";
import AddMemberModal from "./modals/AddMemberModal";

const ROLE_FILTERS = ["All", "Admin", "Editor", "Viewer"];
const STATUS_FILTERS = ["All", "Active", "Inactive"];

export default function MembersAccessSection({
  fetchMembers,
  onCreateOrUpdateMember,
  onDeleteMember,
}) {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [status, setStatus] = useState("All");

  const [memberModal, setMemberModal] = useState({
    open: false,
    mode: "add",
    member: null,
  });

  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
      <div className="text-[14px] font-semibold text-white">
        Members & Access
      </div>
      <div className="mt-1 text-[12px] text-white/55">
        Manage roles and access permissions.
      </div>

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full items-center gap-3">
          <div className="relative w-full max-w-130">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
              className="h-10 w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-[13px] text-white/80 outline-none placeholder:text-white/30 focus:border-[#0b74ff]"
            />
          </div>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-[13px] text-white/75 outline-none focus:border-[#0b74ff]"
          >
            {ROLE_FILTERS.map((r) => (
              <option key={r} value={r}>
                {r === "All" ? "Role" : r}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-[13px] text-white/75 outline-none focus:border-[#0b74ff]"
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "Status" : s}
              </option>
            ))}
          </select>

          <Button
            variant="add"
            onClick={() =>
              setMemberModal({ open: true, mode: "add", member: null })
            }
          >
            + Add Member
          </Button>
        </div>
      </div>

      <MembersTable
        className="mt-4"
        fetchMembers={fetchMembers}
        filters={{
          search,
          role: role === "All" ? "" : role,
          status: status === "All" ? "" : status,
        }}
        onView={(m) => setMemberModal({ open: true, mode: "view", member: m })}
        onEdit={(m) => setMemberModal({ open: true, mode: "edit", member: m })}
        onDelete={onDeleteMember}
      />

      <AddMemberModal
        open={memberModal.open}
        mode={memberModal.mode}
        initialValues={memberModal.member}
        onClose={() =>
          setMemberModal({ open: false, mode: "add", member: null })
        }
        onSubmit={onCreateOrUpdateMember}
      />
    </div>
  );
}
