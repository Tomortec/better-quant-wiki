import { chapters } from "../chapters";
import { allConcepts, getConcept } from "../glossary";
import type { Concept } from "../types";
import type { MatchQuestion, TermQuestion } from "./types";

function unique(values: Array<string | undefined>): string[] {
  return [...new Set(values.filter((x): x is string => Boolean(x && x.trim())))];
}

function termAccept(c: Concept): string[] {
  return unique([c.zh, c.en, c.abbr, ...(c.aliases ?? [])]);
}

export function deriveTermQuestions(): TermQuestion[] {
  const out: TermQuestion[] = [];
  for (const c of allConcepts) {
    if (c.importance !== "core") continue;
    const accept = termAccept(c);
    const abbr = c.abbr ? `（${c.abbr}）` : "";
    out.push({
      id: `term:${c.slug}:en`,
      kind: "term",
      prompt: "en",
      chapter: c.chapter,
      conceptSlugs: [c.slug],
      difficulty: 1,
      skill: "recall",
      stem: `写出英文术语 **${c.en}**${abbr} 对应的中文名称。`,
      explanation: `**${c.en}**${abbr} 即 **${c.zh}**。${c.definition}`,
      accept: unique([c.zh, ...(c.aliases ?? [])]),
    });
    out.push({
      id: `term:${c.slug}:definition`,
      kind: "term",
      prompt: "definition",
      chapter: c.chapter,
      conceptSlugs: [c.slug],
      difficulty: 1,
      skill: "recall",
      stem: `根据定义写出该术语的中文名（英文名或缩写也可）：\n\n${c.definition}`,
      explanation: `指的是 **${c.zh}**（${c.en}${c.abbr ? ` · ${c.abbr}` : ""}）。`,
      accept,
    });
  }
  return out;
}

export function deriveMatchQuestions(): MatchQuestion[] {
  const out: MatchQuestion[] = [];
  for (const ch of chapters) {
    for (const section of ch.sections) {
      const core: Concept[] = [];
      for (const slug of section.conceptSlugs) {
        const c = getConcept(slug);
        if (c?.importance === "core") core.push(c);
      }
      const picked = core.slice(0, 6);
      if (picked.length < 4) continue;
      const slugs = picked.map((c) => c.slug);
      out.push({
        id: `match:${ch.id}:${section.id}:zh-en`,
        kind: "match",
        chapter: ch.id,
        sectionId: section.id,
        conceptSlugs: slugs,
        difficulty: 1,
        skill: "recall",
        stem: `将「${section.title}」中的术语与英文名配对。`,
        explanation: picked
          .map((c) => `**${c.zh}** ↔ ${c.en}${c.abbr ? `（${c.abbr}）` : ""}`)
          .join("；") + "。",
        left: picked.map((c) => ({ id: c.slug, text: c.zh })),
        right: picked.map((c) => ({
          id: c.slug,
          text: c.abbr ? `${c.en}（${c.abbr}）` : c.en,
        })),
        pairs: Object.fromEntries(slugs.map((s) => [s, s])),
      });
    }
  }
  return out;
}
