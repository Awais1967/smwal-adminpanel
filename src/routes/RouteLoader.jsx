import React, { Suspense } from "react";

function PageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-[86px] rounded-xl border border-white/10 bg-white/5"
          >
            <div className="h-full w-full animate-pulse" />
          </div>
        ))}
      </div>
      <div className="h-10 w-full rounded-lg border border-white/10 bg-white/5" />
      <div className="h-[420px] w-full rounded-xl border border-white/10 bg-white/5" />
    </div>
  );
}

export default function RouteLoader({ children }) {
  return <Suspense fallback={<PageSkeleton />}>{children}</Suspense>;
}
