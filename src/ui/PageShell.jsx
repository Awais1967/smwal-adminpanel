import React from "react";

export default function PageShell({ children }) {
  return (
    <div className="min-h-screen w-full px-5 py-5">
      <div className="mx-auto w-full max-w-300">{children}</div>
    </div>
  );
}
