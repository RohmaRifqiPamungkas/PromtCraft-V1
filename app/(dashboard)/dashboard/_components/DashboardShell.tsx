"use client"

import Link from "next/link"
import {
  Layers, Wand2, Network, FileCode2,
  Sparkles, Clock, ArrowRight, BarChart3,
  GitBranch, Zap, Calendar,
} from "lucide-react"
import { Sidebar } from "@/components/layout/Sidebar"
import { cn } from "@/lib/utils"
import type { PromptHistoryItem } from "@/types/prompt"
import { useLanguage } from "@/lib/i18n/context"

interface DashboardShellProps {
  total: number
  enhanced: number
  today: number
  recent: PromptHistoryItem[]
  firstName: string
  profileEmail: string
  profileFullName: string | null
}

const fmtFull = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
    .format(new Date(iso))

function getRelativeTime(iso: string, justNow: string, minAgo: string, hAgo: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60_000)
  if (m < 1) return justNow
  if (m < 60) return `${m}${minAgo}`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}${hAgo}`
  return fmtFull(iso)
}

const preview = (item: PromptHistoryItem) => {
  const t = item.enhanced_prompt ?? item.original_prompt
  return t.length > 120 ? t.slice(0, 120).trimEnd() + "…" : t
}

function StatCard({ icon: Icon, label, value, variant = "default" }: {
  icon: React.ElementType
  label: string
  value: number
  variant?: "primary" | "secondary" | "default"
}) {
  const v = {
    primary: {
      icon: "bg-primary/10 border-primary/20",
      iconColor: "text-primary",
      value: "text-primary",
    },
    secondary: {
      icon: "bg-secondary/10 border-secondary/20",
      iconColor: "text-secondary",
      value: "text-secondary",
    },
    default: {
      icon: "bg-surface-container-high border-outline-variant",
      iconColor: "text-on-surface-variant",
      value: "text-on-surface",
    },
  }[variant]

  return (
    <div className="relative rounded-2xl border border-outline-variant bg-surface-container p-5 overflow-hidden group hover:border-outline hover:-translate-y-px transition-all duration-200 cursor-default">
      <div className="absolute -right-3 -bottom-3 pointer-events-none select-none opacity-[0.035] group-hover:opacity-[0.065] transition-opacity duration-300">
        <Icon className="w-20 h-20" strokeWidth={1} />
      </div>
      <div className="relative space-y-4">
        <div className={cn("w-9 h-9 rounded-xl border flex items-center justify-center", v.icon)}>
          <Icon className={cn("w-4 h-4", v.iconColor)} strokeWidth={1.75} />
        </div>
        <div>
          <p className={cn("text-4xl font-bold tracking-tight leading-none", v.value)}>{value}</p>
          <p className="text-[11px] font-mono uppercase tracking-wider text-on-surface-variant/50 mt-2">{label}</p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  )
}

const ACTION_META = [
  { icon: Network,   iconClass: "text-secondary",         bgClass: "bg-secondary/10 border-secondary/20",             href: "/system-design"   },
  { icon: Wand2,     iconClass: "text-primary",            bgClass: "bg-primary/10 border-primary/20",                 href: "/prompt-generator" },
  { icon: Layers,    iconClass: "text-on-surface-variant", bgClass: "bg-surface-container-high border-outline-variant", href: "/wizard"          },
  { icon: GitBranch, iconClass: "text-on-surface-variant", bgClass: "bg-surface-container-high border-outline-variant", href: "/business-flow"   },
]

export function DashboardShell({
  total, enhanced, today, recent, firstName, profileEmail, profileFullName,
}: DashboardShellProps) {
  const { t, lang } = useLanguage()
  const d = t.dashboard

  const greeting = (() => {
    const h = new Date().getHours()
    return h < 12 ? d.greetingMorning : h < 17 ? d.greetingAfternoon : d.greetingEvening
  })()

  const dateStr = new Intl.DateTimeFormat(lang === "id" ? "id-ID" : "en-US", {
    weekday: "long", month: "long", day: "numeric",
  }).format(new Date())

  const actions = ACTION_META.map((meta, i) => ({ ...meta, ...d.actions[i] }))

  return (
    <div className="bg-background text-on-surface h-screen flex overflow-hidden">
      <Sidebar user={{ email: profileEmail, fullName: profileFullName }} />

      <main className="md:ml-[280px] flex-1 flex flex-col h-full overflow-hidden">

        <header className="flex md:hidden justify-between items-center px-6 h-16 bg-surface border-b border-outline-variant sticky top-0 z-10">
          <span className="text-xl font-bold text-primary tracking-tight">PromptCraft AI</span>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8 pb-12">

            {/* Welcome header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-on-surface-variant/35 mb-2">
                  <Calendar className="w-3 h-3" />
                  {dateStr}
                </p>
                <h1 className="text-2xl font-bold text-on-surface tracking-tight">
                  {greeting},{" "}
                  <span
                    style={{
                      background: "linear-gradient(135deg, #4edea3, #c0c1ff)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {firstName}
                  </span>
                </h1>
                <p className="text-sm text-on-surface-variant/55 mt-1">
                  {total === 0
                    ? d.emptyDesc
                    : `${total} ${d.promptsCrafted} · ${enhanced} ${d.aiEnhancedSuffix}`}
                </p>
              </div>

              <Link
                href="/prompt-generator"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold hover:bg-primary/90 transition-all duration-150 shadow-md shadow-primary/20 shrink-0 self-start sm:self-auto"
              >
                <Sparkles className="w-4 h-4" />
                {d.newPrompt}
              </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard icon={FileCode2} label={d.totalPrompts}   value={total}    variant="primary"   />
              <StatCard icon={Sparkles}  label={d.aiEnhancedLabel} value={enhanced} variant="secondary" />
              <StatCard icon={Clock}     label={d.todayLabel}       value={today}                       />
            </div>

            {/* Content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

              {/* Recent prompts */}
              <section className="lg:col-span-3 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="text-[13.5px] font-semibold text-on-surface">{d.recentPrompts}</h2>
                    {recent.length > 0 && (
                      <span className="text-[10px] font-mono text-on-surface-variant/40 bg-surface-container-high border border-outline-variant px-1.5 py-0.5 rounded">
                        {recent.length}
                      </span>
                    )}
                  </div>
                  <Link
                    href="/history"
                    className="flex items-center gap-1 text-[11px] text-primary/60 hover:text-primary transition-colors font-mono"
                  >
                    {d.viewAll} <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                {recent.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-outline-variant/50 p-10 flex flex-col items-center gap-4 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-surface-container border border-outline-variant flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-on-surface-variant/25" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-on-surface/50">{d.noPromptsYet}</p>
                      <p className="text-[12px] text-on-surface-variant/35 max-w-[180px] leading-relaxed mx-auto">
                        {d.noPromptsDesc}
                      </p>
                    </div>
                    <Link
                      href="/prompt-generator"
                      className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {d.createFirst}
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {recent.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "group relative rounded-xl border bg-surface-container p-4 hover:bg-surface-container-high transition-all duration-150 overflow-hidden",
                          item.enhanced_prompt
                            ? "border-primary/20 hover:border-primary/35"
                            : "border-outline-variant hover:border-outline"
                        )}
                      >
                        {item.enhanced_prompt && (
                          <div className="absolute left-0 top-4 bottom-4 w-[2px] rounded-r-full bg-gradient-to-b from-primary to-secondary/60" />
                        )}

                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          {item.enhanced_prompt ? (
                            <span className="flex items-center gap-1 text-[9px] font-mono font-semibold uppercase tracking-widest text-primary/80 bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded">
                              <Zap className="w-2.5 h-2.5" />
                              {d.aiEnhancedBadge}
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono text-on-surface-variant/25 uppercase tracking-widest">
                              {d.draftBadge}
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-on-surface-variant/40 shrink-0">
                            {getRelativeTime(item.created_at, d.justNow, d.minAgo, d.hAgo)}
                          </span>
                        </div>

                        <p className="text-[12.5px] text-on-surface-variant/75 leading-relaxed line-clamp-2">
                          {preview(item)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Quick actions + tip */}
              <div className="lg:col-span-2 space-y-5">

                <section className="space-y-3">
                  <h2 className="text-[13.5px] font-semibold text-on-surface">{d.quickActions}</h2>
                  <div className="space-y-2">
                    {actions.map(({ icon: Icon, title, desc, href, iconClass, bgClass }) => (
                      <Link
                        key={title}
                        href={href}
                        className="group flex items-center gap-3 p-3.5 rounded-xl border border-outline-variant bg-surface-container hover:bg-surface-container-high hover:border-outline transition-all duration-150"
                      >
                        <div className={cn("w-9 h-9 rounded-xl border flex items-center justify-center shrink-0", bgClass)}>
                          <Icon className={cn("w-4 h-4", iconClass)} strokeWidth={1.75} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-semibold text-on-surface group-hover:text-primary transition-colors duration-150 leading-tight">
                            {title}
                          </p>
                          <p className="text-[11px] text-on-surface-variant/50 mt-0.5 leading-snug">
                            {desc}
                          </p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-on-surface-variant/20 group-hover:text-primary/60 transition-colors shrink-0" />
                      </Link>
                    ))}
                  </div>
                </section>

                {/* Pro tip */}
                <div className="rounded-xl border border-outline-variant/50 bg-surface-container p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Zap className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant/40">
                      {d.proTip}
                    </span>
                  </div>
                  <p className="text-[12px] text-on-surface-variant/60 leading-relaxed">
                    {d.proTipText}
                  </p>
                  <Link
                    href="/system-design"
                    className="flex items-center gap-1 text-[11px] text-primary/70 hover:text-primary transition-colors"
                  >
                    {d.trySystemDesign} <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
