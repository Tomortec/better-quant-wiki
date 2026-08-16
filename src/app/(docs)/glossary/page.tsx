import type { Metadata } from "next";
import Link from "next/link";
import { allConcepts, importanceLabel } from "@/content/glossary";
import { chapters } from "@/content/chapters";
import type { Importance } from "@/content/types";
import { GlossaryFilter } from "@/components/glossary-filter";

export const metadata: Metadata = {
  title: "术语表 · Glossary",
  description: "全部量化核心术语，中英对照，按笔记章节分组。",
};

export default function GlossaryPage() {
  const grouped = chapters.map((ch) => ({
    ch,
    items: allConcepts.filter((c) => c.chapter === ch.id),
  }));

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight">
        术语表
        <span className="mt-1 block font-mono text-base font-normal text-muted-foreground">
          Glossary
        </span>
      </h1>
      <p className="mt-4 text-[15px] leading-7 text-muted-foreground">
        {allConcepts.length} 条。核心 / 配套 / 背景 三档表示「是否必须能默写」。点开单条可看公式与关联。
        条目里的「注意」栏记录常见误区，含对 Quant Wiki 原文的勘误，汇总见
        <Link
          href="/corrections"
          className="underline underline-offset-2 hover:text-foreground"
        >
          勘误表
        </Link>
        。
      </p>
      <p className="mt-2 font-mono text-xs text-muted-foreground">
        {(["core", "supporting", "context"] as Importance[])
          .map((k) => `${importanceLabel[k].zh} ${importanceLabel[k].en}`)
          .join(" · ")}
      </p>
      <GlossaryFilter grouped={grouped} />
    </div>
  );
}

export type GlossaryGroup = {
  ch: (typeof chapters)[number];
  items: typeof allConcepts;
};
