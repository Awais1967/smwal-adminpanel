import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AUTH_ROUTES } from "../config/authRoutes.config";

export default function ProtectedRoute() {
  const { isAuthenticated, booting } = useAuth();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const skipLogin =
    import.meta.env.DEV &&
    (params.get("skipLogin") === "1" ||
      localStorage.getItem("mih_skip_login") === "1");

  if (booting) return null; // keep clean; RouteLoader handles page skeletons
  if (skipLogin) return <Outlet />;
  if (!isAuthenticated) return <Navigate to={AUTH_ROUTES.login} replace />;

  return <Outlet />;
}
