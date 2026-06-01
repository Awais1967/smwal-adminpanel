import React from "react";
import AuthShell from "../../components/auth/AuthShell";
import LoginForm from "../../components/auth/LoginForm";
import { AUTH_COPY } from "../../config/authCopy.config";

export default function LoginPage() {
  const copy = AUTH_COPY.login;
  return (
    <AuthShell eyebrow={copy.shellEyebrow}>
      <LoginForm copy={copy} />
    </AuthShell>
  );
}
