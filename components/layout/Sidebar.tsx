"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  LayoutDashboard, Network,
  Layers, Wand2, FileText, History, LifeBuoy, LogOut, Menu, X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useLanguage } from "@/lib/i18n/context"
import { LanguageToggle } from "@/components/shared/LanguageToggle"

interface UserInfo {
  email: string
  fullName?: string | null
}

interface SidebarProps {
  /** Pass from a server component to skip the client-side fetch. */
  user?: UserInfo
}

export function Sidebar({ user: userProp }: SidebarProps) {
  const pathname = usePathname()
  const router   = useRouter()
  const { t }    = useLanguage()
  const [info, setInfo] = useState<UserInfo>({ email: userProp?.email ?? "", fullName: userProp?.fullName })
  const [mobileOpen, setMobileOpen] = useState(false)

  const NAV = [
    { icon: LayoutDashboard, label: t.sidebar.dashboard,    href: "/dashboard" },
    { icon: Network,         label: t.sidebar.systemDesign, href: "/system-design" },
    { icon: Layers,          label: t.sidebar.dbAndApi,     href: "/wizard" },
    { icon: Wand2,           label: t.sidebar.promptGen,    href: "/prompt-generator" },
    { icon: FileText,        label: t.sidebar.templates,    href: "/templates" },
    { icon: History,         label: t.sidebar.history,      href: "/history" },
  ]

  useEffect(() => { setMobileOpen(false) }, [pathname])

  useEffect(() => {
    if (userProp?.email) return
    async function load() {
      const supabase = getSupabaseBrowserClient()
      const { data: authData } = await supabase.auth.getUser()
      if (!authData.user) return

      const { data: profile } = await supabase
        .from("profiles")
        .select("email, full_name")
        .eq("id", authData.user.id)
        .single()

      setInfo({
        email:    profile?.email    ?? authData.user.email ?? "",
        fullName: profile?.full_name ?? null,
      })
    }
    void load()
  }, [userProp])

  const displayName = info.fullName || info.email
  const avatarChar  = displayName ? displayName.charAt(0).toUpperCase() : "?"

  async function handleLogout() {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label={t.sidebar.openMenu}
        className="fixed top-0 right-0 z-20 md:hidden h-16 w-16 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      <aside className={cn(
        "flex flex-col bg-surface-container fixed inset-y-0 left-0 w-[280px] border-r border-outline-variant z-50",
        "transition-transform duration-300 ease-in-out",
        "md:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-outline-variant/50">
        <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center font-bold text-sm text-on-primary-container select-none shrink-0">
          P
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-[16px] font-bold text-on-surface leading-tight">PromptCraft AI</h1>
          <span className="text-[10px] font-mono tracking-widest text-on-surface-variant/60">v1.0.4-beta</span>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={() => setMobileOpen(false)}
          aria-label={t.sidebar.closeMenu}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ icon: Icon, label, href }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-[13.5px]",
                active
                  ? "bg-primary/10 text-primary font-medium border border-primary/15"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              )}
            >
              <Icon
                className={cn("w-[18px] h-[18px] shrink-0", active && "text-primary")}
                strokeWidth={active ? 2 : 1.75}
              />
              <span className="flex-1 text-left">{label}</span>
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-3 border-t border-outline-variant/50 space-y-1">
        {/* Language toggle */}
        <div className="px-3 py-2 flex items-center justify-between">
          <span className="text-[11px] text-on-surface-variant/50">Language</span>
          <LanguageToggle />
        </div>

        <Link
          href="#"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all duration-150"
        >
          <LifeBuoy className="w-[18px] h-[18px] shrink-0" strokeWidth={1.75} />
          {t.sidebar.helpCenter}
        </Link>

        {/* User card */}
        <div className="mt-1 px-3 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-primary font-semibold text-sm shrink-0 select-none">
            {avatarChar}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-medium text-on-surface leading-tight truncate">
              {info.fullName || info.email || "Loading…"}
            </p>
            {info.fullName && (
              <p className="text-[10px] font-mono text-on-surface-variant/60 truncate">{info.email}</p>
            )}
            {!info.fullName && (
              <p className="text-[10px] font-mono text-on-surface-variant/60">{t.sidebar.authenticated}</p>
            )}
          </div>
          <button
            onClick={handleLogout}
            title={t.sidebar.signOut}
            className="w-7 h-7 rounded-md flex items-center justify-center text-on-surface-variant/50 hover:text-error hover:bg-error-container/20 transition-all shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      </aside>
    </>
  )
}
