"use client";

import { useSyncExternalStore } from "react";
import {
  getServerSnapshot,
  getStoreSnapshot,
  subscribeStore,
} from "@/lib/practice/store";

export function usePracticeStore() {
  return useSyncExternalStore(subscribeStore, getStoreSnapshot, getServerSnapshot);
}

function subscribeHydrated() {
  return () => {};
}

function getHydratedSnapshot() {
  return true;
}

function getHydratedServerSnapshot() {
  return false;
}

export function useHydrated() {
  return useSyncExternalStore(
    subscribeHydrated,
    getHydratedSnapshot,
    getHydratedServerSnapshot,
  );
}

let cachedNow = 0;

function subscribeNow(onChange: () => void) {
  cachedNow = Date.now();
  const id = window.setInterval(() => {
    cachedNow = Date.now();
    onChange();
  }, 60_000);
  return () => window.clearInterval(id);
}

function getNowSnapshot() {
  if (cachedNow === 0) cachedNow = Date.now();
  return cachedNow;
}

function getNowServer() {
  return 0;
}

export function useDueWrongCounts() {
  const store = usePracticeStore();
  const now = useSyncExternalStore(subscribeNow, getNowSnapshot, getNowServer);
  let due = 0;
  let wrong = 0;
  for (const card of Object.values(store.cards)) {
    if (card.seen <= 0) continue;
    if (now > 0 && card.dueAt <= now) due += 1;
    if (!card.lastCorrect) wrong += 1;
  }
  return { due, wrong };
}
