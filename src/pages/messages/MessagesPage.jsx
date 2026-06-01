import React, { useCallback, useEffect, useMemo, useState } from "react";
import MessagesSummary from "../../components/messages/MessagesSummary";
import MessagesTable from "../../components/messages/MessagesTable";
import CampaignComposerModal from "../../components/messages/modals/CampaignComposerModal";
import DeleteCampaignModal from "../../components/messages/modals/DeleteCampaignModal";
import ConfirmDialog from "../../components/shared/Modal/ConfirmDialog";
import useTableData from "../../hooks/useTableData";
import useToast from "../../hooks/useToastHook";
import messagesService from "../../services/messages.service";

const DEFAULT_SUMMARY = {
  totalCampaigns: 0,
  sentCampaigns: 0,
  draftCampaigns: 0,
  totalRecipients: 0,
  averageOpenRate: 0,
  averageCtr: 0,
};

function formatDisplayDate(isoDate) {
  if (!isoDate) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${isoDate}T00:00:00`));
}

function normalizeCampaign(campaign) {
  return {
    id: campaign.id || campaign._id,
    campaignName: campaign.campaignName || "",
    segment: campaign.segment || "",
    recipients: Number(campaign.recipients || 0),
    status: campaign.status || "Draft",
    sent: Number(campaign.sent || 0),
    openRate: Number(campaign.openRate || 0),
    ctr: Number(campaign.ctr || 0),
    sendDate: campaign.sendDate || "",
    sendTime: campaign.sendTime || "",
    priority: campaign.priority || "Normal",
    message: campaign.message || "",
    date: campaign.date || formatDisplayDate(campaign.sendDate),
  };
}

function formatPercent(value) {
  const number = Number(value || 0);
  return `${Number.isFinite(number) ? number : 0}%`;
}

export default function MessagesPage() {
  const toast = useToast();
  const [summary, setSummary] = useState(DEFAULT_SUMMARY);
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerMode, setComposerMode] = useState("create");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchCampaigns = useCallback(async (params) => {
    const data = await messagesService.list({
      ...params,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    return {
      ...data,
      items: data.items.map(normalizeCampaign),
    };
  }, []);

  const table = useTableData({
    fetcher: fetchCampaigns,
    initialPageSize: 10,
    initialFilters: {
      status: "All",
      priority: "All",
      segment: "All",
    },
  });

  const loadSummary = useCallback(async () => {
    try {
      const data = await messagesService.summary();
      setSummary({ ...DEFAULT_SUMMARY, ...data });
    } catch {
      const rows = table.items;
      const sentRows = rows.filter((row) => row.status === "Sent");
      const totalRecipients = rows.reduce(
        (sum, row) => sum + Number(row.recipients || 0),
        0,
      );
      const averageOpenRate = sentRows.length
        ? sentRows.reduce((sum, row) => sum + Number(row.openRate || 0), 0) /
          sentRows.length
        : 0;
      const averageCtr = sentRows.length
        ? sentRows.reduce((sum, row) => sum + Number(row.ctr || 0), 0) /
          sentRows.length
        : 0;

      setSummary({
        totalCampaigns: table.total || rows.length,
        sentCampaigns: sentRows.length,
        draftCampaigns: rows.filter((row) => row.status === "Draft").length,
        totalRecipients,
        averageOpenRate,
        averageCtr,
      });
    }
  }, [table.items, table.total]);

  useEffect(() => {
    const id = setTimeout(loadSummary, 0);
    return () => clearTimeout(id);
  }, [loadSummary]);

  const refreshAll = useCallback(() => {
    table.refresh();
    loadSummary();
  }, [loadSummary, table]);

  const setFilter = useCallback(
    (key, value) => table.setFilters((prev) => ({ ...prev, [key]: value })),
    [table],
  );

  const openCreate = useCallback(() => {
    setActiveCampaign(null);
    setComposerMode("create");
    setComposerOpen(true);
  }, []);

  const openView = useCallback(
    async (campaign) => {
      setActiveCampaign(campaign);
      setComposerMode("view");
      setComposerOpen(true);
      try {
        const detail = await messagesService.getById(campaign.id);
        setActiveCampaign(normalizeCampaign(detail));
      } catch (error) {
        toast.error(error.message);
      }
    },
    [toast],
  );

  const handleSubmit = useCallback(
    async (values, action) => {
      const payload = {
        ...values,
        status:
          action === "draft"
            ? "Draft"
            : action === "publish"
              ? "Sent"
              : values.status,
      };

      setSaving(true);
      try {
        if (composerMode === "edit" && activeCampaign) {
          await messagesService.update(activeCampaign.id, payload);
          toast.success("Campaign updated.");
        } else {
          await messagesService.create(payload);
          toast.success("Campaign created.");
        }
        setComposerOpen(false);
        setActiveCampaign(null);
        refreshAll();
      } catch (error) {
        toast.error(error.message);
      } finally {
        setSaving(false);
      }
    },
    [activeCampaign, composerMode, refreshAll, toast],
  );

  const handleDelete = useCallback(async () => {
    if (!activeCampaign?.id) return;
    setSaving(true);
    try {
      await messagesService.remove(activeCampaign.id);
      toast.success("Campaign deleted.");
      setDeleteOpen(false);
      setActiveCampaign(null);
      refreshAll();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }, [activeCampaign, refreshAll, toast]);

  const handleSend = useCallback(async () => {
    if (!activeCampaign?.id) return;
    setSaving(true);
    try {
      if (messagesService.send) {
        await messagesService.send(activeCampaign.id);
      } else {
        await messagesService.update(activeCampaign.id, { status: "Sent" });
      }
      toast.success("Campaign sent.");
      setSendOpen(false);
      setActiveCampaign(null);
      refreshAll();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }, [activeCampaign, refreshAll, toast]);

  const stats = useMemo(
    () => ({
      totalCampaigns: summary.totalCampaigns,
      sentCampaigns: summary.sentCampaigns,
      draftCampaigns: summary.draftCampaigns,
      totalRecipients: summary.totalRecipients,
      averageOpenRate: formatPercent(summary.averageOpenRate),
      averageCtr: formatPercent(summary.averageCtr),
    }),
    [summary],
  );

  return (
    <div className="space-y-6">
      <MessagesSummary stats={stats} />

      <MessagesTable
        rows={table.items}
        total={table.total}
        loading={table.loading}
        error={table.error}
        page={table.page}
        pageSize={table.pageSize}
        search={table.search}
        filters={table.filters}
        onSearchChange={table.setSearch}
        onFilterChange={setFilter}
        onPageChange={table.setPage}
        onPageSizeChange={table.setPageSize}
        onAddCampaign={openCreate}
        onViewCampaign={openView}
        onEditCampaign={(campaign) => {
          setActiveCampaign(campaign);
          setComposerMode("edit");
          setComposerOpen(true);
        }}
        onDeleteCampaign={(campaign) => {
          setActiveCampaign(campaign);
          setDeleteOpen(true);
        }}
        onSendCampaign={(campaign) => {
          setActiveCampaign(campaign);
          setSendOpen(true);
        }}
      />

      <CampaignComposerModal
        open={composerOpen}
        mode={composerMode}
        campaign={activeCampaign}
        saving={saving}
        onClose={() => {
          setComposerOpen(false);
          setActiveCampaign(null);
        }}
        onSubmit={handleSubmit}
      />

      <DeleteCampaignModal
        open={deleteOpen}
        loading={saving}
        onClose={() => {
          setDeleteOpen(false);
          setActiveCampaign(null);
        }}
        onConfirm={handleDelete}
      />

      <ConfirmDialog
        open={sendOpen}
        onClose={() => {
          setSendOpen(false);
          setActiveCampaign(null);
        }}
        onConfirm={handleSend}
        loading={saving}
        title="Send Campaign?"
        description="This will mark the campaign as sent and let the backend handle notification delivery when that integration is available."
        confirmText="Send Campaign"
      />
    </div>
  );
}
