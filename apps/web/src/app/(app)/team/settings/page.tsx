import Link from "next/link";
import { TeamMemberList } from "@/components/team/TeamMemberList";
import { apiFetch } from "@/lib/api";
import { getAuthOptions, getSessionIdentity } from "@/lib/session";

type MeResponse = {
  teams: { id: string; name: string; slug: string; role: string }[];
};

type TeamDetail = {
  id: string;
  name: string;
  slug: string;
  members: { id: string; email: string; name: string | null; role: string }[];
};

export default async function TeamSettingsPage() {
  const identity = await getSessionIdentity();
  const authOptions = getAuthOptions(identity);
  const me = await apiFetch<MeResponse>("/api/me", authOptions);
  const firstTeam = me.teams[0];

  if (!firstTeam) {
    return (
      <section>
        <p style={{ color: "var(--sf-primary)", fontWeight: 700, margin: "0 0 8px" }}>Team settings</p>
        <h1 style={{ margin: "0 0 12px" }}>No team yet</h1>
        <Link href="/team/new" style={{ color: "var(--sf-primary)", fontWeight: 700 }}>
          Create your team
        </Link>
      </section>
    );
  }

  const team = await apiFetch<TeamDetail>(`/api/teams/${firstTeam.id}`, authOptions);

  return (
    <section style={{ display: "grid", gap: "20px", maxWidth: "760px" }}>
      <div>
        <p style={{ color: "var(--sf-primary)", fontWeight: 700, margin: "0 0 8px" }}>Team settings</p>
        <h1 style={{ margin: "0 0 8px" }}>{team.name}</h1>
        <p style={{ color: "var(--sf-muted)", margin: 0 }}>/{team.slug}</p>
      </div>
      <TeamMemberList members={team.members} />
    </section>
  );
}
