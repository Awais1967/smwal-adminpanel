import React from "react";
import { FiUsers, FiUserCheck, FiLink2, FiUserX } from "react-icons/fi";

const MetricCard = ({ icon, label, value }) => {
  const Icon = icon;
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black/20">
          <Icon className="text-blue-400" size={18} />
        </div>
        <div>
          <p className="text-[12px] text-white/60">{label}</p>
          <p className="mt-1 text-[22px] font-semibold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default function UsersSummary({
  stats = {
    total: 12,
    available: 92,
    matched: 41,
    inactive: 17,
  },
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-white/80">Summary</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={FiUsers} label="Total Users" value={stats.total} />
        <MetricCard
          icon={FiUserCheck}
          label="Available Users"
          value={stats.available}
        />
        <MetricCard icon={FiLink2} label="Matched" value={stats.matched} />
        <MetricCard icon={FiUserX} label="Inactive" value={stats.inactive} />
      </div>
    </div>
  );
}
