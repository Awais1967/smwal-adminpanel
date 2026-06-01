import React from "react";
import { FiCalendar, FiUserCheck, FiGlobe, FiFileText } from "react-icons/fi";

const MetricCard = ({ icon, label, value }) => {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black/20">
          {React.createElement(icon, { className: "text-blue-400", size: 18 })}
        </div>
        <div className="min-w-0">
          <p className="text-[12px] text-white/60">{label}</p>
          <p className="mt-1 text-[22px] font-semibold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default function EventsSummary({
  stats = {
    upcoming: 12,
    registrations: 92,
    countries: 41,
    drafts: 17,
  },
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-white/80">Summary</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={FiCalendar}
          label="Upcoming Events"
          value={stats.upcoming}
        />
        <MetricCard
          icon={FiUserCheck}
          label="Active Registrations"
          value={stats.registrations}
        />
        <MetricCard
          icon={FiGlobe}
          label="Countries Covered"
          value={stats.countries}
        />
        <MetricCard
          icon={FiFileText}
          label="Draft Events"
          value={stats.drafts}
        />
      </div>
    </div>
  );
}
