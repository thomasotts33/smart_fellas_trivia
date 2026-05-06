import { getRequiredWagers, validateRoundWagers } from "@/lib/validation/gameForm";
import { QuestionRow } from "./QuestionRow";
import type { RoundState } from "./types";

type Props = {
  round: RoundState;
  onChange: (round: RoundState) => void;
};

export function RoundSection({ round, onChange }: Props) {
  const wagers = getRequiredWagers(round.roundNumber);
  const error = validateRoundWagers(
    round.roundNumber,
    round.questions.map((question) => question.wagerValue),
  );

  return (
    <section style={{ border: "1px solid var(--sf-border)", borderRadius: "8px", display: "grid", gap: "12px", padding: "16px" }}>
      <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
        <h2 style={{ fontFamily: "Oswald, Inter, sans-serif", margin: 0 }}>Round {round.roundNumber}</h2>
        <span style={{ background: "var(--sf-primary-muted, #F2DDE0)", borderRadius: "999px", color: "var(--sf-primary)", fontWeight: 700, padding: "6px 10px" }}>
          {wagers.join(" / ")}
        </span>
      </div>
      {round.questions.map((question, index) => (
        <QuestionRow
          key={question.questionNo}
          question={question}
          wagers={wagers}
          onChange={(updatedQuestion) =>
            onChange({
              ...round,
              questions: round.questions.map((item, itemIndex) => (itemIndex === index ? updatedQuestion : item)),
            })
          }
        />
      ))}
      {error ? (
        <p role="alert" style={{ color: "var(--sf-error, #B23B3B)", fontWeight: 700, margin: 0 }}>
          {error}
        </p>
      ) : null}
    </section>
  );
}
