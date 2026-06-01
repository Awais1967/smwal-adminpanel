export const ENDPOINTS = {
  auth: {
    login: "/admin/auth/login",
    me: "/admin/auth/me",
    logout: "/admin/auth/logout",
    forgotPassword: "/admin/auth/forgot-password",
    resetPassword: "/admin/auth/reset-password",
    create: "/admin/auth/create",
  },

  dashboard: "/dashboard/summary",

  matches: "/matches",
  users: "/users",

  courses: "/courses",
  lessons: "/lessons",

  events: "/events",
  mentorship: "/mentorship-sessions",

  billing: "/billing/transactions",
  support: "/support/tickets",

  messages: {
    campaigns: "/messages/campaigns",
    summary: "/messages/campaigns/summary",
  },

  uploads: "/uploads",

  settings: {
    basic: "/settings/basic",
    members: "/settings/members",
    email: "/settings/email",
    changePassword: "/settings/change-password",
  },
};
