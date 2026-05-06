"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";

export function GameActions({ canManage, gameId, teamId }: { canManage: boolean; gameId: string; teamId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!canManage) {
    return null;
  }

  async function handleDelete() {
    if (!window.confirm("Delete this logged game?")) {
      return;
    }

    setError(null);
    setIsDeleting(true);

    try {
      await apiFetch(`/api/teams/${teamId}/games/${gameId}`, { method: "DELETE" });
      router.push("/games");
      router.refresh();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
      setIsDeleting(false);
    }
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      <button
        disabled
        style={{ background: "var(--sf-surface-raised)", border: "1px solid var(--sf-border)", borderRadius: "6px", color: "var(--sf-muted)", fontWeight: 700, padding: "10px 14px" }}
        type="button"
      >
        Edit soon
      </button>
      <button
        disabled={isDeleting}
        onClick={handleDelete}
        style={{ background: "var(--sf-error)", border: 0, borderRadius: "6px", color: "white", fontWeight: 700, padding: "10px 14px" }}
        type="button"
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
      {error ? <p style={{ color: "var(--sf-error)", fontWeight: 700, margin: 0 }}>{error}</p> : null}
    </div>
  );
}
