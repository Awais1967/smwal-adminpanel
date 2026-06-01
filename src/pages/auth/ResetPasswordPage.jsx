import React from "react";
import AuthShell from "../../components/auth/AuthShell";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";
import { AUTH_COPY } from "../../config/authCopy.config";

export default function ResetPasswordPage() {
  const copy = AUTH_COPY.resetPassword;
  return (
    <AuthShell eyebrow={copy.shellEyebrow}>
      <ResetPasswordForm copy={copy} />
    </AuthShell>
  );
}
