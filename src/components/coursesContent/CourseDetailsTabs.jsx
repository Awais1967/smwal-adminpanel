import React from "react";

export default function CourseDetailsTabs({ value = "basic", onChange }) {
  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "lessons", label: "Lessons Info" },
  ];

  return (
    <div className="flex items-center gap-2">
      {tabs.map((t) => {
        const active = value === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange?.(t.id)}
            className={[
              "rounded-lg px-3 py-1.5 text-[12px] font-medium transition",
              active
                ? "bg-[#0B7BFF] text-white shadow-[0_10px_26px_rgba(11,123,255,0.35)]"
                : "bg-white/5 text-white/70 hover:bg-white/10",
            ].join(" ")}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
