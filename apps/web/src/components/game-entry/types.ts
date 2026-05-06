export type QuestionState = {
  questionNo: number;
  categoryName: string;
  wagerValue: number;
  isCorrect: boolean;
};

export type RoundState = {
  roundNumber: number;
  questions: QuestionState[];
};

export type GameFormState = {
  playedAt: string;
  venueName: string;
  placement: string;
  totalTeams: string;
  prizeAmount: string;
  prizeLabel: string;
  notes: string;
  rounds: RoundState[];
  halftime: {
    categoryLabel: string;
    partsTotal: string;
    partsCorrect: string;
    pointsPossible: string;
  };
  finalQuestion: {
    categoryLabel: string;
    wagerValue: string;
    isCorrect: boolean;
  };
};
