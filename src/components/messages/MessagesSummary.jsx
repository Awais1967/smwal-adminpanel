import React from "react";
import {
  FiActivity,
  FiBarChart2,
  FiMessageSquare,
  FiSend,
} from "react-icons/fi";

function SummaryCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-(--shadow-card)">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E7EFFF] text-[#0B67CD]">
        {icon}
      </div>

      <div className="mt-4">
        <div className="text-[12px] font-medium text-white/70">{label}</div>
        <div className="mt-2 text-[28px] font-semibold leading-none text-white">
          {value}
        </div>
      </div>
    </div>
  );
}

export default function MessagesSummary({ stats }) {
  return (
    <div>
      <div className="mb-3 text-sm font-semibold text-white/80">Summary</div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={<FiMessageSquare />}
          label="Total Campaigns"
          value={stats.totalCampaigns}
        />
        <SummaryCard
          icon={<FiSend />}
          label="Messages Sent"
          value={stats.messagesSent}
        />
        <SummaryCard
          icon={<FiBarChart2 />}
          label="Open Rate"
          value={stats.openRate}
        />
        <SummaryCard
          icon={<FiActivity />}
          label="CTR Rate"
          value={stats.ctrRate}
        />
      </div>
    </div>
  );
}
