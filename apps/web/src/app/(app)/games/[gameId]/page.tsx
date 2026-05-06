import { GameDetail, type GameDetailData } from "@/components/games/GameDetail";
import { GameActions } from "@/components/games/GameActions";
import { apiFetch } from "@/lib/api";
import { canManageGames } from "@/lib/permissions";
import { getCurrentTeam } from "@/lib/team";

export default async function GameDetailPage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params;
  const { authOptions, team } = await getCurrentTeam();

  if (!team) {
    return <h1>No team yet</h1>;
  }

  const game = await apiFetch<GameDetailData>(`/api/teams/${team.id}/games/${gameId}`, authOptions);

  return (
    <section style={{ display: "grid", gap: "16px" }}>
      <GameActions canManage={canManageGames(team.role)} gameId={gameId} teamId={team.id} />
      <GameDetail game={game} />
    </section>
  );
}
