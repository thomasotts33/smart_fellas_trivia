"use client";

import { signOut } from "next-auth/react";
import type { SessionIdentity } from "@/lib/session";

export function AccountSettings({ identity }: { identity: SessionIdentity }) {
  return (
    <section style={{ border: "1px solid var(--sf-border)", borderRadius: "8px", display: "grid", gap: "14px", padding: "16px" }}>
      <div>
        <h2 style={{ fontFamily: "Oswald, Inter, sans-serif", fontSize: "20px", margin: "0 0 8px" }}>Account</h2>
        <p style={{ color: "var(--sf-muted)", lineHeight: 1.5, margin: 0 }}>This is the identity SmartFellas uses for team access.</p>
      </div>
      <dl style={{ display: "grid", gap: "10px", margin: 0 }}>
        <div>
          <dt style={{ color: "var(--sf-muted)", fontSize: "13px", fontWeight: 700 }}>Name</dt>
          <dd style={{ margin: 0 }}>{identity.name || "Not provided"}</dd>
        </div>
        <div>
          <dt style={{ color: "var(--sf-muted)", fontSize: "13px", fontWeight: 700 }}>Email</dt>
          <dd style={{ margin: 0 }}>{identity.email}</dd>
        </div>
      </dl>
      <button
        onClick={() => void signOut({ callbackUrl: "/sign-in" })}
        style={{
          background: "transparent",
          border: "1px solid var(--sf-border)",
          borderRadius: "6px",
          color: "var(--sf-on-surface)",
          fontWeight: 700,
          justifySelf: "start",
          padding: "10px 12px",
        }}
        type="button"
      >
        Sign out
      </button>
    </section>
  );
}
