"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Target, MessageSquare, Sparkles, Zap, TrendingUp,
  Check, ChevronRight, Code2, Network, Wand2,
  FileText, Loader2, ArrowRight,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"
import type { Translations } from "@/lib/i18n/translations"

type HIT = Translations["howItWorks"]

/* ─── Static visual data ──────────────────────────────────────────── */

const STEP_STYLES = [
  { n: "01", icon: Target,       color: "text-primary",   ring: "border-primary/30 bg-primary/5"   },
  { n: "02", icon: MessageSquare, color: "text-secondary", ring: "border-secondary/30 bg-secondary/5" },
  { n: "03", icon: Sparkles,     color: "text-primary",   ring: "border-primary/30 bg-primary/5"   },
  { n: "04", icon: Zap,          color: "text-secondary", ring: "border-secondary/30 bg-secondary/5" },
  { n: "05", icon: TrendingUp,   color: "text-primary",   ring: "border-primary/30 bg-primary/5"   },
] as const

/* ─── Preview components ──────────────────────────────────────────── */

function PreviewStep01({ th }: { th: HIT }) {
  const categories: { icon: LucideIcon; label: string; active: boolean }[] = [
    { icon: Network,  label: "System Design",  active: false },
    { icon: Code2,    label: "Backend Dev",    active: true  },
    { icon: Wand2,    label: "Prompt Builder", active: false },
    { icon: FileText, label: "Code Review",    active: false },
    { icon: Sparkles, label: "Debugging",      active: false },
    { icon: Target,   label: "Documentation",  active: false },
  ]
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-mono text-on-surface-variant/40 uppercase tracking-wider">
        {th.previewCategoryLabel}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {categories.map(({ icon: Icon, label, active }) => (
          <div
            key={label}
            className={`flex items-center gap-2 p-2.5 rounded-xl border text-[11px] font-medium transition-all duration-150 cursor-pointer ${
              active
                ? "border-primary/30 bg-primary/10 text-primary ring-1 ring-primary/20"
                : "border-outline-variant bg-surface-container-high text-on-surface-variant/60 hover:border-outline"
            }`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={active ? 2 : 1.75} />
            {label}
            {active && <Check className="w-3 h-3 ml-auto text-primary" />}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end pt-1">
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-on-surface-variant/30">
          1 {th.previewSelected}
          <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  )
}

function PreviewStep02({ th }: { th: HIT }) {
  const fields = [
    { label: "Tech Stack",              value: "Node.js, PostgreSQL, Redis",    done: true  },
    { label: "Problem",                 value: "REST API untuk SaaS multi-tenant…", done: true  },
    { label: "Constraints",             value: "10k concurrent users, JWT auth",   done: true  },
    { label: th.previewOutputFormat,    value: "Endpoint list + DB schema…",       done: false },
  ]
  return (
    <div className="space-y-2.5">
      <p className="text-[10px] font-mono text-on-surface-variant/40 uppercase tracking-wider">
        {th.previewDetailLabel}
      </p>
      {fields.map(({ label, value, done }) => (
        <div key={label} className="space-y-1">
          <div className="flex items-center gap-1.5">
            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
              done ? "border-primary/40 bg-primary/10" : "border-outline-variant"
            }`}>
              {done && <Check className="w-2 h-2 text-primary" />}
            </div>
            <span className="text-[9px] font-mono text-on-surface-variant/40 uppercase tracking-wider">{label}</span>
          </div>
          <div className={`ml-5 px-2.5 py-1.5 rounded-lg border text-[10px] font-mono leading-relaxed ${
            done
              ? "border-outline-variant/40 bg-surface-container text-on-surface-variant/70"
              : "border-outline-variant/20 bg-surface-container-lowest text-on-surface-variant/20 animate-pulse-glow"
          }`}>
            {done ? value : th.previewNotFilled}
          </div>
        </div>
      ))}
    </div>
  )
}

function PreviewStep03({ th }: { th: HIT }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
        <p className="text-[10px] font-mono text-primary/70">{th.previewAnalyzing}</p>
      </div>
      <div className="space-y-2">
        {th.previewChecks.map((label, i) => {
          const done = i < 3
          return (
            <div key={label} className="flex items-center gap-2.5">
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                done
                  ? "border-primary/40 bg-primary/10"
                  : "border-outline-variant/40 bg-surface-container-lowest"
              }`}>
                {done
                  ? <Check className="w-2.5 h-2.5 text-primary" />
                  : <div className="w-1.5 h-1.5 rounded-full bg-outline-variant/40 animate-pulse" />
                }
              </div>
              <span className={`text-[10px] font-mono transition-colors duration-300 ${
                done ? "text-on-surface-variant/70" : "text-on-surface-variant/25"
              }`}>
                {label}
              </span>
            </div>
          )
        })}
      </div>
      <div className="mt-2 pt-2 border-t border-outline-variant/30">
        <div className="h-1.5 rounded-full bg-surface-container-high overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
            style={{ width: "75%", transition: "width 1s ease" }}
          />
        </div>
        <p className="text-[9px] font-mono text-on-surface-variant/30 mt-1">75% complete</p>
      </div>
    </div>
  )
}

const PROMPT_TEXT = `You are a senior backend engineer.

Task: Design a production-ready REST API for a multi-tenant SaaS platform.

Stack: Node.js · PostgreSQL · Redis
Scale: 10k concurrent users
Auth:  JWT + refresh tokens

Deliver:
• Endpoint structure & HTTP methods
• Middleware chain (auth, rate-limit, logging)
• DB schema outline with tenant isolation
• Error handling & response format`

function PreviewStep04({ th }: { th: HIT }) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-mono text-on-surface-variant/40 uppercase tracking-wider">
          Generated Prompt
        </p>
        <span className="text-[8px] font-mono text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded">
          {th.readyToCopy}
        </span>
      </div>
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 relative">
        <pre className="text-[9px] font-mono text-on-surface-variant/70 leading-relaxed whitespace-pre-wrap">
          {PROMPT_TEXT}
        </pre>
        <div className="absolute bottom-2 right-2 flex gap-1.5">
          <button className="px-2 py-1 rounded-md bg-surface-container border border-outline-variant text-[8px] font-mono text-on-surface-variant/50 hover:text-on-surface-variant transition-colors">
            Copy
          </button>
          <button className="px-2 py-1 rounded-md bg-primary text-on-primary text-[8px] font-mono hover:bg-primary/90 transition-colors">
            {th.useInAI}
          </button>
        </div>
      </div>
    </div>
  )
}

function PreviewStep05({ th }: { th: HIT }) {
  const results = [
    { label: "API routes",  value: "12 endpoints generated",  color: "text-primary" },
    { label: "DB schema",   value: "4 tables · 2 relations",  color: "text-secondary" },
    { label: "Middleware",  value: "Auth · Rate · Logger",    color: "text-primary" },
    { label: "Time saved",  value: "~4 hours → 20 minutes",   color: "text-secondary" },
  ]
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-mono text-on-surface-variant/40 uppercase tracking-wider">
        {th.previewSummaryLabel}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {results.map(({ label, value, color }) => (
          <div
            key={label}
            className="p-3 rounded-xl border border-outline-variant bg-surface-container space-y-1"
          >
            <p className="text-[8px] font-mono text-on-surface-variant/40 uppercase tracking-wider">{label}</p>
            <p className={`text-[10px] font-mono font-semibold ${color}`}>{value}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-primary/20 bg-primary/5">
        <Check className="w-3.5 h-3.5 text-primary shrink-0" />
        <span className="text-[10px] font-mono text-primary/80">
          {th.previewReadyMsg}
        </span>
      </div>
    </div>
  )
}

/* ─── Main Section ────────────────────────────────────────────────── */

type StepIdx = 0 | 1 | 2 | 3 | 4
const AUTO_INTERVAL = 3500

export function HowItWorksSection() {
  const { t } = useLanguage()
  const th = t.howItWorks

  const STEPS = STEP_STYLES.map((style, i) => ({
    ...style,
    title: th.steps[i].title,
    desc:  th.steps[i].desc,
  }))

  const PREVIEWS = [
    <PreviewStep01 key={0} th={th} />,
    <PreviewStep02 key={1} th={th} />,
    <PreviewStep03 key={2} th={th} />,
    <PreviewStep04 key={3} th={th} />,
    <PreviewStep05 key={4} th={th} />,
  ]

  const [active, setActive] = useState<StepIdx>(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)

  const advance = useCallback(() => {
    setActive((prev) => ((prev + 1) % STEPS.length) as StepIdx)
    setProgress(0)
  }, [STEPS.length])

  useEffect(() => {
    if (paused) return
    const tick = 50
    const steps = AUTO_INTERVAL / tick
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { advance(); return 0 }
        return p + 100 / steps
      })
    }, tick)
    return () => clearInterval(interval)
  }, [paused, active, advance])

  function select(i: StepIdx) {
    setActive(i)
    setProgress(0)
    setPaused(true)
  }

  return (
    <section
      id="how-it-works"
      className="py-24 px-5 lg:px-10 relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(192,193,255,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14 space-y-4">
          <span className="inline-block text-[11px] font-mono uppercase tracking-widest text-on-surface-variant/50 border border-outline-variant px-3 py-1.5 rounded-full">
            {th.sectionBadge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-on-surface tracking-tight">
            {th.sectionTitle1}{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #4edea3, #c0c1ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {th.sectionTitle2}
            </span>
          </h2>
          <p className="text-on-surface-variant max-w-lg mx-auto">
            {th.sectionSubtitle}
          </p>
        </div>

        {/* Interactive stepper */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">

          {/* ── Left: step list ─────────────────────────────────── */}
          <div className="space-y-2">
            {STEPS.map(({ n, icon: Icon, color, ring, title, desc }, i) => {
              const isActive = active === i
              return (
                <button
                  key={n}
                  onClick={() => select(i as StepIdx)}
                  className={`w-full text-left group rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isActive
                      ? "border-primary/25 bg-surface-container shadow-lg shadow-primary/5"
                      : "border-outline-variant bg-surface-container/50 hover:bg-surface-container hover:border-outline"
                  }`}
                >
                  {isActive && !paused && (
                    <div className="h-[2px] bg-surface-container-high">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary transition-none"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}

                  <div className="flex items-start gap-3.5 p-4">
                    <div
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 ${
                        isActive ? ring : "border-outline-variant bg-surface-container-high"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 transition-colors duration-200 ${
                          isActive ? color : "text-on-surface-variant/40"
                        }`}
                        strokeWidth={isActive ? 2 : 1.75}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[9px] font-mono font-bold transition-colors duration-200 ${
                          isActive ? "text-primary/60" : "text-on-surface-variant/25"
                        }`}>
                          STEP {n}
                        </span>
                        {isActive && (
                          <span className="text-[8px] font-mono bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded animate-fade-in">
                            {th.current}
                          </span>
                        )}
                      </div>
                      <p className={`text-[13px] font-semibold leading-snug transition-colors duration-200 ${
                        isActive ? "text-on-surface" : "text-on-surface/60"
                      }`}>
                        {title}
                      </p>
                      {isActive && (
                        <p className="text-[11px] text-on-surface-variant/60 mt-1 leading-relaxed animate-fade-in">
                          {desc}
                        </p>
                      )}
                    </div>

                    <ArrowRight
                      className={`w-4 h-4 shrink-0 mt-2 transition-all duration-200 ${
                        isActive
                          ? "text-primary opacity-100 translate-x-0"
                          : "text-on-surface-variant/20 -translate-x-1 group-hover:translate-x-0 group-hover:opacity-60"
                      }`}
                    />
                  </div>
                </button>
              )
            })}

            <div className="flex items-center justify-center gap-2 pt-2">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => select(i as StepIdx)}
                  className={`rounded-full transition-all duration-200 ${
                    active === i
                      ? "w-5 h-1.5 bg-primary"
                      : "w-1.5 h-1.5 bg-outline-variant hover:bg-outline"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ── Right: animated preview ──────────────────────────── */}
          <div
            className="rounded-2xl border border-outline-variant/60 overflow-hidden"
            style={{
              background: "linear-gradient(180deg, #171f33 0%, #131b2e 100%)",
              boxShadow: "0 24px 48px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(78,222,163,0.06)",
            }}
          >
            {/* Window chrome */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-outline-variant/40 bg-surface-container-lowest">
              <span className="w-2.5 h-2.5 rounded-full bg-error/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-primary/50" />
              <div className="ml-3 flex items-center gap-2">
                <span className="text-[10px] font-mono text-on-surface-variant/30">
                  Step {STEPS[active].n} —
                </span>
                <span className="text-[10px] font-mono text-on-surface-variant/50">
                  {STEPS[active].title}
                </span>
              </div>
            </div>

            <div key={active} className="p-5 min-h-[280px] animate-fade-in">
              {PREVIEWS[active]}
            </div>

            {/* Bottom nav */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-outline-variant/30 bg-surface-container-lowest">
              <button
                onClick={() => select(((active - 1 + STEPS.length) % STEPS.length) as StepIdx)}
                className="text-[10px] font-mono text-on-surface-variant/40 hover:text-on-surface-variant transition-colors disabled:opacity-20"
                disabled={active === 0}
              >
                {th.prev}
              </button>
              <div className="flex items-center gap-1 text-[9px] font-mono text-on-surface-variant/25">
                <span className="text-primary/50">{String(active + 1).padStart(2, "0")}</span>
                <span>/</span>
                <span>{STEPS.length}</span>
              </div>
              <button
                onClick={() => select(((active + 1) % STEPS.length) as StepIdx)}
                className="text-[10px] font-mono text-on-surface-variant/40 hover:text-on-surface-variant transition-colors disabled:opacity-20"
                disabled={active === STEPS.length - 1}
              >
                {th.next}
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
