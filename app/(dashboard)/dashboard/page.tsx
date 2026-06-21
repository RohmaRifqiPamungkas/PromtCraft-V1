import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  Layers, Wand2, Network, FileCode2,
  Sparkles, Clock, ArrowRight, BarChart3,
  GitBranch, Zap, Calendar,
} from "lucide-react"
import { Sidebar } from "@/components/layout/Sidebar"
import { getSupabaseAuthClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"
import type { PromptHistoryItem } from "@/types/prompt"

export const metadata: Metadata = { title: "Dashboard | PromptCraft AI" }

/* ── data ─────────────────────────────────────────────────────────── */

async function fetchData(userId: string) {
  try {
    const db = await getSupabaseAuthClient()
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const [totRes, enhRes, todRes, recRes] = await Promise.all([
      db.from("prompt_history").select("id", { count: "exact", head: true }).eq("user_id", userId),
      db.from("prompt_history").select("id", { count: "exact", head: true }).eq("user_id", userId).not("enhanced_prompt", "is", null),
      db.from("prompt_history").select("id", { count: "exact", head: true }).eq("user_id", userId).gte("created_at", today.toISOString()),
      db.from("prompt_history").select("id,original_prompt,enhanced_prompt,created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(5),
    ])
    return {
      total: totRes.count ?? 0,
      enhanced: enhRes.count ?? 0,
      today: todRes.count ?? 0,
      recent: (recRes.data ?? []) as PromptHistoryItem[],
    }
  } catch {
    return { total: 0, enhanced: 0, today: 0, recent: [] as PromptHistoryItem[] }
  }
}

/* ── helpers ──────────────────────────────────────────────────────── */

const fmtFull = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
    .format(new Date(iso))

const relativeTime = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60_000)
  if (m < 1) return "just now"
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return fmtFull(iso)
}

const preview = (item: PromptHistoryItem) => {
  const t = item.enhanced_prompt ?? item.original_prompt
  return t.length > 120 ? t.slice(0, 120).trimEnd() + "…" : t
}

const getGreeting = () => {
  const h = new Date().getHours()
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"
}

const getDateStr = () =>
  new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" })
    .format(new Date())

/* ── StatCard ─────────────────────────────────────────────────────── */

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
      {/* Watermark icon */}
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

      {/* Bottom glow line on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  )
}

/* ── page ─────────────────────────────────────────────────────────── */

export default async function DashboardPage() {
  const supabase = await getSupabaseAuthClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const [{ total, enhanced, today, recent }, profileRes] = await Promise.all([
    fetchData(user.id),
    supabase.from("profiles").select("full_name, email").eq("id", user.id).single(),
  ])

  const profile = profileRes.data
  const firstName = profile?.full_name?.split(" ")[0]
    ?? profile?.email?.split("@")[0]
    ?? user.email?.split("@")[0]
    ?? "there"

  const actions = [
    {
      icon: Network,
      title: "System Design",
      desc: "Rancang arsitektur & database schema",
      href: "/system-design",
      iconClass: "text-secondary",
      bgClass: "bg-secondary/10 border-secondary/20",
    },
    {
      icon: Wand2,
      title: "Prompt Builder",
      desc: "Generate structured AI prompts",
      href: "/prompt-generator",
      iconClass: "text-primary",
      bgClass: "bg-primary/10 border-primary/20",
    },
    {
      icon: Layers,
      title: "DB & API Wizard",
      desc: "Backend architecture prompts",
      href: "/wizard",
      iconClass: "text-on-surface-variant",
      bgClass: "bg-surface-container-high border-outline-variant",
    },
    {
      icon: GitBranch,
      title: "Business Flow",
      desc: "Visualisasi alur bisnis & proses",
      href: "/business-flow",
      iconClass: "text-on-surface-variant",
      bgClass: "bg-surface-container-high border-outline-variant",
    },
  ]

  return (
    <div className="bg-background text-on-surface h-screen flex overflow-hidden">
      <Sidebar user={{ email: profile?.email ?? user.email ?? "", fullName: profile?.full_name }} />

      <main className="md:ml-[280px] flex-1 flex flex-col h-full overflow-hidden">

        {/* Mobile header */}
        <header className="flex md:hidden justify-between items-center px-6 h-16 bg-surface border-b border-outline-variant sticky top-0 z-10">
          <span className="text-xl font-bold text-primary tracking-tight">PromptCraft AI</span>
        </header>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8 pb-12">

            {/* ── Welcome header ──────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-on-surface-variant/35 mb-2">
                  <Calendar className="w-3 h-3" />
                  {getDateStr()}
                </p>
                <h1 className="text-2xl font-bold text-on-surface tracking-tight">
                  {getGreeting()},{" "}
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
                    ? "Create your first prompt to get started."
                    : `${total} prompt${total !== 1 ? "s" : ""} crafted · ${enhanced} AI-enhanced`}
                </p>
              </div>

              <Link
                href="/prompt-generator"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold hover:bg-primary/90 transition-all duration-150 shadow-md shadow-primary/20 shrink-0 self-start sm:self-auto"
              >
                <Sparkles className="w-4 h-4" />
                New Prompt
              </Link>
            </div>

            {/* ── Stats row ───────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard icon={FileCode2} label="Total Prompts" value={total} variant="primary" />
              <StatCard icon={Sparkles} label="AI Enhanced" value={enhanced} variant="secondary" />
              <StatCard icon={Clock} label="Today" value={today} />
            </div>

            {/* ── Content grid ────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

              {/* Left — recent prompts (3 col) */}
              <section className="lg:col-span-3 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="text-[13.5px] font-semibold text-on-surface">Recent Prompts</h2>
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
                    View all <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                {recent.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-outline-variant/50 p-10 flex flex-col items-center gap-4 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-surface-container border border-outline-variant flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-on-surface-variant/25" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-on-surface/50">No prompts yet</p>
                      <p className="text-[12px] text-on-surface-variant/35 max-w-[180px] leading-relaxed mx-auto">
                        Create your first prompt to start tracking your activity
                      </p>
                    </div>
                    <Link
                      href="/prompt-generator"
                      className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Create first prompt
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
                        {/* Left accent bar for AI-enhanced */}
                        {item.enhanced_prompt && (
                          <div className="absolute left-0 top-4 bottom-4 w-[2px] rounded-r-full bg-gradient-to-b from-primary to-secondary/60" />
                        )}

                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          {item.enhanced_prompt ? (
                            <span className="flex items-center gap-1 text-[9px] font-mono font-semibold uppercase tracking-widest text-primary/80 bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded">
                              <Zap className="w-2.5 h-2.5" />
                              AI Enhanced
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono text-on-surface-variant/25 uppercase tracking-widest">
                              Draft
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-on-surface-variant/40 shrink-0">
                            {relativeTime(item.created_at)}
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

              {/* Right — quick actions + tip (2 col) */}
              <div className="lg:col-span-2 space-y-5">

                {/* Quick actions */}
                <section className="space-y-3">
                  <h2 className="text-[13.5px] font-semibold text-on-surface">Quick Actions</h2>
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
                      Pro Tip
                    </span>
                  </div>
                  <p className="text-[12px] text-on-surface-variant/60 leading-relaxed">
                    Mulai dengan{" "}
                    <strong className="font-medium text-on-surface-variant/80">System Design</strong>{" "}
                    sebelum membuat prompt — arsitektur yang jelas menghasilkan output AI yang jauh lebih akurat.
                  </p>
                  <Link
                    href="/system-design"
                    className="flex items-center gap-1 text-[11px] text-primary/70 hover:text-primary transition-colors"
                  >
                    Try System Design <ArrowRight className="w-3 h-3" />
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
