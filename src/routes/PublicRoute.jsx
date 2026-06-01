import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute() {
  const { isAuthenticated, booting } = useAuth();
  if (booting) return null;
  if (isAuthenticated) return <Navigate to="/matches" replace />;
  return <Outlet />;
}
