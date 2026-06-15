"use client"

import { useState, useMemo, useCallback } from "react"
import {
  Check, Copy, Download, Loader2, Sparkles,
  ChevronRight, ChevronLeft, Bug, Code2, Settings,
  History, ArrowLeft,
} from "lucide-react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MarkdownVisualizer } from "@/components/prompt/MarkdownVisualizer"
import { ProgressStepper } from "@/components/prompt/ProgressStepper"
import { PromptHistory } from "@/components/prompt/PromptHistory"
import { ToastNotification } from "@/components/ui/toast-notification"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { WizardStep } from "@/types/prompt"
import {
  compileAnalysisPrompt,
  type CodeAnalysisFormData,
} from "@/lib/code-analysis-compiler"

/* ── data ───────────────────────────────────────────────────────────── */

const ERROR_TYPES = [
  "Syntax Error",
  "Runtime Error",
  "Type Error",
  "Logic Error",
  "Build Error",
  "Network / API Error",
  "Reference Error",
  "Null / Undefined Error",
  "Other",
]

const LANGUAGES = [
  "JavaScript", "TypeScript", "Python", "Java",
  "Go", "Rust", "PHP", "Ruby",
  "C / C++", "C#", "Swift", "Kotlin", "Other",
]

const ANALYSIS_STEPS: { n: WizardStep; label: string }[] = [
  { n: 1, label: "Describe Error" },
  { n: 2, label: "Paste Code" },
  { n: 3, label: "Add Context" },
]

const DEFAULT_FORM: CodeAnalysisFormData = {
  errorType: "",
  errorMessage: "",
  codeSnippet: "",
  language: "",
  framework: "",
  additionalContext: "",
}

/* ── step meta ──────────────────────────────────────────────────────── */

const STEP_META: Record<
  WizardStep,
  { icon: React.ElementType; title: string; description: string }
> = {
  1: { icon: Bug, title: "Describe the Error", description: "Paste the error message or full stack trace" },
  2: { icon: Code2, title: "Paste the Code", description: "Share the code snippet that triggers the issue" },
  3: { icon: Settings, title: "Add Technical Context", description: "Specify the framework and any extra details" },
}

/* ── steps ──────────────────────────────────────────────────────────── */

function StepHeader({ step }: { step: WizardStep }) {
  const { icon: Icon, title, description } = STEP_META[step]
  return (
    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/50 mb-6">
      <div className="w-9 h-9 rounded-lg bg-surface-container-high border border-outline-variant flex items-center justify-center text-on-surface-variant shrink-0">
        <Icon className="w-4.5 h-4.5" strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant/60">
          Step {step} of 3
        </p>
        <p className="text-sm font-semibold text-on-surface leading-tight">{title}</p>
        <p className="text-xs text-on-surface-variant">{description}</p>
      </div>
    </div>
  )
}

function Step1({
  form, set,
}: { form: CodeAnalysisFormData; set: (d: Partial<CodeAnalysisFormData>) => void }) {
  return (
    <div className="space-y-5">
      <StepHeader step={1} />

      <div className="space-y-1.5">
        <Label>Error Type</Label>
        <Select value={form.errorType} onValueChange={(v) => set({ errorType: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Select the type of error…" />
          </SelectTrigger>
          <SelectContent>
            {ERROR_TYPES.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Error Message / Stack Trace</Label>
        <Textarea
          value={form.errorMessage}
          onChange={(e) => set({ errorMessage: e.target.value })}
          placeholder={"Paste the full error message or stack trace here.\n\nExample:\nTypeError: Cannot read properties of undefined (reading 'map')\n    at ProductList (ProductList.jsx:14:18)\n    at renderWithHooks (react-dom.development.js:14985:18)"}
          rows={8}
          className="min-h-[190px] font-mono text-[12px] leading-relaxed"
          spellCheck={false}
        />
        <p className="text-xs text-on-surface-variant pl-0.5">
          Tip: include the full stack trace for a more accurate root cause analysis.
        </p>
      </div>
    </div>
  )
}

function Step2({
  form, set,
}: { form: CodeAnalysisFormData; set: (d: Partial<CodeAnalysisFormData>) => void }) {
  return (
    <div className="space-y-5">
      <StepHeader step={2} />

      <div className="space-y-1.5">
        <Label>Programming Language</Label>
        <Select value={form.language} onValueChange={(v) => set({ language: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Select a language…" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((l) => (
              <SelectItem key={l} value={l}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Problematic Code Snippet</Label>
        <Textarea
          value={form.codeSnippet}
          onChange={(e) => set({ codeSnippet: e.target.value })}
          placeholder={"Paste the code that causes the error.\n\nExample:\nfunction ProductList({ products }) {\n  return (\n    <ul>\n      {products.map(p => (\n        <li key={p.id}>{p.name}</li>\n      ))}\n    </ul>\n  )\n}"}
          rows={9}
          className="min-h-[210px] font-mono text-[12px] leading-relaxed"
          spellCheck={false}
        />
        <p className="text-xs text-on-surface-variant pl-0.5">
          Tip: isolate the smallest snippet that reproduces the error.
        </p>
      </div>
    </div>
  )
}

function Step3({
  form, set,
}: { form: CodeAnalysisFormData; set: (d: Partial<CodeAnalysisFormData>) => void }) {
  return (
    <div className="space-y-5">
      <StepHeader step={3} />

      <div className="space-y-1.5">
        <Label>Framework / Library</Label>
        <input
          type="text"
          value={form.framework}
          onChange={(e) => set({ framework: e.target.value })}
          placeholder="e.g. React, Next.js, Express, Django, Spring…"
          className={cn(
            "flex h-11 w-full items-center rounded-lg border border-outline-variant bg-surface-container",
            "px-4 text-sm text-on-surface placeholder:text-on-surface-variant/40",
            "focus:outline-none focus:ring-1 focus:ring-secondary-container focus:border-secondary-container",
            "transition-colors"
          )}
        />
        <p className="text-xs text-on-surface-variant pl-0.5">
          Optional — leave blank if the error is not framework-specific.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label>Additional Context</Label>
        <Textarea
          value={form.additionalContext}
          onChange={(e) => set({ additionalContext: e.target.value })}
          placeholder={"Any extra context that helps diagnose the error:\n\n• Only happens in production, not locally\n• Started after upgrading React to v19\n• Occurs when the user is not logged in\n• Node 22, macOS Sequoia, Chrome 131"}
          rows={6}
          className="min-h-[160px] leading-relaxed"
        />
        <p className="text-xs text-on-surface-variant pl-0.5">
          Optional — e.g. environment details, when the error appears, recent changes.
        </p>
      </div>

      <div className="rounded-xl border border-primary/15 bg-primary/5 p-4 space-y-1.5">
        <p className="text-[10px] font-mono font-semibold uppercase tracking-widest text-primary/70">
          What happens next
        </p>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Clicking <span className="font-semibold text-on-surface">Generate Prompt</span> compiles a
          structured 8-section debugging prompt ready to paste into ChatGPT, Claude, Gemini, Cursor, or Copilot.
        </p>
      </div>
    </div>
  )
}

/* ── preview panel ──────────────────────────────────────────────────── */

interface PreviewPanelProps {
  prompt: string
  isGenerated: boolean
  isGenerating: boolean
  isEnhanced: boolean
  isEnhancing: boolean
  onCopy: () => void
  onDownload: () => void
  onEnhance: () => void
  onRestoreHistory: (prompt: string) => void
}

function PreviewPanel({
  prompt, isGenerated, isGenerating,
  isEnhanced, isEnhancing,
  onCopy, onDownload, onEnhance, onRestoreHistory,
}: PreviewPanelProps) {
  const [copied, setCopied] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  function handleCopy() {
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleRestoreHistory(p: string) {
    onRestoreHistory(p)
    setShowHistory(false)
  }

  const lines = prompt ? prompt.split("\n").length : 0

  return (
    <section className="flex-1 bg-surface-container-lowest flex flex-col overflow-hidden">

      {/* sticky toolbar */}
      <div className="shrink-0 bg-surface-container-lowest/95 backdrop-blur-sm border-b border-outline-variant px-5 py-3 flex justify-between items-center gap-4">
        <div className="flex flex-col min-w-0">
          <h3 className="text-[15px] font-semibold text-on-surface leading-tight truncate">
            {showHistory ? "Prompt History" : "Generated Prompt Preview"}
          </h3>
          {!showHistory && lines > 0 && (
            <p className="text-[10px] font-mono text-on-surface-variant/50 mt-0.5">
              {lines} lines · {isEnhanced ? "ai-enhanced" : "markdown"}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {!showHistory && (
            <>
              {/* Copy */}
              <Button
                variant={copied ? "surface" : "outline"}
                size="sm"
                onClick={handleCopy}
                className={cn(
                  "gap-1.5 text-xs h-8 px-3 transition-all",
                  copied && "border-primary/40 text-primary"
                )}
              >
                {copied
                  ? <><Check className="w-3.5 h-3.5" /><span className="hidden sm:inline">Copied!</span></>
                  : <><Copy className="w-3.5 h-3.5" /><span className="hidden sm:inline">Copy</span></>
                }
              </Button>

              {/* Download */}
              <Button
                variant="outline"
                size="sm"
                onClick={onDownload}
                className="gap-1.5 text-xs h-8 px-3"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Save .md</span>
              </Button>

              <div className="w-px h-5 bg-outline-variant mx-0.5" />

              {/* Enhance */}
              <Button
                variant={isEnhanced ? "secondary" : "default"}
                size="sm"
                onClick={onEnhance}
                disabled={isEnhancing || !prompt.trim()}
                className="gap-1.5 text-xs h-8 px-3"
              >
                {isEnhancing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span className="hidden lg:inline">Enhancing…</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="hidden lg:inline">
                      {isEnhanced ? "Re-enhance" : "Enhance"}
                    </span>
                  </>
                )}
              </Button>
            </>
          )}

          {/* History toggle */}
          <Button
            variant={showHistory ? "surface" : "ghost"}
            size="sm"
            onClick={() => setShowHistory((v) => !v)}
            className={cn(
              "gap-1.5 text-xs h-8 px-3",
              showHistory && "border-primary/20 text-primary"
            )}
          >
            {showHistory
              ? <><ArrowLeft className="w-3.5 h-3.5" /><span className="hidden sm:inline">Back</span></>
              : <><History className="w-3.5 h-3.5" /><span className="hidden sm:inline">History</span></>
            }
          </Button>
        </div>
      </div>

      {/* body */}
      {showHistory ? (
        <PromptHistory onRestore={handleRestoreHistory} />
      ) : (
        <div className="flex-1 overflow-y-auto p-5 lg:p-7">
          <div className={cn(
            "rounded-xl border border-outline-variant bg-surface-container flex flex-col min-h-full shadow-lg shadow-black/20 transition-all duration-500",
            isGenerated && !isEnhanced && "border-primary/20 shadow-primary/5",
            isEnhanced && "border-secondary/30 shadow-secondary/5"
          )}>
            {/* Editor chrome */}
            <div className="shrink-0 bg-surface-container-high px-4 py-2.5 border-b border-outline-variant rounded-t-xl flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-error/30" />
                <div className="w-3 h-3 rounded-full bg-primary/20" />
                <div className="w-3 h-3 rounded-full bg-secondary/20" />
              </div>
              <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-surface-container-highest border border-outline-variant/60">
                <span className="text-[10px] font-mono font-semibold tracking-[0.1em] text-on-surface-variant/70 uppercase">
                  {isEnhanced ? "debugging-prompt-enhanced.md" : "debugging-prompt.md"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isGenerating ? (
                  <span className="flex items-center gap-1.5 text-[10px] font-mono text-primary animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                    generating
                  </span>
                ) : isEnhancing ? (
                  <span className="flex items-center gap-1.5 text-[10px] font-mono text-secondary animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
                    enhancing
                  </span>
                ) : isEnhanced ? (
                  <span className="flex items-center gap-1.5 text-[10px] font-mono text-secondary">
                    <Sparkles className="w-3 h-3" />
                    ai-enhanced
                  </span>
                ) : isGenerated ? (
                  <span className="flex items-center gap-1.5 text-[10px] font-mono text-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                    ready
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-on-surface-variant/40">
                    live preview
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className={cn(
              "flex-1 p-5 overflow-auto transition-opacity duration-300",
              (isGenerating || isEnhancing) && "opacity-40"
            )}>
              {prompt ? (
                <div className={cn((isGenerated || isEnhanced) && "animate-fade-in")}>
                  <MarkdownVisualizer content={prompt} />
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-4 select-none py-16">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high border border-outline-variant flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-on-surface-variant/30" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-medium text-on-surface-variant/50">No output yet</p>
                    <p className="text-xs text-on-surface-variant/30 max-w-[220px] leading-relaxed">
                      Complete the wizard on the left to see your debugging prompt here.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

/* ── client shell ───────────────────────────────────────────────────── */

interface Toast {
  msg: string
  variant: "success" | "error"
}

export function CodeAnalysisClient() {
  const [step, setStep] = useState<WizardStep>(1)
  const [form, setForm] = useState<CodeAnalysisFormData>(DEFAULT_FORM)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [enhancedPrompt, setEnhancedPrompt] = useState<string | null>(null)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)

  const compiledPrompt = useMemo(() => compileAnalysisPrompt(form), [form])
  const activePrompt = enhancedPrompt ?? compiledPrompt

  const showToast = useCallback((msg: string, variant: "success" | "error" = "success") => {
    setToast({ msg, variant })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const updateForm = useCallback((delta: Partial<CodeAnalysisFormData>) => {
    setForm((prev) => ({ ...prev, ...delta }))
    setIsGenerated(false)
    setEnhancedPrompt(null)
  }, [])

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true)
    await new Promise<void>((r) => setTimeout(r, 900))
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
    a.download = enhancedPrompt ? "debugging-prompt-enhanced.md" : "debugging-prompt.md"
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

  const handleRestoreHistory = useCallback((prompt: string) => {
    setEnhancedPrompt(prompt)
    setIsGenerated(true)
    showToast("Prompt restored from history!")
  }, [showToast])

  return (
    <div className="bg-background text-on-surface h-screen flex overflow-hidden">
      <Sidebar />

      <main className="md:ml-[280px] flex-1 flex flex-col h-full bg-surface-dim overflow-hidden">

        {/* Mobile header */}
        <header className="flex md:hidden justify-between items-center px-6 h-16 bg-surface border-b border-outline-variant shrink-0">
          <span className="text-xl font-bold text-primary tracking-tight">PromptCraft AI</span>
        </header>

        <div className="flex-1 flex flex-col xl:flex-row overflow-hidden">

          {/* Wizard panel */}
          <section className="flex-1 overflow-y-auto border-b xl:border-b-0 xl:border-r border-outline-variant bg-surface flex flex-col">
            <div className="p-6 lg:p-8 max-w-2xl mx-auto w-full flex-1 flex flex-col">

              {/* Page header */}
              <div className="mb-7">
                <h2 className="text-[22px] font-bold tracking-tight text-on-surface mb-1">
                  Code Analysis Prompt Wizard
                </h2>
                <p className="text-sm text-on-surface-variant">
                  Transform your error into a high-quality debugging prompt for any AI tool.
                </p>
              </div>

              {/* Stepper */}
              <ProgressStepper currentStep={step} steps={ANALYSIS_STEPS} />

              {/* Form content */}
              <div className="mt-9 flex-1 flex flex-col gap-4">
                {step === 1 && <Step1 form={form} set={updateForm} />}
                {step === 2 && <Step2 form={form} set={updateForm} />}
                {step === 3 && <Step3 form={form} set={updateForm} />}

                {/* Navigation row */}
                <div className="flex items-center gap-2.5 mt-auto pt-5 border-t border-outline-variant/50">
                  {step > 1 ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStep((s) => (s - 1) as WizardStep)}
                      className="shrink-0 w-24"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      Back
                    </Button>
                  ) : (
                    <div className="w-24 shrink-0" />
                  )}

                  <div className="flex-1" />

                  {step < 3 ? (
                    <Button
                      size="sm"
                      onClick={() => setStep((s) => (s + 1) as WizardStep)}
                      disabled={step === 1 && !form.errorMessage.trim()}
                      className="shrink-0 w-28"
                    >
                      Continue
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      onClick={handleGenerate}
                      disabled={isGenerating || !form.errorMessage.trim()}
                      className="flex-1"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating…
                        </>
                      ) : (
                        <>
                          Generate Prompt
                          <Sparkles className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

            </div>
          </section>

          {/* Divider */}
          <div className="hidden xl:block w-px bg-outline-variant hover:bg-secondary-container transition-colors cursor-col-resize" />

          {/* Preview panel */}
          <PreviewPanel
            prompt={activePrompt}
            isGenerated={isGenerated}
            isGenerating={isGenerating}
            isEnhanced={enhancedPrompt !== null}
            isEnhancing={isEnhancing}
            onCopy={handleCopy}
            onDownload={handleDownload}
            onEnhance={handleEnhance}
            onRestoreHistory={handleRestoreHistory}
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
