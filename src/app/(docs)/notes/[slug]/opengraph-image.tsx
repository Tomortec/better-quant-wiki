import { chapters, chapterById } from "@/content/chapters";
import type { ChapterId } from "@/content/types";
import { createOgImage, ogContentType, ogSize } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `${site.nameEn} notes`;
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return chapters.map((ch) => ({ slug: ch.id }));
}

type Props = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const ch = chapterById[slug as ChapterId];
  if (!ch) {
    return createOgImage({ title: site.nameEn, subtitle: site.descriptionEn });
  }
  return createOgImage({
    kicker: `Notes ${ch.n} / 09`,
    title: ch.en,
    subtitle: "Quantitative finance reading notes",
  });
}
