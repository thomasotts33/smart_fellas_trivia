"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";

export function TeamSettingsForm({ canEdit, name, slug, teamId }: { canEdit: boolean; name: string; slug: string; teamId: string }) {
  const router = useRouter();
  const [teamName, setTeamName] = useState(name);
  const [teamSlug, setTeamSlug] = useState(slug);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      await apiFetch(`/api/teams/${teamId}`, {
        body: JSON.stringify({ name: teamName, slug: teamSlug }),
        method: "PATCH",
      });
      setMessage("Team settings updated.");
      router.refresh();
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ border: "1px solid var(--sf-border)", borderRadius: "8px", display: "grid", gap: "12px", padding: "16px" }}>
      <h2 style={{ fontFamily: "Oswald, Inter, sans-serif", fontSize: "20px", margin: 0 }}>Team details</h2>
      <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <label style={{ display: "grid", gap: "6px", fontWeight: 700 }}>
          Team name
          <input
            disabled={!canEdit || isSubmitting}
            onChange={(event) => setTeamName(event.target.value)}
            required
            style={{ border: "1px solid var(--sf-border)", borderRadius: "6px", padding: "10px 12px" }}
            value={teamName}
          />
        </label>
        <label style={{ display: "grid", gap: "6px", fontWeight: 700 }}>
          Slug
          <input
            disabled={!canEdit || isSubmitting}
            onChange={(event) => setTeamSlug(event.target.value)}
            required
            style={{ border: "1px solid var(--sf-border)", borderRadius: "6px", padding: "10px 12px" }}
            value={teamSlug}
          />
        </label>
      </div>
      {canEdit ? (
        <button
          disabled={isSubmitting}
          style={{
            background: "var(--sf-primary)",
            border: 0,
            borderRadius: "6px",
            color: "var(--sf-on-primary)",
            fontWeight: 700,
            justifySelf: "start",
            padding: "10px 12px",
          }}
          type="submit"
        >
          {isSubmitting ? "Saving..." : "Save team"}
        </button>
      ) : (
        <p style={{ color: "var(--sf-muted)", lineHeight: 1.5, margin: 0 }}>Only team owners can edit these details.</p>
      )}
      {message ? <p style={{ color: "var(--sf-success)", fontWeight: 700, margin: 0 }}>{message}</p> : null}
      {error ? <p style={{ color: "var(--sf-error)", fontWeight: 700, margin: 0 }}>{error}</p> : null}
    </form>
  );
}
