import Link from "next/link";
import { getConcept } from "@/content/glossary";
import type { Question } from "@/content/practice/types";
import { TermLink } from "@/components/term";
import { StemText } from "./stem-text";

export function ExplanationPanel({
  question,
  correct,
}: {
  question: Question;
  correct: boolean;
}) {
  return (
    <div className="mt-6 border-t border-border pt-4">
      <p className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
        {correct ? "正确" : "详解"}
        <span className="ml-2 opacity-70">{correct ? "Correct" : "Explanation"}</span>
      </p>
      <StemText text={question.explanation} className="mt-2 space-y-2 text-sm leading-6" />
      {question.conceptSlugs.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {question.conceptSlugs.map((slug) => {
            const c = getConcept(slug);
            if (!c) return null;
            return (
              <li key={slug}>
                <TermLink concept={c} />
              </li>
            );
          })}
        </ul>
      ) : null}
      <p className="mt-2">
        <Link
          href={`/notes/${question.chapter}${question.sectionId ? `#${question.sectionId}` : ""}`}
          className="font-mono text-[11px] text-muted-foreground hover:text-foreground"
        >
          回笔记
        </Link>
      </p>
    </div>
  );
}
