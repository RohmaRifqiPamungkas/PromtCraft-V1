"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Sparkles, Mail, Lock, User, Loader2,
  AlertCircle, CheckCircle2, Eye, EyeOff,
} from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  const [fullName, setFullName]           = useState("")
  const [email, setEmail]                 = useState("")
  const [password, setPassword]           = useState("")
  const [confirmPassword, setConfirm]     = useState("")
  const [showPassword, setShowPassword]   = useState(false)
  const [showConfirm, setShowConfirm]     = useState(false)
  const [loading, setLoading]             = useState(false)
  const [error, setError]                 = useState<string | null>(null)
  const [emailSent, setEmailSent]         = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
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
        setError(
          "Too many sign-up attempts. Please wait a few minutes before trying again, or contact the administrator to configure a custom SMTP provider."
        )
      } else if (msg.includes("already registered") || msg.includes("user already exists")) {
        setError("An account with this email already exists. Try signing in instead.")
      } else {
        setError(authError.message)
      }
      setLoading(false)
      return
    }

    // If email confirmation is disabled and session exists, update profile immediately
    if (data.session) {
      await supabase
        .from("profiles")
        .upsert({ id: data.user!.id, email, full_name: fullName.trim() })
    }

    setEmailSent(true)
    setLoading(false)
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-primary" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface">Check your email</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed mt-1.5 max-w-[260px] mx-auto">
                We sent a confirmation link to{" "}
                <span className="text-on-surface font-medium">{email}</span>.
                Click it to activate your account.
              </p>
            </div>
            <div className="w-full rounded-xl border border-outline-variant bg-surface-container p-4 text-left space-y-1">
              <p className="text-[11px] font-mono uppercase tracking-widest text-on-surface-variant/50">Account</p>
              <p className="text-sm font-semibold text-on-surface">{fullName}</p>
              <p className="text-xs text-on-surface-variant">{email}</p>
            </div>
          </div>
          <Link
            href="/login"
            className="block text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            ← Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-on-primary-container" strokeWidth={1.75} />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-on-surface">PromptCraft AI</h1>
            <p className="text-sm text-on-surface-variant mt-0.5">Create your account</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">

          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg border border-error/30 bg-error-container/10">
              <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
              <p className="text-sm text-on-error-container">{error}</p>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                autoComplete="name"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface-container border border-outline-variant text-on-surface text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface-container border border-outline-variant text-on-surface text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-surface-container border border-outline-variant text-on-surface text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-on-surface-variant transition-colors"
              >
                {showPassword
                  ? <EyeOff className="w-4 h-4" />
                  : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
              <input
                type={showConfirm ? "text" : "password"}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-surface-container border border-outline-variant text-on-surface text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-on-surface-variant transition-colors"
              >
                {showConfirm
                  ? <EyeOff className="w-4 h-4" />
                  : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Live mismatch hint */}
            {confirmPassword && password !== confirmPassword && (
              <p className="text-[11px] text-error flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Passwords do not match
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full !mt-5"
            disabled={loading || (!!confirmPassword && password !== confirmPassword)}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating account…
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-on-surface-variant">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
