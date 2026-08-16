import Link from "next/link";
import type { Concept } from "@/content/types";
import { cn } from "@/lib/utils";

export function TermTitle({
  zh,
  en,
  abbr,
  as: Tag = "h1",
  className,
}: {
  zh: string;
  en: string;
  abbr?: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
}) {
  return (
    <Tag className={cn("text-balance tracking-tight", className)}>
      <span>{zh}</span>
      <span className="mt-1 block font-mono text-[0.72em] font-normal tracking-normal text-muted-foreground">
        {en}
        {abbr ? <span className="text-muted-foreground/80"> · {abbr}</span> : null}
      </span>
    </Tag>
  );
}

export function TermLink({
  concept,
  className,
}: {
  concept: Concept;
  className?: string;
}) {
  return (
    <Link
      href={`/glossary/${concept.slug}`}
      className={cn(
        "group inline-flex flex-wrap items-baseline gap-x-1.5 rounded-sm underline-offset-4 hover:underline",
        className,
      )}
    >
      <span>{concept.zh}</span>
      <span className="font-mono text-[0.78em] text-muted-foreground group-hover:text-foreground">
        {concept.en}
      </span>
    </Link>
  );
}
