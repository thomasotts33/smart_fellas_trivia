import Link from "next/link";
import { TrendLineChart, type DataPoint } from "@/components/charts/TrendLineChart";
import { CategoryPerformance, type CategoryAnalyticsItem } from "@/components/dashboard/CategoryPerformance";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { KpiCards, type Summary } from "@/components/dashboard/KpiCards";
import { PlacementHistory } from "@/components/dashboard/PlacementHistory";
import { PrizeHistory } from "@/components/dashboard/PrizeHistory";
import { RoundPerformance, type RoundAnalyticsItem } from "@/components/dashboard/RoundPerformance";
import { WagerPerformance, type WagerAnalyticsItem } from "@/components/dashboard/WagerPerformance";
import { GameHistoryTable, type GameSummary } from "@/components/games/GameHistoryTable";
import { apiFetch } from "@/lib/api";
import { canManageGames } from "@/lib/permissions";
import { getCurrentTeam } from "@/lib/team";

type Trends = {
  percentCorrectOverTime: DataPoint[];
  pointsOverTime: DataPoint[];
  placementOverTime: DataPoint[];
};

type CategoryAnalytics = {
  categories: CategoryAnalyticsItem[];
};

type WagerAnalytics = {
  wagers: WagerAnalyticsItem[];
};

type RoundAnalytics = {
  rounds: RoundAnalyticsItem[];
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

  const [summary, trends, history, categories, wagers, rounds] = await Promise.all([
    apiFetch<Summary>(`/api/teams/${team.id}/analytics/summary`, authOptions),
    apiFetch<Trends>(`/api/teams/${team.id}/analytics/trends`, authOptions),
    apiFetch<{ games: GameSummary[]; total: number }>(`/api/teams/${team.id}/games?limit=100`, authOptions),
    apiFetch<CategoryAnalytics>(`/api/teams/${team.id}/analytics/categories`, authOptions),
    apiFetch<WagerAnalytics>(`/api/teams/${team.id}/analytics/wagers`, authOptions),
    apiFetch<RoundAnalytics>(`/api/teams/${team.id}/analytics/rounds`, authOptions),
  ]);

  return (
    <section style={{ display: "grid", gap: "18px" }}>
      <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
        <div>
          <p style={{ color: "var(--sf-primary)", fontWeight: 700, margin: "0 0 8px" }}>Dashboard</p>
          <h1 style={{ margin: "0 0 8px" }}>{team.name}</h1>
          <p style={{ color: "var(--sf-muted)", margin: 0 }}>Know what you know. Track what you miss.</p>
        </div>
        {canManageGames(team.role) ? (
          <Link href="/games/new" style={{ background: "var(--sf-primary)", borderRadius: "6px", color: "var(--sf-on-primary)", fontWeight: 700, padding: "10px 14px" }}>
            Log game
          </Link>
        ) : null}
      </div>
      <KpiCards summary={summary} />
      {summary.gamesLogged === 0 ? <DashboardEmptyState /> : null}
      {summary.gamesLogged === 1 ? <DashboardEmptyState hasOneGame /> : null}
      <div className="sf-dashboard-grid">
        <TrendLineChart data={trends.percentCorrectOverTime} label="Percent correct" />
        <TrendLineChart data={trends.pointsOverTime} label="Points earned" />
      </div>
      <div className="sf-dashboard-grid">
        <CategoryPerformance categories={categories.categories} />
        <WagerPerformance wagers={wagers.wagers} />
      </div>
      <div className="sf-dashboard-grid">
        <RoundPerformance rounds={rounds.rounds} />
        <PrizeHistory games={history.games} />
        <PlacementHistory data={trends.placementOverTime} />
      </div>
      <section style={{ display: "grid", gap: "10px" }}>
        <h2 style={{ fontFamily: "Oswald, Inter, sans-serif", margin: 0 }}>Recent games</h2>
        <GameHistoryTable games={history.games.slice(0, 5)} />
      </section>
    </section>
  );
}
