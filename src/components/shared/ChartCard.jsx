import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#4F46E5", "#06B6D4", "#10B981", "#F59E0B"];

export default function ChartCard({ title, data = [], right, children }) {
  const pieData = data.length
    ? data
    : [
        { name: "A", value: 60 },
        { name: "B", value: 40 },
      ];

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between mb-3">
        {title && (
          <div className="text-sm font-semibold text-white">{title}</div>
        )}
        {right && <div className="text-xs text-white/50">{right}</div>}
      </div>
      <div className="h-full w-full min-h-screen">
        {children ? (
          <div className="h-full">{children}</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={20}
                outerRadius={28}
                paddingAngle={2}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
