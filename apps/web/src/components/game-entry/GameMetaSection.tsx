import type { GameFormState } from "./types";

type Props = {
  value: GameFormState;
  onChange: (value: GameFormState) => void;
};

const inputStyle = {
  border: "1px solid var(--sf-border)",
  borderRadius: "6px",
  padding: "10px 12px",
};

export function GameMetaSection({ value, onChange }: Props) {
  return (
    <section style={{ border: "1px solid var(--sf-border)", borderRadius: "8px", display: "grid", gap: "12px", padding: "16px" }}>
      <h2 style={{ fontFamily: "Oswald, Inter, sans-serif", margin: 0 }}>Game</h2>
      <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
        <label style={{ display: "grid", gap: "6px", fontWeight: 700 }}>
          Date
          <input style={inputStyle} type="date" value={value.playedAt} onChange={(event) => onChange({ ...value, playedAt: event.target.value })} />
        </label>
        <label style={{ display: "grid", gap: "6px", fontWeight: 700 }}>
          Venue
          <input style={inputStyle} value={value.venueName} onChange={(event) => onChange({ ...value, venueName: event.target.value })} />
        </label>
        <label style={{ display: "grid", gap: "6px", fontWeight: 700 }}>
          Placement
          <input style={inputStyle} min={1} type="number" value={value.placement} onChange={(event) => onChange({ ...value, placement: event.target.value })} />
        </label>
        <label style={{ display: "grid", gap: "6px", fontWeight: 700 }}>
          Total teams
          <input style={inputStyle} min={1} type="number" value={value.totalTeams} onChange={(event) => onChange({ ...value, totalTeams: event.target.value })} />
        </label>
        <label style={{ display: "grid", gap: "6px", fontWeight: 700 }}>
          Prize amount
          <input style={inputStyle} min={0} step="0.01" type="number" value={value.prizeAmount} onChange={(event) => onChange({ ...value, prizeAmount: event.target.value })} />
        </label>
        <label style={{ display: "grid", gap: "6px", fontWeight: 700 }}>
          Prize label
          <input style={inputStyle} value={value.prizeLabel} onChange={(event) => onChange({ ...value, prizeLabel: event.target.value })} />
        </label>
      </div>
      <label style={{ display: "grid", gap: "6px", fontWeight: 700 }}>
        Notes
        <textarea style={{ ...inputStyle, minHeight: "80px" }} value={value.notes} onChange={(event) => onChange({ ...value, notes: event.target.value })} />
      </label>
    </section>
  );
}
