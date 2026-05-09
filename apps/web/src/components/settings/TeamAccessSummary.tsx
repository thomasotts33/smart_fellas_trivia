import type { TeamSummary } from "@/lib/team";

export function TeamAccessSummary({ teams }: { teams: TeamSummary[] }) {
  return (
    <section style={{ border: "1px solid var(--sf-border)", borderRadius: "8px", overflow: "hidden" }}>
      <div style={{ background: "var(--sf-surface-raised)", borderBottom: "1px solid var(--sf-border)", padding: "12px 14px" }}>
        <h2 style={{ fontFamily: "Oswald, Inter, sans-serif", fontSize: "20px", margin: 0 }}>Team access</h2>
      </div>
      {teams.length === 0 ? (
        <p style={{ color: "var(--sf-muted)", lineHeight: 1.5, margin: 0, padding: "14px" }}>You are not on a team yet.</p>
      ) : (
        <div style={{ display: "grid" }}>
          {teams.map((team) => (
            <div
              key={team.id}
              style={{
                alignItems: "center",
                borderBottom: "1px solid var(--sf-border)",
                display: "grid",
                gap: "12px",
                gridTemplateColumns: "1fr auto",
                padding: "12px 14px",
              }}
            >
              <div>
                <strong>{team.name}</strong>
                <p style={{ color: "var(--sf-muted)", margin: "4px 0 0" }}>/{team.slug}</p>
              </div>
              <span
                style={{
                  background: "var(--sf-surface-raised)",
                  border: "1px solid var(--sf-border)",
                  borderRadius: "999px",
                  fontSize: "13px",
                  fontWeight: 700,
                  padding: "4px 10px",
                  textTransform: "capitalize",
                }}
              >
                {team.role}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
