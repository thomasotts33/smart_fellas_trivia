"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";
import { clearGameDraft, loadGameDraft, saveGameDraft } from "@/lib/formDrafts";
import { validateRoundWagers } from "@/lib/validation/gameForm";
import { FinalQuestionSection } from "./FinalQuestionSection";
import { GameMetaSection } from "./GameMetaSection";
import { HalftimeSection } from "./HalftimeSection";
import { RoundSection } from "./RoundSection";
import type { GameFormState } from "./types";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function initialState(): GameFormState {
  return {
    playedAt: today(),
    venueName: "",
    placement: "",
    totalTeams: "",
    prizeAmount: "",
    prizeLabel: "",
    notes: "",
    rounds: Array.from({ length: 6 }, (_, index) => {
      const roundNumber = index + 1;
      const wagers = roundNumber <= 3 ? [2, 4, 6] : [5, 7, 9];
      return {
        roundNumber,
        questions: wagers.map((wagerValue, questionIndex) => ({
          questionNo: questionIndex + 1,
          categoryName: "",
          wagerValue,
          isCorrect: false,
        })),
      };
    }),
    halftime: { categoryLabel: "", partsCorrect: "0", partsTotal: "4", pointsPossible: "12" },
    finalQuestion: { categoryLabel: "", wagerValue: "0", isCorrect: false },
  };
}

function optionalNumber(value: string) {
  return value === "" ? null : Number(value);
}

function toPayload(state: GameFormState) {
  return {
    playedAt: new Date(`${state.playedAt}T02:00:00.000Z`).toISOString(),
    venueName: state.venueName || null,
    placement: optionalNumber(state.placement),
    totalTeams: optionalNumber(state.totalTeams),
    prizeAmount: optionalNumber(state.prizeAmount),
    prizeLabel: state.prizeLabel || null,
    notes: state.notes || null,
    rounds: state.rounds,
    halftime: {
      categoryLabel: state.halftime.categoryLabel || null,
      partsCorrect: Number(state.halftime.partsCorrect),
      partsTotal: Number(state.halftime.partsTotal),
      pointsPossible: Number(state.halftime.pointsPossible),
    },
    finalQuestion: {
      categoryLabel: state.finalQuestion.categoryLabel || null,
      wagerValue: Number(state.finalQuestion.wagerValue),
      isCorrect: state.finalQuestion.isCorrect,
    },
  };
}

export function GameForm({ teamId }: { teamId: string }) {
  const router = useRouter();
  const [state, setState] = useState<GameFormState>(() => loadGameDraft(teamId) ?? initialState());
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    saveGameDraft(teamId, state);
  }, [state, teamId]);

  const roundErrors = useMemo(
    () =>
      state.rounds
        .map((round) => validateRoundWagers(round.roundNumber, round.questions.map((question) => question.wagerValue)))
        .filter(Boolean),
    [state.rounds],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (roundErrors.length > 0) {
      setError(roundErrors[0] ?? "Fix the round wagers before saving.");
      return;
    }

    setIsSaving(true);
    try {
      const result = await apiFetch<{ id: string }>(`/api/teams/${teamId}/games`, {
        method: "POST",
        body: JSON.stringify(toPayload(state)),
      });
      clearGameDraft(teamId);
      router.push(`/games/${result.id}`);
      router.refresh();
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form aria-busy={isSaving} onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
      <GameMetaSection value={state} onChange={setState} />
      {state.rounds.slice(0, 3).map((round, index) => (
        <RoundSection
          key={round.roundNumber}
          round={round}
          onChange={(updatedRound) => setState({ ...state, rounds: state.rounds.map((item, itemIndex) => (itemIndex === index ? updatedRound : item)) })}
        />
      ))}
      <HalftimeSection value={state.halftime} onChange={(halftime) => setState({ ...state, halftime })} />
      {state.rounds.slice(3).map((round, offset) => {
        const index = offset + 3;
        return (
          <RoundSection
            key={round.roundNumber}
            round={round}
            onChange={(updatedRound) => setState({ ...state, rounds: state.rounds.map((item, itemIndex) => (itemIndex === index ? updatedRound : item)) })}
          />
        );
      })}
      <FinalQuestionSection value={state.finalQuestion} onChange={(finalQuestion) => setState({ ...state, finalQuestion })} />
      {error ? (
        <p role="alert" style={{ color: "var(--sf-error, #B23B3B)", fontWeight: 700, margin: 0 }}>
          {error}
        </p>
      ) : null}
      <button
        aria-label="Save game"
        disabled={isSaving}
        style={{ background: "var(--sf-primary)", border: 0, borderRadius: "6px", color: "var(--sf-on-primary)", fontWeight: 700, padding: "12px 16px" }}
        type="submit"
      >
        {isSaving ? "Saving..." : "Save game"}
      </button>
    </form>
  );
}
