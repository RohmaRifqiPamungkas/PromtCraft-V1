"use client"

import Link from "next/link"
import { Check, Sparkles, ArrowRight, FileText } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"

export function CTASection() {
  const { t } = useLanguage()
  const c = t.cta

  return (
    <section className="py-24 px-5 lg:px-10">
      <div className="max-w-4xl mx-auto">
        <div
          className="relative rounded-3xl border border-primary/20 overflow-hidden p-10 lg:p-16 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(78,222,163,0.06) 0%, rgba(192,193,255,0.06) 50%, rgba(78,222,163,0.03) 100%)",
            boxShadow: "0 0 80px -20px rgba(78,222,163,0.15), inset 0 1px 0 rgba(78,222,163,0.1)",
          }}
        >
          <div
            className="absolute top-0 left-1/4 w-64 h-64 rounded-full pointer-events-none -z-0"
            style={{
              background: "radial-gradient(circle, rgba(78,222,163,0.08) 0%, transparent 70%)",
              transform: "translate(-50%, -50%)",
            }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full pointer-events-none -z-0"
            style={{
              background: "radial-gradient(circle, rgba(192,193,255,0.08) 0%, transparent 70%)",
              transform: "translate(50%, 50%)",
            }}
          />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-mono text-primary">
              <Sparkles className="w-3 h-3" />
              {c.badge}
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-on-surface tracking-tight leading-tight">
              {c.title1}
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #4edea3, #c0c1ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {c.title2}
              </span>
            </h2>

            <p className="text-on-surface-variant max-w-xl mx-auto leading-relaxed">
              {c.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-primary/90 transition-all duration-150 shadow-lg shadow-primary/25"
                style={{ boxShadow: "0 8px 32px -8px rgba(78,222,163,0.4)" }}
              >
                <Sparkles className="w-4 h-4" />
                {c.getStarted}
              </Link>
              <Link
                href="/templates"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-outline-variant bg-surface-container text-on-surface text-sm font-medium hover:bg-surface-container-high transition-all duration-150"
              >
                <FileText className="w-4 h-4" />
                {c.exploreTemplates}
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 pt-4 flex-wrap">
              {[c.freeToUse, c.noCreditCard, c.instantAccess].map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-[11px] text-on-surface-variant/50">
                  <Check className="w-3 h-3 text-primary/50" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
