import Link from "next/link"
import { Check, X, Sparkles, ArrowRight } from "lucide-react"
import { gradientText } from "./constants"

const rows = [
  { label: "Tools yang dibutuhkan", without: "5+ tools terpisah", with: "1 platform terintegrasi" },
  { label: "Kualitas prompt", without: "Tidak konsisten, sering gagal", with: "Terstruktur & optimal" },
  { label: "Dokumentasi proses", without: "Manual, sering tidak ada", with: "Otomatis & terorganisir" },
  { label: "Context switching", without: "Tinggi, memecah fokus", with: "Minimal, tetap dalam flow" },
  { label: "Onboarding developer baru", without: "Panjang, tidak ada standar", with: "Cepat dengan templates" },
  { label: "Iterasi prompt", without: "Puluhan kali trial-and-error", with: "1–2 iterasi sudah tepat" },
  { label: "Histori & audit trail", without: "Tidak ada / tersebar", with: "Lengkap & searchable" },
]

export function ComparisonSection() {
  return (
    <section id="comparison" className="py-24 px-5 lg:px-10 relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(78,222,163,0.03) 0%, transparent 70%)",
        }}
      />
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14 space-y-4">
          <span className="inline-block text-[11px] font-mono uppercase tracking-widest text-on-surface-variant/50 border border-outline-variant px-3 py-1.5 rounded-full">
            Why PromptCraft
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-on-surface tracking-tight">
            Tanpa PromptCraft{" "}
            <span className="text-error/70">vs</span>
            {" "}Dengan{" "}
            <span className={gradientText}>PromptCraft</span>
          </h2>
          <p className="text-[13px] text-on-surface-variant max-w-md mx-auto leading-relaxed">
            Lihat perbedaan nyata antara workflow terfragmentasi dan satu platform terintegrasi.
          </p>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div />

          <div
            className="flex items-center gap-2.5 p-3.5 rounded-2xl border border-primary/25"
            style={{
              background: "linear-gradient(135deg, rgba(78,222,163,0.10) 0%, rgba(78,222,163,0.04) 100%)",
              boxShadow: "inset 0 1px 0 rgba(78,222,163,0.12)",
            }}
          >
            <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[9px] font-mono uppercase tracking-widest text-primary/50">With</p>
              <p className="text-[12px] font-semibold text-primary">Dengan PromptCraft</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3.5 rounded-2xl border border-error/15 bg-error/5">
            <div className="w-7 h-7 rounded-lg bg-error/10 border border-error/20 flex items-center justify-center shrink-0">
              <X className="w-3.5 h-3.5 text-error/70" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[9px] font-mono uppercase tracking-widest text-error/40">Without</p>
              <p className="text-[12px] font-semibold text-on-surface/55">Tanpa Platform</p>
            </div>
          </div>
        </div>

        {/* Feature rows */}
        <div className="space-y-2">
          {rows.map(({ label, without, with: withText }, i) => (
            <div
              key={label}
              className="group grid grid-cols-3 rounded-2xl overflow-hidden border border-outline-variant/60 hover:border-outline-variant hover:-translate-y-px transition-all duration-200 cursor-default"
            >
              <div className="bg-surface-container px-4 py-4 border-r border-outline-variant/40 flex items-center gap-2.5 group-hover:bg-surface-container-high transition-colors duration-200">
                <span className="hidden sm:block text-[10px] font-mono text-on-surface-variant/20 shrink-0 select-none group-hover:text-on-surface-variant/35 transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[12px] font-medium text-on-surface/75 leading-snug">{label}</span>
              </div>

              <div className="bg-surface-container px-4 py-4 border-r border-outline-variant/40 flex items-start gap-2 group-hover:bg-error/[0.04] transition-colors duration-200">
                <X className="w-3.5 h-3.5 text-error/35 shrink-0 mt-0.5 group-hover:text-error/55 transition-colors duration-200" strokeWidth={2} />
                <span className="text-[12px] text-on-surface-variant/40 group-hover:text-on-surface-variant/55 transition-colors leading-snug">{without}</span>
              </div>

              <div className="bg-primary/[0.025] px-4 py-4 flex items-start gap-2 group-hover:bg-primary/[0.07] transition-colors duration-200">
                <Check className="w-3.5 h-3.5 text-primary/55 shrink-0 mt-0.5 group-hover:text-primary transition-colors duration-200" strokeWidth={2.5} />
                <span className="text-[12px] text-on-surface-variant/60 group-hover:text-on-surface-variant/90 transition-colors leading-snug">{withText}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-4">
          <div className="flex-1 h-px bg-outline-variant/30" />
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary text-[13px] font-semibold hover:bg-primary/90 transition-all duration-150 hover:-translate-y-px shadow-lg shadow-primary/20 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Coba PromptCraft
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <div className="flex-1 h-px bg-outline-variant/30" />
        </div>
      </div>
    </section>
  )
}
