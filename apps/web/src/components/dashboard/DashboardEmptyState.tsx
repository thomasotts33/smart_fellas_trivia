import Link from "next/link";

export function DashboardEmptyState({ hasOneGame }: { hasOneGame?: boolean }) {
  return (
    <section style={{ border: "1px solid var(--sf-border)", borderRadius: "8px", display: "grid", gap: "10px", padding: "18px" }}>
      <h2 style={{ fontFamily: "Oswald, Inter, sans-serif", margin: 0 }}>
        {hasOneGame ? "One sheet logged" : "No games yet"}
      </h2>
      <p style={{ color: "var(--sf-muted)", lineHeight: 1.5, margin: 0 }}>
        {hasOneGame
          ? "That first game is saved. Trends get more interesting after another Wednesday or two."
          : "Log your first sheet and the dashboard will start turning scores into a story."}
      </p>
      <Link href="/games/new" style={{ color: "var(--sf-primary)", fontWeight: 700 }}>
        Log game
      </Link>
    </section>
  );
}
