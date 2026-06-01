// src/pages/settings/SettingsPage.jsx
import React, { useState, useCallback, useEffect } from "react";
import Card from "../../components/shared/Card";
import Button from "../../components/shared/Button";
import TextField from "../../components/shared/TextField";
import SelectField from "../../components/shared/SelectField";
import DataTable from "../../components/shared/DataTable/DataTable";
import StatusPill from "../../components/shared/StatusPill";
import TableActions from "../../components/shared/DataTable/TableActions";
import AddMemberModal from "../../components/settings/modals/AddMemberModal";
import ChangePasswordModal from "../../components/settings/modals/ChangePasswordModal";
import DeleteMemberModal from "../../components/settings/modals/DeleteMemberModal";
import useToast from "../../hooks/useToastHook";

const SETTINGS_MEMBERS_STORAGE_KEY = "mih_settings_members_rows_v1";
const SETTINGS_BASIC_INFO_STORAGE_KEY = "mih_settings_basic_info_v1";
const SETTINGS_EMAIL_STORAGE_KEY = "mih_settings_email_v1";

const COUNTRY_OPTIONS = ["United States", "United Kingdom", "Canada"];
const SENDER_EMAIL_OPTIONS = ["sarah@gmail.com", "support@org.com"];

const DEFAULT_ROWS = [
  {
    id: "1",
    name: "Ayesha Khan",
    email: "ayesha@org.com",
    role: "Owner",
    status: "Active",
  },
  {
    id: "2",
    name: "James Smith",
    email: "james@org.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: "3",
    name: "Fatima Patel",
    email: "fatima@org.com",
    role: "Staff",
    status: "Inactive",
  },
];

function readMembersFromStorage() {
  try {
    const raw = localStorage.getItem(SETTINGS_MEMBERS_STORAGE_KEY);
    if (!raw) return DEFAULT_ROWS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_ROWS;
  } catch {
    return DEFAULT_ROWS;
  }
}

const DEFAULT_BASIC_INFO = {
  ministryName: "",
  country: "",
  organizationType: "",
};

const DEFAULT_EMAIL_SETTINGS = {
  defaultSenderName: "Sarah Smith",
  defaultSenderEmail: "",
};

function readJsonFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? { ...fallback, ...parsed } : fallback;
  } catch {
    return fallback;
  }
}

export default function SettingsPage() {
  const toast = useToast();
  const [rows, setRows] = useState(() => readMembersFromStorage());
  const [basicInfo, setBasicInfo] = useState(() =>
    readJsonFromStorage(SETTINGS_BASIC_INFO_STORAGE_KEY, DEFAULT_BASIC_INFO),
  );
  const [emailSettings, setEmailSettings] = useState(() =>
    readJsonFromStorage(SETTINGS_EMAIL_STORAGE_KEY, DEFAULT_EMAIL_SETTINGS),
  );
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [memberMode, setMemberMode] = useState("add");
  const [activeMember, setActiveMember] = useState(null);
  const [memberPendingDelete, setMemberPendingDelete] = useState(null);
  const [deleteMemberOpen, setDeleteMemberOpen] = useState(false);
  const [pwModalOpen, setPwModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(SETTINGS_MEMBERS_STORAGE_KEY, JSON.stringify(rows));
  }, [rows]);

  const handleAddClick = useCallback(() => {
    setActiveMember(null);
    setMemberMode("add");
    setMemberModalOpen(true);
  }, []);

  const handleEdit = useCallback((member) => {
    setActiveMember(member);
    setMemberMode("edit");
    setMemberModalOpen(true);
  }, []);

  const handleDelete = useCallback((member) => {
    if (!member) return;
    setMemberPendingDelete(member);
    setDeleteMemberOpen(true);
  }, []);

  const handleMemberSubmit = useCallback(async (payload) => {
    if (!payload) return;
    if (payload.id) {
      // update
      setRows((prev) =>
        prev.map((r) => (r.id === payload.id ? { ...r, ...payload } : r)),
      );
    } else {
      // add new with generated id
      const next = { ...payload, id: String(Date.now()) };
      setRows((prev) => [next, ...prev]);
    }
  }, []);

  const handleChangePassword = useCallback(async (form) => {
    // placeholder: implement change password logic
    console.log("change password", form);
  }, []);

  const handleSaveBasicInfo = useCallback(() => {
    localStorage.setItem(
      SETTINGS_BASIC_INFO_STORAGE_KEY,
      JSON.stringify(basicInfo),
    );
    toast.success("Basic information saved.");
  }, [basicInfo, toast]);

  const handleSaveEmailSettings = useCallback(() => {
    if (!emailSettings.defaultSenderName.trim()) {
      toast.error("Default sender name is required.");
      return;
    }
    if (!emailSettings.defaultSenderEmail) {
      toast.error("Please select a default sender email.");
      return;
    }

    localStorage.setItem(
      SETTINGS_EMAIL_STORAGE_KEY,
      JSON.stringify(emailSettings),
    );
    toast.success("Email settings saved.");
  }, [emailSettings, toast]);

  const columns = [
    { key: "name", header: "Member Name" },
    { key: "email", header: "Email" },
    { key: "role", header: "Role" },
    {
      key: "status",
      header: "Status",
      cell: (r) => <StatusPill status={r.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      cell: (r) => (
        <TableActions
          onDelete={() => handleDelete(r)}
          onEdit={() => handleEdit(r)}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* ✅ Removed repeated page header block */}

      <Card className="p-5">
        <div className="text-sm font-semibold text-white/80">
          Basic Information
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <TextField
            label="Ministry Name"
            value={basicInfo.ministryName}
            onChange={(v) =>
              setBasicInfo((prev) => ({ ...prev, ministryName: v }))
            }
            placeholder="Enter ministry name"
          />
          <SelectField
            label="Country"
            value={basicInfo.country}
            onChange={(v) =>
              setBasicInfo((prev) => ({ ...prev, country: v }))
            }
            options={COUNTRY_OPTIONS}
            placeholder="Select country"
          />
          <TextField
            label="Organization Type"
            value={basicInfo.organizationType}
            onChange={(v) =>
              setBasicInfo((prev) => ({ ...prev, organizationType: v }))
            }
            placeholder="admin@makeithappen.org"
          />
          <div className="flex items-end justify-between gap-3">
            <TextField label="Password" placeholder="********" />
            <button className="mb-1 text-sm text-[#8B3DFF] hover:opacity-90">
              Change
            </button>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button size="sm" onClick={handleSaveBasicInfo}>
            Save Changes
          </Button>
        </div>
      </Card>

      <DataTable
        title="Members & Access"
        subtitle="Search team members by name, email, or role"
        searchPlaceholder="Search team members by name, email, or role"
        columns={columns}
        rows={rows}
        total={rows.length}
        primaryAction={
          <Button variant="add" onClick={handleAddClick}>
            + Add Member
          </Button>
        }
        filters={
          <>
            <SelectField
              options={["Role", "Owner", "Admin", "Staff"]}
              placeholder="Role"
            />
            <SelectField
              options={["Status", "Active", "Inactive"]}
              placeholder="Status"
            />
          </>
        }
      />

      <Card className="p-5">
        <div className="text-sm font-semibold text-white/80">
          Email Settings
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <TextField
            label="Default Sender Name"
            value={emailSettings.defaultSenderName}
            onChange={(v) =>
              setEmailSettings((prev) => ({ ...prev, defaultSenderName: v }))
            }
            placeholder="Sarah Smith"
          />
          <SelectField
            label="Default Sender Email"
            value={emailSettings.defaultSenderEmail}
            onChange={(v) =>
              setEmailSettings((prev) => ({ ...prev, defaultSenderEmail: v }))
            }
            options={SENDER_EMAIL_OPTIONS}
            placeholder="Select"
          />
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <button
              type="button"
              onClick={() => setPwModalOpen(true)}
              className="mb-1 text-sm text-[#8B3DFF] hover:opacity-90"
            >
              Change
            </button>
          </div>
          <div>
            <Button size="sm" onClick={handleSaveEmailSettings}>
              Save Changes
            </Button>
          </div>
        </div>
      </Card>

      <AddMemberModal
        open={memberModalOpen}
        onClose={() => setMemberModalOpen(false)}
        mode={memberMode}
        initialValues={activeMember}
        onSubmit={handleMemberSubmit}
      />

      <ChangePasswordModal
        open={pwModalOpen}
        onClose={() => setPwModalOpen(false)}
        onSubmit={handleChangePassword}
      />

      <DeleteMemberModal
        open={deleteMemberOpen}
        onClose={() => {
          setDeleteMemberOpen(false);
          setMemberPendingDelete(null);
        }}
        onConfirm={() => {
          setRows((prev) =>
            prev.filter((member) => member.id !== memberPendingDelete?.id),
          );
          setDeleteMemberOpen(false);
          setMemberPendingDelete(null);
        }}
      />
    </div>
  );
}
