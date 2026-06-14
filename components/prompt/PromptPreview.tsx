"use client"

import { useState } from "react"
import {
  Copy, Download, Check, Sparkles, Loader2, History, ArrowLeft,
} from "lucide-react"
import { Button }           from "@/components/ui/button"
import { MarkdownVisualizer } from "./MarkdownVisualizer"
import { PromptHistory }    from "./PromptHistory"
import { cn } from "@/lib/utils"

interface PromptPreviewProps {
  prompt:       string
  isGenerated:  boolean
  isGenerating: boolean
  isEnhanced:   boolean
  isEnhancing:  boolean
  onCopy:       () => void
  onDownload:   () => void
  onEnhance:    () => void
  onRestoreHistory: (prompt: string) => void
}

function lineCount(s: string) {
  return s ? s.split("\n").length : 0
}

export function PromptPreview({
  prompt, isGenerated, isGenerating,
  isEnhanced, isEnhancing,
  onCopy, onDownload, onEnhance, onRestoreHistory,
}: PromptPreviewProps) {
  const [copied,      setCopied]      = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  function handleCopy() {
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleRestoreHistory(p: string) {
    onRestoreHistory(p)
    setShowHistory(false)
  }

  const lines = lineCount(prompt)

  return (
    <section className="flex-1 bg-surface-container-lowest flex flex-col overflow-hidden">

      {/* ── sticky toolbar ─────────────────────────────────────────── */}
      <div className="shrink-0 bg-surface-container-lowest/95 backdrop-blur-sm border-b border-outline-variant px-5 py-3 flex justify-between items-center gap-4">
        <div className="flex flex-col min-w-0">
          <h3 className="text-[15px] font-semibold text-on-surface leading-tight truncate">
            {showHistory ? "Prompt History" : "Generated Prompt Preview"}
          </h3>
          {!showHistory && lines > 0 && (
            <p className="text-[10px] font-mono text-on-surface-variant/50 mt-0.5">
              {lines} lines · {isEnhanced ? "ai-enhanced" : "markdown"}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {!showHistory && (
            <>
              {/* Copy */}
              <Button
                variant={copied ? "surface" : "outline"}
                size="sm"
                onClick={handleCopy}
                className={cn(
                  "gap-1.5 text-xs h-8 px-3 transition-all",
                  copied && "border-primary/40 text-primary"
                )}
              >
                {copied
                  ? <><Check className="w-3.5 h-3.5" /><span className="hidden sm:inline">Copied!</span></>
                  : <><Copy className="w-3.5 h-3.5" /><span className="hidden sm:inline">Copy</span></>
                }
              </Button>

              {/* Download */}
              <Button
                variant="outline"
                size="sm"
                onClick={onDownload}
                className="gap-1.5 text-xs h-8 px-3"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Save .md</span>
              </Button>

              <div className="w-px h-5 bg-outline-variant mx-0.5" />

              {/* Enhance with Gemini */}
              <Button
                variant={isEnhanced ? "secondary" : "default"}
                size="sm"
                onClick={onEnhance}
                disabled={isEnhancing || !prompt.trim()}
                className="gap-1.5 text-xs h-8 px-3"
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
            </>
          )}

          {/* History toggle */}
          <Button
            variant={showHistory ? "surface" : "ghost"}
            size="sm"
            onClick={() => setShowHistory((v) => !v)}
            className={cn(
              "gap-1.5 text-xs h-8 px-3",
              showHistory && "border-primary/20 text-primary"
            )}
          >
            {showHistory
              ? <><ArrowLeft className="w-3.5 h-3.5" /><span className="hidden sm:inline">Back</span></>
              : <><History className="w-3.5 h-3.5" /><span className="hidden sm:inline">History</span></>
            }
          </Button>
        </div>
      </div>

      {/* ── body ───────────────────────────────────────────────────── */}
      {showHistory ? (
        <PromptHistory onRestore={handleRestoreHistory} />
      ) : (
        <div className="flex-1 overflow-y-auto p-5 lg:p-7">
          <div
            className={cn(
              "rounded-xl border border-outline-variant bg-surface-container flex flex-col min-h-[calc(100%-0px)] h-full shadow-lg shadow-black/20 transition-all duration-500",
              isGenerated && !isEnhanced && "border-primary/20 shadow-primary/5",
              isEnhanced && "border-secondary/30 shadow-secondary/5"
            )}
          >
            {/* Editor chrome */}
            <div className="shrink-0 bg-surface-container-high px-4 py-2.5 border-b border-outline-variant rounded-t-xl flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-error/30" />
                <div className="w-3 h-3 rounded-full bg-primary/20" />
                <div className="w-3 h-3 rounded-full bg-secondary/20" />
              </div>

              <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-surface-container-highest border border-outline-variant/60">
                <span className="text-[10px] font-mono font-semibold tracking-[0.1em] text-on-surface-variant/70 uppercase">
                  {isEnhanced ? "promptcraft-enhanced.md" : "promptcraft-output.md"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isGenerating ? (
                  <span className="flex items-center gap-1.5 text-[10px] font-mono text-primary animate-pulse-glow">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                    generating
                  </span>
                ) : isEnhancing ? (
                  <span className="flex items-center gap-1.5 text-[10px] font-mono text-secondary animate-pulse-glow">
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
            <div
              className={cn(
                "flex-1 p-5 overflow-auto transition-opacity duration-300",
                (isGenerating || isEnhancing) && "opacity-40"
              )}
            >
              {prompt ? (
                <div className={cn((isGenerated || isEnhanced) && "animate-fade-in")}>
                  <MarkdownVisualizer content={prompt} />
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-4 select-none">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high border border-outline-variant flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-on-surface-variant/30" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-medium text-on-surface-variant/50">
                      No output yet
                    </p>
                    <p className="text-xs text-on-surface-variant/30 max-w-[220px] leading-relaxed">
                      Complete the wizard on the left to see your compiled prompt here.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
