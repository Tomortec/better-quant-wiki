import type { Metadata } from "next";
import Link from "next/link";
import { chapters } from "@/content/chapters";
import { chapterQuestionCounts } from "@/content/practice";
import { BackupControls } from "@/components/practice/backup-controls";
import { RecentSessions } from "@/components/practice/recent-sessions";
import { ReviewBanner } from "@/components/practice/review-banner";

export const metadata: Metadata = {
  title: "练习 · Practice",
  description: "按章节测试量化核心知识：选择、判断、连线、单词；含错题本与温习。进度保存在浏览器本地。",
  alternates: { canonical: "/practice" },
  openGraph: {
    type: "website",
    title: "练习 · Practice",
    description: "章测、错题与间隔温习。题目贴合实战必需知识。",
    url: "/practice",
  },
};

export default function PracticePage() {
  const counts = chapterQuestionCounts();

  return (
    <div className="mx-auto max-w-2xl">
      <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
        Practice
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        做题
        <span className="mt-1 block font-mono text-base font-normal text-muted-foreground">
          Test what you would actually use
        </span>
      </h1>
      <p className="mt-4 text-[15px] leading-7 text-muted-foreground">
        独立练习区，不嵌在词条里。学完一章可以测；错了进错题本；到期会提醒温习。进度只存在这个浏览器，可导出备份。
      </p>

      <div className="mt-8">
        <ReviewBanner />
      </div>

      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <Link
          href="/practice/review"
          className="inline-flex h-9 items-center rounded-lg bg-primary px-3 font-medium text-primary-foreground"
        >
          开始温习
        </Link>
        <Link
          href="/practice/wrong"
          className="inline-flex h-9 items-center rounded-lg border border-border px-3 hover:bg-muted"
        >
          错题本
        </Link>
      </div>

      <BackupControls />

      <section className="mt-14">
        <h2 className="text-sm font-medium tracking-tight">
          按章测试
          <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
            Chapters
          </span>
        </h2>
        <ol className="mt-6 divide-y divide-border border-y border-border">
          {chapters.map((ch) => {
            const n = counts[ch.id];
            return (
              <li key={ch.id}>
                <Link
                  href={`/practice/chapter/${ch.id}`}
                  className="group grid gap-1 py-4 sm:grid-cols-[3rem_1fr_auto] sm:items-baseline sm:gap-6"
                >
                  <span className="font-mono text-xs text-muted-foreground">{ch.n}</span>
                  <span>
                    <span className="block font-medium tracking-tight group-hover:underline">
                      {ch.zh}
                      <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
                        {ch.en}
                      </span>
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {n?.handwritten ?? 0} 道手写题
                      <span className="mx-1.5">·</span>
                      {n?.derived ?? 0} 道派生识记
                    </span>
                  </span>
                  <span className="hidden font-mono text-xs text-muted-foreground sm:block">
                    Quiz
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <RecentSessions />
    </div>
  );
}
