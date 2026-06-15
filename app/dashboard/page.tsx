import type { Metadata } from "next"
import Link from "next/link"
import {
  Layers, Terminal, FileText, FileCode2,
  Sparkles, Clock, ArrowRight, BarChart3,
} from "lucide-react"
import { Sidebar } from "@/components/layout/Sidebar"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"
import type { PromptHistoryItem } from "@/types/prompt"

export const metadata: Metadata = { title: "Dashboard | PromptCraft AI" }

/* ── data ────────────────────────────────────────────────────────── */

async function fetchData() {
  try {
    const db = getSupabaseServerClient()
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const [totRes, enhRes, todRes, recRes] = await Promise.all([
      db.from("prompt_history").select("id", { count: "exact", head: true }),
      db.from("prompt_history").select("id", { count: "exact", head: true }).not("enhanced_prompt", "is", null),
      db.from("prompt_history").select("id", { count: "exact", head: true }).gte("created_at", today.toISOString()),
      db.from("prompt_history").select("id,original_prompt,enhanced_prompt,created_at").order("created_at", { ascending: false }).limit(5),
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

/* ── helpers ─────────────────────────────────────────────────────── */

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
    .format(new Date(iso))

const preview = (item: PromptHistoryItem) => {
  const t = item.enhanced_prompt ?? item.original_prompt
  return t.length > 110 ? t.slice(0, 110).trimEnd() + "…" : t
}

/* ── sub-components ──────────────────────────────────────────────── */

function StatCard({ icon: Icon, label, value, accent = false }: {
  icon: React.ElementType; label: string; value: number; accent?: boolean
}) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container p-4 flex items-center gap-4">
      <div className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
        accent
          ? "bg-primary/10 border border-primary/20"
          : "bg-surface-container-high border border-outline-variant"
      )}>
        <Icon className={cn("w-[18px] h-[18px]", accent ? "text-primary" : "text-on-surface-variant")} strokeWidth={1.75} />
      </div>
      <div>
        <p className={cn("text-2xl font-bold leading-none", accent ? "text-primary" : "text-on-surface")}>{value}</p>
        <p className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant/60 mt-1">{label}</p>
      </div>
    </div>
  )
}

function ActionCard({ icon: Icon, title, desc, href, soon = false }: {
  icon: React.ElementType; title: string; desc: string; href: string; soon?: boolean
}) {
  return (
    <Link
      href={soon ? "#" : href}
      className={cn(
        "flex items-center gap-3 p-4 rounded-xl border border-outline-variant bg-surface-container transition-all duration-150",
        soon ? "opacity-40 pointer-events-none" : "hover:bg-surface-container-high hover:border-outline group"
      )}
    >
      <div className="w-8 h-8 rounded-lg bg-surface-container-high border border-outline-variant flex items-center justify-center shrink-0">
        <Icon className="w-[16px] h-[16px] text-on-surface-variant" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-on-surface flex items-center gap-1.5">
          {title}
          {soon && (
            <span className="text-[9px] font-mono uppercase tracking-widest text-on-surface-variant/40 bg-surface-container-high border border-outline-variant px-1.5 py-0.5 rounded">
              soon
            </span>
          )}
        </p>
        <p className="text-xs text-on-surface-variant/70 mt-0.5">{desc}</p>
      </div>
      {!soon && <ArrowRight className="w-4 h-4 text-on-surface-variant/30 group-hover:text-primary/60 transition-colors shrink-0" />}
    </Link>
  )
}

/* ── page ─────────────────────────────────────────────────────────── */

export default async function DashboardPage() {
  const { total, enhanced, today, recent } = await fetchData()

  return (
    <div className="bg-background text-on-surface h-screen flex overflow-hidden">
      <Sidebar />

      <main className="md:ml-[280px] flex-1 flex flex-col h-full bg-surface-dim overflow-hidden">

        {/* Mobile header */}
        <header className="flex md:hidden justify-between items-center px-6 h-16 bg-surface border-b border-outline-variant sticky top-0 z-10">
          <span className="text-xl font-bold text-primary tracking-tight">PromptCraft AI</span>
        </header>

        <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">

          {/* Page header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-on-surface tracking-tight">Dashboard</h1>
              <p className="text-sm text-on-surface-variant mt-0.5">Overview of your prompt crafting activity</p>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container text-on-primary-container text-sm font-medium hover:bg-primary hover:text-on-primary transition-all duration-150"
            >
              <Sparkles className="w-3.5 h-3.5" />
              New Prompt
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard icon={FileCode2} label="Total Prompts" value={total} accent />
            <StatCard icon={Sparkles} label="AI Enhanced" value={enhanced} />
            <StatCard icon={Clock} label="Today" value={today} />
          </div>

          {/* Content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

            {/* Recent prompts */}
            <div className="lg:col-span-3 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-on-surface">Recent Prompts</h2>
                <Link href="/" className="text-xs text-primary/70 hover:text-primary transition-colors">
                  View all →
                </Link>
              </div>

              {recent.length === 0 ? (
                <div className="rounded-xl border border-outline-variant bg-surface-container p-10 flex flex-col items-center gap-3 text-center">
                  <div className="w-9 h-9 rounded-xl bg-surface-container-high border border-outline-variant flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-on-surface-variant/30" />
                  </div>
                  <p className="text-sm text-on-surface-variant/50 leading-relaxed">
                    No prompts yet.<br />Generate your first one.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {recent.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-outline-variant bg-surface-container p-4 space-y-2 hover:bg-surface-container-high hover:border-outline transition-all duration-150"
                    >
                      <div className="flex items-center justify-between gap-2">
                        {item.enhanced_prompt ? (
                          <span className="text-[9px] font-mono font-semibold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded">
                            AI Enhanced
                          </span>
                        ) : (
                          <span />
                        )}
                        <span className="text-[10px] font-mono text-on-surface-variant/50 shrink-0">
                          {fmt(item.created_at)}
                        </span>
                      </div>
                      <p className="text-[12px] font-mono text-on-surface-variant leading-relaxed line-clamp-2">
                        {preview(item)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div className="lg:col-span-2 space-y-3">
              <h2 className="text-sm font-semibold text-on-surface">Quick Actions</h2>
              <div className="space-y-2.5">
                <ActionCard icon={Layers} title="DB & API Wizard" desc="Generate backend architecture prompts" href="/" />
                <ActionCard icon={Terminal} title="Code Generator" desc="Generate boilerplate code snippets" href="#" soon />
                <ActionCard icon={FileText} title="Templates" desc="Browse ready-made prompt templates" href="#" soon />
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
