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
}: {
  question: MatchQuestion;
  value: Record<string, string>;
  onChange: (pairs: Record<string, string>) => void;
  disabled?: boolean;
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
                  "flex w-full flex-col items-start rounded-lg border px-3 py-2 text-left text-sm",
                  active
                    ? "border-foreground bg-muted"
                    : "border-border hover:bg-muted/60",
                  paired && "border-foreground/40",
                )}
              >
                <StemText text={item.text} className="text-sm leading-6" />
                {pairedRight ? (
                  <span className="mt-1 text-[12px] text-muted-foreground">
                    <StemText text={`↔ ${pairedRight.text}`} className="text-[12px] leading-5" />
                  </span>
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
          return (
            <li key={item.id}>
              <button
                type="button"
                disabled={disabled || !pickedLeft}
                onClick={() => {
                  if (pickedLeft) pair(pickedLeft, item.id);
                }}
                className={cn(
                  "flex w-full items-start rounded-lg border px-3 py-2 text-left text-sm",
                  taken
                    ? "border-foreground/40 bg-muted/40 text-muted-foreground"
                    : "border-border hover:bg-muted/60",
                  !pickedLeft && "opacity-70",
                )}
              >
                <StemText text={item.text} className="text-sm leading-6" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
