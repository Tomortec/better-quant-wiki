import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { chapters, chapterById } from "@/content/chapters";
import type { ChapterId } from "@/content/types";
import { ChapterPracticeClient } from "@/components/practice/chapter-practice-client";

type Props = { params: Promise<{ chapter: string }> };

export function generateStaticParams() {
  return chapters.map((ch) => ({ chapter: ch.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chapter } = await params;
  const ch = chapterById[chapter as ChapterId];
  if (!ch) return {};
  return {
    title: `测一测 · ${ch.zh}`,
    description: `测试「${ch.zh}」的实战必需知识：选择、判断、连线与单词。`,
    alternates: { canonical: `/practice/chapter/${ch.id}` },
  };
}

export default async function ChapterPracticePage({ params }: Props) {
  const { chapter } = await params;
  const ch = chapterById[chapter as ChapterId];
  if (!ch) notFound();

  return (
    <Suspense>
      <ChapterPracticeClient chapter={ch} />
    </Suspense>
  );
}
