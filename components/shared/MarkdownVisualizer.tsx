import React from "react"
import { cn } from "@/lib/utils"

interface Props { content: string }

/* Inline bold: **text** → highlighted span */
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <span key={i} className="text-secondary-fixed font-semibold">
        {part.slice(2, -2)}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

/* A single rendered line */
function Line({ line, index }: { line: string; index: number }) {
  if (line.startsWith("# ")) {
    return (
      <div className="flex items-baseline gap-3 mt-4 mb-1 first:mt-0">
        <span className="text-primary/40 text-[11px] font-mono select-none w-4 shrink-0 text-right">
          {(index + 1).toString().padStart(2, "0")}
        </span>
        <span className="text-primary font-semibold text-[13px]">{line}</span>
      </div>
    )
  }

  if (line.startsWith("## ")) {
    return (
      <div className="flex items-baseline gap-3 mt-3 mb-1">
        <span className="text-primary/40 text-[11px] font-mono select-none w-4 shrink-0 text-right">
          {(index + 1).toString().padStart(2, "0")}
        </span>
        <span className="text-primary/70 font-semibold text-[13px]">{line}</span>
      </div>
    )
  }

  if (line.startsWith("- ")) {
    return (
      <div className="flex items-baseline gap-3">
        <span className="text-primary/40 text-[11px] font-mono select-none w-4 shrink-0 text-right">
          {(index + 1).toString().padStart(2, "0")}
        </span>
        <span className="text-on-background text-[13px]">{renderInline(line)}</span>
      </div>
    )
  }

  if (line === "") {
    return (
      <div className="flex items-baseline gap-3 h-4">
        <span className="text-primary/20 text-[11px] font-mono select-none w-4 shrink-0 text-right">
          {(index + 1).toString().padStart(2, "0")}
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-baseline gap-3">
      <span className="text-primary/40 text-[11px] font-mono select-none w-4 shrink-0 text-right">
        {(index + 1).toString().padStart(2, "0")}
      </span>
      <span className={cn("text-[13px]", line.endsWith(":") ? "text-on-surface-variant/70" : "text-on-background/80")}>
        {renderInline(line)}
      </span>
    </div>
  )
}

export function MarkdownVisualizer({ content }: Props) {
  const lines = content.split("\n")

  return (
    <div className="font-mono leading-[1.8] space-y-0">
      {lines.map((line, i) => (
        <Line key={i} line={line} index={i} />
      ))}
    </div>
  )
}
