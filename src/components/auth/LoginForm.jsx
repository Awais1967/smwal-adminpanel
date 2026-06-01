import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLock, FiMail } from "react-icons/fi";
import AuthCard from "./AuthCard";
import AuthInput from "./AuthInput";
import PasswordField from "./PasswordField";
import AuthPrimaryButton from "./AuthPrimaryButton";
import { AUTH_ROUTES } from "../../config/authRoutes.config";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm({ copy }) {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login({ email, password });
      console.log("Login response:", response);
      // Navigate to matches page after successful login
      navigate("/matches");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title={copy.title} subtitle={copy.subtitle}>
      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}
        <AuthInput
          label="Email"
          icon={<FiMail />}
          placeholder="e.g. Janedoe7@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          disabled={loading}
        />

        <div className="space-y-2">
          <PasswordField
            label="Password"
            icon={<FiLock />}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={loading}
          />

          <div className="flex justify-end">
            <Link
              to={AUTH_ROUTES.forgotPassword}
              className="text-xs text-white/45 hover:text-white/70"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <div className="pt-2">
          <AuthPrimaryButton type="submit" disabled={loading}>
            {loading ? "Signing in..." : copy.submitLabel}
          </AuthPrimaryButton>
        </div>

        <div className="pt-1 text-center text-xs text-white/55">
          {copy.bottomText}{" "}
          <Link
            to={AUTH_ROUTES.requestAccess}
            className="font-medium text-[#7D3AF0] hover:opacity-90"
          >
            {copy.bottomLink}
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
