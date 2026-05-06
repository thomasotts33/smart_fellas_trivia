import type { GameFormState } from "./types";

type Props = {
  value: GameFormState["halftime"];
  onChange: (value: GameFormState["halftime"]) => void;
};

export function HalftimeSection({ value, onChange }: Props) {
  return (
    <section style={{ border: "1px solid var(--sf-border)", borderRadius: "8px", display: "grid", gap: "12px", padding: "16px" }}>
      <h2 style={{ fontFamily: "Oswald, Inter, sans-serif", margin: 0 }}>Halftime</h2>
      <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
        <label style={{ display: "grid", gap: "6px", fontWeight: 700 }}>
          Category
          <input style={{ border: "1px solid var(--sf-border)", borderRadius: "6px", padding: "10px 12px" }} value={value.categoryLabel} onChange={(event) => onChange({ ...value, categoryLabel: event.target.value })} />
        </label>
        <label style={{ display: "grid", gap: "6px", fontWeight: 700 }}>
          Parts correct
          <input min={0} type="number" style={{ border: "1px solid var(--sf-border)", borderRadius: "6px", padding: "10px 12px" }} value={value.partsCorrect} onChange={(event) => onChange({ ...value, partsCorrect: event.target.value })} />
        </label>
        <label style={{ display: "grid", gap: "6px", fontWeight: 700 }}>
          Parts total
          <input min={1} type="number" style={{ border: "1px solid var(--sf-border)", borderRadius: "6px", padding: "10px 12px" }} value={value.partsTotal} onChange={(event) => onChange({ ...value, partsTotal: event.target.value })} />
        </label>
        <label style={{ display: "grid", gap: "6px", fontWeight: 700 }}>
          Points
          <input min={1} type="number" style={{ border: "1px solid var(--sf-border)", borderRadius: "6px", padding: "10px 12px" }} value={value.pointsPossible} onChange={(event) => onChange({ ...value, pointsPossible: event.target.value })} />
        </label>
      </div>
    </section>
  );
}
