"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { chapters } from "@/content/chapters";
import { allConcepts } from "@/content/glossary";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export function SearchCommand({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="搜索"
      description="按中文、英文或缩写查找概念与笔记"
    >
      <CommandInput placeholder="搜索概念、英文名、笔记…" />
      <CommandList>
        <CommandEmpty>没有匹配的条目</CommandEmpty>
        <CommandGroup heading="笔记">
          {chapters.map((ch) => (
            <CommandItem
              key={ch.id}
              value={`${ch.zh} ${ch.en} ${ch.summary}`}
              onSelect={() => {
                router.push(`/notes/${ch.id}`);
                onOpenChange(false);
              }}
            >
              <span className="font-mono text-xs text-muted-foreground">
                {ch.n}
              </span>
              <span>{ch.zh}</span>
              <span className="font-mono text-xs text-muted-foreground">
                {ch.en}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="术语">
          {allConcepts.map((c) => (
            <CommandItem
              key={c.slug}
              value={`${c.zh} ${c.en} ${c.abbr ?? ""} ${(c.aliases ?? []).join(" ")} ${c.definition}`}
              onSelect={() => {
                router.push(`/glossary/${c.slug}`);
                onOpenChange(false);
              }}
            >
              <span>{c.zh}</span>
              <span className="truncate font-mono text-xs text-muted-foreground">
                {c.en}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function useSearchOpen() {
  const [open, setOpen] = useState(false);
  return { open, setOpen };
}
