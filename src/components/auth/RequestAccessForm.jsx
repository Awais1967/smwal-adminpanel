import React, { useState } from "react";
import { FiMail, FiType, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AuthCard from "./AuthCard";
import AuthInput from "./AuthInput";
import AuthPrimaryButton from "./AuthPrimaryButton";
import { AUTH_ROUTES } from "../../config/authRoutes.config";

export default function RequestAccessForm({ copy }) {
  const nav = useNavigate();
  const [fullName, setFullName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [reason, setReason] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    // UI-only: send request via backend then navigate
    nav(AUTH_ROUTES.accessSubmitted);
  };

  return (
    <AuthCard title={copy.title} subtitle={copy.subtitle}>
      <form onSubmit={onSubmit} className="space-y-4">
        <AuthInput
          label="Full name"
          icon={<FiUser />}
          placeholder="Enter your name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          autoComplete="name"
        />

        <AuthInput
          label="Work email"
          icon={<FiMail />}
          placeholder="Enter your work email"
          value={workEmail}
          onChange={(e) => setWorkEmail(e.target.value)}
          autoComplete="email"
        />

        <AuthInput
          label="Reason for access"
          as="textarea"
          icon={<FiType />}
          placeholder="Briefly describe how you will use the platform"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
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
