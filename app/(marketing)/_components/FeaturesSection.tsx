"use client"

import Link from "next/link"
import {
  Network, Wand2, FileText, History,
  Layers, ArrowRight,
  GitBranch, Database, Code2,
  AlertCircle, RefreshCw, TestTube,
  LayoutDashboard, Sparkles, BookOpen,
  Clock, Target, TrendingUp,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { glassCard, gradientText } from "./constants"
import { useLanguage } from "@/lib/i18n/context"

/* Static visual data (not translated) */
const FEATURE_META = [
  {
    icon: Network,
    color: "text-secondary",
    bgColor: "bg-secondary/5 border-secondary/20",
    href: "/system-design",
    highlightIcons: [GitBranch, Database, Code2, Layers] as LucideIcon[],
  },
  {
    icon: Wand2,
    color: "text-primary",
    bgColor: "bg-primary/5 border-primary/20",
    href: "/prompt-generator",
    highlightIcons: [Code2, AlertCircle, RefreshCw, TestTube] as LucideIcon[],
  },
  {
    icon: FileText,
    color: "text-tertiary",
    bgColor: "bg-surface-container-high border-outline-variant",
    href: "/templates",
    highlightIcons: [Layers, LayoutDashboard, Sparkles, BookOpen] as LucideIcon[],
  },
  {
    icon: History,
    color: "text-primary",
    bgColor: "bg-primary/5 border-primary/20",
    href: "/history",
    highlightIcons: [Clock, Target, RefreshCw, TrendingUp] as LucideIcon[],
  },
]

export function FeaturesSection() {
  const { t } = useLanguage()
  const f = t.features

  const features = FEATURE_META.map((meta, i) => ({ ...meta, ...f.items[i] }))

  return (
    <section id="features" className="py-24 px-5 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block text-[11px] font-mono uppercase tracking-widest text-on-surface-variant/50 border border-outline-variant px-3 py-1.5 rounded-full">
            {f.sectionBadge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-on-surface tracking-tight">
            {f.sectionTitle1}{" "}
            <span className={gradientText}>{f.sectionTitle2}</span>
          </h2>
          <p className="text-on-surface-variant max-w-xl mx-auto">
            {f.sectionSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map(({ icon: Icon, color, bgColor, badge, title, desc, highlights, highlightIcons, quote, href }) => (
            <Link
              key={href}
              href={href}
              className={`${glassCard} p-6 space-y-5 hover:bg-surface-container-high transition-all duration-200 group block`}
            >
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-xl border ${bgColor} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${color}`} strokeWidth={1.75} />
                </div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-on-surface-variant/40 border border-outline-variant px-2 py-1 rounded group-hover:border-outline transition-colors">
                  {badge}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-[15px] font-bold text-on-surface group-hover:text-primary transition-colors duration-150">
                  {title}
                </h3>
                <p className="text-[12.5px] text-on-surface-variant leading-relaxed">{desc}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {highlights.map((text, idx) => {
                  const HIcon = highlightIcons[idx]
                  return (
                    <div key={text} className="flex items-center gap-2 text-[11px] text-on-surface-variant/60">
                      <HIcon className="w-3.5 h-3.5 shrink-0 text-on-surface-variant/40" strokeWidth={1.5} />
                      {text}
                    </div>
                  )
                })}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-outline-variant/40">
                <p className="text-[11px] font-medium text-on-surface-variant/50 italic">
                  &ldquo;{quote}&rdquo;
                </p>
                <ArrowRight className="w-4 h-4 text-on-surface-variant/20 group-hover:text-primary/60 transition-colors shrink-0 ml-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
