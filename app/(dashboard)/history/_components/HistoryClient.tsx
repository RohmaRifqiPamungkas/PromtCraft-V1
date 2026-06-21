"use client"

import { useState, useCallback, useEffect } from "react"
import {
  History, RefreshCw, Copy, Download, Trash2,
  Check, Loader2, Clock, Sparkles, ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { PromptHistoryItem } from "@/types/prompt"

/* ── helpers ─────────────────────────────────────────────────────────── */

function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(iso))
}

function dateGroup(iso: string): string {
  const d        = new Date(iso)
  const today    = new Date(); today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1)
  const lastWeek  = new Date(today); lastWeek.setDate(lastWeek.getDate() - 7)

  if (d >= today)    return "Today"
  if (d >= yesterday) return "Yesterday"
  if (d >= lastWeek)  return "This Week"
  return "Older"
}

function groupItems(items: PromptHistoryItem[]): { label: string; items: PromptHistoryItem[] }[] {
  const order = ["Today", "Yesterday", "This Week", "Older"]
  const map: Record<string, PromptHistoryItem[]> = {
    "Today": [], "Yesterday": [], "This Week": [], "Older": [],
  }
  for (const item of items) {
    map[dateGroup(item.created_at)].push(item)
  }
  return order
    .filter((g) => map[g].length > 0)
    .map((g) => ({ label: g, items: map[g] }))
}

function previewText(item: PromptHistoryItem, maxLen = 300): string {
  const text = item.enhanced_prompt ?? item.original_prompt
  return text.length > maxLen ? text.slice(0, maxLen).trimEnd() + "…" : text
}

/* ── history card ────────────────────────────────────────────────────── */

interface CardProps {
  item: PromptHistoryItem
  isDeleting: boolean
  isCopied: boolean
  onCopy: (item: PromptHistoryItem) => void
  onDownload: (item: PromptHistoryItem) => void
  onDelete: (id: string) => void
}

function HistoryCard({ item, isDeleting, isCopied, onCopy, onDownload, onDelete }: CardProps) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container p-4 space-y-3 hover:border-outline hover:bg-surface-container-high transition-all duration-150">

      {/* Card header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          {item.enhanced_prompt ? (
            <span className="flex items-center gap-1 text-[9px] font-mono font-semibold tracking-widest uppercase text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded">
              <Sparkles className="w-2.5 h-2.5" />
              AI Enhanced
            </span>
          ) : (
            <span className="text-[9px] font-mono font-semibold tracking-widest uppercase text-on-surface-variant/40 bg-surface-container-high border border-outline-variant/50 px-1.5 py-0.5 rounded">
              Compiled
            </span>
          )}
        </div>
        <span className="text-[10px] font-mono text-on-surface-variant/50 shrink-0">
          {formatTime(item.created_at)}
        </span>
      </div>

      {/* Preview */}
      <p className="text-[12px] font-mono text-on-surface-variant leading-relaxed line-clamp-5">
        {previewText(item)}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-1.5 pt-2.5 border-t border-outline-variant/40">
        <Button
          variant={isCopied ? "surface" : "outline"}
          size="sm"
          onClick={() => onCopy(item)}
          className={cn(
            "h-7 px-2.5 text-[11px] gap-1.5 transition-all",
            isCopied && "border-primary/40 text-primary"
          )}
        >
          {isCopied
            ? <><Check className="w-3 h-3" />Copied!</>
            : <><Copy className="w-3 h-3" />Copy</>
          }
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onDownload(item)}
          className="h-7 px-2.5 text-[11px] gap-1.5"
        >
          <Download className="w-3 h-3" />
          Save .md
        </Button>

        <div className="flex-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(item.id)}
          disabled={isDeleting}
          className="h-7 w-7 p-0 text-on-surface-variant/40 hover:text-error hover:bg-error-container/20"
          aria-label="Delete"
        >
          {isDeleting
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <Trash2 className="w-3.5 h-3.5" />
          }
        </Button>
      </div>
    </div>
  )
}

/* ── main client ─────────────────────────────────────────────────────── */

export function HistoryClient() {
  const [items,      setItems]      = useState<PromptHistoryItem[]>([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [copiedId,   setCopiedId]   = useState<string | null>(null)

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res  = await fetch("/api/history?limit=50")
      const json = (await res.json()) as { success: boolean; data?: PromptHistoryItem[]; error?: string }
      if (json.success) {
        setItems(json.data ?? [])
      } else {
        setError(json.error ?? "Failed to load history")
      }
    } catch {
      setError("Network error — could not load history")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchHistory() }, [fetchHistory])

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const res  = await fetch("/api/history", {
        method:  "DELETE",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ id }),
      })
      const json = (await res.json()) as { success: boolean }
      if (json.success) setItems((prev) => prev.filter((i) => i.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  async function handleCopy(item: PromptHistoryItem) {
    const text = item.enhanced_prompt ?? item.original_prompt
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(item.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {/* silent */ }
  }

  function handleDownload(item: PromptHistoryItem) {
    const text     = item.enhanced_prompt ?? item.original_prompt
    const filename = item.enhanced_prompt ? "prompt-enhanced.md" : "prompt.md"
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement("a")
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  const groups = groupItems(items)

  return (
    <div className="bg-background text-on-surface h-screen flex overflow-hidden">
      <Sidebar />

      <main className="md:ml-[280px] flex-1 flex flex-col h-full bg-surface-dim overflow-hidden">

        {/* Mobile header */}
        <header className="flex md:hidden justify-between items-center px-6 h-16 bg-surface border-b border-outline-variant sticky top-0 z-10 shrink-0">
          <span className="text-xl font-bold text-primary tracking-tight">PromptCraft AI</span>
        </header>

          <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">

            {/* Page header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-on-surface tracking-tight flex items-center gap-2.5">
                  <History className="w-6 h-6 text-primary/70" strokeWidth={1.75} />
                  Prompt History
                </h1>
                <p className="text-sm text-on-surface-variant mt-1">
                  All prompts saved when you used Enhance. Copy, download, or delete entries below.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {items.length > 0 && (
                  <span className="text-[11px] font-mono text-on-surface-variant/60 bg-surface-container border border-outline-variant px-2 py-1 rounded-lg">
                    {items.length} saved
                  </span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchHistory}
                  disabled={loading}
                  className="h-8 px-3 gap-1.5 text-xs"
                >
                  <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center py-20 gap-2.5 text-on-surface-variant/50">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading history…</span>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="rounded-xl border border-error/30 bg-error-container/10 px-5 py-4">
                <p className="text-sm text-on-error-container">{error}</p>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && items.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 gap-5 select-none">
                <div className="w-14 h-14 rounded-2xl bg-surface-container border border-outline-variant flex items-center justify-center">
                  <Clock className="w-6 h-6 text-on-surface-variant/30" />
                </div>
                <div className="text-center space-y-1.5">
                  <p className="text-sm font-medium text-on-surface-variant/60">No history yet</p>
                  <p className="text-xs text-on-surface-variant/40 max-w-[240px] leading-relaxed">
                    Prompts are saved here when you click Enhance. Try generating and enhancing a prompt first.
                  </p>
                </div>
                <Link
                  href="/prompt-generator"
                  className="flex items-center gap-1.5 text-xs text-primary/70 hover:text-primary transition-colors font-medium"
                >
                  Go to Prompt Builder
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Grouped history */}
            {!loading && !error && groups.length > 0 && (
              <div className="space-y-7">
                {groups.map((group) => (
                  <div key={group.label} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-on-surface-variant/50">
                        {group.label}
                      </span>
                      <div className="flex-1 h-px bg-outline-variant/50" />
                      <span className="text-[10px] font-mono text-on-surface-variant/30">
                        {group.items.length}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {group.items.map((item) => (
                        <HistoryCard
                          key={item.id}
                          item={item}
                          isDeleting={deletingId === item.id}
                          isCopied={copiedId === item.id}
                          onCopy={handleCopy}
                          onDownload={handleDownload}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

      </main>
    </div>
  )
}
