import React from "react";
import Skeleton from "./Skeleton";

export default function SkeletonTable({ rows = 7, className }) {
  return (
    <div
      className={[
        "w-full rounded-2xl border border-white/10 bg-white/5 p-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* toolbar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Skeleton
          className="h-9 w-full rounded-lg md:w-105"
          rounded="rounded-lg"
        />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-27.5 rounded-lg" rounded="rounded-lg" />
          <Skeleton className="h-9 w-27.5 rounded-lg" rounded="rounded-lg" />
        </div>
      </div>

      {/* table */}
      <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
        <div className="grid grid-cols-5 gap-0 border-b border-white/10 bg-white/3 px-4 py-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-3 w-20 rounded-md border-0 bg-white/10"
              rounded="rounded-md"
            />
          ))}
        </div>

        <div>
          {Array.from({ length: rows }).map((_, r) => (
            <div
              key={r}
              className="grid grid-cols-5 items-center gap-0 border-b border-white/5 px-4 py-3 last:border-b-0"
            >
              <Skeleton
                className="h-3 w-24 rounded-md border-0 bg-white/10"
                rounded="rounded-md"
              />
              <Skeleton
                className="h-3 w-24 rounded-md border-0 bg-white/10"
                rounded="rounded-md"
              />
              <Skeleton
                className="h-6 w-16 rounded-md border-0 bg-white/10"
                rounded="rounded-md"
              />
              <Skeleton
                className="h-3 w-28 rounded-md border-0 bg-white/10"
                rounded="rounded-md"
              />
              <div className="flex justify-end gap-2">
                <Skeleton className="h-8 w-8 rounded-lg" rounded="rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" rounded="rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* footer */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <Skeleton className="h-8 w-56 rounded-lg" rounded="rounded-lg" />
        <Skeleton className="h-8 w-44 rounded-lg" rounded="rounded-lg" />
      </div>
    </div>
  );
}
