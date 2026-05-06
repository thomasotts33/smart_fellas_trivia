import Link from "next/link";
import { GameHistoryTable, type GameSummary } from "@/components/games/GameHistoryTable";
import { apiFetch } from "@/lib/api";
import { getCurrentTeam } from "@/lib/team";

export default async function GamesPage() {
  const { authOptions, team } = await getCurrentTeam();

  if (!team) {
    return (
      <section>
        <h1>No team yet</h1>
        <Link href="/team/new" style={{ color: "var(--sf-primary)", fontWeight: 700 }}>
          Create your team
        </Link>
      </section>
    );
  }

  const history = await apiFetch<{ games: GameSummary[]; total: number }>(
    `/api/teams/${team.id}/games`,
    authOptions,
  );

  return (
    <section style={{ display: "grid", gap: "18px" }}>
      <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
        <div>
          <p style={{ color: "var(--sf-primary)", fontWeight: 700, margin: "0 0 8px" }}>Game history</p>
          <h1 style={{ margin: 0 }}>{team.name}</h1>
        </div>
        <Link href="/games/new" style={{ background: "var(--sf-primary)", borderRadius: "6px", color: "var(--sf-on-primary)", fontWeight: 700, padding: "10px 14px" }}>
          Log game
        </Link>
      </div>
      <GameHistoryTable games={history.games} />
    </section>
  );
}
