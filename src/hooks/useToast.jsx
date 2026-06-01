import React, { useEffect, useState } from "react";
import { EVT } from "./useToastHook";

export function ToastViewport() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    function handle(e) {
      const payload = e?.detail || {};
      const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const t = {
        id,
        type: payload.type || "info",
        message: payload.message || "",
      };
      setToasts((s) => [...s, t]);
      const timeout = setTimeout(() => {
        setToasts((s) => s.filter((x) => x.id !== id));
      }, payload.duration || 3500);
      return () => clearTimeout(timeout);
    }

    const listener = (e) => handle(e);
    window.addEventListener(EVT, listener);
    return () => window.removeEventListener(EVT, listener);
  }, []);

  return (
    <div className="fixed right-4 top-4 z-[9999] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={
            `max-w-xs break-words rounded-md px-4 py-2 text-sm font-medium text-white shadow-md $` +
            (t.type === "success"
              ? " bg-emerald-500"
              : t.type === "error"
                ? " bg-red-500"
                : " bg-slate-700")
          }
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
