"use client"

import { useEffect, useState, useCallback } from "react"
import { Clock, RotateCcw, Trash2, RefreshCw, Loader2, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { PromptHistoryItem } from "@/types/prompt"

interface PromptHistoryProps {
  onRestore: (prompt: string) => void
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso))
}

function previewText(item: PromptHistoryItem): string {
  const text = item.enhanced_prompt ?? item.original_prompt
  return text.length > 140 ? text.slice(0, 140).trimEnd() + "…" : text
}

export function PromptHistory({ onRestore }: PromptHistoryProps) {
  const [items, setItems] = useState<PromptHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/history")
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

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch("/api/history", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const json = (await res.json()) as { success: boolean }
      if (json.success) {
        setItems((prev) => prev.filter((item) => item.id !== id))
      }
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return (
    <div className="flex-1 overflow-y-auto p-5 lg:p-7">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-primary/70" />
          <h3 className="text-[13px] font-semibold text-on-surface">Prompt History</h3>
          {items.length > 0 && (
            <span className="text-[10px] font-mono text-on-surface-variant/50 bg-surface-container px-1.5 py-0.5 rounded-md border border-outline-variant">
              {items.length}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchHistory}
          disabled={loading}
          className="h-7 w-7 p-0"
          aria-label="Refresh history"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 gap-2 text-on-surface-variant/50">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading history…</span>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg border border-error/30 bg-error-container/10 px-4 py-3">
          <p className="text-sm text-on-error-container">{error}</p>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 select-none">
          <div className="w-10 h-10 rounded-xl bg-surface-container border border-outline-variant flex items-center justify-center">
            <Clock className="w-4 h-4 text-on-surface-variant/30" />
          </div>
          <p className="text-sm text-on-surface-variant/50 text-center max-w-[200px] leading-relaxed">
            No history yet. Enhance a prompt to save it here.
          </p>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="space-y-2.5">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-outline-variant bg-surface-container p-4 space-y-2.5 hover:border-outline hover:bg-surface-container-high transition-all duration-150"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {item.enhanced_prompt && (
                    <span className="text-[9px] font-mono font-semibold tracking-widest uppercase text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded">
                      AI Enhanced
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-on-surface-variant/50 shrink-0">
                  {formatDate(item.created_at)}
                </span>
              </div>

              <p className="text-[12px] text-on-surface-variant leading-relaxed font-mono line-clamp-3">
                {previewText(item)}
              </p>

              <div className="flex items-center gap-1.5 pt-0.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRestore(item.enhanced_prompt ?? item.original_prompt)}
                  className="h-7 px-2.5 text-[11px] gap-1.5"
                >
                  <RotateCcw className="w-3 h-3" />
                  Restore
                </Button>
                <div className="flex-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className="h-7 w-7 p-0 text-on-surface-variant/50 hover:text-error hover:bg-error-container/20"
                  aria-label="Delete history item"
                >
                  {deletingId === item.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
