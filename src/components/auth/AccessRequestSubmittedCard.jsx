import React from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "./AuthCard";
import AuthPrimaryButton from "./AuthPrimaryButton";
import { AUTH_ROUTES } from "../../config/authRoutes.config";

export default function AccessRequestSubmittedCard({ copy }) {
  const nav = useNavigate();

  return (
    <AuthCard className="max-w-130 text-center">
      <div className="mx-auto mb-4 w-full max-w-195">
        {/* Put your real illustration here */}
        <img
          src="/images/illustrations/access-request-submitted.png"
          alt="Access request submitted"
          className="h-auto w-full select-none"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      <div className="text-base font-semibold text-white sm:text-lg">
        {copy.title}
      </div>
      <div className="mt-1 text-xs leading-5 text-white/55 sm:text-sm">
        {copy.subtitle}
      </div>

      <div className="mt-5">
        <AuthPrimaryButton type="button" onClick={() => nav(AUTH_ROUTES.login)}>
          {copy.submitLabel}
        </AuthPrimaryButton>
      </div>

      <div className="mt-3 text-xs italic text-white/40">{copy.footnote}</div>
    </AuthCard>
  );
}
