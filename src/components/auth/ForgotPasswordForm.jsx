import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import AuthCard from "./AuthCard";
import AuthInput from "./AuthInput";
import AuthPrimaryButton from "./AuthPrimaryButton";
import AuthSecondaryButton from "./AuthSecondaryButton";
import { AUTH_ROUTES } from "../../config/authRoutes.config";

export default function ForgotPasswordForm({ copy }) {
  const nav = useNavigate();
  const [email, setEmail] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    console.log({ email });
    // UI demo: go to reset screen
    nav(AUTH_ROUTES.resetPassword);
  };

  return (
    <AuthCard title={copy.title} subtitle={copy.subtitle}>
      <form onSubmit={onSubmit} className="space-y-4">
        <AuthInput
          label="Email"
          icon={<FiMail />}
          placeholder="e.g. Janedoe7@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <div className="pt-2">
          <AuthPrimaryButton type="submit">
            {copy.submitLabel}
          </AuthPrimaryButton>
        </div>

        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-white/10" />
          <div className="text-xs text-white/40">OR</div>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <AuthSecondaryButton
          type="button"
          onClick={() => nav(AUTH_ROUTES.login)}
        >
          {copy.secondaryLabel}
        </AuthSecondaryButton>

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
