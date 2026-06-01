import React from "react";
import AuthShell from "../../components/auth/AuthShell";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";
import { AUTH_COPY } from "../../config/authCopy.config";

export default function ForgotPasswordPage() {
  const copy = AUTH_COPY.forgotPassword;
  return (
    <AuthShell eyebrow={copy.shellEyebrow}>
      <ForgotPasswordForm copy={copy} />
    </AuthShell>
  );
}
