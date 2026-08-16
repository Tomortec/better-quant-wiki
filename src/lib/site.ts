export const site = {
  nameZh: "量化精要",
  nameEn: "Better Quant Wiki",
  tagline: "量化真正要用的概念，而不是百科拼盘。",
  description:
    "从 Quant Wiki 基础词条提炼、纠错后的量化核心知识。中英对照，只保留必须掌握的定义、公式与误区。",
  descriptionEn:
    "A bilingual Chinese–English quantitative finance primer: core definitions, formulas, and pitfalls, distilled and corrected from Quant Wiki.",
  url: "https://wiki.zibenxiuxing.com",
  github: "https://github.com/Tomortec/better-quant-wiki",
  license: "MIT",
  locale: "zh-CN",
  ogLocale: "zh_CN",
  keywords: [
    "量化",
    "量化金融",
    "量化交易",
    "量化精要",
    "Quant Wiki",
    "Better Quant Wiki",
    "quantitative finance",
    "quant glossary",
    "quant wiki",
    "derivatives",
    "risk management",
    "中英对照",
    "术语表",
  ],
} as const;

export function pageUrl(path = "/"): string {
  if (path === "/") return site.url;
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function truncate(text: string, max = 160): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}
