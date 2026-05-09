"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";

export function MemberRoleSelect({ memberId, role, teamId }: { memberId: string; role: string; teamId: string }) {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(role);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function updateRole(nextRole: string) {
    setSelectedRole(nextRole);
    setError(null);
    setIsSubmitting(true);

    try {
      await apiFetch(`/api/teams/${teamId}/members/${memberId}`, {
        body: JSON.stringify({ role: nextRole }),
        method: "PATCH",
      });
      router.refresh();
    } catch (submitError) {
      setSelectedRole(role);
      setError(getErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: "6px" }}>
      <select
        aria-label="Member role"
        disabled={isSubmitting}
        onChange={(event) => void updateRole(event.target.value)}
        style={{ border: "1px solid var(--sf-border)", borderRadius: "6px", padding: "8px 10px" }}
        value={selectedRole}
      >
        <option value="admin">Admin</option>
        <option value="member">Member</option>
      </select>
      {error ? <span style={{ color: "var(--sf-error)", fontSize: "13px", fontWeight: 700 }}>{error}</span> : null}
    </div>
  );
}
