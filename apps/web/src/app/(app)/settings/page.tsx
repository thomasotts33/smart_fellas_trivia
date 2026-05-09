import { AccountSettings } from "@/components/settings/AccountSettings";
import { TeamAccessSummary } from "@/components/settings/TeamAccessSummary";
import { apiFetch } from "@/lib/api";
import { getAuthOptions, getSessionIdentity } from "@/lib/session";
import type { TeamSummary } from "@/lib/team";

type MeResponse = {
  id: string;
  email: string;
  name: string | null;
  teams: TeamSummary[];
};

export default async function SettingsPage() {
  const identity = await getSessionIdentity();

  if (!identity) {
    return null;
  }

  const me = await apiFetch<MeResponse>("/api/me", getAuthOptions(identity));

  return (
    <section style={{ display: "grid", gap: "20px", maxWidth: "760px" }}>
      <div>
        <p style={{ color: "var(--sf-primary)", fontWeight: 700, margin: "0 0 8px" }}>Settings</p>
        <h1 style={{ margin: "0 0 8px" }}>Your account</h1>
        <p style={{ color: "var(--sf-muted)", lineHeight: 1.5, margin: 0 }}>Manage your sign-in identity and see which team spaces you can access.</p>
      </div>
      <AccountSettings identity={{ email: me.email, image: identity.image, name: me.name }} />
      <TeamAccessSummary teams={me.teams} />
    </section>
  );
}
