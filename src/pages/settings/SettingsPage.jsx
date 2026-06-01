// src/pages/settings/SettingsPage.jsx
import React, { useState, useCallback, useEffect, useMemo } from "react";
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
import useTableData from "../../hooks/useTableData";
import settingsService from "../../services/settings.service";

const COUNTRY_OPTIONS = ["United States", "United Kingdom", "Canada"];
const SENDER_EMAIL_OPTIONS = ["sarah@gmail.com", "support@org.com"];
const ROLE_OPTIONS = ["Owner", "Admin", "Staff"];
const STATUS_OPTIONS = ["Active", "Inactive"];

const DEFAULT_BASIC_INFO = {
  ministryName: "",
  country: "",
  organizationType: "",
};

const DEFAULT_EMAIL_SETTINGS = {
  defaultSenderName: "Sarah Smith",
  defaultSenderEmail: "",
};

export default function SettingsPage() {
  const toast = useToast();
  const [basicInfo, setBasicInfo] = useState(DEFAULT_BASIC_INFO);
  const [emailSettings, setEmailSettings] = useState(DEFAULT_EMAIL_SETTINGS);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [memberMode, setMemberMode] = useState("add");
  const [activeMember, setActiveMember] = useState(null);
  const [memberPendingDelete, setMemberPendingDelete] = useState(null);
  const [deleteMemberOpen, setDeleteMemberOpen] = useState(false);
  const [pwModalOpen, setPwModalOpen] = useState(false);

  const fetchMembers = useCallback((params) => settingsService.listMembers(params), []);
  const table = useTableData({
    fetcher: fetchMembers,
    initialPageSize: 7,
    initialFilters: { status: "All", role: "All" },
  });
  const rows = table.items;

  useEffect(() => {
    let active = true;

    settingsService
      .getBasic()
      .then((data) => active && setBasicInfo({ ...DEFAULT_BASIC_INFO, ...data }))
      .catch((error) => toast.error(error.message));

    settingsService
      .getEmailSettings()
      .then(
        (data) =>
          active &&
          setEmailSettings({ ...DEFAULT_EMAIL_SETTINGS, ...data }),
      )
      .catch((error) => toast.error(error.message));

    return () => {
      active = false;
    };
  }, [toast]);

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

  const handleMemberSubmit = useCallback(
    async (payload) => {
      if (!payload) return;
      try {
        if (payload.id) {
          await settingsService.updateMember(payload.id, payload);
          toast.success("Member updated.");
        } else {
          await settingsService.createMember(payload);
          toast.success("Member added.");
        }
        setMemberModalOpen(false);
        setActiveMember(null);
        table.refresh();
      } catch (error) {
        toast.error(error.message);
      }
    },
    [table, toast],
  );

  const handleChangePassword = useCallback(
    async (form) => {
      try {
        await settingsService.changePassword(form);
        toast.success("Password changed.");
        setPwModalOpen(false);
      } catch (error) {
        toast.error(error.message);
      }
    },
    [toast],
  );

  const handleSaveBasicInfo = useCallback(async () => {
    try {
      const data = await settingsService.updateBasic(basicInfo);
      setBasicInfo({ ...DEFAULT_BASIC_INFO, ...data });
      toast.success("Basic information saved.");
    } catch (error) {
      toast.error(error.message);
    }
  }, [basicInfo, toast]);

  const handleSaveEmailSettings = useCallback(async () => {
    if (!emailSettings.defaultSenderName.trim()) {
      toast.error("Default sender name is required.");
      return;
    }
    if (!emailSettings.defaultSenderEmail) {
      toast.error("Please select a default sender email.");
      return;
    }

    try {
      const data = await settingsService.updateEmailSettings(emailSettings);
      setEmailSettings({ ...DEFAULT_EMAIL_SETTINGS, ...data });
      toast.success("Email settings saved.");
    } catch (error) {
      toast.error(error.message);
    }
  }, [emailSettings, toast]);

  const handleConfirmDelete = useCallback(async () => {
    if (!memberPendingDelete?.id) return;
    try {
      await settingsService.removeMember(memberPendingDelete.id);
      toast.success("Member deleted.");
      setDeleteMemberOpen(false);
      setMemberPendingDelete(null);
      table.refresh();
    } catch (error) {
      toast.error(error.message);
    }
  }, [memberPendingDelete, table, toast]);

  const setFilter = useCallback(
    (key, value) => table.setFilters((prev) => ({ ...prev, [key]: value })),
    [table],
  );

  const columns = useMemo(
    () => [
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
    ],
    [handleDelete, handleEdit],
  );

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
        countryValue={table.filters.role}
        onCountryChange={(value) => setFilter("role", value)}
        countryOptions={[
          { value: "All", label: "All Roles" },
          ...ROLE_OPTIONS.map((value) => ({ value, label: value })),
        ]}
        statusOptions={[
          { value: "All", label: "All" },
          ...STATUS_OPTIONS.map((value) => ({ value, label: value })),
        ]}
        primaryAction={
          <Button variant="add" onClick={handleAddClick}>
            + Add Member
          </Button>
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
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
