import Link from "next/link";
import { TrendLineChart, type DataPoint } from "@/components/charts/TrendLineChart";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { KpiCards, type Summary } from "@/components/dashboard/KpiCards";
import { GameHistoryTable, type GameSummary } from "@/components/games/GameHistoryTable";
import { apiFetch } from "@/lib/api";
import { getCurrentTeam } from "@/lib/team";

type Trends = {
  percentCorrectOverTime: DataPoint[];
  pointsOverTime: DataPoint[];
  placementOverTime: DataPoint[];
};

export default async function DashboardPage() {
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

  const [summary, trends, history] = await Promise.all([
    apiFetch<Summary>(`/api/teams/${team.id}/analytics/summary`, authOptions),
    apiFetch<Trends>(`/api/teams/${team.id}/analytics/trends`, authOptions),
    apiFetch<{ games: GameSummary[]; total: number }>(`/api/teams/${team.id}/games?limit=5`, authOptions),
  ]);

  return (
    <section style={{ display: "grid", gap: "18px" }}>
      <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
        <div>
          <p style={{ color: "var(--sf-primary)", fontWeight: 700, margin: "0 0 8px" }}>Dashboard</p>
          <h1 style={{ margin: "0 0 8px" }}>{team.name}</h1>
          <p style={{ color: "var(--sf-muted)", margin: 0 }}>Know what you know. Track what you miss.</p>
        </div>
        <Link href="/games/new" style={{ background: "var(--sf-primary)", borderRadius: "6px", color: "var(--sf-on-primary)", fontWeight: 700, padding: "10px 14px" }}>
          Log game
        </Link>
      </div>
      <KpiCards summary={summary} />
      {summary.gamesLogged === 0 ? <DashboardEmptyState /> : null}
      {summary.gamesLogged === 1 ? <DashboardEmptyState hasOneGame /> : null}
      <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <TrendLineChart data={trends.percentCorrectOverTime} label="Percent correct" />
        <TrendLineChart data={trends.pointsOverTime} label="Points earned" />
      </div>
      <section style={{ display: "grid", gap: "10px" }}>
        <h2 style={{ fontFamily: "Oswald, Inter, sans-serif", margin: 0 }}>Recent games</h2>
        <GameHistoryTable games={history.games} />
      </section>
    </section>
  );
}
