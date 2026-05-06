"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";

type TeamResponse = {
  id: string;
  name: string;
  slug: string;
  role: "owner";
};

export function TeamCreateForm() {
  const router = useRouter();
  const [name, setName] = useState("SmartFellas");
  const [slug, setSlug] = useState("smartfellas");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await apiFetch<TeamResponse>("/api/teams", {
        method: "POST",
        body: JSON.stringify({ name, slug: slug || undefined }),
      });
      router.push("/dashboard");
      router.refresh();
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: "1px solid var(--sf-border)",
        borderRadius: "8px",
        display: "grid",
        gap: "16px",
        maxWidth: "520px",
        padding: "20px",
      }}
    >
      <label style={{ display: "grid", gap: "6px", fontWeight: 700 }}>
        Team name
        <input
          required
          minLength={2}
          value={name}
          onChange={(event) => setName(event.target.value)}
          style={{ border: "1px solid var(--sf-border)", borderRadius: "6px", padding: "10px 12px" }}
        />
      </label>
      <label style={{ display: "grid", gap: "6px", fontWeight: 700 }}>
        Team slug
        <input
          minLength={2}
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          style={{ border: "1px solid var(--sf-border)", borderRadius: "6px", padding: "10px 12px" }}
        />
      </label>
      {error ? (
        <p style={{ color: "var(--sf-primary)", fontWeight: 700, margin: 0 }} role="alert">
          {error}
        </p>
      ) : null}
      <button
        disabled={isSubmitting}
        style={{
          background: "var(--sf-primary)",
          border: 0,
          borderRadius: "6px",
          color: "var(--sf-on-primary)",
          cursor: "pointer",
          fontWeight: 700,
          padding: "12px 16px",
        }}
        type="submit"
      >
        {isSubmitting ? "Creating..." : "Create team"}
      </button>
    </form>
  );
}
