export type Importance = "core" | "supporting" | "context";

export type ChapterId =
  | "probability"
  | "statistics"
  | "markets"
  | "macro"
  | "valuation"
  | "pricing"
  | "derivatives"
  | "strategies"
  | "risk";

export type Concept = {
  slug: string;
  zh: string;
  en: string;
  abbr?: string;
  aliases?: string[];
  chapter: ChapterId;
  importance: Importance;
  /** One-sentence professional definition. */
  definition: string;
  formula?: string;
  /** What a quant actually uses this for. */
  why: string;
  /** Common mistakes, including errors in the original source. */
  caveat?: string;
  related: string[];
};

export type Section = {
  id: string;
  title: string;
  en: string;
  body: string;
  formulas?: { label: string; tex: string }[];
  conceptSlugs: string[];
};

export type Chapter = {
  id: ChapterId;
  n: string;
  zh: string;
  en: string;
  summary: string;
  sections: Section[];
};

export type Correction = {
  source: string;
  issue: string;
  fix: string;
};
