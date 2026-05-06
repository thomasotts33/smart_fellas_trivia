import type { GameSummary } from "@/components/games/GameHistoryTable";

export function PrizeHistory({ games }: { games: GameSummary[] }) {
  const prizeGames = games.filter((game) => game.prizeAmount || game.prizeLabel);
  const totalPrizeAmount = prizeGames.reduce((sum, game) => sum + (game.prizeAmount ?? 0), 0);

  return (
    <section style={{ border: "1px solid var(--sf-border)", borderRadius: "8px", padding: "16px" }}>
      <h2 style={{ fontFamily: "Oswald, Inter, sans-serif", fontSize: "20px", margin: "0 0 12px" }}>
        Prize history
      </h2>
      <p style={{ margin: "0 0 6px" }}>{prizeGames.length} prize nights</p>
      <strong style={{ color: "var(--sf-primary)" }}>${totalPrizeAmount}</strong>
    </section>
  );
}
