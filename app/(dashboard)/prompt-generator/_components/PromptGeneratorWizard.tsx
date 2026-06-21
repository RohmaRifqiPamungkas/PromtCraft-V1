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
  Lightbulb, Braces, SlidersHorizontal, Bug, Code2, Settings,
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
  "Debug & Error Fix",
  "Other",
]

const DEBUG_CATEGORY = "Debug & Error Fix"

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

const DEBUG_STEPS: { n: WizardStep; label: string }[] = [
  { n: 1, label: "Describe Error" },
  { n: 2, label: "Paste Code" },
  { n: 3, label: "Add Context" },
]

/* ── step meta ──────────────────────────────────────────────────────── */

type StepMeta = { icon: React.ElementType; title: string; description: string }

const STEP_META: Record<WizardStep, StepMeta> = {
  1: { icon: Lightbulb,         title: "Describe Your Task",    description: "Tell us what you want to accomplish" },
  2: { icon: Braces,            title: "Add Technical Context", description: "Share relevant code, layout, or environment details" },
  3: { icon: SlidersHorizontal, title: "Output Preferences",    description: "Choose the format and tone for your generated prompt" },
}

const DEBUG_STEP_META: Record<WizardStep, StepMeta> = {
  1: { icon: Bug,      title: "Describe the Error",    description: "Paste the error message or full stack trace" },
  2: { icon: Code2,    title: "Paste the Code",        description: "Share the code snippet that triggers the issue" },
  3: { icon: Settings, title: "Add Technical Context", description: "Specify the framework and any extra details" },
}

/* ── shared step header ─────────────────────────────────────────────── */

function StepHeader({ step, meta }: { step: WizardStep; meta: StepMeta }) {
  const { icon: Icon, title, description } = meta
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
      <StepHeader step={1} meta={STEP_META[1]} />

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
      <StepHeader step={2} meta={STEP_META[2]} />

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
      <StepHeader step={3} meta={STEP_META[3]} />

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

/* ── debug steps ────────────────────────────────────────────────────── */

function DebugStep1({
  form, set,
}: { form: PromptGeneratorFormData; set: (d: Partial<PromptGeneratorFormData>) => void }) {
  return (
    <div className="space-y-5">
      <StepHeader step={1} meta={DEBUG_STEP_META[1]} />

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

function DebugStep2({
  form, set,
}: { form: PromptGeneratorFormData; set: (d: Partial<PromptGeneratorFormData>) => void }) {
  return (
    <div className="space-y-5">
      <StepHeader step={2} meta={DEBUG_STEP_META[2]} />

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
          value={form.codeContext}
          onChange={(e) => set({ codeContext: e.target.value })}
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

function DebugStep3({
  form, set,
}: { form: PromptGeneratorFormData; set: (d: Partial<PromptGeneratorFormData>) => void }) {
  return (
    <div className="space-y-5">
      <StepHeader step={3} meta={DEBUG_STEP_META[3]} />

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
          value={form.additionalNotes}
          onChange={(e) => set({ additionalNotes: e.target.value })}
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
  const isDebug = formData.taskCategory === DEBUG_CATEGORY
  const steps   = isDebug ? DEBUG_STEPS : GENERATOR_STEPS

  const canContinue = currentStep === 1
    ? (isDebug ? formData.errorMessage.trim().length > 0 : formData.taskDescription.trim().length > 0)
    : true

  const generateDisabled = isGenerating || (
    isDebug ? !formData.errorMessage.trim() : !formData.taskDescription.trim()
  )

  return (
    <section className="flex-1 overflow-y-auto border-b xl:border-b-0 xl:border-r border-outline-variant bg-surface flex flex-col">
      <div className="p-6 lg:p-8 max-w-2xl mx-auto w-full flex-1 flex flex-col">

        <div className="mb-7">
          <h2 className="text-[22px] font-bold tracking-tight text-on-surface mb-1">
            {isDebug ? "Debug & Error Fix" : "Prompt Generator"}
          </h2>
          <p className="text-sm text-on-surface-variant">
            {isDebug
              ? "Transform your error into a high-quality debugging prompt for any AI tool."
              : "Describe what you need and get a structured prompt ready to paste into any AI tool."}
          </p>
        </div>

        <ProgressStepper currentStep={currentStep} steps={steps} />

        <div className="mt-9 flex-1 flex flex-col gap-4">
          {isDebug ? (
            <>
              {currentStep === 1 && <DebugStep1 form={formData} set={onFormChange} />}
              {currentStep === 2 && <DebugStep2 form={formData} set={onFormChange} />}
              {currentStep === 3 && <DebugStep3 form={formData} set={onFormChange} />}
            </>
          ) : (
            <>
              {currentStep === 1 && <Step1 form={formData} set={onFormChange} />}
              {currentStep === 2 && <Step2 form={formData} set={onFormChange} />}
              {currentStep === 3 && <Step3 form={formData} set={onFormChange} />}
            </>
          )}

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
                disabled={generateDisabled}
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
