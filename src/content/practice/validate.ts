import { chapters, chapterById } from "../chapters";
import { getConcept } from "../glossary";
import type { Question } from "./types";
import { isDerivedQuestion } from "./types";

function fail(message: string): never {
  throw new Error(`[practice] ${message}`);
}

export function validateQuestions(questions: Question[]): void {
  const seen = new Set<string>();

  for (const q of questions) {
    if (seen.has(q.id)) fail(`Duplicate question id: ${q.id}`);
    seen.add(q.id);

    if (q.conceptSlugs.length === 0) {
      fail(`Question "${q.id}" has no conceptSlugs`);
    }
    for (const slug of q.conceptSlugs) {
      if (!getConcept(slug)) {
        fail(`Question "${q.id}" references unknown concept "${slug}"`);
      }
    }

    const ch = chapterById[q.chapter];
    if (!ch) fail(`Question "${q.id}" has unknown chapter "${q.chapter}"`);
    if (q.sectionId && !ch.sections.some((s) => s.id === q.sectionId)) {
      fail(`Question "${q.id}" has unknown section "${q.sectionId}" in ${q.chapter}`);
    }

    if (!q.stem.trim()) fail(`Question "${q.id}" has empty stem`);
    if (!q.explanation.trim()) fail(`Question "${q.id}" has empty explanation`);

    switch (q.kind) {
      case "single": {
        const ids = q.choices.map((c) => c.id);
        if (new Set(ids).size !== ids.length) {
          fail(`Question "${q.id}" has duplicate choice ids`);
        }
        if (q.choices.length < 2) fail(`Question "${q.id}" needs at least 2 choices`);
        if (!ids.includes(q.answer)) {
          fail(`Question "${q.id}" answer "${q.answer}" is not a choice`);
        }
        break;
      }
      case "multi": {
        const ids = q.choices.map((c) => c.id);
        if (new Set(ids).size !== ids.length) {
          fail(`Question "${q.id}" has duplicate choice ids`);
        }
        if (q.answer.length < 2) {
          fail(`Question "${q.id}" multi-choice needs at least 2 correct answers`);
        }
        for (const a of q.answer) {
          if (!ids.includes(a)) {
            fail(`Question "${q.id}" answer "${a}" is not a choice`);
          }
        }
        if (new Set(q.answer).size !== q.answer.length) {
          fail(`Question "${q.id}" has duplicate answers`);
        }
        break;
      }
      case "match": {
        const leftIds = q.left.map((c) => c.id);
        const rightIds = q.right.map((c) => c.id);
        if (new Set(leftIds).size !== leftIds.length) {
          fail(`Question "${q.id}" has duplicate left ids`);
        }
        if (new Set(rightIds).size !== rightIds.length) {
          fail(`Question "${q.id}" has duplicate right ids`);
        }
        if (q.left.length < 4 || q.right.length < 4) {
          fail(`Question "${q.id}" match needs at least 4 pairs`);
        }
        if (q.left.length > 6 || q.right.length > 6) {
          fail(`Question "${q.id}" match should have at most 6 pairs`);
        }
        const pairKeys = Object.keys(q.pairs);
        const pairVals = Object.values(q.pairs);
        if (pairKeys.length !== q.left.length) {
          fail(`Question "${q.id}" pairs must cover every left item`);
        }
        for (const k of pairKeys) {
          if (!leftIds.includes(k)) fail(`Question "${q.id}" pair key "${k}" not in left`);
          const v = q.pairs[k];
          if (!v || !rightIds.includes(v)) {
            fail(`Question "${q.id}" pair value "${v}" not in right`);
          }
        }
        if (new Set(pairVals).size !== pairVals.length) {
          fail(`Question "${q.id}" pairs are not a bijection`);
        }
        break;
      }
      case "term": {
        if (q.accept.length === 0) fail(`Question "${q.id}" has empty accept list`);
        break;
      }
      case "truefalse":
        break;
    }

    if (!isDerivedQuestion(q) && !chapters.some((c) => c.id === q.chapter)) {
      fail(`Question "${q.id}" chapter is not in curriculum`);
    }
  }
}
