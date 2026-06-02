import React, { useState } from "react";
import { FiLock, FiMail } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import AuthCard from "./AuthCard";
import AuthInput from "./AuthInput";
import PasswordField from "./PasswordField";
import AuthPrimaryButton from "./AuthPrimaryButton";
import { AUTH_ROUTES } from "../../config/authRoutes.config";
import authService from "../../services/auth.service";

export default function ResetPasswordForm({ copy }) {
  const nav = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!email.trim() || !otp.trim()) {
      setError("Email and OTP are required.");
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword({
        email,
        otp,
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
        <AuthInput
          label="Email"
          icon={<FiMail />}
          placeholder="e.g. Janedoe7@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          disabled={loading}
        />
        <PasswordField
          label="OTP"
          icon={<FiLock />}
          placeholder="Enter 5-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          autoComplete="one-time-code"
          disabled={loading}
        />
        <PasswordField
          label="Password"
          icon={<FiLock />}
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          disabled={loading}
        />

        <PasswordField
          label="Confirm Password"
          icon={<FiLock />}
          placeholder="********"
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
