import type { Metadata } from "next";
import type { Chapter, Concept } from "@/content/types";
import { pageUrl, site, truncate } from "@/lib/site";

type JsonLd = Record<string, unknown>;

type Crumb = { name: string; path: string };

export function breadcrumbJsonLd(items: Crumb[]): JsonLd {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: pageUrl(item.path),
    })),
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.nameZh,
    alternateName: [site.nameEn, "量化金融术语表", "Quant Wiki 精要"],
    url: site.url,
    description: `${site.description} ${site.descriptionEn}`,
    inLanguage: [site.locale, "en"],
    license: "https://opensource.org/licenses/MIT",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/glossary?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function homeJsonLd(chapters: Chapter[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${site.nameZh} · ${site.nameEn}`,
    description: site.description,
    url: site.url,
    inLanguage: site.locale,
    isPartOf: { "@type": "WebSite", url: site.url, name: site.nameZh },
    hasPart: chapters.map((ch) => ({
      "@type": "LearningResource",
      name: `${ch.zh} · ${ch.en}`,
      url: pageUrl(`/notes/${ch.id}`),
      description: ch.summary,
    })),
  };
}

export function glossaryIndexJsonLd(concepts: Concept[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTermSet",
        name: `${site.nameZh} 术语表`,
        alternateName: "Better Quant Wiki Glossary",
        description: "量化金融核心术语，中英对照。",
        url: pageUrl("/glossary"),
        inLanguage: [site.locale, "en"],
        numberOfItems: concepts.length,
        hasDefinedTerm: concepts.map((c) => ({
          "@type": "DefinedTerm",
          name: c.zh,
          alternateName: c.en,
          url: pageUrl(`/glossary/${c.slug}`),
        })),
      },
      breadcrumbJsonLd([
        { name: site.nameZh, path: "/" },
        { name: "术语表", path: "/glossary" },
      ]),
    ],
  };
}

export function termJsonLd(c: Concept, chapter: Chapter): JsonLd {
  const alternateName = [c.en, c.abbr, ...(c.aliases ?? [])].filter(
    (x): x is string => Boolean(x),
  );
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTerm",
        name: c.zh,
        alternateName,
        description: c.definition,
        url: pageUrl(`/glossary/${c.slug}`),
        inDefinedTermSet: pageUrl("/glossary"),
        identifier: c.slug,
        inLanguage: site.locale,
      },
      breadcrumbJsonLd([
        { name: site.nameZh, path: "/" },
        { name: "术语表", path: "/glossary" },
        { name: chapter.zh, path: `/notes/${chapter.id}` },
        { name: c.zh, path: `/glossary/${c.slug}` },
      ]),
    ],
  };
}

export function chapterJsonLd(ch: Chapter): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LearningResource",
        learningResourceType: "notes",
        educationalLevel: "professional",
        name: `${ch.zh} · ${ch.en}`,
        headline: ch.zh,
        alternateName: ch.en,
        description: ch.summary,
        url: pageUrl(`/notes/${ch.id}`),
        inLanguage: site.locale,
        isPartOf: { "@type": "WebSite", url: site.url, name: site.nameZh },
        hasPart: ch.sections.map((s) => ({
          "@type": "LearningResource",
          name: s.title,
          alternateName: s.en,
          url: `${pageUrl(`/notes/${ch.id}`)}#${s.id}`,
        })),
      },
      breadcrumbJsonLd([
        { name: site.nameZh, path: "/" },
        { name: "笔记", path: `/notes/${ch.id}` },
        { name: ch.zh, path: `/notes/${ch.id}` },
      ]),
    ],
  };
}

export function correctionsJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "原文勘误 · Corrections",
        description:
          "Quant Wiki /basic 词条中已核对并改正的错误与混淆。",
        url: pageUrl("/corrections"),
        inLanguage: site.locale,
        isPartOf: { "@type": "WebSite", url: site.url },
      },
      breadcrumbJsonLd([
        { name: site.nameZh, path: "/" },
        { name: "原文勘误", path: "/corrections" },
      ]),
    ],
  };
}

export function termMetadata(c: Concept): Metadata {
  const title = `${c.zh} · ${c.en}`;
  const description = truncate(c.definition);
  const url = `/glossary/${c.slug}`;
  const keywords = [c.zh, c.en, c.abbr, ...(c.aliases ?? []), "量化", "量化金融", "术语"].filter(
    (x): x is string => Boolean(x),
  );
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: `${c.zh}（${c.en}）`,
      description,
      url,
    },
    twitter: {
      title,
      description,
    },
  };
}

export function chapterMetadata(ch: Chapter): Metadata {
  const title = `${ch.zh} · ${ch.en}`;
  const description = truncate(ch.summary);
  const url = `/notes/${ch.id}`;
  return {
    title,
    description,
    keywords: [ch.zh, ch.en, ...ch.sections.map((s) => s.title), "量化笔记", "量化金融"],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
    },
    twitter: {
      title,
      description,
    },
  };
}

export function llmsTxt(chapters: Chapter[], concepts: Concept[]): string {
  const notes = chapters
    .map(
      (ch) =>
        `- [${ch.n} ${ch.zh} / ${ch.en}](${pageUrl(`/notes/${ch.id}`)}): ${ch.summary}`,
    )
    .join("\n");
  const terms = concepts
    .map(
      (c) =>
        `- [${c.zh} / ${c.en}](${pageUrl(`/glossary/${c.slug}`)}): ${c.definition}`,
    )
    .join("\n");

  return `# ${site.nameZh} (${site.nameEn})

> ${site.description}

> ${site.descriptionEn}

- Site: ${site.url}
- GitHub: ${site.github}
- License: ${site.license}

## Notes

Nine reading notes from probability to risk.

${notes}

## Glossary

${concepts.length} bilingual quantitative-finance terms (core / supporting / context).

${terms}

## Corrections

- [原文勘误 / Corrections](${pageUrl("/corrections")}): factual errors and conflations found in Quant Wiki /basic.

## Practice

- [练习 / Practice](${pageUrl("/practice")}): chapter quizzes, wrong-question book, and spaced review. Progress is stored locally in the browser.
${chapters.map((ch) => `- [${ch.zh} quiz](${pageUrl(`/practice/chapter/${ch.id}`)})`).join("\n")}
`;
}
