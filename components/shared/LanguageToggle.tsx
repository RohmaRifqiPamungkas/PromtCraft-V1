"use client"

import { useLanguage } from "@/lib/i18n/context"
import type { Locale } from "@/lib/i18n/translations"
import { cn } from "@/lib/utils"

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage()
  return (
    <div
      className={cn(
        "flex items-center gap-0.5 rounded-lg border border-outline-variant bg-surface-container p-0.5",
        className
      )}
    >
      {(["en", "id"] as Locale[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={cn(
            "px-2 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-150",
            lang === l
              ? "bg-primary text-on-primary shadow-sm"
              : "text-on-surface-variant hover:text-on-surface"
          )}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
