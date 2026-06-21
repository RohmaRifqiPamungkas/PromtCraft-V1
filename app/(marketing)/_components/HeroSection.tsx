import Link from "next/link"
import { Check, ChevronRight, Sparkles } from "lucide-react"
import { DashboardMockup } from "./DashboardMockup"
import { gradientText } from "./constants"

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden px-5 lg:px-10 flex items-center"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 20% 50%, rgba(78,222,163,0.10) 0%, transparent 65%), radial-gradient(ellipse 60% 70% at 80% 30%, rgba(192,193,255,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-center">
        <div className="space-y-5 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-mono text-primary">
            <Sparkles className="w-3 h-3" />
            AI Prompt Engineering Platform
          </div>

          <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold text-on-surface leading-[1.1] tracking-tight">
            Transform Ideas,
            <br />
            Architecture, and Errors
            <br />
            <span className={gradientText}>
              into Production-Ready
              <br />
              AI Prompts.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed max-w-lg mx-auto lg:mx-0">
            Satu platform untuk merancang sistem, menganalisis kode, membuat
            business flow, dan menghasilkan prompt berkualitas tinggi untuk AI
            favorit Anda.
          </p>

          <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 pt-1">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-primary/90 transition-all duration-150 shadow-lg shadow-primary/20"
            >
              <Sparkles className="w-4 h-4" />
              Start Building — Free
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-outline-variant bg-surface-container text-on-surface text-sm font-medium hover:bg-surface-container-high transition-all duration-150"
            >
              Explore Features
              <ChevronRight className="w-4 h-4 text-on-surface-variant" />
            </a>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-5 pt-1 flex-wrap">
            {["Free to use", "No credit card", "Instant access"].map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-[11px] text-on-surface-variant/40">
                <Check className="w-3 h-3 text-primary/40" />
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="hidden lg:block">
          <DashboardMockup />
        </div>
      </div>
    </section>
  )
}
