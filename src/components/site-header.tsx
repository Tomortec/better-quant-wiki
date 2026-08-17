"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SearchCommand } from "@/components/search-command";
import { SideNav } from "@/components/side-nav";
import { site } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="lg:hidden"
                aria-label="打开目录"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="sr-only">目录</SheetTitle>
              <div className="h-full overflow-y-auto p-4">
                <SideNav pathname={pathname} />
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-baseline gap-2">
            <span className="text-sm font-semibold tracking-tight">{site.nameZh}</span>
            <span className="hidden font-mono text-[11px] text-muted-foreground sm:inline">
              {site.nameEn}
            </span>
          </Link>

          <nav className="ml-4 hidden items-center gap-1 text-sm md:flex">
            <NavLink href="/notes/probability" active={pathname.startsWith("/notes")}>
              笔记
            </NavLink>
            <NavLink href="/glossary" active={pathname.startsWith("/glossary")}>
              术语
            </NavLink>
            <NavLink href="/practice" active={pathname.startsWith("/practice")}>
              练习
            </NavLink>
            <NavLink href="/corrections" active={pathname.startsWith("/corrections")}>
              勘误
            </NavLink>
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="hidden min-w-48 justify-between text-muted-foreground md:inline-flex"
              onClick={() => setOpen(true)}
            >
              <span className="inline-flex items-center gap-2">
                <Search className="size-3.5" />
                搜索概念
              </span>
              <kbd className="font-mono text-[10px] text-muted-foreground">⌘K</kbd>
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="md:hidden"
              aria-label="搜索"
              onClick={() => setOpen(true)}
            >
              <Search />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <SearchCommand open={open} onOpenChange={setOpen} />
    </>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-md px-2.5 py-1 text-sm ${
        active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  );
}

const emptySubscribe = () => () => {};

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  if (!mounted) {
    return <Button variant="ghost" size="icon-sm" aria-hidden />;
  }
  const dark = resolvedTheme === "dark";
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="切换主题"
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
}
