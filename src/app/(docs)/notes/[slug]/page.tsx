import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { chapters, chapterById } from "@/content/chapters";
import { getConcept } from "@/content/glossary";
import type { ChapterId } from "@/content/types";
import { Formula } from "@/components/formula";
import { Prose } from "@/components/prose";
import { TermLink } from "@/components/term";
import { ImportanceBadge } from "@/components/concept-card";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return chapters.map((ch) => ({ slug: ch.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ch = chapterById[slug as ChapterId];
  if (!ch) return {};
  return {
    title: `${ch.zh} · ${ch.en}`,
    description: ch.summary,
  };
}

export default async function NotePage({ params }: Props) {
  const { slug } = await params;
  const ch = chapterById[slug as ChapterId];
  if (!ch) notFound();

  const idx = chapters.findIndex((c) => c.id === ch.id);
  const prev = chapters[idx - 1];
  const next = chapters[idx + 1];

  return (
    <article className="mx-auto max-w-2xl">
      <p className="font-mono text-xs text-muted-foreground">
        {ch.n} / {chapters.length}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        {ch.zh}
        <span className="mt-1 block font-mono text-base font-normal text-muted-foreground">
          {ch.en}
        </span>
      </h1>
      <p className="mt-4 text-[15px] leading-7 text-muted-foreground">
        {ch.summary}
      </p>

      <nav className="mt-8 flex flex-col gap-2 border-y border-border py-4 text-sm">
        {ch.sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="text-muted-foreground hover:text-foreground"
          >
            {s.title}
            <span className="ml-2 font-mono text-[11px]">{s.en}</span>
          </a>
        ))}
      </nav>

      {ch.sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-24 mt-12">
          <h2 className="text-xl font-semibold tracking-tight">
            {section.title}
          </h2>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {section.en}
          </p>
          <div className="mt-4">
            <Prose text={section.body} />
          </div>
          {section.formulas?.map((f) => (
            <Formula key={f.label} tex={f.tex} label={f.label} />
          ))}
          {section.conceptSlugs.length > 0 ? (
            <ul className="mt-6 space-y-2 border-t border-border/70 pt-4">
              {section.conceptSlugs.map((slug) => {
                const c = getConcept(slug);
                if (!c) return null;
                return (
                  <li
                    key={slug}
                    className="flex flex-wrap items-baseline justify-between gap-2 text-sm"
                  >
                    <TermLink concept={c} />
                    <ImportanceBadge importance={c.importance} />
                  </li>
                );
              })}
            </ul>
          ) : null}
        </section>
      ))}

      <nav className="mt-16 flex justify-between gap-6 border-t border-border pt-6 text-sm">
        {prev ? (
          <Link href={`/notes/${prev.id}`} className="hover:underline">
            <span className="block font-mono text-[11px] text-muted-foreground">
              Previous
            </span>
            {prev.zh}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/notes/${next.id}`} className="text-right hover:underline">
            <span className="block font-mono text-[11px] text-muted-foreground">
              Next
            </span>
            {next.zh}
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
