import React from "react";
import { FiBookOpen, FiLayers, FiVideo, FiGrid } from "react-icons/fi";

/**
 * metrics = {
 *  totalCourses: number,
 *  totalLessons: number,
 *  videoTeachings: number,
 *  categories: number,
 * }
 */
export default function CoursesSummary({ metrics }) {
  const cards = [
    { key: "totalCourses", label: "Total Courses", icon: FiBookOpen },
    { key: "totalLessons", label: "Total Lessons", icon: FiLayers },
    { key: "videoTeachings", label: "Video Teachings", icon: FiVideo },
    { key: "categories", label: "Categories", icon: FiGrid },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ key, label, icon }) => (
        <div
          key={key}
          className="rounded-xl border border-white/10 bg-white/4 px-5 py-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
              {React.createElement(icon, {
                className: "text-[18px] text-white/80",
              })}
            </div>
          </div>

          <div className="mt-3 text-[12px] font-medium text-white/60">
            {label}
          </div>
          <div className="mt-1 text-[18px] font-semibold text-white">
            {typeof metrics?.[key] === "number" ? metrics[key] : 0}
          </div>
        </div>
      ))}
    </div>
  );
}
