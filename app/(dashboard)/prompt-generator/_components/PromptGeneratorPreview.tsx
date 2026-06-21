"use client"

import { useState } from "react"
import {
  Check, Copy, Download, Sparkles, Loader2,
} from "lucide-react"
import { Button }             from "@/components/ui/button"
import { MarkdownVisualizer } from "@/components/shared/MarkdownVisualizer"
import { estimateTokens }     from "@/lib/prompt-generator-compiler"
import { cn } from "@/lib/utils"

export interface PromptGeneratorPreviewProps {
  prompt:       string
  isGenerated:  boolean
  isGenerating: boolean
  isEnhanced:   boolean
  isEnhancing:  boolean
  isLean:       boolean
  onCopy:       () => void
  onDownload:   () => void
  onEnhance:    () => void
}

export function PromptGeneratorPreview({
  prompt, isGenerated, isGenerating,
  isEnhanced, isEnhancing, isLean,
  onCopy, onDownload, onEnhance,
}: PromptGeneratorPreviewProps) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lines  = prompt ? prompt.split("\n").length : 0
  const tokens = prompt ? estimateTokens(prompt) : 0

  return (
    <section className="flex-1 bg-surface-container-lowest flex flex-col overflow-hidden">

      {/* ── sticky toolbar (two rows) ───────────────────────────────── */}
      <div className="shrink-0 bg-surface-container-lowest/95 backdrop-blur-sm border-b border-outline-variant px-5 pt-3 pb-2 flex flex-col gap-2">

        {/* Row 1: title */}
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[15px] font-semibold text-on-surface leading-tight">
            Prompt Preview
          </h3>
        </div>

        {/* Row 2: stats + action buttons */}
        <div className="flex items-center justify-between gap-3">

          {/* Stats */}
          <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
            {lines > 0 ? (
              <>
                <span className="text-[10px] font-mono text-on-surface-variant/50 shrink-0">
                  {lines} lines
                </span>
                <span className="text-[10px] font-mono text-outline-variant shrink-0">·</span>
                <span className={cn(
                  "text-[10px] font-mono shrink-0",
                  isLean ? "text-primary/70" : "text-on-surface-variant/50"
                )}>
                  ~{tokens} tokens
                </span>
                {isLean && (
                  <span className="px-1 py-px rounded text-[9px] font-mono font-semibold bg-primary/10 text-primary/80 border border-primary/20 leading-none shrink-0">
                    lean
                  </span>
                )}
                <span className="text-[10px] font-mono text-outline-variant shrink-0">·</span>
                <span className="text-[10px] font-mono text-on-surface-variant/50 shrink-0">
                  {isEnhanced ? "ai-enhanced" : "markdown"}
                </span>
              </>
            ) : (
              <span className="text-[10px] font-mono text-on-surface-variant/30">
                awaiting output…
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant={copied ? "surface" : "outline"}
              size="sm"
              onClick={handleCopy}
              className={cn(
                "gap-1.5 text-xs h-7 px-2.5 transition-all",
                copied && "border-primary/40 text-primary"
              )}
            >
              {copied
                ? <><Check className="w-3.5 h-3.5" /><span className="hidden sm:inline">Copied!</span></>
                : <><Copy className="w-3.5 h-3.5" /><span className="hidden sm:inline">Copy</span></>
              }
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              className="gap-1.5 text-xs h-7 px-2.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save .md</span>
            </Button>

            <div className="w-px h-4 bg-outline-variant mx-0.5" />

            <Button
              variant={isEnhanced ? "secondary" : "default"}
              size="sm"
              onClick={onEnhance}
              disabled={isEnhancing || !prompt.trim()}
              className="gap-1.5 text-xs h-7 px-2.5"
            >
              {isEnhancing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden lg:inline">Enhancing…</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">
                    {isEnhanced ? "Re-enhance" : "Enhance"}
                  </span>
                </>
              )}
            </Button>
          </div>

        </div>
      </div>

      {/* ── body ────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-5 lg:p-7">
        <div className={cn(
          "rounded-xl border border-outline-variant bg-surface-container flex flex-col min-h-full shadow-lg shadow-black/20 transition-all duration-500",
          isGenerated && !isEnhanced && "border-primary/20 shadow-primary/5",
          isEnhanced && "border-secondary/30 shadow-secondary/5"
        )}>
          {/* Editor chrome */}
          <div className="shrink-0 bg-surface-container-high px-4 py-2.5 border-b border-outline-variant rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-error/30" />
              <div className="w-3 h-3 rounded-full bg-primary/20" />
              <div className="w-3 h-3 rounded-full bg-secondary/20" />
            </div>
            <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-surface-container-highest border border-outline-variant/60">
              <span className="text-[10px] font-mono font-semibold tracking-[0.1em] text-on-surface-variant/70 uppercase">
                {isEnhanced ? "prompt-enhanced.md" : "prompt-output.md"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isGenerating ? (
                <span className="flex items-center gap-1.5 text-[10px] font-mono text-primary animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                  generating
                </span>
              ) : isEnhancing ? (
                <span className="flex items-center gap-1.5 text-[10px] font-mono text-secondary animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
                  enhancing
                </span>
              ) : isEnhanced ? (
                <span className="flex items-center gap-1.5 text-[10px] font-mono text-secondary">
                  <Sparkles className="w-3 h-3" />
                  ai-enhanced
                </span>
              ) : isGenerated ? (
                <span className="flex items-center gap-1.5 text-[10px] font-mono text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                  ready
                </span>
              ) : (
                <span className="text-[10px] font-mono text-on-surface-variant/40">
                  live preview
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className={cn(
            "flex-1 p-5 overflow-auto transition-opacity duration-300",
            (isGenerating || isEnhancing) && "opacity-40"
          )}>
            {prompt ? (
              <div className={cn((isGenerated || isEnhanced) && "animate-fade-in")}>
                <MarkdownVisualizer content={prompt} />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-4 select-none py-16">
                <div className="w-12 h-12 rounded-xl bg-surface-container-high border border-outline-variant flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-on-surface-variant/30" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium text-on-surface-variant/50">No output yet</p>
                  <p className="text-xs text-on-surface-variant/30 max-w-[220px] leading-relaxed">
                    Complete the wizard on the left to generate your structured prompt.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
