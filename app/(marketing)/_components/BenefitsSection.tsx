import {
  Zap, Clock, Target, TrendingUp,
  BookOpen, Network,
} from "lucide-react"
import { gradientText } from "./constants"

const stats = [
  { value: "70%", label: "Pengurangan waktu analisis", icon: Clock },
  { value: "5×", label: "Lebih cepat membuat prompt", icon: Zap },
  { value: "90%", label: "Konsistensi output AI", icon: Target },
  { value: "1 Platform", label: "Menggantikan 5+ tools terpisah", icon: TrendingUp },
]

const benefits = [
  {
    icon: Zap,
    title: "Prompt lebih cepat",
    desc: "Hilangkan blank-page syndrome. Wizard terstruktur memandu Anda mengisi konteks yang tepat.",
  },
  {
    icon: Target,
    title: "Output AI lebih akurat",
    desc: "Prompt yang terstruktur secara signifikan meningkatkan relevansi dan kualitas respons AI.",
  },
  {
    icon: Clock,
    title: "Kurangi trial-and-error",
    desc: "Tidak perlu iterasi berkali-kali. Satu prompt yang baik menghasilkan output yang langsung bisa dipakai.",
  },
  {
    icon: TrendingUp,
    title: "Workflow terpusat",
    desc: "Semua tools, semua histori, semua konteks tersimpan dan saling terhubung dalam satu tempat.",
  },
  {
    icon: BookOpen,
    title: "Dokumentasi otomatis",
    desc: "Setiap prompt dan hasil generate tersimpan — aset teknis yang bisa digunakan kembali kapanpun.",
  },
  {
    icon: Network,
    title: "Dari desain ke kode",
    desc: "Mulai dari perancangan arsitektur, flow bisnis, hingga implementation prompt — semua dalam satu flow.",
  },
]

export function BenefitsSection() {
  return (
    <section className="py-24 px-5 lg:px-10 relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(78,222,163,0.045) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto space-y-20">
        {/* Stats */}
        <div>
          <div className="text-center mb-12 space-y-3">
            <span className="inline-block text-[11px] font-mono uppercase tracking-widest text-on-surface-variant/50 border border-outline-variant px-3 py-1.5 rounded-full">
              By the Numbers
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-on-surface tracking-tight">
              Dampak nyata{" "}
              <span className={gradientText}>untuk produktivitas</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="group relative rounded-2xl border border-outline-variant bg-surface-container p-6 overflow-hidden hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 cursor-default"
              >
                <div className="absolute -right-3 -bottom-3 pointer-events-none select-none opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-300">
                  <Icon className="w-20 h-20 text-primary" strokeWidth={1} />
                </div>

                <div className="w-9 h-9 rounded-xl bg-primary/5 border border-primary/15 flex items-center justify-center mb-5 group-hover:bg-primary/10 group-hover:border-primary/25 transition-all duration-200">
                  <Icon className="w-4 h-4 text-primary" strokeWidth={1.75} />
                </div>

                <p
                  className="text-4xl lg:text-5xl font-bold tracking-tight mb-2"
                  style={{
                    background: "linear-gradient(135deg, #4edea3 30%, #c0c1ff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {value}
                </p>

                <p className="text-[11.5px] text-on-surface-variant/60 leading-snug pr-8">{label}</p>

                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Benefits grid */}
        <div>
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px bg-outline-variant/30" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant/35 px-1 shrink-0">
              Core Benefits
            </span>
            <div className="flex-1 h-px bg-outline-variant/30" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="group relative rounded-2xl border border-outline-variant bg-surface-container p-6 overflow-hidden hover:border-primary/25 hover:bg-surface-container-high transition-all duration-200 cursor-default"
              >
                <span className="absolute top-5 right-5 text-[10px] font-mono font-bold select-none text-on-surface-variant/10 group-hover:text-primary/25 transition-colors duration-200">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="absolute left-0 top-6 bottom-6 w-[2px] rounded-r-full bg-gradient-to-b from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/15 flex items-center justify-center mb-5 group-hover:bg-primary/10 group-hover:border-primary/25 transition-all duration-200">
                  <Icon className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors duration-200" strokeWidth={1.75} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-[14px] font-semibold text-on-surface group-hover:text-primary transition-colors duration-150">
                    {title}
                  </h3>
                  <p className="text-[12px] text-on-surface-variant/70 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
