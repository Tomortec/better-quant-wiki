"use client";

import Link from "next/link";
import { useMemo } from "react";
import { getQuestion } from "@/content/practice";
import { difficultyLabel, kindLabel } from "@/content/practice/types";
import type { AnswerValue } from "@/lib/practice/grade";
import { gradeAnswer, sessionScore } from "@/lib/practice/grade";
import { defaultCard, sm2Update } from "@/lib/practice/srs";
import {
  getSession,
  updateStore,
  upsertSession,
  type SessionRecord,
} from "@/lib/practice/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StemText } from "./stem-text";
import { QuestionFields } from "./question-fields";
import { ExplanationPanel } from "./explanation-panel";
import { usePracticeStore } from "./use-practice-store";

function hasAnswer(question: { kind: string; left?: { id: string }[] }, answer: AnswerValue | undefined): boolean {
  if (!answer || answer.kind !== question.kind) return false;
  switch (answer.kind) {
    case "single":
      return Boolean(answer.choiceId);
    case "multi":
      return answer.choiceIds.length > 0;
    case "truefalse":
      return typeof answer.value === "boolean";
    case "match":
      return Boolean(question.left?.every((item) => answer.pairs[item.id]));
    case "term":
      return answer.text.trim().length > 0;
  }
}

function applyGrade(questionId: string, correct: boolean) {
  updateStore((store) => {
    const prev = store.cards[questionId] ?? defaultCard();
    return {
      ...store,
      cards: {
        ...store.cards,
        [questionId]: sm2Update(prev, correct),
      },
    };
  });
}

function finishSession(session: SessionRecord) {
  const questions = session.questionIds
    .map((id) => getQuestion(id))
    .filter((q): q is NonNullable<typeof q> => Boolean(q));
  const score = sessionScore(questions, session.answers);
  for (const q of questions) {
    if (session.graded[q.id]) continue;
    applyGrade(q.id, gradeAnswer(q, session.answers[q.id]).correct);
  }
  upsertSession({
    ...session,
    finishedAt: Date.now(),
    currentIndex: session.questionIds.length - 1,
    score,
    graded: Object.fromEntries(session.questionIds.map((id) => [id, true])),
  });
}

export function QuizRunner({ sessionId }: { sessionId: string }) {
  const store = usePracticeStore();
  const session = store.sessions.find((s) => s.id === sessionId) ?? getSession(sessionId);
  const questions = useMemo(() => {
    if (!session) return [];
    return session.questionIds
      .map((id) => getQuestion(id))
      .filter((q): q is NonNullable<typeof q> => Boolean(q));
  }, [session]);

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
      <div className="mx-auto max-w-2xl text-sm text-muted-foreground">题库里找不到这些题目。</div>
    );
  }

  const answer = currentSession.answers[question.id];
  const revealed = Boolean(currentSession.graded[question.id]);
  const immediate = currentSession.feedback === "immediate";
  const result = revealed ? gradeAnswer(question, answer) : null;
  const last = index === questions.length - 1;

  function patch(partial: Partial<SessionRecord>) {
    upsertSession({ ...currentSession, ...partial });
  }

  function go(nextIndex: number) {
    patch({ currentIndex: nextIndex });
  }

  function setAnswer(next: AnswerValue) {
    if (revealed) return;
    patch({
      answers: { ...currentSession.answers, [question.id]: next },
    });
  }

  function submitImmediate() {
    if (!hasAnswer(question, answer) || revealed) return;
    const g = gradeAnswer(question, answer);
    applyGrade(question.id, g.correct);
    patch({
      graded: { ...currentSession.graded, [question.id]: true },
    });
  }

  function submitAll() {
    finishSession(currentSession);
  }

  const answered = hasAnswer(question, answer);
  const allAnswered = questions.every((q) => hasAnswer(q, currentSession.answers[q.id]));

  return (
    <div className="mx-auto max-w-2xl">
      <p className="font-mono text-xs text-muted-foreground">
        {index + 1} / {questions.length}
        {currentSession.chapter ? ` · ${currentSession.chapter}` : ""}
      </p>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-foreground/70"
          style={{ width: `${((index + (revealed ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
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
        {!immediate && last ? (
          <Button onClick={submitAll} disabled={!allAnswered}>
            交卷
          </Button>
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
      <p className="font-mono text-xs text-muted-foreground">Result</p>
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
