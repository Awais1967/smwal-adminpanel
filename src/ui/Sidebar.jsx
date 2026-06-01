import React from "react";
import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../config/nav.config";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const linkBase =
  "flex items-center gap-3 rounded-lg px-4 py-2 text-[13px] transition-colors";
const inactive = "text-white/70 hover:bg-white/10 hover:text-white/90";
const active = "bg-white text-[#0b74ff] font-semibold";

export default function Sidebar() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    // Clear authentication data immediately
    localStorage.removeItem("mih_admin_token");
    localStorage.removeItem("mih_admin_user");

    try {
      await logout();
    } finally {
      // Redirect after logout completes
      window.location.href = "/auth/login";
    }
  };

  return (
    <aside className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:w-62.5 md:shrink-0">
      <div
        className="flex h-screen w-62.5 flex-col px-4 py-5"
        style={{ background: "var(--sidebar-gradient)" }}
      >
        <div className="px-2 pb-5 pt-1">
          <div className="text-[16px] font-semibold text-white">
            MakeItHappen
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.key}
                to={item.path}
                className={({ isActive }) =>
                  [linkBase, isActive ? active : inactive].join(" ")
                }
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 flex items-center gap-3 rounded-lg bg-white/90 px-4 py-2 text-[13px] font-semibold text-[#7c3aed] hover:bg-white"
        >
          <FiLogOut />
          Sign out
        </button>
      </div>
    </aside>
  );
}
