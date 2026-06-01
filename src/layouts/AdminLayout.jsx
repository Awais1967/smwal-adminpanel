import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../ui/Sidebar";
import Topbar from "../ui/Topbar";
import MobileNav from "../ui/MobileNav";
import PageShell from "../ui/PageShell";
import { useAdminPanel } from "../context/AdminPanelContext";

export default function AdminLayout() {
  const { closeMobileNav, mobileNavOpen, openMobileNav } = useAdminPanel();

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      {/* spacer to reserve sidebar width when sidebar is fixed on md+ */}
      <div className="hidden md:block w-62.5 shrink-0" />
      <MobileNav open={mobileNavOpen} onClose={closeMobileNav} />

      <div className="flex flex-1 flex-col">
        <div className="px-5 pt-5">
          <Topbar onOpenMobileNav={openMobileNav} />
        </div>

        <PageShell>
          <Outlet />
        </PageShell>
      </div>
    </div>
  );
}
