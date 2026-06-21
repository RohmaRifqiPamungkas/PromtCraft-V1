"use client"

import { useState, useMemo, useCallback } from "react"
import { GitBranch, DatabaseZap, Plus, ChevronRight } from "lucide-react"
import { Sidebar } from "@/components/layout/Sidebar"
import { cn } from "@/lib/utils"
import { compileBusinessFlow, type BusinessFlowData } from "@/lib/business-flow-compiler"
import { compileArchitecture, type ArchitectureData } from "@/lib/architecture-compiler"

import { PreviewPanel } from "./shared/PreviewPanel"
import { blankFlow, applyFlowTemplate, type FlowTemplate } from "./flow/flowData"
import { blankArch, applyArchTemplate, type ArchTemplate } from "./arch/archData"
import { FlowTemplatePicker } from "./flow/FlowTemplatePicker"
import { FlowBuilder } from "./flow/FlowBuilder"
import { ArchTemplatePicker } from "./arch/ArchTemplatePicker"
import { ArchBuilder } from "./arch/ArchBuilder"

type ActiveTab = "flow" | "arch"

export function SystemDesignClient({ initialTab = "flow" }: { initialTab?: ActiveTab }) {
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab)

  /* ── flow state ── */
  const [flow, setFlow] = useState<BusinessFlowData>(blankFlow)
  const [flowCopied, setFlowCopied] = useState(false)
  const [showFlowTpl, setShowFlowTpl] = useState(true)

  /* ── arch state ── */
  const [arch, setArch] = useState<ArchitectureData>(blankArch)
  const [archCopied, setArchCopied] = useState(false)
  const [showArchTpl, setShowArchTpl] = useState(true)

  const flowPrompt = useMemo(() => compileBusinessFlow(flow), [flow])
  const archPrompt = useMemo(() => compileArchitecture(arch), [arch])

  /* ── flow handlers ── */
  const handleFlowChange = useCallback((patch: Partial<BusinessFlowData>) => {
    setFlow((prev) => ({ ...prev, ...patch }))
  }, [])

  const handleFlowPickTemplate = useCallback((t: FlowTemplate) => {
    setFlow(applyFlowTemplate(t))
    setShowFlowTpl(false)
  }, [])

  const handleFlowReset = useCallback(() => {
    setFlow(blankFlow())
    setShowFlowTpl(true)
    setFlowCopied(false)
  }, [])

  const handleFlowCopy = useCallback(async () => {
    if (!flowPrompt) return
    await navigator.clipboard.writeText(flowPrompt)
    setFlowCopied(true)
    setTimeout(() => setFlowCopied(false), 2000)
  }, [flowPrompt])

  const handleFlowDownload = useCallback(() => {
    if (!flowPrompt) return
    const slug = flow.name.toLowerCase().replace(/\s+/g, "-") || "business-flow"
    const blob = new Blob([flowPrompt], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = `${slug}-flow-prompt.md`; a.click()
    URL.revokeObjectURL(url)
  }, [flowPrompt, flow.name])

  /* ── arch handlers ── */
  const handleArchChange = useCallback((patch: Partial<ArchitectureData>) => {
    setArch((prev) => ({ ...prev, ...patch }))
  }, [])

  const handleArchPickTemplate = useCallback((t: ArchTemplate) => {
    setArch(applyArchTemplate(t))
    setShowArchTpl(false)
  }, [])

  const handleArchReset = useCallback(() => {
    setArch(blankArch())
    setShowArchTpl(true)
    setArchCopied(false)
  }, [])

  const handleArchCopy = useCallback(async () => {
    if (!archPrompt) return
    await navigator.clipboard.writeText(archPrompt)
    setArchCopied(true)
    setTimeout(() => setArchCopied(false), 2000)
  }, [archPrompt])

  const handleArchDownload = useCallback(() => {
    if (!archPrompt) return
    const slug = arch.name.toLowerCase().replace(/\s+/g, "-") || "architecture"
    const blob = new Blob([archPrompt], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = `${slug}-arch-prompt.md`; a.click()
    URL.revokeObjectURL(url)
  }, [archPrompt, arch.name])

  /* ── derived file names ── */
  const flowFileName = flow.name
    ? `${flow.name.toLowerCase().replace(/\s+/g, "-")}-flow.md`
    : "business-flow.md"
  const archFileName = arch.name
    ? `${arch.name.toLowerCase().replace(/\s+/g, "-")}-arch.md`
    : "architecture.md"

  return (
    <div className="bg-background text-on-surface h-screen flex overflow-hidden">
      <Sidebar />

      <main className="md:ml-[280px] flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile header */}
        <header className="flex md:hidden justify-between items-center px-6 h-16 bg-surface border-b border-outline-variant sticky top-0 z-10 shrink-0">
          <span className="text-xl font-bold text-primary tracking-tight">PromptCraft AI</span>
        </header>

        <div className="flex-1 flex flex-col xl:flex-row overflow-hidden">

          {/* ── Left: builder ── */}
          <section className="flex-1 xl:max-w-[560px] shrink-0 overflow-y-auto border-b xl:border-b-0 xl:border-r border-outline-variant bg-surface">
            <div className="p-6 lg:p-8 max-w-xl mx-auto space-y-6">

              <div>
                <h1 className="text-2xl font-bold text-on-surface tracking-tight">System Design</h1>
                <p className="text-sm text-on-surface-variant mt-0.5">
                  Map your business flow or define your architecture, then generate a structured AI prompt.
                </p>
              </div>

              {/* Tab switcher */}
              <div className="flex gap-1 p-1 rounded-lg bg-surface-container border border-outline-variant">
                {(["flow", "arch"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-[12px] font-medium transition-all duration-150",
                      activeTab === tab
                        ? "bg-surface text-on-surface shadow-sm border border-outline-variant"
                        : "text-on-surface-variant hover:text-on-surface",
                    )}
                  >
                    {tab === "flow"
                      ? <GitBranch className="w-3.5 h-3.5 shrink-0" strokeWidth={activeTab === "flow" ? 2 : 1.75} />
                      : <DatabaseZap className="w-3.5 h-3.5 shrink-0" strokeWidth={activeTab === "arch" ? 2 : 1.75} />
                    }
                    {tab === "flow" ? "Business Flow" : "Architecture"}
                  </button>
                ))}
              </div>

              {/* Flow tab */}
              {activeTab === "flow" && (
                <>
                  {showFlowTpl ? (
                    <div className="space-y-3">
                      <FlowTemplatePicker onPick={handleFlowPickTemplate} />
                      <OrDivider />
                      <StartEmptyButton onClick={() => setShowFlowTpl(false)} />
                    </div>
                  ) : (
                    <BackToTemplatesButton onClick={() => setShowFlowTpl(true)} />
                  )}
                  <FlowBuilder data={flow} onChange={handleFlowChange} />
                </>
              )}

              {/* Arch tab */}
              {activeTab === "arch" && (
                <>
                  {showArchTpl ? (
                    <div className="space-y-3">
                      <ArchTemplatePicker onPick={handleArchPickTemplate} />
                      <OrDivider />
                      <StartEmptyButton onClick={() => setShowArchTpl(false)} />
                    </div>
                  ) : (
                    <BackToTemplatesButton onClick={() => setShowArchTpl(true)} />
                  )}
                  <ArchBuilder data={arch} onChange={handleArchChange} />
                </>
              )}

            </div>
          </section>

          <div className="hidden xl:block w-px bg-outline-variant" />

          {/* ── Right: preview ── */}
          {activeTab === "flow" ? (
            <PreviewPanel
              prompt={flowPrompt}
              fileName={flowFileName}
              icon={GitBranch}
              copied={flowCopied}
              onCopy={handleFlowCopy}
              onDownload={handleFlowDownload}
              onReset={handleFlowReset}
            />
          ) : (
            <PreviewPanel
              prompt={archPrompt}
              fileName={archFileName}
              icon={DatabaseZap}
              copied={archCopied}
              onCopy={handleArchCopy}
              onDownload={handleArchDownload}
              onReset={handleArchReset}
            />
          )}

        </div>
      </main>
    </div>
  )
}

/* ── local micro-components ── */

function OrDivider() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-outline-variant/50" />
      <span className="text-[10px] font-mono text-on-surface-variant/40 uppercase tracking-widest">
        or build from scratch
      </span>
      <div className="flex-1 h-px bg-outline-variant/50" />
    </div>
  )
}

function StartEmptyButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 rounded-lg border border-outline-variant bg-surface-container py-2.5 text-[12px] font-mono text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all duration-150"
    >
      <Plus className="w-3.5 h-3.5" /> Start empty
    </button>
  )
}

function BackToTemplatesButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-[11px] font-mono text-on-surface-variant/60 hover:text-primary transition-colors flex items-center gap-1"
    >
      <ChevronRight className="w-3 h-3 rotate-180" /> Templates
    </button>
  )
}
