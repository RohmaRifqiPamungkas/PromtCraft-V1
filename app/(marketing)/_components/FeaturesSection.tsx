import Link from "next/link"
import {
  Network, Wand2, FileText, History,
  Layers, ArrowRight,
  GitBranch, Database, Code2,
  AlertCircle, RefreshCw, TestTube,
  LayoutDashboard, Sparkles, BookOpen,
  Clock, Target, TrendingUp,
} from "lucide-react"
import { glassCard, gradientText } from "./constants"

const features = [
  {
    icon: Network,
    color: "text-secondary",
    bgColor: "bg-secondary/5 border-secondary/20",
    badge: "System Design",
    title: "Rancang Sistem Sebelum Menulis Kode",
    desc: "Bangun blueprint arsitektur yang solid dengan panduan terstruktur. Dari high-level design hingga detail teknis.",
    highlights: [
      { icon: GitBranch, text: "Architecture Planning" },
      { icon: Database, text: "Database Relationship Design" },
      { icon: Code2, text: "API Structure Planning" },
      { icon: Layers, text: "Requirement Breakdown" },
    ],
    quote: "Ubah ide mentah menjadi blueprint yang siap dikembangkan.",
    href: "/system-design",
  },
  {
    icon: Wand2,
    color: "text-primary",
    bgColor: "bg-primary/5 border-primary/20",
    badge: "Prompt Builder",
    title: "Generate Prompt Berkualitas Tinggi",
    desc: "Mesin utama untuk menghasilkan prompt yang lebih akurat, terstruktur, dan mudah dipahami oleh AI.",
    highlights: [
      { icon: Code2, text: "Backend & Frontend Dev" },
      { icon: AlertCircle, text: "Debugging Assist" },
      { icon: RefreshCw, text: "Code Refactoring" },
      { icon: TestTube, text: "Testing & Review" },
    ],
    quote: "Prompt yang lebih akurat = output AI yang lebih baik.",
    href: "/prompt-generator",
  },
  {
    icon: FileText,
    color: "text-tertiary",
    bgColor: "bg-surface-container-high border-outline-variant",
    badge: "Templates",
    title: "Mulai Lebih Cepat dengan Templates",
    desc: "Kumpulan template siap pakai untuk berbagai use case. Dari SaaS hingga AI Agent, semuanya tersedia.",
    highlights: [
      { icon: Layers, text: "SaaS & E-Commerce" },
      { icon: LayoutDashboard, text: "Dashboard Apps" },
      { icon: Sparkles, text: "AI Agent Design" },
      { icon: BookOpen, text: "API Service" },
    ],
    quote: "Mulai dalam hitungan detik tanpa perlu dari nol.",
    href: "/templates",
  },
  {
    icon: History,
    color: "text-primary",
    bgColor: "bg-primary/5 border-primary/20",
    badge: "History",
    title: "Dokumentasi Otomatis Setiap Sesi",
    desc: "Seluruh aktivitas prompt dan hasil generate tersimpan otomatis, terorganisir, dan mudah diakses kembali.",
    highlights: [
      { icon: Clock, text: "Auto-saved sessions" },
      { icon: Target, text: "Searchable history" },
      { icon: RefreshCw, text: "Re-use past prompts" },
      { icon: TrendingUp, text: "Track improvements" },
    ],
    quote: "Seluruh pekerjaan Anda terdokumentasi dan siap digunakan ulang.",
    href: "/history",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-5 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block text-[11px] font-mono uppercase tracking-widest text-on-surface-variant/50 border border-outline-variant px-3 py-1.5 rounded-full">
            Feature Showcase
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-on-surface tracking-tight">
            Ekosistem lengkap dalam{" "}
            <span className={gradientText}>satu platform</span>
          </h2>
          <p className="text-on-surface-variant max-w-xl mx-auto">
            Setiap fitur dirancang untuk bekerja bersama — bukan sebagai tool terpisah,
            melainkan sebagai satu workflow yang kohesif.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map(({ icon: Icon, color, bgColor, badge, title, desc, highlights, quote, href }) => (
            <Link
              key={badge}
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
                {highlights.map(({ icon: HIcon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-[11px] text-on-surface-variant/60">
                    <HIcon className="w-3.5 h-3.5 shrink-0 text-on-surface-variant/40" strokeWidth={1.5} />
                    {text}
                  </div>
                ))}
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
