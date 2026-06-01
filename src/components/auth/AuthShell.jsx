import React from "react";

const PURPLE = "#7D3AF0";

export default function AuthShell({ children }) {
  return (
    <div className="min-h-screen w-full bg-[#0b0b0b]">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
        {/* Left full-screen purple panel */}
        <div
          className="hidden lg:block min-h-screen w-full"
          style={{ backgroundColor: PURPLE }}
        />

        {/* Right full-screen form area */}
        <div className="flex min-h-screen w-full items-center justify-center px-4 sm:px-8 lg:px-12">
          <div className="w-full max-w-130">{children}</div>
        </div>
      </div>
    </div>
  );
}
