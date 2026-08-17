"use client";

import type { AnswerValue } from "@/lib/practice/grade";
import type { Question } from "@/content/practice/types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { StemText } from "./stem-text";
import { MatchBoard } from "./match-board";

export function QuestionFields({
  question,
  value,
  onChange,
  disabled,
}: {
  question: Question;
  value: AnswerValue | undefined;
  onChange: (next: AnswerValue) => void;
  disabled?: boolean;
}) {
  switch (question.kind) {
    case "single":
      return (
        <ul className="space-y-2">
          {question.choices.map((choice) => {
            const selected = value?.kind === "single" && value.choiceId === choice.id;
            return (
              <li key={choice.id}>
                <button
                  type="button"
                  disabled={disabled}
                  aria-pressed={selected}
                  onClick={() => onChange({ kind: "single", choiceId: choice.id })}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-sm",
                    selected
                      ? "border-foreground bg-muted"
                      : "border-border hover:bg-muted/60",
                  )}
                >
                  <span className="mt-0.5 w-4 font-mono text-xs text-muted-foreground">
                    {choice.id}
                  </span>
                  <StemText text={choice.text} className="min-w-0 flex-1 text-sm leading-6" />
                </button>
              </li>
            );
          })}
        </ul>
      );
    case "multi": {
      const selected = value?.kind === "multi" ? value.choiceIds : [];
      return (
        <ul className="space-y-2">
          {question.choices.map((choice) => {
            const on = selected.includes(choice.id);
            return (
              <li key={choice.id}>
                <button
                  type="button"
                  disabled={disabled}
                  aria-pressed={on}
                  onClick={() => {
                    const next = on
                      ? selected.filter((id) => id !== choice.id)
                      : [...selected, choice.id];
                    onChange({ kind: "multi", choiceIds: next });
                  }}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-sm",
                    on ? "border-foreground bg-muted" : "border-border hover:bg-muted/60",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 size-3.5 shrink-0 rounded-sm border",
                      on ? "border-foreground bg-foreground" : "border-muted-foreground/50",
                    )}
                    aria-hidden
                  />
                  <StemText text={choice.text} className="min-w-0 flex-1 text-sm leading-6" />
                </button>
              </li>
            );
          })}
        </ul>
      );
    }
    case "truefalse": {
      const current = value?.kind === "truefalse" ? value.value : undefined;
      return (
        <div className="flex gap-2">
          {(
            [
              [true, "正确"],
              [false, "错误"],
            ] as const
          ).map(([flag, label]) => (
            <button
              key={label}
              type="button"
              disabled={disabled}
              aria-pressed={current === flag}
              onClick={() => onChange({ kind: "truefalse", value: flag })}
              className={cn(
                "h-9 min-w-24 rounded-lg border px-3 text-sm",
                current === flag
                  ? "border-foreground bg-muted"
                  : "border-border hover:bg-muted/60",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      );
    }
    case "match":
      return (
        <MatchBoard
          key={question.id}
          question={question}
          value={value?.kind === "match" ? value.pairs : {}}
          onChange={(pairs) => onChange({ kind: "match", pairs })}
          disabled={disabled}
        />
      );
    case "term":
      return (
        <Input
          value={value?.kind === "term" ? value.text : ""}
          disabled={disabled}
          aria-label="术语答案"
          placeholder="输入术语（中文、英文或缩写）"
          onChange={(e) => onChange({ kind: "term", text: e.target.value })}
          className="max-w-md"
        />
      );
  }
}
