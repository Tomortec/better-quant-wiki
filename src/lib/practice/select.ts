import {
  allQuestions,
  handwrittenQuestions,
  isDerivedQuestion,
} from "@/content/practice";
import type { Difficulty, Question, QuestionKind } from "@/content/practice/types";
import type { ChapterId } from "@/content/types";
import type { SrsCard } from "./srs";
import { isDue, isWrong } from "./srs";

export const DEFAULT_QUIZ_SIZE = 10;

export type SelectOptions = {
  chapter?: ChapterId;
  sectionId?: string;
  difficulties?: Difficulty[];
  kinds?: QuestionKind[];
  count?: number;
  now?: number;
  cards?: Record<string, SrsCard>;
};

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = next[i];
    const b = next[j];
    if (a === undefined || b === undefined) continue;
    next[i] = b;
    next[j] = a;
  }
  return next;
}

function matchesFilters(q: Question, opts: SelectOptions): boolean {
  if (opts.chapter && q.chapter !== opts.chapter) return false;
  if (opts.sectionId && q.sectionId !== opts.sectionId) return false;
  if (opts.difficulties && opts.difficulties.length > 0 && !opts.difficulties.includes(q.difficulty)) {
    return false;
  }
  if (opts.kinds && opts.kinds.length > 0 && !opts.kinds.includes(q.kind)) return false;
  return true;
}

function rank(q: Question, cards: Record<string, SrsCard> | undefined, now: number): number {
  const card = cards?.[q.id];
  if (!card || card.seen === 0) return 0;
  if (isDue(card, now)) return 1;
  return 2 + card.intervalDays;
}

function takeRanked(
  pool: Question[],
  n: number,
  cards: Record<string, SrsCard> | undefined,
  now: number,
): Question[] {
  const sorted = [...pool].sort((a, b) => rank(a, cards, now) - rank(b, cards, now));
  const buckets = new Map<number, Question[]>();
  for (const q of sorted) {
    const r = rank(q, cards, now);
    const list = buckets.get(r) ?? [];
    list.push(q);
    buckets.set(r, list);
  }
  const out: Question[] = [];
  for (const r of [...buckets.keys()].sort((a, b) => a - b)) {
    const shuffled = shuffle(buckets.get(r) ?? []);
    for (const q of shuffled) {
      if (out.length >= n) return out;
      out.push(q);
    }
  }
  return out;
}

export function selectChapterQuiz(opts: SelectOptions): Question[] {
  const count = opts.count ?? DEFAULT_QUIZ_SIZE;
  const now = opts.now ?? Date.now();
  const pool = allQuestions.filter((q) => matchesFilters(q, opts));
  const handwritten = pool.filter((q) => !isDerivedQuestion(q));
  const matches = pool.filter((q) => q.kind === "match" && isDerivedQuestion(q));
  const terms = pool.filter((q) => q.kind === "term");

  const traps = handwritten.filter((q) => q.difficulty === 3);
  const restHand = handwritten.filter((q) => q.difficulty !== 3);

  const chosen: Question[] = [];
  const used = new Set<string>();
  const push = (qs: Question[]) => {
    for (const q of qs) {
      if (chosen.length >= count) return;
      if (used.has(q.id)) continue;
      used.add(q.id);
      chosen.push(q);
    }
  };

  push(takeRanked(traps, Math.min(2, count), opts.cards, now));
  push(takeRanked(restHand, Math.min(7, count - chosen.length), opts.cards, now));
  push(takeRanked(matches, 1, opts.cards, now));
  push(takeRanked(terms, count - chosen.length, opts.cards, now));
  push(takeRanked(pool.filter((q) => !used.has(q.id)), count - chosen.length, opts.cards, now));
  return shuffle(chosen);
}

export function selectReviewQuiz(opts: SelectOptions): Question[] {
  const count = opts.count ?? DEFAULT_QUIZ_SIZE;
  const now = opts.now ?? Date.now();
  const cards = opts.cards ?? {};
  const due = allQuestions.filter((q) => {
    if (!matchesFilters(q, opts)) return false;
    const card = cards[q.id];
    return Boolean(card && card.seen > 0 && isDue(card, now));
  });
  const picked = takeRanked(due, count, cards, now);
  if (picked.length >= count) return picked;
  const fill = selectChapterQuiz({
    ...opts,
    count: count - picked.length,
    cards,
    now,
  }).filter((q) => !picked.some((p) => p.id === q.id));
  return [...picked, ...fill].slice(0, count);
}

export function selectWrongQuiz(opts: SelectOptions): Question[] {
  const count = opts.count ?? DEFAULT_QUIZ_SIZE;
  const now = opts.now ?? Date.now();
  const cards = opts.cards ?? {};
  const wrong = allQuestions.filter((q) => {
    if (!matchesFilters(q, opts)) return false;
    return isWrong(cards[q.id]);
  });
  return takeRanked(wrong, count, cards, now);
}

export function filterHandwritten(opts: Pick<SelectOptions, "chapter" | "sectionId">): Question[] {
  return handwrittenQuestions.filter((q) => {
    if (opts.chapter && q.chapter !== opts.chapter) return false;
    if (opts.sectionId && q.sectionId !== opts.sectionId) return false;
    return true;
  });
}
