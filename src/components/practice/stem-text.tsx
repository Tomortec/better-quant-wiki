import { Fragment, type ReactNode } from "react";
import { Formula } from "@/components/formula";

function renderInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\$\$[^$]+\$\$|\$[^$]+\$)/g);
  return parts.map((part, i) => {
    if (part.startsWith("$$") && part.endsWith("$$")) {
      return <Formula key={i} tex={part.slice(2, -2)} display={false} />;
    }
    if (part.startsWith("$") && part.endsWith("$")) {
      return <Formula key={i} tex={part.slice(1, -1)} display={false} />;
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-medium text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded bg-muted px-1 py-0.5 font-mono text-[0.86em]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function StemText({
  text,
  className,
  as = "div",
}: {
  text: string;
  className?: string;
  as?: "div" | "span";
}) {
  const blocks = text.trim().split(/\n\n+/);
  if (as === "span") {
    return (
      <span className={className}>
        {blocks.map((block, i) => (
          <span key={i}>
            {i > 0 ? <br /> : null}
            {renderInline(block)}
          </span>
        ))}
      </span>
    );
  }
  return (
    <div className={className ?? "space-y-3 text-[15px] leading-7"}>
      {blocks.map((block, i) => (
        <p key={i}>{renderInline(block)}</p>
      ))}
    </div>
  );
}
