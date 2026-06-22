"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Mail, Lock, User, Loader2,
  AlertCircle, CheckCircle2, Eye, EyeOff,
  ArrowRight, Zap, Check, Sparkles,
} from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useLanguage } from "@/lib/i18n/context"
import { LanguageToggle } from "@/components/shared/LanguageToggle"

function passwordStrength(pw: string): { score: number } {
  let score = 0
  if (pw.length >= 6)           score++
  if (pw.length >= 10)          score++
  if (/[A-Z]/.test(pw))        score++
  if (/[0-9]/.test(pw))        score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return { score }
}

function StrengthBar({ score, labels }: { score: number; labels: string[] }) {
  const segColor =
    score <= 1 ? "bg-error/70"
    : score <= 3 ? "bg-yellow-400/80"
    : "bg-primary"
  const labelColor =
    score <= 1 ? "text-error/70"
    : score <= 3 ? "text-yellow-400/80"
    : "text-primary"

  return (
    <div className="space-y-1.5 pt-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full transition-all duration-300 ${
              i <= score ? segColor : "bg-outline-variant/60"
            }`}
          />
        ))}
      </div>
      {score > 0 && (
        <p className={`text-[10px] font-mono ${labelColor}`}>{labels[score]}</p>
      )}
    </div>
  )
}

export default function RegisterPage() {
  const { t } = useLanguage()
  const a = t.auth

  const [fullName, setFullName]         = useState("")
  const [email, setEmail]               = useState("")
  const [password, setPassword]         = useState("")
  const [confirmPassword, setConfirm]   = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState<string | null>(null)
  const [emailSent, setEmailSent]       = useState(false)

  const { score: pwScore } = passwordStrength(password)
  const passwordsMatch = confirmPassword === "" || password === confirmPassword

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError(a.passwordsMismatch)
      return
    }

    setLoading(true)

    const supabase = getSupabaseBrowserClient()

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (authError) {
      const msg = authError.message.toLowerCase()
      if (msg.includes("rate limit") || msg.includes("email rate")) {
        setError(a.errorRateLimit)
      } else if (msg.includes("already registered") || msg.includes("user already exists")) {
        setError(a.errorAlreadyExists)
      } else {
        setError(authError.message)
      }
      setLoading(false)
      return
    }

    if (data.session) {
      await supabase
        .from("profiles")
        .upsert({ id: data.user!.id, email, full_name: fullName.trim() })
    }

    setEmailSent(true)
    setLoading(false)
  }

  /* ── Success state ─────────────────────────────────────────── */
  if (emailSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(78,222,163,0.06) 0%, transparent 65%)",
          }}
        />
        <div className="relative z-10 w-full max-w-[400px] space-y-6">

          {/* Card */}
          <div className="rounded-2xl border border-outline-variant bg-surface-container p-8 space-y-6 text-center">

            {/* Checkmark */}
            <div className="flex justify-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(78,222,163,0.15), rgba(78,222,163,0.05))",
                  border: "1px solid rgba(78,222,163,0.25)",
                  boxShadow: "0 0 32px -8px rgba(78,222,163,0.25)",
                }}
              >
                <CheckCircle2 className="w-8 h-8 text-primary" strokeWidth={1.75} />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-on-surface">{a.successTitle}</h2>
              <p className="text-[13px] text-on-surface-variant leading-relaxed">
                {a.successSentTo}{" "}
                <span className="text-on-surface font-semibold">{email}</span>.{" "}
                {a.successActivate}
              </p>
            </div>

            {/* Account summary */}
            <div className="rounded-xl border border-outline-variant/60 bg-surface-container-low p-4 text-left space-y-1.5">
              <p className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant/40">
                {a.accountCreated}
              </p>
              <p className="text-[14px] font-semibold text-on-surface">{fullName}</p>
              <p className="text-[12px] text-on-surface-variant/70">{email}</p>
            </div>

            <div className="space-y-2.5">
              {[a.checkSpam, a.linkExpires].map((tip) => (
                <div key={tip} className="flex items-start gap-2 text-left">
                  <Sparkles className="w-3.5 h-3.5 text-primary/50 shrink-0 mt-0.5" strokeWidth={1.75} />
                  <span className="text-[11.5px] text-on-surface-variant/60 leading-snug">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-[13px] text-on-surface-variant">
            <Link href="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
              {a.backToSignIn}
            </Link>
          </p>
        </div>
      </div>
    )
  }

  /* ── Registration form ─────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background flex">

      {/* ── Left brand panel ──────────────────────────────────── */}
      <div className="hidden lg:flex flex-col w-[44%] xl:w-[40%] relative overflow-hidden p-10 xl:p-14 justify-between border-r border-outline-variant/50 bg-surface-container-low">

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 15% 25%, rgba(192,193,255,0.09) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 85% 85%, rgba(78,222,163,0.07) 0%, transparent 55%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.018]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(192,193,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(192,193,255,1) 1px, transparent 1px)",
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
            <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-secondary/60 border border-secondary/20 bg-secondary/5 px-3 py-1.5 rounded-full">
              {a.registerBadge}
            </span>
            <h2 className="text-3xl xl:text-4xl font-bold text-on-surface leading-tight">
              {a.registerHeadline1}{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #c0c1ff, #4edea3)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {a.registerHeadline2}
              </span>
            </h2>
            <p className="text-[13px] text-on-surface-variant leading-relaxed max-w-[300px]">
              {a.registerDesc}
            </p>
          </div>

          <ul className="space-y-3.5">
            {a.registerSidePerks.map((text, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-primary" strokeWidth={2.5} />
                </div>
                <span className="text-[12.5px] text-on-surface-variant leading-snug pt-0.5">{text}</span>
              </li>
            ))}
          </ul>

          {/* Trust badge */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl border border-outline-variant/50 bg-surface-container/60 w-fit">
            <Zap className="w-4 h-4 text-primary shrink-0" strokeWidth={1.75} />
            <div>
              <p className="text-[11px] font-semibold text-on-surface">{t.hero.instantAccess}</p>
              <p className="text-[10px] text-on-surface-variant/50">{t.hero.noCreditCard}</p>
            </div>
          </div>
        </div>

        <p className="text-[10px] font-mono text-on-surface-variant/25 relative z-10 select-none">
          © 2026 PromptCraft AI
        </p>
      </div>

      {/* ── Right form panel ──────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative overflow-y-auto">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 70% 40%, rgba(192,193,255,0.02) 0%, transparent 60%)",
          }}
        />

        <div className="w-full max-w-[390px] space-y-6 relative z-10 py-6">

          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2.5 w-fit">
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center font-bold text-sm text-on-primary-container select-none">
              P
            </div>
            <span className="font-bold text-on-surface">PromptCraft AI</span>
          </Link>

          {/* Language toggle */}
          <div className="flex justify-end">
            <LanguageToggle />
          </div>

          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-on-surface">{a.createAccount}</h1>
            <p className="text-[13px] text-on-surface-variant">{a.joinSubtitle}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-error/30 bg-error/5">
                <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
                <p className="text-[12.5px] text-on-error-container leading-snug">{error}</p>
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="fullName"
                className="text-[11px] font-semibold text-on-surface-variant/60 uppercase tracking-wider"
              >
                {a.fullNameLabel}
              </label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/35 group-focus-within:text-primary/60 transition-colors duration-150 pointer-events-none" />
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  autoComplete="name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-container border border-outline-variant text-on-surface text-sm placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-150"
                />
              </div>
            </div>

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

            {/* Password + strength */}
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
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-surface-container border border-outline-variant text-on-surface text-sm placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-150"
                />
                <button
                  type="button"
                  aria-label={showPassword ? a.hidePassword : a.showPassword}
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/35 hover:text-on-surface-variant transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && <StrengthBar score={pwScore} labels={a.pwLabels} />}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="confirm"
                className="text-[11px] font-semibold text-on-surface-variant/60 uppercase tracking-wider"
              >
                {a.confirmPasswordLabel}
              </label>
              <div className="relative group">
                <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors duration-150 ${
                  !passwordsMatch ? "text-error/60" : "text-on-surface-variant/35 group-focus-within:text-primary/60"
                }`} />
                <input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  className={`w-full pl-10 pr-11 py-3 rounded-xl bg-surface-container text-on-surface text-sm placeholder:text-on-surface-variant/30 focus:outline-none transition-all duration-150 border ${
                    !passwordsMatch
                      ? "border-error/40 focus:border-error/60 focus:ring-2 focus:ring-error/10"
                      : confirmPassword && password === confirmPassword
                        ? "border-primary/40 focus:border-primary/60 focus:ring-2 focus:ring-primary/10"
                        : "border-outline-variant focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                  }`}
                />
                <button
                  type="button"
                  aria-label={showConfirm ? a.hidePassword : a.showPassword}
                  onClick={() => setShowConfirm((v) => !v)}
                  tabIndex={-1}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/35 hover:text-on-surface-variant transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Match hint */}
              {confirmPassword && !passwordsMatch && (
                <p className="flex items-center gap-1.5 text-[11px] text-error/80">
                  <AlertCircle className="w-3 h-3" />
                  {a.passwordsMismatch}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || (!!confirmPassword && !passwordsMatch)}
              className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-px active:translate-y-0 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {a.signingUp}
                </>
              ) : (
                <>
                  {a.signUp}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[13px] text-on-surface-variant">
            {a.alreadyHaveAccount}{" "}
            <Link
              href="/login"
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              {a.signInLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
