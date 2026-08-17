import type { Metadata } from "next";
import Link from "next/link";
import { StartSession } from "@/components/practice/start-session";

export const metadata: Metadata = {
  title: "错题本 · Wrong",
  description: "重做上次答错的题目，并对照详解。",
  alternates: { canonical: "/practice/wrong" },
  robots: { index: false, follow: true },
};

export default function WrongPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <p className="font-mono text-xs text-muted-foreground">
        <Link href="/practice" className="hover:text-foreground">
          练习
        </Link>
        <span className="mx-2">/</span>
        Wrong
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">错题本</h1>
      <p className="mt-4 text-[15px] leading-7 text-muted-foreground">
        最近一次答错的题目。做对之后会按间隔安排下一次温习。
      </p>
      <StartSession mode="wrong" defaultFeedback="immediate" />
    </div>
  );
}
