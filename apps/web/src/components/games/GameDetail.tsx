import { RoundBreakdown, type GameRound } from "./RoundBreakdown";

export type GameDetailData = {
  playedAt: string;
  venueName: string | null;
  placement: number | null;
  totalTeams: number | null;
  prizeAmount: number | null;
  prizeLabel: string | null;
  totalEarned: number;
  totalPossible: number;
  percentCorrect: number;
  notes: string | null;
  rounds: GameRound[];
  halftime: { categoryLabel: string | null; partsCorrect: number; partsTotal: number; earnedPoints: number; pointsPossible: number } | null;
  finalQuestion: { categoryLabel: string | null; wagerValue: number; isCorrect: boolean; earnedPoints: number } | null;
};

export function GameDetail({ game }: { game: GameDetailData }) {
  return (
    <section style={{ display: "grid", gap: "18px" }}>
      <div>
        <p style={{ color: "var(--sf-primary)", fontWeight: 700, margin: "0 0 8px" }}>
          {new Date(game.playedAt).toLocaleDateString()}
        </p>
        <h1 style={{ margin: "0 0 8px" }}>{game.venueName || "Trivia night"}</h1>
        <p style={{ color: "var(--sf-muted)", margin: 0 }}>
          {game.totalEarned}/{game.totalPossible} points · {game.percentCorrect}% correct
        </p>
      </div>
      <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
        <div style={{ border: "1px solid var(--sf-border)", borderRadius: "8px", padding: "14px" }}>
          <strong>Placement</strong>
          <br />
          {game.placement ? `${game.placement}/${game.totalTeams ?? "?"}` : "-"}
        </div>
        <div style={{ border: "1px solid var(--sf-border)", borderRadius: "8px", padding: "14px" }}>
          <strong>Prize</strong>
          <br />
          {game.prizeAmount ? `$${game.prizeAmount}` : game.prizeLabel || "-"}
        </div>
        <div style={{ border: "1px solid var(--sf-border)", borderRadius: "8px", padding: "14px" }}>
          <strong>Notes</strong>
          <br />
          {game.notes || "-"}
        </div>
      </div>
      <RoundBreakdown rounds={game.rounds} />
      <section style={{ border: "1px solid var(--sf-border)", borderRadius: "8px", padding: "14px" }}>
        <h2 style={{ fontFamily: "Oswald, Inter, sans-serif", margin: "0 0 8px" }}>Halftime & Final</h2>
        <p>
          {game.halftime
            ? `Halftime: ${game.halftime.partsCorrect}/${game.halftime.partsTotal}, ${game.halftime.earnedPoints}/${game.halftime.pointsPossible} pts`
            : "No halftime logged"}
        </p>
        <p>
          {game.finalQuestion
            ? `Final type: ${game.finalQuestion.categoryLabel || "Not set"}, wager ${game.finalQuestion.wagerValue}, ${game.finalQuestion.earnedPoints} pts`
            : "No final logged"}
        </p>
      </section>
    </section>
  );
}
