import type { Metadata } from "next";
import { corrections } from "@/content/corrections";
import { JsonLd } from "@/components/json-ld";
import { correctionsJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "原文勘误 · Corrections",
  description:
    "Quant Wiki /basic 词条中已核对并改正的错误与混淆：编码错误、概念张冠李戴、重复条目。",
  keywords: ["Quant Wiki", "勘误", "quant wiki corrections", "量化金融"],
  alternates: { canonical: "/corrections" },
  openGraph: {
    type: "article",
    title: "原文勘误 · Corrections",
    description: "Quant Wiki /basic 词条中已核对并改正的错误与混淆。",
    url: "/corrections",
  },
};

export default function CorrectionsPage() {
  return (
    <article className="mx-auto max-w-2xl">
      <JsonLd data={correctionsJsonLd()} />
      <h1 className="text-3xl font-semibold tracking-tight">
        原文勘误
        <span className="mt-1 block font-mono text-base font-normal text-muted-foreground">
          Corrections
        </span>
      </h1>
      <p className="mt-4 text-[15px] leading-7 text-muted-foreground">
        源站词条大多是 Investopedia 的机器翻译：篇幅长、互相重复，并且有编码错误与概念张冠李戴。下面只列会影响理解的问题；全文已按更正后的定义重写。
      </p>
      <ol className="mt-10 divide-y divide-border border-y border-border">
        {corrections.map((item, i) => (
          <li key={item.source} className="grid gap-3 py-6 sm:grid-cols-[2rem_1fr]">
            <span className="font-mono text-xs text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="font-mono text-xs text-muted-foreground">{item.source}</p>
              <p className="mt-2 text-[15px] leading-7">{item.issue}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                <span className="font-medium text-foreground/80">更正 · Fix. </span>
                {item.fix}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}
