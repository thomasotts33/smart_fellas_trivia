import type { GameFormState } from "@/components/game-entry/types";

const draftVersion = 1;

function draftKey(teamId: string) {
  return `smartfellas:new-game-draft:v${draftVersion}:${teamId}`;
}

function isGameFormState(value: unknown): value is GameFormState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const draft = value as Partial<GameFormState>;
  return (
    typeof draft.playedAt === "string" &&
    Array.isArray(draft.rounds) &&
    typeof draft.halftime === "object" &&
    typeof draft.finalQuestion === "object"
  );
}

export function loadGameDraft(teamId: string) {
  if (typeof window === "undefined") {
    return null;
  }

  const rawDraft = window.localStorage.getItem(draftKey(teamId));
  if (!rawDraft) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawDraft) as unknown;
    return isGameFormState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveGameDraft(teamId: string, state: GameFormState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(draftKey(teamId), JSON.stringify(state));
}

export function clearGameDraft(teamId: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(draftKey(teamId));
}
