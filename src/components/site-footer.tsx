import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          {site.nameZh}
          <span className="mx-1.5 font-mono">{site.nameEn}</span>
          · MIT License
        </p>
        <p className="flex flex-wrap gap-x-4 gap-y-1">
          <a
            href={site.github}
            className="hover:text-foreground"
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          <a href="/practice" className="hover:text-foreground">
            练习
          </a>
          <a href="/corrections" className="hover:text-foreground">
            勘误
          </a>
          <a
            href={`${site.github}/blob/main/LICENSE`}
            className="hover:text-foreground"
            rel="noreferrer"
            target="_blank"
          >
            License
          </a>
        </p>
      </div>
    </footer>
  );
}
