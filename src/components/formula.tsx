import katex from "katex";
import { cn } from "@/lib/utils";

export function Formula({
  tex,
  display = true,
  label,
  className,
}: {
  tex: string;
  display?: boolean;
  label?: string;
  className?: string;
}) {
  const html = katex.renderToString(tex, {
    throwOnError: false,
    displayMode: display,
  });

  if (!display) {
    return (
      <span
        className={cn("katex-inline", className)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <figure className={cn("my-6 overflow-x-auto py-1", className)}>
      {label ? (
        <figcaption className="mb-2 font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
          {label}
        </figcaption>
      ) : null}
      <div
        className="text-center text-[1.05rem] leading-loose"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
}
