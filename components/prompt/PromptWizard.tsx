"use client"

import { Button }   from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label }    from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { ProgressStepper } from "./ProgressStepper"
import {
  ChevronRight, ChevronLeft, Sparkles, Loader2,
  Server, Database, Layers2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { WizardFormData, WizardStep } from "@/types/prompt"

/* ── data ──────────────────────────────────────────────────────────── */

const PROJECT_TYPES = [
  "SaaS Application",
  "E-commerce Platform",
  "Social Network",
  "IoT Backend",
  "Microservices Architecture",
  "Internal Admin Tool",
]

const FRAMEWORKS = [
  { value: "node-express",   label: "Node.js / Express (TypeScript)" },
  { value: "go-gin",         label: "Go / Gin"                        },
  { value: "python-fastapi", label: "Python / FastAPI"                },
  { value: "spring-boot",    label: "Spring Boot (Java)"              },
  { value: "dotnet",         label: ".NET Core (C#)"                  },
]

const DATABASES = [
  { value: "postgresql", label: "PostgreSQL" },
  { value: "mysql",      label: "MySQL"      },
  { value: "mongodb",    label: "MongoDB"    },
  { value: "sqlite",     label: "SQLite"     },
]

const API_STYLES = [
  { value: "rest",    label: "RESTful API" },
  { value: "graphql", label: "GraphQL"     },
  { value: "grpc",    label: "gRPC"        },
]

type ConstraintKey = keyof Pick<
  WizardFormData,
  | "includeSqlDdl" | "repositoryPattern"
  | "unitTestBoilerplate" | "solidPrinciples"
  | "typescriptStrict"    | "includeIndexes"
>

const OUTPUT_CONSTRAINTS: { key: ConstraintKey; label: string; desc: string }[] = [
  { key: "includeSqlDdl",     label: "Include SQL DDL",      desc: "Generate CREATE TABLE statements" },
  { key: "repositoryPattern", label: "Repository Pattern",   desc: "Abstract the data-access layer"   },
]

const BEHAVIOR_CONSTRAINTS: { key: ConstraintKey; label: string; desc: string }[] = [
  { key: "unitTestBoilerplate", label: "Unit Test Boilerplate",  desc: "Jest / Vitest test scaffolding"    },
  { key: "solidPrinciples",     label: "SOLID Principles",       desc: "Follow software design guidelines"  },
  { key: "typescriptStrict",    label: "TypeScript Strict Mode", desc: "Enable strict type-checking"        },
  { key: "includeIndexes",      label: "Performance Indexes",    desc: "Optimise query performance"         },
]

/* ── step meta ──────────────────────────────────────────────────────── */

const STEP_META: Record<
  WizardStep,
  { icon: React.ElementType; title: string; description: string }
> = {
  1: { icon: Server,   title: "Core Entities",         description: "Define your data models and relationships"    },
  2: { icon: Database, title: "Technology Preferences", description: "Choose your framework, database and API style" },
  3: { icon: Layers2,  title: "Constraints & Options",  description: "Select what to include in the generated prompt" },
}

/* ── checkbox group ─────────────────────────────────────────────────── */

function ConstraintGroup({
  title, items, formData, onChange,
}: {
  title:    string
  items:    { key: ConstraintKey; label: string; desc: string }[]
  formData: WizardFormData
  onChange: (d: Partial<WizardFormData>) => void
}) {
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] font-mono font-semibold tracking-[0.12em] uppercase text-on-surface-variant/60 px-3 mb-2">
        {title}
      </p>
      <div className="rounded-lg border border-outline-variant bg-surface-container overflow-hidden">
        {items.map(({ key, label, desc }, i) => (
          <label
            key={key}
            className={cn(
              "flex items-start gap-3 cursor-pointer group px-3 py-3 hover:bg-surface-container-high transition-colors",
              i > 0 && "border-t border-outline-variant/50"
            )}
          >
            <Checkbox
              checked={formData[key] as boolean}
              onCheckedChange={(v) => onChange({ [key]: v === true })}
              className="mt-0.5 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">
                {label}
              </p>
              <p className="text-xs text-on-surface-variant mt-0.5">{desc}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
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
  formData, onChange,
}: { formData: WizardFormData; onChange: (d: Partial<WizardFormData>) => void }) {
  return (
    <div className="space-y-5">
      <StepHeader step={1} />

      <div className="space-y-1.5">
        <Label>Project Type</Label>
        <Select value={formData.projectType} onValueChange={(v) => onChange({ projectType: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Select project type" />
          </SelectTrigger>
          <SelectContent>
            {PROJECT_TYPES.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Describe entities &amp; relationships</Label>
        <Textarea
          value={formData.entities}
          onChange={(e) => onChange({ entities: e.target.value })}
          placeholder="e.g., Users, Organizations, Subscriptions — multi-tenant SaaS where Users belong to Organizations and Subscriptions are linked to Organizations…"
          rows={7}
          className="min-h-[170px] leading-relaxed"
        />
        <p className="text-xs text-on-surface-variant pl-0.5">
          Tip: comma-separate entity names, or describe relationships in prose.
        </p>
      </div>
    </div>
  )
}

function Step2({
  formData, onChange,
}: { formData: WizardFormData; onChange: (d: Partial<WizardFormData>) => void }) {
  return (
    <div className="space-y-5">
      <StepHeader step={2} />

      <div className="space-y-1.5">
        <Label>Target Framework / Language</Label>
        <Select value={formData.framework} onValueChange={(v) => onChange({ framework: v })}>
          <SelectTrigger><SelectValue placeholder="Select framework" /></SelectTrigger>
          <SelectContent>
            {FRAMEWORKS.map((f) => (
              <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Database</Label>
        <Select value={formData.database} onValueChange={(v) => onChange({ database: v })}>
          <SelectTrigger><SelectValue placeholder="Select database" /></SelectTrigger>
          <SelectContent>
            {DATABASES.map((d) => (
              <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>API Style</Label>
        <Select value={formData.apiStyle} onValueChange={(v) => onChange({ apiStyle: v })}>
          <SelectTrigger><SelectValue placeholder="Select API style" /></SelectTrigger>
          <SelectContent>
            {API_STYLES.map((a) => (
              <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function Step3({
  formData, onChange,
}: { formData: WizardFormData; onChange: (d: Partial<WizardFormData>) => void }) {
  return (
    <div className="space-y-4">
      <StepHeader step={3} />
      <ConstraintGroup
        title="Output"
        items={OUTPUT_CONSTRAINTS}
        formData={formData}
        onChange={onChange}
      />
      <ConstraintGroup
        title="Behaviors"
        items={BEHAVIOR_CONSTRAINTS}
        formData={formData}
        onChange={onChange}
      />
    </div>
  )
}

/* ── wizard shell ───────────────────────────────────────────────────── */

export interface PromptWizardProps {
  currentStep:  WizardStep
  formData:     WizardFormData
  isGenerating: boolean
  onStepChange: (s: WizardStep) => void
  onFormChange: (d: Partial<WizardFormData>) => void
  onGenerate:   () => void
}

export function PromptWizard({
  currentStep, formData, isGenerating,
  onStepChange, onFormChange, onGenerate,
}: PromptWizardProps) {
  return (
    <section className="flex-1 overflow-y-auto border-b xl:border-b-0 xl:border-r border-outline-variant bg-surface flex flex-col">
      <div className="p-6 lg:p-8 max-w-2xl mx-auto w-full flex-1 flex flex-col">

        {/* Page header */}
        <div className="mb-7">
          <h2 className="text-[22px] font-bold tracking-tight text-on-surface mb-1">
            Database &amp; API Design Prompt Wizard
          </h2>
          <p className="text-sm text-on-surface-variant">
            Architect your backend structure with precision.
          </p>
        </div>

        {/* Stepper */}
        <ProgressStepper currentStep={currentStep} />

        {/* Form content */}
        <div className="mt-9 flex-1 flex flex-col gap-4">
          {currentStep === 1 && <Step1 formData={formData} onChange={onFormChange} />}
          {currentStep === 2 && <Step2 formData={formData} onChange={onFormChange} />}
          {currentStep === 3 && <Step3 formData={formData} onChange={onFormChange} />}

          {/* Navigation row */}
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
              /* ghost placeholder keeps Generate button on the right when on step 1 */
              <div className="w-24 shrink-0" />
            )}

            <div className="flex-1" />

            {currentStep < 3 ? (
              <Button
                size="sm"
                onClick={() => onStepChange((currentStep + 1) as WizardStep)}
                className="shrink-0 w-28"
              >
                Continue
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={onGenerate}
                disabled={isGenerating}
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    Generate Prompt Structure
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
