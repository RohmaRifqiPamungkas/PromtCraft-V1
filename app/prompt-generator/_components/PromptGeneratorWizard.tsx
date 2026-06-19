"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { ProgressStepper } from "@/components/shared/ProgressStepper"
import {
  ChevronRight, ChevronLeft, Sparkles, Loader2,
  Lightbulb, Braces, SlidersHorizontal,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { WizardStep } from "@/types/prompt"
import type { PromptGeneratorFormData } from "@/lib/prompt-generator-compiler"

/* ── data ───────────────────────────────────────────────────────────── */

const TASK_CATEGORIES = [
  "Backend Architecture",
  "Feature Request",
  "Bug Fix",
  "UI / Layout",
  "Code Refactoring",
  "Code Review",
  "Performance Optimization",
  "Documentation",
  "Other",
]

const OUTPUT_FORMATS = [
  "Code only",
  "Code + explanation",
  "Step-by-step guide",
  "Full implementation walkthrough",
  "Pros & cons analysis",
]

const TONES = [
  "Direct & concise",
  "Detailed & thorough",
  "Beginner-friendly",
  "Senior engineer level",
]

const GENERATOR_STEPS: { n: WizardStep; label: string }[] = [
  { n: 1, label: "Describe Task" },
  { n: 2, label: "Add Context" },
  { n: 3, label: "Preferences" },
]

/* ── step meta ──────────────────────────────────────────────────────── */

const STEP_META: Record<
  WizardStep,
  { icon: React.ElementType; title: string; description: string }
> = {
  1: { icon: Lightbulb,         title: "Describe Your Task",    description: "Tell us what you want to accomplish" },
  2: { icon: Braces,            title: "Add Technical Context", description: "Share relevant code, layout, or environment details" },
  3: { icon: SlidersHorizontal, title: "Output Preferences",    description: "Choose the format and tone for your generated prompt" },
}

/* ── shared step header ─────────────────────────────────────────────── */

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

/* ── steps ──────────────────────────────────────────────────────────── */

function Step1({
  form, set,
}: { form: PromptGeneratorFormData; set: (d: Partial<PromptGeneratorFormData>) => void }) {
  return (
    <div className="space-y-5">
      <StepHeader step={1} />

      <div className="space-y-1.5">
        <Label>Task Category</Label>
        <Select value={form.taskCategory} onValueChange={(v) => set({ taskCategory: v })}>
          <SelectTrigger>
            <SelectValue placeholder="What kind of task is this?" />
          </SelectTrigger>
          <SelectContent>
            {TASK_CATEGORIES.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-on-surface-variant pl-0.5">
          Selecting a category tailors the output template and success criteria.
        </p>
      </div>

      {form.taskCategory === "Backend Architecture" && (
        <div className="rounded-xl border border-secondary/20 bg-secondary/5 px-4 py-3 space-y-1">
          <p className="text-[10px] font-mono font-semibold uppercase tracking-widest text-secondary/70">
            Full Architecture Template
          </p>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Generates a comprehensive HLD/ADR template with database, API, and deployment sections.
            Your input is pre-filled; remaining sections are scaffolded as guided placeholders.
          </p>
        </div>
      )}

      <div className="space-y-1.5">
        <Label>What do you want to do?</Label>
        <Textarea
          value={form.taskDescription}
          onChange={(e) => set({ taskDescription: e.target.value })}
          placeholder={"Describe your task clearly and specifically.\n\nExamples:\n• I want to add an authentication feature using JWT and refresh tokens\n• I want to fix this layout — the sidebar overlaps the main content on mobile\n• I want to refactor this fetch logic to use React Query\n• I want to add rate limiting to my Express API routes"}
          rows={9}
          className="min-h-[210px] leading-relaxed"
        />
        <p className="text-xs text-on-surface-variant pl-0.5">
          Tip: the more specific you are, the more actionable the generated prompt will be.
        </p>
      </div>
    </div>
  )
}

function Step2({
  form, set,
}: { form: PromptGeneratorFormData; set: (d: Partial<PromptGeneratorFormData>) => void }) {
  return (
    <div className="space-y-5">
      <StepHeader step={2} />

      <div className="space-y-1.5">
        <Label>Language / Framework</Label>
        <input
          type="text"
          value={form.language}
          onChange={(e) => set({ language: e.target.value })}
          placeholder="e.g. Next.js, React, Express, Django, Go / Gin…"
          className={cn(
            "flex h-11 w-full items-center rounded-lg border border-outline-variant bg-surface-container",
            "px-4 text-sm text-on-surface placeholder:text-on-surface-variant/40",
            "focus:outline-none focus:ring-1 focus:ring-secondary-container focus:border-secondary-container",
            "transition-colors"
          )}
        />
        <p className="text-xs text-on-surface-variant pl-0.5">
          Optional — helps scope the output to your stack.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label>Relevant Code, Layout, or Error</Label>
        <Textarea
          value={form.codeContext}
          onChange={(e) => set({ codeContext: e.target.value })}
          placeholder={"Paste any code, CSS, component structure, or error message that is relevant to your task.\n\nLeave blank if you only have a text description above."}
          rows={10}
          className="min-h-[240px] font-mono text-[12px] leading-relaxed"
          spellCheck={false}
        />
        <p className="text-xs text-on-surface-variant pl-0.5">
          Optional — will be wrapped in a code block in the generated prompt.
        </p>
      </div>
    </div>
  )
}

function Step3({
  form, set,
}: { form: PromptGeneratorFormData; set: (d: Partial<PromptGeneratorFormData>) => void }) {
  const isLean = form.promptMode === "lean"

  return (
    <div className="space-y-5">
      <StepHeader step={3} />

      {/* Prompt Mode toggle */}
      <div className="space-y-2">
        <Label>Prompt Mode</Label>
        <div className="grid grid-cols-2 rounded-lg border border-outline-variant overflow-hidden">
          <button
            type="button"
            onClick={() => set({ promptMode: "comprehensive" })}
            className={cn(
              "py-3 px-3 text-left transition-colors border-r border-outline-variant",
              !isLean ? "bg-primary/8 text-primary" : "text-on-surface-variant hover:bg-surface-container-high"
            )}
          >
            <p className={cn("text-xs font-semibold", !isLean ? "text-primary" : "text-on-surface")}>
              Comprehensive
            </p>
            <p className="text-[10px] font-mono text-on-surface-variant/60 mt-0.5 leading-relaxed">
              Full structure · guided placeholders · ~600–800 tokens
            </p>
          </button>
          <button
            type="button"
            onClick={() => set({ promptMode: "lean" })}
            className={cn(
              "py-3 px-3 text-left transition-colors",
              isLean ? "bg-primary/8 text-primary" : "text-on-surface-variant hover:bg-surface-container-high"
            )}
          >
            <p className={cn("text-xs font-semibold", isLean ? "text-primary" : "text-on-surface")}>
              Token-Efficient
            </p>
            <p className="text-[10px] font-mono text-on-surface-variant/60 mt-0.5 leading-relaxed">
              Lean & dense · no placeholders · ~80–200 tokens
            </p>
          </button>
        </div>
        {isLean && (
          <p className="text-[11px] text-on-surface-variant/60 pl-0.5 leading-relaxed">
            Empty fields are omitted — only your actual input is included. Best for direct API usage or cost-sensitive workflows.
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>Output Format</Label>
        <Select value={form.outputFormat} onValueChange={(v) => set({ outputFormat: v })}>
          <SelectTrigger>
            <SelectValue placeholder="How should the AI respond?" />
          </SelectTrigger>
          <SelectContent>
            {OUTPUT_FORMATS.map((f) => (
              <SelectItem key={f} value={f}>{f}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Response Tone</Label>
        <Select value={form.tone} onValueChange={(v) => set({ tone: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Pick a communication style…" />
          </SelectTrigger>
          <SelectContent>
            {TONES.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Additional Notes</Label>
        <Textarea
          value={form.additionalNotes}
          onChange={(e) => set({ additionalNotes: e.target.value })}
          placeholder={"Anything else the AI should know:\n\n• Don't change the existing API interface\n• Must work without additional npm packages\n• The codebase uses Tailwind CSS v4 and design tokens\n• This runs on Node 22 in a serverless environment"}
          rows={5}
          className="min-h-[130px] leading-relaxed"
        />
        <p className="text-xs text-on-surface-variant pl-0.5">
          Optional — constraints, environment details, or things to avoid.
        </p>
      </div>

      <div className="rounded-xl border border-primary/15 bg-primary/5 p-4 space-y-1.5">
        <p className="text-[10px] font-mono font-semibold uppercase tracking-widest text-primary/70">
          What happens next
        </p>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Clicking <span className="font-semibold text-on-surface">Generate Prompt</span> compiles a
          structured markdown prompt ready to paste into ChatGPT, Claude, Gemini, Cursor, or Copilot.
          Use <span className="font-semibold text-on-surface">Enhance</span> afterwards to let Gemini
          improve the phrasing and specificity.
        </p>
      </div>
    </div>
  )
}

/* ── wizard shell ───────────────────────────────────────────────────── */

export interface PromptGeneratorWizardProps {
  currentStep: WizardStep
  formData: PromptGeneratorFormData
  isGenerating: boolean
  onStepChange: (s: WizardStep) => void
  onFormChange: (d: Partial<PromptGeneratorFormData>) => void
  onGenerate: () => void
}

export function PromptGeneratorWizard({
  currentStep, formData, isGenerating,
  onStepChange, onFormChange, onGenerate,
}: PromptGeneratorWizardProps) {
  const canContinue = currentStep === 1 ? formData.taskDescription.trim().length > 0 : true

  return (
    <section className="flex-1 overflow-y-auto border-b xl:border-b-0 xl:border-r border-outline-variant bg-surface flex flex-col">
      <div className="p-6 lg:p-8 max-w-2xl mx-auto w-full flex-1 flex flex-col">

        <div className="mb-7">
          <h2 className="text-[22px] font-bold tracking-tight text-on-surface mb-1">
            Prompt Generator
          </h2>
          <p className="text-sm text-on-surface-variant">
            Describe what you need and get a structured prompt ready to paste into any AI tool.
          </p>
        </div>

        <ProgressStepper currentStep={currentStep} steps={GENERATOR_STEPS} />

        <div className="mt-9 flex-1 flex flex-col gap-4">
          {currentStep === 1 && <Step1 form={formData} set={onFormChange} />}
          {currentStep === 2 && <Step2 form={formData} set={onFormChange} />}
          {currentStep === 3 && <Step3 form={formData} set={onFormChange} />}

          <div className="flex items-center gap-2.5 mt-auto pt-5 border-t border-outline-variant/50">
            {currentStep > 1 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStepChange((currentStep - 1) as WizardStep)}
                className="shrink-0 w-24"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Back
              </Button>
            ) : (
              <div className="w-24 shrink-0" />
            )}

            <div className="flex-1" />

            {currentStep < 3 ? (
              <Button
                size="sm"
                onClick={() => onStepChange((currentStep + 1) as WizardStep)}
                disabled={!canContinue}
                className="shrink-0 w-28"
              >
                Continue
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={onGenerate}
                disabled={isGenerating || !formData.taskDescription.trim()}
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
  )
}
