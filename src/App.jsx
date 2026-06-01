import React from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { routeConfig } from "./routes/routeConfig.jsx";
import { AuthProvider } from "./context/AuthContext";
import { AdminPanelProvider } from "./context/AdminPanelContext";
import { ToastViewport } from "./hooks/useToast.jsx";

function AppRoutes() {
  return useRoutes(routeConfig);
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AdminPanelProvider>
          <ToastViewport />
          <AppRoutes />
        </AdminPanelProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}
