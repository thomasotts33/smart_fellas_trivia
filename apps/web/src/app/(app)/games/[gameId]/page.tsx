import { GameDetail, type GameDetailData } from "@/components/games/GameDetail";
import { apiFetch } from "@/lib/api";
import { getCurrentTeam } from "@/lib/team";

export default async function GameDetailPage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params;
  const { authOptions, team } = await getCurrentTeam();

  if (!team) {
    return <h1>No team yet</h1>;
  }

  const game = await apiFetch<GameDetailData>(`/api/teams/${team.id}/games/${gameId}`, authOptions);

  return <GameDetail game={game} />;
}
