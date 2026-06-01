/* eslint-disable react-refresh/only-export-components */

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import authService from "../services/auth.service";

const AuthContext = createContext(null);

const LS_TOKEN = "mih_admin_token";
const LS_USER = "mih_admin_user";

export function AuthProvider({ children }) {
  const [booting, setBooting] = useState(true);
  const [token, setToken] = useState(localStorage.getItem(LS_TOKEN) || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(LS_USER);
    return raw ? JSON.parse(raw) : null;
  });

  const isAuthenticated = !!token;

  useEffect(() => {
    const boot = async () => {
      try {
        if (!token) {
          setBooting(false);
          return;
        }
        // optional "me" call (safe if backend exists)
        const me = await authService.me();
        if (me) {
          setUser(me);
          localStorage.setItem(LS_USER, JSON.stringify(me));
        }
      } catch {
        // if token invalid, clear
        localStorage.removeItem(LS_TOKEN);
        localStorage.removeItem(LS_USER);
        setToken("");
        setUser(null);
      } finally {
        setBooting(false);
      }
    };
    boot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (payload) => {
    const res = await authService.login(payload);
    if (res?.token) {
      setToken(res.token);
      localStorage.setItem(LS_TOKEN, res.token);
    }
    if (res?.user) {
      setUser(res.user);
      localStorage.setItem(LS_USER, JSON.stringify(res.user));
    }
    return res;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem(LS_TOKEN);
      localStorage.removeItem(LS_USER);
      setToken("");
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      booting,
      token,
      user,
      setUser,
      isAuthenticated,
      login,
      logout,
    }),
    [booting, token, user, isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
