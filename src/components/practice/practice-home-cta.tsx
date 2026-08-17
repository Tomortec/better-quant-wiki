"use client";

import Link from "next/link";
import { useDueWrongCounts, useHydrated } from "./use-practice-store";

const primary =
  "inline-flex h-9 items-center rounded-lg bg-primary px-3 font-medium text-primary-foreground";
const secondary =
  "inline-flex h-9 items-center rounded-lg border border-border px-3 hover:bg-muted";

export function PracticeHomeCta() {
  const hydrated = useHydrated();
  const { due, wrong } = useDueWrongCounts();

  if (!hydrated) {
    return (
      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <span className="inline-flex h-9 items-center rounded-lg border border-border px-3 text-muted-foreground">
          读取进度…
        </span>
      </div>
    );
  }

  if (due > 0) {
    return (
      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <Link href="/practice/review" className={primary}>
          开始温习
        </Link>
        <Link href="#chapters" className={secondary}>
          按章测试
        </Link>
        {wrong > 0 ? (
          <Link href="/practice/wrong" className={secondary}>
            错题本
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-wrap gap-3 text-sm">
      <Link href="#chapters" className={primary}>
        按章测试
      </Link>
      <Link href="/practice/wrong" className={secondary}>
        错题本
      </Link>
    </div>
  );
}
