"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { getQuestion } from "@/content/practice";
import type { Question } from "@/content/practice/types";
import { difficultyLabel, kindLabel } from "@/content/practice/types";
import type { AnswerValue } from "@/lib/practice/grade";
import { gradeAnswer, sessionScore } from "@/lib/practice/grade";
import { defaultCard, sm2Update } from "@/lib/practice/srs";
import {
  updateStore,
  withSession,
  type SessionRecord,
} from "@/lib/practice/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StemText } from "./stem-text";
import { QuestionFields } from "./question-fields";
import { ExplanationPanel } from "./explanation-panel";
import { useHydrated, usePracticeStore } from "./use-practice-store";

function hasAnswer(
  question: { kind: string; left?: { id: string }[] },
  answer: AnswerValue | undefined,
): boolean {
  if (!answer || answer.kind !== question.kind) return false;
  switch (answer.kind) {
    case "single":
      return Boolean(answer.choiceId);
    case "multi":
      return answer.choiceIds.length >= 2;
    case "truefalse":
      return typeof answer.value === "boolean";
    case "match":
      return Boolean(question.left?.every((item) => answer.pairs[item.id]));
    case "term":
      return answer.text.trim().length > 0;
  }
}

function choiceText(question: Question, id: string): string {
  if (question.kind !== "single" && question.kind !== "multi") return id;
  return question.choices.find((c) => c.id === id)?.text ?? id;
}

function AnswerLines({
  question,
  answer,
}: {
  question: Question;
  answer: AnswerValue | undefined;
}) {
  let yours = "未作答";
  let correct = "";
  switch (question.kind) {
    case "single":
      yours =
        answer?.kind === "single" ? choiceText(question, answer.choiceId) : "未作答";
      correct = choiceText(question, question.answer);
      break;
    case "multi":
      yours =
        answer?.kind === "multi" && answer.choiceIds.length > 0
          ? answer.choiceIds.map((id) => choiceText(question, id)).join("；")
          : "未作答";
      correct = question.answer.map((id) => choiceText(question, id)).join("；");
      break;
    case "truefalse":
      yours =
        answer?.kind === "truefalse" ? (answer.value ? "正确" : "错误") : "未作答";
      correct = question.answer ? "正确" : "错误";
      break;
    case "term":
      yours = answer?.kind === "term" && answer.text.trim() ? answer.text : "未作答";
      correct = question.accept[0] ?? "";
      break;
    case "match":
      yours =
        answer?.kind === "match"
          ? question.left
              .map((left) => {
                const rightId = answer.pairs[left.id];
                const right = question.right.find((r) => r.id === rightId);
                return `${left.text} ↔ ${right?.text ?? "—"}`;
              })
              .join("；")
          : "未作答";
      correct = question.left
        .map((left) => {
          const right = question.right.find((r) => r.id === question.pairs[left.id]);
          return `${left.text} ↔ ${right?.text ?? "—"}`;
        })
        .join("；");
      break;
  }

  return (
    <dl className="mt-3 space-y-2 text-sm">
      <div>
        <dt className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
          你的作答
        </dt>
        <dd className="mt-1">
          <StemText as="span" text={yours} className="text-sm leading-6" />
        </dd>
      </div>
      <div>
        <dt className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
          正确答案
        </dt>
        <dd className="mt-1">
          <StemText as="span" text={correct} className="text-sm leading-6" />
        </dd>
      </div>
    </dl>
  );
}

export function QuizRunner({ sessionId }: { sessionId: string }) {
  const hydrated = useHydrated();
  const store = usePracticeStore();
  const session = store.sessions.find((s) => s.id === sessionId);
  const [drafts, setDrafts] = useState<Record<string, AnswerValue>>({});
  const draftsRef = useRef(drafts);
  const termTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (termTimer.current) clearTimeout(termTimer.current);
      const overlay = draftsRef.current;
      updateStore((s) => {
        const current = s.sessions.find((row) => row.id === sessionId);
        if (!current || current.finishedAt) return s;
        return withSession(s, {
          ...current,
          answers: { ...current.answers, ...overlay },
        });
      });
    };
  }, [sessionId]);

  const questions = useMemo(() => {
    if (!session) return [];
    return session.questionIds
      .map((id) => getQuestion(id))
      .filter((q): q is NonNullable<typeof q> => Boolean(q));
  }, [session]);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="h-3 w-16 rounded bg-muted" />
        <div className="mt-2 h-1 rounded-full bg-muted" />
        <div className="mt-8 h-40 rounded-lg bg-muted/60" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight">找不到这次练习</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          进度只存在这个浏览器。若你清过缓存，或从另一台设备打开链接，会话就不会在这里。
        </p>
        <Button asChild className="mt-6">
          <Link href="/practice">回到练习</Link>
        </Button>
      </div>
    );
  }

  const currentSession = session;
  const finished = Boolean(currentSession.finishedAt);
  const index = Math.min(currentSession.currentIndex, Math.max(0, questions.length - 1));
  const question = questions[index];

  if (finished) {
    return <ResultView session={currentSession} />;
  }

  if (!question) {
    return (
      <div className="mx-auto max-w-2xl text-sm text-muted-foreground">
        题库里找不到这些题目。
      </div>
    );
  }

  const answer = drafts[question.id] ?? currentSession.answers[question.id];
  const revealed = Boolean(currentSession.graded[question.id]);
  const immediate = currentSession.feedback === "immediate";
  const result = revealed ? gradeAnswer(question, answer) : null;
  const last = index === questions.length - 1;
  const answeredCount = questions.filter((q) =>
    hasAnswer(q, drafts[q.id] ?? currentSession.answers[q.id]),
  ).length;

  function persistWith(
    overlay: Record<string, AnswerValue>,
    extra?: Partial<SessionRecord>,
  ) {
    if (termTimer.current) {
      clearTimeout(termTimer.current);
      termTimer.current = null;
    }
    updateStore((s) => {
      const current = s.sessions.find((row) => row.id === sessionId);
      if (!current || current.finishedAt) return s;
      return withSession(s, {
        ...current,
        ...extra,
        answers: { ...current.answers, ...overlay },
      });
    });
  }

  function go(nextIndex: number) {
    persistWith(drafts, { currentIndex: nextIndex });
  }

  function setAnswer(next: AnswerValue) {
    if (revealed) return;
    const nextDrafts = { ...drafts, [question.id]: next };
    draftsRef.current = nextDrafts;
    setDrafts(nextDrafts);
    if (next.kind === "term") {
      if (termTimer.current) clearTimeout(termTimer.current);
      termTimer.current = setTimeout(() => persistWith(nextDrafts), 300);
      return;
    }
    persistWith(nextDrafts);
  }

  function submitImmediate() {
    const overlay = { ...drafts };
    draftsRef.current = overlay;
    if (termTimer.current) {
      clearTimeout(termTimer.current);
      termTimer.current = null;
    }
    updateStore((s) => {
      const current = s.sessions.find((row) => row.id === sessionId);
      if (!current || current.finishedAt || current.graded[question.id]) return s;
      const answers = { ...current.answers, ...overlay };
      const nextAnswer = answers[question.id];
      if (!hasAnswer(question, nextAnswer)) return s;
      const g = gradeAnswer(question, nextAnswer);
      const prev = s.cards[question.id] ?? defaultCard();
      return {
        ...withSession(s, {
          ...current,
          answers,
          graded: { ...current.graded, [question.id]: true },
        }),
        cards: {
          ...s.cards,
          [question.id]: sm2Update(prev, g.correct),
        },
      };
    });
  }

  function submitAll() {
    const overlay = { ...drafts };
    draftsRef.current = overlay;
    if (termTimer.current) {
      clearTimeout(termTimer.current);
      termTimer.current = null;
    }
    updateStore((s) => {
      const current = s.sessions.find((row) => row.id === sessionId);
      if (!current || current.finishedAt) return s;
      const answers = { ...current.answers, ...overlay };
      const qs = current.questionIds
        .map((id) => getQuestion(id))
        .filter((q): q is NonNullable<typeof q> => Boolean(q));
      let cards = s.cards;
      for (const q of qs) {
        if (current.graded[q.id]) continue;
        const prev = cards[q.id] ?? defaultCard();
        cards = {
          ...cards,
          [q.id]: sm2Update(prev, gradeAnswer(q, answers[q.id]).correct),
        };
      }
      return {
        ...withSession(s, {
          ...current,
          answers,
          finishedAt: Date.now(),
          currentIndex: current.questionIds.length - 1,
          score: sessionScore(qs, answers),
          graded: Object.fromEntries(current.questionIds.map((id) => [id, true])),
        }),
        cards,
      };
    });
  }

  const answered = hasAnswer(question, answer);
  const allAnswered = questions.every((q) =>
    hasAnswer(q, drafts[q.id] ?? currentSession.answers[q.id]),
  );

  return (
    <div className="mx-auto max-w-2xl">
      <p className="font-mono text-xs text-muted-foreground">
        {index + 1} / {questions.length}
        {currentSession.chapter ? ` · ${currentSession.chapter}` : ""}
      </p>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-foreground/70"
          style={{
            width: `${questions.length === 0 ? 0 : (answeredCount / questions.length) * 100}%`,
          }}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="font-normal">
          {kindLabel[question.kind].zh}
          <span className="font-mono text-[10px] opacity-70">{kindLabel[question.kind].en}</span>
        </Badge>
        <Badge variant="outline" className="font-normal">
          {difficultyLabel[question.difficulty].zh}
          <span className="font-mono text-[10px] opacity-70">
            {difficultyLabel[question.difficulty].en}
          </span>
        </Badge>
        {question.kind === "multi" ? (
          <span className="text-xs text-muted-foreground">请选出全部正确项</span>
        ) : null}
      </div>

      <div className="mt-5">
        <StemText text={question.stem} />
      </div>
      <div className="mt-5">
        <QuestionFields
          question={question}
          value={answer}
          onChange={setAnswer}
          disabled={revealed}
          revealed={revealed}
        />
      </div>

      {result ? (
        <p className={`mt-4 text-sm ${result.correct ? "text-foreground" : "text-destructive"}`}>
          {result.correct
            ? "正确"
            : question.kind === "match"
              ? `对了 ${result.matched}/${result.total} 对`
              : "不正确"}
        </p>
      ) : null}

      {revealed ? <ExplanationPanel question={question} correct={Boolean(result?.correct)} /> : null}

      <div className="mt-8 flex flex-wrap gap-2">
        {index > 0 ? (
          <Button variant="outline" onClick={() => go(index - 1)}>
            上一题
          </Button>
        ) : null}
        {immediate && !revealed ? (
          <Button onClick={submitImmediate} disabled={!answered}>
            提交本题
          </Button>
        ) : null}
        {immediate && revealed && !last ? (
          <Button onClick={() => go(index + 1)}>下一题</Button>
        ) : null}
        {immediate && revealed && last ? (
          <Button onClick={submitAll}>查看成绩</Button>
        ) : null}
        {!immediate && !last ? (
          <Button onClick={() => go(index + 1)} disabled={!answered}>
            下一题
          </Button>
        ) : null}
        {!immediate && allAnswered ? (
          <Button onClick={submitAll}>交卷</Button>
        ) : null}
      </div>
    </div>
  );
}

function ResultView({ session }: { session: SessionRecord }) {
  const questions = session.questionIds
    .map((id) => getQuestion(id))
    .filter((q): q is NonNullable<typeof q> => Boolean(q));
  const score = session.score ?? sessionScore(questions, session.answers);
  const byDiff = { 1: { c: 0, t: 0 }, 2: { c: 0, t: 0 }, 3: { c: 0, t: 0 } };
  const missed = [];
  for (const q of questions) {
    const ok = gradeAnswer(q, session.answers[q.id]).correct;
    byDiff[q.difficulty].t += 1;
    if (ok) byDiff[q.difficulty].c += 1;
    else missed.push(q);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <p className="font-mono text-xs text-muted-foreground">成绩</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        {score.correct} / {score.total}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        错题已进入错题本，并按间隔安排温习。
      </p>

      <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-border py-4 text-sm">
        {([1, 2, 3] as const).map((d) => (
          <div key={d}>
            <dt className="font-mono text-[11px] text-muted-foreground">
              {difficultyLabel[d].zh}
            </dt>
            <dd className="mt-1 text-lg font-semibold">
              {byDiff[d].t === 0 ? "—" : `${byDiff[d].c}/${byDiff[d].t}`}
            </dd>
          </div>
        ))}
      </dl>

      {missed.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-sm font-medium">错题</h2>
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {missed.map((q) => (
              <li key={q.id} className="py-6">
                <StemText text={q.stem} className="space-y-2 text-sm leading-6" />
                <AnswerLines question={q} answer={session.answers[q.id]} />
                <ExplanationPanel question={q} correct={false} />
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">全部答对。</p>
      )}

      <div className="mt-10 flex flex-wrap gap-2">
        <Button asChild>
          <Link href="/practice">练习总览</Link>
        </Button>
        {missed.length > 0 ? (
          <Button asChild variant="outline">
            <Link href="/practice/wrong">去错题本</Link>
          </Button>
        ) : null}
        <Button asChild variant="outline">
          <Link href="/practice/review">去温习</Link>
        </Button>
      </div>
    </div>
  );
}
