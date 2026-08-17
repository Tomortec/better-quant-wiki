import Link from "next/link";
import { chapters } from "@/content/chapters";
import { DueBadge } from "@/components/practice/review-banner";
import { cn } from "@/lib/utils";

const extra = [
  { href: "/glossary", zh: "术语表", en: "Glossary", match: "/glossary" },
  { href: "/practice", zh: "练习", en: "Practice", match: "/practice" },
  { href: "/corrections", zh: "原文勘误", en: "Corrections", match: "/corrections" },
];

export function SideNav({ pathname }: { pathname: string }) {
  return (
    <nav className="space-y-6 text-sm">
      <div>
        <p className="mb-2 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
          Notes
        </p>
        <ul className="space-y-0.5">
          {chapters.map((ch) => {
            const href = `/notes/${ch.id}`;
            const active = pathname === href;
            return (
              <li key={ch.id}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-baseline gap-2 rounded-md px-2 py-1.5",
                    active
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  <span className="w-5 shrink-0 font-mono text-[11px]">
                    {ch.n}
                  </span>
                  <span className="min-w-0">
                    <span className="block leading-5">{ch.zh}</span>
                    <span className="block font-mono text-[10px] opacity-70">
                      {ch.en}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <p className="mb-2 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
          Reference
        </p>
        <ul className="space-y-0.5">
          {extra.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.match}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-2 py-1.5",
                    active
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  <span className="flex min-w-0 flex-col">
                    <span>{item.zh}</span>
                    <span className="font-mono text-[10px] opacity-70">{item.en}</span>
                  </span>
                  {item.href === "/practice" ? <DueBadge /> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
