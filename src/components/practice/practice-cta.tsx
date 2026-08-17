import Link from "next/link";
import type { ChapterId } from "@/content/types";

export function ChapterQuizCta({
  chapter,
  label,
}: {
  chapter: ChapterId;
  label?: string;
}) {
  return (
    <p className="text-sm">
      <Link
        href={`/practice/chapter/${chapter}`}
        className="hover:underline"
      >
        {label ?? "测一测本章"}
        <span className="ml-2 font-mono text-[11px] text-muted-foreground">Quiz</span>
      </Link>
    </p>
  );
}

export function SectionQuizCta({
  chapter,
  sectionId,
}: {
  chapter: ChapterId;
  sectionId: string;
}) {
  return (
    <p className="mt-3 text-sm">
      <Link
        href={`/practice/chapter/${chapter}?section=${sectionId}`}
        className="text-muted-foreground hover:text-foreground hover:underline"
      >
        测本节
        <span className="ml-2 font-mono text-[11px]">Section quiz</span>
      </Link>
    </p>
  );
}
