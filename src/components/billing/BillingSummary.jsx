import React from "react";
import {
  FaDollarSign,
  FaRegCreditCard,
  FaHandHoldingHeart,
  FaChartLine,
} from "react-icons/fa";

const Card = ({ icon, label, value }) => (
  <div className="rounded-xl border border-white/10 bg-white/4 p-4">
    <div className="mb-3 flex items-start gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/4">
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

export default function BillingSummary({ stats }) {
  const safe = stats || {
    totalRevenue: "$0",
    subsActive: 0,
    donations: "$0",
    revenueThisMonth: "$0",
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card
        icon={FaDollarSign}
        label="Total Revenue"
        value={safe.totalRevenue}
      />
      <Card
        icon={FaRegCreditCard}
        label="Subscriptions Active"
        value={safe.subsActive}
      />
      <Card
        icon={FaHandHoldingHeart}
        label="Donations Received"
        value={safe.donations}
      />
      <Card
        icon={FaChartLine}
        label="Revenue This Month"
        value={safe.revenueThisMonth}
      />
    </div>
  );
}
