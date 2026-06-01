import React from "react";
import AuthShell from "../../components/auth/AuthShell";
import AccessRequestSubmittedCard from "../../components/auth/AccessRequestSubmittedCard";
import { AUTH_COPY } from "../../config/authCopy.config";

export default function AccessRequestSubmittedPage() {
  const copy = AUTH_COPY.accessSubmitted;
  return (
    <AuthShell eyebrow={copy.shellEyebrow}>
      <AccessRequestSubmittedCard copy={copy} />
    </AuthShell>
  );
}
