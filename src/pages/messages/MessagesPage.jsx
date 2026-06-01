import React, { useEffect, useMemo, useState } from "react";
import MessagesSummary from "../../components/messages/MessagesSummary";
import MessagesTable from "../../components/messages/MessagesTable";
import CampaignComposerModal from "../../components/messages/modals/CampaignComposerModal";
import DeleteCampaignModal from "../../components/messages/modals/DeleteCampaignModal";
import useToast from "../../hooks/useToastHook";
import messagesService from "../../services/messages.service";

const DEFAULT_MESSAGE =
  "Hi {first_name}, we'd love to help you find your match. Here's what's new for your area and profile.";

const INITIAL_CAMPAIGNS = [
  {
    campaignName: "June Re-engagement",
    segment: "Inactive 30-Day Users",
    recipients: 412,
    status: "Sent",
    sent: 40,
    openRate: 71,
    ctr: 28,
    sendDate: "2026-04-02",
    sendTime: "15:00",
    priority: "Normal",
    message:
      "Hi {first_name}, we've curated new matches for you in {city}. Open the app to reconnect with people who fit your preferences.",
  },
  {
    campaignName: "July Newsletter",
    segment: "Inactive 30-Day Users",
    recipients: 378,
    status: "Sent",
    sent: 35,
    openRate: 65,
    ctr: 20,
    sendDate: "2026-05-05",
    sendTime: "11:30",
    priority: "Normal",
    message:
      "This month's relationship insights, upcoming events, and profile tips are ready for you. Tap in to keep momentum going.",
  },
  {
    campaignName: "August Promotions",
    segment: "Inactive 30-Day Users",
    recipients: 450,
    status: "Draft",
    sent: 50,
    openRate: 75,
    ctr: 30,
    sendDate: "2026-06-10",
    sendTime: "09:30",
    priority: "Low",
    message:
      "Complete your profile this week and unlock better match visibility, stronger recommendations, and more relevant conversations.",
  },
  {
    campaignName: "September Survey",
    segment: "Inactive 30-Day Users",
    recipients: 325,
    status: "Draft",
    sent: 28,
    openRate: 55,
    ctr: 15,
    sendDate: "2026-07-15",
    sendTime: "13:00",
    priority: "Normal",
    message:
      "We'd value your feedback on the latest matching experience. Your response helps us tune recommendations for better results.",
  },
  {
    campaignName: "October Survey",
    segment: "Inactive 30-Day Users",
    recipients: 410,
    status: "Sent",
    sent: 35,
    openRate: 60,
    ctr: 20,
    sendDate: "2026-08-30",
    sendTime: "15:00",
    priority: "High",
    message:
      "Tell us how your latest conversations went so we can improve what you see next and how often we notify you.",
  },
  {
    campaignName: "November Feedback",
    segment: "Inactive 30-Day Users",
    recipients: 275,
    status: "Draft",
    sent: 22,
    openRate: 50,
    ctr: 10,
    sendDate: "2026-09-12",
    sendTime: "10:00",
    priority: "Low",
    message:
      "We noticed you have been quiet lately. Let us know what would make the platform more useful for you right now.",
  },
  {
    campaignName: "December Insights",
    segment: "Inactive 30-Day Users",
    recipients: 490,
    status: "Sent",
    sent: 40,
    openRate: 65,
    ctr: 25,
    sendDate: "2026-10-05",
    sendTime: "14:30",
    priority: "Normal",
    message:
      "Your year-end recap is ready, including profile progress, message trends, and match activity tailored to your journey.",
  },
  {
    campaignName: "October Updates",
    segment: "Inactive 30-Day Users",
    recipients: 540,
    status: "Sent",
    sent: 70,
    openRate: 80,
    ctr: 35,
    sendDate: "2026-08-20",
    sendTime: "16:00",
    priority: "High",
    message:
      "Important updates are live, including profile recommendations, local event suggestions, and improved match ranking.",
  },
  {
    campaignName: "Spring Check-in",
    segment: "Newly Registered Users",
    recipients: 310,
    status: "Draft",
    sent: 25,
    openRate: 58,
    ctr: 17,
    sendDate: "2026-03-14",
    sendTime: "10:30",
    priority: "Normal",
    message:
      "Welcome aboard. We've gathered a few profile tips and first-message prompts to help you get started with confidence.",
  },
];

const GENERATED_MONTHS = [
  { label: "January", month: 1 },
  { label: "February", month: 2 },
  { label: "March", month: 3 },
  { label: "April", month: 4 },
  { label: "May", month: 5 },
  { label: "June", month: 6 },
  { label: "July", month: 7 },
  { label: "August", month: 8 },
  { label: "September", month: 9 },
  { label: "October", month: 10 },
  { label: "November", month: 11 },
  { label: "December", month: 12 },
];

const THEMES = [
  {
    name: "Re-engagement",
    message:
      "Hi {first_name}, we found fresh matches and profile suggestions for {city}. Open the app to keep your progress moving.",
    priority: "Normal",
    status: "Sent",
  },
  {
    name: "Newsletter",
    message:
      "A fresh platform update is here with upcoming events, messaging tips, and account improvements tailored to your activity.",
    priority: "High",
    status: "Sent",
  },
  {
    name: "Promotions",
    message:
      "A limited-time engagement campaign is ready. Complete your profile and refresh your bio to improve response quality.",
    priority: "Low",
    status: "Draft",
  },
  {
    name: "Survey",
    message:
      "We are collecting feedback from active members to improve recommendations, notifications, and conversation quality.",
    priority: "Normal",
    status: "Sent",
  },
];

const SEGMENTS = [
  "All Active Users",
  "Inactive 30-Day Users",
  "Newly Registered Users",
  "Event Attendees",
  "Mentorship Applicants",
];

function formatDisplayDate(isoDate) {
  if (!isoDate) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${isoDate}T00:00:00`));
}

function hashString(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function estimateRecipients(segment, campaignName) {
  const baseBySegment = {
    "All Active Users": 300,
    "Inactive 30-Day Users": 240,
    "Newly Registered Users": 180,
    "Event Attendees": 210,
    "Mentorship Applicants": 195,
  };

  return (baseBySegment[segment] || 220) + (hashString(campaignName) % 95);
}

function normalizeCampaign(campaign, index) {
  return {
    id: campaign.id || `campaign-${index + 1}`,
    campaignName: campaign.campaignName,
    segment: campaign.segment,
    recipients: campaign.recipients,
    status: campaign.status,
    sent: campaign.sent,
    openRate: campaign.openRate,
    ctr: campaign.ctr,
    sendDate: campaign.sendDate,
    sendTime: campaign.sendTime,
    priority: campaign.priority,
    message: campaign.message || DEFAULT_MESSAGE,
    date: formatDisplayDate(campaign.sendDate),
  };
}

function buildGeneratedCampaigns() {
  const generated = [];

  GENERATED_MONTHS.forEach((monthConfig, monthIndex) => {
    THEMES.forEach((theme, themeIndex) => {
      const campaignName = `${monthConfig.label} ${theme.name}`;
      if (
        INITIAL_CAMPAIGNS.some(
          (campaign) => campaign.campaignName === campaignName,
        )
      ) {
        return;
      }

      const segment = SEGMENTS[(monthIndex + themeIndex) % SEGMENTS.length];
      const recipients = 165 + monthIndex * 9 + themeIndex * 33;
      const openRate = 54 + ((monthIndex * 3 + themeIndex * 5) % 29);
      const ctr = 15 + ((monthIndex * 2 + themeIndex * 4) % 20);
      const sendDate = `2026-${String(monthConfig.month).padStart(2, "0")}-${String(
        Math.min(28, 2 + themeIndex * 6 + (monthIndex % 4)),
      ).padStart(2, "0")}`;

      generated.push({
        campaignName,
        segment,
        recipients,
        status: theme.status,
        sent:
          theme.status === "Draft"
            ? Math.round(recipients / 12)
            : Math.round(recipients / 7),
        openRate,
        ctr,
        sendDate,
        sendTime: ["09:00", "11:30", "14:00", "18:00"][
          (monthIndex + themeIndex) % 4
        ],
        priority: theme.priority,
        message: theme.message,
      });
    });
  });

  return generated.map((campaign, index) =>
    normalizeCampaign(campaign, INITIAL_CAMPAIGNS.length + index),
  );
}

function buildDefaultRows() {
  const seededRows = INITIAL_CAMPAIGNS.map(normalizeCampaign);
  const generatedRows = buildGeneratedCampaigns();
  return seededRows.concat(generatedRows).slice(0, 48);
}

function formatCompactNumber(value) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return String(value);
}

function buildCampaignRecord(values, action, existingCampaign) {
  const campaignName = values.campaignName.trim();
  const segment = values.segment;
  const recipients =
    existingCampaign?.segment === segment
      ? existingCampaign.recipients
      : estimateRecipients(segment, campaignName);

  const status =
    action === "draft"
      ? "Draft"
      : action === "publish"
        ? "Sent"
        : existingCampaign?.status || "Sent";

  const metricSeed = hashString(`${campaignName}-${segment}`);
  const openRate =
    status === "Draft"
      ? existingCampaign?.openRate ?? 0
      : existingCampaign?.openRate ?? 55 + (metricSeed % 24);
  const ctr =
    status === "Draft"
      ? existingCampaign?.ctr ?? 0
      : existingCampaign?.ctr ?? 14 + (metricSeed % 18);

  return {
    id: existingCampaign?.id || `campaign-${Date.now()}`,
    campaignName,
    segment,
    recipients,
    status,
    sent:
      status === "Draft"
        ? Math.round(recipients / 12)
        : Math.round(recipients / 7),
    openRate,
    ctr,
    sendDate: values.sendDate,
    sendTime: values.sendTime,
    priority: values.priority,
    message: values.message.trim(),
    date: formatDisplayDate(values.sendDate),
  };
}

export default function MessagesPage() {
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerMode, setComposerMode] = useState("create");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeCampaign, setActiveCampaign] = useState(null);

  const loadCampaigns = React.useCallback(async () => {
    try {
      const data = await messagesService.list({ page: 1, pageSize: 100 });
      setRows(
        data.items.map((campaign, index) =>
          normalizeCampaign(
            {
              ...campaign,
              message: campaign.message || DEFAULT_MESSAGE,
            },
            index,
          ),
        ),
      );
    } catch (error) {
      toast.error(error.message);
      setRows(import.meta.env.VITE_API_URL ? [] : buildDefaultRows());
    }
  }, [toast]);

  useEffect(() => {
    const id = setTimeout(loadCampaigns, 0);
    return () => clearTimeout(id);
  }, [loadCampaigns]);

  const stats = useMemo(() => {
    const totalRecipients = rows.reduce(
      (sum, campaign) => sum + Number(campaign.recipients || 0),
      0,
    );
    const averageOpenRate =
      rows.length > 0
        ? rows.reduce((sum, campaign) => sum + Number(campaign.openRate || 0), 0) /
          rows.length
        : 0;
    const averageCtr =
      rows.length > 0
        ? rows.reduce((sum, campaign) => sum + Number(campaign.ctr || 0), 0) /
          rows.length
        : 0;

    return {
      totalCampaigns: String(rows.length),
      messagesSent: formatCompactNumber(totalRecipients),
      openRate: `${averageOpenRate.toFixed(1)}%`,
      ctrRate: `${averageCtr.toFixed(1)}%`,
    };
  }, [rows]);

  return (
    <div className="space-y-6">
      <MessagesSummary stats={stats} />

      <MessagesTable
        rows={rows}
        onAddCampaign={() => {
          setActiveCampaign(null);
          setComposerMode("create");
          setComposerOpen(true);
        }}
        onViewCampaign={async (campaign) => {
          setActiveCampaign(campaign);
          setComposerMode("view");
          setComposerOpen(true);
          try {
            const detail = await messagesService.getById(campaign.id);
            setActiveCampaign(normalizeCampaign(detail, 0));
          } catch (error) {
            toast.error(error.message);
          }
        }}
        onEditCampaign={(campaign) => {
          setActiveCampaign(campaign);
          setComposerMode("edit");
          setComposerOpen(true);
        }}
        onDeleteCampaign={(campaign) => {
          setActiveCampaign(campaign);
          setDeleteOpen(true);
        }}
      />

      <CampaignComposerModal
        open={composerOpen}
        mode={composerMode}
        campaign={activeCampaign}
        onClose={() => {
          setComposerOpen(false);
          setActiveCampaign(null);
        }}
        onSubmit={async (values, action) => {
          const payload = buildCampaignRecord(values, action, activeCampaign);
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
            loadCampaigns();
          } catch (error) {
            toast.error(error.message);
          }
        }}
      />

      <DeleteCampaignModal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setActiveCampaign(null);
        }}
        onConfirm={async () => {
          if (!activeCampaign?.id) return;
          try {
            await messagesService.remove(activeCampaign.id);
            toast.success("Campaign deleted.");
            setDeleteOpen(false);
            setActiveCampaign(null);
            loadCampaigns();
          } catch (error) {
            toast.error(error.message);
          }
        }}
      />
    </div>
  );
}
