"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Chapter } from "@/content/types";
import { handwrittenInChapter } from "@/content/practice";
import { StartSession } from "./start-session";

export function ChapterPracticeClient({ chapter }: { chapter: Chapter }) {
  const searchParams = useSearchParams();
  const sectionId = searchParams.get("section");
  const sec = sectionId
    ? chapter.sections.find((s) => s.id === sectionId)
    : undefined;
  const handwritten = handwrittenInChapter(chapter.id);
  const sectionHandwritten = sec
    ? handwritten.filter((q) => q.sectionId === sec.id)
    : handwritten;

  return (
    <div className="mx-auto max-w-2xl">
      <p className="font-mono text-xs text-muted-foreground">
        <Link href="/practice" className="hover:text-foreground">
          练习
        </Link>
        <span className="mx-2">/</span>
        {chapter.n}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        {sec ? `测本节 · ${sec.title}` : `测一测 · ${chapter.zh}`}
        <span className="mt-1 block font-mono text-base font-normal text-muted-foreground">
          {sec ? sec.en : chapter.en}
        </span>
      </h1>
      <p className="mt-4 text-[15px] leading-7 text-muted-foreground">
        {sec
          ? `${sec.body.slice(0, 120).replace(/\s+/g, " ").trim()}…`
          : chapter.summary}
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        本章手写题 {handwritten.length} 道
        {sec ? ` · 本节 ${sectionHandwritten.length} 道` : ""}
        。单词与中英连线会从核心词条自动补齐。
      </p>
      <p className="mt-2 text-sm">
        <Link
          href={`/notes/${chapter.id}`}
          className="text-muted-foreground hover:text-foreground hover:underline"
        >
          先看笔记
        </Link>
      </p>

      {!sec ? (
        <nav className="mt-8 flex flex-col gap-2 border-y border-border py-4 text-sm">
          {chapter.sections.map((s) => (
            <Link
              key={s.id}
              href={`/practice/chapter/${chapter.id}?section=${s.id}`}
              className="text-muted-foreground hover:text-foreground"
            >
              测本节 · {s.title}
            </Link>
          ))}
        </nav>
      ) : (
        <p className="mt-6 text-sm">
          <Link
            href={`/practice/chapter/${chapter.id}`}
            className="text-muted-foreground hover:text-foreground hover:underline"
          >
            测整章
          </Link>
        </p>
      )}

      <StartSession
        mode={sec ? "section" : "chapter"}
        chapter={chapter.id}
        sectionId={sec?.id}
        title={sec ? sec.title : chapter.zh}
      />
    </div>
  );
}
