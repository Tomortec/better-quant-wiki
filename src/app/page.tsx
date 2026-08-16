import Link from "next/link";
import { chapters } from "@/content/chapters";
import { allConcepts } from "@/content/glossary";
import { corrections } from "@/content/corrections";
import { Badge } from "@/components/ui/badge";
import { site } from "@/lib/site";

export default function HomePage() {
  const core = allConcepts.filter((c) => c.importance === "core").length;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
        {site.nameEn}
      </p>
      <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
        量化真正要用的概念，
        <br />
        <span className="text-muted-foreground">而不是百科拼盘。</span>
      </h1>
      <p className="mt-6 max-w-2xl text-[16px] leading-7 text-muted-foreground">
        源材料来自 Quant Wiki 的「量化金融基本概念」（约 192 条 Investopedia
        式词条）。这里按从业者的知识结构重写：去掉重复和正确性错误，每条中英对照，只保留定义、公式、用途和误区。
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/notes/probability"
          className="inline-flex h-9 items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground"
        >
          从笔记开始
        </Link>
        <Link
          href="/glossary"
          className="inline-flex h-9 items-center rounded-lg border border-border px-3 text-sm hover:bg-muted"
        >
          打开术语表
        </Link>
      </div>

      <dl className="mt-14 grid grid-cols-3 gap-6 border-y border-border py-6 sm:max-w-lg">
        <Stat n={String(allConcepts.length)} label="术语条目" en="Terms" />
        <Stat n={String(core)} label="核心必掌握" en="Core" />
        <Stat n={String(corrections.length)} label="原文勘误" en="Fixes" />
      </dl>

      <section className="mt-16">
        <h2 className="text-sm font-medium tracking-tight">
          九章笔记
          <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
            Curriculum
          </span>
        </h2>
        <ol className="mt-6 divide-y divide-border border-y border-border">
          {chapters.map((ch) => (
            <li key={ch.id}>
              <Link
                href={`/notes/${ch.id}`}
                className="group grid gap-1 py-5 sm:grid-cols-[3rem_1fr_auto] sm:items-baseline sm:gap-6"
              >
                <span className="font-mono text-xs text-muted-foreground">
                  {ch.n}
                </span>
                <span>
                  <span className="block font-medium tracking-tight group-hover:underline">
                    {ch.zh}
                    <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
                      {ch.en}
                    </span>
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                    {ch.summary}
                  </span>
                </span>
                <span className="hidden font-mono text-xs text-muted-foreground sm:block">
                  {ch.sections.length} 节
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 grid gap-10 sm:grid-cols-2">
        <div>
          <h2 className="text-sm font-medium">怎么读</h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
            <li>
              <Badge variant="default" className="mr-2 font-normal">
                核心 Core
              </Badge>
              做量化几乎每天碰到，必须能默写定义与公式。
            </li>
            <li>
              <Badge variant="outline" className="mr-2 font-normal">
                配套 Supporting
              </Badge>
              为了把核心说完整而保留，不必单独成章死记。
            </li>
            <li>
              <Badge variant="secondary" className="mr-2 font-normal">
                背景 Context
              </Badge>
              原文有、但并非量化日常工具。知道它指什么即可。
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-medium">相对原文改了什么</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            合并重复词条（相关/相关系数、R²/决定系数、Forex/外汇市场），拆开被混在一起的概念（贴现窗口 vs
            估值贴现率、看跌合约 vs 买入看跌、微积分导数 vs
            金融衍生品），并补上原文缺的对数收益、平价、久期、隐含波动。
            <Link href="/corrections" className="ml-1 text-foreground underline-offset-4 hover:underline">
              看全部勘误
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

function Stat({ n, label, en }: { n: string; label: string; en: string }) {
  return (
    <div>
      <dt className="font-mono text-[11px] text-muted-foreground">{en}</dt>
      <dd className="mt-1 text-2xl font-semibold tracking-tight">{n}</dd>
      <dd className="text-xs text-muted-foreground">{label}</dd>
    </div>
  );
}
