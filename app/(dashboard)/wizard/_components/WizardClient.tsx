"use client"

import { useState, useMemo, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Sidebar } from "@/components/layout/Sidebar"
import { PromptWizard } from "./PromptWizard"
import { PromptPreview } from "./PromptPreview"
import { ToastNotification } from "@/components/ui/toast-notification"
import { compilePrompt } from "@/lib/prompt-compiler"
import type { WizardFormData, WizardStep } from "@/types/prompt"

const DEFAULT_FORM: WizardFormData = {
  projectType: "SaaS Application",
  entities: "",
  framework: "node-express",
  database: "postgresql",
  apiStyle: "rest",
  includeSqlDdl: true,
  repositoryPattern: true,
  unitTestBoilerplate: true,
  solidPrinciples: true,
  typescriptStrict: true,
  includeIndexes: false,
}

interface Toast {
  msg: string
  variant: "success" | "error"
}

export function WizardClient() {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState<WizardStep>(1)
  const [formData, setFormData] = useState<WizardFormData>(() => {
    const flags = searchParams.get("flags")?.split(",") ?? []
    const hasFlags = flags.length > 0
    return {
      projectType: searchParams.get("projectType") ?? DEFAULT_FORM.projectType,
      entities:    searchParams.get("entities")    ?? DEFAULT_FORM.entities,
      framework:   searchParams.get("framework")   ?? DEFAULT_FORM.framework,
      database:    searchParams.get("database")    ?? DEFAULT_FORM.database,
      apiStyle:    searchParams.get("apiStyle")    ?? DEFAULT_FORM.apiStyle,
      includeSqlDdl:        hasFlags ? flags.includes("includeSqlDdl")        : DEFAULT_FORM.includeSqlDdl,
      repositoryPattern:    hasFlags ? flags.includes("repositoryPattern")    : DEFAULT_FORM.repositoryPattern,
      unitTestBoilerplate:  hasFlags ? flags.includes("unitTestBoilerplate")  : DEFAULT_FORM.unitTestBoilerplate,
      solidPrinciples:      hasFlags ? flags.includes("solidPrinciples")      : DEFAULT_FORM.solidPrinciples,
      typescriptStrict:     hasFlags ? flags.includes("typescriptStrict")     : DEFAULT_FORM.typescriptStrict,
      includeIndexes:       hasFlags ? flags.includes("includeIndexes")       : DEFAULT_FORM.includeIndexes,
    }
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [enhancedPrompt, setEnhancedPrompt] = useState<string | null>(null)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)

  const compiledPrompt = useMemo(() => compilePrompt(formData), [formData])
  const activePrompt = enhancedPrompt ?? compiledPrompt

  const showToast = useCallback((msg: string, variant: "success" | "error" = "success") => {
    setToast({ msg, variant })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const handleFormChange = useCallback((delta: Partial<WizardFormData>) => {
    setFormData((prev) => ({ ...prev, ...delta }))
    setIsGenerated(false)
    setEnhancedPrompt(null)
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
      await navigator.clipboard.writeText(activePrompt)
      showToast("Copied to clipboard!")
    } catch {
      showToast("Copy failed — please select text manually.", "error")
    }
  }, [activePrompt, showToast])

  const handleDownload = useCallback(() => {
    const blob = new Blob([activePrompt], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = enhancedPrompt ? "promptcraft-enhanced.md" : "promptcraft-output.md"
    a.click()
    URL.revokeObjectURL(url)
    showToast("Markdown file downloaded!")
  }, [activePrompt, enhancedPrompt, showToast])

  const handleEnhance = useCallback(async () => {
    if (!compiledPrompt.trim()) {
      showToast("Fill in the wizard before enhancing.", "error")
      return
    }
    setIsEnhancing(true)
    try {
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: compiledPrompt }),
      })
      const json = (await res.json()) as { success: boolean; enhancedPrompt?: string; error?: string }
      if (json.success && json.enhancedPrompt) {
        setEnhancedPrompt(json.enhancedPrompt)
        setIsGenerated(true)
        showToast("Prompt enhanced by Gemini!")
      } else {
        showToast(json.error ?? "Enhancement failed", "error")
      }
    } catch {
      showToast("Network error — please try again.", "error")
    } finally {
      setIsEnhancing(false)
    }
  }, [compiledPrompt, showToast])

  return (
    <div className="bg-background text-on-surface h-screen flex overflow-hidden">
      <Sidebar />

      <main className="md:ml-[280px] flex-1 flex flex-col h-full bg-surface-dim overflow-hidden">
        <header className="flex md:hidden justify-between items-center px-6 h-16 bg-surface border-b border-outline-variant shrink-0">
          <span className="text-xl font-bold text-primary tracking-tight">PromptCraft AI</span>
        </header>

        <div className="flex-1 flex flex-col xl:flex-row overflow-hidden">
          <PromptWizard
            currentStep={currentStep}
            formData={formData}
            isGenerating={isGenerating}
            onStepChange={setCurrentStep}
            onFormChange={handleFormChange}
            onGenerate={handleGenerate}
          />

          <div className="hidden xl:block w-px bg-outline-variant hover:bg-secondary-container transition-colors cursor-col-resize" />

          <PromptPreview
            prompt={activePrompt}
            isGenerated={isGenerated}
            isGenerating={isGenerating}
            isEnhanced={enhancedPrompt !== null}
            isEnhancing={isEnhancing}
            onCopy={handleCopy}
            onDownload={handleDownload}
            onEnhance={handleEnhance}
          />
        </div>
      </main>

      {toast && (
        <ToastNotification
          message={toast.msg}
          variant={toast.variant}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  )
}
