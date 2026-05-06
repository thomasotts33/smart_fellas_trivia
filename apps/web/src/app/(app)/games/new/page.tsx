import Link from "next/link";
import { GameForm } from "@/components/game-entry/GameForm";
import { getCurrentTeam } from "@/lib/team";

export default async function NewGamePage() {
  const { team } = await getCurrentTeam();

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

  return (
    <section style={{ display: "grid", gap: "18px", maxWidth: "980px" }}>
      <div>
        <p style={{ color: "var(--sf-primary)", fontWeight: 700, margin: "0 0 8px" }}>New game</p>
        <h1 style={{ margin: "0 0 8px" }}>Log the sheet</h1>
        <p style={{ color: "var(--sf-muted)", margin: 0 }}>
          Copy the paper sheet round by round. The API recalculates totals after save.
        </p>
      </div>
      <GameForm teamId={team.id} />
    </section>
  );
}
