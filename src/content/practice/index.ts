import { chapters } from "../chapters";
import type { ChapterId } from "../types";
import { deriveMatchQuestions, deriveTermQuestions } from "./derive";
import { derivativesQuestions } from "./derivatives";
import { macroQuestions } from "./macro";
import { marketsQuestions } from "./markets";
import { pricingQuestions } from "./pricing";
import { probabilityQuestions } from "./probability";
import { riskQuestions } from "./risk";
import { statisticsQuestions } from "./statistics";
import { strategiesQuestions } from "./strategies";
import type { Question } from "./types";
import { isDerivedQuestion } from "./types";
import { valuationQuestions } from "./valuation";
import { validateQuestions } from "./validate";

export type { Question, QuestionKind, Difficulty, Choice } from "./types";
export {
  difficultyLabel,
  kindLabel,
  isDerivedQuestion,
} from "./types";

export const handwrittenQuestions: Question[] = [
  ...probabilityQuestions,
  ...statisticsQuestions,
  ...marketsQuestions,
  ...macroQuestions,
  ...valuationQuestions,
  ...pricingQuestions,
  ...derivativesQuestions,
  ...strategiesQuestions,
  ...riskQuestions,
];

export const derivedQuestions: Question[] = [
  ...deriveTermQuestions(),
  ...deriveMatchQuestions(),
];

export const allQuestions: Question[] = [
  ...handwrittenQuestions,
  ...derivedQuestions,
];

validateQuestions(allQuestions);

const byId = new Map(allQuestions.map((q) => [q.id, q]));

export function getQuestion(id: string): Question | undefined {
  return byId.get(id);
}

export function requireQuestion(id: string): Question {
  const q = byId.get(id);
  if (!q) throw new Error(`Unknown question: ${id}`);
  return q;
}

export function questionsInChapter(id: ChapterId): Question[] {
  return allQuestions.filter((q) => q.chapter === id);
}

export function questionsInSection(chapter: ChapterId, sectionId: string): Question[] {
  return allQuestions.filter((q) => q.chapter === chapter && q.sectionId === sectionId);
}

export function handwrittenInChapter(id: ChapterId): Question[] {
  return handwrittenQuestions.filter((q) => q.chapter === id);
}

export function chapterQuestionCounts(): Record<
  ChapterId,
  { handwritten: number; derived: number; total: number }
> {
  const out = Object.fromEntries(
    chapters.map((ch) => [ch.id, { handwritten: 0, derived: 0, total: 0 }]),
  ) as Record<ChapterId, { handwritten: number; derived: number; total: number }>;
  for (const q of allQuestions) {
    const bucket = out[q.chapter];
    if (!bucket) continue;
    if (isDerivedQuestion(q)) bucket.derived += 1;
    else bucket.handwritten += 1;
    bucket.total += 1;
  }
  return out;
}
