import type { GameFormState } from "./types";

type Props = {
  value: GameFormState["finalQuestion"];
  onChange: (value: GameFormState["finalQuestion"]) => void;
};

export function FinalQuestionSection({ value, onChange }: Props) {
  const earned = Number(value.wagerValue || 0) * (value.isCorrect ? 1 : -1);

  return (
    <section style={{ border: "1px solid var(--sf-border)", borderRadius: "8px", display: "grid", gap: "12px", padding: "16px" }}>
      <h2 style={{ fontFamily: "Oswald, Inter, sans-serif", margin: 0 }}>Final</h2>
      <div className="sf-form-grid">
        <label style={{ display: "grid", gap: "6px", fontWeight: 700 }}>
          Category
          <input style={{ border: "1px solid var(--sf-border)", borderRadius: "6px", padding: "10px 12px" }} value={value.categoryLabel} onChange={(event) => onChange({ ...value, categoryLabel: event.target.value })} />
        </label>
        <label style={{ display: "grid", gap: "6px", fontWeight: 700 }}>
          Wager
          <input max={20} min={0} type="number" style={{ border: "1px solid var(--sf-border)", borderRadius: "6px", padding: "10px 12px" }} value={value.wagerValue} onChange={(event) => onChange({ ...value, wagerValue: event.target.value })} />
        </label>
        <label style={{ alignItems: "center", display: "flex", gap: "8px", fontWeight: 700 }}>
          <input
            aria-label="Final question correct"
            checked={value.isCorrect}
            onChange={(event) => onChange({ ...value, isCorrect: event.target.checked })}
            type="checkbox"
          />
          Correct
        </label>
      </div>
      <p style={{ color: earned < 0 ? "var(--sf-error, #B23B3B)" : "var(--sf-success, #2F7D4F)", fontWeight: 700, margin: 0 }}>
        Preview: {earned} final points
      </p>
    </section>
  );
}
