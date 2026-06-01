// src/components/auth/skeletons/AuthSkeleton.jsx
import React from "react";

export default function AuthSkeleton() {
  return (
    <div className="w-full rounded-[18px] border border-[#23242B] bg-[#141416] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.55)] md:p-7">
      <div className="h-5 w-40 animate-pulse rounded bg-[#23242B]" />
      <div className="mt-2 h-4 w-72 animate-pulse rounded bg-[#23242B]" />

      <div className="mt-6 space-y-4">
        <div className="h-4 w-20 animate-pulse rounded bg-[#23242B]" />
        <div className="h-[44px] w-full animate-pulse rounded-[10px] bg-[#0E0F12]" />

        <div className="h-4 w-20 animate-pulse rounded bg-[#23242B]" />
        <div className="h-[44px] w-full animate-pulse rounded-[10px] bg-[#0E0F12]" />

        <div className="h-[44px] w-full animate-pulse rounded-[10px] bg-[#1D4ED8]/40" />
      </div>
    </div>
  );
}
