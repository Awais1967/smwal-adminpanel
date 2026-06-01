import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "";
const MOCK_MODE = !API_URL; // Use mock mode if no API URL is configured

export const http = axios.create({
  baseURL: API_URL,
  timeout: 25000,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("mih_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // Mark mock requests so we can handle them in response interceptor
  if (MOCK_MODE) {
    config.__isMockRequest = true;
  }
  return config;
});

// Response interceptor with mock handling
http.interceptors.response.use(
  (res) => res,
  (err) => {
    // In mock mode, intercept network errors and return mock data
    if (MOCK_MODE && err?.config?.__isMockRequest) {
      const config = err.config;
      const url = config.url;
      const method = (config.method || "get").toLowerCase();

      console.log(`[MOCK] Intercepting ${method.toUpperCase()} ${url}`);

      // Mock login endpoint
      if (url === "/auth/login" && method === "post") {
        console.log("[MOCK] Returning mock login response");
        const userData = config.data
          ? typeof config.data === "string"
            ? JSON.parse(config.data)
            : config.data
          : {};

        return Promise.resolve({
          status: 200,
          statusText: "OK",
          config,
          headers: {},
          data: {
            token: "mock_token_" + Date.now(),
            user: {
              id: "user_123",
              email: userData.email || "admin@example.com",
              name: "Admin User",
              role: "admin",
            },
          },
        });
      }

      // Mock me endpoint
      if (url === "/auth/me" && method === "get") {
        console.log("[MOCK] Returning mock me response");
        return Promise.resolve({
          status: 200,
          statusText: "OK",
          config,
          headers: {},
          data: {
            id: "user_123",
            email: "admin@example.com",
            name: "Admin User",
            role: "admin",
          },
        });
      }

      // Mock logout endpoint
      if (url === "/auth/logout" && method === "post") {
        console.log("[MOCK] Returning mock logout response");
        return Promise.resolve({
          status: 200,
          statusText: "OK",
          config,
          headers: {},
          data: { success: true },
        });
      }
    }

    if (err?.response?.status === 401) {
      localStorage.removeItem("mih_admin_token");
      localStorage.removeItem("mih_admin_user");
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.assign("/login");
      }
    }

    const message =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  },
);

export default http;
