"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Mail, Lock, Loader2, AlertCircle,
  Zap, Target, BookOpen, Network,
  ArrowRight, Eye, EyeOff,
} from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useLanguage } from "@/lib/i18n/context"
import { LanguageToggle } from "@/components/shared/LanguageToggle"

const SIDE_ICONS = [Zap, Target, BookOpen, Network]

export default function LoginPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const a = t.auth

  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShow] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = getSupabaseBrowserClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background flex">

      {/* ── Left brand panel ────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col w-[44%] xl:w-[40%] relative overflow-hidden p-10 xl:p-14 justify-between border-r border-outline-variant/50 bg-surface-container-low">

        {/* Ambient glows */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 15% 25%, rgba(78,222,163,0.10) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 85% 85%, rgba(192,193,255,0.07) 0%, transparent 55%)",
          }}
        />

        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.018]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(78,222,163,1) 1px, transparent 1px), linear-gradient(90deg, rgba(78,222,163,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 relative z-10 group w-fit">
          <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center font-bold text-sm text-on-primary-container group-hover:scale-105 transition-transform duration-150 select-none">
            P
          </div>
          <span className="font-bold text-[15px] text-on-surface">PromptCraft AI</span>
        </Link>

        {/* Main copy */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-primary/60 border border-primary/20 bg-primary/5 px-3 py-1.5 rounded-full">
              {a.loginBadge}
            </span>
            <h2 className="text-3xl xl:text-4xl font-bold text-on-surface leading-tight">
              {a.loginHeadline1}{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #4edea3, #c0c1ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {a.loginHeadline2}
              </span>
            </h2>
            <p className="text-[13px] text-on-surface-variant leading-relaxed max-w-[300px]">
              {a.loginDesc}
            </p>
          </div>

          <ul className="space-y-4">
            {a.loginSideFeatures.map((text, i) => {
              const Icon = SIDE_ICONS[i]
              return (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5 text-primary" strokeWidth={1.75} />
                  </div>
                  <span className="text-[12.5px] text-on-surface-variant leading-snug pt-0.5">{text}</span>
                </li>
              )
            })}
          </ul>
        </div>

        <p className="text-[10px] font-mono text-on-surface-variant/25 relative z-10 select-none">
          © 2026 PromptCraft AI
        </p>
      </div>

      {/* ── Right form panel ────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 70% 40%, rgba(78,222,163,0.025) 0%, transparent 60%)",
          }}
        />

        <div className="w-full max-w-[390px] space-y-7 relative z-10">

          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2.5 w-fit">
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center font-bold text-sm text-on-primary-container select-none">
              P
            </div>
            <span className="font-bold text-on-surface">PromptCraft AI</span>
          </Link>

          {/* Language toggle — top-right of form panel */}
          <div className="flex justify-end">
            <LanguageToggle />
          </div>

          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-on-surface">{a.loginWelcome}</h1>
            <p className="text-[13px] text-on-surface-variant">{a.loginSubtitle}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-error/30 bg-error/5">
                <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
                <p className="text-[12.5px] text-on-error-container leading-snug">{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-[11px] font-semibold text-on-surface-variant/60 uppercase tracking-wider"
              >
                {a.emailLabel}
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/35 group-focus-within:text-primary/60 transition-colors duration-150 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-container border border-outline-variant text-on-surface text-sm placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-150"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-[11px] font-semibold text-on-surface-variant/60 uppercase tracking-wider"
              >
                {a.passwordLabel}
              </label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/35 group-focus-within:text-primary/60 transition-colors duration-150 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-surface-container border border-outline-variant text-on-surface text-sm placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-150"
                />
                <button
                  type="button"
                  aria-label={showPassword ? a.hidePassword : a.showPassword}
                  onClick={() => setShow((v) => !v)}
                  tabIndex={-1}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/35 hover:text-on-surface-variant transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-px active:translate-y-0 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {a.signingIn}
                </>
              ) : (
                <>
                  {a.signIn}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[13px] text-on-surface-variant">
            {a.noAccount}{" "}
            <Link
              href="/register"
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              {a.createOne}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
