import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "没有这条笔记",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col justify-center px-4">
      <p className="font-mono text-xs text-muted-foreground">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">没有这条笔记</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        术语可能已合并或更名。请从首页或术语表进入。
      </p>
      <Link href="/" className="mt-6 text-sm underline-offset-4 hover:underline">
        回到首页
      </Link>
    </main>
  );
}
