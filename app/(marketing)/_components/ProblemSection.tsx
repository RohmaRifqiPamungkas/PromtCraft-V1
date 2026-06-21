import { AlertCircle, MessageSquare, Code2, Puzzle, Repeat } from "lucide-react"
import { glassCard } from "./constants"

const problems = [
  {
    icon: AlertCircle,
    title: "Arsitektur yang membingungkan",
    desc: "Tidak tahu harus mulai dari mana saat merancang sistem yang kompleks. Setiap keputusan arsitektur terasa seperti menebak.",
    impact: "Waktu terbuang, desain tidak optimal",
  },
  {
    icon: MessageSquare,
    title: "Prompt AI tidak konsisten",
    desc: "AI memberikan output yang berbeda-beda untuk pertanyaan yang sama karena prompt tidak terstruktur dengan baik.",
    impact: "Hasil tidak dapat diandalkan",
  },
  {
    icon: Code2,
    title: "Error yang sulit dianalisis",
    desc: "Error kompleks butuh konteks yang panjang. Sulit menjelaskan keseluruhan kondisi sistem kepada AI dalam satu sesi.",
    impact: "Debugging memakan waktu lama",
  },
  {
    icon: Puzzle,
    title: "Terlalu banyak tools",
    desc: "Berpindah-pindah antara Notion, draw.io, ChatGPT, dan puluhan tools lain untuk menyelesaikan satu pekerjaan.",
    impact: "Workflow terfragmentasi dan lambat",
  },
  {
    icon: Repeat,
    title: "Trial-and-error yang melelahkan",
    desc: "Butuh puluhan iterasi prompt sebelum AI benar-benar memahami konteks dan memberikan output yang diinginkan.",
    impact: "Produktivitas rendah, frustrasi tinggi",
  },
]

export function ProblemSection() {
  return (
    <section className="py-24 px-5 lg:px-10 relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 20% 60%, rgba(192,193,255,0.05) 0%, transparent 60%)",
        }}
      />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14 space-y-4">
          <span className="inline-block text-[11px] font-mono uppercase tracking-widest text-on-surface-variant/50 border border-outline-variant px-3 py-1.5 rounded-full">
            The Problem
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-on-surface tracking-tight">
            Developer workflow yang{" "}
            <span className="text-error/80">terfragmentasi</span>
          </h2>
          <p className="text-on-surface-variant max-w-xl mx-auto">
            Setiap hari developer menghadapi hambatan yang sama — dan semuanya berujung
            pada satu hal: waktu yang terbuang dan output AI yang tidak optimal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {problems.map(({ icon: Icon, title, desc, impact }, i) => (
            <div
              key={title}
              className={`${glassCard} p-5 space-y-3 hover:bg-surface-container-high transition-colors duration-150 group ${i === 4 ? "sm:col-span-2 lg:col-span-1" : ""}`}
            >
              <div className="w-9 h-9 rounded-xl bg-error/5 border border-error/15 flex items-center justify-center">
                <Icon className="w-4 h-4 text-error/70" strokeWidth={1.75} />
              </div>
              <div className="space-y-1">
                <h3 className="text-[13.5px] font-semibold text-on-surface">{title}</h3>
                <p className="text-[12px] text-on-surface-variant/70 leading-relaxed">{desc}</p>
              </div>
              <div className="flex items-center gap-1.5 pt-1 border-t border-outline-variant/40">
                <span className="w-1.5 h-1.5 rounded-full bg-error/60 shrink-0" />
                <span className="text-[11px] font-mono text-error/60">{impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
