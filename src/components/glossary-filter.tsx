"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Concept, Importance } from "@/content/types";
import type { Chapter } from "@/content/types";
import { Input } from "@/components/ui/input";
import { ConceptCard } from "@/components/concept-card";
import { importanceLabel } from "@/content/glossary";
import { cn } from "@/lib/utils";

export function GlossaryFilter({
  grouped,
}: {
  grouped: { ch: Chapter; items: Concept[] }[];
}) {
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [imp, setImp] = useState<Importance | "all">("all");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return grouped
      .map(({ ch, items }) => ({
        ch,
        items: items.filter((c) => {
          if (imp !== "all" && c.importance !== imp) return false;
          if (!needle) return true;
          const blob = [
            c.zh,
            c.en,
            c.abbr,
            ...(c.aliases ?? []),
            c.definition,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          return blob.includes(needle);
        }),
      }))
      .filter((g) => g.items.length > 0);
  }, [grouped, q, imp]);

  const total = filtered.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="筛选中文、英文、缩写…"
          className="sm:max-w-xs"
        />
        <div className="flex gap-1">
          {(["all", "core", "supporting", "context"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setImp(key)}
              className={cn(
                "rounded-md px-2 py-1 text-xs",
                imp === key
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {key === "all" ? "全部" : importanceLabel[key].zh}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-3 font-mono text-xs text-muted-foreground">{total} 条</p>

      {filtered.map(({ ch, items }) => (
        <section key={ch.id} className="mt-12">
          <h2 className="font-medium tracking-tight">
            {ch.n} {ch.zh}
            <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
              {ch.en}
            </span>
          </h2>
          <div className="mt-2">
            {items.map((c) => (
              <ConceptCard key={c.slug} concept={c} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
