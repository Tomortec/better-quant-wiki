import fs from "node:fs";
import path from "node:path";

const dir = path.join("src/content/glossary");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".ts") && f !== "index.ts");
const chapterOrder = [
  "probability",
  "statistics",
  "markets",
  "macro",
  "valuation",
  "pricing",
  "derivatives",
  "strategies",
  "risk",
];
const chapterTitle = {
  probability: "Probability · 概率",
  statistics: "Inference and Regression · 统计推断与回归",
  markets: "Markets and Microstructure · 市场、工具与微观结构",
  macro: "Macro, Rates, Policy · 宏观、利率与政策",
  valuation: "Valuation · 估值与公司金融",
  pricing: "Asset Pricing and Factors · 资产定价与因子",
  derivatives: "Derivatives, Volatility, Greeks · 衍生品、波动与希腊值",
  strategies: "Strategies, Execution, Backtests · 策略、执行与回测",
  risk: "Risk, Leverage, History · 风险、杠杆与历史",
};

const terms = [];
const re =
  /slug:\s*"([^"]+)"[\s\S]*?zh:\s*"([^"]+)"[\s\S]*?en:\s*"([^"]+)"[\s\S]*?chapter:\s*"([^"]+)"[\s\S]*?importance:\s*"([^"]+)"/g;

for (const file of files) {
  const src = fs.readFileSync(path.join(dir, file), "utf8");
  let m;
  while ((m = re.exec(src))) {
    terms.push({
      slug: m[1],
      zh: m[2],
      en: m[3],
      chapter: m[4],
      importance: m[5],
    });
  }
}

terms.sort((a, b) => {
  const ci = chapterOrder.indexOf(a.chapter) - chapterOrder.indexOf(b.chapter);
  if (ci !== 0) return ci;
  const rank = { core: 0, supporting: 1, context: 2 };
  const ii = (rank[a.importance] ?? 9) - (rank[b.importance] ?? 9);
  if (ii !== 0) return ii;
  return a.en.localeCompare(b.en);
});

const byChapter = new Map();
for (const t of terms) {
  if (!byChapter.has(t.chapter)) byChapter.set(t.chapter, []);
  byChapter.get(t.chapter).push(t);
}

let out = `# Glossary · 术语表

Bilingual quantitative finance glossary for [Better Quant Wiki](https://wiki.zibenxiuxing.com) / 量化精要.

${terms.length} terms. Live pages: [glossary](https://wiki.zibenxiuxing.com/glossary). Source: \`src/content/glossary/\`.

`;

for (const id of chapterOrder) {
  const list = byChapter.get(id) || [];
  if (!list.length) continue;
  out += `## ${chapterTitle[id]}\n\n`;
  for (const t of list) {
    out += `- [${t.zh} / ${t.en}](https://wiki.zibenxiuxing.com/glossary/${t.slug}) (${t.importance})\n`;
  }
  out += "\n";
}

fs.writeFileSync("GLOSSARY.md", out);
console.log(`Wrote GLOSSARY.md with ${terms.length} terms`);
