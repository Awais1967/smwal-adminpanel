import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

const COLORS = {
  Subscriptions: "#6366F1", // blue
  Events: "#C026D3", // magenta
  Donations: "#14B8A6", // teal
};

const DEFAULT_TREND = {
  Subscriptions: "up",
  Events: "up",
  Donations: "down",
};

export default function RevenueBreakdownDonut({ data, range, onRangeChange }) {
  const safe = useMemo(() => {
    const arr = Array.isArray(data) ? data : [];
    const total = arr.reduce((s, x) => s + (Number(x.value) || 0), 0) || 1;
    return { arr, total };
  }, [data]);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-[#232323] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.55)]">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold tracking-tight text-white">
          Revenue Breakdown
        </h3>

        <select
          value={range}
          onChange={(e) => onRangeChange?.(e.target.value)}
          className="h-9 shrink-0 rounded-lg border border-white/10 bg-black/70 px-3 text-xs font-semibold text-white/80 outline-none"
        >
          <option value="30" className="bg-[#141414] text-white">
            Last 30 days
          </option>
          <option value="90" className="bg-[#141414] text-white">
            Last 90 days
          </option>
        </select>
      </div>

      <div className="flex flex-col items-center gap-7 lg:flex-row lg:items-center lg:gap-8">
        {/* Donut (smaller) */}
        <div className="w-full max-w-[280px] shrink-0">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={safe.arr}
                dataKey="value"
                nameKey="name"
                innerRadius={74}
                outerRadius={104}
                startAngle={90}
                endAngle={-270}
                paddingAngle={0}
                cornerRadius={999}
              >
                {safe.arr.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[entry.name] || "#64748B"}
                    stroke="transparent"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend (smaller text, better spacing) */}
        <div className="w-full min-w-0 flex-1 space-y-4">
          {safe.arr.map((x) => {
            const pct = Math.round(((Number(x.value) || 0) / safe.total) * 100);
            const trend = x.trend || DEFAULT_TREND[x.name] || "up";

            return (
              <div
                key={x.name}
                className="flex items-center justify-between gap-6"
              >
                {/* left */}
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className="h-4 w-4 shrink-0 rounded-full"
                    style={{ background: COLORS[x.name] || "#64748B" }}
                  />
                  <span className="min-w-0 text-base font-semibold text-white/85">
                    {x.name}
                  </span>
                </div>

                {/* right */}
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-base font-semibold text-white/85 tabular-nums">
                    {pct}%
                  </span>
                  {trend === "down" ? (
                    <FiTrendingDown className="text-red-500" size={16} />
                  ) : (
                    <FiTrendingUp className="text-green-500" size={16} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
