"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api";

export function RemoveMemberButton({ memberId, teamId }: { memberId: string; teamId: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function removeMember() {
    setIsSubmitting(true);
    try {
      await apiFetch(`/api/teams/${teamId}/members/${memberId}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <button
      disabled={isSubmitting}
      onClick={() => void removeMember()}
      style={{
        background: "transparent",
        border: "1px solid var(--sf-border)",
        borderRadius: "6px",
        color: "var(--sf-error)",
        fontWeight: 700,
        padding: "8px 10px",
      }}
      type="button"
    >
      {isSubmitting ? "Removing" : "Remove"}
    </button>
  );
}
