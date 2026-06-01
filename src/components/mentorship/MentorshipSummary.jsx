import React from "react";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaRegClock,
} from "react-icons/fa";

const Card = ({ icon, label, value }) => (
  <div className="rounded-xl border border-white/10 bg-white/4 p-4">
    <div className="mb-3 flex items-start gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/3">
        {icon
          ? React.createElement(icon, { className: "text-white/80", size: 16 })
          : null}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-white/60">{label}</p>
        <p className="mt-1 text-lg font-semibold text-white">{value}</p>
      </div>
    </div>
  </div>
);

export default function MentorshipSummary({ stats }) {
  const safe = stats || {
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    thisWeek: 0,
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card
        icon={FaCalendarAlt}
        label="Scheduled sessions"
        value={safe.scheduled}
      />
      <Card
        icon={FaCheckCircle}
        label="Completed sessions"
        value={safe.completed}
      />
      <Card
        icon={FaTimesCircle}
        label="Cancelled sessions"
        value={safe.cancelled}
      />
      <Card
        icon={FaRegClock}
        label="Sessions This Week"
        value={safe.thisWeek}
      />
    </div>
  );
}
