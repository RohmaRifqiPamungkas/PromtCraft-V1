"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Lightbulb, Network, Wand2, Cpu, Code2, ArrowRight,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { gradientText } from "./constants"
import { useLanguage } from "@/lib/i18n/context"

const STEP_ICONS: LucideIcon[] = [Lightbulb, Network, Wand2, Cpu, Code2]
const STEP_HREFS = ["/dashboard", "/system-design", "/prompt-generator", "/dashboard", "/history"]

export function SolutionSection() {
  const { t } = useLanguage()
  const s = t.solution

  const steps = s.steps.map((step, i) => ({
    ...step,
    icon: STEP_ICONS[i],
    href: STEP_HREFS[i],
  }))

  const [activeStep, setActiveStep] = useState(0)
  const active = steps[activeStep]
  const ActiveIcon = active.icon

  return (
    <section className="py-24 px-5 lg:px-10 relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(180deg, transparent 0%, rgba(78,222,163,0.03) 50%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-14 space-y-4">
          <span className="inline-block text-[11px] font-mono uppercase tracking-widest text-primary/60 border border-primary/20 bg-primary/5 px-3 py-1.5 rounded-full">
            {s.sectionBadge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-on-surface tracking-tight leading-tight">
            {s.title1}
            <br />
            {s.title2}{" "}
            <span className={gradientText}>{s.title3}</span>
          </h2>
          <p className="text-on-surface-variant max-w-lg leading-relaxed text-sm">
            {s.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">

          {/* Left — step list */}
          <div className="space-y-1">
            {steps.map(({ icon: Icon, label }, i) => {
              const isActive = i === activeStep
              const isPast = i < activeStep

              return (
                <div key={label} className="relative">
                  <button
                    onMouseEnter={() => setActiveStep(i)}
                    onClick={() => setActiveStep(i)}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all duration-200 group ${
                      isActive
                        ? "bg-primary/10 border border-primary/20"
                        : "border border-transparent hover:bg-surface-container-high"
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-mono font-bold shrink-0 transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-on-primary"
                        : isPast
                          ? "bg-primary/15 text-primary/60"
                          : "bg-surface-container text-on-surface-variant/30 group-hover:text-on-surface-variant/60"
                    }`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 transition-all duration-200 ${
                      isActive
                        ? "bg-primary/10 border-primary/25"
                        : isPast
                          ? "bg-primary/5 border-primary/15"
                          : "bg-surface-container border-outline-variant/50 group-hover:border-outline-variant"
                    }`}>
                      <Icon
                        className={`w-4 h-4 transition-colors duration-200 ${
                          isActive ? "text-primary" : isPast ? "text-primary/50" : "text-on-surface-variant/40"
                        }`}
                        strokeWidth={1.75}
                      />
                    </div>

                    <span className={`text-[13.5px] font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-on-surface"
                        : "text-on-surface-variant/55 group-hover:text-on-surface-variant/80"
                    }`}>
                      {label}
                    </span>

                    <span className={`ml-auto w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                      isActive ? "bg-primary" : "bg-transparent"
                    }`} />
                  </button>

                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div className="absolute left-[1.875rem] top-full w-px h-1 z-10">
                      <div className={`w-full h-full transition-colors duration-300 ${
                        i < activeStep ? "bg-primary/30" : "bg-outline-variant/25"
                      }`} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Right — detail panel */}
          <div className="relative rounded-2xl border border-outline-variant bg-surface-container overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(78,222,163,0.04) 0%, transparent 70%)",
              }}
            />

            <span
              className="absolute -top-6 right-4 text-[9rem] font-black leading-none select-none pointer-events-none transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, rgba(78,222,163,0.08) 0%, rgba(192,193,255,0.05) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {String(activeStep + 1).padStart(2, "0")}
            </span>

            <div className="relative p-8 space-y-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center transition-all duration-200">
                <ActiveIcon className="w-6 h-6 text-primary" strokeWidth={1.5} />
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-mono uppercase tracking-widest text-primary/50">
                  {s.stepLabel} {activeStep + 1} / {steps.length}
                </p>
                <h3 className="text-xl font-bold text-on-surface transition-all duration-200">
                  {active.label}
                </h3>
              </div>

              <p className="text-[13.5px] text-on-surface-variant leading-relaxed transition-all duration-200">
                {active.description}
              </p>

              <div className="flex items-center gap-1.5">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStep(i)}
                    className={`rounded-full transition-all duration-200 ${
                      i === activeStep
                        ? "w-5 h-1.5 bg-primary"
                        : i < activeStep
                          ? "w-1.5 h-1.5 bg-primary/35"
                          : "w-1.5 h-1.5 bg-outline-variant hover:bg-on-surface-variant/30"
                    }`}
                  />
                ))}
              </div>

              <div className="pt-1 border-t border-outline-variant/40">
                <Link
                  href={active.href}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  {active.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
