"use client"

import { useState, useMemo, useCallback } from "react"
import { Sidebar }           from "@/components/layout/Sidebar"
import { PromptWizard }      from "@/components/prompt/PromptWizard"
import { PromptPreview }     from "@/components/prompt/PromptPreview"
import { ToastNotification } from "@/components/ui/toast-notification"
import { compilePrompt }     from "@/lib/prompt-compiler"
import type { WizardFormData, WizardStep } from "@/types/prompt"

const DEFAULT_FORM: WizardFormData = {
  projectType:         "SaaS Application",
  entities:            "",
  framework:           "node-express",
  database:            "postgresql",
  apiStyle:            "rest",
  includeSqlDdl:       true,
  repositoryPattern:   true,
  unitTestBoilerplate: true,
  solidPrinciples:     true,
  typescriptStrict:    true,
  includeIndexes:      false,
}

export default function DashboardPage() {
  const [currentStep,  setCurrentStep]  = useState<WizardStep>(1)
  const [formData,     setFormData]     = useState<WizardFormData>(DEFAULT_FORM)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated,  setIsGenerated]  = useState(false)
  const [toastMsg,     setToastMsg]     = useState<string | null>(null)

  /* Live prompt — recompiles on every state change */
  const compiledPrompt = useMemo(() => compilePrompt(formData), [formData])

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }, [])

  const handleFormChange = useCallback((delta: Partial<WizardFormData>) => {
    setFormData((prev) => ({ ...prev, ...delta }))
    setIsGenerated(false)
  }, [])

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true)
    await new Promise<void>((r) => setTimeout(r, 1000))
    setIsGenerating(false)
    setIsGenerated(true)
    showToast("Prompt structure generated!")
  }, [showToast])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(compiledPrompt)
      showToast("Copied to clipboard!")
    } catch {
      showToast("Copy failed — please select text manually.")
    }
  }, [compiledPrompt, showToast])

  const handleDownload = useCallback(() => {
    const blob = new Blob([compiledPrompt], { type: "text/markdown;charset=utf-8" })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement("a")
    a.href     = url
    a.download = "promptcraft-output.md"
    a.click()
    URL.revokeObjectURL(url)
    showToast("Markdown file downloaded!")
  }, [compiledPrompt, showToast])

  return (
    <div className="bg-background text-on-surface h-screen flex overflow-hidden">
      <Sidebar />

      <main className="md:ml-[280px] flex-1 flex flex-col h-full bg-surface-dim overflow-hidden">
        {/* Mobile header */}
        <header className="flex md:hidden justify-between items-center px-6 h-16 bg-surface border-b border-outline-variant shrink-0">
          <span className="text-xl font-bold text-primary tracking-tight">PromptCraft AI</span>
        </header>

        {/* Split-screen */}
        <div className="flex-1 flex flex-col xl:flex-row overflow-hidden">
          <PromptWizard
            currentStep={currentStep}
            formData={formData}
            isGenerating={isGenerating}
            onStepChange={setCurrentStep}
            onFormChange={handleFormChange}
            onGenerate={handleGenerate}
          />

          {/* Visual divider */}
          <div className="hidden xl:block w-px bg-outline-variant hover:bg-secondary-container transition-colors cursor-col-resize" />

          <PromptPreview
            prompt={compiledPrompt}
            isGenerated={isGenerated}
            isGenerating={isGenerating}
            onCopy={handleCopy}
            onDownload={handleDownload}
          />
        </div>
      </main>

      {toastMsg && (
        <ToastNotification message={toastMsg} onDismiss={() => setToastMsg(null)} />
      )}
    </div>
  )
}
