import React from "react";
import AuthShell from "../../components/auth/AuthShell";
import RequestAccessForm from "../../components/auth/RequestAccessForm";
import { AUTH_COPY } from "../../config/authCopy.config";

export default function RequestAccessPage() {
  const copy = AUTH_COPY.requestAccess;
  return (
    <AuthShell eyebrow={copy.shellEyebrow}>
      <RequestAccessForm copy={copy} />
    </AuthShell>
  );
}
