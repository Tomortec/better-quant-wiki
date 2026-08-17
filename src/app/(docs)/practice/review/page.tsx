import type { Metadata } from "next";
import Link from "next/link";
import { StartSession } from "@/components/practice/start-session";

export const metadata: Metadata = {
  title: "温习 · Review",
  description: "复习到期的题目。间隔重复，进度存在浏览器本地。",
  alternates: { canonical: "/practice/review" },
  robots: { index: false, follow: true },
};

export default function ReviewPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <p className="font-mono text-xs text-muted-foreground">
        <Link href="/practice" className="hover:text-foreground">
          练习
        </Link>
        <span className="mx-2">/</span>
        Review
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">温习</h1>
      <p className="mt-4 text-[15px] leading-7 text-muted-foreground">
        到期的卡片会排在前面。若还不够一套，会用尚未见过的核心题补齐。即时对错与详解。
      </p>
      <StartSession mode="review" defaultFeedback="immediate" />
    </div>
  );
}
