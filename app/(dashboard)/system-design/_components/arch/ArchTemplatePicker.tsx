import { DatabaseZap } from "lucide-react"
import { ARCH_TEMPLATES, type ArchTemplate } from "./archData"

export function ArchTemplatePicker({ onPick }: { onPick: (t: ArchTemplate) => void }) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-mono uppercase tracking-wider text-on-surface-variant/60">
        Quick start — pick a template
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {ARCH_TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => onPick(t)}
            className="group text-left rounded-lg border border-outline-variant bg-surface-container px-3.5 py-3 hover:bg-surface-container-high hover:border-outline transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <p className="text-[12px] font-semibold text-on-surface group-hover:text-primary transition-colors flex items-center gap-1.5">
              <DatabaseZap className="w-3 h-3 shrink-0" />
              {t.name}
            </p>
            <p className="text-[10px] font-mono text-on-surface-variant/50 mt-0.5 line-clamp-2">
              {t.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
