import React from "react";
import Skeleton from "./Skeleton";

export default function SkeletonModal({ titleWidth = 220, lines = 6 }) {
  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />

      <div className="relative w-full max-w-190 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f14]/90 shadow-(--shadow-card)">
        {/* header */}
        <div className="flex items-start justify-between gap-3 border-b border-white/10 px-6 py-5">
          <div className="space-y-2">
            <Skeleton
              className={`h-4 rounded-lg border-0 bg-white/10`}
              rounded="rounded-lg"
              style={{ width: titleWidth }}
            />
            <Skeleton
              className="h-3 w-[320px] rounded-lg border-0 bg-white/10"
              rounded="rounded-lg"
            />
          </div>
          <Skeleton className="h-9 w-9 rounded-xl" rounded="rounded-xl" />
        </div>

        {/* body */}
        <div className="px-6 py-5">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="space-y-3">
              {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-3 w-full rounded-lg border-0 bg-white/10"
                  rounded="rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="border-t border-white/10 px-6 py-5">
          <Skeleton className="h-10 w-full rounded-lg" rounded="rounded-lg" />
        </div>
      </div>
    </div>
  );
}
