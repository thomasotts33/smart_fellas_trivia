import type { QuestionState } from "./types";

type Props = {
  question: QuestionState;
  wagers: number[];
  onChange: (question: QuestionState) => void;
};

export function QuestionRow({ question, wagers, onChange }: Props) {
  return (
    <div className="sf-question-row">
      <strong>Q{question.questionNo}</strong>
      <label style={{ display: "grid", gap: "6px" }}>
        Category
        <input
          required
          value={question.categoryName}
          onChange={(event) => onChange({ ...question, categoryName: event.target.value })}
          style={{ border: "1px solid var(--sf-border)", borderRadius: "6px", padding: "10px 12px" }}
        />
      </label>
      <div style={{ display: "flex", gap: "6px" }}>
        {wagers.map((wager) => (
          <button
            aria-label={`Set question ${question.questionNo} wager to ${wager}`}
            aria-pressed={question.wagerValue === wager}
            key={wager}
            type="button"
            onClick={() => onChange({ ...question, wagerValue: wager })}
            style={{
              background: question.wagerValue === wager ? "var(--sf-primary)" : "var(--sf-surface-raised)",
              border: "1px solid var(--sf-border)",
              borderRadius: "999px",
              color: question.wagerValue === wager ? "var(--sf-on-primary)" : "var(--sf-on-surface)",
              fontWeight: 700,
              minWidth: "38px",
              padding: "8px 10px",
            }}
          >
            {wager}
          </button>
        ))}
      </div>
      <label style={{ alignItems: "center", display: "flex", gap: "8px", fontWeight: 700 }}>
        <input
          aria-label={`Question ${question.questionNo} correct`}
          checked={question.isCorrect}
          onChange={(event) => onChange({ ...question, isCorrect: event.target.checked })}
          type="checkbox"
        />
        Correct
      </label>
    </div>
  );
}
