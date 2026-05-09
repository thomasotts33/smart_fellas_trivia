"use client";

import { signIn } from "next-auth/react";

export function SignInButton({ hasGoogleProvider }: { hasGoogleProvider: boolean }) {
  return (
    <button
      disabled={!hasGoogleProvider}
      onClick={() => void signIn("google", { callbackUrl: "/dashboard" })}
      style={{
        background: hasGoogleProvider ? "var(--sf-primary)" : "var(--sf-border)",
        border: 0,
        borderRadius: "6px",
        color: hasGoogleProvider ? "var(--sf-on-primary)" : "var(--sf-muted)",
        cursor: hasGoogleProvider ? "pointer" : "not-allowed",
        fontWeight: 700,
        padding: "11px 14px",
        width: "100%",
      }}
      type="button"
    >
      Continue with Google
    </button>
  );
}
