import React from "react";
import Skeleton from "./Skeleton";

export default function SkeletonCard({ className }) {
  return (
    <div
      className={[
        "h-21.5 rounded-2xl border border-white/10 bg-white/5 p-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex h-full items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-xl" rounded="rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-24 rounded-lg" rounded="rounded-lg" />
          <Skeleton className="h-4 w-14 rounded-lg" rounded="rounded-lg" />
        </div>
      </div>
    </div>
  );
}
