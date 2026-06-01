import React, { useMemo } from "react";
import { useAdminPanel } from "../context/AdminPanelContext";
import { useAuth } from "../context/AuthContext";
import { FiChevronDown } from "react-icons/fi";

export default function Topbar({ onOpenMobileNav }) {
  const { pageMeta } = useAdminPanel();
  const { logout, user } = useAuth();

  const greeting = useMemo(() => {
    const name = user?.name || "Tom";
    return `Hello ${name} 👋`;
  }, [user]);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="mt-0.5 grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 md:hidden"
        >
          <span className="text-[18px] leading-none">≡</span>
        </button>

        <div>
          <div className="text-[15px] font-semibold text-white">{greeting}</div>
          <div className="mt-1 text-[12px] text-white/55">
            {pageMeta?.subtitle || "Welcome to the admin portal."}
          </div>
        </div>
      </div>

      <details className="relative">
        <summary className="list-none">
          <div className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10">
            <div className="h-7 w-7 rounded-md bg-white/10" />
            <div className="leading-4">
              <div className="text-[12px] font-semibold text-white/85">
                {user?.name || "Tom"}
              </div>
              <div className="text-[10px] text-white/45">
                {user?.role || "Admin Portal"}
              </div>
            </div>
            <FiChevronDown className="text-white/60" />
          </div>
        </summary>

        <div className="absolute right-0 mt-2 w-[180px] overflow-hidden rounded-xl border border-white/10 bg-[#0f0f12] shadow-[0_15px_50px_rgba(0,0,0,.55)]">
          <div className="px-3 py-2 text-[12px] text-white/70">Signed in</div>
          <div className="border-t border-white/10 px-3 py-2 text-[12px] text-white/60">
            {user?.email || "tom@email.com"}
          </div>
          <div className="border-t border-white/10 px-3 py-2 text-[12px] text-white/60">
            {user?.status || user?.role || "Active"}
          </div>
          <button
            type="button"
            onClick={logout}
            className="w-full border-t border-white/10 px-3 py-2 text-left text-[12px] text-white/70 hover:bg-white/5"
          >
            Logout
          </button>
        </div>
      </details>
    </div>
  );
}
