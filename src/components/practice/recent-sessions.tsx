"use client";

import Link from "next/link";
import { usePracticeStore } from "./use-practice-store";

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
              <span>
                {s.mode === "review"
                  ? "温习"
                  : s.mode === "wrong"
                    ? "错题"
                    : s.chapter ?? "练习"}
                {s.sectionId ? ` / ${s.sectionId}` : ""}
                <span className="ml-2 font-mono text-[11px] text-muted-foreground">
                  {s.finishedAt ? "已交卷" : "进行中"}
                </span>
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {s.score ? `${s.score.correct}/${s.score.total}` : `${s.questionIds.length} 题`}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
