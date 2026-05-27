"use client";
import { useState } from "react";

interface CollapsibleReadmeProps {
  html: string;
}

export default function CollapsibleReadme({ html }: CollapsibleReadmeProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div className="relative">
        <div
          className={`prose prose-sm prose-invert max-w-none text-muted-foreground text-xs leading-relaxed break-words [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_img]:rounded-lg [&_img]:border [&_img]:border-border/40 [&_pre]:bg-muted/30 [&_pre]:border [&_pre]:border-border/30 [&_pre]:rounded-lg [&_pre]:p-3 [&_pre]:overflow-x-auto [&_code]:text-[11px] [&_h1]:text-base [&_h1]:text-foreground [&_h1]:font-semibold [&_h1]:mt-6 [&_h1]:mb-2 [&_h2]:text-sm [&_h2]:text-foreground [&_h2]:font-semibold [&_h2]:mt-5 [&_h2]:mb-2 [&_h3]:text-xs [&_h3]:text-foreground [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:mb-0.5 [&_p]:mb-2 [&_blockquote]:border-l-2 [&_blockquote]:border-primary/30 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-muted-foreground/80 [&_hr]:border-border/30 [&_table]:border-collapse [&_th]:border [&_th]:border-border/30 [&_th]:px-2 [&_th]:py-1 [&_th]:text-left [&_td]:border [&_td]:border-border/30 [&_td]:px-2 [&_td]:py-1 ${
            !expanded ? "max-h-64 overflow-hidden lg:max-h-none lg:overflow-visible" : ""
          }`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none lg:hidden" />
        )}
      </div>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-2 text-xs text-primary hover:underline underline-offset-4 transition-colors lg:hidden"
      >
        {expanded ? "Show less" : "Read more"}
      </button>
    </div>
  );
}
