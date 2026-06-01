// src/components/auth/skeletons/AuthFormSkeleton.jsx
import React from "react";

export default function AuthFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-4 w-24 animate-pulse rounded bg-[#23242B]" />
      <div className="h-[44px] w-full animate-pulse rounded-[10px] bg-[#0E0F12]" />

      <div className="h-4 w-24 animate-pulse rounded bg-[#23242B]" />
      <div className="h-[44px] w-full animate-pulse rounded-[10px] bg-[#0E0F12]" />

      <div className="h-[44px] w-full animate-pulse rounded-[10px] bg-[#1D4ED8]/40" />
    </div>
  );
}
