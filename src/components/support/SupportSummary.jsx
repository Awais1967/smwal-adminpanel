import React from "react";
import {
  FiHelpCircle,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";

function SummaryCard({ icon, label, value, loading }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
      <div className="flex items-start justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
          {icon
            ? React.createElement(icon, {
                className: "text-[#3b82f6]",
                size: 16,
              })
            : null}
        </div>
      </div>

      <div className="mt-3 text-[12px] text-white/60">{label}</div>
      <div className="mt-1 text-[22px] font-semibold text-white">
        {loading ? (
          <div className="h-7 w-16 animate-pulse rounded bg-white/10" />
        ) : (
          value
        )}
      </div>
    </div>
  );
}

export default function SupportSummary({ stats, loading = false }) {
  const data = stats || {};
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        icon={FiHelpCircle}
        label="Total Tickets"
        value={data.total ?? 0}
        loading={loading}
      />
      <SummaryCard
        icon={FiClock}
        label="Pending Tickets"
        value={data.pending ?? 0}
        loading={loading}
      />
      <SummaryCard
        icon={FiCheckCircle}
        label="Resolved Tickets"
        value={data.resolved ?? 0}
        loading={loading}
      />
      <SummaryCard
        icon={FiAlertTriangle}
        label="Urgent Tickets"
        value={data.urgent ?? 0}
        loading={loading}
      />
    </div>
  );
}
