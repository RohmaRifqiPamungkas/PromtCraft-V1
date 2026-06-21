import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-outline-variant/40 py-10 px-5 lg:px-10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-primary-container flex items-center justify-center text-[11px] font-bold text-on-primary-container">
            P
          </div>
          <span className="text-sm font-semibold text-on-surface/60">PromptCraft AI</span>
          <span className="text-[9px] font-mono text-on-surface-variant/30">v1.0.4-beta</span>
        </div>

        <div className="flex items-center gap-6 text-[11px] text-on-surface-variant/40">
          <Link href="/dashboard" className="hover:text-on-surface-variant transition-colors">Dashboard</Link>
          <Link href="/templates" className="hover:text-on-surface-variant transition-colors">Templates</Link>
          <Link href="/history" className="hover:text-on-surface-variant transition-colors">History</Link>
        </div>

        <p className="text-[11px] text-on-surface-variant/30 font-mono">
          © 2026 PromptCraft AI
        </p>
      </div>
    </footer>
  )
}
