"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";

type InviteResult = {
  email: string;
  role: string;
  status: "added" | "invited";
};

export function InviteMemberForm({ teamId }: { teamId: string }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"member" | "admin">("member");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await apiFetch<InviteResult>(`/api/teams/${teamId}/members/invite`, {
        method: "POST",
        body: JSON.stringify({ email, role }),
      });
      setEmail("");
      setRole("member");
      setMessage(
        result.status === "added"
          ? `${result.email} can now view the team as ${result.role}.`
          : `${result.email} is noted as pending until they sign in.`,
      );
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ border: "1px solid var(--sf-border)", borderRadius: "8px", display: "grid", gap: "12px", padding: "16px" }}>
      <h2 style={{ fontFamily: "Oswald, Inter, sans-serif", fontSize: "20px", margin: 0 }}>Invite teammate</h2>
      <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "minmax(200px, 1fr) 140px auto" }}>
        <label style={{ display: "grid", gap: "6px", fontWeight: 700 }}>
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            style={{ border: "1px solid var(--sf-border)", borderRadius: "6px", padding: "10px 12px" }}
          />
        </label>
        <label style={{ display: "grid", gap: "6px", fontWeight: 700 }}>
          Role
          <select
            value={role}
            onChange={(event) => setRole(event.target.value as "member" | "admin")}
            style={{ border: "1px solid var(--sf-border)", borderRadius: "6px", padding: "10px 12px" }}
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <button
          disabled={isSubmitting}
          style={{ alignSelf: "end", background: "var(--sf-primary)", border: 0, borderRadius: "6px", color: "var(--sf-on-primary)", fontWeight: 700, padding: "11px 14px" }}
          type="submit"
        >
          {isSubmitting ? "Adding..." : "Add"}
        </button>
      </div>
      {message ? <p style={{ color: "var(--sf-success)", fontWeight: 700, margin: 0 }}>{message}</p> : null}
      {error ? <p style={{ color: "var(--sf-error)", fontWeight: 700, margin: 0 }}>{error}</p> : null}
    </form>
  );
}
