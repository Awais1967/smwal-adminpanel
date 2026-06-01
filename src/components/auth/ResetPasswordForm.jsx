import React, { useState } from "react";
import { FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AuthCard from "./AuthCard";
import PasswordField from "./PasswordField";
import AuthPrimaryButton from "./AuthPrimaryButton";
import { AUTH_ROUTES } from "../../config/authRoutes.config";

export default function ResetPasswordForm({ copy }) {
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    console.log({ password, confirm });
    nav(AUTH_ROUTES.login);
  };

  return (
    <AuthCard title={copy.title} subtitle={copy.subtitle}>
      <form onSubmit={onSubmit} className="space-y-4">
        <PasswordField
          label="Password"
          icon={<FiLock />}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />

        <PasswordField
          label="Confirm Password"
          icon={<FiLock />}
          placeholder="••••••••"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
        />

        <div className="pt-2">
          <AuthPrimaryButton type="submit">
            {copy.submitLabel}
          </AuthPrimaryButton>
        </div>
      </form>
    </AuthCard>
  );
}
