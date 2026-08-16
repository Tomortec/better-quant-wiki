import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Formula } from "@/components/formula";
import { TermLink } from "@/components/term";
import { importanceLabel, relatedConcepts } from "@/content/glossary";
import type { Concept } from "@/content/types";
import { cn } from "@/lib/utils";

export function ImportanceBadge({
  importance,
}: {
  importance: Concept["importance"];
}) {
  const label = importanceLabel[importance];
  return (
    <Badge
      variant={importance === "core" ? "default" : "outline"}
      className={cn(
        "font-normal",
        importance === "supporting" && "border-border text-muted-foreground",
        importance === "context" && "border-transparent bg-muted text-muted-foreground",
      )}
    >
      {label.zh}
      <span className="font-mono text-[10px] opacity-70">{label.en}</span>
    </Badge>
  );
}

export function ConceptCard({
  concept,
  compact = false,
}: {
  concept: Concept;
  compact?: boolean;
}) {
  return (
    <article
      id={concept.slug}
      className="scroll-mt-24 border-b border-border/70 py-8 last:border-b-0"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            <Link href={`/glossary/${concept.slug}`} className="hover:underline">
              {concept.zh}
            </Link>
          </h2>
          <p className="mt-0.5 font-mono text-sm text-muted-foreground">
            {concept.en}
            {concept.abbr ? ` · ${concept.abbr}` : ""}
          </p>
        </div>
        <ImportanceBadge importance={concept.importance} />
      </div>
      <p className="mt-3 text-[15px] leading-7 text-foreground/90">
        {concept.definition}
      </p>
      {concept.formula && !compact ? (
        <Formula tex={concept.formula} />
      ) : null}
      {!compact ? (
        <p className="mt-3 text-[14px] leading-6 text-muted-foreground">
          <span className="font-medium text-foreground/80">为何重要 · Why. </span>
          {concept.why}
        </p>
      ) : null}
      {concept.caveat && !compact ? (
        <p className="mt-3 border-l-2 border-foreground/20 pl-3 text-[14px] leading-6 text-muted-foreground">
          <span className="font-medium text-foreground/80">注意 · Caveat. </span>
          {concept.caveat}
        </p>
      ) : null}
    </article>
  );
}

export function RelatedList({ slug }: { slug: string }) {
  const related = relatedConcepts(slug);
  if (related.length === 0) return null;
  return (
    <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
      <span className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
        Related
      </span>
      {related.map((c) => (
        <TermLink key={c.slug} concept={c} />
      ))}
    </div>
  );
}
