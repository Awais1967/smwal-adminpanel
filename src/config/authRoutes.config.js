export const AUTH_ROUTES = {
  login: "/auth/login",
  requestAccess: "/auth/request-access",
  accessSubmitted: "/auth/access-request-submitted",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
};

export const authRoute = (key) => AUTH_ROUTES[key] || AUTH_ROUTES.login;
