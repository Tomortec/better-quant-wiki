import type { MatchQuestion, Question } from "@/content/practice/types";

export type AnswerValue =
  | { kind: "single"; choiceId: string }
  | { kind: "multi"; choiceIds: string[] }
  | { kind: "truefalse"; value: boolean }
  | { kind: "match"; pairs: Record<string, string> }
  | { kind: "term"; text: string };

export type GradeResult = {
  correct: boolean;
  score: number;
  matched?: number;
  total?: number;
};

const PUNCT = /[\s\u3000.,，。、；;:：!！?？"'“”‘’()（）[\]【】]/g;

export function normalizeTerm(text: string): string {
  return text
    .trim()
    .replace(/[\uFF10-\uFF19]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
    .replace(/[Ａ-Ｚａ-ｚ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
    .replace(PUNCT, "")
    .toLowerCase();
}

function sameSet(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((x, i) => x === sb[i]);
}

function gradeMatch(q: MatchQuestion, pairs: Record<string, string>): GradeResult {
  const total = q.left.length;
  let matched = 0;
  for (const left of q.left) {
    if (pairs[left.id] && pairs[left.id] === q.pairs[left.id]) matched += 1;
  }
  return {
    correct: matched === total,
    score: total === 0 ? 0 : matched / total,
    matched,
    total,
  };
}

export function gradeAnswer(question: Question, answer: AnswerValue | undefined): GradeResult {
  if (!answer || answer.kind !== question.kind) {
    return { correct: false, score: 0 };
  }
  switch (question.kind) {
    case "single":
      if (answer.kind !== "single") return { correct: false, score: 0 };
      return {
        correct: answer.choiceId === question.answer,
        score: answer.choiceId === question.answer ? 1 : 0,
      };
    case "multi":
      if (answer.kind !== "multi") return { correct: false, score: 0 };
      return {
        correct: sameSet(answer.choiceIds, question.answer),
        score: sameSet(answer.choiceIds, question.answer) ? 1 : 0,
      };
    case "truefalse":
      if (answer.kind !== "truefalse") return { correct: false, score: 0 };
      return {
        correct: answer.value === question.answer,
        score: answer.value === question.answer ? 1 : 0,
      };
    case "match":
      if (answer.kind !== "match") return { correct: false, score: 0 };
      return gradeMatch(question, answer.pairs);
    case "term": {
      if (answer.kind !== "term") return { correct: false, score: 0 };
      const got = normalizeTerm(answer.text);
      if (!got) return { correct: false, score: 0 };
      const ok = question.accept.some((a) => normalizeTerm(a) === got);
      return { correct: ok, score: ok ? 1 : 0 };
    }
  }
}

export function sessionScore(
  questions: Question[],
  answers: Record<string, AnswerValue | undefined>,
): { correct: number; total: number; score: number } {
  let correct = 0;
  for (const q of questions) {
    if (gradeAnswer(q, answers[q.id]).correct) correct += 1;
  }
  return {
    correct,
    total: questions.length,
    score: questions.length === 0 ? 0 : correct / questions.length,
  };
}
