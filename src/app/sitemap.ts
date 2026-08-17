import type { MetadataRoute } from "next";
import { chapters } from "@/content/chapters";
import { allConcepts } from "@/content/glossary";
import { pageUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: pageUrl("/"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: pageUrl("/glossary"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: pageUrl("/practice"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: pageUrl("/corrections"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...chapters.map((ch) => ({
      url: pageUrl(`/notes/${ch.id}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...chapters.map((ch) => ({
      url: pageUrl(`/practice/chapter/${ch.id}`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...allConcepts.map((c) => ({
      url: pageUrl(`/glossary/${c.slug}`),
      changeFrequency: "monthly" as const,
      priority: c.importance === "core" ? 0.7 : 0.5,
    })),
  ];
}
