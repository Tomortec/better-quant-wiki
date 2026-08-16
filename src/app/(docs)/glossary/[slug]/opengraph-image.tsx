import { allConcepts, getConcept } from "@/content/glossary";
import { createOgImage, ogContentType, ogSize } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `${site.nameEn} glossary`;
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return allConcepts.map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const c = getConcept(slug);
  if (!c) {
    return createOgImage({ title: site.nameEn, subtitle: site.descriptionEn });
  }
  const abbr = c.abbr && /^[\x20-\x7E]+$/.test(c.abbr) ? c.abbr : undefined;
  return createOgImage({
    kicker: ["Glossary", abbr].filter(Boolean).join(" · "),
    title: c.en,
    subtitle: "Bilingual quantitative finance term",
  });
}
