import React from "react";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import AdminLayout from "../layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";
import RouteLoader from "./RouteLoader";
import { AUTH_ROUTES } from "../config/authRoutes.config";
// lazy-load real page modules
const MatchesPage = React.lazy(
  () => import("../pages/matches/MatchesPage.jsx"),
);
const UsersPage = React.lazy(() => import("../pages/users/UsersPage.jsx"));
const CoursesPage = React.lazy(
  () => import("../pages/courses-content/CoursesContentPage.jsx"),
);
const EventsPage = React.lazy(() => import("../pages/events/EventsPage.jsx"));
const MentorshipPage = React.lazy(
  () => import("../pages/mentorship/MentorshipPage.jsx"),
);
const BillingPage = React.lazy(
  () => import("../pages/billing/BillingPage.jsx"),
);
const SupportPage = React.lazy(
  () => import("../pages/support/SupportPage.jsx"),
);
const MessagesPage = React.lazy(
  () => import("../pages/messages/MessagesPage.jsx"),
);
const SettingsPage = React.lazy(
  () => import("../pages/settings/SettingsPage.jsx"),
);

const LoginPage = React.lazy(() => import("../pages/auth/LoginPage.jsx"));
const ForgotPage = React.lazy(
  () => import("../pages/auth/ForgotPasswordPage.jsx"),
);
const ResetPage = React.lazy(
  () => import("../pages/auth/ResetPasswordPage.jsx"),
);
const RequestAccessPage = React.lazy(
  () => import("../pages/auth/RequestAccessPage.jsx"),
);
const AccessRequestSubmittedPage = React.lazy(
  () => import("../pages/auth/AccessRequestSubmittedPage.jsx"),
);

export const routeConfig = [
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: AUTH_ROUTES.login,
            element: (
              <RouteLoader>
                <LoginPage />
              </RouteLoader>
            ),
          },
          {
            path: AUTH_ROUTES.forgotPassword,
            element: (
              <RouteLoader>
                <ForgotPage />
              </RouteLoader>
            ),
          },
          {
            path: AUTH_ROUTES.resetPassword,
            element: (
              <RouteLoader>
                <ResetPage />
              </RouteLoader>
            ),
          },
          {
            path: AUTH_ROUTES.requestAccess,
            element: (
              <RouteLoader>
                <RequestAccessPage />
              </RouteLoader>
            ),
          },
          {
            path: AUTH_ROUTES.accessSubmitted,
            element: (
              <RouteLoader>
                <AccessRequestSubmittedPage />
              </RouteLoader>
            ),
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="/matches" replace /> },
          {
            path: "/matches",
            element: (
              <RouteLoader>
                <MatchesPage />
              </RouteLoader>
            ),
          },
          {
            path: "/users",
            element: (
              <RouteLoader>
                <UsersPage />
              </RouteLoader>
            ),
          },
          {
            path: "/courses-content",
            element: (
              <RouteLoader>
                <CoursesPage />
              </RouteLoader>
            ),
          },
          {
            path: "/events",
            element: (
              <RouteLoader>
                <EventsPage />
              </RouteLoader>
            ),
          },
          {
            path: "/mentorship",
            element: (
              <RouteLoader>
                <MentorshipPage />
              </RouteLoader>
            ),
          },
          {
            path: "/billing",
            element: (
              <RouteLoader>
                <BillingPage />
              </RouteLoader>
            ),
          },
          {
            path: "/support",
            element: (
              <RouteLoader>
                <SupportPage />
              </RouteLoader>
            ),
          },
          {
            path: "/messages",
            element: (
              <RouteLoader>
                <MessagesPage />
              </RouteLoader>
            ),
          },
          {
            path: "/settings",
            element: (
              <RouteLoader>
                <SettingsPage />
              </RouteLoader>
            ),
          },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/matches" replace /> },
];
