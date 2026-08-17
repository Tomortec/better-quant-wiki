"use client";

import type { AnswerValue } from "@/lib/practice/grade";
import type { Question } from "@/content/practice/types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { StemText } from "./stem-text";
import { MatchBoard } from "./match-board";

const choiceButton =
  "flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none";

export function QuestionFields({
  question,
  value,
  onChange,
  disabled,
  revealed,
}: {
  question: Question;
  value: AnswerValue | undefined;
  onChange: (next: AnswerValue) => void;
  disabled?: boolean;
  revealed?: boolean;
}) {
  switch (question.kind) {
    case "single":
      return (
        <ul className="space-y-2">
          {question.choices.map((choice) => {
            const selected = value?.kind === "single" && value.choiceId === choice.id;
            const isCorrect = choice.id === question.answer;
            const isWrongPick = Boolean(revealed && selected && !isCorrect);
            return (
              <li key={choice.id}>
                <button
                  type="button"
                  disabled={disabled}
                  aria-pressed={selected}
                  onClick={() => onChange({ kind: "single", choiceId: choice.id })}
                  className={cn(
                    choiceButton,
                    revealed && isCorrect && "border-foreground bg-muted",
                    isWrongPick && "border-destructive text-destructive",
                    !revealed && selected && "border-foreground bg-muted",
                    !revealed && !selected && "border-border hover:bg-muted/60",
                    revealed && !isCorrect && !isWrongPick && "border-border opacity-70",
                  )}
                >
                  <span className="mt-0.5 w-4 font-mono text-xs text-muted-foreground">
                    {choice.id}
                  </span>
                  <StemText
                    as="span"
                    text={choice.text}
                    className="min-w-0 flex-1 text-sm leading-6"
                  />
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
            const isCorrect = question.answer.includes(choice.id);
            const isWrongPick = Boolean(revealed && on && !isCorrect);
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
                    choiceButton,
                    revealed && isCorrect && "border-foreground bg-muted",
                    isWrongPick && "border-destructive text-destructive",
                    !revealed && on && "border-foreground bg-muted",
                    !revealed && !on && "border-border hover:bg-muted/60",
                    revealed && !isCorrect && !isWrongPick && "border-border opacity-70",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 size-3.5 shrink-0 rounded-sm border",
                      (on || (revealed && isCorrect)) && "border-foreground bg-foreground",
                      isWrongPick && "border-destructive bg-destructive",
                      !on && !(revealed && isCorrect) && "border-muted-foreground/50",
                    )}
                    aria-hidden
                  />
                  <StemText
                    as="span"
                    text={choice.text}
                    className="min-w-0 flex-1 text-sm leading-6"
                  />
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
          ).map(([flag, label]) => {
            const selected = current === flag;
            const isCorrect = flag === question.answer;
            const isWrongPick = Boolean(revealed && selected && !isCorrect);
            return (
              <button
                key={label}
                type="button"
                disabled={disabled}
                aria-pressed={selected}
                onClick={() => onChange({ kind: "truefalse", value: flag })}
                className={cn(
                  "h-9 min-w-24 rounded-lg border px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none",
                  revealed && isCorrect && "border-foreground bg-muted",
                  isWrongPick && "border-destructive text-destructive",
                  !revealed && selected && "border-foreground bg-muted",
                  !revealed && !selected && "border-border hover:bg-muted/60",
                  revealed && !isCorrect && !isWrongPick && "border-border opacity-70",
                )}
              >
                {label}
              </button>
            );
          })}
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
          revealed={revealed}
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
          onBlur={(e) => onChange({ kind: "term", text: e.target.value })}
          className="max-w-md"
        />
      );
  }
}
