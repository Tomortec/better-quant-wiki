"use client";

import Link from "next/link";
import { chapterById } from "@/content/chapters";
import type { SessionRecord } from "@/lib/practice/store";
import { Badge } from "@/components/ui/badge";
import { usePracticeStore } from "./use-practice-store";

function sessionTitle(s: SessionRecord): string {
  if (s.mode === "review") return "温习";
  if (s.mode === "wrong") return "错题";
  const ch = s.chapter ? chapterById[s.chapter] : undefined;
  if (!ch) return "练习";
  if (s.sectionId) {
    const sec = ch.sections.find((x) => x.id === s.sectionId);
    return sec ? `${ch.zh} / ${sec.title}` : ch.zh;
  }
  return ch.zh;
}

export function RecentSessions() {
  const { sessions } = usePracticeStore();
  if (sessions.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="text-sm font-medium tracking-tight">
        最近练习
        <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">Recent</span>
      </h2>
      <ul className="mt-4 divide-y divide-border border-y border-border text-sm">
        {sessions.slice(0, 8).map((s) => (
          <li key={s.id}>
            <Link
              href={`/practice/session/${s.id}`}
              className="flex items-baseline justify-between gap-4 py-3 hover:bg-muted/40"
            >
              <span className="flex min-w-0 flex-wrap items-baseline gap-2">
                <span className="truncate">{sessionTitle(s)}</span>
                <Badge variant="outline" className="font-mono text-[10px] font-normal">
                  {s.finishedAt ? "已交卷" : "进行中"}
                </Badge>
              </span>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {s.score ? `${s.score.correct}/${s.score.total}` : `${s.questionIds.length} 题`}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
