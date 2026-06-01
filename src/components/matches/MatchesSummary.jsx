// src/components/matches/MatchesSummary.jsx
import React from "react";
import { FiUserCheck, FiUsers, FiXCircle, FiClock } from "react-icons/fi";

function MetricCard({ icon, label, value }) {
  return (
    <div className="flex h-19.5 w-full items-start gap-3 rounded-xl border border-[#23242B] bg-[#141416] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#0E0F12] ring-1 ring-[#23242B] text-[#6EA8FF]">
        {icon}
      </div>

      <div className="min-w-0">
        <div className="text-[11px] font-medium text-[#9AA0AA]">{label}</div>
        <div className="mt-1 text-[18px] font-semibold text-white">{value}</div>
      </div>
    </div>
  );
}

export default function MatchesSummary({ stats, matches }) {
  const computed = React.useMemo(() => {
    if (stats) return stats;

    const list = Array.isArray(matches) ? matches : [];
    const byStatus = (s) =>
      list.filter((m) => (m.status || "").toLowerCase() === s).length;

    return {
      active: byStatus("active"),
      availableUsers: undefined, // keep optional; page can pass separately
      cancelled: byStatus("cancelled"),
      pending: byStatus("pending"),
    };
  }, [stats, matches]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <MetricCard
        icon={<FiUserCheck size={16} />}
        label="Active Matches"
        value={computed.active ?? "—"}
      />
      <MetricCard
        icon={<FiUsers size={16} />}
        label="Available Users"
        value={computed.availableUsers ?? "—"}
      />
      <MetricCard
        icon={<FiXCircle size={16} />}
        label="Cancelled Matches"
        value={computed.cancelled ?? "—"}
      />
      <MetricCard
        icon={<FiClock size={16} />}
        label="Pending Confirmations"
        value={computed.pending ?? "—"}
      />
    </div>
  );
}
