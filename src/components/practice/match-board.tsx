"use client";

import { useState } from "react";
import type { MatchQuestion } from "@/content/practice/types";
import { cn } from "@/lib/utils";
import { StemText } from "./stem-text";

function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededShuffle<T>(items: T[], seed: string): T[] {
  let s = hashSeed(seed);
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = Math.floor((s / 2 ** 32) * (i + 1));
    const a = next[i];
    const b = next[j];
    if (a === undefined || b === undefined) continue;
    next[i] = b;
    next[j] = a;
  }
  return next;
}

export function MatchBoard({
  question,
  value,
  onChange,
  disabled,
  revealed,
}: {
  question: MatchQuestion;
  value: Record<string, string>;
  onChange: (pairs: Record<string, string>) => void;
  disabled?: boolean;
  revealed?: boolean;
}) {
  const rightOrder = seededShuffle(question.right, question.id);
  const [pickedLeft, setPickedLeft] = useState<string | null>(null);
  const usedRight = new Set(Object.values(value));

  function pair(leftId: string, rightId: string) {
    const next = { ...value };
    for (const [l, r] of Object.entries(next)) {
      if (r === rightId) delete next[l];
    }
    next[leftId] = rightId;
    onChange(next);
    setPickedLeft(null);
  }

  function unpair(leftId: string) {
    const next = { ...value };
    delete next[leftId];
    onChange(next);
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <ul className="space-y-2">
        {question.left.map((item) => {
          const paired = value[item.id];
          const pairedRight = question.right.find((r) => r.id === paired);
          const active = pickedLeft === item.id;
          const ok = Boolean(revealed && paired && paired === question.pairs[item.id]);
          const wrong = Boolean(revealed && paired && paired !== question.pairs[item.id]);
          return (
            <li key={item.id}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  if (paired) unpair(item.id);
                  else setPickedLeft(item.id);
                }}
                className={cn(
                  "flex w-full flex-col items-start rounded-lg border px-3 py-2 text-left text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none",
                  active && "border-foreground bg-muted",
                  !revealed && !active && paired && "border-foreground/40",
                  !revealed && !active && !paired && "border-border hover:bg-muted/60",
                  ok && "border-foreground bg-muted",
                  wrong && "border-destructive text-destructive",
                  revealed && !paired && "border-border opacity-70",
                )}
              >
                <StemText as="span" text={item.text} className="text-sm leading-6" />
                {pairedRight ? (
                  <StemText
                    as="span"
                    text={`↔ ${pairedRight.text}`}
                    className="mt-1 text-[12px] leading-5 text-muted-foreground"
                  />
                ) : (
                  <span className="mt-1 font-mono text-[11px] text-muted-foreground">
                    点选，再点右侧配对
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      <ul className="space-y-2">
        {rightOrder.map((item) => {
          const taken = usedRight.has(item.id);
          const assignedLeft = Object.entries(value).find(([, r]) => r === item.id)?.[0];
          const ok = Boolean(
            revealed && assignedLeft && question.pairs[assignedLeft] === item.id,
          );
          const wrong = Boolean(
            revealed && assignedLeft && question.pairs[assignedLeft] !== item.id,
          );
          return (
            <li key={item.id}>
              <button
                type="button"
                disabled={disabled || !pickedLeft}
                onClick={() => {
                  if (pickedLeft) pair(pickedLeft, item.id);
                }}
                className={cn(
                  "flex w-full items-start rounded-lg border px-3 py-2 text-left text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none",
                  ok && "border-foreground bg-muted",
                  wrong && "border-destructive text-destructive",
                  !revealed && taken && "border-foreground/40 bg-muted/40 text-muted-foreground",
                  !revealed && !taken && "border-border hover:bg-muted/60",
                  !pickedLeft && !revealed && "opacity-70",
                  revealed && !assignedLeft && "border-border opacity-70",
                )}
              >
                <StemText as="span" text={item.text} className="text-sm leading-6" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
