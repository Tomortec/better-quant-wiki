"use client";

import Link from "next/link";
import { useDueWrongCounts } from "./use-practice-store";

export function ReviewBanner({ compact = false }: { compact?: boolean }) {
  const { due, wrong } = useDueWrongCounts();
  if (due === 0 && wrong === 0) return null;

  if (compact) {
    return (
      <p className="text-sm text-muted-foreground">
        {due > 0 ? (
          <Link href="/practice/review" className="hover:text-foreground hover:underline">
            {due} 题待温习
          </Link>
        ) : null}
        {due > 0 && wrong > 0 ? <span className="mx-2">·</span> : null}
        {wrong > 0 ? (
          <Link href="/practice/wrong" className="hover:text-foreground hover:underline">
            {wrong} 道错题
          </Link>
        ) : null}
      </p>
    );
  }

  return (
    <div className="border-y border-border py-3 text-sm">
      {due > 0 ? (
        <Link href="/practice/review" className="hover:underline">
          有 {due} 道题该温习了
        </Link>
      ) : null}
      {due > 0 && wrong > 0 ? <span className="mx-2 text-muted-foreground">·</span> : null}
      {wrong > 0 ? (
        <Link href="/practice/wrong" className="text-muted-foreground hover:text-foreground hover:underline">
          错题本 {wrong} 道
        </Link>
      ) : null}
    </div>
  );
}

export function DueBadge() {
  const { due } = useDueWrongCounts();
  if (due <= 0) return null;
  return (
    <span className="ml-auto font-mono text-[10px] text-muted-foreground">{due}</span>
  );
}
