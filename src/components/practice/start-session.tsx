"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { ChapterId } from "@/content/types";
import {
  difficultyLabel,
  kindLabel,
  type Difficulty,
  type QuestionKind,
} from "@/content/practice/types";
import {
  selectChapterQuiz,
  selectReviewQuiz,
  selectWrongQuiz,
} from "@/lib/practice/select";
import {
  newSessionId,
  upsertSession,
  type FeedbackMode,
  type SessionMode,
} from "@/lib/practice/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePracticeStore } from "./use-practice-store";

const KINDS: QuestionKind[] = ["single", "multi", "truefalse", "match", "term"];
const DIFFS: Difficulty[] = [1, 2, 3];

export function StartSession({
  mode,
  chapter,
  sectionId,
  defaultFeedback,
  title,
}: {
  mode: SessionMode;
  chapter?: ChapterId;
  sectionId?: string;
  defaultFeedback?: FeedbackMode;
  title?: string;
}) {
  const router = useRouter();
  const store = usePracticeStore();
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
  const [kinds, setKinds] = useState<QuestionKind[]>([]);
  const [feedback, setFeedback] = useState<FeedbackMode>(
    defaultFeedback ?? (mode === "chapter" || mode === "section" ? "end" : "immediate"),
  );
  const [error, setError] = useState<string | null>(null);

  const preview = useMemo(() => {
    const opts = {
      chapter,
      sectionId,
      difficulties: difficulties.length ? difficulties : undefined,
      kinds: kinds.length ? kinds : undefined,
      cards: store.cards,
    };
    if (mode === "review") return selectReviewQuiz(opts);
    if (mode === "wrong") return selectWrongQuiz(opts);
    return selectChapterQuiz(opts);
  }, [mode, chapter, sectionId, difficulties, kinds, store.cards]);

  function toggleDiff(d: Difficulty) {
    setDifficulties((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d]));
  }
  function toggleKind(k: QuestionKind) {
    setKinds((cur) => (cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k]));
  }

  function start() {
    if (preview.length === 0) {
      setError(
        mode === "wrong"
          ? "错题本是空的。"
          : mode === "review"
            ? "暂时没有到期的温习。"
            : "这个范围没有题目。",
      );
      return;
    }
    const session = {
      id: newSessionId(),
      mode,
      chapter,
      sectionId,
      feedback,
      startedAt: Date.now(),
      questionIds: preview.map((q) => q.id),
      answers: {},
      graded: {},
      currentIndex: 0,
    };
    upsertSession(session);
    router.push(`/practice/session/${session.id}`);
  }

  const showFilters = mode === "chapter" || mode === "section" || mode === "drill";

  return (
    <div className="mt-8">
      {showFilters ? (
        <div className="space-y-4 text-sm">
          <fieldset>
            <legend className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
              难度
            </legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {DIFFS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDiff(d)}
                  className={cn(
                    "rounded-md border px-2.5 py-1",
                    difficulties.includes(d)
                      ? "border-foreground bg-muted"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {difficultyLabel[d].zh}
                </button>
              ))}
              <span className="self-center font-mono text-[11px] text-muted-foreground">
                空选 = 默认搭配
              </span>
            </div>
          </fieldset>
          <fieldset>
            <legend className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
              题型
            </legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {KINDS.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => toggleKind(k)}
                  className={cn(
                    "rounded-md border px-2.5 py-1",
                    kinds.includes(k)
                      ? "border-foreground bg-muted"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {kindLabel[k].zh}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
              模式
            </legend>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setFeedback("end")}
                className={cn(
                  "rounded-md border px-2.5 py-1",
                  feedback === "end"
                    ? "border-foreground bg-muted"
                    : "border-border text-muted-foreground",
                )}
              >
                测试（交卷后出详解）
              </button>
              <button
                type="button"
                onClick={() => setFeedback("immediate")}
                className={cn(
                  "rounded-md border px-2.5 py-1",
                  feedback === "immediate"
                    ? "border-foreground bg-muted"
                    : "border-border text-muted-foreground",
                )}
              >
                练习（即时对错）
              </button>
            </div>
          </fieldset>
        </div>
      ) : null}

      <p className="mt-6 text-sm text-muted-foreground">
        本题约 {preview.length} 道
        {title ? ` · ${title}` : ""}
      </p>
      {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
      <Button className="mt-4" onClick={start} disabled={preview.length === 0}>
        开始
      </Button>
    </div>
  );
}
