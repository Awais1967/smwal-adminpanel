import React, { useState } from "react";
import { FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AuthCard from "./AuthCard";
import PasswordField from "./PasswordField";
import AuthPrimaryButton from "./AuthPrimaryButton";
import { AUTH_ROUTES } from "../../config/authRoutes.config";
import authService from "../../services/auth.service";

export default function ResetPasswordForm({ copy }) {
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword({
        token,
        password,
        newPassword: password,
        confirmPassword: confirm,
      });
      nav(AUTH_ROUTES.login);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title={copy.title} subtitle={copy.subtitle}>
      <form onSubmit={onSubmit} className="space-y-4">
        {error ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        ) : null}
        <PasswordField
          label="Reset Token"
          icon={<FiLock />}
          placeholder="Enter reset token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          autoComplete="one-time-code"
          disabled={loading}
        />
        <PasswordField
          label="Password"
          icon={<FiLock />}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          disabled={loading}
        />

        <PasswordField
          label="Confirm Password"
          icon={<FiLock />}
          placeholder="••••••••"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          disabled={loading}
        />

        <div className="pt-2">
          <AuthPrimaryButton type="submit" disabled={loading}>
            {loading ? "Resetting..." : copy.submitLabel}
          </AuthPrimaryButton>
        </div>
      </form>
    </AuthCard>
  );
}
