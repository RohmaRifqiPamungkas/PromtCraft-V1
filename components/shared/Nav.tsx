"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"
import { LanguageToggle } from "@/components/shared/LanguageToggle"

export function Nav() {
  const { t } = useLanguage()

  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant/40 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center font-bold text-sm text-on-primary-container select-none shrink-0 group-hover:scale-105 transition-transform duration-150">
            P
          </div>
          <span className="font-bold text-[15px] text-on-surface">PromptCraft AI</span>
          <span className="hidden sm:inline text-[9px] font-mono tracking-widest text-on-surface-variant/40 border border-outline-variant px-1.5 py-0.5 rounded">
            v1.0
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-on-surface-variant">
          <a href="#features" className="hover:text-on-surface transition-colors">{t.nav.features}</a>
          <a href="#how-it-works" className="hover:text-on-surface transition-colors">{t.nav.howItWorks}</a>
          <a href="#comparison" className="hover:text-on-surface transition-colors">{t.nav.whyUs}</a>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Link
            href="/login"
            className="hidden sm:inline-flex text-sm text-on-surface-variant hover:text-on-surface transition-colors px-3 py-1.5"
          >
            {t.nav.signIn}
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary/90 transition-all duration-150"
          >
            {t.nav.startBuilding}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  )
}
