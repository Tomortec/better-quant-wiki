export type SrsCard = {
  ease: number;
  intervalDays: number;
  dueAt: number;
  reps: number;
  lapses: number;
  lastAt: number;
  lastCorrect: boolean;
  seen: number;
  correctCount: number;
};

export function defaultCard(now = Date.now()): SrsCard {
  return {
    ease: 2.5,
    intervalDays: 0,
    dueAt: now,
    reps: 0,
    lapses: 0,
    lastAt: 0,
    lastCorrect: false,
    seen: 0,
    correctCount: 0,
  };
}

const MS_PER_DAY = 86_400_000;

export function sm2Update(card: SrsCard, correct: boolean, now = Date.now()): SrsCard {
  const seen = card.seen + 1;
  const correctCount = card.correctCount + (correct ? 1 : 0);

  if (correct) {
    const reps = card.reps + 1;
    let intervalDays: number;
    if (card.reps === 0) intervalDays = 1;
    else if (card.reps === 1) intervalDays = 6;
    else intervalDays = Math.max(1, Math.round(card.intervalDays * card.ease));
    const ease = Math.min(3.0, card.ease + 0.1);
    return {
      ...card,
      ease,
      intervalDays,
      dueAt: now + intervalDays * MS_PER_DAY,
      reps,
      lastAt: now,
      lastCorrect: true,
      seen,
      correctCount,
    };
  }

  return {
    ...card,
    ease: Math.max(1.3, card.ease - 0.2),
    intervalDays: 1,
    dueAt: now + MS_PER_DAY,
    reps: 0,
    lapses: card.lapses + 1,
    lastAt: now,
    lastCorrect: false,
    seen,
    correctCount,
  };
}

export function isDue(card: SrsCard | undefined, now = Date.now()): boolean {
  if (!card) return true;
  return card.dueAt <= now;
}

export function isWrong(card: SrsCard | undefined): boolean {
  if (!card) return false;
  return card.lastCorrect === false && card.seen > 0;
}
