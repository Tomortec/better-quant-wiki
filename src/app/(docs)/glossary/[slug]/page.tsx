import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { allConcepts, getConcept } from "@/content/glossary";
import { chapterById } from "@/content/chapters";
import { Formula } from "@/components/formula";
import { ImportanceBadge, RelatedList } from "@/components/concept-card";
import { TermTitle } from "@/components/term";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allConcepts.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getConcept(slug);
  if (!c) return {};
  return {
    title: `${c.zh} · ${c.en}`,
    description: c.definition,
  };
}

export default async function ConceptPage({ params }: Props) {
  const { slug } = await params;
  const c = getConcept(slug);
  if (!c) notFound();
  const ch = chapterById[c.chapter];

  return (
    <article className="mx-auto max-w-2xl">
      <p className="font-mono text-xs text-muted-foreground">
        <Link href="/glossary" className="hover:underline">
          Glossary
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/notes/${ch.id}`} className="hover:underline">
          {ch.zh}
        </Link>
      </p>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <TermTitle zh={c.zh} en={c.en} abbr={c.abbr} className="text-3xl font-semibold" />
        <ImportanceBadge importance={c.importance} />
      </div>
      {c.aliases && c.aliases.length > 0 ? (
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          also {c.aliases.join(" · ")}
        </p>
      ) : null}

      <p className="mt-8 text-[16px] leading-7">{c.definition}</p>
      {c.formula ? <Formula tex={c.formula} /> : null}

      <section className="mt-10">
        <h2 className="text-sm font-medium">
          为何重要
          <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
            Why it matters
          </span>
        </h2>
        <p className="mt-2 text-[15px] leading-7 text-foreground/90">{c.why}</p>
      </section>

      {c.caveat ? (
        <section className="mt-8">
          <h2 className="text-sm font-medium">
            注意
            <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
              Caveat
            </span>
          </h2>
          <p className="mt-2 border-l-2 border-foreground/20 pl-3 text-[15px] leading-7 text-muted-foreground">
            {c.caveat}
          </p>
        </section>
      ) : null}

      <RelatedList slug={c.slug} />
    </article>
  );
}
