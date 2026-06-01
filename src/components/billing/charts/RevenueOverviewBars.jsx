import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  Subscriptions: "#C026D3", // magenta
  Events: "#6366F1", // blue
  Donations: "#14B8A6", // teal
};

function DotLegend() {
  const items = [
    { key: "Subscriptions", color: COLORS.Subscriptions },
    { key: "Events", color: COLORS.Events },
    { key: "Donations", color: COLORS.Donations },
  ];

  return (
    <div className="mt-3 flex flex-wrap items-center gap-6">
      {items.map((it) => (
        <div key={it.key} className="flex items-center gap-3">
          <span
            className="h-3 w-3 rounded-full"
            style={{ background: it.color }}
          />
          <span className="text-sm font-semibold text-white/80">{it.key}</span>
        </div>
      ))}
    </div>
  );
}

export default function RevenueOverviewBars({ data, range, onRangeChange }) {
  const safe = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-[#232323] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.55)]">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold tracking-tight text-white">
          Revenue Overview
        </h3>

        <select
          value={range}
          onChange={(e) => onRangeChange?.(e.target.value)}
          className="h-9 shrink-0 rounded-lg border border-white/10 bg-black/70 px-3 text-xs font-semibold text-white/80 outline-none"
        >
          <option value="6" className="bg-[#141414] text-white">
            Last 6 Months
          </option>
          <option value="12" className="bg-[#141414] text-white">
            Last 12 Months
          </option>
        </select>
      </div>

      {/* Chart (smaller height + fonts) */}
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={safe}
          barCategoryGap={26}
          barGap={6}
          margin={{ top: 10, right: 8, left: 6, bottom: 0 }}
        >
          <XAxis
            dataKey="month"
            tick={{
              fill: "rgba(255,255,255,0.8)",
              fontSize: 12,
              fontWeight: 700,
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            width={58}
            domain={[0, 6000]}
            ticks={[0, 2000, 4000, 6000]}
            tick={{
              fill: "rgba(255,255,255,0.65)",
              fontSize: 11,
              fontWeight: 700,
            }}
            tickFormatter={(v) => (v === 0 ? "0" : `$${v}`)}
          />

          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
            contentStyle={{
              background: "#0b0b0b",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 12,
              boxShadow: "0 14px 40px rgba(0,0,0,0.55)",
            }}
            labelStyle={{ color: "rgba(255,255,255,0.90)", fontWeight: 800 }}
            itemStyle={{ color: "rgba(255,255,255,0.80)", fontWeight: 700 }}
          />

          {/* pill bars */}
          <Bar
            dataKey="Subscriptions"
            fill={COLORS.Subscriptions}
            barSize={12}
            radius={[999, 999, 999, 999]}
          />
          <Bar
            dataKey="Events"
            fill={COLORS.Events}
            barSize={12}
            radius={[999, 999, 999, 999]}
          />
          <Bar
            dataKey="Donations"
            fill={COLORS.Donations}
            barSize={12}
            radius={[999, 999, 999, 999]}
          />
        </BarChart>
      </ResponsiveContainer>

      <DotLegend />
    </div>
  );
}
