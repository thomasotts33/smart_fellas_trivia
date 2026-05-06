import Link from "next/link";

export type GameSummary = {
  id: string;
  playedAt: string;
  venueName: string | null;
  placement: number | null;
  totalTeams: number | null;
  prizeAmount: number | null;
  prizeLabel: string | null;
  totalEarned: number;
  totalPossible: number;
  percentCorrect: number;
};

export function GameHistoryTable({ games }: { games: GameSummary[] }) {
  if (games.length === 0) {
    return <p style={{ color: "var(--sf-muted)" }}>No games yet. Log your first sheet and let the numbers talk.</p>;
  }

  return (
    <div style={{ border: "1px solid var(--sf-border)", borderRadius: "8px", overflowX: "auto" }}>
      <table aria-label="Game history" style={{ borderCollapse: "collapse", minWidth: "720px", width: "100%" }}>
        <thead style={{ background: "var(--sf-primary)", color: "var(--sf-on-primary)" }}>
          <tr>
            {["Date", "Venue", "Placement", "Points", "Correct", "Prize", ""].map((heading) => (
              <th key={heading} style={{ padding: "10px", textAlign: "left" }}>
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr key={game.id} style={{ borderTop: "1px solid var(--sf-border)" }}>
              <td style={{ padding: "10px" }}>{new Date(game.playedAt).toLocaleDateString()}</td>
              <td style={{ padding: "10px" }}>{game.venueName || "Trivia night"}</td>
              <td style={{ padding: "10px" }}>
                {game.placement ? `${game.placement}/${game.totalTeams ?? "?"}` : "-"}
              </td>
              <td style={{ padding: "10px" }}>
                {game.totalEarned}/{game.totalPossible}
              </td>
              <td style={{ padding: "10px" }}>{game.percentCorrect}%</td>
              <td style={{ padding: "10px" }}>
                {game.prizeAmount ? `$${game.prizeAmount}` : game.prizeLabel || "-"}
              </td>
              <td style={{ padding: "10px" }}>
                <Link href={`/games/${game.id}`} style={{ color: "var(--sf-primary)", fontWeight: 700 }}>
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
