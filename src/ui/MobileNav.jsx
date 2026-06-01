import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../config/nav.config";
import { FiX, FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function MobileNav({ open, onClose }) {
  const { logout } = useAuth();

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999] md:hidden">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div
        className="absolute left-0 top-0 h-full w-[280px] p-4"
        style={{ background: "var(--sidebar-gradient)" }}
      >
        <div className="flex items-center justify-between">
          <div className="text-[16px] font-semibold text-white">
            MakeItHappen
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 text-white/80"
          >
            <FiX />
          </button>
        </div>

        <div className="mt-5 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.key}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-lg px-4 py-2 text-[13px] transition-colors",
                    isActive
                      ? "bg-white text-[#0b74ff] font-semibold"
                      : "text-white/75 hover:bg-white/10",
                  ].join(" ")
                }
              >
                <Icon size={16} />
                {item.label}
              </NavLink>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            logout();
            onClose();
          }}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-white/90 py-2 text-[13px] font-semibold text-[#7c3aed]"
        >
          <FiLogOut />
          Sign out
        </button>
      </div>
    </div>,
    document.body,
  );
}
