import type { ChapterId, Concept } from "../types";
import { derivatives } from "./derivatives";
import { macro } from "./macro";
import { markets } from "./markets";
import { pricing } from "./pricing";
import { probability } from "./probability";
import { statistics } from "./statistics";
import { strategies } from "./strategies";
import { valuation } from "./valuation";

export const allConcepts: Concept[] = [
  ...probability,
  ...statistics,
  ...markets,
  ...macro,
  ...valuation,
  ...pricing,
  ...derivatives,
  ...strategies,
];

const bySlug = new Map(allConcepts.map((c) => [c.slug, c]));

if (bySlug.size !== allConcepts.length) {
  const seen = new Set<string>();
  const dupes = allConcepts.filter((c) => {
    if (seen.has(c.slug)) return true;
    seen.add(c.slug);
    return false;
  });
  throw new Error(`Duplicate concept slugs: ${dupes.map((d) => d.slug).join(", ")}`);
}

export function getConcept(slug: string): Concept | undefined {
  return bySlug.get(slug);
}

export function requireConcept(slug: string): Concept {
  const c = bySlug.get(slug);
  if (!c) throw new Error(`Unknown concept: ${slug}`);
  return c;
}

export function conceptsInChapter(id: ChapterId): Concept[] {
  return allConcepts.filter((c) => c.chapter === id);
}

export function relatedConcepts(slug: string): Concept[] {
  const c = bySlug.get(slug);
  if (!c) return [];
  return c.related.map((s) => bySlug.get(s)).filter((x): x is Concept => Boolean(x));
}

export const importanceLabel: Record<Concept["importance"], { zh: string; en: string }> = {
  core: { zh: "核心", en: "Core" },
  supporting: { zh: "配套", en: "Supporting" },
  context: { zh: "背景", en: "Context" },
};
