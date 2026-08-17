import type { ChapterId } from "../types";

export type Difficulty = 1 | 2 | 3;
export type QuestionKind = "single" | "multi" | "truefalse" | "match" | "term";
export type QuestionSkill = "recall" | "calculation" | "trap";
export type TermPrompt = "en" | "zh" | "definition";

export type Choice = {
  id: string;
  text: string;
};

type QuestionBase = {
  id: string;
  chapter: ChapterId;
  sectionId?: string;
  conceptSlugs: string[];
  difficulty: Difficulty;
  skill?: QuestionSkill;
  stem: string;
  explanation: string;
};

export type SingleQuestion = QuestionBase & {
  kind: "single";
  choices: Choice[];
  answer: string;
};

export type MultiQuestion = QuestionBase & {
  kind: "multi";
  choices: Choice[];
  answer: string[];
};

export type TrueFalseQuestion = QuestionBase & {
  kind: "truefalse";
  answer: boolean;
};

export type MatchQuestion = QuestionBase & {
  kind: "match";
  left: Choice[];
  right: Choice[];
  pairs: Record<string, string>;
};

export type TermQuestion = QuestionBase & {
  kind: "term";
  prompt: TermPrompt;
  accept: string[];
};

export type Question =
  | SingleQuestion
  | MultiQuestion
  | TrueFalseQuestion
  | MatchQuestion
  | TermQuestion;

export const difficultyLabel: Record<Difficulty, { zh: string; en: string }> = {
  1: { zh: "识记", en: "Recall" },
  2: { zh: "应用", en: "Apply" },
  3: { zh: "陷阱", en: "Trap" },
};

export const kindLabel: Record<QuestionKind, { zh: string; en: string }> = {
  single: { zh: "单选", en: "Single" },
  multi: { zh: "多选", en: "Multi" },
  truefalse: { zh: "判断", en: "True/False" },
  match: { zh: "连线", en: "Match" },
  term: { zh: "单词", en: "Term" },
};

export function isDerivedQuestion(q: Question | { id: string }): boolean {
  return q.id.startsWith("term:") || q.id.startsWith("match:");
}
