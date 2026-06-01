/* eslint-disable react-refresh/only-export-components */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { NAV_ITEMS } from "../config/nav.config";
import { PAGE_META } from "../config/pageMeta.config";

const AdminPanelContext = createContext(null);

function matchesPath(pathname, itemPath) {
  return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
}

export function AdminPanelProvider({ children }) {
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [pageMetaOverride, setPageMetaOverride] = useState(null);

  const activeNavItem = useMemo(() => {
    return (
      NAV_ITEMS.find((item) => matchesPath(location.pathname, item.path)) ||
      NAV_ITEMS[0]
    );
  }, [location.pathname]);

  const activeKey = activeNavItem?.key || "matches";
  const pageMeta = pageMetaOverride || PAGE_META[activeKey] || null;

  const openMobileNav = useCallback(() => setMobileNavOpen(true), []);
  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);
  const toggleMobileNav = useCallback(
    () => setMobileNavOpen((current) => !current),
    [],
  );
  const setPageMeta = useCallback((meta) => setPageMetaOverride(meta), []);
  const resetPageMeta = useCallback(() => setPageMetaOverride(null), []);

  useEffect(() => {
    closeMobileNav();
  }, [closeMobileNav, location.pathname]);

  useEffect(() => {
    resetPageMeta();
  }, [activeKey, resetPageMeta]);

  const value = useMemo(
    () => ({
      activeKey,
      activeNavItem,
      closeMobileNav,
      mobileNavOpen,
      openMobileNav,
      pageMeta,
      resetPageMeta,
      setMobileNavOpen,
      setPageMeta,
      toggleMobileNav,
    }),
    [
      activeKey,
      activeNavItem,
      closeMobileNav,
      mobileNavOpen,
      openMobileNav,
      pageMeta,
      resetPageMeta,
      setPageMeta,
      toggleMobileNav,
    ],
  );

  return (
    <AdminPanelContext.Provider value={value}>
      {children}
    </AdminPanelContext.Provider>
  );
}

export function useAdminPanel() {
  const ctx = useContext(AdminPanelContext);
  if (!ctx) {
    throw new Error("useAdminPanel must be used within AdminPanelProvider");
  }
  return ctx;
}
