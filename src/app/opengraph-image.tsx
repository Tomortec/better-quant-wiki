import { createOgImage, ogContentType, ogSize } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `${site.nameZh} · ${site.nameEn}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage({
    title: site.nameEn,
    subtitle: site.descriptionEn,
  });
}
