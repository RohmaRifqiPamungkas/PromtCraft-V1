"use client"

import { AlertCircle, MessageSquare, Code2, Puzzle, Repeat } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { glassCard } from "./constants"
import { useLanguage } from "@/lib/i18n/context"

const PROBLEM_ICONS: LucideIcon[] = [AlertCircle, MessageSquare, Code2, Puzzle, Repeat]

export function ProblemSection() {
  const { t } = useLanguage()
  const p = t.problem

  const problems = p.items.map((item, i) => ({ ...item, icon: PROBLEM_ICONS[i] }))

  return (
    <section className="py-24 px-5 lg:px-10 relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 20% 60%, rgba(192,193,255,0.05) 0%, transparent 60%)",
        }}
      />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14 space-y-4">
          <span className="inline-block text-[11px] font-mono uppercase tracking-widest text-on-surface-variant/50 border border-outline-variant px-3 py-1.5 rounded-full">
            {p.sectionBadge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-on-surface tracking-tight">
            {p.title1}{" "}
            <span className="text-error/80">{p.titleHighlight}</span>
            {p.title2 ? ` ${p.title2}` : ""}
          </h2>
          <p className="text-on-surface-variant max-w-xl mx-auto">
            {p.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {problems.map(({ icon: Icon, title, desc, impact }, i) => (
            <div
              key={title}
              className={`${glassCard} p-5 space-y-3 hover:bg-surface-container-high transition-colors duration-150 group ${i === 4 ? "sm:col-span-2 lg:col-span-1" : ""}`}
            >
              <div className="w-9 h-9 rounded-xl bg-error/5 border border-error/15 flex items-center justify-center">
                <Icon className="w-4 h-4 text-error/70" strokeWidth={1.75} />
              </div>
              <div className="space-y-1">
                <h3 className="text-[13.5px] font-semibold text-on-surface">{title}</h3>
                <p className="text-[12px] text-on-surface-variant/70 leading-relaxed">{desc}</p>
              </div>
              <div className="flex items-center gap-1.5 pt-1 border-t border-outline-variant/40">
                <span className="w-1.5 h-1.5 rounded-full bg-error/60 shrink-0" />
                <span className="text-[11px] font-mono text-error/60">{impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
