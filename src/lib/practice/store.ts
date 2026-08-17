import type { ChapterId } from "@/content/types";
import type { AnswerValue } from "./grade";
import { defaultCard, type SrsCard } from "./srs";

export type SessionMode = "chapter" | "section" | "review" | "wrong" | "drill";
export type FeedbackMode = "end" | "immediate";

export type SessionRecord = {
  id: string;
  mode: SessionMode;
  chapter?: ChapterId;
  sectionId?: string;
  feedback: FeedbackMode;
  startedAt: number;
  finishedAt?: number;
  questionIds: string[];
  answers: Record<string, AnswerValue>;
  graded: Record<string, boolean>;
  currentIndex: number;
  score?: { correct: number; total: number };
};

export type PracticeStoreV1 = {
  v: 1;
  cards: Record<string, SrsCard>;
  sessions: SessionRecord[];
};

export const STORAGE_KEY = "bqw-practice-v1";
const MAX_SESSIONS = 20;

export const emptyStore: PracticeStoreV1 = { v: 1, cards: {}, sessions: [] };

function isStore(value: unknown): value is PracticeStoreV1 {
  if (!value || typeof value !== "object") return false;
  const v = value as PracticeStoreV1;
  return v.v === 1 && typeof v.cards === "object" && Array.isArray(v.sessions);
}

export function parseStore(raw: string | null): PracticeStoreV1 {
  if (!raw) return { ...emptyStore, cards: {}, sessions: [] };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isStore(parsed)) return { ...emptyStore, cards: {}, sessions: [] };
    return {
      v: 1,
      cards: parsed.cards ?? {},
      sessions: parsed.sessions ?? [],
    };
  } catch {
    return { ...emptyStore, cards: {}, sessions: [] };
  }
}

let cache: PracticeStoreV1 | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function persist(store: PracticeStoreV1) {
  cache = store;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }
  emit();
}

export function loadStore(): PracticeStoreV1 {
  if (cache) return cache;
  if (typeof window === "undefined") {
    cache = { v: 1, cards: {}, sessions: [] };
    return cache;
  }
  cache = parseStore(window.localStorage.getItem(STORAGE_KEY));
  return cache;
}

export function getStoreSnapshot(): PracticeStoreV1 {
  return loadStore();
}

export function getServerSnapshot(): PracticeStoreV1 {
  return emptyStore;
}

export function subscribeStore(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function updateStore(fn: (store: PracticeStoreV1) => PracticeStoreV1): PracticeStoreV1 {
  const next = fn(loadStore());
  persist(next);
  return next;
}

export function newSessionId(): string {
  const rand =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `s_${Date.now().toString(36)}_${rand}`;
}

export function upsertSession(session: SessionRecord): PracticeStoreV1 {
  return updateStore((store) => {
    const rest = store.sessions.filter((s) => s.id !== session.id);
    const sessions = [session, ...rest].slice(0, MAX_SESSIONS);
    return { ...store, sessions };
  });
}

export function getSession(id: string): SessionRecord | undefined {
  return loadStore().sessions.find((s) => s.id === id);
}

export function getCard(questionId: string): SrsCard {
  return loadStore().cards[questionId] ?? defaultCard();
}

export function exportStoreJson(): string {
  return JSON.stringify(loadStore(), null, 2);
}

export function importStoreJson(raw: string): { ok: true } | { ok: false; error: string } {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isStore(parsed)) return { ok: false, error: "文件格式不是本站的练习进度（需要 v: 1）。" };
    persist({
      v: 1,
      cards: parsed.cards ?? {},
      sessions: (parsed.sessions ?? []).slice(0, MAX_SESSIONS),
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "无法解析 JSON。" };
  }
}

export function dueCount(now = Date.now()): number {
  return Object.values(loadStore().cards).filter((c) => c.dueAt <= now && c.seen > 0).length;
}

export function wrongCount(): number {
  return Object.values(loadStore().cards).filter((c) => c.seen > 0 && !c.lastCorrect).length;
}
